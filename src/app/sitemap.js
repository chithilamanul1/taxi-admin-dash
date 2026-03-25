export default function sitemap() {
    const baseUrl = 'https://airporttaxis.lk';

    const staticRoutes = [
        '',
        '/about',
        '/contact',
        '/prices',
        '/day-trips',
        '/tour-packages',
        '/blog',
        '/login',
        '/services',
        '/review',
        '/offers',
        '/privacy-policy',
        '/refund-policy',
        '/terms',
        '/destination'
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : (route.includes('trips') || route.includes('packages') ? 0.9 : 0.7),
    }));

    return staticRoutes;
}
