"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitKidTest } from "@/app/student/actions";
import { btn, btnSoft, input } from "@/components/ui";
import { SET_NAMES, fmt } from "@/lib/learning";
import { HindiInput } from "@/components/student/hindi-input";
import { hindi, finalizeHindi } from "@/lib/hindi";
import type { KidView } from "@/lib/kidtest";

type Props = { initial: KidView; title: string; subjectColor: string; videoUrl: string; hindi?: boolean };

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const TYPE_ONLY = "Please type it yourself. Writing it yourself helps you remember!";
const MAX_TYPED_JUMP = 20;

// The Class 3 test. Same rules as the senior test (every answer right to finish, correct answers
// stay saved, only the wrong ones are redone) in a bigger, friendlier layout.
export function KidTestRunner({ initial, title, subjectColor, videoUrl, hindi: isHindi = false }: Props) {
  const router = useRouter();
  const [view, setView] = useState<KidView>(initial);
  const [notice, setNotice] = useState(initial.notice);
  const [finished, setFinished] = useState(false);
  const [pending, start] = useTransition();
  const [mcq, setMcq] = useState<Record<string, number>>({});
  const [fib, setFib] = useState<Record<string, string>>({});
  const [short, setShort] = useState<Record<string, string>>(() => Object.fromEntries(initial.short.map((q) => [q.id, q.answer])));
  const answersRef = useRef({ mcq, fib, short });
  answersRef.current = { mcq, fib, short };
  const busy = useRef(false);
  const autoFor = useRef("");
  // Hindi chapters: English letters typed become Hindi. The child can switch it off to type English.
  const [hindiOn, setHindiOn] = useState(true);

  const offset = useRef(Date.now() - initial.serverNow);
  const [secs, setSecs] = useState(() => Math.max(0, Math.ceil((new Date(initial.deadline).getTime() - (Date.now() - offset.current)) / 1000)));

  const typedOnly = {
    onPaste: (e: React.ClipboardEvent) => { e.preventDefault(); setNotice(TYPE_ONLY); },
    onDrop: (e: React.DragEvent) => { e.preventDefault(); setNotice(TYPE_ONLY); },
    onBeforeInput: (e: React.FormEvent<HTMLElement>) => {
      const t = (e.nativeEvent as InputEvent).inputType ?? "";
      if (t === "insertFromPaste" || t === "insertFromPasteAsQuotation" || t === "insertFromDrop" || t === "insertFromYank") {
        e.preventDefault();
        setNotice(TYPE_ONLY);
      }
    },
  };
  const typed = (prev: string, next: string, set: (v: string) => void, e: React.ChangeEvent<HTMLElement>) => {
    if (!(e.nativeEvent as InputEvent).isComposing && next.length - prev.length > MAX_TYPED_JUMP) return setNotice(TYPE_ONLY);
    set(next);
  };

  const send = useCallback(
    (auto: boolean) => {
      if (busy.current) return;
      const a = answersRef.current;
      if (isHindi && hindiOn) {
        // Any word still in English letters is turned into Hindi first.
        const fix = (r: Record<string, string>) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, finalizeHindi(v, hindi.best)]));
        a.fib = fix(a.fib);
        a.short = fix(a.short);
      }
      if (!auto) {
        if (view.mcq.some((q) => !q.ok && a.mcq[q.id] === undefined)) return setNotice("Pick an answer for every question first.");
        if (view.fib.some((q) => !q.ok && !(a.fib[q.id] ?? "").trim())) return setNotice("Fill in every blank first.");
        if (view.short.some((q) => !q.ok && !(a.short[q.id] ?? "").trim())) return setNotice("Write a one-line answer for every question first.");
      }
      busy.current = true;
      start(async () => {
        try {
          const r = await submitKidTest(view.chapterId, a);
          if (r.status === "error") return setNotice(r.error);
          if (r.status === "done") {
            setFinished(true);
            router.push(`/student/test/${view.chapterId}/result${view.setNo > 1 ? `?set=${view.setNo}` : ""}`);
            return;
          }
          setView(r.view);
          offset.current = Date.now() - r.view.serverNow;
          setNotice(r.status === "late" ? r.view.notice : auto ? "Time was up, so your answers were checked as they were." : "");
          setMcq({});
          setFib({});
          setShort(Object.fromEntries(r.view.short.map((q) => [q.id, q.answer])));
          window.scrollTo(0, 0);
        } finally {
          busy.current = false;
        }
      });
    },
    [view, router, isHindi, hindiOn],
  );

  useEffect(() => {
    if (finished) return;
    const t = setInterval(() => {
      const left = Math.ceil((new Date(view.deadline).getTime() - (Date.now() - offset.current)) / 1000);
      setSecs(Math.max(0, left));
      if (left <= 0 && autoFor.current !== view.deadline) {
        autoFor.current = view.deadline;
        send(true);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [view.deadline, finished, send]);

  const tried = view.tries > 0;
  const leftCount = view.total - view.right;
  const bump = (lbl: string, ok: boolean) => (
    <div className="flex items-center justify-between gap-2">
      <span className="inline-block rounded-full px-3 py-1 text-[0.85rem] font-bold text-white" style={{ background: subjectColor }}>{lbl}</span>
      {tried && (ok ? <span className="font-bold text-good">Correct ✓</span> : <span className="text-[0.9rem] font-bold text-bad">Try this one again</span>)}
    </div>
  );
  const cardCls = "rounded-[22px] border-2 border-line bg-surface p-5 text-[1.1rem]";

  return (
    <div className="text-[1.05rem]">
      <Link href={`/student/chapter/${view.chapterId}`} className={`${btnSoft} !px-3 !py-[7px] !text-[0.9rem]`}>← Back to chapter</Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[1.7rem] font-extrabold">{title}{view.setNo > 1 ? ` · ${SET_NAMES[view.setNo as 2 | 3]}` : ""}</h2>
        <span role="timer" aria-label={`Time left ${mmss(secs)}`} className={`rounded-full border-2 px-3 py-1 font-display text-[1.1rem] font-extrabold tabular-nums ${secs <= 60 ? "border-bad text-bad" : "border-line"}`}>
          ⏱ {mmss(secs)}
        </span>
      </div>
      <p className="mb-4 mt-1.5 text-[0.95rem] text-muted">
        Answer all {view.total} questions and get them all right to earn {fmt(view.points)} points. Take your time! Right answers stay saved, so you only try again the ones you missed.
      </p>

      {isHindi && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-[18px] border-2 border-line bg-surface p-3.5 text-[0.95rem]">
          <button type="button" onClick={() => setHindiOn(!hindiOn)} aria-pressed={hindiOn} className={`${hindiOn ? btn : btnSoft} !px-3 !py-[7px] !text-[0.9rem]`}>
            {hindiOn ? "⌨️ English → हिंदी: ON" : "⌨️ English → हिंदी: OFF"}
          </button>
          <span>
            {hindiOn
              ? "Type the answer in English letters (like “dilli”) and press space. It turns into हिंदी (दिल्ली). Tap a word to fix it."
              : "Typing in English letters as they are. Switch it on to get हिंदी."}
          </span>
        </div>
      )}

      {notice && <div role="status" className="mb-4 rounded-[18px] border-2 border-primary bg-surface p-3.5 text-[0.95rem] font-bold">{notice}</div>}

      {tried && (
        <div className="mb-4 rounded-[22px] border-2 border-good bg-surface p-5">
          <h3 className="text-[1.2rem] font-bold">
            {leftCount === 1 ? "So close! 🌟" : view.right >= view.total / 2 ? "Great effort! 👏" : "Good start! 💪"} You got {view.right} of {view.total} right.
          </h3>
          <p className="mt-1.5 text-[0.95rem]">Look at the ones that say “Try this one again”, then press the button once more. You can do it!</p>
          <div className="mt-2.5"><a className={`${btn} !px-3 !py-[7px] !text-[0.9rem]`} href={videoUrl} target="_blank" rel="noopener noreferrer">Watch the video again</a></div>
        </div>
      )}

      <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); send(false); }}>
        <h3 className="text-[1.25rem] font-extrabold">🔵 Pick the right answer</h3>
        {view.mcq.map((q, i) => (
          <fieldset key={q.id} aria-label={`Question ${i + 1}`} className={cardCls}>
            {bump(`Question ${i + 1}`, q.ok)}
            <p className="mt-2 font-bold">{q.prompt}</p>
            {q.options.map((o, j) => {
              const checked = q.ok ? q.answer === j : mcq[q.id] === j;
              return (
                <label key={j} className={`mt-2 flex cursor-pointer items-center gap-3 rounded-xl border-2 px-3 py-3 font-semibold ${q.ok && checked ? "border-good bg-good/10" : checked ? "border-primary bg-primary/10" : "border-line"}`}>
                  <input type="radio" className="size-5" name={`m-${q.id}`} disabled={q.ok || pending} checked={checked} onChange={() => setMcq({ ...mcq, [q.id]: j })} />
                  <span>{o}</span>
                </label>
              );
            })}
          </fieldset>
        ))}

        <h3 className="mt-2 text-[1.25rem] font-extrabold">✏️ Fill in the blanks</h3>
        {view.fib.map((q, i) => (
          <div key={q.id} className={cardCls}>
            {bump(`Blank ${i + 1}`, q.ok)}
            <p className="mt-2 font-bold">{q.prompt}</p>
            {isHindi ? (
              <HindiInput
                className={`${input} mt-2 !text-[1.1rem]`} ariaLabel="Your answer" disabled={q.ok || pending} hindiOn={hindiOn}
                value={q.ok ? q.answer : (fib[q.id] ?? "")} extra={typedOnly} onBlocked={() => setNotice(TYPE_ONLY)}
                onChange={(v) => setFib({ ...fib, [q.id]: v })}
              />
            ) : (
              <input
                className={`${input} mt-2 !text-[1.1rem]`} aria-label="Your answer" autoComplete="off" disabled={q.ok || pending}
                value={q.ok ? q.answer : (fib[q.id] ?? "")}
                {...typedOnly}
                onChange={(e) => typed(fib[q.id] ?? "", e.target.value, (v) => setFib({ ...fib, [q.id]: v }), e)}
              />
            )}
          </div>
        ))}

        <h3 className="mt-2 text-[1.25rem] font-extrabold">📝 Answer in one line</h3>
        {view.short.map((q, i) => (
          <div key={q.id} className={cardCls}>
            {bump(`One line ${i + 1}`, q.ok)}
            <p className="mt-2 font-bold">{q.prompt}</p>
            {isHindi ? (
              <HindiInput
                className={`${input} mt-2 !text-[1.1rem]`} ariaLabel="Your one-line answer" disabled={q.ok || pending} hindiOn={hindiOn}
                placeholder="Type in English letters, press space…" value={short[q.id] ?? ""} extra={typedOnly} onBlocked={() => setNotice(TYPE_ONLY)}
                onChange={(v) => setShort({ ...short, [q.id]: v })}
              />
            ) : (
              <input
                className={`${input} mt-2 !text-[1.1rem]`} aria-label="Your one-line answer" autoComplete="off" disabled={q.ok || pending}
                placeholder="Type your answer here…"
                value={short[q.id] ?? ""}
                {...typedOnly}
                onChange={(e) => typed(short[q.id] ?? "", e.target.value, (v) => setShort({ ...short, [q.id]: v }), e)}
              />
            )}
            {tried && q.feedback && <p className={`mt-2 text-[0.95rem] ${q.ok ? "text-good" : ""}`}>💬 {q.feedback}</p>}
          </div>
        ))}

        <div><button type="submit" disabled={pending} className={`${btn} !px-6 !py-3.5 !text-[1.1rem]`}>{pending ? "Checking your answers…" : tried ? "Check again" : "Check my answers"}</button></div>
      </form>
    </div>
  );
}
