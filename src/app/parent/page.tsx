import Link from "next/link";
import {
  AddChildForm, BonusForm, ChildSettings, MarkGivenButton, NotebookButtons, RewardsEditor,
  VideoLinksForm, type VideoSubject,
} from "@/components/parent-forms";
import { RequestAccountForm } from "@/components/request-account-form";
import { btnGhost, card, sm, Tag, TopBar } from "@/components/ui";
import { signOut } from "@/app/actions/auth";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_CHANNEL, fmt, GROUPS, levelsFor, levelForPct, PTS, syllabusPct, TIERS, type Tier } from "@/lib/learning";

type SearchParams = Promise<{ kid?: string; tab?: string }>;

const TABS = [
  ["overview", "Overview"],
  ["rewards", "Rewards"],
  ["approvals", "Notebook checks"],
  ["activity", "Test answers"],
  ["videos", "Video links"],
  ["settings", "Child settings"],
] as const;

const chip = "rounded-full border-2 px-3.5 py-2 font-bold";

export default async function ParentPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireRole("parent");
  const { kid: kidParam, tab: tabParam } = await searchParams;
  const supabase = await createClient();

  const { data: students } = await supabase
    .from("students")
    .select("id, grade, grp, points, preferred_channel")
    .eq("parent_id", user.id)
    .order("created_at");
  const ids = (students ?? []).map((s) => s.id);
  const { data: profiles } = ids.length
    ? await supabase.from("profiles").select("id, full_name").in("id", ids)
    : { data: [] as { id: string; full_name: string }[] };
  const nameOf = new Map((profiles ?? []).map((p) => [p.id, p.full_name]));
  const kids = (students ?? []).map((s) => ({ ...s, name: nameOf.get(s.id) ?? "Student" }));

  const header = (
    <TopBar>
      <span className="text-[0.88rem] text-muted">Hi, {user.fullName}</span>
      <form action={signOut}>
        <button className={`${btnGhost} ${sm}`}>Sign out</button>
      </form>
    </TopBar>
  );

  const adding = tabParam === "add";
  const kid = kids.find((k) => k.id === kidParam) ?? kids[0];
  const LEVELS = levelsFor(kid?.grade);
  const tab = TABS.some(([id]) => id === tabParam) ? tabParam! : "overview";

  const chips = (
    <div className="flex flex-wrap gap-2">
      {kids.map((k) => (
        <Link
          key={k.id}
          href={`/parent?kid=${k.id}&tab=overview`}
          className={`${chip} ${k.id === kid?.id && !adding ? "border-primary bg-primary text-primary-ink" : "border-line bg-surface text-ink"}`}
        >
          {k.name}
        </Link>
      ))}
      <Link href="/parent?tab=add" className={`${chip} ${adding ? "border-primary bg-primary text-primary-ink" : "border-line bg-surface text-ink"}`}>
        + Add child
      </Link>
    </div>
  );

  if (!kid || adding) {
    return (
      <>
        {header}
        <main className="mx-auto max-w-[1100px] px-5 py-5">
          {kids.length > 0 && chips}
          <AddChildForm first={!kids.length} />
        </main>
      </>
    );
  }

  // ---- data for the selected child (all read through the parent's own session, so RLS applies)
  const [
    { data: subjects }, { data: chapters }, { data: progress }, { data: milestones },
    { data: ledger }, { data: attempts }, { data: links }, { data: practice },
  ] = await Promise.all([
    supabase.from("subjects").select("id, name, emoji, color_key, position").order("position"),
    supabase.from("chapters").select("id, subject_id, title, position").order("position"),
    supabase.from("chapter_progress").select("chapter_id, completed_level, notebook_status").eq("student_id", kid.id),
    supabase.from("milestones").select("id, points, reward, tier, given_at").eq("student_id", kid.id).order("points"),
    supabase.from("point_ledger").select("id, amount, reason, created_at").eq("student_id", kid.id).order("created_at", { ascending: false }).limit(15),
    supabase.from("test_attempts").select("id, chapter_id, level, tries, written_answer, feedback, graded_by, created_at").eq("student_id", kid.id).order("created_at", { ascending: false }).limit(20),
    supabase.from("chapter_video_links").select("chapter_id, url").eq("student_id", kid.id),
    supabase.from("chapter_practice").select("chapter_id, position, prompt").order("position"),
  ]);

  // Question text is not readable by parents under RLS; only the written prompt is fetched here.
  const { data: written } = await createAdminClient()
    .from("questions").select("chapter_id, prompt").eq("kind", "written");
  const writtenPrompt = new Map((written ?? []).map((q) => [q.chapter_id, q.prompt as string]));

  const subj = new Map((subjects ?? []).map((s) => [s.id, s]));
  const chap = new Map((chapters ?? []).map((c) => [c.id, c]));
  const prog = new Map((progress ?? []).map((p) => [p.chapter_id, p]));

  // Only subjects that exist: Class 3 subjects appear as they are loaded.
  const known = new Set((subjects ?? []).map((x) => x.id));
  const groupSubs: readonly string[] = (kid.grp ? GROUPS[kid.grp as keyof typeof GROUPS] : []).filter((id) => known.has(id));
  const groupChapters = (chapters ?? []).filter((c) => groupSubs.includes(c.subject_id));
  const passedIds = new Set((progress ?? []).filter((p) => p.completed_level).map((p) => p.chapter_id));
  const pct = syllabusPct(groupChapters.filter((c) => passedIds.has(c.id)).length, groupChapters.length);
  const level = levelForPct(pct);
  const badge = [...(milestones ?? [])].filter((m) => kid.points >= m.points).pop();
  const pending = (progress ?? []).filter((p) => p.notebook_status === "pending").length;
  const classText = kid.grp ? `Class ${kid.grade}, ${kid.grp}` : "Not chosen yet";
  const date = (d: string) => new Date(d).toLocaleDateString("en-IN");
  const chapterLabel = (id: string) => {
    const c = chap.get(id);
    return c ? `${subj.get(c.subject_id)?.emoji ?? ""} ${c.title}` : "Chapter";
  };

  return (
    <>
      {header}
      <main className="mx-auto max-w-[1100px] px-5 py-5">
        {chips}
        <div role="tablist" className="my-4 flex gap-1.5 overflow-x-auto border-b-2 border-line">
          {TABS.map(([id, text]) => (
            <Link
              key={id}
              role="tab"
              aria-selected={tab === id}
              href={`/parent?kid=${kid.id}&tab=${id}`}
              className={`-mb-0.5 whitespace-nowrap border-b-[3px] px-3.5 py-2.5 font-bold ${tab === id ? "border-primary text-primary" : "border-transparent text-muted"}`}
            >
              {text}
              {id === "approvals" && pending ? ` (${pending})` : ""}
            </Link>
          ))}
        </div>

        {tab === "overview" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
              <Stat label="Points" value={fmt(kid.points)}>
                {badge ? `${TIERS[badge.tier as Tier].i} ${TIERS[badge.tier as Tier].n} badge` : "No badge yet"}
              </Stat>
              <Stat label="Chapters passed" value={passedIds.size}>Recorded only at 100%</Stat>
              <Stat label="Syllabus completed" value={`${pct}%`}>Level {level}: {LEVELS[level].n}</Stat>
            </div>

            <section className={card}>
              <h3 className="text-[1.15rem] font-bold">Progress by subject</h3>
              {kid.grp ? (
                groupSubs.map((sid) => {
                  const s = subj.get(sid);
                  const cs = (chapters ?? []).filter((c) => c.subject_id === sid);
                  const d = cs.filter((c) => passedIds.has(c.id)).length;
                  return (
                    <div key={sid} className="mt-3.5">
                      <div className="flex justify-between text-[0.88rem]">
                        <b>{s?.emoji} {s?.name}</b>
                        <span>{d}/{cs.length} chapters</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-md bg-surface2">
                        <div className="h-full" style={{ width: `${cs.length ? (d / cs.length) * 100 : 0}%`, background: `var(--${s?.color_key})` }} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="mt-2 text-muted">{kid.name} hasn’t picked a class and group yet. This happens on their first sign-in.</p>
              )}
            </section>

            <section className={card}>
              <h3 className="text-[1.15rem] font-bold">Give or take points</h3>
              <p className="text-[0.88rem] text-muted">For things done offline: a good school test, extra notebook work, or a missed promise.</p>
              <BonusForm kidId={kid.id} />
            </section>

            <section className={card}>
              <h3 className="text-[1.15rem] font-bold">Points history</h3>
              {ledger?.length ? (
                <table className="mt-2 w-full border-collapse text-[0.88rem]">
                  <tbody>
                    {ledger.map((l) => (
                      <tr key={l.id}>
                        <td className="border-b border-line px-2 py-2.5">{date(l.created_at)}</td>
                        <td className="border-b border-line px-2 py-2.5">{l.reason}</td>
                        <td className={`border-b border-line px-2 py-2.5 text-right font-bold ${l.amount < 0 ? "text-bad" : "text-good"}`}>
                          {l.amount > 0 ? "+" : ""}{fmt(l.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="mt-1.5 text-[0.88rem] text-muted">No points yet.</p>
              )}
            </section>
          </div>
        )}

        {tab === "rewards" && (
          <div className="flex flex-col gap-4">
            <section className={`${card} flex flex-col gap-3.5`}>
              <div>
                <h3 className="text-[1.15rem] font-bold">Rewards {kid.name} can see</h3>
                <p className="text-[0.88rem] text-muted">
                  Set the points needed, the reward, and the badge. {kid.name} sees these on the reward road.
                </p>
              </div>
              <RewardsEditor
                key={(milestones ?? []).map((m) => `${m.id}${m.points}${m.reward}${m.tier}`).join("|")}
                kidId={kid.id}
                initial={(milestones ?? []).map((m) => ({ id: m.id, points: m.points, reward: m.reward, tier: m.tier as Tier }))}
              />
            </section>
            <section className={card}>
              <h3 className="text-[1.15rem] font-bold">Rewards earned</h3>
              {(milestones ?? []).filter((m) => kid.points >= m.points).map((m) => (
                <div key={m.id} className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                  <span>
                    {TIERS[m.tier as Tier].i} <b>{m.reward}</b>{" "}
                    <span className="text-[0.88rem] text-muted">at {fmt(m.points)} pts</span>
                  </span>
                  {m.given_at ? <Tag>Given</Tag> : <MarkGivenButton id={m.id} />}
                </div>
              ))}
              {!(milestones ?? []).some((m) => kid.points >= m.points) && (
                <p className="mt-1.5 text-[0.88rem] text-muted">
                  Nothing earned yet. The first reward unlocks at {fmt(milestones?.[0]?.points ?? 0)} points.
                </p>
              )}
            </section>
          </div>
        )}

        {tab === "approvals" && (
          <section className={card}>
            <h3 className="text-[1.15rem] font-bold">Notebook practice checks</h3>
            <p className="text-[0.88rem] text-muted">
              When {kid.name} says the practice problems are done, check the notebook and approve to give +{PTS.notebook} points.
            </p>
            {(progress ?? []).filter((p) => p.notebook_status !== "none").length ? (
              (progress ?? []).filter((p) => p.notebook_status !== "none").map((p) => (
                <div key={p.chapter_id} className="mt-3 rounded-[18px] border-2 border-line bg-surface p-[18px]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <b>{chapterLabel(p.chapter_id)}</b>
                    {p.notebook_status === "pending" ? (
                      <NotebookButtons kidId={kid.id} chapterId={p.chapter_id} />
                    ) : (
                      <Tag>{p.notebook_status === "approved" ? "Approved" : "Sent back"}</Tag>
                    )}
                  </div>
                  <ol className="mt-2 list-decimal pl-5 text-[0.88rem]">
                    {(practice ?? []).filter((x) => x.chapter_id === p.chapter_id).map((x) => (
                      <li key={x.position}>{x.prompt}</li>
                    ))}
                  </ol>
                </div>
              ))
            ) : (
              <p className="mt-2 text-[0.88rem] text-muted">No notebook work submitted yet.</p>
            )}
          </section>
        )}

        {tab === "activity" && (
          <section className={card}>
            <h3 className="text-[1.15rem] font-bold">Test answers</h3>
            <p className="text-[0.88rem] text-muted">
              Only 100% results are recorded. Read the written answers to see how well {kid.name} understands, and how many tries it took.
            </p>
            {attempts?.length ? (
              attempts.map((a) => (
                <div key={a.id} className="mt-3 rounded-[18px] border-2 border-line bg-surface p-[18px]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <b>{chapterLabel(a.chapter_id)}</b>
                    <Tag>
                      100% at {LEVELS[a.level as 1 | 2 | 3 | 4].n} level, {a.tries} {a.tries === 1 ? "try" : "tries"}, {date(a.created_at)}
                    </Tag>
                  </div>
                  <p className="mt-2 text-[0.88rem] text-muted">{writtenPrompt.get(a.chapter_id) ?? ""}</p>
                  <p className="mt-1">“{a.written_answer || "(left blank)"}”</p>
                  {a.feedback && (
                    <p className="mt-1 text-[0.88rem] text-muted">
                      {a.graded_by === "ai" ? "AI teacher" : "Feedback"}: {a.feedback}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="mt-2 text-[0.88rem] text-muted">No tests taken yet.</p>
            )}
          </section>
        )}

        {tab === "videos" && (
          <VideoLinksForm
            key={`${kid.id}${kid.preferred_channel}${(links ?? []).map((l) => l.url).join("|")}`}
            kidId={kid.id}
            channel={kid.preferred_channel ?? DEFAULT_CHANNEL}
            subjects={
              (subjects ?? [])
                .filter((s) => !kid.grp || groupSubs.includes(s.id))
                .map((s): VideoSubject => ({
                  id: s.id,
                  name: s.name,
                  emoji: s.emoji,
                  chapters: (chapters ?? [])
                    .filter((c) => c.subject_id === s.id)
                    .map((c) => ({ id: c.id, title: c.title, url: (links ?? []).find((l) => l.chapter_id === c.id)?.url ?? "" })),
                }))
            }
          />
        )}

        {tab === "settings" && <ChildSettings key={kid.id + kid.name} kidId={kid.id} name={kid.name} classText={classText} />}

        <details className={`${card} mt-8`}>
          <summary className="cursor-pointer font-bold">Need an account for your partner or another parent?</summary>
          <p className="mb-3 mt-2 text-[0.9rem] text-muted">Send a request to the admin, who will create the account and share the sign-in details.</p>
          <RequestAccountForm signedIn compact />
        </details>
      </main>
    </>
  );
}

function Stat({ label, value, children }: { label: string; value: string | number; children?: React.ReactNode }) {
  return (
    <div className={card}>
      <div className="text-[0.88rem] text-muted">{label}</div>
      <div className="font-display text-[2rem] font-extrabold">{value}</div>
      <div className="text-[0.88rem] text-muted">{children}</div>
    </div>
  );
}
