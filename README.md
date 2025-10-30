# BettaDayz PBBG - Norfolk Business Empire

A Next.js-based Persistent Browser-Based Game (PBBG) celebrating African American and minority culture in Norfolk, VA. Build your business empire, create your legacy, and experience life simulation inspired by IMVU, BitLife, and Torn.com.

**Live Sites:**

- [https://bettadayz.shop](https://bettadayz.shop)
- [https://bettadayz.store](https://bettadayz.store)
- [Vercel Deployment](https://bettaday-klg30l6a4-betta-day-z.vercel.app)

## 🎮 Game Features

### Inspired By

- **IMVU**: Social networking, avatar chat, social rooms, customization ([Social Lounge](/app/social/page.tsx))
- **BitLife**: Life simulation, aging system, major life decisions ([Life Simulator](/app/life/page.tsx))
- **Torn.com**: Competitive gameplay, leaderboards, PvP, resource battles ([Competitive Arena](/app/competitive/page.tsx))

### Core Gameplay

- 🏢 **Build Business Empire** in authentic Norfolk, VA locations ([Norfolk Locations](/app/norfolk/page.tsx))
- 🎓 **HBCU Integration** with Norfolk State, Hampton, Virginia State ([HBCU Connections](/app/hbcu/page.tsx))
- ✊🏾 **Cultural Heritage** celebrating African American excellence ([Culture](/app/culture/page.tsx))
- 👤 **Life Simulation** from age 18 to 85 with meaningful choices ([Life Simulator](/app/life/page.tsx))
- 🤝 **Social Network** with crews, mentorship, and community impact ([Social Lounge](/app/social/page.tsx))
- 🏆 **Competitive Play** with leaderboards, PvP, and resource battles ([Competitive Arena](/app/competitive/page.tsx))

## 🌍 Norfolk, VA Locations ([Norfolk Page](/app/norfolk/page.tsx))

- **Downtown Norfolk**: Historic Black Wall Street revival area
- **Norfolk State District**: Premier HBCU campus and innovation hub
- **Berkley**: Historic African American neighborhood renaissance
- **Ocean View**: Beach community with rich cultural heritage
- **Military Circle**: Near Naval Station Norfolk
- **Ghent**: Arts and culture district
- **Park Place**: Family business community
- **Churchland**: Spiritual and community center

## 🎓 HBCU Connections ([HBCU Page](/app/hbcu/page.tsx))

- **Norfolk State University** - Business partnerships, student recruitment
- **Hampton University** - Entrepreneurship programs, alumni network
- **Virginia State University** - Career fairs, talent pipeline
- **HBCU Alumni Association** - Mentorship and networking

## ✊🏾 Cultural Elements ([Culture Page](/app/culture/page.tsx))

- **Business Types**: Barbershops, soul food restaurants, music studios, fashion/streetwear
- **Historical Landmarks**: Church Street, Attucks Theatre, NSU Campus
- **Cultural Icons**: Pharrell Williams, Missy Elliott, Timbaland inspiration
- **Community Organizations**: Black Chamber of Commerce, Urban League, 100 Black Men

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Local Development

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

## 📦 Deployment Options

This application is deployed to **bettadayz.shop** using Vercel with Supabase backend integration.

### Deployment Guides

- **[Quick Start Guide](./DEPLOYMENT-QUICKSTART.md)** - Fast deployment overview
- **[Hostinger Deployment Guide](./HOSTINGER-DEPLOYMENT-GUIDE.md)** - Comprehensive Hostinger VPS deployment
- **[Cloudflare Pages Guide](./cloudflare-deployment-guide.md)** - Alternative deployment option

### Platform Options

1. **Vercel** (Current)
   - Active deployment for bettadayz.shop
   - Automatic scaling and global CDN
   - Integrated with Supabase backend
   - Real-time features enabled

2. **Hostinger VPS** (Alternative)
   - Full control over server
   - Custom domain support
   - Node.js support with PM2 process management
   - [Full Guide →](./HOSTINGER-DEPLOYMENT-GUIDE.md)

3. **Cloudflare Pages** (Alternative)
   - Free tier available
   - Automatic SSL and CDN
   - Easy GitHub integration
   - [Full Guide →](./cloudflare-deployment-guide.md)

## 🔧 Development Environment

### System Requirements

- Node.js 20.x
- npm 10.x

### Setup Instructions

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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
