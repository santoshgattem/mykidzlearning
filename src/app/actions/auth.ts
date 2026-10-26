"use server";

import { redirect } from "next/navigation";
import { createClient as createPlainClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser, HOME, LOGIN } from "@/lib/auth";
import { MIN_PASSWORD_LENGTH } from "@/lib/passwords";
import { PIN_LOCK_MINUTES, PIN_MAX_ATTEMPTS, PIN_REGEX, pinToPassword } from "@/lib/pin";
import { allowAttempts, clearAttempts, clientIp, emailKey, ipKey, SIGNIN_LIMITS, TOO_MANY } from "@/lib/limiter";

export type FormState = { error?: string; success?: string } | undefined;

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

// ---------------------------------------------------------------- admin / parent sign-in
export async function signInStaff(
  role: "admin" | "parent",
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = str(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const wrong = "Email or password is incorrect.";
  if (!email || !password) return { error: wrong };

  // Throttle guesses per email and per address, before anything is checked.
  const allowed = await allowAttempts([
    { key: emailKey("staff", email), ...SIGNIN_LIMITS.perEmail },
    { key: ipKey(await clientIp()), ...SIGNIN_LIMITS.perIp },
  ]);
  if (!allowed) return { error: TOO_MANY };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  // Disabled accounts are banned in Supabase Auth, which rejects the sign-in itself.
  if (error?.code === "user_banned") {
    return { error: "This account has been disabled. Contact the mykidzlearning admin." };
  }
  if (error || !data.user) return { error: wrong };

  const { data: profile } = await createAdminClient()
    .from("profiles")
    .select("role, disabled")
    .eq("id", data.user.id)
    .maybeSingle();

  // Wrong portal gets the same message as a wrong password, so roles are not revealed.
  if (!profile || profile.role !== role) {
    await supabase.auth.signOut();
    return { error: wrong };
  }
  if (profile.disabled) {
    await supabase.auth.signOut();
    return { error: "This account has been disabled. Contact the mykidzlearning admin." };
  }

  await clearAttempts(emailKey("staff", email));
  redirect(HOME[role]);
}

// ---------------------------------------------------------------- student sign-in
export async function signInStudent(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = str(formData, "email").toLowerCase();
  const pin = str(formData, "pin");
  const wrong = "Email or PIN is incorrect. Ask your parent to check them.";
  if (!email.includes("@") || !PIN_REGEX.test(pin)) return { error: wrong };

  // Counted for unknown emails too, so guessing cannot tell real accounts from made-up ones.
  // The message below is the same one the PIN lock gives, so the two look identical.
  const allowed = await allowAttempts([
    { key: emailKey("student", email), ...SIGNIN_LIMITS.perEmail },
    { key: ipKey(await clientIp()), ...SIGNIN_LIMITS.perIp },
  ]);
  if (!allowed) return { error: TOO_MANY };

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("id, disabled")
    .eq("email", email)
    .eq("role", "student")
    .maybeSingle();
  if (!profile) return { error: wrong };

  // Count this attempt first (atomic in the database), then check the PIN.
  const { data: attempt } = await admin.rpc("begin_pin_attempt", {
    p_student: profile.id,
    p_max: PIN_MAX_ATTEMPTS,
    p_lock_minutes: PIN_LOCK_MINUTES,
  });
  const row = Array.isArray(attempt) ? attempt[0] : attempt;
  if (!row?.allowed) return { error: TOO_MANY };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: pinToPassword(pin),
  });
  if (error?.code === "user_banned") {
    return { error: "Your family’s account is paused. Ask your parent to contact the admin." };
  }
  if (error) return { error: wrong };

  // Correct PIN: clear the counters, then make sure the family account is active.
  await clearAttempts(emailKey("student", email));
  await admin
    .from("students")
    .update({ pin_failed_count: 0, pin_locked_until: null })
    .eq("id", profile.id);

  const { data: student } = await admin
    .from("students")
    .select("parent_id")
    .eq("id", profile.id)
    .single();
  const { data: parent } = await admin
    .from("profiles")
    .select("disabled")
    .eq("id", student?.parent_id ?? "")
    .maybeSingle();

  if (profile.disabled || !parent || parent.disabled) {
    await supabase.auth.signOut();
    return { error: "Your family’s account is paused. Ask your parent to contact the admin." };
  }

  redirect(HOME.student);
}

// ---------------------------------------------------------------- sign out
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

// ---------------------------------------------------------------- change password
// Used for the forced change on first sign-in (no current password asked, because the
// user has just signed in with the temporary one) and for voluntary changes (asked).
export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user || user.role === "student") return { error: "Please sign in again." };

  const next = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");
  if (next.length < MIN_PASSWORD_LENGTH) {
    return { error: `Use at least ${MIN_PASSWORD_LENGTH} characters.` };
  }
  if (next !== confirm) return { error: "The two passwords don’t match." };

  if (!user.mustChangePassword) {
    const current = String(formData.get("currentPassword") ?? "");
    const probe = createPlainClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { error } = await probe.auth.signInWithPassword({ email: user.email, password: current });
    if (error) return { error: "Current password is incorrect." };
    if (current === next) return { error: "Choose a password you haven’t used just now." };
  }

  const admin = createAdminClient();
  const { error: updateError } = await admin.auth.admin.updateUserById(user.id, { password: next });
  if (updateError) return { error: "Couldn’t save the password. Try a different one." };
  await admin.from("profiles").update({ must_change_password: false }).eq("id", user.id);

  // Supabase ends existing sign-ins when a password changes, so start a fresh one here.
  // Otherwise the user would be dropped at the sign-in page right after saving.
  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email: user.email, password: next });
  if (signInError) redirect(LOGIN[user.role]);

  if (user.mustChangePassword) redirect(HOME[user.role]);
  return { success: "Password changed." };
}
