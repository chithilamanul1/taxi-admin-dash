import Link from 'next/link';
import dbConnect from '../../lib/db';
import Post from '../../models/Post';

export const metadata = {
    title: 'Travel Blog - Airport Taxi Tours Sri Lanka',
    description: 'Explore our latest travel guides, tips, and news about visiting Sri Lanka. Plan your perfect trip with our expert advice.',
};

async function getPosts() {
    if (!process.env.MONGO_URI) {
        console.warn('Skipping blog posts: MONGO_URI missing');
        return [];
    }
    try {
        await dbConnect();
        const posts = await Post.find({ isPublished: true }).sort({ createdAt: -1 });
        return posts;
    } catch (e) {
        console.error('Blog Page DB Error:', e);
        return [];
    }
}

export default async function BlogPage() {
    const posts = await getPosts();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors">
            {/* Hero Section */}
            <div className="bg-emerald-900 py-20">
                <div className="container mx-auto px-4 text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-tight">Travel Chronicles</h1>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto">
                        Discover the beauty of Sri Lanka with our curated travel guides and tips.
                    </p>
                </div>
            </div>

            {/* Posts Grid */}
            <div className="container mx-auto px-4 -mt-10 relative z-10">
                {posts.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 p-12 rounded-xl shadow-sm text-center border border-emerald-900/10 dark:border-white/5">
                        <p className="text-gray-500 dark:text-slate-400 text-lg">No articles found just yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link href={`/blog/${post.slug}`} key={post._id} className="group">
                                <article className="bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col border border-emerald-900/10 dark:border-white/5 group-hover:border-emerald-600">
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={post.coverImage || '/logo.png'}
                                            alt={post.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold mb-3 uppercase tracking-wider">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </div>
                                        <h2 className="text-xl font-bold text-emerald-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-600 dark:text-white/60 text-sm line-clamp-3 mb-4 flex-1">
                                            {post.seo?.metaDescription || post.excerpt || "Read more about this topic..."}
                                        </p>
                                        <span className="text-emerald-900 dark:text-emerald-400 font-bold text-sm group-hover:underline flex items-center gap-1">
                                            Read Article →
                                        </span>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
