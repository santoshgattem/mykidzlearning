import type { ReactNode } from "react";
import { fmt, TIERS, type Tier } from "@/lib/learning";
import type { Milestone } from "@/lib/student";

export const TIER_BG: Record<Tier, string> = {
  bronze: "bg-bronze",
  silver: "bg-silver",
  gold: "bg-gold",
  diamond: "bg-diamond",
};

export function Medal({ tier, size = "md", locked }: { tier: Tier; size?: "md" | "lg"; locked?: boolean }) {
  return (
    <div
      className={`grid flex-none place-items-center rounded-full font-extrabold text-white ${TIER_BG[tier]} ${size === "lg" ? "size-[90px] text-[2.6rem]" : "size-[46px] text-[1.4rem]"} ${locked ? "opacity-50 grayscale" : ""}`}
    >
      {TIERS[tier].i}
    </div>
  );
}

export function RewardRoad({
  points,
  milestones,
  children,
}: {
  points: number;
  milestones: Milestone[];
  children?: ReactNode;
}) {
  const ms = [...milestones].sort((a, b) => a.points - b.points);
  const next = ms.find((m) => points < m.points);
  let prev = 0;

  return (
    <section className="road mt-1.5 rounded-[28px] p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[0.88rem] opacity-90">Your points</div>
          <div className="font-display text-[clamp(2.4rem,8vw,3.6rem)] font-extrabold leading-none">{fmt(points)}</div>
        </div>
        <div className="max-w-[60%] text-right">
          {next ? (
            <>
              <div className="text-[0.88rem] opacity-90">Next reward</div>
              <b>{next.reward}</b>
              <div className="text-[0.88rem]">{fmt(next.points - points)} points to go</div>
            </>
          ) : (
            <b>You’ve unlocked every reward. Legend.</b>
          )}
        </div>
      </div>

      <div className="my-6 flex items-center overflow-x-auto px-1 pb-1.5" aria-label="Reward road">
        {ms.map((m) => {
          const frac = Math.max(0, Math.min(1, (points - prev) / (m.points - prev || 1)));
          prev = m.points;
          const reached = points >= m.points;
          return (
            <div key={m.id} className="flex items-center">
              <div className="h-2.5 min-w-[44px] flex-[1_1_60px] overflow-hidden rounded-md bg-white/25">
                <div className="h-full rounded-md bg-white" style={{ width: `${frac * 100}%` }} />
              </div>
              <div className={`flex w-[92px] flex-none flex-col items-center gap-1.5 text-center ${reached ? "" : "opacity-70"}`}>
                <div
                  className={`grid size-10 place-items-center rounded-full border-[3px] border-white/60 text-[1.1rem] ${TIER_BG[m.tier]} ${reached ? "" : "opacity-55 grayscale"}`}
                >
                  {TIERS[m.tier].i}
                </div>
                <div className="text-[0.78rem] font-bold leading-tight">
                  {fmt(m.points)}
                  <br />
                  <span className="font-semibold opacity-90">{m.reward}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {children}
    </section>
  );
}
