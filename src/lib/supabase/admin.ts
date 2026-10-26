import "server-only";
import { createClient } from "@supabase/supabase-js";

// Service-role client. BYPASSES Row Level Security. Server only: the "server-only"
// import makes the build fail if this file is ever pulled into client code.
// Callers must check who is asking (admin / owning parent / the student) before using it.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
