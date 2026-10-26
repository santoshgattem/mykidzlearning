"use client";

import { useActionState } from "react";
import Link from "next/link";
import { btn, card, errorText, input, label } from "@/components/ui";
import type { FormState } from "@/app/actions/auth";

type Props = {
  title: string;
  intro?: string;
  secret: "password" | "pin";
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  footer?: string;
};

export function SignInForm({ title, intro, secret, action, footer }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className={`${card} mx-auto flex max-w-[460px] flex-col gap-3.5`}>
      <h2 className="text-[1.6rem] font-extrabold">{title}</h2>
      {intro && <p className="text-muted">{intro}</p>}
      <div>
        <label htmlFor="email" className={label}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={input}
        />
      </div>
      <div>
        <label htmlFor="secret" className={label}>
          {secret === "pin" ? "PIN" : "Password"}
        </label>
        {secret === "pin" ? (
          <input
            id="secret"
            name="pin"
            type="password"
            inputMode="numeric"
            pattern="\d{4}"
            maxLength={4}
            autoComplete="off"
            required
            className={input}
          />
        ) : (
          <input
            id="secret"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={input}
          />
        )}
      </div>
      <div role="alert" className={errorText}>
        {state?.error}
      </div>
      <button type="submit" disabled={pending} className={`${btn} w-full`}>
        {pending ? "Signing in…" : secret === "pin" ? "Let’s go" : "Sign in"}
      </button>
      {footer && <p className="text-[0.88rem] text-muted">{footer}</p>}
      <Link href="/" className="text-[0.88rem] text-primary">
        ← Back
      </Link>
    </form>
  );
}
