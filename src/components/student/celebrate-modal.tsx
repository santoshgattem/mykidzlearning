"use client";

import { useState, useTransition } from "react";
import { celebrateRewards } from "@/app/student/actions";
import { btn } from "@/components/ui";
import { fmt, TIERS, type Tier } from "@/lib/learning";
import { Medal } from "@/components/student/reward-road";

export function CelebrateModal({ tier, points, reward }: { tier: Tier; points: number; reward: string }) {
  const [open, setOpen] = useState(true);
  const [, start] = useTransition();
  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Reward unlocked" className="fixed inset-0 z-40 grid place-items-center bg-[rgba(10,8,30,0.6)] p-5">
      <div className="max-w-[420px] rounded-[22px] border-2 border-line bg-surface p-5 text-center">
        <div className="pop mx-auto mb-3.5 w-fit">
          <Medal tier={tier} size="lg" />
        </div>
        <h2 className="text-[1.6rem] font-extrabold">{TIERS[tier].n} unlocked!</h2>
        <p className="mt-2">
          You reached {fmt(points)} points and earned <b>{reward}</b>. Show this to your parent.
        </p>
        <button
          autoFocus
          className={`${btn} mt-4`}
          onClick={() => {
            setOpen(false);
            start(async () => {
              await celebrateRewards();
            });
          }}
        >
          Keep going
        </button>
      </div>
    </div>
  );
}
