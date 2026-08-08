/**
 * Pass 2 — per-figure detail enrichment.
 *
 * Reads data/series.json, then fetches each figure's detail page for the
 * fields that only appear there: retail price, status, release date, position
 * in set, chase odds, size, packaging. Roughly 69% of figure pages were
 * captured by the archive; the rest keep the pass-1 fields and are flagged
 * detailComplete: false so the UI can show what's unverified.
 *
 * Output: data/figures.json
 *
 * Flags:
 *   --images   also download figure photos into public/figures/.
 *              Off by default: the metadata is factual, but the photographs
 *              have an owner. Enable only if you've settled that for your use.
 *   --limit=N  process only the first N figures (for testing).
 */
import fs from "node:fs/promises";
import path from "node:path";
import { SNAPSHOT, decode, fetchCached, pool, waybackUrl } from "./lib/fetcher.mjs";

const IN = path.join(process.cwd(), "data", "series.json");
const OUT = path.join(process.cwd(), "data", "figures.json");
const IMAGE_DIR = path.join(process.cwd(), "public", "figures");

/** "john-darling" -> "John Darling" */
const deslugify = (slug) =>
  slug
    .split("-")
    .map((w) => (w.length <= 2 ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ")
    .trim();

const args = process.argv.slice(2);
const WANT_IMAGES = args.includes("--images");
const LIMIT = Number(args.find((a) => a.startsWith("--limit="))?.split("=")[1] ?? 0);

/** The detail block is a flat list of <span class="key">k</span> // <span class="value">v</span>. */
function parseDetail(html) {
  const out = {};
  const re =
    /<span class="key">([^<]+)<\/span>[\s\S]{0,20}?<span class="value">([\s\S]*?)<\/span>/g;
  let m;
  while ((m = re.exec(html))) {
    const key = decode(m[1])?.toLowerCase();
    const value = decode(m[2]?.replace(/<[^>]*>/g, " "));
    if (key && value) out[key] = value;
  }
  return out;
}

function normalize(detail) {
  const out = {};

  if (detail.name) out.name = detail.name;
  if (detail.artist) out.artist = detail.artist;
  if (detail.type) out.type = detail.type.toLowerCase();
  if (detail.status) out.status = detail.status.toLowerCase();
  if (detail.rarity) out.rarity = detail.rarity;
  if (detail.size) out.size = detail.size;
  if (detail.box) out.box = detail.box.toLowerCase();
  if (detail.card) out.hasCard = /^y/i.test(detail.card);

  // "$14.99" -> 14.99
  if (detail.retail) {
    const n = Number(detail.retail.replace(/[^0-9.]/g, ""));
    if (Number.isFinite(n) && n > 0) out.retailPrice = n;
  }

  // "Fri. December 15, 2017" -> 2017-12-15
  if (detail.released) {
    const cleaned = detail.released.replace(/^[A-Za-z]{3}\.?\s*/, "");
    const parsed = new Date(cleaned);
    if (!Number.isNaN(parsed.getTime())) {
      out.releasedAt = parsed.toISOString().slice(0, 10);
      out.releaseYear = parsed.getUTCFullYear();
    } else {
      const y = detail.released.match(/\b(19|20)\d{2}\b/);
      if (y) out.releaseYear = Number(y[0]);
    }
  }

  // "1 of 14" -> position 1, total 14
  if (detail.count) {
    const m = detail.count.match(/(\d+)\s*of\s*(\d+)/i);
    if (m) {
      out.setPosition = Number(m[1]);
      out.setTotal = Number(m[2]);
    }
  }

  return out;
}

async function downloadImage(figure) {
  if (!figure.imageUrl) return null;
  const ext = path.extname(new URL(figure.imageUrl).pathname) || ".jpg";
  const rel = path.join(figure.seriesSlug, `${figure.slug}${ext}`);
  const dest = path.join(IMAGE_DIR, rel);
  try {
    await fs.access(dest);
    return `/figures/${rel}`;
  } catch {
    /* not downloaded yet */
  }
  // The `im_` suffix on the timestamp asks Wayback for the raw asset rather
  // than a rewritten page wrapper.
  const url = `https://web.archive.org/web/${SNAPSHOT}im_/${figure.imageUrl}`;

  for (let attempt = 0; attempt <= 3; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 1500 * 2 ** (attempt - 1)));
    let res;
    try {
      res = await fetch(url, { redirect: "follow" });
    } catch {
      continue; // network blip — retry
    }

    if (res.status === 429 || res.status >= 500) continue;
    if (!res.ok) return null; // genuinely not archived

    const buf = Buffer.from(await res.arrayBuffer());

    // The site served a "pending" placeholder gif for figures with no photo;
    // those are a few hundred bytes. Anything that small isn't a real image.
    if (buf.length < 2048) return null;
    if (!looksLikeImage(buf)) return null;

    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, buf);
    return `/figures/${rel}`;
  }
  return null;
}

