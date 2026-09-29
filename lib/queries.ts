import { and, asc, count, desc, eq, inArray, isNotNull, sql } from "drizzle-orm";
import type { SQLiteColumn } from "drizzle-orm/sqlite-core";
import { db } from "./db.ts";
import { collectionItems, figures, series, wishlistItems } from "./schema.ts";

export type FigureFilters = {
  q?: string;
  type?: string;
  size?: string;
  status?: string;
  year?: number;
  artist?: string;
  /** "owned" | "missing" | "wishlist" — requires userId */
  owned?: string;
  page?: number;
  perPage?: number;
};

export type FigureRow = {
  id: number;
  slug: string;
  name: string;
  artist: string | null;
  type: string;
  status: string | null;
  rarity: string | null;
  size: string | null;
  box: string | null;
  hasCard: boolean | null;
  retailPrice: number | null;
  releaseYear: number | null;
  releasedAt: string | null;
  setPosition: number | null;
  setTotal: number | null;
  imageUrl: string | null;
  imagePath: string | null;
  imageAspect: number | null;
  detailComplete: boolean;
  seriesId: number;
  seriesName: string;
  seriesSlug: string;
  ownedQty: number | null;
  wishlisted: boolean;
};

const FIGURE_COLUMNS = {
  id: figures.id,
  slug: figures.slug,
  name: figures.name,
  artist: figures.artist,
  type: figures.type,
  status: figures.status,
  rarity: figures.rarity,
  size: figures.size,
  box: figures.box,
  hasCard: figures.hasCard,
  retailPrice: figures.retailPrice,
  releaseYear: figures.releaseYear,
  releasedAt: figures.releasedAt,
  setPosition: figures.setPosition,
  setTotal: figures.setTotal,
  imageUrl: figures.imageUrl,
  imagePath: figures.imagePath,
  imageAspect: figures.imageAspect,
  detailComplete: figures.detailComplete,
  seriesId: figures.seriesId,
  seriesName: series.name,
  seriesSlug: series.slug,
};

/**
 * Slug of the series to link to for a grouped base name — the main line where
 * one exists, otherwise the largest sub-line.
 *
 * The outer column is written as literal `series.base_name` rather than
 * interpolating the Drizzle column. Interpolation renders an *unqualified*
 * `"base_name"`, which SQLite resolves against the subquery's own table (s2),
 * making the predicate `s2.base_name = s2.base_name` — always true. The
 * subquery then stops correlating and returns the same slug for every group,
 * so every link on the browse page pointed at one series.
 */
const PRIMARY_SLUG = sql<string>`
  (SELECT s2.slug FROM series s2
    WHERE s2.base_name = series.base_name
    ORDER BY (s2.qualifier IS NOT NULL), s2.figure_count DESC
    LIMIT 1)`;

/**
 * Series grouped by their base name, so "Animation 2", "Animation 2 : 9"" and
 * "Animation 2 : Set : 3 Little Pigs" appear as one browse entry with the
 * combined figure count.
 */
export function listSeriesGroups() {
  const rows = db
    .select({
      baseName: series.baseName,
      totalFigures: sql<number>`sum(${series.figureCount})`,
      variantCount: count(series.id),
      minYear: sql<number | null>`min(${series.releaseYear})`,
      primarySlug: PRIMARY_SLUG,
    })
    .from(series)
    .groupBy(series.baseName)
    .orderBy(asc(series.baseName))
    .all();

  return rows;
}

/**
 * A few representative photos per base series, for the browse grid.
 *
 * One windowed query rather than a lookup per card — the index renders all 319
 * groups at once, so per-card queries would mean 319 round trips.
 */
export type SeriesThumb = { path: string; aspect: number | null };

export function getSeriesThumbnails(perSeries = 3): Map<string, SeriesThumb[]> {
  const rows = db.all<{ baseName: string; imagePath: string; imageAspect: number | null }>(sql`
    SELECT base_name AS baseName, image_path AS imagePath, image_aspect AS imageAspect FROM (
      SELECT s.base_name, f.image_path, f.image_aspect,
             ROW_NUMBER() OVER (
               PARTITION BY s.base_name
               ORDER BY f.set_position IS NULL, f.set_position, f.name
             ) AS rn
        FROM figures f
        JOIN series s ON s.id = f.series_id
       WHERE f.image_path IS NOT NULL
    )
    WHERE rn <= ${perSeries}
  `);

  const map = new Map<string, SeriesThumb[]>();
  for (const r of rows) {
    const thumb = { path: r.imagePath, aspect: r.imageAspect };
    const list = map.get(r.baseName);
    if (list) list.push(thumb);
    else map.set(r.baseName, [thumb]);
  }
  return map;
}

