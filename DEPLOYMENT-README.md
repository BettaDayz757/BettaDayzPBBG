# Deployment Scripts and Guides

This document provides an overview of all deployment options and scripts available for BettaDayz PBBG.

## Quick Navigation

### For VPS/Hostinger Deployment
- 📄 **[VPS-DEPLOYMENT.md](./VPS-DEPLOYMENT.md)** - Complete VPS deployment guide with automated script
- 📄 **[HOSTINGER-DEPLOYMENT-GUIDE.md](./HOSTINGER-DEPLOYMENT-GUIDE.md)** - Hostinger-specific instructions
- 🚀 **[deploy-to-vps.sh](./deploy-to-vps.sh)** - Automated VPS deployment script
- ⚙️ **[vps-config.template.sh](./vps-config.template.sh)** - VPS configuration template

### For Cloudflare Deployment
- 📄 **[cloudflare-deployment-guide.md](./cloudflare-deployment-guide.md)** - Cloudflare Pages deployment
- 🚀 **[deploy-cloudflare.sh](./deploy-cloudflare.sh)** - Cloudflare deployment scripts

### General Guides
- 📄 **[DEPLOYMENT-QUICKSTART.md](./DEPLOYMENT-QUICKSTART.md)** - Quick overview of all options
- 📄 **[COMPLETE-DEPLOYMENT-GUIDE.md](./COMPLETE-DEPLOYMENT-GUIDE.md)** - Complete production setup

## Deployment Options Overview

### 1. Automated VPS Deployment (Recommended for Hostinger)

**Best for:** VPS hosting, Hostinger, DigitalOcean, Linode

```bash
# Clone repository
git clone https://github.com/BettaDayz757/BettaDayzPBBG.git
cd BettaDayzPBBG

# Configure VPS settings
cp vps-config.template.sh vps-config.sh
nano vps-config.sh  # Update with your VPS details

# Deploy
./deploy-to-vps.sh
```

**Features:**
- ✅ Automatic Node.js and PM2 installation
- ✅ Git repository cloning/updating
- ✅ Dependency installation
- ✅ Application building
- ✅ PM2 process management
- ✅ Environment configuration

**See:** [VPS-DEPLOYMENT.md](./VPS-DEPLOYMENT.md)

### 2. Manual VPS Deployment

**Best for:** Custom setups, learning the process

Follow step-by-step instructions in:
- [VPS-DEPLOYMENT.md](./VPS-DEPLOYMENT.md) (Manual section)
- [HOSTINGER-DEPLOYMENT-GUIDE.md](./HOSTINGER-DEPLOYMENT-GUIDE.md)

### 3. GitHub Actions Automatic Deployment

**Best for:** Continuous deployment on every push

1. Copy the workflow template:
   ```bash
   cp .github/workflows/deploy-vps.yml.template .github/workflows/deploy-vps.yml
   ```

2. Add secrets to your GitHub repository:
   - `VPS_HOST` - Your VPS IP address
   - `VPS_USERNAME` - SSH username
   - `VPS_SSH_KEY` - SSH private key
   - `VPS_PORT` - SSH port (optional)
   - `VPS_DEPLOY_PATH` - Deployment path (optional)

3. Push to main branch - deployment happens automatically!

### 4. Cloudflare Pages Deployment

**Best for:** Static sites, serverless deployment

See [cloudflare-deployment-guide.md](./cloudflare-deployment-guide.md)

### 5. Vercel Deployment

**Best for:** Quick deployment, preview environments

Automatic via existing `.github/workflows/deploy.yml`

## Common Deployment Scenarios

### Scenario 1: First-Time Deployment to Hostinger VPS

```bash
# 1. Set up SSH key
ssh-keygen -t rsa -b 4096
ssh-copy-id your_user@your_vps_ip

# 2. Configure deployment
cp vps-config.template.sh vps-config.sh
nano vps-config.sh

# 3. Deploy
./deploy-to-vps.sh

# 4. Set up Nginx and SSL (follow VPS-DEPLOYMENT.md)
```

### Scenario 2: Updating Existing Deployment

```bash
# Option A: Use deployment script
./deploy-to-vps.sh

# Option B: Manual update
ssh your_user@your_vps_ip
cd /var/www/BettaDayzPBBG
git pull origin main
npm install --production --legacy-peer-deps
npm run build
pm2 restart bettadayz
```

### Scenario 3: Setting Up Automatic Deployments

```bash
# 1. Set up VPS deployment workflow
cp .github/workflows/deploy-vps.yml.template .github/workflows/deploy-vps.yml

# 2. Add GitHub secrets (Settings > Secrets and variables > Actions)
# 3. Push changes - deployments happen automatically!
```

