'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MapPin, Star, Users, ShieldCheck, Clock } from 'lucide-react';

const StatNumber = ({ value }) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const nodeRef = useRef(null);

    const numericMatch = value.match(/[\d.]+/);
    const numericStr = numericMatch ? numericMatch[0] : "0";
    const numeric = parseFloat(numericStr);
    const suffix = value.replace(numericStr, '');
    const isFloat = numericStr.includes('.');

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                }
            },
            { threshold: 0.1 }
        );
        if (nodeRef.current) observer.observe(nodeRef.current);
        return () => observer.disconnect();
    }, [hasAnimated]);

    useEffect(() => {
        if (!hasAnimated) return;
        let startTimestamp = null;
        const duration = 2000;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(progress * numeric);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }, [hasAnimated, numeric]);

    const displayValue = isFloat ? count.toFixed(1) : Math.floor(count);
    return <span ref={nodeRef}>{displayValue}{suffix}</span>;
}

export default function StatsSection() {
    const [realBookingCount, setRealBookingCount] = useState(0);

    useEffect(() => {
        fetch('/api/bookings/count')
            .then(res => res.json())
            .then(data => {
                if (data.count) setRealBookingCount(data.count);
            })
            .catch(err => console.error("Error fetching booking count:", err));
    }, []);

    return (
        <section className="py-8 md:py-12 relative overflow-hidden bg-slate-50/30 dark:bg-zinc-950/30">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-[#FACC15] text-black px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.3em] mb-4 shadow-sm">
                        <Clock size={12} strokeWidth={4} /> OUR LEGACY SINCE 2010
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-emerald-950 dark:text-white uppercase tracking-tighter leading-[0.9] mb-4">
                        ELEVATING <span className="text-[#FACC15]">SRI LANKA'S</span> <br />
                        TRAVEL EXPERIENCE
                    </h2>
                    <p className="max-w-2xl mx-auto text-slate-500 dark:text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest leading-relaxed opacity-80">
                        From humble beginnings to being the island's most <Link href="/airport-transfer" className="text-emerald-600 dark:text-[#FACC15] hover:underline">trusted transfer partner</Link>. <br />
                        We don't just move people; we create journeys that last a lifetime.
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    {[
                        { label: 'Happy Clients', value: `${(8000 + realBookingCount).toLocaleString()}+`, icon: Users },
                        { label: 'Tours Completed', value: `${(8500 + realBookingCount).toLocaleString()}+`, icon: MapPin },
                        { label: 'Experience Years', value: '14+', icon: Star },
                        { label: 'Expert Drivers', value: '310+', icon: ShieldCheck }
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white dark:bg-zinc-900 p-4 md:p-6 rounded-[1.5rem] border border-slate-100 dark:border-white/5 shadow-md flex flex-col items-center group hover:-translate-y-1 transition-all duration-300">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-950 dark:bg-white/5 rounded-xl flex items-center justify-center mb-3 md:mb-4 shadow-sm group-hover:bg-[#FACC15] group-hover:text-black transition-colors duration-300">
                                <stat.icon size={20} className="text-[#FACC15] group-hover:text-black md:w-6 md:h-6" strokeWidth={2.5} />
                            </div>
                            <span className="text-2xl md:text-4xl font-black text-emerald-950 dark:text-white uppercase tracking-tighter mb-1">
                                <StatNumber value={stat.value} />
                            </span>
                            <span className="text-[8px] md:text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em] text-center">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 -mr-64 -mt-64 w-[600px] h-[600px] bg-[#FACC15]/5 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 left-0 -ml-64 -mb-64 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]"></div>
        </section>
    );
}
