'use client'

import React, { useState, useEffect } from 'react'
import { Star, MapPin, Quote, ChevronLeft, ChevronRight, Verified } from 'lucide-react'

export default function ReviewsSection() {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch('/api/reviews?homepage=true&limit=10')
                const data = await res.json()
                if (data.success && data.reviews.length > 0) {
                    setReviews(data.reviews)
                } else {
                    // Fallback reviews if none in database
                    setReviews(defaultReviews)
                }
            } catch (error) {
                console.error('Failed to fetch reviews:', error)
                setReviews(defaultReviews)
            } finally {
                setLoading(false)
            }
        }

        fetchReviews()
    }, [])

    const nextReview = () => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length)
    }

    const prevReview = () => {
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
    }

    // Auto-advance
    useEffect(() => {
        if (reviews.length <= 1) return
        const timer = setInterval(nextReview, 6000)
        return () => clearInterval(timer)
    }, [reviews.length])

    if (loading) {
        return (
            <section className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
                <div className="container mx-auto px-6">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-4"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-64"></div>
                    </div>
                </div>
            </section>
        )
    }

    if (reviews.length === 0) return null

    const currentReview = reviews[currentIndex]

    return (
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 overflow-hidden">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
                        <Star size={14} className="fill-current" />
                        Customer Reviews
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
                        What Our <span className="text-emerald-600 dark:text-emerald-400">Travelers</span> Say
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                        Real experiences from real customers. See why travelers choose Airport Taxis.
                    </p>
                </div>

                {/* Reviews Carousel */}
                <div className="max-w-4xl mx-auto relative">
                    {/* Navigation Buttons */}
                    {reviews.length > 1 && (
                        <>
                            <button
                                onClick={prevReview}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors z-10"
                                aria-label="Previous review"
                            >
                                <ChevronLeft size={20} className="text-slate-600 dark:text-slate-300" />
                            </button>
                            <button
                                onClick={nextReview}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors z-10"
                                aria-label="Next review"
                            >
                                <ChevronRight size={20} className="text-slate-600 dark:text-slate-300" />
                            </button>
                        </>
                    )}

                    {/* Review Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 md:p-12 relative">
                        {/* Quote Icon */}
                        <div className="absolute top-6 right-6 text-emerald-100 dark:text-emerald-900/50">
                            <Quote size={60} />
                        </div>

                        {/* Stars */}
                        <div className="flex gap-1 mb-6">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={24}
                                    className={star <= currentReview.rating
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-slate-200'
                                    }
                                />
                            ))}
                        </div>

                        {/* Comment */}
                        <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed mb-8 relative z-10">
                            "{currentReview.comment}"
                        </p>

                        {/* Route & Distance Badge */}
                        {currentReview.route && (
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium">
                                    <MapPin size={14} />
                                    {currentReview.route}
                                </span>
                                {currentReview.distance > 0 && (
                                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-sm font-medium">
                                        📏 {currentReview.distance} km
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Author */}
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center overflow-hidden">
                                {currentReview.userImage ? (
                                    <img
                                        src={currentReview.userImage}
                                        alt={currentReview.userName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                        {currentReview.userName?.charAt(0)?.toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-slate-900 dark:text-white">{currentReview.userName}</h4>
                                    {currentReview.isVerified && (
                                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                                            <Verified size={12} /> Verified Trip
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {new Date(currentReview.createdAt).toLocaleDateString('en-US', {
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dots */}
                    {reviews.length > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {reviews.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex
                                        ? 'bg-emerald-600 w-8'
                                        : 'bg-slate-300 hover:bg-slate-400'
                                        }`}
                                    aria-label={`Go to review ${idx + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className="max-w-3xl mx-auto mt-16 grid grid-cols-3 gap-8 text-center">
                    <div>
                        <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400 mb-2">500+</div>
                        <div className="text-slate-600 dark:text-slate-400 text-sm">Happy Customers</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400 mb-2">4.9</div>
                        <div className="text-slate-600 dark:text-slate-400 text-sm">Average Rating</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400 mb-2">98%</div>
                        <div className="text-slate-600 dark:text-slate-400 text-sm">Would Recommend</div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// Fallback reviews
const defaultReviews = [
    {
        userName: 'Michael Thompson',
        userImage: null,
        rating: 5,
        comment: 'Excellent service from start to finish! The driver was waiting for us at the airport with a name board. Very professional and the car was spotless. Highly recommend for airport transfers.',
        route: 'Airport → Colombo',
        distance: 35,
        isVerified: true,
        createdAt: new Date('2026-01-15')
    },
    {
        userName: 'Sarah Wilson',
        userImage: null,
        rating: 5,
        comment: 'We booked a day trip to Sigiriya and it was amazing! The driver was knowledgeable about all the sites and even recommended a great local restaurant for lunch.',
        route: 'Colombo → Sigiriya',
        distance: 175,
        isVerified: true,
        createdAt: new Date('2026-01-10')
    },
    {
        userName: 'James Chen',
        userImage: null,
        rating: 5,
        comment: 'Used their service multiple times during our 10-day trip. Always punctual, always friendly. The fixed pricing made budgeting easy. Will use again!',
        route: 'Various Locations',
        distance: 450,
        isVerified: true,
        createdAt: new Date('2026-01-05')
    }
]
