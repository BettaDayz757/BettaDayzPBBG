#!/bin/bash

# BettaDayz PBBG - Payment Provider Configuration Script
# Sets up Cash App and Bitcoin payment integration with validation

set -e

echo "💰 BettaDayz PBBG - Payment Provider Setup"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Functions
error_exit() {
    echo -e "${RED}❌ Error: $1${NC}" >&2
    exit 1
}

validate_email() {
    local email="$1"
    if [[ ! "$email" =~ ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$ ]]; then
        return 1
    fi
    return 0
}

validate_bitcoin_address() {
    local address="$1"
    # Basic validation for Bitcoin address formats
    if [[ "$address" =~ ^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$ ]] || \
       [[ "$address" =~ ^bc1[a-z0-9]{39,59}$ ]] || \
       [[ "$address" =~ ^[2-9A-HJ-NP-Z][1-9A-HJ-NP-Za-km-z]{33}$ ]]; then
        return 0
    fi
    return 1
}

validate_api_key() {
    local key="$1"
    local min_length="${2:-20}"
    
    if [[ ${#key} -lt $min_length ]]; then
        echo -e "${YELLOW}⚠️  Warning: API key seems short (${#key} chars). Expected at least $min_length.${NC}"
        return 1
    fi
    
    if [[ "$key" =~ ^[a-zA-Z0-9_-]+$ ]]; then
        return 0
    fi
    
    echo -e "${YELLOW}⚠️  Warning: API key contains unexpected characters.${NC}"
    return 1
}

# Load existing environment
ENV_FILE=".env.local"
if [[ -f "$ENV_FILE" ]]; then
    echo -e "${BLUE}📁 Loading existing environment from $ENV_FILE...${NC}"
    set -a
    source "$ENV_FILE"
    set +a
else
    echo -e "${YELLOW}⚠️  $ENV_FILE not found. Creating new environment file...${NC}"
    touch "$ENV_FILE"
fi

echo ""
echo -e "${BLUE}💳 Payment Provider Configuration${NC}"
echo "================================="

# Cash App Configuration
echo ""
echo -e "${YELLOW}🏪 Cash App Configuration${NC}"
echo "-------------------------"

while true; do
    current_cashapp_id="${CASHAPP_CLIENT_ID:-}"
    if [[ -n "$current_cashapp_id" ]]; then
        echo "Current Cash App Client ID: ${current_cashapp_id:0:8}...${current_cashapp_id: -4}"
        read -p "Update Cash App Client ID? (y/N): " update_cashapp_id
        if [[ ! "$update_cashapp_id" =~ ^[Yy]$ ]]; then
            CASHAPP_CLIENT_ID="$current_cashapp_id"
            break
        fi
    fi
    
    echo "Enter Cash App Client ID (from Cash App Developer Portal):"
    read -r -p "Client ID: " CASHAPP_CLIENT_ID
    
    if [[ -z "$CASHAPP_CLIENT_ID" ]]; then
        echo -e "${RED}❌ Cash App Client ID cannot be empty${NC}"
        continue
    fi
    
    if validate_api_key "$CASHAPP_CLIENT_ID" 10; then
        echo -e "${GREEN}✅ Cash App Client ID looks valid${NC}"
        break
    else
        read -p "Continue anyway? (y/N): " continue_anyway
        if [[ "$continue_anyway" =~ ^[Yy]$ ]]; then
            break
        fi
    fi
done

while true; do
    current_cashapp_key="${CASHAPP_API_KEY:-}"
    if [[ -n "$current_cashapp_key" ]]; then
        echo "Current Cash App API Key: ${current_cashapp_key:0:8}...${current_cashapp_key: -4}"
        read -p "Update Cash App API Key? (y/N): " update_cashapp_key
        if [[ ! "$update_cashapp_key" =~ ^[Yy]$ ]]; then
            CASHAPP_API_KEY="$current_cashapp_key"
            break
        fi
    fi
    
    echo "Enter Cash App API Key (from Cash App Developer Portal):"
    read -r -s -p "API Key: " CASHAPP_API_KEY
    echo
    
    if [[ -z "$CASHAPP_API_KEY" ]]; then
        echo -e "${RED}❌ Cash App API Key cannot be empty${NC}"
        continue
    fi
    
    if validate_api_key "$CASHAPP_API_KEY" 32; then
        echo -e "${GREEN}✅ Cash App API Key looks valid${NC}"
        break
    else
        read -p "Continue anyway? (y/N): " continue_anyway
        if [[ "$continue_anyway" =~ ^[Yy]$ ]]; then
            break
        fi
    fi
done

# Cash App Environment
current_cashapp_env="${CASHAPP_ENVIRONMENT:-sandbox}"
echo "Current Cash App Environment: $current_cashapp_env"
echo "Select Cash App Environment:"
echo "1) sandbox (for testing)"
echo "2) production (for live payments)"
read -p "Choose (1-2) [default: 1]: " env_choice

case $env_choice in
    2)
        CASHAPP_ENVIRONMENT="production"
        echo -e "${YELLOW}⚠️  Production environment selected. Use real payment credentials.${NC}"
        ;;
    *)
        CASHAPP_ENVIRONMENT="sandbox"
        echo -e "${GREEN}✅ Sandbox environment selected for testing.${NC}"
        ;;
esac

# Bitcoin Configuration
echo ""
echo -e "${YELLOW}₿ Bitcoin Configuration${NC}"
echo "----------------------"

while true; do
    current_btc_address="${BITCOIN_WALLET_ADDRESS:-}"
    if [[ -n "$current_btc_address" ]]; then
        echo "Current Bitcoin Address: $current_btc_address"
        read -p "Update Bitcoin wallet address? (y/N): " update_btc
        if [[ ! "$update_btc" =~ ^[Yy]$ ]]; then
            BITCOIN_WALLET_ADDRESS="$current_btc_address"
            break
        fi
    fi
    
    echo "Enter Bitcoin wallet address for receiving payments:"
    read -r -p "Wallet Address: " BITCOIN_WALLET_ADDRESS
    
    if [[ -z "$BITCOIN_WALLET_ADDRESS" ]]; then
        echo -e "${RED}❌ Bitcoin wallet address cannot be empty${NC}"
        continue
    fi
    
    if validate_bitcoin_address "$BITCOIN_WALLET_ADDRESS"; then
        echo -e "${GREEN}✅ Bitcoin address format looks valid${NC}"
        break
    else
        echo -e "${RED}❌ Invalid Bitcoin address format${NC}"
        echo "Expected formats: Legacy (1...), SegWit (3...), or Bech32 (bc1...)"
        read -p "Continue anyway? (y/N): " continue_anyway
        if [[ "$continue_anyway" =~ ^[Yy]$ ]]; then
            break
        fi
    fi
done

# Bitcoin Network
current_btc_network="${BITCOIN_NETWORK:-mainnet}"
echo "Current Bitcoin Network: $current_btc_network"
echo "Select Bitcoin Network:"
echo "1) mainnet (live Bitcoin network)"
echo "2) testnet (test Bitcoin network)"
read -p "Choose (1-2) [default: 1]: " network_choice

case $network_choice in
    2)
        BITCOIN_NETWORK="testnet"
        echo -e "${YELLOW}⚠️  Testnet selected. Use testnet addresses and funds.${NC}"
        ;;
    *)
        BITCOIN_NETWORK="mainnet"
        echo -e "${GREEN}✅ Mainnet selected for live transactions.${NC}"
        ;;
