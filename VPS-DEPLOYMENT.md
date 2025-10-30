# VPS Deployment Guide

This guide provides step-by-step instructions for deploying BettaDayz PBBG to your own VPS (Virtual Private Server).

## Prerequisites

- A VPS with Ubuntu 20.04+ or Debian 10+ (Hostinger, DigitalOcean, Linode, etc.)
- SSH access to your VPS
- Root or sudo access
- Domain name (optional, but recommended)

## Quick Start (Automated Deployment)

### Option 1: Using the Deployment Script (Recommended)

1. **Clone this repository locally:**
   ```bash
   git clone https://github.com/BettaDayz757/BettaDayzPBBG.git
   cd BettaDayzPBBG
   ```

2. **Configure your VPS settings:**
   ```bash
   # Copy the configuration template
   cp vps-config.template.sh vps-config.sh
   
   # Edit with your actual VPS details
   nano vps-config.sh
   ```
   
   Update these values:
   - `VPS_USER`: Your SSH username (e.g., `root`, `ubuntu`)
   - `VPS_IP`: Your VPS IP address (e.g., `194.195.84.72`)
   - `VPS_SSH_PORT`: SSH port (usually `22`)

3. **Set up SSH key authentication (recommended):**
   ```bash
   # Generate SSH key if you don't have one
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   
   # Copy your public key to the VPS
   ssh-copy-id -p 22 your_user@your.vps.ip.address
   ```

4. **Run the deployment script:**
   ```bash
   ./deploy-to-vps.sh
   ```

The script will automatically:
- Install Node.js and PM2 on your VPS
- Clone/update the repository
- Install dependencies
- Build the application
- Start the application with PM2

### Option 2: Direct Script Configuration

If you prefer not to use a separate config file, you can edit the script directly:

```bash
# Edit the deploy-to-vps.sh script
nano deploy-to-vps.sh
```

Update the configuration section at the top:
```bash
VPS_USER="your_username"              # Change this
VPS_IP="your.vps.ip.address"          # Change this
VPS_SSH_PORT="22"
VPS_DEPLOY_PATH="/var/www/BettaDayzPBBG"
```

Then run:
```bash
chmod +x deploy-to-vps.sh
./deploy-to-vps.sh
```

## Manual Deployment (Step by Step)

If you prefer to deploy manually or the automated script fails:

### Step 1: Connect to Your VPS

```bash
# Replace with your actual username and IP address
ssh your_username@your.vps.ip.address

# Example:
# ssh root@194.195.84.72
```

### Step 2: Install Node.js

```bash
# Update package list
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 3: Install PM2

```bash
# Install PM2 globally
sudo npm install -g pm2

# Set PM2 to start on boot
pm2 startup systemd
```

### Step 4: Clone Repository

```bash
# Navigate to web directory
cd /var/www

# Clone repository
sudo git clone https://github.com/BettaDayz757/BettaDayzPBBG.git
cd BettaDayzPBBG

# Set proper ownership
sudo chown -R $USER:$USER /var/www/BettaDayzPBBG
```

### Step 5: Install Dependencies

```bash
npm install --production --legacy-peer-deps
```

### Step 6: Configure Environment

```bash
# Create production environment file
cp .env.example .env.production

# Edit with your production values
nano .env.production
```

Add your configuration:
```env
NODE_ENV=production
PORT=3000
SITE_URL=https://yourdomain.com

# Add your secrets (never commit these!)
# DATABASE_URL=your_database_url
# SUPABASE_URL=your_supabase_url
# JWT_SECRET=your_jwt_secret
```

### Step 7: Build Application

```bash
npm run build
```

### Step 8: Start Application

```bash
# Start with PM2
pm2 start npm --name "bettadayz" -- start

# Save PM2 configuration
pm2 save

# Check status
pm2 status
pm2 logs bettadayz
```

## Post-Deployment Setup

### Configure Nginx (Reverse Proxy)

1. **Install Nginx:**
   ```bash
   sudo apt install -y nginx
   ```

2. **Create Nginx configuration:**
   ```bash
   sudo nano /etc/nginx/sites-available/bettadayz
   ```

3. **Add this configuration:**
   ```nginx
   server {
       listen 80;
       listen [::]:80;
       server_name yourdomain.com www.yourdomain.com;

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
   }
   ```

4. **Enable the site:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/bettadayz /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Set Up SSL Certificate

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### Configure DNS

In your domain registrar or DNS provider:

1. Add an **A Record**:
   - Name: `@`
   - Value: Your VPS IP address
   - TTL: 3600

2. Add a **CNAME Record** for www:
   - Name: `www`
   - Value: `yourdomain.com`
   - TTL: 3600

Wait for DNS propagation (can take up to 24 hours).

## Updating Your Application

### Automated Update

Use the deployment script again:
```bash
./deploy-to-vps.sh
```

### Manual Update

```bash
# SSH into your VPS
ssh your_username@your.vps.ip.address

