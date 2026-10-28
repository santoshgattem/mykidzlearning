import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { btn, card } from "@/components/ui";
import { PAPER } from "@/lib/learning";
import { getAttempt, SUBJECT_NAMES, type Subject } from "@/lib/papers";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStudentContext } from "@/lib/student";

const mins = (a: string, b: string) => Math.max(1, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 60000));

// Shows how the student did, by subject and by chapter. It never shows the right answers:
// the same rule as chapter tests, so the paper can be sat again later as a fresh check.
export default async function PaperResult({ params }: { params: Promise<{ aid: string }> }) {
  const { aid } = await params;
  const ctx = await getStudentContext();
  const a = await getAttempt(ctx.user.id, aid);
  if (!a) notFound();
  if (!a.submitted_at || !a.breakdown) redirect(`/student/papers/${a.paper_id}`);
  const { data: paper } = await createAdminClient().from("papers").select("title").eq("id", a.paper_id).single();
  const b = a.breakdown;
  const attempted = (a.correct ?? 0) + (a.wrong ?? 0);
  const accuracy = attempted ? Math.round(((a.correct ?? 0) / attempted) * 100) : 0;

  const weak = b.chapters
    .filter((c) => c.total >= 2 && c.correct / c.total < 0.5)
    .sort((x, y) => x.correct / x.total - y.correct / y.total)
    .slice(0, 8);
  const strong = b.chapters.filter((c) => c.total >= 2 && c.correct / c.total >= 0.75).sort((x, y) => y.correct - x.correct).slice(0, 5);

  return (
    <>
      <Link href="/student/papers" className="text-[0.9rem] font-bold">← JEE papers</Link>
      <h2 className="mb-1 mt-4 text-[1.6rem] font-extrabold">{paper?.title ?? "JEE paper"}</h2>
      <p className="text-[0.9rem] text-muted">
        Finished in {mins(a.started_at, a.submitted_at)} minutes of {PAPER.minutes}.
      </p>

      <div className={`${card} mt-4 text-center`}>
        <div className="font-display text-[3rem] font-extrabold leading-none">{a.marks}<span className="text-[1.4rem] text-muted"> / {PAPER.maxMarks}</span></div>
        <div className="mt-2 text-muted">
          {a.correct} right · {a.wrong} wrong · {a.skipped} not attempted · accuracy {accuracy}%
        </div>
        {a.bonus_points > 0 && <div className="mt-2 font-bold">+{a.bonus_points} bonus points for finishing this paper 🎉</div>}
      </div>

      <div className="mt-4 grid gap-3.5 sm:grid-cols-3">
        {(Object.keys(SUBJECT_NAMES) as Subject[]).map((s) => {
          const t = b.subjects[s];
          return (
            <div key={s} className={card} style={{ borderColor: `var(--${s})` }}>
              <b>{SUBJECT_NAMES[s]}</b>
              <div className="font-display text-[1.8rem] font-extrabold">{t.marks}<span className="text-[1rem] text-muted"> / 100</span></div>
              <div className="text-[0.85rem] text-muted">{t.correct} right · {t.wrong} wrong · {t.skipped} skipped</div>
            </div>
          );
        })}
      </div>

      {weak.length > 0 && (
        <section className={`${card} mt-4`}>
          <h3 className="mb-2 text-[1.15rem] font-extrabold">Revise these first</h3>
          <ul className="grid gap-1.5">
            {weak.map((c) => (
              <li key={c.subject + c.chapter} className="flex flex-wrap items-center justify-between gap-2">
                <span>
                  <b>{c.chapter}</b>{" "}
                  <span className="text-[0.82rem] text-muted">
                    {SUBJECT_NAMES[c.subject]}{c.grade === 12 ? " · Class 12" : ""}
                  </span>
                </span>
                <span className="text-[0.88rem] text-muted">{c.correct} of {c.total} right</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {strong.length > 0 && (
        <section className={`${card} mt-4`}>
          <h3 className="mb-2 text-[1.15rem] font-extrabold">Going well</h3>
          <p className="text-[0.95rem]">{strong.map((c) => c.chapter).join(", ")}</p>
        </section>
      )}

      <details className={`${card} mt-4`}>
        <summary className="cursor-pointer font-bold">Every chapter</summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-[0.9rem]">
            <thead>
              <tr className="text-muted"><th className="py-1 pr-3">Chapter</th><th className="pr-3">Subject</th><th className="pr-3">Right</th><th>Questions</th></tr>
            </thead>
            <tbody>
              {[...b.chapters].sort((x, y) => x.subject.localeCompare(y.subject) || x.chapter.localeCompare(y.chapter)).map((c) => (
                <tr key={c.subject + c.chapter} className="border-t border-line">
                  <td className="py-1 pr-3">{c.chapter}</td><td className="pr-3">{SUBJECT_NAMES[c.subject]}</td><td className="pr-3">{c.correct}</td><td>{c.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <p className="mt-4 text-[0.88rem] text-muted">
        The right answers are not shown, so you can sit a paper again later and it is still a fair check. Go back to the chapters above and test yourself on them.
      </p>
      <div className="mt-4"><Link href="/student/papers" className={btn}>Back to papers</Link></div>
    </>
  );
}
