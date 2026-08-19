import { headers } from 'next/headers';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/Post';

export default async function sitemap() {
    const headersList = await headers();
    const host = headersList.get('host') || 'airporttaxis.lk';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const { routes } = require('../lib/routes');

    // Static pages
    const staticRoutes = [
        '',
        '/about',
        '/gallery',
        '/contact',
        '/roundtrip',
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
        '/taxi-6-passengers',
        '/sigiriya',
        '/kandy',
        '/galle'
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : (route === '/blog' ? 0.9 : (route.includes('trips') || route.includes('packages') || route.includes('taxi-6') ? 0.85 : 0.7)),
    }));

    // Taxi route pages
    const taxiRoutes = routes.map(r => ({
        url: `${baseUrl}/taxi-routes/${r.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8
    }));

    // Blog posts from MongoDB - auto-included after every AI publish
    let blogRoutes = [];
    let tourRoutes = [];
    let tourPackageRoutes = [];

    try {
        await dbConnect();
        const posts = await BlogPost.find(
            { isPublished: true },
            'slug updatedAt createdAt'
        ).sort({ createdAt: -1 }).lean();

        blogRoutes = posts.map(post => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.updatedAt || post.createdAt),
            changeFrequency: 'monthly',
            priority: 0.75
        }));

        // Fetch Tours
        const Tour = require('@/models/Tour').default || require('@/models/Tour');
        const tours = await Tour.find({}, 'slug updatedAt createdAt').lean();

        tourRoutes = tours.map(tour => ({
            url: `${baseUrl}/tours/${tour.slug}`,
            lastModified: new Date(tour.updatedAt || tour.createdAt || new Date()),
            changeFrequency: 'weekly',
            priority: 0.8
        }));

        tourPackageRoutes = tours.map(tour => ({
            url: `${baseUrl}/tour-packages/${tour.slug}`,
            lastModified: new Date(tour.updatedAt || tour.createdAt || new Date()),
            changeFrequency: 'weekly',
            priority: 0.8
        }));
    } catch (err) {
        console.error('[sitemap] Could not load dynamic DB routes:', err.message);
    }

    // Destinations
    const { destinations } = require('@/lib/destinations');
    const destinationRoutes = (destinations || []).map(d => ({
        url: `${baseUrl}/destinations/${d.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85
    }));

    return [...staticRoutes, ...taxiRoutes, ...blogRoutes, ...tourRoutes, ...tourPackageRoutes, ...destinationRoutes];
}
