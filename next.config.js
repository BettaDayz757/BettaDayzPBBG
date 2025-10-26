/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',  // Support GitHub Pages path
  images: {
    unoptimized: true  // Required for static export
  },
  // Note: TypeScript build errors will be enforced. If you previously added
  // `typescript.ignoreBuildErrors` to bypass type checks for artifact
  // verification, it has been removed so CI/builds fail on type errors.
}

export default nextConfig