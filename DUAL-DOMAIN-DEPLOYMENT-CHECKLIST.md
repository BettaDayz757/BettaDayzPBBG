# 🚀 Dual Domain Deployment Checklist

Use this checklist to ensure your dual domain deployment is successful and complete.

## Pre-Deployment Checklist

### ✅ Code and Configuration

- [ ] Environment variables configured in `.env.local` and `.env.production`
- [ ] `next.config.ts` updated with dual domain support
- [ ] Cloudflare configuration files present (`_redirects`, `_headers`, `functions/_middleware.js`)
- [ ] All code changes committed to Git repository
- [ ] Build process tested locally (`npm run build`)
- [ ] Linting passes (`npm run lint`)

### ✅ Supabase Configuration

- [ ] Database schema updated with dual domain support (run `supabase-dual-domain-setup.sql`)
- [ ] Authentication settings configured:
  - [ ] Site URL set to `https://bettadayz.shop`
  - [ ] Additional redirect URLs include both domains
  - [ ] CORS origins include both domains
- [ ] Row Level Security (RLS) policies tested
- [ ] Supabase API keys are correctly set in environment variables

### ✅ Domain and DNS Setup

- [ ] `bettadayz.shop` domain registered and accessible
- [ ] `bettadayz.store` domain registered and accessible
- [ ] DNS configuration ready for Cloudflare Pages
- [ ] SSL certificates will be automatically provisioned by Cloudflare

## Deployment Process

### Step 1: Run Deployment Script

```bash
./deploy-dual-domains.sh
```

**Expected Output:**

- ✅ Dependencies installed
- ✅ Linting passed (or warnings acknowledged)
- ✅ Build completed successfully
- ✅ Cloudflare configuration created
- ✅ Git changes committed and pushed

### Step 2: Cloudflare Pages Setup

Navigate to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/pages)

#### Connect Repository

- [ ] Click "Create a project"
- [ ] Connect your Git provider (GitHub/GitLab)
- [ ] Select the `BettaDayzPBBG` repository
- [ ] Choose the `main` branch

#### Configure Build Settings

```
Project name: bettadayz-pbbg
Build command: npm run build
Build output directory: out
Root directory: (leave empty)
```

#### Environment Variables

Add the following environment variables in Cloudflare Pages:

**From `.env.production`:**

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `NEXT_PUBLIC_PRIMARY_DOMAIN`
- [ ] `NEXT_PUBLIC_SECONDARY_DOMAIN`
- [ ] `NEXT_PUBLIC_SITE_URL`
- [ ] `NEXT_PUBLIC_ALT_SITE_URL`
- [ ] `NEXT_PUBLIC_ALLOWED_DOMAINS`
- [ ] `NODE_ENV=production`

#### Build and Deploy

- [ ] Click "Save and Deploy"
- [ ] Wait for initial deployment to complete
- [ ] Verify deployment succeeds without errors

### Step 3: Configure Custom Domains

#### Add Primary Domain (bettadayz.shop)

- [ ] Go to Custom domains tab in your Cloudflare Pages project
- [ ] Click "Set up a custom domain"
- [ ] Enter `bettadayz.shop`
- [ ] Follow DNS configuration instructions
- [ ] Wait for SSL certificate provisioning

#### Add Secondary Domain (bettadayz.store)

- [ ] Click "Set up a custom domain" again
- [ ] Enter `bettadayz.store`
- [ ] Follow DNS configuration instructions
- [ ] Wait for SSL certificate provisioning

#### DNS Configuration

For each domain, ensure these DNS records exist:

**bettadayz.shop:**

```
Type: CNAME
Name: @
Target: your-project.pages.dev
Proxy: Yes (Orange cloud)

Type: CNAME
Name: www
Target: your-project.pages.dev
Proxy: Yes (Orange cloud)
```

**bettadayz.store:**

```
Type: CNAME
Name: @
Target: your-project.pages.dev
Proxy: Yes (Orange cloud)

Type: CNAME
Name: www
Target: your-project.pages.dev
Proxy: Yes (Orange cloud)
```

## Post-Deployment Verification

### Step 4: Automated Testing

Run the verification script:

```bash
./verify-domains.sh
```

### Step 5: Manual Testing Checklist

#### Domain Access

- [ ] https://bettadayz.shop loads correctly
- [ ] https://bettadayz.store loads correctly
- [ ] https://www.bettadayz.shop redirects to bettadayz.shop
- [ ] https://www.bettadayz.store redirects to bettadayz.store
- [ ] Both domains show HTTPS with valid certificates

