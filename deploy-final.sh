#!/bin/bash#!/bin/bash



# Final deployment with full paths (no symlinks needed)echo "🚀 Deploying BettaDayz PBBG to Production Server"

echo "🚀 BettaDayz PBBG - Final Deployment"echo "==============================================="

echo "==================================="

# Server details

sshpass -p '@Jgallow20' ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -p 65002 u933155252@194.195.84.72 << 'FINAL_DEPLOY'SERVER="194.195.84.72"

PORT="65002"

echo "🚀 Starting final deployment..."USER="u933155252"

cd ~/bettadayzPASSWORD="@Jgallow20"



# Use the Node.js we found directlyecho "📤 Uploading deployment package..."

NODE_PATH="/opt/alt/alt-nodejs18/root/usr/bin/node"

NPM_PATH="/opt/alt/alt-nodejs18/root/usr/bin/npm"# Upload the deployment package

NPX_PATH="/opt/alt/alt-nodejs18/root/usr/bin/npx"sshpass -p "$PASSWORD" scp -P $PORT -o StrictHostKeyChecking=no bettadayz-deployment-final.tar.gz $USER@$SERVER:~/



echo "🔍 Using Node.js at: $NODE_PATH"if [ $? -eq 0 ]; then

    echo "✅ Upload successful!"

# Verify Node.js workselse

if $NODE_PATH --version; then    echo "❌ Upload failed!"

    NODE_VERSION=$($NODE_PATH --version)    exit 1

    echo "✅ Node.js $NODE_VERSION is working"fi

else

    echo "❌ Node.js verification failed"echo "🔧 Setting up application on server..."

    exit 1

fi# Connect and setup

sshpass -p "$PASSWORD" ssh -p $PORT -o StrictHostKeyChecking=no $USER@$SERVER << 'EOF'

# Check npmecho "📂 Setting up BettaDayz PBBG..."

if [ -x "$NPM_PATH" ]; then

    echo "✅ npm found at: $NPM_PATH"# Create directory and extract

    NPM_CMD="$NPM_PATH"mkdir -p ~/bettadayz

elif [ -x "/opt/alt/alt-nodejs18/root/usr/bin/npm" ]; thencd ~/bettadayz

    NPM_CMD="/opt/alt/alt-nodejs18/root/usr/bin/npm"tar -xzf ~/bettadayz-deployment-final.tar.gz

elserm ~/bettadayz-deployment-final.tar.gz

    echo "❌ npm not found, trying to install..."

    # Download npm if not available# Show what was extracted

    curl -L https://www.npmjs.com/install.sh | $NODE_PATHecho "✅ Files extracted:"

    NPM_CMD="$NODE_PATH $(which npm)"ls -la

fi

# Install Node.js if needed (check if already installed)

echo "📦 Installing dependencies with: $NPM_CMD"if ! command -v node &> /dev/null; then

    echo "📥 Installing Node.js..."

# Install dependencies    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

if $NPM_CMD install; then    sudo apt-get install -y nodejs

    echo "✅ Dependencies installed successfully"fi

else

    echo "❌ Dependency installation failed"# Install dependencies

    # Try alternative npm installationecho "📦 Installing dependencies..."

    echo "🔄 Trying alternative npm..."npm ci --only=production

    $NODE_PATH -e "console.log('Node.js is working')"

    # Create environment file from template

    # Manual dependency installation if neededcp .env.example .env.production

    echo "Checking package.json..."

    cat package.json | head -20echo ""

    exit 1echo "🎉 Deployment Complete!"

fiecho "=============================="

echo "✅ Application deployed to ~/bettadayz"

echo "🔨 Building application..."echo "✅ Dependencies installed"

if $NPM_CMD run build; thenecho "✅ Environment template created"

    echo "✅ Application built successfully"echo ""

elseecho "📝 Next steps:"

    echo "❌ Build failed"echo "1. Edit .env.production with your actual environment variables"

    echo "Checking build errors..."echo "2. Run: npm start"

    $NPM_CMD run build 2>&1 | tail -20echo ""

    exit 1echo "🔗 Application will be available on:"

