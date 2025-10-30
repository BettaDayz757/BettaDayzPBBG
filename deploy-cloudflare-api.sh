#!/bin/bash

# =======================================================
# BettaDayz PBBG Cloudflare API Deployment Script
# Automated deployment using Cloudflare API
# =======================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f ".env.production" ]; then
    export $(grep -v '^#' .env.production | xargs)
fi

# Configuration
PROJECT_NAME="bettadayz-pbbg"
BUILD_DIR="out"
NODE_VERSION="20"

echo -e "${BLUE}🚀 BettaDayz PBBG Cloudflare API Deployment${NC}"
echo -e "${BLUE}============================================${NC}"

# Function to print status
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
print_status "Checking prerequisites..."

if ! command_exists curl; then
    print_error "curl is not installed"
    exit 1
fi

if ! command_exists jq; then
    print_warning "jq is not installed - installing it for JSON parsing..."
    if command_exists apt; then
        sudo apt update && sudo apt install -y jq
    elif command_exists brew; then
        brew install jq
    else
        print_error "Please install jq manually"
        exit 1
    fi
fi

# Verify Cloudflare API token
print_status "Verifying Cloudflare API token..."
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    print_error "CLOUDFLARE_API_TOKEN not found in environment"
    exit 1
fi

# Test API token
API_RESPONSE=$(curl -s "https://api.cloudflare.com/client/v4/user/tokens/verify" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN")

if echo "$API_RESPONSE" | jq -e '.success' > /dev/null; then
    print_success "Cloudflare API token verified"
    TOKEN_ID=$(echo "$API_RESPONSE" | jq -r '.result.id')
    print_status "Token ID: $TOKEN_ID"
else
    print_error "Invalid Cloudflare API token"
    echo "$API_RESPONSE" | jq '.errors'
    exit 1
fi

# Get account information
print_status "Fetching Cloudflare account information..."
ACCOUNT_RESPONSE=$(curl -s "https://api.cloudflare.com/client/v4/accounts" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN")

if echo "$ACCOUNT_RESPONSE" | jq -e '.success' > /dev/null; then
    ACCOUNT_ID=$(echo "$ACCOUNT_RESPONSE" | jq -r '.result[0].id')
    ACCOUNT_NAME=$(echo "$ACCOUNT_RESPONSE" | jq -r '.result[0].name')
    print_success "Account: $ACCOUNT_NAME ($ACCOUNT_ID)"
    
    # Update .env.production with account ID
    sed -i "s/CLOUDFLARE_ACCOUNT_ID=your_account_id_here/CLOUDFLARE_ACCOUNT_ID=$ACCOUNT_ID/" .env.production
else
    print_error "Failed to fetch account information"
    exit 1
fi

# Get zone information for both domains
print_status "Fetching zone information for domains..."

# Function to get zone ID for a domain
get_zone_id() {
    local domain=$1
    local zones_response=$(curl -s "https://api.cloudflare.com/client/v4/zones?name=$domain" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN")
    
    if echo "$zones_response" | jq -e '.success' > /dev/null; then
        local zone_id=$(echo "$zones_response" | jq -r '.result[0].id // empty')
        if [ -n "$zone_id" ] && [ "$zone_id" != "null" ]; then
            echo "$zone_id"
        else
            echo ""
        fi
    else
        echo ""
    fi
}

# Check for both domains
SHOP_ZONE_ID=$(get_zone_id "bettadayz.shop")
STORE_ZONE_ID=$(get_zone_id "bettadayz.store")

if [ -n "$SHOP_ZONE_ID" ]; then
    print_success "bettadayz.shop zone found: $SHOP_ZONE_ID"
    sed -i "s/CLOUDFLARE_ZONE_ID_SHOP=your_shop_zone_id_here/CLOUDFLARE_ZONE_ID_SHOP=$SHOP_ZONE_ID/" .env.production
else
    print_warning "bettadayz.shop zone not found - domain may not be configured in Cloudflare yet"
fi

if [ -n "$STORE_ZONE_ID" ]; then
    print_success "bettadayz.store zone found: $STORE_ZONE_ID"
    sed -i "s/CLOUDFLARE_ZONE_ID_STORE=your_store_zone_id_here/CLOUDFLARE_ZONE_ID_STORE=$STORE_ZONE_ID/" .env.production
else
    print_warning "bettadayz.store zone not found - domain may not be configured in Cloudflare yet"
fi

# Check for existing Pages projects
print_status "Checking for existing Cloudflare Pages projects..."
PAGES_RESPONSE=$(curl -s "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN")

if echo "$PAGES_RESPONSE" | jq -e '.success' > /dev/null; then
    PROJECT_COUNT=$(echo "$PAGES_RESPONSE" | jq '.result | length')
    print_status "Found $PROJECT_COUNT existing Pages projects"
    
    # Check if our project already exists
    EXISTING_PROJECT=$(echo "$PAGES_RESPONSE" | jq -r ".result[] | select(.name==\"$PROJECT_NAME\") | .name // empty")
    if [ -n "$EXISTING_PROJECT" ]; then
        print_success "Project '$PROJECT_NAME' already exists"
        PROJECT_EXISTS=true
    else
        print_status "Project '$PROJECT_NAME' does not exist - will create new one"
        PROJECT_EXISTS=false
    fi
else
    print_error "Failed to fetch Pages projects"
    exit 1
fi

# Build the application
print_status "Building application..."
npm install
npm run build

if [ ! -d "$BUILD_DIR" ]; then
    print_error "Build failed - $BUILD_DIR directory not found"
    exit 1
fi

print_success "Build completed successfully"

# Create wrangler.toml for deployment
print_status "Creating Cloudflare configuration..."
cat > wrangler.toml << EOF
name = "$PROJECT_NAME"
compatibility_date = "2024-10-01"
pages_build_output_dir = "$BUILD_DIR"

[env.production]
account_id = "$ACCOUNT_ID"

[env.production.vars]
NODE_ENV = "production"
NEXT_PUBLIC_SUPABASE_URL = "$NEXT_PUBLIC_SUPABASE_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY = "$NEXT_PUBLIC_SUPABASE_ANON_KEY"
NEXT_PUBLIC_PRIMARY_DOMAIN = "$NEXT_PUBLIC_PRIMARY_DOMAIN"
NEXT_PUBLIC_SECONDARY_DOMAIN = "$NEXT_PUBLIC_SECONDARY_DOMAIN"
NEXT_PUBLIC_SITE_URL = "$NEXT_PUBLIC_SITE_URL"
NEXT_PUBLIC_ALT_SITE_URL = "$NEXT_PUBLIC_ALT_SITE_URL"
EOF

print_success "Cloudflare configuration created"

# Deploy using Wrangler (if available) or provide manual instructions
if command_exists wrangler; then
    print_status "Deploying with Wrangler..."
    export CLOUDFLARE_API_TOKEN
    wrangler pages deploy $BUILD_DIR --project-name=$PROJECT_NAME
    print_success "Deployment completed with Wrangler"
else
    print_warning "Wrangler not installed - providing manual deployment instructions"
    
    echo -e "\n${YELLOW}Manual Deployment Instructions:${NC}"
    echo -e "1. Install Wrangler: ${BLUE}npm install -g wrangler${NC}"
    echo -e "2. Authenticate: ${BLUE}wrangler auth${NC}"
    echo -e "3. Deploy: ${BLUE}wrangler pages deploy $BUILD_DIR --project-name=$PROJECT_NAME${NC}"
    echo -e "\nOr use the Cloudflare Pages dashboard to create a new project."
fi

# Configure custom domains via API (if zones exist)
configure_custom_domain() {
    local domain=$1
    local zone_id=$2
    
    if [ -n "$zone_id" ]; then
        print_status "Configuring custom domain: $domain"
        
        # Add custom domain to Pages project
        DOMAIN_RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/$PROJECT_NAME/domains" \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            -d "{\"name\":\"$domain\"}")
        
        if echo "$DOMAIN_RESPONSE" | jq -e '.success' > /dev/null; then
            print_success "Custom domain $domain configured"
        else
            print_warning "Failed to configure custom domain $domain"
            echo "$DOMAIN_RESPONSE" | jq '.errors'
        fi
    fi
}

if [ "$PROJECT_EXISTS" = true ]; then
    configure_custom_domain "bettadayz.shop" "$SHOP_ZONE_ID"
    configure_custom_domain "bettadayz.store" "$STORE_ZONE_ID"
fi

# Create deployment summary
print_status "Creating deployment summary..."
cat > deployment-summary.json << EOF
{
    "deploymentDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "projectName": "$PROJECT_NAME",
    "accountId": "$ACCOUNT_ID",
    "accountName": "$ACCOUNT_NAME",
    "domains": {
        "shop": {
            "domain": "bettadayz.shop",
            "zoneId": "$SHOP_ZONE_ID"
        },
        "store": {
            "domain": "bettadayz.store",
            "zoneId": "$STORE_ZONE_ID"
        }
    },
    "buildDirectory": "$BUILD_DIR",
    "nodeVersion": "$(node -v)",
    "gitCommit": "$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')"
}
EOF

# Final instructions
echo ""
echo -e "${GREEN}✅ Cloudflare Deployment Preparation Complete!${NC}"
echo -e "${BLUE}===============================================${NC}"
echo ""
echo -e "${YELLOW}Summary:${NC}"
echo -e "• Account: $ACCOUNT_NAME ($ACCOUNT_ID)"
echo -e "• Project: $PROJECT_NAME"
echo -e "• Build output: $BUILD_DIR"
echo -e "• Configuration: wrangler.toml created"
echo ""
echo -e "${YELLOW}Zones Found:${NC}"
if [ -n "$SHOP_ZONE_ID" ]; then
    echo -e "• ✅ bettadayz.shop: $SHOP_ZONE_ID"
else
    echo -e "• ❌ bettadayz.shop: Not found in Cloudflare"
fi
if [ -n "$STORE_ZONE_ID" ]; then
    echo -e "• ✅ bettadayz.store: $STORE_ZONE_ID"
else
    echo -e "• ❌ bettadayz.store: Not found in Cloudflare"
fi
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "1. ${BLUE}Add domains to Cloudflare${NC} (if not already done)"
echo -e "2. ${BLUE}Install Wrangler:${NC} npm install -g wrangler"
echo -e "3. ${BLUE}Deploy:${NC} wrangler pages deploy $BUILD_DIR --project-name=$PROJECT_NAME"
echo -e "4. ${BLUE}Verify:${NC} ./verify-domains.sh"
echo ""
echo -e "${GREEN}🎉 Ready for deployment!${NC}"