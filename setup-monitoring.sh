#!/bin/bash

# BettaDayz PBBG - Production Monitoring Setup
# Configure monitoring, alerting, and health tracking for production deployments

set -e

echo "📊 BettaDayz PBBG - Production Monitoring Setup"
echo "==============================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Load environment
ENV_FILE=".env.local"
if [[ -f "$ENV_FILE" ]]; then
    echo -e "${BLUE}📁 Loading environment from $ENV_FILE...${NC}"
    set -a
    source "$ENV_FILE"
    set +a
else
    echo -e "${YELLOW}⚠️  Environment file not found. Some configurations may be limited.${NC}"
fi

echo ""
echo -e "${PURPLE}🔧 Monitoring Configuration${NC}"
echo "============================="

# Configure monitoring preferences
echo "Select monitoring services to configure:"
echo "1) Email notifications (SendGrid)"
echo "2) Uptime monitoring (Simple HTTP checks)"
echo "3) Error tracking (Built-in logging)"
echo "4) Performance monitoring (Response time tracking)"
echo "5) All of the above"
read -p "Choose (1-5) [default: 5]: " monitoring_choice

case $monitoring_choice in
    1) SETUP_EMAIL=true ;;
    2) SETUP_UPTIME=true ;;
    3) SETUP_ERROR=true ;;
    4) SETUP_PERFORMANCE=true ;;
    *) SETUP_EMAIL=true; SETUP_UPTIME=true; SETUP_ERROR=true; SETUP_PERFORMANCE=true ;;
esac

# Email notification setup
if [[ "$SETUP_EMAIL" == "true" ]]; then
    echo ""
    echo -e "${YELLOW}📧 Email Notification Setup${NC}"
    echo "----------------------------"
    
    current_email="${MONITORING_EMAIL:-$FROM_EMAIL}"
    if [[ -n "$current_email" ]]; then
        echo "Current monitoring email: $current_email"
        read -p "Update monitoring email? (y/N): " update_email
        if [[ ! "$update_email" =~ ^[Yy]$ ]]; then
            MONITORING_EMAIL="$current_email"
        else
            read -p "Enter email for monitoring alerts: " MONITORING_EMAIL
        fi
    else
        read -p "Enter email for monitoring alerts: " MONITORING_EMAIL
    fi
    
    # Alert frequency
    echo "Alert frequency options:"
    echo "1) Immediate (every failure)"
    echo "2) Hourly digest"
    echo "3) Daily digest"
    read -p "Choose (1-3) [default: 1]: " freq_choice
    
    case $freq_choice in
        2) ALERT_FREQUENCY="hourly" ;;
        3) ALERT_FREQUENCY="daily" ;;
        *) ALERT_FREQUENCY="immediate" ;;
    esac
fi

# Uptime monitoring setup
if [[ "$SETUP_UPTIME" == "true" ]]; then
    echo ""
    echo -e "${YELLOW}⏱️  Uptime Monitoring Setup${NC}"
    echo "----------------------------"
    
    # Monitoring interval
    echo "Monitoring check interval:"
    echo "1) Every 1 minute (intensive)"
    echo "2) Every 5 minutes (recommended)"
    echo "3) Every 15 minutes (light)"
    read -p "Choose (1-3) [default: 2]: " interval_choice
    
    case $interval_choice in
        1) MONITORING_INTERVAL="60" ;;
        3) MONITORING_INTERVAL="900" ;;
        *) MONITORING_INTERVAL="300" ;;
    esac
    
    # Response time thresholds
    read -p "Response time warning threshold in seconds [default: 3]: " response_warning
    RESPONSE_WARNING_THRESHOLD="${response_warning:-3}"
    
    read -p "Response time critical threshold in seconds [default: 10]: " response_critical
    RESPONSE_CRITICAL_THRESHOLD="${response_critical:-10}"
fi

