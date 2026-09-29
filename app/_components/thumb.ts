/**
 * Thumbnail framing for figure photos.
 *
 * The photos come from two unrelated sources with opposite shapes, so there is
 * no single crop that suits both:
 *
 *  - Archived catalogue shots are ~729x400 landscape composites — several views
 *    of the figure, often with packaging and the artist's signature, on white.
 *    Shown whole at thumbnail size the figure is unrecognisably small, so these
 *    zoom to the front view at the left edge.
 *
 *  - Hand-added photos are typically portrait single-figure shots (~220x310).
 *    Zooming those magnifies a fragment and throws the figure off-centre; they
 *    just need to be fitted whole and centred.
 *
 * link-images.mjs records each image's aspect ratio, so the choice is made from
 * the actual file rather than assumed. Framing stays in CSS so re-tuning never
 * means re-fetching ~300 MB of photos.
 */

/** Above this, an image is a multi-view composite rather than a single figure. */
const COMPOSITE_ASPECT = 1.2;

const BOX = {
  aspectRatio: "3 / 4",
  backgroundColor: "var(--color-plate, #f2efe9)",
  backgroundRepeat: "no-repeat",
} as const;

/** Zoom to the front view at the left edge of a wide composite. */
const COMPOSITE_CROP = {
  backgroundSize: "385% auto",
  backgroundPosition: "2% 88%",
} as const;

/** Fit a single-figure shot whole, centred, with a little breathing room. */
const SINGLE_FIT = {
  backgroundSize: "contain",
  backgroundPosition: "center center",
} as const;

/** Aspect ratio and plate colour, for the no-photo fallback. */
export const THUMB_BOX = BOX;

/**
 * Inline style for an element whose background is a figure photo.
 *
 * `aspect` is the image's own width/height. A null value (older rows, or a file
 * whose dimensions couldn't be read) falls back to fitting the whole image —
 * the safe choice, since it can't crop the subject out of frame.
 */
export function thumbStyle(imagePath: string, aspect?: number | null): React.CSSProperties {
  const framing =
    aspect != null && aspect > COMPOSITE_ASPECT ? COMPOSITE_CROP : SINGLE_FIT;

  return { backgroundImage: `url("${imagePath}")`, ...BOX, ...framing };
}

/** Inline style for an empty thumbnail slot — keeps the row's height. */
export function emptyThumbStyle(): React.CSSProperties {
  return { aspectRatio: "3 / 4", backgroundColor: "var(--color-surface, #17171b)" };
}
