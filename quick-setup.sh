#!/bin/bash

# BettaDayz PBBG - Quick Setup Script
# Automated one-command setup for Supabase and Vercel

set -e

echo "🚀 BettaDayz PBBG - Quick Setup Wizard"
echo "======================================"
echo ""
echo "This script will help you set up:"
echo "  • Supabase database and authentication"
echo "  • Vercel deployment configuration"
echo "  • Environment variables"
echo "  • Security settings"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 20+ from https://nodejs.org"
    exit 1
else
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js ${NODE_VERSION} installed${NC}"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
else
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm ${NPM_VERSION} installed${NC}"
fi

# Check if .env.local exists
if [[ -f ".env.local" ]]; then
    echo -e "${YELLOW}⚠️  .env.local already exists${NC}"
    read -p "Do you want to backup and recreate it? (y/N): " backup_env
    if [[ "$backup_env" =~ ^[Yy]$ ]]; then
        timestamp=$(date +%Y%m%d_%H%M%S)
        mv .env.local ".env.local.backup_${timestamp}"
        echo -e "${GREEN}✅ Backed up to .env.local.backup_${timestamp}${NC}"
    else
        echo -e "${YELLOW}⚠️  Using existing .env.local${NC}"
    fi
fi

# Create .env.local if it doesn't exist
if [[ ! -f ".env.local" ]]; then
    echo -e "${BLUE}📝 Creating .env.local from template...${NC}"
    cp .env.example .env.local
    echo -e "${GREEN}✅ Created .env.local${NC}"
fi

echo ""
echo -e "${BLUE}🎯 Setup Options${NC}"
echo "=================="
echo "1. Full setup (Supabase + Vercel) - Recommended"
echo "2. Supabase only"
echo "3. Vercel only"
echo "4. Skip automated setup (manual configuration)"
echo ""

read -p "Select option (1-4): " setup_option

case $setup_option in
    1)
        echo ""
        echo -e "${BLUE}🔧 Running full setup...${NC}"
        echo ""
        
        # Supabase setup
        if [[ -f "./setup-supabase.sh" ]]; then
            echo -e "${YELLOW}📦 Setting up Supabase...${NC}"
            chmod +x ./setup-supabase.sh
            ./setup-supabase.sh
        else
            echo -e "${RED}❌ setup-supabase.sh not found${NC}"
        fi
        
        echo ""
        
        # Vercel setup
        if [[ -f "./setup-vercel-env.sh" ]]; then
            echo -e "${YELLOW}▲ Setting up Vercel...${NC}"
            chmod +x ./setup-vercel-env.sh
            ./setup-vercel-env.sh
        else
            echo -e "${RED}❌ setup-vercel-env.sh not found${NC}"
        fi
        ;;
    2)
        echo ""
        echo -e "${BLUE}📦 Setting up Supabase only...${NC}"
        if [[ -f "./setup-supabase.sh" ]]; then
            chmod +x ./setup-supabase.sh
            ./setup-supabase.sh
        else
            echo -e "${RED}❌ setup-supabase.sh not found${NC}"
            exit 1
        fi
        ;;
    3)
        echo ""
        echo -e "${BLUE}▲ Setting up Vercel only...${NC}"
        if [[ -f "./setup-vercel-env.sh" ]]; then
            chmod +x ./setup-vercel-env.sh
            ./setup-vercel-env.sh
        else
            echo -e "${RED}❌ setup-vercel-env.sh not found${NC}"
            exit 1
        fi
        ;;
    4)
        echo ""
        echo -e "${YELLOW}⚠️  Skipping automated setup${NC}"
        echo "Please follow the manual setup instructions in SUPABASE-VERCEL-SETUP.md"
        ;;
    *)
        echo -e "${RED}❌ Invalid option${NC}"
        exit 1
        ;;
esac

# Security validation
echo ""
echo -e "${BLUE}🔒 Running security validation...${NC}"
if [[ -f "./security-validation.sh" ]]; then
    chmod +x ./security-validation.sh
    ./security-validation.sh
else
    echo -e "${YELLOW}⚠️  security-validation.sh not found, skipping...${NC}"
fi

# Install dependencies if needed
echo ""
read -p "Install/update npm dependencies? (y/N): " install_deps
if [[ "$install_deps" =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
fi

# Test build
echo ""
read -p "Test production build? (y/N): " test_build
if [[ "$test_build" =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🔨 Building project...${NC}"
    npm run build
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}✅ Build successful!${NC}"
    else
        echo -e "${RED}❌ Build failed. Please check the errors above.${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "=================="
echo ""
echo -e "${BLUE}📖 Next Steps:${NC}"
echo "1. Review your .env.local file and fill in any missing values"
echo "2. Read SUPABASE-VERCEL-SETUP.md for detailed configuration"
echo "3. Start development server: npm run dev"
echo "4. Deploy to production: npm run deploy:vercel"
echo ""
echo -e "${YELLOW}⚠️  Important:${NC}"
echo "• Never commit .env.local to Git"
echo "• Keep your API keys and secrets secure"
echo "• Use different keys for development and production"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "• Complete setup guide: SUPABASE-VERCEL-SETUP.md"
echo "• Deployment guide: DEPLOYMENT-QUICKSTART.md"
echo "• Project documentation: README_new.md"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