# Error tracking setup
if [[ "$SETUP_ERROR" == "true" ]]; then
    echo ""
    echo -e "${YELLOW}🚨 Error Tracking Setup${NC}"
    echo "-----------------------"
    
    echo "Error tracking configuration:"
    echo "1) Log errors only (basic)"
    echo "2) Log and email errors (recommended)"
    echo "3) Log, email, and store in database (comprehensive)"
    read -p "Choose (1-3) [default: 2]: " error_choice
    
    case $error_choice in
        1) ERROR_TRACKING="log" ;;
        3) ERROR_TRACKING="comprehensive" ;;
        *) ERROR_TRACKING="email" ;;
    esac
    
    # Error rate thresholds
    read -p "Error rate threshold (errors per hour) [default: 10]: " error_rate
    ERROR_RATE_THRESHOLD="${error_rate:-10}"
fi

# Performance monitoring setup
if [[ "$SETUP_PERFORMANCE" == "true" ]]; then
    echo ""
    echo -e "${YELLOW}⚡ Performance Monitoring Setup${NC}"
    echo "-------------------------------"
    
    echo "Performance metrics to track:"
    echo "1) Response times only"
    echo "2) Response times + resource usage"
    echo "3) Full performance suite (response, memory, CPU)"
    read -p "Choose (1-3) [default: 2]: " perf_choice
    
    case $perf_choice in
        1) PERFORMANCE_TRACKING="basic" ;;
        3) PERFORMANCE_TRACKING="full" ;;
        *) PERFORMANCE_TRACKING="standard" ;;
    esac
fi

# Create monitoring configuration
echo ""
echo -e "${BLUE}💾 Creating monitoring configuration...${NC}"

# Create monitoring directory
mkdir -p monitoring/{scripts,logs,config}

# Create monitoring configuration file
cat > monitoring/config/monitoring.json << EOF
{
  "version": "1.0",
  "generatedAt": "$(date -Iseconds)",
  "environment": "${NODE_ENV:-development}",
  "domains": {
    "primary": "${NEXT_PUBLIC_DOMAIN:-}",
    "store": "${NEXT_PUBLIC_STORE_DOMAIN:-}"
  },
  "monitoring": {
    "email": {
      "enabled": ${SETUP_EMAIL:-false},
      "recipient": "${MONITORING_EMAIL:-}",
      "frequency": "${ALERT_FREQUENCY:-immediate}"
    },
    "uptime": {
      "enabled": ${SETUP_UPTIME:-false},
      "interval": ${MONITORING_INTERVAL:-300},
      "thresholds": {
        "responseWarning": ${RESPONSE_WARNING_THRESHOLD:-3},
        "responseCritical": ${RESPONSE_CRITICAL_THRESHOLD:-10}
      }
    },
    "errors": {
      "enabled": ${SETUP_ERROR:-false},
      "tracking": "${ERROR_TRACKING:-email}",
      "rateThreshold": ${ERROR_RATE_THRESHOLD:-10}
    },
    "performance": {
      "enabled": ${SETUP_PERFORMANCE:-false},
      "tracking": "${PERFORMANCE_TRACKING:-standard}"
    }
  },
  "endpoints": [
    {
      "name": "Main Site Health",
      "url": "https://${NEXT_PUBLIC_DOMAIN:-localhost}/api/health",
      "critical": true
    },
    {
      "name": "Store Health",
      "url": "https://${NEXT_PUBLIC_STORE_DOMAIN:-localhost}/api/health",
      "critical": true
    },
    {
      "name": "Authentication API",
      "url": "https://${NEXT_PUBLIC_DOMAIN:-localhost}/api/auth/status",
      "critical": false
    },
    {
      "name": "Payment API",
      "url": "https://${NEXT_PUBLIC_STORE_DOMAIN:-localhost}/api/store/status",
      "critical": false
    }
  ]
}
EOF

# Create monitoring scripts
echo -e "${BLUE}📝 Creating monitoring scripts...${NC}"

# Health check script
cat > monitoring/scripts/health-check.sh << 'EOF'
#!/bin/bash

# Automated health check for BettaDayz PBBG
# Runs continuous monitoring based on configuration

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/../config/monitoring.json"
LOG_FILE="$SCRIPT_DIR/../logs/health-$(date +%Y%m%d).log"

# Create log directory
mkdir -p "$(dirname "$LOG_FILE")"

# Function to log with timestamp
log_message() {
    echo "$(date -Iseconds) - $1" | tee -a "$LOG_FILE"
}

