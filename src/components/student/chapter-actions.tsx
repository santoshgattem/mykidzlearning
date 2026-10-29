"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { markWatched, startTest, submitNotebook } from "@/app/student/actions";
import { btn, btnSoft, errorText, Tag } from "@/components/ui";

// Step 1. "I've finished watching" unlocks after the video link has been opened.
export function WatchStep({ chapterId, url, watched }: { chapterId: string; url: string; watched: boolean }) {
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a className={btn} href={url} target="_blank" rel="noopener noreferrer" onClick={() => setOpened(true)}>
        Open video
      </a>
      {watched ? (
        <Tag>Watched</Tag>
      ) : (
        <button
          className={btnSoft}
          disabled={!opened || pending}
          onClick={() =>
            start(async () => {
              const r = await markWatched(chapterId);
              if (!r.ok) return setError(r.error);
              router.refresh();
            })
          }
        >
          I’ve finished watching
        </button>
      )}
      {!watched && !opened && <span className="text-[0.88rem] text-muted">Open the video first, then tap this.</span>}
      <span role="alert" className={errorText}>
        {error}
      </span>
    </div>
  );
}

export function StartTestButton({ chapterId, label, enabled, setNo = 1 }: { chapterId: string; label: string; enabled: boolean; setNo?: number }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        className={btn}
        disabled={!enabled || pending}
        onClick={() =>
          start(async () => {
            const r = await startTest(chapterId, setNo);
            if (!r.ok) return setError(r.error);
            router.push(`/student/test/${chapterId}`);
          })
        }
      >
        {pending ? "Preparing your test…" : label}
      </button>
      {!enabled && <span className="text-[0.88rem] text-muted">{setNo > 1 ? `Pass Set ${setNo - 1} first` : "Unlocks after the video"}</span>}
      <span role="alert" className={errorText}>
        {error}
      </span>
    </div>
  );
}

export function NotebookButton({ chapterId, redo }: { chapterId: string; redo: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        className={btnSoft}
        disabled={pending}
        onClick={() =>
          start(async () => {
            const r = await submitNotebook(chapterId);
            if (!r.ok) return setError(r.error);
            router.refresh();
          })
        }
      >
        {redo ? "I’ve redone them, check again" : "Done, ask parent to check"}
      </button>
      <span role="alert" className={errorText}>
        {error}
      </span>
    </div>
  );
}
