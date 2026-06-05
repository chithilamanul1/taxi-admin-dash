'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const FALLBACK_REVIEWS = [
    {
        author_name: 'Sarah Jenkins',
        rating: 5,
        text: 'Excellent service from start to finish. The driver was waiting for us at the airport with a name board. The car was super clean and comfortable. The AC was perfect for the journey. Highly recommend!',
        relative_time_description: '2 weeks ago',
        profile_photo_url: null
    },
    {
        author_name: 'David Miller',
        rating: 5,
        text: 'We used Airport Taxis Tours for a 7-day trip around Sri Lanka. Our driver, Kamal, was fantastic. He knew all the best spots to visit and was very flexible when we wanted to make changes. The pricing was transparent.',
        relative_time_description: '1 month ago',
        profile_photo_url: null
    }
];

const GoogleReviews = () => {
    const [googleReviews, setGoogleReviews] = useState([]);
    const [tripReviews, setTripReviews] = useState([]);
    const [activeSource, setActiveSource] = useState('google'); // 'google' or 'tripadvisor'
    const [stats, setStats] = useState({
        google: { rating: 5.0, total: 300 },
        tripadvisor: { rating: 5.0, total: 100 }
    });
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const loadReviews = async () => {
            try {
                // Fetch both reviews in parallel
                const [googleRes, tripRes] = await Promise.allSettled([
                    fetch('/api/reviews/google'),
                    fetch('/api/reviews/tripadvisor')
                ]);

                // Process Google Reviews
                if (googleRes.status === 'fulfilled') {
                    const googleData = await googleRes.value.json();
                    if (googleData.success && googleData.data?.reviews?.length > 0) {
                        setGoogleReviews(googleData.data.reviews.map(r => ({ ...r, source: 'google' })));
                        setStats(prev => ({
                            ...prev,
                            google: {
                                rating: googleData.data.rating || 5.0,
                                total: googleData.data.totalReviews || 316
                            }
                        }));
                    } else {
                        setGoogleReviews(FALLBACK_REVIEWS.map(r => ({ ...r, source: 'google' })));
                    }
                }

                // Process TripAdvisor Reviews
                if (tripRes.status === 'fulfilled') {
                    const tripData = await tripRes.value.json();
                    if (tripData.success && tripData.data?.reviews?.length > 0) {
                        setTripReviews(tripData.data.reviews.map(r => ({ ...r, source: 'tripadvisor' })));
                        setStats(prev => ({
                            ...prev,
                            tripadvisor: {
                                rating: parseFloat(tripData.data.rating) || 5.0,
                                total: parseInt(tripData.data.num_reviews) || 100
                            }
                        }));
                    } else {
                        setTripReviews(FALLBACK_REVIEWS.map(r => ({ ...r, source: 'tripadvisor' })));
                    }
                } else {
                    // Handle Rejection
                    setTripReviews(FALLBACK_REVIEWS.map(r => ({ ...r, source: 'tripadvisor' })));
                }
            } catch (err) {
                console.error('Failed to fetch reviews:', err);
                setGoogleReviews(FALLBACK_REVIEWS.map(r => ({ ...r, source: 'google' })));
                setTripReviews(FALLBACK_REVIEWS.map(r => ({ ...r, source: 'tripadvisor' })));
            }
        };

        loadReviews();
    }, []);

    const reviews = activeSource === 'google' ? googleReviews : tripReviews;
    const currentStats = activeSource === 'google' ? stats.google : stats.tripadvisor;

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const [expandedReviews, setExpandedReviews] = useState({});

    const toggleReview = (idx) => {
        setExpandedReviews(prev => ({
            ...prev,
            [idx]: !prev[idx]
        }));
    };

    return (
        <section className="py-24 bg-white dark:bg-[#0a0a0a] overflow-hidden relative transition-colors duration-300">
            <div className="container mx-auto px-4 relative z-10 max-w-7xl">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-6 text-emerald-500">
                            {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" strokeWidth={0} />)}
                            <span className="ml-2 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-xs">Testimonials</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-emerald-950 dark:text-white leading-tight tracking-tight mb-6">
                            Client <span className="text-emerald-600 dark:text-emerald-400">Stories</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg leading-relaxed max-w-xl pr-4">
                            Don't just take our word for it. Read honest reviews from travelers who experienced Sri Lanka with us.
                        </p>
                    </div>
                </div>

                {/* Source Selection Tabs */}
                <div className="flex flex-wrap items-center gap-4 mb-12">
                    <button
                        onClick={() => setActiveSource('google')}
                        className={`group flex items-center gap-4 p-3 pr-6 border-2 transition-all rounded-2xl border-black ${activeSource === 'google'
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-400 shadow-sm'
                            : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800'
                            }`}
                    >
                        <div className="w-10 h-10 shrink-0 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center p-2 shadow-sm border border-slate-100 dark:border-white/5">
                            <svg viewBox="0 0 24 24" className="w-full h-full">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <div className="font-bold uppercase tracking-widest text-xs">Google Reviews</div>
                            <div className="text-[10px] font-bold opacity-70 mt-0.5">{stats.google.rating} / 5.0 • {stats.google.total}+ Reviews</div>
                        </div>
                    </button>

                    <button
                        onClick={() => setActiveSource('tripadvisor')}
                        className={`group flex items-center gap-4 p-3 pr-6 border-2 transition-all rounded-2xl border-black ${activeSource === 'tripadvisor'
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-400 shadow-sm'
                            : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800'
                            }`}
                    >
                        <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-white dark:bg-zinc-800 border border-slate-100 dark:border-white/5 p-2 text-[#00AA6C] rounded-xl shadow-sm">
                            <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm10 0c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
                                <circle cx="7" cy="12" r="1.5" />
                                <circle cx="17" cy="12" r="1.5" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <div className="font-bold uppercase tracking-widest text-xs">TripAdvisor</div>
                            <div className="text-[10px] font-bold opacity-70 mt-0.5">{stats.tripadvisor.rating} / 5.0 • {stats.tripadvisor.total}+ Reviews</div>
                        </div>
                    </button>
                </div>

                {/* Slider */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    {reviews.length > 0 ? reviews.map((review, idx) => {
                        const isExpanded = expandedReviews[idx];
                        return (
                            <div
                                key={idx}
                                className="snap-center shrink-0 w-[300px] md:w-[380px] bg-slate-50 dark:bg-zinc-900 border-2 border-black rounded-3xl p-8 hover:shadow-xl relative group hover:-translate-y-1 transition-all duration-300 flex flex-col"
                            >
                                <Quote size={40} strokeWidth={1} className="absolute top-6 right-6 text-slate-200 dark:text-white/5 group-hover:text-emerald-100 dark:group-hover:text-emerald-500/20 transition-colors" />

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-xl border border-emerald-200 dark:border-emerald-500/20 shadow-sm">
                                            {review.profile_photo_url ? (
                                                <Image
                                                    src={review.profile_photo_url}
                                                    alt={review.author_name}
                                                    width={48}
                                                    height={48}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                review.author_name?.charAt(0) || 'T'
                                            )}
                                        </div>
                                        {/* Source Badge */}
                                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-800 rounded-full border border-black w-6 h-6 flex items-center justify-center z-10 shadow-sm">
                                            {review.source === 'tripadvisor' ? (
                                                <div className="text-[#00AA6C]">
                                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm10 0c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
                                                    </svg>
                                                </div>
                                            ) : (
                                                <svg viewBox="0 0 24 24" className="w-3 h-3">
                                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-xs">{review.author_name}</h4>
                                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">{review.relative_time_description}</p>
                                    </div>
                                </div>

                                <div className="flex gap-1 mb-5 text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-slate-200 dark:text-white/10"} />
                                    ))}
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <p 
                                        onClick={() => toggleReview(idx)}
                                        className={`text-slate-600 dark:text-slate-300 text-sm font-medium leading-relaxed cursor-pointer transition-all ${isExpanded ? '' : 'line-clamp-4 hover:opacity-80'}`}
                                    >
                                        "{review.text}"
                                    </p>
                                    {!isExpanded && review.text.length > 120 && (
                                        <button 
                                            onClick={() => toggleReview(idx)}
                                            className="mt-3 self-start text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors"
                                        >
                                            Read More
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="w-full text-center py-24 font-bold text-slate-400 uppercase tracking-widest text-sm">
                            Loading {activeSource} reviews...
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-center md:justify-start">
                    <a
                        href="/reviews"
                        className="inline-flex items-center gap-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all shadow-sm hover:shadow-md group"
                    >
                        <span>Read All Reviews</span> 
                        <ChevronRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default GoogleReviews;