# Function to send alert
send_alert() {
    local severity="$1"
    local message="$2"
    
    log_message "[$severity] $message"
    
    # Add email sending logic here if MONITORING_EMAIL is configured
    if [[ -n "$MONITORING_EMAIL" ]] && [[ "$ALERT_FREQUENCY" == "immediate" ]]; then
        echo "Alert: [$severity] $message" | mail -s "BettaDayz Monitoring Alert" "$MONITORING_EMAIL" 2>/dev/null || true
    fi
}

# Main monitoring function
run_health_check() {
    local config_exists=false
    
    if [[ -f "$CONFIG_FILE" ]]; then
        config_exists=true
        log_message "Starting health check with configuration"
    else
        log_message "No configuration found, running basic checks"
    fi
    
    # Check main domains
    local domains=("${NEXT_PUBLIC_DOMAIN}" "${NEXT_PUBLIC_STORE_DOMAIN}")
    
    for domain in "${domains[@]}"; do
        if [[ -n "$domain" ]]; then
            local url="https://$domain"
            local response_time=$(curl -s -w "%{time_total}" -o /dev/null --max-time 30 "$url" 2>/dev/null || echo "999")
            local status_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 "$url" 2>/dev/null || echo "000")
            
            if [[ "$status_code" == "200" ]]; then
                if (( $(echo "$response_time > ${RESPONSE_CRITICAL_THRESHOLD:-10}" | bc -l 2>/dev/null || echo "0") )); then
                    send_alert "CRITICAL" "$domain response time: ${response_time}s (threshold: ${RESPONSE_CRITICAL_THRESHOLD:-10}s)"
                elif (( $(echo "$response_time > ${RESPONSE_WARNING_THRESHOLD:-3}" | bc -l 2>/dev/null || echo "0") )); then
                    send_alert "WARNING" "$domain response time: ${response_time}s (threshold: ${RESPONSE_WARNING_THRESHOLD:-3}s)"
                else
                    log_message "OK - $domain: ${response_time}s"
                fi
            else
                send_alert "CRITICAL" "$domain is down (HTTP $status_code)"
            fi
        fi
    done
    
    # Check API endpoints
    local api_endpoints=(
        "/api/health"
        "/api/auth/status"
    )
    
    for endpoint in "${api_endpoints[@]}"; do
        if [[ -n "$NEXT_PUBLIC_DOMAIN" ]]; then
            local url="https://$NEXT_PUBLIC_DOMAIN$endpoint"
            local status_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$url" 2>/dev/null || echo "000")
            
            if [[ "$status_code" == "200" ]]; then
                log_message "OK - API $endpoint: HTTP $status_code"
            else
                send_alert "WARNING" "API $endpoint: HTTP $status_code"
            fi
        fi
    done
}

# Load environment if available
if [[ -f ".env.local" ]]; then
    set -a
    source .env.local
    set +a
fi

# Run the check
run_health_check
EOF

chmod +x monitoring/scripts/health-check.sh

# Create log rotation script
cat > monitoring/scripts/rotate-logs.sh << 'EOF'
#!/bin/bash

# Log rotation for monitoring logs
LOG_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/../logs"

# Keep logs for 30 days
find "$LOG_DIR" -name "health-*.log" -mtime +30 -delete 2>/dev/null || true

# Compress logs older than 7 days
find "$LOG_DIR" -name "health-*.log" -mtime +7 ! -name "*.gz" -exec gzip {} \; 2>/dev/null || true

echo "Log rotation completed: $(date)"
EOF

chmod +x monitoring/scripts/rotate-logs.sh

# Create monitoring dashboard script
cat > monitoring/scripts/dashboard.sh << 'EOF'
#!/bin/bash

# Simple monitoring dashboard
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$SCRIPT_DIR/../logs"

echo "BettaDayz PBBG - Monitoring Dashboard"
echo "====================================="

# Show current status
echo ""
echo "Current Status:"
echo "---------------"

# Load environment
if [[ -f ".env.local" ]]; then
    set -a
    source .env.local
    set +a
fi

# Quick health check
if [[ -n "$NEXT_PUBLIC_DOMAIN" ]]; then
    status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "https://$NEXT_PUBLIC_DOMAIN" 2>/dev/null || echo "000")
    if [[ "$status" == "200" ]]; then
        echo "✅ Main Site: Online"
    else
        echo "❌ Main Site: Offline (HTTP $status)"
    fi
fi