# Navigate to project
cd /var/www/BettaDayzPBBG

# Pull latest changes
git pull origin main

# Install any new dependencies
npm install --production --legacy-peer-deps

# Rebuild
npm run build

# Restart application
pm2 restart bettadayz

# Check logs
pm2 logs bettadayz --lines 50
```

## Troubleshooting

### Application Won't Start

```bash
# Check PM2 status
pm2 status

# View error logs
pm2 logs bettadayz --err

# Check if port is in use
sudo netstat -tulpn | grep 3000

# Restart application
pm2 restart bettadayz
```

### Cannot Connect to VPS

```bash
# Test SSH connection
ssh -v your_username@your.vps.ip.address

# Check if SSH is running on VPS
# (You may need to use VPS console/panel)
sudo systemctl status sshd
```

### 502 Bad Gateway Error

This means Nginx can't connect to your application:

```bash
# Check if app is running
pm2 status

# Check app logs
pm2 logs bettadayz

# Restart app
pm2 restart bettadayz

# Verify port 3000 is listening
sudo netstat -tulpn | grep 3000
```

### DNS Not Resolving

```bash
# Check DNS propagation
dig yourdomain.com +short
dig www.yourdomain.com +short

# Or use online tool: https://dnschecker.org
```

## Security Best Practices

### 1. Configure Firewall

```bash
# Install and configure UFW
sudo apt install -y ufw

# Allow SSH, HTTP, and HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### 2. Secure SSH

```bash
# Edit SSH configuration
sudo nano /etc/ssh/sshd_config

# Recommended changes:
# PermitRootLogin no
# PasswordAuthentication no
# Port 2222  # Change default port (optional)

# Restart SSH
sudo systemctl restart sshd
```

### 3. Keep System Updated

```bash
# Regular updates
sudo apt update && sudo apt upgrade -y

# Enable automatic security updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 4. Never Commit Secrets

- Add `.env*` files to `.gitignore`
- Use environment variables for sensitive data
- Never hardcode credentials in source code
- Use `vps-config.sh` for deployment credentials (already in .gitignore)

## Monitoring

### View Logs

```bash
# PM2 logs
pm2 logs bettadayz
pm2 logs bettadayz --lines 100

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx -f
```

### Monitor Resources

```bash
# PM2 monitoring
pm2 monit

# System resources
htop
# or
top

# Disk usage
df -h

# Memory usage
free -h
```

## Additional Resources

- [Hostinger Deployment Guide](./HOSTINGER-DEPLOYMENT-GUIDE.md) - Specific to Hostinger VPS
- [Deployment Quickstart](./DEPLOYMENT-QUICKSTART.md) - General deployment overview
- [PM2 Documentation](https://pm2.keymetrics.io/docs)
- [Nginx Documentation](https://nginx.org/en/docs)
- [Let's Encrypt/Certbot](https://certbot.eff.org)

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review application logs: `pm2 logs bettadayz`
3. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
4. Open an issue on [GitHub](https://github.com/BettaDayz757/BettaDayzPBBG/issues)

## Example: Complete Deployment Flow

Here's a complete example with real values (replace with yours):

```bash
# On your local machine
cd ~/projects
git clone https://github.com/BettaDayz757/BettaDayzPBBG.git
cd BettaDayzPBBG

# Configure deployment
cp vps-config.template.sh vps-config.sh
nano vps-config.sh
# Set VPS_USER="root"
# Set VPS_IP="194.195.84.72"

# Set up SSH key
ssh-copy-id -p 22 root@194.195.84.72

# Deploy
./deploy-to-vps.sh

# After deployment, verify
ssh root@194.195.84.72
pm2 status
pm2 logs bettadayz
curl http://localhost:3000

# Set up Nginx and SSL (follow guide above)
```

That's it! Your application should now be running on your VPS. 🚀
