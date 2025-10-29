# 🚀 BettaDayz PBBG - Manual Setup Commands
# Copy and paste these commands one by one into your SSH session

# 1. Connect to your server first:
# ssh -p 65002 u933155252@194.195.84.72
# Password: @Jgallow20

# 2. Navigate to the application directory:
cd ~/bettadayz

# 3. Add Node.js to PATH for this session:
echo 'export PATH=/home/u933155252/bettadayz/node-v18.19.0-linux-x64/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# 4. Test Node.js installation:
/home/u933155252/bettadayz/node-v18.19.0-linux-x64/bin/node --version
/home/u933155252/bettadayz/node-v18.19.0-linux-x64/bin/npm --version

# 5. Install dependencies:
/home/u933155252/bettadayz/node-v18.19.0-linux-x64/bin/npm install --production --legacy-peer-deps

# 6. Create environment file:
cat > .env.production << 'EOF'
NODE_ENV=production
JWT_SECRET=9=N6H//qQ]?g+BDV
NEXT_PUBLIC_SHOP_DOMAIN=bettadayz.shop
NEXT_PUBLIC_STORE_DOMAIN=bettadayz.store
EOF

# 7. Create shop-specific environment:
cp .env.production .env.shop
echo 'PORT=3000' >> .env.shop
echo 'NEXT_PUBLIC_DOMAIN=bettadayz.shop' >> .env.shop

# 8. Create store-specific environment:
cp .env.production .env.store
echo 'PORT=3001' >> .env.store
echo 'NEXT_PUBLIC_DOMAIN=bettadayz.store' >> .env.store

# 9. Install PM2:
/home/u933155252/bettadayz/node-v18.19.0-linux-x64/bin/npm install -g pm2

# 10. Create PM2 ecosystem configuration:
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'bettadayz-shop',
      script: '/home/u933155252/bettadayz/node-v18.19.0-linux-x64/bin/npm',
      args: 'start',
      cwd: '/home/u933155252/bettadayz',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_DOMAIN: 'bettadayz.shop',
        JWT_SECRET: '9=N6H//qQ]?g+BDV'
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G'
    },
    {
      name: 'bettadayz-store',
      script: '/home/u933155252/bettadayz/node-v18.19.0-linux-x64/bin/npm',
      args: 'start',
      cwd: '/home/u933155252/bettadayz',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        NEXT_PUBLIC_DOMAIN: 'bettadayz.store',
        JWT_SECRET: '9=N6H//qQ]?g+BDV'
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G'
    }
  ]
};
EOF

# 11. Start both applications:
/home/u933155252/bettadayz/node-v18.19.0-linux-x64/bin/pm2 start ecosystem.config.js

# 12. Save PM2 configuration:
/home/u933155252/bettadayz/node-v18.19.0-linux-x64/bin/pm2 save

# 13. Check status:
/home/u933155252/bettadayz/node-v18.19.0-linux-x64/bin/pm2 status

# 14. View logs:
/home/u933155252/bettadayz/node-v18.19.0-linux-x64/bin/pm2 logs --lines 10

# 🎉 Your applications should now be running on:
# Shop (bettadayz.shop): http://194.195.84.72:3000
# Store (bettadayz.store): http://194.195.84.72:3001

echo "✅ BettaDayz PBBG deployment complete!"
echo "🎮 Shop: http://194.195.84.72:3000"
echo "🛒 Store: http://194.195.84.72:3001"