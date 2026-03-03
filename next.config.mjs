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
                hostname: 'images.pexels.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.pexels.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**',
            }
        ],
        formats: ['image/avif', 'image/webp'],
        // unoptimized: true, // Commented out to enable Vercel Image Optimization
    },
    productionBrowserSourceMaps: false, // Disabled to reduce deployment payload size
    // Keep Express backend separate
    /*
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:5000/api/:path*',
            },
        ];
    },
    */
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

export default withPWA(nextConfig);