fiecho "   http://localhost:3000 (or your configured port)"

EOF

echo "🔧 Installing PM2..."

if $NPM_CMD install -g pm2; thenecho ""

    echo "✅ PM2 installed"echo "🎉 BettaDayz PBBG Deployment Complete!"

    PM2_CMD="/opt/alt/alt-nodejs18/root/usr/bin/pm2"echo "====================================="

    echo ""

    # If global PM2 not accessible, try local installecho "🔗 To connect and start the application:"

    if [ ! -x "$PM2_CMD" ]; thenecho "   ssh -p $PORT $USER@$SERVER"

        echo "🔄 Installing PM2 locally..."echo "   cd ~/bettadayz"

        $NPM_CMD install pm2echo "   npm start"

        PM2_CMD="./node_modules/.bin/pm2"echo ""

    fiecho "🌐 Your application is ready for both domains:"

elseecho "   https://bettadayz.shop"

    echo "🔄 Installing PM2 locally..."echo "   https://bettadayz.store"
    $NPM_CMD install pm2
    PM2_CMD="./node_modules/.bin/pm2"
fi

echo "🚀 Starting applications with PM2..."

# Stop any existing processes
$PM2_CMD delete all 2>/dev/null || true

# Start applications
if $PM2_CMD start ecosystem.config.js; then
    echo "💾 Saving PM2 configuration..."
    $PM2_CMD save 2>/dev/null || true
    
    echo "📊 Application status:"
    $PM2_CMD status
    
    echo ""
    echo "🎉 DEPLOYMENT SUCCESSFUL! 🎉"
    echo "============================="
    echo "✅ BettaDayz Shop: Running on port 3000"
    echo "✅ BettaDayz Store: Running on port 3001"
    echo ""
    echo "🌐 Access URLs:"
    echo "   - http://194.195.84.72:3000 (Shop)"
    echo "   - http://194.195.84.72:3001 (Store)"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Configure DNS to point domains to 194.195.84.72"
    echo "2. Set up SSL certificates"
    echo "3. Configure reverse proxy if needed"
    echo ""
    
    # Show logs
    echo "📜 Recent logs:"
    $PM2_CMD logs --lines 5 2>/dev/null || true
    
else
    echo "❌ PM2 startup failed, trying manual start..."
    
    # Manual startup as fallback
    echo "🔄 Starting applications manually..."
    
    # Start shop on port 3000
    echo "Starting shop on port 3000..."
    nohup $NODE_PATH ./server.js > shop.log 2>&1 &
    SHOP_PID=$!
    echo "Shop started with PID: $SHOP_PID"
    
    # Start store on port 3001
    echo "Starting store on port 3001..."
    PORT=3001 nohup $NODE_PATH ./server.js > store.log 2>&1 &
    STORE_PID=$!
    echo "Store started with PID: $STORE_PID"
    
    echo ""
    echo "🎉 MANUAL DEPLOYMENT COMPLETED!"
    echo "=============================="
    echo "✅ Shop PID: $SHOP_PID (port 3000)"
    echo "✅ Store PID: $STORE_PID (port 3001)"
    echo ""
    echo "Check logs:"
    echo "  tail -f ~/bettadayz/shop.log"
    echo "  tail -f ~/bettadayz/store.log"
fi

# Test if applications are responding
echo ""
echo "🧪 Testing applications..."
sleep 3

# Test shop
if curl -s -o /dev/null -w "%{http_code}" localhost:3000 | grep -q "200\|404\|301\|302"; then
    echo "✅ Shop is responding on port 3000"
else
    echo "⚠️  Shop may not be responding on port 3000"
fi

# Test store  
if curl -s -o /dev/null -w "%{http_code}" localhost:3001 | grep -q "200\|404\|301\|302"; then
    echo "✅ Store is responding on port 3001"
else
    echo "⚠️  Store may not be responding on port 3001"
fi

echo ""
echo "🎯 DEPLOYMENT COMPLETED!"
echo "========================"
echo "Your BettaDayz PBBG is now running!"

FINAL_DEPLOY

echo ""
echo "🎉 Final deployment script completed!"
echo "===================================="