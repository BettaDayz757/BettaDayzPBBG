# ⚡ Quick Deploy Reference Card

## 🚀 Deploy to VPS in 3 Steps

### Step 1: Clone Repository
```bash
git clone https://github.com/BettaDayz757/BettaDayzPBBG.git
cd BettaDayzPBBG
```

### Step 2: Configure VPS
```bash
cp vps-config.template.sh vps-config.sh
nano vps-config.sh
```

**Edit these values:**
```bash
VPS_USER="root"              # Your SSH username
VPS_IP="194.195.84.72"       # Your VPS IP address
```

### Step 3: Deploy
```bash
./deploy-to-vps.sh
```

That's it! 🎉

---

## 📝 Common Placeholders - ALWAYS Replace These!

| Placeholder | Replace With | Example |
|------------|-------------|---------|
| `your_user` or `your_username` | Your SSH username | `root`, `ubuntu`, `admin` |
| `your_vps_ip` or `your.vps.ip.address` | Your VPS IP | `194.195.84.72` |
| `your-server-ip` | Your VPS IP | `194.195.84.72` |
| `yourdomain.com` | Your domain | `bettadayz.shop` |

---

## ❌ Common Mistakes

### Mistake #1: Using Placeholders Literally
```bash
# ❌ WRONG - Don't copy this exactly
ssh your_user@your_vps_ip

# ✅ CORRECT - Use your actual values
ssh root@194.195.84.72
```

### Mistake #2: Script Not Configured
```bash
# ❌ WRONG - Running without configuration
./deploy-to-vps.sh
# Error: Configuration not set!

# ✅ CORRECT - Configure first
cp vps-config.template.sh vps-config.sh
nano vps-config.sh  # Edit with your values
./deploy-to-vps.sh
```

### Mistake #3: No SSH Key Setup
```bash
# ❌ Will prompt for password every time

# ✅ CORRECT - Set up SSH key once
ssh-keygen -t rsa -b 4096
ssh-copy-id root@194.195.84.72
```

---

## 🔧 Quick Commands

### Deploy/Update App
```bash
./deploy-to-vps.sh
```

### Check Status
```bash
ssh root@YOUR_IP "pm2 status"
```

### View Logs
```bash
ssh root@YOUR_IP "pm2 logs bettadayz"
```

### Restart App
```bash
ssh root@YOUR_IP "pm2 restart bettadayz"
```

### Check if App is Running
```bash
curl http://YOUR_IP:3000
```

---

## 📚 Full Documentation

- [VPS-DEPLOYMENT.md](./VPS-DEPLOYMENT.md) - Complete deployment guide
- [DEPLOYMENT-README.md](./DEPLOYMENT-README.md) - All deployment options
- [HOSTINGER-DEPLOYMENT-GUIDE.md](./HOSTINGER-DEPLOYMENT-GUIDE.md) - Hostinger specific

---

## 🆘 Getting Help

**Error: "Could not resolve hostname your_vps_ip"**
→ You're using placeholder text. Replace with your actual IP address.

**Error: "Configuration not set!"**
→ Edit `deploy-to-vps.sh` or `vps-config.sh` with your VPS details.

**Error: "Permission denied (publickey)"**
→ Set up SSH key: `ssh-copy-id root@YOUR_IP`

**Error: "deploy-to-vps.sh: No such file"**
→ Make sure you're in the BettaDayzPBBG directory.

**More help:** Open an issue on [GitHub](https://github.com/BettaDayz757/BettaDayzPBBG/issues)
