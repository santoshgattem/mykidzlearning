"use server";

import { allowAttempts, clientIp, CONTACT_LIMITS, contactEmailKey, contactIpKey } from "@/lib/limiter";
import { esc, mailConfigured, sendMail } from "@/lib/mail";
import { createAdminClient } from "@/lib/supabase/admin";

export type ContactState = { ok: true; message: string } | { ok: false; error: string } | undefined;

const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 254;
// Plain text only: line breaks are kept in the message, other control characters are dropped.
const clean = (v: FormDataEntryValue | null, max: number, keepNewlines = false) =>
  String(v ?? "").replace(/\r\n?/g, "\n").replace(keepNewlines ? /[\u0000-\u0009\u000B-\u001F\u007F]+/g : /[\u0000-\u001F\u007F]+/g, " ").trim().slice(0, max);

const THANKS = "Thank you. Your message has been sent to the admin, who will reply by email.";

// Public form on the main page. Spam protection: a hidden field that people leave empty, and limits per
// network address and per email. The message is stored for the admin portal and the admins are emailed.
export async function sendContactMessage(_prev: ContactState, form: FormData): Promise<ContactState> {
  if (clean(form.get("website"), 100)) return { ok: true, message: THANKS }; // a bot filled the hidden field: pretend it worked
  const name = clean(form.get("name"), 80);
  const email = clean(form.get("email"), 254).toLowerCase();
  const phone = clean(form.get("phone"), 30);
  const message = clean(form.get("message"), 1000, true);
  if (!name) return { ok: false, error: "Please enter your name." };
  if (!validEmail(email)) return { ok: false, error: "Please enter a valid email address so the admin can reply." };
  if (message.length < 5) return { ok: false, error: "Please write your message." };

  const ok = await allowAttempts([
    { key: contactIpKey(await clientIp()), ...CONTACT_LIMITS.perIp },
    { key: contactEmailKey(email), ...CONTACT_LIMITS.perEmail },
  ]);
  if (!ok) return { ok: false, error: "Too many messages. Please try again later." };

  const db = createAdminClient();
  const { error } = await db.from("contact_messages").insert({ full_name: name, email, phone: phone || null, message });
  if (error) return { ok: false, error: "Couldn’t send your message. Please try again." };

  if (mailConfigured()) {
    const { data: admins } = await db.from("profiles").select("email").eq("role", "admin").eq("disabled", false);
    const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "").startsWith("https://") ? process.env.NEXT_PUBLIC_SITE_URL! : "https://www.mykidzlearning.com";
    for (const a of admins ?? []) {
      await sendMail(
        a.email,
        `Message from ${name} on mykidzlearning`,
        `${name} (${email}${phone ? ", " + phone : ""}) wrote:\n\n${message}\n\nReply to them by email, and mark it done in the admin portal: ${site}/admin\n`,
        `<p><b>${esc(name)}</b> (${esc(email)}${phone ? ", " + esc(phone) : ""}) wrote:</p><p style="white-space:pre-line">${esc(message)}</p><p>Reply to them by email, and mark it done in the <a href="${site}/admin">admin portal</a>.</p>`,
      );
    }
  }
  return { ok: true, message: THANKS };
}
