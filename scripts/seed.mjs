/**
 * Load data/figures.json into SQLite.
 *
 * Creates the tables directly (no migration history needed for a catalog that
 * is rebuilt from source), parses the " : " series hierarchy into base name +
 * qualifier for grouping, and dedupes figures on sourceId.
 *
 * Idempotent: re-running replaces the catalog tables but leaves users,
 * collection_items and wishlist_items untouched.
 */
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DATA = path.join(process.cwd(), "data", "figures.json");
const SERIES_DATA = path.join(process.cwd(), "data", "series.json");
const DB_PATH = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "vinylmation.db");

const SCHEMA = `
CREATE TABLE IF NOT EXISTS series (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  base_name TEXT NOT NULL,
  qualifier TEXT,
  figure_count INTEGER NOT NULL DEFAULT 0,
  release_year INTEGER
);
CREATE INDEX IF NOT EXISTS series_base_idx ON series(base_name);

CREATE TABLE IF NOT EXISTS figures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_id TEXT UNIQUE,
  series_id INTEGER NOT NULL REFERENCES series(id),
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  artist TEXT,
  type TEXT NOT NULL DEFAULT 'common',
  status TEXT,
  rarity TEXT,
  size TEXT,
  box TEXT,
  has_card INTEGER,
  retail_price REAL,
  released_at TEXT,
  release_year INTEGER,
  set_position INTEGER,
  set_total INTEGER,
  image_url TEXT,
  image_path TEXT,
  detail_complete INTEGER NOT NULL DEFAULT 0,
  UNIQUE(series_id, slug)
);
CREATE INDEX IF NOT EXISTS figures_name_idx ON figures(name);
CREATE INDEX IF NOT EXISTS figures_type_idx ON figures(type);
CREATE INDEX IF NOT EXISTS figures_year_idx ON figures(release_year);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (current_timestamp)
);

CREATE TABLE IF NOT EXISTS collection_items (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  figure_id INTEGER NOT NULL REFERENCES figures(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  condition TEXT NOT NULL DEFAULT 'opened_complete',
  purchase_price REAL,
  acquired_at TEXT,
  notes TEXT,
  for_trade INTEGER NOT NULL DEFAULT 0,
  added_at TEXT NOT NULL DEFAULT (current_timestamp),
  PRIMARY KEY (user_id, figure_id)
);

CREATE TABLE IF NOT EXISTS wishlist_items (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  figure_id INTEGER NOT NULL REFERENCES figures(id) ON DELETE CASCADE,
  priority INTEGER NOT NULL DEFAULT 2,
  notes TEXT,
  added_at TEXT NOT NULL DEFAULT (current_timestamp),
  PRIMARY KEY (user_id, figure_id)
);

-- Full-text search over the catalog, kept in sync by the seed.
CREATE VIRTUAL TABLE IF NOT EXISTS figures_fts USING fts5(
  name, series_name, artist, content=''
);
`;

/**
 * The source's `type` field conflates two orthogonal axes and is inconsistent:
 * single tokens ("chaser"), compounds ("limited variant", "variant chaser"),
 * edition statuses masquerading as types ("limited", "retired"), a stray UI
 * state class ("active"), and at least one typo ("varinat").
 *
 * Split it into the rarity axis (which drives the UI's colour coding) and the
 * edition-status axis (which has its own column).
 */
const RARITY_RANK = ["common", "custom", "topper", "variant", "chaser"];
const STATUS_TOKENS = new Set([
  "limited",
  "open",
  "exclusive",
  "rare",
  "retired",
  "special",
]);
const TYPO_FIXES = { varinat: "variant", chasser: "chaser" };
/** Interface state classes that leaked in through the CSS class attribute. */
const NOISE = new Set(["active", "inactive", "selected", "type"]);

function normalizeType(raw) {
  const tokens = String(raw ?? "")
    .toLowerCase()
    .split(/[\s,/]+/)
    .map((t) => TYPO_FIXES[t] ?? t)
    .filter((t) => t && !NOISE.has(t));

  let rarity = null;
  const statuses = [];

  for (const t of tokens) {
    if (STATUS_TOKENS.has(t)) {
      statuses.push(t);
      continue;
    }
    if (RARITY_RANK.includes(t)) {
      // Most specific rarity wins: "variant chaser" is a chaser.
      if (rarity === null || RARITY_RANK.indexOf(t) > RARITY_RANK.indexOf(rarity)) {
        rarity = t;
      }
    }
  }

  return { rarity: rarity ?? "common", statuses };
}

/**
 * The detail page's `status` field is free text describing production state,
 * and carries its own typos ("acive") plus placeholder values ("n/a") that
 * should read as unknown rather than as a real status.
 */
