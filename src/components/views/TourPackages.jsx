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
        <div className="pb-20">
            {/* Header */}
            <div className="bg-emerald-900 py-16 md:py-24 text-center px-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Tour <span className="text-emerald-400">Packages</span></h1>
                <p className="text-white/60 max-w-2xl mx-auto">Discover the beauty of Sri Lanka with our curated multi-day tour experiences and day trips.</p>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-10">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-emerald-500" size={48} />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {tours.map((pkg) => (
                            <div key={pkg._id || pkg.id} itemScope itemType="https://schema.org/Product" className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col h-full">
                                {/* Image */}
                                <Link href={`/tour-packages/${pkg.slug || pkg.id}`} className="block h-56 overflow-hidden relative">
                                    <img
                                        src={pkg.heroImage || pkg.image || (pkg.images && pkg.images[0]) || '/placeholder.jpg'}
                                        alt={pkg.title}
                                        itemProp="image"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-3 right-3 bg-emerald-900/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm shadow flex items-center gap-1">
                                        <Clock size={10} /> {typeof pkg.duration === 'object' ? `${pkg.duration.days}D / ${pkg.duration.nights}N` : pkg.duration}
                                    </div>
                                    {pkg.isFeatured && (
                                        <div className="absolute top-3 left-3 bg-yellow-400 text-emerald-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                                            Featured
                                        </div>
                                    )}
                                </Link>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-grow">
                                    <Link href={`/tour-packages/${pkg.slug || pkg.id}`} className="group-hover:text-emerald-700 transition-colors">
                                        <h3 itemProp="name" className="text-lg font-bold text-emerald-900 mb-2 line-clamp-2 leading-tight h-12">{pkg.title}</h3>
                                    </Link>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {pkg.destinations && pkg.destinations.slice(0, 3).map((dest, i) => (
                                            <span key={i} className="text-[10px] font-medium bg-slate-50 text-slate-500 px-2 py-1 rounded border border-slate-100">
                                                {dest}
                                            </span>
                                        ))}
                                        {pkg.destinations && pkg.destinations.length > 3 && (
                                            <span className="text-[10px] font-medium bg-slate-50 text-slate-500 px-2 py-1 rounded border border-slate-100">+{pkg.destinations.length - 3}</span>
                                        )}
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
                                        <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                                                {pkg.price?.type === 'per-person' ? 'Per Person' : 'From'}
                                            </p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-sm font-bold text-emerald-600">
                                                    <meta itemProp="priceCurrency" content={pkg.price?.currency || 'USD'} />
                                                    <span itemProp="price" content={pkg.price?.amount || 0}>
                                                        {pkg.price?.currency || 'USD'} {pkg.price?.amount?.toLocaleString() || '0'}
                                                    </span>
                                                </span>
                                            </div>
                                            <link itemProp="availability" href="https://schema.org/InStock" />
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/tour-packages/${pkg.slug || pkg.id}`}
                                                className="bg-slate-100 text-emerald-900 p-2 rounded-lg hover:bg-slate-200 transition-colors"
                                                title="View Details"
                                            >
                                                <ArrowRight size={18} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="text-center mt-16 max-w-2xl mx-auto px-4">
                <h3 className="text-2xl font-bold text-emerald-900 mb-3">Looking for something else?</h3>
                <p className="text-gray-500 mb-8">We specialize in custom itineraries. Tell us your interests and we'll craft the perfect Sri Lankan adventure for you.</p>
                <Link href="/contact" className="inline-block bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all hover:scale-105">
                    Plan My Custom Tour
                </Link>
            </div>
        </div>
    )
}

export default TourPackages
