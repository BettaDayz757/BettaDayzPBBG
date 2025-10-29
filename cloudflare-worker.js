// BettaDayz PBBG Cloudflare Worker
// Handles domain routing for bettadayz.shop and bettadayz.store
// Token: after9b9fcaead55610e5dd235878e702ee69

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname.toLowerCase();
    
    // Server configuration
    const SERVER_IP = '194.195.84.72';
    const SHOP_PORT = '3000';
    const STORE_PORT = '3001';
    
    // Determine target based on domain
    let targetUrl;
    
    if (hostname.includes('shop') || hostname === 'bettadayz.workers.dev') {
      // Route shop domain to port 3000
      targetUrl = `http://${SERVER_IP}:${SHOP_PORT}${url.pathname}${url.search}`;
    } else if (hostname.includes('store')) {
      // Route store domain to port 3001
      targetUrl = `http://${SERVER_IP}:${STORE_PORT}${url.pathname}${url.search}`;
    } else {
      // Default to shop
      targetUrl = `http://${SERVER_IP}:${SHOP_PORT}${url.pathname}${url.search}`;
    }
    
    try {
      // Create new request with modified URL
      const modifiedRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
      });
      
      // Add custom headers
      modifiedRequest.headers.set('X-Forwarded-Host', hostname);
      modifiedRequest.headers.set('X-Real-IP', request.headers.get('CF-Connecting-IP') || '');
      modifiedRequest.headers.set('X-BettaDayz-Worker', 'active');
      
      // Fetch from target server
      const response = await fetch(modifiedRequest);
      
      // Clone response to modify headers
      const newResponse = new Response(response.body, response);
      
      // Add CORS headers for API requests
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      // Add security headers
      newResponse.headers.set('X-Content-Type-Options', 'nosniff');
      newResponse.headers.set('X-Frame-Options', 'DENY');
      newResponse.headers.set('X-XSS-Protection', '1; mode=block');
      
      // Add cache headers for static assets
      if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
        newResponse.headers.set('Cache-Control', 'public, max-age=86400');
      }
      
      return newResponse;
      
    } catch (error) {
      console.error('Worker error:', error);
      
      // Return error page
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>BettaDayz PBBG - Service Temporarily Unavailable</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white; 
              text-align: center; 
              padding: 50px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: rgba(255,255,255,0.1);
              padding: 40px;
              border-radius: 10px;
              backdrop-filter: blur(10px);
            }
            h1 { color: #ffeb3b; }
            .details { 
              background: rgba(0,0,0,0.2); 
              padding: 20px; 
              border-radius: 5px; 
              margin: 20px 0;
              font-family: monospace;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🎮 BettaDayz PBBG</h1>
            <h2>Service Temporarily Unavailable</h2>
            <p>We're experiencing technical difficulties. Please try again in a few moments.</p>
            <div class="details">
              <strong>Domain:</strong> ${hostname}<br>
              <strong>Target:</strong> ${targetUrl}<br>
              <strong>Time:</strong> ${new Date().toISOString()}<br>
              <strong>Worker:</strong> bettadayz.workers.dev
            </div>
            <p>If the problem persists, please contact support.</p>
          </div>
        </body>
        </html>
      `, {
        status: 503,
        headers: {
          'Content-Type': 'text/html',
          'Retry-After': '60'
        }
      });
    }
  }
};

// Configuration for wrangler.toml
/*
name = "bettadayz-pbbg"
main = "worker.js"
compatibility_date = "2023-12-01"

[vars]
SERVER_IP = "194.195.84.72"
SHOP_PORT = "3000"
STORE_PORT = "3001"
JWT_SECRET = "9=N6H//qQ]?g+BDV"

[[routes]]
pattern = "bettadayz.shop/*"
zone_name = "bettadayz.shop"

[[routes]]
pattern = "bettadayz.store/*"
zone_name = "bettadayz.store"

[[routes]]
pattern = "*.bettadayz.workers.dev/*"
*/