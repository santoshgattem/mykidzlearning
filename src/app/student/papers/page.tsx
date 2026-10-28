import Link from "next/link";
import { StartPaperButton } from "@/components/student/start-paper-button";
import { btnGhost, card, sm } from "@/components/ui";
import { PAPER } from "@/lib/learning";
import { listPapers, myAttempts, timeLeftSeconds, type Paper } from "@/lib/papers";
import { getStudentContext } from "@/lib/student";

const hm = (s: number) => `${Math.floor(s / 3600)}h ${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}m`;
const when = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default async function PapersPage() {
  const ctx = await getStudentContext();
  if (ctx.group !== "PCM" && ctx.group !== "PCMB") {
    return (
      <>
        <Link href="/student" className="text-[0.9rem] font-bold">← Home</Link>
        <h2 className="mb-2 mt-4 text-[1.6rem] font-extrabold">JEE papers</h2>
        <p className="text-muted">These papers are for Physics, Chemistry and Maths students (PCM or PCMB).</p>
      </>
    );
  }

  const [papers, attempts] = await Promise.all([listPapers(), myAttempts(ctx.user.id)]);
  const open = new Map(attempts.filter((a) => !a.submitted_at).map((a) => [a.paper_id, a]));
  const done = attempts.filter((a) => a.submitted_at);
  const title = new Map(papers.map((p) => [p.id, p.title]));

  const group = (scope: Paper["scope"], heading: string, blurb: string) => {
    const list = papers.filter((p) => p.scope === scope);
    return (
      <section className="mt-6">
        <h3 className="text-[1.25rem] font-extrabold">{heading}</h3>
        <p className="mb-3 text-[0.9rem] text-muted">{blurb}</p>
        {list.length === 0 ? (
          <p className="text-muted">Papers are on the way.</p>
        ) : (
          <div className="grid gap-3.5 sm:grid-cols-2">
            {list.map((p) => {
              const o = open.get(p.id);
              const last = done.find((a) => a.paper_id === p.id);
              return (
                <div key={p.id} className={`${card} flex flex-col gap-2.5`}>
                  <b className="text-[1.05rem]">{p.title}</b>
                  <div className="text-[0.88rem] text-muted">
                    90 questions · {p.duration_minutes / 60} hours · {PAPER.maxMarks} marks
                  </div>
                  {last && (
                    <div className="text-[0.88rem]">
                      Last score: <b>{last.marks}/{PAPER.maxMarks}</b> on {when(last.submitted_at!)}{" "}
                      <Link href={`/student/papers/result/${last.id}`}>View result</Link>
                    </div>
                  )}
                  {o && <div className="text-[0.88rem] font-bold">In progress: {hm(timeLeftSeconds(o))} left</div>}
                  <StartPaperButton paperId={p.id} resume={!!o} />
                </div>
              );
            })}
          </div>
        )}
      </section>
    );
  };

  return (
    <>
      <Link href="/student" className="text-[0.9rem] font-bold">← Home</Link>
      <h2 className="mb-1 mt-4 text-[1.6rem] font-extrabold">JEE practice papers</h2>
      <p className="text-[0.95rem] text-muted">
        Full-length papers in the JEE Main pattern: 30 questions each in Physics, Chemistry and Maths: 20 multiple-choice, and 10 numerical of which you attempt any 5.
        Right answer +4, wrong multiple-choice −1, wrong numerical 0. Sit it in one go, in a quiet place, with rough paper.
        Finish a paper for the first time and earn {PAPER.bonus} bonus points.
      </p>
      {group("11", "Class 11 papers", "Only the Class 11 syllabus. A good check of where you stand after Class 11.")}
      {group("11+12", "Class 11 + 12 papers", "The full JEE syllabus, about half from each year.")}

      {done.length > 0 && (
        <section className="mt-8">
          <h3 className="mb-3 text-[1.25rem] font-extrabold">Your attempts</h3>
          <div className="grid gap-2.5">
            {done.map((a) => (
              <Link
                key={a.id}
                href={`/student/papers/result/${a.id}`}
                className={`${card} flex flex-wrap items-center justify-between gap-2 !py-3 no-underline`}
              >
                <span><b>{title.get(a.paper_id) ?? a.paper_id}</b> <span className="text-[0.88rem] text-muted">· {when(a.submitted_at!)}</span></span>
                <span className="font-extrabold">{a.marks}/{PAPER.maxMarks}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
      <div className="mt-6"><Link href="/student" className={`${btnGhost} ${sm}`}>Back home</Link></div>
    </>
  );
}
