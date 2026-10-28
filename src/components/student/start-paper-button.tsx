"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { startPaper } from "@/app/student/papers/actions";
import { btn, errorText } from "@/components/ui";

export function StartPaperButton({ paperId, resume }: { paperId: string; resume: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  return (
    <div>
      <button
        className={btn}
        disabled={pending}
        onClick={() =>
          start(async () => {
            setError("");
            const r = await startPaper(paperId);
            if (r.ok) router.push(`/student/papers/${paperId}`);
            else setError(r.error);
          })
        }
      >
        {pending ? "Opening…" : resume ? "Resume paper" : "Start paper"}
      </button>
      {error && <div role="alert" className={`${errorText} mt-1.5`}>{error}</div>}
    </div>
  );
}
