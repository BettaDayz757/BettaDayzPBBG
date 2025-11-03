# BettaDayz PBBG — Scaffold (feature/init-scaffold)

Overview:
- Frontend: Next.js (React)
- Auth/DB: Supabase
- Payments: Cash App Pay (fiat) + Coinbase Commerce / BitPay (crypto recommended)
- Hosting: Vercel (frontend). Cloudflare for DNS/CDN/WAF.
- Game currency: BettaBuckz (USD purchases, $5 platform fee per purchase)

Branch: feature/init-scaffold — initial scaffold for MVP:
- Auth (Supabase)
- Buy BettaBuckz flow (sandbox)
- Store & item schema (seed)
- Single-player mini-game placeholder
- Admin endpoints skeleton (webhook, payment processing)

Next steps:
1. Invite developer account to the GitHub repo so I can push (or confirm you want ZIP).
2. Invite the Supabase project invite for DB + Auth.
3. Provide sandbox API keys for Coinbase Commerce and Cash App merchant/integration docs.
4. Invite Canva Business developer access for embedded editor flow.
5. Add domain to Cloudflare and invite user to manage DNS or provide credentials via secure channel.

MVP features confirmed:
- User auth (Supabase)
- Buy BettaBuckz
- Store (luxury items, cosmetic)
- Single-player mini-game
- Inventory & equip system

Security & Compliance notes:
- Crypto and virtual currency can trigger legal requirements (KYC/AML/money transmitter). I will not enable cashouts until we confirm compliance plan.

## TinaCMS / Editing

This project includes TinaCMS scaffolding to enable live editing of content directly in the browser.

### Quick Setup:
1. Install TinaCMS packages: `npm install --save tinacms @tinacms/react @tinacms/cli`
2. Copy `.env.example` to `.env.local` and fill in your TinaCloud credentials
3. Run the init CLI: `npx @tinacms/cli@latest init`
4. Connect your TinaCloud dashboard to this GitHub repository

### Documentation:
For detailed setup instructions including Hostinger deployment, Cloudflare configuration, and dual-domain strategy, see [docs/tina-setup.md](docs/tina-setup.md).
