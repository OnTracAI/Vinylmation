/**
 * Placeholder mark for figures with no photo: the Vinylmation body shape —
 * mouse-ear head over a rounded torso.
 *
 * The viewBox is cropped to the artwork's real bounds rather than a plain
 * 0 0 100 100. Two reasons:
 *
 *  - The shape isn't vertically centred in a square viewBox (its content runs
 *    y 12→94, so the visual midpoint is 53). Centring the *element* therefore
 *    left the figure looking low and off-centre.
 *  - A square viewBox inside the 3:4 plate letterboxes, so the mark rendered
 *    noticeably smaller than the space allowed.
 *
 * Cropping to 11 10 78 86 puts the artwork's centre at the viewBox centre, so
 * ordinary xMidYMid centring now lands it exactly.
 */
const SHAPE =
  "M31 60h38a8 8 0 0 1 8 8v18a8 8 0 0 1-8 8H31a8 8 0 0 1-8-8V68a8 8 0 0 1 8-8Z";

function Body() {
  return (
    <>
      <circle cx="27" cy="26" r="14" />
      <circle cx="73" cy="26" r="14" />
      <circle cx="50" cy="42" r="23" />
      <path d={SHAPE} />
    </>
  );
}

export function VinylSilhouette({
  color,
  /** Height as a share of the container; width follows the shape's aspect. */
  scale = "62%",
  animate = true,
}: {
  color: string;
  scale?: string;
  animate?: boolean;
}) {
  return (
    <svg
      viewBox="11 10 78 86"
      aria-hidden
      // Sized inline so a missing arbitrary-value utility can't collapse it.
      style={{ height: scale, width: "auto" }}
      className={animate ? "transition-transform duration-500 group-hover:scale-105" : undefined}
    >
      <g fill={color} opacity="0.17">
        <Body />
      </g>
      <g fill="none" stroke={color} strokeWidth="1.5" opacity="0.5">
        <Body />
      </g>
    </svg>
  );
}
