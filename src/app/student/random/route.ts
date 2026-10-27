import { NextResponse } from "next/server";
import { getStudentContext } from "@/lib/student";

// "Surprise me": opens a random chapter the student has not completed yet.
export async function GET(req: Request) {
  const ctx = await getStudentContext();
  const todo = ctx.chapters.filter((c) => !ctx.passed(c.id));
  const pool = todo.length ? todo : ctx.chapters;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  const url = new URL(pick ? `/student/chapter/${pick.id}` : "/student", req.url);
  return NextResponse.redirect(url);
}
