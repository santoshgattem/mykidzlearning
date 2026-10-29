"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitTest } from "@/app/student/actions";
import { btn, btnSoft, errorText, input, Tag } from "@/components/ui";
import { fmt } from "@/lib/learning";
import type { TestView } from "@/lib/test";

type Props = {
  initial: TestView;
  title: string;
  subjectColor: string;
  videoUrl: string;
  googleUrl: string;
};

const TYPE_ONLY = "Type it in your own words. Writing it yourself helps you remember.";
// Largest jump in length that typing, autocorrect or a word suggestion could cause in one step.
const MAX_TYPED_JUMP = 20;

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export function TestRunner({ initial, title, subjectColor, videoUrl, googleUrl }: Props) {
  const router = useRouter();
  const [view, setView] = useState<TestView>(initial);
  const [finished, setFinished] = useState(false);
  const [notice, setNotice] = useState(initial.notice);
  const [pending, start] = useTransition();

  // Answers typed so far. Locked (correct) questions are shown from the server's view instead.
  const [mcq, setMcq] = useState<Record<string, number>>({});
  const [fib, setFib] = useState<Record<string, string>>({});
  const [written, setWritten] = useState(initial.written.answer);

  // ---- countdown. The deadline is the server's; the browser only displays it.
  const offset = useRef(Date.now() - initial.serverNow);
  const [secsLeft, setSecsLeft] = useState(() => Math.max(0, Math.ceil((new Date(initial.deadline).getTime() - (Date.now() - offset.current)) / 1000)));
  const autoFor = useRef("");
  const answersRef = useRef({ mcq, fib, written });
  answersRef.current = { mcq, fib, written };
  const busy = useRef(false);

  // Answers must be typed. Blocks pasting (keyboard, menu, drag and drop) and any single change
  // that adds a long run of text at once, as a paste or a text-expander tool would. Normal typing,
  // autocorrect and IME composition add only a few characters per step, so they pass.
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
  const typedChange = (prev: string, next: string, set: (v: string) => void, e: React.ChangeEvent<HTMLElement>) => {
    const composing = (e.nativeEvent as InputEvent).isComposing;
    if (!composing && next.length - prev.length > MAX_TYPED_JUMP) {
      setNotice(TYPE_ONLY);
      return;
    }
    set(next);
  };

  const send = useCallback(
    (auto: boolean) => {
      if (busy.current) return;
      const a = answersRef.current;
      if (!auto) {
        if (view.mcq.some((q) => !q.ok && a.mcq[q.id] === undefined)) return setNotice("Answer every MCQ before checking.");
        if (view.fib.some((q) => !q.ok && !(a.fib[q.id] ?? "").trim())) return setNotice("Fill in every blank before checking.");
        if (!view.written.ok && !a.written.trim()) return setNotice("Write your answer before checking.");
      }
      busy.current = true;
      start(async () => {
        try {
          const r = await submitTest(view.chapterId, { mcq: a.mcq, fib: a.fib, written: a.written });
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
          setWritten(r.view.written.answer);
          window.scrollTo(0, 0);
        } finally {
          busy.current = false;
        }
      });
    },
    [view, router],
  );

  useEffect(() => {
    if (finished) return;
    const t = setInterval(() => {
      const left = Math.ceil((new Date(view.deadline).getTime() - (Date.now() - offset.current)) / 1000);
      setSecsLeft(Math.max(0, left));
      if (left <= 0 && autoFor.current !== view.deadline) {
        autoFor.current = view.deadline;
        send(true);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [view.deadline, finished, send]);

  // ---------------------------------------------------------------- the test
  const tried = view.tries > 0;
  const leftCount = view.total - view.right;
  const urgent = secsLeft <= 60;

  const head = (lbl: string, ok: boolean) => (
    <div className="flex items-center justify-between gap-2">
      <span className="inline-block rounded-full px-[9px] py-[3px] text-[0.78rem] font-bold text-white" style={{ background: subjectColor }}>
        {lbl}
      </span>
      {tried && (ok ? <Tag>Correct ✓</Tag> : <span className="text-[0.78rem] font-bold text-bad">Revise this one</span>)}
    </div>
  );

  return (
    <div>
      <Link href={`/student/chapter/${view.chapterId}`} className={`${btnSoft} !px-3 !py-[7px] !text-[0.88rem]`}>
        ← Back to chapter
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[1.6rem] font-extrabold">{title}: test</h2>
        <div className="flex items-center gap-2">
          <Tag>
            Level {view.level}: {view.levelName}
          </Tag>
          <span
            role="timer"
            aria-label={`Time left ${mmss(secsLeft)}`}
            className={`rounded-full border-2 px-3 py-1 font-display text-[1.1rem] font-extrabold tabular-nums ${urgent ? "border-bad text-bad" : "border-line text-ink"}`}
          >
            ⏱ {mmss(secsLeft)}
          </span>
        </div>
      </div>
      <p className="mb-4 mt-1.5 text-[0.88rem] text-muted">
        Get every answer right to complete this chapter and earn {fmt(view.points)} points. Correct answers stay saved, so you only redo the ones you missed. If time runs out, what you’ve entered is checked automatically and nothing is lost.
      </p>

      {notice && (
        <div role="status" className="mb-4 rounded-[18px] border-2 border-primary bg-surface p-3.5 text-[0.9rem] font-bold">
          {notice}
        </div>
      )}

      {tried && (
        <div className="mb-4 rounded-[22px] border-2 border-good bg-surface p-5">
          <h3 className="text-[1.15rem] font-bold">
            {leftCount === 1 ? "So close!" : view.right >= view.total / 2 ? "Good effort!" : "Nice start!"} You got {view.right} of {view.total} right.
          </h3>
          <p className="mt-1.5 text-[0.88rem]">
            {view.right > 0 ? "Those answers are saved. " : ""}Revise the {leftCount === 1 ? "one" : leftCount} marked “Revise this one”: rewatch that part of the video or check your notes, then try again. You’ve got this.
          </p>
          <div className="mt-2.5">
            <a className={`${btn} !px-3 !py-[7px] !text-[0.88rem]`} href={videoUrl} target="_blank" rel="noopener noreferrer">
              Rewatch video
            </a>
          </div>
        </div>
      )}

      <form
        className="flex flex-col gap-3.5"
        onSubmit={(e) => {
          e.preventDefault();
          send(false);
        }}
      >
        {view.mcq.map((q, i) => (
          <fieldset key={q.id} aria-label={`MCQ ${i + 1}`} className="rounded-[18px] border-2 border-line bg-surface p-[18px]">
            {head(`MCQ ${i + 1}`, q.ok)}
            <p className="mt-2 font-bold">{q.prompt}</p>
            {q.options.map((o, j) => {
              const locked = q.ok;
              const checked = locked ? q.answer === j : mcq[q.id] === j;
              return (
                <label
                  key={j}
                  className={`mt-2 flex cursor-pointer items-center gap-2.5 rounded-xl border-2 px-3 py-2.5 font-semibold ${locked && checked ? "border-good bg-good/10" : "border-line"}`}
                >
                  <input
                    type="radio"
                    name={`mcq-${q.id}`}
                                        disabled={locked || pending}
                    checked={checked}
                    onChange={() => setMcq({ ...mcq, [q.id]: j })}
                  />
                  {o}
                </label>
              );
            })}
          </fieldset>
        ))}

        {view.fib.map((q, i) => (
          <div key={q.id} className="rounded-[18px] border-2 border-line bg-surface p-[18px]">
            {head(`Fill in the blank ${i + 1}`, q.ok)}
            <p className="mt-2 font-bold">{q.prompt}</p>
            <input
              className={`${input} mt-2`}
              aria-label="Your answer"
              autoComplete="off"
              disabled={q.ok || pending}
              value={q.ok ? q.answer : (fib[q.id] ?? "")}
              {...typedOnly}
              onChange={(e) => typedChange(fib[q.id] ?? "", e.target.value, (v) => setFib({ ...fib, [q.id]: v }), e)}
            />
          </div>
        ))}

        <div className="rounded-[18px] border-2 border-line bg-surface p-[18px]">
          {head("Written answer", view.written.ok)}
          <p className="mt-2 font-bold">{view.written.prompt}</p>
          <div className="mt-2.5 rounded-[14px] bg-surface2 p-3.5">
            <p className="text-[0.88rem]">
              <b>Research first, then write.</b> Look this up in the lesson video, on Google, in your NCERT book or anywhere else. Then write the answer in your own words: at least {view.written.minWords} words, using the right terms. An AI teacher checks whether your explanation is actually correct.
            </p>
            <div className="mt-2.5 flex flex-wrap gap-3">
              <a className={`${btn} !px-3 !py-[7px] !text-[0.88rem]`} href={videoUrl} target="_blank" rel="noopener noreferrer">
                Rewatch video
              </a>
              <a className={`${btnSoft} !px-3 !py-[7px] !text-[0.88rem]`} href={googleUrl} target="_blank" rel="noopener noreferrer">
                Search on Google
              </a>
            </div>
          </div>
          <textarea
            className={`${input} mt-2.5 min-h-[90px] resize-y`}
            aria-label="Your answer"
            placeholder="Write in your own words…"
            disabled={view.written.ok || pending}
            value={written}
            {...typedOnly}
            onChange={(e) => typedChange(written, e.target.value, setWritten, e)}
          />
          {tried && view.written.feedback && (
            <div className={`mt-2.5 rounded-xl p-3.5 ${view.written.ok ? "bg-good/10" : "bg-primary/10"}`}>
              <b className="text-[0.88rem]">
                {view.written.ok ? "Teacher’s feedback" : "Feedback to help you revise"}
                {view.written.via === "ai" ? " (AI teacher)" : ""}
              </b>
              <p className="mt-1">{view.written.feedback}</p>
            </div>
          )}
          {view.written.hint && <p className="mt-1.5 text-[0.88rem]">{view.written.hint}</p>}
        </div>

        <div role="alert" className={errorText} />
        <div>
          <button type="submit" disabled={pending} className={btn}>
            {pending ? "Checking your answers…" : tried ? "Check my revised answers" : "Check answers"}
          </button>
        </div>
      </form>
    </div>
  );
}
