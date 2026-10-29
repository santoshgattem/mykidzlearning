import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { NotebookButton, StartTestButton, WatchStep } from "@/components/student/chapter-actions";
import { btnGhost, card, sm, Tag } from "@/components/ui";
import { KID_TEST, SET_NAMES, isKid, levelPoints, levelsFor, PTS, TEST, type Level } from "@/lib/learning";
import { createClient } from "@/lib/supabase/server";
import { getStudentContext } from "@/lib/student";

export default async function ChapterPage({ params }: { params: Promise<{ cid: string }> }) {
  const { cid } = await params;
  const ctx = await getStudentContext();
  const LEVELS = levelsFor(ctx.grade);
  const kid = isKid(ctx.grade);
  const chapter = ctx.chapters.find((c) => c.id === cid);
  if (!chapter) notFound();
  if (!ctx.unlocked(chapter)) redirect(`/student/subject/${chapter.subject_id}`);

  const subject = ctx.subjectOf(chapter.subject_id);
  const p = ctx.progressMap.get(cid);
  const watched = !!p?.watched_at;
  const done = p?.completed_level ?? null;
  const nb = p?.notebook_status ?? "none";
  const inProgress = ctx.sessionChapterId === cid && (ctx.sessionSetNo ?? 1) === 1;
  const inProgressAny = ctx.sessionChapterId === cid;
  const url = ctx.videoUrl(chapter);
  const isSearch = url.includes("results?search_query");

  const supabase = await createClient();
  const { data: practice } = await supabase
    .from("chapter_practice")
    .select("position, prompt")
    .eq("chapter_id", cid)
    .order("position");

  const sets = ctx.setsOf(cid);
  const here = levelPoints(ctx.level);
  const levelUp = done != null && done < ctx.level;
  const testLabel = inProgress ? "Continue test" : done != null ? (levelUp ? "Level-up test" : "Revise again") : "Start test";

  const stepNum = (n: number, ok: boolean) => (
    <div className={`grid size-10 flex-none place-items-center rounded-full font-extrabold ${ok ? "bg-good text-white" : "bg-surface2"}`}>
      {ok ? "✓" : n}
    </div>
  );

  return (
    <>
      <Link href={`/student/subject/${chapter.subject_id}`} className={`${btnGhost} ${sm}`}>
        ← {subject?.name}
      </Link>
      <h2 className="mb-1 mt-4 text-[1.6rem] font-extrabold">{chapter.title}</h2>
      <p className="mb-5 text-muted">
        {subject?.emoji} {subject?.name}, Class {ctx.grade}
      </p>

      <div className="grid gap-3.5">
        <section className={`${card} flex items-start gap-4`}>
          {stepNum(1, watched)}
          <div className="flex flex-1 flex-col gap-3.5">
            <h3 className="text-[1.15rem] font-bold">Watch the lesson</h3>
            <p className="text-[0.88rem] text-muted">
              +{PTS.video} points. {isSearch && ctx.channel ? `Opens ${ctx.channel} lessons for this chapter on YouTube. ` : ""}
              Keep your notebook open and write down formulas as you watch.
            </p>
            <WatchStep chapterId={cid} url={url} watched={watched} />
          </div>
        </section>

        <section className={`${card} flex items-start gap-4`}>
          {stepNum(2, done != null)}
          <div className="flex flex-1 flex-col gap-3.5">
            <h3 className="text-[1.15rem] font-bold">Take the test{sets.length > 1 ? " · Set 1" : ""}</h3>
            <p className="text-[0.88rem] text-muted">
              {kid
                ? `${KID_TEST.mcq} pick-the-answer questions, ${KID_TEST.fib} fill in the blanks and ${KID_TEST.short} one-line answers`
                : `${TEST.mcq} MCQs, ${TEST.fib} fill in the blanks and a written answer`}{" "}at <b>{LEVELS[ctx.level].n}</b> level. Get every answer right to complete the chapter: {here} points. Wrong answers? Revise and fix just those.
              {done != null
                ? levelUp
                  ? ` You completed this at ${LEVELS[done as Level].n} level. Redo it at your new level for +${here - (p?.completed_points ?? 0)} more points.`
                  : " Already completed at this level. You can redo it for revision."
                : ""}
              {inProgress ? " You have a test in progress." : ""}
            </p>
            <StartTestButton chapterId={cid} label={testLabel} enabled={watched} />
          </div>
        </section>

        {sets.length > 1 && (
          <section className={`${card} flex items-start gap-4`}>
            {stepNum(3, ctx.passed(cid))}
            <div className="flex flex-1 flex-col gap-3.5">
              <h3 className="text-[1.15rem] font-bold">Harder sets</h3>
              <p className="text-[0.88rem] text-muted">
                This chapter has {sets.length} sets, getting harder each time. Pass every set at 100% to complete the chapter. {done != null && !ctx.passed(cid) ? "Your Set 1 result is safe; the other sets are still to do." : ""}
              </p>
              {sets.filter((n) => n > 1).map((n) => {
                const ok = ctx.setPassed(cid, n);
                const open = watched && ctx.setPassed(cid, n - 1);
                const running = inProgressAny && ctx.sessionSetNo === n;
                return (
                  <div key={n} className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border-2 border-line p-3.5">
                    <b>{SET_NAMES[n as 2 | 3]}</b>
                    {ok ? <Tag>Passed ✓</Tag> : <StartTestButton chapterId={cid} setNo={n} label={running ? "Continue test" : "Start test"} enabled={open} />}
                    
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className={`${card} flex items-start gap-4`}>
          {stepNum(sets.length > 1 ? 4 : 3, nb === "approved")}
          <div className="flex flex-1 flex-col gap-3.5">
            <h3 className="text-[1.15rem] font-bold">Practise in your notebook</h3>
            <p className="text-[0.88rem] text-muted">
              Solve these on paper. Your parent checks your notebook and approves for +{PTS.notebook} points.
            </p>
            <ol className="m-0 list-decimal pl-5">
              {(practice ?? []).map((x) => (
                <li key={x.position}>{x.prompt}</li>
              ))}
            </ol>
            <div>
              {nb === "approved" ? (
                <Tag>Approved by parent</Tag>
              ) : nb === "pending" ? (
                <Tag>Waiting for parent to check</Tag>
              ) : (
                <NotebookButton chapterId={cid} redo={nb === "redo"} />
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
