#!/usr/bin/env bash
set -euo pipefail

# Helper to guide applying migrations to a remote Supabase project
# This script does not run SQL remotely (requires tokens). It prints safe steps.

echo "== BettaDayz PBBG: Apply migrations to remote Supabase =="
echo
cat <<'STEPS'
1) Open your Supabase project dashboard
   https://supabase.com/dashboard

2) Go to SQL Editor

3) Open this file in your editor:
   supabase/migrations/001_initial_schema.sql

4) Copy its contents and paste into the SQL Editor

5) Click "Run" to execute. You should see tables created and RLS enabled.

6) After that, configure Authentication → Settings:
   - Site URL: https://bettadayz.shop
   - Additional redirect URLs:
       https://bettadayz.shop/auth/callback
       https://bettadayz.store/auth/callback
       https://bettadayz.shop
       https://bettadayz.store
   - CORS Origins:
       https://bettadayz.shop
       https://bettadayz.store

7) In your server .env files, set:
   NEXT_PUBLIC_SUPABASE_URL=... (Project Settings → API → URL)
   NEXT_PUBLIC_SUPABASE_ANON_KEY=... (anon key)
   SUPABASE_SERVICE_ROLE_KEY=... (service role key; server-only)

8) Redeploy/restart your app processes after updating env vars.

STEPS
