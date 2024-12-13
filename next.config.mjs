/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignoring TypeScript errors during the build
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignores ESLint during production build
  },
  images: {
    domains: ["i.ytimg.com"], // Add the required hostname
  },
}

export default nextConfig
