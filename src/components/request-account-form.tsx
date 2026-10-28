"use client";

import { useActionState } from "react";
import { requestAnotherParent, requestParentAccount } from "@/app/actions/requests";
import { btn, card, errorText, input, label } from "@/components/ui";

// "Ask the admin for a parent account". Public on the sign-in page (someone new), or inside the
// parent portal (a parent asking for a partner's account).
export function RequestAccountForm({ signedIn = false, compact = false }: { signedIn?: boolean; compact?: boolean }) {
  const [state, action, pending] = useActionState(signedIn ? requestAnotherParent : requestParentAccount, undefined);

  if (state?.ok) {
    return (
      <div className={`${compact ? "" : card} mx-auto max-w-[460px]`} role="status">
        <h3 className="text-[1.25rem] font-extrabold">Request sent ✓</h3>
        <p className="mt-1.5">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className={`${compact ? "" : card} mx-auto flex max-w-[460px] flex-col gap-3.5`}>
      {!compact && (
        <>
          <h2 className="text-[1.6rem] font-extrabold">Request a parent account</h2>
          <p className="text-muted">
            Accounts are created by the mykidzlearning admin. Tell us who you are and we will set one up and share the sign-in details with you.
          </p>
        </>
      )}
      <div>
        <label htmlFor="req-name" className={label}>Name</label>
        <input id="req-name" name="name" required maxLength={80} autoComplete="name" className={input} />
      </div>
      <div>
        <label htmlFor="req-email" className={label}>Email</label>
        <input id="req-email" name="email" type="email" required maxLength={254} autoComplete="email" className={input} />
      </div>
      <div>
        <label htmlFor="req-phone" className={label}>Phone (optional)</label>
        <input id="req-phone" name="phone" type="tel" maxLength={30} autoComplete="tel" className={input} />
      </div>
      <div>
        <label htmlFor="req-msg" className={label}>Message (optional)</label>
        <textarea id="req-msg" name="message" maxLength={500} rows={3} className={input} placeholder="For example: my child’s name and class" />
      </div>
      {/* Left empty by people. Simple bots fill it in, and the request is then quietly dropped. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", height: 0, overflow: "hidden" }}>
        <label htmlFor="req-site">Website</label>
        <input id="req-site" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div role="alert" className={errorText}>{state && !state.ok ? state.error : ""}</div>
      <div>
        <button className={btn} disabled={pending}>{pending ? "Sending…" : "Send request"}</button>
      </div>
    </form>
  );
}
