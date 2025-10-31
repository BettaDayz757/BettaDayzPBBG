# Domain Connection Summary: bettadayz.shop via Hostinger

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

- Turn on DNSSEC in the Cloudflare zone for bettadayz.shop, then add the DS at the registrar. Propagation can take up to 24 hours.
- Repeat for bettadayz.store when its DS values are available from Cloudflare.

## ✅ What Was Completed

This document summarizes all changes made to connect your repository to the domain **bettadayz.shop** for deployment via Hostinger.

### Files Updated

#### 1. Domain Configuration Files

- **CNAME** - Updated from `bettadayz.store` to `bettadayz.shop`
  - This file tells GitHub Pages and other services which custom domain to use

- **.env.production** - Updated `SITE_URL` from `https://bettadayz.store` to `https://bettadayz.shop`
  - Environment variable for production builds

- **vercel.json** - Updated domain references
  - Changed `DOMAIN` environment variable to `bettadayz.shop`

- **wrangler.toml** - Updated Cloudflare Workers configuration
  - Updated route patterns to use `bettadayz.shop`
  - Updated route patterns for www subdomain

- **_redirects** - Updated redirect rules
  - Updated all URL patterns to use `bettadayz.shop`
  - Ensures proper HTTPS redirects and www handling

#### 2. Workflow Files

- **.github/workflows/deploy.yml** - Updated deployment workflow
  - Changed `DOMAIN` environment variable to `bettadayz.shop`

#### 3. Source Code Files

- **app/routes/_index.tsx** - Updated Open Graph metadata
  - Changed `og:url` from `https://bettadayz.store` to `https://bettadayz.shop`

- **_index.tsx** - Updated Open Graph metadata
  - Changed `og:url` from `https://bettadayz.store` to `https://bettadayz.shop`

- **index.js** - Updated compiled JavaScript
  - Changed domain references (will be regenerated on build)

#### 4. Documentation Files

- **README.md** - Completely rewritten
  - Added deployment information
  - Added links to deployment guides
  - Updated project description

- **cloudflare-deployment-guide.md** - Updated for new domain
  - Changed all references from `bettadayz.store` to `bettadayz.shop`
  - Updated DNS configuration examples
  - Updated verification URLs

#### 5. New Documentation Created

- **HOSTINGER-DEPLOYMENT-GUIDE.md** (NEW)
  - Comprehensive guide for deploying to Hostinger VPS
  - Step-by-step instructions for:
    - Server setup and configuration
    - Node.js and PM2 installation
    - Nginx reverse proxy setup
    - DNS configuration in Hostinger
    - SSL certificate setup with Let's Encrypt
    - Deployment workflows
    - Security best practices
    - Troubleshooting common issues

- **DEPLOYMENT-QUICKSTART.md** (NEW)
  - Quick reference guide for deployment
  - Overview of both Hostinger and Cloudflare options
  - DNS configuration examples
  - Post-deployment checklist
  - Common troubleshooting steps

## 🚀 Next Steps for Deployment

### For Hostinger VPS Deployment:

1. **Access Your Hostinger VPS**
   - Log into Hostinger hPanel
   - Get your VPS IP address and SSH credentials
   - SSH into your server: `ssh root@your-server-ip`

2. **Set Up Server Environment**
   - Install Node.js 20.x
   - Install PM2 process manager
   - Install Nginx web server
   - Install Git

3. **Deploy Your Application**
   - Clone the repository on the server
   - Install dependencies: `npm install`
   - Build the application: `npm run build`
   - Start with PM2: `pm2 start npm --name bettadayz -- start`

4. **Configure Nginx**
   - Set up Nginx as reverse proxy
   - Point to localhost:3000
   - Configure SSL with Certbot

5. **Configure DNS in Hostinger**
   - Go to Domains → bettadayz.shop → DNS
   - Add A record: `@` → Your VPS IP
   - Add A record: `www` → Your VPS IP
   - Wait for DNS propagation (up to 24 hours)

6. **Set Up SSL Certificate**
   - Install Certbot
   - Run: `certbot --nginx -d bettadayz.shop -d www.bettadayz.shop`
   - Follow prompts and enable HTTPS redirect

7. **Verify Deployment**
   - Visit https://bettadayz.shop
   - Test all functionality
   - Check SSL certificate (green padlock)

### For Cloudflare Pages Deployment (Alternative):

1. **Log into Cloudflare**
   - Go to Pages section
   - Create new project

2. **Connect GitHub Repository**
   - Select BettaDayz757/BettaDayzPBBG
   - Configure build settings
   - Deploy

3. **Add Custom Domain**
   - In Cloudflare Pages, add bettadayz.shop as custom domain
   - Update DNS to point to Cloudflare

## 📋 Configuration Summary

### Domain Information
- **Primary Domain**: bettadayz.shop
- **WWW Subdomain**: www.bettadayz.shop (redirects to primary)
- **Protocol**: HTTPS (forced redirect from HTTP)
- **Previous Domain**: bettadayz.store (all references updated)

### Environment Variables Required
```env
NODE_ENV=production
SITE_URL=https://bettadayz.shop
PORT=3000
```

