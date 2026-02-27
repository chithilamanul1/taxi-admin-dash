export default function sitemap() {
    const baseUrl = 'https://airporttaxis.lk';

    // Core Pages
    const routes = [
        '',
        '/ride-now',
        '/tours',
        '/contact',
        '/login',
        '/register',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
    }));

    return routes;
}
