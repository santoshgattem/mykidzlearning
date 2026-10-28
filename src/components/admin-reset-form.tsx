"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetAdminPassword, sendResetCode, type ResetState } from "@/app/actions/password-reset";
import { btn, card, errorText, input, label } from "@/components/ui";

// Two steps on one page: ask for a code by email, then enter the code and a new password.
export function AdminResetForm() {
  const [asked, ask, asking] = useActionState<ResetState, FormData>(sendResetCode, undefined);
  const [done, reset, resetting] = useActionState<ResetState, FormData>(resetAdminPassword, undefined);
  const email = done?.email ?? asked?.email ?? "";
  const onCodeStep = asked?.step === "code" || done?.step === "code";

  if (!onCodeStep) {
    return (
      <form action={ask} className={`${card} mx-auto flex max-w-[460px] flex-col gap-3.5`}>
        <h2 className="text-[1.6rem] font-extrabold">Reset your admin password</h2>
        <p className="text-muted">Enter the email of your admin account. We will email you a 6-digit code.</p>
        <div>
          <label htmlFor="fp-email" className={label}>Email</label>
          <input id="fp-email" name="email" type="email" required autoComplete="email" className={input} />
        </div>
        <div role="alert" className={errorText}>{asked?.error}</div>
        <button className={`${btn} w-full`} disabled={asking}>{asking ? "Sending…" : "Email me a code"}</button>
        <Link href="/admin/login" className="text-[0.88rem] text-primary">← Back to sign in</Link>
      </form>
    );
  }

  return (
    <form action={reset} className={`${card} mx-auto flex max-w-[460px] flex-col gap-3.5`}>
      <h2 className="text-[1.6rem] font-extrabold">Check your email</h2>
      <p className="text-muted">
        If <b>{email}</b> is an admin account, we have sent a 6-digit code. It works for 10 minutes. Enter it below with your new password.
      </p>
      <input type="hidden" name="email" value={email} />
      <div>
        <label htmlFor="fp-code" className={label}>6-digit code</label>
        <input id="fp-code" name="code" inputMode="numeric" pattern="\d{6}" maxLength={6} autoComplete="one-time-code" required className={`${input} tracking-[0.4em]`} />
      </div>
      <div>
        <label htmlFor="fp-new" className={label}>New password</label>
        <input id="fp-new" name="newPassword" type="password" minLength={8} autoComplete="new-password" required className={input} />
      </div>
      <div>
        <label htmlFor="fp-confirm" className={label}>Confirm new password</label>
        <input id="fp-confirm" name="confirmPassword" type="password" minLength={8} autoComplete="new-password" required className={input} />
      </div>
      <div role="alert" className={errorText}>{done?.error}</div>
      <button className={`${btn} w-full`} disabled={resetting}>{resetting ? "Saving…" : "Set new password"}</button>
      <Link href="/admin/forgot" className="text-[0.88rem] text-primary">Didn’t get a code? Start again</Link>
    </form>
  );
}
