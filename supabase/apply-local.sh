#!/usr/bin/env bash
set -euo pipefail

# Apply local Supabase migrations for BettaDayz PBBG
# Requires: Supabase CLI and Docker

echo "== BettaDayz PBBG: Applying local Supabase migrations =="

if ! command -v supabase >/dev/null 2>&1; then
  echo "Installing Supabase CLI..."
  npm install -g supabase
fi

if [ ! -f "supabase/config.toml" ]; then
  echo "Initializing Supabase project..."
  supabase init
fi

echo "Starting local Supabase (Docker) ..."
supabase start || true

# Ensure migrations folder exists and contains our initial schema
if [ ! -d "supabase/migrations" ]; then
  mkdir -p supabase/migrations
fi

if [ ! -f "supabase/migrations/001_initial_schema.sql" ]; then
  cp supabase/migrations/001_initial_schema.sql supabase/migrations/ 2>/dev/null || true
fi

echo "Resetting DB and applying migrations..."
supabase db reset --no-backup --schema public

echo "✅ Local Supabase is ready. Connection info:"
supabase status
