'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Percent, ArrowRight, Tag, Copy, Check, MapPin, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SpecialOffersSection() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedCode, setCopiedCode] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        fetch('/api/coupons?public=true')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const activeCoupons = data.filter(c => {
                        if (!c.expiryDate) return true;
                        return new Date(c.expiryDate) > new Date();
                    });
                    setCoupons(activeCoupons);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const next = useCallback(() => {
        if (coupons.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % coupons.length);
    }, [coupons.length]);

    const prev = useCallback(() => {
        if (coupons.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + coupons.length) % coupons.length);
    }, [coupons.length]);

    useEffect(() => {
        if (isPaused || coupons.length <= 1) return;
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [isPaused, next, coupons.length]);

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    if (!loading && coupons.length === 0) return null;

    return (
        <section id="offers" className="py-0 relative transition-colors duration-300">
            <section className="relative py-16 md:py-32 overflow-hidden bg-white border-t-8 border-black transition-colors duration-300"
                     onMouseEnter={() => setIsPaused(true)}
                     onMouseLeave={() => setIsPaused(false)}>

                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16">
                    {/* Header */}
                    <div className="mb-10 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-red-600 px-4 py-1.5 mb-6 border-2 border-red-600">
                                <Tag size={14} className="text-white" strokeWidth={3} />
                                <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Exclusive Deals</span>
                            </div>
                            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-black mb-6 leading-none uppercase tracking-tighter">
                                SAVE ON YOUR <br />
                                <span className="text-[#FACC15]">NEXT JOURNEY</span>
                            </h2>
                        </div>
                        
                        {/* Today's Offer Quick Badge (Mobile focus) */}
                        <div className="md:hidden flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border-2 border-black rotate-[1deg] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex flex-col items-center px-3 py-1 bg-white border border-black rounded-lg">
                                <span className="text-[8px] font-black text-[#7c3aed] leading-none mb-[1px]">TODAY'S</span>
                                <span className="text-sm font-black text-[#fbbf24] leading-none italic uppercase drop-shadow-[1px_1px_0px_#7c3aed]">OFFER</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-black leading-tight">FLAT 25% OFF</p>
                                <p className="text-[10px] font-bold text-slate-500">CODE: TODAY25</p>
                            </div>
                        </div>
                    </div>

                    {/* Coupon Slider */}
                    <div className="relative overflow-hidden mb-12">
                        <motion.div 
                            className="flex gap-6 md:gap-8"
                            animate={{ x: `-${currentIndex * (100 / (typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 2))}%` }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        >
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <div key={i} className="min-w-full md:min-w-[calc(50%-16px)] lg:min-w-[calc(33.33%-21px)] h-64 bg-black/5 border-4 border-black animate-pulse"></div>
                                ))
                            ) : coupons.map((coupon) => (
                                <div
                                    key={coupon._id}
                                    onClick={() => {
                                        const params = new URLSearchParams();
                                        params.set('coupon', coupon.code);
                                        if (coupon.applicableLocations && coupon.applicableLocations.length > 0) {
                                            params.set('destination', coupon.applicableLocations[0]);
                                        }
                                        window.location.href = `/?${params.toString()}#booking`;
                                    }}
                                    className="min-w-full md:min-w-[calc(50%-16px)] lg:min-w-[calc(50%-16px)] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 md:p-8 hover:shadow-2xl transition-all cursor-pointer group/card relative overflow-visible flex flex-col h-full min-h-[380px] shadow-xl group-hover:translate-y-[-8px]"
                                >
                                    {/* Ticket Notches */}
                                    <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-8 bg-white dark:bg-black rounded-full border border-slate-100 dark:border-slate-800 shadow-inner z-20" />
                                    <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-8 h-8 bg-white dark:bg-black rounded-full border border-slate-100 dark:border-slate-800 shadow-inner z-20" />

                                    <div className="relative z-10 flex flex-col h-full">
                                        {/* Header: Icon & Badge */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20 rotate-3 group-hover/card:rotate-0 transition-transform">
                                                <Percent size={28} strokeWidth={3} />
                                            </div>
                                            {coupon.applicableLocations && coupon.applicableLocations.length > 0 && (
                                                <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-full border border-orange-100">
                                                    <MapPin size={10} strokeWidth={3} />
                                                    {coupon.applicableLocations[0]}
                                                </span>
                                            )}
                                        </div>

                                        {/* Discount Info */}
                                        <div className="mb-2">
                                            <div className="flex items-baseline gap-1">
                                                <h3 className="text-6xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                                                    {coupon.discountType === 'percentage' ? `${coupon.value}%` : `${coupon.value}`}
                                                </h3>
                                                <span className="text-xl font-black text-slate-400 uppercase">{coupon.discountType === 'percentage' ? 'OFF' : 'LKR OFF'}</span>
                                            </div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Discount Coupon</p>
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-6 mt-2 leading-relaxed line-clamp-2">
                                            {coupon.description || `Valid for rides to/from ${coupon.applicableLocations?.[0] || 'selected locations'}`}
                                        </p>

                                        {/* Dashed Separator */}
                                        <div className="w-full border-t-2 border-dashed border-slate-100 dark:border-slate-800 mb-6 mx-0" />

                                        {/* Code Bar - Pushed to Bottom */}
                                        <div className="mt-auto space-y-6">
                                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group-hover/card:border-orange-500/30 transition-all">
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Use Code</p>
                                                    <p className="text-2xl font-black text-orange-600 tracking-tight">{coupon.code}</p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigator.clipboard.writeText(coupon.code);
                                                        setCopiedCode(coupon.code);
                                                        setTimeout(() => setCopiedCode(null), 2000);
                                                    }}
                                                    className={`px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition-all shadow-lg uppercase tracking-widest ${copiedCode === coupon.code ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-orange-500 text-black hover:bg-orange-600 shadow-orange-500/20'}`}
                                                >
                                                    {copiedCode === coupon.code ? <Check size={16} strokeWidth={3} /> : <Copy size={16} strokeWidth={3} />}
                                                    {copiedCode === coupon.code ? 'COPIED' : 'COPY'}
                                                </button>
                                            </div>

                                            {/* Final Footer Row */}
                                            <div className="flex items-center justify-between px-2">
                                                {coupon.expiryDate ? (
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        <Calendar size={12} />
                                                        <span>Valid until {new Date(coupon.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    </div>
                                                ) : <div />}
                                                <div className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-1 group-hover/card:gap-3 transition-all">
                                                    BOOK NOW <ArrowRight size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* View All Button */}
                    <div className="text-center">
                        <Link
                            href="/offers"
                            className="inline-flex items-center gap-4 bg-red-600 text-white px-10 py-5 border-4 border-red-600 font-black uppercase tracking-[0.2em] text-sm hover:translate-y-[-4px] active:translate-y-0 transition-all group shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                        >
                            VIEW ALL OFFERS
                            <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>
        </section>
    );
}
