# syntax=docker/dockerfile:1

# --- build ------------------------------------------------------------------
FROM node:22-slim AS builder
WORKDIR /app

# better-sqlite3 compiles from source when no prebuilt binary matches the
# platform, so the toolchain has to be present.
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- run --------------------------------------------------------------------
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
# The database lives on a mounted volume so collections survive redeploys.
ENV DATABASE_PATH=/data/vinylmation.db
ENV PORT=3000 HOSTNAME=0.0.0.0

RUN groupadd -g 1001 nodejs && useradd -u 1001 -g nodejs nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Seed script plus its input, so the volume can be initialised on first boot.
# Shipping data/figures.json (1.6 MB) beats re-crawling the archive on the host.
COPY --from=builder /app/scripts/seed.mjs ./scripts/
COPY --from=builder /app/data/figures.json /app/data/series.json ./data/
COPY --from=builder /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3
COPY --from=builder /app/node_modules/bindings ./node_modules/bindings
COPY --from=builder /app/node_modules/file-uri-to-path ./node_modules/file-uri-to-path

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh \
    && mkdir -p /data \
    && chown -R nextjs:nodejs /data /app

USER nextjs
VOLUME /data
EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]
