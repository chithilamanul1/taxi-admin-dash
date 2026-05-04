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
            <div className="bg-slate-50 py-20 md:py-24 border-b border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-emerald-600/5 -skew-y-3 transform origin-top-left transition-transform"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <div className="inline-block bg-slate-900 px-12 py-10 rounded-[3rem] border border-white/10 shadow-2xl shadow-slate-900/20">
                        <h1 className="text-4xl md:text-7xl font-black mb-4 uppercase italic tracking-tighter leading-none text-white">
                            TRAVEL <span className="text-emerald-500">CHRONICLES</span>
                        </h1>
                        <p className="text-slate-400 max-w-xl mx-auto uppercase font-black tracking-[0.4em] text-[10px] md:text-[11px] italic leading-relaxed">
                            Expert guides and professional insights from Sri Lanka's leading airport transfer network.
                        </p>
                    </div>
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
                                <article className="bg-white rounded-[2.5rem] border border-slate-100 flex flex-col h-[620px] hover:border-emerald-200 shadow-xl hover:shadow-2xl hover:translate-y-[-12px] transition-all duration-500 overflow-hidden group">
                                    <div className="relative aspect-video overflow-hidden">
                                        <img
                                            src={post.imageUrl || '/logo.png'}
                                            alt={post.title}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors" />
                                        <div className="absolute bottom-6 right-6 bg-[#FACC15] text-slate-900 text-[10px] font-black px-5 py-2.5 rounded-full shadow-lg uppercase tracking-widest">
                                            {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </div>
                                    <div className="p-8 md:p-10 flex-1 flex flex-col pb-8">
                                        <div className="flex items-center gap-3 text-[10px] text-emerald-600 font-black mb-6 uppercase tracking-[0.4em] italic leading-none">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                            LOG ENTRY
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900 mb-6 group-hover:text-emerald-600 transition-colors line-clamp-2 uppercase italic tracking-tighter leading-[1.1]">
                                            {post.title}
                                        </h2>
                                        <p className="text-slate-500 text-sm font-bold line-clamp-3 mb-8 flex-1 uppercase tracking-widest leading-relaxed">
                                            {post.seo?.metaDescription || post.excerpt || "DEEP DIVE INTO SRI LANKAN TRAVEL LOGISTICS AND PROFESSIONAL INSIGHTS FROM OUR GLOBAL NETWORK."}
                                        </p>
                                        <div className="flex items-center justify-between border-t border-slate-100 pt-8 bg-slate-50 -mx-10 -mb-10 px-10 pb-10 transition-colors group-hover:bg-emerald-50/50">
                                            <span className="text-slate-900 font-black text-[10px] uppercase tracking-widest italic flex items-center gap-2">
                                                READ ARCHIVE
                                            </span>
                                            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 transition-all shadow-lg shadow-slate-900/10 group-hover:shadow-emerald-600/20">
                                                <ArrowRight size={20} strokeWidth={3} />
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
