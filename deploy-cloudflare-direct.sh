#!/bin/bash

# BettaDayz PBBG Cloudflare Worker Direct Deployment
# Uses Cloudflare REST API with provided token

TOKEN="after9b9fcaead55610e5dd235878e702ee69"
ACCOUNT_ID=""  # Will be fetched
WORKER_NAME="bettadayz-pbbg"

echo "🚀 BettaDayz PBBG Direct Cloudflare Deployment"
echo "=============================================="
echo "🔐 Token: after9b9fcaead55610e5dd235878e702ee69"
echo ""

# First, get account ID
echo "📋 Fetching account information..."
ACCOUNTS_RESPONSE=$(curl -s -X GET "https://api.cloudflare.com/client/v4/accounts" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "Account response: $ACCOUNTS_RESPONSE"

# Extract account ID (assuming first account)
ACCOUNT_ID=$(echo $ACCOUNTS_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$ACCOUNT_ID" ]; then
    echo "❌ Could not retrieve account ID. Token may need different permissions."
    echo "💡 Manual deployment required via Cloudflare Dashboard"
    echo ""
    echo "🌐 Manual Deployment Steps:"
    echo "1. Go to https://dash.cloudflare.com"
    echo "2. Navigate to Workers & Pages"
    echo "3. Create Worker named 'bettadayz-pbbg'"
    echo "4. Copy code from deployment-package/cloudflare-worker.js"
    echo "5. Set environment variables:"
    echo "   - SERVER_IP: 194.195.84.72"
    echo "   - SHOP_PORT: 3000"
    echo "   - STORE_PORT: 3001"
    echo "   - JWT_SECRET: 9=N6H//qQ]?g+BDV"
    echo "   - WORKER_TOKEN: after9b9fcaead55610e5dd235878e702ee69"
    echo "6. Add custom domains: bettadayz.shop, bettadayz.store"
    exit 1
fi

echo "✅ Account ID: $ACCOUNT_ID"

# Read the worker script
WORKER_SCRIPT=$(cat deployment-package/cloudflare-worker.js)

# Create Worker
echo "🚀 Deploying Worker..."
DEPLOY_RESPONSE=$(curl -s -X PUT "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/scripts/$WORKER_NAME" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/javascript" \
  --data "$WORKER_SCRIPT")

echo "Deploy response: $DEPLOY_RESPONSE"

# Set environment variables
echo "⚙️  Setting environment variables..."
ENV_VARS='{
  "SERVER_IP": "194.195.84.72",
  "SHOP_PORT": "3000", 
  "STORE_PORT": "3001",
  "JWT_SECRET": "9=N6H//qQ]?g+BDV",
  "WORKER_TOKEN": "after9b9fcaead55610e5dd235878e702ee69",
  "NODE_ENV": "production"
}'

ENV_RESPONSE=$(curl -s -X PATCH "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/scripts/$WORKER_NAME/settings" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data "{\"settings\": {\"env_vars\": $ENV_VARS}}")

echo "Environment response: $ENV_RESPONSE"

echo ""
echo "✅ Cloudflare Worker Deployment Complete!"
echo "🌐 Worker URL: https://$WORKER_NAME.$ACCOUNT_ID.workers.dev"
echo ""
echo "🎯 Next: Configure custom domains bettadayz.shop/store to point to this Worker"