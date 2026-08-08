import Link from "next/link";
import { notFound } from "next/navigation";
import { currentUser } from "@/lib/auth";
import {
  getAdjacentSeries,
  getFiguresForSeries,
  getSeriesBySlug,
  getSeriesFamily,
} from "@/lib/queries";
import { FigureCard } from "../../_components/FigureCard";
import { SeriesBulkActions } from "../../_components/SeriesBulkActions";

export default async function SeriesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await currentUser();

  const target = getSeriesBySlug(slug);
  if (!target) notFound();

  const neighbours = getAdjacentSeries(target.baseName);

  // Show the whole family — the main line plus its 9" / set / Eachez sub-lines.
  const family = getSeriesFamily(target.baseName);
  const figures = getFiguresForSeries(
    family.map((s) => s.id),
    user?.id,
  );

  const owned = figures.filter((f) => (f.ownedQty ?? 0) > 0).length;
  const complete = figures.length > 0 && owned === figures.length;

  // Figures that "mark all wanted" would actually add: missing, not already
  // wishlisted. If none, the button would be a no-op, so it isn't shown.
  const wantable = figures.filter((f) => (f.ownedQty ?? 0) === 0 && !f.wishlisted).length;

  const bySeries = new Map<number, typeof figures>();
  for (const f of figures) {
    if (!bySeries.has(f.seriesId)) bySeries.set(f.seriesId, []);
    bySeries.get(f.seriesId)!.push(f);
  }

  const years = [...new Set(figures.map((f) => f.releaseYear).filter(Boolean))].sort();
  const artists = [...new Set(figures.map((f) => f.artist).filter(Boolean))];

  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
      <header className="border-b border-hairline py-10">
        <nav className="label flex flex-wrap items-center gap-2">
          <Link href="/series" className="hover:text-accent">
            Series
          </Link>
          <span className="text-hairline-bright">//</span>
          <span className="text-ink-dim">{target.baseName}</span>

          <span className="ml-auto flex items-center gap-3">
            {neighbours.prev ? (
              <Link
                href={`/series/${neighbours.prev.slug}`}
                className="hover:text-accent"
                title={neighbours.prev.baseName}
                rel="prev"
              >
                &lsaquo; prev
              </Link>
            ) : (
              <span className="text-hairline-bright">&lsaquo; prev</span>
            )}

            {neighbours.total > 0 && (
              <span className="text-ink-faint">
                {neighbours.position} of {neighbours.total}
              </span>
            )}

            {neighbours.next ? (
              <Link
                href={`/series/${neighbours.next.slug}`}
                className="hover:text-accent"
                title={neighbours.next.baseName}
                rel="next"
              >
                next &rsaquo;
              </Link>
            ) : (
              <span className="text-hairline-bright">next &rsaquo;</span>
            )}
          </span>
        </nav>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1
              className="max-w-3xl font-display text-4xl leading-[1.02] font-extrabold
                tracking-[-0.02em] text-balance sm:text-5xl"
            >
              {target.baseName}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="label-bright">{figures.length} figures</span>
              {family.length > 1 && (
                <span className="label-bright">{family.length} lines</span>
              )}
              {years.length > 0 && (
                <span className="label-bright">
                  {years[0]}
                  {years.length > 1 && years.at(-1) !== years[0] && `–${years.at(-1)}`}
                </span>
              )}
              {artists.length > 0 && (
                <span className="label-bright">
                  {artists.length === 1 ? artists[0] : `${artists.length} artists`}
                </span>
              )}
            </div>
          </div>

          {user && (
            <div className="flex flex-col items-end gap-3">
              <div className="text-right">
                <p
                  className="font-display text-3xl font-extrabold tracking-tight"
                  style={complete ? { color: "var(--color-variant)" } : undefined}
                >
                  {owned}
                  <span className="text-ink-faint">/{figures.length}</span>
                </p>
                <p className="label mt-1">{complete ? "set complete" : "owned"}</p>
              </div>
              {(!complete || wantable > 0) && (
                <SeriesBulkActions
                  seriesIds={family.map((s) => s.id)}
                  showOwn={!complete}
                  showWant={wantable > 0}
                />
              )}
            </div>
          )}
        </div>

        {user && figures.length > 0 && (
          <div className="mt-6 h-1.5 w-full bg-surface">
            <div
              className="h-full transition-all"
              style={{
                width: `${(owned / figures.length) * 100}%`,
                background: complete ? "var(--color-variant)" : "var(--color-accent)",
              }}
            />
          </div>
        )}
      </header>

      {family.map((s) => {
        const items = bySeries.get(s.id) ?? [];
        if (items.length === 0) return null;

        return (
          <section key={s.id} className="py-10">
            {family.length > 1 && (
              <div className="mb-5 flex items-center gap-4">
                <h2 className="font-display text-lg font-bold tracking-tight">
                  {s.qualifier ?? "Main line"}
                </h2>
                <div className="rule flex-1" />
                <span className="label">{items.length}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {items.map((f, i) => (
                <FigureCard key={f.id} figure={f} signedIn={!!user} index={i} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