export type SeriesNeighbours = {
  prev: { baseName: string; slug: string } | null;
  next: { baseName: string; slug: string } | null;
  position: number;
  total: number;
};

/**
 * The series either side of this one, in the same order the browse index uses
 * (alphabetical by base name), so stepping through with the arrows walks the
 * catalogue in the order you'd expect from looking at /series.
 *
 * Neighbours are base *groups*, not raw series rows — otherwise "Animation 2"
 * would step into "Animation 2 : 9\"" rather than on to "Animation 3".
 */
export function getAdjacentSeries(baseName: string): SeriesNeighbours {
  const row = db.get<{
    prevName: string | null;
    prevSlug: string | null;
    nextName: string | null;
    nextSlug: string | null;
    position: number;
    total: number;
  }>(sql`
    WITH grouped AS (
      SELECT base_name,
             (SELECT s2.slug FROM series s2
               WHERE s2.base_name = series.base_name
               ORDER BY (s2.qualifier IS NOT NULL), s2.figure_count DESC
               LIMIT 1) AS slug
        FROM series
       GROUP BY base_name
    ),
    ordered AS (
      SELECT base_name, slug,
             LAG(base_name)  OVER w AS prevName,
             LAG(slug)       OVER w AS prevSlug,
             LEAD(base_name) OVER w AS nextName,
             LEAD(slug)      OVER w AS nextSlug,
             ROW_NUMBER()    OVER w AS position,
             COUNT(*)        OVER () AS total
        FROM grouped
      WINDOW w AS (ORDER BY base_name)
    )
    SELECT prevName, prevSlug, nextName, nextSlug, position, total
      FROM ordered
     WHERE base_name = ${baseName}
  `);

  if (!row) return { prev: null, next: null, position: 0, total: 0 };

  return {
    prev: row.prevName && row.prevSlug ? { baseName: row.prevName, slug: row.prevSlug } : null,
    next: row.nextName && row.nextSlug ? { baseName: row.nextName, slug: row.nextSlug } : null,
    position: Number(row.position),
    total: Number(row.total),
  };
}

export function getSeriesBySlug(slug: string) {
  return db.select().from(series).where(eq(series.slug, slug)).get() ?? null;
}

/** All series sharing a base name, ordered with the main line first. */
export function getSeriesFamily(baseName: string) {
  return db
    .select()
    .from(series)
    .where(eq(series.baseName, baseName))
    .orderBy(sql`(${series.qualifier} IS NOT NULL)`, desc(series.figureCount))
    .all();
}

/** Attach the viewer's owned quantity and wishlist flag to a set of figures. */
function decorateOwnership(rows: Omit<FigureRow, "ownedQty" | "wishlisted">[], userId?: number) {
  if (!userId || rows.length === 0) {
    return rows.map((r) => ({ ...r, ownedQty: null, wishlisted: false }));
  }
  const ids = rows.map((r) => r.id);

  const owned = new Map(
    db
      .select({ figureId: collectionItems.figureId, quantity: collectionItems.quantity })
      .from(collectionItems)
      .where(and(eq(collectionItems.userId, userId), inArray(collectionItems.figureId, ids)))
      .all()
      .map((r) => [r.figureId, r.quantity]),
  );

  const wanted = new Set(
    db
      .select({ figureId: wishlistItems.figureId })
      .from(wishlistItems)
      .where(and(eq(wishlistItems.userId, userId), inArray(wishlistItems.figureId, ids)))
      .all()
      .map((r) => r.figureId),
  );

  return rows.map((r) => ({
    ...r,
    ownedQty: owned.get(r.id) ?? null,
    wishlisted: wanted.has(r.id),
  }));
}

export function getFiguresForSeries(seriesIds: number[], userId?: number): FigureRow[] {
  if (seriesIds.length === 0) return [];
  const rows = db
    .select(FIGURE_COLUMNS)
    .from(figures)
    .innerJoin(series, eq(figures.seriesId, series.id))
    .where(inArray(figures.seriesId, seriesIds))
    .orderBy(asc(series.name), asc(figures.setPosition), asc(figures.name))
    .all();
  return decorateOwnership(rows, userId);
}

