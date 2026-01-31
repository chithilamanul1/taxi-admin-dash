import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import { destinations } from '@/lib/destinations';

export const revalidate = 3600; // Revalidate every hour

async function getPosts() {
    if (process.env.MONGO_URI) {
        try {
            await dbConnect();
            const posts = await Post.find({ isPublished: true }, 'slug updatedAt');
            return posts || [];
        } catch (e) {
            console.error('Sitemap DB Error:', e);
            return [];
        }
    }
    console.warn('Skipping sitemap dynamic generation: MONGO_URI missing');
    return [];
}

export default async function sitemap() {
    const posts = await getPosts();

    const blogEntries = posts.map(post => ({
        url: `https://airporttaxi.lk/blog/${post.slug}`,
        lastModified: post.updatedAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    const staticEntries = [
        { url: 'https://airporttaxi.lk', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: 'https://airporttaxi.lk/blog', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: 'https://airporttaxi.lk/contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
        { url: 'https://airporttaxi.lk/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
        { url: 'https://airporttaxi.lk/rates', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
        { url: 'https://airporttaxi.lk/terms', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    ];

    const destEntries = destinations.map(dest => ({
        url: `https://airporttaxi.lk/destination/${dest.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
    }));

    return [...staticEntries, ...blogEntries, ...destEntries];
}
