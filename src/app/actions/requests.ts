"use server";

import { getCurrentUser } from "@/lib/auth";
import { allowAttempts, clientIp, REQUEST_LIMITS, requestEmailKey, requestIpKey, requestUserKey } from "@/lib/limiter";
import { esc, mailConfigured, sendMail } from "@/lib/mail";
import { createAdminClient } from "@/lib/supabase/admin";

export type RequestState = { ok: true; message: string } | { ok: false; error: string } | undefined;

const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 254;
// Plain text only: no control characters, trimmed and cut to a sensible length.
const clean = (v: FormDataEntryValue | null, max: number) => String(v ?? "").replace(/[\u0000-\u001F\u007F]+/g, " ").trim().slice(0, max);

const THANKS = "Thank you. Your request has been sent to the admin. They will create the account and share the sign-in details with you.";

// Stores a request and lets the admins know by email (if email is set up). The same reply is given
// whether or not the address already has an account, so the form cannot be used to find out who does.
async function save(f: { name: string; email: string; phone: string; message: string }, requestedBy: string | null): Promise<RequestState> {
  if (!f.name) return { ok: false, error: "Please enter your name." };
  if (!validEmail(f.email)) return { ok: false, error: "Please enter a valid email address." };

  const db = createAdminClient();
  const { data: existing } = await db.from("profiles").select("id").ilike("email", f.email).maybeSingle();
  if (existing) return { ok: true, message: THANKS };

  const { error } = await db.from("parent_requests").insert({
    full_name: f.name, email: f.email, phone: f.phone || null, message: f.message || null, requested_by: requestedBy,
  });
  // A request for this address is already waiting: nothing more to do.
  if (error) return error.code === "23505" ? { ok: true, message: THANKS } : { ok: false, error: "Couldn’t send your request. Please try again." };

  if (mailConfigured()) {
    const { data: admins } = await db.from("profiles").select("email").eq("role", "admin").eq("disabled", false);
    const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "").startsWith("https://") ? process.env.NEXT_PUBLIC_SITE_URL! : "https://www.mykidzlearning.com";
    for (const a of admins ?? []) {
      await sendMail(
        a.email,
        `New parent account request: ${f.name}`,
        `${f.name} (${f.email}${f.phone ? ", " + f.phone : ""}) has asked for a parent account.${f.message ? "\n\nMessage: " + f.message : ""}\n\nReview it in the admin portal: ${site}/admin\n`,
        `<p><b>${esc(f.name)}</b> (${esc(f.email)}${f.phone ? ", " + esc(f.phone) : ""}) has asked for a parent account.</p>${f.message ? `<p>Message: ${esc(f.message)}</p>` : ""}<p><a href="${site}/admin">Review it in the admin portal</a></p>`,
      );
    }
  }
  return { ok: true, message: THANKS };
}

// Public form on the parent sign-in page.
export async function requestParentAccount(_prev: RequestState, form: FormData): Promise<RequestState> {
  // A hidden field that people leave empty and simple bots fill in. Pretend it worked.
  if (clean(form.get("website"), 100)) return { ok: true, message: THANKS };
  const f = { name: clean(form.get("name"), 80), email: clean(form.get("email"), 254).toLowerCase(), phone: clean(form.get("phone"), 30), message: clean(form.get("message"), 500) };
  const ok = await allowAttempts([
    { key: requestIpKey(await clientIp()), ...REQUEST_LIMITS.perIp },
    ...(validEmail(f.email) ? [{ key: requestEmailKey(f.email), ...REQUEST_LIMITS.perEmail }] : []),
  ]);
  if (!ok) return { ok: false, error: "Too many requests. Please try again later." };
  return save(f, null);
}

// A signed-in parent asking for an account for someone else, such as their partner.
export async function requestAnotherParent(_prev: RequestState, form: FormData): Promise<RequestState> {
  const user = await getCurrentUser();
  if (!user || user.role !== "parent" || user.mustChangePassword) return { ok: false, error: "Please sign in again." };
  const f = { name: clean(form.get("name"), 80), email: clean(form.get("email"), 254).toLowerCase(), phone: clean(form.get("phone"), 30), message: clean(form.get("message"), 500) };
  if (!(await allowAttempts([{ key: requestUserKey(user.id), ...REQUEST_LIMITS.perParent }]))) return { ok: false, error: "You have sent several requests today. Please try again tomorrow." };
  return save(f, user.id);
}
