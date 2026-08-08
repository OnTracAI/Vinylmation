/**
 * Exercises every exported query function in lib/queries.ts against the real
 * database, as a signed-in user with collection and wishlist rows.
 *
 * This exists because smoke-test.mjs originally *reimplemented* the progress
 * SQL in raw form instead of calling getSeriesProgress(), so it passed while
 * the real function was broken (`no such column: owned` — HAVING and ORDER BY
 * can't reference SELECT aliases). Testing a copy of the logic proves nothing
 * about the logic that actually runs; these call the real thing.
 *
 * Run: node --experimental-strip-types scripts/query-test.mts
 */
import Database from "better-sqlite3";
import {
  getCatalogStats,
  getCollectionItems,
  getCollectionSummary,
  getFigure,
  getFiguresForSeries,
  getFilterOptions,
  getSeriesBySlug,
  getSeriesFamily,
  getSeriesProgress,
  getSeriesThumbnails,
  getWishlist,
  listSeriesGroups,
  searchFigures,
} from "../lib/queries.ts";

const db = new Database(process.env.DATABASE_PATH ?? "data/vinylmation.db");
db.pragma("foreign_keys = ON");

// Throwaway user with one owned figure and one wishlisted figure.
const userId = Number(
  (
    db
      .prepare(
        "INSERT INTO users (email, display_name, password_hash) VALUES (?,?,?) RETURNING id",
      )
      .get(`qtest-${Date.now()}@test.local`, "Query Test", "scrypt:x:y") as { id: number }
  ).id,
);
const series = db
  .prepare("SELECT id, slug FROM series WHERE figure_count BETWEEN 8 AND 20 LIMIT 1")
  .get() as { id: number; slug: string };
const figs = db
  .prepare("SELECT id FROM figures WHERE series_id = ?")
  .all(series.id) as { id: number }[];

db.prepare("INSERT INTO collection_items (user_id, figure_id, quantity) VALUES (?,?,2)").run(
  userId,
  figs[0].id,
);
db.prepare("INSERT INTO wishlist_items (user_id, figure_id) VALUES (?,?)").run(
  userId,
  figs[1].id,
);

const checks: [string, () => unknown][] = [
  ["getSeriesProgress (started only)", () => getSeriesProgress(userId)],
  ["getSeriesProgress (all series)", () => getSeriesProgress(userId, { onlyStarted: false })],
  ["getCollectionSummary", () => getCollectionSummary(userId)],
  ["getCollectionItems", () => getCollectionItems(userId)],
  ["getWishlist", () => getWishlist(userId)],
  ["listSeriesGroups", () => listSeriesGroups()],
  ["getCatalogStats", () => getCatalogStats()],
  ["getFilterOptions", () => getFilterOptions()],
  ["searchFigures (text)", () => searchFigures({ q: "kylo" }, userId)],
  ["searchFigures (owned)", () => searchFigures({ owned: "owned" }, userId)],
  ["searchFigures (missing)", () => searchFigures({ owned: "missing" }, userId)],
  ["searchFigures (wishlist)", () => searchFigures({ owned: "wishlist" }, userId)],
  ["searchFigures (paged + filtered)", () => searchFigures({ type: "chaser", page: 2 }, userId)],
  ["searchFigures (anonymous)", () => searchFigures({ q: "mickey" })],
  ["getSeriesBySlug", () => getSeriesBySlug(series.slug)],
  ["getSeriesThumbnails", () => [...getSeriesThumbnails(3).keys()]],
  ["getSeriesFamily", () => getSeriesFamily("Animation 2")],
  ["getFiguresForSeries", () => getFiguresForSeries([series.id], userId)],
  ["getFigure", () => getFigure("star-wars-the-last-jedi", "kylo-ren", userId)],
];

let failed = 0;
const out: string[] = [];

for (const [name, fn] of checks) {
  try {
    const r = fn() as unknown;
    const shape = Array.isArray(r)
      ? `${r.length} rows`
      : r && typeof r === "object" && "rows" in r
        ? `${(r as { rows: unknown[] }).rows.length} rows / ${(r as { total: number }).total} total`
        : r
          ? "ok"
          : "null";
    out.push(`  ✓ ${name} — ${shape}`);
  } catch (err) {
    out.push(`  ✗ ${name} — ${(err as Error).message}`);
    failed++;
  }
}

