import { card } from "@/components/ui";
import { LEVELS, type Level } from "@/lib/learning";

export function LevelCard({ pct, level }: { pct: number; level: Level }) {
  const next = [25, 50, 75].find((x) => pct < x);
  return (
    <section className={`${card} mt-4`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[0.88rem] text-muted">Your level</div>
          <h3 className="text-[1.15rem] font-bold">
            Level {level}: {LEVELS[level].n}
          </h3>
          <div className="text-[0.88rem] text-muted">
            {LEVELS[level].d} questions. Chapters earn {LEVELS[level].x}× points.
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-[2rem] font-extrabold">{pct}%</div>
          <div className="text-[0.88rem] text-muted">of syllabus completed</div>
        </div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-md bg-surface2">
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1.5 flex justify-between text-[0.88rem] text-muted">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
      <p className="mt-2 text-[0.88rem]">
        {next
          ? `Reach ${next}% to move up to ${LEVELS[(level + 1) as Level].n} questions. Chapters you finished earlier can be redone at the new level for extra points.`
          : "You’re on the toughest level. Finish the syllabus!"}
      </p>
    </section>
  );
}
