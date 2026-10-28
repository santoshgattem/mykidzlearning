"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addChild, giveBonus, markRewardGiven, removeChild, reviewNotebook, saveChildSettings, setChildClass,
  saveMilestones, saveVideoLinks, type MilestoneInput, type Result,
} from "@/app/parent/actions";
import { btn, btnBad, btnGood, btnSoft, card, input, label, sm } from "@/components/ui";
import { SENIOR_GROUPS, TIERS, TIER_IDS, type Tier } from "@/lib/learning";

// Runs a server action, shows its message, and refreshes the page data.
function useRun() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  function run(fn: () => Promise<Result>, onOk?: (r: Extract<Result, { ok: true }>) => void) {
    start(async () => {
      const r = await fn();
      if (!r.ok) return setMsg({ ok: false, text: r.error });
      setMsg({ ok: true, text: r.message ?? "Done." });
      onOk?.(r);
      router.refresh();
    });
  }
  return { run, pending, msg, router };
}

function Msg({ msg }: { msg: { ok: boolean; text: string } | null }) {
  if (!msg) return null;
  return (
    <p role={msg.ok ? "status" : "alert"} className={`text-[0.9rem] font-bold ${msg.ok ? "text-good" : "text-bad"}`}>
      {msg.text}
    </p>
  );
}

// ---------------------------------------------------------------- class picker
const GROUP_SUBJECTS: Record<string, string> = {
  PCM: "Physics, Chemistry, Maths, English",
  PCB: "Physics, Chemistry, Biology, English",
  PCMB: "Physics, Chemistry, Maths, Biology, English",
};

