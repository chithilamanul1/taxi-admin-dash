'use client'

import React, { useState, useEffect } from 'react'
import { ArrowRight, Clock, MapPin, Loader2 } from 'lucide-react'
import Link from 'next/link'

const TourPackages = () => {
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
        <div className="pb-20 bg-slate-50 dark:bg-black transition-colors duration-500">
            {/* Header - Premium Look */}
            <div className="bg-black py-20 md:py-32 text-center px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#FACC15]/10 rounded-none blur-[120px] -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FACC15]/5 rounded-none blur-[120px] -ml-48 -mb-48"></div>
                
                <div className="relative z-10">
                    <div className="inline-block px-6 py-2 bg-[#FACC15] text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-none mb-8 border-2 border-black">Elite Experiences</div>
                    <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase mb-6">
                        TOUR <span className="text-[#FACC15]">PACKAGES</span>
                    </h1>
                    <p className="text-white/40 max-w-2xl mx-auto font-bold uppercase tracking-widest text-xs leading-relaxed">Curated escapes through the teardrop of India. <br className="hidden md:block"/>Luxury, Comfort, and Culture combined.</p>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-16 relative z-20">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-6">
                        <div className="w-16 h-16 border-8 border-[#FACC15] border-t-transparent rounded-none animate-spin"></div>
                        <p className="font-black text-black/40 uppercase tracking-widest">Gathering Best Experiences...</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {tours.map((pkg) => (
                            <div key={pkg._id || pkg.id} className="premium-box bg-white dark:bg-[#111] overflow-hidden group hover:scale-[1.02] transition-all duration-500 border-4 border-black flex flex-col h-full rounded-none">
                                {/* Image */}
                                <Link href={`/tour-packages/${pkg.slug || pkg.id}`} className="block h-64 overflow-hidden relative">
                                    <img
                                        src={pkg.heroImage || pkg.image || (pkg.images && pkg.images[0]) || '/placeholder.jpg'}
                                        alt={pkg.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute bottom-4 left-4 bg-black/90 text-[#FACC15] text-[10px] font-black px-4 py-2 rounded-none uppercase tracking-widest backdrop-blur-md border-2 border-black flex items-center gap-2">
                                        <Clock size={12} strokeWidth={3} /> {typeof pkg.duration === 'object' ? `${pkg.duration.days}D / ${pkg.duration.nights}N` : pkg.duration}
                                    </div>
                                    {pkg.isFeatured && (
                                        <div className="absolute top-4 right-4 bg-[#FACC15] text-black text-[10px] font-extrabold px-4 py-2 rounded-none uppercase tracking-widest border-2 border-black">
                                            Priority
                                        </div>
                                    )}
                                </Link>

                                {/* Content */}
                                <div className="p-8 flex flex-col flex-grow">
                                    <Link href={`/tour-packages/${pkg.slug || pkg.id}`}>
                                        <h3 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter leading-none mb-4 group-hover:text-[#FACC15] transition-colors">{pkg.title}</h3>
                                    </Link>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {pkg.destinations && pkg.destinations.slice(0, 3).map((dest, i) => (
                                            <span key={i} className="text-[9px] font-black bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-none border border-slate-100 dark:border-white/10 uppercase tracking-widest">
                                                {dest}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/10 flex items-end justify-between">
                                        <div>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] font-black mb-1">
                                                Investment
                                            </p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">{pkg.price?.currency || 'USD'}</span>
                                                <span className="text-3xl font-black text-black dark:text-white tracking-tighter">
                                                    {pkg.price?.amount?.toLocaleString() || '0'}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <Link
                                            href={`/tour-packages/${pkg.slug || pkg.id}`}
                                            className="w-14 h-14 bg-black dark:bg-[#FACC15] text-[#FACC15] dark:text-black rounded-none flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-2 border-black group/btn"
                                        >
                                            <ArrowRight size={24} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="text-center mt-32 max-w-4xl mx-auto px-6">
                <div className="premium-box p-12 md:p-20 bg-black text-white border-none relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-[#FACC15]/10 rounded-none blur-[100px] -ml-32 -mt-32"></div>
                    <div className="relative z-10 space-y-8">
                        <div className="yellow-badge mx-auto">Tailored For You</div>
                        <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">CRAFT YOUR <span className="text-[#FACC15]">DREAM</span> ROUTE</h3>
                        <p className="text-white/40 max-w-xl mx-auto font-bold uppercase tracking-widest text-xs leading-relaxed">Bespoke itineraries designed for travelers who refuse to settle for ordinary.</p>
                        <Link href="/contact" className="inline-flex items-center gap-4 bg-[#FACC15] text-black font-black px-12 py-6 rounded-none hover:scale-105 active:scale-95 transition-all border-4 border-black uppercase tracking-[0.2em] text-sm group">
                            Start Planning <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TourPackages
