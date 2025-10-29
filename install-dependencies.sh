#!/bin/bash

echo "🔧 Installing Node.js and PM2 on server..."

sshpass -p '@Jgallow20' ssh -p 65002 -o StrictHostKeyChecking=no u933155252@194.195.84.72 << 'INSTALL_COMMANDS'

echo "📥 Installing Node.js using NodeSource repository..."

# Download and install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Verify installation
echo "Node.js version:"
node --version
echo "NPM version:"
npm --version

# Navigate to project directory
cd ~/bettadayz

# Install project dependencies
echo "📦 Installing project dependencies..."
npm ci --only=production

# Install PM2 globally
echo "📥 Installing PM2..."
npm install -g pm2

# Start the applications
echo "🚀 Starting both domains with PM2..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup

# Show status
echo "📊 Application Status:"
pm2 status

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "✅ Node.js installed"
echo "✅ Dependencies installed"
echo "✅ PM2 installed and configured"
echo "✅ Both applications started"
echo ""
echo "🔗 Applications running on:"
echo "   Shop:  http://$(curl -s ifconfig.me):3000"
echo "   Store: http://$(curl -s ifconfig.me):3001"

INSTALL_COMMANDS

echo ""
echo "🎉 BettaDayz PBBG is now live on both domains!"
echo "============================================="