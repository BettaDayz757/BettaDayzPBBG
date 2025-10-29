#!/bin/bash

# Comprehensive Node.js installation and deployment for CloudLinux/Hostinger
echo "🚀 BettaDayz PBBG - Complete Deployment Script"
echo "=============================================="

# Function to check and setup Node.js
setup_nodejs() {
    echo "🔍 Checking for Node.js..."
    
    # Check if Node.js is already available
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node --version)
        echo "✅ Node.js found: $NODE_VERSION"
        return 0
    fi
    
    # Check for Node.js in common Hostinger locations
    HOSTINGER_NODE_PATHS=(
        "/usr/local/lsws/lsphp81/bin/node"
        "/usr/local/bin/node"
        "/opt/alt/alt-nodejs16/root/usr/bin/node"
        "/opt/alt/alt-nodejs18/root/usr/bin/node"
        "/usr/bin/node"
        "~/.nvm/versions/node/*/bin/node"
    )
    
    for path in "${HOSTINGER_NODE_PATHS[@]}"; do
        if [ -x "$path" ]; then
            echo "✅ Found Node.js at: $path"
            # Create symlink in user bin
            mkdir -p ~/bin
            ln -sf "$path" ~/bin/node
            ln -sf "$(dirname $path)/npm" ~/bin/npm 2>/dev/null || true
            ln -sf "$(dirname $path)/npx" ~/bin/npx 2>/dev/null || true
            export PATH="$HOME/bin:$PATH"
            echo 'export PATH=$HOME/bin:$PATH' >> ~/.bashrc
            return 0
        fi
    done
    
    echo "📥 Node.js not found, installing manually..."
    
    # Download and install Node.js manually
    cd ~/bettadayz
    
    # Try gzip version first (more compatible)
    if wget -O "node-v18.18.0-linux-x64.tar.gz" "https://nodejs.org/dist/v18.18.0/node-v18.18.0-linux-x64.tar.gz"; then
        echo "📦 Extracting Node.js..."
        tar -xzf "node-v18.18.0-linux-x64.tar.gz"
        
        if [ -d "node-v18.18.0-linux-x64" ]; then
            echo "📁 Setting up Node.js..."
            
            # Create local bin directory
            mkdir -p ~/bin
            
            # Copy binaries
            cp node-v18.18.0-linux-x64/bin/* ~/bin/
            
            # Add to PATH
            echo 'export PATH=$HOME/bin:$PATH' >> ~/.bashrc
            export PATH="$HOME/bin:$PATH"
            
            # Make binaries executable
            chmod +x ~/bin/node ~/bin/npm ~/bin/npx
            
            # Test installation
            ~/bin/node --version
            ~/bin/npm --version
            
            # Clean up
            rm -rf node-v18.18.0-linux-x64*
            
            echo "✅ Node.js setup complete!"
            return 0
        else
            echo "❌ Node.js extraction failed"
            return 1
        fi
    else
        echo "❌ Failed to download Node.js"
        return 1
    fi
}

# Function to install dependencies and build
build_application() {
    echo "📦 Installing dependencies..."
    
    cd ~/bettadayz
    
    # Use the appropriate npm command
    NPM_CMD="npm"
    if [ -x ~/bin/npm ]; then
        NPM_CMD="~/bin/npm"
    fi
    
    # Install dependencies
    $NPM_CMD install
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        return 1
    fi
    
    echo "🔨 Building application..."
    $NPM_CMD run build
    
    if [ $? -ne 0 ]; then
        echo "❌ Build failed"
        return 1
    fi
    
    echo "✅ Build successful!"
    return 0
}

# Function to setup PM2 and start applications
setup_pm2() {
    echo "🔧 Setting up PM2..."
    
    cd ~/bettadayz
    
    # Use the appropriate npm command
    NPM_CMD="npm"
    if [ -x ~/bin/npm ]; then
        NPM_CMD="~/bin/npm"
    fi
    
    # Install PM2 globally
    $NPM_CMD install -g pm2
    
    if [ $? -ne 0 ]; then
        echo "❌ PM2 installation failed"
        return 1
    fi
    
    # Use PM2 binary
    PM2_CMD="pm2"
    if [ -x ~/bin/pm2 ]; then
        PM2_CMD="~/bin/pm2"
    fi
    
    echo "🚀 Starting applications..."
    
    # Stop any existing processes
    $PM2_CMD delete all 2>/dev/null || true
    
    # Start applications
    $PM2_CMD start ecosystem.config.js
    
    if [ $? -eq 0 ]; then
        echo "💾 Saving PM2 configuration..."
        $PM2_CMD save
        
        echo "🔄 Setting up PM2 startup..."
        $PM2_CMD startup 2>/dev/null || true
        
        echo "📊 Application status:"
        $PM2_CMD status
        
        echo "✅ Applications started successfully!"
        return 0
    else
        echo "❌ Failed to start applications"
        return 1
    fi
}

# Function to check hosting control panel for Node.js
check_hosting_panel() {
    echo "💡 IMPORTANT: Hostinger Control Panel Options"
    echo "============================================="
    echo "If this script fails, try these steps:"
    echo ""
    echo "1. Login to Hostinger hPanel: https://hpanel.hostinger.com/"
    echo "2. Go to 'Website' section"
    echo "3. Select 'Advanced' → 'SSH Access'"
    echo "4. Enable Node.js if available"
    echo ""
    echo "OR:"
    echo ""
    echo "1. Go to 'Website Settings'"
    echo "2. Look for 'Node.js' or 'Application Manager'"
    echo "3. Enable Node.js support"
    echo ""
    echo "Contact Hostinger support if Node.js is not available"
    echo "============================================="
}

# Run SSH deployment command
sshpass -p '@Jgallow20' ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -p 65002 u933155252@194.195.84.72 << 'DEPLOYMENT_SCRIPT'

# BettaDayz PBBG Deployment Script (Server-side)
echo "🚀 Starting BettaDayz PBBG deployment..."
echo "========================================"

cd ~/bettadayz

# Function to check and setup Node.js
setup_nodejs() {
    echo "🔍 Checking for Node.js..."
    
    # Check if Node.js is already available
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node --version)
        echo "✅ Node.js found: $NODE_VERSION"
        return 0
    fi
    
    # Check for Node.js in common Hostinger locations
    HOSTINGER_NODE_PATHS=(
        "/usr/local/lsws/lsphp81/bin/node"
        "/usr/local/bin/node" 
        "/opt/alt/alt-nodejs16/root/usr/bin/node"
        "/opt/alt/alt-nodejs18/root/usr/bin/node"
        "/usr/bin/node"
    )
    
    for path in "${HOSTINGER_NODE_PATHS[@]}"; do
        if [ -x "$path" ] 2>/dev/null; then
            echo "✅ Found Node.js at: $path"
            # Create symlink in user bin
            mkdir -p ~/bin
            ln -sf "$path" ~/bin/node
            # Try to find npm/npx in same directory
            if [ -x "$(dirname $path)/npm" ]; then
                ln -sf "$(dirname $path)/npm" ~/bin/npm
            fi
            if [ -x "$(dirname $path)/npx" ]; then
                ln -sf "$(dirname $path)/npx" ~/bin/npx
            fi
            export PATH="$HOME/bin:$PATH"
            echo 'export PATH=$HOME/bin:$PATH' >> ~/.bashrc
            return 0
        fi
    done
    
    echo "📥 Node.js not found, downloading..."
    
    # Download and install Node.js manually (gzip version)
    if wget -q -O "node-v18.18.0-linux-x64.tar.gz" "https://nodejs.org/dist/v18.18.0/node-v18.18.0-linux-x64.tar.gz"; then
        echo "📦 Extracting Node.js..."
        
        if tar -xzf "node-v18.18.0-linux-x64.tar.gz" 2>/dev/null; then
            if [ -d "node-v18.18.0-linux-x64" ]; then
                echo "📁 Setting up Node.js..."
                
                # Create local bin directory
                mkdir -p ~/bin
                
                # Copy binaries
                cp node-v18.18.0-linux-x64/bin/* ~/bin/ 2>/dev/null
                
                # Add to PATH
                echo 'export PATH=$HOME/bin:$PATH' >> ~/.bashrc
                export PATH="$HOME/bin:$PATH"
                
                # Make binaries executable
                chmod +x ~/bin/node ~/bin/npm ~/bin/npx 2>/dev/null
                
                # Test installation
                if ~/bin/node --version >/dev/null 2>&1; then
                    echo "✅ Node.js $(~/bin/node --version) installed successfully!"
                    
                    # Clean up
                    rm -rf node-v18.18.0-linux-x64*
                    return 0
                else
                    echo "❌ Node.js installation verification failed"
                fi
            fi
        else
            echo "❌ Failed to extract Node.js"
        fi
        
        rm -f node-v18.18.0-linux-x64.tar.gz
    else
        echo "❌ Failed to download Node.js"
    fi
    
    return 1
}

# Function to build and start applications
deploy_application() {
    echo "📦 Installing dependencies..."
    
    # Determine npm command
    NPM_CMD="npm"
    if [ -x ~/bin/npm ]; then
        NPM_CMD="~/bin/npm"
    elif command -v npm >/dev/null 2>&1; then
        NPM_CMD="npm"
    else
        echo "❌ npm not found"
        return 1
    fi
    
    # Install dependencies
    if $NPM_CMD install; then
        echo "✅ Dependencies installed"
    else
        echo "❌ Failed to install dependencies"
        return 1
    fi
    
    echo "🔨 Building application..."
    if $NPM_CMD run build; then
        echo "✅ Build successful"
    else
        echo "❌ Build failed"
        return 1
    fi
    
    echo "🔧 Setting up PM2..."
    if $NPM_CMD install -g pm2; then
        echo "✅ PM2 installed"
        
        # Determine PM2 command
        PM2_CMD="pm2"
        if [ -x ~/bin/pm2 ]; then
            PM2_CMD="~/bin/pm2"
        fi
        
        echo "🚀 Starting applications..."
        
        # Stop existing processes
        $PM2_CMD delete all 2>/dev/null || true
        
        # Start new processes
        if $PM2_CMD start ecosystem.config.js; then
            echo "💾 Saving PM2 configuration..."
            $PM2_CMD save
            
            echo "📊 Application status:"
            $PM2_CMD status
            
            echo ""
            echo "🎉 DEPLOYMENT SUCCESSFUL! 🎉"
            echo "============================="
            echo "✅ BettaDayz Shop: http://bettadayz.shop:3000"
            echo "✅ BettaDayz Store: http://bettadayz.store:3001"
            echo ""
            echo "Next steps:"
            echo "1. Configure DNS to point domains to 194.195.84.72"
            echo "2. Set up SSL certificates"
            echo "3. Configure environment variables"
            echo ""
            return 0
        else
            echo "❌ Failed to start applications with PM2"
            
            # Try manual start as fallback
            echo "🔄 Attempting manual start..."
            NODE_CMD="node"
            if [ -x ~/bin/node ]; then
                NODE_CMD="~/bin/node"
            fi
            
            # Start shop on port 3000
            nohup $NODE_CMD server.js > shop.log 2>&1 &
            SHOP_PID=$!
            echo "Started shop on PID $SHOP_PID"
            
            # Start store on port 3001  
            PORT=3001 nohup $NODE_CMD server.js > store.log 2>&1 &
            STORE_PID=$!
            echo "Started store on PID $STORE_PID"
            
            echo "Manual startup attempted - check logs for issues"
            return 0
        fi
    else
        echo "❌ PM2 installation failed"
        return 1
    fi
}

# Main deployment process
if setup_nodejs; then
    echo "✅ Node.js setup complete"
    
    if deploy_application; then
        echo "🎉 Deployment completed successfully!"
    else
        echo "❌ Application deployment failed"
        echo ""
        echo "💡 TROUBLESHOOTING:"
        echo "1. Check if Node.js is enabled in Hostinger control panel"
        echo "2. Contact Hostinger support for Node.js assistance"
        echo "3. Check application logs for errors"
    fi
else
    echo "❌ Node.js setup failed"
    echo ""
    echo "💡 MANUAL STEPS REQUIRED:"
    echo "1. Login to Hostinger hPanel: https://hpanel.hostinger.com/"
    echo "2. Enable Node.js in hosting settings"
    echo "3. Re-run this deployment script"
    echo ""
    echo "OR contact Hostinger support for Node.js installation"
fi

DEPLOYMENT_SCRIPT

echo ""
echo "🎉 Deployment script completed!"
echo "=============================="