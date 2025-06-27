
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.investfly.com',
        port: '',
        pathname: '/images/logos/**',
      },
      {
        protocol: 'https',
        hostname: 'nbimf.com',
        port: '',
        pathname: '/_next/image/**',
      },
      {
        protocol: 'https',
        hostname: 'forefronteng.com',
        port: '',
        pathname: '/_next/image/**',
      },
      {
        protocol: 'https',
        hostname: 'thedreamshouse.com',
        port: '',
        pathname: '/_next/image/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
