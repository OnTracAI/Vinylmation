import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="label">Error <span className="text-hairline-bright">//</span> 404</p>
      <h1 className="mt-4 font-display text-5xl font-extrabold tracking-[-0.03em]">
        Not in the vault.
      </h1>
      <p className="mt-4 text-ink-dim">
        That figure or series isn&rsquo;t in the catalogue. It may have been listed under a
        different series name.
      </p>
      <div className="mt-8 flex justify-center gap-2">
        <Link href="/series" className="btn btn-accent">
          Browse series
        </Link>
        <Link href="/search" className="btn">
          Search
        </Link>
      </div>
    </div>
  );
}
