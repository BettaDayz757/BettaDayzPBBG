#!/bin/bash

# Extract Node.js on CloudLinux using available tools
echo "🔧 Extracting Node.js for CloudLinux..."

# Function to extract Node.js manually
extract_nodejs() {
    local nodejs_file="node-v18.18.0-linux-x64.tar.xz"
    
    echo "📦 Attempting to extract $nodejs_file..."
    
    # Try different extraction methods
    if command -v unxz >/dev/null 2>&1; then
        echo "Using unxz..."
        unxz "$nodejs_file" && tar -xf "node-v18.18.0-linux-x64.tar"
    elif command -v xz >/dev/null 2>&1; then
        echo "Using xz..."
        xz -d "$nodejs_file" && tar -xf "node-v18.18.0-linux-x64.tar"
    elif python3 -c "import lzma" 2>/dev/null; then
        echo "Using Python3 lzma..."
        python3 -c "
import lzma
import tarfile
import shutil

# Extract xz file
with lzma.LZMAFile('$nodejs_file', 'rb') as f_in:
    with open('node-v18.18.0-linux-x64.tar', 'wb') as f_out:
        shutil.copyfileobj(f_in, f_out)

# Extract tar file
with tarfile.open('node-v18.18.0-linux-x64.tar', 'r') as tar:
    tar.extractall()

print('✅ Extraction successful!')
"
    elif command -v gunzip >/dev/null 2>&1; then
        echo "Converting to gzip format..."
        # Download gzip version instead
        rm -f "$nodejs_file"
        wget -O "node-v18.18.0-linux-x64.tar.gz" "https://nodejs.org/dist/v18.18.0/node-v18.18.0-linux-x64.tar.gz"
        tar -xzf "node-v18.18.0-linux-x64.tar.gz"
    else
        echo "❌ No suitable extraction tool found"
        return 1
    fi
    
    return $?
}

# Run SSH command to extract Node.js
sshpass -p '@Jgallow20' ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -p 65002 u933155252@194.195.84.72 << 'EOF'
cd ~/bettadayz

# Function to extract Node.js manually
extract_nodejs() {
    local nodejs_file="node-v18.18.0-linux-x64.tar.xz"
    
    echo "📦 Attempting to extract $nodejs_file..."
    
    # Check if file exists
    if [ ! -f "$nodejs_file" ]; then
        echo "❌ File not found: $nodejs_file"
        return 1
    fi
    
    # Try Python3 extraction first (most reliable)
    if python3 -c "import lzma" 2>/dev/null; then
        echo "🐍 Using Python3 lzma..."
        python3 -c "
import lzma
import tarfile
import shutil
import os

print('Extracting $nodejs_file...')

try:
    # Extract xz file
    with lzma.LZMAFile('$nodejs_file', 'rb') as f_in:
        with open('node-v18.18.0-linux-x64.tar', 'wb') as f_out:
            shutil.copyfileobj(f_in, f_out)
    
    print('XZ extraction complete, extracting tar...')
    
    # Extract tar file
    with tarfile.open('node-v18.18.0-linux-x64.tar', 'r') as tar:
        tar.extractall()
    
    print('✅ Extraction successful!')
    
    # Clean up
    os.remove('node-v18.18.0-linux-x64.tar')
    
except Exception as e:
    print(f'❌ Python extraction failed: {e}')
    exit(1)
"
        return $?
    fi
    
    # Try downloading gzip version if xz extraction fails
    echo "📥 Downloading gzip version instead..."
    rm -f "$nodejs_file"
    if wget -O "node-v18.18.0-linux-x64.tar.gz" "https://nodejs.org/dist/v18.18.0/node-v18.18.0-linux-x64.tar.gz"; then
        echo "🔧 Extracting gzip version..."
        tar -xzf "node-v18.18.0-linux-x64.tar.gz"
        return $?
    else
        echo "❌ Failed to download gzip version"
        return 1
    fi
}

# Extract Node.js
if extract_nodejs; then
    echo "✅ Node.js extracted successfully"
    
    # Move to standard location
    if [ -d "node-v18.18.0-linux-x64" ]; then
        echo "📁 Setting up Node.js..."
        
        # Create local bin directory
        mkdir -p ~/bin
        
        # Copy binaries
        cp node-v18.18.0-linux-x64/bin/* ~/bin/
        
        # Add to PATH
        echo 'export PATH=$HOME/bin:$PATH' >> ~/.bashrc
        
        # Make binaries executable
        chmod +x ~/bin/node ~/bin/npm ~/bin/npx
        
        # Test installation
        ~/bin/node --version
        ~/bin/npm --version
        
        echo "✅ Node.js setup complete!"
        echo "🔄 Please reload your shell or run: source ~/.bashrc"
        
        # Try to install PM2
        echo "📦 Installing PM2..."
        ~/bin/npm install -g pm2
        
        if [ $? -eq 0 ]; then
            echo "✅ PM2 installed successfully"
            
            # Start applications
            echo "🚀 Starting applications..."
            cd ~/bettadayz
            
            # Install dependencies
            ~/bin/npm install
            
            # Build application
            ~/bin/npm run build
            
            # Start with PM2
            ~/bin/pm2 start ecosystem.config.js
            ~/bin/pm2 save
            ~/bin/pm2 startup
            
            echo "🎉 Deployment complete!"
            ~/bin/pm2 status
        else
            echo "❌ PM2 installation failed"
        fi
    else
        echo "❌ Node.js directory not found after extraction"
    fi
else
    echo "❌ Node.js extraction failed"
    echo "📝 Please contact Hostinger support to enable Node.js"
fi
EOF

echo "🎉 Node.js extraction attempt completed!"