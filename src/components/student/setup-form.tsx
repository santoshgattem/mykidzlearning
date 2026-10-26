"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveSetup } from "@/app/student/actions";
import { btn, btnSoft, card, errorText, label } from "@/components/ui";
import { GROUPS, type Group } from "@/lib/learning";

const SUBJECT_LABEL: Record<string, string> = {
  phy: "⚡ Physics",
  chem: "🧪 Chemistry",
  math: "📐 Mathematics",
  bio: "🧬 Biology",
};

export function SetupForm({ name, grade: g0, group: gr0 }: { name: string; grade: number | null; group: Group | null }) {
  const router = useRouter();
  const [grade, setGrade] = useState<number | null>(g0);
  const [group, setGroup] = useState<Group | null>(gr0);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  return (
    <section className={`${card} mx-auto mt-2.5 flex max-w-[640px] flex-col gap-3.5`}>
      <h2 className="text-[1.6rem] font-extrabold">Hey {name}, set up your study track</h2>
      <div>
        <span className={label}>Your class</span>
        <div className="flex flex-wrap gap-3">
          {[11, 12].map((c) => (
            <button
              key={c}
              disabled={c === 12}
              aria-pressed={grade === c}
              onClick={() => setGrade(c)}
              className={`${grade === c ? btn : btnSoft}`}
            >
              Class {c}
              {c === 12 ? " (coming soon)" : ""}
            </button>
          ))}
        </div>
      </div>
      <div>
        <span className={label}>Your group</span>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          {(Object.keys(GROUPS) as Group[]).map((id) => (
            <button
              key={id}
              aria-pressed={group === id}
              onClick={() => setGroup(id)}
              className={`${group === id ? btn : btnSoft} !text-left`}
            >
              <b>{id}</b>
              <div className="text-[0.88rem] opacity-85">{GROUPS[id].map((s) => SUBJECT_LABEL[s]).join(", ")}</div>
            </button>
          ))}
        </div>
      </div>
      <div role="alert" className={errorText}>
        {error}
      </div>
      <div>
        <button
          className={btn}
          disabled={!grade || !group || pending}
          onClick={() =>
            start(async () => {
              const r = await saveSetup(grade!, group!);
              if (!r.ok) return setError(r.error);
              router.push("/student");
              router.refresh();
            })
          }
        >
          {pending ? "Saving…" : "Start learning"}
        </button>
      </div>
    </section>
  );
}
