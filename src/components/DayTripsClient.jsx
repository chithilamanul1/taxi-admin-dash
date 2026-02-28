'use client'

import React, { useState, useEffect } from 'react'
import { Clock, MapPin, Users, Tag, Star, ArrowRight, Filter, Search, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function DayTripsClient() {
    const [trips, setTrips] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const res = await fetch('/api/tours?category=day-trip')
                const data = await res.json()
                if (data.success) {
                    setTrips(data.data)
                }
            } catch (error) {
                console.error("Failed to fetch tours:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchTrips()
    }, [])

    const filteredTrips = trips.filter(trip => {
        const matchesFilter = filter === 'all' || trip.category === filter
        const matchesSearch = trip.title?.toLowerCase().includes(search.toLowerCase()) ||
            trip.description?.toLowerCase().includes(search.toLowerCase()) ||
            trip.destinations?.some(d => d?.toLowerCase().includes(search.toLowerCase()))
        return matchesFilter && matchesSearch
    })

    const types = ['all', 'day-trip']

    return (
        <main className="min-h-screen bg-white pt-32 pb-20 text-slate-900">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-900 text-xs font-black uppercase tracking-widest mb-6 shadow-sm">
                        <MapPin size={14} className="text-amber-500" />
                        Explore Sri Lanka
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4">
                        Day <span className="text-amber-500">Trips</span>
                    </h1>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        Discover the best of Sri Lanka in a single day. From ancient temples to pristine beaches - expertly curated experiences with pickup from your hotel.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto mb-16">
                    <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 shadow-sm">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 relative">
                                <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                                <input
                                    type="text"
                                    placeholder="Search destinations, activities..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-50 transition-all"
                                />
                            </div>
                            <div className="flex gap-3 flex-wrap items-center">
                                {types.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setFilter(type)}
                                        className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300
                                            ${filter === type
                                                ? 'bg-amber-500 text-white shadow-xl shadow-amber-200'
                                                : 'bg-white text-slate-400 border border-slate-200 hover:text-amber-600'}`}
                                    >
                                        {type === 'all' ? 'All Trips' : type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
                        {loading ? 'Searching...' : `${filteredTrips.length} experiences found`}
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="animate-spin text-amber-500" size={48} />
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
                        {filteredTrips.map((trip) => (
                            <div key={trip.slug || trip._id || trip.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 hover:shadow-amber-200/50 transition-all duration-500 hover:-translate-y-2 group flex flex-col h-full border border-slate-100">
                                {/* Image Section */}
                                <div className="relative h-72 overflow-hidden shrink-0">
                                    {trip.image || trip.heroImage || (trip.images && trip.images.length > 0) ? (
                                        <img
                                            src={trip.image || trip.heroImage || trip.images?.[0]}
                                            alt={trip.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-300">No Image</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                                    <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                                        {trip.tags?.slice(0, 2).map((tag, i) => (
                                            <span key={i} className="px-3 py-1 bg-white/95 backdrop-blur text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="absolute bottom-6 left-6">
                                        <span className="px-4 py-2 bg-amber-500/90 backdrop-blur text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg border border-white/20">
                                            {trip.category || 'Day Trip'}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-8 pb-10 flex flex-col flex-1">
                                    <h3 className="text-2xl font-black text-slate-900 mb-4 line-clamp-2 leading-[1.2]">
                                        {trip.title}
                                    </h3>

                                    <p className="text-slate-500 text-sm mb-8 line-clamp-3 leading-relaxed">
                                        {trip.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                            <Clock size={16} className="text-amber-500" />
                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                                {typeof trip.duration === 'object' ? `${trip.duration.days}D` : '1 Day'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                            <MapPin size={16} className="text-amber-500" />
                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest line-clamp-1">
                                                {trip.destinations?.length || 1} Loc.
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-8 border-t border-slate-50">
                                        <div>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-1">
                                                {trip.price?.type === 'per-person' ? 'Per Person' : 'Starting From'}
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xs font-black text-amber-500 uppercase">{trip.price?.currency || 'USD'}</span>
                                                <span className="text-3xl font-black text-slate-900 leading-none">
                                                    {trip.price?.amount?.toLocaleString() || '0'}
                                                </span>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/day-trips/${trip.slug}`}
                                            className="flex items-center justify-center w-14 h-14 bg-amber-500 text-white rounded-[1.25rem] hover:bg-amber-600 hover:scale-110 transition-all duration-300 shadow-xl shadow-amber-200"
                                        >
                                            <ArrowRight size={24} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filteredTrips.length === 0 && !loading && (
                    <div className="text-center py-32 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                        <p className="text-slate-400 font-black uppercase tracking-widest mb-6">No trips found matching your criteria</p>
                        <button
                            onClick={() => { setFilter('all'); setSearch(''); }}
                            className="px-10 py-4 bg-amber-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-amber-200 hover:bg-amber-600 transition-all"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                <div className="max-w-4xl mx-auto mt-24 text-center">
                    <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 relative overflow-hidden shadow-2xl shadow-slate-400/20">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                                Custom <span className="text-amber-500">Adventures</span>
                            </h2>
                            <p className="text-slate-400 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
                                Don't see what you're looking for? We specialize in creating custom day trips that fit your schedule and interests perfectly.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-3 px-10 py-5 bg-amber-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-amber-900/20 hover:bg-amber-600 hover:scale-105 transition-all duration-300"
                            >
                                Get a Quote <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
