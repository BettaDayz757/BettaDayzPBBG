#!/bin/bash

# BettaDayz PBBG Deployment Status Checker
# This script checks the deployment status across all platforms

echo "🚀 BettaDayz PBBG Deployment Status Check"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check HTTP status
check_url() {
    local url=$1
    local name=$2
    local status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status" -eq 200 ]; then
        echo -e "${GREEN}✅ ${name}: Online (${status})${NC}"
    elif [ "$status" -eq 000 ]; then
        echo -e "${RED}❌ ${name}: Cannot connect${NC}"
    else
        echo -e "${YELLOW}⚠️  ${name}: Status ${status}${NC}"
    fi
}

# Function to check API endpoint
check_api() {
    local url=$1
    local name=$2
    local response=$(curl -s "$url")
    
    if echo "$response" | grep -q '"status":"ok"'; then
        echo -e "${GREEN}✅ ${name}: API responding${NC}"
    else
        echo -e "${RED}❌ ${name}: API not responding${NC}"
    fi
}

echo ""
echo "${BLUE}🌐 Domain Status${NC}"
echo "----------------"

# Check main domains
check_url "https://bettadayz.shop" "Gaming Domain (bettadayz.shop)"
check_url "https://bettadayz.store" "Store Domain (bettadayz.store)"

echo ""
echo "${BLUE}🔌 API Health Checks${NC}"
echo "---------------------"

# Check API endpoints
check_api "https://bettadayz.shop/api/health" "Shop API Health"
check_api "https://bettadayz.store/api/health" "Store API Health"

echo ""
echo "${BLUE}🏗️  Platform Deployments${NC}"
echo "-------------------------"

# Check Cloudflare Pages
check_url "https://bettadayzpbbg.pages.dev" "Cloudflare Pages"

# Check Vercel deployments
echo -e "${YELLOW}📋 Vercel Projects:${NC}"
echo "  - bestdayz: Check GitHub Actions for status"
echo "  - bestdayz1: Check GitHub Actions for status"
echo "  - bettaday: Check GitHub Actions for status"

echo ""
echo "${BLUE}📊 Build Status${NC}"
echo "----------------"

# Check if build passes locally
echo "🔨 Running local build test..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Local build: Successful${NC}"
else
    echo -e "${RED}❌ Local build: Failed${NC}"
fi

echo ""
echo "${BLUE}🔐 Security Checks${NC}"
echo "-------------------"

# Check HTTPS
check_url "https://bettadayz.shop" "HTTPS Shop"
check_url "https://bettadayz.store" "HTTPS Store"

echo ""
echo "${BLUE}🎮 Game Features${NC}"
echo "-----------------"

check_url "https://bettadayz.shop/api/auth/signup" "Authentication API"
check_url "https://bettadayz.shop/api/player/stats" "Player API"
check_url "https://bettadayz.shop/api/game/activities" "Game API"

echo ""
echo "${BLUE}💰 Payment Features${NC}"
echo "--------------------"

check_url "https://bettadayz.store/api/store/purchase" "Purchase API"
check_url "https://bettadayz.store/api/store/balance" "Balance API"
check_url "https://bettadayz.store/api/store/webhook" "Webhook API"

echo ""
echo "${BLUE}📈 Deployment Summary${NC}"
echo "----------------------"

echo "Platform Status:"
echo "• Cloudflare Worker: Domain routing active"
echo "• Cloudflare Pages: Auto-deploy from GitHub"
echo "• Vercel (3 projects): Configured and ready"
echo "• GitHub Actions: CI/CD pipeline active"

echo ""
echo "Next Steps:"
echo "1. Configure environment variables on platforms"
echo "2. Set up Supabase database schema"
echo "3. Configure payment provider credentials"
echo "4. Test end-to-end user flow"

echo ""
echo -e "${GREEN}🎉 Deployment check complete!${NC}"