// A parent chooses one class for a child: Class 3, or Class 11 with a group. The child cannot change it.
export function ClassPicker({ grade, group, onChange }: { grade: number | null; group: string | null; onChange: (grade: number | null, group: string | null) => void }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap gap-2.5" role="group" aria-label="Class">
        <button type="button" aria-pressed={grade === 3} className={grade === 3 ? btn : btnSoft} onClick={() => onChange(3, "C3")}>Class 3</button>
        <button type="button" aria-pressed={grade === 11} className={grade === 11 ? btn : btnSoft} onClick={() => onChange(11, group && group !== "C3" ? group : null)}>Class 11</button>
        <button type="button" disabled className={btnSoft}>Class 12 (coming soon)</button>
      </div>
      {grade === 3 && <p className="text-[0.9rem] text-muted">Subjects: Maths, EVS, English and Hindi (Telugu coming soon).</p>}
      {grade === 11 && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2.5" role="group" aria-label="Group">
          {SENIOR_GROUPS.map((g) => (
            <button key={g} type="button" aria-pressed={group === g} onClick={() => onChange(11, g)} className={`${group === g ? btn : btnSoft} !text-left`}>
              <b>{g}</b>
              <div className="text-[0.82rem] opacity-85">{GROUP_SUBJECTS[g]}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- add child
export function AddChildForm({ first }: { first: boolean }) {
  const { run, pending, msg, router } = useRun();
  const [v, setV] = useState({ name: "", email: "", pin: "" });
  const [cls, setCls] = useState<{ grade: number | null; group: string | null }>({ grade: null, group: null });
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => setV({ ...v, [k]: e.target.value });

  return (
    <form
      className={`${card} mt-4 flex max-w-[520px] flex-col gap-3.5`}
      onSubmit={(e) => {
        e.preventDefault();
        if (!cls.grade || !cls.group) return;
        run(() => addChild({ ...v, grade: cls.grade!, group: cls.group! }), (r) => router.push(`/parent?kid=${r.kidId}&tab=rewards`));
      }}
    >
      <h2 className="text-[1.6rem] font-extrabold">{first ? "Add your child to get started" : "Add a child"}</h2>
      <p className="text-muted">Your child signs in with this email and PIN. You choose their class, and they will see only that class’s subjects.</p>
      <div>
        <label htmlFor="kn" className={label}>Child’s name</label>
        <input id="kn" required value={v.name} onChange={set("name")} className={input} />
      </div>
      <div>
        <label htmlFor="ke" className={label}>Child’s email</label>
        <input id="ke" type="email" required value={v.email} onChange={set("email")} className={input} />
      </div>
      <div>
        <label htmlFor="kp" className={label}>4-digit PIN</label>
        <input
          id="kp" required inputMode="numeric" maxLength={4} pattern="\d{4}" autoComplete="off"
          value={v.pin} onChange={set("pin")} className={input}
        />
      </div>
      <div>
        <span className={label}>Class</span>
        <ClassPicker grade={cls.grade} group={cls.group} onChange={(grade, group) => setCls({ grade, group })} />
      </div>
      <Msg msg={msg} />
      <div>
        <button type="submit" disabled={pending || !cls.grade || !cls.group} className={btn}>{pending ? "Adding…" : "Add child"}</button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------- bonus points
export function BonusForm({ kidId }: { kidId: string }) {
  const { run, pending, msg } = useRun();
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  return (
    <form
      className="mt-2.5 flex flex-col gap-2.5"
      onSubmit={(e) => {
        e.preventDefault();
        run(() => giveBonus(kidId, Number(amount), reason), () => { setAmount(""); setReason(""); });
      }}
    >
      <div className="flex flex-wrap gap-3">
        <input
          type="number" required placeholder="e.g. 200 or -100" aria-label="Points"
          value={amount} onChange={(e) => setAmount(e.target.value)} className={`${input} max-w-[180px]`}
        />
        <input
          placeholder="Reason" aria-label="Reason" value={reason}
          onChange={(e) => setReason(e.target.value)} className={`${input} min-w-[180px] flex-1`}
        />
        <button type="submit" disabled={pending} className={btn}>Apply</button>
      </div>
      <Msg msg={msg} />
    </form>
  );
}

// ---------------------------------------------------------------- rewards
type Row = { key: string; id?: string; points: string; reward: string; tier: Tier };

export function RewardsEditor({ kidId, initial }: { kidId: string; initial: MilestoneInput[] }) {
  const { run, pending, msg } = useRun();
  const [rows, setRows] = useState<Row[]>(
    initial.map((m) => ({ key: m.id!, id: m.id, points: String(m.points), reward: m.reward, tier: m.tier })),
  );
  const update = (key: string, patch: Partial<Row>) =>
    setRows(rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  return (
    <div className="flex flex-col gap-3.5">
      {rows.map((r) => (
        <div key={r.key} className="grid grid-cols-2 items-center gap-2 sm:grid-cols-[110px_1fr_140px_auto]">
          <input type="number" aria-label="Points" value={r.points} onChange={(e) => update(r.key, { points: e.target.value })} className={input} />
          <input aria-label="Reward" value={r.reward} onChange={(e) => update(r.key, { reward: e.target.value })} className={input} />
          <select aria-label="Badge" value={r.tier} onChange={(e) => update(r.key, { tier: e.target.value as Tier })} className={input}>
            {TIER_IDS.map((t) => (
              <option key={t} value={t}>{TIERS[t].i} {TIERS[t].n}</option>
            ))}
          </select>
          <button type="button" className={`${btnBad} ${sm}`} onClick={() => setRows(rows.filter((x) => x.key !== r.key))}>
            Remove
          </button>
        </div>
      ))}
      <div className="flex flex-wrap gap-3">
        <button
          type="button" className={`${btnSoft} ${sm}`}
          onClick={() => setRows([...rows, { key: crypto.randomUUID(), points: "", reward: "", tier: "bronze" }])}
        >
          + Add reward
        </button>
        <button
          type="button" disabled={pending} className={btn}
          onClick={() =>
            run(() => saveMilestones(kidId, rows.map((r) => ({ id: r.id, points: Number(r.points), reward: r.reward, tier: r.tier }))))
          }
        >
          Save rewards
        </button>
      </div>
      <Msg msg={msg} />
    </div>
  );
}

export function MarkGivenButton({ id }: { id: string }) {
  const { run, pending } = useRun();
  return (
    <button disabled={pending} className={`${btnGood} ${sm}`} onClick={() => run(() => markRewardGiven(id))}>
      Mark as given
    </button>
  );
}

// ---------------------------------------------------------------- notebook
export function NotebookButtons({ kidId, chapterId }: { kidId: string; chapterId: string }) {
  const { run, pending, msg } = useRun();
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <button disabled={pending} className={`${btnGood} ${sm}`} onClick={() => run(() => reviewNotebook(kidId, chapterId, true))}>
          Approve
        </button>
        <button disabled={pending} className={`${btnBad} ${sm}`} onClick={() => run(() => reviewNotebook(kidId, chapterId, false))}>
          Ask to redo
        </button>
      </div>
      <Msg msg={msg} />
    </div>
  );
}

// ---------------------------------------------------------------- video links
export type VideoSubject = {
  id: string; name: string; emoji: string; chapters: { id: string; title: string; url: string }[];
};

export function VideoLinksForm({ kidId, channel, subjects }: { kidId: string; channel: string; subjects: VideoSubject[] }) {
  const { run, pending, msg } = useRun();
  const [ch, setCh] = useState(channel);
  const [links, setLinks] = useState<Record<string, string>>(
    Object.fromEntries(subjects.flatMap((s) => s.chapters.map((c) => [c.id, c.url]))),
  );

  return (
    <div className={`${card} flex flex-col gap-3.5`}>
      <div>
        <h3 className="text-[1.15rem] font-bold">Video links</h3>
        <p className="text-[0.88rem] text-muted">
          Chapters without a link open a YouTube search for that chapter from the teacher or channel below. For
          the exact lesson, paste its link: a YouTube video from the PW channel, or a pw.live link if your child
          has a PW batch.
        </p>
      </div>
      <div>
        <label htmlFor="vch" className={label}>Preferred teacher or channel</label>
        <input id="vch" value={ch} placeholder="e.g. Physics Wallah, JEE Wallah" onChange={(e) => setCh(e.target.value)} className={input} />
      </div>
      {subjects.map((s) => (
        <div key={s.id}>
          <b>{s.emoji} {s.name}</b>
          {s.chapters.map((c) => (
            <div key={c.id} className="mt-2">
              <label htmlFor={`v_${c.id}`} className="mb-1.5 block text-[0.88rem] font-bold">{c.title}</label>
              <input
                id={`v_${c.id}`} placeholder="YouTube or pw.live link" value={links[c.id] ?? ""}
                onChange={(e) => setLinks({ ...links, [c.id]: e.target.value })} className={input}
              />
            </div>
          ))}
        </div>
      ))}
      <Msg msg={msg} />
      <div>
        <button disabled={pending} className={btn} onClick={() => run(() => saveVideoLinks(kidId, { channel: ch, links }))}>
          Save video links
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- child settings
export function ChildSettings({ kidId, name, classText, grade: g0, group: gr0 }: { kidId: string; name: string; classText: string; grade: number | null; group: string | null }) {
  const { run, pending, msg, router } = useRun();
  const [n, setN] = useState(name);
  const [pin, setPin] = useState("");
  const [cls, setCls] = useState<{ grade: number | null; group: string | null }>({ grade: g0, group: gr0 });
  const classChanged = cls.grade !== g0 || cls.group !== gr0;

  return (
    <div className={`${card} flex max-w-[520px] flex-col gap-3.5`}>
      <h3 className="text-[1.15rem] font-bold">{name}’s settings</h3>
      <div>
        <label htmlFor="sn" className={label}>Name</label>
        <input id="sn" value={n} onChange={(e) => setN(e.target.value)} className={input} />
      </div>
      <div>
        <label htmlFor="sp" className={label}>New PIN</label>
        <input
          id="sp" inputMode="numeric" maxLength={4} autoComplete="off" placeholder="Leave blank to keep the current PIN"
          value={pin} onChange={(e) => setPin(e.target.value)} className={input}
        />
      </div>
      <div>
        <span className={label}>Class and group</span>
        <p className="mb-2">Now: <b>{classText}</b>. Only you can change this. {name} sees only this class’s subjects.</p>
        <ClassPicker grade={cls.grade} group={cls.group} onChange={(grade, group) => setCls({ grade, group })} />
        {classChanged && (
          <div className="mt-2.5">
            <p className="mb-2 text-[0.88rem] text-muted">Changing the class changes the subjects. Points and past results stay. A test in progress is cleared.</p>
            <button
              type="button" disabled={pending || !cls.grade || !cls.group} className={btn}
              onClick={() => { if (cls.grade && cls.group && confirm(`Change ${name}’s class?`)) run(() => setChildClass(kidId, cls.grade!, cls.group!)); }}
            >
              Save class
            </button>
          </div>
        )}
      </div>
      <Msg msg={msg} />
      <div className="flex flex-wrap gap-3">
        <button disabled={pending} className={btn} onClick={() => run(() => saveChildSettings(kidId, { name: n, pin }), () => setPin(""))}>
          Save
        </button>
        <button
          disabled={pending} className={btnBad}
          onClick={() => {
            if (confirm("Remove this child and all their progress?"))
              run(() => removeChild(kidId), () => router.push("/parent"));
          }}
        >
          Remove child
        </button>
      </div>
    </div>
  );
}

