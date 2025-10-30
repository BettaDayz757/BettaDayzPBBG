#!/bin/bash

# ================================================================
# BettaDayz PBBG - VPS Deployment Script
# ================================================================
# 
# CONFIGURATION REQUIRED BEFORE RUNNING:
# Edit the variables below with your actual VPS details
# ================================================================

# === VPS Configuration (EDIT THESE) ===
VPS_USER="your_user"          # Replace with your SSH username (e.g., root, ubuntu)
VPS_IP="your_vps_ip"          # Replace with your VPS IP address (e.g., 203.0.113.10)
VPS_SSH_PORT="22"             # SSH port (default is 22)
VPS_DEPLOY_PATH="/var/www/BettaDayzPBBG"  # Where to deploy on VPS

# === Application Configuration ===
APP_PORT="3000"               # Port your app will run on
PM2_APP_NAME="bettadayz"      # PM2 process name

# === Repository Configuration ===
REPO_URL="https://github.com/BettaDayz757/BettaDayzPBBG.git"
REPO_BRANCH="main"

# ================================================================
# DO NOT EDIT BELOW THIS LINE UNLESS YOU KNOW WHAT YOU'RE DOING
# ================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if configuration has been updated
if [[ "$VPS_USER" == "your_user" ]] || [[ "$VPS_IP" == "your_vps_ip" ]]; then
    print_error "Configuration not set!"
    echo ""
    echo "Please edit this script and replace the placeholder values:"
    echo "  - VPS_USER: your SSH username"
    echo "  - VPS_IP: your VPS IP address"
    echo ""
    echo "Example:"
    echo "  VPS_USER=\"root\""
    echo "  VPS_IP=\"203.0.113.10\"  # Use your actual VPS IP"
    exit 1
fi

# Check if SSH key is set up
print_info "Checking SSH connectivity..."
if ! ssh -o BatchMode=yes -o ConnectTimeout=5 -p "$VPS_SSH_PORT" "$VPS_USER@$VPS_IP" "echo 'SSH connection successful'" 2>/dev/null; then
    print_warning "SSH key authentication not set up or connection failed"
    print_info "You will be prompted for password during deployment"
    print_info "For passwordless deployment, set up SSH key authentication:"
    echo ""
    echo "  ssh-copy-id -p $VPS_SSH_PORT $VPS_USER@$VPS_IP"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

print_info "Starting deployment to $VPS_USER@$VPS_IP..."

# Step 1: Check if Node.js is installed on VPS
print_info "Step 1/7: Checking Node.js installation on VPS..."
ssh -p "$VPS_SSH_PORT" "$VPS_USER@$VPS_IP" << 'EOF'
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Installing Node.js 20.x..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
    sudo apt-get install -y nodejs
else
    echo "Node.js version: $(node --version)"
fi
EOF

# Step 2: Check if PM2 is installed
print_info "Step 2/7: Checking PM2 installation..."
ssh -p "$VPS_SSH_PORT" "$VPS_USER@$VPS_IP" << 'EOF'
if ! command -v pm2 &> /dev/null; then
    echo "PM2 not found. Installing PM2..."
    sudo npm install -g pm2
    pm2 startup systemd -u $USER --hp $HOME
else
    echo "PM2 version: $(pm2 --version)"
fi
EOF

# Step 3: Clone or update repository
print_info "Step 3/7: Cloning/updating repository..."
ssh -p "$VPS_SSH_PORT" "$VPS_USER@$VPS_IP" << EOF
if [ -d "$VPS_DEPLOY_PATH" ]; then
    echo "Repository exists, pulling latest changes..."
    cd $VPS_DEPLOY_PATH
    git pull origin $REPO_BRANCH
else
    echo "Cloning repository..."
    sudo mkdir -p $(dirname $VPS_DEPLOY_PATH)
    sudo chown -R $USER:$USER $(dirname $VPS_DEPLOY_PATH)
    git clone $REPO_URL $VPS_DEPLOY_PATH
    cd $VPS_DEPLOY_PATH
    git checkout $REPO_BRANCH
fi
EOF

# Step 4: Install dependencies
print_info "Step 4/7: Installing dependencies..."
ssh -p "$VPS_SSH_PORT" "$VPS_USER@$VPS_IP" << EOF
cd $VPS_DEPLOY_PATH
npm install --production --legacy-peer-deps
EOF

# Step 5: Build application
print_info "Step 5/7: Building application..."
ssh -p "$VPS_SSH_PORT" "$VPS_USER@$VPS_IP" << EOF
cd $VPS_DEPLOY_PATH
npm run build
EOF

# Step 6: Setup environment file if it doesn't exist
print_info "Step 6/7: Setting up environment variables..."
ssh -p "$VPS_SSH_PORT" "$VPS_USER@$VPS_IP" << EOF
cd $VPS_DEPLOY_PATH
if [ ! -f .env.production ]; then
    if [ -f .env.production.template ]; then
        cp .env.production.template .env.production
        echo "Created .env.production from template. Please update with your actual values."
    elif [ -f .env.example ]; then
        cp .env.example .env.production
        echo "Created .env.production from .env.example. Please update with your actual values."
    else
        echo "NODE_ENV=production" > .env.production
        echo "PORT=$APP_PORT" >> .env.production
        echo "Created basic .env.production. Please add your configuration."
    fi
fi
EOF

# Step 7: Start/Restart application with PM2
print_info "Step 7/7: Starting/restarting application..."
ssh -p "$VPS_SSH_PORT" "$VPS_USER@$VPS_IP" << EOF
cd $VPS_DEPLOY_PATH
if pm2 describe $PM2_APP_NAME > /dev/null 2>&1; then
    echo "Restarting existing PM2 process..."
    pm2 restart $PM2_APP_NAME
else
    echo "Starting new PM2 process..."
    pm2 start npm --name "$PM2_APP_NAME" -- start
fi
pm2 save
pm2 list
EOF

print_info "Deployment completed successfully! 🎉"
print_info "Your application should now be running at http://$VPS_IP:$APP_PORT"
echo ""
print_warning "Next steps:"
echo "  1. Configure Nginx as reverse proxy (see HOSTINGER-DEPLOYMENT-GUIDE.md)"
echo "  2. Set up SSL certificate with Certbot"
echo "  3. Point your domain DNS to $VPS_IP"
echo "  4. Update environment variables in $VPS_DEPLOY_PATH/.env.production"
echo ""
print_info "To view logs: ssh -p $VPS_SSH_PORT $VPS_USER@$VPS_IP \"pm2 logs $PM2_APP_NAME\""
print_info "To check status: ssh -p $VPS_SSH_PORT $VPS_USER@$VPS_IP \"pm2 status\""
