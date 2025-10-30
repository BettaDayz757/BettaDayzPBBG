#!/bin/bash

# BettaDayz PBBG - Enhanced Deployment Health Checker
# Comprehensive deployment status and environment validation

set -e

echo "🚀 BettaDayz PBBG - Enhanced Deployment Health Check"
echo "==================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Counters
CHECKS_PASSED=0
CHECKS_FAILED=0
CHECKS_WARNING=0

# Track issues
declare -a CRITICAL_ISSUES=()
declare -a WARNING_ISSUES=()

# Logging functions
log_pass() {
    echo -e "${GREEN}✅ $1${NC}"
    ((CHECKS_PASSED++))
}

log_fail() {
    echo -e "${RED}❌ $1${NC}"
    CRITICAL_ISSUES+=("$1")
    ((CHECKS_FAILED++))
}

log_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    WARNING_ISSUES+=("$1")
    ((CHECKS_WARNING++))
}

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Load environment variables if available
ENV_FILE=".env.local"
if [[ -f "$ENV_FILE" ]]; then
    log_info "Loading environment from $ENV_FILE"
    set -a
    source "$ENV_FILE"
    set +a
else
    log_warn "Environment file $ENV_FILE not found - some checks may be limited"
fi

# Enhanced URL checker with timeout and detailed info
check_url_enhanced() {
    local url=$1
    local name=$2
    local expected_status=${3:-200}
    local timeout=${4:-10}
    
    echo "🔍 Checking $name..."
    
    # Check connectivity with timeout
    local response=$(curl -s -w "HTTPSTATUS:%{http_code};TOTAL_TIME:%{time_total};SIZE:%{size_download}" \
                          --max-time $timeout \
                          --connect-timeout 5 \
                          "$url" || echo "HTTPSTATUS:000;TOTAL_TIME:0;SIZE:0")
    
    local status=$(echo $response | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
    local time=$(echo $response | grep -o "TOTAL_TIME:[0-9.]*" | cut -d: -f2)
    local size=$(echo $response | grep -o "SIZE:[0-9]*" | cut -d: -f2)
    
    if [[ "$status" == "$expected_status" ]]; then
        log_pass "$name: Online (${status}) - ${time}s response, ${size} bytes"
    elif [[ "$status" == "000" ]]; then
        log_fail "$name: Connection failed (timeout or network error)"
    elif [[ "$status" =~ ^[45] ]]; then
        log_fail "$name: Server error (${status})"
    elif [[ "$status" =~ ^3 ]]; then
        log_warn "$name: Redirect (${status}) - may need investigation"
    else
        log_warn "$name: Unexpected status (${status})"
    fi
    
    # Check response time
    if [[ "$time" != "0" ]] && (( $(echo "$time > 3" | bc -l) )); then
        log_warn "$name: Slow response time (${time}s)"
    fi
}

# Enhanced API endpoint checker
check_api_enhanced() {
    local url=$1
    local name=$2
    local timeout=${3:-10}
    
    echo "🔍 Testing API: $name..."
    
    local response=$(curl -s --max-time $timeout \
                          -H "Content-Type: application/json" \
                          -H "User-Agent: BettaDayz-Health-Check/1.0" \
                          "$url" 2>/dev/null)
    
    local status=$?
    
    if [[ $status -eq 0 ]]; then
        if echo "$response" | grep -q '"status":"ok"' || \
           echo "$response" | grep -q '"health":"ok"' || \
           echo "$response" | grep -q '"alive":true'; then
            log_pass "$name: API responding correctly"
        elif echo "$response" | grep -q '"error"'; then
            local error=$(echo "$response" | grep -o '"error":"[^"]*"' | cut -d: -f2 | tr -d '"')
            log_fail "$name: API error - $error"
        else
            log_warn "$name: API responding but unexpected format"
        fi
    else
        log_fail "$name: API connection failed"
    fi
}

# Environment validation check
check_environment() {
    echo ""
    echo -e "${PURPLE}🔧 Environment Validation${NC}"
    echo "=========================="
    
    # Run security validation if available
    if [[ -f "./security-validation.sh" ]]; then
        echo "Running comprehensive security validation..."
        if ./security-validation.sh >/dev/null 2>&1; then
            log_pass "Security validation: All checks passed"
        else
            log_fail "Security validation: Critical issues found"
            echo "   Run './security-validation.sh' for details"
        fi
    else
        log_warn "Security validation script not found"
    fi
    
    # Basic environment checks
    if [[ -n "$NEXT_PUBLIC_DOMAIN" ]]; then
        log_pass "Primary domain configured: $NEXT_PUBLIC_DOMAIN"
    else
        log_fail "NEXT_PUBLIC_DOMAIN not set"
    fi
    
    if [[ -n "$NEXT_PUBLIC_STORE_DOMAIN" ]]; then
        log_pass "Store domain configured: $NEXT_PUBLIC_STORE_DOMAIN"
    else
        log_fail "NEXT_PUBLIC_STORE_DOMAIN not set"
    fi
    
    if [[ -n "$NEXT_PUBLIC_SUPABASE_URL" ]]; then
        log_pass "Supabase URL configured"
    else
        log_fail "Supabase configuration missing"
    fi
    
    if [[ -n "$JWT_SECRET" ]] && [[ ${#JWT_SECRET} -ge 32 ]]; then
        log_pass "JWT secret configured securely"
    else
        log_fail "JWT secret missing or insecure"
    fi
}

# Database connectivity check
check_database() {
    echo ""
    echo -e "${PURPLE}🗄️  Database Connectivity${NC}"
    echo "=========================="
    
    if [[ -n "$NEXT_PUBLIC_SUPABASE_URL" ]]; then
        # Check Supabase health
        local supabase_health="${NEXT_PUBLIC_SUPABASE_URL%/}/health"
        check_url_enhanced "$supabase_health" "Supabase Health Endpoint" 200 15
        
        # Check if we can reach the database
        if command -v npx >/dev/null 2>&1 && [[ -f "package.json" ]]; then
            echo "Testing database connection..."
            if timeout 30 npx supabase status >/dev/null 2>&1; then
                log_pass "Database connection: Successful"
            else
                log_warn "Database connection: Cannot verify (may need credentials)"
            fi
        fi
    else
        log_fail "Supabase URL not configured"
    fi
}

# Build system check
check_build_system() {
    echo ""
    echo -e "${PURPLE}🔨 Build System Health${NC}"
    echo "======================="
    
    # Check Node.js version
    if command -v node >/dev/null 2>&1; then
        local node_version=$(node --version)
        log_pass "Node.js available: $node_version"
        
        # Check if version is supported
        local major_version=$(echo $node_version | cut -d. -f1 | tr -d 'v')
        if [[ $major_version -ge 18 ]]; then
            log_pass "Node.js version is supported (>= 18)"
        else
            log_fail "Node.js version too old ($node_version) - requires >= 18"
        fi
    else
        log_fail "Node.js not found"
    fi
    
    # Check npm
    if command -v npm >/dev/null 2>&1; then
        local npm_version=$(npm --version)
        log_pass "npm available: $npm_version"
    else
        log_fail "npm not found"
    fi
    
    # Check package.json
    if [[ -f "package.json" ]]; then
        log_pass "package.json found"
        
        # Check for required dependencies
        if grep -q '"next"' package.json; then
            log_pass "Next.js dependency found"
        else
            log_fail "Next.js dependency missing"
        fi
        
        if grep -q '"react"' package.json; then
            log_pass "React dependency found"
        else
            log_fail "React dependency missing"
        fi
    else
        log_fail "package.json not found"
    fi
    
    # Test build
    if [[ -f "package.json" ]] && command -v npm >/dev/null 2>&1; then
        echo "Testing build process..."
        if timeout 300 npm run build >/dev/null 2>&1; then
            log_pass "Build test: Successful"
            
            # Check build output
            if [[ -d ".next" ]]; then
                log_pass "Build output directory created"
                
                # Check build size
                local build_size=$(du -sh .next 2>/dev/null | cut -f1)
                if [[ -n "$build_size" ]]; then
                    log_info "Build size: $build_size"
                fi
            else
                log_warn "Build output directory not found"
            fi
        else
            log_fail "Build test: Failed"
        fi
    else
        log_warn "Build test skipped (missing dependencies)"
    fi
}

# Payment system check
check_payment_systems() {
    echo ""
    echo -e "${PURPLE}💳 Payment System Health${NC}"
    echo "========================="
    
    # Check payment configuration
    if [[ -n "$CASHAPP_CLIENT_ID" ]] && [[ -n "$CASHAPP_API_KEY" ]]; then
        log_pass "Cash App configuration present"
        
        if [[ "$CASHAPP_ENVIRONMENT" == "sandbox" ]]; then
            log_info "Cash App: Using sandbox environment"
        elif [[ "$CASHAPP_ENVIRONMENT" == "production" ]]; then
            log_info "Cash App: Using production environment"
        else
            log_warn "Cash App: Environment not specified"
        fi
    else
        log_warn "Cash App configuration incomplete"
    fi
    
    # Check Bitcoin configuration
    if [[ -n "$BITCOIN_WALLET_ADDRESS" ]]; then
        log_pass "Bitcoin wallet configured"
        
        if [[ "$BITCOIN_NETWORK" == "mainnet" ]]; then
            log_info "Bitcoin: Using mainnet"
        elif [[ "$BITCOIN_NETWORK" == "testnet" ]]; then
            log_info "Bitcoin: Using testnet"
        else
            log_warn "Bitcoin: Network not specified"
        fi
    else
        log_warn "Bitcoin wallet not configured"
    fi
    
    # Check webhook security
    if [[ -n "$PAYMENT_WEBHOOK_SECRET" ]]; then
        log_pass "Payment webhook secret configured"
    else
        log_warn "Payment webhook secret not set"
    fi
}

# Check SSL certificates and security
check_security() {
    echo ""
    echo -e "${PURPLE}🔒 Security & SSL Health${NC}"
    echo "========================="
    
    local domains=()
    [[ -n "$NEXT_PUBLIC_DOMAIN" ]] && domains+=("$NEXT_PUBLIC_DOMAIN")
    [[ -n "$NEXT_PUBLIC_STORE_DOMAIN" ]] && domains+=("$NEXT_PUBLIC_STORE_DOMAIN")
    
    for domain in "${domains[@]}"; do
        echo "🔍 Checking SSL for $domain..."
        
        # Check SSL certificate
        if command -v openssl >/dev/null 2>&1; then
            local ssl_info=$(echo | timeout 10 openssl s_client -servername "$domain" \
                           -connect "$domain:443" 2>/dev/null | \
                           openssl x509 -noout -dates 2>/dev/null)
            
            if [[ -n "$ssl_info" ]]; then
                local expiry=$(echo "$ssl_info" | grep "notAfter" | cut -d= -f2)
                log_pass "SSL Certificate for $domain: Valid (expires $expiry)"
                
                # Check if certificate expires soon (30 days)
                local expiry_seconds=$(date -d "$expiry" +%s 2>/dev/null || echo "0")
                local current_seconds=$(date +%s)
                local days_left=$(( (expiry_seconds - current_seconds) / 86400 ))
                
                if [[ $days_left -lt 30 ]] && [[ $days_left -gt 0 ]]; then
                    log_warn "SSL Certificate for $domain expires in $days_left days"
                elif [[ $days_left -le 0 ]]; then
                    log_fail "SSL Certificate for $domain has expired!"
                fi
            else
                log_fail "SSL Certificate for $domain: Cannot retrieve"
            fi
        fi
        
        # Check HTTPS redirect
        local http_status=$(curl -s -o /dev/null -w "%{http_code}" \
                           --max-time 10 "http://$domain" 2>/dev/null || echo "000")
        
        if [[ "$http_status" =~ ^3 ]]; then
            log_pass "HTTP to HTTPS redirect working for $domain"
        elif [[ "$http_status" == "000" ]]; then
            log_warn "Cannot test HTTP redirect for $domain"
        else
            log_fail "HTTP redirect not working for $domain (status: $http_status)"
        fi
    done
}

# Performance checks
check_performance() {
    echo ""
    echo -e "${PURPLE}⚡ Performance Health${NC}"
    echo "====================="
    
    local domains=()
    [[ -n "$NEXT_PUBLIC_DOMAIN" ]] && domains+=("https://$NEXT_PUBLIC_DOMAIN")
    [[ -n "$NEXT_PUBLIC_STORE_DOMAIN" ]] && domains+=("https://$NEXT_PUBLIC_STORE_DOMAIN")
    
    for url in "${domains[@]}"; do
        echo "🔍 Performance test for $url..."
        
        # Measure page load time
        local timing=$(curl -s -w "DNS:%{time_namelookup}s;Connect:%{time_connect}s;Total:%{time_total}s" \
                      --max-time 30 -o /dev/null "$url" 2>/dev/null || echo "DNS:0s;Connect:0s;Total:0s")
        
        local dns_time=$(echo "$timing" | grep -o "DNS:[0-9.]*s" | cut -d: -f2)
        local connect_time=$(echo "$timing" | grep -o "Connect:[0-9.]*s" | cut -d: -f2)
        local total_time=$(echo "$timing" | grep -o "Total:[0-9.]*s" | cut -d: -f2)
        
        if [[ "$total_time" != "0s" ]]; then
            log_info "Timing for $url: DNS:$dns_time, Connect:$connect_time, Total:$total_time"
            
            local total_seconds=$(echo "$total_time" | tr -d 's')
            if (( $(echo "$total_seconds > 5" | bc -l) )); then
                log_warn "Slow response time for $url ($total_time)"
            elif (( $(echo "$total_seconds > 2" | bc -l) )); then
                log_warn "Moderate response time for $url ($total_time)"
            else
                log_pass "Good response time for $url ($total_time)"
            fi
        else
            log_fail "Cannot measure performance for $url"
        fi
    done
}

# Main deployment checks
run_deployment_checks() {
    echo ""
    echo -e "${BLUE}🌐 Domain Status${NC}"
    echo "================"
    
    # Check main domains
    if [[ -n "$NEXT_PUBLIC_DOMAIN" ]]; then
        check_url_enhanced "https://$NEXT_PUBLIC_DOMAIN" "Gaming Domain ($NEXT_PUBLIC_DOMAIN)"
    fi
    
    if [[ -n "$NEXT_PUBLIC_STORE_DOMAIN" ]]; then
        check_url_enhanced "https://$NEXT_PUBLIC_STORE_DOMAIN" "Store Domain ($NEXT_PUBLIC_STORE_DOMAIN)"
    fi
    
    echo ""
    echo -e "${BLUE}🔌 API Health Checks${NC}"
    echo "===================="
    
    # Check API endpoints
    if [[ -n "$NEXT_PUBLIC_DOMAIN" ]]; then
        check_api_enhanced "https://$NEXT_PUBLIC_DOMAIN/api/health" "Shop API Health"
        check_api_enhanced "https://$NEXT_PUBLIC_DOMAIN/api/auth/status" "Authentication API"
    fi
    
    if [[ -n "$NEXT_PUBLIC_STORE_DOMAIN" ]]; then
        check_api_enhanced "https://$NEXT_PUBLIC_STORE_DOMAIN/api/health" "Store API Health"
        check_api_enhanced "https://$NEXT_PUBLIC_STORE_DOMAIN/api/store/status" "Store API Status"
    fi
    
    echo ""
    echo -e "${BLUE}🏗️  Platform Deployments${NC}"
    echo "========================="
    
    # Check Cloudflare Pages
    check_url_enhanced "https://bettadayzpbbg.pages.dev" "Cloudflare Pages" 200 15
    
    # Check Vercel deployments if URLs are available
    local vercel_urls=(
        "https://bestdayz.vercel.app"
        "https://bestdayz1.vercel.app"
        "https://bettaday.vercel.app"
    )
    
    echo -e "${YELLOW}📋 Vercel Projects:${NC}"
    for url in "${vercel_urls[@]}"; do
        local project_name=$(echo "$url" | cut -d/ -f3 | cut -d. -f1)
        check_url_enhanced "$url" "Vercel: $project_name" 200 15
    done
}

# Generate health report
generate_report() {
    echo ""
    echo -e "${PURPLE}📊 Deployment Health Report${NC}"
    echo "============================="
    
    echo ""
    echo -e "${BLUE}📈 Summary:${NC}"
    echo "• Checks Passed: ${GREEN}$CHECKS_PASSED${NC}"
    echo "• Checks Failed: ${RED}$CHECKS_FAILED${NC}"
    echo "• Warnings: ${YELLOW}$CHECKS_WARNING${NC}"
    echo "• Total Checks: $((CHECKS_PASSED + CHECKS_FAILED + CHECKS_WARNING))"
    
    # Calculate health score
    local total_checks=$((CHECKS_PASSED + CHECKS_FAILED + CHECKS_WARNING))
    if [[ $total_checks -gt 0 ]]; then
        local health_score=$(( (CHECKS_PASSED * 100) / total_checks ))
        echo "• Health Score: ${health_score}%"
        
        if [[ $health_score -ge 90 ]]; then
            echo -e "• Status: ${GREEN}Excellent${NC}"
        elif [[ $health_score -ge 75 ]]; then
            echo -e "• Status: ${GREEN}Good${NC}"
        elif [[ $health_score -ge 50 ]]; then
            echo -e "• Status: ${YELLOW}Fair${NC}"
        else
            echo -e "• Status: ${RED}Poor${NC}"
        fi
    fi
    
    if [[ ${#CRITICAL_ISSUES[@]} -gt 0 ]]; then
        echo ""
        echo -e "${RED}🚨 Critical Issues:${NC}"
        for issue in "${CRITICAL_ISSUES[@]}"; do
            echo "  • $issue"
        done
    fi
    
    if [[ ${#WARNING_ISSUES[@]} -gt 0 ]]; then
        echo ""
        echo -e "${YELLOW}⚠️  Warnings:${NC}"
        for warning in "${WARNING_ISSUES[@]}"; do
            echo "  • $warning"
        done
    fi
    
    echo ""
    echo -e "${BLUE}🚀 Next Steps:${NC}"
    if [[ $CHECKS_FAILED -eq 0 ]]; then
        echo "✅ All critical checks passed!"
        echo "1. Monitor deployment status regularly"
        echo "2. Review any warnings above"
        echo "3. Test end-to-end user flows"
    else
        echo "❌ Fix critical issues before deployment:"
        echo "1. Address all failed checks above"
        echo "2. Re-run health check: ./check-deployment.sh"
        echo "3. Validate environment: ./security-validation.sh"
    fi
    
    echo ""
    echo -e "${BLUE}📚 Resources:${NC}"
    echo "• Environment Setup: ./setup-supabase.sh"
    echo "• Security Check: ./security-validation.sh"
    echo "• Payment Config: ./setup-payment-providers.sh"
    echo "• Vercel Setup: ./setup-vercel-env.sh"
    
    echo ""
    if [[ $CHECKS_FAILED -eq 0 ]]; then
        echo -e "${GREEN}🎉 Deployment health check complete!${NC}"
        return 0
    else
        echo -e "${RED}❌ Deployment has critical issues that must be resolved!${NC}"
        return 1
    fi
}

# Main execution
main() {
    # Check dependencies
    if ! command -v curl >/dev/null 2>&1; then
        echo -e "${RED}❌ curl is required but not installed${NC}"
        exit 1
    fi
    
    if ! command -v bc >/dev/null 2>&1; then
        log_warn "bc calculator not found - some checks will be limited"
    fi
    
    # Run all checks
    check_environment
    check_build_system
    check_database
    check_security
    check_payment_systems
    run_deployment_checks
    check_performance
    
    # Generate final report
    generate_report
}

# Run main function
main "$@"