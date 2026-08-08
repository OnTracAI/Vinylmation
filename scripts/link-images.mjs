/**
 * Point figures.image_path at whatever photos are present in public/figures.
 *
 * Kept separate from the seed so images and catalogue data can be refreshed
 * independently: the download is long and resumable, and re-running the seed
 * shouldn't require re-downloading ~260 MB of photos. Safe to run repeatedly,
 * including while a download is still in progress.
 *
 * Run: node scripts/link-images.mjs
 */
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const IMAGE_DIR = path.join(process.cwd(), "public", "figures");
const DB_PATH = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "vinylmation.db");

if (!fs.existsSync(IMAGE_DIR)) {
  console.error(`No images at ${IMAGE_DIR}. Run: npm run scrape:figures -- --images`);
  process.exit(1);
}

const db = new Database(DB_PATH);

const rows = db
  .prepare(
    `SELECT f.id, f.slug, s.slug AS series_slug
       FROM figures f JOIN series s ON s.id = f.series_id`,
  )
  .all();

const update = db.prepare("UPDATE figures SET image_path = ? WHERE id = ?");
const clear = db.prepare("UPDATE figures SET image_path = NULL WHERE id = ?");

let linked = 0;
let cleared = 0;
const EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

const run = db.transaction(() => {
  for (const r of rows) {
    const found = EXTENSIONS.map((ext) => `${r.series_slug}/${r.slug}${ext}`).find((rel) =>
      fs.existsSync(path.join(IMAGE_DIR, rel)),
    );

    if (found) {
      update.run(`/figures/${found}`, r.id);
      linked++;
    } else {
      // Drop stale paths so a deleted file doesn't leave a broken <img>.
      clear.run(r.id);
      cleared++;
    }
  }
});

run();

const onDisk = countFiles(IMAGE_DIR);
console.log(`Linked   ${linked} figures to photos`);
console.log(`No photo ${cleared} figures (fallback silhouette)`);
console.log(`Files on disk: ${onDisk}`);
if (onDisk > linked) {
  console.log(`  note: ${onDisk - linked} file(s) on disk match no figure record`);
}

db.close();

function countFiles(dir) {
  let n = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) n += countFiles(path.join(dir, entry.name));
    else if (EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) n++;
  }
  return n;
}
