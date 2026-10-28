// Loads the starter "Be inspired" slides from content/news.mjs. Safe to run again: items are matched by
// `slug` and only inserted if missing, so edits an admin has made in the portal are never overwritten.
//   npm run seed-news
import { createClient } from "@supabase/supabase-js";
import { news } from "../content/news.mjs";

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const { data: have } = await db.from("news_items").select("slug");
const haveSlugs = new Set((have ?? []).map((r) => r.slug));
const fresh = news.filter((n) => !haveSlugs.has(n.slug));
for (const n of news) {
  if (n.headline.length > 60 || n.title.length > 120 || n.body.length > 400) { console.error("Too long:", n.slug); process.exit(1); }
}
if (fresh.length) {
  const { error } = await db.from("news_items").insert(fresh);
  if (error) { console.error("Insert failed:", error.message); process.exit(1); }
}
console.log(`Added ${fresh.length} slide(s); ${news.length - fresh.length} already there.`);
