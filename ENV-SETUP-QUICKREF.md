# Environment Setup Quick Reference

Quick reference guide for setting up Supabase and Vercel environment configurations.

## 🚀 Quick Start (One Command)

```bash
# Run the automated setup wizard
npm run setup
# or
./quick-setup.sh
```

This interactive script will guide you through:
- Creating `.env.local` from template
- Setting up Supabase configuration
- Setting up Vercel deployment
- Running security validation
- Testing your build

## 📋 Manual Setup Steps

### 1. Create Environment File

```bash
cp .env.example .env.local
```

### 2. Configure Supabase

Your Supabase project: **btcfpizydmcdjhltwbil**

Get your credentials from: https://supabase.com/dashboard/project/btcfpizydmcdjhltwbil/settings/api

Update in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://btcfpizydmcdjhltwbil.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_real_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_real_service_role_key_here
```

#### Run Database Schema

1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `supabase-schema.sql`
3. Execute the query

### 3. Generate Security Secrets

```bash
# Generate JWT secret
openssl rand -base64 32

# Generate NextAuth secret
openssl rand -base64 32
```

Add to `.env.local`:
```env
JWT_SECRET=<generated_jwt_secret>
NEXTAUTH_SECRET=<generated_nextauth_secret>
```

### 4. Configure Vercel (if deploying to Vercel)

Get your Vercel token: https://vercel.com/account/tokens

Create 3 projects in Vercel dashboard:
- `bestdayz` (main production)
- `bestdayz1` (alternate/staging)
- `bettaday` (development)

Update `.env.local`:
```env
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID_BESTDAYZ=project_id_1
VERCEL_PROJECT_ID_BESTDAYZ1=project_id_2
VERCEL_PROJECT_ID_BETTADAY=project_id_3
```

## 🧪 Test Your Configuration

### Test Supabase Connection

```bash
npm run test:supabase
```

This will:
- ✅ Verify environment variables are set
- ✅ Check if keys are real (not placeholders)
- ✅ Test connection to Supabase
- ✅ Verify database tables exist

### Build Test

```bash
npm run build
```

### Security Validation

```bash
./security-validation.sh
```

## 📖 Detailed Documentation

For complete step-by-step instructions, see:
- **[SUPABASE-VERCEL-SETUP.md](./SUPABASE-VERCEL-SETUP.md)** - Complete setup guide
- **[README_new.md](./README_new.md)** - Project documentation
- **[DEPLOYMENT-QUICKSTART.md](./DEPLOYMENT-QUICKSTART.md)** - Deployment guide

## 🔧 Automated Setup Scripts

### Interactive Supabase Setup

```bash
./setup-supabase.sh
```

Features:
- Prompts for Supabase credentials
- Updates `.env.local` automatically
- Tests connection
- Offers to run database schema

### Interactive Vercel Setup

```bash
./setup-vercel-env.sh
```

Features:
- Loads variables from `.env.local`
- Pushes to all 3 Vercel projects
- Configures production/preview/dev environments
- Lists configured variables

### Deployment Health Check

```bash
./check-deployment.sh
```

Validates:
- Environment variables
- API endpoints
- Database connectivity
- SSL/domains

## 📝 Required Environment Variables

### Essential (Required)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Security
JWT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Domain
NEXT_PUBLIC_DOMAIN=
NEXT_PUBLIC_STORE_DOMAIN=
```

### Optional (Recommended)
```env
# Vercel (if deploying to Vercel)
VERCEL_TOKEN=
VERCEL_ORG_ID=
VERCEL_PROJECT_ID_BESTDAYZ=
VERCEL_PROJECT_ID_BESTDAYZ1=
VERCEL_PROJECT_ID_BETTADAY=

# Payment Providers
CASHAPP_API_KEY=
CASHAPP_CLIENT_ID=
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
BITCOIN_WALLET_ADDRESS=

# External Services
SENDGRID_API_KEY=
GOOGLE_ANALYTICS_ID=
REDIS_URL=
```

## ⚠️ Important Security Notes

### Never Commit Secrets
```bash
# .env.local is already in .gitignore
# Never commit files containing real API keys
```

### Use Different Keys
- Development: Use test/sandbox keys
- Production: Use live/production keys

### Rotate Keys Regularly
If a key is exposed:
1. Immediately revoke it in the service dashboard
2. Generate a new key
3. Update all environments
4. Clear git history if committed (contact support)

## 🆘 Troubleshooting

### "Cannot find Supabase credentials"
```bash
# Check if .env.local exists
ls -la .env.local

# If not, create it
cp .env.example .env.local
```

### "Placeholder keys detected"
- Go to Supabase dashboard and copy real keys
- Replace placeholder values in `.env.local`
- Run `npm run test:supabase` to verify

### "Build fails"
```bash
# Clear cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

### "Vercel deployment fails"
- Check all environment variables are set in Vercel dashboard
- Verify project IDs are correct
- Check build logs in Vercel dashboard
- Ensure Node.js version matches (20.x)

## 🎯 Common Tasks

### Start Development
```bash
npm install
npm run dev
```

### Deploy to Vercel
```bash
npm run deploy:vercel
```

### Update Environment Variables
```bash
# 1. Update .env.local
nano .env.local

# 2. Push to Vercel (if needed)
./setup-vercel-env.sh

# 3. Restart development server
# Press Ctrl+C then run: npm run dev
```

### Check Configuration Status
```bash
# Test Supabase
npm run test:supabase

# Validate security
./security-validation.sh

# Check deployment
./check-deployment.sh
```

## 📞 Support

- **Setup Issues**: See [SUPABASE-VERCEL-SETUP.md](./SUPABASE-VERCEL-SETUP.md)
- **Supabase Help**: https://supabase.com/docs
- **Vercel Help**: https://vercel.com/docs
- **Repository Issues**: https://github.com/BettaDayz757/BettaDayzPBBG/issues

## ✅ Setup Checklist

Use this to track your progress:

- [ ] Copied `.env.example` to `.env.local`
- [ ] Added Supabase URL
- [ ] Added Supabase anon key
- [ ] Added Supabase service role key
- [ ] Generated JWT secret
- [ ] Generated NextAuth secret
- [ ] Ran `supabase-schema.sql` in Supabase dashboard
- [ ] Tested with `npm run test:supabase`
- [ ] Built successfully with `npm run build`
- [ ] Configured Vercel projects (if deploying to Vercel)
- [ ] Pushed env vars to Vercel (if deploying to Vercel)
- [ ] Ran security validation
- [ ] Started dev server successfully

Once all checked, you're ready to develop! 🎉

---

**Quick Commands Summary**

```bash
# Full automated setup
npm run setup

# Test Supabase
npm run test:supabase

# Start development
npm run dev

# Build for production
npm run build

# Deploy to Vercel
npm run deploy:vercel

# Security check
./security-validation.sh
```
