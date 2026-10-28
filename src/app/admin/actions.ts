"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth";
import { generateTempPassword, MIN_PASSWORD_LENGTH } from "@/lib/passwords";
import { revokeSessions } from "@/lib/limiter";

export type Flash = {
  kind: "created" | "reset" | "admin";
  name: string;
  email: string;
  password: string;
};
export type Result = { ok: true; flash?: Flash; message?: string } | { ok: false; error: string };

// ~100 years: Supabase's way of saying "banned". A ban also stops token refresh, so
// existing sessions end within the hour even before the profile check catches them.
const BAN = "876000h";

// Every action re-checks that the caller is a signed-in admin. Never trust the page.
async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin" || user.mustChangePassword) {
    throw new Error("Not allowed");
  }
  return user;
}

const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

async function createAccount(
  role: "admin" | "parent",
  by: string,
  fields: { name: string; email: string; phone?: string; password: string },
): Promise<Result & { id?: string }> {
  const db = createAdminClient();
  const { data, error } = await db.auth.admin.createUser({
    email: fields.email,
    password: fields.password,
    email_confirm: true,
  });
  if (error || !data.user) {
    const taken = /already|registered|exists/i.test(error?.message ?? "");
    return {
      ok: false,
      error: taken ? "This email is already used by another account." : "Couldn’t create the account.",
    };
  }
  const { error: profileError } = await db.from("profiles").insert({
    id: data.user.id,
    role,
    full_name: fields.name,
    email: fields.email,
    phone: fields.phone || null,
    must_change_password: true,
    created_by: by,
  });
  if (profileError) {
    await db.auth.admin.deleteUser(data.user.id);
    return { ok: false, error: "Couldn’t create the account." };
  }
  return { ok: true, id: data.user.id };
}

export async function createParent(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<Result> {
  const admin = await requireAdmin();
  const name = input.name.trim().slice(0, 80);
  const email = input.email.trim().toLowerCase();
  const password = input.password.trim() || generateTempPassword();
  if (!name || !validEmail(email)) return { ok: false, error: "Enter the parent’s name and a valid email." };
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, error: `The temporary password needs at least ${MIN_PASSWORD_LENGTH} characters.` };
  }

  const r = await createAccount("parent", admin.id, { name, email, phone: input.phone.trim(), password });
  if (!r.ok) return r;
  revalidatePath("/admin");
  return { ok: true, flash: { kind: "created", name, email, password } };
}

export async function addAdmin(input: { name: string; email: string }): Promise<Result> {
  const admin = await requireAdmin();
  const name = input.name.trim().slice(0, 80);
  const email = input.email.trim().toLowerCase();
  if (!name || !validEmail(email)) return { ok: false, error: "Enter the new admin’s name and a valid email." };

  const password = generateTempPassword();
  const r = await createAccount("admin", admin.id, { name, email, password });
  if (!r.ok) return r;
  revalidatePath("/admin");
  return { ok: true, flash: { kind: "admin", name, email, password } };
}

async function getProfile(id: string, role: "admin" | "parent") {
  const { data } = await createAdminClient()
    .from("profiles")
    .select("id, full_name, email, role")
    .eq("id", id)
    .eq("role", role)
    .maybeSingle();
  return data;
}

async function childIds(parentId: string) {
  const { data } = await createAdminClient().from("students").select("id").eq("parent_id", parentId);
  return (data ?? []).map((s) => s.id);
}

export async function resetParentPassword(parentId: string): Promise<Result> {
  await requireAdmin();
  const parent = await getProfile(parentId, "parent");
  if (!parent) return { ok: false, error: "Parent not found." };

  const db = createAdminClient();
  const password = generateTempPassword();
  const { error } = await db.auth.admin.updateUserById(parent.id, { password });
  if (error) return { ok: false, error: "Couldn’t reset the password." };
  await db.from("profiles").update({ must_change_password: true }).eq("id", parent.id);
  await revokeSessions(parent.id); // the old password's sign-ins end

  revalidatePath("/admin");
  return { ok: true, flash: { kind: "reset", name: parent.full_name, email: parent.email, password } };
}

export async function setParentDisabled(parentId: string, disabled: boolean): Promise<Result> {
  await requireAdmin();
  const parent = await getProfile(parentId, "parent");
  if (!parent) return { ok: false, error: "Parent not found." };

  const db = createAdminClient();
  const ids = [parent.id, ...(await childIds(parent.id))];
  await db.from("profiles").update({ disabled }).in("id", ids);
  for (const id of ids) {
    await db.auth.admin.updateUserById(id, { ban_duration: disabled ? BAN : "none" });
    if (disabled) await revokeSessions(id);
  }

  revalidatePath("/admin");
  return {
    ok: true,
    message: disabled
      ? "Account disabled. The parent and their children can’t sign in."
      : "Account enabled.",
  };
}

export async function deleteParent(parentId: string): Promise<Result> {
  await requireAdmin();
  const parent = await getProfile(parentId, "parent");
  if (!parent) return { ok: false, error: "Parent not found." };

  // Children's sign-in accounts live in auth.users, so they are deleted explicitly;
  // their profile, progress and points then go with them (ON DELETE CASCADE).
  const db = createAdminClient();
  for (const id of [...(await childIds(parent.id)), parent.id]) {
    const { error } = await db.auth.admin.deleteUser(id);
    if (error) return { ok: false, error: "Couldn’t delete everything. Try again." };
  }

  revalidatePath("/admin");
  return { ok: true, message: "Account deleted." };
}

export async function removeAdmin(adminId: string): Promise<Result> {
  const me = await requireAdmin();
  if (adminId === me.id) return { ok: false, error: "You can’t remove yourself." };
  const target = await getProfile(adminId, "admin");
  if (!target) return { ok: false, error: "Admin not found." };

  const { error } = await createAdminClient().auth.admin.deleteUser(target.id);
  if (error) return { ok: false, error: "Couldn’t remove the admin." };

  revalidatePath("/admin");
  return { ok: true, message: "Admin removed." };
}

// ---------------------------------------------------------------- account requests
// Approving creates the parent account (temporary password, shown to the admin to pass on) and
// closes the request. Dismissing just closes it.
export async function approveRequest(requestId: string): Promise<Result> {
  const admin = await requireAdmin();
  const db = createAdminClient();
  const { data: req } = await db.from("parent_requests").select("id, full_name, email, phone, status").eq("id", requestId).maybeSingle();
  if (!req || req.status !== "pending") return { ok: false, error: "That request has already been handled." };

  const name = req.full_name.slice(0, 80);
  const email = req.email.trim().toLowerCase();
  const password = generateTempPassword();
  const r = await createAccount("parent", admin.id, { name, email, phone: req.phone ?? "", password });
  if (!r.ok) return r;

  await db.from("parent_requests").update({ status: "approved", handled_at: new Date().toISOString(), handled_by: admin.id }).eq("id", req.id);
  revalidatePath("/admin");
  return { ok: true, flash: { kind: "created", name, email, password } };
}

export async function dismissRequest(requestId: string): Promise<Result> {
  const admin = await requireAdmin();
  const { data } = await createAdminClient()
    .from("parent_requests")
    .update({ status: "dismissed", handled_at: new Date().toISOString(), handled_by: admin.id })
    .eq("id", requestId).eq("status", "pending").select("id");
  if (!data?.length) return { ok: false, error: "That request has already been handled." };
  revalidatePath("/admin");
  return { ok: true, message: "Request dismissed." };
}
