"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Remembers how far down a long index page you were, and puts you back there.
 *
 * Three things conspire against the naive "save scrollY, restore it":
 *
 * 1. On navigation the router scrolls to top, firing a scroll event — which
 *    happily records 0 over the position we meant to keep. So recording stops
 *    the moment a link is clicked, and the position is captured right then.
 *
 * 2. That same scroll-to-top runs *after* mount, so a one-shot restore gets
 *    stomped immediately. The position is therefore re-asserted every frame
 *    until it sticks for a few consecutive frames.
 *
 * 3. This route is server-rendered on demand, so on the way back the document
 *    can still be too short to hold the target offset. The retry loop waits
 *    for it to grow.
 *
 * The retry loop also can't rely on requestAnimationFrame alone — it never
 * fires in a hidden tab, which would leave a restore pending forever for a
 * page opened in the background.
 *
 * Any real scroll input from the user aborts the restore immediately, so this
 * can never feel like the page is fighting you.
 *
 * State is per-path in sessionStorage: per-tab, and gone when the tab closes.
 */
export function ScrollMemory({ maxWaitMs = 2000 }: { maxWaitMs?: number }) {
  const pathname = usePathname();

  useEffect(() => {
    const key = `scroll:${pathname}`;
    const target = Number(sessionStorage.getItem(key) ?? 0);

    let cancelled = false;
    let restoring = target > 0;
    // Suspended while restoring so the router's reset can't overwrite the value.
    let recording = !restoring;

    const save = (y: number) => sessionStorage.setItem(key, String(Math.round(y)));

    const previous = history.scrollRestoration;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    // requestAnimationFrame never fires while a tab is hidden, which would
    // leave a restore permanently pending for a page opened in the background.
    // Fall back to a timer so the work still happens either way.
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const schedule = (fn: () => void) => {
      if (document.visibilityState === "visible") requestAnimationFrame(fn);
      else {
        const t = setTimeout(() => {
          timers.delete(t);
          fn();
        }, 16);
        timers.add(t);
      }
    };

    // --- restore ---------------------------------------------------------
    const endRestore = () => {
      if (!restoring) return;
      restoring = false;
      recording = true;
    };

    if (restoring) {
      const deadline = performance.now() + maxWaitMs;
      let settled = 0;

      const step = () => {
        if (cancelled || !restoring) return;

        const reachable = document.documentElement.scrollHeight - window.innerHeight;
        const goal = Math.min(target, Math.max(reachable, 0));

        if (Math.abs(window.scrollY - goal) > 2) {
          window.scrollTo(0, goal);
          settled = 0;
        } else if (reachable >= target) {
          // Held the position for a few frames — the router is done moving us.
          if (++settled >= 3) return endRestore();
        }

        if (performance.now() < deadline) schedule(step);
        else endRestore();
      };

      schedule(step);
    }

    // --- record ----------------------------------------------------------
    let ticking = false;
    const onScroll = () => {
      if (!recording || ticking) return;
      ticking = true;
      schedule(() => {
        ticking = false;
        if (recording) save(window.scrollY);
      });
    };

    // Deliberate input wins over an in-flight restore.
    const onUserInput = () => {
      if (restoring) endRestore();
    };

    // Capture phase: runs before the router handles the click and moves us.
    const onClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement | null)?.closest?.("a[href]")) return;
      save(window.scrollY);
      recording = false;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onUserInput, { passive: true });
    window.addEventListener("touchstart", onUserInput, { passive: true });
    window.addEventListener("keydown", onUserInput);
    document.addEventListener("click", onClick, true);
    window.addEventListener("pagehide", onScroll);

    return () => {
      cancelled = true;
      for (const t of timers) clearTimeout(t);
      timers.clear();
      if (recording) save(window.scrollY);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onUserInput);
      window.removeEventListener("touchstart", onUserInput);
      window.removeEventListener("keydown", onUserInput);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("pagehide", onScroll);
      if ("scrollRestoration" in history) history.scrollRestoration = previous;
    };
  }, [pathname, maxWaitMs]);

  return null;
}
