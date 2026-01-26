import dbConnect from '@/lib/db';
import Post from '@/models/Post';

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap() {
    if (process.env.MONGO_URI) {
        try {
            await dbConnect();
            posts = await Post.find({ isPublished: true }, 'slug updatedAt');
        } catch (e) {
            console.error('Sitemap DB Error:', e);
        }
    } else {
        console.warn('Skipping sitemap dynamic generation: MONGO_URI missing');
    }

    const blogUrls = posts.map((post) => ({
        url: `https://airporttaxis.lk/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    const staticRoutes = [
        { url: 'https://airporttaxis.lk', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: 'https://airporttaxis.lk/blog', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: 'https://airporttaxis.lk/contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
        { url: 'https://airporttaxis.lk/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
        { url: 'https://airporttaxis.lk/rates', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    ];

    return [...staticRoutes, ...blogUrls];
}