export function getFigure(seriesSlug: string, figureSlug: string, userId?: number) {
  const row = db
    .select(FIGURE_COLUMNS)
    .from(figures)
    .innerJoin(series, eq(figures.seriesId, series.id))
    .where(and(eq(series.slug, seriesSlug), eq(figures.slug, figureSlug)))
    .get();
  if (!row) return null;
  return decorateOwnership([row], userId)[0];
}

/**
 * Catalog search. Text queries go through the FTS index; everything else is a
 * plain filtered scan. Returns a page of rows plus the total match count.
 */
export function searchFigures(filters: FigureFilters, userId?: number) {
  const perPage = Math.min(filters.perPage ?? 60, 200);
  const page = Math.max(filters.page ?? 1, 1);
  const offset = (page - 1) * perPage;

  const conditions = [];

  if (filters.q?.trim()) {
    // FTS5 prefix search on each term, so "star wars ky" matches "Kylo Ren".
    const terms = filters.q
      .trim()
      .replace(/["']/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .map((t) => `"${t}"*`)
      .join(" AND ");
    conditions.push(
      sql`${figures.id} IN (SELECT rowid FROM figures_fts WHERE figures_fts MATCH ${terms})`,
    );
  }
  if (filters.type) conditions.push(eq(figures.type, filters.type));
  if (filters.size) conditions.push(eq(figures.size, filters.size));
  if (filters.status) conditions.push(eq(figures.status, filters.status));
  if (filters.year) conditions.push(eq(figures.releaseYear, filters.year));
  if (filters.artist) conditions.push(eq(figures.artist, filters.artist));

  if (userId && filters.owned === "owned") {
    conditions.push(
      sql`${figures.id} IN (SELECT figure_id FROM collection_items WHERE user_id = ${userId})`,
    );
  } else if (userId && filters.owned === "missing") {
    conditions.push(
      sql`${figures.id} NOT IN (SELECT figure_id FROM collection_items WHERE user_id = ${userId})`,
    );
  } else if (userId && filters.owned === "wishlist") {
    conditions.push(
      sql`${figures.id} IN (SELECT figure_id FROM wishlist_items WHERE user_id = ${userId})`,
    );
  }

  const where = conditions.length ? and(...conditions) : undefined;

  const total =
    db
      .select({ n: count() })
      .from(figures)
      .innerJoin(series, eq(figures.seriesId, series.id))
      .where(where)
      .get()?.n ?? 0;

  const rows = db
    .select(FIGURE_COLUMNS)
    .from(figures)
    .innerJoin(series, eq(figures.seriesId, series.id))
    .where(where)
    .orderBy(asc(series.name), asc(figures.setPosition), asc(figures.name))
    .limit(perPage)
    .offset(offset)
    .all();

  return { rows: decorateOwnership(rows, userId), total, page, perPage };
}

/** Distinct values for the filter dropdowns. */
export function getFilterOptions() {
  const distinct = (col: SQLiteColumn) =>
    db
      .selectDistinct({ v: col })
      .from(figures)
      .where(isNotNull(col))
      .orderBy(asc(col))
      .all()
      .map((r) => r.v)
      .filter(Boolean) as string[];

  const years = db
    .selectDistinct({ v: figures.releaseYear })
    .from(figures)
    .where(isNotNull(figures.releaseYear))
    .orderBy(desc(figures.releaseYear))
    .all()
    .map((r) => r.v)
    .filter(Boolean) as number[];

  return {
    types: distinct(figures.type),
    sizes: distinct(figures.size),
    statuses: distinct(figures.status),
    years,
  };
}

export function getCatalogStats() {
  return db
    .select({
      figures: count(figures.id),
      series: sql<number>`(SELECT COUNT(DISTINCT base_name) FROM series)`,
      artists: sql<number>`(SELECT COUNT(DISTINCT artist) FROM figures WHERE artist IS NOT NULL)`,
      chasers: sql<number>`(SELECT COUNT(*) FROM figures WHERE type = 'chaser')`,
    })
    .from(figures)
    .get();
}

/** Per-user rollup for the dashboard. */
export function getCollectionSummary(userId: number) {
  const totals = db
    .select({
      distinctOwned: count(collectionItems.figureId),
      totalPieces: sql<number>`COALESCE(SUM(${collectionItems.quantity}), 0)`,
      spent: sql<number>`COALESCE(SUM(${collectionItems.purchasePrice} * ${collectionItems.quantity}), 0)`,
      forTrade: sql<number>`COALESCE(SUM(CASE WHEN ${collectionItems.forTrade} = 1 THEN 1 ELSE 0 END), 0)`,
    })
    .from(collectionItems)
    .where(eq(collectionItems.userId, userId))
    .get();

  // An aggregate with no matching rows still returns a row, but type it as
  // definite so callers don't each have to guard.
  const safeTotals = {
    distinctOwned: totals?.distinctOwned ?? 0,
    totalPieces: Number(totals?.totalPieces ?? 0),
    spent: Number(totals?.spent ?? 0),
    forTrade: Number(totals?.forTrade ?? 0),
  };

  const catalogTotal = db.select({ n: count() }).from(figures).get()?.n ?? 0;

  const wishlist =
    db
      .select({ n: count() })
      .from(wishlistItems)
      .where(eq(wishlistItems.userId, userId))
      .get()?.n ?? 0;

  const byType = db
    .select({ type: figures.type, n: count() })
    .from(collectionItems)
    .innerJoin(figures, eq(collectionItems.figureId, figures.id))
    .where(eq(collectionItems.userId, userId))
    .groupBy(figures.type)
    .all();

  return { ...safeTotals, catalogTotal, wishlist, byType };
}

/**
 * Completion progress per base series for the signed-in user, best-first.
 * Drives the "you're 11 of 12 through Animation 2" view that makes a tracker
 * actually useful.
 */
export function getSeriesProgress(userId: number, { onlyStarted = true } = {}) {
  // HAVING and ORDER BY can't reference SELECT aliases, so the aggregates are
  // defined once here and spliced into every clause that needs them.
  const ownedExpr = sql<number>`COALESCE(SUM(CASE WHEN ci.figure_id IS NOT NULL THEN 1 ELSE 0 END), 0)`;
  const totalExpr = sql<number>`COUNT(${figures.id})`;

  const rows = db
    .select({
      baseName: series.baseName,
      primarySlug: PRIMARY_SLUG,
      total: totalExpr,
      owned: ownedExpr,
    })
    .from(series)
    .innerJoin(figures, eq(figures.seriesId, series.id))
    .leftJoin(
      sql`collection_items ci`,
      sql`ci.figure_id = ${figures.id} AND ci.user_id = ${userId}`,
    )
    .groupBy(series.baseName)
    .having(onlyStarted ? sql`${ownedExpr} > 0` : undefined)
    .orderBy(
      sql`(CAST(${ownedExpr} AS REAL) / ${totalExpr}) DESC`,
      sql`${totalExpr} DESC`,
    )
    .all();

  return rows;
}

export type OwnedDetails = {
  quantity: number;
  condition: string;
  purchasePrice: number | null;
  acquiredAt: string | null;
  notes: string | null;
  forTrade: boolean;
};

/**
 * The collector-supplied fields for one figure they own, so the edit form on a
 * figure page can show what was previously saved rather than starting blank.
 */
export function getOwnedDetails(userId: number, figureId: number): OwnedDetails | null {
  const row = db
    .select({
      quantity: collectionItems.quantity,
      condition: collectionItems.condition,
      purchasePrice: collectionItems.purchasePrice,
      acquiredAt: collectionItems.acquiredAt,
      notes: collectionItems.notes,
      forTrade: collectionItems.forTrade,
    })
    .from(collectionItems)
    .where(and(eq(collectionItems.userId, userId), eq(collectionItems.figureId, figureId)))
    .get();

  return row ?? null;
}

export function getCollectionItems(userId: number) {
  return db
    .select({
      ...FIGURE_COLUMNS,
      quantity: collectionItems.quantity,
      condition: collectionItems.condition,
      purchasePrice: collectionItems.purchasePrice,
      acquiredAt: collectionItems.acquiredAt,
      notes: collectionItems.notes,
      forTrade: collectionItems.forTrade,
    })
    .from(collectionItems)
    .innerJoin(figures, eq(collectionItems.figureId, figures.id))
    .innerJoin(series, eq(figures.seriesId, series.id))
    .where(eq(collectionItems.userId, userId))
    .orderBy(desc(collectionItems.addedAt))
    .all();
}

export function getWishlist(userId: number) {
  return db
    .select({
      ...FIGURE_COLUMNS,
      priority: wishlistItems.priority,
      notes: wishlistItems.notes,
    })
    .from(wishlistItems)
    .innerJoin(figures, eq(wishlistItems.figureId, figures.id))
    .innerJoin(series, eq(figures.seriesId, series.id))
    .where(eq(wishlistItems.userId, userId))
    .orderBy(desc(wishlistItems.priority), asc(series.name), asc(figures.name))
    .all();
}
