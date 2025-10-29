# BettaDayz PBBG Complete Deployment Guide

This is the master deployment guide for the BettaDayz PBBG (Persistent Browser-Based Game) dual-domain system. Follow this guide to deploy the complete application with Cloudflare Worker routing and Supabase database integration.

## Overview

**System Architecture:**
- **Frontend**: Next.js 16 with React 19
- **Routing**: Cloudflare Worker for domain-based routing
- **Database**: Supabase (PostgreSQL with real-time)
- **Domains**: bettadayz.shop (port 3000) and bettadayz.store (port 3001)
- **Server**: 194.195.84.72

## Quick Start Checklist

- [ ] Prerequisites installed
- [ ] Repository cloned and dependencies installed
- [ ] Environment variables configured
- [ ] Supabase project created and schema deployed
- [ ] Cloudflare Worker deployed
- [ ] Domain routing configured
- [ ] Application built and deployed
- [ ] Testing completed
- [ ] Monitoring set up

## Prerequisites

### Required Software
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Git
- Wrangler CLI: `npm install -g wrangler`

### Required Accounts
- Cloudflare account with domains added
- Supabase account
- GitHub account (for repository access)

### Server Requirements
- VPS server at 194.195.84.72
- Ports 3000 and 3001 accessible
- Node.js and PM2 installed
- SSL certificates configured

## Step 1: Initial Setup

### 1.1 Clone Repository

```bash
git clone https://github.com/BettaDayz757/BettaDayzPBBG.git
cd BettaDayzPBBG
```

### 1.2 Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 1.3 Configure Environment Variables

Create `.env.local` from template:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Configuration
JWT_SECRET=9=N6H//qQ]?g+BDV

# Domain Configuration
NEXT_PUBLIC_DOMAIN=bettadayz.shop

# Node Environment
NODE_ENV=production
```

### 1.4 Create Production Environment Files

**For Shop Domain (.env.production.shop):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=9=N6H//qQ]?g+BDV
NEXT_PUBLIC_DOMAIN=bettadayz.shop
NODE_ENV=production
```

