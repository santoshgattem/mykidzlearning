import Link from "next/link";
import { ContactAdminForm } from "@/components/contact-admin-form";
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
        <nav className="flex items-center gap-2.5" aria-label="Main">
          <a href="#contact" className={`${btnGhost} ${sm}`}>
            Contact admin
          </a>
        </nav>
      </header>

      <main className="mx-auto max-w-[1100px] px-5 py-5">
        <section className="pt-7">
          <div>
            <h1 className="font-display text-[clamp(2rem,6vw,3.4rem)] font-extrabold tracking-tight">
              Learning is a journey. Every assessment is a step toward a successful life.
            </h1>
            <p className="mt-3.5 max-w-[46ch] text-[1.15rem] text-muted">
              Watch the lesson, pass the test and practise in the notebook. Build knowledge and
              habits that last, one chapter at a time.
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

        </section>

        {slides.length > 0 && (
          <section className="mt-12" aria-labelledby="inspire">
            <h2 id="inspire" className="font-display text-[clamp(1.5rem,4vw,2.2rem)] font-extrabold tracking-tight">Be inspired</h2>
            <p className="mb-4 mt-1 max-w-[60ch] text-muted">Real results from past years. Every one of them began with one chapter at a time.</p>
            <NewsSlideshow slides={slides} />
          </section>
        )}

        <section id="contact" className="mt-12 scroll-mt-5 pb-8" aria-labelledby="contact-h">
          <h2 id="contact-h" className="font-display text-[clamp(1.5rem,4vw,2.2rem)] font-extrabold tracking-tight">Contact the admin</h2>
          <p className="mb-4 mt-1 max-w-[60ch] text-muted">
            Need an account, forgot a password, or have a question? Send a message and the admin will reply by email.
          </p>
          <ContactAdminForm />
        </section>
      </main>
    </>
  );
}