esac

# Optional: Bitcoin API Configuration
echo ""
read -p "Configure Bitcoin API for transaction monitoring? (y/N): " configure_btc_api

if [[ "$configure_btc_api" =~ ^[Yy]$ ]]; then
    echo "Bitcoin API Provider:"
    echo "1) BlockCypher"
    echo "2) Blockchain.info"
    echo "3) Custom"
    read -p "Choose (1-3) [default: 1]: " api_choice
    
    case $api_choice in
        2)
            BITCOIN_API_PROVIDER="blockchain_info"
            echo "Using Blockchain.info API (free tier)"
            ;;
        3)
            read -p "Enter custom Bitcoin API URL: " BITCOIN_API_URL
            BITCOIN_API_PROVIDER="custom"
            read -p "Enter API key (optional): " BITCOIN_API_KEY
            ;;
        *)
            BITCOIN_API_PROVIDER="blockcypher"
            read -p "Enter BlockCypher API key (optional, for higher limits): " BITCOIN_API_KEY
            ;;
    esac
fi

# Payment Notification Configuration
echo ""
echo -e "${YELLOW}🔔 Payment Notification Configuration${NC}"
echo "------------------------------------"

read -p "Configure payment notifications via email? (y/N): " configure_notifications

if [[ "$configure_notifications" =~ ^[Yy]$ ]]; then
    while true; do
        current_notification_email="${PAYMENT_NOTIFICATION_EMAIL:-$FROM_EMAIL}"
        if [[ -n "$current_notification_email" ]]; then
            echo "Current notification email: $current_notification_email"
            read -p "Update notification email? (y/N): " update_email
            if [[ ! "$update_email" =~ ^[Yy]$ ]]; then
                PAYMENT_NOTIFICATION_EMAIL="$current_notification_email"
                break
            fi
        fi
        
        read -p "Enter email for payment notifications: " PAYMENT_NOTIFICATION_EMAIL
        
        if [[ -z "$PAYMENT_NOTIFICATION_EMAIL" ]]; then
            echo -e "${RED}❌ Email cannot be empty${NC}"
            continue
        fi
        
        if validate_email "$PAYMENT_NOTIFICATION_EMAIL"; then
            echo -e "${GREEN}✅ Email format looks valid${NC}"
            break
        else
            echo -e "${RED}❌ Invalid email format${NC}"
        fi
    done
