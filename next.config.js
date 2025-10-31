/** Minimal Next.js config for Vercel deployments */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["images.unsplash.com", "cdn.sanity.io"]
  }
}

module.exports = nextConfig
