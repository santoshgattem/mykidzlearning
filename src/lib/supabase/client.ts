import { createBrowserClient } from "@supabase/ssr";

// Browser client. Uses only the public anon/publishable key; RLS decides what it can see.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
