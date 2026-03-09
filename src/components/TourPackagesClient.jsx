'use client'

import React, { useState, useEffect } from 'react'
import { tourPackages } from '@/data/tours-data'
import { Clock, MapPin, Check, ArrowRight, Calendar, Users, Plane, Hotel, Car, Utensils, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function TourPackagesClient() {
    const [activeCategory, setActiveCategory] = useState('All')
    const [tours, setTours] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const res = await fetch('/api/tours')
                const data = await res.json()
                if (data.success) {
                    setTours(data.data)
                }
            } catch (error) {
                console.error("Failed to fetch tours:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchTours()
    }, [])

    return (
        <main className="min-h-screen bg-white pt-32 pb-20 text-emerald-900">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-widest mb-6">
                        <Plane size={14} className="text-emerald-500" />
                        Multi-Day Adventures
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-emerald-900 mb-4">
                        Tour <span className="text-emerald-500">Packages</span>
                    </h1>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        Complete Sri Lanka tour packages with accommodation, transport, and guided experiences. Everything taken care of for an unforgettable journey.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto mb-16">
                    <div className="bg-emerald-50/50 rounded-3xl p-8 border border-emerald-100 shadow-sm">
                        <h3 className="text-emerald-900 font-black mb-6 text-center uppercase tracking-widest text-sm">All Tours Include:</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="flex flex-col items-center gap-3 text-center">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-emerald-100">
                                    <Hotel size={20} className="text-emerald-500" />
                                </div>
                                <span className="text-xs font-bold text-slate-600">Quality Hotels</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 text-center">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-emerald-100">
                                    <Car size={20} className="text-emerald-500" />
                                </div>
                                <span className="text-xs font-bold text-slate-600">Private AC Vehicle</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 text-center">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-emerald-100">
                                    <Utensils size={20} className="text-emerald-500" />
                                </div>
                                <span className="text-xs font-bold text-slate-600">Daily Breakfast</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 text-center">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-emerald-100">
                                    <Users size={20} className="text-emerald-500" />
                                </div>
                                <span className="text-xs font-bold text-slate-600">Expert Driver-Guide</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {['All', 'City Tours', 'Safaris', 'Multi-Day'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeCategory === cat
                                ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-200 scale-105'
                                : 'bg-slate-50 text-slate-400 hover:bg-white hover:text-emerald-600 border border-slate-100'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex justify-center py-24">
                            <Loader2 className="animate-spin text-emerald-500" size={48} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {Array.isArray(tours) && tours
                                .filter(tour => {
                                    if (tour.category === 'day-trip') return false;
                                    if (activeCategory === 'All') return true;
                                    if (activeCategory === 'City Tours' && tour.category === 'city-tour') return true;
                                    if (activeCategory === 'Safaris' && tour.category === 'safari') return true;
                                    if (activeCategory === 'Multi-Day' && tour.category === 'tour-package') return true;
                                    return false;
                                })
                                .map((tour, index) => (
                                    <div key={tour.slug || tour._id || index} className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 hover:shadow-emerald-200/50 transition-all duration-500 hover:-translate-y-2 group flex flex-col h-full border border-slate-100">
                                        {/* Image Section */}
                                        <div className="relative h-72 overflow-hidden shrink-0">
                                            {tour.image || tour.heroImage || (tour.images && tour.images.length > 0) ? (
                                                <img
                                                    src={tour.image || tour.heroImage || tour.images?.[0]}
                                                    alt={tour.title}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-300">No Image</div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                                            <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                                                {tour.tags?.slice(0, 2).map((tag, i) => (
                                                    <span key={i} className="px-3 py-1 bg-white/95 backdrop-blur text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                                                <div className="flex items-center gap-2 bg-white/95 backdrop-blur px-4 py-2 rounded-2xl shadow-lg text-emerald-900 border border-white/20">
                                                    <Calendar size={14} className="text-emerald-500" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                                        {typeof tour.duration === 'object' && tour.duration ? `${tour.duration.days || '?'}D / ${tour.duration.nights || '?'}N` : (tour.duration || 'N/A')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-8 pb-10 flex flex-col flex-1">
                                            <h3 className="text-2xl font-black text-emerald-900 mb-4 line-clamp-2 leading-[1.2]">
                                                {tour.title}
                                            </h3>

                                            <p className="text-slate-500 text-sm mb-8 line-clamp-3 leading-relaxed">
                                                {tour.description}
                                            </p>

                                            <div className="flex items-center gap-2 mb-8 flex-wrap">
                                                <MapPin size={16} className="text-emerald-500" />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest line-clamp-1">
                                                    {Array.isArray(tour.destinations) ? tour.destinations.join(' • ') : 'Multiple Locations'}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between mt-auto pt-8 border-t border-slate-50">
                                                <div>
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-1">Price per person</span>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-xs font-black text-emerald-500 uppercase">{typeof tour.price === 'object' ? (tour.price?.currency || '$') : (tour.currency || '$')}</span>
                                                        <span className="text-3xl font-black text-emerald-900 leading-none">
                                                            {(() => {
                                                                const amount = typeof tour.price === 'object' ? tour.price?.amount : tour.price;
                                                                return amount && amount > 0 ? (amount.toLocaleString()) : "Request";
                                                            })()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Link
                                                    href={`/tour-packages/${tour.slug}`}
                                                    className="flex items-center justify-center w-14 h-14 bg-emerald-500 text-white rounded-[1.25rem] hover:bg-emerald-600 hover:scale-110 transition-all duration-300 shadow-xl shadow-emerald-200"
                                                >
                                                    <ArrowRight size={24} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                <div className="max-w-4xl mx-auto mt-24 text-center">
                    <div className="bg-emerald-900 rounded-[3rem] p-10 md:p-16 relative overflow-hidden shadow-2xl shadow-slate-400/20">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                                Tailor-Made <span className="text-emerald-500">Journeys</span>
                            </h2>
                            <p className="text-slate-400 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
                                Every traveler is unique. Tell us your interests and we'll craft a personalized itinerary that matches your pace, budget, and style.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-3 px-10 py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-900/20 hover:bg-emerald-600 hover:scale-105 transition-all duration-300"
                            >
                                Start Designing <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto mt-24">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100 text-center">
                            <div className="text-3xl font-black text-emerald-500 mb-2">500+</div>
                            <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Happy Travelers</div>
                        </div>
                        <div className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100 text-center">
                            <div className="text-3xl font-black text-emerald-500 mb-2">5.0</div>
                            <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">User Rating</div>
                        </div>
                        <div className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100 text-center">
                            <div className="text-3xl font-black text-emerald-500 mb-2">24/7</div>
                            <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Local Support</div>
                        </div>
                        <div className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100 text-center">
                            <div className="text-3xl font-black text-emerald-500 mb-2">100%</div>
                            <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Flexible</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
