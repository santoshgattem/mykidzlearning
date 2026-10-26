import Link from "next/link";
import { SetupForm } from "@/components/student/setup-form";
import { LevelCard } from "@/components/student/level-card";
import { RewardRoad } from "@/components/student/reward-road";
import { btn, btnGhost, card, sm } from "@/components/ui";
import { getStudentContext } from "@/lib/student";

export default async function StudentHome({ searchParams }: { searchParams: Promise<{ setup?: string }> }) {
  const ctx = await getStudentContext();
  const { setup } = await searchParams;

  if (!ctx.group || !ctx.grade || setup) {
    return <SetupForm name={ctx.name} grade={ctx.grade} group={ctx.group} />;
  }

  const next = ctx.nextChapter;

  return (
    <>
      <h2 className="mb-3.5 mt-1 text-[1.6rem] font-extrabold">Hi {ctx.name} 👋</h2>
      <RewardRoad points={ctx.points} milestones={ctx.milestones}>
        <Link href="/student/rewards" className="inline-block rounded-[10px] bg-white/20 px-3 py-[7px] text-[0.88rem] font-bold text-white no-underline">
          See all rewards and how to earn
        </Link>
      </RewardRoad>
      <LevelCard pct={ctx.pct} level={ctx.level} />

      {next && (
        <div className={`${card} mt-4 flex flex-wrap items-center justify-between gap-3`}>
          <div>
            <div className="text-[0.88rem] text-muted">Pick up where you left off</div>
            <b>
              {ctx.subjectOf(next.subject_id)?.emoji} {next.title}
            </b>
          </div>
          <Link href={`/student/chapter/${next.id}`} className={btn}>
            Continue
          </Link>
        </div>
      )}

      <div className="mb-3 mt-7 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[1.6rem] font-extrabold">Your subjects</h2>
        <Link href="/student?setup=1" className={`${btnGhost} ${sm}`}>
          Class {ctx.grade}, {ctx.group}: change
        </Link>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        {ctx.subjects.map((s) => {
          const cs = ctx.chaptersOf(s.id);
          const done = cs.filter((c) => ctx.passed(c.id)).length;
          return (
            <Link
              key={s.id}
              href={`/student/subject/${s.id}`}
              className="flex min-h-[170px] flex-col justify-between rounded-3xl p-5 text-left text-white no-underline"
              style={{ background: `var(--${s.color_key})` }}
            >
              <span className="text-[2.4rem]">{s.emoji}</span>
              <div>
                <h3 className="text-[1.4rem] font-bold text-white">{s.name}</h3>
                <div className="text-[0.88rem]">
                  {done} of {cs.length} chapters passed
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-md bg-white/30">
                  <div className="h-full bg-white" style={{ width: `${cs.length ? (done / cs.length) * 100 : 0}%` }} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
