import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Domain detection
  const isShopDomain = hostname.includes('bettadayz.shop');
  const isStoreDomain = hostname.includes('bettadayz.store');

  // Set domain-specific headers
  const response = NextResponse.next();
  
  if (isShopDomain) {
    response.headers.set('x-domain-type', 'shop');
    response.headers.set('x-site-type', 'pbbg');
    // Add shop-specific headers
    response.headers.set('x-content-focus', 'gaming');
  } else if (isStoreDomain) {
    response.headers.set('x-domain-type', 'store');
    response.headers.set('x-site-type', 'ecommerce');
    // Add store-specific headers
    response.headers.set('x-content-focus', 'payments');
  }

  // Rewrite API routes based on domain
  if (url.pathname.startsWith('/api/')) {
    if (isStoreDomain) {
      // Store-specific API routes
      if (url.pathname.startsWith('/api/payments') || 
          url.pathname.startsWith('/api/currency') ||
          url.pathname.startsWith('/api/store')) {
        return response;
      }
      // Redirect non-store APIs to shop domain
      if (!url.pathname.startsWith('/api/auth') && !url.pathname.startsWith('/api/health')) {
        const shopUrl = new URL(url.toString());
        shopUrl.hostname = 'bettadayz.shop';
        return NextResponse.redirect(shopUrl);
      }
    } else if (isShopDomain) {
      // Shop-specific API routes (game-related)
      if (url.pathname.startsWith('/api/game') || 
          url.pathname.startsWith('/api/player') ||
          url.pathname.startsWith('/api/activities')) {
        return response;
      }
      // Allow auth and health on both domains
      if (url.pathname.startsWith('/api/auth') || url.pathname.startsWith('/api/health')) {
        return response;
      }
    }
  }

  // Handle root path redirects based on domain
  if (url.pathname === '/') {
    if (isStoreDomain) {
      // Store domain should show store interface
      url.pathname = '/store';
      return NextResponse.rewrite(url);
    } else if (isShopDomain) {
      // Shop domain shows game interface (default)
      return response;
    }
  }

  // Prevent store routes from being accessed on shop domain
  if (isShopDomain && url.pathname.startsWith('/store')) {
    const storeUrl = new URL(url.toString());
    storeUrl.hostname = 'bettadayz.store';
    storeUrl.pathname = '/';
    return NextResponse.redirect(storeUrl);
  }

  // Prevent game routes from being accessed on store domain
  if (isStoreDomain && (url.pathname.startsWith('/game') || url.pathname.startsWith('/play'))) {
    const shopUrl = new URL(url.toString());
    shopUrl.hostname = 'bettadayz.shop';
    return NextResponse.redirect(shopUrl);
  }

  return response;
}

// Keep the old middleware export for compatibility during transition
export const middleware = proxy;

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