if [[ -n "$NEXT_PUBLIC_STORE_DOMAIN" ]]; then
    status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "https://$NEXT_PUBLIC_STORE_DOMAIN" 2>/dev/null || echo "000")
    if [[ "$status" == "200" ]]; then
        echo "✅ Store Site: Online"
    else
        echo "❌ Store Site: Offline (HTTP $status)"
    fi
fi

# Show recent alerts
echo ""
echo "Recent Activity (Last 24 hours):"
echo "---------------------------------"
if [[ -f "$LOG_DIR/health-$(date +%Y%m%d).log" ]]; then
    tail -20 "$LOG_DIR/health-$(date +%Y%m%d).log" | grep -E "(CRITICAL|WARNING)" | tail -5 || echo "No recent alerts"
else
    echo "No monitoring data available"
fi

# Show uptime statistics
echo ""
echo "Uptime Statistics:"
echo "------------------"
if [[ -f "$LOG_DIR/health-$(date +%Y%m%d).log" ]]; then
    total_checks=$(grep -c "OK -" "$LOG_DIR/health-$(date +%Y%m%d).log" 2>/dev/null || echo "0")
    failed_checks=$(grep -c "CRITICAL" "$LOG_DIR/health-$(date +%Y%m%d).log" 2>/dev/null || echo "0")
    
    if [[ $total_checks -gt 0 ]]; then
        uptime_percent=$(( (total_checks - failed_checks) * 100 / total_checks ))
        echo "Uptime today: ${uptime_percent}% ($total_checks checks, $failed_checks failures)"
    else
        echo "No uptime data available for today"
    fi
else
    echo "No monitoring data available"
fi

echo ""
echo "Commands:"
echo "• Run health check: ./monitoring/scripts/health-check.sh"
echo "• View full logs: tail -f monitoring/logs/health-$(date +%Y%m%d).log"
echo "• Check deployment: ./check-deployment.sh"
EOF

chmod +x monitoring/scripts/dashboard.sh

# Create systemd service for continuous monitoring (optional)
if command -v systemctl >/dev/null 2>&1; then
    cat > monitoring/bettadayz-monitoring.service << EOF
[Unit]
Description=BettaDayz PBBG Monitoring Service
After=network.target

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=$(pwd)
ExecStart=/bin/bash -c 'while true; do $(pwd)/monitoring/scripts/health-check.sh; sleep ${MONITORING_INTERVAL:-300}; done'
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
    
    echo -e "${YELLOW}📝 Systemd service file created: monitoring/bettadayz-monitoring.service${NC}"
    echo "   To install: sudo cp monitoring/bettadayz-monitoring.service /etc/systemd/system/"
    echo "   To enable: sudo systemctl enable bettadayz-monitoring"
    echo "   To start: sudo systemctl start bettadayz-monitoring"
fi

# Create cron job setup script
cat > monitoring/setup-cron.sh << 'EOF'
#!/bin/bash

# Setup cron jobs for monitoring
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Add health check every 5 minutes
echo "*/5 * * * * $SCRIPT_DIR/scripts/health-check.sh" | crontab -

# Add log rotation daily at 2 AM
echo "0 2 * * * $SCRIPT_DIR/scripts/rotate-logs.sh" | crontab -

echo "Cron jobs installed:"
echo "• Health check: Every 5 minutes"
echo "• Log rotation: Daily at 2 AM"
echo ""
echo "To view cron jobs: crontab -l"
echo "To remove cron jobs: crontab -r"
EOF

chmod +x monitoring/setup-cron.sh

# Update environment file with monitoring configuration
echo ""
echo -e "${BLUE}💾 Updating environment configuration...${NC}"

# Backup environment file
cp "$ENV_FILE" "${ENV_FILE}.backup.$(date +%Y%m%d_%H%M%S)" 2>/dev/null || true

# Remove old monitoring configuration
sed -i '/^# Monitoring Configuration/,/^$/d' "$ENV_FILE" 2>/dev/null || true
sed -i '/^MONITORING_/d' "$ENV_FILE" 2>/dev/null || true
sed -i '/^ALERT_/d' "$ENV_FILE" 2>/dev/null || true
sed -i '/^RESPONSE_.*_THRESHOLD/d' "$ENV_FILE" 2>/dev/null || true
sed -i '/^ERROR_.*_THRESHOLD/d' "$ENV_FILE" 2>/dev/null || true

