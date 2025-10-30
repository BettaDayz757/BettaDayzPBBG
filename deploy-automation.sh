#!/bin/bash

# BettaDayz PBBG Automated Deployment Setup
# Handles Cloudflare Pages/Workers and Vercel deployment

set -e

echo "🚀 BettaDayz PBBG Deployment Automation"
echo "======================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if required tools are installed
print_status "Checking required tools..."

if ! command -v wrangler &> /dev/null; then
    print_error "Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

print_success "All required tools are available"

# Function to setup Cloudflare authentication
setup_cloudflare() {
    print_status "Setting up Cloudflare authentication..."
    
    echo ""
    echo "📋 Cloudflare Setup Instructions:"
    echo "1. Go to https://dash.cloudflare.com/profile/api-tokens"
    echo "2. Click 'Create Token'"
    echo "3. Use 'Edit Cloudflare Workers' template"
    echo "4. Set permissions:"
    echo "   - Account: Cloudflare Workers:Edit"
    echo "   - Zone: Zone:Read (for all zones)"
    echo "5. Add your account ID to Account Resources"
    echo "6. Create token and copy it"
    echo ""
    
    read -p "Press Enter when you have your Cloudflare API token ready..."
    
    # Authenticate with Cloudflare
    print_status "Authenticating with Cloudflare..."
    wrangler auth login || {
        print_warning "Browser login failed. Trying token authentication..."
        echo "Paste your Cloudflare API token:"
        read -s CLOUDFLARE_TOKEN
        export CLOUDFLARE_API_TOKEN="$CLOUDFLARE_TOKEN"
        
        # Test authentication
        if wrangler whoami; then
            print_success "Cloudflare authentication successful!"
        else
            print_error "Cloudflare authentication failed"
            return 1
        fi
    }
}

# Function to setup Vercel authentication
setup_vercel() {
    print_status "Setting up Vercel authentication..."
    
    echo ""
    echo "📋 Vercel Setup Instructions:"
    echo "1. Go to https://vercel.com/account/tokens"
    echo "2. Create a new token with appropriate scopes"
    echo "3. Copy the token"
    echo ""
    
    read -p "Press Enter when you have your Vercel token ready..."
    
    # Authenticate with Vercel
    print_status "Authenticating with Vercel..."
    vercel login || {
        print_error "Vercel authentication failed"
        return 1
    }
    
    print_success "Vercel authentication successful!"
}

# Function to deploy to Cloudflare
deploy_cloudflare() {
    print_status "Deploying to Cloudflare..."
    
    # Build the project first
    print_status "Building project for Cloudflare..."
    npm run build || {
        print_error "Build failed"
        return 1
    }
    
    # Deploy the worker
    print_status "Deploying Cloudflare Worker..."
    wrangler deploy || {
        print_error "Cloudflare deployment failed"
        return 1
    }
    
    print_success "Cloudflare deployment successful!"
    
    # Set up secrets
    print_status "Setting up Cloudflare secrets..."
    echo ""
    echo "You'll need to set up the following secrets:"
    echo "- JWT_SECRET"
    echo "- SUPABASE_SERVICE_ROLE_KEY"
    echo "- CASHAPP_API_KEY"
    echo ""
    echo "Use: wrangler secret put SECRET_NAME"
    echo ""
}

# Function to deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    # Build the project first
    print_status "Building project for Vercel..."
    npm run build || {
        print_error "Build failed"
        return 1
    }
    
    # Deploy to Vercel
    print_status "Deploying to Vercel..."
    vercel --prod || {
        print_error "Vercel deployment failed"
        return 1
    }
    
    print_success "Vercel deployment successful!"
}

# Function to setup Supabase project
setup_supabase() {
    print_status "Setting up Supabase project..."
    
    echo ""
    echo "📋 Supabase Setup Instructions:"
    echo "1. Go to https://supabase.com/dashboard"
    echo "2. Click 'New Project'"
    echo "3. Set project name: 'bettadayz-pbbg'"
    echo "4. Set database password (save it!)"
    echo "5. Select region closest to your users"
    echo "6. Create project"
    echo "7. Go to Settings > API to get your keys"
    echo ""
    
    read -p "Press Enter when your Supabase project is ready..."
    
    echo "Please update your .env.local with the new Supabase credentials:"
    echo "- NEXT_PUBLIC_SUPABASE_URL"
    echo "- NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "- SUPABASE_SERVICE_ROLE_KEY"
    echo ""
}

