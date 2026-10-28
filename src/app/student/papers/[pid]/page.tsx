import { redirect } from "next/navigation";
import { PaperRunner } from "@/components/student/paper-runner";
import { PAPER } from "@/lib/learning";
import { examQuestions, finalizeAttempt, myAttempts, timeLeftSeconds } from "@/lib/papers";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStudentContext } from "@/lib/student";

export default async function PaperPage({ params }: { params: Promise<{ pid: string }> }) {
  const { pid } = await params;
  const ctx = await getStudentContext();
  if (ctx.group !== "PCM" && ctx.group !== "PCMB") redirect("/student/papers");

  const attempts = await myAttempts(ctx.user.id);
  const open = attempts.find((a) => a.paper_id === pid && !a.submitted_at);
  if (!open) redirect("/student/papers");

  // Time ran out while the student was away: mark what was saved.
  if (timeLeftSeconds(open) === 0 && Date.now() > new Date(open.deadline).getTime() + PAPER.graceSeconds * 1000) {
    const a = await finalizeAttempt(ctx.user.id, open.id);
    redirect(`/student/papers/result/${a?.id ?? open.id}`);
  }

  const { data: paper } = await createAdminClient().from("papers").select("title").eq("id", pid).single();
  const questions = await examQuestions(pid);
  return (
    <PaperRunner
      attemptId={open.id}
      paperId={pid}
      title={paper?.title ?? "JEE paper"}
      questions={questions}
      initial={open.answers}
      deadline={open.deadline}
      serverNow={Date.now()}
    />
  );
}
