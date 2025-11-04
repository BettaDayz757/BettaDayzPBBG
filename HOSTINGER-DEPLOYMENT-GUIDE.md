# Hostinger Deployment Guide for bettadayz.shop

This guide will walk you through deploying your BettaDayz PBBG application to Hostinger and connecting it to your domain **bettadayz.shop**.

## Prerequisites

- Hostinger account with VPS or Business hosting plan (required for Node.js applications)
- Domain **bettadayz.shop** registered and managed in Hostinger
- SSH access to your Hostinger server
- Node.js 18+ support on your hosting plan
- Git installed on the server

## Overview

This application is built with Remix (React framework) and requires a Node.js environment to run. Hostinger supports Node.js applications through their VPS or Business hosting plans.

## Part 1: Prepare Your Local Build

### Step 1: Build the Application Locally

```bash
# Clone the repository (if not already done)
git clone https://github.com/BettaDayz757/BettaDayzPBBG.git
cd BettaDayzPBBG

# Install dependencies
npm install

# Build for production
npm run build
```

This will create a `build` directory with your production-ready application.

## Part 2: Hostinger Server Setup

### Step 1: Access Your Hostinger VPS via SSH

1. Log into your Hostinger control panel (hPanel)
2. Navigate to your VPS management
3. Note your server IP address and SSH credentials
4. Connect via SSH:

```bash
ssh root@your-server-ip
# Or use the credentials provided by Hostinger
```

### Step 2: Install Node.js (if not already installed)

```bash
# Update system packages
apt update && apt upgrade -y

# Install Node.js 20.x (recommended)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 3: Install PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Set PM2 to start on boot
pm2 startup systemd
```

### Step 4: Install Git (if not already installed)

```bash
apt install -y git
```

## Part 3: Deploy Your Application

### Step 1: Clone Your Repository on the Server

```bash
# Navigate to web directory
cd /var/www

# Clone your repository
git clone https://github.com/BettaDayz757/BettaDayzPBBG.git
cd BettaDayzPBBG

# Install dependencies
npm install --production
```

### Step 2: Set Up Environment Variables

```bash
# Create production environment file
cp .env.example .env.production

# Edit with your production values
nano .env.production
```

Add these environment variables:

```env
NODE_ENV=production
SITE_URL=https://bettadayz.shop
PORT=3000

# Add your database, API keys, and other secrets here
# DATABASE_URL=your_database_url
# STRIPE_PUBLIC_KEY=your_stripe_key
# SESSION_SECRET=your_secure_random_string
```

### Step 3: Build the Application

```bash
# Build the production bundle
npm run build
```

### Step 4: Start the Application with PM2

```bash
# Start the app with PM2
pm2 start npm --name "bettadayz" -- start

# Save PM2 configuration
pm2 save

# Check status
pm2 status
```

## Part 4: Configure Nginx as Reverse Proxy

### Step 1: Install Nginx (if not already installed)

```bash
apt install -y nginx
```

### Step 2: Create Nginx Configuration

```bash
# Create configuration file
nano /etc/nginx/sites-available/bettadayz.shop
```

Add this configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name bettadayz.shop www.bettadayz.shop;

    # Redirect HTTP to HTTPS (after SSL setup)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
```

### Step 3: Enable the Site

```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/bettadayz.shop /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

## Part 5: Configure Domain DNS in Hostinger

### Step 1: Update DNS Records

1. Log into Hostinger hPanel
2. Go to **Domains** → Select **bettadayz.shop**
3. Click **DNS / Nameservers**
4. Add/Update these DNS records:

   **A Record:**
   - Type: `A`
   - Name: `@`
   - Points to: `Your Server IP Address`
   - TTL: `14400` (4 hours)

   **A Record (www):**
   - Type: `A`
   - Name: `www`
   - Points to: `Your Server IP Address`
   - TTL: `14400`

   Or use a **CNAME Record for www:**
   - Type: `CNAME`
   - Name: `www`
   - Points to: `bettadayz.shop`
   - TTL: `14400`

5. Save changes (DNS propagation may take up to 24 hours, usually much faster)

### Step 2: Verify DNS Propagation

```bash
# Check DNS propagation
dig bettadayz.shop +short
dig www.bettadayz.shop +short

# Or use online tool: https://dnschecker.org
```

## Part 6: Set Up SSL Certificate (HTTPS)

### Step 1: Install Certbot

```bash
# Install Certbot and Nginx plugin
apt install -y certbot python3-certbot-nginx
```

### Step 2: Obtain SSL Certificate

```bash
# Get certificate for both domain and www subdomain
certbot --nginx -d bettadayz.shop -d www.bettadayz.shop

# Follow the prompts:
# - Enter your email address
# - Agree to terms of service
# - Choose whether to redirect HTTP to HTTPS (recommended: Yes)
```

### Step 3: Auto-Renewal Setup

```bash
# Certbot automatically sets up renewal, but verify:
certbot renew --dry-run

# Check renewal timer
systemctl status certbot.timer
```

## Part 7: Deployment Workflow

### Manual Deployment

To deploy updates:

```bash
# SSH into server
ssh root@your-server-ip

# Navigate to project
cd /var/www/BettaDayzPBBG

# Pull latest changes
git pull origin main

# Install any new dependencies
npm install --production

# Rebuild the application
npm run build

# Restart the application
pm2 restart bettadayz

# Check status
pm2 status
pm2 logs bettadayz --lines 50
```

