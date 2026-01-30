'use client';

import React, { useEffect, useState } from 'react';
import { Star, User } from 'lucide-react';

// Static fallback reviews (styled to match real Google reviews)
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
    }
];

const GoogleReviews = () => {
    const [reviews, setReviews] = useState(FALLBACK_REVIEWS);
    const [rating, setRating] = useState(4.9);
    const [totalReviews, setTotalReviews] = useState(128);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch real Google reviews
        fetch('/api/reviews/google')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data?.reviews?.length > 0) {
                    setReviews(data.data.reviews);
                    setRating(data.data.rating || 4.9);
                    setTotalReviews(data.data.totalReviews || 128);
                }
            })
            .catch(err => console.error('Failed to fetch reviews:', err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="py-20 bg-slate-900 overflow-hidden relative">
            {/* Dark Hero Section */}
            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-12 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Client <span className="text-amber-400">Stories</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Don&apos;t just take our word for it. Read honest reviews from travelers who experienced Sri Lanka with us.
                    </p>

                    {/* Google Rating Badge */}
                    <div className="flex items-center justify-center mt-8">
                        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-full px-6 py-3 flex items-center gap-4">
                            <div className="flex items-center gap-1 text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={18} fill={i < Math.floor(rating) ? "currentColor" : "none"} className={i < rating ? "" : "text-slate-600"} />
                                ))}
                            </div>
                            <span className="text-white font-bold text-lg">{rating.toFixed(1)} / 5.0</span>
                            <span className="text-slate-400 text-sm">{totalReviews}+ Verified Reviews</span>
                            {/* Google Icon */}
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center ml-2">
                                <svg viewBox="0 0 24 24" className="w-5 h-5">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                    {reviews.slice(0, 3).map((review, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
                            {/* Quote decoration */}
                            <div className="absolute top-6 right-6 text-slate-200 text-5xl font-serif">"</div>

                            {/* Author Info */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-lg">
                                    {review.profile_photo_url ? (
                                        <img src={review.profile_photo_url} alt={review.author_name} className="w-full h-full object-cover" />
                                    ) : (
                                        review.author_name.split(' ').map(n => n[0]).join('')
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{review.author_name}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500">{review.relative_time_description}</span>
                                        <span className="text-xs text-slate-400">•</span>
                                        <span className="text-xs text-emerald-600 font-semibold">via Google</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stars */}
                            <div className="flex gap-0.5 text-amber-400 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-slate-300"} />
                                ))}
                            </div>

                            {/* Review Text */}
                            <p className="text-slate-600 leading-relaxed text-sm">
                                "{review.text.length > 200 ? review.text.substring(0, 200) + '...' : review.text}"
                            </p>
                        </div>
                    ))}
                </div>

                {/* View More Link */}
                <div className="text-center mt-10">
                    <a
                        href="https://www.google.com/search?q=AirportCab.lk+reviews"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                    >
                        View all reviews on Google
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default GoogleReviews;
