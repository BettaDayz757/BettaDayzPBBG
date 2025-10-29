#!/bin/bash

# BettaDayz PBBG Deployment Script
# Deploy to both bettadayz.shop and bettadayz.store

set -e

echo "🚀 Starting BettaDayz PBBG dual-domain deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SERVER_HOST="194.195.84.72"
SERVER_PORT="65002"
SERVER_USER="u933155252"
REMOTE_PATH="/home/$SERVER_USER/bettadayz"
APP_NAME="bettadayz-pbbg"

echo -e "${BLUE}📋 Deployment Configuration:${NC}"
echo -e "  Server: $SERVER_USER@$SERVER_HOST:$SERVER_PORT"
echo -e "  Remote Path: $REMOTE_PATH"
echo -e "  Domains: bettadayz.shop, bettadayz.store"
echo ""

# Check if we can connect to the server
echo -e "${YELLOW}🔍 Testing server connection...${NC}"
if ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "echo 'Connection successful'" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Server connection successful${NC}"
else
    echo -e "${RED}❌ Failed to connect to server${NC}"
    echo "Please ensure you have SSH access configured"
    exit 1
fi

# Build the application
echo -e "${YELLOW}🏗️  Building application...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# Create deployment package
echo -e "${YELLOW}📦 Creating deployment package...${NC}"
tar -czf deploy.tar.gz \
    .next \
    public \
    package.json \
    package-lock.json \
    next.config.ts \
    middleware.ts \
    app \
    lib \
    components \
    .env.example \
    supabase

echo -e "${GREEN}✅ Deployment package created${NC}"

# Upload to server
echo -e "${YELLOW}📤 Uploading to server...${NC}"
scp -P $SERVER_PORT deploy.tar.gz $SERVER_USER@$SERVER_HOST:$REMOTE_PATH/

# Extract and setup on server
echo -e "${YELLOW}🔧 Setting up application on server...${NC}"
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST << 'ENDSSH'
cd /home/u933155252/bettadayz

# Extract the deployment package
echo "📂 Extracting deployment package..."
tar -xzf deploy.tar.gz
rm deploy.tar.gz

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Setup environment variables
if [ ! -f .env.production ]; then
    echo "📝 Creating environment file template..."
    cp .env.example .env.production
    echo "⚠️  Please edit .env.production with your actual values"
fi

# Setup PM2 configuration
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'bettadayz-shop',
      script: 'npm',
      args: 'start',
      cwd: '/home/u933155252/bettadayz',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DOMAIN: 'bettadayz.shop'
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      log_file: 'logs/shop.log',
      out_file: 'logs/shop-out.log',
      error_file: 'logs/shop-error.log'
    },
    {
      name: 'bettadayz-store',
      script: 'npm',
      args: 'start',
      cwd: '/home/u933155252/bettadayz',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        DOMAIN: 'bettadayz.store'
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      log_file: 'logs/store.log',
      out_file: 'logs/store-out.log',
      error_file: 'logs/store-error.log'
    }
  ]
};
EOF

# Create logs directory
mkdir -p logs

# Setup nginx configuration
cat > nginx-sites.conf << 'EOF'
# Configuration for bettadayz.shop
server {
    listen 80;
    server_name bettadayz.shop;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name bettadayz.shop;

    ssl_certificate /path/to/shop/certificate.crt;
    ssl_certificate_key /path/to/shop/private.key;
    
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

# Configuration for bettadayz.store
server {
    listen 80;
    server_name bettadayz.store;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name bettadayz.store;

    ssl_certificate /path/to/store/certificate.crt;
    ssl_certificate_key /path/to/store/private.key;
    
    location / {
        proxy_pass http://localhost:3001;
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
EOF

echo "✅ Server setup complete!"
echo "📋 Next steps:"
echo "1. Edit .env.production with your actual environment variables"
echo "2. Setup SSL certificates for both domains"
echo "3. Configure nginx with the provided configuration"
echo "4. Run: pm2 start ecosystem.config.js"
echo "5. Run: pm2 save && pm2 startup"

ENDSSH

# Cleanup
rm deploy.tar.gz

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Manual steps required on server:${NC}"
echo -e "1. ${YELLOW}Configure environment variables:${NC}"
echo -e "   ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST"
echo -e "   nano $REMOTE_PATH/.env.production"
echo ""
echo -e "2. ${YELLOW}Setup SSL certificates for both domains${NC}"
echo ""
echo -e "3. ${YELLOW}Configure nginx:${NC}"
echo -e "   sudo cp $REMOTE_PATH/nginx-sites.conf /etc/nginx/sites-available/bettadayz"
echo -e "   sudo ln -s /etc/nginx/sites-available/bettadayz /etc/nginx/sites-enabled/"
echo -e "   sudo nginx -t && sudo systemctl reload nginx"
echo ""
echo -e "4. ${YELLOW}Start the applications:${NC}"
echo -e "   cd $REMOTE_PATH"
echo -e "   pm2 start ecosystem.config.js"
echo -e "   pm2 save && pm2 startup"
echo ""
echo -e "${GREEN}🚀 Your BettaDayz PBBG is ready for both domains!${NC}"