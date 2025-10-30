#!/bin/bash

# BettaDayz PBBG - Security Environment Validation
# Comprehensive security checks for environment variables and sensitive data

set -e

echo "🔒 BettaDayz PBBG - Security Environment Validation"
echo "=================================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Counters
SECURITY_ISSUES=0
WARNINGS=0
CHECKS_PASSED=0

# Arrays for tracking issues
declare -a CRITICAL_ISSUES=()
declare -a WARNING_ISSUES=()
declare -a PASSED_CHECKS=()

# Functions
log_critical() {
    echo -e "${RED}🚨 CRITICAL: $1${NC}"
    CRITICAL_ISSUES+=("$1")
    ((SECURITY_ISSUES++))
}

log_warning() {
    echo -e "${YELLOW}⚠️  WARNING: $1${NC}"
    WARNING_ISSUES+=("$1")
    ((WARNINGS++))
}

log_pass() {
    echo -e "${GREEN}✅ PASS: $1${NC}"
    PASSED_CHECKS+=("$1")
    ((CHECKS_PASSED++))
}

log_info() {
    echo -e "${BLUE}ℹ️  INFO: $1${NC}"
}

# Check if environment file exists
ENV_FILE="${1:-.env.local}"
if [[ ! -f "$ENV_FILE" ]]; then
    log_critical "Environment file '$ENV_FILE' not found"
    echo "Usage: $0 [env-file-path]"
    exit 1
fi

echo ""
echo -e "${BLUE}🔍 Analyzing environment file: $ENV_FILE${NC}"
echo "================================================"

# Load environment variables
set -a
source "$ENV_FILE"
set +a

echo ""
echo -e "${PURPLE}🔐 JWT and Authentication Security${NC}"
echo "=================================="

# JWT Secret validation
if [[ -z "$JWT_SECRET" ]]; then
    log_critical "JWT_SECRET is not set - authentication will fail"
