/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable dynamic functionality for dual domain support
  // output: 'export',  // Disabled for dynamic domain handling
  
  // Domain-based configuration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  
  // Domain redirects and rewrites
  async redirects() {
    return [
      // Redirect to primary domain if needed
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
  
  images: {
    unoptimized: true,
    domains: ['bettadayz.shop', 'bettadayz.store', 'btcfpizydmcdjhltwbil.supabase.co'],
  },
  
  // Environment variable configuration
  env: {
    PRIMARY_DOMAIN: process.env.PRIMARY_DOMAIN,
    SECONDARY_DOMAIN: process.env.SECONDARY_DOMAIN,
  },
}

export default nextConfig