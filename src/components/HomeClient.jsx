'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin, Star, Compass } from 'lucide-react'
import BookingWidget from './BookingWidget'

// Dynamic imports for heavy components
const BookingModal = dynamic(() => import('./BookingModal'), { ssr: false })
const FleetSection = dynamic(() => import('./FleetSection'), { ssr: false })
const DestinationsSection = dynamic(() => import('./DestinationsSection'), { ssr: false })
const HomeGallery = dynamic(() => import('./HomeGallery'), { ssr: false })
const Features = dynamic(() => import('./Features'), { ssr: false })
const ReviewStatsBar = dynamic(() => import('./ReviewStatsBar'), { ssr: false })
import { destinations } from '@/lib/destinations'

// Dynamic imports for components below the fold
const GoogleReviews = dynamic(() => import('./GoogleReviews'), { ssr: false })
const RecentPosts = dynamic(() => import('./RecentPosts'), { ssr: false })
const SpecialOffersSection = dynamic(() => import('./SpecialOffersSection'), { ssr: false })
const MobileAppSection = dynamic(() => import('./MobileAppSection'), { ssr: false })
const MarketingPopup = dynamic(() => import('./MarketingPopup'), { ssr: false })
const ExpressCheckoutModal = dynamic(() => import('./ExpressCheckoutModal'), { ssr: false })
const FAQSection = dynamic(() => import('./FAQSection'), { ssr: false })

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

            {/* Floating Check Availability Sidebar - Brutalist Style */}
            <button
                onClick={() => setIsBookingOpen(true)}
                className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] bg-black text-[#FACC15] px-4 py-8 rounded-l-3xl border-l-[6px] border-y-[6px] border-black hover:bg-[#FACC15] hover:text-black transition-all group flex flex-col items-center gap-4 hidden md:flex shadow-[-10px_0px_20px_rgba(0,0,0,0.2)]"
            >
                <span className="[writing-mode:vertical-lr] rotate-180 uppercase font-black tracking-[0.3em] text-[10px]">
                    CHECK AVAILABILITY
                </span>
                <ArrowRight size={20} className="rotate-90 group-hover:translate-y-2 transition-transform" />
            </button>
            
            <div className="h-10 md:h-20" /> {/* Spacing to prevent clash */}

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

            <div id="calculator" className="py-20 md:py-40 relative border-t-[16px] border-black">
                <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-5xl md:text-8xl font-black text-black dark:text-white mb-10 uppercase tracking-tighter leading-none">
                        SEAMLESS <br /><span className="text-[#FACC15]">AIRPORT TRANSFERS</span>
                    </h2>
                    <p className="text-black/40 dark:text-white/40 mb-14 text-sm font-black uppercase tracking-[0.3em] max-w-2xl mx-auto">Predictable pricing, premium vehicles, and professional chauffeurs waiting for you.</p>
                    <button
                        onClick={() => setIsBookingOpen(true)}
                        className="bg-[#FACC15] text-black px-16 py-6 font-black text-sm uppercase tracking-widest transition-all inline-flex items-center gap-4 group rounded-none border-[10px] border-black"
                    >
                        BOOK YOUR TRIP NOW
                        <ArrowRight size={22} className="group-hover:translate-x-4 transition-transform" />
                    </button>
                </div>
            </div>

            <SpecialOffersSection />

            <DestinationsSection />
            <HomeGallery />

            <ReviewStatsBar />
            <MobileAppSection />
            <GoogleReviews />
            <RecentPosts />

            <section className="py-20 md:py-32 bg-white dark:bg-black border-t-[16px] border-black transition-colors">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="bg-[#FACC15] p-10 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 border-b-[20px] border-black rounded-none">
                        <div className="relative z-10 max-w-xl text-center md:text-left text-black">
                            <h2 className="text-5xl md:text-7xl font-black mb-8 uppercase tracking-tighter leading-none">ARE YOU <br /><span className="bg-black text-[#FACC15] px-4">A DRIVER?</span></h2>
                            <p className="text-black/70 text-sm font-black uppercase tracking-[0.2em] mb-12 leading-relaxed">
                                Join our exclusive fleet of professional chauffeurs. Get consistent bookings, fair rates, and become part of Sri Lanka's premium network.
                            </p>
                            <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                                <Link href="/driver/register" className="bg-black text-[#FACC15] px-12 py-5 font-black uppercase tracking-widest text-xs hover:bg-[#FACC15] hover:text-black transition-all rounded-none border-[6px] border-black">
                                    JOIN OUR FLEET <ArrowRight size={20} />
                                </Link>
                                <Link href="/driver/login" className="px-12 py-5 font-black uppercase tracking-widest text-xs text-black border-[6px] border-black transition-all rounded-none">
                                    DRIVER LOGIN
                                </Link>
                            </div>
                        </div>

                        <div className="relative z-10 w-full md:w-1/3 aspect-square bg-black p-10 flex flex-col items-center justify-center text-center transform rotate-6 border-[8px] border-black rounded-none">
                            <Star size={64} className="mb-6 text-[#FACC15]" />
                            <h3 className="text-4xl font-black text-white tracking-tighter uppercase mb-4">EARN MORE</h3>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Accept rides, track earnings, and get paid weekly.</p>
                        </div>
                    </div>
                </div>
            </section>

            <FAQSection />

            <Features />

        </div >
    )
}
