"use client";

import { useActionState, useEffect, useState } from "react";
import { sendContactMessage } from "@/app/actions/contact";
import { BLOCKED_MESSAGE, hasBlockedWord } from "@/lib/contact-block";
import { btn, card, errorText, input, label } from "@/components/ui";

// "Contact the admin" on the main page. Anyone can use it, signed in or not.
export function ContactAdminForm() {
  const [state, action, pending] = useActionState(sendContactMessage, undefined);
  const [text, setText] = useState("");
  const blocked = hasBlockedWord(text);
  // The pop-up shows once each time a blocked word appears; closing it keeps Send disabled until the word is removed.
  const [popup, setPopup] = useState(false);
  useEffect(() => { setPopup(blocked); }, [blocked]);

  if (state?.ok) {
    return (
      <div className={`${card} max-w-[560px]`} role="status">
        <h3 className="text-[1.25rem] font-extrabold">Message sent ✓</h3>
        <p className="mt-1.5">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className={`${card} flex max-w-[560px] flex-col gap-3.5`}>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className={label}>Your name</label>
          <input id="c-name" name="name" required maxLength={80} autoComplete="name" className={input} />
        </div>
        <div>
          <label htmlFor="c-email" className={label}>Your email</label>
          <input id="c-email" name="email" type="email" required maxLength={254} autoComplete="email" className={input} />
        </div>
      </div>
      <div>
        <label htmlFor="c-phone" className={label}>Phone (optional)</label>
        <input id="c-phone" name="phone" type="tel" maxLength={30} autoComplete="tel" className={input} />
      </div>
      <div>
        <label htmlFor="c-msg" className={label}>Your message</label>
        <textarea id="c-msg" name="message" required minLength={5} maxLength={1000} rows={4} className={input} placeholder="How can the admin help?" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      {/* Left empty by people. Simple bots fill it in, and the message is then quietly dropped. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", height: 0, overflow: "hidden" }}>
        <label htmlFor="c-site">Website</label>
        <input id="c-site" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div role="alert" className={errorText}>{blocked ? BLOCKED_MESSAGE : state && !state.ok ? state.error : ""}</div>
      <div>
        <button className={btn} disabled={pending || blocked}>{pending ? "Sending…" : "Send message"}</button>
      </div>
      {popup && (
        <div role="alertdialog" aria-modal="true" aria-label="Message not allowed" className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setPopup(false)}>
          <div className="max-w-[420px] rounded-[22px] bg-surface p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <p className="text-[1.05rem] font-bold">{BLOCKED_MESSAGE}</p>
            <button type="button" autoFocus className={`${btn} mt-4`} onClick={() => setPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </form>
  );
}
