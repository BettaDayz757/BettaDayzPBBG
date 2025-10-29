# Cloudflare Worker Deployment Guide

This guide provides step-by-step instructions for deploying the BettaDayz PBBG Cloudflare Worker for domain routing between bettadayz.shop and bettadayz.store.

## Overview

The Cloudflare Worker acts as a reverse proxy that routes requests to the appropriate backend server based on the domain:
- `bettadayz.shop` → Server port 3000 (Shop domain)
- `bettadayz.store` → Server port 3001 (Store domain)

## Prerequisites

1. **Cloudflare Account**: Sign up at [Cloudflare Dashboard](https://dash.cloudflare.com)
2. **Domains Added**: Add both `bettadayz.shop` and `bettadayz.store` to your Cloudflare account
3. **Wrangler CLI**: Install globally with `npm install -g wrangler`
4. **Node.js**: Version 18.0.0 or higher
5. **Backend Server**: Running on 194.195.84.72 with ports 3000 and 3001

## Configuration Files

### wrangler.toml

The worker configuration is already set up in `wrangler.toml`:

```toml
name = "bettadayz-pbbg"
main = "cloudflare-worker.js"
compatibility_date = "2023-12-01"

[vars]
SERVER_IP = "194.195.84.72"
SHOP_PORT = "3000"
STORE_PORT = "3001"
JWT_SECRET = "9=N6H//qQ]?g+BDV"
WORKER_TOKEN = "after9b9fcaead55610e5dd235878e702ee69"
NODE_ENV = "production"

[build]
command = ""

[observability]
enabled = true
```

### Worker Code

The worker code is in `cloudflare-worker.js` and handles:
- Domain-based routing
- Request forwarding with headers
- CORS headers for API requests
- Security headers
- Error handling with custom error pages
- Static asset caching

## Deployment Steps

### Option 1: Automated Deployment with Script

1. **Set Cloudflare API Token**:
   ```bash
   export CLOUDFLARE_API_TOKEN=your_api_token_here
   ```

2. **Run deployment script**:
   ```bash
   ./deploy-cloudflare.sh
   ```

### Option 2: Manual Deployment with Wrangler CLI

1. **Authenticate with Wrangler**:
   ```bash
   wrangler login
   ```

2. **Deploy the worker**:
   ```bash
   wrangler deploy
   ```

3. **Verify deployment**:
   ```bash
   wrangler whoami
   ```

### Option 3: Manual Deployment via Dashboard

If you prefer to deploy manually through the Cloudflare dashboard:

1. **Navigate to Workers & Pages**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Click "Workers & Pages" in the left sidebar

2. **Create New Worker**:
   - Click "Create application"
   - Select "Create Worker"
   - Name it `bettadayz-pbbg`

3. **Copy Worker Code**:
   - Copy the entire contents of `cloudflare-worker.js`
   - Paste into the worker editor
   - Click "Save and Deploy"

4. **Configure Environment Variables**:
   - Go to Settings → Variables
   - Add the following variables:
     ```
     SERVER_IP = "194.195.84.72"
     SHOP_PORT = "3000"
     STORE_PORT = "3001"
     JWT_SECRET = "9=N6H//qQ]?g+BDV"
     NODE_ENV = "production"
     ```

## Domain Configuration

After deploying the worker, configure your domains to use it:

### 1. Add Routes

In the Cloudflare Dashboard:

1. Go to Workers & Pages → your worker → Settings → Triggers
2. Add routes:
   - `bettadayz.shop/*` → Zone: bettadayz.shop
   - `www.bettadayz.shop/*` → Zone: bettadayz.shop
   - `bettadayz.store/*` → Zone: bettadayz.store
   - `www.bettadayz.store/*` → Zone: bettadayz.store

### 2. DNS Configuration

Ensure your DNS records point to Cloudflare:

**For bettadayz.shop:**
```
Type: A
Name: @
Content: 194.195.84.72
Proxy status: Proxied (orange cloud)

Type: CNAME
Name: www
Content: bettadayz.shop
Proxy status: Proxied (orange cloud)
```

**For bettadayz.store:**
```
Type: A
Name: @
Content: 194.195.84.72
Proxy status: Proxied (orange cloud)

Type: CNAME
Name: www
Content: bettadayz.store
Proxy status: Proxied (orange cloud)
```

## Testing

### 1. Test Worker Endpoint

Visit your worker URL to verify it's running:
```
https://bettadayz-pbbg.workers.dev
```

### 2. Test Domain Routing

Test that domains route correctly:

```bash
# Test shop domain
curl -I https://bettadayz.shop

# Test store domain
curl -I https://bettadayz.store

# Check headers
curl -H "X-BettaDayz-Worker: test" https://bettadayz.shop
```

### 3. Verify Health Check

```bash
curl https://bettadayz.shop/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-29T...",
  "service": "BettaDayz PBBG API",
  "version": "2.0.0",
  "supabase": true,
  "domain": "shop"
}
```

## Monitoring

### View Worker Logs

1. In Cloudflare Dashboard:
   - Go to Workers & Pages → your worker
   - Click "Logs" tab
   - View real-time logs

2. Using Wrangler CLI:
   ```bash
   wrangler tail
   ```

### Monitor Performance

- Go to Analytics tab in the worker dashboard
- Monitor:
  - Requests per second
  - Error rate
  - Latency
  - CPU usage

## Troubleshooting

### Worker Not Responding

1. Check worker status in dashboard
2. Verify routes are configured correctly
3. Check worker logs for errors
4. Test backend server is accessible:
   ```bash
   curl http://194.195.84.72:3000
   curl http://194.195.84.72:3001
   ```

### 503 Service Unavailable

If you see the error page:
1. Check backend server is running
2. Verify SERVER_IP is correct
3. Check ports 3000 and 3001 are accessible
4. Review firewall rules on backend server

### CORS Errors

The worker includes CORS headers. If you still get CORS errors:
1. Check the worker code includes proper CORS headers
2. Verify your API requests include necessary headers
3. Check browser console for specific CORS errors

### Authentication Issues

If JWT authentication fails:
1. Verify JWT_SECRET matches between worker and backend
2. Check token is being passed correctly in headers
3. Review worker logs for authentication errors

## Security Considerations

1. **API Token**: Keep your Cloudflare API token secure
2. **JWT Secret**: Use a strong, unique JWT secret
3. **Environment Variables**: Never commit secrets to git
4. **Rate Limiting**: Consider adding rate limiting rules
5. **IP Allowlisting**: Restrict backend server access if needed

## Updating the Worker

To update the worker after making changes:

1. **Edit worker code**:
   ```bash
   vim cloudflare-worker.js
   ```

2. **Test locally** (if possible):
   ```bash
   wrangler dev
   ```

3. **Deploy update**:
   ```bash
   wrangler deploy
   ```

4. **Verify changes**:
   - Test both domains
   - Check logs for errors
   - Monitor analytics

## Advanced Configuration

### Custom Error Pages

The worker includes a custom error page. To customize:

1. Edit the HTML in the error handler in `cloudflare-worker.js`
2. Update styles and content as needed
3. Deploy the updated worker

### Caching Configuration

Current cache rules:
- Static assets (css, js, images): 24 hours
- Dynamic content: No cache

To modify caching:
1. Edit cache headers in `cloudflare-worker.js`
2. Add custom caching logic as needed
3. Test thoroughly before deploying

### Performance Optimization

Tips for better performance:
1. Enable Cloudflare's Argo Smart Routing
2. Use HTTP/2 Server Push for critical assets
3. Enable Brotli compression
4. Optimize worker code for minimal CPU usage

## Support

For issues or questions:
1. Check Cloudflare Workers documentation: https://developers.cloudflare.com/workers/
2. Review worker logs for specific errors
3. Test backend server connectivity
4. Check DNS and routing configuration

## Next Steps

After deploying the worker:
1. Set up Supabase integration (see SUPABASE-SETUP.md)
2. Configure SSL/TLS settings
3. Set up monitoring and alerts
4. Test all game features on both domains
5. Configure custom firewall rules if needed