fi

# Security Configuration
echo ""
echo -e "${YELLOW}🔒 Security Configuration${NC}"
echo "-------------------------"

# Payment webhook secret
if [[ -z "$PAYMENT_WEBHOOK_SECRET" ]]; then
    echo "Generating secure webhook secret..."
    PAYMENT_WEBHOOK_SECRET=$(openssl rand -hex 32)
    echo -e "${GREEN}✅ Generated new webhook secret${NC}"
else
    echo "Webhook secret already configured"
    read -p "Generate new webhook secret? (y/N): " regen_secret
    if [[ "$regen_secret" =~ ^[Yy]$ ]]; then
        PAYMENT_WEBHOOK_SECRET=$(openssl rand -hex 32)
        echo -e "${GREEN}✅ Generated new webhook secret${NC}"
    fi
fi

# Minimum payment amounts
current_min_usd="${MINIMUM_PAYMENT_USD:-5.00}"
read -p "Minimum payment amount in USD [$current_min_usd]: " MINIMUM_PAYMENT_USD
MINIMUM_PAYMENT_USD="${MINIMUM_PAYMENT_USD:-$current_min_usd}"

current_min_btc="${MINIMUM_PAYMENT_BTC:-0.00010000}"
read -p "Minimum payment amount in BTC [$current_min_btc]: " MINIMUM_PAYMENT_BTC
MINIMUM_PAYMENT_BTC="${MINIMUM_PAYMENT_BTC:-$current_min_btc}"

# Update environment file
echo ""
echo -e "${BLUE}💾 Updating environment configuration...${NC}"

# Create backup
cp "$ENV_FILE" "${ENV_FILE}.backup.$(date +%Y%m%d_%H%M%S)" 2>/dev/null || true

# Remove old payment variables
sed -i '/^# Payment Configuration/,/^$/d' "$ENV_FILE" 2>/dev/null || true
sed -i '/^CASHAPP_/d' "$ENV_FILE" 2>/dev/null || true
sed -i '/^BITCOIN_/d' "$ENV_FILE" 2>/dev/null || true
sed -i '/^PAYMENT_/d' "$ENV_FILE" 2>/dev/null || true
sed -i '/^MINIMUM_PAYMENT_/d' "$ENV_FILE" 2>/dev/null || true

