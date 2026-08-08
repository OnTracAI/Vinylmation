import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { getFilterOptions, searchFigures } from "@/lib/queries";
import { FigureCard } from "../_components/FigureCard";
import { FilterBar } from "../_components/FilterBar";

export const metadata = { title: "Search // Vinylmation Vault" };

type SP = Record<string, string | string[] | undefined>;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const user = await currentUser();

  const one = (k: string) => {
    const v = sp[k];
    return (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
  };

  const filters = {
    q: one("q"),
    type: one("type"),
    size: one("size"),
    status: one("status"),
    artist: one("artist"),
    year: one("year") ? Number(one("year")) : undefined,
    owned: one("owned"),
    page: one("page") ? Math.max(1, Number(one("page"))) : 1,
    perPage: 60,
  };

  const { rows, total, page, perPage } = searchFigures(filters, user?.id);
  const options = getFilterOptions();
  const pages = Math.ceil(total / perPage);

  const activeCount = [
    filters.type,
    filters.size,
    filters.status,
    filters.artist,
    filters.year,
    filters.owned,
  ].filter(Boolean).length;

  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
      <header className="border-b border-hairline py-8">
        <p className="label">
          Search <span className="text-hairline-bright">//</span> Catalogue
        </p>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.02em] sm:text-4xl">
          {filters.q ? (
            <>
              &ldquo;{filters.q}&rdquo;
              <span className="ml-3 text-ink-faint">{total.toLocaleString()}</span>
            </>
          ) : (
            <>
              {total.toLocaleString()} figures
              {activeCount > 0 && <span className="ml-3 text-ink-faint">filtered</span>}
            </>
          )}
        </h1>
      </header>

      <FilterBar options={options} signedIn={!!user} />

      {rows.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-2xl font-bold text-ink-dim">Nothing matches.</p>
          <p className="mt-2 text-ink-faint">Try a broader search or clear a filter.</p>
          <Link href="/search" className="btn mt-6 inline-block">
            Clear everything
          </Link>
        </div>
      ) : (
        <>
          <div
            className="grid grid-cols-2 gap-3 py-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
          >
            {rows.map((f, i) => (
              <FigureCard key={f.id} figure={f} signedIn={!!user} index={i} />
            ))}
          </div>

          {pages > 1 && (
            <Pagination page={page} pages={pages} sp={sp} total={total} perPage={perPage} />
          )}
        </>
      )}
    </div>
  );
}

function Pagination({
  page,
  pages,
  sp,
  total,
  perPage,
}: {
  page: number;
  pages: number;
  sp: SP;
  total: number;
  perPage: number;
}) {
  const href = (p: number) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) {
      if (k === "page" || v === undefined) continue;
      params.set(k, Array.isArray(v) ? (v[0] ?? "") : v);
    }
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/search?${qs}` : "/search";
  };

  // Compact window around the current page.
  const window = new Set<number>([1, pages, page - 1, page, page + 1]);
  const list = [...window].filter((p) => p >= 1 && p <= pages).sort((a, b) => a - b);

  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-4 border-t border-hairline py-8"
      aria-label="Pagination"
    >
      <span className="label">
        {(page - 1) * perPage + 1}&ndash;{Math.min(page * perPage, total)} of{" "}
        {total.toLocaleString()}
      </span>

      <div className="flex items-center gap-1.5">
        {page > 1 && (
          <Link href={href(page - 1)} className="btn">
            prev
          </Link>
        )}
        {list.map((p, i) => (
          <span key={p} className="flex items-center gap-1.5">
            {i > 0 && list[i - 1] !== p - 1 && <span className="label px-1">…</span>}
            <Link href={href(p)} className={`btn ${p === page ? "btn-on" : ""}`}>
              {p}
            </Link>
          </span>
        ))}
        {page < pages && (
          <Link href={href(page + 1)} className="btn">
            next
          </Link>
        )}
      </div>
    </nav>
  );
}
