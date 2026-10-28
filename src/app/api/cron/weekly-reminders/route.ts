import { NextResponse } from "next/server";
import { runReminders } from "@/lib/reminders";

// Called by Vercel Cron on Saturday evening (see vercel.json). Vercel sends
// "Authorization: Bearer <CRON_SECRET>"; anything else is refused.
// Optional ?student=<id> limits a run to one student, for testing. It still needs the secret.
export const maxDuration = 60;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(await runReminders("final", new URL(req.url).searchParams.get("student")));
}
