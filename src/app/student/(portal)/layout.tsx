import Link from "next/link";
import { CelebrateModal } from "@/components/student/celebrate-modal";
import { btnGhost, Logo, sm } from "@/components/ui";
import { signOut } from "@/app/actions/auth";
import { fmt, TIERS } from "@/lib/learning";
import { getStudentContext } from "@/lib/student";

// Everything after sign-in. The sign-in page itself sits outside this group.
export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getStudentContext();
  const celebrate = ctx.toCelebrate.at(-1); // the highest reward reached and not yet celebrated

  return (
    <div className="kid-bg">
      <header className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-3 px-5 py-3.5">
        <Link href="/student" aria-label="Home">
          <Logo />
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/student/rewards"
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border-2 border-line bg-surface px-3 py-1.5 font-bold text-ink no-underline"
          >
            {ctx.badge ? TIERS[ctx.badge.tier].i : "⭐"} {fmt(ctx.points)} pts
          </Link>
          <form action={signOut}>
            <button className={`${btnGhost} ${sm}`}>Sign out</button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-[1100px] px-5 pb-12 pt-2">{children}</main>
      {celebrate && <CelebrateModal key={celebrate.id} tier={celebrate.tier} points={celebrate.points} reward={celebrate.reward} />}
    </div>
  );
}
