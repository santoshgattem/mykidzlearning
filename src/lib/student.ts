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

  const [{ data: student }, { data: subjects }, { data: chapters }, { data: progress }, { data: milestones }, { data: links }] =
    await Promise.all([
      supabase.from("students").select("id, grade, grp, points, preferred_channel").eq("id", user.id).single(),
      supabase.from("subjects").select("id, name, emoji, color_key, position").order("position"),
      supabase.from("chapters").select("id, subject_id, title, position, default_video_url").order("position"),
      supabase.from("chapter_progress").select("chapter_id, watched_at, completed_level, completed_points, notebook_status").eq("student_id", user.id),
      supabase.from("milestones").select("id, points, reward, tier, given_at, celebrated_at").eq("student_id", user.id).order("points"),
      supabase.from("chapter_video_links").select("chapter_id, url").eq("student_id", user.id),
    ]);

  // The test in progress is server-only data, so it is read with the service role (own id only).
  const { data: session } = await createAdminClient()
    .from("test_sessions")
    .select("chapter_id")
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

  const passed = (id: string) => progressMap.get(id)?.completed_level != null;
  const doneCount = myChapters.filter((c) => passed(c.id)).length;
  const pct = syllabusPct(doneCount, myChapters.length);
  const level = levelForPct(pct) as Level;

  // Chapters unlock in order: the first one always, the rest when the one before is passed.
  const unlocked = (c: Chapter) => {
    const list = chaptersOf(c.subject_id);
    const i = list.findIndex((x) => x.id === c.id);
    return i === 0 || (i > 0 && passed(list[i - 1].id));
  };

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
    unlocked,
    pct,
    level,
    milestones: ms,
    badge,
    nextChapter,
    videoUrl,
    subjectOf,
    sessionChapterId: (session?.chapter_id ?? null) as string | null,
    toCelebrate: ms.filter((m) => points >= m.points && !m.celebrated_at),
  };
});

export type StudentContext = Awaited<ReturnType<typeof getStudentContext>>;
