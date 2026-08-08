"use client";

import { useRouter, useSearchParams } from "next/navigation";

/**
 * Filter controls that write straight to the URL, so every filtered view is
 * linkable and the back button behaves.
 */
export function FilterBar({
  options,
  signedIn,
}: {
  options: { types: string[]; sizes: string[]; statuses: string[]; years: number[] };
  signedIn: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();

  function set(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page"); // a new filter invalidates the current page
    const qs = next.toString();
    router.push(qs ? `/search?${qs}` : "/search");
  }

  const active = ["type", "size", "status", "year", "artist", "owned"].filter((k) =>
    params.get(k),
  );

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-hairline py-4">
      <span className="label mr-1">filter</span>

      <Select
        name="type"
        label="rarity"
        value={params.get("type") ?? ""}
        options={options.types}
        onChange={set}
      />
      <Select
        name="size"
        label="size"
        value={params.get("size") ?? ""}
        options={options.sizes}
        onChange={set}
      />
      <Select
        name="status"
        label="status"
        value={params.get("status") ?? ""}
        options={options.statuses}
        onChange={set}
      />
      <Select
        name="year"
        label="year"
        value={params.get("year") ?? ""}
        options={options.years.map(String)}
        onChange={set}
      />

      {signedIn && (
        <Select
          name="owned"
          label="mine"
          value={params.get("owned") ?? ""}
          options={["owned", "missing", "wishlist"]}
          onChange={set}
        />
      )}

      {params.get("artist") && (
        <button
          type="button"
          className="btn btn-on"
          onClick={() => set("artist", "")}
          title="Remove artist filter"
        >
          {params.get("artist")} ✕
        </button>
      )}

      {active.length > 0 && (
        <button
          type="button"
          className="label-bright ml-auto px-2 hover:text-accent"
          onClick={() => {
            const q = params.get("q");
            router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
          }}
        >
          clear {active.length} filter{active.length > 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}

function Select({
  name,
  label,
  value,
  options,
  onChange,
}: {
  name: string;
  label: string;
  value: string;
  options: string[];
  onChange: (k: string, v: string) => void;
}) {
  if (options.length === 0) return null;

  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select
        className={`input w-auto ${value ? "border-accent-dim text-accent" : ""}`}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
      >
        <option value="">{label}: any</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
