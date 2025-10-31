#!/bin/bash

# ================================================================
# VPS Deployment Configuration Template
# ================================================================
# 
# INSTRUCTIONS:
# 1. Copy this file: cp vps-config.template.sh vps-config.sh
# 2. Edit vps-config.sh with your actual values
# 3. Run: ./deploy-to-vps.sh (it will read from vps-config.sh)
# 4. Add vps-config.sh to .gitignore (never commit credentials!)
# ================================================================

# === VPS Connection Settings ===
export VPS_USER="your_username"           # SSH username (e.g., root, ubuntu, admin)
export VPS_IP="your.vps.ip.address"       # VPS IP address (e.g., 203.0.113.10)
export VPS_SSH_PORT="22"                  # SSH port (usually 22)

# === Deployment Paths ===
export VPS_DEPLOY_PATH="/var/www/BettaDayzPBBG"  # Application directory on VPS

# === Application Settings ===
export APP_PORT="3000"                    # Port your app will run on
export PM2_APP_NAME="bettadayz"           # PM2 process name

# === Repository Settings ===
export REPO_URL="https://github.com/BettaDayz757/BettaDayzPBBG.git"
export REPO_BRANCH="main"

# === Domain Settings (Optional) ===
export PRIMARY_DOMAIN="bettadayz.shop"    # Your primary domain
export SECONDARY_DOMAIN="bettadayz.store" # Your secondary domain (if any)

# ================================================================
# Environment Variables for Production
# ================================================================
# These will be added to .env.production on the VPS

export NODE_ENV="production"
export SITE_URL="https://${PRIMARY_DOMAIN}"

# Add your secrets below (NEVER commit this file after adding secrets!)
# export DATABASE_URL="your_database_url"
# export SUPABASE_URL="your_supabase_url"
# export SUPABASE_ANON_KEY="your_supabase_anon_key"
# export JWT_SECRET="your_jwt_secret"
# export SESSION_SECRET="your_session_secret"
