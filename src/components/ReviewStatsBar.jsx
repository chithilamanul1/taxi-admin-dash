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
                    fetch('/api/reviews/tripadvisor'),
                    fetch('/api/reviews/google')
                ]);

                // Process TripAdvisor
                if (tripRes.status === 'fulfilled') {
                    const data = await tripRes.value.json();
                    if (data.success && data.data) {
                        setTaStats({
                            rating: parseFloat(data.data.rating).toFixed(1),
                            count: `${data.data.num_reviews}+ Reviews`
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
        <section className="bg-white dark:bg-slate-900 border-b border-slate-950/5 dark:border-white/5 py-8">
            <div className="container mx-auto px-6">
                <div className="flex flex-col gap-6 w-full max-w-lg mx-auto">

                    {/* TripAdvisor */}
                    <a
                        href="https://www.tripadvisor.com/Attraction_Review-g293962-d33986804-Reviews-Airport_Taxis_Pvt_Ltd_Sri_Lanka-Colombo_Western_Province.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 hover:border-amber-500/30 transition-all group w-full"
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
                            <span className="text-[10px] text-slate-400">18+ Reviews</span>
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
                            <div className="w-10 h-10 bg-white rounded-full shadow-sm border border-slate-200 flex items-center justify-center shrink-0 p-2">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
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
                            <span className="text-[10px] text-slate-400">296+ Reviews</span>
                        </div>
                    </a>

                </div>
            </div>
        </section>
    );
};

export default ReviewStatsBar;
