#!/usr/bin/env bash
set -euo pipefail

# BettaDayz PBBG - VPS Deployment Script
# Repository: git@github.com:BettaDayz757/BettaDayzPBBG.git

echo "=================================================="
echo "BettaDayz PBBG - VPS Deployment"
echo "=================================================="
echo ""

# Configuration
REPO_URL="git@github.com:BettaDayz757/BettaDayzPBBG.git"
APP_DIR="$HOME/BettaDayzPBBG"
BRANCH="main"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running on VPS
if [ ! -f "/etc/os-release" ]; then
    log_error "This script should be run on your VPS, not locally."
    exit 1
fi

# Step 1: Check dependencies
log_info "Checking dependencies..."

if ! command -v node &> /dev/null; then
    log_error "Node.js is not installed. Please install Node.js 20.x first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    log_error "npm is not installed. Please install npm first."
    exit 1
fi

if ! command -v git &> /dev/null; then
    log_error "git is not installed. Installing..."
    sudo apt-get update && sudo apt-get install -y git
fi

if ! command -v pm2 &> /dev/null; then
    log_warn "PM2 is not installed. Installing globally..."
    sudo npm install -g pm2
fi

NODE_VERSION=$(node --version)
log_info "Node version: $NODE_VERSION"

# Step 2: Clone or update repository
if [ -d "$APP_DIR" ]; then
    log_info "Repository exists. Pulling latest changes..."
    cd "$APP_DIR"
    git fetch origin
    git checkout "$BRANCH"
    git pull origin "$BRANCH"
else
    log_info "Cloning repository..."
    git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
    git checkout "$BRANCH"
fi

# Step 3: Install dependencies
log_info "Installing dependencies..."
npm install --legacy-peer-deps

# Step 4: Set up environment variables
log_info "Checking environment variables..."

if [ ! -f ".env.production" ]; then
    log_warn "Creating .env.production file..."
    cat > .env.production << 'EOF'
# Production Environment Variables
NODE_ENV=production

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://dqirldrlusrmodkwlnqy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxaXJsZHJsdXNybW9ka3dsbnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1OTM3MjgsImV4cCI6MjA3NzE2OTcyOH0.xUlZvXk6uOfjEn4oPAZmDabd_k6aHSKi1SNTyO9Uji8
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Dual Domain Configuration
NEXT_PUBLIC_PRIMARY_DOMAIN=bettadayz.shop
NEXT_PUBLIC_SECONDARY_DOMAIN=bettadayz.store
NEXT_PUBLIC_SITE_URL=https://bettadayz.shop
NEXT_PUBLIC_ALT_SITE_URL=https://bettadayz.store
NEXT_PUBLIC_ALLOWED_DOMAINS=bettadayz.shop,bettadayz.store

# Location
LOCATION=Norfolk, VA
EOF
    log_warn "Please edit .env.production and add your SUPABASE_SERVICE_ROLE_KEY"
fi

# Step 5: Build the application
log_info "Building Next.js application..."
npm run build

# Step 6: Stop existing PM2 processes
log_info "Stopping existing PM2 processes..."
pm2 stop all || true
pm2 delete all || true

# Step 7: Start with PM2
log_info "Starting application with PM2..."
pm2 start ecosystem.config.js

# Step 8: Save PM2 configuration
log_info "Saving PM2 configuration..."
pm2 save

# Step 9: Setup PM2 startup script
log_info "Setting up PM2 to start on system boot..."
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME || true

# Step 10: Display status
log_info "PM2 Status:"
pm2 status

# Step 11: Test local endpoints
log_info "Testing local endpoints..."
sleep 3

if curl -s http://localhost:3000/api/health > /dev/null; then
    log_info "✓ Shop (port 3000) is responding"
else
    log_warn "✗ Shop (port 3000) is not responding"
fi

if curl -s http://localhost:3001/api/health > /dev/null; then
    log_info "✓ Store (port 3001) is responding"
else
    log_warn "✗ Store (port 3001) is not responding"
fi

# Step 12: Check Nginx configuration
log_info "Checking Nginx configuration..."

if [ -f "/etc/nginx/sites-available/bettadayz" ]; then
    log_info "✓ Nginx config exists"
else
    log_warn "✗ Nginx config not found. Creating template..."
    
    sudo tee /etc/nginx/sites-available/bettadayz > /dev/null << 'NGINX_EOF'
# BettaDayz.shop configuration
server {
    listen 80;
    server_name bettadayz.shop www.bettadayz.shop;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# BettaDayz.store configuration
server {
    listen 80;
    server_name bettadayz.store www.bettadayz.store;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX_EOF

    # Enable site
    sudo ln -sf /etc/nginx/sites-available/bettadayz /etc/nginx/sites-enabled/

    # Test and reload
    if sudo nginx -t; then
        log_info "✓ Nginx configuration is valid"
        sudo systemctl reload nginx
        log_info "✓ Nginx reloaded"
    else
        log_error "✗ Nginx configuration has errors"
    fi
fi

# Step 13: Setup SSL (optional)
echo ""
log_info "=================================================="
log_info "Deployment Complete!"
log_info "=================================================="
echo ""
log_info "Next steps:"
echo ""
echo "1. Verify the app is running:"
echo "   pm2 status"
echo "   pm2 logs"
echo ""
echo "2. Test locally:"
echo "   curl http://localhost:3000/"
echo "   curl http://localhost:3000/town"
echo ""
echo "3. Setup SSL (if not already done):"
echo "   sudo certbot --nginx -d bettadayz.shop -d www.bettadayz.shop"
echo "   sudo certbot --nginx -d bettadayz.store -d www.bettadayz.store"
echo ""
echo "4. Test live domains:"
echo "   curl https://bettadayz.shop/"
echo "   curl https://bettadayz.shop/town"
echo ""
echo "5. View PM2 logs:"
echo "   pm2 logs bettadayz-shop"
echo "   pm2 logs bettadayz-store"
echo ""
log_info "Your app should now be live at:"
log_info "  - https://bettadayz.shop"
log_info "  - https://bettadayz.store"
echo ""
