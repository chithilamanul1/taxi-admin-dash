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
        <section className="py-32 bg-white dark:bg-black relative transition-colors duration-300">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-black/5 dark:via-white/5 to-transparent"></div>

            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8 animate-slide-up">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-black mb-4 text-black dark:text-white uppercase italic tracking-tight">
                            Travel <span className="text-emerald-600 dark:text-yellow-400">Insights</span>
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">Discover Sri Lanka through the eyes of our expert travel guides and professional chauffeurs.</p>
                    </div>
                    <Link href="/blog" className="px-8 py-4 bg-black dark:bg-yellow-400 text-white dark:text-black rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg hover:bg-slate-900 dark:hover:bg-yellow-500 transition-all flex items-center gap-2">
                        Read the Journal <ArrowRight size={14} />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[450px] rounded-3xl bg-slate-50 dark:bg-white/5 animate-pulse border border-black/5 dark:border-white/5"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {posts.map((post, idx) => (
                            <Link
                                href={`/blog/${post.slug}`}
                                key={post._id}
                                className="group relative bg-slate-50 dark:bg-[#111] rounded-3xl overflow-hidden border border-black/5 dark:border-white/5 flex flex-col h-[520px] animate-slide-up hover:border-emerald-600 dark:hover:border-yellow-400 shadow-sm hover:shadow-xl transition-all duration-500"
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
                                        <div className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-[0.2em] bg-emerald-600 dark:bg-emerald-700 px-3 py-1 rounded-full">
                                            <Calendar size={10} />
                                            {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-xl font-black mb-4 leading-tight text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-yellow-400 transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                                        {post.seo?.metaDescription || post.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-6 mt-auto">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 dark:text-yellow-400 uppercase tracking-widest">
                                            <Clock size={12} />
                                            5 MIN READ
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 text-black dark:text-white flex items-center justify-center group-hover:bg-black dark:group-hover:bg-yellow-400 group-hover:text-white dark:group-hover:text-black transition-all shadow-sm border border-slate-100 dark:border-white/10">
                                            <ArrowRight size={16} />
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
