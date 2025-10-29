#!/bin/bash

echo "🚀 BettaDayz PBBG - Complete Dual Domain Deployment"
echo "=================================================="

# Upload the deployment package
echo "📤 Uploading deployment package..."
sshpass -p '@Jgallow20' scp -P 65002 -o StrictHostKeyChecking=no bettadayz-dual-deployment.tar.gz u933155252@194.195.84.72:~/

if [ $? -eq 0 ]; then
    echo "✅ Upload successful!"
else
    echo "❌ Upload failed!"
    exit 1
fi

# Deploy and configure both domains
echo "🔧 Setting up dual domains..."
sshpass -p '@Jgallow20' ssh -p 65002 -o StrictHostKeyChecking=no u933155252@194.195.84.72 << 'REMOTE_COMMANDS'

echo "📂 Setting up BettaDayz PBBG..."

# Create directory and extract
mkdir -p ~/bettadayz
cd ~/bettadayz
tar -xzf ~/bettadayz-dual-deployment.tar.gz
rm ~/bettadayz-dual-deployment.tar.gz

# Show extracted files
echo "✅ Files extracted:"
ls -la

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "📥 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo "📦 Installing dependencies..."
npm ci --only=production

# Create environment files for both domains
echo "📝 Creating environment files..."
cp .env.example .env.production
cp .env.example .env.production.shop
cp .env.example .env.production.store

# Install PM2 if not present
if ! command -v pm2 &> /dev/null; then
    echo "📥 Installing PM2..."
    sudo npm install -g pm2
fi

# Create PM2 ecosystem configuration
echo "⚙️ Creating PM2 configuration..."
cat > ecosystem.config.js << 'EOFPM2'
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
        NEXT_PUBLIC_DOMAIN: 'bettadayz.shop'
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'bettadayz-store',
      script: 'npm',
      args: 'start',
      cwd: '/home/u933155252/bettadayz',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        NEXT_PUBLIC_DOMAIN: 'bettadayz.store'
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
EOFPM2

# Start applications with PM2
echo "🚀 Starting both domains..."
pm2 start ecosystem.config.js
pm2 save

# Show status
echo "📊 Application Status:"
pm2 status

echo ""
echo "🎉 BettaDayz PBBG Dual Domain Deployment Complete!"
echo "================================================="
echo ""
echo "✅ Shop Domain: http://$(curl -s ifconfig.me):3000"
echo "✅ Store Domain: http://$(curl -s ifconfig.me):3001"
echo ""
echo "🌐 DNS Configuration Required:"
echo "   bettadayz.shop A record → $(curl -s ifconfig.me)"
echo "   bettadayz.store A record → $(curl -s ifconfig.me)"
echo ""
echo "📝 Next Steps:"
echo "1. Edit .env.production with your actual environment variables"
echo "2. Configure your domain DNS settings"
echo "3. Set up SSL certificates with Let's Encrypt"
echo ""
echo "🔧 Management Commands:"
echo "   pm2 status    - Check application status"
echo "   pm2 logs      - View application logs"
echo "   pm2 restart all - Restart both applications"

REMOTE_COMMANDS

echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo ""
echo "🔗 Your applications are now running:"
echo "   Shop:  http://194.195.84.72:3000"
echo "   Store: http://194.195.84.72:3001"
echo ""
echo "🌐 Configure DNS to point:"
echo "   bettadayz.shop → 194.195.84.72"
echo "   bettadayz.store → 194.195.84.72"