### Automated Deployment (Optional)

Create a deployment script on your server:

```bash
# Create deploy script
nano /var/www/BettaDayzPBBG/deploy.sh
```

Add this content:

```bash
#!/bin/bash
set -e

echo "Starting deployment..."

# Navigate to project directory
cd /var/www/BettaDayzPBBG

# Pull latest changes
echo "Pulling latest changes..."
git pull origin main

# Install dependencies
echo "Installing dependencies..."
npm install --production

# Build application
echo "Building application..."
npm run build

# Restart with PM2
echo "Restarting application..."
pm2 restart bettadayz

# Show status
pm2 status

echo "Deployment complete!"
```

Make it executable:

```bash
chmod +x /var/www/BettaDayzPBBG/deploy.sh
```

To deploy, simply run:

```bash
/var/www/BettaDayzPBBG/deploy.sh
```

## Part 8: GitHub Actions CI/CD (Optional)

If you want automatic deployments on push to main branch, you can set up GitHub Actions with SSH deployment.

Create `.github/workflows/deploy-hostinger.yml`:

```yaml
name: Deploy to Hostinger

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.HOSTINGER_HOST }}
          username: ${{ secrets.HOSTINGER_USERNAME }}
          key: ${{ secrets.HOSTINGER_SSH_KEY }}
          script: |
            cd /var/www/BettaDayzPBBG
            git pull origin main
            npm install --production
            npm run build
            pm2 restart bettadayz
```

Add these secrets in GitHub repository settings:

- `HOSTINGER_HOST`: Your server IP
- `HOSTINGER_USERNAME`: SSH username (usually `root`)
- `HOSTINGER_SSH_KEY`: Your SSH private key

## Part 9: Monitoring and Maintenance

### View Application Logs

```bash
# View PM2 logs
pm2 logs bettadayz

# View last 100 lines
pm2 logs bettadayz --lines 100

# View Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Monitor Application Status

```bash
# PM2 status
pm2 status

# Detailed monitoring
pm2 monit
```

### Server Resources

```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check CPU usage
top
```

### Restart Services

```bash
# Restart application
pm2 restart bettadayz

# Restart Nginx
systemctl restart nginx

# Restart server (if needed)
reboot
```

## Part 10: Security Best Practices

### 1. Firewall Configuration

```bash
# Install UFW (if not installed)
apt install -y ufw

# Allow SSH
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

### 2. Secure SSH

```bash
# Edit SSH config
nano /etc/ssh/sshd_config

# Recommended changes:
# PermitRootLogin no  # Create non-root user first
# PasswordAuthentication no  # Use SSH keys only
# Port 2222  # Change default SSH port (optional)

# Restart SSH
systemctl restart sshd
```

### 3. Keep System Updated

```bash
# Regular updates
apt update && apt upgrade -y

# Auto security updates
apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades
```

### 4. Environment Variables Security

- Never commit `.env` files to Git
- Use strong, random secrets
- Rotate credentials regularly
- Use environment-specific variables

## Troubleshooting

### Application Not Starting

```bash
# Check PM2 logs
pm2 logs bettadayz --err

# Check if port 3000 is in use
netstat -tulpn | grep 3000

# Restart application
pm2 restart bettadayz
```

### DNS Not Resolving

```bash
# Check DNS records
dig bettadayz.shop

# Verify Nginx is running
systemctl status nginx

# Check Nginx configuration
nginx -t
```

### SSL Certificate Issues

```bash
# Check certificate status
certbot certificates

# Renew manually if needed
certbot renew

# Check Nginx SSL configuration
nginx -t
```

### 502 Bad Gateway Error

This usually means Nginx can't connect to your Node.js app:

```bash
# Check if app is running
pm2 status

# Check app logs
pm2 logs bettadayz

# Restart app
pm2 restart bettadayz

# Check if port 3000 is listening
netstat -tulpn | grep 3000
```

## Alternative: Using Hostinger's Website Builder (Not Recommended for Node.js)

Note: Hostinger's basic shared hosting plans don't support Node.js applications. You need:

- **VPS Hosting**: Full control, requires server management
- **Business/Premium Hosting**: May support Node.js (check with Hostinger)

If you don't have VPS access, consider:

1. Upgrading to Hostinger VPS
2. Using Cloudflare Pages (free, supports Remix)
3. Using Vercel (free tier available)
4. Using Netlify (free tier available)

## Support and Resources

- **Hostinger Support**: Available 24/7 via live chat
- **Hostinger Knowledge Base**: https://support.hostinger.com
- **Remix Documentation**: https://remix.run/docs
- **PM2 Documentation**: https://pm2.keymetrics.io/docs
- **Nginx Documentation**: https://nginx.org/en/docs

## Next Steps After Deployment

1. ✅ Verify site is accessible at https://bettadayz.shop
2. ✅ Test all features and functionality
3. ✅ Set up monitoring (PM2 Plus, Sentry, etc.)
4. ✅ Configure backups (database, files)
5. ✅ Set up analytics (Google Analytics, Plausible, etc.)
6. ✅ Configure email service (if needed)
7. ✅ Set up error tracking and logging
8. ✅ Document your deployment process
9. ✅ Create staging environment (optional)
10. ✅ Set up automated backups

## Congratulations! 🎉

Your BettaDayz PBBG application should now be live at **https://bettadayz.shop**!

If you encounter any issues, check the troubleshooting section or contact Hostinger support.
