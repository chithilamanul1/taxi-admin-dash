'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin, Star, Compass, Clock, Users, ShieldCheck, Sparkles } from 'lucide-react'
import BookingWidget from './BookingWidget'
const BookingModal = dynamic(() => import('./BookingModal'), { ssr: false })
const CustomTourBooking = dynamic(() => import('./CustomTourBooking'), {
    ssr: false,
    loading: () => <div className="min-h-[500px] bg-slate-50 dark:bg-zinc-900 animate-pulse rounded-[2.5rem]" />
})

// Dynamic imports with loading placeholders to prevent CLS
const LoadingBox = () => <div className="w-full h-40 bg-slate-100 dark:bg-white/5 animate-pulse border border-slate-100 dark:border-white/10" />;

const FleetSection = dynamic(() => import('./FleetSection'), { 
    loading: () => <div className="min-h-[800px] bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-white/10 animate-pulse" />
})
const DestinationsSection = dynamic(() => import('./DestinationsSection'), { 
    loading: () => <div className="min-h-[1200px] bg-white dark:bg-zinc-900 animate-pulse" />
})
const HomeGallery = dynamic(() => import('./HomeGallery'), { 
    loading: () => <div className="min-h-[600px] bg-white dark:bg-zinc-900 animate-pulse" />
})
const Features = dynamic(() => import('./Features'), { 
    loading: () => <div className="min-h-[400px] bg-white dark:bg-zinc-900 animate-pulse" />
})
const ReviewStatsBar = dynamic(() => import('./ReviewStatsBar'), { 
    loading: () => <div className="h-20 bg-black animate-pulse" />
})
import { destinations } from '@/lib/destinations'

// Dynamic imports for components below the fold
const GoogleReviews = dynamic(() => import('./GoogleReviews'), { 
    loading: () => <div className="min-h-[400px] bg-white dark:bg-[#0a0a0a] animate-pulse" />
})
const RecentPosts = dynamic(() => import('./RecentPosts'), { 
    loading: () => <div className="min-h-[400px] bg-white dark:bg-[#0a0a0a] animate-pulse" />
})

