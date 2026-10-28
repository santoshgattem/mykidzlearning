"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { allowAttempts, clientIp, RESET_LIMITS, resetAskKey, resetIpKey, resetTryKey, revokeSessions } from "@/lib/limiter";
import { esc, mailConfigured, sendMail } from "@/lib/mail";
import { hashCode, newCode, OTP_MAX_TRIES, OTP_MINUTES, sameHash } from "@/lib/otp";
import { MIN_PASSWORD_LENGTH } from "@/lib/passwords";

// Resetting a forgotten ADMIN password with a one-time code sent to the admin's email.
// Parents are reset by an admin, as before.
export type ResetState = { step?: "email" | "code"; email?: string; error?: string } | undefined;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 254;

async function findAdmin(email: string) {
  const { data } = await createAdminClient().from("profiles").select("id, full_name, email").eq("role", "admin").eq("disabled", false).ilike("email", email).maybeSingle();
  return data;
}

// Step 1. The reply is the same whether or not the email belongs to an admin, so it cannot be used
// to find out who the admins are.
export async function sendResetCode(_prev: ResetState, form: FormData): Promise<ResetState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!validEmail(email)) return { step: "email", error: "Please enter a valid email address." };

  const ok = await allowAttempts([
    { key: resetIpKey(await clientIp()), ...RESET_LIMITS.askPerIp },
    { key: resetAskKey(email), ...RESET_LIMITS.askPerEmail },
  ]);
  if (!ok) return { step: "email", error: "Too many requests. Please wait an hour and try again." };

  const started = Date.now();
  const admin = await findAdmin(email);
  if (admin && mailConfigured()) {
    const db = createAdminClient();
    const code = newCode();
    await db.from("password_resets").delete().eq("user_id", admin.id).is("used_at", null); // only the newest code works
    await db.from("password_resets").insert({
      user_id: admin.id, code_hash: hashCode(admin.id, code), expires_at: new Date(Date.now() + OTP_MINUTES * 60_000).toISOString(),
    });
    await sendMail(
      admin.email,
      `Your mykidzlearning reset code: ${code}`,
      `Hi ${admin.full_name},\n\nYour code to reset your admin password is ${code}.\nIt works for ${OTP_MINUTES} minutes and can be used once.\n\nIf you did not ask for this, you can ignore this email. Your password has not changed.\n`,
      `<p>Hi ${esc(admin.full_name)},</p><p>Your code to reset your admin password is:</p><p style="font-size:28px;letter-spacing:6px"><b>${code}</b></p><p>It works for ${OTP_MINUTES} minutes and can be used once.</p><p>If you did not ask for this, you can ignore this email. Your password has not changed.</p>`,
    );
  }
  // Take about as long whether or not an email was sent.
  await sleep(Math.max(0, 700 - (Date.now() - started)));
  return { step: "code", email };
}

// Step 2: the code and the new password.
export async function resetAdminPassword(_prev: ResetState, form: FormData): Promise<ResetState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const code = String(form.get("code") ?? "").replace(/\s+/g, "");
  const next = String(form.get("newPassword") ?? "");
  const confirm = String(form.get("confirmPassword") ?? "");
  const at = { step: "code" as const, email };
  if (!/^\d{6}$/.test(code)) return { ...at, error: "Enter the 6-digit code from the email." };
  if (next.length < MIN_PASSWORD_LENGTH) return { ...at, error: `Use at least ${MIN_PASSWORD_LENGTH} characters for the new password.` };
  if (next !== confirm) return { ...at, error: "The two passwords don’t match." };

  const ok = await allowAttempts([
    { key: resetIpKey(await clientIp()) + ":try", ...RESET_LIMITS.tryPerIp },
    { key: resetTryKey(email), ...RESET_LIMITS.tryPerEmail },
  ]);
  if (!ok) return { ...at, error: "Too many attempts. Please wait an hour and ask for a new code." };

  const bad = { ...at, error: "That code isn’t right or has expired. Check the email, or go back and ask for a new code." };
  const admin = await findAdmin(email);
  if (!admin) return bad;

  const db = createAdminClient();
  const { data: row } = await db
    .from("password_resets").select("id, code_hash, attempts, expires_at")
    .eq("user_id", admin.id).is("used_at", null).gt("expires_at", new Date().toISOString()).order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (!row || row.attempts >= OTP_MAX_TRIES) return bad;

  // Count this try first, so rapid guesses cannot get more than the allowance.
  const { data: counted } = await db.from("password_resets").update({ attempts: row.attempts + 1 }).eq("id", row.id).eq("attempts", row.attempts).select("id");
  if (!counted?.length) return bad;
  if (!sameHash(row.code_hash, hashCode(admin.id, code))) {
    const left = OTP_MAX_TRIES - (row.attempts + 1);
    return { ...at, error: left > 0 ? `That code isn’t right. ${left} ${left === 1 ? "try" : "tries"} left.` : "Too many wrong codes. Go back and ask for a new code." };
  }

  // Right code: spend it (only one request can), then change the password.
  const { data: spent } = await db.from("password_resets").update({ used_at: new Date().toISOString() }).eq("id", row.id).is("used_at", null).select("id");
  if (!spent?.length) return bad;
  const { error } = await db.auth.admin.updateUserById(admin.id, { password: next });
  if (error) return { ...at, error: "Couldn’t save the new password. Try a different one." };
  await db.from("profiles").update({ must_change_password: false }).eq("id", admin.id);
  await db.from("password_resets").delete().eq("user_id", admin.id);
  await revokeSessions(admin.id); // every earlier sign-in ends

  if (mailConfigured()) {
    await sendMail(
      admin.email,
      "Your mykidzlearning admin password was changed",
      `Hi ${admin.full_name},\n\nYour admin password was just changed using an email code. If this was you, no action is needed. If it was not, contact another admin straight away.\n`,
      `<p>Hi ${esc(admin.full_name)},</p><p>Your admin password was just changed using an email code. If this was you, no action is needed. If it was not, contact another admin straight away.</p>`,
    );
  }
  redirect("/admin/login?reset=1");
}