### DNS Records Needed (Hostinger)

```text
Type: A
Name: @
Value: [Your VPS IP Address]
TTL: 14400

Type: A
Name: www
Value: [Your VPS IP Address]
TTL: 14400
```

### Server Requirements

- **OS**: Ubuntu/Debian (recommended)
- **Node.js**: 18.x or 20.x
- **Memory**: Minimum 1GB RAM
- **Storage**: Minimum 10GB SSD
- **Process Manager**: PM2
- **Web Server**: Nginx (as reverse proxy)
- **SSL**: Let's Encrypt (via Certbot)

## 🔍 Verification Checklist

After deployment, verify these items:

- [ ] Site loads at [bettadayz.shop](https://bettadayz.shop)
- [ ] Site loads at [www.bettadayz.shop](https://www.bettadayz.shop) (should redirect to non-www)
- [ ] HTTP redirects to HTTPS
- [ ] SSL certificate is valid (green padlock in browser)
- [ ] All pages and routes work correctly
- [ ] No mixed content warnings
- [ ] Images and assets load properly
- [ ] API endpoints work (if applicable)
- [ ] Database connections work (if applicable)
- [ ] Game functionality works as expected
- [ ] Mobile responsiveness works
- [ ] No JavaScript errors in console

## 📖 Documentation Reference

All deployment documentation is now available in the repository:

1. **[HOSTINGER-DEPLOYMENT-GUIDE.md](./HOSTINGER-DEPLOYMENT-GUIDE.md)**
   - Full Hostinger VPS deployment guide
   - Server setup and configuration
   - Security best practices
   - Monitoring and maintenance

2. **[DEPLOYMENT-QUICKSTART.md](./DEPLOYMENT-QUICKSTART.md)**
   - Quick reference for both Hostinger and Cloudflare
   - DNS configuration examples
   - Post-deployment checklist

3. **[cloudflare-deployment-guide.md](./cloudflare-deployment-guide.md)**
   - Alternative deployment using Cloudflare Pages
   - Easier option if you don't want to manage a server

4. **[README.md](./README.md)**
   - Project overview
   - Quick links to deployment guides
   - Local development instructions

## 🔒 Security Notes

1. **Never commit these files with actual values:**
   - `.env`
   - `.env.local`
   - `.env.production` (template only, add actual secrets on server)

2. **Generate strong secrets for:**
   - SESSION_SECRET
   - Database passwords
   - API keys

3. **Keep server updated:**
   - Regular security updates
   - Firewall configuration (UFW)
   - SSH key authentication only

4. **SSL Certificate:**
   - Auto-renewal is configured via Certbot
   - Certificate expires every 90 days
   - Auto-renewal runs daily

## 🛠️ Troubleshooting Quick Reference

### DNS Not Resolving

```bash
# Check DNS propagation
dig bettadayz.shop +short
# Should show your VPS IP

# Use online tool
# https://dnschecker.org
```

### Application Not Starting

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs bettadayz

# Restart app
pm2 restart bettadayz
```

### Nginx Issues

```bash
# Test configuration
nginx -t

# Restart Nginx
systemctl restart nginx

# View error logs
tail -f /var/log/nginx/error.log
```

### SSL Certificate Issues

```bash
# Check certificate status
certbot certificates

# Renew manually
certbot renew

# Test auto-renewal
certbot renew --dry-run
```

## 📞 Support Resources

- **Hostinger Support**: Available 24/7 via live chat in hPanel
- **Hostinger Knowledge Base**: [support.hostinger.com](https://support.hostinger.com)
- **Repository Issues**: [GitHub Issues](https://github.com/BettaDayz757/BettaDayzPBBG/issues)
- **Remix Documentation**: [remix.run/docs](https://remix.run/docs)
- **PM2 Documentation**: [pm2.keymetrics.io/docs](https://pm2.keymetrics.io/docs)
- **Nginx Documentation**: [nginx.org/en/docs](https://nginx.org/en/docs)
- **Certbot**: [certbot.eff.org](https://certbot.eff.org)

## ✨ What's Different from Before?

### Before (bettadayz.store)

- Domain was configured as bettadayz.store
- Limited deployment documentation
- No Hostinger-specific guides

### After (bettadayz.shop)

- ✅ All references updated to bettadayz.shop
- ✅ Comprehensive Hostinger deployment guide (12,000+ chars)
- ✅ Quick start guide for easy reference
- ✅ Updated all configuration files
- ✅ Updated all documentation
- ✅ Updated source code metadata
- ✅ Ready for immediate deployment

## 🎉 You're Ready to Deploy

Everything is now configured and ready for deployment to **bettadayz.shop** via Hostinger. Follow the guides in this repository to get your game live!

**Primary Guide**: Start with [HOSTINGER-DEPLOYMENT-GUIDE.md](./HOSTINGER-DEPLOYMENT-GUIDE.md) for step-by-step instructions.

**Questions?** Check the troubleshooting sections in the guides or contact Hostinger support for server-specific help.

Good luck with your deployment! 🚀
