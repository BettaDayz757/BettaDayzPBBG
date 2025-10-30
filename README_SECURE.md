# Security & Deployment Checklist

IMPORTANT: Rotate any leaked Supabase keys immediately.

1) Rotate leaked keys in Supabase dashboard and create new keys.
2) Add env vars in your host (Hostinger/Vercel/etc):
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY (server-only)
3) Do not commit secrets. Add `.env` to `.gitignore` and commit `.env.example`.
4) If keys were committed, remove them from history using BFG or git-filter-repo (instructions in this file).
5) Hostinger-specific notes: add domain, enable AutoSSL, set DNS A records to 194.195.84.72, and set env vars in hPanel or place .env outside public_html.

Do not include real keys in the repo. This PR should add the files above with placeholders only.
