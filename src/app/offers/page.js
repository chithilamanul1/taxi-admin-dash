'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Tag, ArrowRight, Loader2, Zap, Users, Briefcase, Calendar, Copy, Check, Ticket, Sparkles, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function OffersPage() {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedCode, setCopiedCode] = useState(null);

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
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-20">
            {/* Cinematic Hero */}
            <div className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-slate-900 border-b-8 border-amber-400/20">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1"
                        alt="Sri Lanka Travel"
                        className="w-full h-full object-cover brightness-[0.3]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 bg-amber-400 px-4 py-1.5 mb-8 transform -rotate-2"
                    >
                        <Ticket size={14} className="text-black" strokeWidth={3} />
                        <span className="text-xs font-black text-black uppercase tracking-[0.2em]">Active Promo Codes</span>
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter leading-none"
                    >
                        OFFERS & <span className="text-amber-400">DISCOUNTS</span>
                    </motion.h1>
                </div>
            </div>

            {/* Offers Grid Area */}
            <div className="container mx-auto px-6 py-12 max-w-7xl relative">
                
                {/* Today's Special Offer Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl p-8 md:p-12 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                        {/* Image/Logo Side */}
                        <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border-2 border-black rotate-[-2deg]">
                            <span className="text-xl font-black text-[#7c3aed] leading-none mb-1 uppercase tracking-tighter">
                                TODAY'S
                            </span>
                            <span className="text-5xl md:text-6xl font-black text-amber-400 leading-none uppercase italic drop-shadow-[4px_4px_0px_#7c3aed] tracking-tighter">
                                OFFER
                            </span>
                        </div>

                        {/* Content Side */}
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl md:text-5xl font-black text-black dark:text-white mb-4 uppercase tracking-tighter">
                                FLAT 25% OFF <span className="text-[#7c3aed]">TODAY!</span>
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 text-lg font-bold mb-8 uppercase tracking-wide">
                                Use the code below for any airport transfer booked today. Valid for all vehicle types!
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                                <div className="bg-slate-100 dark:bg-slate-800 px-8 py-4 rounded-2xl border-2 border-black border-dashed flex items-center gap-4">
                                    <code className="text-3xl font-black text-[#7c3aed] tracking-widest uppercase">TODAY25</code>
                                    <button 
                                        onClick={() => copyToClipboard('TODAY25')}
                                        className={`p-2 rounded-lg transition-all ${copiedCode === 'TODAY25' ? 'bg-emerald-500 text-white' : 'hover:bg-slate-200 text-slate-500'}`}
                                    >
                                        {copiedCode === 'TODAY25' ? <Check size={20} strokeWidth={3} /> : <Copy size={20} strokeWidth={3} />}
                                    </button>
                                </div>
                                <Link 
                                    href="/#booking"
                                    className="bg-black text-amber-400 px-10 py-4 rounded-full font-black uppercase tracking-widest text-sm hover:-translate-y-1 active:translate-y-0 transition-all shadow-md hover:shadow-lg"
                                >
                                    BOOK WITH OFFER
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl -z-10"></div>
                
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 gap-6">
                        <Loader2 className="animate-spin text-amber-500" size={48} strokeWidth={3} />
                        <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Scouring the Island for Deals...</p>
                    </div>
                ) : offers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {offers.map((coupon, i) => (
                            <motion.div 
                                key={coupon._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none hover:shadow-amber-400/10 hover:border-amber-400/30 transition-all duration-500 group relative flex flex-col h-full"
                            >
                                <div className="p-8 md:p-10 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-8 text-center sm:text-left">
                                        <div className="w-16 h-16 bg-slate-900 dark:bg-amber-400/5 text-amber-400 rounded-3xl flex items-center justify-center border border-slate-100 dark:border-slate-800 group-hover:rotate-6 transition-transform">
                                            <Tag size={28} strokeWidth={3} />
                                        </div>
                                        {coupon.applicableLocations?.length > 0 && (
                                            <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-full">
                                                <MapPin size={10} strokeWidth={3} />
                                                {coupon.applicableLocations[0]}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mb-8">
                                        <h3 className="text-5xl font-black text-slate-900 dark:text-white leading-none tracking-tighter mb-2">
                                            {coupon.discountType === 'percentage' ? `${coupon.value}%` : `Rs.${coupon.value}`}
                                            <span className="text-lg font-black text-slate-400 uppercase ml-2 tracking-normal">OFF</span>
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed line-clamp-2">
                                            {coupon.description || 'Valid for all airport transfers and rentals.'}
                                        </p>
                                    </div>

                                    {/* Coupon Logic */}
                                    <div className="mt-auto space-y-6">
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-700/50 flex items-center justify-between group-hover:border-amber-400/30 transition-all">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Promo Code</p>
                                                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{coupon.code}</p>
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(coupon.code)}
                                                className={`px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition-all shadow-lg uppercase tracking-widest ${copiedCode === coupon.code ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-amber-400 text-black hover:bg-amber-500 shadow-amber-400/20'}`}
                                            >
                                                {copiedCode === coupon.code ? <Check size={16} strokeWidth={3} /> : <Copy size={16} strokeWidth={3} />}
                                                {copiedCode === coupon.code ? 'COPIED' : 'COPY'}
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between px-2">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                <Calendar size={12} strokeWidth={2.5} />
                                                <span>EXP: {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'PERPETUAL'}</span>
                                            </div>
                                            <Link
                                                href="/?coupon=${coupon.code}#booking"
                                                className="text-[10px] font-black text-amber-500 hover:text-amber-600 uppercase tracking-widest flex items-center gap-1 group-hover:gap-3 transition-all"
                                            >
                                                BOOK NOW <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl">
                        <Tag className="mx-auto text-slate-200 dark:text-slate-800 mb-8" size={80} strokeWidth={1} />
                        <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter leading-none">All Vouchers Claimed</h3>
                        <p className="text-slate-500 max-w-md mx-auto font-medium">We're currenty preparing new seasonal flat rates. Check back soon for the latest Sri Lankan Taxi Coupons.</p>
                        <Link href="/" className="inline-flex mt-12 bg-slate-900 dark:bg-amber-400 text-white dark:text-black px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-105 transition-all">
                            RETURN TO TERMINAL
                        </Link>
                    </div>
                )}

                {/* Info Section */}
                <div className="mt-40 grid md:grid-cols-3 gap-10">
                    {[
                        { icon: Users, title: 'Group Friendly', text: 'Spacious vans available for up to 10 passengers with full luggage.' },
                        { icon: Briefcase, title: 'No Hidden Fees', text: 'What you see is what you pay. Our flat rates are all-inclusive.' },
                        { icon: Sparkles, title: 'Instant Booking', text: 'Secure your discount in seconds with our optimized express checkout.' }
                    ].map((item, i) => (
                        <div key={i} className="group p-2">
                            <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center mb-8 border border-slate-100 dark:border-slate-800 shadow-lg group-hover:bg-amber-400 group-hover:text-black transition-all">
                                <item.icon size={28} strokeWidth={2.5} />
                            </div>
                            <h4 className="font-black text-slate-900 dark:text-white uppercase text-xl tracking-tight mb-4">{item.title}</h4>
                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            
        </main>
    );
}
