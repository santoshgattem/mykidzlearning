"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addAdmin,
  approveRequest,
  createParent,
  dismissRequest,
  deleteParent,
  removeAdmin,
  resetParentPassword,
  setParentDisabled,
  type Flash,
  type Result,
} from "@/app/admin/actions";
import { ChangePasswordForm } from "@/components/change-password-form";
import { btn, btnBad, btnGhost, btnSoft, card, input, label, sm, Tag } from "@/components/ui";

export type RequestRow = { id: string; name: string; email: string; phone: string | null; message: string | null; createdAt: string; byParent: boolean };

export type ParentRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  disabled: boolean;
  mustChange: boolean;
  kids: { name: string; points: number }[];
};

type Props = {
  me: { id: string };
  parents: ParentRow[];
  admins: { id: string; name: string; email: string }[];
  stats: { parents: number; disabled: number; students: number; tested: number; points: number };
  requests: RequestRow[];
};

const TABS = [
  ["parents", "Parent accounts"],
  ["requests", "Requests"],
  ["create", "Create parent"],
  ["settings", "Admin settings"],
] as const;
type Tab = (typeof TABS)[number][0];

const fmt = (n: number) => n.toLocaleString("en-IN");

export function AdminConsole({ me, parents, admins, stats, requests }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("parents");
  const [query, setQuery] = useState("");
  const [flash, setFlash] = useState<Flash | null>(null);
  const [toast, setToast] = useState("");
  const [busy, startTransition] = useTransition();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  // Runs a server action, then shows its credentials card / message and refreshes the page data.
  function run(action: () => Promise<Result>, onOk?: () => void) {
    startTransition(async () => {
      const r = await action();
      if (!r.ok) {
        setToast(r.error);
        return;
      }
      if (r.flash) {
        setFlash(r.flash);
        window.scrollTo(0, 0);
      }
      if (r.message) setToast(r.message);
      onOk?.();
      router.refresh();
    });
  }

  const q = query.trim().toLowerCase();
  const list = parents.filter((p) => !q || p.name.toLowerCase().includes(q) || p.email.includes(q));

  return (
    <div>
      {flash && <FlashCard flash={flash} onDone={() => setFlash(null)} />}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
        <Stat label="Parent accounts" value={stats.parents} note={`${stats.disabled} disabled`} />
        <Stat label="Students" value={stats.students} note={`${stats.tested} have taken a test`} />
        <Stat label="Points earned by all students" value={fmt(stats.points)} />
      </div>

      <div role="tablist" className="my-4 flex gap-1.5 overflow-x-auto border-b-2 border-line">
        {TABS.map(([id, text]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`-mb-0.5 whitespace-nowrap border-b-[3px] px-3.5 py-2.5 font-bold ${tab === id ? "border-primary text-primary" : "border-transparent text-muted"}`}
          >
            {text}
            {id === "requests" && requests.length > 0 && (
              <span className="ml-1.5 rounded-full bg-primary px-2 py-0.5 text-[0.75rem] text-primary-ink">{requests.length}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "parents" && (
        <section className={card}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-[1.15rem] font-bold">Parent accounts</h3>
            <input
              aria-label="Search parents"
              placeholder="Search by name or email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`${input} max-w-[280px]`}
            />
          </div>
          {list.length ? (
            <div className="mt-2.5 overflow-x-auto">
              <table className="w-full border-collapse text-[0.88rem]">
                <thead>
                  <tr className="text-left">
                    {["Parent", "Children", "Created", "Status", "Actions"].map((h) => (
                      <th key={h} className="border-b border-line px-2 py-2.5 text-left">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {list.map((p) => (
                    <tr key={p.id} className="align-top">
                      <td className="border-b border-line px-2 py-2.5">
                        <b>{p.name}</b>
                        <br />
                        <span className="text-muted">{p.email}</span>
                        {p.phone && (
                          <>
                            <br />
                            <span className="text-muted">{p.phone}</span>
                          </>
                        )}
                      </td>
                      <td className="border-b border-line px-2 py-2.5">
                        {p.kids.length ? (
                          p.kids.map((k, i) => (
                            <div key={i}>
                              {k.name} <span className="text-muted">({fmt(k.points)} pts)</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-muted">None yet</span>
                        )}
                      </td>
                      <td className="border-b border-line px-2 py-2.5">
                        {new Date(p.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="border-b border-line px-2 py-2.5">
                        <Tag bad={p.disabled}>
                          {p.disabled ? "Disabled" : p.mustChange ? "Waiting for first sign-in" : "Active"}
                        </Tag>
                      </td>
                      <td className="border-b border-line px-2 py-2.5">
                        <div className="flex gap-1.5">
                          <button
                            disabled={busy}
                            className={`${btnSoft} ${sm}`}
                            onClick={() => {
                              if (confirm(`Reset ${p.name}’s password? Their current password stops working.`))
                                run(() => resetParentPassword(p.id));
                            }}
                          >
                            Reset password
                          </button>
                          <button
                            disabled={busy}
                            className={`${btnGhost} ${sm}`}
                            onClick={() => run(() => setParentDisabled(p.id, !p.disabled))}
                          >
                            {p.disabled ? "Enable" : "Disable"}
                          </button>
                          <button
                            disabled={busy}
                            className={`${btnBad} ${sm}`}
                            onClick={() => {
                              if (
                                confirm(
                                  `Delete ${p.name}’s account and ${p.kids.length} student account(s)? This can’t be undone.`,
                                )
                              )
                                run(() => deleteParent(p.id));
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <>
              <p className="mt-2.5 text-[0.88rem] text-muted">
                {q ? "No parents match that search." : "No parent accounts yet."}
              </p>
              {!q && (
                <button className={`${btn} mt-2.5`} onClick={() => setTab("create")}>
                  Create the first parent account
                </button>
              )}
            </>
          )}
        </section>
      )}

      {tab === "requests" && (
        <section className={`${card} flex flex-col gap-3.5`}>
          <h3 className="text-[1.15rem] font-bold">Parent account requests</h3>
          <p className="text-[0.88rem] text-muted">
            People ask for an account from the parent sign-in page, or a parent asks for a partner’s account. Approving creates the account
            with a temporary password, which you then pass on.
          </p>
          {requests.length === 0 ? (
            <p className="text-muted">No requests waiting.</p>
          ) : (
            requests.map((r) => (
              <div key={r.id} className="rounded-[18px] border-2 border-line p-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span>
                    <b>{r.name}</b> <span className="text-[0.88rem] text-muted">{r.email}{r.phone ? ` · ${r.phone}` : ""}</span>
                  </span>
                  <span className="flex items-center gap-2 text-[0.8rem] text-muted">
                    {r.byParent && <Tag>From a parent</Tag>}
                    {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                </div>
                {r.message && <p className="mt-1.5 whitespace-pre-line text-[0.9rem]">“{r.message}”</p>}
                <div className="mt-2.5 flex flex-wrap gap-2.5">
                  <button disabled={busy} className={`${btn} ${sm}`} onClick={() => run(() => approveRequest(r.id))}>Approve and create account</button>
                  <button
                    disabled={busy}
                    className={`${btnGhost} ${sm}`}
                    onClick={() => { if (confirm(`Dismiss the request from ${r.name}?`)) run(() => dismissRequest(r.id)); }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {tab === "create" && (
        <CreateParent
          busy={busy}
          onCreate={(v) => run(() => createParent(v), () => setTab("parents"))}
        />
      )}

      {tab === "settings" && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
          <ChangePasswordForm askCurrent title="Change your password" />
          <section className={`${card} flex flex-col gap-3.5`}>
            <h3 className="text-[1.15rem] font-bold">Admins</h3>
            {admins.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-2">
                <span>
                  <b>{a.name}</b> <span className="text-[0.88rem] text-muted">{a.email}</span>
                </span>
                {a.id === me.id ? (
                  <Tag>You</Tag>
                ) : (
                  <button
                    disabled={busy}
                    className={`${btnBad} ${sm}`}
                    onClick={() => {
                      if (confirm(`Remove ${a.name} as admin?`)) run(() => removeAdmin(a.id));
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <AddAdmin busy={busy} onAdd={(v) => run(() => addAdmin(v))} />
          </section>
        </div>
      )}

      {toast && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-50 max-w-[90vw] -translate-x-1/2 rounded-[14px] bg-ink px-[18px] py-3 font-bold text-bg"
        >
          {toast}
          <button aria-label="Dismiss" className="ml-3" onClick={() => setToast("")}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

function Stat({ label: l, value, note }: { label: string; value: number | string; note?: string }) {
  return (
    <div className={card}>
      <div className="text-[0.88rem] text-muted">{l}</div>
      <div className="font-display text-[2rem] font-extrabold">{value}</div>
      {note && <div className="text-[0.88rem] text-muted">{note}</div>}
    </div>
  );
}

function FlashCard({ flash, onDone }: { flash: Flash; onDone: () => void }) {
  const heading =
    flash.kind === "reset" ? "Password reset for" : flash.kind === "admin" ? "Admin added:" : "Account created for";
  const text = `mykidzlearning sign-in\nEmail: ${flash.email}\nTemporary password: ${flash.password}`;
  const [copied, setCopied] = useState("");

  return (
    <section className={`${card} mb-4 flex flex-col gap-3.5 !border-good`}>
      <h3 className="text-[1.15rem] font-bold">
        {heading} {flash.name}
      </h3>
      <p className="text-[0.88rem] text-muted">
        Share these details with them. They’ll be asked to set their own password the first time they
        sign in. This password won’t be shown again.
      </p>
      <div className="rounded-[18px] border-2 border-line bg-surface p-[18px] font-bold">
        Email: {flash.email}
        <br />
        Temporary password: {flash.password}
      </div>
      <div className="flex items-center gap-3">
        <button
          className={`${btn} ${sm}`}
          onClick={() =>
            navigator.clipboard.writeText(text).then(
              () => setCopied("Copied."),
              () => setCopied("Couldn’t copy. Select the text instead."),
            )
          }
        >
          Copy details
        </button>
        <button className={`${btnGhost} ${sm}`} onClick={onDone}>
          Done
        </button>
        <span className="text-[0.88rem] text-muted">{copied}</span>
      </div>
    </section>
  );
}

function CreateParent({
  busy,
  onCreate,
}: {
  busy: boolean;
  onCreate: (v: { name: string; email: string; phone: string; password: string }) => void;
}) {
  const [v, setV] = useState({ name: "", email: "", phone: "", password: "" });
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setV({ ...v, [k]: e.target.value });

  return (
    <form
      className={`${card} flex max-w-[520px] flex-col gap-3.5`}
      onSubmit={(e) => {
        e.preventDefault();
        onCreate(v);
      }}
    >
      <h3 className="text-[1.15rem] font-bold">Create a parent account</h3>
      <p className="text-[0.88rem] text-muted">
        You’ll get a temporary password to share with the parent. They set their own password when they
        first sign in, then add their children.
      </p>
      <div>
        <label htmlFor="cn" className={label}>Parent’s name</label>
        <input id="cn" required autoComplete="off" value={v.name} onChange={set("name")} className={input} />
      </div>
      <div>
        <label htmlFor="ce" className={label}>Parent’s email</label>
        <input id="ce" type="email" required autoComplete="off" value={v.email} onChange={set("email")} className={input} />
      </div>
      <div>
        <label htmlFor="cph" className={label}>Phone (optional)</label>
        <input id="cph" type="tel" autoComplete="off" value={v.phone} onChange={set("phone")} className={input} />
      </div>
      <div>
        <label htmlFor="cpw" className={label}>Temporary password</label>
        <input
          id="cpw"
          autoComplete="off"
          placeholder="Leave blank to generate one"
          value={v.password}
          onChange={set("password")}
          className={input}
        />
      </div>
      <div>
        <button type="submit" disabled={busy} className={btn}>
          {busy ? "Creating…" : "Create parent account"}
        </button>
      </div>
    </form>
  );
}

function AddAdmin({ busy, onAdd }: { busy: boolean; onAdd: (v: { name: string; email: string }) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  return (
    <form
      className="flex flex-col gap-3.5"
      onSubmit={(e) => {
        e.preventDefault();
        onAdd({ name, email });
        setName("");
        setEmail("");
      }}
    >
      <div>
        <label htmlFor="an" className={label}>New admin’s name</label>
        <input id="an" required autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} className={input} />
      </div>
      <div>
        <label htmlFor="aem" className={label}>New admin’s email</label>
        <input id="aem" type="email" required autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
      </div>
      <div>
        <button type="submit" disabled={busy} className={btnSoft}>
          Add admin
        </button>
      </div>
    </form>
  );
}
