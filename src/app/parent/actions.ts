"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth";
import { PIN_REGEX, pinToPassword } from "@/lib/pin";
import { revokeSessions } from "@/lib/limiter";
import { PTS, TIER_IDS, type Tier } from "@/lib/learning";

export type Result = { ok: true; message?: string; kidId?: string } | { ok: false; error: string };

const fail = (error: string): Result => ({ ok: false, error });
const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

// Every action starts here: must be a signed-in parent who has finished first-time setup.
async function requireParent() {
  const user = await getCurrentUser();
  if (!user || user.role !== "parent" || user.mustChangePassword) throw new Error("Not allowed");
  return user;
}

// Reads through the parent's own session, so Row Level Security only ever returns
// the parent's own children. Null means "not your child".
async function ownChild(kidId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("students")
    .select("id, points")
    .eq("id", kidId)
    .maybeSingle();
  return data;
}

const done = () => revalidatePath("/parent");

// ---------------------------------------------------------------- children
export async function addChild(input: { name: string; email: string; pin: string }): Promise<Result> {
  const parent = await requireParent();
  const name = input.name.trim().slice(0, 80);
  const email = input.email.trim().toLowerCase();
  if (!name || !validEmail(email)) return fail("Enter your child’s name and a valid email.");
  if (!PIN_REGEX.test(input.pin)) return fail("PIN must be exactly 4 digits.");

  const db = createAdminClient();
  const { data, error } = await db.auth.admin.createUser({
    email,
    password: pinToPassword(input.pin),
    email_confirm: true,
  });
  if (error || !data.user) {
    const taken = /already|registered|exists/i.test(error?.message ?? "");
    return fail(taken ? "This email is already linked to an account." : "Couldn’t add your child.");
  }

  const id = data.user.id;
  const { error: pe } = await db.from("profiles").insert({
    id, role: "student", full_name: name, email, created_by: parent.id,
  });
  const { error: se } = pe ? { error: pe } : await db.from("students").insert({ id, parent_id: parent.id });
  if (pe || se) {
    await db.auth.admin.deleteUser(id);
    return fail("Couldn’t add your child.");
  }

  done();
  return { ok: true, kidId: id, message: `${name} added. Now set the rewards.` };
}

export async function saveChildSettings(kidId: string, input: { name: string; pin: string }): Promise<Result> {
  await requireParent();
  if (!(await ownChild(kidId))) return fail("Child not found.");
  const name = input.name.trim().slice(0, 80);
  const pin = input.pin.trim();
  if (pin && !PIN_REGEX.test(pin)) return fail("PIN must be exactly 4 digits.");

  const db = createAdminClient();
  if (name) await db.from("profiles").update({ full_name: name }).eq("id", kidId);
  if (pin) {
    const { error } = await db.auth.admin.updateUserById(kidId, { password: pinToPassword(pin) });
    if (error) return fail("Couldn’t change the PIN.");
    await db.from("students").update({ pin_failed_count: 0, pin_locked_until: null }).eq("id", kidId);
    await revokeSessions(kidId); // anyone signed in with the old PIN is signed out
  }
  done();
  return { ok: true, message: pin ? "Saved. The new PIN works now." : "Saved." };
}

export async function removeChild(kidId: string): Promise<Result> {
  await requireParent();
  if (!(await ownChild(kidId))) return fail("Child not found.");
  const { error } = await createAdminClient().auth.admin.deleteUser(kidId);
  if (error) return fail("Couldn’t remove the child. Try again.");
  done();
  return { ok: true, message: "Child removed." };
}

// ---------------------------------------------------------------- points
export async function giveBonus(kidId: string, amount: number, reason: string): Promise<Result> {
  const parent = await requireParent();
  if (!(await ownChild(kidId))) return fail("Child not found.");
  if (!Number.isInteger(amount) || amount === 0 || Math.abs(amount) > 1_000_000) {
    return fail("Enter a number of points, like 200 or -100.");
  }
  const text = reason.trim().slice(0, 120) || (amount > 0 ? "Bonus from parent" : "Adjustment by parent");

  const { error } = await createAdminClient().rpc("add_points", {
    p_student: kidId, p_amount: amount, p_reason: text, p_by: parent.id,
  });
  if (error) return fail("Couldn’t update the points.");
  done();
  return { ok: true, message: "Points updated." };
}

// ---------------------------------------------------------------- rewards
export type MilestoneInput = { id?: string; points: number; reward: string; tier: Tier };

