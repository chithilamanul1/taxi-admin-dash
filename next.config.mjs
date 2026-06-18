import { withSentryConfig } from '@sentry/nextjs';
import withPWAInit from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**',
            }
        ],
        formats: ['image/avif', 'image/webp'],
        // unoptimized: true, // Commented out to enable Vercel Image Optimization
    },
    productionBrowserSourceMaps: false,
    cacheMaxMemorySize: 2048 * 1024 * 1024, // 2GB memory cache size for Next.js ISR (default is 50MB)
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    }
                ]
            },
            {
                source: '/fonts/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                source: '/images/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    async redirects() {
        return [
            {
                source: '/rate-guide',
                destination: '/prices',
                permanent: true,
            },
            {
                source: '/taxi-rates-guide',
                destination: '/prices',
                permanent: true,
            },
            {
                source: '/taxi-rates',
                destination: '/prices',
                permanent: true,
            }
        ];
    },
};

const withPWA = withPWAInit({
    dest: 'public',
    disable: true, // Temporarily disabled to debug Vercel internal deployment errors
    register: true,
    skipWaiting: true,
});

export default withSentryConfig(withPWA(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  transpileClientSDK: true,
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
});
