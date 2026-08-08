import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // better-sqlite3 is a native module — it must not be bundled.
  serverExternalPackages: ["better-sqlite3"],

  // Emit a self-contained server bundle in .next/standalone, so a deploy image
  // doesn't need the full node_modules tree.
  output: "standalone",

  // A lockfile in the parent directory otherwise wins root inference.
  turbopack: {
    root: path.dirname(new URL(import.meta.url).pathname),
  },

  // TypeScript 7 dropped the legacy compiler API Next.js reaches for, so use
  // the TS CLI instead. Typecheck with `npx tsc --noEmit`.
  experimental: {
    useTypeScriptCli: true,
  },
};

export default nextConfig;