#### Functionality Testing

- [ ] **Authentication:**
  - [ ] User registration works on both domains
  - [ ] User login works on both domains
  - [ ] Password reset emails work for both domains
  - [ ] Session persistence across page refreshes
  - [ ] Logout functionality works

- [ ] **Game Features:**
  - [ ] User profiles load correctly
  - [ ] Game stats and achievements display
  - [ ] In-game purchases interface works (if applicable)
  - [ ] Real-time features work (chat, notifications)
  - [ ] Data persistence across domains

- [ ] **API Connectivity:**
  - [ ] Supabase connection established
  - [ ] Database queries execute successfully
  - [ ] Real-time subscriptions work
  - [ ] File uploads work (if applicable)

#### Performance and Security

- [ ] **Load Times:**
  - [ ] Initial page load < 3 seconds
  - [ ] Subsequent navigation < 1 second
  - [ ] Images and assets load quickly

- [ ] **Security Headers:**
  - [ ] X-Frame-Options: DENY
  - [ ] X-Content-Type-Options: nosniff
  - [ ] Content-Security-Policy present
  - [ ] HTTPS enforced on both domains

- [ ] **SEO and Metadata:**
  - [ ] Page titles are correct
  - [ ] Meta descriptions present
  - [ ] Open Graph tags configured
  - [ ] Robots.txt accessible

### Step 6: Browser Compatibility

Test on multiple browsers:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Step 7: Monitoring Setup

- [ ] **Cloudflare Analytics:**
  - [ ] Analytics enabled for both domains
  - [ ] Traffic monitoring configured
  - [ ] Performance metrics tracking

- [ ] **Error Monitoring:**
  - [ ] Error logging configured
  - [ ] Alert thresholds set
  - [ ] Notification channels configured

## Troubleshooting Guide

### Common Issues and Solutions

#### Build Failures

**Issue:** Build fails during deployment
**Solutions:**

- Check Node.js version (should be 20+)
- Verify all dependencies are in package.json
- Check for TypeScript errors
- Review build logs for specific errors

#### Domain Access Issues

**Issue:** Domain doesn't load or shows errors
**Solutions:**

- Verify DNS configuration
- Check SSL certificate status
- Confirm custom domain is properly added
- Wait for DNS propagation (up to 48 hours)

#### Authentication Problems

**Issue:** Login/signup doesn't work
**Solutions:**

- Verify Supabase configuration
- Check CORS settings in Supabase
- Confirm redirect URLs include both domains
- Test with incognito/private browsing

#### CORS Errors

**Issue:** API calls fail with CORS errors
**Solutions:**

- Add both domains to Supabase CORS settings
- Check middleware configuration
- Verify environment variables
- Test API endpoints individually

#### Performance Issues

**Issue:** Slow loading times
**Solutions:**

- Check Cloudflare caching settings
- Optimize images and assets
- Review bundle size
- Enable compression

## Success Criteria

Deployment is considered successful when:

- [ ] Both domains are accessible via HTTPS
- [ ] All functionality works on both domains
- [ ] No console errors in browser
- [ ] Performance meets targets (< 3s initial load)
- [ ] Security headers are properly configured
- [ ] Monitoring and analytics are working

## Rollback Plan

If issues arise after deployment:

1. **Immediate Rollback:**

   ```bash
   # Revert to previous Git commit
   git revert HEAD
   git push origin main
   ```

2. **Cloudflare Rollback:**
   - Go to Cloudflare Pages deployment history
   - Click on previous successful deployment
   - Click "Retry deployment"

3. **DNS Rollback:**
   - Temporarily point domains to maintenance page
   - Update DNS records to previous configuration

## Post-Deployment Tasks

After successful deployment:

- [ ] Update documentation with new domain information
- [ ] Notify team members of successful deployment
- [ ] Schedule regular monitoring checks
- [ ] Plan next iteration/improvements
- [ ] Update any external services with new domain URLs
- [ ] Create backup of working configuration

## Contact Information

For deployment issues:

- **Technical Lead:** [Your contact]
- **DevOps:** [DevOps contact]
- **Emergency Contact:** [Emergency contact]

---

**Deployment Date:** _________________
**Deployed By:** _________________
**Sign-off:** _________________

> 🎉 **Congratulations!** You've successfully deployed BettaDayz PBBG to dual domains!