# Add monitoring configuration
cat >> "$ENV_FILE" << EOF

# Monitoring Configuration
# Generated by setup-monitoring.sh at $(date)
EOF

if [[ -n "$MONITORING_EMAIL" ]]; then
    echo "MONITORING_EMAIL=\"$MONITORING_EMAIL\"" >> "$ENV_FILE"
fi

if [[ -n "$ALERT_FREQUENCY" ]]; then
    echo "ALERT_FREQUENCY=\"$ALERT_FREQUENCY\"" >> "$ENV_FILE"
fi

if [[ -n "$MONITORING_INTERVAL" ]]; then
    echo "MONITORING_INTERVAL=\"$MONITORING_INTERVAL\"" >> "$ENV_FILE"
fi

if [[ -n "$RESPONSE_WARNING_THRESHOLD" ]]; then
    echo "RESPONSE_WARNING_THRESHOLD=\"$RESPONSE_WARNING_THRESHOLD\"" >> "$ENV_FILE"
fi

if [[ -n "$RESPONSE_CRITICAL_THRESHOLD" ]]; then
    echo "RESPONSE_CRITICAL_THRESHOLD=\"$RESPONSE_CRITICAL_THRESHOLD\"" >> "$ENV_FILE"
fi

if [[ -n "$ERROR_TRACKING" ]]; then
    echo "ERROR_TRACKING=\"$ERROR_TRACKING\"" >> "$ENV_FILE"
fi

if [[ -n "$ERROR_RATE_THRESHOLD" ]]; then
    echo "ERROR_RATE_THRESHOLD=\"$ERROR_RATE_THRESHOLD\"" >> "$ENV_FILE"
fi

if [[ -n "$PERFORMANCE_TRACKING" ]]; then
    echo "PERFORMANCE_TRACKING=\"$PERFORMANCE_TRACKING\"" >> "$ENV_FILE"
fi

echo ""
echo -e "${GREEN}🎉 Production monitoring setup complete!${NC}"
echo ""
echo -e "${BLUE}📋 Monitoring Summary:${NC}"
echo "======================"
echo "• Configuration: monitoring/config/monitoring.json"
echo "• Scripts: monitoring/scripts/"
echo "• Logs: monitoring/logs/"

if [[ -n "$MONITORING_EMAIL" ]]; then
    echo "• Email alerts: $MONITORING_EMAIL ($ALERT_FREQUENCY)"
fi

if [[ -n "$MONITORING_INTERVAL" ]]; then
    echo "• Check interval: ${MONITORING_INTERVAL}s"
fi

echo ""
echo -e "${BLUE}🚀 Getting Started:${NC}"
echo "1. Test monitoring: ./monitoring/scripts/health-check.sh"
echo "2. View dashboard: ./monitoring/scripts/dashboard.sh"
echo "3. Setup automation: ./monitoring/setup-cron.sh"
echo "4. Check deployment health: ./check-deployment.sh"

echo ""
echo -e "${BLUE}📁 Files Created:${NC}"
echo "• monitoring/config/monitoring.json - Configuration"
echo "• monitoring/scripts/health-check.sh - Health monitoring"
echo "• monitoring/scripts/dashboard.sh - Status dashboard"
echo "• monitoring/scripts/rotate-logs.sh - Log management"
echo "• monitoring/setup-cron.sh - Automation setup"

if [[ -f "monitoring/bettadayz-monitoring.service" ]]; then
    echo "• monitoring/bettadayz-monitoring.service - Systemd service"
fi

echo ""
echo -e "${YELLOW}💡 Pro Tips:${NC}"
echo "• Use 'watch -n 60 ./monitoring/scripts/dashboard.sh' for live monitoring"
echo "• Set up log aggregation for production environments"
echo "• Consider integrating with external monitoring services"
echo "• Regularly review and update monitoring thresholds"

echo ""
echo -e "${YELLOW}📚 Additional Resources:${NC}"
echo "• System monitoring: https://prometheus.io/"
echo "• Uptime services: https://uptimerobot.com/"
echo "• Error tracking: https://sentry.io/"
echo "• Performance monitoring: https://vercel.com/analytics"