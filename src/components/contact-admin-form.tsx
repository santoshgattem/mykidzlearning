"use client";

import { useActionState } from "react";
import { sendContactMessage } from "@/app/actions/contact";
import { btn, card, errorText, input, label } from "@/components/ui";

// "Contact the admin" on the main page. Anyone can use it, signed in or not.
export function ContactAdminForm() {
  const [state, action, pending] = useActionState(sendContactMessage, undefined);

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
        <textarea id="c-msg" name="message" required minLength={5} maxLength={1000} rows={4} className={input} placeholder="How can the admin help?" />
      </div>
      {/* Left empty by people. Simple bots fill it in, and the message is then quietly dropped. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", height: 0, overflow: "hidden" }}>
        <label htmlFor="c-site">Website</label>
        <input id="c-site" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div role="alert" className={errorText}>{state && !state.ok ? state.error : ""}</div>
      <div>
        <button className={btn} disabled={pending}>{pending ? "Sending…" : "Send message"}</button>
      </div>
    </form>
  );
}
