import "server-only";

// Sends one email through Resend's HTTP API. Needs RESEND_API_KEY and MAIL_FROM, for example
// "mykidzlearning <reminders@mykidzlearning.com>" (the domain must be verified in Resend).
// Returns false, and never throws, if mail is not set up or the send fails.
export const mailConfigured = () => !!process.env.RESEND_API_KEY && !!process.env.MAIL_FROM;

export async function sendMail(to: string, subject: string, text: string, html: string): Promise<boolean> {
  if (!mailConfigured()) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.MAIL_FROM, to: [to], subject, text, html }),
    });
    if (!res.ok) console.error("Mail send failed:", res.status);
    return res.ok;
  } catch (e) {
    console.error("Mail send failed:", (e as Error)?.name);
    return false;
  }
}

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
