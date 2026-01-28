'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin, Star, Compass } from 'lucide-react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import BookingModal from '../components/BookingModal'
import BookingWidget from '../components/BookingWidget'
import GoogleReviews from '../components/GoogleReviews'
import ReviewStatsBar from '../components/ReviewStatsBar'
import RecentPosts from '../components/RecentPosts'
import SpecialOffersSection from '../components/SpecialOffersSection'

export default function Home() {
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    return (
        <div className="bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-300">
            <Hero onBookClick={() => setIsBookingOpen(true)} />

            <BookingWidget />

            {/* Booking Modal (Used for deep links or mobile button) */}
            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
            />

            {/* Quick CTA - Refined */}
            <div id="calculator" className="py-32 relative">
                <div className="absolute inset-0 bg-emerald-900/5 flex items-center justify-center opacity-30">
                    <div className="w-[800px] h-[400px] border border-emerald-900/10 rounded-full blur-3xl"></div>
                </div>
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-emerald-900 dark:text-white mb-6 font-heading">
                        Seamless <span className="text-emerald-600 dark:text-emerald-400">Airport Transfers</span>
                    </h2>
                    <p className="text-emerald-900/60 dark:text-white/60 mb-10 text-lg">Predictable pricing, premium vehicles, and professional chauffeurs waiting for you.</p>
                    <button
                        onClick={() => setIsBookingOpen(true)}
                        className="bg-emerald-900 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-emerald-800 transition-all shadow-xl inline-flex items-center gap-3 group"
                    >
                        Book Your Trip Now
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            <SpecialOffersSection />

            {/* Popular Routes Section - Premium Dark */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 dark:text-white">
                                Curated <span className="text-emerald-600 dark:text-emerald-400">Destinations</span>
                            </h2>
                            <p className="text-emerald-900/60 dark:text-white/60 text-lg">Explore the most iconic locations in Sri Lanka with our specialized airport transfer services.</p>
                        </div>
                        <Link href="/prices" className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-widest text-sm hover:gap-4 transition-all">
                            View All Rates <ArrowRight size={18} />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Destination Cards */}
                        {[
                            {
                                title: "Airport to Mirissa",
                                price: "59",
                                badge: "Top Choice",
                                img: "/mirissa.jpg",
                                meta: "Whale Watching Hub"
                            },
                            {
                                title: "Airport to Ella",
                                price: "110",
                                badge: "Scenic Route",
                                img: "/ella.jpg",
                                meta: "Highlands Escape"
                            },
                            {
                                title: "Airport to Sigiriya",
                                price: "90",
                                badge: "Historic",
                                img: "/sigiriya.jpg",
                                meta: "Ancient Rock Fortress"
                            }
                        ].map((route, i) => (
                            <Link key={i} href={`/destination/${route.title.split(' ').pop().toLowerCase()}`} className="group relative h-[450px] rounded-3xl overflow-hidden border border-emerald-900/10 block shadow-md hover:shadow-xl transition-all duration-500">
                                <Image
                                    src={route.img}
                                    alt={route.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900 via-emerald-900/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                                <div className="absolute top-6 left-6">
                                    <span className="bg-emerald-900 border border-emerald-400/20 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">{route.badge}</span>
                                </div>
                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                    <div className="flex items-center gap-2 text-emerald-400 mb-2">
                                        <MapPin size={14} />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{route.meta}</span>
                                    </div>
                                    <h3 className="text-2xl font-extrabold text-white mb-4 leading-tight">{route.title}</h3>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] text-white/60 uppercase font-bold tracking-widest">Starting From</span>
                                            <span className="text-2xl font-black text-white">${route.price}</span>
                                        </div>
                                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white group-hover:text-emerald-900 transition-all font-bold">
                                            <ArrowRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <ReviewStatsBar />
            <GoogleReviews />
            <RecentPosts />
            <Features />
        </div>
    )
}
