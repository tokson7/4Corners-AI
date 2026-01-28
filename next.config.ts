import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  reactStrictMode: false,
  
  experimental: {
    optimizePackageImports: ['@/components', '@/lib', 'lucide-react', 'framer-motion'],
  },

  // External packages for server components (moved from experimental)
  serverExternalPackages: ['@prisma/client'],

  // Allow Clerk images
  images: {
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
