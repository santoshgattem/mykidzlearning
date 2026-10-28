"use client";

import { useMemo, useState } from "react";
import { hindi } from "@/lib/hindi";

type Props = {
  value: string;
  onChange: (v: string) => void;
  hindiOn: boolean; // convert English letters to Hindi as the child types
  disabled?: boolean;
  className?: string;
  ariaLabel: string;
  placeholder?: string;
  onBlocked: () => void; // a paste or a big jump was refused
  extra: React.HTMLAttributes<HTMLInputElement>; // the paste and drop blockers
};

const MAX_JUMP = 20;

// A text box for Hindi answers. The child types English letters ("dilli"); pressing space turns the
// word into Hindi ("दिल्ली"). Tapping one of the suggested spellings fixes a word that came out wrong.
export function HindiInput({ value, onChange, hindiOn, disabled, className, ariaLabel, placeholder, onBlocked, extra }: Props) {
  // The word just converted, with the other spellings the child can switch to.
  const [last, setLast] = useState<{ before: string; alts: string[]; chosen: string } | null>(null);

  const pending = hindiOn ? (value.match(/[A-Za-z]+$/)?.[0] ?? "") : "";
  const pendingAlts = useMemo(() => (pending ? hindi.suggest(pending, 5) : []), [pending]);
  const chips = pending ? pendingAlts : (hindiOn && last && value === last.before + last.chosen + " " ? last.alts : []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    const composing = (e.nativeEvent as InputEvent).isComposing;
    if (!composing && next.length - value.length > MAX_JUMP) return onBlocked();
    if (hindiOn && next.length > value.length && /[A-Za-z]+ $/.test(next)) {
      const tok = next.match(/([A-Za-z]+) $/)![1];
      const alts = hindi.suggest(tok, 5);
      const chosen = alts[0] ?? tok;
      const before = next.slice(0, next.length - tok.length - 1);
      setLast({ before, alts, chosen });
      return onChange(before + chosen + " ");
    }
    setLast(null);
    onChange(next);
  };

  const pick = (w: string) => {
    if (pending) {
      const before = value.slice(0, value.length - pending.length);
      setLast({ before, alts: pendingAlts, chosen: w });
      onChange(before + w + " ");
    } else if (last) {
      setLast({ ...last, chosen: w });
      onChange(last.before + w + " ");
    }
  };

  // Leaving the box converts a word still being typed.
  const handleBlur = () => {
    if (pending) {
      const before = value.slice(0, value.length - pending.length);
      onChange(before + hindi.best(pending));
    }
  };

  return (
    <div>
      <input
        className={className}
        aria-label={ariaLabel}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        {...extra}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {chips.length > 0 && !disabled && (
        <div className="mt-1.5 flex flex-wrap items-center gap-2" aria-live="polite">
          <span className="text-[0.8rem] text-muted">{pending ? "Press space to use the first one, or tap:" : "Not this word? Tap:"}</span>
          {chips.map((w) => (
            <button
              type="button"
              key={w}
              onMouseDown={(e) => e.preventDefault()} // keep the cursor in the box
              onClick={() => pick(w)}
              className={`rounded-full border-2 px-3 py-1 text-[1.15rem] font-bold ${!pending && last?.chosen === w ? "border-primary bg-primary/10" : "border-line"}`}
            >
              {w}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
