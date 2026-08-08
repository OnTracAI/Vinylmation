import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export const SNAPSHOT = "20230426203235";
export const ORIGIN = "http://chasingvinylmation.com";
const CACHE_DIR = path.join(process.cwd(), ".cache", "wayback");

/** Wayback is slow and rate-limits hard; keep concurrency modest and back off. */
export const CONCURRENCY = 4;
const MAX_RETRIES = 4;
const BASE_BACKOFF_MS = 1500;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function cachePath(url) {
  const hash = createHash("sha1").update(url).digest("hex");
  return path.join(CACHE_DIR, hash.slice(0, 2), `${hash}.html`);
}

export function waybackUrl(pathname) {
  return `https://web.archive.org/web/${SNAPSHOT}/${ORIGIN}${pathname}`;
}

/**
 * Fetch a page, caching the raw HTML on disk. Cached pages make the whole
 * crawl resumable and re-parsable without re-hitting the archive.
 *
 * Returns { html, fromCache } or { html: null } when the page was never
 * archived (Wayback serves its calendar interstitial for those).
 */
export async function fetchCached(url, { force = false } = {}) {
  const file = cachePath(url);

  if (!force) {
    try {
      const html = await fs.readFile(file, "utf8");
      return { html: html === "__MISSING__" ? null : html, fromCache: true };
    } catch {
      /* not cached yet */
    }
  }

  let lastErr;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) await sleep(BASE_BACKOFF_MS * 2 ** (attempt - 1));
    try {
      const res = await fetch(url, {
        redirect: "follow",
        headers: { "user-agent": "vinylmation-tracker/0.1 (personal catalog import)" },
      });

      // 429/5xx are transient on Wayback — retry. 404 is terminal.
      if (res.status === 429 || res.status >= 500) {
        lastErr = new Error(`HTTP ${res.status}`);
        continue;
      }
      if (!res.ok) {
        await writeCache(file, "__MISSING__");
        return { html: null, fromCache: false };
      }

      const html = await res.text();

      // Wayback returns 200 with its own shell when a URL isn't archived.
      if (isNotArchived(html)) {
        await writeCache(file, "__MISSING__");
        return { html: null, fromCache: false };
      }

      await writeCache(file, html);
      return { html, fromCache: false };
    } catch (err) {
      lastErr = err;
    }
  }
  throw new Error(`failed after ${MAX_RETRIES} retries: ${url} (${lastErr?.message})`);
}

function isNotArchived(html) {
  return (
    html.includes("<title>Wayback Machine</title>") ||
    html.includes("Hrm.") ||
    html.includes("This page is not available")
  );
}

async function writeCache(file, body) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, body, "utf8");
}

/** Run `worker` over `items` with bounded concurrency, reporting progress. */
export async function pool(items, worker, { concurrency = CONCURRENCY, label = "" } = {}) {
  const results = new Array(items.length);
  let next = 0;
  let done = 0;
  let lastLog = 0;

  async function run() {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      try {
        results[i] = await worker(items[i], i);
      } catch (err) {
        results[i] = { error: err.message };
        process.stderr.write(`\n  ! ${label} [${i}]: ${err.message}\n`);
      }
      done++;
      const now = Date.now();
      if (now - lastLog > 1000 || done === items.length) {
        lastLog = now;
        const pct = ((done / items.length) * 100).toFixed(1);
        process.stdout.write(`\r  ${label} ${done}/${items.length} (${pct}%)   `);
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
  process.stdout.write("\n");
  return results;
}

/** Strip Wayback's rewriting to recover the original URL. */
export function unwrapWayback(url) {
  if (!url) return null;
  const m = url.match(/\/web\/\d+(?:im_|js_|cs_)?\/(https?:\/\/.+)$/);
  if (m) return m[1];
  return url.startsWith("//web.archive.org") ? null : url;
}

/** Extract the site-relative path from a Wayback-rewritten href. */
export function relPath(href) {
  if (!href) return null;
  const original = unwrapWayback(href) ?? href;
  try {
    return new URL(original, ORIGIN).pathname;
  } catch {
    return null;
  }
}

export const decode = (s) =>
  s
    ?.replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&dollar;/g, "$")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/\s+/g, " ")
    .trim() ?? null;

/** Remove tags, then decode. */
export const stripTags = (s) => decode(s?.replace(/<[^>]*>/g, " "));
