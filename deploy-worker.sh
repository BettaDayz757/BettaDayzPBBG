#!/bin/bash

# BettaDayz PBBG Cloudflare Worker Deployment Script
# Token: after9b9fcaead55610e5dd235878e702ee69

echo "🌐 Deploying BettaDayz PBBG Cloudflare Worker..."
echo "================================================"

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "📦 Installing Wrangler CLI..."
    npm install -g wrangler
fi

# Authenticate with Cloudflare (if needed)
echo "🔐 Authenticating with Cloudflare..."
echo "Token: after9b9fcaead55610e5dd235878e702ee69"

# Set API token
export CLOUDFLARE_API_TOKEN="after9b9fcaead55610e5dd235878e702ee69"

# Deploy the worker
echo "🚀 Deploying BettaDayz Worker..."
wrangler deploy cloudflare-worker.js --name bettadayz-pbbg

# Set up custom domains (if you have the domains added to Cloudflare)
echo "🌍 Configuring custom domain routes..."

# bettadayz.shop routing
echo "Setting up bettadayz.shop..."
wrangler route add "bettadayz.shop/*" bettadayz-pbbg --zone bettadayz.shop || echo "⚠️  Domain not found in Cloudflare - add bettadayz.shop to your Cloudflare account first"

# bettadayz.store routing  
echo "Setting up bettadayz.store..."
wrangler route add "bettadayz.store/*" bettadayz-pbbg --zone bettadayz.store || echo "⚠️  Domain not found in Cloudflare - add bettadayz.store to your Cloudflare account first"

# Test the worker
echo "🧪 Testing worker deployment..."
curl -s "https://bettadayz-pbbg.bettadayz.workers.dev" | head -10

echo ""
echo "✅ BettaDayz Worker Deployment Complete!"
echo "========================================"
echo "🌐 Worker URL: https://bettadayz-pbbg.bettadayz.workers.dev"
echo "🏪 Shop Route: bettadayz.shop → 194.195.84.72:3000"
echo "🛒 Store Route: bettadayz.store → 194.195.84.72:3001"
echo "🔐 Token: after9b9fcaead55610e5dd235878e702ee69"
echo ""
echo "📋 Next Steps:"
echo "1. Add your domains to Cloudflare (if not already done)"
echo "2. Update domain DNS to point to Cloudflare"
echo "3. Configure SSL settings in Cloudflare dashboard"
echo "4. Test domain routing once DNS propagates"
echo ""
echo "🎮 Your BettaDayz PBBG is now accessible via:"
echo "   • https://bettadayz-pbbg.bettadayz.workers.dev (immediate)"
echo "   • https://bettadayz.shop (after DNS setup)"  
echo "   • https://bettadayz.store (after DNS setup)"