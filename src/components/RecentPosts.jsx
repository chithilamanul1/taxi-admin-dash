'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';

export default function RecentPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/blog?limit=3')
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
        <section className="py-32 bg-white dark:bg-[#0a0a0a] relative transition-colors duration-300 border-t-4 border-black">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8 animate-slide-up">
                    <div className="max-w-2xl">
                        <h2 className="text-5xl md:text-7xl font-black mb-6 text-black dark:text-white uppercase italic tracking-tighter leading-none">
                            TRAVEL <span className="text-[#FACC15]">INSIGHTS</span>
                        </h2>
                        <p className="text-black/50 dark:text-white/50 font-black uppercase tracking-[0.1em] text-sm md:text-base">Discover Sri Lanka through the eyes of our expert travel guides and professional chauffeurs.</p>
                    </div>
                    <Link href="/blog" className="px-8 py-4 bg-black text-[#FACC15] rounded-none text-xs font-black uppercase tracking-[0.2em] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(250,204,21,0.2)] hover:bg-[#FACC15] hover:text-black transition-all flex items-center gap-3 border-4 border-black hover:-translate-y-1">
                        READ THE JOURNAL <ArrowRight size={14} strokeWidth={3} />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[450px] rounded-none bg-black/5 dark:bg-white/5 animate-pulse border-4 border-black"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {posts.map((post, idx) => (
                            <Link
                                href={`/blog/${post.slug}`}
                                key={post._id}
                                className="group relative bg-white dark:bg-[#111] rounded-none overflow-hidden border-4 border-black flex flex-col h-[520px] animate-slide-up hover:border-[#FACC15] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(250,204,21,0.2)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
                                style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                                <div className="h-64 overflow-hidden relative">
                                    <img
                                        src={post.imageUrl || '/hero.jpg'}
                                        alt={post.title}
                                        onError={(e) => { e.currentTarget.src = '/hero.jpg'; e.currentTarget.onerror = null; }}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                    <div className="absolute bottom-4 left-6">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-black uppercase tracking-[0.2em] bg-[#FACC15] px-3 py-1 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                            <Calendar size={10} />
                                            {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-xl font-black mb-4 leading-tight text-black dark:text-white group-hover:text-[#FACC15] transition-colors line-clamp-2 uppercase tracking-tight">
                                        {post.title}
                                    </h3>
                                    <p className="text-black/50 dark:text-white/50 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                                        {post.seo?.metaDescription || post.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between border-t-4 border-black pt-6 mt-auto">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-[#FACC15] uppercase tracking-[0.2em]">
                                            <Clock size={12} strokeWidth={3} />
                                            5 MIN READ
                                        </div>
                                        <div className="w-10 h-10 rounded-none bg-black text-[#FACC15] flex items-center justify-center group-hover:bg-[#FACC15] group-hover:text-black transition-all border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                            <ArrowRight size={16} strokeWidth={3} />
                                        </div>
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
