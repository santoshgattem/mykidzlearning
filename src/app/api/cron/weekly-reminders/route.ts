import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { esc, mailConfigured, sendMail } from "@/lib/mail";
import { WEEKLY_TARGET } from "@/lib/learning";
import { weekKey, weekStart } from "@/lib/week";

// Called by Vercel Cron on Saturday evening (see vercel.json). Vercel sends
// "Authorization: Bearer <CRON_SECRET>"; anything else is refused.
export const maxDuration = 60;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mykidzlearning.com";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("Not found", { status: 404 });
  }
  if (!mailConfigured()) return NextResponse.json({ ok: false, reason: "mail_not_configured" });

  const db = createAdminClient();
  const start = weekStart();
  const key = weekKey();

  // Active students who have finished set-up, with their parent's details.
  const { data: kids } = await db
    .from("students")
    .select("id, grade, grp, parent_id, profile:profiles!students_id_fkey(full_name, email, disabled), parent:profiles!students_parent_id_fkey(full_name, email, disabled)")
    .not("grade", "is", null)
    .not("grp", "is", null);

  let sent = 0, skipped = 0;
  for (const k of kids ?? []) {
    const kid = Array.isArray(k.profile) ? k.profile[0] : k.profile;
    const parent = Array.isArray(k.parent) ? k.parent[0] : k.parent;
    if (!kid || kid.disabled || parent?.disabled) { skipped++; continue; }

    const { count } = await db
      .from("test_attempts")
      .select("id", { count: "exact", head: true })
      .eq("student_id", k.id)
      .gte("created_at", start.toISOString());
    const done = count ?? 0;
    if (done >= WEEKLY_TARGET) { skipped++; continue; }

    // Claim this week first, so two overlapping runs cannot both send.
    const { error: claim } = await db.from("weekly_reminders").insert({ student_id: k.id, week_start: key, done_count: done });
    if (claim) { skipped++; continue; }

    const left = WEEKLY_TARGET - done;
    const first = kid.full_name.split(" ")[0];
    const kidOk = await sendMail(
      kid.email,
      `${first}, ${left} more ${left === 1 ? "test" : "tests"} to hit this week's goal`,
      `Hi ${first},\n\nThis week you have passed ${done} of ${WEEKLY_TARGET} tests. Pick any chapter you like and take ${left} more ${left === 1 ? "test" : "tests"} before Sunday night. Small steps every week add up.\n\nOpen mykidzlearning: ${SITE}/student\n`,
      `<p>Hi ${esc(first)},</p><p>This week you have passed <b>${done} of ${WEEKLY_TARGET}</b> tests. Pick any chapter you like and take <b>${left} more</b> before Sunday night. Small steps every week add up.</p><p><a href="${SITE}/student">Open mykidzlearning</a></p>`,
    );
    let parentOk = true;
    if (parent && !parent.disabled) {
      parentOk = await sendMail(
        parent.email,
        `${first}'s week: ${done} of ${WEEKLY_TARGET} tests passed`,
        `Hi ${parent.full_name},\n\n${kid.full_name} has passed ${done} of ${WEEKLY_TARGET} tests this week. A little encouragement before Sunday night can help.\n\nSee progress: ${SITE}/parent\n`,
        `<p>Hi ${esc(parent.full_name)},</p><p>${esc(kid.full_name)} has passed <b>${done} of ${WEEKLY_TARGET}</b> tests this week. A little encouragement before Sunday night can help.</p><p><a href="${SITE}/parent">See progress</a></p>`,
      );
    }
    if (!kidOk && !parentOk) await db.from("weekly_reminders").delete().eq("student_id", k.id).eq("week_start", key); // allow a retry
    else sent++;
    await sleep(600); // stay under the mail provider's send rate
  }
  return NextResponse.json({ ok: true, week: key, sent, skipped });
}
