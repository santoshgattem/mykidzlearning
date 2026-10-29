import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { esc, mailConfigured, sendMail } from "@/lib/mail";
import { MIDWEEK_MIN, WEEKLY_TARGET } from "@/lib/learning";
import { weekKey, weekStart } from "@/lib/week";

// Weekly habit emails: 5 tests passed at 100% from Monday to Sunday (India time).
//   "midweek"  Wednesday 6 pm: only students with fewer than MIDWEEK_MIN passed so far.
//   "final"    Saturday 6 pm:  every student who has not reached WEEKLY_TARGET.
// Each kind is sent at most once per student per week.

// Links in emails must always be the public address, never localhost, even if run from a dev machine.
const configured = process.env.NEXT_PUBLIC_SITE_URL ?? "";
const SITE = (configured.startsWith("https://") ? configured : "https://www.mykidzlearning.com").replace(/\/+$/, "");
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type ReminderKind = "midweek" | "final";

type Person = { full_name: string; email: string; disabled: boolean };
const one = <T,>(v: T | T[] | null | undefined): T | undefined => (Array.isArray(v) ? v[0] : (v ?? undefined));

export function messages(kind: ReminderKind, kid: string, parent: string, done: number) {
  const left = WEEKLY_TARGET - done;
  const tests = (n: number) => (n === 1 ? "test" : "tests");
  if (kind === "midweek") {
    return {
      kidSubject: `${kid}, ${left} ${tests(left)} to go this week. You can do it!`,
      kidText: `Hi ${kid},\n\nIt's midweek and you have passed ${done} of ${WEEKLY_TARGET} tests so far. There are 4 days left, so just ${left} more ${tests(left)} by Sunday night gets you to your goal. Pick any chapter you like, even a short one.\n\nOpen mykidzlearning: ${SITE}/student\n`,
      kidHtml: `<p>Hi ${esc(kid)},</p><p>It's midweek and you have passed <b>${done} of ${WEEKLY_TARGET}</b> tests so far. There are 4 days left, so just <b>${left} more ${tests(left)}</b> by Sunday night gets you to your goal. Pick any chapter you like, even a short one.</p><p><a href="${SITE}/student">Open mykidzlearning</a></p>`,
      parentSubject: `${kid}'s week so far: ${done} of ${WEEKLY_TARGET} tests passed`,
      parentText: `Hi ${parent},\n\nMidweek check-in: ${kid} has passed ${done} of ${WEEKLY_TARGET} tests this week, with 4 days to go. A friendly word today can help them reach the goal.\n\nSee progress: ${SITE}/parent\n`,
      parentHtml: `<p>Hi ${esc(parent)},</p><p>Midweek check-in: ${esc(kid)} has passed <b>${done} of ${WEEKLY_TARGET}</b> tests this week, with 4 days to go. A friendly word today can help them reach the goal.</p><p><a href="${SITE}/parent">See progress</a></p>`,
    };
  }
  return {
    kidSubject: `${kid}, ${left} more ${tests(left)} to hit this week's goal`,
    kidText: `Hi ${kid},\n\nThis week you have passed ${done} of ${WEEKLY_TARGET} tests. Pick any chapter you like and take ${left} more ${tests(left)} before Sunday night. Small steps every week add up.\n\nOpen mykidzlearning: ${SITE}/student\n`,
    kidHtml: `<p>Hi ${esc(kid)},</p><p>This week you have passed <b>${done} of ${WEEKLY_TARGET}</b> tests. Pick any chapter you like and take <b>${left} more</b> before Sunday night. Small steps every week add up.</p><p><a href="${SITE}/student">Open mykidzlearning</a></p>`,
    parentSubject: `${kid}'s week: ${done} of ${WEEKLY_TARGET} tests passed`,
    parentText: `Hi ${parent},\n\n${kid} has passed ${done} of ${WEEKLY_TARGET} tests this week. A little encouragement before Sunday night can help.\n\nSee progress: ${SITE}/parent\n`,
    parentHtml: `<p>Hi ${esc(parent)},</p><p>${esc(kid)} has passed <b>${done} of ${WEEKLY_TARGET}</b> tests this week. A little encouragement before Sunday night can help.</p><p><a href="${SITE}/parent">See progress</a></p>`,
  };
}

export async function runReminders(kind: ReminderKind, only?: string | null) {
  if (!mailConfigured()) return { ok: false as const, reason: "mail_not_configured" };
  const db = createAdminClient();
  const start = weekStart();
  const key = weekKey();
  const threshold = kind === "midweek" ? MIDWEEK_MIN : WEEKLY_TARGET;

  // Active students who have finished set-up, with their parent's details.
  let q = db
    .from("students")
    .select("id, grade, grp, parent_id, profile:profiles!students_id_fkey(full_name, email, disabled), parent:profiles!students_parent_id_fkey(full_name, email, disabled)")
    .not("grade", "is", null)
    .not("grp", "is", null);
  if (only) q = q.eq("id", only);
  const { data: kids } = await q;

  let sent = 0, skipped = 0;
  for (const k of kids ?? []) {
    const kid = one(k.profile) as Person | undefined;
    const parent = one(k.parent) as Person | undefined;
    if (!kid || kid.disabled || parent?.disabled) { skipped++; continue; }

    const { count } = await db
      .from("test_attempts").select("id", { count: "exact", head: true })
      .eq("student_id", k.id).gte("created_at", start.toISOString());
    const { count: setCount } = await db
      .from("set_results").select("student_id", { count: "exact", head: true })
      .eq("student_id", k.id).gte("completed_at", start.toISOString());
    const done = (count ?? 0) + (setCount ?? 0);
    if (done >= threshold) { skipped++; continue; }

    // Claim this week and kind first, so two overlapping runs cannot both send.
    const { error: claim } = await db.from("weekly_reminders").insert({ student_id: k.id, week_start: key, kind, done_count: done });
    if (claim) { skipped++; continue; }

    const first = kid.full_name.split(" ")[0];
    const m = messages(kind, first, parent?.full_name ?? "", done);
    const kidOk = await sendMail(kid.email, m.kidSubject, m.kidText, m.kidHtml);
    let parentOk = true;
    if (parent && !parent.disabled) {
      const pm = messages(kind, kid.full_name, parent.full_name, done);
      parentOk = await sendMail(parent.email, pm.parentSubject, pm.parentText, pm.parentHtml);
    }
    if (!kidOk && !parentOk) await db.from("weekly_reminders").delete().eq("student_id", k.id).eq("week_start", key).eq("kind", kind); // allow a retry
    else sent++;
    await sleep(600); // stay under the mail provider's send rate
  }
  return { ok: true as const, kind, week: key, sent, skipped };
}
