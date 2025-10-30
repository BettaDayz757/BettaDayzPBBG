#!/bin/bash

# Dual Domain Deployment Verification Script
# Tests both bettadayz.shop and bettadayz.store

echo "🚀 BettaDayz PBBG Dual Domain Verification"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Domains to test
PRIMARY_DOMAIN="bettadayz.shop"
SECONDARY_DOMAIN="bettadayz.store"

# Function to test domain response
test_domain() {
    local domain=$1
    local test_name=$2
    
    echo -e "\n🔍 Testing: ${YELLOW}$test_name${NC}"
    
    # Test HTTP status
    status=$(curl -s -o /dev/null -w "%{http_code}" "https://$domain" --max-time 10)
    
    if [ "$status" = "200" ]; then
        echo -e "✅ ${GREEN}$domain - Status: $status${NC}"
    else
        echo -e "❌ ${RED}$domain - Status: $status${NC}"
        return 1
    fi
    
    # Test response time
    response_time=$(curl -s -o /dev/null -w "%{time_total}" "https://$domain" --max-time 10)
    echo -e "⏱️  Response time: ${response_time}s"
    
    # Test security headers
    echo -e "🔒 Security Headers:"
    
    # X-Frame-Options
    xframe=$(curl -s -I "https://$domain" | grep -i "x-frame-options" | cut -d' ' -f2- | tr -d '\r')
    if [ ! -z "$xframe" ]; then
        echo -e "   ✅ X-Frame-Options: $xframe"
    else
        echo -e "   ❌ ${RED}X-Frame-Options: Missing${NC}"
    fi
    
    # Content-Security-Policy
    csp=$(curl -s -I "https://$domain" | grep -i "content-security-policy")
    if [ ! -z "$csp" ]; then
        echo -e "   ✅ Content-Security-Policy: Present"
    else
        echo -e "   ❌ ${RED}Content-Security-Policy: Missing${NC}"
    fi
    
    return 0
}

# Function to test www redirect
test_www_redirect() {
    local domain=$1
    
    echo -e "\n🔄 Testing WWW redirect for $domain"
    
    # Test www redirect
    redirect_status=$(curl -s -o /dev/null -w "%{http_code}" "https://www.$domain" --max-time 10)
    redirect_location=$(curl -s -I "https://www.$domain" | grep -i "location:" | cut -d' ' -f2- | tr -d '\r')
    
    if [ "$redirect_status" = "301" ] && [[ "$redirect_location" == *"$domain"* ]]; then
        echo -e "✅ ${GREEN}www.$domain redirects correctly${NC}"
        echo -e "   📍 Location: $redirect_location"
    else
        echo -e "❌ ${RED}www.$domain redirect failed${NC}"
        echo -e "   Status: $redirect_status"
        echo -e "   Location: $redirect_location"
    fi
}

# Function to test API endpoints
test_api() {
    local domain=$1
    
    echo -e "\n🔌 Testing API endpoints for $domain"
    
    # Test health check if it exists
    api_status=$(curl -s -o /dev/null -w "%{http_code}" "https://$domain/api/health" --max-time 10)
    if [ "$api_status" = "200" ] || [ "$api_status" = "404" ]; then
        echo -e "✅ ${GREEN}API accessible (Status: $api_status)${NC}"
    else
        echo -e "❌ ${RED}API issues (Status: $api_status)${NC}"
    fi
}

# Function to test Supabase connectivity
test_supabase() {
    echo -e "\n🗄️  Testing Supabase connectivity"
    
    # Test Supabase URL
    supabase_url="https://btcfpizydmcdjhltwbil.supabase.co"
    supabase_status=$(curl -s -o /dev/null -w "%{http_code}" "$supabase_url/rest/v1/" --max-time 10)
    
    if [ "$supabase_status" = "200" ] || [ "$supabase_status" = "401" ]; then
        echo -e "✅ ${GREEN}Supabase accessible (Status: $supabase_status)${NC}"
    else
        echo -e "❌ ${RED}Supabase connection issues (Status: $supabase_status)${NC}"
    fi
}

# Function to test SSL certificates
test_ssl() {
    local domain=$1
    
    echo -e "\n🔐 Testing SSL certificate for $domain"
    
    # Check SSL certificate expiry
    ssl_info=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo -e "✅ ${GREEN}SSL certificate valid${NC}"
        echo "$ssl_info" | sed 's/^/   /'
    else
        echo -e "❌ ${RED}SSL certificate issues${NC}"
    fi
}

# Main test execution
echo -e "\n🎯 Starting domain verification tests..."

# Test primary domain
echo -e "\n" "="*50
echo -e "Testing Primary Domain: ${YELLOW}$PRIMARY_DOMAIN${NC}"
echo -e "="*50

test_domain "$PRIMARY_DOMAIN" "Primary Domain Access"
test_www_redirect "$PRIMARY_DOMAIN"
test_api "$PRIMARY_DOMAIN"
test_ssl "$PRIMARY_DOMAIN"

# Test secondary domain
echo -e "\n" "="*50
echo -e "Testing Secondary Domain: ${YELLOW}$SECONDARY_DOMAIN${NC}"
echo -e "="*50

test_domain "$SECONDARY_DOMAIN" "Secondary Domain Access"
test_www_redirect "$SECONDARY_DOMAIN"
test_api "$SECONDARY_DOMAIN"
test_ssl "$SECONDARY_DOMAIN"

# Test shared services
echo -e "\n" "="*50
echo -e "Testing Shared Services"
echo -e "="*50

test_supabase

# Performance test
echo -e "\n🚀 Performance Test"
echo -e "=================="

echo -e "\n📊 Page Load Performance:"
for domain in "$PRIMARY_DOMAIN" "$SECONDARY_DOMAIN"; do
    echo -e "\n🔍 Testing $domain performance..."
    
    # Detailed timing
    timing=$(curl -w "@-" -o /dev/null -s "https://$domain" << 'EOF'
     time_namelookup:  %{time_namelookup}\n
     time_connect:     %{time_connect}\n
     time_pretransfer: %{time_pretransfer}\n
     time_starttransfer: %{time_starttransfer}\n
     time_total:       %{time_total}\n
EOF
)
    echo "$timing" | sed 's/^/   /'
done

# Summary
echo -e "\n" "="*50
echo -e "${YELLOW}Verification Complete${NC}"
echo -e "="*50

echo -e "\n📋 Summary:"
echo -e "• Primary Domain: https://$PRIMARY_DOMAIN"
echo -e "• Secondary Domain: https://$SECONDARY_DOMAIN"
echo -e "• Supabase Backend: https://btcfpizydmcdjhltwbil.supabase.co"
echo -e "\n💡 If any tests failed, check the deployment configuration."
echo -e "📚 See DUAL-DOMAIN-DEPLOYMENT.md for troubleshooting guide."

echo -e "\n✨ ${GREEN}Dual domain verification complete!${NC}"