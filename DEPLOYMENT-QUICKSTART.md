# Quick Start: Deploying to bettadayz.shop

This guide provides quick instructions for deploying your BettaDayz PBBG application to your domain **bettadayz.shop** using Hostinger.

## Overview

Your repository is now configured to work with the domain **bettadayz.shop**. The following files have been updated:
- `CNAME` - Points to bettadayz.shop
- `.env.production` - Production environment variables
- `vercel.json` - Domain configuration
- `wrangler.toml` - Cloudflare Workers configuration

## Deployment Options

### Option 1: Hostinger VPS (Recommended)

**Requirements:**
- Hostinger VPS or Business hosting plan
- Node.js 18+ support
- SSH access

**Quick Steps:**
1. SSH into your Hostinger VPS
2. Clone this repository: `git clone https://github.com/BettaDayz757/BettaDayzPBBG.git`
3. Install dependencies: `npm install`
4. Build the app: `npm run build`
5. Start with PM2: `pm2 start npm --name bettadayz -- start`
6. Configure Nginx as reverse proxy (see detailed guide)
7. Point DNS to your VPS IP in Hostinger DNS settings
8. Set up SSL with Certbot

**Full Instructions:** See [HOSTINGER-DEPLOYMENT-GUIDE.md](./HOSTINGER-DEPLOYMENT-GUIDE.md)

### Option 2: Cloudflare Pages (Alternative)

**Requirements:**
- Free Cloudflare account
- Domain managed in Cloudflare

**Quick Steps:**
1. Log into Cloudflare Dashboard
2. Go to Pages → Create a project
3. Connect your GitHub repository
4. Configure build: `npm run build`, output: `build/client`
5. Add custom domain: bettadayz.shop
6. Update DNS to point to Cloudflare

**Full Instructions:** See [cloudflare-deployment-guide.md](./cloudflare-deployment-guide.md)

## Domain Configuration

### DNS Settings in Hostinger

For Hostinger VPS deployment:

1. Log into Hostinger hPanel
2. Go to Domains → Select bettadayz.shop
3. Click DNS/Nameservers
4. Add these records:

   **A Record:**
   - Name: `@`
   - Points to: Your VPS IP address
   - TTL: 14400

   **A Record (www):**
   - Name: `www`
   - Points to: Your VPS IP address
   - TTL: 14400

5. Save and wait for DNS propagation (up to 24 hours, usually faster)

### Verify DNS

```bash
dig bettadayz.shop +short
dig www.bettadayz.shop +short
```

Or use online tool: https://dnschecker.org

## SSL Certificate

### For Hostinger VPS:

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d bettadayz.shop -d www.bettadayz.shop
```

### For Cloudflare:
SSL is automatically handled by Cloudflare.

## Build and Test Locally

Before deploying, test your application locally:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Test production build (if using Remix)
npm run start
```

## Environment Variables

Create `.env.production` with these values:

```env
NODE_ENV=production
SITE_URL=https://bettadayz.shop
PORT=3000

# Add your secrets:
# DATABASE_URL=your_database_url
# STRIPE_PUBLIC_KEY=your_stripe_key
# STRIPE_SECRET_KEY=your_stripe_secret
# SESSION_SECRET=your_secure_random_string
```

⚠️ **Never commit `.env` files to Git!**

## Post-Deployment Checklist

After deployment, verify:

- [ ] Site loads at https://bettadayz.shop
- [ ] HTTPS is working (padlock icon in browser)
- [ ] www.bettadayz.shop redirects properly
- [ ] All pages and routes work correctly
- [ ] Game functionality works as expected
- [ ] API endpoints are accessible
- [ ] Database connections work (if applicable)
- [ ] No console errors in browser
- [ ] Mobile responsiveness works

## Monitoring

### For Hostinger VPS:

```bash
# Check application status
pm2 status

# View logs
pm2 logs bettadayz

# Monitor resources
pm2 monit
```

## Updating Your Application

### Manual Updates (Hostinger VPS):

```bash
# SSH into server
ssh root@your-server-ip

# Navigate to project
cd /var/www/BettaDayzPBBG

# Pull changes
git pull origin main

# Rebuild
npm install --production
npm run build

# Restart
pm2 restart bettadayz
```

### Automatic Updates:
Set up GitHub Actions for automatic deployment (see full guide).

## Troubleshooting

### Site Not Loading
- Check DNS propagation: https://dnschecker.org
- Verify Nginx is running: `systemctl status nginx`
- Check application logs: `pm2 logs bettadayz`

### 502 Bad Gateway
- Check if app is running: `pm2 status`
- Verify port 3000 is listening: `netstat -tulpn | grep 3000`
- Restart application: `pm2 restart bettadayz`

### SSL Certificate Issues
- Check certificate: `certbot certificates`
- Renew if needed: `certbot renew`
- Verify Nginx config: `nginx -t`

## Support

- **Hostinger Support**: 24/7 live chat in hPanel
- **Documentation**: [HOSTINGER-DEPLOYMENT-GUIDE.md](./HOSTINGER-DEPLOYMENT-GUIDE.md)
- **GitHub Issues**: https://github.com/BettaDayz757/BettaDayzPBBG/issues

## Additional Resources

- [Hostinger VPS Tutorial](https://www.hostinger.com/tutorials/vps)
- [Remix Deployment Docs](https://remix.run/docs/en/main/guides/deployment)
- [PM2 Documentation](https://pm2.keymetrics.io/docs)
- [Nginx Documentation](https://nginx.org/en/docs)
- [Certbot (Let's Encrypt)](https://certbot.eff.org)

## Need Help?

If you're new to server management or need assistance:
1. Contact Hostinger support (they can help with VPS setup)
2. Consider using Cloudflare Pages (simpler, no server management)
3. Check the detailed deployment guides in this repository

---

**Happy Deploying! 🚀**

Your BettaDayz PBBG game will soon be live at **https://bettadayz.shop**!
