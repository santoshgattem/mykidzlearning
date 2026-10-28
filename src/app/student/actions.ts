"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth";
import { PTS, isKid } from "@/lib/learning";
import { ensureKidSession, submitKidAnswers, type KidAnswers, type KidOutcome } from "@/lib/kidtest";
import { ensureSession, submitAnswers, type Answers, type SubmitOutcome } from "@/lib/test";
import { getStudentContext } from "@/lib/student";

type Result = { ok: true } | { ok: false; error: string };
const fail = (error: string): Result => ({ ok: false, error });

// Every action starts here. The student id always comes from the signed-in session, never
// from the browser, so one student can never act on another's account.
async function requireStudent() {
  const user = await getCurrentUser();
  if (!user || user.role !== "student") throw new Error("Not allowed");
  return user;
}

const refresh = () => revalidatePath("/student", "layout");

// A chapter can be worked on only if it is in the student's group and unlocked.
async function chapterFor(chapterId: string) {
  const ctx = await getStudentContext();
  const chapter = ctx.chapters.find((c) => c.id === chapterId);
  if (!chapter) return { ctx, chapter: null };
  return { ctx, chapter: ctx.unlocked(chapter) ? chapter : null };
}

// ---------------------------------------------------------------- step 1: the video (+20, once)
export async function markWatched(chapterId: string): Promise<Result & { gained?: number }> {
  const user = await requireStudent();
  const { chapter } = await chapterFor(chapterId);
  if (!chapter) return fail("This chapter isn’t open yet.");

  const db = createAdminClient();
  // Setting watched_at only if it is still empty is the guard that gives the points once.
  await db.from("chapter_progress").upsert({ student_id: user.id, chapter_id: chapterId }, { onConflict: "student_id,chapter_id", ignoreDuplicates: true });
  const { data: changed } = await db
    .from("chapter_progress")
    .update({ watched_at: new Date().toISOString() })
    .eq("student_id", user.id)
    .eq("chapter_id", chapterId)
    .is("watched_at", null)
    .select("chapter_id");
  if (changed?.length) {
    await db.rpc("add_points", {
      p_student: user.id,
      p_amount: PTS.video,
      p_reason: `Watched: ${chapter.title}`,
      p_by: null,
    });
  }
  refresh();
  return { ok: true, gained: changed?.length ? PTS.video : 0 };
}

// ---------------------------------------------------------------- step 3: notebook practice
export async function submitNotebook(chapterId: string): Promise<Result> {
  const user = await requireStudent();
  const { chapter } = await chapterFor(chapterId);
  if (!chapter) return fail("This chapter isn’t open yet.");

  const db = createAdminClient();
  await db.from("chapter_progress").upsert({ student_id: user.id, chapter_id: chapterId }, { onConflict: "student_id,chapter_id", ignoreDuplicates: true });
  // Only a new or sent-back submission can be sent; an approved one cannot be reopened.
  await db
    .from("chapter_progress")
    .update({ notebook_status: "pending" })
    .eq("student_id", user.id)
    .eq("chapter_id", chapterId)
    .in("notebook_status", ["none", "redo"]);
  refresh();
  return { ok: true };
}

// ---------------------------------------------------------------- step 2: the test
export async function startTest(chapterId: string): Promise<Result> {
  const user = await requireStudent();
  const { ctx, chapter } = await chapterFor(chapterId);
  if (!chapter) return fail("This chapter isn’t open yet.");
  if (!ctx.progressMap.get(chapterId)?.watched_at) return fail("Watch the lesson first. The test unlocks after the video.");
  try {
    if (isKid(ctx.grade)) await ensureKidSession(user.id, chapterId, ctx.level);
    else await ensureSession(user.id, chapterId, ctx.level);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Couldn’t start the test.");
  }
  refresh();
  return { ok: true };
}

export async function submitTest(chapterId: string, answers: Answers): Promise<SubmitOutcome> {
  const user = await requireStudent();
  const { chapter } = await chapterFor(chapterId);
  if (!chapter) return { status: "error", error: "This chapter isn’t open yet." };
  const outcome = await submitAnswers(user.id, chapterId, answers);
  if (outcome.status === "done") refresh();
  return outcome;
}

// Class 3: 5 multiple-choice, 5 fill-in-the-blanks, 5 one-line answers.
export async function submitKidTest(chapterId: string, answers: KidAnswers): Promise<KidOutcome> {
  const user = await requireStudent();
  const { ctx, chapter } = await chapterFor(chapterId);
  if (!chapter || !isKid(ctx.grade)) return { status: "error", error: "This chapter isn’t open yet." };
  const outcome = await submitKidAnswers(user.id, chapterId, answers);
  if (outcome.status === "done") refresh();
  return outcome;
}

// ---------------------------------------------------------------- reward celebration
export async function celebrateRewards(): Promise<Result> {
  const user = await requireStudent();
  const db = createAdminClient();
  const { data: st } = await db.from("students").select("points").eq("id", user.id).single();
  await db
    .from("milestones")
    .update({ celebrated_at: new Date().toISOString() })
    .eq("student_id", user.id)
    .lte("points", st?.points ?? 0)
    .is("celebrated_at", null);
  refresh();
  return { ok: true };
}
