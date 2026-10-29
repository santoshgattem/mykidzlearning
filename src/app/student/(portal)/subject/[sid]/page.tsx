import Link from "next/link";
import { notFound } from "next/navigation";
import { StartTestButton } from "@/components/student/chapter-actions";
import { btnGhost, sm, Tag } from "@/components/ui";
import { SET_NAMES, levelsFor, type Level } from "@/lib/learning";
import { getStudentContext } from "@/lib/student";

export default async function SubjectPage({ params }: { params: Promise<{ sid: string }> }) {
  const { sid } = await params;
  const ctx = await getStudentContext();
  const LEVELS = levelsFor(ctx.grade);
  const subject = ctx.subjects.find((s) => s.id === sid);
  if (!subject) notFound();
  const chapters = ctx.chaptersOf(sid);
  const color = `var(--${subject.color_key})`;

  return (
    <>
      <Link href="/student" className={`${btnGhost} ${sm}`}>
        ← All subjects
      </Link>
      <div className="mb-5 mt-4 flex items-center gap-3">
        <span className="text-[2.4rem]">{subject.emoji}</span>
        <div>
          <h2 className="text-[1.6rem] font-extrabold">{subject.name}</h2>
          <p className="text-[0.88rem] text-muted">Pick any chapter you like. Score 100% to complete it.</p>
        </div>
      </div>

      <ol className="mx-auto my-2.5 max-w-[560px] list-none p-0">
        {chapters.map((c, i) => {
          const open = ctx.unlocked(c);
          const p = ctx.progressMap.get(c.id);
          const done = p?.completed_level != null;
          const note = !open
            ? "Locked. Pass the previous chapter first."
            : done && !ctx.passed(c.id)
              ? `${ctx.setsPassedCount(c.id)} of ${ctx.setsOf(c.id).length} sets passed`
            : done
              ? `Completed 100% at ${LEVELS[p!.completed_level as Level].n} level`
              : p?.watched_at
                ? "Video watched. Take the test next."
                : "Start with the video";
          return (
            <li key={c.id} className={`mb-[18px] flex items-center gap-4 ${open ? "" : "opacity-80"}`}>
              {open ? (
                <Link
                  href={`/student/chapter/${c.id}`}
                  aria-label={`Chapter ${i + 1}: ${c.title}`}
                  className="grid size-16 flex-none place-items-center rounded-full font-display text-[1.4rem] font-extrabold text-white no-underline"
                  style={{ background: color }}
                >
                  {done ? "✓" : i + 1}
                </Link>
              ) : (
                <span
                  aria-label={`Chapter ${i + 1}: ${c.title} (locked)`}
                  className="grid size-16 flex-none place-items-center rounded-full bg-surface2 font-display text-[1.4rem] font-extrabold text-muted"
                >
                  {i + 1}
                </span>
              )}
              <details className="group flex-1 rounded-[18px] border-2 border-line bg-surface">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                  <div>
                    <b>{c.title}</b>
                    <div className="text-[0.88rem] text-muted">{note}</div>
                  </div>
                  <span aria-hidden className="text-muted transition-transform group-open:rotate-180">▾</span>
                </summary>
                <div className="grid gap-2.5 border-t-2 border-line px-4 py-3">
                  {open ? (
                    <>
                      {ctx.setsOf(c.id).map((n) => {
                        const ok = ctx.setPassed(c.id, n);
                        const running = ctx.sessionChapterId === c.id && (ctx.sessionSetNo ?? 1) === n;
                        const ready = !!p?.watched_at && (n === 1 || ctx.setPassed(c.id, n - 1));
                        return (
                          <div key={n} className="flex flex-wrap items-center justify-between gap-3">
                            <b>{SET_NAMES[n as 1 | 2 | 3]}</b>
                            {ok ? (
                              <Tag>Passed ✓</Tag>
                            ) : (
                              <StartTestButton chapterId={c.id} setNo={n} label={running ? "Continue test" : "Start test"} enabled={ready} />
                            )}
                          </div>
                        );
                      })}
                      <Link href={`/student/chapter/${c.id}`} className="text-[0.88rem] font-bold">
                        Video and notebook practice →
                      </Link>
                    </>
                  ) : (
                    <span className="text-[0.88rem] text-muted">Locked. Pass the previous chapter first.</span>
                  )}
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    </>
  );
}
