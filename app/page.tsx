import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { getCatalogStats, getCollectionSummary, searchFigures } from "@/lib/queries";
import { FigureCard } from "./_components/FigureCard";
import { SearchBar } from "./_components/SearchBar";

export default async function HomePage() {
  const user = await currentUser();
  const stats = getCatalogStats();
  const summary = user ? getCollectionSummary(user.id) : null;

  // A slice of chasers makes a better shop window than the alphabetical head
  // of the catalog — they're the figures collectors actually chase.
  const featured = searchFigures({ type: "chaser", perPage: 12 }, user?.id).rows;

  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
      <section className="relative border-b border-hairline py-16 sm:py-24">
        <p className="label-bright rise">
          Keep <span className="text-hairline-bright">//</span> Trade{" "}
          <span className="text-hairline-bright">//</span> Love
        </p>

        <h1
          className="rise mt-4 max-w-4xl font-display text-5xl leading-[0.95] font-extrabold
            tracking-[-0.03em] text-balance sm:text-7xl"
          style={{ animationDelay: "60ms" }}
        >
          Your Vinylmation
          <br />
          collection,{" "}
          <span className="text-accent">catalogued.</span>
        </h1>

        <p
          className="rise mt-6 max-w-xl text-lg leading-relaxed text-ink-dim"
          style={{ animationDelay: "120ms" }}
        >
          Every series, set, variant and chaser in one place. Mark what you own, track what
          you&rsquo;re hunting, and see exactly how close each set is to complete.
        </p>

        <div className="rise mt-8 max-w-xl" style={{ animationDelay: "180ms" }}>
          <SearchBar />
        </div>

        <dl
          className="rise mt-12 grid grid-cols-2 gap-px border border-hairline bg-hairline
            sm:grid-cols-4"
          style={{ animationDelay: "240ms" }}
        >
          <Stat label="figures" value={stats?.figures ?? 0} />
          <Stat label="series & sets" value={stats?.series ?? 0} />
          <Stat label="artists" value={stats?.artists ?? 0} />
          <Stat label="chasers" value={stats?.chasers ?? 0} accent />
        </dl>
      </section>

      {summary && (
        <section className="border-b border-hairline py-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label">Your collection</p>
              <p className="mt-2 font-display text-4xl font-extrabold tracking-tight">
                {summary.distinctOwned}
                <span className="text-ink-faint">
                  {" / "}
                  {summary.catalogTotal}
                </span>
              </p>
              <p className="label-bright mt-1">
                {pct(summary.distinctOwned, summary.catalogTotal)}% of the catalogue
                {summary.totalPieces > summary.distinctOwned && (
                  <> · {summary.totalPieces} pieces with duplicates</>
                )}
              </p>
            </div>
            <Link href="/collection" className="btn btn-accent">
              Open dashboard
            </Link>
          </div>
          <div className="mt-5 h-1.5 w-full bg-surface">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${pct(summary.distinctOwned, summary.catalogTotal)}%` }}
            />
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="label">The chase</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">
              Chaser figures
            </h2>
          </div>
          <Link href="/search?type=chaser" className="label-bright hover:text-accent">
            view all &rsaquo;
          </Link>
        </div>

        <div
          className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
        >
          {featured.map((f, i) => (
            <FigureCard key={f.id} figure={f} signedIn={!!user} index={i} />
          ))}
        </div>
      </section>

      <section className="border-t border-hairline py-12">
        <div className="grid gap-px bg-hairline sm:grid-cols-3">
          <Panel
            href="/series"
            label="browse"
            title="By series & set"
            body="All 490 series and sets, grouped so 9-inch lines and combo sets sit with their main release."
          />
          <Panel
            href="/search?owned=missing"
            label="fill the gaps"
            title="What you're missing"
            body="Filter the whole catalogue down to the figures you don't own yet."
          />
          <Panel
            href="/search?type=chaser"
            label="rarity"
            title="Chasers & variants"
            body="Every chase figure and colour variant, with the printed odds where they're known."
          />
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="bg-ground px-5 py-6">
      <dd
        className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl"
        style={accent ? { color: "var(--color-chaser)" } : undefined}
      >
        {value.toLocaleString()}
      </dd>
      <dt className="label mt-1.5">{label}</dt>
    </div>
  );
}

function Panel({
  href,
  label,
  title,
  body,
}: {
  href: string;
  label: string;
  title: string;
  body: string;
}) {
  return (
    <Link href={href} className="group bg-ground p-6 transition-colors hover:bg-surface">
      <p className="label">{label}</p>
      <h3
        className="mt-2 font-display text-lg font-bold tracking-tight transition-colors
          group-hover:text-accent"
      >
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-dim">{body}</p>
    </Link>
  );
}

function pct(a: number, b: number) {
  return b === 0 ? 0 : Math.round((a / b) * 1000) / 10;
}
