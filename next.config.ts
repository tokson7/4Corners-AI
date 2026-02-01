import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  reactStrictMode: false,
  // Note: swcMinify is now enabled by default in Next.js 15+
  
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@clerk/nextjs',
    ],
  },

  // External packages for server components
  serverExternalPackages: ['@prisma/client', 'prisma'],

  // Allow Clerk images with optimizations
  images: {
    formats: ['image/avif', 'image/webp'], // Modern formats for better compression
    minimumCacheTTL: 31536000, // 1 year cache for static images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
        pathname: '/**',
      },
    ],
  },
  
  // Optimize compilation
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
};

export default nextConfig;
