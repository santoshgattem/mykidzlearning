import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server client for Server Components, Server Actions and route handlers.
// Acts as the signed-in user, so RLS applies.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, {
                ...options,
                httpOnly: true, // the browser never needs to read the session
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
              }),
            );
          } catch {
            // Called from a Server Component, which cannot set cookies.
            // Safe to ignore: proxy.ts refreshes the session.
          }
        },
      },
    },
  );
}
