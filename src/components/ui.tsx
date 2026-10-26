import type { ReactNode } from "react";

// Shared look, taken from the prototype's classes.
const base =
  "inline-block cursor-pointer rounded-[14px] border-0 px-[18px] py-3 text-center font-bold no-underline disabled:cursor-not-allowed disabled:opacity-45";

export const btn = `${base} bg-primary text-primary-ink`;
export const btnSoft = `${base} bg-surface2 text-ink`;
export const btnGhost = `${base} border-2 border-line bg-transparent text-ink`;
export const btnGood = `${base} bg-good text-white`;
export const btnBad = `${base} border-2 border-bad bg-transparent text-bad`;
export const sm = "!rounded-[10px] !px-3 !py-[7px] !text-[0.88rem]";

export const input =
  "w-full rounded-xl border-2 border-line bg-surface px-3 py-[11px] text-ink";
export const label = "mb-1.5 block text-[0.9rem] font-bold";
export const card = "rounded-[22px] border-2 border-line bg-surface p-5";
export const errorText = "text-[0.9rem] font-bold text-bad";

export function Logo() {
  return (
    <span className="flex items-center gap-2 font-display text-[1.3rem] font-extrabold tracking-tight">
      <span className="inline-flex gap-[3px]" aria-hidden>
        <i className="block size-[9px] rounded-full bg-phy" />
        <i className="block size-[9px] rounded-full bg-chem" />
        <i className="block size-[9px] rounded-full bg-math" />
        <i className="block size-[9px] rounded-full bg-bio" />
      </span>
      mykidzlearning
    </span>
  );
}

export function TopBar({ children }: { children?: ReactNode }) {
  return (
    <header className="mx-auto flex max-w-[1100px] items-center justify-between gap-3 px-5 py-3.5">
      <Logo />
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </header>
  );
}

export function Tag({ children, bad }: { children: ReactNode; bad?: boolean }) {
  return (
    <span
      className={`inline-block rounded-full bg-surface2 px-[9px] py-[3px] text-[0.78rem] font-bold ${bad ? "text-bad" : "text-ink"}`}
    >
      {children}
    </span>
  );
}
