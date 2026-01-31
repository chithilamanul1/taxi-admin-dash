'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';

const TripAdvisorWidget = () => {
    const [stats, setStats] = useState({ rating: '5.0', count: 'See all reviews' });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/tripadvisor');
                const data = await res.json();
                if (data.success && data.rating) {
                    setStats({
                        rating: data.rating,
                        count: `${data.num_reviews} Reviews`
                    });
                }
            } catch (err) {
                console.error('Failed to load TripAdvisor stats', err);
            }
        };
        fetchStats();
    }, []);
    return (
        <div className="bg-white dark:bg-slate-900 py-12 border-t border-emerald-900/5 dark:border-white/5">
            <div className="container mx-auto px-6 text-center">
                <h3 className="text-2xl font-bold text-emerald-900 dark:text-white mb-8">
                    Review us on <span className="text-emerald-600">TripAdvisor</span>
                </h3>

                <div className="flex justify-center">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-900/10 inline-block pointer-events-auto">
                        {/* Dynamic Custom Widget */}
                        <a
                            href="https://www.tripadvisor.com/Attraction_Review-g297896-d33986804-Reviews-Airport_Taxi_Tours_Sri_Lanka-Galle_Galle_District_Southern_Province.html"
                            target="_blank"
                            className="flex flex-col items-center gap-3 hover:opacity-80 transition-opacity"
                        >
                            <img src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg" alt="TripAdvisor" className="h-8 mx-auto" />
                            <div className="flex items-center gap-2">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="w-4 h-4 rounded-full bg-[#00AA6C]"></div>
                                    ))}
                                </div>
                                <span className="font-bold text-slate-900">{stats.rating}</span>
                            </div>
                            <span className="text-xs text-slate-500 font-bold uppercase">{stats.count}</span>
                        </a>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default TripAdvisorWidget;