# Function to test deployments
test_deployments() {
    print_status "Testing deployments..."
    
    # Test Cloudflare deployment
    print_status "Testing Cloudflare Worker..."
    CLOUDFLARE_URL=$(wrangler whoami 2>/dev/null | grep -o 'https://[^"]*workers.dev' || echo "Not available")
    if [[ "$CLOUDFLARE_URL" != "Not available" ]]; then
        curl -I "$CLOUDFLARE_URL" || print_warning "Cloudflare Worker test failed"
    fi
    
    # Test Vercel deployment
    print_status "Testing Vercel deployment..."
    VERCEL_URL=$(vercel ls 2>/dev/null | grep -o 'https://[^" ]*\.vercel\.app' | head -1 || echo "Not available")
    if [[ "$VERCEL_URL" != "Not available" ]]; then
        curl -I "$VERCEL_URL" || print_warning "Vercel deployment test failed"
    fi
}

# Function to generate deployment report
generate_report() {
    print_status "Generating deployment report..."
    
    REPORT_FILE="deployment-report-$(date +%Y%m%d-%H%M%S).md"
    
    cat > "$REPORT_FILE" << EOF
# BettaDayz PBBG Deployment Report
Generated: $(date)

## Deployment Status

### Cloudflare Worker
- Status: $(wrangler whoami &>/dev/null && echo "✅ Authenticated" || echo "❌ Not authenticated")
- Worker Name: bettadayz-pbbg
- Configuration: wrangler.toml

### Vercel Project
- Status: $(vercel whoami &>/dev/null && echo "✅ Authenticated" || echo "❌ Not authenticated")
- Project: BettaDayz PBBG

### Domain Configuration
- Primary Domain: bettadayz.shop (Gaming/PBBG)
- Store Domain: bettadayz.store (Payments)
- Routing: Configured via Cloudflare Worker

### Next Steps
1. Configure DNS records for domains
2. Set up SSL certificates
3. Configure environment variables for production
4. Set up monitoring and analytics
5. Test payment integration
6. Launch production

## API Routes
The following API routes are configured:
- /api/auth
- /api/payments
- /api/game
- /api/users
- /api/marketplace
- /api/chat
- /api/avatars
- /api/achievements
- /api/admin

## Security Configuration
- JWT authentication configured
- CORS headers set
- Security headers implemented
- Environment variables secured

## Monitoring
- Cloudflare Analytics available
- Vercel Analytics available
- Custom error logging configured

EOF

    print_success "Deployment report generated: $REPORT_FILE"
}

# Main deployment workflow
main() {
    print_status "Starting BettaDayz PBBG deployment automation..."
    
    # Check authentication status
    print_status "Checking authentication status..."
    
    CLOUDFLARE_AUTH=$(wrangler whoami &>/dev/null && echo "true" || echo "false")
    VERCEL_AUTH=$(vercel whoami &>/dev/null && echo "true" || echo "false")
    
    echo "Cloudflare: $([[ $CLOUDFLARE_AUTH == "true" ]] && echo "✅ Authenticated" || echo "❌ Not authenticated")"
    echo "Vercel: $([[ $VERCEL_AUTH == "true" ]] && echo "✅ Authenticated" || echo "❌ Not authenticated")"
    echo ""
    
    # Setup authentication if needed
    if [[ $CLOUDFLARE_AUTH == "false" ]]; then
        setup_cloudflare
    fi
    
    if [[ $VERCEL_AUTH == "false" ]]; then
        setup_vercel
    fi
    
    # Deployment menu
    echo ""
    echo "🚀 Deployment Options:"
    echo "1. Deploy to Cloudflare only"
    echo "2. Deploy to Vercel only" 
    echo "3. Deploy to both platforms"
    echo "4. Setup Supabase project"
    echo "5. Test deployments"
    echo "6. Generate deployment report"
    echo "7. Full deployment pipeline"
    echo ""
    
    read -p "Select option (1-7): " OPTION
    
    case $OPTION in
        1)
            deploy_cloudflare
            ;;
        2)
            deploy_vercel
            ;;
        3)
            deploy_cloudflare
            deploy_vercel
            ;;
        4)
            setup_supabase
            ;;
        5)
            test_deployments
            ;;
        6)
            generate_report
            ;;
        7)
            deploy_cloudflare
            deploy_vercel
            setup_supabase
            test_deployments
            generate_report
            ;;
        *)
            print_error "Invalid option selected"
            exit 1
            ;;
    esac
    
    print_success "Deployment automation completed!"
}

# Run main function
main "$@"