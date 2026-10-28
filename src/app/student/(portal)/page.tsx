import Link from "next/link";
import { SetupForm } from "@/components/student/setup-form";
import { LevelCard } from "@/components/student/level-card";
import { RewardRoad } from "@/components/student/reward-road";
import { btn, btnGhost, btnSoft, card, sm } from "@/components/ui";
import { getStudentContext } from "@/lib/student";
import { createClient } from "@/lib/supabase/server";
import { WEEKLY_TARGET } from "@/lib/learning";
import { weekStart } from "@/lib/week";

export default async function StudentHome({ searchParams }: { searchParams: Promise<{ setup?: string }> }) {
  const ctx = await getStudentContext();
  const { setup } = await searchParams;

  if (!ctx.group || !ctx.grade || setup) {
    return <SetupForm name={ctx.name} grade={ctx.grade} group={ctx.group} />;
  }

  const next = ctx.nextChapter;

  // Tests passed at 100% since Monday, read through the student's own session.
  const { count: weekDone } = await (await createClient())
    .from("test_attempts")
    .select("id", { count: "exact", head: true })
    .eq("student_id", ctx.user.id)
    .gte("created_at", weekStart().toISOString());
  const done = weekDone ?? 0;

  return (
    <>
      <h2 className="mb-3.5 mt-1 text-[1.6rem] font-extrabold">Hi {ctx.name} 👋</h2>
      <RewardRoad points={ctx.points} milestones={ctx.milestones}>
        <Link href="/student/rewards" className="inline-block rounded-[10px] bg-white/20 px-3 py-[7px] text-[0.88rem] font-bold text-white no-underline">
          See all rewards and how to earn
        </Link>
      </RewardRoad>
      <LevelCard pct={ctx.pct} level={ctx.level} grade={ctx.grade} />

      <div className={`${card} mt-4`}>
        <div className="flex items-center justify-between gap-3">
          <b>This week</b>
          <span className="text-[0.88rem] text-muted">
            {done >= WEEKLY_TARGET ? "Goal reached. Great work!" : `${WEEKLY_TARGET - done} more to reach your weekly goal`}
          </span>
        </div>
        <div className="mt-2 flex gap-1.5" role="img" aria-label={`${Math.min(done, WEEKLY_TARGET)} of ${WEEKLY_TARGET} tests passed this week`}>
          {Array.from({ length: WEEKLY_TARGET }, (_, i) => (
            <i key={i} className={`h-2.5 flex-1 rounded-full ${i < done ? "bg-good" : "bg-surface2"}`} />
          ))}
        </div>
        <div className="mt-1.5 text-[0.88rem] text-muted">
          {Math.min(done, WEEKLY_TARGET)} of {WEEKLY_TARGET} tests passed at 100% since Monday
        </div>
      </div>

      {next && (
        <div className={`${card} mt-4 flex flex-wrap items-center justify-between gap-3`}>
          <div>
            <div className="text-[0.88rem] text-muted">Pick up where you left off</div>
            <b>
              {ctx.subjectOf(next.subject_id)?.emoji} {next.title}
            </b>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link href={`/student/chapter/${next.id}`} className={btn}>
              Continue
            </Link>
            {/* A plain link: this address picks a chapter on the server, so it must not be prefetched. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/student/random" className={btnSoft}>
              🎲 Surprise me
            </a>
          </div>
        </div>
      )}

      {(ctx.group === "PCM" || ctx.group === "PCMB") && (
        <div className={`${card} mt-4 flex flex-wrap items-center justify-between gap-3`}>
          <div>
            <b>🎯 JEE practice papers</b>
            <div className="text-[0.88rem] text-muted">Full-length papers in the JEE Main pattern. Test where you really stand.</div>
          </div>
          <Link href="/student/papers" className={btnSoft}>Open papers</Link>
        </div>
      )}

      <div className="mb-3 mt-7 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[1.6rem] font-extrabold">Your subjects</h2>
        <Link href="/student?setup=1" className={`${btnGhost} ${sm}`}>
          {ctx.grade === 3 ? "Class 3" : `Class ${ctx.grade}, ${ctx.group}`}: change
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
