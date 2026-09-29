import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [25, 50, 75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'joxaqcpltkclanmddknq.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/seniman-musik',
        destination: '/pemusik',
      },
      {
        source: '/seniman',
        destination: '/pemusik',
      },
    ];
  },
};

export default nextConfig;
