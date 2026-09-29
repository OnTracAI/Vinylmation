/**
 * Point figures.image_path at whatever photos are present in public/figures,
 * and record each image's aspect ratio.
 *
 * The aspect matters because the photos come from two very different sources:
 * the archived catalogue shots are ~729x400 landscape composites (several views
 * of one figure plus packaging), while hand-added photos are typically portrait
 * single-figure shots. A crop tuned for one badly mis-frames the other, so the
 * UI picks its framing from this value instead of assuming.
 *
 * Kept separate from the seed so images and catalogue data can be refreshed
 * independently: the download is long and resumable, and re-running the seed
 * shouldn't require re-downloading ~300 MB of photos. Safe to run repeatedly,
 * including while a download is still in progress.
 *
 * Run: node scripts/link-images.mjs
 */
import Database from "better-sqlite3";
import { imageSize } from "image-size";
import fs from "node:fs";
import path from "node:path";

const IMAGE_DIR = path.join(process.cwd(), "public", "figures");
const DB_PATH = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "vinylmation.db");
const EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

if (!fs.existsSync(IMAGE_DIR)) {
  console.error(`No images at ${IMAGE_DIR}. Run: npm run scrape:figures -- --images`);
  process.exit(1);
}

const db = new Database(DB_PATH);

// Older databases predate this column; add it rather than requiring a re-seed.
const hasAspect = db
  .prepare("SELECT COUNT(*) n FROM pragma_table_info('figures') WHERE name = 'image_aspect'")
  .get().n;
if (!hasAspect) {
  db.exec("ALTER TABLE figures ADD COLUMN image_aspect REAL");
  console.log("added figures.image_aspect");
}

const rows = db
  .prepare(
    `SELECT f.id, f.slug, s.slug AS series_slug
       FROM figures f JOIN series s ON s.id = f.series_id`,
  )
  .all();

const update = db.prepare("UPDATE figures SET image_path = ?, image_aspect = ? WHERE id = ?");
const clear = db.prepare("UPDATE figures SET image_path = NULL, image_aspect = NULL WHERE id = ?");

let linked = 0;
let cleared = 0;
let unreadable = 0;
const shapes = { wide: 0, tall: 0, unknown: 0 };

/** Aspect ratio, or null when the file can't be parsed. */
function aspectOf(absPath) {
  try {
    const { width, height } = imageSize(fs.readFileSync(absPath));
    if (!width || !height) return null;
    return width / height;
  } catch {
    return null;
  }
}

const run = db.transaction(() => {
  for (const r of rows) {
    const found = EXTENSIONS.map((ext) => `${r.series_slug}/${r.slug}${ext}`).find((rel) =>
      fs.existsSync(path.join(IMAGE_DIR, rel)),
    );

    if (found) {
      const aspect = aspectOf(path.join(IMAGE_DIR, found));
      update.run(`/figures/${found}`, aspect, r.id);
      linked++;
      if (aspect === null) {
        unreadable++;
        shapes.unknown++;
      } else if (aspect > 1.2) shapes.wide++;
      else shapes.tall++;
    } else {
      // Drop stale paths so a deleted file doesn't leave a broken image.
      clear.run(r.id);
      cleared++;
    }
  }
});

run();

const onDisk = countFiles(IMAGE_DIR);
console.log(`Linked   ${linked} figures to photos`);
console.log(`  wide composites (crop to front view): ${shapes.wide}`);
console.log(`  single-figure shots (fit whole image): ${shapes.tall}`);
if (shapes.unknown) console.log(`  dimensions unreadable (treated as single): ${shapes.unknown}`);
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
