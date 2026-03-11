'use client';

import React, { useEffect, useState } from 'react';

const ReviewStatsBar = () => {
    const [stats, setStats] = useState({ rating: '5.0', count: '400+' });
    const [googleStats, setGoogleStats] = useState({ rating: '5.0', count: '300+' });
    const [taStats, setTaStats] = useState({ rating: '5.0', count: '100+' });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [tripRes, googleRes] = await Promise.allSettled([
                    fetch('/api/reviews/tripadvisor'),
                    fetch('/api/reviews/google')
                ]);

                if (tripRes.status === 'fulfilled') {
                    const data = await tripRes.value.json();
                    if (data.success && data.data) {
                        setTaStats({
                            rating: parseFloat(data.data.rating).toFixed(1),
                            count: `${data.data.num_reviews}+ Reviews`
                        });
                    }
                }

                if (googleRes.status === 'fulfilled') {
                    const data = await googleRes.value.json();
                    if (data.success && data.data) {
                        setGoogleStats({
                            rating: parseFloat(data.data.rating).toFixed(1),
                            count: `${data.data.totalReviews}+ Reviews`
                        });
                    }
                }
            } catch (err) {
                console.error('Failed to load review stats', err);
            }
        };

        fetchStats();
    }, []);

    return (
        <section className="bg-white dark:bg-black py-20 transition-colors duration-500 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl mx-auto items-stretch justify-center">

                    {/* TripAdvisor Box */}
                    <a
                        href="https://www.tripadvisor.com/Attraction_Review-g293962-d33986804-Reviews-Airport_Taxis_Pvt_Ltd_Sri_Lanka-Colombo_Western_Province.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-between p-4 md:p-8 bg-slate-50 dark:bg-white/[0.03] border-l-8 border-[#00AA6C] hover:bg-white dark:hover:bg-white/[0.05] transition-all group shadow-sm hover:shadow-xl hover:-translate-y-1 rounded-r-3xl"
                    >
                        <div className="flex items-center gap-3 md:gap-6">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-white dark:bg-black flex items-center justify-center text-[#00AA6C] shrink-0 rounded-2xl border-2 border-[#00AA6C]/20 shadow-lg group-hover:scale-110 transition-transform p-2 md:p-3">
                                <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm10 0c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" /><circle cx="7" cy="12" r="1" /><circle cx="17" cy="12" r="1" /></svg>
                            </div>
                            <div>
                                <h3 className="font-black text-black dark:text-white uppercase italic tracking-tighter leading-none text-xl md:text-3xl mb-1 md:mb-2">TripAdvisor <span className="text-[#00AA6C] text-lg md:text-xl not-italic ml-1">5.0</span></h3>
                                <p className="text-[8px] md:text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] md:tracking-[0.4em] leading-tight break-words max-w-[120px] md:max-w-full">Excellent Rated • Guaranteed</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end shrink-0 ml-2">
                            <div className="flex text-[#00AA6C] mb-1 md:mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                ))}
                            </div>
                            <span className="text-[8px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{taStats.count || '18+ Reviews'}</span>
                        </div>
                    </a>

                    {/* Google Box */}
                    <a
                        href="https://g.page/r/YOUR_GOOGLE_REVIEW_LINK"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-between p-4 md:p-8 bg-slate-50 dark:bg-white/[0.03] border-l-8 border-[#4285F4] hover:bg-white dark:hover:bg-white/[0.05] transition-all group shadow-sm hover:shadow-xl hover:-translate-y-1 rounded-r-3xl"
                    >
                        <div className="flex items-center gap-3 md:gap-6">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-white dark:bg-black flex items-center justify-center shrink-0 p-2 md:p-3.5 rounded-2xl border-2 border-[#4285F4]/20 shadow-lg group-hover:scale-110 transition-transform">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-black text-black dark:text-white uppercase italic tracking-tighter leading-none text-xl md:text-3xl mb-1 md:mb-2">Google Reviews <span className="text-[#4285F4] text-lg md:text-xl not-italic ml-1">5.0</span></h3>
                                <p className="text-[8px] md:text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] md:tracking-[0.4em] leading-tight break-words max-w-[120px] md:max-w-full">Top Rated • 100% Verified</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end shrink-0 ml-2">
                            <div className="flex text-[#F4B400] mb-1 md:mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                ))}
                            </div>
                            <span className="text-[8px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{googleStats.count || '296+ Reviews'}</span>
                        </div>
                    </a>

                </div>
            </div>
        </section>
    );
};

export default ReviewStatsBar;
