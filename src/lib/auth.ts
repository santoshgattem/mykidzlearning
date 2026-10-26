import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Role = "admin" | "parent" | "student";

export type CurrentUser = {
  id: string;
  role: Role;
  fullName: string;
  email: string;
  mustChangePassword: boolean;
};

export const HOME: Record<Role, string> = {
  admin: "/admin",
  parent: "/parent",
  student: "/student",
};

export const LOGIN: Record<Role, string> = {
  admin: "/admin/login",
  parent: "/parent/login",
  student: "/student/login",
};

// The signed-in user, or null. The profile is read through RLS, which hides it for
// disabled accounts (and students of a disabled parent), so those count as signed out.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: p } = await supabase
    .from("profiles")
    .select("id, role, full_name, email, must_change_password")
    .eq("id", user.id)
    .maybeSingle();
  if (!p) return null;

  return {
    id: p.id,
    role: p.role,
    fullName: p.full_name,
    email: p.email,
    mustChangePassword: p.must_change_password,
  };
}

// For protected pages: sends visitors to the right place if they are not allowed in.
export async function requireRole(role: Role): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(LOGIN[role]);
  if (user.role !== role) redirect(HOME[user.role]);
  if (user.mustChangePassword) redirect("/change-password");
  return user;
}

// For sign-in pages: signed-in visitors go straight to their home.
export async function redirectIfSignedIn() {
  const user = await getCurrentUser();
  if (user) redirect(user.mustChangePassword ? "/change-password" : HOME[user.role]);
}
