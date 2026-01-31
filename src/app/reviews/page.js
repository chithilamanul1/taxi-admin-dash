'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Star, User, Loader2, Quote, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function ReviewsPage() {
    const [data, setData] = useState(null);
    const [tripAdvisorData, setTripAdvisorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('google');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Google Reviews
                const res = await fetch('/api/google-reviews');
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }

                // Fetch TripAdvisor Reviews
                const taRes = await fetch('/api/tripadvisor');
                if (taRes.ok) {
                    const taJson = await taRes.json();
                    setTripAdvisorData(taJson);
                }

            } catch (err) {
                console.error('Failed to fetch reviews', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />

            {/* Header Section */}
            <div className="pt-32 pb-16 bg-emerald-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10 mix-blend-overlay"></div>
                <div className="container mx-auto px-4 relative z-10 text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
                        Client <span className="text-emerald-400">Stories</span>
                    </h1>
                    <p className="text-lg text-emerald-100/80 max-w-2xl mx-auto">
                        Don't just take our word for it. Read honest reviews from travelers who experienced Sri Lanka with us.
                    </p>

                    {/* Overall Rating Badge */}
                    {!loading && data && (
                        <div className="mt-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} fill="currentColor" strokeWidth={0} />
                                ))}
                            </div>
                            <div className="text-left leading-tight">
                                <div className="font-bold text-xl">{data.rating} / 5.0</div>
                                <div className="text-xs text-white/70">{data.userRatingCount}+ Verified Reviews</div>
                            </div>
                            <div className="ml-2 w-px h-8 bg-white/20"></div>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-6 h-6" />
                        </div>
                    )}
                </div>
            </div>

            {/* Reviews Grid */}
            <div className="container mx-auto px-4 py-16">
                {/* Reviews Toggle */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-emerald-900/10 inline-flex">
                        <button
                            onClick={() => setActiveTab('google')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'google'
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                                }`}
                        >
                            Google Reviews
                        </button>
                        <button
                            onClick={() => setActiveTab('tripadvisor')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'tripadvisor'
                                ? 'bg-[#00af87] text-white shadow-md'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                                }`}
                        >
                            TripAdvisor
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin text-emerald-600" size={48} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeTab === 'google' && data?.reviews?.map((review, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-emerald-900/5 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-300 group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 relative">
                                            {review.authorAttribution?.photoUri ? (
                                                <img
                                                    src={review.authorAttribution.photoUri}
                                                    alt={review.authorAttribution.displayName}
                                                    className="w-full h-full object-cover"
                                                    referrerPolicy="no-referrer"
                                                />
                                            ) : (
                                                <User className="text-emerald-600 dark:text-emerald-400" size={20} />
                                            )}
                                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border shadow-sm">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-4 h-4" alt="G" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                                                {review.authorAttribution?.displayName || 'Anonymous Traveler'}
                                            </h3>
                                            <div className="text-xs text-slate-500 flex items-center gap-1">
                                                <span>{review.relativePublishTimeDescription}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Quote className="text-emerald-900/10 dark:text-white/10 group-hover:text-emerald-600/20 transition-colors" size={40} />
                                </div>

                                <div className="flex gap-0.5 text-yellow-400 mb-4">
                                    {[...Array(5)].map((_, starIdx) => (
                                        <Star
                                            key={starIdx}
                                            size={16}
                                            fill={starIdx < review.rating ? "currentColor" : "none"}
                                            className={starIdx < review.rating ? "" : "text-slate-200 dark:text-slate-700"}
                                        />
                                    ))}
                                </div>

                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                                    "{review.text?.text}"
                                </p>
                            </div>
                        ))}

                        {activeTab === 'tripadvisor' && tripAdvisorData?.reviews?.map((review, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-[#00af87]/10 dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-[#00af87]/10 transition-all duration-300 group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-[#00af87]/10 flex items-center justify-center border border-[#00af87]/20 relative">
                                            {review.user?.avatar ? (
                                                <img
                                                    src={review.user.avatar}
                                                    alt={review.user.username}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="font-bold text-[#00af87] text-lg">{review.user.username?.charAt(0)}</span>
                                            )}
                                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border shadow-sm">
                                                <img src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg" className="w-4 h-4 object-contain" alt="TA" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                                                {review.user?.username || 'Traveler'}
                                            </h3>
                                            <div className="text-xs text-slate-500 flex items-center gap-1">
                                                <span>{new Date(review.published_date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Quote className="text-[#00af87]/10 group-hover:text-[#00af87]/20 transition-colors" size={40} />
                                </div>

                                <div className="flex gap-0.5 text-[#00af87] mb-4">
                                    {[...Array(5)].map((_, starIdx) => (
                                        <div key={starIdx} className={`w-3 h-3 rounded-full ${starIdx < Number(review.rating) ? 'bg-[#00af87]' : 'bg-slate-200'}`}></div>
                                    ))}
                                </div>

                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                                    "{review.text}"
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA Section */}
                <div className="mt-20 text-center">
                    <a
                        href="https://g.page/r/YOUR_GOOGLE_MAPS_LINK"
                        target="_blank"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 rounded-2xl font-bold text-emerald-900 dark:text-white shadow-lg hover:-translate-y-1 transition-transform border border-emerald-900/10"
                    >
                        <MapPin size={20} className="text-red-500" />
                        View us on Google Maps
                    </a>
                </div>
            </div>

            <Footer />
        </main>
    );
}
