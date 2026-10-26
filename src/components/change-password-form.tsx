"use client";

import { useActionState } from "react";
import { btn, card, errorText, input, label } from "@/components/ui";
import { changePassword } from "@/app/actions/auth";

export function ChangePasswordForm({
  askCurrent,
  title,
  intro,
}: {
  askCurrent: boolean;
  title: string;
  intro?: string;
}) {
  const [state, formAction, pending] = useActionState(changePassword, undefined);

  return (
    <form action={formAction} className={`${card} flex max-w-[460px] flex-col gap-3.5`}>
      <h2 className="text-[1.6rem] font-extrabold">{title}</h2>
      {intro && <p className="text-muted">{intro}</p>}
      {askCurrent && (
        <div>
          <label htmlFor="currentPassword" className={label}>
            Current password
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
            className={input}
          />
        </div>
      )}
      <div>
        <label htmlFor="newPassword" className={label}>
          New password
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className={input}
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className={label}>
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          className={input}
        />
      </div>
      <div role="alert" className={errorText}>
        {state?.error}
      </div>
      {state?.success && <p className="font-bold text-good">{state.success}</p>}
      <div>
        <button type="submit" disabled={pending} className={btn}>
          {pending ? "Saving…" : "Save password"}
        </button>
      </div>
    </form>
  );
}
