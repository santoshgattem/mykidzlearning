import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { btn, btnSoft } from "@/components/ui";
import { SET_NAMES, fmt, levelName } from "@/lib/learning";
import { getStudentContext } from "@/lib/student";
import { createClient } from "@/lib/supabase/server";
import { latestResult } from "@/lib/test";

// Shown after a test reaches 100%. Reloading keeps showing it for an hour.
export default async function ResultPage({ params, searchParams }: { params: Promise<{ cid: string }>; searchParams: Promise<{ set?: string }> }) {
  const { cid } = await params;
  const setNo = Number((await searchParams).set) || 1;
  const ctx = await getStudentContext();
  const chapter = ctx.chapters.find((c) => c.id === cid);
  if (!chapter) notFound();
  if (setNo > 1) {
    if (setNo > 3 || !ctx.setPassed(cid, setNo)) redirect(`/student/chapter/${cid}`);
    const { data: sr } = await (await createClient()).from("set_results").select("points_awarded").eq("student_id", ctx.user.id).eq("chapter_id", cid).eq("set_no", setNo).maybeSingle();
    const gain = sr?.points_awarded ?? 0;
    const more = ctx.setsOf(cid).includes(setNo + 1);
    return (
      <div>
        <Link href={`/student/chapter/${cid}`} className={`${btnSoft} !px-3 !py-[7px] !text-[0.88rem]`}>
          ← Back to chapter
        </Link>
        <section className="road mt-4 rounded-[28px] p-6">
          <div className="font-display text-[clamp(2.4rem,8vw,3.6rem)] font-extrabold leading-none">100% 🎉</div>
          <h2 className="mt-2.5 text-[1.6rem] font-extrabold text-white">{chapter.title}: {SET_NAMES[setNo as 2 | 3]} passed</h2>
          <p className="mt-2">Every answer right. That is how real understanding is built.</p>
          <p className="mt-1.5 font-bold">{gain > 0 ? `+${fmt(gain)} points added.` : ""}</p>
        </section>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={`/student/chapter/${cid}`} className={btn}>{more ? `On to Set ${setNo + 1}` : "Back to chapter"}</Link>
          <Link href={`/student/subject/${chapter.subject_id}`} className={btnSoft}>Next chapter</Link>
        </div>
      </div>
    );
  }
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
      {ctx.grade === 3 && (
        <div className="mt-4 rounded-[22px] border-2 border-line bg-surface p-5 text-[1.05rem]">
          <b>⭐ Well done!</b>
          <p className="mt-1.5">You answered every question correctly. Now try the notebook practice, and ask your parent to check it.</p>
        </div>
      )}
      {ctx.grade !== 3 && r.feedback && (
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
