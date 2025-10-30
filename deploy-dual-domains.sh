#!/bin/bash

# =======================================================
# BettaDayz PBBG Dual Domain Deployment Script
# Deploys to both bettadayz.shop and bettadayz.store
# =======================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="bettadayz-pbbg"
BUILD_DIR="out"
NODE_VERSION="20"

echo -e "${BLUE}🚀 BettaDayz PBBG Dual Domain Deployment${NC}"
echo -e "${BLUE}=======================================${NC}"

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

if ! command_exists node; then
    print_error "Node.js is not installed"
    exit 1
fi

if ! command_exists npm; then
    print_error "npm is not installed"
    exit 1
fi

if ! command_exists git; then
    print_error "git is not installed"
    exit 1
fi

# Check Node.js version
NODE_CURRENT=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_CURRENT" -lt "$NODE_VERSION" ]; then
    print_warning "Node.js version $NODE_CURRENT detected. Recommended: $NODE_VERSION+"
fi

print_success "Prerequisites check passed"

# Clean previous builds
print_status "Cleaning previous builds..."
rm -rf .next out dist

# Install dependencies
print_status "Installing dependencies..."
if [ -f "package-lock.json" ]; then
    npm ci
else
    npm install
fi

print_success "Dependencies installed"

# Set production environment
print_status "Setting up production environment..."
export NODE_ENV=production

# Copy production environment variables
if [ -f ".env.production" ]; then
    cp .env.production .env.local
    print_success "Production environment variables loaded"
else
    print_warning ".env.production not found, using existing .env.local"
fi

# Lint the code
print_status "Running linter..."
if npm run lint; then
    print_success "Linting passed"
else
    print_warning "Linting failed, continuing anyway..."
fi

# Build the application
print_status "Building application for production..."
if npm run build; then
    print_success "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

# Verify build output
if [ ! -d "$BUILD_DIR" ]; then
    print_error "Build directory '$BUILD_DIR' not found"
    exit 1
fi

print_success "Build verification passed"

# Create deployment info file
print_status "Creating deployment info..."
cat > "${BUILD_DIR}/deployment-info.json" << EOF
{
    "deploymentDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "version": "$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')",
    "branch": "$(git branch --show-current 2>/dev/null || echo 'unknown')",
    "nodeVersion": "$(node -v)",
    "domains": ["bettadayz.shop", "bettadayz.store"],
    "buildEnvironment": "production"
}
EOF

# Copy Cloudflare configuration files to build directory
print_status "Copying Cloudflare configuration..."
cp _redirects "${BUILD_DIR}/" 2>/dev/null || print_warning "_redirects file not found"
cp _headers "${BUILD_DIR}/" 2>/dev/null || print_warning "_headers file not found"

# Copy functions directory if it exists
if [ -d "functions" ]; then
    cp -r functions "${BUILD_DIR}/" 
    print_success "Functions copied to build directory"
fi

# Create wrangler.toml for Cloudflare deployment
print_status "Creating Cloudflare configuration..."
cat > wrangler.toml << EOF
name = "$PROJECT_NAME"
compatibility_date = "2024-10-01"

[build]
command = "npm run build"
cwd = "."
watch_dir = "app"

[[pages_plugins]]
binding = "PAGES_PLUGIN"

[vars]
NODE_ENV = "production"

[[env.production.routes]]
pattern = "bettadayz.shop/*"
zone_name = "bettadayz.shop"

[[env.production.routes]]
pattern = "bettadayz.store/*"
zone_name = "bettadayz.store"
EOF

print_success "Cloudflare configuration created"

# Git operations
print_status "Preparing Git commit..."

# Add all changes
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    print_warning "No changes to commit"
else
    # Commit changes
    COMMIT_MSG="Deploy dual domain setup - $(date +"%Y-%m-%d %H:%M:%S")"
    git commit -m "$COMMIT_MSG"
    print_success "Changes committed: $COMMIT_MSG"
fi

# Push to repository
print_status "Pushing to repository..."
if git push origin main; then
    print_success "Pushed to repository successfully"
else
    print_warning "Failed to push to repository (may already be up to date)"
fi

# Deployment summary
echo ""
echo -e "${GREEN}✅ Deployment Preparation Complete!${NC}"
echo -e "${BLUE}==========================================${NC}"
echo ""
echo -e "${YELLOW}Deployment Summary:${NC}"
echo -e "• Build directory: ${BUILD_DIR}"
echo -e "• Domains configured: bettadayz.shop, bettadayz.store"
echo -e "• Environment: production"
echo -e "• Git commit: $(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "1. ${BLUE}Cloudflare Pages Deployment:${NC}"
echo -e "   - Go to Cloudflare Pages dashboard"
echo -e "   - Connect your Git repository"
echo -e "   - Configure build settings:"
echo -e "     • Build command: npm run build"
echo -e "     • Build output: out"
echo -e "     • Node.js version: $NODE_VERSION"
echo -e "   - Add custom domains:"
echo -e "     • bettadayz.shop"
echo -e "     • bettadayz.store"
echo ""
echo -e "2. ${BLUE}Environment Variables:${NC}"
echo -e "   Add these to Cloudflare Pages environment variables:"
while IFS= read -r line; do
    if [[ $line == *"="* ]] && [[ $line != "#"* ]]; then
        var_name=$(echo "$line" | cut -d'=' -f1)
        echo -e "   • $var_name"
    fi
done < .env.production
echo ""
echo -e "3. ${BLUE}Verification:${NC}"
echo -e "   Run: ./verify-domains.sh"
echo ""
echo -e "${GREEN}🎉 Ready for deployment!${NC}"