export default function sitemap() {
    const baseUrl = 'https://airporttaxis.lk';

    // Core Pages
    const routes = [
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
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.8,
    }));

    return routes;
}
