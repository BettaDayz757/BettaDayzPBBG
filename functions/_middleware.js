// Cloudflare Pages Middleware for Dual Domain Support
// This middleware handles routing and security for both bettadayz.shop and bettadayz.store

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const hostname = url.hostname.toLowerCase();

  // Define allowed production domains
  const allowedDomains = new Set([
    'bettadayz.shop',
    'bettadayz.store',
    'www.bettadayz.shop',
    'www.bettadayz.store',
  ]);

  // Allow Cloudflare Pages preview/alias domains and local development
  const isPagesDev = hostname.endsWith('.pages.dev');
  const isLocal = hostname === 'localhost' || hostname.endsWith('.localhost');

  // Security: Block requests only if not from our production domains, pages.dev previews, or local
  const isAllowed = allowedDomains.has(hostname) || isPagesDev || isLocal;
  if (!isAllowed) {
    return new Response('Forbidden', { status: 403 });
  }

  // Redirect www to non-www (optional - customize based on preference)
  if (!isPagesDev && hostname.startsWith('www.')) {
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
  newResponse.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  newResponse.headers.set('X-DNS-Prefetch-Control', 'false');
  
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