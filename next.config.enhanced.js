// Domain-Specific Configuration for Next.js
// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },

  // Environment-based configuration
  env: {
    CUSTOM_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN || 'bettadayz.shop',
  },

  // Dynamic redirects based on domain
  async redirects() {
    const domain = process.env.NEXT_PUBLIC_DOMAIN;
    
    if (domain === 'bettadayz.store') {
      return [
        {
          source: '/',
          destination: '/store',
          permanent: false,
        },
        {
          source: '/game',
          destination: '/store',
          permanent: false,
        },
      ];
    }

    // Default redirects for bettadayz.shop
    return [
      {
        source: '/marketplace',
        destination: 'https://bettadayz.store/store',
        permanent: false,
      },
    ];
  },

  // Dynamic rewrites for cross-domain API access
  async rewrites() {
    return [
      {
        source: '/api/store/:path*',
        destination: '/api/store/:path*',
      },
      {
        source: '/api/sync/:path*',
        destination: '/api/auth/sync',
      },
    ];
  },

  // Headers for security and CORS
  async headers() {
    const domain = process.env.NEXT_PUBLIC_DOMAIN;
    const allowedOrigins = [
      'https://bettadayz.shop',
      'https://bettadayz.store',
      'https://www.bettadayz.shop',
      'https://www.bettadayz.store',
    ];

    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: allowedOrigins.join(', '),
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Domain',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Domain',
            value: domain || 'bettadayz.shop',
          },
        ],
      },
    ];
  },

  // Image optimization
  images: {
    domains: [
      'images.unsplash.com',
      'ui-avatars.com',
      'gravatar.com',
      'cdn.supabase.io',
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Webpack configuration for aliases and optimizations
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add custom webpack configuration here
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '.',
    };

    // Add polyfills for Node.js modules in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
      };

      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        })
      );
    }

    return config;
  },

  // Build output configuration
  output: 'standalone',
  
  // Compression
  compress: true,

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },

  // PoweredByHeader
  poweredByHeader: false,

  // Generate build ID for deployment tracking
  generateBuildId: async () => {
    const domain = process.env.NEXT_PUBLIC_DOMAIN || 'default';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${domain}-${timestamp}`;
  },

  // Runtime configuration
  publicRuntimeConfig: {
    domain: process.env.NEXT_PUBLIC_DOMAIN,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },

  serverRuntimeConfig: {
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    jwtSecret: process.env.JWT_SECRET,
    cashappClientId: process.env.CASHAPP_CLIENT_ID,
    cashappSecret: process.env.CASHAPP_SECRET,
    btcWalletAddress: process.env.BTC_WALLET_ADDRESS,
    btcApiKey: process.env.BTC_API_KEY,
  },
};

module.exports = nextConfig;