elif [[ ${#JWT_SECRET} -lt 32 ]]; then
    log_critical "JWT_SECRET is too short (${#JWT_SECRET} chars) - minimum 32 characters required"
elif [[ "$JWT_SECRET" =~ ^[a-zA-Z0-9]+$ ]] && [[ ${#JWT_SECRET} -lt 64 ]]; then
    log_warning "JWT_SECRET appears to be simple alphanumeric - consider using more complex secret"
elif [[ "$JWT_SECRET" == "your-super-secret-jwt-key" ]] || [[ "$JWT_SECRET" == "secret" ]]; then
    log_critical "JWT_SECRET is using default/example value - change immediately"
else
    log_pass "JWT_SECRET appears secure (${#JWT_SECRET} characters)"
fi

# NextAuth Secret validation
if [[ -z "$NEXTAUTH_SECRET" ]]; then
    log_critical "NEXTAUTH_SECRET is not set - NextAuth will fail in production"
elif [[ ${#NEXTAUTH_SECRET} -lt 32 ]]; then
    log_critical "NEXTAUTH_SECRET is too short (${#NEXTAUTH_SECRET} chars) - minimum 32 characters required"
elif [[ "$NEXTAUTH_SECRET" == "$JWT_SECRET" ]]; then
    log_warning "NEXTAUTH_SECRET is same as JWT_SECRET - consider using different secrets"
else
    log_pass "NEXTAUTH_SECRET appears secure (${#NEXTAUTH_SECRET} characters)"
fi

# NextAuth URL validation
if [[ -z "$NEXTAUTH_URL" ]]; then
    log_warning "NEXTAUTH_URL is not set - may cause issues in production"
elif [[ "$NEXTAUTH_URL" =~ ^https?://localhost ]]; then
    log_warning "NEXTAUTH_URL is set to localhost - update for production deployment"
elif [[ "$NEXTAUTH_URL" =~ ^https:// ]]; then
    log_pass "NEXTAUTH_URL uses HTTPS"
else
    log_warning "NEXTAUTH_URL should use HTTPS in production"
fi

echo ""
echo -e "${PURPLE}🗄️  Database Security${NC}"
echo "====================="

# Supabase security
if [[ -z "$SUPABASE_SERVICE_ROLE_KEY" ]]; then
    log_critical "SUPABASE_SERVICE_ROLE_KEY is not set"
elif [[ ${#SUPABASE_SERVICE_ROLE_KEY} -lt 50 ]]; then
    log_warning "SUPABASE_SERVICE_ROLE_KEY seems short (${#SUPABASE_SERVICE_ROLE_KEY} chars)"
else
    log_pass "SUPABASE_SERVICE_ROLE_KEY appears to be set correctly"
fi

if [[ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]]; then
    log_critical "NEXT_PUBLIC_SUPABASE_ANON_KEY is not set"
elif [[ ${#NEXT_PUBLIC_SUPABASE_ANON_KEY} -lt 50 ]]; then
    log_warning "NEXT_PUBLIC_SUPABASE_ANON_KEY seems short"
else
    log_pass "NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be set correctly"
fi

if [[ -z "$NEXT_PUBLIC_SUPABASE_URL" ]]; then
    log_critical "NEXT_PUBLIC_SUPABASE_URL is not set"
elif [[ ! "$NEXT_PUBLIC_SUPABASE_URL" =~ ^https:// ]]; then
    log_critical "NEXT_PUBLIC_SUPABASE_URL must use HTTPS"
elif [[ "$NEXT_PUBLIC_SUPABASE_URL" =~ \.supabase\.co$ ]]; then
    log_pass "NEXT_PUBLIC_SUPABASE_URL appears valid"
else
    log_warning "NEXT_PUBLIC_SUPABASE_URL format may be incorrect"
fi

echo ""
echo -e "${PURPLE}💳 Payment Security${NC}"
echo "==================="

# Cash App security
if [[ -n "$CASHAPP_API_KEY" ]]; then
    if [[ ${#CASHAPP_API_KEY} -lt 20 ]]; then
        log_warning "CASHAPP_API_KEY seems short (${#CASHAPP_API_KEY} chars)"
    else
        log_pass "CASHAPP_API_KEY appears to be set correctly"
    fi
    
    if [[ "$CASHAPP_ENVIRONMENT" == "production" ]] && [[ "$CASHAPP_API_KEY" =~ test|sandbox|demo ]]; then
        log_critical "Using test/sandbox credentials in production environment"
    elif [[ "$CASHAPP_ENVIRONMENT" == "sandbox" ]]; then
        log_pass "Using sandbox environment for Cash App"
    fi
fi

# Bitcoin security
if [[ -n "$BITCOIN_WALLET_ADDRESS" ]]; then
    if [[ "$BITCOIN_WALLET_ADDRESS" =~ ^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$ ]] || \
       [[ "$BITCOIN_WALLET_ADDRESS" =~ ^bc1[a-z0-9]{39,59}$ ]] || \
       [[ "$BITCOIN_WALLET_ADDRESS" =~ ^[2-9A-HJ-NP-Z][1-9A-HJ-NP-Za-km-z]{33}$ ]]; then
        log_pass "Bitcoin wallet address format appears valid"
    else
        log_warning "Bitcoin wallet address format may be invalid"
    fi
    
    if [[ "$BITCOIN_NETWORK" == "mainnet" ]] && [[ "$BITCOIN_WALLET_ADDRESS" =~ ^(tb1|m|n|2) ]]; then
        log_critical "Using testnet address with mainnet configuration"
    elif [[ "$BITCOIN_NETWORK" == "testnet" ]] && [[ "$BITCOIN_WALLET_ADDRESS" =~ ^[13bc] ]]; then
        log_warning "Using mainnet address with testnet configuration"
    fi
fi

# Payment webhook security
if [[ -n "$PAYMENT_WEBHOOK_SECRET" ]]; then
    if [[ ${#PAYMENT_WEBHOOK_SECRET} -lt 32 ]]; then
        log_warning "PAYMENT_WEBHOOK_SECRET is short (${#PAYMENT_WEBHOOK_SECRET} chars) - consider 32+ chars"
    else
        log_pass "PAYMENT_WEBHOOK_SECRET appears secure"
    fi
else
    log_warning "PAYMENT_WEBHOOK_SECRET not set - webhooks won't be verified"
fi

echo ""
echo -e "${PURPLE}🔑 API Keys and External Services${NC}"
echo "=================================="

# SendGrid security
if [[ -n "$SENDGRID_API_KEY" ]]; then
    if [[ "$SENDGRID_API_KEY" =~ ^SG\. ]]; then
        log_pass "SendGrid API key format appears valid"
    else
        log_warning "SendGrid API key format may be incorrect"
    fi
fi

# Redis security
if [[ -n "$REDIS_URL" ]]; then
    if [[ "$REDIS_URL" =~ ^redis:// ]]; then
        log_warning "Redis URL uses unencrypted connection - consider rediss://"
    elif [[ "$REDIS_URL" =~ ^rediss:// ]]; then
        log_pass "Redis URL uses encrypted connection"
    fi
    
    if [[ "$REDIS_URL" =~ :([^@]*@|:).*:6379 ]]; then
        log_warning "Redis is using default port 6379 - consider changing for security"
    fi
fi

echo ""
echo -e "${PURPLE}🌐 Domain and URL Security${NC}"
echo "=========================="

# Domain validation
if [[ -n "$NEXT_PUBLIC_DOMAIN" ]]; then
    if [[ "$NEXT_PUBLIC_DOMAIN" =~ ^https:// ]]; then
        log_warning "NEXT_PUBLIC_DOMAIN should not include protocol"
    elif [[ "$NEXT_PUBLIC_DOMAIN" =~ \. ]]; then
        log_pass "NEXT_PUBLIC_DOMAIN appears to be a valid domain"
    else
        log_warning "NEXT_PUBLIC_DOMAIN may not be a valid domain format"
    fi
fi

if [[ -n "$NEXT_PUBLIC_STORE_DOMAIN" ]]; then
    if [[ "$NEXT_PUBLIC_STORE_DOMAIN" =~ ^https:// ]]; then
        log_warning "NEXT_PUBLIC_STORE_DOMAIN should not include protocol"
    elif [[ "$NEXT_PUBLIC_STORE_DOMAIN" =~ \. ]]; then
        log_pass "NEXT_PUBLIC_STORE_DOMAIN appears to be a valid domain"
    fi
fi

echo ""
echo -e "${PURPLE}🚫 Sensitive Data Exposure Check${NC}"
echo "=================================="

# Check for common sensitive patterns
sensitive_patterns=(
    "password.*="
    "secret.*=.*['\"][^'\"]*['\"]"
    "key.*=.*['\"][^'\"]*['\"]"
    "token.*=.*['\"][^'\"]*['\"]"
)

public_vars_found=()
while IFS= read -r line; do
    if [[ "$line" =~ ^NEXT_PUBLIC_.*= ]]; then
        var_name=$(echo "$line" | cut -d'=' -f1)
        var_value=$(echo "$line" | cut -d'=' -f2- | tr -d '"'"'"' ')
        
        # Check if public variable contains sensitive data
        for pattern in "${sensitive_patterns[@]}"; do
            if [[ "$line" =~ $pattern ]]; then
                log_critical "Public variable $var_name may contain sensitive data"
                break
            fi
        done
        
        # Check for obvious secrets in public vars
        if [[ "$var_value" =~ ^[a-zA-Z0-9]{32,} ]] && [[ ${#var_value} -gt 50 ]]; then
            log_warning "Public variable $var_name contains long string that may be a secret"
        fi
        
        public_vars_found+=("$var_name")
    fi
done < "$ENV_FILE"

if [[ ${#public_vars_found[@]} -gt 0 ]]; then
    log_info "Found ${#public_vars_found[@]} public variables (NEXT_PUBLIC_*)"
else
    log_warning "No public variables found - may be missing NEXT_PUBLIC_* configurations"
fi

echo ""
echo -e "${PURPLE}🔍 Environment-Specific Checks${NC}"
echo "=============================="

# Production-specific checks
if [[ "$NODE_ENV" == "production" ]]; then
    log_info "Running production environment checks..."
    
    # Check for development-only values
    if [[ "$NEXT_PUBLIC_DOMAIN" =~ localhost|127\.0\.0\.1|\.local ]]; then
        log_critical "Production environment using localhost domain"
    fi
    
    if [[ "$NEXTAUTH_URL" =~ localhost|127\.0\.0\.1 ]]; then
        log_critical "Production environment using localhost auth URL"
    fi
    
    # Check for debug flags
    if [[ "$DEBUG" == "true" ]] || [[ "$NEXT_PUBLIC_DEBUG" == "true" ]]; then
        log_warning "Debug mode enabled in production environment"
    fi
    
    if [[ "$NEXT_TELEMETRY_DISABLED" != "1" ]]; then
        log_info "Next.js telemetry is enabled - consider disabling in production"
    fi
else
    log_info "Development environment detected"
fi

echo ""
echo -e "${PURPLE}📦 File Security Check${NC}"
echo "======================"

# Check file permissions
file_perms=$(stat -f "%A" "$ENV_FILE" 2>/dev/null || stat -c "%a" "$ENV_FILE" 2>/dev/null)
if [[ "$file_perms" =~ ^6 ]] || [[ "$file_perms" =~ [2367]$ ]]; then
    log_warning "Environment file has write permissions for group/others (permissions: $file_perms)"
elif [[ "$file_perms" =~ ^[45] ]]; then
    log_pass "Environment file has secure permissions (permissions: $file_perms)"
else
    log_info "Environment file permissions: $file_perms"
fi

# Check for backup files
backup_files=(
    ".env.backup"
    ".env.bak"
    ".env.local.backup"
    ".env.local.bak"
    "${ENV_FILE}.backup"
    "${ENV_FILE}.bak"
)

for backup in "${backup_files[@]}"; do
    if [[ -f "$backup" ]]; then
        log_warning "Backup environment file found: $backup - ensure it's secured"
    fi
done

echo ""
echo -e "${PURPLE}📋 Security Audit Summary${NC}"
echo "=========================="

echo ""
echo -e "${BLUE}📊 Results:${NC}"
echo "• Critical Issues: ${RED}$SECURITY_ISSUES${NC}"
echo "• Warnings: ${YELLOW}$WARNINGS${NC}"
echo "• Checks Passed: ${GREEN}$CHECKS_PASSED${NC}"
echo "• Total Checks: $((SECURITY_ISSUES + WARNINGS + CHECKS_PASSED))"

if [[ $SECURITY_ISSUES -gt 0 ]]; then
    echo ""
    echo -e "${RED}🚨 CRITICAL ISSUES FOUND:${NC}"
    for issue in "${CRITICAL_ISSUES[@]}"; do
        echo "  • $issue"
    done
fi

if [[ $WARNINGS -gt 0 ]]; then
    echo ""
    echo -e "${YELLOW}⚠️  WARNINGS:${NC}"
    for warning in "${WARNING_ISSUES[@]}"; do
        echo "  • $warning"
    done
fi

echo ""
if [[ $SECURITY_ISSUES -eq 0 ]]; then
    echo -e "${GREEN}🎉 No critical security issues found!${NC}"
    if [[ $WARNINGS -eq 0 ]]; then
        echo -e "${GREEN}✨ Environment configuration looks secure!${NC}"
    else
        echo -e "${YELLOW}📋 Review warnings above for optimal security.${NC}"
    fi
else
    echo -e "${RED}❌ CRITICAL security issues must be addressed before deployment!${NC}"
fi

echo ""
echo -e "${BLUE}🔧 Recommended Actions:${NC}"
echo "1. Fix all critical issues immediately"
echo "2. Review and address warnings"
echo "3. Use strong, unique secrets for all services"
echo "4. Enable HTTPS for all production URLs"
echo "5. Regularly rotate API keys and secrets"
echo "6. Use environment-specific configurations"
echo "7. Monitor for unauthorized access attempts"

echo ""
echo -e "${YELLOW}📚 Security Resources:${NC}"
echo "• OWASP Environment Security: https://owasp.org/www-project-top-ten/"
echo "• Next.js Security: https://nextjs.org/docs/advanced-features/security-headers"
echo "• Supabase Security: https://supabase.com/docs/guides/platform/security"

# Exit with error code if critical issues found
if [[ $SECURITY_ISSUES -gt 0 ]]; then
    exit 1
else
    exit 0
fi