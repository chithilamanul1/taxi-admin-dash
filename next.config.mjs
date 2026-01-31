/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com', // For Google Reviews/Profiles
            }
        ],
        formats: ['image/avif', 'image/webp'],
        // unoptimized: true, // Commented out to enable Vercel Image Optimization
    },
    productionBrowserSourceMaps: true, // Enabled for debugging/Lighthouse insights
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
};

export default nextConfig;
