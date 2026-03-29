'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
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
                        
                        {/* Navigation removed as requested */}
                    </div>

                    {/* Coupon Slider */}
                    <div className="relative overflow-hidden mb-12">
                        <motion.div 
                            className="flex gap-6 md:gap-8"
                            animate={{ x: `-${currentIndex * (100 / (typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : (window.innerWidth < 1024 ? 2 : 3)))}%` }}
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
                                    className="min-w-full md:min-w-[calc(50%-16px)] lg:min-w-[calc(33.33%-21px)] bg-[#FACC15] border-4 border-black p-6 md:p-8 hover:translate-y-[-8px] transition-all cursor-pointer group/card relative overflow-hidden flex flex-col justify-between h-full min-h-[400px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
                                >
                                    <div className="relative z-10">
                                        {/* Header: Icon & Badge */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 bg-red-600 border-2 border-red-600 flex items-center justify-center text-white">
                                                <Tag size={22} strokeWidth={3} />
                                            </div>
                                            {coupon.applicableLocations && coupon.applicableLocations.length > 0 && (
                                                <span className="inline-flex items-center gap-1 bg-white text-black px-3 py-1 text-[10px] font-black uppercase tracking-wider border-2 border-black">
                                                    <MapPin size={10} />
                                                    {coupon.applicableLocations[0]}
                                                </span>
                                            )}
                                        </div>

                                        {/* Discount */}
                                        <div className="mb-4">
                                            <h3 className="text-4xl md:text-5xl font-black text-black tracking-tighter leading-none uppercase">
                                                {coupon.discountType === 'percentage' ? `${coupon.value}%` : `Rs. ${coupon.value}`}
                                                <span className="text-lg ml-2 text-black/40 font-black">OFF</span>
                                            </h3>
                                        </div>

                                        {/* Description */}
                                        <p className="text-xs font-bold text-black/80 mb-6 leading-relaxed uppercase tracking-wider">
                                            {coupon.description || `Valid for rides to/from ${coupon.applicableLocations?.[0] || 'selected locations'}`}
                                        </p>
                                    </div>

                                    <div className="relative z-10 w-full">
                                        {/* Code Bar */}
                                        <div className="bg-red-600 p-3 flex items-center justify-between mb-4 border-2 border-red-600">
                                            <div>
                                                <p className="text-lg font-black text-white tracking-wider">{coupon.code}</p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigator.clipboard.writeText(coupon.code);
                                                    setCopiedCode(coupon.code);
                                                    setTimeout(() => setCopiedCode(null), 2000);
                                                }}
                                                className={`px-4 py-2 font-black text-xs flex items-center gap-2 transition-all border-2 border-white uppercase tracking-widest ${copiedCode === coupon.code ? 'bg-white text-red-600' : 'bg-transparent text-white hover:bg-white hover:text-red-600'}`}
                                                aria-label={copiedCode === coupon.code ? "Coupon code copied" : "Copy coupon code"}
                                            >
                                                {copiedCode === coupon.code ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                                                {copiedCode === coupon.code ? 'COPIED' : 'COPY'}
                                            </button>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between">
                                            {coupon.expiryDate && (
                                                <div className="flex items-center gap-2 text-[10px] font-black text-black/40 uppercase tracking-[0.15em]">
                                                    <Calendar size={12} />
                                                    <span>EXP: {new Date(coupon.expiryDate).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                            )}
                                            <div 
                                                className="bg-red-600 border-2 border-red-600 px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 group-hover/card:bg-white group-hover/card:text-red-600 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                                aria-label={`Book now using coupon ${coupon.code}`}
                                            >
                                                BOOK <ArrowRight size={12} aria-hidden="true" />
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
