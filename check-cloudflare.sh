#!/bin/bash

# Cloudflare Zone and Domain Checker
# Checks what domains and zones are configured in your Cloudflare account

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Load API token
if [ -f ".env.production" ]; then
    export $(grep -v '^#' .env.production | xargs)
fi

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo -e "${RED}Error: CLOUDFLARE_API_TOKEN not found${NC}"
    exit 1
fi

echo -e "${BLUE}🔍 Cloudflare Account Information${NC}"
echo -e "${BLUE}=================================${NC}"

# Get account info
echo -e "\n${YELLOW}📊 Account Details:${NC}"
ACCOUNT_RESPONSE=$(curl -s "https://api.cloudflare.com/client/v4/accounts" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN")

if echo "$ACCOUNT_RESPONSE" | jq -e '.success' > /dev/null; then
    ACCOUNT_ID=$(echo "$ACCOUNT_RESPONSE" | jq -r '.result[0].id')
    ACCOUNT_NAME=$(echo "$ACCOUNT_RESPONSE" | jq -r '.result[0].name')
    echo -e "• Account: ${GREEN}$ACCOUNT_NAME${NC}"
    echo -e "• ID: ${GREEN}$ACCOUNT_ID${NC}"
else
    echo -e "${RED}Failed to fetch account information${NC}"
    exit 1
fi

# Get all zones
echo -e "\n${YELLOW}🌐 Domain Zones:${NC}"
ZONES_RESPONSE=$(curl -s "https://api.cloudflare.com/client/v4/zones" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN")

if echo "$ZONES_RESPONSE" | jq -e '.success' > /dev/null; then
    ZONE_COUNT=$(echo "$ZONES_RESPONSE" | jq '.result | length')
    echo -e "• Total zones: ${GREEN}$ZONE_COUNT${NC}"
    
    if [ "$ZONE_COUNT" -gt 0 ]; then
        echo -e "\n${YELLOW}Domain List:${NC}"
        echo "$ZONES_RESPONSE" | jq -r '.result[] | "• \(.name) (ID: \(.id)) - Status: \(.status)"' | while read line; do
            if [[ $line == *"bettadayz"* ]]; then
                echo -e "${GREEN}$line${NC}"
            else
                echo -e "${BLUE}$line${NC}"
            fi
        done
        
        # Check specifically for our domains
        echo -e "\n${YELLOW}🎯 BettaDayz Domain Status:${NC}"
        SHOP_ZONE=$(echo "$ZONES_RESPONSE" | jq -r '.result[] | select(.name=="bettadayz.shop")')
        STORE_ZONE=$(echo "$ZONES_RESPONSE" | jq -r '.result[] | select(.name=="bettadayz.store")')
        
        if [ -n "$SHOP_ZONE" ] && [ "$SHOP_ZONE" != "null" ]; then
            SHOP_ID=$(echo "$SHOP_ZONE" | jq -r '.id')
            SHOP_STATUS=$(echo "$SHOP_ZONE" | jq -r '.status')
            echo -e "• ✅ bettadayz.shop: ${GREEN}$SHOP_STATUS${NC} ($SHOP_ID)"
        else
            echo -e "• ❌ bettadayz.shop: ${RED}Not found${NC}"
        fi
        
        if [ -n "$STORE_ZONE" ] && [ "$STORE_ZONE" != "null" ]; then
            STORE_ID=$(echo "$STORE_ZONE" | jq -r '.id')
            STORE_STATUS=$(echo "$STORE_ZONE" | jq -r '.status')
            echo -e "• ✅ bettadayz.store: ${GREEN}$STORE_STATUS${NC} ($STORE_ID)"
        else
            echo -e "• ❌ bettadayz.store: ${RED}Not found${NC}"
        fi
    fi
else
    echo -e "${RED}Failed to fetch zones${NC}"
fi

# Get Pages projects
echo -e "\n${YELLOW}📄 Cloudflare Pages Projects:${NC}"
PAGES_RESPONSE=$(curl -s "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN")

if echo "$PAGES_RESPONSE" | jq -e '.success' > /dev/null; then
    PROJECT_COUNT=$(echo "$PAGES_RESPONSE" | jq '.result | length')
    echo -e "• Total projects: ${GREEN}$PROJECT_COUNT${NC}"
    
    if [ "$PROJECT_COUNT" -gt 0 ]; then
        echo -e "\n${YELLOW}Project List:${NC}"
        echo "$PAGES_RESPONSE" | jq -r '.result[] | "• \(.name) - \(.subdomain) (Created: \(.created_on))"' | while read line; do
            if [[ $line == *"bettadayz"* ]]; then
                echo -e "${GREEN}$line${NC}"
            else
                echo -e "${BLUE}$line${NC}"
            fi
        done
    fi
else
    echo -e "${RED}Failed to fetch Pages projects${NC}"
fi

# Token permissions
echo -e "\n${YELLOW}🔑 Token Permissions:${NC}"
TOKEN_RESPONSE=$(curl -s "https://api.cloudflare.com/client/v4/user/tokens/verify" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN")

if echo "$TOKEN_RESPONSE" | jq -e '.success' > /dev/null; then
    TOKEN_ID=$(echo "$TOKEN_RESPONSE" | jq -r '.result.id')
    TOKEN_STATUS=$(echo "$TOKEN_RESPONSE" | jq -r '.result.status')
    echo -e "• Token ID: ${GREEN}$TOKEN_ID${NC}"
    echo -e "• Status: ${GREEN}$TOKEN_STATUS${NC}"
else
    echo -e "${RED}Failed to verify token${NC}"
fi

echo -e "\n${GREEN}✅ Cloudflare account analysis complete!${NC}"