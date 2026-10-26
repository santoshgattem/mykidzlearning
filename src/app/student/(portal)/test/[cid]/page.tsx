import { notFound, redirect } from "next/navigation";
import { TestRunner } from "@/components/student/test-runner";
import { getStudentContext } from "@/lib/student";
import { latestResult, loadTestView } from "@/lib/test";

export default async function TestPage({ params }: { params: Promise<{ cid: string }> }) {
  const { cid } = await params;
  const ctx = await getStudentContext();
  const chapter = ctx.chapters.find((c) => c.id === cid);
  if (!chapter) notFound();
  if (!ctx.unlocked(chapter)) redirect(`/student/subject/${chapter.subject_id}`);

  // A test exists only after "Start test" on the chapter page.
  const view = await loadTestView(ctx.user.id, cid);
  if (!view) {
    // No test in progress: a test that has just been completed shows its result.
    const done = await latestResult(ctx.user.id, cid, 10);
    redirect(done ? `/student/test/${cid}/result` : `/student/chapter/${cid}`);
  }

  const subject = ctx.subjectOf(chapter.subject_id);
  return (
    <TestRunner
      initial={view}
      title={chapter.title}
      subjectColor={`var(--${subject?.color_key ?? "phy"})`}
      videoUrl={ctx.videoUrl(chapter)}
      googleUrl={`https://www.google.com/search?q=${encodeURIComponent(`${view.written.prompt} class 11`)}`}
    />
  );
}
