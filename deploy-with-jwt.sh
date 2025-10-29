#!/bin/bash

echo "🔐 BettaDayz PBBG - JWT Secret Configuration & Deployment"
echo "======================================================="

# Create production environment file with JWT secret
cat > .env.production << 'EOF'
# BettaDayz PBBG Production Environment
# JWT Secret: 9=N6H//qQ]?g+BDV

# ======================================
# SUPABASE CONFIGURATION
# ======================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# ======================================
# SECURITY & AUTHENTICATION
# ======================================
JWT_SECRET=9=N6H//qQ]?g+BDV

# ======================================
# DOMAIN CONFIGURATION
# ======================================
NEXT_PUBLIC_SHOP_DOMAIN=bettadayz.shop
NEXT_PUBLIC_STORE_DOMAIN=bettadayz.store

# ======================================
# PRODUCTION SETTINGS
# ======================================
NODE_ENV=production
PORT=3000

# ======================================
# GAME SETTINGS
# ======================================
BETTABUCKZ_EXCHANGE_RATE=100
MAX_GUILD_MEMBERS=50
TOURNAMENT_ENTRY_FEE=1000
DAILY_LOGIN_BONUS=100

# ======================================
# RATE LIMITING
# ======================================
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
SESSION_TIMEOUT=86400000
EOF

echo "✅ Created production environment file with JWT secret"

# Create separate files for shop and store domains
cat > .env.production.shop << 'EOF'
# BettaDayz Shop Domain Environment
JWT_SECRET=9=N6H//qQ]?g+BDV
NEXT_PUBLIC_DOMAIN=bettadayz.shop
PORT=3000
NODE_ENV=production
EOF

cat > .env.production.store << 'EOF'
# BettaDayz Store Domain Environment  
JWT_SECRET=9=N6H//qQ]?g+BDV
NEXT_PUBLIC_DOMAIN=bettadayz.store
PORT=3001
NODE_ENV=production
EOF

echo "✅ Created domain-specific environment files"

# Rebuild with new configuration
echo "🔨 Building application with JWT secret..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful with JWT configuration"
else
    echo "❌ Build failed"
    exit 1
fi

# Create new deployment package
echo "📦 Creating deployment package..."
tar -czf bettadayz-jwt-deployment.tar.gz .next package.json package-lock.json next.config.ts app lib .env.production .env.production.shop .env.production.store supabase-jwt-config.sql

echo "✅ Deployment package created: bettadayz-jwt-deployment.tar.gz"

echo ""
echo "🎯 Next Steps:"
echo "1. Upload to server: scp -P 65002 bettadayz-jwt-deployment.tar.gz u933155252@194.195.84.72:~/"
echo "2. Run Supabase SQL: Execute supabase-jwt-config.sql in your Supabase project"
echo "3. Configure Supabase project settings with JWT secret: 9=N6H//qQ]?g+BDV"
echo "4. Deploy to both domains"
echo ""
echo "🔐 JWT Secret configured: 9=N6H//qQ]?g+BDV"