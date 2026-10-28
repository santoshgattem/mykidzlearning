"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { savePaperAnswer, submitPaper } from "@/app/student/papers/actions";
import { btn, btnGhost, btnSoft, errorText, input } from "@/components/ui";

type Q = { id: string; position: number; subject: "phy" | "chem" | "math"; section: "mcq" | "num"; prompt: string; options: string[] | null };
type Props = {
  attemptId: string;
  paperId: string;
  title: string;
  questions: Q[];
  initial: Record<string, number>;
  deadline: string;
  serverNow: number;
};

const SUBJECTS = [
  { id: "phy", name: "Physics", color: "var(--phy)" },
  { id: "chem", name: "Chemistry", color: "var(--chem)" },
  { id: "math", name: "Maths", color: "var(--math)" },
] as const;

const hms = (s: number) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(x).padStart(2, "0")}`;
};

export function PaperRunner({ attemptId, paperId, title, questions, initial, deadline, serverNow }: Props) {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>(initial);
  // What is typed in a numerical box (kept as text so "-" or "1." can be typed on the way to a number).
  const [typed, setTyped] = useState<Record<string, string>>(() =>
    Object.fromEntries(questions.filter((q) => q.section === "num" && initial[q.id] !== undefined).map((q) => [q.id, String(initial[q.id])])),
  );
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const done = useRef(false);

  // ---- countdown: the deadline is the server's; the browser only displays it.
  const offset = useRef(Date.now() - serverNow);
  const left = () => Math.max(0, Math.ceil((new Date(deadline).getTime() - (Date.now() - offset.current)) / 1000));
  const [secs, setSecs] = useState(left);

  const submit = useCallback(
    (auto: boolean) => {
      if (done.current) return;
      done.current = true;
      start(async () => {
        const r = await submitPaper(attemptId);
        if (r.ok) router.push(`/student/papers/result/${attemptId}`);
        else {
          done.current = false;
          setError(r.error);
        }
        void auto;
      });
    },
    [attemptId, router],
  );

  useEffect(() => {
    const t = setInterval(() => {
      const s = left();
      setSecs(s);
      if (s <= 0) submit(true);
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submit]);

  const q = questions[i];
  const answered = (id: string) => answers[id] !== undefined;
  const counts = useMemo(() => {
    const a = questions.filter((x) => answers[x.id] !== undefined).length;
    return { answered: a, left: questions.length - a, marked: marked.size };
  }, [questions, answers, marked]);

  const persist = (id: string, v: number | null) => {
    setAnswers((p) => {
      const n = { ...p };
      if (v === null) delete n[id];
      else n[id] = v;
      return n;
    });
    savePaperAnswer(attemptId, id, v).then((ok) => {
      if (!ok && left() > 30) setError("Couldn’t save that answer. Check your connection.");
      else if (ok) setError("");
    });
  };

  // Numerical answers are saved shortly after typing stops.
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onNum = (id: string, text: string) => {
    if (!/^-?\d*\.?\d*(e-?\d*)?$/i.test(text)) return; // digits, one dot, minus, e
    setTyped((p) => ({ ...p, [id]: text }));
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const n = Number(text);
      if (text.trim() === "" || !Number.isFinite(n)) persist(id, null);
      else persist(id, n);
    }, 500);
  };

  const subjectStart = (s: string) => questions.findIndex((x) => x.subject === s);
  const low = secs <= 600;

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-5 mb-3 flex flex-wrap items-center justify-between gap-2 border-b-2 border-line bg-bg px-5 py-2.5">
        <b className="text-[0.95rem]">{title}</b>
        <span className={`font-display text-[1.3rem] font-extrabold tabular-nums ${low ? "text-bad" : ""}`} aria-live="off" role="timer">
          ⏱ {hms(secs)}
        </span>
      </div>

      <div className="mb-3 flex flex-wrap gap-2" role="tablist" aria-label="Subject">
        {SUBJECTS.map((s) => {
          const on = q.subject === s.id;
          return (
            <button
              key={s.id}
              role="tab"
              aria-selected={on}
              onClick={() => setI(Math.max(0, subjectStart(s.id)))}
              className="rounded-full border-2 px-4 py-1.5 font-bold"
              style={on ? { background: s.color, borderColor: s.color, color: "#fff" } : { borderColor: "var(--line)" }}
            >
              {s.name}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="rounded-[18px] border-2 border-line bg-surface p-[18px]">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-[0.85rem] text-muted">
            <span>
              Question {i + 1} of {questions.length} · {q.section === "mcq" ? "Multiple choice (+4, −1)" : "Numerical (+4, no negative)"}
            </span>
            {marked.has(q.id) && <span className="font-bold text-bad">Marked for review</span>}
          </div>
          <p className="whitespace-pre-line text-[1.05rem] font-bold">{q.prompt}</p>

          {q.section === "mcq" ? (
            <div role="radiogroup" aria-label="Options" className="mt-3 grid gap-2">
              {q.options!.map((o, j) => {
                const on = answers[q.id] === j;
                return (
                  <label
                    key={j}
                    className={`flex cursor-pointer items-start gap-2.5 rounded-xl border-2 px-3 py-2.5 font-semibold ${on ? "border-primary bg-primary/10" : "border-line"}`}
                  >
                    <input type="radio" name={q.id} checked={on} onChange={() => persist(q.id, j)} className="mt-1" />
                    <span><b>{"ABCD"[j]}.</b> {o}</span>
                  </label>
                );
              })}
            </div>
          ) : (
            <div className="mt-3">
              <label className="mb-1.5 block text-[0.9rem] font-bold" htmlFor="num">Your answer (a number)</label>
              <input
                id="num"
                className={`${input} max-w-[260px]`}
                inputMode="decimal"
                autoComplete="off"
                value={typed[q.id] ?? ""}
                onChange={(e) => onNum(q.id, e.target.value)}
                placeholder="e.g. 12 or 0.25"
              />
              <p className="mt-1 text-[0.82rem] text-muted">Give the value as asked. Round only if the question says so.</p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2.5">
            <button className={`${btnGhost} !py-2`} disabled={i === 0} onClick={() => setI(i - 1)}>← Previous</button>
            <button className={`${btn} !py-2`} disabled={i === questions.length - 1} onClick={() => setI(i + 1)}>Next →</button>
            <button
              className={`${btnSoft} !py-2`}
              onClick={() => {
                if (q.section === "num") setTyped((p) => ({ ...p, [q.id]: "" }));
                persist(q.id, null);
              }}
              disabled={!answered(q.id)}
            >
              Clear answer
            </button>
            <button
              className={`${btnSoft} !py-2`}
              onClick={() => setMarked((m) => { const n = new Set(m); if (n.has(q.id)) n.delete(q.id); else n.add(q.id); return n; })}
            >
              {marked.has(q.id) ? "Unmark review" : "Mark for review"}
            </button>
          </div>
          {error && <div role="alert" className={`${errorText} mt-2`}>{error}</div>}
        </div>

        <aside className="rounded-[18px] border-2 border-line bg-surface p-[14px]" aria-label="Question palette">
          {SUBJECTS.map((s) => (
            <div key={s.id} className="mb-3">
              <div className="mb-1.5 text-[0.82rem] font-bold" style={{ color: s.color }}>{s.name}</div>
              <div className="grid grid-cols-6 gap-1.5">
                {questions.map((x, n) =>
                  x.subject !== s.id ? null : (
                    <button
                      key={x.id}
                      onClick={() => setI(n)}
                      aria-label={`Question ${n + 1}${answered(x.id) ? ", answered" : ""}${marked.has(x.id) ? ", marked" : ""}`}
                      className={`grid h-8 place-items-center rounded-lg border-2 text-[0.8rem] font-bold ${
                        answered(x.id) ? "border-primary bg-primary text-primary-ink" : "border-line"
                      } ${marked.has(x.id) ? "!border-bad" : ""} ${n === i ? "outline outline-2 outline-offset-1 outline-primary" : ""}`}
                    >
                      {n + 1}
                    </button>
                  ),
                )}
              </div>
            </div>
          ))}
          <div className="mb-3 text-[0.8rem] text-muted">Filled = answered · red edge = marked for review</div>
          <button className={`${btn} w-full`} onClick={() => setConfirming(true)} disabled={pending}>
            Submit paper
          </button>
        </aside>
      </div>

      {confirming && (
        <div role="dialog" aria-modal="true" aria-label="Submit the paper" className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-5">
          <div className="max-w-[420px] rounded-[22px] bg-surface p-6">
            <h3 className="text-[1.3rem] font-extrabold">Submit the paper?</h3>
            <p className="mt-2">
              You have answered <b>{counts.answered}</b> of {questions.length}. <b>{counts.left}</b> are unanswered
              {counts.marked ? `, and ${counts.marked} marked for review` : ""}. You cannot change anything after you submit.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <button className={btn} disabled={pending} onClick={() => submit(false)}>
                {pending ? "Marking…" : "Yes, submit"}
              </button>
              <button className={btnGhost} disabled={pending} onClick={() => setConfirming(false)}>Go back</button>
            </div>
          </div>
        </div>
      )}
      <span hidden>{paperId}</span>
    </div>
  );
}
