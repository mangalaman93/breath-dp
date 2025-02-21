/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Keep ESLint disabled until we resolve the config issue
  },
  output: 'standalone',
};

module.exports = nextConfig;
