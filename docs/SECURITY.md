# Security review (Phase 6)

## What was checked

| Area | Result |
|---|---|
| Row Level Security, every table, as admin / parent / other parent / student / anonymous | 79 of 79 checks pass |
| Secrets in anything the browser receives (29 files scanned) | None found |
| `npm audit` | 0 vulnerabilities |
| Every server action re-checks the caller's role (`requireAdmin`, `requireParent`, `requireStudent`) | Yes |
| Security headers (CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, COOP) | Present on every response |
| Session cookies | httpOnly, SameSite=Lax, Secure in production |
| Passwords and PINs | Only in Supabase Auth (hashed). Student PIN is combined with a server-only pepper |
| Correct answers | Stored in `question_answers` with no policies; never sent to the browser |
| Points | Only changed by the `add_points` function, callable by the service role only |

## Flows tested by clicking through

- Staff sign-in limiter: five wrong tries show "incorrect", the sixth shows "Too many sign-in attempts".
- Student PIN lockout (5 tries / 15 minutes) and PIN change by the parent (old PIN rejected, new PIN works).
- Admin: create parent, reset password, disable (parent and children cannot sign in), enable.
- Parent: forced password change, add child, rewards, bonus points, mark reward given, video link validation, PIN change, notebook approval (+50 verified in the points history).
- Student: set-up, celebration, notebook submission, timed tests.

## Fixed during the review

- Sessions now end when a password is reset, a PIN is changed or an account is disabled.
- Sign-in is rate-limited per email and per IP in the database.
- A forced password change used to leave the user on the login page; it now signs them back in.
- The notebook approval cannot be double-clicked into paying twice.

## Known gaps and notes

- **AI grading has not been tested live.** It needs `ANTHROPIC_API_KEY`. Until it is set, written answers use the key-term fallback.
- Not re-run in the browser after the last fixes: the timer auto-submit at 0:00, Level 2-4 tests, admin "Delete parent", parent "Remove child", and the admin's voluntary password change. Their server code was reviewed and each checks the caller's role.
- The CSP allows `'unsafe-inline'` scripts because Next.js needs it. Moving to nonces is a later hardening step.
- The per-IP limit (60 per 15 minutes) is shared by everyone behind the same network (a school, for example). Raise it if that causes trouble.
- An attacker who knows a student's email can lock that student out for 15 minutes by guessing wrongly. This is the cost of a 4-digit PIN; the parent can reset the PIN.
- The limiter fails open (and logs) if the database call itself fails.

## Before going live: dashboard checklist

Supabase
- [ ] Authentication > Sign In / Providers: **disable "Allow new users to sign up"** (accounts are created by admins only).
- [ ] Email provider: confirm-email setting does not matter (users are created pre-confirmed), but leave it on.
- [ ] Authentication > Rate Limits: keep the defaults or tighten them.
- [ ] Authentication > Password protection: turn on leaked-password protection (needs a paid plan; skip if unavailable).
- [ ] Authentication > URL Configuration: set Site URL to `https://mykidzlearning.com`.
- [ ] Settings > API: the service role key is only in Vercel's server environment variables.
- [ ] Back up: turn on daily backups if the plan allows it.

Vercel
- [ ] Add every variable from `.env.example` (including `STUDENT_PIN_PEPPER`; use the same value as local, or existing students cannot sign in).
- [ ] Only `NEXT_PUBLIC_*` values are visible to the browser; do not prefix the service role key or the Anthropic key.
- [ ] Add `ANTHROPIC_API_KEY`, then test one written answer.
- [ ] Set a spend limit in the Anthropic console.

Accounts
- [ ] Use a strong, unique password and 2-step verification on the Supabase, Vercel, GitHub, Anthropic and domain accounts.
