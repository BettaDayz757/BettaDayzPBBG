# Quick Start Guide - BettaDayz PBBG

Get up and running with BettaDayz PBBG in 30 minutes.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] npm 9+ installed
- [ ] Cloudflare account created
- [ ] Supabase account created
- [ ] Domains added to Cloudflare (bettadayz.shop, bettadayz.store)

## Step 1: Clone & Install (5 minutes)

```bash
# Clone repository
git clone https://github.com/BettaDayz757/BettaDayzPBBG.git
cd BettaDayzPBBG

# Install dependencies
npm install --legacy-peer-deps
```

## Step 2: Supabase Setup (10 minutes)

### Create Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in details and create

### Run Database Schema
1. Open SQL Editor in Supabase
2. Copy entire `supabase-schema.sql` file
3. Paste and execute

### Get Credentials
1. Go to Project Settings → API
2. Copy:
   - Project URL
   - anon/public key
   - service_role key

## Step 3: Environment Setup (3 minutes)

Create `.env.local`:

```bash
# Copy template
cp .env.example .env.local

# Edit with your values
nano .env.local
```

Minimum required:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
JWT_SECRET=9=N6H//qQ]?g+BDV
NEXT_PUBLIC_DOMAIN=bettadayz.shop
NODE_ENV=development
```

## Step 4: Test Locally (2 minutes)

```bash
# Start development server
npm run dev

# Open browser
# http://localhost:3000

# Test health endpoint
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "BettaDayz PBBG API",
  "version": "2.0.0",
  "supabase": true
}
```

## Step 5: Cloudflare Worker Setup (10 minutes)

### Install Wrangler
```bash
npm install -g wrangler
```

### Login & Deploy
```bash
# Login to Cloudflare
wrangler login

# Deploy worker
wrangler deploy
```

### Configure Routes
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to Workers & Pages → your worker
3. Add routes:
   - `bettadayz.shop/*`
   - `bettadayz.store/*`

### Update DNS
For both domains, set:
- A record: `@` → 194.195.84.72 (proxied)
- CNAME: `www` → domain.com (proxied)

## Testing Your Setup

### 1. Test Health Endpoint
```bash
curl https://bettadayz.shop/api/health
```

### 2. Test Signup
```bash
curl -X POST https://bettadayz.shop/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser"
  }'
```

### 3. Verify Database
In Supabase Dashboard → Table Editor:
- Check `players` table has new entry
- Verify user in `auth.users`

## Production Deployment

### Build Applications
```bash
# Build for shop
NEXT_PUBLIC_DOMAIN=bettadayz.shop npm run build

# Build for store
NEXT_PUBLIC_DOMAIN=bettadayz.store npm run build
```

### Deploy to Server
```bash
# Create package
tar -czf deployment.tar.gz .next/ package.json

# Upload to server
scp deployment.tar.gz user@194.195.84.72:~/

# On server: Extract and start
ssh user@194.195.84.72
tar -xzf deployment.tar.gz
npm install --production
pm2 start ecosystem.config.js
```

## Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf .next node_modules
npm install --legacy-peer-deps
npm run build
```

### Supabase Connection Error
- Verify URL and keys in `.env.local`
- Check Supabase project is active
- Test: `curl -I https://your-project.supabase.co`

### Worker Not Routing
- Verify routes in Cloudflare Dashboard
- Check DNS (orange cloud enabled)
- Test worker: `curl https://your-worker.workers.dev`

## Next Steps

1. **Read Full Documentation**:
   - [Complete Deployment Guide](./DEPLOYMENT-GUIDE.md)
   - [Cloudflare Setup](./CLOUDFLARE-WORKER-SETUP.md)
   - [Supabase Setup](./SUPABASE-SETUP.md)

2. **Secure Your Application**:
   - Change default JWT secret
   - Set up rate limiting
   - Configure firewall rules

3. **Set Up Monitoring**:
   - Cloudflare Analytics
   - Supabase Dashboard
   - PM2 monitoring

4. **Customize**:
   - Update game content
   - Modify UI/UX
   - Add new features

## Support

- **Documentation**: `docs/` directory
- **Issues**: GitHub Issues
- **Community**: Discord (if available)

## Quick Reference

### Useful Commands
```bash
# Development
npm run dev              # Start dev server
npm run build           # Build production
npm run start           # Start production server

# Testing
curl localhost:3000/api/health

# PM2 Management
pm2 status              # Check status
pm2 logs                # View logs
pm2 restart all         # Restart apps

# Cloudflare
wrangler whoami         # Check auth
wrangler tail           # View worker logs
wrangler deploy         # Deploy worker
```

### Key URLs
- **Local Dev**: http://localhost:3000
- **Shop Domain**: https://bettadayz.shop
- **Store Domain**: https://bettadayz.store
- **Health Check**: /api/health
- **Supabase**: https://supabase.com/dashboard
- **Cloudflare**: https://dash.cloudflare.com

---

**Time to Complete**: ~30 minutes  
**Difficulty**: Intermediate  
**Last Updated**: 2025-10-29
