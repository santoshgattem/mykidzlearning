import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { btn, btnSoft } from "@/components/ui";
import { fmt, levelName } from "@/lib/learning";
import { getStudentContext } from "@/lib/student";
import { latestResult } from "@/lib/test";

// Shown after a test reaches 100%. Reloading keeps showing it for an hour.
export default async function ResultPage({ params }: { params: Promise<{ cid: string }> }) {
  const { cid } = await params;
  const ctx = await getStudentContext();
  const chapter = ctx.chapters.find((c) => c.id === cid);
  if (!chapter) notFound();
  const r = await latestResult(ctx.user.id, cid);
  if (!r) redirect(`/student/chapter/${cid}`);

  return (
    <div>
      <Link href={`/student/chapter/${cid}`} className={`${btnSoft} !px-3 !py-[7px] !text-[0.88rem]`}>
        ← Back to chapter
      </Link>
      <section className="road mt-4 rounded-[28px] p-6">
        <div className="font-display text-[clamp(2.4rem,8vw,3.6rem)] font-extrabold leading-none">100% 🎉</div>
        <h2 className="mt-2.5 text-[1.6rem] font-extrabold text-white">
          {chapter.title} complete at {levelName(ctx.grade, r.level)} level
        </h2>
        <p className="mt-2">
          {r.tries === 1
            ? "Perfect on the first try. Outstanding!"
            : `You kept revising until every answer was right, in ${r.tries} tries. That’s exactly how toppers work.`}
        </p>
        <p className="mt-1.5 font-bold">
          {r.gained > 0 ? `+${fmt(r.gained)} points added.` : "Revision round, so no new points this time."}
        </p>
      </section>
      {r.feedback && (
        <div className="mt-4 rounded-[22px] border-2 border-line bg-surface p-5">
          <b>{ctx.grade === 3 ? "Your teacher says" : "Feedback on your written answer"}</b>
          <p className="mt-1.5">{r.feedback}</p>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-3">
        <Link href={`/student/subject/${chapter.subject_id}`} className={btn}>
          Next chapter
        </Link>
        <Link href={`/student/chapter/${cid}`} className={btnSoft}>
          Notebook practice
        </Link>
      </div>
    </div>
  );
}
