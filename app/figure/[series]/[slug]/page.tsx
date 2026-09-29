import Link from "next/link";
import { notFound } from "next/navigation";
import { currentUser } from "@/lib/auth";
import {
  getFigure,
  getFiguresForSeries,
  getOwnedDetails,
  getSeriesBySlug,
} from "@/lib/queries";
import { OwnedDetailsForm } from "@/app/_components/OwnedDetailsForm";
import { OwnershipButtons } from "@/app/_components/OwnershipButtons";
import { RarityTag, rarityColor } from "@/app/_components/RarityTag";
import { VinylSilhouette } from "@/app/_components/VinylSilhouette";

export default async function FigurePage({
  params,
}: {
  params: Promise<{ series: string; slug: string }>;
}) {
  const { series: seriesSlug, slug } = await params;
  const user = await currentUser();

  const figure = getFigure(seriesSlug, slug, user?.id);
  if (!figure) notFound();

  const seriesRow = getSeriesBySlug(seriesSlug);
  const siblings = seriesRow ? getFiguresForSeries([seriesRow.id], user?.id) : [];
  const position = siblings.findIndex((f) => f.id === figure.id);
  const prev = position > 0 ? siblings[position - 1] : null;
  const next = position >= 0 && position < siblings.length - 1 ? siblings[position + 1] : null;

  const owned = (figure.ownedQty ?? 0) > 0;

  // Previously saved condition/price/notes, so the edit form reflects what's
  // stored instead of rendering empty every time.
  const ownedDetails = user && owned ? getOwnedDetails(user.id, figure.id) : null;

  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
      <nav className="label flex flex-wrap items-center gap-2 py-6">
        <Link href="/series" className="hover:text-accent">
          Series
        </Link>
        <span className="text-hairline-bright">//</span>
        <Link href={`/series/${seriesSlug}`} className="hover:text-accent">
          {figure.seriesName}
        </Link>
        <span className="text-hairline-bright">//</span>
        <span className="text-ink-dim">{figure.name}</span>

        <span className="ml-auto flex items-center gap-3">
          {prev && (
            <Link
              href={`/figure/${prev.seriesSlug}/${prev.slug}`}
              className="hover:text-accent"
              title={prev.name}
            >
              &lsaquo; prev
            </Link>
          )}
          {position >= 0 && (
            <span className="text-ink-faint">
              {position + 1} of {siblings.length}
            </span>
          )}
          {next && (
            <Link
              href={`/figure/${next.seriesSlug}/${next.slug}`}
              className="hover:text-accent"
              title={next.name}
            >
              next &rsaquo;
            </Link>
          )}
        </span>
      </nav>

      <div className="grid gap-8 border-t border-hairline py-8 lg:grid-cols-[minmax(0,420px)_1fr]">
        <div>
          <div
            className="relative flex aspect-square items-center justify-center overflow-hidden
              border border-hairline bg-surface"
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-[3px]"
              style={{ background: rarityColor(figure.type) }}
            />
            {figure.imagePath ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={figure.imagePath}
                alt={figure.name}
                className="size-full bg-plate object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <VinylSilhouette color={rarityColor(figure.type)} scale="10rem" animate={false} />
                <span className="label">no image on file</span>
              </div>
            )}
          </div>

          {user ? (
            <div className="mt-4">
              <OwnershipButtons
                figureId={figure.id}
                owned={owned}
                wishlisted={figure.wishlisted}
              />
            </div>
          ) : (
            <Link href="/login" className="btn btn-accent mt-4 block text-center">
              Sign in to track this
            </Link>
          )}
        </div>

        <div className="min-w-0">
          <RarityTag type={figure.type} />
          <h1
            className="mt-2 font-display text-4xl leading-[1.02] font-extrabold
              tracking-[-0.02em] text-balance sm:text-5xl"
          >
            {figure.name}
          </h1>
          <Link
            href={`/series/${seriesSlug}`}
            className="mt-3 inline-block text-lg text-ink-dim hover:text-accent"
          >
            {figure.seriesName}
          </Link>

          <section className="mt-8">
            <div className="mb-3 flex items-center gap-4">
              <h2 className="label-bright">Figure details</h2>
              <div className="rule flex-1" />
            </div>

            <dl className="grid gap-px bg-hairline sm:grid-cols-2">
              <Row k="name" v={figure.name} />
              <Row k="series" v={figure.seriesName} />
              <Row
                k="artist"
                v={
                  figure.artist ? (
                    <Link
                      href={`/search?artist=${encodeURIComponent(figure.artist)}`}
                      className="hover:text-accent"
                    >
                      {figure.artist}
                    </Link>
                  ) : null
                }
              />
              <Row
                k="retail"
                v={figure.retailPrice ? `$${figure.retailPrice.toFixed(2)}` : null}
              />
              <Row k="status" v={figure.status} />
              <Row k="released" v={formatDate(figure.releasedAt) ?? figure.releaseYear} />
              <Row
                k="count"
                v={figure.setTotal ? `${figure.setPosition ?? "?"} of ${figure.setTotal}` : null}
              />
              <Row k="type" v={figure.type} />
              <Row k="rarity" v={figure.rarity} />
              <Row k="size" v={figure.size} />
              <Row k="box" v={figure.box} />
              <Row k="card" v={figure.hasCard === null ? null : figure.hasCard ? "yes" : "no"} />
            </dl>

            {!figure.detailComplete && (
              <p className="label mt-3 max-w-prose leading-relaxed">
                <span style={{ color: "var(--color-chaser)" }}>◆</span> Only the fields above were
                recoverable for this figure. The archived copy of its page predates the source
                site&rsquo;s rewrite, when these details loaded from an API rather than the page
                itself &mdash; so retail, release date and packaging weren&rsquo;t preserved.
              </p>
            )}
          </section>

          {user && owned && (
            <section className="mt-10">
              <div className="mb-3 flex items-center gap-4">
                <h2 className="label-bright">Your copy</h2>
                <div className="rule flex-1" />
              </div>
              <OwnedDetailsForm
                figureId={figure.id}
                quantity={figure.ownedQty ?? 1}
                initial={ownedDetails ?? undefined}
              />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3 bg-ground px-4 py-3">
      <dt className="label w-16 shrink-0">{k}</dt>
      <span className="label text-hairline-bright">//</span>
      <dd className="min-w-0 flex-1 text-sm break-words text-ink">
        {v ?? <span className="text-ink-faint">—</span>}
      </dd>
    </div>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

