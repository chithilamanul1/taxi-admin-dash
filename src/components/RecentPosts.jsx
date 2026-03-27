'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';

export default function RecentPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/blog?limit=3&t=${Date.now()}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setPosts(data.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch posts', err);
                setLoading(false);
            });
    }, []);

    if (!loading && posts.length === 0) return null;

    return (
        <section className="py-32 bg-slate-50 relative transition-colors duration-300 border-t border-slate-200 overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FACC15]/5 -mr-48 -mt-48 blur-3xl rounded-none"></div>

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8 animate-slide-up">
                    <div className="max-w-2xl bg-white p-8 md:p-12 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
                        <h2 className="text-6xl md:text-7xl font-black mb-6 text-slate-900 uppercase tracking-tighter leading-none">
                            TRAVEL <span className="text-[#FACC15]">INSIGHTS</span>
                        </h2>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs leading-relaxed">Discover Sri Lanka through the eyes of our expert travel guides and professional chauffeurs.</p>
                    </div>
                    <Link href="/blog" className="px-12 py-6 bg-[#FACC15] text-black rounded-none text-xs font-black uppercase tracking-[0.2em] hover:translate-y-[2px] active:translate-y-[4px] transition-all flex items-center gap-4 border-4 border-black group">
                        JOURNAL INDEX <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-3 gap-12">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[600px] rounded-none bg-white animate-pulse border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-12">
                        {posts.map((post, idx) => (
                            <Link
                                href={`/blog/${post.slug}`}
                                key={post._id}
                                className="group relative bg-white rounded-none overflow-hidden border-4 border-black flex flex-col h-[600px] animate-slide-up hover:-translate-y-2 transition-all duration-500"
                                style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                                <div className="aspect-video overflow-hidden relative">
                                    <img
                                        src={post.imageUrl || '/hero.jpg'}
                                        alt={post.title}
                                        onError={(e) => { e.currentTarget.src = '/hero.jpg'; e.currentTarget.onerror = null; }}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                                    <div className="absolute top-4 left-4">
                                        <div className="flex items-center gap-2 text-[9px] font-black text-black uppercase tracking-[0.1em] bg-[#FACC15] px-4 py-2 rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                            <Calendar size={12} strokeWidth={2} />
                                            {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-2xl font-black mb-4 leading-tight text-slate-900 group-hover:text-emerald-900 transition-colors line-clamp-2 uppercase tracking-tighter">
                                        {post.title}
                                    </h3>
                                    <p className="text-slate-500 text-[11px] font-bold leading-relaxed line-clamp-3 mb-6 uppercase tracking-wider">
                                        {post.seo?.metaDescription || post.excerpt || "Read more about this fascinating insight into Sri Lankan travel."}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between border-t border-slate-100 px-8 py-8 mt-auto bg-slate-50/50 group-hover:bg-[#FACC15]/5 transition-colors">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 group-hover:text-emerald-900 uppercase tracking-[0.2em] transition-colors">
                                        <Clock size={16} strokeWidth={2} />
                                        <span>READ JOURNAL</span>
                                    </div>
                                    <div className="w-12 h-12 rounded-none bg-black text-[#FACC15] border-2 border-black flex items-center justify-center group-hover:bg-[#FACC15] group-hover:text-black transition-all group-hover:translate-x-1">
                                        <ArrowRight size={22} strokeWidth={2} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
