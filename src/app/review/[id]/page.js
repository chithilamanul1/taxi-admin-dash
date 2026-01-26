'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Star, MapPin, Navigation, Send, CheckCircle, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function ReviewPage() {
    const params = useParams()
    const router = useRouter()
    const { data: session } = useSession()
    const bookingId = params.id

    const [booking, setBooking] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')

    const [rating, setRating] = useState(5)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    // Fetch booking details
    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await fetch(`/api/bookings/${bookingId}`)
                const data = await res.json()
                if (data.success) {
                    setBooking(data.booking)
                    // Pre-fill user info if logged in
                    if (session?.user) {
                        setName(session.user.name || '')
                        setEmail(session.user.email || '')
                    }
                } else {
                    setError('Booking not found')
                }
            } catch (err) {
                setError('Failed to load booking details')
            } finally {
                setLoading(false)
            }
        }

        if (bookingId) {
            fetchBooking()
        } else {
            setLoading(false)
        }
    }, [bookingId, session])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!name || !comment || rating < 1) {
            setError('Please fill in all required fields')
            return
        }

        setSubmitting(true)
        setError('')

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId: booking?._id || null,
                    userName: name,
                    userEmail: email,
                    userImage: session?.user?.image || null,
                    rating,
                    comment,
                    route: booking ? `${booking.pickupLocation?.address?.split(',')[0]} → ${booking.dropoffLocation?.address?.split(',')[0]}` : null,
                    distance: booking?.distance || null
                })
            })

            const data = await res.json()

            if (data.success) {
                setSubmitted(true)
            } else {
                setError(data.error || 'Failed to submit review')
            }
        } catch (err) {
            setError('Failed to submit review. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-emerald-900 to-slate-950 pt-32 pb-20 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
            </main>
        )
    }

    if (submitted) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-emerald-900 to-slate-950 pt-32 pb-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-md mx-auto text-center">
                        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-4">Thank You! ⭐</h1>
                        <p className="text-white/70 mb-8">
                            Your review has been submitted and will be visible after admin approval.
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-8 py-4 bg-white text-emerald-900 rounded-2xl font-bold"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-emerald-900 to-slate-950 pt-32 pb-20">
            <div className="container mx-auto px-6">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-white mb-4">
                            Rate Your <span className="text-emerald-400">Experience</span>
                        </h1>
                        <p className="text-white/70">
                            Your feedback helps us improve and helps other travelers make informed decisions.
                        </p>
                    </div>

                    {/* Booking Info (if available) */}
                    {booking && (
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
                            <h3 className="text-white font-bold mb-4">Your Trip</h3>
                            <div className="flex items-center gap-3 mb-3">
                                <MapPin size={18} className="text-emerald-400" />
                                <span className="text-white/80">{booking.pickupLocation?.address?.split(',')[0]}</span>
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                                <Navigation size={18} className="text-emerald-400" />
                                <span className="text-white/80">{booking.dropoffLocation?.address?.split(',')[0]}</span>
                            </div>
                            <div className="flex items-center gap-4 text-white/60 text-sm">
                                <span>📏 {booking.distance || 0} km</span>
                                <span>🚗 {booking.vehicleType || 'Standard'}</span>
                            </div>
                        </div>
                    )}

                    {/* Review Form */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Star Rating */}
                            <div>
                                <label className="block text-sm font-bold text-emerald-900 mb-3">
                                    How would you rate your experience?
                                </label>
                                <div className="flex gap-2 justify-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="p-2 transition-transform hover:scale-110"
                                        >
                                            <Star
                                                size={40}
                                                className={`transition-colors ${star <= (hoverRating || rating)
                                                        ? 'fill-amber-400 text-amber-400'
                                                        : 'text-slate-300'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-center text-sm text-slate-500 mt-2">
                                    {rating === 5 && '⭐ Excellent!'}
                                    {rating === 4 && '👍 Very Good!'}
                                    {rating === 3 && '😊 Good'}
                                    {rating === 2 && '😐 Fair'}
                                    {rating === 1 && '😕 Poor'}
                                </p>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-bold text-emerald-900 mb-2">
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-bold text-emerald-900 mb-2">
                                    Your Email (optional)
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                                />
                                <p className="text-xs text-slate-500 mt-1">We'll send you a thank you note!</p>
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="block text-sm font-bold text-emerald-900 mb-2">
                                    Tell us about your experience *
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="The driver was punctual и friendly. The car was clean and comfortable. Would definitely recommend!"
                                    rows={4}
                                    maxLength={500}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 resize-none"
                                    required
                                />
                                <p className="text-xs text-slate-500 mt-1 text-right">{comment.length}/500</p>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-900 text-white rounded-2xl font-bold hover:bg-emerald-800 transition-colors disabled:opacity-50"
                            >
                                {submitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Submit Review
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}
