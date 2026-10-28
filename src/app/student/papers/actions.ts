"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { getStudentContext } from "@/lib/student";
import { finalizeAttempt, saveAnswer, startAttempt } from "@/lib/papers";

type Result = { ok: true; attemptId?: string } | { ok: false; error: string };

// The student id always comes from the signed-in session. JEE papers are for PCM and PCMB students.
async function requireJeeStudent() {
  const user = await getCurrentUser();
  if (!user || user.role !== "student") throw new Error("Not allowed");
  const ctx = await getStudentContext();
  if (ctx.group !== "PCM" && ctx.group !== "PCMB") throw new Error("JEE papers are for PCM and PCMB students.");
  return user;
}

export async function startPaper(paperId: string): Promise<Result> {
  const user = await requireJeeStudent();
  const a = await startAttempt(user.id, paperId);
  if (!a) return { ok: false, error: "That paper isn’t available." };
  return { ok: true, attemptId: a.id };
}

// null clears the answer. Returns false when the time is up or the paper is already handed in.
export async function savePaperAnswer(attemptId: string, questionId: string, value: number | null): Promise<boolean> {
  const user = await requireJeeStudent();
  return saveAnswer(user.id, attemptId, questionId, value);
}

export async function submitPaper(attemptId: string): Promise<Result> {
  const user = await requireJeeStudent();
  const a = await finalizeAttempt(user.id, attemptId);
  if (!a) return { ok: false, error: "Paper not found." };
  revalidatePath("/student", "layout");
  return { ok: true, attemptId: a.id };
}
