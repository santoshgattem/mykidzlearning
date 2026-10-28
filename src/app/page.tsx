import Link from "next/link";
import { NewsSlideshow, type Slide } from "@/components/news-slideshow";
import { btn, btnGhost, btnSoft, sm } from "@/components/ui";
import { createAdminClient } from "@/lib/supabase/admin";

// The page is rebuilt at most once an hour; saving a slide in the admin portal refreshes it at once.
export const revalidate = 3600;

async function loadSlides(): Promise<Slide[]> {
  try {
    const { data } = await createAdminClient()
      .from("news_items")
      .select("id, category, year, headline, title, body, source_name, source_url")
      .eq("published", true)
      .order("position")
      .order("year", { ascending: false })
      .limit(12);
    return (data ?? []).map((r) => ({ id: r.id, category: r.category, year: r.year, headline: r.headline, title: r.title, body: r.body, sourceName: r.source_name, sourceUrl: r.source_url }));
  } catch {
    return []; // the home page still works without the slides
  }
}

const LADDER = [
  { tier: "bronze", icon: "🥉", name: "Bronze", pts: "1,000 pts", reward: "₹100 pocket money for every 1,000 pts" },
  { tier: "silver", icon: "🥈", name: "Silver", pts: "10,000 pts", reward: "Gift of their choice" },
  { tier: "gold", icon: "🥇", name: "Gold", pts: "50,000 pts", reward: "Wireless headphones" },
  { tier: "diamond", icon: "💎", name: "Diamond", pts: "1,00,000 pts", reward: "New mobile phone" },
] as const;

const TIER_BG = {
  bronze: "bg-bronze",
  silver: "bg-silver",
  gold: "bg-gold",
  diamond: "bg-diamond",
} as const;

export default async function Home() {
  const slides = await loadSlides();
  return (
    <>
      <header className="mx-auto flex max-w-[1100px] items-center justify-between px-5 py-3.5">
        <span className="flex items-center gap-2 font-display text-[1.3rem] font-extrabold tracking-tight">
          <span className="inline-flex gap-[3px]" aria-hidden>
            <i className="block size-[9px] rounded-full bg-phy" />
            <i className="block size-[9px] rounded-full bg-chem" />
            <i className="block size-[9px] rounded-full bg-math" />
            <i className="block size-[9px] rounded-full bg-bio" />
          </span>
          mykidzlearning
        </span>
        <Link href="/admin/login" className={`${btnGhost} ${sm}`}>
          Admin
        </Link>
      </header>

      <main className="mx-auto max-w-[1100px] px-5 py-5">
        <section className="grid items-center gap-7 pt-7 md:grid-cols-[1.2fr_1fr]">
          <div>
            <h1 className="font-display text-[clamp(2rem,6vw,3.4rem)] font-extrabold tracking-tight">
              Learning is a journey. Every assessment is a step toward a successful life.
            </h1>
            <p className="mt-3.5 max-w-[46ch] text-[1.15rem] text-muted">
              Class 11 Physics, Chemistry, Maths and Biology for CBSE and JEE. Watch the lesson,
              pass the test and practise in the notebook. Build knowledge and habits that last,
              and let small rewards celebrate each step along the way.
            </p>
            <div className="mt-6 grid max-w-[520px] grid-cols-2 gap-3.5">
              <Link href="/parent/login" className={`${btn} !p-4`}>
                I’m a parent
              </Link>
              <Link href="/student/login" className={`${btnSoft} !p-4`}>
                I’m a student
              </Link>
            </div>
          </div>

          <div className="grid gap-2.5">
            {LADDER.map((r) => (
              <div
                key={r.tier}
                className="flex items-center gap-3.5 rounded-[18px] border-2 border-line bg-surface px-4 py-3.5"
              >
                <div
                  className={`grid size-[46px] flex-none place-items-center rounded-full text-[1.4rem] text-white ${TIER_BG[r.tier]}`}
                >
                  {r.icon}
                </div>
                <div>
                  <b>
                    {r.name}, {r.pts}
                  </b>
                  <div className="text-sm text-muted">{r.reward}</div>
                </div>
              </div>
            ))}
            <p className="text-sm text-muted">Little celebrations along the way. Parents set the points and rewards; these are examples.</p>
          </div>
        </section>

        {slides.length > 0 && (
          <section className="mt-12" aria-labelledby="inspire">
            <h2 id="inspire" className="font-display text-[clamp(1.5rem,4vw,2.2rem)] font-extrabold tracking-tight">Be inspired</h2>
            <p className="mb-4 mt-1 max-w-[60ch] text-muted">Real results from past years. Every one of them began with one chapter at a time.</p>
            <NewsSlideshow slides={slides} />
            <p className="mt-2 text-[0.82rem] text-muted">Results as reported by the sources linked; photos and full stories are on those pages. CBSE does not publish an official topper list.</p>
          </section>
        )}
      </main>
    </>
  );
}
