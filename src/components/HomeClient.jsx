'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin, Star, Compass } from 'lucide-react'
import Hero from './Hero'
import Features from './Features'
import BookingModal from './BookingModal'
import BookingWidget from './BookingWidget'
import ReviewStatsBar from './ReviewStatsBar'
import { destinations } from '@/lib/destinations'

// Dynamic imports for components below the fold
const GoogleReviews = dynamic(() => import('./GoogleReviews'), { ssr: false })
const RecentPosts = dynamic(() => import('./RecentPosts'), { ssr: false })
const SpecialOffersSection = dynamic(() => import('./SpecialOffersSection'), { ssr: false })
const MarketingPopup = dynamic(() => import('./MarketingPopup'), { ssr: false })
const ExpressCheckoutModal = dynamic(() => import('./ExpressCheckoutModal'), { ssr: false })

export default function HomeClient() {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [marketingOffer, setMarketingOffer] = useState(null);
    const [isExpressOpen, setIsExpressOpen] = useState(false);
    const [selectedExpressProduct, setSelectedExpressProduct] = useState(null);
    const [bookingInitialData, setBookingInitialData] = useState({});

    useEffect(() => {
        const checkMarketing = async () => {
            const lastSeen = localStorage.getItem('last_marketing_popup');
            const now = Date.now();
            if (lastSeen && (now - parseInt(lastSeen) < 86400000)) { // 24 hours
                return;
            }

            try {
                const res = await fetch('/api/admin/marketing');
                const data = await res.json();
                if (data.offers && data.offers.length > 0) {
                    const active = data.offers.find(o => o.isActive && o.code);
                    if (active) {
                        setMarketingOffer(active);
                    }
                }
            } catch (e) { console.error("Marketing fetch error", e) }
        };
        const t = setTimeout(checkMarketing, 3500); // Delayed slightly more for performance
        return () => clearTimeout(t);
    }, []);

    const handlePopupClose = () => {
        setMarketingOffer(null);
        localStorage.setItem('last_marketing_popup', Date.now().toString());
    };

    return (
        <div className="bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-300">
            <Hero onBookClick={() => setIsBookingOpen(true)} />

            <BookingWidget />

            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                initialData={bookingInitialData}
            />

            {marketingOffer && (
                <MarketingPopup
                    offer={marketingOffer}
                    onClose={handlePopupClose}
                />
            )}

            <ExpressCheckoutModal
                isOpen={isExpressOpen}
                onClose={() => setIsExpressOpen(false)}
                product={selectedExpressProduct}
            />

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

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {destinations.slice(0, 12).map((route, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setBookingInitialData({
                                        pickup: 'Bandaranaike International Airport (CMB)',
                                        pickupCoords: { lat: 7.1804, lon: 79.8837 },
                                        dropoff: route.fullAddress || route.title.replace('Airport to ', ''),
                                        dropoffCoords: route.coords || null,
                                        tripType: 'one-way'
                                    });
                                    setIsBookingOpen(true);
                                }}
                                className="group p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-amber-900/10 dark:border-white/10 shadow-sm hover:shadow-2xl hover:border-amber-500/50 hover:-translate-y-1 transition-all duration-300 text-left flex flex-col justify-between h-40"
                            >
                                <div>
                                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 mb-2">
                                        <MapPin size={14} className="fill-current/20" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{route.meta}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-amber-600 transition-colors">
                                        {route.name || route.title.replace('Airport to ', '')}
                                    </h3>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Instant Quote</span>
                                    <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-all">
                                        <ArrowRight size={18} className="transform group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section >

            <ReviewStatsBar />
            <GoogleReviews />
            <RecentPosts />

            <section className="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="bg-emerald-900 rounded-3xl p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="absolute inset-0 opacity-10">
                            <Compass size={400} className="absolute -right-20 -bottom-20 text-white" />
                        </div>

                        <div className="relative z-10 max-w-xl text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Are you a Driver?</h2>
                            <p className="text-emerald-100 text-lg mb-8">
                                Join our exclusive fleet of professional chauffeurs. Get consistent bookings, fair rates, and become part of Sri Lanka's premium transport network.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <Link href="/driver/register" className="bg-white text-emerald-900 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors inline-flex items-center gap-2">
                                    Join Our Fleet <ArrowRight size={18} />
                                </Link>
                                <Link href="/driver/login" className="px-8 py-3 rounded-xl font-bold text-white border border-emerald-700 hover:bg-emerald-800 transition-colors">
                                    Driver Login
                                </Link>
                            </div>
                        </div>

                        <div className="relative z-10 w-full md:w-1/3 aspect-video bg-emerald-800/50 rounded-xl border border-emerald-500/20 backdrop-blur-sm flex items-center justify-center p-6 text-center transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="text-emerald-200">
                                <Star size={48} className="mx-auto mb-2 text-amber-400" />
                                <h3 className="font-bold text-white">Earn More</h3>
                                <p className="text-xs mt-1">Accept rides, track earnings, and get paid weekly.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Features />
        </div >
    )
}
