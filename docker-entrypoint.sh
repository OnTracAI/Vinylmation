#!/bin/sh
set -e

if [ -z "$SESSION_SECRET" ]; then
  echo "ERROR: SESSION_SECRET is not set. Generate one with:  openssl rand -hex 32" >&2
  exit 1
fi

# Seed the volume on first boot only. seed.mjs reads ./data/figures.json and
# writes to $DATABASE_PATH, so both resolve correctly from /app.
if [ ! -f "$DATABASE_PATH" ]; then
  if [ -f /app/data/figures.json ]; then
    echo "No database at $DATABASE_PATH — seeding catalogue…"
    node /app/scripts/seed.mjs
  else
    echo "WARNING: no database and no seed data; the catalogue will be empty." >&2
    echo "Run the scrapers locally, then rebuild the image." >&2
  fi
fi

exec "$@"