# Add new payment configuration
cat >> "$ENV_FILE" << EOF

# Payment Configuration
# Generated by setup-payment-providers.sh at $(date)

# Cash App Configuration
CASHAPP_CLIENT_ID="$CASHAPP_CLIENT_ID"
CASHAPP_API_KEY="$CASHAPP_API_KEY"
CASHAPP_ENVIRONMENT="$CASHAPP_ENVIRONMENT"

# Bitcoin Configuration
BITCOIN_WALLET_ADDRESS="$BITCOIN_WALLET_ADDRESS"
BITCOIN_NETWORK="$BITCOIN_NETWORK"
EOF

if [[ -n "$BITCOIN_API_PROVIDER" ]]; then
    echo "BITCOIN_API_PROVIDER=\"$BITCOIN_API_PROVIDER\"" >> "$ENV_FILE"
fi

if [[ -n "$BITCOIN_API_URL" ]]; then
    echo "BITCOIN_API_URL=\"$BITCOIN_API_URL\"" >> "$ENV_FILE"
fi

if [[ -n "$BITCOIN_API_KEY" ]]; then
    echo "BITCOIN_API_KEY=\"$BITCOIN_API_KEY\"" >> "$ENV_FILE"
fi

cat >> "$ENV_FILE" << EOF

# Payment Security & Notifications
PAYMENT_WEBHOOK_SECRET="$PAYMENT_WEBHOOK_SECRET"
MINIMUM_PAYMENT_USD="$MINIMUM_PAYMENT_USD"
MINIMUM_PAYMENT_BTC="$MINIMUM_PAYMENT_BTC"
EOF

if [[ -n "$PAYMENT_NOTIFICATION_EMAIL" ]]; then
    echo "PAYMENT_NOTIFICATION_EMAIL=\"$PAYMENT_NOTIFICATION_EMAIL\"" >> "$ENV_FILE"
fi

echo ""
echo -e "${GREEN}🎉 Payment provider configuration complete!${NC}"
echo ""
echo -e "${BLUE}📋 Configuration Summary:${NC}"
echo "========================"
echo "• Cash App Environment: $CASHAPP_ENVIRONMENT"
echo "• Bitcoin Network: $BITCOIN_NETWORK"
echo "• Bitcoin Wallet: $BITCOIN_WALLET_ADDRESS"
echo "• Minimum USD Payment: \$$MINIMUM_PAYMENT_USD"
echo "• Minimum BTC Payment: ₿$MINIMUM_PAYMENT_BTC"
if [[ -n "$PAYMENT_NOTIFICATION_EMAIL" ]]; then
    echo "• Notification Email: $PAYMENT_NOTIFICATION_EMAIL"
fi
if [[ -n "$BITCOIN_API_PROVIDER" ]]; then
    echo "• Bitcoin API: $BITCOIN_API_PROVIDER"
fi

echo ""
echo -e "${BLUE}🚀 Next Steps:${NC}"
echo "1. Test payment integration: npm run test:payments"
echo "2. Update payment webhook URLs in provider dashboards"
echo "3. Validate configuration: ./validate-env.sh"
echo "4. Deploy updated environment: ./setup-vercel-env.sh"
echo ""
echo -e "${YELLOW}⚠️  Important Security Notes:${NC}"
echo "• Keep API keys secure and never commit to version control"
echo "• Use sandbox/testnet for development and testing"
echo "• Verify webhook signatures in production"
echo "• Monitor payment transactions regularly"
echo ""
echo -e "${YELLOW}📚 Documentation:${NC}"
echo "• Cash App API: https://developers.cash.app/"
echo "• Bitcoin Integration: docs/BITCOIN-PAYMENTS.md"
echo "• Payment Security: docs/PAYMENT-SECURITY.md"