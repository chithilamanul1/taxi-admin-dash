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
        google: { rating: 5.0, total: 296 },
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
                                total: googleData.data.totalReviews || 296
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
        <section className="py-24 bg-white dark:bg-[#0a0a0a] overflow-hidden relative border-t-4 border-black transition-colors duration-300">
            <div className="container mx-auto px-4 relative z-10 max-w-7xl">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-6 text-[#FACC15]">
                            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" strokeWidth={0} />)}
                            <span className="ml-2 font-black text-black dark:text-white uppercase tracking-[0.2em] text-xs">Testimonials</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-black dark:text-white uppercase tracking-tighter leading-none mb-6">
                            CLIENT <span className="text-[#FACC15]">STORIES</span>
                        </h2>
                        <p className="text-black/50 dark:text-white/50 font-black uppercase tracking-[0.1em] text-sm md:text-base pr-4">
                            Don't just take our word for it. Read honest reviews from travelers who experienced Sri Lanka with us.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={() => scroll('left')} className="w-14 h-14 bg-white dark:bg-black border-2 border-black dark:border-white/20 hover:border-[#FACC15] dark:hover:border-[#FACC15] text-black dark:text-white hover:text-[#FACC15] flex items-center justify-center transition-all group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(250,204,21,0.2)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none">
                            <ChevronLeft size={24} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <button onClick={() => scroll('right')} className="w-14 h-14 bg-[#FACC15] text-black border-2 border-black flex items-center justify-center transition-all group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(250,204,21,0.5)] hover:bg-black hover:text-[#FACC15] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none">
                            <ChevronRight size={24} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Source Selection Tabs */}
                <div className="flex flex-wrap items-center gap-6 mb-16">
                    <button
                        onClick={() => setActiveSource('google')}
                        className={`group flex items-center gap-4 p-4 pr-8 border-4 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none ${activeSource === 'google'
                            ? 'bg-[#FACC15] border-black text-black'
                            : 'bg-white dark:bg-black border-black dark:border-white/20 text-black dark:text-white hover:border-[#FACC15] dark:hover:border-[#FACC15] hover:-translate-y-1'
                            }`}
                    >
                        <div className="w-10 h-10 shrink-0 bg-white border-2 border-black flex items-center justify-center p-2 rounded-none">
                            <svg viewBox="0 0 24 24" className="w-full h-full">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <div className="font-black uppercase tracking-widest text-sm">Google Reviews</div>
                            <div className="text-xs font-bold opacity-70 mt-1">{stats.google.rating} / 5.0 • {stats.google.total}+ Reviews</div>
                        </div>
                    </button>

                    <button
                        onClick={() => setActiveSource('tripadvisor')}
                        className={`group flex items-center gap-4 p-4 pr-8 border-4 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none ${activeSource === 'tripadvisor'
                            ? 'bg-[#00AA6C] border-black text-white'
                            : 'bg-white dark:bg-black border-black dark:border-white/20 text-black dark:text-white hover:border-[#00AA6C] dark:hover:border-[#00AA6C] hover:-translate-y-1'
                            }`}
                    >
                        <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-white border-2 border-black p-2 text-[#00AA6C] rounded-none">
                            <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm10 0c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
                                <circle cx="7" cy="12" r="1.5" />
                                <circle cx="17" cy="12" r="1.5" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <div className="font-black uppercase tracking-widest text-sm">TripAdvisor</div>
                            <div className="text-xs font-bold opacity-70 mt-1">{stats.tripadvisor.rating} / 5.0 • {stats.tripadvisor.total}+ Reviews</div>
                        </div>
                    </button>
                </div>

                {/* Slider */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-12 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    {reviews.length > 0 ? reviews.map((review, idx) => {
                        const isExpanded = expandedReviews[idx];
                        return (
                            <div
                                key={idx}
                                className="snap-center shrink-0 w-[300px] md:w-[400px] bg-white dark:bg-[#111] border-4 border-black dark:border-white/20 rounded-none p-8 hover:border-[#FACC15] dark:hover:border-[#FACC15] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(250,204,21,0.2)] relative group hover:translate-y-[-4px] transition-all duration-300 flex flex-col"
                            >
                                <Quote size={48} strokeWidth={1} className="absolute top-6 right-6 text-black/5 dark:text-white/5 group-hover:text-[#FACC15]/20 transition-colors" />

                                <div className="flex items-center gap-4 mb-8">
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-none overflow-hidden bg-[#FACC15] flex items-center justify-center text-black font-black text-2xl border-2 border-black">
                                            {review.profile_photo_url ? (
                                                <Image
                                                    src={review.profile_photo_url}
                                                    alt={review.author_name}
                                                    width={56}
                                                    height={56}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                review.author_name?.charAt(0) || 'T'
                                            )}
                                        </div>
                                        {/* Source Badge */}
                                        <div className="absolute -bottom-2 -right-2 bg-white rounded-none border-2 border-black w-8 h-8 flex items-center justify-center z-10">
                                            {review.source === 'tripadvisor' ? (
                                                <div className="text-[#00AA6C]">
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm10 0c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
                                                    </svg>
                                                </div>
                                            ) : (
                                                <svg viewBox="0 0 24 24" className="w-4 h-4">
                                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-black dark:text-white uppercase tracking-widest text-sm">{review.author_name}</h4>
                                        <p className="text-xs font-bold text-black/40 dark:text-white/40 uppercase tracking-widest mt-1">{review.relative_time_description}</p>
                                    </div>
                                </div>

                                <div className="flex gap-1 mb-6 text-[#FACC15]">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={18} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-black/10 dark:text-white/10"} />
                                    ))}
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <p 
                                        onClick={() => toggleReview(idx)}
                                        className={`text-black/80 dark:text-white/80 text-[15px] font-medium leading-relaxed cursor-pointer transition-all ${isExpanded ? '' : 'line-clamp-4 hover:opacity-70'}`}
                                    >
                                        "{review.text}"
                                    </p>
                                    {!isExpanded && review.text.length > 120 && (
                                        <button 
                                            onClick={() => toggleReview(idx)}
                                            className="mt-4 self-start text-xs font-black uppercase tracking-widest text-black/40 dark:text-white/40 hover:text-[#FACC15] dark:hover:text-[#FACC15] transition-colors"
                                        >
                                            Read More
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="w-full text-center py-24 font-black text-black/20 dark:text-white/20 uppercase tracking-[0.2em]">
                            Loading {activeSource} reviews...
                        </div>
                    )}
                </div>

                <div className="mt-8">
                    <a
                        href="/reviews"
                        className="inline-flex items-center gap-4 text-black dark:text-white hover:text-[#FACC15] dark:hover:text-[#FACC15] font-black text-xl md:text-3xl uppercase tracking-tighter transition-all group"
                    >
                        <span className="border-b-4 border-transparent group-hover:border-[#FACC15] pb-1 transition-all">READ ALL REVIEWS</span> 
                        <span className="w-10 h-10 bg-black text-[#FACC15] border-2 border-black flex items-center justify-center group-hover:bg-[#FACC15] group-hover:text-black transition-all">
                            <ChevronRight size={24} strokeWidth={3} />
                        </span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default GoogleReviews;
