/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static optimization where possible for better deployment compatibility
  output: 'standalone',
  
  // Configure images for remote patterns
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'bettadayz.shop',
      },
      {
        protocol: 'https',
        hostname: 'bettadayz.store',
      },
    ],
  },

  // Environment variable configuration for dual domain support
  env: {
    NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
    NEXT_PUBLIC_SITE_TYPE: process.env.NEXT_PUBLIC_SITE_TYPE,
  },

  // Headers for better security and CORS
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },

  // Rewrites for dual domain support
  async rewrites() {
    const domain = process.env.NEXT_PUBLIC_DOMAIN;
    
    if (domain === 'bettadayz.store') {
      return [
        {
          source: '/api/payments/:path*',
          destination: '/api/store/payments/:path*',
        },
        {
          source: '/api/currency/:path*',
          destination: '/api/store/currency/:path*',
        },
      ];
    }
    
    return [];
  },
}

export default nextConfig