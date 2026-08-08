"use client";

import { useOptimistic, useState, useTransition } from "react";
import { toggleOwned, toggleWishlist } from "../_actions/collection";

type Kind = "own" | "want";

/**
 * Own / want toggles.
 *
 * The displayed state is derived from the server props via useOptimistic
 * rather than copied into useState. That distinction matters: useState only
 * reads its initial value on mount, so once a bulk action ("mark all owned")
 * revalidated the page, these buttons kept rendering their stale mount-time
 * value and only corrected on a full reload.
 *
 * useOptimistic layers the pending change on top of the server value and drops
 * back to it as soon as the action settles — so a click still feels instant,
 * a failure reverts on its own, and any other action that revalidates the page
 * is reflected here immediately.
 */
export function OwnershipButtons({
  figureId,
  owned,
  wishlisted,
  compact = false,
}: {
  figureId: number;
  owned: boolean;
  wishlisted: boolean;
  compact?: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const [state, applyOptimistic] = useOptimistic(
    { owned, wishlisted },
    (prev, kind: Kind) =>
      kind === "own"
        ? {
            owned: !prev.owned,
            // Taking ownership retires the want, matching toggleOwned().
            wishlisted: prev.owned ? prev.wishlisted : false,
          }
        : { ...prev, wishlisted: !prev.wishlisted },
  );

  function run(kind: Kind) {
    setError(null);
    startTransition(async () => {
      applyOptimistic(kind);
      const res = kind === "own" ? await toggleOwned(figureId) : await toggleWishlist(figureId);
      // No manual rollback: when the transition ends the optimistic layer is
      // discarded and the server props take over again.
      if (!res.ok) setError(res.error);
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <div className={`flex gap-1.5 ${compact ? "" : "gap-2"}`}>
        <button
          type="button"
          onClick={() => run("own")}
          disabled={pending}
          aria-pressed={state.owned}
          className={`btn flex-1 ${state.owned ? "btn-on" : ""} ${compact ? "px-2 py-1" : ""}`}
        >
          {state.owned ? "✓ own" : "own"}
        </button>
        <button
          type="button"
          onClick={() => run("want")}
          disabled={pending}
          aria-pressed={state.wishlisted}
          className={`btn flex-1 ${state.wishlisted ? "btn-on" : ""} ${compact ? "px-2 py-1" : ""}`}
        >
          {state.wishlisted ? "★ want" : "want"}
        </button>
      </div>
      {error && (
        <p className="label" style={{ color: "var(--color-accent)" }} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
