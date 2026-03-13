import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import dbConnect from '../../lib/db';
import Post from '../../models/Post';

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
        <div className="min-h-screen bg-[#111827] pb-20 transition-colors">
            {/* Hero Section */}
            <div className="bg-[#111827] py-24 md:py-32 border-b-8 border-black relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[#FACC15]/5 -skew-y-6 transform origin-top-left transition-transform"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <div className="inline-block bg-black px-12 py-12 border-8 border-black shadow-[20px_20px_0px_0px_#FACC15] transform -rotate-1">
                        <h1 className="text-6xl md:text-9xl font-black mb-6 uppercase italic tracking-tighter leading-none text-white">
                            TRAVEL <span className="text-[#FACC15]">CHRONICLES</span>
                        </h1>
                        <p className="text-[#FACC15]/60 max-w-2xl mx-auto uppercase font-black tracking-[0.4em] text-[10px] md:text-xs italic leading-relaxed">
                            Expert guides and professional insights from Sri Lanka's leading airport transfer network.
                        </p>
                    </div>
                </div>
            </div>

            {/* Posts Grid */}
            <div className="container mx-auto px-6 -mt-16 relative z-10 max-w-7xl">
                {posts.length === 0 ? (
                    <div className="bg-[#1c2433] p-24 rounded-none border-8 border-black shadow-[20px_20px_0px_0px_#FACC15] text-center">
                        <p className="text-[#FACC15] text-2xl font-black uppercase italic tracking-widest leading-none">NO ARCHIVES FOUND</p>
                        <p className="text-white/20 mt-4 font-black uppercase text-[10px] tracking-widest">Chronicles are being compiled. check back later.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {posts.map((post) => (
                            <Link href={`/blog/${post.slug}`} key={post._id} className="group">
                                <article className="bg-[#1c2433] rounded-none border-4 border-black flex flex-col h-[600px] hover:border-[#FACC15] shadow-[12px_12px_0px_0px_#FACC15] hover:translate-y-[-12px] hover:shadow-[24px_24px_0px_0px_#FACC15] transition-all duration-500 overflow-hidden">
                                    <div className="relative aspect-video overflow-hidden border-b-4 border-black">
                                        <img
                                            src={post.imageUrl || '/logo.png'}
                                            alt={post.title}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-115 opacity-80 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                                        <div className="absolute bottom-6 right-6 bg-[#FACC15] text-black text-[10px] font-black px-4 py-2 border-2 border-black italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest">
                                            {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col pb-8">
                                        <div className="flex items-center gap-3 text-[10px] text-[#FACC15] font-black mb-6 uppercase tracking-[0.4em] italic leading-none">
                                            <div className="w-2 h-2 bg-[#FACC15] animate-pulse"></div>
                                            LOG ENTRY
                                        </div>
                                        <h2 className="text-3xl font-black text-white mb-6 group-hover:text-[#FACC15] transition-colors line-clamp-2 uppercase italic tracking-tighter leading-none">
                                            {post.title}
                                        </h2>
                                        <p className="text-white/40 text-[10px] font-black line-clamp-3 mb-8 flex-1 uppercase tracking-widest leading-relaxed">
                                            {post.seo?.metaDescription || post.excerpt || "DEEP DIVE INTO SRI LANKAN TRAVEL LOGISTICS AND PROFESSIONAL INSIGHTS FROM OUR GLOBAL NETWORK."}
                                        </p>
                                        <div className="flex items-center justify-between border-t-4 border-black pt-8 bg-black/20 -mx-8 -mb-8 px-8 pb-8 transition-colors group-hover:bg-[#FACC15]/5">
                                            <span className="text-[#FACC15] font-black text-[10px] uppercase tracking-widest italic flex items-center gap-2">
                                                READ ARCHIVE
                                            </span>
                                            <div className="w-12 h-12 bg-black text-[#FACC15] border-2 border-black flex items-center justify-center group-hover:bg-[#FACC15] group-hover:text-black transition-all shadow-[4px_4px_0px_0px_#FACC15] group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                                <ArrowRight size={20} strokeWidth={4} />
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
