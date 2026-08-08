/**
 * Shared crop for archived figure photos.
 *
 * The source images are 729x400 composites on white, and their layouts vary —
 * some are figure + packaging + artist signature, others are four rotated
 * views of the figure alone. Shown whole at thumbnail size the figure is
 * unrecognisably small.
 *
 * The one constant across layouts is a front view of the figure at the left
 * edge, so thumbnails zoom to roughly the left quarter, bottom-weighted to
 * skip the logo band. Cropping lives here (CSS) rather than in the download,
 * so re-cropping never means re-fetching ~314 MB.
 */
export const THUMB_CROP = {
  backgroundSize: "385% auto",
  backgroundPosition: "2% 88%",
  backgroundRepeat: "no-repeat",
} as const;

/**
 * Aspect ratio and plate colour are set inline rather than left to utility
 * classes alone. A thumbnail is a background image on an otherwise empty div,
 * so its height comes entirely from the aspect ratio — if that one rule is
 * missing the box collapses to zero height and the photo silently vanishes
 * while the rest of the page looks perfectly fine. Inlining it means the
 * thumbnails can't be broken by a stale stylesheet or a purged utility.
 */
export const THUMB_BOX = {
  aspectRatio: "3 / 4",
  backgroundColor: "var(--color-plate, #f2efe9)",
} as const;

/** Inline style for an element whose background is a cropped figure photo. */
export function thumbStyle(imagePath: string): React.CSSProperties {
  return { backgroundImage: `url("${imagePath}")`, ...THUMB_CROP, ...THUMB_BOX };
}

/** Inline style for an empty thumbnail slot — keeps the row's height. */
export function emptyThumbStyle(): React.CSSProperties {
  return { aspectRatio: "3 / 4", backgroundColor: "var(--color-surface, #17171b)" };
}
