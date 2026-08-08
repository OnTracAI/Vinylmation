/**
 * Pass 1 — catalog skeleton.
 *
 * Reads the /vinylmation/ series index, then every series page. Series pages
 * are fully archived, and each figure card there carries name, slug, type,
 * artist and image URL — so this pass alone yields every figure in the
 * catalog. Pass 2 (scrape-figures.mjs) fills in the per-figure detail fields
 * for the subset whose detail pages were captured.
 *
 * Output: data/series.json
 */
import fs from "node:fs/promises";
import path from "node:path";
import { decode, fetchCached, pool, relPath, stripTags, unwrapWayback, waybackUrl } from "./lib/fetcher.mjs";

const OUT = path.join(process.cwd(), "data", "series.json");

/** Pull every /vinylmation/<slug>/ link plus its printed figure count. */
function parseSeriesIndex(html) {
  const seen = new Map();
  // Index entries look like: <a href="…/vinylmation/animation-1/">Animation 1</a> <span…>(17)</span>
  const re =
    /<a[^>]+href="([^"]*\/vinylmation\/([^/"]+)\/)"[^>]*>([\s\S]*?)<\/a>\s*(?:<[^>]+>)?\s*\(?(\d+)\)?/g;
  let m;
  while ((m = re.exec(html))) {
    const [, href, slug, label, count] = m;
    if (!slug || slug === "vinylmation") continue;
    const name = stripTags(label);
    if (!name) continue;
    if (!seen.has(slug)) {
      seen.set(slug, { slug, name, expectedCount: Number(count), path: relPath(href) });
    }
  }
  return [...seen.values()];
}

/**
 * Each figure on a series page is a `.stream-asset` block:
 *   data-id, .type <rarity class>, cite.artist, links to series + figure,
 *   and img[data-original] holding the real (non-Wayback) image URL.
 */
function parseFigureCards(html, seriesSlug) {
  const figures = [];
  // data-id precedes class="stream-asset" on the same div, so split on data-id
  // and keep the chunks that are actually figure cards.
  const blocks = html
    .split(/<div\s+data-id="/)
    .slice(1)
    .filter((b) => b.includes('class="stream-asset"'));

  for (const block of blocks) {
    const raw = block;

    const idMatch = /^([^"]+)"/.exec(raw);
    // The class can hold several space-separated tokens ("type limited variant"),
    // mixing rarity and edition status. Capture them all; seed.mjs untangles it.
    const typeMatch = /<div class="type ([a-z- ]+)"/.exec(block);
    const artistMatch = /<cite class="artist">\(([^)]*)\)<\/cite>/.exec(block);
    const imgMatch = /data-original="([^"]+)"/.exec(block);

    // Slug discovery must not depend on the anchor closing: truncated captures
    // cut off mid-tag, so there may be no </a> anywhere in the block.
    const slugRe = new RegExp(
      `href="[^"]*\\/vinylmation\\/${escapeRe(seriesSlug)}\\/([^/"]+)\\/"`,
      "g",
    );
    // The display name comes from the fully-formed name anchor when present.
    const nameRe = new RegExp(
      `href="[^"]*\\/vinylmation\\/${escapeRe(seriesSlug)}\\/([^/"]+)\\/"[^>]*>([\\s\\S]*?)<\\/a>`,
      "g",
    );

    let figureSlug = slugRe.exec(block)?.[1] ?? null;
    let figureName = null;
    let m2;
    while ((m2 = nameRe.exec(block))) {
      const text = stripTags(m2[2]);
      // The image anchor wraps only an <img>, which strips to nothing.
      if (text) {
        figureSlug = m2[1];
        figureName = text;
        break;
      }
    }
    if (!figureSlug) continue;

    // Some archive captures are truncated mid-card, losing the <p class="names">
    // block that holds the display name. The slug still carries enough to
    // recover a usable name rather than dropping the figure entirely.
    const nameFromSlug = !figureName;
    if (nameFromSlug) figureName = deslugify(figureSlug);

    figures.push({
      sourceId: idMatch?.[1] ?? null,
      slug: figureSlug,
      name: decode(figureName),
      /** True when the name was derived from the URL, not read from the page. */
      nameFromSlug,
      type: typeMatch?.[1] ?? "common",
      artist: artistMatch ? decode(artistMatch[1]) || null : null,
      imageUrl: unwrapWayback(imgMatch?.[1] ?? null),
    });
  }

  // A series page can list the same figure twice (grid + carousel); keep first.
  const bySlug = new Map();
  for (const f of figures) if (!bySlug.has(f.slug)) bySlug.set(f.slug, f);
  return [...bySlug.values()];
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** "john-darling" -> "John Darling" */
const deslugify = (slug) =>
  slug
    .split("-")
    .map((w) => (w.length <= 2 ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ")
    .trim();

async function main() {
  console.log("Pass 1 — series index");
  const { html: indexHtml, fromCache } = await fetchCached(waybackUrl("/vinylmation/"));
  if (!indexHtml) throw new Error("series index not archived");
  console.log(`  index loaded${fromCache ? " (cached)" : ""}`);

  const seriesList = parseSeriesIndex(indexHtml);
  console.log(`  found ${seriesList.length} series\n`);

  console.log("Pass 1 — series pages");
  const results = await pool(
    seriesList,
    async (s) => {
      const { html } = await fetchCached(waybackUrl(`/vinylmation/${s.slug}/`));
      if (!html) return { ...s, figures: [], archived: false };
      return { ...s, figures: parseFigureCards(html, s.slug), archived: true };
    },
    { label: "series" },
  );

  const clean = results.filter((r) => r && !r.error);
  const totalFigures = clean.reduce((n, s) => n + s.figures.length, 0);
  const expected = clean.reduce((n, s) => n + (s.expectedCount || 0), 0);
  const missing = clean.filter((s) => !s.archived);
  const shortfall = clean.filter((s) => s.archived && s.figures.length < s.expectedCount);

  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.writeFile(OUT, JSON.stringify(clean, null, 2));

  console.log(`\nSeries scraped:   ${clean.length}`);
  console.log(`Figures found:    ${totalFigures} (index advertised ${expected})`);
  console.log(`Series unarchived: ${missing.length}`);
  if (shortfall.length) {
    console.log(`Series short of advertised count: ${shortfall.length}`);
    for (const s of shortfall.slice(0, 10)) {
      console.log(`  - ${s.name}: got ${s.figures.length}, expected ${s.expectedCount}`);
    }
  }
  console.log(`\nWrote ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
