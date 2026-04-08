export default function sitemap() {
    const baseUrl = 'https://srilankantaxi.lk';

    const { routes } = require('../lib/routes');

    const taxiRoutes = routes.map(r => ({
        url: `${baseUrl}/taxi-routes/${r.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8
    }));

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
        '/destination',
        '/taxi-6-passengers'
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : (route.includes('trips') || route.includes('packages') || route.includes('taxi-6') ? 0.9 : 0.7),
    }));

    return [...staticRoutes, ...taxiRoutes];
}
