"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Slide = { id: string; category: "jee" | "cbse" | "neet" | "other"; year: number; headline: string; title: string; body: string; sourceName: string; sourceUrl: string };

const LABEL: Record<Slide["category"], string> = { jee: "IIT JEE", cbse: "CBSE", neet: "NEET", other: "Results" };
const COLOUR: Record<Slide["category"], string> = { jee: "var(--phy)", cbse: "var(--chem)", neet: "var(--bio)", other: "var(--primary)" };
const AUTO_MS = 7000;

// A slideshow of real results from past years. It moves on by itself, stops when someone points at it,
// touches it or tabs into it, and can be paused. It has arrows, dots, swipe and the arrow keys, and it
// does not move by itself for people who have asked their device for less motion.
export function NewsSlideshow({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false); // pointer, touch or keyboard focus is on it
  const [paused, setPaused] = useState(false); // the person pressed pause
  const [reduced, setReduced] = useState(false);
  const start = useRef<number | null>(null);
  const n = slides.length;

  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(q.matches);
    const on = () => setReduced(q.matches);
    q.addEventListener("change", on);
    return () => q.removeEventListener("change", on);
  }, []);

  const go = useCallback((to: number) => setI(((to % n) + n) % n), [n]);
  const playing = n > 1 && !hold && !paused && !reduced;

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => go(i + 1), AUTO_MS);
    return () => clearTimeout(t);
  }, [playing, i, go]);

  if (n === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Inspiring results from past years"
      className="relative overflow-hidden rounded-[28px] border-2 border-line bg-surface"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(i + 1);
        if (e.key === "ArrowLeft") go(i - 1);
      }}
      onPointerDown={(e) => { start.current = e.clientX; if (e.pointerType === "touch") setHold(true); }}
      onPointerUp={(e) => {
        if (start.current !== null) {
          const d = e.clientX - start.current;
          if (Math.abs(d) > 50) go(d < 0 ? i + 1 : i - 1);
        }
        start.current = null;
        if (e.pointerType === "touch") setHold(false);
      }}
    >
      <div className="flex transition-transform duration-500 ease-out motion-reduce:transition-none" style={{ transform: `translateX(-${i * 100}%)` }} aria-live={playing ? "off" : "polite"}>
        {slides.map((s, k) => (
          <article key={s.id} role="group" aria-roledescription="slide" aria-label={`${k + 1} of ${n}`} aria-hidden={k !== i} className="w-full flex-none p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full px-3 py-1 text-[0.8rem] font-bold text-white" style={{ background: COLOUR[s.category] }}>{LABEL[s.category]} · {s.year}</span>
            </div>
            <div className="mt-3 font-display text-[clamp(2.2rem,8vw,3.8rem)] font-extrabold leading-none" style={{ color: COLOUR[s.category] }}>{s.headline}</div>
            <h3 className="mt-3 text-[1.25rem] font-extrabold">{s.title}</h3>
            <p className="mt-1.5 max-w-[60ch] text-muted">{s.body}</p>
            <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" tabIndex={k === i ? 0 : -1} className="mt-3 inline-block text-[0.88rem] font-bold">
              Source: {s.sourceName} ↗
            </a>
          </article>
        ))}
      </div>

      {n > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-line px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <button type="button" aria-label="Previous slide" onClick={() => go(i - 1)} className="grid size-9 place-items-center rounded-full border-2 border-line font-bold">‹</button>
            <button type="button" aria-label="Next slide" onClick={() => go(i + 1)} className="grid size-9 place-items-center rounded-full border-2 border-line font-bold">›</button>
            {!reduced && (
              <button type="button" onClick={() => setPaused(!paused)} aria-pressed={paused} className="ml-1 rounded-full border-2 border-line px-3 py-1 text-[0.8rem] font-bold">
                {paused ? "▶ Play" : "⏸ Pause"}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2" role="group" aria-label="Choose a slide">
            {slides.map((s, k) => (
              <button key={s.id} type="button" aria-label={`Go to slide ${k + 1}`} aria-current={k === i} onClick={() => go(k)}
                className={`h-2.5 rounded-full transition-all ${k === i ? "w-6 bg-primary" : "w-2.5 bg-line"}`} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