export async function saveMilestones(kidId: string, rows: MilestoneInput[]): Promise<Result> {
  await requireParent();
  if (!(await ownChild(kidId))) return fail("Child not found.");

  const clean = rows
    .map((r) => ({
      id: r.id, points: Math.trunc(Number(r.points)), reward: String(r.reward ?? "").trim().slice(0, 100), tier: r.tier,
    }))
    .filter((r) => r.points > 0 && r.reward);
  if (!clean.length) return fail("Add at least one reward with points.");
  if (clean.some((r) => r.points > 10_000_000 || !TIER_IDS.includes(r.tier))) {
    return fail("Check the points and badge for each reward.");
  }

  // The parent's own session does the writing, so Row Level Security enforces ownership.
  const supabase = await createClient();
  const { data: existing } = await supabase.from("milestones").select("id").eq("student_id", kidId);
  const have = new Set((existing ?? []).map((m) => m.id));
  const keep = new Set(clean.filter((r) => r.id && have.has(r.id)).map((r) => r.id!));

  const drop = [...have].filter((id) => !keep.has(id));
  if (drop.length) await supabase.from("milestones").delete().in("id", drop);

  for (const r of clean) {
    if (r.id && have.has(r.id)) {
      await supabase.from("milestones").update({ points: r.points, reward: r.reward, tier: r.tier }).eq("id", r.id);
    } else {
      await supabase.from("milestones").insert({ student_id: kidId, points: r.points, reward: r.reward, tier: r.tier });
    }
  }
  done();
  return { ok: true, message: "Rewards saved." };
}

export async function markRewardGiven(milestoneId: string): Promise<Result> {
  await requireParent();
  const supabase = await createClient();
  const { data: m } = await supabase
    .from("milestones").select("id, points, student_id").eq("id", milestoneId).maybeSingle();
  if (!m) return fail("Reward not found.");
  const kid = await ownChild(m.student_id);
  if (!kid || kid.points < m.points) return fail("This reward hasn’t been earned yet.");

  await supabase.from("milestones").update({ given_at: new Date().toISOString() }).eq("id", m.id).is("given_at", null);
  done();
  return { ok: true, message: "Marked as given." };
}

// ---------------------------------------------------------------- notebook
export async function reviewNotebook(kidId: string, chapterId: string, approve: boolean): Promise<Result> {
  const parent = await requireParent();
  if (!(await ownChild(kidId))) return fail("Child not found.");

  const db = createAdminClient();
  // Only a pending submission can be reviewed, and only once: the status change is the
  // guard that stops a double click from giving the points twice.
  const { data: changed } = await db
    .from("chapter_progress")
    .update({ notebook_status: approve ? "approved" : "redo" })
    .eq("student_id", kidId).eq("chapter_id", chapterId).eq("notebook_status", "pending")
    .select("chapter_id");
  if (!changed?.length) return fail("Nothing to review here.");

  if (!approve) return { ok: true, message: "Sent back. They can resubmit after redoing it." };

  const { data: chapter } = await db.from("chapters").select("title").eq("id", chapterId).single();
  await db.rpc("add_points", {
    p_student: kidId,
    p_amount: PTS.notebook,
    p_reason: `Notebook practice approved: ${chapter?.title ?? chapterId}`,
    p_by: parent.id,
  });
  done();
  return { ok: true, message: `+${PTS.notebook} points given.` };
}

// ---------------------------------------------------------------- video links
function cleanUrl(raw: string): string | null {
  const v = raw.trim();
  if (!v) return "";
  try {
    const u = new URL(v);
    return (u.protocol === "https:" || u.protocol === "http:") && v.length <= 500 ? u.toString() : null;
  } catch {
    return null;
  }
}

export async function saveVideoLinks(
  kidId: string,
  input: { channel: string; links: Record<string, string> },
): Promise<Result> {
  await requireParent();
  if (!(await ownChild(kidId))) return fail("Child not found.");

  const upserts: { student_id: string; chapter_id: string; url: string }[] = [];
  const removes: string[] = [];
  for (const [chapterId, raw] of Object.entries(input.links)) {
    const url = cleanUrl(raw);
    if (url === null) return fail("Video links must start with https:// or http://");
    if (url) upserts.push({ student_id: kidId, chapter_id: chapterId, url });
    else removes.push(chapterId);
  }

  await createAdminClient()
    .from("students").update({ preferred_channel: input.channel.trim().slice(0, 80) }).eq("id", kidId);

  const supabase = await createClient();
  if (upserts.length) {
    const { error } = await supabase.from("chapter_video_links").upsert(upserts);
    if (error) return fail("Couldn’t save the video links.");
  }
  if (removes.length) {
    await supabase.from("chapter_video_links").delete().eq("student_id", kidId).in("chapter_id", removes);
  }
  done();
  return { ok: true, message: "Video links saved." };
}