const STATUS_CANON = {
  acive: "active",
  active: "active",
  limited: "limited",
  open: "open",
  retired: "retired",
  canceled: "canceled",
  cancelled: "canceled",
  pending: "pending",
  rare: "rare",
  special: "special",
  exclusive: "exclusive",
};
const STATUS_UNKNOWN = new Set(["n/a", "na", "n\\a", "unknown", "-", "tbd", ""]);

function normalizeStatus(raw) {
  const value = String(raw ?? "").toLowerCase().trim();
  if (!value || STATUS_UNKNOWN.has(value)) return null;
  return STATUS_CANON[value] ?? value;
}

/**
 * "Animation 2 : Set : 3 Little Pigs" -> base "Animation 2", qualifier "Set: 3 Little Pigs"
 * "Marvel 2 : Eachez"                 -> base "Marvel 2",    qualifier "Eachez"
 * "Animation 2"                       -> base "Animation 2",  qualifier null
 */
function parseSeriesName(name) {
  const parts = name.split(":").map((p) => p.trim()).filter(Boolean);
  if (parts.length <= 1) return { baseName: name.trim(), qualifier: null };

  // Some series legitimately contain a colon in their own title
  // ("Star Wars : The Last Jedi", "Exclusives : Japan"). Treat the trailing
  // segments as a qualifier only when they look like a variant marker.
  const VARIANT_MARKERS = /^(set|9"|9 in\.?|eachez|juniors?|jr\.?|combo|9" combo)$/i;
  const idx = parts.findIndex((p, i) => i > 0 && VARIANT_MARKERS.test(p));

  if (idx === -1) return { baseName: name.trim(), qualifier: null };
  return {
    baseName: parts.slice(0, idx).join(" : "),
    qualifier: parts.slice(idx).join(": "),
  };
}

