#!/bin/bash
set -e

echo "🚀 BettaDayz PBBG - Full Stack Deployment"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration (read from environment; do NOT hardcode secrets)
# Provide these when running the script:
#   - CLOUDFLARE_API_TOKEN or CF_API_TOKEN
#   - CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-9b9fcaead55610e5dd235878e702ee69}"
# Prefer CF_API_TOKEN if set (Wrangler convention), then CLOUDFLARE_API_TOKEN
CLOUDFLARE_API_TOKEN="${CF_API_TOKEN:-${CLOUDFLARE_API_TOKEN:-}}"
SUPABASE_URL="https://dqirldrlusrmodkwlnqy.supabase.co"

echo -e "${BLUE}Verifying Cloudflare token...${NC}"
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo -e "${RED}✗ CLOUDFLARE_API_TOKEN/CF_API_TOKEN is not set.${NC}"
    echo "Set it just for this run, for example:"
    echo "  CLOUDFLARE_API_TOKEN=*** CLOUDFLARE_ACCOUNT_ID=$CLOUDFLARE_ACCOUNT_ID ./deploy-full-stack.sh"
    exit 1
fi

TOKEN_STATUS=$(curl -s "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/tokens/verify" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" | jq -r '.success')

if [ "$TOKEN_STATUS" = "true" ]; then
        echo -e "${GREEN}✓ Cloudflare token is valid${NC}"
else
        echo -e "${RED}✗ Cloudflare token is invalid for account $CLOUDFLARE_ACCOUNT_ID${NC}"
        exit 1
fi

# Clean build
echo -e "${BLUE}Cleaning previous build...${NC}"
rm -rf .next

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install --legacy-peer-deps

# Build application
echo -e "${BLUE}Building application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build successful${NC}"
echo ""
echo -e "${YELLOW}Deployment Options:${NC}"
echo "1. Deploy to Cloudflare Pages (with Next-on-Pages for SSR)"
case $choice in
    1)
        echo -e "${BLUE}Installing Wrangler...${NC}"
        npm install -g wrangler 2>/dev/null || true

        echo -e "${BLUE}Building for Cloudflare Pages (Next-on-Pages)...${NC}"
        # Build Next.js app for Cloudflare Pages with SSR support
        npx @cloudflare/next-on-pages@latest --experimental-minify

        echo -e "${BLUE}Deploying to Cloudflare Pages...${NC}"
        CF_API_TOKEN="$CLOUDFLARE_API_TOKEN" \
        CLOUDFLARE_API_TOKEN="$CLOUDFLARE_API_TOKEN" \
        CLOUDFLARE_ACCOUNT_ID="$CLOUDFLARE_ACCOUNT_ID" \
        npx wrangler pages deploy out \
            --project-name=bettadayz-pbbg \
            --branch=main \
            --commit-dirty=true

        echo -e "${GREEN}✓ Deployed to Cloudflare Pages${NC}"
        echo "Configure domain at: https://dash.cloudflare.com/"
        ;;
    2)
        echo -e "${BLUE}Starting local server...${NC}"
        echo "Server will run on http://localhost:3000"
        npm run start
        ;;
    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✓ Deployment Complete!${NC}"
echo ""
echo "📋 Post-Deployment Checklist:"
echo "1. Apply database schema: supabase/migrations/001_initial_schema.sql"
echo "2. Configure Auth in Supabase Dashboard"
echo "3. Test routes: /, /town, /todos, /test-supabase"
echo ""
