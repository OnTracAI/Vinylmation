"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") ?? "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <form onSubmit={submit} className="relative flex items-center">
      <span className="label pointer-events-none absolute left-3">/</span>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search 3,500 figures — name, series, artist"
        aria-label="Search figures"
        className={`input pl-7 ${compact ? "py-2 text-sm" : "py-3"}`}
      />
      <button
        type="submit"
        className="label-bright absolute right-2 px-2 py-1 hover:text-accent"
      >
        go
      </button>
    </form>
  );
}
