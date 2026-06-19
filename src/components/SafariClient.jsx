'use client'

import React, { useState, useEffect } from 'react'
import { Clock, MapPin, Users, ArrowRight, Loader2, Binoculars, TreePine, Camera, Shield } from 'lucide-react'
import Link from 'next/link'

const SAFARI_FALLBACK = [
    {
        _id: 'safari-yala',
        slug: 'yala-national-park-leopard-safari',
        title: 'Yala National Park Leopard Safari',
        description: 'Discover Sri Lanka\'s most famous national park with the highest leopard density in the world. Spot elephants, sloth bears, crocodiles, and exotic birds on a thrilling full-day jeep safari.',
        heroImage: '/yala-new.png',
        category: 'safari',
        duration: { days: 1, nights: 0 },
        destinations: ['Yala'],
        price: { amount: 85, currency: 'USD', type: 'per-person' },
    },
    {
        _id: 'safari-udawalawe',
        slug: 'udawalawe-national-park-wildlife-safari',
        title: 'Udawalawe National Park Wildlife Safari',
        description: 'Home to over 500 wild elephants, Udawalawe offers an unforgettable safari experience. See herds roaming freely alongside water buffalo, deer, and birds of prey.',
        heroImage: '/wilpattu-new.png',
        category: 'safari',
        duration: { days: 1, nights: 0 },
        destinations: ['Udawalawe'],
        price: { amount: 75, currency: 'USD', type: 'per-person' },
    },
    {
        _id: 'safari-minneriya',
        slug: 'sigiriya-rock-minneriya-safari-from-negombo',
        title: 'Sigiriya Rock & Minneriya Safari',
        description: 'Combine the iconic Sigiriya Rock Fortress climb with an evening jeep safari at Minneriya, famous for "The Gathering" — the largest wild elephant congregation in Asia.',
        heroImage: '/sigiriya-new-hero.png',
        category: 'safari',
        duration: { days: 1, nights: 0 },
        destinations: ['Sigiriya', 'Minneriya'],
        price: { amount: 95, currency: 'USD', type: 'per-person' },
    },
    {
        _id: 'safari-pinnawala',
        slug: 'pinnawala-elephant-experience',
        title: 'Pinnawala Elephant Experience',
        description: 'Visit the world-renowned Pinnawala Elephant Orphanage and watch rescued elephants bathe in the river. An intimate experience perfect for families and wildlife lovers.',
        heroImage: '/kandy-new.png',
        category: 'safari',
        duration: { days: 1, nights: 0 },
        destinations: ['Pinnawala'],
        price: { amount: 55, currency: 'USD', type: 'per-person' },
    },
    {
        _id: 'safari-whale',
        slug: 'mirissa-whale-watching-expedition',
        title: 'Mirissa Whale Watching Expedition',
        description: 'Set sail from Mirissa harbor at dawn for a once-in-a-lifetime encounter with blue whales, sperm whales, and playful dolphins in the Indian Ocean.',
        heroImage: '/mirissa-new-fix.png',
        category: 'safari',
        duration: { days: 1, nights: 0 },
        destinations: ['Mirissa'],
        price: { amount: 65, currency: 'USD', type: 'per-person' },
    },
    {
        _id: 'safari-wilpattu',
        slug: 'wilpattu-national-park-safari',
        title: 'Wilpattu National Park Safari',
        description: 'Explore Sri Lanka\'s largest and oldest national park. Wilpattu is known for its unique natural lakes (villus) and sightings of leopards, sloth bears, and spotted deer.',
        heroImage: '/wilpattu-new.png',
        category: 'safari',
        duration: { days: 1, nights: 0 },
        destinations: ['Wilpattu'],
        price: { amount: 80, currency: 'USD', type: 'per-person' },
    },
]

