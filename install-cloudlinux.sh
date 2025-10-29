#!/bin/bash

echo "🔧 Installing Node.js on CloudLinux server..."

sshpass -p '@Jgallow20' ssh -p 65002 -o StrictHostKeyChecking=no u933155252@194.195.84.72 << 'CLOUDLINUX_COMMANDS'

echo "📥 Installing Node.js for CloudLinux..."

# Check if Node.js is already available through the system
if command -v node &> /dev/null; then
    echo "✅ Node.js already installed: $(node --version)"
else
    # Try to install Node.js using available package managers
    if command -v dnf &> /dev/null; then
        echo "Using DNF package manager..."
        dnf install -y nodejs npm
    elif command -v yum &> /dev/null; then
        echo "Using YUM package manager..."
        yum install -y nodejs npm
    else
        echo "📥 Installing Node.js manually..."
        # Download and install Node.js binary for Linux
        cd /tmp
        wget https://nodejs.org/dist/v18.18.0/node-v18.18.0-linux-x64.tar.xz
        tar -xf node-v18.18.0-linux-x64.tar.xz
        
        # Create symlinks in user directory
        mkdir -p ~/bin
        cp -r node-v18.18.0-linux-x64/* ~/
        
        # Add to PATH
        echo 'export PATH=$HOME/bin:$PATH' >> ~/.bashrc
        source ~/.bashrc
    fi
fi

# Navigate to project directory
cd ~/bettadayz

# Check if Node.js is now available
if command -v node &> /dev/null; then
    echo "✅ Node.js available: $(node --version)"
    echo "✅ NPM available: $(npm --version)"
    
    # Install project dependencies
    echo "📦 Installing project dependencies..."
    npm ci --only=production
    
    # Install PM2 locally in the project
    echo "📥 Installing PM2 locally..."
    npm install pm2
    
    # Start applications with local PM2
    echo "🚀 Starting applications..."
    npx pm2 start ecosystem.config.js
    
    # Show status
    echo "📊 Application Status:"
    npx pm2 status
    
    echo ""
    echo "🎉 Applications Started Successfully!"
    echo "===================================="
    echo ""
    echo "🔗 Applications running on:"
    echo "   Shop:  http://$(curl -s ifconfig.me):3000"
    echo "   Store: http://$(curl -s ifconfig.me):3001"
else
    echo "❌ Node.js installation failed"
    echo "📝 Manual installation required"
    echo ""
    echo "Please contact your hosting provider to install Node.js"
    echo "or use the hosting control panel to enable Node.js"
fi

CLOUDLINUX_COMMANDS

echo ""
echo "🎉 Deployment attempt completed!"
echo "==============================="
echo ""
echo "If Node.js installation failed, you may need to:"
echo "1. Contact Hostinger support to enable Node.js"
echo "2. Use the hosting control panel to install Node.js"
echo "3. Manually upload and configure the application"