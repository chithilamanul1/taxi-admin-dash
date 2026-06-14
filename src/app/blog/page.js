import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import dbConnect from '../../lib/db';
import Post from '../../models/Post';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
    title: 'Travel Blog - Airport Taxi Tours Sri Lanka',
    description: 'Explore our latest travel guides, tips, and news about visiting Sri Lanka. Plan your perfect trip with our expert advice.',
};

async function getPosts() {
    const connectionString = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!connectionString) {
        console.warn('Skipping blog posts: Database URI missing');
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
        <div className="min-h-screen bg-white pb-24 transition-colors">
            {/* Hero Section */}
            <div className="bg-slate-50 dark:bg-[#050505] py-20 md:py-32 border-b border-slate-100 dark:border-white/5 relative overflow-hidden transition-colors">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#FACC15]/10 rounded-full blur-3xl"></div>
                
                <div className="container mx-auto px-6 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-[#FACC15] text-black px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-6 shadow-lg shadow-yellow-500/20">
                        Latest Insights
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 uppercase tracking-tighter leading-none text-emerald-950 dark:text-white">
                        TRAVEL <span className="text-[#FACC15]">CHRONICLES</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium text-sm md:text-base leading-relaxed">
                        Expert guides and professional insights from Sri Lanka's leading airport transfer network.
                    </p>
                </div>
            </div>

            {/* Posts Grid */}
            <div className="container mx-auto px-6 -mt-20 relative z-10 max-w-7xl">
                {posts.length === 0 ? (
                    <div className="bg-white p-24 rounded-[3rem] border border-slate-100 shadow-2xl text-center">
                        <p className="text-slate-900 text-2xl font-black uppercase italic tracking-widest leading-none">NO ARCHIVES FOUND</p>
                        <p className="text-slate-400 mt-4 font-black uppercase text-[10px] tracking-widest">Chronicles are being compiled. check back later.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {posts.map((post) => (
                            <Link href={`/blog/${post.slug}`} key={post._id} className="group">
                                <article className="bg-white dark:bg-[#0a0a0a] rounded-[2rem] border border-slate-100 dark:border-white/5 flex flex-col h-[500px] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden group">
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        <img
                                            src={post.imageUrl || '/logo.png'}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors" />
                                        <div className="absolute bottom-6 right-6 bg-[#FACC15] text-slate-900 text-[10px] font-black px-5 py-2.5 rounded-full shadow-lg uppercase tracking-widest">
                                            {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </div>
                                    <div className="p-6 md:p-8 flex-1 flex flex-col pb-6">
                                        <div className="flex items-center gap-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mb-4 uppercase tracking-[0.2em] leading-none">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                            LOG ENTRY
                                        </div>
                                        <h2 className="text-2xl font-black text-emerald-950 dark:text-white mb-4 group-hover:text-emerald-600 dark:group-hover:text-[#FACC15] transition-colors line-clamp-2 uppercase tracking-tight leading-[1.1]">
                                            {post.title}
                                        </h2>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                                            {post.seo?.metaDescription || post.excerpt || "Deep dive into Sri Lankan travel logistics and professional insights from our global network."}
                                        </p>
                                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-6 mt-auto">
                                            <span className="text-emerald-950 dark:text-white font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:text-emerald-600 dark:group-hover:text-[#FACC15] transition-colors">
                                                READ ARTICLE
                                            </span>
                                            <div className="w-10 h-10 bg-slate-50 dark:bg-zinc-800 text-emerald-950 dark:text-white rounded-xl flex items-center justify-center group-hover:bg-[#FACC15] group-hover:text-black transition-all shadow-sm">
                                                <ArrowRight size={16} strokeWidth={2.5} />
                                            </div>
                                        </div>
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