## Important Notes

### Security

⚠️ **Never commit secrets or credentials!**

Files that should NEVER be committed:
- `vps-config.sh` (contains VPS credentials)
- `.env` files (contains API keys, secrets)
- SSH private keys

These are already in `.gitignore`.

### Placeholder Values

When you see these in documentation, **you must replace them**:
- `your_user` or `your_username` → Your actual SSH username (e.g., `root`, `ubuntu`)
- `your_vps_ip` or `your.vps.ip.address` → Your actual VPS IP (e.g., `203.0.113.10`)
- `your-server-ip` → Your actual VPS IP
- `yourdomain.com` → Your actual domain (e.g., `bettadayz.shop`)

### SSH Connection Format

Correct format:
```bash
ssh username@ip_address
# Example: ssh root@203.0.113.10
```

Common mistakes:
```bash
# ❌ WRONG - Don't use placeholders literally
ssh your_user@your_vps_ip

# ✅ CORRECT - Use actual values
ssh root@203.0.113.10
```

## Troubleshooting

### "Could not resolve hostname your_vps_ip"

**Problem:** You're using placeholder text instead of actual values.

**Solution:** Replace placeholders with your actual VPS details:
```bash
# Wrong:
ssh your_user@your_vps_ip

# Correct:
ssh root@203.0.113.10
```

### "Permission denied (publickey)"

**Problem:** SSH key not set up or password authentication disabled.

**Solution:**
```bash
# Set up SSH key
ssh-copy-id your_user@your_vps_ip

# Or use password authentication
ssh -o PreferredAuthentications=password your_user@your_vps_ip
```

### "deploy-to-vps.sh: No such file or directory"

**Problem:** Script doesn't exist or you're in the wrong directory.

**Solution:**
```bash
# Make sure you're in the repository directory
cd /path/to/BettaDayzPBBG

# Check if script exists
ls -l deploy-to-vps.sh

# Make it executable if needed
chmod +x deploy-to-vps.sh
```

### Script Says "Configuration not set!"

**Problem:** You haven't updated the VPS configuration in the script.

**Solution:**
```bash
# Edit the script
nano deploy-to-vps.sh

# Update these lines with your actual values:
VPS_USER="your_user"  # Change to your username
VPS_IP="your_vps_ip"  # Change to your IP address
```

Or use the configuration file:
```bash
cp vps-config.template.sh vps-config.sh
nano vps-config.sh
# Update values in config file
```

## Getting Help

1. **Check the troubleshooting sections** in the deployment guides
2. **Review application logs:**
   ```bash
   ssh your_user@your_vps_ip
   pm2 logs bettadayz
   ```
3. **Open an issue** on [GitHub](https://github.com/BettaDayz757/BettaDayzPBBG/issues)

## Additional Resources

- [PM2 Documentation](https://pm2.keymetrics.io/docs)
- [Nginx Documentation](https://nginx.org/en/docs)
- [Let's Encrypt/Certbot](https://certbot.eff.org)
- [Hostinger VPS Tutorials](https://www.hostinger.com/tutorials/vps)
- [DigitalOcean Community Tutorials](https://www.digitalocean.com/community/tutorials)

## Checklist: First-Time VPS Setup

- [ ] VPS account created (Hostinger, DigitalOcean, etc.)
- [ ] SSH access configured
- [ ] SSH keys set up for passwordless login
- [ ] Domain purchased and DNS configured
- [ ] VPS firewall configured (ports 22, 80, 443)
- [ ] Node.js and PM2 installed (or use script)
- [ ] Application deployed
- [ ] Nginx configured as reverse proxy
- [ ] SSL certificate installed (Let's Encrypt)
- [ ] Domain DNS pointing to VPS IP
- [ ] Application accessible via domain
- [ ] PM2 configured to start on boot
- [ ] Monitoring and logging set up

## Quick Command Reference

```bash
# Deploy/update application
./deploy-to-vps.sh

# Check application status
ssh user@ip "pm2 status"

# View application logs
ssh user@ip "pm2 logs bettadayz"

# Restart application
ssh user@ip "pm2 restart bettadayz"

# Check if app is running
curl http://your-vps-ip:3000

# View Nginx logs
ssh user@ip "sudo tail -f /var/log/nginx/error.log"

# Restart Nginx
ssh user@ip "sudo systemctl restart nginx"

# Check SSL certificate
ssh user@ip "sudo certbot certificates"
```

---

**Need more help?** Check the specific deployment guide for your platform or open an issue on GitHub!
