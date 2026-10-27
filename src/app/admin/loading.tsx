// Shown at once while the next page loads, so a click never feels ignored.
export default function Loading() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-10" role="status" aria-live="polite">
      <div className="h-7 w-56 animate-pulse rounded-xl bg-surface2" />
      <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
        <div className="h-28 animate-pulse rounded-[22px] bg-surface2" />
        <div className="h-28 animate-pulse rounded-[22px] bg-surface2" />
      </div>
      <p className="mt-5 text-muted">Loading…</p>
    </div>
  );
}