const SpecialOffersSection = dynamic(() => import('./SpecialOffersSection'), { 
    loading: () => <div className="min-h-[500px] bg-white dark:bg-[#0a0a0a] animate-pulse" />
})
const MobileAppSection = dynamic(() => import('./MobileAppSection'), { 
    loading: () => <div className="min-h-[600px] bg-white dark:bg-[#0a0a0a] animate-pulse" />
})
const MarketingPopup = dynamic(() => import('./MarketingPopup'), { ssr: false })
const ExpressCheckoutModal = dynamic(() => import('./ExpressCheckoutModal'), { ssr: false })
const FAQSection = dynamic(() => import('./FAQSection'), { 
    loading: () => <div className="min-h-[500px] bg-white dark:bg-[#0a0a0a] animate-pulse" />
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

            <div id="calculator" className="py-20 md:py-32 relative border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.06] dark:opacity-[0.02] pointer-events-none z-0"></div>
                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-12">
                        <span className="text-emerald-600 dark:text-[#FACC15] text-[10px] font-black tracking-[0.4em] uppercase mb-4 block">
                            Explore Premium Island Tours
                        </span>
                        <h2 className="text-4xl md:text-7xl font-black text-emerald-950 dark:text-white uppercase tracking-tighter leading-none mb-6">
                            Tailored <span className="text-emerald-600 dark:text-[#FACC15] italic font-serif">Round Tour</span> Packages
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-bold uppercase tracking-[0.3em] max-w-xl mx-auto opacity-80">
                            Fixed Rates • Custom Stopovers • Elite Vehicles
                        </p>
                    </div>
                    <CustomTourBooking />
                </div>
            </div>

            <SpecialOffersSection />

            <DestinationsSection />

            {/* Floating Check Availability Sidebar - Luxury Style */}
            <button
                onClick={() => setIsBookingOpen(true)}
                className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] bg-[#FACC15] text-black px-5 py-10 border-l-[3px] border-y-[3px] border-slate-200 dark:border-white/10 hover:bg-yellow-400 transition-all group flex flex-col items-center gap-5 hidden md:flex shadow-xl shadow-slate-200/50"
            >
                <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></div>
                <span className="[writing-mode:vertical-lr] rotate-180 uppercase font-black tracking-[0.4em] text-[10px]">
                    CHECK AVAILABILITY
                </span>
                <ArrowRight size={22} className="rotate-90 group-hover:translate-y-2 transition-transform" />
            </button>
            
            <div className="h-4 md:h-10" /> {/* Spacing */}

            <ReviewStatsBar />
            <GoogleReviews />
            <FleetSection />

            {/* Legacy & Stats Section */}
            <section className="py-24 md:py-40 relative overflow-hidden bg-slate-50/30 dark:bg-zinc-950/30">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-center text-center mb-24">
                        <div className="inline-flex items-center gap-3 bg-[#FACC15] text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] mb-10 shadow-xl shadow-yellow-500/20">
                            <Clock size={14} strokeWidth={4} /> OUR LEGACY SINCE 2010
                        </div>
                        <h2 className="text-5xl md:text-8xl font-black text-emerald-950 dark:text-white uppercase tracking-tighter leading-[0.85] mb-12">
                            ELEVATING <span className="text-[#FACC15]">SRI LANKA'S</span> <br />
                            TRAVEL EXPERIENCE
                        </h2>
                        <p className="max-w-2xl mx-auto text-slate-500 dark:text-slate-400 text-sm md:text-lg font-bold uppercase tracking-widest leading-relaxed opacity-80">
                            From humble beginnings to being the island's most trusted transfer partner. <br />
                            We don't just move people; we create journeys that last a lifetime.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                        {[
                            { label: 'Happy Clients', value: '10k+', icon: Users },
                            { label: 'Tours Completed', value: '1.2k+', icon: MapPin },
                            { label: 'Years Excellence', value: '14+', icon: Star },
                            { label: 'Elite Drivers', value: '80+', icon: ShieldCheck }
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-2xl shadow-slate-200/50 dark:shadow-none flex flex-col items-center group hover:-translate-y-4 transition-all duration-500">
                                <div className="w-20 h-20 bg-emerald-950 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-8 shadow-xl group-hover:bg-[#FACC15] group-hover:text-black transition-colors duration-500">
                                    <stat.icon size={32} className="text-[#FACC15] group-hover:text-black" strokeWidth={2.5} />
                                </div>
                                <span className="text-5xl md:text-6xl font-black text-emerald-950 dark:text-white uppercase tracking-tighter mb-2">{stat.value}</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] text-center">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mr-64 -mt-64 w-[600px] h-[600px] bg-[#FACC15]/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 -ml-64 -mb-64 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]"></div>
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

            {/* AI Trip Planner Section */}
            <section className="py-24 md:py-32 bg-emerald-950 dark:bg-[#0a0a0a] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="inline-flex items-center gap-3 bg-[#FACC15] text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] mb-10 shadow-xl shadow-yellow-500/20">
                                <Sparkles size={14} strokeWidth={4} /> NEW: SMART TRAVEL
                            </div>
                            <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-10">
                                PLAN YOUR <span className="text-[#FACC15]">TRIP WITH AI</span>
                            </h2>
                            <p className="text-slate-400 text-lg md:text-xl font-bold uppercase tracking-widest leading-relaxed opacity-90 mb-12">
                                Describe your dream vacation, and our AI will craft a personalized itinerary instantly. 
                                From hidden gems to popular landmarks, let technology guide your next adventure.
                            </p>
                            <Link 
                                href="#calculator"
                                className="inline-flex items-center gap-3 bg-white text-emerald-950 px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#FACC15] hover:text-black transition-all shadow-2xl group"
                            >
                                START PLANNING NOW
                                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                        <div className="order-1 lg:order-2 relative group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#FACC15]/20 to-transparent rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                            <div className="relative bg-zinc-900 border border-white/10 rounded-[4rem] p-4 shadow-2xl overflow-hidden aspect-[4/3] flex items-center justify-center">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-transparent"></div>
                                <div className="relative z-10 text-center p-10">
                                    <div className="w-24 h-24 bg-[#FACC15] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-yellow-500/40 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                                        <Sparkles size={48} className="text-black" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-2 w-48 bg-white/20 rounded-full mx-auto"></div>
                                        <div className="h-2 w-32 bg-white/10 rounded-full mx-auto"></div>
                                        <div className="h-2 w-40 bg-white/20 rounded-full mx-auto"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Decorative BG pattern */}
                <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
                    <Compass size={400} strokeWidth={1} className="text-white animate-spin-slow" />
                </div>
            </section>

            <HomeGallery />

            <MobileAppSection />
            <RecentPosts />

            <section className="py-24 md:py-40 bg-white dark:bg-black border-t border-slate-100 dark:border-white/5 transition-colors">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-emerald-950 dark:bg-zinc-900 p-12 md:p-24 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-16 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] group">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px] group-hover:bg-emerald-600/20 transition-all duration-1000"></div>
                        
                        <div className="relative z-10 max-w-xl text-center md:text-left">
                            <h2 className="text-6xl md:text-8xl font-black mb-10 uppercase tracking-tighter leading-none text-white">ARE YOU <br /><span className="text-[#FACC15]">A DRIVER?</span></h2>
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

                        <div className="relative z-10 w-full md:w-80 aspect-square bg-[#FACC15] p-12 flex flex-col items-center justify-center text-center transform md:rotate-6 border border-slate-100 dark:border-white/10 shadow-2xl transition-transform group-hover:rotate-0 duration-700 rounded-[3rem]">
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
