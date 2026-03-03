'use client';

import React, { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import { Tag, ArrowRight, Loader2, Zap, Users, ShoppingBag, Calendar } from 'lucide-react';
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
        <main className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="pt-32 pb-16 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10 mix-blend-overlay"></div>
                <div className="container mx-auto px-4 relative z-10 text-center text-white">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-400/20 rounded-full border border-amber-400/30 text-amber-400 text-xs font-black uppercase tracking-widest mb-6">
                        <Tag size={14} fill="currentColor" /> Active Coupons
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight uppercase text-white">
                        Exclusive <span className="text-amber-400">Savings</span>
                    </h1>
                    <p className="text-lg text-slate-100/80 max-w-2xl mx-auto font-medium">
                        Apply these coupon codes during checkout to unlock special discounts on your Sri Lankan travels.
                    </p>
                </div>
            </div>

            {/* Offers Grid */}
            <div className="container mx-auto px-4 py-16">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 gap-4">
                        <Loader2 className="animate-spin text-slate-600" size={48} />
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Best Prices...</p>
                    </div>
                ) : offers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {offers.map((coupon) => (
                            <div key={coupon._id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative">
                                {coupon.displayInWidget && (
                                    <div className="absolute top-6 right-6 px-3 py-1 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full z-10 shadow-lg shadow-amber-200">
                                        Featured
                                    </div>
                                )}
                                <div className="p-8">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-600 border border-slate-100 group-hover:scale-110 group-hover:bg-slate-600 group-hover:text-white transition-all duration-500 shadow-inner">
                                            <Tag size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 leading-tight">
                                                {coupon.discountType === 'percentage' ? `${coupon.value}% OFF` : `Rs. ${coupon.value.toLocaleString()} OFF`}
                                            </h3>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                {coupon.description || 'Valid on all bookings'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-6 mb-8 relative group/code overflow-hidden">
                                        <div className="absolute inset-0 bg-slate-600 translate-y-full group-hover/code:translate-y-0 transition-transform duration-500 ease-out"></div>
                                        <div className="relative z-10 flex items-center justify-between">
                                            <span className="text-2xl font-black text-slate-900 group-hover/code:text-white transition-colors duration-500 tracking-wider">
                                                {coupon.code}
                                            </span>
                                            <button
                                                onClick={() => copyToClipboard(coupon.code)}
                                                className="px-4 py-2 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:scale-110 active:scale-95 transition-all"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                            <Calendar size={14} className="text-slate-600" />
                                            <span>Exp: {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'Never'}</span>
                                        </div>
                                        <Link
                                            href="/"
                                            className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest hover:gap-3 transition-all"
                                        >
                                            Book Now <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-300">
                        <Tag className="mx-auto text-slate-200 mb-4" size={64} />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Offers</h3>
                        <p className="text-slate-500">Check back soon for seasonal flat rates and discounts.</p>
                        <Link href="/" className="inline-flex mt-6 font-bold text-slate-600 hover:underline">Return to Booking Widget</Link>
                    </div>
                )}

                {/* Info Section */}
                <div className="mt-24 grid md:grid-cols-3 gap-8 text-center bg-slate-900/5 p-12 rounded-[3rem] border border-slate-900/10">
                    <div className="space-y-3">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto text-slate-600">
                            <Users size={24} />
                        </div>
                        <h4 className="font-black text-slate-900 uppercase text-sm tracking-widest">Group Friendly</h4>
                        <p className="text-xs text-slate-500 font-medium">Vehicles available for up to 10 passengers with luggage.</p>
                    </div>
                    <div className="space-y-3">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto text-slate-600">
                            <ShoppingBag size={24} />
                        </div>
                        <h4 className="font-black text-slate-900 uppercase text-sm tracking-widest">Ample Space</h4>
                        <p className="text-xs text-slate-500 font-medium">Our vans guarantee enough space for all your belongings.</p>
                    </div>
                    <div className="space-y-3">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto text-slate-600">
                            <Zap size={24} />
                        </div>
                        <h4 className="font-black text-slate-900 uppercase text-sm tracking-widest">Instant Booking</h4>
                        <p className="text-xs text-slate-500 font-medium">Secure your flat rate in seconds with our express checkout.</p>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