/** Magic-byte check so an HTML error page never gets saved as a .jpg. */
function looksLikeImage(buf) {
  if (buf.length < 4) return false;
  const jpeg = buf[0] === 0xff && buf[1] === 0xd8;
  const png = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  const gif = buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46;
  const webp = buf.subarray(0, 4).toString() === "RIFF";
  return jpeg || png || gif || webp;
}

/**
 * A handful of series pages were captured truncated, so they never linked some
 * of their figures. The CDX index lists every archived URL, which lets us
 * recover those orphans instead of losing them.
 */
async function reconcileWithCdx(known) {
  const url =
    "https://web.archive.org/cdx/search/cdx?url=chasingvinylmation.com&matchType=domain" +
    "&filter=statuscode:200&filter=mimetype:text/html&collapse=urlkey&fl=original&limit=200000";

  let text;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    text = await res.text();
  } catch (err) {
    console.log(`  (CDX reconciliation skipped: ${err.message})`);
    return [];
  }

  const extra = [];
  for (const line of text.split("\n")) {
    const path = line
      .trim()
      .replace(/^https?:\/\/(www\.)?chasingvinylmation\.com(:80)?/, "")
      .split("?")[0];
    const parts = path.split("/").filter(Boolean);
    if (parts.length !== 3 || parts[0] !== "vinylmation") continue;
    const [, seriesSlug, slug] = parts;
    const key = `${seriesSlug}/${slug}`;
    if (known.has(key)) continue;
    known.add(key);
    extra.push({ seriesSlug, slug });
  }
  return extra;
}

async function main() {
  const seriesList = JSON.parse(await fs.readFile(IN, "utf8"));
  const seriesBySlug = new Map(seriesList.map((s) => [s.slug, s]));

  let flat = seriesList.flatMap((s) =>
    s.figures.map((f) => ({
      ...f,
      seriesSlug: s.slug,
      seriesName: s.name,
    })),
  );

  console.log("Reconciling against the CDX index for orphaned figure pages…");
  const known = new Set(flat.map((f) => `${f.seriesSlug}/${f.slug}`));
  const orphans = await reconcileWithCdx(known)
    // Only keep orphans belonging to a series we actually know about.
    .then((list) => list.filter((o) => seriesBySlug.has(o.seriesSlug)));

  if (orphans.length) {
    console.log(`  recovered ${orphans.length} figure page(s) missing from series listings`);
    for (const o of orphans) {
      flat.push({
        sourceId: null,
        slug: o.slug,
        name: null, // filled from the detail page below
        nameFromSlug: false,
        type: "common",
        artist: null,
        imageUrl: null,
        seriesSlug: o.seriesSlug,
        seriesName: seriesBySlug.get(o.seriesSlug).name,
        fromCdx: true,
      });
    }
  } else {
    console.log("  none found");
  }
  console.log();

  if (LIMIT) flat = flat.slice(0, LIMIT);

  console.log(`Pass 2 — ${flat.length} figure detail pages`);
  if (WANT_IMAGES) console.log("  --images enabled: photos will be downloaded\n");

  const enriched = await pool(
    flat,
    async (f) => {
      const { html } = await fetchCached(waybackUrl(`/vinylmation/${f.seriesSlug}/${f.slug}/`));
      let record = { ...f, detailComplete: false };

      if (html) {
        const detail = parseDetail(html);
        if (Object.keys(detail).length > 0) {
          record = { ...record, ...normalize(detail), detailComplete: true };
        }
      }

      // CDX-recovered figures have no listing name; fall back to the slug.
      if (!record.name) {
        record.name = deslugify(record.slug);
        record.nameFromSlug = true;
      }

      if (WANT_IMAGES) {
        try {
          record.imagePath = await downloadImage(f);
        } catch {
          record.imagePath = null;
        }
      }

      return record;
    },
    { label: "figures" },
  );

  const clean = enriched.filter((f) => f && !f.error);
  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.writeFile(OUT, JSON.stringify(clean, null, 2));

  const complete = clean.filter((f) => f.detailComplete).length;
  const withPrice = clean.filter((f) => f.retailPrice).length;
  const withDate = clean.filter((f) => f.releaseYear).length;
  const withImage = clean.filter((f) => f.imagePath).length;

  console.log(`\nFigures:            ${clean.length}`);
  console.log(`Full detail:        ${complete} (${((complete / clean.length) * 100).toFixed(1)}%)`);
  console.log(`With retail price:  ${withPrice}`);
  console.log(`With release year:  ${withDate}`);
  if (WANT_IMAGES) console.log(`Images downloaded:  ${withImage}`);
  console.log(`\nWrote ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
