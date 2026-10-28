import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

const sha = (s: string) => createHash("sha256").update(s).digest("hex").slice(0, 32);

// The caller's IP. On Vercel the first x-forwarded-for entry is the real client.
export async function clientIp() {
  const h = await headers();
  return (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "unknown").trim();
}

// Takes one attempt from each key. Returns false if ANY key is over its limit. If the
// database call itself fails, sign-in is allowed (and the error logged): the student PIN
// lockout and Supabase's own limits still apply, and a database hiccup should not lock
// every family out.
export async function allowAttempts(keys: { key: string; max: number; windowSeconds: number }[]) {
  const db = createAdminClient();
  let allowed = true;
  for (const k of keys) {
    const { data, error } = await db.rpc("rate_limit_hit", {
      p_key: k.key,
      p_max: k.max,
      p_window_seconds: k.windowSeconds,
    });
    if (error) {
      console.error("rate limit check failed:", error.code ?? error.message);
      continue;
    }
    if (data === false) allowed = false;
  }
  return allowed;
}

export async function clearAttempts(key: string) {
  await createAdminClient().rpc("rate_limit_reset", { p_key: key });
}

// Keys. Emails are hashed so the table holds no personal data.
export const emailKey = (scope: "student" | "staff", email: string) => `signin:${scope}:email:${sha(email.toLowerCase())}`;
export const ipKey = (ip: string) => `signin:ip:${sha(ip)}`;

// Account requests: a public form, so it is limited per address, per email and per signed-in parent.
export const requestIpKey = (ip: string) => `request:ip:${sha(ip)}`;
export const requestEmailKey = (email: string) => `request:email:${sha(email.toLowerCase())}`;
export const requestUserKey = (id: string) => `request:user:${id}`;
export const REQUEST_LIMITS = {
  perIp: { max: 5, windowSeconds: 60 * 60 }, // 5 an hour from one address
  perEmail: { max: 3, windowSeconds: 24 * 60 * 60 }, // 3 a day for one email address
  perParent: { max: 5, windowSeconds: 24 * 60 * 60 },
};

// Password reset codes: asking for a code and trying one are both limited.
export const resetIpKey = (ip: string) => `reset:ip:${sha(ip)}`;
export const resetAskKey = (email: string) => `reset:ask:${sha(email.toLowerCase())}`;
export const resetTryKey = (email: string) => `reset:try:${sha(email.toLowerCase())}`;
export const RESET_LIMITS = {
  askPerIp: { max: 5, windowSeconds: 60 * 60 },
  askPerEmail: { max: 3, windowSeconds: 60 * 60 },
  tryPerIp: { max: 20, windowSeconds: 60 * 60 },
  tryPerEmail: { max: 10, windowSeconds: 60 * 60 },
};

export const SIGNIN_LIMITS = {
  perEmail: { max: 5, windowSeconds: 15 * 60 }, // matches the student PIN lock: 5 tries, 15 minutes
  perIp: { max: 60, windowSeconds: 15 * 60 }, // generous: a whole school may share one address
};
export const TOO_MANY = "Too many sign-in attempts. Please wait 15 minutes and try again.";

export async function revokeSessions(userId: string) {
  const { error } = await createAdminClient().rpc("revoke_user_sessions", { p_user: userId });
  if (error) console.error("revoke sessions failed:", error.code ?? error.message);
}
