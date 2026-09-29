module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/lib/queries.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAdjacentSeries",
    ()=>getAdjacentSeries,
    "getCatalogStats",
    ()=>getCatalogStats,
    "getCollectionItems",
    ()=>getCollectionItems,
    "getCollectionSummary",
    ()=>getCollectionSummary,
    "getFigure",
    ()=>getFigure,
    "getFiguresForSeries",
    ()=>getFiguresForSeries,
    "getFilterOptions",
    ()=>getFilterOptions,
    "getOwnedDetails",
    ()=>getOwnedDetails,
    "getSeriesBySlug",
    ()=>getSeriesBySlug,
    "getSeriesFamily",
    ()=>getSeriesFamily,
    "getSeriesProgress",
    ()=>getSeriesProgress,
    "getSeriesThumbnails",
    ()=>getSeriesThumbnails,
    "getWishlist",
    ()=>getWishlist,
    "listSeriesGroups",
    ()=>listSeriesGroups,
    "searchFigures",
    ()=>searchFigures
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/conditions.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/select.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$functions$2f$aggregate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/functions/aggregate.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/sql.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/db.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/schema.ts [app-rsc] (ecmascript)");
;
;
;
const FIGURE_COLUMNS = {
    id: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].id,
    slug: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].slug,
    name: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].name,
    artist: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].artist,
    type: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].type,
    status: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].status,
    rarity: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].rarity,
    size: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].size,
    box: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].box,
    hasCard: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].hasCard,
    retailPrice: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].retailPrice,
    releaseYear: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].releaseYear,
    releasedAt: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].releasedAt,
    setPosition: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].setPosition,
    setTotal: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].setTotal,
    imageUrl: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].imageUrl,
    imagePath: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].imagePath,
    imageAspect: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].imageAspect,
    detailComplete: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].detailComplete,
    seriesId: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].seriesId,
    seriesName: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"].name,
    seriesSlug: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"].slug
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
 */ const PRIMARY_SLUG = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
  (SELECT s2.slug FROM series s2
    WHERE s2.base_name = series.base_name
    ORDER BY (s2.qualifier IS NOT NULL), s2.figure_count DESC
    LIMIT 1)`;
function listSeriesGroups() {
    const rows = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select({
        baseName: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"].baseName,
        totalFigures: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`sum(${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"].figureCount})`,
        variantCount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$functions$2f$aggregate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["count"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"].id),
        minYear: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`min(${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"].releaseYear})`,
        primarySlug: PRIMARY_SLUG
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"]).groupBy(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"].baseName).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["asc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"].baseName)).all();
    return rows;
}
function getSeriesThumbnails(perSeries = 3) {
    const rows = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].all(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
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
    const map = new Map();
    for (const r of rows){
        const thumb = {
            path: r.imagePath,
            aspect: r.imageAspect
        };
        const list = map.get(r.baseName);
        if (list) list.push(thumb);
        else map.set(r.baseName, [
            thumb
        ]);
    }
    return map;
}
function getAdjacentSeries(baseName) {
    const row = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].get(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
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
    if (!row) return {
        prev: null,
        next: null,
        position: 0,
        total: 0
    };
    return {
        prev: row.prevName && row.prevSlug ? {
            baseName: row.prevName,
            slug: row.prevSlug
        } : null,
        next: row.nextName && row.nextSlug ? {
            baseName: row.nextName,
            slug: row.nextSlug
        } : null,
        position: Number(row.position),
        total: Number(row.total)
    };
}
function getSeriesBySlug(slug) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"].slug, slug)).get() ?? null;
}
function getSeriesFamily(baseName) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"].baseName, baseName)).orderBy(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`(${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"].qualifier} IS NOT NULL)`, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"].figureCount)).all();
}
/** Attach the viewer's owned quantity and wishlist flag to a set of figures. */ function decorateOwnership(rows, userId) {
    if (!userId || rows.length === 0) {
        return rows.map((r)=>({
                ...r,
                ownedQty: null,
                wishlisted: false
            }));
    }
    const ids = rows.map((r)=>r.id);
    const owned = new Map(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select({
        figureId: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].figureId,
        quantity: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].quantity
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].userId, userId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["inArray"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].figureId, ids))).all().map((r)=>[
            r.figureId,
            r.quantity
        ]));
    const wanted = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select({
        figureId: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["wishlistItems"].figureId
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["wishlistItems"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["wishlistItems"].userId, userId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["inArray"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["wishlistItems"].figureId, ids))).all().map((r)=>r.figureId));
    return rows.map((r)=>({
            ...r,
            ownedQty: owned.get(r.id) ?? null,
            wishlisted: wanted.has(r.id)
        }));
}
function getFiguresForSeries(seriesIds, userId) {
    if (seriesIds.length === 0) return [];
    const rows = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select(FIGURE_COLUMNS).from(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"]).innerJoin(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].seriesId, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"].id)).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["inArray"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].seriesId, seriesIds)).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["asc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"].name), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["asc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].setPosition), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["asc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].name)).all();
    return decorateOwnership(rows, userId);
}
function getFigure(seriesSlug, figureSlug, userId) {
    const row = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select(FIGURE_COLUMNS).from(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"]).innerJoin(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].seriesId, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"].id)).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"].slug, seriesSlug), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].slug, figureSlug))).get();
    if (!row) return null;
    return decorateOwnership([
        row
    ], userId)[0];
}
function searchFigures(filters, userId) {
    const perPage = Math.min(filters.perPage ?? 60, 200);
    const page = Math.max(filters.page ?? 1, 1);
    const offset = (page - 1) * perPage;
    const conditions = [];
    if (filters.q?.trim()) {
        // FTS5 prefix search on each term, so "star wars ky" matches "Kylo Ren".
        const terms = filters.q.trim().replace(/["']/g, "").split(/\s+/).filter(Boolean).map((t)=>`"${t}"*`).join(" AND ");
        conditions.push(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].id} IN (SELECT rowid FROM figures_fts WHERE figures_fts MATCH ${terms})`);
    }
    if (filters.type) conditions.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].type, filters.type));
    if (filters.size) conditions.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].size, filters.size));
    if (filters.status) conditions.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].status, filters.status));
    if (filters.year) conditions.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].releaseYear, filters.year));
    if (filters.artist) conditions.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].artist, filters.artist));
    if (userId && filters.owned === "owned") {
        conditions.push(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].id} IN (SELECT figure_id FROM collection_items WHERE user_id = ${userId})`);
    } else if (userId && filters.owned === "missing") {
        conditions.push(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].id} NOT IN (SELECT figure_id FROM collection_items WHERE user_id = ${userId})`);
    } else if (userId && filters.owned === "wishlist") {
        conditions.push(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].id} IN (SELECT figure_id FROM wishlist_items WHERE user_id = ${userId})`);
    }
    const where = conditions.length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["and"])(...conditions) : undefined;
    const total = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select({
        n: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$functions$2f$aggregate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["count"])()
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"]).innerJoin(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].seriesId, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"].id)).where(where).get()?.n ?? 0;
    const rows = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select(FIGURE_COLUMNS).from(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"]).innerJoin(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].seriesId, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"].id)).where(where).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["asc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"].name), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["asc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].setPosition), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["asc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].name)).limit(perPage).offset(offset).all();
    return {
        rows: decorateOwnership(rows, userId),
        total,
        page,
        perPage
    };
}
function getFilterOptions() {
    const distinct = (col)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].selectDistinct({
            v: col
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isNotNull"])(col)).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["asc"])(col)).all().map((r)=>r.v).filter(Boolean);
    const years = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].selectDistinct({
        v: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].releaseYear
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isNotNull"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].releaseYear)).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].releaseYear)).all().map((r)=>r.v).filter(Boolean);
    return {
        types: distinct(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].type),
        sizes: distinct(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].size),
        statuses: distinct(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].status),
        years
    };
}
function getCatalogStats() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select({
        figures: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$functions$2f$aggregate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["count"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].id),
        series: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`(SELECT COUNT(DISTINCT base_name) FROM series)`,
        artists: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`(SELECT COUNT(DISTINCT artist) FROM figures WHERE artist IS NOT NULL)`,
        chasers: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`(SELECT COUNT(*) FROM figures WHERE type = 'chaser')`
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"]).get();
}
function getCollectionSummary(userId) {
    const totals = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select({
        distinctOwned: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$functions$2f$aggregate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["count"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].figureId),
        totalPieces: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`COALESCE(SUM(${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].quantity}), 0)`,
        spent: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`COALESCE(SUM(${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].purchasePrice} * ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].quantity}), 0)`,
        forTrade: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`COALESCE(SUM(CASE WHEN ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].forTrade} = 1 THEN 1 ELSE 0 END), 0)`
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].userId, userId)).get();
    // An aggregate with no matching rows still returns a row, but type it as
    // definite so callers don't each have to guard.
    const safeTotals = {
        distinctOwned: totals?.distinctOwned ?? 0,
        totalPieces: Number(totals?.totalPieces ?? 0),
        spent: Number(totals?.spent ?? 0),
        forTrade: Number(totals?.forTrade ?? 0)
    };
    const catalogTotal = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select({
        n: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$functions$2f$aggregate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["count"])()
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"]).get()?.n ?? 0;
    const wishlist = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select({
        n: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$functions$2f$aggregate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["count"])()
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["wishlistItems"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["wishlistItems"].userId, userId)).get()?.n ?? 0;
    const byType = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select({
        type: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].type,
        n: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$functions$2f$aggregate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["count"])()
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"]).innerJoin(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].figureId, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].id)).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].userId, userId)).groupBy(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].type).all();
    return {
        ...safeTotals,
        catalogTotal,
        wishlist,
        byType
    };
}
function getSeriesProgress(userId, { onlyStarted = true } = {}) {
    // HAVING and ORDER BY can't reference SELECT aliases, so the aggregates are
    // defined once here and spliced into every clause that needs them.
    const ownedExpr = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`COALESCE(SUM(CASE WHEN ci.figure_id IS NOT NULL THEN 1 ELSE 0 END), 0)`;
    const totalExpr = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`COUNT(${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].id})`;
    const rows = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select({
        baseName: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"].baseName,
        primarySlug: PRIMARY_SLUG,
        total: totalExpr,
        owned: ownedExpr
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"]).innerJoin(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].seriesId, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"].id)).leftJoin(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`collection_items ci`, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`ci.figure_id = ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].id} AND ci.user_id = ${userId}`).groupBy(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"].baseName).having(onlyStarted ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`${ownedExpr} > 0` : undefined).orderBy(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`(CAST(${ownedExpr} AS REAL) / ${totalExpr}) DESC`, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`${totalExpr} DESC`).all();
    return rows;
}
function getOwnedDetails(userId, figureId) {
    const row = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select({
        quantity: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].quantity,
        condition: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].condition,
        purchasePrice: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].purchasePrice,
        acquiredAt: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].acquiredAt,
        notes: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].notes,
        forTrade: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].forTrade
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].userId, userId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].figureId, figureId))).get();
    return row ?? null;
}
function getCollectionItems(userId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select({
        ...FIGURE_COLUMNS,
        quantity: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].quantity,
        condition: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].condition,
        purchasePrice: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].purchasePrice,
        acquiredAt: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].acquiredAt,
        notes: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].notes,
        forTrade: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].forTrade
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"]).innerJoin(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].figureId, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].id)).innerJoin(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].seriesId, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"].id)).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].userId, userId)).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collectionItems"].addedAt)).all();
}
function getWishlist(userId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select({
        ...FIGURE_COLUMNS,
        priority: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["wishlistItems"].priority,
        notes: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["wishlistItems"].notes
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["wishlistItems"]).innerJoin(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["wishlistItems"].figureId, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].id)).innerJoin(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].seriesId, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"].id)).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["wishlistItems"].userId, userId)).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["wishlistItems"].priority), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["asc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["series"].name), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["asc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figures"].name)).all();
}
}),
"[project]/app/_components/OwnershipButtons.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OwnershipButtons",
    ()=>OwnershipButtons
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const OwnershipButtons = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call OwnershipButtons() from the server but OwnershipButtons is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/_components/OwnershipButtons.tsx <module evaluation>", "OwnershipButtons");
}),
"[project]/app/_components/OwnershipButtons.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OwnershipButtons",
    ()=>OwnershipButtons
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const OwnershipButtons = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call OwnershipButtons() from the server but OwnershipButtons is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/_components/OwnershipButtons.tsx", "OwnershipButtons");
}),
"[project]/app/_components/OwnershipButtons.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$OwnershipButtons$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/app/_components/OwnershipButtons.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$OwnershipButtons$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/app/_components/OwnershipButtons.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$OwnershipButtons$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/app/_components/RarityTag.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RarityTag",
    ()=>RarityTag,
    "rarityColor",
    ()=>rarityColor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
;
const RARITY = {
    common: {
        label: "common",
        color: "var(--color-common)"
    },
    variant: {
        label: "variant",
        color: "var(--color-variant)"
    },
    chaser: {
        label: "chaser",
        color: "var(--color-chaser)"
    },
    topper: {
        label: "topper",
        color: "var(--color-topper)"
    }
};
function rarityColor(type) {
    return RARITY[type]?.color ?? "var(--color-common)";
}
function RarityTag({ type, className = "" }) {
    const meta = RARITY[type] ?? {
        label: type,
        color: "var(--color-common)"
    };
    const isCommon = type === "common";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `label inline-flex items-center gap-1.5 ${className}`,
        style: {
            color: isCommon ? undefined : meta.color
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": true,
                className: "inline-block size-1.5 rounded-full",
                style: {
                    background: meta.color
                }
            }, void 0, false, {
                fileName: "[project]/app/_components/RarityTag.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            meta.label
        ]
    }, void 0, true, {
        fileName: "[project]/app/_components/RarityTag.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/_components/thumb.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "THUMB_BOX",
    ()=>THUMB_BOX,
    "emptyThumbStyle",
    ()=>emptyThumbStyle,
    "thumbStyle",
    ()=>thumbStyle
]);
/**
 * Thumbnail framing for figure photos.
 *
 * The photos come from two unrelated sources with opposite shapes, so there is
 * no single crop that suits both:
 *
 *  - Archived catalogue shots are ~729x400 landscape composites — several views
 *    of the figure, often with packaging and the artist's signature, on white.
 *    Shown whole at thumbnail size the figure is unrecognisably small, so these
 *    zoom to the front view at the left edge.
 *
 *  - Hand-added photos are typically portrait single-figure shots (~220x310).
 *    Zooming those magnifies a fragment and throws the figure off-centre; they
 *    just need to be fitted whole and centred.
 *
 * link-images.mjs records each image's aspect ratio, so the choice is made from
 * the actual file rather than assumed. Framing stays in CSS so re-tuning never
 * means re-fetching ~300 MB of photos.
 */ /** Above this, an image is a multi-view composite rather than a single figure. */ const COMPOSITE_ASPECT = 1.2;
const BOX = {
    aspectRatio: "3 / 4",
    backgroundColor: "var(--color-plate, #f2efe9)",
    backgroundRepeat: "no-repeat"
};
/** Zoom to the front view at the left edge of a wide composite. */ const COMPOSITE_CROP = {
    backgroundSize: "385% auto",
    backgroundPosition: "2% 88%"
};
/** Fit a single-figure shot whole, centred, with a little breathing room. */ const SINGLE_FIT = {
    backgroundSize: "contain",
    backgroundPosition: "center center"
};
const THUMB_BOX = BOX;
function thumbStyle(imagePath, aspect) {
    const framing = aspect != null && aspect > COMPOSITE_ASPECT ? COMPOSITE_CROP : SINGLE_FIT;
    return {
        backgroundImage: `url("${imagePath}")`,
        ...BOX,
        ...framing
    };
}
function emptyThumbStyle() {
    return {
        aspectRatio: "3 / 4",
        backgroundColor: "var(--color-surface, #17171b)"
    };
}
}),
"[project]/app/_components/VinylSilhouette.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VinylSilhouette",
    ()=>VinylSilhouette
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
;
/**
 * Placeholder mark for figures with no photo: the Vinylmation body shape —
 * mouse-ear head over a rounded torso.
 *
 * The viewBox is cropped to the artwork's real bounds rather than a plain
 * 0 0 100 100. Two reasons:
 *
 *  - The shape isn't vertically centred in a square viewBox (its content runs
 *    y 12→94, so the visual midpoint is 53). Centring the *element* therefore
 *    left the figure looking low and off-centre.
 *  - A square viewBox inside the 3:4 plate letterboxes, so the mark rendered
 *    noticeably smaller than the space allowed.
 *
 * Cropping to 11 10 78 86 puts the artwork's centre at the viewBox centre, so
 * ordinary xMidYMid centring now lands it exactly.
 */ const SHAPE = "M31 60h38a8 8 0 0 1 8 8v18a8 8 0 0 1-8 8H31a8 8 0 0 1-8-8V68a8 8 0 0 1 8-8Z";
function Body() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "27",
                cy: "26",
                r: "14"
            }, void 0, false, {
                fileName: "[project]/app/_components/VinylSilhouette.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "73",
                cy: "26",
                r: "14"
            }, void 0, false, {
                fileName: "[project]/app/_components/VinylSilhouette.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "50",
                cy: "42",
                r: "23"
            }, void 0, false, {
                fileName: "[project]/app/_components/VinylSilhouette.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: SHAPE
            }, void 0, false, {
                fileName: "[project]/app/_components/VinylSilhouette.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function VinylSilhouette({ color, /** Height as a share of the container; width follows the shape's aspect. */ scale = "62%", animate = true }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "11 10 78 86",
        "aria-hidden": true,
        // Sized inline so a missing arbitrary-value utility can't collapse it.
        style: {
            height: scale,
            width: "auto"
        },
        className: animate ? "transition-transform duration-500 group-hover:scale-105" : undefined,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                fill: color,
                opacity: "0.17",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Body, {}, void 0, false, {
                    fileName: "[project]/app/_components/VinylSilhouette.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/_components/VinylSilhouette.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                fill: "none",
                stroke: color,
                strokeWidth: "1.5",
                opacity: "0.5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Body, {}, void 0, false, {
                    fileName: "[project]/app/_components/VinylSilhouette.tsx",
                    lineNumber: 53,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/_components/VinylSilhouette.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/_components/VinylSilhouette.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/_components/FigureCard.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FigureCard",
    ()=>FigureCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$OwnershipButtons$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/_components/OwnershipButtons.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$RarityTag$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/_components/RarityTag.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$thumb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/_components/thumb.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$VinylSilhouette$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/_components/VinylSilhouette.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
function FigureCard({ figure, signedIn, index = 0 }) {
    const owned = (figure.ownedQty ?? 0) > 0;
    const href = `/figure/${figure.seriesSlug}/${figure.slug}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: "cell rise group flex flex-col",
        // Cap the stagger so late rows don't wait seconds to appear.
        style: {
            animationDelay: `${Math.min(index, 24) * 18}ms`
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": true,
                className: "absolute inset-y-0 left-0 w-[2px] transition-opacity",
                style: {
                    background: owned ? "var(--color-accent)" : (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$RarityTag$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rarityColor"])(figure.type),
                    opacity: owned ? 1 : 0.35
                }
            }, void 0, false, {
                fileName: "[project]/app/_components/FigureCard.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                href: href,
                className: "flex flex-1 flex-col p-3 pl-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(FigureThumb, {
                        figure: figure
                    }, void 0, false, {
                        fileName: "[project]/app/_components/FigureCard.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 flex items-start justify-between gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$RarityTag$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RarityTag"], {
                                type: figure.type
                            }, void 0, false, {
                                fileName: "[project]/app/_components/FigureCard.tsx",
                                lineNumber: 43,
                                columnNumber: 11
                            }, this),
                            owned && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "label",
                                style: {
                                    color: "var(--color-accent)"
                                },
                                children: [
                                    "×",
                                    figure.ownedQty
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/_components/FigureCard.tsx",
                                lineNumber: 45,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/_components/FigureCard.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "mt-1.5 font-display text-[0.9375rem] leading-tight font-semibold text-ink transition-colors group-hover:text-accent",
                        children: figure.name
                    }, void 0, false, {
                        fileName: "[project]/app/_components/FigureCard.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "label mt-1 line-clamp-1",
                        title: figure.seriesName,
                        children: figure.seriesName
                    }, void 0, false, {
                        fileName: "[project]/app/_components/FigureCard.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-auto flex items-center gap-2 pt-2.5",
                        children: [
                            figure.setTotal ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "label",
                                children: [
                                    figure.setPosition ?? "?",
                                    "/",
                                    figure.setTotal
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/_components/FigureCard.tsx",
                                lineNumber: 64,
                                columnNumber: 13
                            }, this) : null,
                            figure.rarity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "label",
                                children: figure.rarity
                            }, void 0, false, {
                                fileName: "[project]/app/_components/FigureCard.tsx",
                                lineNumber: 68,
                                columnNumber: 29
                            }, this),
                            figure.size && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "label ml-auto",
                                children: figure.size
                            }, void 0, false, {
                                fileName: "[project]/app/_components/FigureCard.tsx",
                                lineNumber: 69,
                                columnNumber: 27
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/_components/FigureCard.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/_components/FigureCard.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            signedIn && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t border-hairline px-3 py-2 pl-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$OwnershipButtons$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["OwnershipButtons"], {
                    figureId: figure.id,
                    owned: owned,
                    wishlisted: figure.wishlisted,
                    compact: true
                }, void 0, false, {
                    fileName: "[project]/app/_components/FigureCard.tsx",
                    lineNumber: 75,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/_components/FigureCard.tsx",
                lineNumber: 74,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/_components/FigureCard.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
/**
 * CROP_NOTE — the archived photos are wide (729x400) composite product shots on
 * white, and their layouts vary: some are figure + packaging + artist
 * signature, others are four rotated views of the figure alone. Shown whole at
 * thumbnail size the figure is unrecognisably small, so the grid crops instead.
 *
 * The one reliable constant across layouts is a front view of the figure at the
 * left edge, so thumbnails zoom to roughly the left quarter, bottom-weighted to
 * skip the logo band. Portrait suits the subject. Sizing lives here rather than
 * in the download so re-cropping never means re-fetching 260 MB.
 *
 * The plate is a warm off-white: these images carry their own white background,
 * which would otherwise glare against the dark UI. The no-image fallback uses
 * the same plate so a partially-illustrated grid stays consistent.
 */ function FigureThumb({ figure }) {
    if (figure.imagePath) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            role: "img",
            "aria-label": figure.name,
            className: "relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.03]",
            style: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$thumb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["thumbStyle"])(figure.imagePath, figure.imageAspect)
        }, void 0, false, {
            fileName: "[project]/app/_components/FigureCard.tsx",
            lineNumber: 105,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative flex items-center justify-center overflow-hidden",
        style: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$thumb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["THUMB_BOX"],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$VinylSilhouette$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VinylSilhouette"], {
            color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$RarityTag$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rarityColor"])(figure.type)
        }, void 0, false, {
            fileName: "[project]/app/_components/FigureCard.tsx",
            lineNumber: 120,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/_components/FigureCard.tsx",
        lineNumber: 116,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/_components/FilterBar.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FilterBar",
    ()=>FilterBar
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const FilterBar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call FilterBar() from the server but FilterBar is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/_components/FilterBar.tsx <module evaluation>", "FilterBar");
}),
"[project]/app/_components/FilterBar.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FilterBar",
    ()=>FilterBar
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const FilterBar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call FilterBar() from the server but FilterBar is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/_components/FilterBar.tsx", "FilterBar");
}),
"[project]/app/_components/FilterBar.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$FilterBar$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/app/_components/FilterBar.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$FilterBar$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/app/_components/FilterBar.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$FilterBar$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/app/search/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SearchPage,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/queries.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$FigureCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/_components/FigureCard.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$FilterBar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/_components/FilterBar.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
const metadata = {
    title: "Search // Vinylmation Vault"
};
async function SearchPage({ searchParams }) {
    const sp = await searchParams;
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["currentUser"])();
    const one = (k)=>{
        const v = sp[k];
        return (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
    };
    const filters = {
        q: one("q"),
        type: one("type"),
        size: one("size"),
        status: one("status"),
        artist: one("artist"),
        year: one("year") ? Number(one("year")) : undefined,
        owned: one("owned"),
        page: one("page") ? Math.max(1, Number(one("page"))) : 1,
        perPage: 60
    };
    const { rows, total, page, perPage } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["searchFigures"])(filters, user?.id);
    const options = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFilterOptions"])();
    const pages = Math.ceil(total / perPage);
    const activeCount = [
        filters.type,
        filters.size,
        filters.status,
        filters.artist,
        filters.year,
        filters.owned
    ].filter(Boolean).length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mx-auto max-w-[1600px] px-4 sm:px-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "border-b border-hairline py-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "label",
                        children: [
                            "Search ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-hairline-bright",
                                children: "//"
                            }, void 0, false, {
                                fileName: "[project]/app/search/page.tsx",
                                lineNumber: 53,
                                columnNumber: 18
                            }, this),
                            " Catalogue"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/search/page.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "mt-3 font-display text-3xl font-extrabold tracking-[-0.02em] sm:text-4xl",
                        children: filters.q ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                "“",
                                filters.q,
                                "”",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "ml-3 text-ink-faint",
                                    children: total.toLocaleString()
                                }, void 0, false, {
                                    fileName: "[project]/app/search/page.tsx",
                                    lineNumber: 59,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                total.toLocaleString(),
                                " figures",
                                activeCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "ml-3 text-ink-faint",
                                    children: "filtered"
                                }, void 0, false, {
                                    fileName: "[project]/app/search/page.tsx",
                                    lineNumber: 64,
                                    columnNumber: 35
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/app/search/page.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/search/page.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$FilterBar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FilterBar"], {
                options: options,
                signedIn: !!user
            }, void 0, false, {
                fileName: "[project]/app/search/page.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            rows.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "py-24 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-display text-2xl font-bold text-ink-dim",
                        children: "Nothing matches."
                    }, void 0, false, {
                        fileName: "[project]/app/search/page.tsx",
                        lineNumber: 74,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-ink-faint",
                        children: "Try a broader search or clear a filter."
                    }, void 0, false, {
                        fileName: "[project]/app/search/page.tsx",
                        lineNumber: 75,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        href: "/search",
                        className: "btn mt-6 inline-block",
                        children: "Clear everything"
                    }, void 0, false, {
                        fileName: "[project]/app/search/page.tsx",
                        lineNumber: 76,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/search/page.tsx",
                lineNumber: 73,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-3 py-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
                        children: rows.map((f, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$_components$2f$FigureCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FigureCard"], {
                                figure: f,
                                signedIn: !!user,
                                index: i
                            }, f.id, false, {
                                fileName: "[project]/app/search/page.tsx",
                                lineNumber: 86,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/search/page.tsx",
                        lineNumber: 82,
                        columnNumber: 11
                    }, this),
                    pages > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Pagination, {
                        page: page,
                        pages: pages,
                        sp: sp,
                        total: total,
                        perPage: perPage
                    }, void 0, false, {
                        fileName: "[project]/app/search/page.tsx",
                        lineNumber: 91,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/app/search/page.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
function Pagination({ page, pages, sp, total, perPage }) {
    const href = (p)=>{
        const params = new URLSearchParams();
        for (const [k, v] of Object.entries(sp)){
            if (k === "page" || v === undefined) continue;
            params.set(k, Array.isArray(v) ? v[0] ?? "" : v);
        }
        if (p > 1) params.set("page", String(p));
        const qs = params.toString();
        return qs ? `/search?${qs}` : "/search";
    };
    // Compact window around the current page.
    const window = new Set([
        1,
        pages,
        page - 1,
        page,
        page + 1
    ]);
    const list = [
        ...window
    ].filter((p)=>p >= 1 && p <= pages).sort((a, b)=>a - b);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "flex flex-wrap items-center justify-between gap-4 border-t border-hairline py-8",
        "aria-label": "Pagination",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "label",
                children: [
                    (page - 1) * perPage + 1,
                    "–",
                    Math.min(page * perPage, total),
                    " of",
                    " ",
                    total.toLocaleString()
                ]
            }, void 0, true, {
                fileName: "[project]/app/search/page.tsx",
                lineNumber: 132,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1.5",
                children: [
                    page > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        href: href(page - 1),
                        className: "btn",
                        children: "prev"
                    }, void 0, false, {
                        fileName: "[project]/app/search/page.tsx",
                        lineNumber: 139,
                        columnNumber: 11
                    }, this),
                    list.map((p, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex items-center gap-1.5",
                            children: [
                                i > 0 && list[i - 1] !== p - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "label px-1",
                                    children: "…"
                                }, void 0, false, {
                                    fileName: "[project]/app/search/page.tsx",
                                    lineNumber: 145,
                                    columnNumber: 48
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                    href: href(p),
                                    className: `btn ${p === page ? "btn-on" : ""}`,
                                    children: p
                                }, void 0, false, {
                                    fileName: "[project]/app/search/page.tsx",
                                    lineNumber: 146,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, p, true, {
                            fileName: "[project]/app/search/page.tsx",
                            lineNumber: 144,
                            columnNumber: 11
                        }, this)),
                    page < pages && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        href: href(page + 1),
                        className: "btn",
                        children: "next"
                    }, void 0, false, {
                        fileName: "[project]/app/search/page.tsx",
                        lineNumber: 152,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/search/page.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/search/page.tsx",
        lineNumber: 128,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/search/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/search/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0nvarpe._.js.map