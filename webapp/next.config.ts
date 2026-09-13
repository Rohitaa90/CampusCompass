import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        // Fallback to localhost if BACKEND_URL isn't set
        destination: `${process.env.BACKEND_URL || 'http://localhost:5000/api'}/:path*`, 
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'campuscompass-uploads-rohit9044.s3.ap-south-1.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
