/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['localhost'],
        unoptimized: true, // Temporary, can optimize later
    },
    productionBrowserSourceMaps: false, // Security: Disable source maps in production
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
};

export default nextConfig;
