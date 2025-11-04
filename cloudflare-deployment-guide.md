# Cloudflare Pages Deployment Guide for BettaDayz.shop

## Prerequisites

- Cloudflare account
- Domain `bettadayz.shop` added to Cloudflare
- GitHub repository with your code

## Step 1: Connect Your Repository to Cloudflare Pages

1. **Login to Cloudflare Dashboard**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to "Pages" in the left sidebar

2. **Create a New Project**
   - Click "Create a project"
   - Choose "Connect to Git"
   - Select your GitHub repository containing this code

3. **Configure Build Settings**
   - **Framework preset**: Remix
   - **Build command**: `npm run build`
   - **Build output directory**: `build/client`
   - **Root directory**: `/` (leave empty if repository root)

## Step 2: Environment Variables

In the Cloudflare Pages dashboard, go to your project settings and add these environment variables:

### Required Variables

```
NODE_ENV=production
SITE_URL=https://bettadayz.shop
```

### Optional Variables (add as needed)

```
DATABASE_URL=your_database_url_here
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
SESSION_SECRET=your_session_secret_here
```

## Step 3: Custom Domain Setup

1. **In Cloudflare Pages Dashboard**
   - Go to your project
   - Click on "Custom domains" tab
   - Click "Set up a custom domain"
   - Enter `bettadayz.shop`
   - Follow the verification process

2. **DNS Configuration**
   - In Cloudflare DNS settings for `bettadayz.shop`
   - Ensure you have:
     - `A` record: `@` pointing to your Pages project
     - `CNAME` record: `www` pointing to `bettadayz.shop`

## Step 4: SSL/TLS Configuration

1. **In Cloudflare Dashboard**
   - Go to SSL/TLS → Overview
   - Set encryption mode to "Full (strict)"
   - Enable "Always Use HTTPS"

2. **Edge Certificates**
   - Go to SSL/TLS → Edge Certificates
   - Enable "Always Use HTTPS"
   - Enable "HTTP Strict Transport Security (HSTS)"

## Step 5: Performance Optimization

1. **Caching Rules**
   - Go to Caching → Configuration
   - Set Browser Cache TTL to "Respect Existing Headers"

2. **Speed Optimization**
   - Go to Speed → Optimization
   - Enable "Auto Minify" for HTML, CSS, and JavaScript
   - Enable "Brotli" compression

## Step 6: Security Settings

1. **Firewall Rules**
   - Go to Security → WAF
   - Enable "OWASP Core Ruleset"

2. **Bot Fight Mode**
   - Go to Security → Bots
   - Enable "Bot Fight Mode"

## Step 7: Deploy

1. **Trigger Deployment**
   - Push changes to your main branch
   - Cloudflare Pages will automatically build and deploy
   - Monitor the build logs in the Pages dashboard

2. **Verify Deployment**
   - Visit `https://bettadayz.shop`
   - Check that all features work correctly
   - Test the game functionality

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Cloudflare Pages dashboard
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **404 Errors**
   - Check that `_redirects` file is in the `public` folder
   - Verify SPA routing configuration

3. **Environment Variables**
   - Ensure all required environment variables are set
   - Check variable names for typos

### Build Commands Reference

- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Deploy**: `npm run deploy` (uses wrangler)
- **Preview**: `npm run preview`

## Files Created for Cloudflare Deployment

- `wrangler.toml` - Cloudflare configuration
- `public/_headers` - HTTP headers configuration
- `public/_redirects` - URL redirects and SPA routing
- `functions/[[path]].js` - Cloudflare Functions for SSR
- `.env.production` - Production environment variables

## Support

If you encounter issues:

1. Check Cloudflare Pages documentation
2. Review build logs in the dashboard
3. Test locally with `npm run build && npm run preview`
4. Check the Cloudflare Community forum

## Next Steps

After successful deployment:

1. Set up monitoring and analytics
2. Configure additional security rules
3. Set up automated backups
4. Monitor performance metrics
