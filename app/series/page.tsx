import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { getSeriesProgress, getSeriesThumbnails, listSeriesGroups } from "@/lib/queries";
import { ScrollMemory } from "../_components/ScrollMemory";
import { emptyThumbStyle, thumbStyle } from "../_components/thumb";

export const metadata = { title: "Series & Sets // Vinylmation Vault" };

/**
 * A few figures from the series, so the browse grid reads visually rather than
 * as 319 identical text cards. Renders a fixed three slots regardless of how
 * many photos exist, so card heights stay uniform across the grid.
 */
function SeriesThumbStrip({ images }: { images: string[] }) {
  if (images.length === 0) return null;

  return (
    <div aria-hidden className="mb-3 flex gap-px overflow-hidden bg-hairline">
      {Array.from({ length: 3 }, (_, i) => {
        const src = images[i];
        // Empty slots take the card's own surface colour, so a short series
        // reads as "only one figure" rather than as photos that failed to load.
        return (
          <div
            key={i}
            className="flex-1 transition-transform duration-300 group-hover:scale-[1.03]"
            style={src ? thumbStyle(src) : emptyThumbStyle()}
          />
        );
      })}
    </div>
  );
}

export default async function SeriesIndexPage() {
  const user = await currentUser();
  const groups = listSeriesGroups();
  const thumbs = getSeriesThumbnails(3);

  // Owned counts per base series, so the index doubles as a progress board.
  const progress = user
    ? new Map(getSeriesProgress(user.id, { onlyStarted: false }).map((r) => [r.baseName, r]))
    : null;

  // Group alphabetically, with numeric-leading names bucketed under "#".
  const buckets = new Map<string, typeof groups>();
  for (const g of groups) {
    const first = g.baseName[0]?.toUpperCase() ?? "#";
    const key = /[A-Z]/.test(first) ? first : "#";
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(g);
  }
  const letters = [...buckets.keys()].sort((a, b) =>
    a === "#" ? -1 : b === "#" ? 1 : a.localeCompare(b),
  );

  const totalFigures = groups.reduce((n, g) => n + Number(g.totalFigures ?? 0), 0);

  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
      {/* Keeps your place when you step into a series and come back. */}
      <ScrollMemory />

      <header className="border-b border-hairline py-10">
        <p className="label">
          Browse <span className="text-hairline-bright">//</span> Series &amp; Sets
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.02em] sm:text-5xl">
          The whole catalogue
        </h1>
        <p className="mt-3 max-w-2xl text-ink-dim">
          {groups.length.toLocaleString()} series and sets, {totalFigures.toLocaleString()}{" "}
          figures. Sub-lines like 9&quot; releases and combo sets are grouped with their main
          series.
        </p>

        <nav className="mt-6 flex flex-wrap gap-1" aria-label="Jump to letter">
          {letters.map((l) => (
            <a
              key={l}
              href={`#letter-${l}`}
              className="label-bright border border-hairline px-2 py-1 transition-colors
                hover:border-accent hover:text-accent"
            >
              {l}
            </a>
          ))}
        </nav>
      </header>

      {letters.map((letter) => (
        <section key={letter} id={`letter-${letter}`} className="scroll-mt-24 py-8">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-2xl font-extrabold text-accent">{letter}</h2>
            <div className="rule flex-1" />
            <span className="label">{buckets.get(letter)!.length}</span>
          </div>

          {/* Hairlines ring each cell rather than showing a parent background,
              so letters with fewer entries than columns don't paint empty
              tracks. */}
          <ul className="mt-4 grid gap-px sm:grid-cols-2 lg:grid-cols-3">
            {buckets.get(letter)!.map((g, i) => {
              const p = progress?.get(g.baseName);
              const total = Number(g.totalFigures ?? 0);
              const owned = Number(p?.owned ?? 0);
              const complete = total > 0 && owned >= total;

              return (
                <li key={g.baseName} className="bg-ground ring-1 ring-hairline">
                  <Link
                    href={`/series/${g.primarySlug}`}
                    className="group flex h-full flex-col gap-2 p-4 transition-colors
                      hover:bg-surface"
                    style={{ animationDelay: `${Math.min(i, 20) * 12}ms` }}
                  >
                    <SeriesThumbStrip images={thumbs.get(g.baseName) ?? []} />

                    <div className="flex items-start justify-between gap-3">
                      <h3
                        className="font-display leading-tight font-semibold text-balance
                          transition-colors group-hover:text-accent"
                      >
                        {g.baseName}
                      </h3>
                      <span className="label shrink-0 pt-0.5">{total}</span>
                    </div>

                    <div className="mt-auto flex items-center gap-2">
                      {Number(g.variantCount) > 1 && (
                        <span className="label">{g.variantCount} lines</span>
                      )}
                      {g.minYear && <span className="label">{g.minYear}</span>}
                    </div>

                    {progress && total > 0 && (
                      <>
                        <div className="h-[3px] w-full bg-surface-2">
                          <div
                            className="h-full transition-all"
                            style={{
                              width: `${(owned / total) * 100}%`,
                              background: complete
                                ? "var(--color-variant)"
                                : "var(--color-accent)",
                            }}
                          />
                        </div>
                        <span
                          className="label"
                          style={complete ? { color: "var(--color-variant)" } : undefined}
                        >
                          {complete ? "complete" : `${owned} / ${total} owned`}
                        </span>
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
