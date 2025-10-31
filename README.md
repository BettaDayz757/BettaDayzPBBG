# BettaDayz PBBG - Norfolk Business Empire

## DNSSEC: bettadayz.shop

To enable DNSSEC you will need to add the following DS record at your registrar for bettadayz.shop. Most registrars ask for only a subset of these fields.

- DS Record: bettadayz.shop. 3600 IN DS 2371 13 2 195306F5DBE79C69C5DAD1D6F6E28394C584E03FEB0ADE7AE52EBD452D653F77
- Digest: 195306F5DBE79C69C5DAD1D6F6E28394C584E03FEB0ADE7AE52EBD452D653F77
- Digest Type: 2 (SHA256)
- Algorithm: 13
- Public Key: mdsswUyr3DPW132mOi8V9xESWE8jTo0dxCjjnopKl+GqJxpVXckHAeF+KkxLbxILfDLUT0rAK9iUzy1L53eKGQ==
- Key Tag: 2371
- Flags: 257 (KSK)

Notes:

- Also toggle DNSSEC to On in the Cloudflare zone for bettadayz.shop, then add the DS at the registrar. Propagation can take up to 24 hours.
- Repeat analogous steps for bettadayz.store when its DS values are available from Cloudflare.

## Troubleshooting: 403 Forbidden on Cloudflare Pages

If you see “Failed to load resource: the server responded with a status of 403 (Forbidden)”, the server denied access to an existing resource. Common causes include strict host allowlists, missing index files, or WAF rules.

For this project specifically, ensure the Cloudflare Pages middleware allows the Pages alias and preview domains:

- File: `functions/_middleware.js`
- Allow hostnames ending with `.pages.dev` and `localhost` in addition to production domains. We’ve updated this already to fix deploy previews and the main alias.

General checks:

- Verify the URL and that an `index.html` exists for static directories.
- Check server/app logs and any WAF settings.
- Confirm client auth headers/cookies are present for protected routes.

## About BettaDayz PBBG

A Next.js-based Persistent Browser-Based Game (PBBG) celebrating African American and minority culture in Norfolk, VA. Build your business empire, create your legacy, and experience life simulation inspired by IMVU, BitLife, and Torn.com.

**Live Sites:**

