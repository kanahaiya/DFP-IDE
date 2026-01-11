import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable strict mode for better error catching
  reactStrictMode: true,
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Turbopack configuration for Monaco Editor
  turbopack: {
    resolveAlias: {
      // Monaco Editor compatibility
    },
  },
};

export default nextConfig;