function main() {
  if (!fs.existsSync(DATA)) {
    console.error(`Missing ${DATA} — run 'npm run scrape:series' then 'npm run scrape:figures' first.`);
    process.exit(1);
  }

  const figures = JSON.parse(fs.readFileSync(DATA, "utf8"));
  const seriesRaw = JSON.parse(fs.readFileSync(SERIES_DATA, "utf8"));

  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(SCHEMA);

  db.pragma("foreign_keys = ON");

  // Figures are UPSERTed, never deleted and reinserted.
  //
  // An earlier version did `DELETE FROM figures`, which cascades to
  // collection_items and wishlist_items — so re-seeding to refresh the
  // catalogue silently wiped every user's collection. Even with the cascade
  // disabled it would be unsafe: AUTOINCREMENT ids get reused, so saved rows
  // would quietly re-point at whichever figure landed on that id.
  //
  // Upserting on the source's own record id keeps figure ids stable across
  // re-imports, which is what user rows reference.
  //
  // The FTS index is derived data with no references to it, so that one is
  // safe to rebuild wholesale (and being contentless, it can't be DELETEd
  // from anyway).
  db.exec("DROP TABLE IF EXISTS figures_fts;");
  db.exec(
    `CREATE VIRTUAL TABLE figures_fts USING fts5(name, series_name, artist, content='');`,
  );

  const insertSeries = db.prepare(
    `INSERT INTO series (slug, name, base_name, qualifier, figure_count, release_year)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(slug) DO UPDATE SET
       name = excluded.name,
       base_name = excluded.base_name,
       qualifier = excluded.qualifier,
       figure_count = excluded.figure_count,
       release_year = excluded.release_year
     RETURNING id`,
  );

  // image_path is owned by link-images.mjs, so a re-seed must not clear it
  // when the scrape ran without --images.
  const FIGURE_UPDATE = `
       series_id = excluded.series_id,
       slug = excluded.slug,
       name = excluded.name,
       artist = excluded.artist,
       type = excluded.type,
       status = excluded.status,
       rarity = excluded.rarity,
       size = excluded.size,
       box = excluded.box,
       has_card = excluded.has_card,
       retail_price = excluded.retail_price,
       released_at = excluded.released_at,
       release_year = excluded.release_year,
       set_position = excluded.set_position,
       set_total = excluded.set_total,
       image_url = COALESCE(excluded.image_url, figures.image_url),
       image_path = COALESCE(excluded.image_path, figures.image_path),
       detail_complete = excluded.detail_complete`;

  const insertFigure = db.prepare(
    `INSERT INTO figures (
       source_id, series_id, slug, name, artist, type, status, rarity, size, box,
       has_card, retail_price, released_at, release_year, set_position, set_total,
       image_url, image_path, detail_complete
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(source_id) DO UPDATE SET ${FIGURE_UPDATE}
     ON CONFLICT(series_id, slug) DO UPDATE SET ${FIGURE_UPDATE}
     RETURNING id`,
  );
  const insertFts = db.prepare(
    `INSERT INTO figures_fts (rowid, name, series_name, artist) VALUES (?, ?, ?, ?)`,
  );

  const bySeries = new Map();
  for (const f of figures) {
    if (!bySeries.has(f.seriesSlug)) bySeries.set(f.seriesSlug, []);
    bySeries.get(f.seriesSlug).push(f);
  }

  let seriesCount = 0;
  let figureCount = 0;
  let skipped = 0;
  const seenSourceIds = new Set();
  const rarityCounts = {};

  /** Figure ids present in this import; anything else is a candidate for retirement. */
  const liveIds = new Set();
  let removed = 0;
  let retained = [];

  const load = db.transaction(() => {
    for (const meta of seriesRaw) {
      const items = bySeries.get(meta.slug) ?? [];
      const { baseName, qualifier } = parseSeriesName(meta.name);

      // Earliest release year among the series' figures, when known.
      const years = items.map((f) => f.releaseYear).filter(Boolean);
      const releaseYear = years.length ? Math.min(...years) : null;

      const seriesId = insertSeries.get(
        meta.slug,
        meta.name,
        baseName,
        qualifier,
        items.length,
        releaseYear,
      ).id;
      seriesCount++;

      for (const f of items) {
        if (f.sourceId && seenSourceIds.has(f.sourceId)) {
          skipped++;
          continue;
        }
        if (f.sourceId) seenSourceIds.add(f.sourceId);

        const { rarity, statuses } = normalizeType(f.type);
        if (rarity !== "common") rarityCounts[rarity] = (rarityCounts[rarity] ?? 0) + 1;

        // An explicit status from the detail page wins; otherwise fall back to
        // any edition status that was mixed into the type field.
        const status = normalizeStatus(f.status) ?? normalizeStatus(statuses[0]) ?? null;

        const r = insertFigure.get(
          f.sourceId ?? null,
          seriesId,
          f.slug,
          f.name,
          f.artist ?? null,
          rarity,
          status,
          f.rarity ?? null,
          f.size ?? null,
          f.box ?? null,
          f.hasCard === undefined ? null : f.hasCard ? 1 : 0,
          f.retailPrice ?? null,
          f.releasedAt ?? null,
          f.releaseYear ?? null,
          f.setPosition ?? null,
          f.setTotal ?? null,
          f.imageUrl ?? null,
          f.imagePath ?? null,
          f.detailComplete ? 1 : 0,
        );
        insertFts.run(r.id, f.name, meta.name, f.artist ?? "");
        figureCount++;
        liveIds.add(r.id);
      }
    }

    // Retire catalogue rows that are no longer in the source data — but never
    // silently delete something a user has saved, since that would take their
    // collection row with it.
    const stale = db
      .prepare(
        `SELECT f.id, f.name,
                (SELECT COUNT(*) FROM collection_items WHERE figure_id = f.id) AS owned,
                (SELECT COUNT(*) FROM wishlist_items  WHERE figure_id = f.id) AS wanted
           FROM figures f`,
      )
      .all()
      .filter((r) => !liveIds.has(r.id));

    const held = stale.filter((r) => r.owned > 0 || r.wanted > 0);
    const droppable = stale.filter((r) => r.owned === 0 && r.wanted === 0);

    const del = db.prepare("DELETE FROM figures WHERE id = ?");
    for (const r of droppable) del.run(r.id);

    removed = droppable.length;
    retained = held;
  });

  load();

  const stats = db
    .prepare(
      `SELECT
         (SELECT COUNT(*) FROM figures) AS figures,
         (SELECT COUNT(*) FROM series) AS series,
         (SELECT COUNT(*) FROM figures WHERE detail_complete = 1) AS detailed,
         (SELECT COUNT(*) FROM figures WHERE retail_price IS NOT NULL) AS priced,
         (SELECT COUNT(*) FROM figures WHERE type = 'chaser') AS chasers,
         (SELECT COUNT(DISTINCT artist) FROM figures WHERE artist IS NOT NULL) AS artists,
         (SELECT COUNT(DISTINCT base_name) FROM series) AS base_series`,
    )
    .get();

  console.log(`Seeded ${DB_PATH}\n`);
  console.log(`  series rows:      ${stats.series} (${stats.base_series} distinct base series)`);
  console.log(`  figures:          ${stats.figures}`);
  console.log(`  full detail:      ${stats.detailed}`);
  console.log(`  with retail:      ${stats.priced}`);
  console.log(`  chasers:          ${stats.chasers}`);
  console.log(`  distinct artists: ${stats.artists}`);
  if (skipped) console.log(`  duplicate rows skipped: ${skipped}`);
  if (removed) console.log(`  retired figures no longer in source: ${removed}`);
  if (retained.length) {
    console.log(
      `\n  ${retained.length} figure(s) are gone from the source but kept because` +
        ` someone has them saved:`,
    );
    for (const r of retained.slice(0, 10)) {
      console.log(`    - ${r.name} (owned by ${r.owned}, wanted by ${r.wanted})`);
    }
  }

  db.close();
}

main();
