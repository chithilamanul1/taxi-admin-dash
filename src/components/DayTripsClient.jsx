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
        const matchesSearch = trip.title.toLowerCase().includes(search.toLowerCase()) ||
            trip.description.toLowerCase().includes(search.toLowerCase()) ||
            trip.destinations?.some(d => d.toLowerCase().includes(search.toLowerCase()))
        return matchesFilter && matchesSearch
    })

    const types = ['all', 'day-trip']

    return (
        <main className="min-h-screen bg-gradient-to-b from-emerald-900 to-slate-950 pt-32 pb-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-6">
                        <MapPin size={14} />
                        Explore Sri Lanka
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                        Day <span className="text-emerald-400">Trips</span>
                    </h1>
                    <p className="text-white/70 max-w-2xl mx-auto text-lg">
                        Discover the best of Sri Lanka in a single day. From ancient temples to pristine beaches - expertly curated experiences with pickup from your hotel.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto mb-12">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                <input
                                    type="text"
                                    placeholder="Search destinations, activities..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-400"
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {types.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setFilter(type)}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all
                                            ${filter === type
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                                    >
                                        {type === 'all' ? 'All Trips' : type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto mb-6">
                    <p className="text-white/60 text-sm">{loading ? 'Loading...' : `${filteredTrips.length} experiences found`}</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-emerald-500" size={48} />
                    </div>
                ) : (
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {filteredTrips.map((trip) => (
                            <div key={trip.slug || trip._id || trip.id} className="bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-[#00A99D]/20 transition-all hover:-translate-y-2 group flex flex-col h-full border border-slate-100">
                                {/* Image Section */}
                                <div className="relative h-64 overflow-hidden bg-slate-900 shrink-0">
                                    {trip.image || trip.heroImage || (trip.images && trip.images.length > 0) ? (
                                        <img
                                            src={trip.image || trip.heroImage || trip.images?.[0]}
                                            alt={trip.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-500">No Image</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-transparent pointer-events-none" />

                                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                        {trip.tags?.slice(0, 2).map((tag, i) => (
                                            <span key={i} className="px-3 py-1 bg-white/90 backdrop-blur text-[#006064] text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                        <span className="px-3 py-1.5 bg-[#00A99D]/90 backdrop-blur text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                                            {trip.type}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-2xl font-black text-[#006064] mb-3 line-clamp-2 leading-tight">
                                        {trip.title}
                                    </h3>

                                    <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                                        {trip.description}
                                    </p>

                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
                                        <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg text-[#00A99D]">
                                            <Clock size={16} />
                                            <span>{trip.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg text-[#00A99D]">
                                            <MapPin size={16} />
                                            <span>{trip.pickupLocations?.length || 1} Pickups</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                                        <div>
                                            {trip.originalPrice && (
                                                <span className="text-sm text-slate-400 line-through mr-2 font-medium">
                                                    ${trip.originalPrice}
                                                </span>
                                            )}
                                            <span className="text-sm text-slate-400 font-bold uppercase tracking-widest block mb-1">From</span>
                                            <span className="text-3xl font-black text-[#006064]">
                                                {typeof trip.price === 'object' ? (trip.price?.currency || '$') : (trip.currency || '$')} {typeof trip.price === 'object' ? (trip.price?.amount?.toLocaleString() || '0') : (trip.price?.toLocaleString() || '0')}
                                            </span>
                                        </div>
                                        <Link
                                            href={`/day-trips/${trip.slug}`}
                                            className="flex items-center justify-center w-14 h-14 bg-[#006064] text-white rounded-2xl group-hover:bg-[#004D40] hover:scale-110 transition-all shadow-xl shadow-cyan-900/20"
                                        >
                                            <ArrowRight size={20} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filteredTrips.length === 0 && !loading && (
                    <div className="text-center py-20">
                        <p className="text-white/60 text-lg">No trips found matching your criteria.</p>
                        <button
                            onClick={() => { setFilter('all'); setSearch(''); }}
                            className="mt-4 px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                <div className="max-w-4xl mx-auto mt-16 text-center">
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-3xl p-8 md:p-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            Looking for Something Custom?
                        </h2>
                        <p className="text-white/80 mb-6">
                            We can create personalized day trips tailored to your interests and schedule.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-900 rounded-2xl font-bold shadow-lg hover:bg-emerald-50 transition-all"
                        >
                            Contact Us <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
