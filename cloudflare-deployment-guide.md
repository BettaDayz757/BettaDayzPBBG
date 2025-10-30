# Cloudflare Pages Deployment Guide for BettaDayz PBBG

## Prerequisites
- Cloudflare account (Account ID: 9b9fcaead55610e5dd235878e702ee69)
- Domains `bettadayz.shop` (Zone ID: a86f94f72b26e7f33fdd3f4b5ccd4b6a) and `bettadayz.store` added to Cloudflare
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
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next` (for full Next.js deployment)
   - **Root directory**: `/` (leave empty if repository root)

## Step 2: Environment Variables

In the Cloudflare Pages dashboard, go to your project settings and add these environment variables:

### Required Variables
```
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=9=N6H//qQ]?g+BDV
```

### Domain Variables
```
NEXT_PUBLIC_PRIMARY_DOMAIN=https://bettadayz.shop
NEXT_PUBLIC_SECONDARY_DOMAIN=https://bettadayz.store
NEXT_PUBLIC_SITE_URL=https://bettadayz.shop
NEXT_PUBLIC_ALT_SITE_URL=https://bettadayz.store
```

## Step 3: Custom Domain Setup

1. **In Cloudflare Pages Dashboard**
   - Go to your project
   - Click on "Custom domains" tab
   - Click "Set up a custom domain"
   - Enter `bettadayz.shop`
   - Follow the verification process
   - Repeat for `bettadayz.store`

2. **DNS Configuration**
   - In Cloudflare DNS settings for `bettadayz.shop` (Zone ID: a86f94f72b26e7f33fdd3f4b5ccd4b6a)
   - Ensure you have:
     - `CNAME` record: `bettadayz` pointing to `bettadayzpbbg.pages.dev`
   - Repeat for `bettadayz.store` with its Zone ID

## Step 4: SSL/TLS Configuration

1. **In Cloudflare Dashboard**
   - Go to SSL/TLS → Overview
   - Set encryption mode to "Full (strict)"
   - Enable "Always Use HTTPS"

2. **Edge Certificates**
   - Go to SSL/TLS → Edge Certificates
   - Enable "Always Use HTTPS"
   - Enable "HTTP Strict Transport Security (HSTS)"

## Step 5: Functions Configuration

Since this is a Next.js app with API routes, Cloudflare Pages will automatically handle the functions. No additional configuration needed.

## Step 6: Deploy

1. **Trigger Deployment**
   - Push changes to your main branch
   - Cloudflare Pages will automatically build and deploy
   - Monitor the build logs in the Pages dashboard

2. **Verify Deployment**
   - Visit `https://bettadayz.shop`
   - Visit `https://bettadayz.store`
   - Check that all features work correctly
   - Test the game functionality, chat, PvP, admin dashboard

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Cloudflare Pages dashboard
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility (20.x)

2. **API Route Issues**
   - Next.js API routes are handled as Cloudflare Functions
   - Check function logs in the Pages dashboard

3. **Environment Variables**
   - Ensure all required environment variables are set
   - Check variable names for typos

### Build Commands Reference

- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Start**: `npm run start`

## Files Created for Cloudflare Deployment

- `wrangler.toml` - Cloudflare configuration
- `next.config.ts` - Next.js configuration with headers and redirects
- `.env.production` - Production environment variables

## Support

If you encounter issues:
1. Check Cloudflare Pages documentation for Next.js
2. Review build logs in the dashboard
3. Test locally with `npm run build && npm run start`
4. Check the Cloudflare Community forum

## Next Steps

After successful deployment:
1. Set up monitoring and analytics
2. Configure additional security rules
3. Monitor performance metrics
4. Test real-time features (chat, PvP)