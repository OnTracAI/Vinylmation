const RARITY: Record<string, { label: string; color: string }> = {
  common: { label: "common", color: "var(--color-common)" },
  variant: { label: "variant", color: "var(--color-variant)" },
  chaser: { label: "chaser", color: "var(--color-chaser)" },
  topper: { label: "topper", color: "var(--color-topper)" },
};

export function rarityColor(type: string) {
  return RARITY[type]?.color ?? "var(--color-common)";
}

/** Rarity is the primary thing a collector scans a grid for, so it gets colour. */
export function RarityTag({ type, className = "" }: { type: string; className?: string }) {
  const meta = RARITY[type] ?? { label: type, color: "var(--color-common)" };
  const isCommon = type === "common";

  return (
    <span
      className={`label inline-flex items-center gap-1.5 ${className}`}
      style={{ color: isCommon ? undefined : meta.color }}
    >
      <span
        aria-hidden
        className="inline-block size-1.5 rounded-full"
        style={{ background: meta.color }}
      />
      {meta.label}
    </span>
  );
}
