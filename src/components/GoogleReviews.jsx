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
    },
    {
        author_name: 'Emily Chen',
        rating: 5,
        text: 'Very professional. Booking online was easy, and the communication via WhatsApp was great. Driver arrived on time and the car was spotless. Will definitely use again on our next trip!',
        relative_time_description: '3 days ago',
        profile_photo_url: null
    },
    {
        author_name: 'Michael Brown',
        rating: 5,
        text: 'Highly recommended! The driver was very polite and drove safely. The van was spacious for our family of 6.',
        relative_time_description: '2 days ago',
        profile_photo_url: null
    }
];

const GoogleReviews = () => {
    const [reviews, setReviews] = useState(FALLBACK_REVIEWS);
    const [rating, setRating] = useState(4.9);
    const [totalReviews, setTotalReviews] = useState(128);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const loadReviews = async () => {
            try {
                // Fetch Google Reviews
                const googleRes = await fetch('/api/reviews/google');
                const googleData = await googleRes.json();

                // Fetch Website Reviews (Revives)
                const websiteRes = await fetch('/api/reviews?homepage=true&limit=20');
                const websiteData = await websiteRes.json();

                let combinedReviews = [...FALLBACK_REVIEWS];

                if (googleData.success && googleData.data?.reviews?.length > 0) {
                    combinedReviews = [...googleData.data.reviews];
                    setRating(googleData.data.rating || 4.9);
                    setTotalReviews(googleData.data.totalReviews || 128);
                }

                if (websiteData.success && websiteData.reviews?.length > 0) {
                    // Map website reviews to match Google review structure if needed
                    const mappedWebsiteReviews = websiteData.reviews.map(r => ({
                        author_name: r.userName,
                        rating: r.rating,
                        text: r.comment,
                        relative_time_description: 'Verified Customer',
                        profile_photo_url: r.userImage || null
                    }));
                    combinedReviews = [...combinedReviews, ...mappedWebsiteReviews];
                }

                setReviews(combinedReviews);
            } catch (err) {
                console.error('Failed to fetch reviews:', err);
            }
        };

        loadReviews();
    }, []);

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
            {/* Background Elements */}
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

                {/* Rating Badge Mobile/Desktop */}
                <div className="mb-12 flex items-center gap-4">
                    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 flex items-center gap-4 inline-flex">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
                            <svg viewBox="0 0 24 24" className="w-6 h-6">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-bold text-lg">{rating.toFixed(1)}</span>
                                <div className="flex gap-0.5 text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill={i < Math.floor(rating) ? "currentColor" : "none"} className={i < rating ? "" : "opacity-30"} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-xs text-slate-400">{totalReviews}+ Verified Reviews</p>
                        </div>
                    </div>
                </div>

                {/* Slider */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    {reviews.map((review, idx) => (
                        <div
                            key={idx}
                            className="snap-center shrink-0 w-[300px] md:w-[400px] bg-white rounded-[2rem] p-8 shadow-xl relative group hover:translate-y-[-5px] transition-transform duration-300"
                        >
                            <Quote size={40} className="absolute top-6 right-6 text-emerald-100 group-hover:text-emerald-200 transition-colors" />

                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
                                    {review.profile_photo_url ? (
                                        <img src={review.profile_photo_url} alt={review.author_name} className="w-full h-full object-cover" />
                                    ) : (
                                        review.author_name.charAt(0)
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{review.author_name}</h4>
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
                    ))}
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