// Behavioural assertions beyond "it didn't throw".
try {
  const progress = getSeriesProgress(userId) as { baseName: string; owned: number }[];
  if (progress.length === 0) throw new Error("expected the started series to appear");
  if (Number(progress[0].owned) < 1) throw new Error("owned count should be >= 1");
  out.push(`  ✓ progress reports the started series — ${progress.length} entries`);
} catch (err) {
  out.push(`  ✗ progress reports the started series — ${(err as Error).message}`);
  failed++;
}

try {
  const summary = getCollectionSummary(userId);
  if (summary.distinctOwned !== 1) throw new Error(`distinctOwned=${summary.distinctOwned}`);
  if (Number(summary.totalPieces) !== 2) throw new Error(`totalPieces=${summary.totalPieces}`);
  out.push("  ✓ summary counts duplicates separately from unique figures");
} catch (err) {
  out.push(`  ✗ summary counts duplicates — ${(err as Error).message}`);
  failed++;
}

// Regression: a correlated subquery whose outer column was interpolated by
// Drizzle rendered as unqualified `"base_name"`, which SQLite bound to the
// subquery's own table. Every group then got the same slug, so every link on
// the browse page went to the same series. Counting rows didn't catch it —
// these assert the values.
try {
  const groups = listSeriesGroups() as { baseName: string; primarySlug: string }[];
  const slugs = groups.map((g) => g.primarySlug);
  const distinct = new Set(slugs);

  if (slugs.some((s) => !s)) throw new Error("some groups have no primarySlug");
  if (distinct.size !== groups.length) {
    throw new Error(`${distinct.size} distinct slugs for ${groups.length} groups`);
  }

  // Every link must resolve to a real series inside its own family.
  for (const g of groups) {
    const target = getSeriesBySlug(g.primarySlug);
    if (!target) throw new Error(`${g.baseName} -> ${g.primarySlug} is not a series`);
    if (target.baseName !== g.baseName) {
      throw new Error(`${g.baseName} -> ${g.primarySlug} (belongs to ${target.baseName})`);
    }
  }
  out.push(`  ✓ every series group links to its own series (${groups.length} checked)`);
} catch (err) {
  out.push(`  ✗ series group links — ${(err as Error).message}`);
  failed++;
}

try {
  const progress = getSeriesProgress(userId, { onlyStarted: false }) as {
    baseName: string;
    primarySlug: string;
  }[];
  const distinct = new Set(progress.map((p) => p.primarySlug));
  if (distinct.size !== progress.length) {
    throw new Error(`${distinct.size} distinct slugs for ${progress.length} rows`);
  }
  for (const p of progress.slice(0, 50)) {
    const target = getSeriesBySlug(p.primarySlug);
    if (!target || target.baseName !== p.baseName) {
      throw new Error(`${p.baseName} -> ${p.primarySlug}`);
    }
  }
  out.push(`  ✓ progress rows link to their own series (${progress.length} rows)`);
} catch (err) {
  out.push(`  ✗ progress row links — ${(err as Error).message}`);
  failed++;
}

try {
  const owned = searchFigures({ owned: "owned" }, userId);
  const missing = searchFigures({ owned: "missing" }, userId);
  const all = searchFigures({}, userId);
  if (owned.total + missing.total !== all.total) {
    throw new Error(`${owned.total} + ${missing.total} !== ${all.total}`);
  }
  out.push(`  ✓ owned + missing partitions the catalogue (${all.total})`);
} catch (err) {
  out.push(`  ✗ owned/missing partition — ${(err as Error).message}`);
  failed++;
}

db.prepare("DELETE FROM users WHERE id = ?").run(userId);
db.close();

console.log(out.join("\n"));
console.log(failed ? `\n${failed} FAILED` : `\nall ${checks.length + 5} checks passed`);
process.exit(failed ? 1 : 0);
