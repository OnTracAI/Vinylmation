/**
 * End-to-end check of the collection layer against the real database.
 * Creates a throwaway user, exercises ownership/wishlist/progress, then cleans
 * up after itself. Run with: node scripts/smoke-test.mjs
 */
import Database from "better-sqlite3";
import assert from "node:assert/strict";
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb);
const DB_PATH = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "vinylmation.db");
const db = new Database(DB_PATH);
db.pragma("foreign_keys = ON");

const results = [];
function check(name, fn) {
  try {
    fn();
    results.push([true, name]);
  } catch (err) {
    results.push([false, `${name} — ${err.message}`]);
  }
}

// --- password hashing (mirrors lib/auth.ts) ---------------------------------
const KEY_LEN = 64;
async function hash(pw) {
  const salt = randomBytes(16);
  const d = await scrypt(pw, salt, KEY_LEN);
  return `scrypt:${salt.toString("hex")}:${d.toString("hex")}`;
}
async function verify(pw, stored) {
  const [scheme, saltHex, hashHex] = stored.split(":");
  if (scheme !== "scrypt") return false;
  const d = await scrypt(pw, Buffer.from(saltHex, "hex"), KEY_LEN);
  const e = Buffer.from(hashHex, "hex");
  return e.length === d.length && timingSafeEqual(d, e);
}

const stored = await hash("correct horse battery");
const goodMatches = await verify("correct horse battery", stored);
const badMatches = await verify("wrong", stored);
// Flip the final hex digit to something it definitely isn't.
const tampered = stored.replace(/.$/, (c) => (c === "0" ? "1" : "0"));
const tamperedMatches = await verify("correct horse battery", tampered);

check("correct password verifies", () => assert.equal(goodMatches, true));
check("wrong password rejected", () => assert.equal(badMatches, false));
check("tampered hash rejected", () => assert.equal(tamperedMatches, false));
const secondHash = await hash("correct horse battery");
check("hash is salted (same input differs)", () => assert.notEqual(stored, secondHash));

// --- catalogue integrity ---------------------------------------------------
const stats = db
  .prepare(
    `SELECT
      (SELECT COUNT(*) FROM figures) f,
      (SELECT COUNT(*) FROM series) s,
      (SELECT COUNT(*) FROM figures WHERE series_id NOT IN (SELECT id FROM series)) orphans,
      (SELECT COUNT(*) FROM figures WHERE name IS NULL OR name = '') unnamed,
      (SELECT COUNT(*) FROM figures_fts) fts`,
  )
  .get();

check("catalogue has 3500+ figures", () => assert.ok(stats.f > 3500, `got ${stats.f}`));
check("all 491 series present", () => assert.equal(stats.s, 491));
check("no orphaned figures", () => assert.equal(stats.orphans, 0));
check("every figure has a name", () => assert.equal(stats.unnamed, 0));
check("FTS index matches figure count", () => assert.equal(stats.fts, stats.f));

check("FTS prefix search works", () => {
  const n = db
    .prepare(`SELECT COUNT(*) n FROM figures_fts WHERE figures_fts MATCH '"kylo"*'`)
    .get().n;
  assert.ok(n >= 1, `expected >=1 match, got ${n}`);
});

check("multi-term FTS search works", () => {
  const n = db
    .prepare(`SELECT COUNT(*) n FROM figures_fts WHERE figures_fts MATCH '"star"* AND "jedi"*'`)
    .get().n;
  assert.ok(n >= 8, `expected >=8, got ${n}`);
});

check("rarity normalised to the known set", () => {
  const known = ["common", "variant", "chaser", "topper", "custom"];
  const types = db
    .prepare("SELECT DISTINCT type FROM figures ORDER BY type")
    .all()
    .map((r) => r.type);
  for (const t of types) assert.ok(known.includes(t), `unexpected rarity: ${t}`);
});

check("edition statuses normalised", () => {
  // Placeholders and typos from the source must not survive import.
  const bad = db
    .prepare(
      `SELECT DISTINCT status FROM figures
       WHERE status IN ('n/a','na','acive','cancelled','unknown','-')`,
    )
    .all();
  assert.equal(bad.length, 0, `unnormalised statuses: ${bad.map((r) => r.status).join(", ")}`);
});

check("compound types resolved to most specific rarity", () => {
  // "variant chaser" in the source must land as chaser, not variant.
  const n = db.prepare("SELECT COUNT(*) n FROM figures WHERE type = 'chaser'").get().n;
  assert.ok(n >= 174, `expected >=174 chasers after compound resolution, got ${n}`);
});

check("series hierarchy parsed into base names", () => {
  const row = db
    .prepare("SELECT COUNT(DISTINCT base_name) n FROM series")
    .get();
  assert.ok(row.n < 491, "base names should collapse some series");
  assert.ok(row.n > 250, `too aggressive: ${row.n}`);
});

check("sub-lines group with their main series", () => {
  const row = db
    .prepare("SELECT COUNT(*) n FROM series WHERE base_name = 'Animation 2'")
    .get();
  assert.ok(row.n > 1, `expected Animation 2 family, got ${row.n}`);
});

// --- collection lifecycle --------------------------------------------------
const email = `smoke-${randomBytes(4).toString("hex")}@test.local`;
const userId = db
  .prepare("INSERT INTO users (email, display_name, password_hash) VALUES (?, ?, ?)")
  .run(email, "Smoke Tester", stored).lastInsertRowid;

const seriesRow = db
  .prepare("SELECT id, base_name FROM series WHERE figure_count BETWEEN 8 AND 20 LIMIT 1")
  .get();
