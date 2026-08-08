# Vinylmation Vault

A collection tracker for Disney Vinylmation figures, modelled on the defunct
`chasingvinylmation.com` (2012–2018). Browse the full catalogue by series and set, mark what you
own, track what you're hunting, and see how close each set is to complete.

## Stack

- **Next.js 16** (App Router, React 19, server components + server actions)
- **SQLite** via `better-sqlite3`, typed with **Drizzle ORM**
- **Tailwind 4**
- Auth: email + password (`scrypt` from Node's stdlib), signed JWT session cookie via `jose`

No external services — the whole thing runs off a single local `.db` file.

## Getting started

```bash
npm install
```

Then build the catalogue (see below), and:

```bash
npm run dev
```

## Building the catalogue

The catalogue is reconstructed from Internet Archive captures of the original site in two passes.
Both passes cache raw HTML under `.cache/`, so they're resumable and re-parsing costs nothing.

```bash
npm run scrape:series    # ~2 min  — 491 series pages -> data/series.json
npm run scrape:figures   # ~10 min — 3.5k figure pages -> data/figures.json
npm run seed             # loads data/figures.json into data/vinylmation.db
```

### Why two passes

Archive coverage isn't uniform, so each pass covers for the other's gaps:

| Source | Coverage | Fields |
| --- | --- | --- |
| Series pages | 491/491 (100%) | name, series, rarity type, artist, image URL |
| Figure detail pages | 1,262/3,528 (36%) | retail price, status, release date, position in set, chase odds, size, packaging, card |

Pass 1 alone therefore yields **every** figure in the catalogue; pass 2 enriches the ~36% whose
detail is actually recoverable. Figures without detail coverage are flagged `detail_complete = 0`,
and the UI says so explicitly rather than presenting blanks as facts.

**Why only 36%, when 2,426 figure pages were archived?** Because "captured" and "contains data"
are different things. The original site was rewritten at some point between 2017 and 2019: earlier
versions fetched figure metadata client-side from an API, so a 2015 capture is a complete HTML
page with none of the fields in it. Later versions server-rendered the detail block. The split is
almost perfectly clean by era:

| Capture year | Has detail block | No detail block |
| --- | --- | --- |
| 2012–2016 | 117 | 1,144 |
| 2017–2018 | 19 | 9 |
| 2019–2023 | 1,126 | 11 |

Only 1,137 figure URLs have a capture from 2019 or later, which is the ceiling for detail
extraction — and pass 2 reaches 1,262 by also picking up the minority of pre-2019 captures that
were server-rendered. The remaining metadata was never archived in a recoverable form; the API it
came from is gone. Grabbing a different snapshot won't help, and the scraper already targets the
best available capture per URL.

Pass 2 also reconciles against the Wayback **CDX index**, which recovers figures whose series page
was captured truncated and so never linked them. A few captures were cut off mid-card; those
figures keep a name derived from their URL slug and are flagged `nameFromSlug`.

Final coverage: **3,511 of 3,523** figures the original index advertised (99.7%). The remaining 12
are absent from the captures themselves.

### Figure photos

Photos are **off by default** — the scraper records each image's source URL without fetching it.
The metadata is factual product information, but the photographs have an owner and the figure
designs are Disney's, so downloading is an explicit opt-in:

```bash
npm run scrape:images   # ~3,500 photos, ~290 MB, 30-45 min (resumable)
npm run link:images     # point figure records at whatever is on disk
```

`link:images` is separate on purpose: the download is long and resumable, so refreshing the
catalogue shouldn't mean re-fetching 290 MB. It's idempotent, safe to run while a download is
still going, and clears stale paths if you delete files.

Without photos the UI falls back to a rarity-tinted Vinylmation silhouette on the same plate, so a
partially-illustrated grid still reads well.

#### How the photos are displayed

The source images are 729×400 composites on white, and their layouts vary — some are figure +
packaging + artist signature, others are four rotated views of the figure alone. Shown whole at
thumbnail size the figure is unrecognisably small.

The one constant across layouts is a front view at the left edge, so grid thumbnails crop to
roughly the left quarter, bottom-weighted to skip the logo band, in portrait. Figure detail pages
show the composite whole, where the extra context is useful. Cropping is CSS in
`app/_components/FigureCard.tsx`, not baked into the download, so re-cropping never means
re-fetching.

## Data model

`series` rows keep the source's hierarchical names (`Animation 2 : Set : 3 Little Pigs`) but also
store a parsed `base_name` and `qualifier`. That's what lets the browse page collapse a main line
together with its 9-inch, Eachez and combo-set sub-lines into one entry while keeping them
separately addressable.

`figures.source_id` is the original record ID from the source catalogue, which makes re-imports
idempotent and dedupes cross-listed figures.

User data lives in `collection_items` (quantity, condition, purchase price, acquisition date,
notes, for-trade flag) and `wishlist_items` (priority, notes).

### Re-seeding is non-destructive

`npm run seed` UPSERTs on `figures.source_id` rather than clearing the tables, so figure ids stay
stable across re-imports and saved rows keep pointing at the right figure. Collections and
wishlists survive.

This matters more than it sounds. An earlier version did `DELETE FROM figures` before reinserting,
which cascades to `collection_items` and `wishlist_items` — so refreshing the catalogue silently
deleted every user's collection. Disabling the cascade wouldn't have fixed it either: with the id
sequence reset, `AUTOINCREMENT` reuses ids, and saved rows would quietly re-point at whichever
figure happened to land on that id. Silent corruption instead of silent deletion.

Figures that disappear from the source are retired on re-import — **except** any that a user owns
or has wishlisted. Those are kept and reported, so nobody's collection loses an entry because a
scrape came back short. `scripts/smoke-test.mjs` asserts the destructive patterns can't come back.

Search runs through an FTS5 virtual table over name / series / artist, with prefix matching so
`star wars ky` finds `Kylo Ren`.

## Rarity coding

Rarity is colour-coded consistently throughout the UI since it's the thing collectors scan a grid
for:

| Class | Count | Colour |
| --- | --- | --- |
| common | 3,007 | grey |
| variant | 283 | teal |
| chaser | 175 | yellow |
| topper | 39 | violet |
| custom | 24 | grey |

### Normalising the source's `type` field

The source site's `type` conflated two orthogonal axes and was inconsistent, so `seed.mjs`
untangles it into `figures.type` (rarity) and `figures.status` (edition state). What it handles:

- **Compounds** — `variant chaser` resolves to the most specific rarity (`chaser`), not the first
  token seen.
- **Status masquerading as rarity** — `limited`, `retired` and `exclusive` are edition states, not
  rarities; they move to `status`.
- **Source typos** — `limited varinat` → `variant`, `acive` → `active`.
- **Leaked CSS state** — one figure's rarity came through as `active`, a UI class the selector
  caught. Dropped as noise.
- **Placeholders** — `n/a` becomes `NULL`, so "unknown" doesn't render as a real status.

Without this the catalogue reported 15 distinct "rarities" and undercounted chasers by 5.
`scripts/smoke-test.mjs` asserts the normalisation holds.

## Tests

```bash
npm test          # both suites
npx tsc --noEmit  # typecheck
```

**`scripts/smoke-test.mjs`** — 26 checks over password hashing, catalogue integrity, FTS search,
type/status normalisation, and the collection lifecycle at the SQL level.

**`scripts/query-test.mts`** — 21 checks that call every exported function in `lib/queries.ts`
directly, as a signed-in user with collection and wishlist rows.

The second suite exists because the first one wasn't enough, and the way it failed is worth
recording. `smoke-test.mjs` verified the set-completion logic by *reimplementing* its SQL as a raw
query. That copy was correct, so the test passed — while the real `getSeriesProgress()` threw
`no such column: owned` on every call, because `HAVING` and `ORDER BY` can't reference `SELECT`
aliases. Both `/collection` and a signed-in `/series` were returning 500s the whole time.

Two lessons baked into the suites now:

- **Test the function, not a reproduction of it.** A test that rewrites the logic it's checking
  validates the rewrite.
- **Signed-out route checks prove almost nothing.** `/collection` returned a clean `307` redirect
  while signed out, which looked like a pass. Every user-specific page needs exercising *with* a
  session — `query-test.mts` creates one.

Both suites create throwaway users and delete them on the way out.

## Configuration

| Variable | Purpose |
| --- | --- |
| `SESSION_SECRET` | **Required in production.** Signs session cookies; without a stable value every deploy logs everyone out. Generate with `openssl rand -hex 32`. |
| `DATABASE_PATH` | Override the SQLite file location (default `data/vinylmation.db`). Point this at a persistent volume in production. |

## Deploying

### The one constraint that decides your host

The app keeps everything in a single SQLite file and writes to it on every
own/wishlist click. That means it needs **a long-running Node process with a persistent,
writable disk** — so it will *not* work on Vercel, Netlify, or Cloudflare Workers, whose
filesystems are read-only and ephemeral. A deploy there would appear to work until the first
write, then lose data on every cold start.

Hosts that fit as-is: **Fly.io**, **Railway**, **Render**, or any VPS. Attach a volume and point
`DATABASE_PATH` at it.

If you specifically want Vercel, swap SQLite for hosted Postgres (Neon, Supabase). Drizzle keeps
that contained: change the driver in `lib/db.ts`, the dialect in `drizzle.config.ts`, and the two
raw-SQL spots in `lib/queries.ts` (`getSeriesProgress`'s `LEFT JOIN`, and the FTS `MATCH` subquery
in `searchFigures` — Postgres uses `tsvector` instead of FTS5).

### Docker

A `Dockerfile` and entrypoint are included. The entrypoint refuses to start without
`SESSION_SECRET`, and seeds the catalogue into the volume on first boot.

```bash
docker build -t vinylmation .
docker run -p 3000:3000 -v vinylmation-data:/data -e SESSION_SECRET=$(openssl rand -hex 32) vinylmation
```

> Not yet build-tested — Docker wasn't available in the environment this was written in. The
> `npm run build` / standalone output it wraps *is* verified.

### Getting the catalogue onto the host

`data/*.db` is gitignored, but `data/figures.json` (1.6 MB) is not — commit it and the host can
seed from it in seconds rather than re-crawling the archive for ~12 minutes. That's what the Docker
entrypoint does. Either way, keep the database on the volume, not in the image: baking it in means
every redeploy resets your users' collections.

`.cache/` (47 MB of raw archive HTML) is never needed for deployment.

## Legal note

Vinylmation is a trademark of Disney; this is an unaffiliated fan project. The catalogue holds
factual product data (names, series, release dates, retail prices, rarity ratios, artist credits).
Image download is opt-in and off by default — see above.
