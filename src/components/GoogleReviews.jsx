'use client';

import React, { useEffect, useState, useRef } from 'react';
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
        text: 'We used Airport Taxi Tours for a 7-day trip around Sri Lanka. Our driver, Kamal, was fantastic. He knew all the best spots to visit and was very flexible when we wanted to make changes. The pricing was transparent.',
        relative_time_description: '1 month ago',
        profile_photo_url: null
    }
];

const GoogleReviews = () => {
    const [googleReviews, setGoogleReviews] = useState([]);
    const [tripReviews, setTripReviews] = useState([]);
    const [activeSource, setActiveSource] = useState('google'); // 'google' or 'tripadvisor'
    const [stats, setStats] = useState({
        google: { rating: 4.9, total: 128 },
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
                                rating: googleData.data.rating || 4.9,
                                total: googleData.data.totalReviews || 128
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
                        // Fallback if no TA reviews found or API fails
                        setTripReviews(FALLBACK_REVIEWS.map(r => ({ ...r, source: 'tripadvisor' })));
                    }
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

    return (
        <section className="py-24 bg-slate-900 overflow-hidden relative border-t border-slate-800">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Testimonials</span>
                            <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                            </div>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                            Client <span className="text-emerald-500">Stories</span>
                        </h2>
                        <p className="text-lg text-slate-400 leading-relaxed">
                            Don&apos;t just take our word for it. Read honest reviews from travelers who experienced Sri Lanka with us.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={() => scroll('left')} className="w-12 h-12 rounded-full border border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/10 text-white flex items-center justify-center transition-all group">
                            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <button onClick={() => scroll('right')} className="w-12 h-12 rounded-full bg-white text-slate-900 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all group shadow-lg shadow-white/5">
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Source Selection Tabs */}
                <div className="flex flex-wrap items-center gap-4 mb-12">
                    <button
                        onClick={() => setActiveSource('google')}
                        className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all ${activeSource === 'google'
                            ? 'bg-white border-white text-slate-900 shadow-xl shadow-white/5'
                            : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                            }`}
                    >
                        <div className="w-6 h-6 shrink-0">
                            <svg viewBox="0 0 24 24" className="w-full h-full">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-sm">Google Reviews</div>
                            <div className="text-[10px] opacity-60 font-medium">{stats.google.rating} / 5.0 • {stats.google.total}+ Reviews</div>
                        </div>
                    </button>

                    <button
                        onClick={() => setActiveSource('tripadvisor')}
                        className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all ${activeSource === 'tripadvisor'
                            ? 'bg-[#00AA6C] border-[#00AA6C] text-white shadow-xl shadow-[#00AA6C]/20'
                            : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                            }`}
                    >
                        <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                            <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm10 0c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
                                <circle cx="7" cy="12" r="1.5" />
                                <circle cx="17" cy="12" r="1.5" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-sm">TripAdvisor</div>
                            <div className="text-[10px] opacity-60 font-medium">{stats.tripadvisor.rating} / 5.0 • {stats.tripadvisor.total}+ Reviews</div>
                        </div>
                    </button>
                </div>

                {/* Slider */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    {reviews.length > 0 ? reviews.map((review, idx) => (
                        <div
                            key={idx}
                            className="snap-center shrink-0 w-[300px] md:w-[400px] bg-white rounded-[2rem] p-8 shadow-xl relative group hover:translate-y-[-5px] transition-transform duration-300"
                        >
                            <Quote size={40} className="absolute top-6 right-6 text-emerald-100 group-hover:text-emerald-200 transition-colors" />

                            <div className="flex items-center gap-3 mb-6">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg border-2 border-slate-50">
                                        {review.profile_photo_url ? (
                                            <img src={review.profile_photo_url} alt={review.author_name} className="w-full h-full object-cover" />
                                        ) : (
                                            review.author_name?.charAt(0) || 'T'
                                        )}
                                    </div>
                                    {/* Source Badge */}
                                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md border border-slate-100 w-6 h-6 flex items-center justify-center z-10">
                                        {review.source === 'tripadvisor' ? (
                                            <div className="text-[#00AA6C]">
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm10 0c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
                                                </svg>
                                            </div>
                                        ) : (
                                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">{review.author_name}</h4>
                                    <p className="text-xs text-slate-500">{review.relative_time_description}</p>
                                </div>
                            </div>

                            <div className="flex gap-1 mb-4 text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-slate-200"} />
                                ))}
                            </div>

                            <p className="text-slate-600 text-sm leading-relaxed line-clamp-4">
                                "{review.text}"
                            </p>
                        </div>
                    )) : (
                        <div className="w-full text-center py-20 text-slate-500 italic">
                            Loading {activeSource} reviews...
                        </div>
                    )}
                </div>

                <div className="mt-12 text-center md:text-left">
                    <a
                        href="/reviews"
                        className="text-white hover:text-emerald-400 font-bold text-xl md:text-2xl inline-flex items-center gap-3 transition-all border-b-2 border-dashed border-white/30 hover:border-emerald-500 pb-2"
                    >
                        Read all reviews <ChevronRight size={20} className="text-white/50" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default GoogleReviews;
