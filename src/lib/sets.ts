import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { SET_BONUS_FACTOR, levelPoints, type Level } from "@/lib/learning";

// A student has just passed Set 2 or Set 3 of a chapter at 100%. Recorded once per set; a repeat is
// revision and changes nothing. Set 1 is not handled here: it is the chapter's original completion.
export async function completeSet(studentId: string, chapterId: string, setNo: number, level: Level, tries: number, title: string) {
  const db = createAdminClient();
  const gain = Math.round(levelPoints(level) * SET_BONUS_FACTOR);
  // Insert only if this set was not passed before; the unique key makes a double submit harmless.
  const { data: fresh } = await db
    .from("set_results")
    .upsert({ student_id: studentId, chapter_id: chapterId, set_no: setNo, tries, points_awarded: gain }, { onConflict: "student_id,chapter_id,set_no", ignoreDuplicates: true })
    .select("student_id");
  const first = !!fresh?.length;
  if (first && gain > 0) {
    await db.rpc("add_points", { p_student: studentId, p_amount: gain, p_reason: `Set ${setNo} passed: ${title}`, p_by: null });
  }
  return { first, gained: first ? gain : 0 };
}
