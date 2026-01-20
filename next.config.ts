import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://order-management-system-production-955f.up.railway.app/api/:path*',
      },
    ];
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
