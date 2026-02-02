'use client';

import React, { useEffect, useState } from 'react';

const ReviewStatsBar = () => {
    const [stats, setStats] = useState({ rating: '5.0', count: '400+' });
    const [googleStats, setGoogleStats] = useState({ rating: '5.0', count: '300+' });
    const [taStats, setTaStats] = useState({ rating: '5.0', count: '100+' });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch both stats in parallel
                const [tripRes, googleRes] = await Promise.allSettled([
                    fetch('/api/tripadvisor'),
                    fetch('/api/reviews/google')
                ]);

                // Process TripAdvisor
                if (tripRes.status === 'fulfilled') {
                    const data = await tripRes.value.json();
                    if (data.success && data.rating) {
                        setTaStats({
                            rating: parseFloat(data.rating).toFixed(1),
                            count: `${data.num_reviews}+ Reviews`
                        });
                    }
                }

                // Process Google
                if (googleRes.status === 'fulfilled') {
                    const data = await googleRes.value.json();
                    if (data.success && data.data) {
                        setGoogleStats({
                            rating: parseFloat(data.data.rating).toFixed(1),
                            count: `${data.data.totalReviews}+ Reviews`
                        });
                    }
                }

                // Calculate Combined for general badge if needed (keeping original stats for safety)
                // However, we are showing separate blocks now to match user request
            } catch (err) {
                console.error('Failed to load review stats', err);
            }
        };

        fetchStats();
    }, []);

    return (
        <section className="bg-white dark:bg-slate-900 border-b border-emerald-900/5 dark:border-white/5 py-8">
            <div className="container mx-auto px-6">
                <div className="flex flex-col gap-6 w-full max-w-lg mx-auto">

                    {/* TripAdvisor */}
                    <a
                        href="https://www.tripadvisor.com/Attraction_Review-g297896-d33986804-Reviews-Airport_Taxi_Tours_Sri_Lanka-Galle_Galle_District_Southern_Province.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 hover:border-emerald-500/30 transition-all group w-full"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#00AA6C] rounded-full flex items-center justify-center text-white shrink-0">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm10 0c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" /><circle cx="7" cy="12" r="1" /><circle cx="17" cy="12" r="1" /></svg>
                            </div>
                            <div>
                                <div className="font-bold text-slate-800 dark:text-white leading-tight">TripAdvisor</div>
                                <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Excellent</div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1">
                                <span className="text-lg font-black text-slate-900 dark:text-white">{taStats.rating}</span>
                                <div className="flex text-[#00AA6C]">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                    ))}
                                </div>
                            </div>
                            <span className="text-[10px] text-slate-400">{taStats.count}</span>
                        </div>
                    </a>

                    {/* Google */}
                    <a
                        href="https://g.page/r/YOUR_GOOGLE_REVIEW_LINK"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 hover:border-blue-500/30 transition-all group w-full"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-full shadow-sm border border-slate-200 flex items-center justify-center shrink-0">
                                <span className="text-[#4285F4] font-bold text-lg">G</span>
                            </div>
                            <div>
                                <div className="font-bold text-slate-800 dark:text-white leading-tight">Google Reviews</div>
                                <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Top Rated</div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1">
                                <span className="text-lg font-black text-slate-900 dark:text-white">{googleStats.rating}</span>
                                <div className="flex text-[#F4B400]">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                    ))}
                                </div>
                            </div>
                            <span className="text-[10px] text-slate-400">{googleStats.count}</span>
                        </div>
                    </a>

                </div>
            </div>
        </section>
    );
};

export default ReviewStatsBar;
