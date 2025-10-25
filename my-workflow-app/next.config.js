/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',  // Support GitHub Pages path
  images: {
    unoptimized: true  // Required for static export
  }
}

export default nextConfig