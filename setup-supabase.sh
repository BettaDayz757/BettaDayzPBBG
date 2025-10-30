#!/bin/bash

# BettaDayz PBBG - Supabase Environment Setup Script
# Automatically configures Supabase environment variables

set -e

echo "🔧 BettaDayz PBBG - Supabase Environment Setup"
echo "=============================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${YELLOW}⚠️  Supabase CLI not found. Installing...${NC}"
    npm install -g supabase
fi

# Function to prompt for input with validation
prompt_input() {
    local prompt="$1"
    local var_name="$2"
    local is_secret="${3:-false}"
    local input=""
    
    while [[ -z "$input" ]]; do
        if [[ "$is_secret" == "true" ]]; then
            read -s -p "$prompt: " input
            echo ""
        else
            read -p "$prompt: " input
        fi
        
        if [[ -z "$input" ]]; then
            echo -e "${RED}❌ This field is required. Please try again.${NC}"
        fi
    done
    
    export "$var_name"="$input"
}

# Function to update .env.local file
update_env_file() {
    local key="$1"
    local value="$2"
    local env_file=".env.local"
    
    if grep -q "^$key=" "$env_file" 2>/dev/null; then
        # Update existing key
        sed -i "s|^$key=.*|$key=$value|" "$env_file"
    else
        # Add new key
        echo "$key=$value" >> "$env_file"
    fi
}

echo ""
echo -e "${BLUE}📝 Supabase Project Configuration${NC}"
echo "Follow these steps to get your Supabase credentials:"
echo "1. Go to https://supabase.com/dashboard"
echo "2. Select your project (or create a new one)"
echo "3. Navigate to Settings > API"
echo ""

# Get Supabase credentials
prompt_input "Enter your Supabase Project URL (starts with https://)" SUPABASE_URL
prompt_input "Enter your Supabase Anon Key" SUPABASE_ANON_KEY
prompt_input "Enter your Supabase Service Role Key" SUPABASE_SERVICE_KEY true

echo ""
echo -e "${BLUE}🔐 JWT Configuration${NC}"
echo "Generating a secure JWT secret..."

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)

echo ""
echo -e "${GREEN}✅ Configuration Summary:${NC}"
echo "Supabase URL: $SUPABASE_URL"
echo "Anon Key: ${SUPABASE_ANON_KEY:0:20}..."
echo "Service Key: [HIDDEN]"
echo "JWT Secret: [GENERATED]"

echo ""
read -p "Save these settings to .env.local? (y/N): " confirm

if [[ "$confirm" =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${YELLOW}💾 Updating .env.local...${NC}"
    
    # Create or update .env.local
    touch .env.local
    
    update_env_file "NEXT_PUBLIC_SUPABASE_URL" "$SUPABASE_URL"
    update_env_file "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$SUPABASE_ANON_KEY"
    update_env_file "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_KEY"
    update_env_file "JWT_SECRET" "$JWT_SECRET"
    update_env_file "NODE_ENV" "development"
    
    echo -e "${GREEN}✅ Environment variables saved to .env.local${NC}"
    
    # Test connection
    echo ""
    echo -e "${YELLOW}🧪 Testing Supabase connection...${NC}"
    
    # Simple curl test to verify URL and anon key
    if curl -s -H "apikey: $SUPABASE_ANON_KEY" "$SUPABASE_URL/rest/v1/" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Supabase connection successful!${NC}"
    else
        echo -e "${RED}❌ Connection test failed. Please verify your credentials.${NC}"
    fi
    
else
    echo -e "${YELLOW}⚠️  Configuration not saved. You can manually update .env.local${NC}"
fi

echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Run the database schema: npm run setup:db"
echo "2. Start development server: npm run dev"
echo "3. Test API endpoints: ./check-deployment.sh"
echo ""

# Offer to run database setup
read -p "Run database schema setup now? (y/N): " setup_db

if [[ "$setup_db" =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${YELLOW}🗄️  Setting up database schema...${NC}"
    
    if [[ -f "supabase-schema.sql" ]]; then
        # Use Supabase CLI to run schema
        if command -v supabase &> /dev/null; then
            export SUPABASE_ACCESS_TOKEN="$SUPABASE_SERVICE_KEY"
            supabase db reset --linked 2>/dev/null || {
                echo "Note: Running schema manually..."
                # Fallback: provide instructions
                echo ""
                echo -e "${BLUE}📖 Manual Database Setup:${NC}"
                echo "1. Go to your Supabase project dashboard"
                echo "2. Navigate to SQL Editor"
                echo "3. Copy and paste the contents of supabase-schema.sql"
                echo "4. Run the query to create all tables and functions"
            }
        else
            echo -e "${YELLOW}⚠️  Please run the SQL schema manually in your Supabase dashboard${NC}"
        fi
    else
        echo -e "${RED}❌ supabase-schema.sql not found${NC}"
    fi
fi

echo ""
echo -e "${GREEN}🎉 Supabase setup complete!${NC}"
echo "Your BettaDayz PBBG is now configured with Supabase."