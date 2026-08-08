import Link from "next/link";
import type { FigureRow } from "@/lib/queries";
import { OwnershipButtons } from "./OwnershipButtons";
import { RarityTag, rarityColor } from "./RarityTag";
import { THUMB_BOX, thumbStyle } from "./thumb";

/**
 * One cell in the specimen grid. Ownership is shown two ways — a coloured left
 * edge and an explicit count — so a dense grid reads at a glance.
 */
export function FigureCard({
  figure,
  signedIn,
  index = 0,
}: {
  figure: FigureRow;
  signedIn: boolean;
  index?: number;
}) {
  const owned = (figure.ownedQty ?? 0) > 0;
  const href = `/figure/${figure.seriesSlug}/${figure.slug}`;

  return (
    <article
      className="cell rise group flex flex-col"
      // Cap the stagger so late rows don't wait seconds to appear.
      style={{ animationDelay: `${Math.min(index, 24) * 18}ms` }}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-[2px] transition-opacity"
        style={{
          background: owned ? "var(--color-accent)" : rarityColor(figure.type),
          opacity: owned ? 1 : 0.35,
        }}
      />

      <Link href={href} className="flex flex-1 flex-col p-3 pl-4">
        <FigureThumb figure={figure} />

        <div className="mt-3 flex items-start justify-between gap-2">
          <RarityTag type={figure.type} />
          {owned && (
            <span className="label" style={{ color: "var(--color-accent)" }}>
              ×{figure.ownedQty}
            </span>
          )}
        </div>

        <h3
          className="mt-1.5 font-display text-[0.9375rem] leading-tight font-semibold text-ink
            transition-colors group-hover:text-accent"
        >
          {figure.name}
        </h3>

        <p className="label mt-1 line-clamp-1" title={figure.seriesName}>
          {figure.seriesName}
        </p>

        <div className="mt-auto flex items-center gap-2 pt-2.5">
          {figure.setTotal ? (
            <span className="label">
              {figure.setPosition ?? "?"}/{figure.setTotal}
            </span>
          ) : null}
          {figure.rarity && <span className="label">{figure.rarity}</span>}
          {figure.size && <span className="label ml-auto">{figure.size}</span>}
        </div>
      </Link>

      {signedIn && (
        <div className="border-t border-hairline px-3 py-2 pl-4">
          <OwnershipButtons
            figureId={figure.id}
            owned={owned}
            wishlisted={figure.wishlisted}
            compact
          />
        </div>
      )}
    </article>
  );
}

/**
 * CROP_NOTE — the archived photos are wide (729x400) composite product shots on
 * white, and their layouts vary: some are figure + packaging + artist
 * signature, others are four rotated views of the figure alone. Shown whole at
 * thumbnail size the figure is unrecognisably small, so the grid crops instead.
 *
 * The one reliable constant across layouts is a front view of the figure at the
 * left edge, so thumbnails zoom to roughly the left quarter, bottom-weighted to
 * skip the logo band. Portrait suits the subject. Sizing lives here rather than
 * in the download so re-cropping never means re-fetching 260 MB.
 *
 * The plate is a warm off-white: these images carry their own white background,
 * which would otherwise glare against the dark UI. The no-image fallback uses
 * the same plate so a partially-illustrated grid stays consistent.
 */
function FigureThumb({ figure }: { figure: FigureRow }) {
  if (figure.imagePath) {
    return (
      <div
        role="img"
        aria-label={figure.name}
        className="relative overflow-hidden transition-transform duration-300
          group-hover:scale-[1.03]"
        style={thumbStyle(figure.imagePath)}
      />
    );
  }

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={THUMB_BOX}
    >
      <VinylSilhouette color={rarityColor(figure.type)} />
    </div>
  );
}

/** The Vinylmation body shape: mouse-ear head over a rounded torso. */
function VinylSilhouette({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="size-[62%] transition-transform duration-500 group-hover:scale-105"
      aria-hidden
    >
      <g fill={color} opacity="0.17">
        <circle cx="27" cy="26" r="14" />
        <circle cx="73" cy="26" r="14" />
        <circle cx="50" cy="42" r="23" />
        <path d="M31 60h38a8 8 0 0 1 8 8v18a8 8 0 0 1-8 8H31a8 8 0 0 1-8-8V68a8 8 0 0 1 8-8Z" />
      </g>
      <g fill="none" stroke={color} strokeWidth="1.5" opacity="0.5">
        <circle cx="27" cy="26" r="14" />
        <circle cx="73" cy="26" r="14" />
        <circle cx="50" cy="42" r="23" />
        <path d="M31 60h38a8 8 0 0 1 8 8v18a8 8 0 0 1-8 8H31a8 8 0 0 1-8-8V68a8 8 0 0 1 8-8Z" />
      </g>
    </svg>
  );
}
