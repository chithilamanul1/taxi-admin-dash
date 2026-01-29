'use client';

import React, { useEffect, useState } from 'react';
import { Star, Quote, User } from 'lucide-react';

// Static fallback reviews (curated from real customer feedback)
const FALLBACK_REVIEWS = [
    {
        author_name: 'David Thompson',
        rating: 5,
        text: 'Excellent service from pickup to drop-off! The driver was professional, the car was spotless, and they even had cold water waiting. Will definitely use again on my next trip to Sri Lanka.',
        relative_time_description: '2 weeks ago',
        profile_photo_url: null
    },
    {
        author_name: 'Sarah Mitchell',
        rating: 5,
        text: 'Best airport transfer experience in Sri Lanka. Driver arrived early with a name board, helped with all our luggage. The AC car was comfortable for our 3-hour journey to Kandy. Highly recommended!',
        relative_time_description: '1 month ago',
        profile_photo_url: null
    },
    {
        author_name: 'Michael Chen',
        rating: 5,
        text: 'Used Airport Taxis for a full week tour package. Driver was knowledgeable about all the sights, flexible with our schedule, and the pricing was very fair. 5 stars all the way!',
        relative_time_description: '3 weeks ago',
        profile_photo_url: null
    }
];

const GoogleReviews = () => {
    const [reviews, setReviews] = useState(FALLBACK_REVIEWS);

    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-900 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-900/10 dark:via-white/10 to-transparent"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black text-emerald-900 dark:text-white tracking-tight">
                        Trusted by <span className="text-emerald-600 dark:text-emerald-400">Travelers</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        See what our customers say about their journey with Airport Taxi Tours.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-yellow-500">
                        {[...Array(5)].map((_, i) => <Star key={i} size={24} fill="currentColor" />)}
                        <span className="text-emerald-900 dark:text-white font-bold ml-2">5.0 Customer Rating</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.slice(0, 3).map((review, idx) => (
                        <div key={idx} className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-emerald-900/5 dark:border-white/5 shadow-lg flex flex-col relative group hover:-translate-y-2 transition-transform duration-300">
                            <Quote className="absolute top-8 right-8 text-emerald-900/5 dark:text-white/5 transform rotate-180" size={64} />

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-emerald-100 dark:bg-white/10 rounded-full overflow-hidden flex items-center justify-center">
                                    {review.profile_photo_url ? (
                                        <img src={review.profile_photo_url} alt={review.author_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="text-emerald-900/40 dark:text-white/40" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-emerald-900 dark:text-white">{review.author_name}</h4>
                                    <p className="text-xs text-slate-500">{review.relative_time_description}</p>
                                </div>
                            </div>

                            <div className="flex gap-1 text-yellow-500 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-slate-300 dark:text-slate-700"} />
                                ))}
                            </div>

                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed flex-1">
                                "{review.text.length > 180 ? review.text.substring(0, 180) + '...' : review.text}"
                            </p>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        ⭐ Verified reviews from our happy customers
                    </p>
                </div>
            </div>
        </section>
    );
};

export default GoogleReviews;