export default function SafariClient() {
    const [trips, setTrips] = useState(SAFARI_FALLBACK)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const res = await fetch('/api/tours?category=safari')
                const data = await res.json()
                if (data.success && data.data.length > 0) {
                    // Merge with fallback images if DB images are broken unsplash URLs
                    const merged = data.data.map(tour => {
                        const isBrokenImage = !tour.heroImage || tour.heroImage.includes('unsplash.com')
                        const fallback = SAFARI_FALLBACK.find(f => 
                            f.title.toLowerCase().includes(tour.title.split(' ')[0].toLowerCase()) ||
                            tour.title.toLowerCase().includes(f.title.split(' ')[0].toLowerCase())
                        )
                        return {
                            ...tour,
                            heroImage: isBrokenImage && fallback ? fallback.heroImage : tour.heroImage,
                        }
                    })
                    setTrips(merged)
                }
            } catch (error) {
                console.error("Failed to fetch safari tours:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchTrips()
    }, [])

    const filteredTrips = trips.filter(trip => {
        if (!search) return true
        return trip.title?.toLowerCase().includes(search.toLowerCase()) ||
            trip.description?.toLowerCase().includes(search.toLowerCase()) ||
            trip.destinations?.some(d => d?.toLowerCase().includes(search.toLowerCase()))
    })

    return (
        <div className="min-h-screen bg-white dark:bg-black pt-28 pb-20 text-black dark:text-white transition-colors duration-300">
            <div className="container mx-auto px-4 md:px-6">

                {/* Hero Section */}
                <div className="relative mb-16 overflow-hidden rounded-3xl">
                    <div className="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-black py-20 md:py-28 px-8 md:px-16">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(/wilpattu-new.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
                        <div className="relative z-10 max-w-3xl">
                            <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#FACC15] text-black text-[10px] font-black uppercase tracking-[0.25em] rounded-full mb-6">
                                <Binoculars size={14} />
                                WILDLIFE ADVENTURE
                            </div>
                            <h1 className="text-4xl md:text-7xl font-black text-white mb-5 leading-[0.9] tracking-tight">
                                Safari <span className="text-[#FACC15]">Packages</span>
                            </h1>
                            <p className="text-white/60 max-w-xl text-sm md:text-base leading-relaxed">
                                Experience the wild side of Sri Lanka. From leopard-spotting at Yala to 
                                whale watching in Mirissa — unforgettable wildlife encounters await.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features Bar */}
                <div className="max-w-5xl mx-auto mb-14">
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-6 md:p-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { Icon: Binoculars, label: "Expert Trackers" },
                                { Icon: Camera, label: "Photo Stops" },
                                { Icon: Shield, label: "Licensed Jeeps" },
                                { Icon: TreePine, label: "Eco Friendly" }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-3 text-center">
                                    <div className="w-12 h-12 bg-[#FACC15] rounded-xl flex items-center justify-center shadow-md">
                                        <item.Icon size={22} className="text-black" />
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Count */}
                <div className="max-w-7xl mx-auto mb-6 flex justify-between items-center px-2">
                    <p className="text-black/40 dark:text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
                        {loading ? 'LOADING...' : `${filteredTrips.length} SAFARI EXPERIENCES`}
                    </p>
                </div>

                {/* Cards Grid */}
                {loading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="animate-spin text-[#FACC15]" size={48} />
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
                        {filteredTrips.map((trip) => {
                            const priceAmount = typeof trip.price === 'object' ? trip.price.amount : trip.price;
                            return (
                                <div key={trip.slug || trip._id || trip.id} className="bg-white dark:bg-zinc-900 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl group flex flex-col h-full border border-slate-200 dark:border-zinc-800 shadow-lg rounded-2xl">
                                    {/* Image */}
                                    <div className="relative h-56 md:h-64 overflow-hidden shrink-0">
                                        <img
                                            src={trip.heroImage || trip.images?.[0] || '/wilpattu-new.png'}
                                            alt={trip.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1.5 bg-[#FACC15] text-black text-[9px] font-black uppercase tracking-widest rounded-lg">
                                                🐾 Safari
                                            </span>
                                        </div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="text-lg md:text-xl font-black text-white leading-tight line-clamp-2">
                                                {trip.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 md:p-6 flex flex-col flex-1">
                                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-5 line-clamp-2 leading-relaxed">
                                            {trip.description || trip.shortDescription}
                                        </p>

                                        <div className="flex gap-2 mb-5 flex-wrap">
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                                                <Clock size={12} className="text-emerald-600" />
                                                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                                                    {typeof trip.duration === 'object' ? `${trip.duration.days} Day${trip.duration.days > 1 ? 's' : ''}` : '1 Day'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-100 dark:border-amber-800/30">
                                                <MapPin size={12} className="text-amber-600" />
                                                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                                                    {trip.destinations?.join(', ') || 'Sri Lanka'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800">
                                            <div>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                                                    {trip.price?.type === 'per-person' ? 'Per Person' : 'From'}
                                                </span>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-xs font-bold text-[#FACC15]">{trip.price?.currency || 'USD'}</span>
                                                    <span className="text-2xl font-black text-black dark:text-white tracking-tight">
                                                        {priceAmount > 0 ? priceAmount.toLocaleString() : 'TBD'}
                                                    </span>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/tours/${trip.slug}`}
                                                className="w-12 h-12 bg-emerald-600 hover:bg-[#FACC15] text-white hover:text-black rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                            >
                                                <ArrowRight size={20} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* CTA Section */}
                <div className="max-w-5xl mx-auto mt-16">
                    <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-2xl p-10 md:p-16 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FACC15]/10 rounded-full blur-3xl" />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                                Custom Safari <span className="text-[#FACC15]">Tour?</span>
                            </h2>
                            <p className="text-white/60 mb-8 max-w-lg text-sm leading-relaxed">
                                Want a tailor-made wildlife experience? We create bespoke safari packages 
                                with luxury lodges, private jeeps, and expert naturalists.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-[#FACC15] text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-all shadow-lg hover:shadow-xl"
                            >
                                GET A QUOTE <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
