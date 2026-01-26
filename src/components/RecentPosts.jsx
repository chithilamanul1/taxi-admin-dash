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
        <section className="py-32 bg-white dark:bg-slate-950 relative transition-colors">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8 animate-slide-up">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-emerald-900 dark:text-white font-heading">
                            Travel <span className="text-emerald-600 dark:text-emerald-400">Insights</span>
                        </h2>
                        <p className="text-emerald-900/60 dark:text-white/60 text-lg font-medium">Discover Sri Lanka through the eyes of our expert travel guides and professional chauffeurs.</p>
                    </div>
                    <Link href="/blog" className="px-8 py-4 bg-emerald-900 text-white rounded-xl text-xs font-bold uppercase tracking-[0.2em] shadow-lg hover:bg-emerald-800 transition-all flex items-center gap-2">
                        Read the Journal <ArrowRight size={14} />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[450px] rounded-[2.5rem] bg-emerald-50/50 animate-pulse border border-emerald-900/5"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {posts.map((post, idx) => (
                            <Link
                                href={`/blog/${post.slug}`}
                                key={post._id}
                                className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-emerald-900/10 dark:border-white/5 flex flex-col h-[520px] animate-slide-up hover:border-emerald-600 shadow-sm hover:shadow-xl transition-all duration-500"
                                style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                                <div className="h-64 overflow-hidden relative">
                                    <img
                                        src={post.coverImage || '/hero.jpg'}
                                        alt={post.title}
                                        onError={(e) => { e.currentTarget.src = '/hero.jpg'; e.currentTarget.onerror = null; }}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/20 to-transparent"></div>
                                    <div className="absolute bottom-4 left-6">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-[0.2em] bg-emerald-900 px-3 py-1 rounded-full">
                                            <Calendar size={10} />
                                            {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-xl font-bold mb-4 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 text-emerald-900 dark:text-white">
                                        {post.title}
                                    </h3>
                                    <p className="text-emerald-900/60 dark:text-white/60 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                                        {post.seo?.metaDescription || post.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between border-t border-emerald-900/5 dark:border-white/5 pt-6 mt-auto">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                                            <Clock size={12} />
                                            5 MIN READ
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-white/5 text-emerald-900 dark:text-white flex items-center justify-center group-hover:bg-emerald-900 dark:group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
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
