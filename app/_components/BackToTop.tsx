"use client";

import { useEffect, useState } from "react";

/** Roughly one screen of scrolling before the button is worth offering. */
const THRESHOLD = 600;

/**
 * Floating "back to top" control.
 *
 * Deliberately not rAF-throttled: the handler only compares a number and bails
 * out when the boolean hasn't flipped, so it's cheaper than scheduling a frame
 * — and rAF never fires in a hidden tab, which would leave the button stuck in
 * whatever state it had when the tab lost focus.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const should = window.scrollY > THRESHOLD;
      setVisible((current) => (current === should ? current : should));
    };

    update(); // a restored scroll position may already be past the threshold
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function toTop() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      window.scrollTo({ top: 0, behavior: "auto" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Smooth scrolling is driven by the rendering pipeline, so it can quietly
      // no-op (a backgrounded tab, for one). This button has exactly one job,
      // so if we haven't started moving shortly after, just jump.
      const startedAt = window.scrollY;
      setTimeout(() => {
        if (window.scrollY > 0 && window.scrollY >= startedAt) {
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      }, 400);
    }

    // Move focus to the header so keyboard and screen-reader users land where
    // the page visually goes, instead of being left at the bottom.
    document.getElementById("top")?.focus({ preventScroll: true });
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      // Hidden from assistive tech and taken out of the tab order while
      // invisible, so it isn't a focusable ghost at the top of a page.
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`group fixed right-4 bottom-4 z-40 flex size-11 items-center justify-center
        border border-hairline-bright bg-surface/90 backdrop-blur-sm transition-all
        duration-200 hover:border-accent hover:bg-surface-2 sm:right-6 sm:bottom-6
        ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
    >
      <svg
        viewBox="0 0 16 16"
        aria-hidden
        className="size-4 text-ink-dim transition-colors group-hover:text-accent"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="square"
      >
        <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
      </svg>
    </button>
  );
}
