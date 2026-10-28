import { AdminConsole, type ParentRow } from "@/components/admin-console";
import { btnGhost, sm, Tag, TopBar } from "@/components/ui";
import { signOut } from "@/app/actions/auth";
import { requireRole } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminPage() {
  const me = await requireRole("admin");
  const db = createAdminClient();

  const [{ data: parents }, { data: students }, { data: admins }, { data: attempts }, { data: requests }, { data: news }] =
    await Promise.all([
      db
        .from("profiles")
        .select("id, full_name, email, phone, created_at, disabled, must_change_password")
        .eq("role", "parent")
        .order("created_at", { ascending: false }),
      db.from("students").select("id, parent_id, points"),
      db.from("profiles").select("id, full_name, email").eq("role", "admin").order("created_at"),
      db.from("test_attempts").select("student_id"),
      db.from("parent_requests").select("id, full_name, email, phone, message, requested_by, created_at").eq("status", "pending").order("created_at"),
      db.from("news_items").select("id, category, year, headline, title, body, source_name, source_url, published, position").order("position").order("year", { ascending: false }),
    ]);

  const studentIds = (students ?? []).map((s) => s.id);
  const { data: studentProfiles } = studentIds.length
    ? await db.from("profiles").select("id, full_name").in("id", studentIds)
    : { data: [] as { id: string; full_name: string }[] };
  const nameOf = new Map((studentProfiles ?? []).map((p) => [p.id, p.full_name]));

  const rows: ParentRow[] = (parents ?? []).map((p) => ({
    id: p.id,
    name: p.full_name,
    email: p.email,
    phone: p.phone,
    createdAt: p.created_at,
    disabled: p.disabled,
    mustChange: p.must_change_password,
    kids: (students ?? [])
      .filter((s) => s.parent_id === p.id)
      .map((s) => ({ name: nameOf.get(s.id) ?? "Student", points: s.points })),
  }));

  const stats = {
    parents: rows.length,
    disabled: rows.filter((r) => r.disabled).length,
    students: students?.length ?? 0,
    tested: new Set((attempts ?? []).map((a) => a.student_id)).size,
    points: (students ?? []).reduce((sum, s) => sum + s.points, 0),
  };

  return (
    <>
      <TopBar>
        <Tag>Admin</Tag>
        <span className="text-[0.88rem] text-muted">{me.fullName}</span>
        <form action={signOut}>
          <button className={`${btnGhost} ${sm}`}>Sign out</button>
        </form>
      </TopBar>
      <main className="mx-auto max-w-[1100px] px-5 py-5">
        <AdminConsole
          me={{ id: me.id }}
          parents={rows}
          admins={(admins ?? []).map((a) => ({ id: a.id, name: a.full_name, email: a.email }))}
          stats={stats}
          news={(news ?? []).map((n) => ({ id: n.id, category: n.category, year: n.year, headline: n.headline, title: n.title, body: n.body, sourceName: n.source_name, sourceUrl: n.source_url, published: n.published, position: n.position }))}
          requests={(requests ?? []).map((r) => ({
            id: r.id, name: r.full_name, email: r.email, phone: r.phone, message: r.message, createdAt: r.created_at, byParent: !!r.requested_by,
          }))}
        />
      </main>
    </>
  );
}
