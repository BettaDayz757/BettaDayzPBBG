#!/bin/bash

# BettaDayz PBBG - Cloudflare Secrets Configuration
# Configures secrets for Cloudflare Workers deployment

set -e

echo "☁️  BettaDayz PBBG - Cloudflare Secrets Setup"
echo "============================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${YELLOW}⚠️  Wrangler CLI not found. Installing...${NC}"
    npm install -g wrangler
fi

# Check if user is logged in
if ! wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}🔐 Please log in to Cloudflare first...${NC}"
    wrangler login
fi

echo ""
echo -e "${BLUE}📋 Required Secrets for Cloudflare Workers${NC}"
echo "This script will configure sensitive environment variables as Cloudflare secrets."
echo ""

# Load .env.local if it exists
if [[ -f ".env.local" ]]; then
    echo -e "${BLUE}📁 Loading environment from .env.local...${NC}"
    set -a
    source .env.local
    set +a
else
    echo -e "${YELLOW}⚠️  .env.local not found. Please enter values manually.${NC}"
fi

# Function to set Cloudflare secret
set_secret() {
    local secret_name="$1"
    local secret_value="$2"
    local description="$3"
    
    if [[ -n "$secret_value" ]]; then
        echo ""
        echo -e "${YELLOW}🔑 Setting $secret_name...${NC}"
        echo "$secret_value" | wrangler secret put "$secret_name" --name bettadayz-pbbg
        if [[ $? -eq 0 ]]; then
            echo -e "${GREEN}✅ $secret_name configured successfully${NC}"
        else
            echo -e "${RED}❌ Failed to set $secret_name${NC}"
        fi
    else
        echo -e "${RED}❌ $secret_name is empty. Skipping...${NC}"
        echo "   $description"
    fi
}

# Configure secrets
echo ""
echo -e "${BLUE}🔐 Configuring Cloudflare Secrets...${NC}"

set_secret "JWT_SECRET" "$JWT_SECRET" "Used for JWT token signing"
set_secret "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_ROLE_KEY" "Used for Supabase admin operations"
set_secret "CASHAPP_API_KEY" "$CASHAPP_API_KEY" "Used for Cash App payment processing"
set_secret "BITCOIN_WALLET_ADDRESS" "$BITCOIN_WALLET_ADDRESS" "Used for Bitcoin payment receiving"
set_secret "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET" "Used for NextAuth session encryption"

# Optional secrets
if [[ -n "$SENDGRID_API_KEY" ]]; then
    set_secret "SENDGRID_API_KEY" "$SENDGRID_API_KEY" "Used for email notifications"
fi

if [[ -n "$GOOGLE_ANALYTICS_ID" ]]; then
    set_secret "GOOGLE_ANALYTICS_ID" "$GOOGLE_ANALYTICS_ID" "Used for analytics tracking"
fi

echo ""
echo -e "${BLUE}📋 Secrets Configuration Summary${NC}"
echo "=================================="

# List configured secrets
echo -e "${YELLOW}🔍 Checking configured secrets...${NC}"
wrangler secret list --name bettadayz-pbbg

echo ""
echo -e "${GREEN}✅ Cloudflare secrets configuration complete!${NC}"
echo ""
echo -e "${BLUE}🚀 Next Steps:${NC}"
echo "1. Deploy the worker: npm run deploy:cloudflare"
echo "2. Configure custom domains in Cloudflare dashboard"
echo "3. Test the deployment: ./check-deployment.sh"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo "• Secrets are encrypted and not visible in the dashboard"
echo "• Update secrets anytime with: wrangler secret put SECRET_NAME"
echo "• Delete secrets with: wrangler secret delete SECRET_NAME"