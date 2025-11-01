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

This project includes TinaCMS scaffolding for live content editing capabilities. TinaCMS provides a visual editor that allows content creators to edit pages directly in the browser.

### Quick Start

1. **Install TinaCMS packages**:
   ```bash
   npm install --save tinacms @tinacms/react @tinacms/cli
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env.local`
   - Fill in your TinaCMS credentials (Client ID is already provided)
   - Never commit `.env.local` to version control

3. **Initialize TinaCMS**:
   ```bash
   npx @tinacms/cli@latest init
   ```
   This will create the schema and connect to TinaCloud.

4. **Connect to TinaCloud**:
   - Go to [TinaCloud dashboard](https://app.tina.io/)
   - Connect your GitHub repository
   - Grant the Tina GitHub App write access

For complete setup instructions including Hostinger deployment and Cloudflare configuration, see [docs/tina-setup.md](docs/tina-setup.md).

### Features

- **Live Editing**: Edit content directly in the browser with a visual editor
- **Git-based**: All content changes are committed to your Git repository
- **Type-safe**: Full TypeScript support with auto-generated types
- **Media Management**: Upload and manage media files in `public/uploads/`
- **SVG Support**: Use the `components/SvgInline.tsx` helper for inline SVG integration
