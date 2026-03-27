'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin, Star, Compass } from 'lucide-react'
import Hero from './Hero'
import BookingWidget from './BookingWidget'

// Dynamic imports for heavy components
const BookingModal = dynamic(() => import('./BookingModal'), { ssr: false })
const FleetSection = dynamic(() => import('./FleetSection'), { ssr: false })
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
            <Hero onBookClick={handleHeroBook} />

            <BookingWidget />

            <FleetSection />

            {/* Travel Gallery - "More Images" Request */}
            <section className="py-20 bg-slate-50 dark:bg-[#0a0a0a] border-t-8 border-black overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black text-black dark:text-white uppercase italic tracking-tighter">EXPLORE <span className="text-[#FACC15]">SRI LANKA</span></h2>
                            <p className="text-xs font-black uppercase tracking-widest text-black/40 dark:text-white/40 mt-2">More than just a ride. An experience of a lifetime.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 border-4 border-black flex items-center justify-center font-black italic">SL</div>
                            <div className="w-12 h-12 bg-black text-[#FACC15] border-4 border-black flex items-center justify-center animate-bounce">
                                <ArrowRight size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { name: 'SIGIRIYA ROCK', img: '/Hero/sigiriya.jpg', rotate: '-3deg' },
                            { name: 'KANDY TEMPLE', img: '/tours/kandy.jpg', rotate: '2deg' },
                            { name: 'GALLE FORT', img: '/tours/galle3.jpg', rotate: '-2deg' },
                            { name: 'WILD SAFARI YALA', img: '/tours/safari_yala.png', rotate: '4deg' },
                            { name: 'MIRISSA WHALES', img: '/Hero/hero_mirissa.jpg', rotate: '-2deg' },
                            { name: 'ELLA PEAK', img: '/Hero/ella.jpg', rotate: '3deg' },
                            { name: 'COLOMBO CITY', img: '/tours/colombo.jpg', rotate: '-1deg' },
                            { name: 'TEA ESTATES', img: '/Hero/view.jpg', rotate: '2deg' },
                        ].map((item, i) => (
                            <div key={i} className="group relative">
                                <div 
                                    className="bg-white p-4 border-[12px] border-black transition-transform hover:scale-105 hover:rotate-0 duration-500"
                                    style={{ transform: `rotate(${item.rotate})` }}
                                >
                                    <div className="relative aspect-square overflow-hidden mb-4 border-8 border-black">
                                        <Image src={item.img} alt={item.name} fill className="object-cover" loading="lazy" sizes="(max-width: 768px) 50vw, 25vw" />
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-tighter text-black italic">{item.name}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

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

            <div id="calculator" className="py-20 md:py-40 relative border-t-8 border-black">
                <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-5xl md:text-8xl font-black text-black dark:text-white mb-10 uppercase italic tracking-tighter leading-none">
                        SEAMLESS <br /><span className="text-[#FACC15]">AIRPORT TRANSFERS</span>
                    </h2>
                    <p className="text-black/40 dark:text-white/40 mb-14 text-sm font-black uppercase tracking-[0.3em] max-w-2xl mx-auto">Predictable pricing, premium vehicles, and professional chauffeurs waiting for you.</p>
                    <button
                        onClick={() => setIsBookingOpen(true)}
                        className="bg-[#FACC15] text-black px-16 py-6 font-black text-sm uppercase tracking-widest hover:translate-y-[-8px] transition-all shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] inline-flex items-center gap-4 group italic rounded-none border-4 border-black"
                    >
                        BOOK YOUR TRIP NOW
                        <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>

            <SpecialOffersSection />

            <section className="py-20 md:py-32 px-6 border-t border-black/5 dark:border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 md:mb-24 gap-10">
                        <div className="max-w-3xl">
                            <h2 className="text-4xl sm:text-5xl md:text-8xl font-black mb-6 md:mb-8 text-black dark:text-white uppercase italic tracking-tighter leading-tight md:leading-none break-words">
                                CURATED <span className="text-[#FACC15]">DESTINATIONS</span>
                            </h2>
                            <p className="text-black/40 dark:text-white/40 text-xs md:text-sm font-black uppercase tracking-[0.2em] leading-relaxed pr-4">Explore the most iconic locations in Sri Lanka with our specialized airport transfer services.</p>
                        </div>
                        <Link href="/prices" className="flex items-center gap-4 text-[#FACC15] font-black uppercase tracking-[0.2em] text-[10px] hover:text-black dark:hover:text-white transition-all italic underline decoration-2 underline-offset-8">
                            VIEW ALL RATES <ArrowRight size={18} />
                        </Link>
                    </div>

                    <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 pb-8 md:pb-0 snap-x snap-mandatory scrollbar-hide">
                        {destinations.slice(0, 16).map((route, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setBookingInitialData({
                                        pickup: 'Bandaranaike International Airport (CMB)',
                                        pickupCoords: { lat: 7.1804, lon: 79.8837 },
                                        dropoff: route.fullAddress || route.title.replace('Airport to ', ''),
                                        dropoffCoords: route.coords || null,
                                        tripType: 'one-way',
                                        couponCode: 'SAVE10'
                                    });
                                    setIsBookingOpen(true);
                                }}
                                className="group p-8 bg-white dark:bg-black border-4 border-black dark:border-white/20 hover:border-[#FACC15] dark:hover:border-[#FACC15] transition-all duration-300 text-left flex flex-col justify-between h-64 shrink-0 w-[280px] md:w-auto snap-start hover:translate-y-[-4px]"
                            >
                                <div>
                                    <div className="flex items-center gap-3 text-[#FACC15] mb-4">
                                        <MapPin size={14} />
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] truncate">{route.meta}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-black dark:text-white leading-tight uppercase italic tracking-tighter group-hover:text-[#FACC15] transition-colors line-clamp-2">
                                        {route.name || route.title.replace('Airport to ', '')}
                                    </h3>
                                </div>
                                <div className="flex items-center justify-between mt-6">
                                    <span className="text-[9px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.3em]">INSTANT QUOTE</span>
                                    <div className="w-12 h-12 bg-[#FACC15] text-black border-2 border-black flex items-center justify-center group-hover:bg-black group-hover:text-[#FACC15] transition-all">
                                        <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section >

            <ReviewStatsBar />
            <MobileAppSection />
            <GoogleReviews />
            <RecentPosts />

            <section className="py-20 md:py-32 bg-white dark:bg-black border-t border-black/10 dark:border-white/10 transition-colors">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="bg-[#FACC15] p-10 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 border-b-[20px] border-black rounded-[3rem]">
                        <div className="relative z-10 max-w-xl text-center md:text-left text-black">
                            <h2 className="text-5xl md:text-7xl font-black mb-8 uppercase italic tracking-tighter leading-none">ARE YOU <br /><span className="bg-black text-[#FACC15] px-4">A DRIVER?</span></h2>
                            <p className="text-black/70 text-sm font-black uppercase tracking-[0.2em] mb-12 leading-relaxed">
                                Join our exclusive fleet of professional chauffeurs. Get consistent bookings, fair rates, and become part of Sri Lanka's premium network.
                            </p>
                            <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                                <Link href="/driver/register" className="bg-black text-[#FACC15] px-12 py-5 font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all italic shadow-2xl rounded-xl">
                                    JOIN OUR FLEET <ArrowRight size={20} />
                                </Link>
                                <Link href="/driver/login" className="px-12 py-5 font-black uppercase tracking-widest text-xs text-black border-4 border-black/20 hover:border-black transition-all italic rounded-xl">
                                    DRIVER LOGIN
                                </Link>
                            </div>
                        </div>

                        <div className="relative z-10 w-full md:w-1/3 aspect-square bg-black p-10 flex flex-col items-center justify-center text-center transform rotate-3 hover:rotate-0 transition-all duration-500 border-4 border-black rounded-[2rem]">
                            <Star size={64} className="mb-6 text-[#FACC15]" />
                            <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-4">EARN MORE</h3>
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
