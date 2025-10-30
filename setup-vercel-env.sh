#!/bin/bash

# BettaDayz PBBG - Vercel Environment Setup Script
# Automatically configures environment variables for all 3 Vercel projects

set -e

echo "▲ BettaDayz PBBG - Vercel Environment Setup"
echo "==========================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}🔐 Please log in to Vercel first...${NC}"
    vercel login
fi

# Load environment variables
if [[ -f ".env.local" ]]; then
    echo -e "${BLUE}📁 Loading environment from .env.local...${NC}"
    set -a
    source .env.local
    set +a
else
    echo -e "${YELLOW}⚠️  .env.local not found. Please run ./setup-supabase.sh first.${NC}"
    exit 1
fi

# Project configurations
declare -A PROJECTS=(
    ["bestdayz"]="${VERCEL_PROJECT_ID_BESTDAYZ:-}"
    ["bestdayz1"]="${VERCEL_PROJECT_ID_BESTDAYZ1:-}"
    ["bettaday"]="${VERCEL_PROJECT_ID_BETTADAY:-}"
)

# Function to set environment variable for a project
set_env_var() {
    local project_name="$1"
    local project_id="$2"
    local var_name="$3"
    local var_value="$4"
    local env_type="${5:-production,preview,development}"
    
    if [[ -n "$var_value" && -n "$project_id" ]]; then
        echo "Setting $var_name for $project_name..."
        vercel env add "$var_name" "$env_type" --scope "$project_id" --value "$var_value" --yes 2>/dev/null || {
            # If variable exists, remove and re-add
            vercel env rm "$var_name" "$env_type" --scope "$project_id" --yes 2>/dev/null || true
            vercel env add "$var_name" "$env_type" --scope "$project_id" --value "$var_value" --yes
        }
        echo -e "${GREEN}✅ $var_name set for $project_name${NC}"
    else
        echo -e "${RED}❌ Skipping $var_name for $project_name (missing value or project ID)${NC}"
    fi
}

# Function to configure all environment variables for a project
configure_project() {
    local project_name="$1"
    local project_id="$2"
    
    if [[ -z "$project_id" ]]; then
        echo -e "${RED}❌ Project ID not found for $project_name${NC}"
        echo "   Please set VERCEL_PROJECT_ID_${project_name^^} in your .env.local"
        return 1
    fi
    
    echo ""
    echo -e "${BLUE}🔧 Configuring $project_name (ID: $project_id)${NC}"
    echo "-------------------------------------------------------"
    
    # Core configuration
    set_env_var "$project_name" "$project_id" "NODE_ENV" "production" "production"
    set_env_var "$project_name" "$project_id" "NEXT_TELEMETRY_DISABLED" "1"
    set_env_var "$project_name" "$project_id" "NEXT_PUBLIC_DOMAIN" "$NEXT_PUBLIC_DOMAIN"
    set_env_var "$project_name" "$project_id" "NEXT_PUBLIC_STORE_DOMAIN" "$NEXT_PUBLIC_STORE_DOMAIN"
    set_env_var "$project_name" "$project_id" "NEXT_PUBLIC_SITE_TYPE" "pbbg"
    
    # Supabase configuration
    set_env_var "$project_name" "$project_id" "NEXT_PUBLIC_SUPABASE_URL" "$NEXT_PUBLIC_SUPABASE_URL"
    set_env_var "$project_name" "$project_id" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$NEXT_PUBLIC_SUPABASE_ANON_KEY"
    set_env_var "$project_name" "$project_id" "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_ROLE_KEY"
    
    # Security configuration
    set_env_var "$project_name" "$project_id" "JWT_SECRET" "$JWT_SECRET"
    set_env_var "$project_name" "$project_id" "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET"
    set_env_var "$project_name" "$project_id" "NEXTAUTH_URL" "https://$NEXT_PUBLIC_DOMAIN"
    
    # Payment configuration
    set_env_var "$project_name" "$project_id" "CASHAPP_API_KEY" "$CASHAPP_API_KEY"
    set_env_var "$project_name" "$project_id" "CASHAPP_CLIENT_ID" "$CASHAPP_CLIENT_ID"
    set_env_var "$project_name" "$project_id" "BITCOIN_WALLET_ADDRESS" "$BITCOIN_WALLET_ADDRESS"
    set_env_var "$project_name" "$project_id" "BITCOIN_NETWORK" "${BITCOIN_NETWORK:-mainnet}"
    
    # Optional services
    if [[ -n "$SENDGRID_API_KEY" ]]; then
        set_env_var "$project_name" "$project_id" "SENDGRID_API_KEY" "$SENDGRID_API_KEY"
    fi
    
    if [[ -n "$FROM_EMAIL" ]]; then
        set_env_var "$project_name" "$project_id" "FROM_EMAIL" "$FROM_EMAIL"
    fi
    
    if [[ -n "$GOOGLE_ANALYTICS_ID" ]]; then
        set_env_var "$project_name" "$project_id" "GOOGLE_ANALYTICS_ID" "$GOOGLE_ANALYTICS_ID"
    fi
    
    if [[ -n "$REDIS_URL" ]]; then
        set_env_var "$project_name" "$project_id" "REDIS_URL" "$REDIS_URL"
    fi
    
    echo -e "${GREEN}✅ $project_name configuration complete${NC}"
}

echo ""
echo -e "${BLUE}📋 Vercel Projects Configuration${NC}"
echo "Project IDs loaded from environment variables:"
for project in "${!PROJECTS[@]}"; do
    project_id="${PROJECTS[$project]}"
    if [[ -n "$project_id" ]]; then
        echo "• $project: $project_id"
    else
        echo -e "• $project: ${RED}NOT SET${NC}"
    fi
done

echo ""
read -p "Continue with environment variable configuration? (y/N): " confirm

if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "Configuration cancelled."
    exit 0
fi

# Configure each project
for project in "${!PROJECTS[@]}"; do
    project_id="${PROJECTS[$project]}"
    configure_project "$project" "$project_id"
done

echo ""
echo -e "${BLUE}📊 Configuration Summary${NC}"
echo "========================="

# List environment variables for each project
for project in "${!PROJECTS[@]}"; do
    project_id="${PROJECTS[$project]}"
    if [[ -n "$project_id" ]]; then
        echo ""
        echo -e "${YELLOW}📋 $project environment variables:${NC}"
        vercel env ls --scope "$project_id" 2>/dev/null || echo "Unable to list variables"
    fi
done

echo ""
echo -e "${GREEN}🎉 Vercel environment configuration complete!${NC}"
echo ""
echo -e "${BLUE}🚀 Next Steps:${NC}"
echo "1. Deploy to all projects: npm run deploy:vercel"
echo "2. Check deployment status in Vercel dashboard"
echo "3. Test all deployments: ./check-deployment.sh"
echo ""
echo -e "${YELLOW}💡 Project URLs:${NC}"
for project in "${!PROJECTS[@]}"; do
    echo "• $project: https://$project.vercel.app"
done
echo ""
echo -e "${YELLOW}⚠️  Note:${NC} Environment variables are set for production, preview, and development."
echo "You can modify them in the Vercel dashboard or using the CLI."