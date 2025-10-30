#!/bin/bash

# BettaDayz PBBG - Get Vercel Project IDs
# Helper script to extract Vercel organization and project IDs

echo "🔍 BettaDayz PBBG - Vercel Configuration Helper"
echo "=============================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Check if user is logged in
echo -e "${BLUE}🔐 Checking Vercel authentication...${NC}"
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Please log in to Vercel first${NC}"
    vercel login
fi

# Get current user
user=$(vercel whoami 2>/dev/null)
echo -e "${GREEN}✅ Logged in as: $user${NC}"

echo ""
echo -e "${BLUE}🏢 Getting Organization/Team ID...${NC}"
echo "=================================="

# Get org ID
vercel org ls > /tmp/vercel_orgs.txt 2>/dev/null

if [[ -s /tmp/vercel_orgs.txt ]]; then
    echo "Available organizations:"
    cat /tmp/vercel_orgs.txt
    
    # Try to extract the ID (usually the first column)
    org_id=$(head -2 /tmp/vercel_orgs.txt | tail -1 | awk '{print $1}')
    if [[ -n "$org_id" ]]; then
        echo ""
        echo -e "${GREEN}🎯 Organization ID: $org_id${NC}"
        echo "   Add this as VERCEL_ORG_ID secret in GitHub"
    fi
else
    echo -e "${YELLOW}⚠️  Could not retrieve organization list${NC}"
fi

echo ""
echo -e "${BLUE}📁 Getting Project IDs...${NC}"
echo "========================="

# Get project list
vercel project ls > /tmp/vercel_projects.txt 2>/dev/null

if [[ -s /tmp/vercel_projects.txt ]]; then
    echo "Available projects:"
    cat /tmp/vercel_projects.txt
    echo ""
    
    # Look for our specific projects
    projects=("bestdayz" "bestdayz1" "bettaday")
    
    echo -e "${BLUE}🎯 Project ID Mappings:${NC}"
    echo "======================="
    
    for project in "${projects[@]}"; do
        echo "Checking for project: $project"
        
        # Try to get project details
        project_info=$(vercel project inspect "$project" 2>/dev/null)
        
        if [[ $? -eq 0 ]]; then
            # Extract project ID from the output
            project_id=$(echo "$project_info" | grep -i "id" | head -1 | awk '{print $2}' | tr -d '"' | tr -d ',')
            
            if [[ -n "$project_id" ]]; then
                echo -e "${GREEN}✅ $project: $project_id${NC}"
                echo "   Add this as VERCEL_PROJECT_ID_${project^^} secret in GitHub"
            else
                echo -e "${YELLOW}⚠️  $project: Could not extract project ID${NC}"
                echo "   Manual check required"
            fi
        else
            echo -e "${RED}❌ $project: Project not found${NC}"
            echo "   You may need to create this project in Vercel first"
        fi
        echo ""
    done
else
    echo -e "${YELLOW}⚠️  Could not retrieve project list${NC}"
fi

echo ""
echo -e "${BLUE}🔑 Getting API Token Information...${NC}"
echo "================================="

echo "To get your Vercel API token:"
echo "1. Go to https://vercel.com/account/tokens"
echo "2. Click 'Create Token'"
echo "3. Give it a name like 'BettaDayz-GitHub-Actions'"
echo "4. Set scope to your team/organization"
echo "5. Copy the token value"
echo "6. Add it as VERCEL_TOKEN secret in GitHub"

echo ""
echo -e "${BLUE}📋 GitHub Secrets Summary${NC}"
echo "========================="

echo "Add these secrets to your GitHub repository:"
echo ""
echo "Repository Settings → Secrets and variables → Actions → New repository secret"
echo ""

if [[ -n "$org_id" ]]; then
    echo "VERCEL_ORG_ID = $org_id"
else
    echo "VERCEL_ORG_ID = [Get from 'vercel org ls' command]"
fi

echo "VERCEL_TOKEN = [Get from vercel.com/account/tokens]"
echo ""

# Show what we found for projects
for project in "${projects[@]}"; do
    secret_name="VERCEL_PROJECT_ID_${project^^}"
    echo "$secret_name = [See project IDs above or run 'vercel project inspect $project']"
done

echo ""
echo -e "${BLUE}🔗 Helpful Links${NC}"
echo "================"
echo "• Vercel Tokens: https://vercel.com/account/tokens"
echo "• GitHub Secrets: https://github.com/BettaDayz757/BettaDayzPBBG/settings/secrets/actions"
echo "• Vercel Dashboard: https://vercel.com/dashboard"

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo "Copy the values above and add them as GitHub repository secrets."

# Cleanup
rm -f /tmp/vercel_orgs.txt /tmp/vercel_projects.txt