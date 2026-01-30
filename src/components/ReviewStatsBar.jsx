'use client';

import React from 'react';

const ReviewStatsBar = () => {
    return (
        <section className="bg-white dark:bg-slate-900 border-b border-emerald-900/5 dark:border-white/5 py-8">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">

                    {/* TripAdvisor */}
                    <a
                        href="https://www.tripadvisor.com/Attraction_Review-g1500185-d33021905-Reviews-Airport_Cab_LK-Katunayake_Negombo_Western_Province.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 group hover:opacity-80 transition-opacity"
                    >
                        <div className="w-12 h-12 relative flex-shrink-0">
                            <img
                                src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg"
                                alt="TripAdvisor"
                                className="w-full h-full object-contain hidden" // Using SVG below for better control or keeping this as backup
                            />
                            {/* Custom Owl Icon Circle Match */}
                            <div className="w-12 h-12 bg-[#00AA6C] rounded-full flex items-center justify-center text-white">
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm10 0c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
                                    <circle cx="7" cy="12" r="1" />
                                    <circle cx="17" cy="12" r="1" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Posted on</span>
                            <span className="font-bold text-slate-900 dark:text-white leading-none text-lg">TripAdvisor</span>
                        </div>
                        <div className="flex flex-col items-start pl-4 border-l border-slate-200 dark:border-slate-700">
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-slate-900 dark:text-white">4.7</span>
                                <span className="text-sm text-slate-400 font-bold">/5</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Recommended</span>
                        </div>
                    </a>

                    {/* Google */}
                    <a
                        href="https://g.page/r/YOUR_GOOGLE_REVIEW_LINK"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 group hover:opacity-80 transition-opacity"
                    >
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0 font-bold text-xl">
                            <span className="text-[#4285F4]">G</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Posted on</span>
                            <span className="font-bold text-slate-900 dark:text-white leading-none text-lg">Google</span>
                        </div>
                        <div className="flex flex-col items-start pl-4 border-l border-slate-200 dark:border-slate-700">
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-slate-900 dark:text-white">5.0</span>
                                <span className="text-sm text-slate-400 font-bold">/5</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">300+ Reviews</span>
                        </div>
                    </a>

                </div>
            </div>
        </section>
    );
};

export default ReviewStatsBar;
