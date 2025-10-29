# BettaDayz PBBG

A Remix-based Persistent Browser-Based Game (PBBG) application with multiplayer features, game mechanics, and social interactions.

**Live Site:** [https://bettadayz.shop](https://bettadayz.shop)

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
   npm install
   ```

3. Set up Supabase (optional):

   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Login to Supabase
   supabase login
   
   # Download seed data
   npm run supabase:download-snippets
   ```

   See [supabase/README.md](./supabase/README.md) for detailed Supabase setup instructions.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

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

## 🗄️ Database Setup

This project uses Supabase for backend services. To set up the database:

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key to `.env.local`
4. Download seed data:
   ```bash
   npm run supabase:download-snippets
   ```

For detailed instructions, see [supabase/README.md](./supabase/README.md).

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
- `npm run build` - Build for production
- `npm run start` - Run production server
- `npm run lint` - Run ESLint
- `npm run ci` - Run CI checks locally
- `npm run deploy:gh-pages` - Build for GitHub Pages
- `npm run supabase:download-snippets` - Download Supabase seed data

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
