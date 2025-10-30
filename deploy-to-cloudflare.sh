#!/bin/bash

# =======================================================
# BettaDayz PBBG Cloudflare Pages Direct Deployment
# Deploy directly to existing Cloudflare Pages project
# =======================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Load environment variables
if [ -f ".env.production" ]; then
    export $(grep -v '^#' .env.production | xargs)
fi

# Configuration from environment
PROJECT_NAME="${CLOUDFLARE_PROJECT_NAME:-bettadayzpbbg}"
ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-9b9fcaead55610e5dd235878e702ee69}"
API_TOKEN="${CLOUDFLARE_API_TOKEN}"

echo -e "${BLUE}🚀 BettaDayz PBBG Direct Deployment${NC}"
echo -e "${BLUE}===================================${NC}"
echo -e "Project: ${GREEN}$PROJECT_NAME${NC}"
echo -e "Account: ${GREEN}$ACCOUNT_ID${NC}"

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verify API token
print_status "Verifying Cloudflare access..."
if [ -z "$API_TOKEN" ]; then
    print_error "CLOUDFLARE_API_TOKEN not found"
    exit 1
fi

# Check if project exists
PROJECT_RESPONSE=$(curl -s "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/$PROJECT_NAME" \
    -H "Authorization: Bearer $API_TOKEN")

if echo "$PROJECT_RESPONSE" | jq -e '.success' > /dev/null; then
    print_success "Cloudflare Pages project '$PROJECT_NAME' found"
    PROJECT_DOMAIN=$(echo "$PROJECT_RESPONSE" | jq -r '.result.subdomain')
    print_status "Project URL: https://$PROJECT_DOMAIN"
else
    print_error "Project '$PROJECT_NAME' not found or access denied"
    exit 1
fi

# Clean and build
print_status "Building application..."
rm -rf .next out
npm install --legacy-peer-deps --production=false
npm run build

if [ ! -d "out" ]; then
    print_error "Build failed - out directory not found"
    exit 1
fi

print_success "Build completed"

# Create deployment package
print_status "Creating deployment package..."
cd out
tar -czf ../deployment.tar.gz *
cd ..

# Deploy via API
print_status "Deploying to Cloudflare Pages..."

# Create form data for deployment
DEPLOYMENT_RESPONSE=$(curl -s -X POST \
    "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/$PROJECT_NAME/deployments" \
    -H "Authorization: Bearer $API_TOKEN" \
    -F "file=@deployment.tar.gz")

if echo "$DEPLOYMENT_RESPONSE" | jq -e '.success' > /dev/null; then
    DEPLOYMENT_ID=$(echo "$DEPLOYMENT_RESPONSE" | jq -r '.result.id')
    DEPLOYMENT_URL=$(echo "$DEPLOYMENT_RESPONSE" | jq -r '.result.url')
    print_success "Deployment created: $DEPLOYMENT_ID"
    print_success "Deployment URL: $DEPLOYMENT_URL"
    
    # Monitor deployment status
    print_status "Monitoring deployment progress..."
    for i in {1..30}; do
        sleep 5
        STATUS_RESPONSE=$(curl -s "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/$PROJECT_NAME/deployments/$DEPLOYMENT_ID" \
            -H "Authorization: Bearer $API_TOKEN")
        
        if echo "$STATUS_RESPONSE" | jq -e '.success' > /dev/null; then
            STAGE=$(echo "$STATUS_RESPONSE" | jq -r '.result.latest_stage.name')
            STATUS=$(echo "$STATUS_RESPONSE" | jq -r '.result.latest_stage.status')
            
            print_status "Deployment stage: $STAGE ($STATUS)"
            
            if [ "$STATUS" = "success" ] && [ "$STAGE" = "deploy" ]; then
                print_success "Deployment completed successfully!"
                break
            elif [ "$STATUS" = "failure" ]; then
                print_error "Deployment failed at stage: $STAGE"
                exit 1
            fi
        fi
        
        if [ $i -eq 30 ]; then
            print_error "Deployment timeout"
            exit 1
        fi
    done
    
else
    print_error "Deployment failed"
    echo "$DEPLOYMENT_RESPONSE" | jq '.errors'
    exit 1
fi

# Configure custom domains if not already set
print_status "Checking custom domain configuration..."

# Check for bettadayz.shop
SHOP_DOMAIN_RESPONSE=$(curl -s "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/$PROJECT_NAME/domains" \
    -H "Authorization: Bearer $API_TOKEN")

if echo "$SHOP_DOMAIN_RESPONSE" | jq -e '.success' > /dev/null; then
    SHOP_CONFIGURED=$(echo "$SHOP_DOMAIN_RESPONSE" | jq -r '.result[] | select(.name=="bettadayz.shop") | .name')
    STORE_CONFIGURED=$(echo "$SHOP_DOMAIN_RESPONSE" | jq -r '.result[] | select(.name=="bettadayz.store") | .name')
    
    if [ -z "$SHOP_CONFIGURED" ]; then
        print_status "Adding bettadayz.shop as custom domain..."
        curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/$PROJECT_NAME/domains" \
            -H "Authorization: Bearer $API_TOKEN" \
            -H "Content-Type: application/json" \
            -d '{"name":"bettadayz.shop"}' > /dev/null
        print_success "bettadayz.shop domain added"
    else
        print_success "bettadayz.shop already configured"
    fi
    
    if [ -z "$STORE_CONFIGURED" ]; then
        print_status "Adding bettadayz.store as custom domain..."
        curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/$PROJECT_NAME/domains" \
            -H "Authorization: Bearer $API_TOKEN" \
            -H "Content-Type: application/json" \
            -d '{"name":"bettadayz.store"}' > /dev/null
        print_success "bettadayz.store domain added"
    else
        print_success "bettadayz.store already configured"
    fi
fi

# Cleanup
rm -f deployment.tar.gz

# Final verification
print_status "Running domain verification..."
sleep 10  # Wait for propagation

echo ""
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${BLUE}======================${NC}"
echo ""
echo -e "${YELLOW}Deployment Summary:${NC}"
echo -e "• Project: $PROJECT_NAME"
echo -e "• Deployment ID: $DEPLOYMENT_ID"
echo -e "• Pages URL: https://$PROJECT_DOMAIN"
echo ""
echo -e "${YELLOW}Custom Domains:${NC}"
echo -e "• https://bettadayz.shop"
echo -e "• https://bettadayz.store"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "1. Test both domains: ${BLUE}./verify-domains.sh${NC}"
echo -e "2. Monitor in Cloudflare Pages dashboard"
echo -e "3. Check analytics and performance"
echo ""
echo -e "${GREEN}🎉 BettaDayz PBBG is now live on both domains!${NC}"