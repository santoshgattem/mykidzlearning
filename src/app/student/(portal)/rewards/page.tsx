import Link from "next/link";
import { Medal, RewardRoad } from "@/components/student/reward-road";
import { btnGhost, card, sm } from "@/components/ui";
import { fmt, levelPoints, levelsFor, PTS, TIERS, type Level } from "@/lib/learning";
import { getStudentContext } from "@/lib/student";

export default async function RewardsPage() {
  const ctx = await getStudentContext();
  const LEVELS = levelsFor(ctx.grade);

  return (
    <>
      <Link href="/student" className={`${btnGhost} ${sm}`}>
        ← Home
      </Link>
      <h2 className="mb-3.5 mt-4 text-[1.6rem] font-extrabold">Your rewards</h2>
      <RewardRoad points={ctx.points} milestones={ctx.milestones} />

      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
        {ctx.milestones.map((m) => {
          const got = ctx.points >= m.points;
          return (
            <div key={m.id} className={`${card} flex items-center gap-3.5`}>
              <Medal tier={m.tier} locked={!got} />
              <div>
                <b>{m.reward}</b>
                <div className="text-[0.88rem] text-muted">
                  {TIERS[m.tier].n}, {fmt(m.points)} pts.{" "}
                  {m.given_at ? "Received" : got ? "Unlocked! Your parent will hand it over." : `${fmt(m.points - ctx.points)} to go`}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <section className={`${card} mt-4`}>
        <h3 className="text-[1.15rem] font-bold">How to earn points</h3>
        <table className="mt-2 w-full border-collapse text-[0.88rem]">
          <tbody>
            <tr>
              <td className="border-b border-line px-2 py-2.5">Watch a chapter video</td>
              <td className="border-b border-line px-2 py-2.5">
                <b>+{PTS.video}</b>
              </td>
            </tr>
            <tr>
              <td className="border-b border-line px-2 py-2.5">Score 100% in a chapter test</td>
              <td className="border-b border-line px-2 py-2.5">
                <b>
                  {([1, 2, 3, 4] as Level[]).map((l) => (
                    <span key={l} className="block">
                      +{levelPoints(l)} {LEVELS[l].n}
                    </span>
                  ))}
                </b>
              </td>
            </tr>
            <tr>
              <td className="border-b border-line px-2 py-2.5">Notebook practice approved by parent</td>
              <td className="border-b border-line px-2 py-2.5">
                <b>+{PTS.notebook}</b>
              </td>
            </tr>
            <tr>
              <td className="px-2 py-2.5">Bonus from parent</td>
              <td className="px-2 py-2.5">
                <b>any</b>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
