"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { collectionItems, wishlistItems } from "@/lib/schema";

export type ActionResult = { ok: true } | { ok: false; error: string };

const CONDITIONS = ["mint_in_box", "opened_complete", "opened_no_box", "damaged"] as const;

/** Add to collection, or bump quantity if already owned. */
export async function toggleOwned(figureId: number): Promise<ActionResult> {
  try {
    const user = await requireUser();

    const existing = db
      .select({ figureId: collectionItems.figureId })
      .from(collectionItems)
      .where(
        and(eq(collectionItems.userId, user.id), eq(collectionItems.figureId, figureId)),
      )
      .get();

    if (existing) {
      db.delete(collectionItems)
        .where(and(eq(collectionItems.userId, user.id), eq(collectionItems.figureId, figureId)))
        .run();
    } else {
      db.insert(collectionItems).values({ userId: user.id, figureId }).run();
      // Owning it makes the wishlist entry moot.
      db.delete(wishlistItems)
        .where(and(eq(wishlistItems.userId, user.id), eq(wishlistItems.figureId, figureId)))
        .run();
    }

    revalidate();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: message(err) };
  }
}

export async function toggleWishlist(figureId: number): Promise<ActionResult> {
  try {
    const user = await requireUser();

    const existing = db
      .select({ figureId: wishlistItems.figureId })
      .from(wishlistItems)
      .where(and(eq(wishlistItems.userId, user.id), eq(wishlistItems.figureId, figureId)))
      .get();

    if (existing) {
      db.delete(wishlistItems)
        .where(and(eq(wishlistItems.userId, user.id), eq(wishlistItems.figureId, figureId)))
        .run();
    } else {
      db.insert(wishlistItems).values({ userId: user.id, figureId }).run();
    }

    revalidate();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: message(err) };
  }
}

export async function setQuantity(figureId: number, delta: number): Promise<ActionResult> {
  try {
    const user = await requireUser();
    const where = and(
      eq(collectionItems.userId, user.id),
      eq(collectionItems.figureId, figureId),
    );

    const row = db
      .select({ quantity: collectionItems.quantity })
      .from(collectionItems)
      .where(where)
      .get();
    if (!row) return { ok: false, error: "Not in your collection" };

    const next = row.quantity + delta;
    if (next < 1) {
      db.delete(collectionItems).where(where).run();
    } else {
      db.update(collectionItems)
        .set({ quantity: next })
        .where(where)
        .run();
    }

    revalidate();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: message(err) };
  }
}

/** Update the collector-supplied fields on an owned figure. */
export async function updateOwnedDetails(
  figureId: number,
  patch: {
    condition?: string;
    purchasePrice?: number | null;
    acquiredAt?: string | null;
    notes?: string | null;
    forTrade?: boolean;
  },
): Promise<ActionResult> {
  try {
    const user = await requireUser();

    if (patch.condition && !CONDITIONS.includes(patch.condition as (typeof CONDITIONS)[number])) {
      return { ok: false, error: "Unknown condition" };
    }
    if (
      patch.purchasePrice !== undefined &&
      patch.purchasePrice !== null &&
      (!Number.isFinite(patch.purchasePrice) || patch.purchasePrice < 0)
    ) {
      return { ok: false, error: "Price must be a positive number" };
    }

    const res = db
      .update(collectionItems)
      .set(patch)
      .where(
        and(eq(collectionItems.userId, user.id), eq(collectionItems.figureId, figureId)),
      )
      .run();

    if (res.changes === 0) return { ok: false, error: "Not in your collection" };

    revalidate();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: message(err) };
  }
}

/**
 * Wishlist a whole series — for a set the collector has decided to chase.
 *
 * Figures already in their collection are skipped: the dashboard files the
 * wishlist under "Hunting", and you don't hunt what's already on the shelf.
 * So this means "everything in this set I'm still missing".
 */
export async function wantEntireSeries(seriesId: number): Promise<ActionResult> {
  try {
    const user = await requireUser();
    db.run(sql`
      INSERT OR IGNORE INTO wishlist_items (user_id, figure_id)
      SELECT ${user.id}, f.id
        FROM figures f
       WHERE f.series_id = ${seriesId}
         AND f.id NOT IN (
           SELECT figure_id FROM collection_items WHERE user_id = ${user.id}
         )
    `);
    revalidate();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: message(err) };
  }
}

/** Mark every figure in a series as owned — useful for a completed set. */
export async function ownEntireSeries(seriesId: number): Promise<ActionResult> {
  try {
    const user = await requireUser();
    db.run(sql`
      INSERT OR IGNORE INTO collection_items (user_id, figure_id)
      SELECT ${user.id}, id FROM figures WHERE series_id = ${seriesId}
    `);
    revalidate();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: message(err) };
  }
}

function revalidate() {
  revalidatePath("/", "layout");
}

function message(err: unknown) {
  const text = err instanceof Error ? err.message : "Something went wrong";
  return text === "Not signed in" ? "Sign in to track your collection" : text;
}
