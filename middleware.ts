// Next.js Middleware for authentication and domain routing
// /middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { authManager } from '@/lib/auth/EnhancedAuthManager';

// Define protected routes
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/game',
  '/store/purchase',
  '/guilds/create',
  '/tournaments/join',
  '/admin'
];

// Define admin routes
const ADMIN_ROUTES = [
  '/admin'
];

// Define domain-specific routes
const DOMAIN_ROUTES = {
  'bettadayz.shop': {
    defaultRedirect: '/game',
    features: ['game', 'guilds', 'tournaments', 'store'],
    theme: 'gaming'
  },
  'bettadayz.store': {
    defaultRedirect: '/store',
    features: ['store', 'marketplace', 'trading'],
    theme: 'commerce'
  }
};

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get('host') || '';
  const domain = host.replace('www.', '');

  // Handle domain routing
  const domainConfig = DOMAIN_ROUTES[domain as keyof typeof DOMAIN_ROUTES];
  
  // Clone the URL for modifications
  const url = request.nextUrl.clone();

  // Add domain context to headers for app components
  const response = NextResponse.next();
  response.headers.set('x-domain', domain);
  response.headers.set('x-pathname', pathname);

  // Handle root redirects based on domain
  if (pathname === '/' && domainConfig) {
    url.pathname = domainConfig.defaultRedirect;
    return NextResponse.redirect(url);
  }

  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  const isAdminRoute = ADMIN_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute || isAdminRoute) {
    // Try to authenticate the user
    const auth = await authManager.authenticateRequest(request);

    if (!auth.authenticated) {
      // Redirect to login with return URL
      url.pathname = '/auth/login';
      url.searchParams.set('redirect', pathname + search);
      url.searchParams.set('domain', domain);
      return NextResponse.redirect(url);
    }

    // Check admin permissions for admin routes
    if (isAdminRoute) {
      const hasAdminPermission = auth.user?.permissions?.includes('admin') || false;
      
      if (!hasAdminPermission) {
        url.pathname = '/unauthorized';
        return NextResponse.redirect(url);
      }
    }

    // Add user context to headers
    response.headers.set('x-user-id', auth.user?.id || '');
    response.headers.set('x-user-role', auth.session?.permissions.join(',') || '');
  }

  // Handle domain-specific feature restrictions
  if (domainConfig) {
    const requestedFeature = pathname.split('/')[1];
    
    if (requestedFeature && !domainConfig.features.includes(requestedFeature)) {
      // Redirect to domain's default page if feature not available
      url.pathname = domainConfig.defaultRedirect;
      return NextResponse.redirect(url);
    }

    // Add domain-specific theme
    response.headers.set('x-theme', domainConfig.theme);
  }

  // Handle cross-domain session sync
  if (pathname === '/auth/sync') {
    const sessionToken = request.cookies.get('session-token')?.value;
    const targetDomain = request.nextUrl.searchParams.get('domain');

    if (sessionToken && targetDomain) {
      const syncResult = await authManager.syncCrossDomainSession(
        sessionToken,
        targetDomain
      );

      if (syncResult.success && syncResult.syncToken) {
        const targetUrl = new URL(`https://${targetDomain}/auth/callback`);
        targetUrl.searchParams.set('token', syncResult.syncToken);
        
        return NextResponse.redirect(targetUrl);
      }
    }

    // Fallback redirect
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // Handle authentication callbacks
  if (pathname === '/auth/callback') {
    const code = request.nextUrl.searchParams.get('code');
    const token = request.nextUrl.searchParams.get('token');
    const redirectTo = request.nextUrl.searchParams.get('redirect') || 
                     (domainConfig?.defaultRedirect || '/dashboard');

    if (code) {
      // OAuth callback
      const result = await authManager.handleOAuthCallback(code, domain);
      
      if (result.success && result.sessionToken) {
        // Set authentication cookies
        const cookies = authManager.createAuthCookies(result.sessionToken, domain);
        const redirectResponse = NextResponse.redirect(new URL(redirectTo, request.url));
        
        cookies.forEach(cookie => {
          redirectResponse.cookies.set(cookie.name, cookie.value, cookie.options);
        });

        return redirectResponse;
      }
    } else if (token) {
      // Cross-domain sync token
      const validation = await authManager.validateSessionToken(token);
      
      if (validation.valid) {
        const cookies = authManager.createAuthCookies(token, domain);
        const redirectResponse = NextResponse.redirect(new URL(redirectTo, request.url));
        
        cookies.forEach(cookie => {
          redirectResponse.cookies.set(cookie.name, cookie.value, cookie.options);
        });

        return redirectResponse;
      }
    }

    // Fallback to login on callback failure
    url.pathname = '/auth/login';
    url.searchParams.set('error', 'callback_failed');
    return NextResponse.redirect(url);
  }

  // Handle API routes
  if (pathname.startsWith('/api/')) {
    // Add CORS headers for API routes
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }

    // Rate limiting for API routes (basic implementation)
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const rateLimitKey = `ratelimit:${ip}:${pathname}`;
    
    // In production, you would use Redis or another store for rate limiting
    // This is a basic in-memory implementation
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 100; // 100 requests per minute

    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', '99'); // Simplified
    response.headers.set('X-RateLimit-Reset', (now + windowMs).toString());
  }

  // Handle static assets and public routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};