const figs = db.prepare("SELECT id FROM figures WHERE series_id = ?").all(seriesRow.id);

check("test series has figures", () => assert.ok(figs.length >= 8));

db.prepare("INSERT INTO collection_items (user_id, figure_id) VALUES (?, ?)").run(
  userId,
  figs[0].id,
);
check("figure added to collection", () => {
  const n = db
    .prepare("SELECT COUNT(*) n FROM collection_items WHERE user_id = ?")
    .get(userId).n;
  assert.equal(n, 1);
});

db.prepare("UPDATE collection_items SET quantity = 3 WHERE user_id = ? AND figure_id = ?").run(
  userId,
  figs[0].id,
);
check("duplicate quantity recorded", () => {
  const q = db
    .prepare("SELECT quantity FROM collection_items WHERE user_id = ? AND figure_id = ?")
    .get(userId, figs[0].id).quantity;
  assert.equal(q, 3);
});

check("collection PK prevents duplicate rows", () => {
  assert.throws(() =>
    db
      .prepare("INSERT INTO collection_items (user_id, figure_id) VALUES (?, ?)")
      .run(userId, figs[0].id),
  );
});

db.prepare("INSERT INTO wishlist_items (user_id, figure_id, priority) VALUES (?, ?, 3)").run(
  userId,
  figs[1].id,
);
check("wishlist entry added", () => {
  const n = db.prepare("SELECT COUNT(*) n FROM wishlist_items WHERE user_id = ?").get(userId).n;
  assert.equal(n, 1);
});

// Mirrors ownEntireSeries()
db.prepare(
  `INSERT OR IGNORE INTO collection_items (user_id, figure_id)
   SELECT ?, id FROM figures WHERE series_id = ?`,
).run(userId, seriesRow.id);

check("bulk series add covers every figure", () => {
  const n = db
    .prepare(
      `SELECT COUNT(*) n FROM collection_items ci
       JOIN figures f ON f.id = ci.figure_id
       WHERE ci.user_id = ? AND f.series_id = ?`,
    )
    .get(userId, seriesRow.id).n;
  assert.equal(n, figs.length);
});

check("bulk add preserved existing quantity", () => {
  const q = db
    .prepare("SELECT quantity FROM collection_items WHERE user_id = ? AND figure_id = ?")
    .get(userId, figs[0].id).quantity;
  assert.equal(q, 3, "INSERT OR IGNORE must not reset quantity");
});

// Mirrors getSeriesProgress()
check("series progress reports completion", () => {
  const row = db
    .prepare(
      `SELECT COUNT(f.id) total,
              COALESCE(SUM(CASE WHEN ci.figure_id IS NOT NULL THEN 1 ELSE 0 END), 0) owned
       FROM series s
       JOIN figures f ON f.series_id = s.id
       LEFT JOIN collection_items ci ON ci.figure_id = f.id AND ci.user_id = ?
       WHERE s.id = ?`,
    )
    .get(userId, seriesRow.id);
  assert.equal(Number(row.owned), Number(row.total), "series should read complete");
});

check("summary aggregates pieces incl. duplicates", () => {
  const row = db
    .prepare(
      `SELECT COUNT(figure_id) distinctOwned, COALESCE(SUM(quantity),0) pieces
       FROM collection_items WHERE user_id = ?`,
    )
    .get(userId);
  assert.equal(row.distinctOwned, figs.length);
  assert.equal(Number(row.pieces), figs.length + 2, "one figure has qty 3");
});

/**
 * Regression: seed.mjs used to DELETE FROM figures before reinserting, which
 * cascades to collection_items and wishlist_items — so refreshing the
 * catalogue silently wiped every user's collection. It now UPSERTs on the
 * source record id, keeping figure ids (which user rows reference) stable.
 */
check("re-seeding preserves user collections", () => {
  const seedSrc = fs.readFileSync(new URL("./seed.mjs", import.meta.url), "utf8");
  assert.ok(
    !/DELETE\s+FROM\s+figures\s*;/i.test(seedSrc),
    "seed must not bulk-delete figures — that cascades to user collections",
  );
  assert.ok(
    /ON CONFLICT\(source_id\) DO UPDATE/i.test(seedSrc),
    "seed must upsert figures on source_id to keep ids stable",
  );
  assert.ok(
    !/DELETE FROM sqlite_sequence[^\n]*figures/i.test(seedSrc),
    "seed must not reset the figures id sequence — ids would be reused",
  );
});

check("figure ids are referenced by user rows", () => {
  // If ids weren't stable this join would silently return the wrong figure.
  const row = db
    .prepare(
      `SELECT f.name FROM collection_items c JOIN figures f ON f.id = c.figure_id
        WHERE c.user_id = ? LIMIT 1`,
    )
    .get(userId);
  assert.ok(row?.name, "collection row should resolve to a figure");
});

check("cascade delete removes user rows", () => {
  db.prepare("DELETE FROM users WHERE id = ?").run(userId);
  const c = db.prepare("SELECT COUNT(*) n FROM collection_items WHERE user_id = ?").get(userId).n;
  const w = db.prepare("SELECT COUNT(*) n FROM wishlist_items WHERE user_id = ?").get(userId).n;
  assert.equal(c, 0);
  assert.equal(w, 0);
});

// --- report ---------------------------------------------------------------
const failed = results.filter(([ok]) => !ok);
for (const [ok, name] of results) console.log(`  ${ok ? "✓" : "✗"} ${name}`);
console.log(
  `\n${results.length - failed.length}/${results.length} passed` +
    (failed.length ? ` — ${failed.length} FAILED` : ""),
);

db.close();
process.exit(failed.length ? 1 : 0);
