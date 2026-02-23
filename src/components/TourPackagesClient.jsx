'use client'

import React, { useState } from 'react'
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
                const res = await fetch('/api/tours?category=tour-package')
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
        <main className="min-h-screen bg-gradient-to-b from-emerald-900 to-slate-950 pt-32 pb-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-6">
                        <Plane size={14} />
                        Multi-Day Adventures
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                        Tour <span className="text-emerald-400">Packages</span>
                    </h1>
                    <p className="text-white/70 max-w-2xl mx-auto text-lg">
                        Complete Sri Lanka tour packages with accommodation, transport, and guided experiences. Everything taken care of for an unforgettable journey.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto mb-16">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        <h3 className="text-white font-bold mb-4 text-center">All Tours Include:</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center gap-3 text-white/80">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                    <Hotel size={18} className="text-emerald-400" />
                                </div>
                                <span className="text-sm">Quality Hotels</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                    <Car size={18} className="text-emerald-400" />
                                </div>
                                <span className="text-sm">Private AC Vehicle</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                    <Utensils size={18} className="text-emerald-400" />
                                </div>
                                <span className="text-sm">Daily Breakfast</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                    <Users size={18} className="text-emerald-400" />
                                </div>
                                <span className="text-sm">Expert Driver-Guide</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {['All', 'Day Tours', 'City Tours', 'Safari', 'Multi-Day'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${activeCategory === cat
                                ? 'bg-emerald-900 text-white shadow-lg scale-105'
                                : 'bg-white text-emerald-900/70 hover:bg-emerald-50 border border-emerald-900/10'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="max-w-7xl mx-auto space-y-12">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-emerald-500" size={48} />
                        </div>
                    ) : (
                        Array.isArray(tours) && tours
                            .filter(tour => activeCategory === 'All' || tour.category === activeCategory)
                            .map((tour, index) => (
                                <div key={tour.slug || tour._id || index} className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-cyan-900/10 transition-all group border border-slate-100">
                                <div className="grid lg:grid-cols-[450px,1fr] xl:grid-cols-[550px,1fr] min-h-[400px]">
                                    {/* Image Section */}
                                    <div className="relative h-72 lg:h-full bg-slate-900 overflow-hidden">
                                        {tour.image || tour.heroImage || (tour.images && tour.images.length > 0) ? (
                                            <img
                                                src={tour.image || tour.heroImage || tour.images?.[0]}
                                                alt={tour.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-500">No Image Available</div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent pointer-events-none" />

                                        <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                                            {tour.tags?.slice(0, 2).map((tag, i) => (
                                                <span key={i} className="px-3 py-1 bg-white/90 backdrop-blur text-[#006064] text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="absolute bottom-6 left-6 right-6">
                                            <div className="flex items-center gap-3 text-white/90 font-medium mb-2">
                                                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                                                    <Calendar size={14} className="text-[#00A99D]" />
                                                    <span className="text-sm">{typeof tour.duration === 'object' && tour.duration ? `${tour.duration.days || '?'}D / ${tour.duration.nights || '?'}N` : (tour.duration || 'N/A')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-8 md:p-12 flex flex-col justify-between">
                                        <div>
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                                <h3 className="text-3xl md:text-4xl font-black text-[#006064] leading-tight">
                                                    {tour.title}
                                                </h3>
                                                <div className="text-right shrink-0 bg-[#00A99D]/10 px-4 py-2 rounded-2xl border border-[#00A99D]/20 self-start">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Starting From</span>
                                                    <span className="text-2xl font-black text-[#006064]">
                                                        {typeof tour.price === 'object' ? (tour.price?.currency || '$') : (tour.currency || '$')} {typeof tour.price === 'object' ? (tour.price?.amount?.toLocaleString() || '0') : (tour.price?.toLocaleString() || '0')}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="text-slate-600 text-lg mb-6 leading-relaxed line-clamp-3">
                                                {tour.description}
                                            </p>

                                            <div className="flex items-center gap-2 mb-8 flex-wrap">
                                                <MapPin size={18} className="text-[#00A99D]" />
                                                {Array.isArray(tour.destinations) ? tour.destinations.map((dest, i) => (
                                                    <span key={i} className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                                                        {dest}{i < (tour.destinations.length - 1) ? ' • ' : ''}
                                                    </span>
                                                )) : <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Multiple Locations</span>}
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-3 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                                {tour.highlights?.slice(0, 4).map((highlight, i) => (
                                                    <div key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                                                        <Check size={16} className="text-[#00A99D] shrink-0 mt-0.5" />
                                                        <span>{highlight}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-6 border-t border-slate-100">
                                            <Link
                                                href={`/tour-packages/${tour.slug}`}
                                                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-[#006064] text-white rounded-2xl font-black hover:bg-[#004D40] hover:scale-[1.02] transition-all shadow-xl"
                                            >
                                                View Full Itinerary <ArrowRight size={18} />
                                            </Link>
                                            <Link
                                                href={`https://wa.me/+94722885885?text=I'm interested in the ${tour.title} package`}
                                                className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#006064] rounded-2xl font-black border-2 border-[#006064]/20 hover:border-[#006064] hover:bg-slate-50 transition-all"
                                            >
                                                Inquire via WhatsApp
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="max-w-4xl mx-auto mt-16 text-center">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-8 md:p-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            Want a Custom Tour?
                        </h2>
                        <p className="text-white/90 mb-6 max-w-xl mx-auto">
                            Tell us your dream Sri Lanka experience and we'll create a personalized itinerary just for you.
                            Family trips, honeymoons, adventure tours - we do it all!
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 rounded-2xl font-bold shadow-lg hover:bg-orange-50 transition-all"
                        >
                            Create Custom Tour <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto mt-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="bg-white/5 rounded-2xl p-6">
                            <div className="text-3xl font-black text-emerald-400 mb-2">500+</div>
                            <div className="text-white/60 text-sm">Happy Travelers</div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-6">
                            <div className="text-3xl font-black text-emerald-400 mb-2">5★</div>
                            <div className="text-white/60 text-sm">TripAdvisor Rating</div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-6">
                            <div className="text-3xl font-black text-emerald-400 mb-2">24/7</div>
                            <div className="text-white/60 text-sm">Support Available</div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-6">
                            <div className="text-3xl font-black text-emerald-400 mb-2">100%</div>
                            <div className="text-white/60 text-sm">Customizable</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
