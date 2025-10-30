import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static exports for Cloudflare Pages
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Configure trailing slash
  trailingSlash: true,
  
  // Configure base path for deployment
  basePath: '',
  
  // Asset prefix for CDN
  assetPrefix: '',
  
  // Environment variables
  env: {
    NEXT_PUBLIC_PRIMARY_DOMAIN: process.env.NEXT_PUBLIC_PRIMARY_DOMAIN,
    NEXT_PUBLIC_SECONDARY_DOMAIN: process.env.NEXT_PUBLIC_SECONDARY_DOMAIN,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_ALT_SITE_URL: process.env.NEXT_PUBLIC_ALT_SITE_URL,
  },
  
  // Experimental features
  experimental: {
    // Enable modern features
  },
  
  // Headers for security and CORS
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://bettadayz.shop, https://bettadayz.store',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  
  // Redirects for domain management
  async redirects() {
    return [
      // Redirect www to non-www for both domains
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.bettadayz.shop',
          },
        ],
        destination: 'https://bettadayz.shop/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.bettadayz.store',
          },
        ],
        destination: 'https://bettadayz.store/:path*',
        permanent: true,
      },
    ];
  },
  
  // Rewrites for API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

export default nextConfig;
