'use client'

import React, { useState } from 'react'
import { Clock, MapPin, Users, Tag, Star, ArrowRight, Filter, Search } from 'lucide-react'
import { dayTrips } from '@/data/tours-data'
import Link from 'next/link'

export default function DayTripsPage() {
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')

    const filteredTrips = dayTrips.filter(trip => {
        const matchesFilter = filter === 'all' || trip.type === filter
        const matchesSearch = trip.title.toLowerCase().includes(search.toLowerCase()) ||
            trip.description.toLowerCase().includes(search.toLowerCase()) ||
            trip.destinations?.some(d => d.toLowerCase().includes(search.toLowerCase()))
        return matchesFilter && matchesSearch
    })

    const types = ['all', 'day trip', 'private tour', 'water activity']

    return (
        <main className="min-h-screen bg-gradient-to-b from-emerald-900 to-slate-950 pt-32 pb-20">
            <div className="container mx-auto px-6">
                {/* Header */}
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

                {/* Filters */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
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
                            {/* Type Filter */}
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

                {/* Results Count */}
                <div className="max-w-6xl mx-auto mb-6">
                    <p className="text-white/60 text-sm">{filteredTrips.length} experiences found</p>
                </div>

                {/* Trips Grid */}
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTrips.map((trip) => (
                        <div key={trip.id} className="bg-white rounded-3xl overflow-hidden shadow-xl group hover:shadow-2xl transition-all hover:-translate-y-1">
                            {/* Image */}
                            <div className="relative h-48 bg-gradient-to-br from-emerald-400 to-emerald-600">
                                <div className="absolute inset-0 bg-black/20" />
                                {/* Tags */}
                                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                    {trip.tags.slice(0, 2).map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-white/90 text-emerald-900 text-xs font-bold rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                {/* Type Badge */}
                                <div className="absolute bottom-4 left-4">
                                    <span className="px-3 py-1 bg-emerald-900/90 text-white text-xs font-bold uppercase rounded-full">
                                        {trip.type}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="font-bold text-lg text-emerald-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                                    {trip.title}
                                </h3>

                                <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                                    {trip.description}
                                </p>

                                {/* Meta */}
                                <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        <span>{trip.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin size={14} />
                                        <span>{trip.pickupLocations.length} pickup points</span>
                                    </div>
                                </div>

                                {/* Highlights */}
                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-1">
                                        {trip.highlights.slice(0, 3).map((h, i) => (
                                            <span key={i} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                                                {h}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Price & CTA */}
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <div>
                                        {trip.originalPrice && (
                                            <span className="text-sm text-slate-400 line-through mr-2">
                                                ${trip.originalPrice}
                                            </span>
                                        )}
                                        <span className="text-2xl font-black text-emerald-900">
                                            ${trip.price}
                                        </span>
                                        <span className="text-sm text-slate-500"> /person</span>
                                    </div>
                                    <Link
                                        href={`/day-trips/${trip.id}`}
                                        className="flex items-center gap-2 px-4 py-2 bg-emerald-900 text-white rounded-xl font-bold text-sm hover:bg-emerald-800 transition-colors"
                                    >
                                        Book <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {filteredTrips.length === 0 && (
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

                {/* CTA */}
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
