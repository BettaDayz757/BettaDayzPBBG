// Cloudflare Pages Middleware for Dual Domain Support
// This middleware handles routing and security for both bettadayz.shop and bettadayz.store

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;

  // Define allowed domains
  const allowedDomains = ['bettadayz.shop', 'bettadayz.store', 'www.bettadayz.shop', 'www.bettadayz.store'];
  
  // Security: Block requests from unauthorized domains
  if (!allowedDomains.includes(hostname)) {
    return new Response('Forbidden', { status: 403 });
  }

  // Redirect www to non-www (optional - customize based on preference)
  if (hostname.startsWith('www.')) {
    const nonWwwDomain = hostname.slice(4);
    const newUrl = url.toString().replace(hostname, nonWwwDomain);
    return Response.redirect(newUrl, 301);
  }

  // Handle domain-specific routing
  const response = await next();
  
  // Add security headers
  const newResponse = new Response(response.body, response);
  
  // Security headers
  newResponse.headers.set('X-Frame-Options', 'DENY');
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  newResponse.headers.set('X-XSS-Protection', '1; mode=block');
  newResponse.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  newResponse.headers.set('X-DNS-Prefetch-Control', 'false');
  newResponse.headers.set('Content-Security-Policy', "default-src 'self' https://btcfpizydmcdjhltwbil.supabase.co; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://btcfpizydmcdjhltwbil.supabase.co https://api.stripe.com https: wss:");
  
  // Domain-specific headers
  if (hostname === 'bettadayz.shop') {
    newResponse.headers.set('X-Primary-Domain', 'true');
  } else if (hostname === 'bettadayz.store') {
    newResponse.headers.set('X-Secondary-Domain', 'true');
  }

  // CORS headers for API routes
  if (url.pathname.startsWith('/api/')) {
    newResponse.headers.set('Access-Control-Allow-Origin', `https://${hostname}`);
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  return newResponse;
}