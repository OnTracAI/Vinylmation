import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import {
  getCollectionItems,
  getCollectionSummary,
  getSeriesProgress,
  getWishlist,
} from "@/lib/queries";
import { FigureCard } from "../_components/FigureCard";
import { RarityTag } from "../_components/RarityTag";
import { SignOutButton } from "../_components/SignOutButton";

export const metadata = { title: "My Collection // Vinylmation Vault" };

export default async function CollectionPage() {
  const user = await currentUser();
  if (!user) redirect("/login?next=/collection");

  const summary = getCollectionSummary(user.id);
  const progress = getSeriesProgress(user.id);
  const items = getCollectionItems(user.id);
  const wishlist = getWishlist(user.id);

  const complete = progress.filter((p) => Number(p.owned) >= Number(p.total));
  const pct = summary.catalogTotal
    ? Math.round((summary.distinctOwned / summary.catalogTotal) * 1000) / 10
    : 0;

  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
      <header className="border-b border-hairline py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label">
              Collection <span className="text-hairline-bright">//</span> {user.displayName}
            </p>
            <h1
              className="mt-3 font-display text-4xl font-extrabold tracking-[-0.02em] sm:text-5xl"
            >
              {summary.distinctOwned.toLocaleString()}
              <span className="text-ink-faint">
                {" / "}
                {summary.catalogTotal.toLocaleString()}
              </span>
            </h1>
            <p className="label-bright mt-2">{pct}% of the catalogue</p>
          </div>
          <SignOutButton />
        </div>

        <div className="mt-6 h-2 w-full bg-surface">
          <div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }} />
        </div>

        <dl
          className="mt-8 grid grid-cols-2 gap-px border border-hairline bg-hairline
            sm:grid-cols-5"
        >
          <Stat label="unique figures" value={summary.distinctOwned} />
          <Stat label="total pieces" value={summary.totalPieces} />
          <Stat label="sets complete" value={complete.length} />
          <Stat label="on wishlist" value={summary.wishlist} />
          <Stat
            label="invested"
            value={summary.spent}
            format={(n) => (n > 0 ? `$${n.toFixed(2)}` : "—")}
          />
        </dl>

        {summary.byType.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="label">by rarity</span>
            {summary.byType.map((t) => (
              <span key={t.type} className="flex items-center gap-2">
                <RarityTag type={t.type} />
                <span className="font-display text-sm font-bold">{t.n}</span>
              </span>
            ))}
          </div>
        )}
      </header>

      {summary.distinctOwned === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-2xl font-bold text-ink-dim">
            Nothing tracked yet.
          </p>
          <p className="mx-auto mt-3 max-w-md text-ink-faint">
            Browse the catalogue and hit <span className="text-ink-dim">own</span> on the figures
            you have. Sets fill in as you go.
          </p>
          <Link href="/series" className="btn btn-accent mt-6 inline-block">
            Start browsing
          </Link>
        </div>
      ) : (
        <>
          {progress.length > 0 && (
            <section className="py-10">
              <div className="mb-5 flex items-center gap-4">
                <h2 className="font-display text-xl font-bold tracking-tight">
                  Set completion
                </h2>
                <div className="rule flex-1" />
                <span className="label">{progress.length} started</span>
              </div>

              {/* Hairlines come from a ring on each cell rather than a parent
                  background, so a partially-filled row doesn't paint empty
                  tracks. The ring sits in the 1px gap and reads as one line. */}
              <ul className="grid gap-px sm:grid-cols-2 lg:grid-cols-3">
                {progress.map((p) => {
                  const owned = Number(p.owned);
                  const total = Number(p.total);
                  const done = owned >= total;
                  const remaining = total - owned;

                  return (
                    <li key={p.baseName} className="bg-ground ring-1 ring-hairline">
                      <Link
                        href={`/series/${p.primarySlug}`}
                        className="group block p-4 transition-colors hover:bg-surface"
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <h3
                            className="font-display leading-tight font-semibold text-balance
                              transition-colors group-hover:text-accent"
                          >
                            {p.baseName}
                          </h3>
                          <span
                            className="label shrink-0"
                            style={done ? { color: "var(--color-variant)" } : undefined}
                          >
                            {owned}/{total}
                          </span>
                        </div>

                        <div className="mt-3 h-[3px] w-full bg-surface-2">
                          <div
                            className="h-full transition-all"
                            style={{
                              width: `${(owned / total) * 100}%`,
                              background: done
                                ? "var(--color-variant)"
                                : "var(--color-accent)",
                            }}
                          />
                        </div>

                        <p
                          className="label mt-2"
                          style={done ? { color: "var(--color-variant)" } : undefined}
                        >
                          {done ? "✓ complete" : `${remaining} to go`}
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {wishlist.length > 0 && (
            <section className="border-t border-hairline py-10">
              <div className="mb-5 flex items-center gap-4">
                <h2 className="font-display text-xl font-bold tracking-tight">Hunting</h2>
                <div className="rule flex-1" />
                <Link href="/search?owned=wishlist" className="label-bright hover:text-accent">
                  {wishlist.length} figures &rsaquo;
                </Link>
              </div>
              <div
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
              >
                {wishlist.slice(0, 12).map((f, i) => (
                  <FigureCard
                    key={f.id}
                    figure={{ ...f, ownedQty: null, wishlisted: true }}
                    signedIn
                    index={i}
                  />
                ))}
              </div>
            </section>
          )}

          <section className="border-t border-hairline py-10">
            <div className="mb-5 flex items-center gap-4">
              <h2 className="font-display text-xl font-bold tracking-tight">
                Recently added
              </h2>
              <div className="rule flex-1" />
              <Link href="/search?owned=owned" className="label-bright hover:text-accent">
                view all &rsaquo;
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {items.slice(0, 18).map((f, i) => (
                <FigureCard
                  key={f.id}
                  figure={{ ...f, ownedQty: f.quantity, wishlisted: false }}
                  signedIn
                  index={i}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  format,
}: {
  label: string;
  value: number;
  format?: (n: number) => string;
}) {
  return (
    <div className="bg-ground px-4 py-5">
      <dd className="font-display text-2xl font-extrabold tracking-tight">
        {format ? format(value) : value.toLocaleString()}
      </dd>
      <dt className="label mt-1">{label}</dt>
    </div>
  );
}
