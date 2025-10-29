// BettaDayz PBBG Cloudflare Worker - Production Ready
// Token: after9b9fcaead55610e5dd235878e702ee69
// Server: 194.195.84.72
// JWT: 9=N6H//qQ]?g+BDV

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    
    // Determine target port based on domain
    let targetPort;
    if (hostname.includes('bettadayz.shop') || hostname.includes('shop')) {
      targetPort = env.SHOP_PORT || '3000';
    } else if (hostname.includes('bettadayz.store') || hostname.includes('store')) {
      targetPort = env.STORE_PORT || '3001';
    } else {
      targetPort = '3000'; // Default to shop
    }
    
    // Build target URL
    const targetUrl = `http://${env.SERVER_IP || '194.195.84.72'}:${targetPort}${url.pathname}${url.search}`;
    
    try {
      // Forward the request
      const modifiedRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body
      });
      
      // Get response from target server
      const response = await fetch(modifiedRequest);
      
      // Create new response with CORS headers
      const newResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...response.headers,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'X-Powered-By': 'BettaDayz-PBBG-Worker',
          'X-Worker-Version': '1.0.0',
          'X-JWT-Secret': env.JWT_SECRET ? 'configured' : 'missing'
        }
      });
      
      return newResponse;
      
    } catch (error) {
      return new Response(JSON.stringify({
        error: 'BettaDayz PBBG - Server Error',
        message: error.message,
        timestamp: new Date().toISOString(),
        target: targetUrl,
        domain: hostname
      }), {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};
