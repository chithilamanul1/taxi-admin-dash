'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Tag, ArrowRight, Loader2, Zap, Users, Briefcase, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function OffersPage() {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const res = await fetch('/api/coupons?public=true');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setOffers(data);
                }
            } catch (err) {
                console.error('Failed to fetch coupons', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCoupons();
    }, []);

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        // Simple visual feedback could be added here
    };

    return (
        <main className="min-h-screen bg-[#F3F4F6] pb-20">
            <Navbar />

            {/* Hero Section */}
            <div className="pt-32 pb-20 bg-[#111827] relative overflow-hidden border-b-[8px] border-black">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#FACC15]/5 -mr-48 -mt-48 blur-3xl rounded-none"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="yellow-badge mb-8 scale-90 md:scale-100 origin-left">OFFERS</div>
                    <h1 className="text-5xl md:text-8xl font-black text-white mb-6 uppercase italic tracking-tighter leading-none">
                        EXCLUSIVE <span className="text-[#FACC15]">SAVINGS</span>
                    </h1>
                    <p className="text-xl text-white/70 max-w-2xl font-black uppercase tracking-widest italic">
                        APPLY THESE CODES DURING CHECKOUT TO UNLOCK SPECIAL DISCOUNTS ON YOUR SRI LANKAN TRAVELS.
                    </p>
                </div>
            </div>

            {/* Offers Grid */}
            <div className="container mx-auto px-6 py-20 max-w-7xl">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 gap-6">
                        <Loader2 className="animate-spin text-black" size={48} strokeWidth={3} />
                        <p className="text-sm font-black text-black uppercase tracking-[0.3em] italic">Loading Best Prices...</p>
                    </div>
                ) : offers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {offers.map((coupon) => (
                            <div key={coupon._id} className="bg-white rounded-none border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-8px] transition-all duration-300 group relative">
                                {coupon.displayInWidget && (
                                    <div className="absolute top-0 right-0 px-4 py-2 bg-[#FACC15] text-black text-[10px] font-black uppercase tracking-widest z-10 border-l-4 border-b-4 border-black italic">
                                        FEATURED
                                    </div>
                                )}
                                <div className="p-8 md:p-10">
                                    <div className="flex items-center gap-6 mb-10">
                                        <div className="w-20 h-20 bg-black text-[#FACC15] rounded-none flex items-center justify-center border-4 border-black group-hover:bg-[#FACC15] group-hover:text-black transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                                            <Tag size={36} strokeWidth={3} />
                                        </div>
                                        <div>
                                            <h3 className="text-[32px] font-black text-black leading-none uppercase italic tracking-tighter mb-2">
                                                {coupon.discountType === 'percentage' ? `${coupon.value}% OFF` : `Rs. ${coupon.value.toLocaleString()} OFF`}
                                            </h3>
                                            <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em] italic">
                                                {coupon.description || 'Valid on all bookings'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-black border-4 border-black rounded-none p-6 mb-10 relative group/code overflow-hidden shadow-[8px_8px_0px_0px_#FACC15]">
                                        <div className="absolute inset-0 bg-[#FACC15] translate-y-full group-hover/code:translate-y-0 transition-transform duration-300 ease-out"></div>
                                        <div className="relative z-10 flex items-center justify-between">
                                            <span className="text-3xl font-black text-[#FACC15] group-hover/code:text-black transition-colors duration-300 tracking-[0.1em] uppercase italic">
                                                {coupon.code}
                                            </span>
                                            <button
                                                onClick={() => copyToClipboard(coupon.code)}
                                                className="px-6 py-3 bg-[#FACC15] text-black border-2 border-black rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
                                            >
                                                COPY
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t-4 border-black flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-[10px] font-black text-black/50 uppercase tracking-widest italic">
                                            <Calendar size={18} className="text-[#FACC15]" strokeWidth={3} />
                                            <span>EXP: {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'NEVER'}</span>
                                        </div>
                                        <Link
                                            href="/"
                                            className="flex items-center gap-3 text-xs font-black text-black uppercase tracking-widest hover:gap-5 transition-all bg-[#FACC15] px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] italic"
                                        >
                                            BOOK NOW <ArrowRight size={18} strokeWidth={3} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-none border-4 border-black shadow-[12px_12px_0px_0px_#FACC15] border-dashed">
                        <Tag className="mx-auto text-black/10 mb-8" size={80} strokeWidth={1} />
                        <h3 className="text-3xl font-black text-black mb-4 uppercase italic tracking-tighter">No Active Offers</h3>
                        <p className="text-black/50 font-black uppercase tracking-widest italic text-xs">Check back soon for seasonal flat rates and discounts.</p>
                        <Link href="/" className="inline-flex mt-10 font-black text-black uppercase tracking-[0.2em] italic bg-[#FACC15] px-8 py-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] transition-all">
                            RETURN TO TERMINAL
                        </Link>
                    </div>
                )}

                {/* Info Section */}
                <div className="mt-32 grid md:grid-cols-3 gap-12">
                    {[
                        { icon: Users, title: 'GROUP FRIENDLY', text: 'Vehicles available for up to 10 passengers with luggage.' },
                        { icon: Briefcase, title: 'AMPLE SPACE', text: 'Our vans guarantee enough space for all your belongings.' },
                        { icon: Zap, title: 'INSTANT BOOKING', text: 'Secure your flat rate in seconds with our express checkout.' }
                    ].map((item, i) => (
                        <div key={i} className="bg-white border-4 border-black p-10 rounded-none shadow-[8px_8px_0px_0px_#FACC15] relative group hover:translate-y-[-4px] transition-all">
                            <div className="w-16 h-16 bg-black text-[#FACC15] rounded-none flex items-center justify-center mb-8 border-4 border-black group-hover:bg-[#FACC15] group-hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <item.icon size={32} strokeWidth={3} />
                            </div>
                            <h4 className="font-black text-black uppercase text-xl tracking-tighter italic mb-4">{item.title}</h4>
                            <p className="text-xs text-black/60 font-black uppercase tracking-widest leading-loose italic">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </main>
    );
}
