'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin, Star, Compass } from 'lucide-react'
const BookingWidget = dynamic(() => import('./BookingWidget'), { 
    ssr: false,
    loading: () => <div className="h-[400px] bg-slate-50 dark:bg-zinc-900 animate-pulse rounded-[2rem]" />
})
const BookingModal = dynamic(() => import('./BookingModal'), { ssr: false })

// Dynamic imports with loading placeholders to prevent CLS
const LoadingBox = () => <div className="w-full h-40 bg-slate-100 dark:bg-white/5 animate-pulse border-2 border-black" />;

const FleetSection = dynamic(() => import('./FleetSection'), { 
    ssr: false,
    loading: () => <div className="py-24"><LoadingBox /></div>
})
const DestinationsSection = dynamic(() => import('./DestinationsSection'), { 
    ssr: false,
    loading: () => <div className="py-24"><LoadingBox /></div>
})
const HomeGallery = dynamic(() => import('./HomeGallery'), { 
    ssr: false,
    loading: () => <div className="py-24"><LoadingBox /></div>
})
const Features = dynamic(() => import('./Features'), { 
    ssr: false,
    loading: () => <div className="py-24"><LoadingBox /></div>
})
const ReviewStatsBar = dynamic(() => import('./ReviewStatsBar'), { 
    ssr: false,
    loading: () => <div className="h-20 bg-black animate-pulse" />
})
import { destinations } from '@/lib/destinations'

// Dynamic imports for components below the fold
const GoogleReviews = dynamic(() => import('./GoogleReviews'), { 
    ssr: false,
    loading: () => <LoadingBox />
})
const RecentPosts = dynamic(() => import('./RecentPosts'), { 
    ssr: false,
    loading: () => <LoadingBox />
})
const SpecialOffersSection = dynamic(() => import('./SpecialOffersSection'), { 
    ssr: false,
    loading: () => <LoadingBox />
})
const MobileAppSection = dynamic(() => import('./MobileAppSection'), { 
    ssr: false,
    loading: () => <LoadingBox />
})
const MarketingPopup = dynamic(() => import('./MarketingPopup'), { ssr: false })
const ExpressCheckoutModal = dynamic(() => import('./ExpressCheckoutModal'), { ssr: false })
const FAQSection = dynamic(() => import('./FAQSection'), { 
    ssr: false,
    loading: () => <LoadingBox />
})

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

    const handleHeroBook = (tabId) => {
        setBookingInitialData({ activeTab: tabId });
        setIsBookingOpen(true);
    };

    return (
        <div className="bg-white dark:bg-black overflow-hidden transition-colors duration-300">
            <BookingWidget />

            <div id="calculator" className="py-24 md:py-48 relative border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-5xl xs:text-6xl md:text-9xl font-black text-emerald-950 dark:text-white mb-10 uppercase tracking-tighter leading-[0.9] px-2">
                        SEAMLESS <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FACC15] to-[#FF5C00]">
                            AIRPORT TRANSFERS
                        </span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-14 text-sm md:text-base font-bold uppercase tracking-[0.4em] max-w-2xl mx-auto opacity-80">Predictable pricing • Premium vehicles • Professional chauffeurs</p>
                    <button
                        onClick={() => setIsBookingOpen(true)}
                        className="bg-emerald-600 text-white px-16 py-7 rounded-3xl font-black text-sm uppercase tracking-[0.2em] transition-all inline-flex items-center gap-4 group shadow-2xl shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 hover:-translate-y-1"
                        aria-label="Book Your Trip Now"
                    >
                        BOOK YOUR TRIP NOW
                        <ArrowRight size={22} className="group-hover:translate-x-4 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Floating Check Availability Sidebar - Luxury Style */}
            <button
                onClick={() => setIsBookingOpen(true)}
                className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] bg-emerald-600 text-white px-5 py-10 rounded-l-[2.5rem] hover:bg-emerald-700 transition-all group flex flex-col items-center gap-5 hidden md:flex shadow-[0_20px_50px_rgba(5,150,105,0.3)]"
            >
                <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse"></div>
                <span className="[writing-mode:vertical-lr] rotate-180 uppercase font-black tracking-[0.4em] text-[10px]">
                    CHECK AVAILABILITY
                </span>
                <ArrowRight size={22} className="rotate-90 group-hover:translate-y-2 transition-transform" />
            </button>
            
            <div className="h-4 md:h-10" /> {/* Spacing */}

            <FleetSection />

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

            <SpecialOffersSection />

            <DestinationsSection />
            <HomeGallery />

            <ReviewStatsBar />
            <MobileAppSection />
            <GoogleReviews />
            <RecentPosts />

            <section className="py-24 md:py-40 bg-white dark:bg-black border-t border-slate-100 dark:border-white/5 transition-colors">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-emerald-950 dark:bg-zinc-900 p-12 md:p-24 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-16 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] group">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px] group-hover:bg-emerald-600/20 transition-all duration-1000"></div>
                        
                        <div className="relative z-10 max-w-xl text-center md:text-left">
                            <h2 className="text-6xl md:text-8xl font-black mb-10 uppercase tracking-tighter leading-none text-white">ARE YOU <br /><span className="text-emerald-600">A DRIVER?</span></h2>
                            <p className="text-slate-400 text-base font-medium mb-14 leading-relaxed max-w-lg">
                                Join our exclusive fleet of professional chauffeurs. Get consistent bookings, fair rates, and become part of Sri Lanka's premium network.
                            </p>
                            <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                                <Link href="/driver/register" className="bg-emerald-600 text-white px-12 py-6 font-black uppercase tracking-widest text-xs hover:bg-white hover:text-emerald-950 transition-all rounded-2xl shadow-xl shadow-emerald-900/20 flex items-center gap-3">
                                    JOIN OUR FLEET <ArrowRight size={20} />
                                </Link>
                                <Link href="/driver/login" className="px-12 py-6 font-black uppercase tracking-widest text-xs text-white border border-white/20 hover:bg-white/10 transition-all rounded-2xl">
                                    DRIVER LOGIN
                                </Link>
                            </div>
                        </div>

                        <div className="relative z-10 w-full md:w-80 aspect-square bg-emerald-600 p-12 flex flex-col items-center justify-center text-center transform md:rotate-6 rounded-[3rem] shadow-2xl transition-transform group-hover:rotate-0 duration-700">
                            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md">
                                <Star size={40} className="text-white" fill="currentColor" />
                            </div>
                            <h3 className="text-4xl font-black text-white tracking-tighter uppercase mb-4">EARN MORE</h3>
                            <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">Accept rides • Track earnings • Weekly payouts</p>
                        </div>
                    </div>
                </div>
            </section>

            <FAQSection />

            <Features />

        </div >
    )
}
