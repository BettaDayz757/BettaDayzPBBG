#!/bin/bash

echo "🚀 Deploying BettaDayz PBBG to Production Server"
echo "==============================================="

# Server details
SERVER="194.195.84.72"
PORT="65002"
USER="u933155252"
PASSWORD="@Jgallow20"

echo "📤 Uploading deployment package..."

# Upload the deployment package
sshpass -p "$PASSWORD" scp -P $PORT -o StrictHostKeyChecking=no bettadayz-deployment-final.tar.gz $USER@$SERVER:~/

if [ $? -eq 0 ]; then
    echo "✅ Upload successful!"
else
    echo "❌ Upload failed!"
    exit 1
fi

echo "🔧 Setting up application on server..."

# Connect and setup
sshpass -p "$PASSWORD" ssh -p $PORT -o StrictHostKeyChecking=no $USER@$SERVER << 'EOF'
echo "📂 Setting up BettaDayz PBBG..."

# Create directory and extract
mkdir -p ~/bettadayz
cd ~/bettadayz
tar -xzf ~/bettadayz-deployment-final.tar.gz
rm ~/bettadayz-deployment-final.tar.gz

# Show what was extracted
echo "✅ Files extracted:"
ls -la

# Install Node.js if needed (check if already installed)
if ! command -v node &> /dev/null; then
    echo "📥 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Create environment file from template
cp .env.example .env.production

echo ""
echo "🎉 Deployment Complete!"
echo "=============================="
echo "✅ Application deployed to ~/bettadayz"
echo "✅ Dependencies installed"
echo "✅ Environment template created"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env.production with your actual environment variables"
echo "2. Run: npm start"
echo ""
echo "🔗 Application will be available on:"
echo "   http://localhost:3000 (or your configured port)"
EOF

echo ""
echo "🎉 BettaDayz PBBG Deployment Complete!"
echo "====================================="
echo ""
echo "🔗 To connect and start the application:"
echo "   ssh -p $PORT $USER@$SERVER"
echo "   cd ~/bettadayz"
echo "   npm start"
echo ""
echo "🌐 Your application is ready for both domains:"
echo "   https://bettadayz.shop"
echo "   https://bettadayz.store"