**For Store Domain (.env.production.store):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=9=N6H//qQ]?g+BDV
NEXT_PUBLIC_DOMAIN=bettadayz.store
NODE_ENV=production
```

## Step 2: Supabase Setup

Follow the detailed guide: [SUPABASE-SETUP.md](./SUPABASE-SETUP.md)

### Quick Steps:

1. **Create Supabase Project**
2. **Get API Credentials**
3. **Run Database Schema**:
   - Open SQL Editor in Supabase Dashboard
   - Copy contents of `supabase-schema.sql`
   - Execute the SQL
4. **Configure Authentication**
5. **Enable Real-time**
6. **Test Database Functions**

Verification:
```bash
curl https://your-project.supabase.co/rest/v1/
```

## Step 3: Cloudflare Worker Setup

Follow the detailed guide: [CLOUDFLARE-WORKER-SETUP.md](./CLOUDFLARE-WORKER-SETUP.md)

### Quick Steps:

1. **Configure wrangler.toml**:
   - Update SERVER_IP if needed
   - Set JWT_SECRET
   - Configure ports

2. **Deploy Worker**:
   ```bash
   wrangler login
   wrangler deploy
   ```

3. **Configure Routes**:
   - Add route: `bettadayz.shop/*`
   - Add route: `bettadayz.store/*`

4. **Update DNS**:
   - Set A records to proxy through Cloudflare
   - Enable orange cloud (proxy)

Verification:
```bash
curl https://bettadayz-pbbg.workers.dev
```

## Step 4: Build Application

### 4.1 Build for Shop Domain

```bash
# Set environment
export NEXT_PUBLIC_DOMAIN=bettadayz.shop

# Build
npm run build:shop
```

### 4.2 Build for Store Domain

```bash
# Set environment
export NEXT_PUBLIC_DOMAIN=bettadayz.store

# Build
npm run build:store
```

### 4.3 Test Build Locally

```bash
# Test shop
npm run start

# In another terminal, test store
PORT=3001 npm run start
```

## Step 5: Server Deployment

### 5.1 Upload to Server

```bash
# Create deployment package
tar -czf deployment.tar.gz \
  .next/ \
  package.json \
  package-lock.json \
  .env.production.shop \
  .env.production.store \
  public/

# Upload to server
scp deployment.tar.gz user@194.195.84.72:~/
```

### 5.2 Extract on Server

```bash
ssh user@194.195.84.72

# Extract files
cd ~/
tar -xzf deployment.tar.gz
cd BettaDayzPBBG

# Install dependencies
npm install --production --legacy-peer-deps
```

### 5.3 Configure PM2

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'bettadayz-shop',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/path/to/BettaDayzPBBG',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_DOMAIN: 'bettadayz.shop'
      },
      env_file: '.env.production.shop',
      instances: 2,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'bettadayz-store',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/path/to/BettaDayzPBBG',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        NEXT_PUBLIC_DOMAIN: 'bettadayz.store'
      },
      env_file: '.env.production.store',
      instances: 2,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G'
    }
  ]
}
```

### 5.4 Start Applications

```bash
# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
```

### 5.5 Verify Applications Running

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs

# Test locally
curl http://localhost:3000/api/health
curl http://localhost:3001/api/health
```

## Step 6: Testing

### 6.1 Health Checks

```bash
# Test shop domain
curl https://bettadayz.shop/api/health

# Test store domain
curl https://bettadayz.store/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-29T...",
  "service": "BettaDayz PBBG API",
  "version": "2.0.0",
  "supabase": true,
  "domain": "shop"
}
```

### 6.2 Test Authentication

```bash
# Sign up
curl -X POST https://bettadayz.shop/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser"
  }'

# Sign in
curl -X POST https://bettadayz.shop/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 6.3 Test Database Integration

In Supabase Dashboard → SQL Editor:

```sql
-- Verify player was created
SELECT * FROM players LIMIT 5;

-- Check game sessions
SELECT * FROM game_sessions WHERE is_active = true;

-- View recent activities
SELECT * FROM game_activities 
ORDER BY created_at DESC 
LIMIT 10;
```

### 6.4 Test Domain Routing

```bash
# Shop domain should route to port 3000
curl -v https://bettadayz.shop 2>&1 | grep "X-BettaDayz-Worker"

# Store domain should route to port 3001
curl -v https://bettadayz.store 2>&1 | grep "X-BettaDayz-Worker"
```

## Step 7: Monitoring Setup

### 7.1 Cloudflare Analytics

1. Go to Cloudflare Dashboard → Workers & Pages
2. Select your worker
3. View Analytics tab for:
   - Request rate
   - Error rate
   - CPU usage
   - Duration

### 7.2 Supabase Monitoring

1. Go to Supabase Dashboard → Database
2. View Logs tab
3. Monitor:
   - Query performance
   - Connection pool
   - Database size

### 7.3 Server Monitoring

```bash
# PM2 monitoring
pm2 monit

# System resources
htop

# Disk usage
df -h

# Memory usage
free -h
```

### 7.4 Set Up Alerts

**Cloudflare:**
- Go to Notifications → Add notification
- Configure alerts for worker errors

**Supabase:**
- Go to Settings → Alerts
- Configure database alerts

**Server:**
- Set up monitoring with tools like:
  - New Relic
  - DataDog
  - PM2 Plus

## Step 8: SSL/TLS Configuration

SSL is handled by Cloudflare:

1. Go to SSL/TLS → Overview
2. Set encryption mode: **Full (strict)**
3. Enable: **Always Use HTTPS**
4. Enable: **HTTP Strict Transport Security (HSTS)**

## Step 9: Performance Optimization

### 9.1 Cloudflare Optimization

1. **Enable Caching**:
   - Go to Caching → Configuration
   - Set Browser Cache TTL
   - Configure Cache Rules

2. **Enable Compression**:
   - Go to Speed → Optimization
   - Enable Brotli
   - Enable Auto Minify

3. **Enable Argo** (optional):
   - Go to Traffic → Argo
   - Enable Smart Routing

### 9.2 Application Optimization

1. **Next.js Configuration**:
   ```javascript
   // next.config.js
   module.exports = {
     compress: true,
     poweredByHeader: false,
     generateEtags: true,
     // Add more optimizations
   }
   ```

2. **Database Optimization**:
   - Add indexes for frequent queries
   - Use connection pooling
   - Enable query caching

## Step 10: Backup Strategy

### 10.1 Database Backups

- **Automatic**: Supabase Pro includes daily backups
- **Manual**: Export using Supabase CLI or Dashboard

### 10.2 Code Backups

```bash
# Git repository (primary backup)
git push origin main

# Create tagged release
git tag -a v2.0.0 -m "Production release"
git push origin v2.0.0
```

### 10.3 Configuration Backups

```bash
# Backup environment files (encrypted)
tar -czf configs-backup.tar.gz .env.*
gpg -c configs-backup.tar.gz
```

## Troubleshooting

### Build Fails

1. Check Node.js version: `node --version`
2. Clear cache: `rm -rf .next node_modules`
3. Reinstall: `npm install --legacy-peer-deps`
4. Check logs for specific errors

### Worker Not Routing

1. Verify routes in Cloudflare Dashboard
2. Check DNS settings (orange cloud enabled)
3. Test worker directly: `https://your-worker.workers.dev`
4. Review worker logs

### Database Connection Fails

1. Verify Supabase URL and keys
2. Check project status in Supabase Dashboard
3. Test connection: `curl -I https://your-project.supabase.co`
4. Review RLS policies

### Server Issues

1. Check PM2 status: `pm2 status`
2. View logs: `pm2 logs`
3. Restart apps: `pm2 restart all`
4. Check server resources: `htop`, `df -h`

## Security Checklist

- [ ] Environment variables are not committed to git
- [ ] Service role key is only used server-side
- [ ] JWT secret is strong and unique
- [ ] HTTPS is enforced on all domains
- [ ] RLS policies are properly configured
- [ ] Firewall rules are set up
- [ ] Regular security updates scheduled
- [ ] Monitoring and alerts configured

## Maintenance

### Daily
- Monitor error logs
- Check application health endpoints
- Review user feedback

### Weekly
- Review database performance
- Check disk usage
- Update dependencies if needed

### Monthly
- Rotate credentials
- Review and optimize queries
- Check for security updates

### Quarterly
- Full system audit
- Performance optimization
- Capacity planning

## Support

- **Documentation**: Check docs/ directory
- **Issues**: https://github.com/BettaDayz757/BettaDayzPBBG/issues
- **Cloudflare Support**: https://dash.cloudflare.com/support
- **Supabase Support**: https://supabase.com/support

## Next Steps

After successful deployment:
1. Set up continuous deployment (CI/CD)
2. Implement monitoring dashboards
3. Configure backup automation
4. Set up staging environment
5. Document custom procedures
6. Train team on maintenance tasks

---

**Deployment Date**: ___________  
**Deployed By**: ___________  
**Version**: 2.0.0  
**Status**: ___________
