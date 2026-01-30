'use client'

import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Check, Phone, MessageCircle, MapPin, Clock, Calendar, ArrowLeft, Plus, Minus } from 'lucide-react'
import { tourPackages } from '../../../data/tours-data'
import { useState } from 'react'
import TourBookingModal from '../../../components/TourBookingModal'

export default function TourPackageDetails() {
    const params = useParams()
    const id = params?.id

    // Find the tour package
    const tour = tourPackages.find(t => t.id === id) || tourPackages.find(t => t.title.includes(decodeURIComponent(id || '')))

    const [activeDay, setActiveDay] = useState(1)
    const [memberCount, setMemberCount] = useState({ adults: 2, children: 0 })
    const [isModalOpen, setIsModalOpen] = useState(false)

    if (!tour) {
        return (
            <div className="min-h-screen pt-32 px-6 flex flex-col items-center justify-center text-center">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Tour Package Not Found</h1>
                <p className="text-slate-600 dark:text-slate-400 mb-8">The tour package you are looking for might have been removed or updated.</p>
                <Link href="/tour-packages" className="px-6 py-3 bg-emerald-900 text-white rounded-xl font-bold hover:bg-emerald-800 transition-colors">
                    Browse All Packages
                </Link>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-6 pb-24 md:p-12 md:pb-28 lg:p-20 lg:pb-32">
                    <div className="max-w-7xl mx-auto">
                        <Link href="/tour-packages" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors font-medium">
                            <ArrowLeft size={20} /> Back to Packages
                        </Link>
                        <div className="flex flex-wrap gap-4 mb-4">
                            <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                                Tour Package
                            </span>
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-2">
                                <Clock size={14} /> {tour.duration}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight max-w-4xl">
                            {tour.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-white/90 font-medium text-lg">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl md:text-3xl font-bold text-emerald-400">Rs {Math.round(tour.price * 300).toLocaleString()}</span>
                                <span className="text-sm opacity-70">{tour.priceType || 'Person'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Itinerary */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-emerald-900/5 dark:border-slate-800">
                            <h2 className="text-2xl font-bold text-emerald-900 dark:text-white mb-4">Overview</h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                                {tour.description}
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                {tour.destinations?.map(dest => (
                                    <div key={dest} className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800 flex items-center gap-2">
                                        <MapPin size={16} className="text-emerald-600 dark:text-emerald-400" />
                                        <span className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">{dest}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Itinerary */}
                        {tour.itinerary && (
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-emerald-900/5 dark:border-slate-800">
                                <h2 className="text-2xl font-bold text-emerald-900 dark:text-white mb-8 flex items-center gap-3">
                                    <Calendar className="text-emerald-600" /> Itinerary
                                </h2>
                                <div className="space-y-6">
                                    {tour.itinerary?.map((item, index) => (
                                        <div key={item.day} className={`relative pl-8 pb-8 border-l-2 ${index === (tour.itinerary?.length - 1 || 0) ? 'border-transparent' : 'border-emerald-100 dark:border-slate-800'}`}>
                                            <div
                                                className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 transition-all ${activeDay === item.day ? 'bg-emerald-600 border-emerald-600' : 'bg-white dark:bg-slate-800 border-emerald-200 dark:border-slate-600'}`}
                                            />
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => setActiveDay(activeDay === item.day ? null : item.day)}
                                                    className="flex items-center gap-4 text-left group"
                                                >
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${activeDay === item.day ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20'}`}>
                                                        Day {item.day}
                                                    </span>
                                                    <h3 className={`text-lg font-bold transition-colors ${activeDay === item.day ? 'text-emerald-900 dark:text-white' : 'text-slate-700 dark:text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300'}`}>
                                                        {item.title}
                                                    </h3>
                                                </button>

                                                <div className={`grid transition-all duration-300 ease-in-out ${activeDay === item.day ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}`}>
                                                    <div className="overflow-hidden">
                                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50">
                                                            {item.desc || item.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Map, Includes, Booking */}
                    <div className="space-y-8">

                        {/* Map Card */}
                        {tour.mapImage && (
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-2 shadow-xl border border-emerald-900/5 dark:border-slate-800 overflow-hidden">
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                                    <Image
                                        src={tour.mapImage}
                                        alt="Tour Route Map"
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm border border-black/5 flex items-center gap-2">
                                        <MapPin size={12} className="text-red-500" /> Route Map
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Booking Card */}
                        <div className="bg-emerald-900 dark:bg-emerald-950 rounded-3xl p-8 shadow-xl text-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-700/20 transition-colors" />

                            <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Book This Tour</h3>
                            <p className="text-emerald-200 mb-6 text-sm relative z-10">Customize your trip with our travel specialists.</p>

                            {/* Member Selection */}
                            <div className="bg-emerald-800/50 rounded-xl p-4 mb-6 relative z-10 backdrop-blur-sm border border-emerald-700/30">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-emerald-100 font-medium text-sm">Adults</span>
                                        <div className="flex items-center gap-3 bg-emerald-900/50 rounded-lg p-1 border border-emerald-700/50">
                                            <button
                                                onClick={() => setMemberCount(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                                                className="w-8 h-8 flex items-center justify-center text-white hover:bg-emerald-700 rounded-md transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="text-white font-bold w-4 text-center">{memberCount.adults}</span>
                                            <button
                                                onClick={() => setMemberCount(prev => ({ ...prev, adults: prev.adults + 1 }))}
                                                className="w-8 h-8 flex items-center justify-center text-white hover:bg-emerald-700 rounded-md transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-emerald-100 font-medium text-sm">Children</span>
                                        <div className="flex items-center gap-3 bg-emerald-900/50 rounded-lg p-1 border border-emerald-700/50">
                                            <button
                                                onClick={() => setMemberCount(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                                                className="w-8 h-8 flex items-center justify-center text-white hover:bg-emerald-700 rounded-md transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="text-white font-bold w-4 text-center">{memberCount.children}</span>
                                            <button
                                                onClick={() => setMemberCount(prev => ({ ...prev, children: prev.children + 1 }))}
                                                className="w-8 h-8 flex items-center justify-center text-white hover:bg-emerald-700 rounded-md transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center justify-center gap-3 w-full py-4 bg-white hover:bg-slate-50 text-emerald-950 rounded-xl font-bold shadow-lg shadow-emerald-900/20 transition-all hover:scale-[1.02]"
                                >
                                    <Calendar size={20} /> Book Now
                                </button>
                                <a
                                    href={`https://wa.me/+94716885880?text=${encodeURIComponent(`Hi, I'm interested in booking the "${tour.title}".\n\nPax: ${memberCount.adults} Adults, ${memberCount.children} Children\nPlease provide availability and a quote.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold shadow-lg shadow-emerald-900/20 transition-all hover:scale-[1.02]"
                                >
                                    <MessageCircle size={20} /> WhatsApp Inquiry
                                </a>
                            </div>
                        </div>

                        {/* Booking Modal */}
                        <TourBookingModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            tourTitle={tour.title}
                            tourId={tour.id}
                            duration={tour.duration}
                            price={Math.round(tour.price * 300)}
                            currency="LKR"
                        />

                        {/* Includes List */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-emerald-900/5 dark:border-slate-800">
                            <h3 className="text-lg font-bold text-emerald-900 dark:text-white mb-6 uppercase tracking-wider">Package Includes</h3>
                            <ul className="space-y-4">
                                {tour.includes?.map((item, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 group">
                                        <div className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
                                            <Check size={12} className="text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <span className="leading-snug">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    )
}
