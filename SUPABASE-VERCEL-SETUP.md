# Supabase and Vercel Environment Setup Guide

This guide provides step-by-step instructions for setting up Supabase and Vercel environment configurations for the BettaDayz PBBG project.

## Overview

Your project uses:
- **Supabase** for backend database and authentication
- **Vercel** for deployment and hosting
- **Dual-domain architecture** (bettadayz.shop for gaming, bettadayz.store for currency store)

## Prerequisites

- Node.js 20+ installed
- npm or yarn package manager
- Supabase account (https://supabase.com)
- Vercel account (https://vercel.com)
- GitHub repository access

## Part 1: Supabase Configuration

### Step 1: Get Your Supabase Credentials

Your project is configured to use the Supabase project:
- **Project URL**: `https://btcfpizydmcdjhltwbil.supabase.co`

To get your API keys:

1. Go to https://supabase.com/dashboard
2. Select your project `btcfpizydmcdjhltwbil` (or create a new one)
3. Navigate to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (should match the one above)
   - **anon/public key** (starts with `eyJhbGc...`)
   - **service_role key** (starts with `eyJhbGc...` - keep this secret!)

### Step 2: Update Local Environment

Update your `.env.local` file with the real Supabase keys:

```bash
# Open .env.local in your editor
nano .env.local  # or use your preferred editor
```

Replace these lines:
```env
NEXT_PUBLIC_SUPABASE_URL=https://btcfpizydmcdjhltwbil.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_real_anon_key_from_supabase_dashboard
SUPABASE_SERVICE_ROLE_KEY=your_real_service_role_key_from_supabase_dashboard
```

### Step 3: Set Up Database Schema

Run the database schema to create all necessary tables:

1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `supabase-schema.sql` from your repository
5. Paste into the SQL editor
6. Click **Run** to execute

This will create:
- Players table with authentication
- Game sessions tracking
- Inventory system
- Transactions and purchases
- BettaBuckz currency system
- Achievements and statistics
- And more...

### Step 4: Configure Row Level Security (RLS)

The schema includes RLS policies. Verify they're active:

1. In Supabase Dashboard, go to **Authentication** → **Policies**
2. Ensure policies are enabled for:
   - `players` table
   - `game_sessions` table
   - `inventory` table
   - `transactions` table

### Step 5: Test Supabase Connection

Run the setup script to verify configuration:

```bash
./setup-supabase.sh
```

Or test manually:
```bash
# Test connection
curl -H "apikey: YOUR_ANON_KEY" \
  https://btcfpizydmcdjhltwbil.supabase.co/rest/v1/
```

## Part 2: Vercel Configuration

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Log In to Vercel

```bash
vercel login
```

### Step 3: Link Projects

You need to create/link three Vercel projects:
1. `bestdayz` - Main deployment
2. `bestdayz1` - Alternate deployment
3. `bettaday` - Development/staging

For each project:

```bash
# Navigate to your project directory
cd /path/to/BettaDayzPBBG

# Link to Vercel (do this 3 times for 3 different project names)
vercel link
```

When prompted:
- Select your Vercel scope/team
- Enter project name (bestdayz, bestdayz1, or bettaday)
- Follow the prompts

### Step 4: Get Vercel Project IDs

After linking, get your project IDs:

```bash
# For each project
vercel project ls
```

Or find them in:
- Vercel Dashboard → Select Project → Settings → General
- Look for "Project ID"

Update `.env.local` with the IDs:
```env
VERCEL_ORG_ID=your_vercel_team_or_user_id
VERCEL_PROJECT_ID_BESTDAYZ=prj_xxxxxxxxxxxxxxxxxxxxxxxxx
VERCEL_PROJECT_ID_BESTDAYZ1=prj_xxxxxxxxxxxxxxxxxxxxxxxxx
VERCEL_PROJECT_ID_BETTADAY=prj_xxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 5: Get Vercel API Token

1. Go to https://vercel.com/account/tokens
2. Click **Create Token**
3. Name it "BettaDayz PBBG Deployment"
4. Set scope to your team/account
5. Copy the token

Add to `.env.local`:
```env
VERCEL_TOKEN=your_vercel_token_here
```

### Step 6: Configure Environment Variables on Vercel

Run the automated setup script:

```bash
./setup-vercel-env.sh
```

This will:
- Load variables from `.env.local`
- Push them to all 3 Vercel projects
- Configure for production, preview, and development environments

Or configure manually in Vercel Dashboard:
1. Go to Project → Settings → Environment Variables
2. Add these variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - All payment and service configurations

### Step 7: Set Up Custom Domains

For each Vercel project:

1. Go to Project → Settings → Domains
2. Add custom domain:
   - **bestdayz**: `bettadayz.shop` and `www.bettadayz.shop`
   - **bestdayz1**: `bettadayz.store` (or alternative subdomain)
   - **bettaday**: `dev.bettadayz.shop` (or similar for staging)

3. Configure DNS records as provided by Vercel

## Part 3: Security Configuration

### Step 1: Generate Secure Secrets

Generate secure JWT and NextAuth secrets:

```bash
# Generate JWT secret
openssl rand -base64 32

# Generate NextAuth secret
openssl rand -base64 32
```

Add to `.env.local` and Vercel:
```env
JWT_SECRET=your_generated_jwt_secret_here
NEXTAUTH_SECRET=your_generated_nextauth_secret_here
```

### Step 2: Configure NextAuth URL

Update based on your deployment:

```env
# For production
NEXTAUTH_URL=https://bettadayz.shop

# For development
NEXTAUTH_URL=http://localhost:3000
```

### Step 3: Run Security Validation

```bash
./security-validation.sh
```

This checks for:
- Exposed secrets
- Insecure configurations
- Missing environment variables
- Security best practices

## Part 4: Testing and Validation

### Step 1: Test Locally

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start development server
npm run dev
```

Visit `http://localhost:3000` and test:
- [ ] Homepage loads
- [ ] User registration works
- [ ] User login works
- [ ] Game features are accessible
- [ ] No console errors

### Step 2: Deploy to Vercel

```bash
# Deploy to production
vercel --prod

# Or deploy all projects
npm run deploy:vercel
```

### Step 3: Run Deployment Health Check

```bash
./check-deployment.sh
```

This validates:
- Deployment status
- Environment variables
- Database connectivity
- API endpoints
- Domain configuration
- SSL certificates

## Part 5: Production Environment

### Update Production Configuration

For production deployment, create/update `.env.production`:

```env
NODE_ENV=production
NEXT_PUBLIC_DOMAIN=bettadayz.shop
NEXT_PUBLIC_STORE_DOMAIN=bettadayz.store
NEXT_PUBLIC_SITE_TYPE=pbbg

# Supabase (same as development but ensure using production keys)
NEXT_PUBLIC_SUPABASE_URL=https://btcfpizydmcdjhltwbil.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# Security
JWT_SECRET=your_secure_production_jwt_secret
NEXTAUTH_SECRET=your_secure_production_nextauth_secret
NEXTAUTH_URL=https://bettadayz.shop

# Payment Configuration (use production/live keys)
CASHAPP_API_KEY=your_live_cashapp_api_key
CASHAPP_CLIENT_ID=your_live_cashapp_client_id
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
BITCOIN_WALLET_ADDRESS=your_mainnet_bitcoin_address
BITCOIN_NETWORK=mainnet
```

## Troubleshooting

### Supabase Connection Issues

**Problem**: Cannot connect to Supabase
**Solutions**:
- Verify API keys are correct
- Check project URL matches dashboard
- Ensure anon key is not the service role key
- Check network/firewall settings
- Verify Supabase project is active

### Vercel Deployment Fails

**Problem**: Deployment fails during build
**Solutions**:
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure Node.js version matches (20.x)
- Check for missing dependencies
- Run `npm run build` locally first

### Environment Variables Not Loading

**Problem**: Variables showing as undefined
**Solutions**:
- Verify `NEXT_PUBLIC_` prefix for client-side vars
- Check variable names match exactly (case-sensitive)
- Restart development server after changing .env
- Clear Next.js cache: `rm -rf .next`
- Redeploy to Vercel after updating env vars

### Database Schema Errors

**Problem**: SQL schema fails to execute
**Solutions**:
- Run each section separately
- Check for existing tables (may need to drop first)
- Verify extensions are enabled
- Check Supabase project permissions
- Review error messages in SQL editor

## Automated Setup Scripts

The repository includes helper scripts:

### `setup-supabase.sh`
Interactively configures Supabase:
- Prompts for credentials
- Updates .env.local
- Tests connection
- Optionally runs schema

Usage:
```bash
chmod +x setup-supabase.sh
./setup-supabase.sh
```

### `setup-vercel-env.sh`
Configures Vercel environments:
- Loads from .env.local
- Pushes to all projects
- Sets production/preview/dev environments

Usage:
```bash
chmod +x setup-vercel-env.sh
./setup-vercel-env.sh
```

### `check-deployment.sh`
Validates deployment health:
- Checks environment variables
- Tests API endpoints
- Verifies database connection
- Validates SSL/domains

Usage:
```bash
chmod +x check-deployment.sh
./check-deployment.sh
```

### `security-validation.sh`
Security checks:
- Scans for exposed secrets
- Validates configurations
- Checks dependencies
- Audits security practices

Usage:
```bash
chmod +x security-validation.sh
./security-validation.sh
```

## Complete Setup Checklist

Use this checklist to ensure everything is configured:

### Supabase Setup
- [ ] Created Supabase account
- [ ] Created/accessed project `btcfpizydmcdjhltwbil`
- [ ] Copied anon key from dashboard
- [ ] Copied service role key from dashboard
- [ ] Updated .env.local with real keys
- [ ] Ran supabase-schema.sql in SQL Editor
- [ ] Verified RLS policies are active
- [ ] Tested connection with curl or script

### Vercel Setup
- [ ] Installed Vercel CLI
- [ ] Logged into Vercel account
- [ ] Created/linked 3 projects (bestdayz, bestdayz1, bettaday)
- [ ] Obtained all project IDs
- [ ] Generated API token
- [ ] Updated .env.local with Vercel credentials
- [ ] Ran setup-vercel-env.sh or manually configured
- [ ] Added custom domains to projects
- [ ] Configured DNS records

### Security
- [ ] Generated secure JWT secret
- [ ] Generated secure NextAuth secret
- [ ] Updated all production secrets
- [ ] Ran security-validation.sh
- [ ] Verified no secrets in Git history
- [ ] Configured proper RLS policies

### Testing
- [ ] Built project locally (npm run build)
- [ ] Tested locally (npm run dev)
- [ ] Deployed to Vercel
- [ ] Ran check-deployment.sh
- [ ] Tested production deployment
- [ ] Verified all features work
- [ ] Checked SSL certificates
- [ ] Tested both domains

## Next Steps

After completing this setup:

1. **Configure Payment Providers**
   - Set up Stripe account and keys
   - Configure Cash App integration
   - Set up Bitcoin wallet

2. **Set Up Monitoring**
   - Run `./setup-monitoring.sh`
   - Configure uptime monitoring
   - Set up error tracking

3. **Complete Domain Setup**
   - Configure DNS for both domains
   - Set up SSL certificates
   - Test cross-domain functionality

4. **Deploy to Production**
   - Follow HOSTINGER-DEPLOYMENT-GUIDE.md for VPS
   - Or use Vercel for serverless deployment

## Support and Resources

- **Supabase Documentation**: https://supabase.com/docs
- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Repository Issues**: https://github.com/BettaDayz757/BettaDayzPBBG/issues

## Important Notes

⚠️ **Never commit real secrets to Git**
- Keep .env.local in .gitignore
- Use environment variables for sensitive data
- Rotate keys if accidentally exposed

🔒 **Security Best Practices**
- Use different keys for development and production
- Regularly rotate API keys and secrets
- Enable 2FA on all service accounts
- Monitor for suspicious activity

📝 **Documentation**
- Keep this guide updated as you make changes
- Document any custom configurations
- Share knowledge with team members

---

**Setup Complete!** 🎉

Your BettaDayz PBBG is now configured with Supabase and Vercel!

For deployment to production, see:
- HOSTINGER-DEPLOYMENT-GUIDE.md
- DEPLOYMENT-QUICKSTART.md
- cloudflare-deployment-guide.md
