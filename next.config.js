/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable server-side features for API routes and Supabase integration
  // Note: output: 'export' removed to support API routes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  // Environment variable configuration
  env: {
    NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
  },
}

export default nextConfig