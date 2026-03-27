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
        <main className="min-h-screen bg-white dark:bg-black pt-32 pb-20 text-black dark:text-white transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#FACC15] text-black text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                        <Plane size={14} />
                        Multi-Day Adventures
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-black dark:text-white mb-6 uppercase tracking-tighter leading-none">
                        TOUR <span className="text-[#FACC15]">PACKAGES</span>
                    </h1>
                    <p className="text-black/60 dark:text-white/60 max-w-2xl mx-auto text-sm font-medium uppercase tracking-widest leading-relaxed">
                        Complete Sri Lanka tour packages with premium accommodation,
                        private transport, and expert guided experiences.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto mb-16">
                    <div className="bg-black/5 dark:bg-white/5 border-2 border-[#FACC15]/20 p-10">
                        <h3 className="text-[#FACC15] font-black mb-10 text-center uppercase tracking-[0.4em] text-[10px]">Premium All-Inclusive Features</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { Icon: Hotel, label: "Luxury Hotels" },
                                { Icon: Car, label: "Private Vehicles" },
                                { Icon: Utensils, label: "Daily Dining" },
                                { Icon: Users, label: "Expert Guides" }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-4 text-center group">
                                    <div className="w-16 h-16 bg-[#FACC15] flex items-center justify-center border-4 border-black dark:border-black group-hover:bg-black dark:group-hover:bg-white group-hover:text-[#FACC15] dark:group-hover:text-black transition-colors">
                                        <item.Icon size={28} className="text-black group-hover:text-inherit" />
                                    </div>
                                    <span className="text-[10px] font-black text-black/70 dark:text-white/70 uppercase tracking-widest">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-20">
                    {['All', 'City Tours', 'Safaris', 'Multi-Day'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border-2 ${activeCategory === cat
                                ? 'bg-[#FACC15] text-black border-[#FACC15] scale-105'
                                : 'bg-transparent text-black/50 dark:text-white/50 border-black/20 dark:border-white/20 hover:border-[#FACC15] hover:text-black dark:hover:text-white'
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
                                    <div key={tour.slug || tour._id || index} className="bg-black/5 dark:bg-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-2 group flex flex-col h-full border-b-8 border-[#FACC15]">
                                        {/* Image Section */}
                                        <div className="relative h-80 overflow-hidden shrink-0">
                                            {tour.image || tour.heroImage || (tour.images && tour.images.length > 0) ? (
                                                <img
                                                    src={tour.image || tour.heroImage || tour.images?.[0]}
                                                    alt={tour.title}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-black/10 dark:bg-white/10 flex items-center justify-center text-black/20 dark:text-white/20 uppercase font-black">No Image</div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                            <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                                                {tour.tags?.slice(0, 1).map((tag, i) => (
                                                    <span key={i} className="px-4 py-2 bg-[#FACC15] text-black text-[10px] font-black uppercase tracking-widest">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="absolute bottom-6 left-6 right-6">
                                                <div className="inline-flex items-center gap-3 bg-black/80 backdrop-blur px-5 py-2.5 text-white border-l-4 border-[#FACC15]">
                                                    <Calendar size={14} className="text-[#FACC15]" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                                                        {typeof tour.duration === 'object' && tour.duration ? `${tour.duration.days || '?'}D / ${tour.duration.nights || '?'}N` : (tour.duration || 'N/A')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-10 flex flex-col flex-1">
                                            <h3 className="text-3xl font-black text-black dark:text-white mb-6 uppercase tracking-tighter leading-none group-hover:text-[#FACC15] transition-colors">
                                                {tour.title}
                                            </h3>

                                            <p className="text-black/40 dark:text-white/40 text-xs mb-8 line-clamp-3 leading-relaxed font-medium uppercase tracking-[0.05em]">
                                                {tour.description}
                                            </p>

                                            <div className="flex items-center gap-3 mb-10 overflow-hidden text-[#FACC15]">
                                                <MapPin size={16} className="shrink-0" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
                                                    {Array.isArray(tour.destinations) ? tour.destinations.join(' • ') : 'Multiple Locations'}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between mt-auto pt-10 border-t border-black/10 dark:border-white/10">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black text-black/30 dark:text-white/30 uppercase tracking-[0.3em] mb-2">Price From</span>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-xs font-black text-[#FACC15] uppercase">{typeof tour.price === 'object' ? (tour.price?.currency || 'USD') : (tour.currency || 'USD')}</span>
                                                        <span className="text-4xl font-black text-black dark:text-white tracking-tighter">
                                                            {(() => {
                                                                const amount = typeof tour.price === 'object' ? tour.price?.amount : tour.price;
                                                                return amount && amount > 0 ? (amount.toLocaleString()) : "REQ";
                                                            })()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Link
                                                    href={`/tour-packages/${tour.slug}`}
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
                </div>

                <div className="max-w-6xl mx-auto mt-32">
                    <div className="bg-[#FACC15] p-8 md:p-16 lg:p-24 relative overflow-hidden border-b-[20px] border-black">
                        <div className="relative z-10 text-black">
                            <h2 className="text-4xl md:text-6xl lg:text-8xl font-black mb-6 md:mb-8 leading-none uppercase tracking-tighter">
                                TAILOR-MADE <br className="hidden md:block" />
                                <div className="mt-2 md:mt-0 inline-block"><span className="bg-black text-[#FACC15] px-4">JOURNEYS</span></div>
                            </h2>
                            <p className="text-black/70 mb-8 md:mb-12 max-w-xl text-xs md:text-sm font-black uppercase tracking-[0.2em] leading-relaxed">
                                Every traveler is unique. Tell us your interests and we'll craft a personalized itinerary that matches your pace, budget, and style.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-4 px-12 py-6 bg-black text-[#FACC15] font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all shadow-2xl"
                            >
                                Start Designing <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mt-20 md:mt-32">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { val: "500+", lbl: "Happy Travelers" },
                            { val: "5.0", lbl: "User Rating" },
                            { val: "24/7", lbl: "Local Support" },
                            { val: "100%", lbl: "Flexible" }
                        ].map((stat, i) => (
                            <div key={i} className="bg-black/5 dark:bg-white/5 p-6 md:p-8 lg:p-12 text-center border-l-4 border-[#FACC15] flex flex-col justify-center">
                                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FACC15] mb-2 md:mb-4 tracking-tighter">{stat.val}</div>
                                <div className="text-black/40 dark:text-white/40 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] leading-tight break-words">{stat.lbl}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}
