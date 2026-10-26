import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Setup check for local development: which env vars are set and whether the database
// answers. Reports yes/no only, never values. Disabled in production.
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }

  const env = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    STUDENT_PIN_PEPPER: (process.env.STUDENT_PIN_PEPPER?.length ?? 0) >= 24,
    ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
  };

  let database: "ok" | "schema_missing" | "unreachable" | "not_configured" = "not_configured";
  let detail: string | undefined;

  if (env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
    const { error } = await createAdminClient()
      .from("subjects")
      .select("id", { count: "exact", head: true });
    if (!error) database = "ok";
    else if (error.code === "42P01" || error.code === "PGRST205") database = "schema_missing";
    else {
      database = "unreachable";
      detail = error.message;
    }
  }

  return NextResponse.json({ env, database, detail });
}
