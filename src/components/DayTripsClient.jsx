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
        <main className="min-h-screen bg-white dark:bg-black pt-32 pb-20 text-black dark:text-white transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-[#FACC15] text-black text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                        <MapPin size={14} />
                        SRI LANKA COLLECTION
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-black dark:text-white mb-6 uppercase tracking-tighter leading-none">
                        DAY <span className="text-[#FACC15]">TRIPS</span>
                    </h1>
                    <p className="text-black/60 dark:text-white/60 max-w-2xl mx-auto text-sm font-medium uppercase tracking-widest leading-relaxed">
                        Discover the best of Sri Lanka in a single day. Premier curated
                        experiences with private pickup from your doorstep.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto mb-20">
                    <div className="bg-black/5 dark:bg-white/5 border-2 border-[#FACC15]/20 p-8">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 relative">
                                <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#FACC15]" />
                                <input
                                    type="text"
                                    placeholder="SEARCH DESTINATIONS..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-16 pr-6 py-5 bg-white dark:bg-black border-2 border-black/10 dark:border-white/10 text-black dark:text-white placeholder:text-black/20 dark:placeholder:text-white/20 focus:outline-none focus:border-[#FACC15] transition-all font-black uppercase tracking-widest text-xs"
                                />
                            </div>
                            <div className="flex gap-4 flex-wrap items-center">
                                {types.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setFilter(type)}
                                        className={`px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border-2
                                            ${filter === type
                                                ? 'bg-[#FACC15] text-black border-[#FACC15] scale-105'
                                                : 'bg-transparent text-black/50 dark:text-white/50 border-black/10 dark:border-white/10 hover:border-[#FACC15] hover:text-black dark:hover:text-white'}`}
                                    >
                                        {type === 'all' ? 'All' : type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center px-2">
                    <p className="text-black/20 dark:text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">
                        {loading ? 'SEARCHING...' : `${filteredTrips.length} EXPERIENCES FOUND`}
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="animate-spin text-emerald-500" size={48} />
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
                        {filteredTrips.map((trip) => (
                            <div key={trip.slug || trip._id || trip.id} className="bg-black/5 dark:bg-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-2 group flex flex-col h-full border-b-8 border-[#FACC15]">
                                {/* Image Section */}
                                <div className="relative h-80 overflow-hidden shrink-0">
                                    {trip.image || trip.heroImage || (trip.images && trip.images.length > 0) ? (
                                        <img
                                            src={trip.image || trip.heroImage || trip.images?.[0]}
                                            alt={trip.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-black/10 dark:bg-white/10 flex items-center justify-center text-black/20 dark:text-white/20 uppercase font-black">No Image</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                    <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                                        {trip.tags?.slice(0, 1).map((tag, i) => (
                                            <span key={i} className="px-4 py-2 bg-[#FACC15] text-black text-[10px] font-black uppercase tracking-widest">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="absolute bottom-6 left-6">
                                        <span className="px-5 py-2.5 bg-black/80 backdrop-blur text-white text-[10px] font-black uppercase tracking-[0.2em] border-l-4 border-[#FACC15]">
                                            {trip.category || 'Day Trip'}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-10 flex flex-col flex-1">
                                    <h3 className="text-3xl font-black text-black dark:text-white mb-6 uppercase tracking-tighter leading-none group-hover:text-[#FACC15] transition-colors">
                                        {trip.title}
                                    </h3>

                                    <p className="text-black/40 dark:text-white/40 text-xs mb-8 line-clamp-3 leading-relaxed font-medium uppercase tracking-[0.05em]">
                                        {trip.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-px bg-black/10 dark:bg-white/10 mb-10 border border-black/10 dark:border-white/10">
                                        <div className="flex items-center gap-3 p-4 bg-white/40 dark:bg-black/40">
                                            <Clock size={16} className="text-[#FACC15]" />
                                            <span className="text-[10px] font-black text-black/50 dark:text-white/50 uppercase tracking-widest">
                                                {typeof trip.duration === 'object' ? `${trip.duration.days}D` : '1 DAY'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-white/40 dark:bg-black/40">
                                            <MapPin size={16} className="text-[#FACC15]" />
                                            <span className="text-[10px] font-black text-black/50 dark:text-white/50 uppercase tracking-widest line-clamp-1">
                                                {trip.destinations?.length || 1} DEST.
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-10 border-t border-black/10 dark:border-white/10">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-black/30 dark:text-white/30 uppercase tracking-[0.3em] mb-2">
                                                {trip.price?.type === 'per-person' ? 'PER PERSON' : 'STARTING FROM'}
                                            </span>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xs font-black text-[#FACC15] uppercase">{trip.price?.currency || 'USD'}</span>
                                                <span className="text-4xl font-black text-black dark:text-white tracking-tighter leading-none">
                                                    {trip.price?.amount?.toLocaleString() || '0'}
                                                </span>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/day-trips/${trip.slug}`}
                                            className="w-16 h-16 bg-[#FACC15] text-black flex items-center justify-center hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all transform group-hover:rotate-45"
                                        >
                                            <ArrowRight size={28} className="-rotate-45" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filteredTrips.length === 0 && !loading && (
                    <div className="text-center py-32 bg-black/5 dark:bg-white/5 border-4 border-dashed border-black/10 dark:border-white/10">
                        <p className="text-black/20 dark:text-white/20 font-black uppercase tracking-[0.4em] mb-12">No experiences found for this selection</p>
                        <button
                            onClick={() => { setFilter('all'); setSearch(''); }}
                            className="px-12 py-6 bg-[#FACC15] text-black font-black uppercase tracking-widest text-xs hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all"
                        >
                            RESET DISCOVERY
                        </button>
                    </div>
                )}

                <div className="max-w-6xl mx-auto mt-32">
                    <div className="bg-[#FACC15] p-16 md:p-24 relative overflow-hidden border-b-[20px] border-black">
                        <div className="relative z-10 text-black">
                            <h2 className="text-4xl md:text-8xl font-black mb-8 leading-none uppercase tracking-tighter">
                                CUSTOM <br /><span className="bg-black text-[#FACC15] px-2 md:px-4">ADVENTURES</span>
                            </h2>
                            <p className="text-black/70 mb-12 max-w-xl text-sm font-black uppercase tracking-[0.2em] leading-relaxed">
                                Don't see what you're looking for? We specialize in creating custom day trips that fit your schedule and interests perfectly.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-4 px-12 py-6 bg-black text-[#FACC15] font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all shadow-2xl"
                            >
                                GET A QUOTE <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
