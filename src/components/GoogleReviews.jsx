'use client';

import React, { useEffect, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { Star, Quote, User } from 'lucide-react';

const GoogleReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Replace with your actual Google Place ID
    const PLACE_ID = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || 'ChIJN1t_tDeuEmsRUsoyG83frY4'; // Default (Googleplex) as placeholder

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    });

    useEffect(() => {
        if (isLoaded && PLACE_ID) {
            const fetchReviews = () => {
                try {
                    // Create a dummy div for the service (PlacesService requires a DOM element)
                    const service = new window.google.maps.places.PlacesService(document.createElement('div'));

                    const request = {
                        placeId: PLACE_ID,
                        fields: ['reviews', 'rating', 'user_ratings_total']
                    };

                    service.getDetails(request, (place, status) => {
                        if (status === window.google.maps.places.PlacesServiceStatus.OK && place.reviews) {
                            setReviews(place.reviews);
                        } else {
                            console.error('Places Service Status:', status);
                            setError('Could not fetch reviews.');
                        }
                        setIsLoading(false);
                    });
                } catch (err) {
                    console.error('Error fetching reviews:', err);
                    setError(err.message);
                    setIsLoading(false);
                }
            };

            fetchReviews();
        }
    }, [isLoaded, PLACE_ID]);

    if (!isLoaded || isLoading) {
        return (
            <div className="py-20 text-center text-slate-400">
                <p>Loading Reviews...</p>
            </div>
        );
    }

    if (error || reviews.length === 0) {
        // Fallback or hide
        return null;
    }

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
                                "{review.text.length > 150 ? review.text.substring(0, 150) + '...' : review.text}"
                            </p>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <img src="https://developers.google.com/maps/documentation/images/powered_by_google_on_white.png" alt="Powered by Google" className="h-6 mx-auto opacity-70 mix-blend-multiply dark:mix-blend-screen" />
                </div>
            </div>
        </section>
    );
};

export default GoogleReviews;
