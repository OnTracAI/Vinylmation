"use client";

import { useState, useTransition } from "react";
import { ownEntireSeries, wantEntireSeries } from "../_actions/collection";

type Mode = "own" | "want";

const COPY: Record<Mode, { idle: string; busy: string; confirm: string }> = {
  own: {
    idle: "Mark all owned",
    busy: "adding…",
    confirm: "Add every figure in this set to your collection?",
  },
  want: {
    idle: "Mark all wanted",
    busy: "adding…",
    confirm: "Add everything you're missing from this set to your wishlist?",
  },
};

/**
 * Bulk own/want for a whole series family.
 *
 * Both run per series id because a base series can span several rows (the main
 * line plus its 9", set and Eachez sub-lines), and each is a separate row in
 * the catalogue.
 *
 * Confirmation isn't ceremony: these touch up to ~45 figures at once and there
 * is no undo, so a stray click on a phone shouldn't rewrite a collection.
 */
export function SeriesBulkActions({
  seriesIds,
  showOwn = true,
  showWant = true,
}: {
  seriesIds: number[];
  showOwn?: boolean;
  showWant?: boolean;
}) {
  const [confirming, setConfirming] = useState<Mode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function commit(mode: Mode) {
    setError(null);
    startTransition(async () => {
      const action = mode === "own" ? ownEntireSeries : wantEntireSeries;
      for (const id of seriesIds) {
        const res = await action(id);
        if (!res.ok) {
          setError(res.error);
          return;
        }
      }
      setConfirming(null);
    });
  }

  if (confirming) {
    return (
      <div className="flex flex-col items-end gap-1.5">
        <p className="label-bright max-w-[22rem] text-right normal-case">
          {COPY[confirming].confirm}
        </p>
        <div className="flex gap-1.5">
          <button
            type="button"
            className="btn btn-accent"
            onClick={() => commit(confirming)}
            disabled={pending}
          >
            {pending ? COPY[confirming].busy : "confirm"}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => setConfirming(null)}
            disabled={pending}
          >
            cancel
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

  return (
    <div className="flex flex-wrap justify-end gap-1.5">
      {showOwn && (
        <button type="button" className="btn" onClick={() => setConfirming("own")}>
          {COPY.own.idle}
        </button>
      )}
      {showWant && (
        <button type="button" className="btn" onClick={() => setConfirming("want")}>
          {COPY.want.idle}
        </button>
      )}
    </div>
  );
}
