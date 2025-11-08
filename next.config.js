/** @type {import('next').NextConfig} */
const nextConfig = {
  // Generate a standalone output for Vercel or Docker deployments
  output: "standalone",

  // Ignore TypeScript errors during production builds
  typescript: {
    ignoreBuildErrors: true,
  },

  // Ignore ESLint errors during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Workaround for pdfjs-dist (client-only usage) to avoid Node canvas issues
  webpack: (config) => {
    // Prevent Webpack from including these Node-specific packages
    // pdfjs-dist optionally uses them, which breaks Next.js builds
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    return config;
  },
};

module.exports = nextConfig;
