// Security check. Re-runs the access-control tests on every table and function as admin, two parents, two students and an
// anonymous visitor, using temporary accounts that are deleted at the end. Never edits real accounts' data.
//   npm run security-check
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "node:fs";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL, anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, svc = process.env.SUPABASE_SERVICE_ROLE_KEY, pepper = process.env.STUDENT_PIN_PEPPER;
const mk = (key) => createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const admin = mk(svc);
const tag = "tmp-rls-" + Date.now();
const results = []; let fails = 0;
const check = (name, ok, extra = "") => { results.push({ name, ok, extra }); if (!ok) fails++; };

const tables = [...new Set(readdirSync("supabase/migrations").flatMap((f) => [...readFileSync("supabase/migrations/" + f, "utf8").matchAll(/create table (?:if not exists )?public\.([a-z_]+)/gi)].map((m) => m[1])))].sort();
const created = [];
async function mkUser(role, pw, extra = {}) {
  const email = `${tag}-${role}@example.com`;
  const { data, error } = await admin.auth.admin.createUser({ email, password: pw, email_confirm: true });
  if (error) throw error;
  created.push(data.user.id);
  const { error: pe } = await admin.from("profiles").insert({ id: data.user.id, role: role.startsWith("student") ? "student" : role.startsWith("parent") ? "parent" : "admin", full_name: role, email, ...(role.startsWith("parent") ? {} : {}) });
  if (pe) throw pe;
  return { id: data.user.id, email, pw };
}
try {
  const pw = "Tmp-Test-Pass-123";
  const adm = await mkUser("admin", pw), pa = await mkUser("parentA", pw), pb = await mkUser("parentB", pw);
  const sa = await mkUser("studentA", `4321:${pepper}`), sb = await mkUser("studentB", `4321:${pepper}`);
  await admin.from("students").insert([{ id: sa.id, parent_id: pa.id, grade: 11, grp: "PCM" }, { id: sb.id, parent_id: pb.id, grade: 11, grp: "PCM" }]);
  // data for each side
  const now = new Date().toISOString();
  for (const s of [sa, sb]) {
    await admin.from("chapter_progress").insert({ student_id: s.id, chapter_id: "p1", watched_at: now, completed_points: 0 });
    await admin.from("set_results").insert({ student_id: s.id, chapter_id: "p1", set_no: 2, tries: 1, points_awarded: 0 });
    await admin.rpc("add_points", { p_student: s.id, p_amount: 5, p_reason: "tmp rls", p_by: null });
    await admin.from("chapter_video_links").insert({ student_id: s.id, chapter_id: "p1", url: "https://example.com/x" });
  }
  await admin.from("contact_messages").insert({ full_name: "t", email: "t@example.com", message: "tmp rls message" });
  const signed = {};
  for (const [k, u] of Object.entries({ admin: adm, parentA: pa, parentB: pb, studentA: sa, studentB: sb })) {
    const c = mk(anon); const { error } = await c.auth.signInWithPassword({ email: u.email, password: u.pw });
    if (error) throw new Error(`sign-in ${k}: ${error.message}`);
    signed[k] = c;
  }
  signed.anon = mk(anon);

  // ---- 1. reads: what each user can see, per table
  const total = {};
  for (const t of tables) { const { count } = await admin.from(t).select("*", { count: "exact", head: true }); total[t] = count ?? 0; }
  const seen = {}; // seen[table][who] = rows
  for (const t of tables) { seen[t] = {}; for (const [who, c] of Object.entries(signed)) { const { data, error } = await c.from(t).select("*").limit(2000); seen[t][who] = error ? null : data; } }
  const ownCol = (rows) => rows.length && ("student_id" in rows[0]) ? "student_id" : null;
  const A = sa.id, B = sb.id;
  for (const t of tables) {
    const r = seen[t];
    check(`${t}: anonymous sees nothing`, !r.anon || r.anon.length === 0);
    if (r.studentA?.length) {
      const col = ownCol(r.studentA);
      if (col) check(`${t}: student A sees only own rows`, r.studentA.every((x) => x[col] === A), `${r.studentA.length} rows`);
      if (col) check(`${t}: student B never sees student A rows`, !(r.studentB ?? []).some((x) => x[col] === A));
    }
    for (const who of ["parentA", "parentB"]) {
      const col = ownCol(r[who] ?? []);
      if (col) check(`${t}: ${who} sees only own children`, r[who].every((x) => x[col] === (who === "parentA" ? A : B)));
    }
    check(`${t}: student A does not see student B profile/data via ids`, !(r.studentA ?? []).some((x) => x.student_id === B || (t === "students" && x.id === B)));
  }
  // server-only tables must be empty for everyone except the service role
  const serverOnly = ["contact_messages", "grade_requests", "parent_requests", "password_resets", "rate_limit_hits", "weekly_reminders", "news_items", "paper_questions", "paper_answers", "question_answers"];
  for (const t of serverOnly) for (const who of ["studentA", "parentA", "admin", "anon"]) check(`${t} (server-only): ${who} sees none`, !seen[t][who] || seen[t][who].length === 0, `${seen[t][who]?.length ?? "error"}`);
  check("contact_messages really holds data to hide", total.contact_messages > 0);

  // ---- 3. functions
  for (const [fn, args] of Object.entries({
    add_points: { p_student: A, p_amount: 1000, p_reason: "hack", p_by: null },
    begin_pin_attempt: { p_student: A, p_max: 5, p_minutes: 15 },
    rate_limit_hit: { p_key: "x", p_max: 1, p_window: 1 },
    rate_limit_reset: { p_key: "x" },
    revoke_user_sessions: { p_user: A },
    paper_set_answer: { p_attempt: A, p_question: A, p_kind: "x", p_value: {} },
  })) for (const who of ["anon", "studentA", "parentA", "admin"]) {
    const { error } = await signed[who].rpc(fn, args);
    check(`function ${fn}: ${who} cannot call it`, !!error, error ? error.message.slice(0, 60) : "CALL SUCCEEDED");
  }
  const { data: stA } = await admin.from("students").select("points").eq("id", A).single();
  check("student A points were not changed by function attacks", stA.points === 5, `points=${stA.points}`);

  // ---- 4. public sign-up must be closed
  const su = await mk(anon).auth.signUp({ email: `${tag}-signup@example.com`, password: "Tmp-Test-Pass-123" });
  if (su.data?.user?.id) created.push(su.data.user.id);
  check("public sign-up is closed", !!su.error || !su.data?.user, su.error ? su.error.message : "SIGN-UP WORKED");

  // ---- 5. a parent cannot change their child's points or role through the API
  const pu = await signed.parentA.from("students").update({ points: 999999 }).eq("id", A).select();
  check("parent cannot edit a child's points directly", (pu.data?.length ?? 0) === 0 || pu.data[0].points !== 999999);
  const su2 = await signed.studentA.from("profiles").update({ role: "admin" }).eq("id", A).select();
  check("student cannot make themselves admin", (su2.data?.length ?? 0) === 0 || su2.data[0].role !== "admin");
  const pr = await signed.parentA.from("profiles").update({ role: "admin" }).eq("id", pa.id).select();
  check("parent cannot make themselves admin", (pr.data?.length ?? 0) === 0 || pr.data[0].role !== "admin");

  // ---- 6. writes by a parent / student against other families (only the temporary users' own rows are ever touched)
  await admin.from("chapter_video_links").upsert([{ student_id: B, chapter_id: "p2", url: "https://example.com/b2" }]);
  const cl = signed.parentA;
  const clS = signed.studentA;
  const rec = (name, ok, x = "") => check(name, ok, x);
  // parent A against child B's data
  const d1 = await cl.from("milestones").delete().eq("student_id", B).select(); rec("parent A cannot delete child B's milestones", (d1.data?.length ?? 0) === 0);
  const u1 = await cl.from("milestones").update({ reward: "hacked" }).eq("student_id", B).select(); rec("parent A cannot edit child B's milestones", (u1.data?.length ?? 0) === 0);
  const i1 = await cl.from("milestones").insert({ student_id: B, points: 5, reward: "x", tier: "bronze" }).select(); rec("parent A cannot add a milestone for child B", !(i1.data?.length));
  const u2 = await cl.from("chapter_video_links").update({ url: "https://evil.example" }).eq("student_id", B).select(); rec("parent A cannot edit child B's video links", (u2.data?.length ?? 0) === 0);
  const i2 = await cl.from("chapter_video_links").insert({ student_id: B, chapter_id: "p2", url: "https://evil.example" }).select(); rec("parent A cannot add a video link for child B", !(i2.data?.length));
  const d2 = await cl.from("chapter_video_links").delete().eq("student_id", B).select(); rec("parent A cannot delete child B's video links", (d2.data?.length ?? 0) === 0);
  // parent A on own child (allowed): confirm it works but cannot touch points/ledger
  const own = await cl.from("milestones").update({ reward: "ok" }).eq("student_id", A).select(); rec("(by design) parent A can edit own child's milestones", (own.data?.length ?? 0) > 0);
  const pts = await cl.from("students").update({ points: 5000 }).eq("id", A).select(); rec("parent A cannot set own child's points", !(pts.data?.length) || pts.data[0].points !== 5000);
  const led = await cl.from("point_ledger").insert({ student_id: A, amount: 5000, reason: "x" }).select(); rec("parent A cannot write the points ledger", !(led.data?.length));
  // student A against own and B
  const sm = await clS.from("milestones").update({ reward: "student edit" }).eq("student_id", A).select(); rec("student cannot edit own milestones", !(sm.data?.length));
  const sv = await clS.from("chapter_video_links").insert({ student_id: A, chapter_id: "p3", url: "https://x.example" }).select(); rec("student cannot add video links", !(sv.data?.length));
  const sp = await clS.from("students").update({ points: 5000, parent_id: pb.id }).eq("id", A).select(); rec("student cannot change own points or parent", !(sp.data?.length));

  console.log(`\n${results.filter((r) => r.ok).length} of ${results.length} checks passed, ${fails} failed\n`);
  for (const r of results.filter((x) => !x.ok)) console.log("FAIL:", r.name, r.extra);
  console.log("\nTables checked:", tables.length, "\n" + tables.join(", "));
} finally {
  for (const id of created) await admin.auth.admin.deleteUser(id);
  await admin.from("contact_messages").delete().eq("message", "tmp rls message");
}
