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
    const [todayOffer, setTodayOffer] = useState({
        percent: '25',
        code: 'TODAY25',
        isActive: true
    });
    const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

    useEffect(() => {
        // Fetch Coupons
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

        // Fetch Today's Offer Settings
        fetch('/api/settings')
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    const settings = result.data;
                    const percent = settings.find(s => s.key === 'TODAY_OFFER_PERCENT')?.value;
                    const code = settings.find(s => s.key === 'TODAY_OFFER_CODE')?.value;
                    const offerDay = settings.find(s => s.key === 'OFFER_DAY')?.value || 'Everyday';
                    
                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    const todayName = days[new Date().getDay()];
                    const isActive = offerDay === 'Everyday' || offerDay === todayName;

                    if (percent || code) {
                        setTodayOffer({
                            percent: percent || '25',
                            code: code || 'TODAY25',
                            isActive: isActive
                        });
                    }
                }
            })
            .catch(err => console.error('Failed to fetch today offer settings:', err));
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0);
            const diff = midnight - now;
            setTimeLeft({
                h: Math.floor(diff / (1000 * 60 * 60)),
                m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                s: Math.floor((diff % (1000 * 60)) / 1000)
            });
        }, 1000);
        return () => clearInterval(timer);
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
            <section className="relative py-8 overflow-hidden bg-white dark:bg-black transition-colors duration-300"
                     onMouseEnter={() => setIsPaused(true)}
                     onMouseLeave={() => setIsPaused(false)}>

                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 font-montserrat">
                    {/* Header */}
                    <div className="mb-10 md:mb-16 flex flex-col gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-4 py-1.5 mb-6 rounded-md shadow-sm">
                                <Tag size={12} className="text-emerald-600 dark:text-[#FACC15]" strokeWidth={3.5} />
                                <span className="text-xs font-black text-emerald-950 dark:text-white uppercase tracking-[0.2em] font-montserrat">Exclusive Deals</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 leading-none uppercase tracking-tighter font-montserrat">
                                SAVE ON YOUR <br />
                                <span className="text-emerald-600 dark:text-emerald-400 italic font-serif normal-case">Next Journey</span>
                            </h2>
                        </div>
                        
                        {/* Today's Offer — Prominent Hero Card */}
                        {todayOffer.isActive && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                onClick={() => {
                                    window.location.href = `/offers`;
                                }}
                                className="relative cursor-pointer group"
                            >
                                {/* Glow effect removed as requested */}
                                <div className="relative bg-gradient-to-br from-black via-zinc-900 to-black rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl group-hover:-translate-y-1 transition-all overflow-hidden">
                                    {/* Decorative corner accents */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FACC15]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FACC15]/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                                    
                                    <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5 md:gap-8">
                                        {/* Today's Offer Label */}
                                        <div className="flex flex-col items-center px-5 py-3 bg-[#FACC15] rounded-2xl shadow-lg shadow-yellow-500/30 shrink-0">
                                            <span className="text-[10px] font-black text-black leading-none mb-0.5 tracking-widest">TODAY'S</span>
                                            <span className="text-2xl font-black text-black leading-none italic uppercase">OFFER</span>
                                        </div>

                                        {/* Discount & Code */}
                                        <div className="flex-1 text-center sm:text-left">
                                            <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase leading-tight tracking-tight">
                                                FLAT <span className="text-[#FACC15]">{todayOffer.percent}%</span> OFF
                                            </p>
                                            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-2">
                                                <div className="bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-xl border border-white/10">
                                                    <span className="text-xs font-black text-white/60 tracking-widest">CODE: </span>
                                                    <span className="text-sm font-black text-[#FACC15] tracking-wider">{todayOffer.code}</span>
                                                </div>
                                                <div className="flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-2xl border-2 border-red-500/30 shadow-lg shadow-red-500/10">
                                                    <Clock size={16} className="text-red-500 animate-pulse" />
                                                    <span className="text-sm sm:text-base font-black text-red-500 tabular-nums tracking-wider">
                                                        {timeLeft.h.toString().padStart(2, '0')}:{timeLeft.m.toString().padStart(2, '0')}:{timeLeft.s.toString().padStart(2, '0')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* CTA Button */}
                                        <div className="shrink-0">
                                            <div className="bg-[#FACC15] text-black px-6 py-3 md:px-8 md:py-4 rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.2em] shadow-lg shadow-yellow-500/30 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-yellow-500/40 transition-all flex items-center gap-2">
                                                APPLY NOW <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>



                    {/* View All Button */}
                    <div className="text-center">
                        <Link
                            href="/offers"
                            className="inline-flex items-center gap-4 bg-black text-[#FACC15] px-10 py-4 rounded-full border border-black font-black uppercase tracking-[0.2em] text-sm hover:-translate-y-1 active:translate-y-0 transition-all group shadow-md hover:shadow-lg hover:bg-white hover:text-black hover:border-black"
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
