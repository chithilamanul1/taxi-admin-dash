'use client'

import React, { useState, useEffect } from 'react'
import { Star, CheckCircle, XCircle, Trash2, Eye, EyeOff, RefreshCw, Plus, MapPin, Route, User } from 'lucide-react'

export default function ReviewsManagement() {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // all, pending, approved
    const [showAddModal, setShowAddModal] = useState(false)
    const [newReview, setNewReview] = useState({
        userName: '',
        userEmail: '',
        rating: 5,
        comment: '',
        route: '',
        distance: ''
    })

    const fetchReviews = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/reviews?all=true')
            const data = await res.json()
            if (data.success) {
                setReviews(data.reviews)
            }
        } catch (error) {
            console.error('Failed to fetch reviews:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [])

    const handleApprove = async (reviewId, approve) => {
        try {
            const res = await fetch('/api/reviews', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reviewId, isApproved: approve })
            })
            if (res.ok) {
                fetchReviews()
            }
        } catch (error) {
            console.error('Failed to update review:', error)
        }
    }

    const handleToggleHomepage = async (reviewId, show) => {
        try {
            const res = await fetch('/api/reviews', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reviewId, showOnHomepage: show })
            })
            if (res.ok) {
                fetchReviews()
            }
        } catch (error) {
            console.error('Failed to update review:', error)
        }
    }

    const handleDelete = async (reviewId) => {
        if (!confirm('Are you sure you want to delete this review?')) return

        try {
            const res = await fetch(`/api/reviews?id=${reviewId}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                fetchReviews()
            }
        } catch (error) {
            console.error('Failed to delete review:', error)
        }
    }

    const handleSeedReviews = async () => {
        try {
            const res = await fetch('/api/seed/reviews', { method: 'POST' })
            const data = await res.json()
            alert(data.message || 'Reviews seeded!')
            fetchReviews()
        } catch (error) {
            console.error('Failed to seed reviews:', error)
        }
    }

    const handleAddReview = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newReview,
                    distance: parseFloat(newReview.distance) || 0,
                    isVerified: true,
                    source: 'manual'
                })
            })
            if (res.ok) {
                setShowAddModal(false)
                setNewReview({ userName: '', userEmail: '', rating: 5, comment: '', route: '', distance: '' })
                fetchReviews()
            }
        } catch (error) {
            console.error('Failed to add review:', error)
        }
    }

    const filteredReviews = reviews.filter(r => {
        if (filter === 'pending') return !r.isApproved
        if (filter === 'approved') return r.isApproved
        return true
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Reviews Management</h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        {reviews.length} total • {reviews.filter(r => r.isApproved).length} approved
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSeedReviews}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        <RefreshCw size={16} />
                        Seed Sample Reviews
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                    >
                        <Plus size={16} />
                        Add Review
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {['all', 'pending', 'approved'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${filter === f
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                    >
                        {f} ({f === 'all' ? reviews.length : reviews.filter(r => f === 'pending' ? !r.isApproved : r.isApproved).length})
                    </button>
                ))}
            </div>

            {/* Reviews List */}
            {loading ? (
                <div className="text-center py-12 text-slate-500">Loading reviews...</div>
            ) : filteredReviews.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                    No reviews found. Click "Seed Sample Reviews" to add some!
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredReviews.map((review) => (
                        <div key={review._id} className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border ${review.isApproved ? 'border-emerald-200 dark:border-emerald-900' : 'border-amber-200 dark:border-amber-900'
                            }`}>
                            <div className="flex flex-wrap gap-4 justify-between">
                                {/* Review Content */}
                                <div className="flex-1 min-w-[300px]">
                                    {/* Stars */}
                                    <div className="flex gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={16}
                                                className={star <= review.rating
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-slate-300'
                                                }
                                            />
                                        ))}
                                    </div>

                                    {/* Comment */}
                                    <p className="text-slate-700 dark:text-slate-300 mb-3 line-clamp-3">
                                        "{review.comment}"
                                    </p>

                                    {/* Route & Distance */}
                                    <div className="flex flex-wrap gap-3 mb-3">
                                        {review.route && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-medium">
                                                <MapPin size={12} />
                                                {review.route}
                                            </span>
                                        )}
                                        {review.distance > 0 && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full text-xs font-medium">
                                                <Route size={12} />
                                                {review.distance} km
                                            </span>
                                        )}
                                    </div>

                                    {/* Author */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-bold text-emerald-600">
                                                {review.userName?.charAt(0)?.toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{review.userName}</p>
                                            <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        {review.isVerified && (
                                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2">
                                    {/* Approve/Reject */}
                                    {!review.isApproved ? (
                                        <button
                                            onClick={() => handleApprove(review._id, true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700"
                                        >
                                            <CheckCircle size={16} />
                                            Approve
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleApprove(review._id, false)}
                                            className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-sm font-medium hover:bg-amber-200"
                                        >
                                            <XCircle size={16} />
                                            Unapprove
                                        </button>
                                    )}

                                    {/* Show on Homepage */}
                                    <button
                                        onClick={() => handleToggleHomepage(review._id, !review.showOnHomepage)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${review.showOnHomepage
                                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        {review.showOnHomepage ? <Eye size={16} /> : <EyeOff size={16} />}
                                        {review.showOnHomepage ? 'On Homepage' : 'Hidden'}
                                    </button>

                                    {/* Delete */}
                                    <button
                                        onClick={() => handleDelete(review._id)}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Review Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Add New Review</h3>
                        <form onSubmit={handleAddReview} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Customer Name *</label>
                                <input
                                    type="text"
                                    value={newReview.userName}
                                    onChange={(e) => setNewReview(prev => ({ ...prev, userName: e.target.value }))}
                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={newReview.userEmail}
                                    onChange={(e) => setNewReview(prev => ({ ...prev, userEmail: e.target.value }))}
                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Rating *</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                            className="p-1"
                                        >
                                            <Star
                                                size={32}
                                                className={star <= newReview.rating
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-slate-300'
                                                }
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Route *</label>
                                <input
                                    type="text"
                                    value={newReview.route}
                                    onChange={(e) => setNewReview(prev => ({ ...prev, route: e.target.value }))}
                                    placeholder="e.g., Colombo → Sigiriya"
                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Distance (km)</label>
                                <input
                                    type="number"
                                    value={newReview.distance}
                                    onChange={(e) => setNewReview(prev => ({ ...prev, distance: e.target.value }))}
                                    placeholder="e.g., 175"
                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Review Comment *</label>
                                <textarea
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700"
                                >
                                    Add Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
