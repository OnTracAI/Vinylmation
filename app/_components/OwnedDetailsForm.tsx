"use client";

import { useOptimistic, useState, useTransition } from "react";
import { setQuantity, updateOwnedDetails } from "../_actions/collection";

const CONDITIONS = [
  { value: "mint_in_box", label: "Mint in box" },
  { value: "opened_complete", label: "Opened, complete" },
  { value: "opened_no_box", label: "Opened, no box" },
  { value: "damaged", label: "Damaged" },
];

/** Collector-supplied fields for a figure they own. */
export function OwnedDetailsForm({
  figureId,
  quantity,
  initial = {},
}: {
  figureId: number;
  quantity: number;
  initial?: {
    condition?: string;
    purchasePrice?: number | null;
    acquiredAt?: string | null;
    notes?: string | null;
    forTrade?: boolean;
  };
}) {
  // Quantity is a discrete action, not typed input, so it tracks the server
  // value through useOptimistic — a stale useState copy would drift out of
  // sync whenever anything else revalidated the page.
  const [qty, bumpQty] = useOptimistic(quantity, (prev, delta: number) =>
    Math.max(1, prev + delta),
  );

  // The remaining fields are genuine text input: local state is correct here,
  // seeded from whatever was previously saved.
  const [condition, setCondition] = useState(initial.condition ?? "opened_complete");
  const [price, setPrice] = useState(initial.purchasePrice?.toString() ?? "");
  const [acquired, setAcquired] = useState(initial.acquiredAt ?? "");
  const [notes, setNotes] = useState(initial.notes ?? "");
  const [forTrade, setForTrade] = useState(initial.forTrade ?? false);

  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function adjust(delta: number) {
    setError(null);
    startTransition(async () => {
      bumpQty(delta);
      const res = await setQuantity(figureId, delta);
      // No rollback needed — the optimistic layer is dropped when the
      // transition ends and the server value takes over again.
      if (!res.ok) {
        setError(res.error);
        setStatus("error");
      }
    });
  }

  function save() {
    setError(null);
    startTransition(async () => {
      const parsed = price.trim() === "" ? null : Number(price);
      const res = await updateOwnedDetails(figureId, {
        condition,
        purchasePrice: parsed,
        acquiredAt: acquired || null,
        notes: notes.trim() || null,
        forTrade,
      });
      if (res.ok) {
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2000);
      } else {
        setError(res.error);
        setStatus("error");
      }
    });
  }

  return (
    <div className="border border-hairline bg-surface p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label mb-1.5 block">Quantity</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn px-3"
              onClick={() => adjust(-1)}
              disabled={pending || qty <= 1}
              aria-label="Decrease quantity"
            >
              &minus;
            </button>
            <span className="font-display min-w-8 text-center text-xl font-bold">{qty}</span>
            <button
              type="button"
              className="btn px-3"
              onClick={() => adjust(1)}
              disabled={pending}
              aria-label="Increase quantity"
            >
              +
            </button>
            {qty > 1 && <span className="label ml-1">duplicates</span>}
          </div>
        </div>

        <div>
          <label className="label mb-1.5 block" htmlFor="condition">
            Condition
          </label>
          <select
            id="condition"
            className="input"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label mb-1.5 block" htmlFor="price">
            Paid
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            className="input"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div>
          <label className="label mb-1.5 block" htmlFor="acquired">
            Acquired
          </label>
          <input
            id="acquired"
            type="date"
            className="input"
            value={acquired}
            onChange={(e) => setAcquired(e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="label mb-1.5 block" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            className="input resize-y"
            rows={2}
            placeholder="Where you found it, condition details, trade history…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-hairline pt-4">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={forTrade}
            onChange={(e) => setForTrade(e.target.checked)}
            className="size-4 accent-[var(--color-accent)]"
          />
          <span className="label-bright">Available to trade</span>
        </label>

        <button type="button" className="btn btn-accent ml-auto" onClick={save} disabled={pending}>
          {pending ? "saving…" : "save"}
        </button>

        {status === "saved" && (
          <span className="label" style={{ color: "var(--color-variant)" }} role="status">
            saved
          </span>
        )}
        {status === "error" && error && (
          <span className="label" style={{ color: "var(--color-accent)" }} role="alert">
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
