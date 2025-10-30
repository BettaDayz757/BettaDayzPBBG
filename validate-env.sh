#!/bin/bash

# BettaDayz PBBG - Environment Validation Script
# Validates all required environment variables before deployment

set -e

echo "🔍 BettaDayz PBBG - Environment Validation"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Validation counters
VALID_COUNT=0
INVALID_COUNT=0
WARNING_COUNT=0

# Function to validate required environment variable
validate_required() {
    local var_name="$1"
    local description="$2"
    local min_length="${3:-1}"
    
    local value="${!var_name}"
    
    if [[ -z "$value" ]]; then
        echo -e "${RED}❌ $var_name: Missing (required for $description)${NC}"
        ((INVALID_COUNT++))
        return 1
    elif [[ ${#value} -lt $min_length ]]; then
        echo -e "${RED}❌ $var_name: Too short (minimum $min_length characters)${NC}"
        ((INVALID_COUNT++))
        return 1
    else
        echo -e "${GREEN}✅ $var_name: Valid${NC}"
        ((VALID_COUNT++))
        return 0
    fi
}

# Function to validate optional environment variable
validate_optional() {
    local var_name="$1"
    local description="$2"
    
    local value="${!var_name}"
    
    if [[ -z "$value" ]]; then
        echo -e "${YELLOW}⚠️  $var_name: Not set (optional for $description)${NC}"
        ((WARNING_COUNT++))
        return 1
    else
        echo -e "${GREEN}✅ $var_name: Valid${NC}"
        ((VALID_COUNT++))
        return 0
    fi
}

# Function to validate URL format
validate_url() {
    local var_name="$1"
    local description="$2"
    local value="${!var_name}"
    
    if [[ -z "$value" ]]; then
        echo -e "${RED}❌ $var_name: Missing (required for $description)${NC}"
        ((INVALID_COUNT++))
        return 1
    elif [[ ! "$value" =~ ^https?:// ]]; then
        echo -e "${RED}❌ $var_name: Invalid URL format (must start with http:// or https://)${NC}"
        ((INVALID_COUNT++))
        return 1
    else
        echo -e "${GREEN}✅ $var_name: Valid URL${NC}"
        ((VALID_COUNT++))
        return 0
    fi
}

# Function to validate email format
validate_email() {
    local var_name="$1"
    local description="$2"
    local value="${!var_name}"
    
    if [[ -z "$value" ]]; then
        echo -e "${YELLOW}⚠️  $var_name: Not set (optional for $description)${NC}"
        ((WARNING_COUNT++))
        return 1
    elif [[ ! "$value" =~ ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$ ]]; then
        echo -e "${RED}❌ $var_name: Invalid email format${NC}"
        ((INVALID_COUNT++))
        return 1
    else
        echo -e "${GREEN}✅ $var_name: Valid email${NC}"
        ((VALID_COUNT++))
        return 0
    fi
}

# Load environment variables
if [[ -f ".env.local" ]]; then
    echo -e "${BLUE}📋 Loading .env.local...${NC}"
    set -a  # automatically export all variables
    source .env.local
    set +a
else
    echo -e "${YELLOW}⚠️  .env.local not found. Using system environment variables.${NC}"
fi

echo ""
echo -e "${BLUE}🌐 Domain Configuration${NC}"
echo "------------------------"
validate_required "NEXT_PUBLIC_DOMAIN" "primary domain configuration" 5
validate_required "NEXT_PUBLIC_STORE_DOMAIN" "store domain configuration" 5
validate_required "NEXT_PUBLIC_SITE_TYPE" "site type identification"

echo ""
echo -e "${BLUE}🗄️  Database Configuration${NC}"
echo "----------------------------"
validate_url "NEXT_PUBLIC_SUPABASE_URL" "Supabase database connection"
validate_required "NEXT_PUBLIC_SUPABASE_ANON_KEY" "Supabase anonymous access" 20
validate_required "SUPABASE_SERVICE_ROLE_KEY" "Supabase admin operations" 20

echo ""
echo -e "${BLUE}🔐 Security Configuration${NC}"
echo "---------------------------"
validate_required "JWT_SECRET" "JWT token signing" 32
validate_required "NEXTAUTH_SECRET" "NextAuth session encryption" 32
validate_url "NEXTAUTH_URL" "NextAuth callback configuration"

echo ""
echo -e "${BLUE}💰 Payment Configuration${NC}"
echo "---------------------------"
validate_required "CASHAPP_API_KEY" "Cash App payment processing" 10
validate_optional "CASHAPP_CLIENT_ID" "Cash App client identification"
validate_required "BITCOIN_WALLET_ADDRESS" "Bitcoin payment receiving" 26
validate_optional "BITCOIN_NETWORK" "Bitcoin network selection"

echo ""
echo -e "${BLUE}🚀 Deployment Configuration${NC}"
echo "-----------------------------"
validate_optional "CLOUDFLARE_API_TOKEN" "Cloudflare deployment"
validate_optional "CLOUDFLARE_ACCOUNT_ID" "Cloudflare account access"
validate_optional "VERCEL_TOKEN" "Vercel deployment"
validate_optional "GITHUB_TOKEN" "GitHub repository access"

echo ""
echo -e "${BLUE}📧 External Services${NC}"
echo "--------------------"
validate_optional "SENDGRID_API_KEY" "email notifications"
validate_email "FROM_EMAIL" "sender email address"
validate_optional "GOOGLE_ANALYTICS_ID" "analytics tracking"
validate_optional "REDIS_URL" "session caching"

echo ""
echo -e "${BLUE}🏗️  Build Configuration${NC}"
echo "-------------------------"
validate_required "NODE_ENV" "environment mode"

# Environment-specific validations
if [[ "$NODE_ENV" == "production" ]]; then
    echo ""
    echo -e "${BLUE}🎯 Production-Specific Checks${NC}"
    echo "------------------------------"
    
    # Ensure telemetry is disabled in production
    if [[ "$NEXT_TELEMETRY_DISABLED" != "1" ]]; then
        echo -e "${YELLOW}⚠️  NEXT_TELEMETRY_DISABLED: Consider disabling for production${NC}"
        ((WARNING_COUNT++))
    else
        echo -e "${GREEN}✅ NEXT_TELEMETRY_DISABLED: Properly configured${NC}"
        ((VALID_COUNT++))
    fi
    
    # Check domain URLs are HTTPS in production
    if [[ "$NEXTAUTH_URL" =~ ^http:// ]]; then
        echo -e "${RED}❌ NEXTAUTH_URL: Should use HTTPS in production${NC}"
        ((INVALID_COUNT++))
    fi
fi

# Security checks
echo ""
echo -e "${BLUE}🛡️  Security Validation${NC}"
echo "------------------------"

# Check for common weak secrets
weak_secrets=("password" "secret" "123456" "admin" "test")
for var in JWT_SECRET NEXTAUTH_SECRET; do
    value="${!var}"
    if [[ -n "$value" ]]; then
        is_weak=false
        for weak in "${weak_secrets[@]}"; do
            if [[ "${value,,}" == *"$weak"* ]]; then
                echo -e "${RED}❌ $var: Contains weak pattern '$weak'${NC}"
                ((INVALID_COUNT++))
                is_weak=true
                break
            fi
        done
        if [[ "$is_weak" == false ]]; then
            echo -e "${GREEN}✅ $var: Appears secure${NC}"
            ((VALID_COUNT++))
        fi
    fi
done

# Summary
echo ""
echo -e "${BLUE}📊 Validation Summary${NC}"
echo "====================="
echo -e "${GREEN}✅ Valid: $VALID_COUNT${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARNING_COUNT${NC}"
echo -e "${RED}❌ Errors: $INVALID_COUNT${NC}"

echo ""
if [[ $INVALID_COUNT -eq 0 ]]; then
    echo -e "${GREEN}🎉 Environment validation passed!${NC}"
    echo "Your BettaDayz PBBG is ready for deployment."
    
    if [[ $WARNING_COUNT -gt 0 ]]; then
        echo -e "${YELLOW}⚠️  Note: $WARNING_COUNT optional variables are not set.${NC}"
    fi
    
    exit 0
else
    echo -e "${RED}💥 Environment validation failed!${NC}"
    echo "Please fix the $INVALID_COUNT error(s) before deploying."
    echo ""
    echo -e "${BLUE}💡 Quick fixes:${NC}"
    echo "• Run: ./setup-supabase.sh (for Supabase configuration)"
    echo "• Generate secrets: openssl rand -base64 32"
    echo "• Check .env.example for reference values"
    echo "• Use .env.prod template for production"
    
    exit 1
fi