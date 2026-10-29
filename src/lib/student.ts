import "server-only";
import { cache } from "react";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_CHANNEL, GROUPS, levelForPct, syllabusPct, type Group, type Level, type Tier } from "@/lib/learning";

export type Subject = { id: string; name: string; emoji: string; color_key: string; position: number };
export type Chapter = { id: string; subject_id: string; title: string; position: number; default_video_url: string };
export type Progress = {
  chapter_id: string;
  watched_at: string | null;
  completed_level: number | null;
  completed_points: number;
  notebook_status: "none" | "pending" | "approved" | "redo";
};
export type Milestone = {
  id: string;
  points: number;
  reward: string;
  tier: Tier;
  given_at: string | null;
  celebrated_at: string | null;
};

// Only http(s) links are ever rendered as hrefs.
export const safeUrl = (u: string) => (/^https?:\/\//i.test(u) ? u : "");

// Everything the student pages need, read through the student's own session (RLS applies).
// Cached per request, so the layout and the page share one set of queries.
export const getStudentContext = cache(async () => {
  const user = await requireRole("student");
  const supabase = await createClient();

  const [{ data: student }, { data: subjects }, { data: chapters }, { data: progress }, { data: milestones }, { data: links }, { data: setRows }, { data: setResults }] =
    await Promise.all([
      supabase.from("students").select("id, grade, grp, points, preferred_channel, level_reached").eq("id", user.id).single(),
      supabase.from("subjects").select("id, name, emoji, color_key, position").order("position"),
      supabase.from("chapters").select("id, subject_id, title, position, default_video_url").order("position"),
      supabase.from("chapter_progress").select("chapter_id, watched_at, completed_level, completed_points, notebook_status").eq("student_id", user.id),
      supabase.from("milestones").select("id, points, reward, tier, given_at, celebrated_at").eq("student_id", user.id).order("points"),
      supabase.from("chapter_video_links").select("chapter_id, url").eq("student_id", user.id),
      supabase.from("chapter_sets").select("chapter_id, set_no"),
      supabase.from("set_results").select("chapter_id, set_no").eq("student_id", user.id),
    ]);

  // The test in progress is server-only data, so it is read with the service role (own id only).
  const { data: session } = await createAdminClient()
    .from("test_sessions")
    .select("chapter_id, set_no")
    .eq("student_id", user.id)
    .maybeSingle();

  const group = (student?.grp ?? null) as Group | null;
  const allSubjects = (subjects ?? []) as Subject[];
  const allChapters = (chapters ?? []) as Chapter[];
  const progressMap = new Map((progress ?? []).map((p) => [p.chapter_id, p as Progress]));
  const linkMap = new Map((links ?? []).map((l) => [l.chapter_id, l.url as string]));

  const mySubjects = group ? allSubjects.filter((s) => (GROUPS[group] as readonly string[]).includes(s.id)) : [];
  const myChapters = allChapters.filter((c) => mySubjects.some((s) => s.id === c.subject_id));
  const chaptersOf = (sid: string) => myChapters.filter((c) => c.subject_id === sid).sort((a, b) => a.position - b.position);

  // Sets. Every chapter has Set 1; Sets 2 and 3 exist only once their questions are written.
  const setsByChapter = new Map<string, number[]>();
  for (const r of setRows ?? []) setsByChapter.set(r.chapter_id, [...(setsByChapter.get(r.chapter_id) ?? []), r.set_no].sort());
  const setsOf = (id: string) => setsByChapter.get(id) ?? [1];
  const resultKeys = new Set((setResults ?? []).map((r) => `${r.chapter_id}:${r.set_no}`));
  // Set 1 is recorded as the chapter's completion (as it always has been); Sets 2 and 3 in set_results.
  const setPassed = (id: string, n: number) => (n === 1 ? progressMap.get(id)?.completed_level != null : resultKeys.has(`${id}:${n}`));
  const setsPassedCount = (id: string) => setsOf(id).filter((n) => setPassed(id, n)).length;
  // A chapter is complete when every set that exists for it is passed.
  const passed = (id: string) => setsOf(id).every((n) => setPassed(id, n));
  const doneCount = myChapters.filter((c) => passed(c.id)).length;
  const pct = syllabusPct(doneCount, myChapters.length);
  // Level follows syllabus completion, but never drops: adding sets must not lower anyone's level.
  const computedLevel = levelForPct(pct) as Level;
  const reached = (student?.level_reached ?? 1) as Level;
  const level = Math.max(computedLevel, reached) as Level;
  if (computedLevel > reached) {
    void createAdminClient().from("students").update({ level_reached: computedLevel }).eq("id", user.id).then(() => undefined);
  }

  // Every chapter in the student's group is open, in any order and any subject.
  // Server actions and pages still check this, so a chapter outside the group stays closed.
  const unlocked = (c: Chapter) => myChapters.some((x) => x.id === c.id);

  const points = student?.points ?? 0;
  const ms = ((milestones ?? []) as Milestone[]).sort((a, b) => a.points - b.points);
  const badge = [...ms].filter((m) => points >= m.points).pop() ?? null;

  const nextChapter =
    mySubjects.flatMap((s) => chaptersOf(s.id)).find((c) => !passed(c.id) && unlocked(c)) ?? null;

  const channel = student?.preferred_channel ?? DEFAULT_CHANNEL;
  const subjectOf = (id: string) => allSubjects.find((s) => s.id === id);
  const videoUrl = (c: Chapter) => {
    const own = safeUrl(linkMap.get(c.id) ?? "") || safeUrl(c.default_video_url);
    if (own) return own;
    const q = `${channel} Class 11 ${subjectOf(c.subject_id)?.name ?? ""} ${c.title} one shot`.replace(/\s+/g, " ").trim();
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
  };

  return {
    user,
    name: user.fullName,
    grade: (student?.grade ?? null) as number | null,
    group,
    points,
    channel,
    subjects: mySubjects,
    allSubjects,
    chapters: myChapters,
    chaptersOf,
    progressMap,
    passed,
    setsOf,
    setPassed,
    setsPassedCount,
    unlocked,
    pct,
    level,
    milestones: ms,
    badge,
    nextChapter,
    videoUrl,
    subjectOf,
    sessionChapterId: (session?.chapter_id ?? null) as string | null,
    sessionSetNo: (session?.set_no ?? 1) as number,
    toCelebrate: ms.filter((m) => points >= m.points && !m.celebrated_at),
  };
});

export type StudentContext = Awaited<ReturnType<typeof getStudentContext>>;
