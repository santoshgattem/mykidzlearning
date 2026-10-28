import { NextResponse } from "next/server";
import { runReminders } from "@/lib/reminders";

// Called by Vercel Cron on Wednesday evening (see vercel.json): a nudge for students who are behind
// pace for 5 tests a week. Same secret and ?student= filter as the Saturday job.
export const maxDuration = 60;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(await runReminders("midweek", new URL(req.url).searchParams.get("student")));
}