- [https://bettadayz.shop](https://bettadayz.shop)
- [https://bettadayz.store](https://bettadayz.store)

## � Canva Integration

**NEW**: Connect your Canva account to edit and publish designs directly to your domains!

**Quick Start:**

1. Set up Canva credentials in `.env.local`
2. Run migration: `npx supabase db push`
3. Create `canva-assets` storage bucket
4. Connect Canva in dashboard
5. Publish designs to bettadayz.shop and/or bettadayz.store

**Workflow**: Canva Editor → Local Dashboard → Supabase Storage → Domain Publishing

**Documentation:**

- 📘 [Complete Integration Guide](./CANVA-INTEGRATION-GUIDE.md)
- 🚀 [Quick Start Guide](./CANVA-QUICK-START.md)
- 📊 [Implementation Summary](./CANVA-IMPLEMENTATION-SUMMARY.md)

**Features:**

- ✅ OAuth 2.0 authentication
- ✅ Browse and manage Canva designs
- ✅ Export in multiple formats (PNG, JPG, PDF, SVG)
- ✅ Publish to one or both domains
- ✅ Version control and audit trail
- ✅ Automatic CDN deployment

## �🎮 Game Features

### Inspired By

- **IMVU**: Social networking, character customization, virtual spaces
- **BitLife**: Life simulation, aging system, major life decisions
- **Torn.com**: Competitive gameplay, territory control, crew/gang system

### Core Gameplay

- 🏢 **Build Business Empire** in authentic Norfolk, VA locations
- 🎓 **HBCU Integration** with Norfolk State, Hampton, Virginia State
- ✊🏾 **Cultural Heritage** celebrating African American excellence
- 👤 **Life Simulation** from age 18 to 85 with meaningful choices
- 🤝 **Social Network** with crews, mentorship, and community impact
- 🏆 **Competitive Play** with territory control and reputation systems

## 🌍 Norfolk, VA Locations

- **Downtown Norfolk**: Historic Black Wall Street revival area
- **Norfolk State District**: Premier HBCU campus and innovation hub  
- **Berkley**: Historic African American neighborhood renaissance
- **Ocean View**: Beach community with rich cultural heritage
- **Military Circle**: Near Naval Station Norfolk
- **Ghent**: Arts and culture district
- **Park Place**: Family business community
- **Churchland**: Spiritual and community center

## 🎓 HBCU Connections

- **Norfolk State University** - Business partnerships, student recruitment
- **Hampton University** - Entrepreneurship programs, alumni network
- **Virginia State University** - Career fairs, talent pipeline
- **HBCU Alumni Association** - Mentorship and networking

## ✊🏾 Cultural Elements

- **Business Types**: Barbershops, soul food restaurants, music studios, fashion/streetwear
- **Historical Landmarks**: Church Street, Attucks Theatre, NSU Campus
- **Cultural Icons**: Pharrell Williams, Missy Elliott, Timbaland inspiration
- **Community Organizations**: Black Chamber of Commerce, Urban League, 100 Black Men

## 🚀 Quick Start

### Prerequisites (Dev)

- Node.js 20.x or higher
- npm 10.x or higher

### Local Development (Detailed)

1. Clone the repository:

   ```bash
   git clone https://github.com/BettaDayz757/BettaDayzPBBG.git
   cd BettaDayzPBBG
   ```

2. Install dependencies:

   ```bash
   npm install --legacy-peer-deps
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Deployment

This application is configured to deploy to **bettadayz.shop** using Hostinger.

### Deployment Guides

- **[Quick Start Guide](./DEPLOYMENT-QUICKSTART.md)** - Fast deployment overview
- **[Hostinger Deployment Guide](./HOSTINGER-DEPLOYMENT-GUIDE.md)** - Comprehensive Hostinger VPS deployment
- **[Cloudflare Pages Guide](./cloudflare-deployment-guide.md)** - Alternative deployment option

### Deployment Options

1. **Hostinger VPS** (Recommended)
   - Full control over server
   - Custom domain: bettadayz.shop
   - Node.js support with PM2 process management
   - [Full Guide →](./HOSTINGER-DEPLOYMENT-GUIDE.md)

2. **Cloudflare Pages** (Alternative)
   - Free tier available
   - Automatic SSL and CDN
   - Easy GitHub integration
   - [Full Guide →](./cloudflare-deployment-guide.md)

## Development

### Prerequisites

- Node.js 20.x
- npm 10.x

### Local Development

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd my-workflow-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## GitHub Actions

This project uses GitHub Actions for CI/CD:

### Continuous Integration

The CI workflow runs on every push and pull request to the `main` branch:

- Lints the code
- Builds the application
- Runs tests (when added)

### GitHub Pages Deployment

The deployment workflow runs on pushes to the `main` branch:

- Builds the application
- Deploys to GitHub Pages

## Available Scripts

- `npm run dev` - Start development server
- `npm run dev:shop` - Start dev server for bettadayz.shop (port 3000)
- `npm run dev:store` - Start dev server for bettadayz.store (port 3001)
- `npm run build` - Build for production
- `npm run build:shop` - Build for bettadayz.shop
- `npm run build:store` - Build for bettadayz.store
- `npm run start` - Run production server
- `npm run lint` - Run ESLint
- `npm run ci` - Run CI checks locally

## 🌐 Dual Domain Deployment

This game supports two domains:

- **bettadayz.shop** - Primary domain
- **bettadayz.store** - Secondary domain

Both domains serve the same game with shared backend and player data. See `DUAL-DOMAIN-DEPLOYMENT.md` for configuration details.

## GitHub Pages Setup

1. In your repository settings, go to Pages
2. Under "Build and deployment":
   - Source: "GitHub Actions"
   - Find the latest deployment in the "Deployments" section

## Contributing

1. Create a new branch from `main`
2. Make your changes
3. Create a pull request
4. Wait for CI checks to pass
5. Request review

## License

MIT

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
