"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Shows that something is happening after a click on a link or tab: a bar across the top,
// the clicked link pulses, and the cursor shows "busy" until the next page has arrived.
function Progress() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [busy, setBusy] = useState(false);

  // The new page has arrived.
  useEffect(() => {
    setBusy(false);
    document.documentElement.classList.remove("navigating");
    document.querySelectorAll(".nav-pending").forEach((el) => el.classList.remove("nav-pending"));
  }, [pathname, search]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return; // same page
      setBusy(true);
      document.documentElement.classList.add("navigating");
      a.classList.add("nav-pending");
    };
    // Capture phase: Next's own link handler cancels the click, so listen before it runs.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Never leave the bar stuck if a navigation fails.
  useEffect(() => {
    if (!busy) return;
    const t = setTimeout(() => {
      setBusy(false);
      document.documentElement.classList.remove("navigating");
    }, 15000);
    return () => clearTimeout(t);
  }, [busy]);

  return busy ? <div className="nav-bar" role="progressbar" aria-label="Loading" /> : null;
}

export function NavProgress() {
  return (
    <Suspense fallback={null}>
      <Progress />
    </Suspense>
  );
}
