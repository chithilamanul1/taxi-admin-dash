'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Briefcase, ShoppingBag, Wind, ArrowRight, Loader2, ChevronRight, Car, Settings, CheckCircle2, Shield, Calendar, CreditCard, ChevronLeft } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { destinations as allDestinations } from '@/lib/destinations';
import { calculateBasePrice } from '@/lib/pricing-util';
import { motion } from 'framer-motion';

const FleetSection = () => {
    const { convertPrice, rates } = useCurrency();
    const scrollRef = React.useRef(null);
    const [vehicles, setVehicles] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [dynamicDestinations, setDynamicDestinations] = React.useState([]);

    const popularPoints = ['Galle', 'Ahangama', 'Sigiriya', 'Mirissa', 'Ella', 'Kandy'];

    React.useEffect(() => {
        const fetchPricing = async () => {
            try {
                const res = await fetch('/api/pricing?category=airport-transfer');
                const json = await res.json();
                if (json.success) {
                    setVehicles(json.data);
                }
            } catch (err) {
                console.error("Fleet fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        const fetchDestinations = async () => {
            try {
                const res = await fetch('/api/admin/destinations');
                const data = await res.json();
                if (data.success) setDynamicDestinations(data.data);
            } catch (err) {
                console.error("Destinations fetch error:", err);
            }
        };
        fetchPricing();
        fetchDestinations();
    }, []);

    // Helper to get distance for a destination name
    const getDistance = (name) => {
        const dest = allDestinations.find(d => d.name === name || d.title.includes(name));
        return dest ? parseInt(dest.distance) : 0;
    };


    if (loading) {
        return (
            <div className="py-24 flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
                <Loader2 className="animate-spin text-[#FACC15]" size={48} />
            </div>
        );
    }

    return (
        <section className="py-24 bg-white dark:bg-[#0a0a0a]  overflow-hidden relative">
            <div className="container mx-auto px-6">
                <div className="mb-16">
                    <div className="text-[#FACC15] text-[12px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-3">OUR PREMIUM FLEET</div>
                    <div className="flex items-end justify-between gap-4">
                        <h2 className="text-6xl md:text-8xl font-black text-black dark:text-white uppercase tracking-tighter leading-[0.9]">
                            SELECT YOUR <span className="text-[#FACC15]">COMFORT</span>
                        </h2>
                        <div className="flex gap-4 mb-4">
                            <button 
                                onClick={() => scrollRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}
                                className="w-14 h-14 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all group"
                                aria-label="Previous Vehicle"
                            >
                                <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <button 
                                onClick={() => scrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
                                className="w-14 h-14 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all group"
                                aria-label="Next Vehicle"
                            >
                                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                <div 
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-8 pb-12 snap-x snap-mandatory no-scrollbar"
                >
                    {vehicles.map((vehicle, idx) => (
                        <div 
                            key={vehicle._id} 
                            className="flex-shrink-0 w-[85vw] md:w-[420px] snap-center flex flex-col bg-white dark:bg-zinc-900/50 rounded-t-[3rem] rounded-b-none shadow-2xl shadow-slate-200/30 dark:shadow-none border border-slate-100 dark:border-white/5 overflow-hidden group/f-card transition-all duration-500 hover:scale-[1.02]"
                        >
                            {/* Category Header */}
                            <div className="bg-slate-50 dark:bg-white/5 text-black dark:text-white p-5 text-center font-black uppercase tracking-[0.4em] text-[10px]">
                                {vehicle.category.replace('-', ' ')}
                            </div>

                            {/* Image Box */}
                            <div className="h-72 md:h-80 flex items-center justify-center bg-transparent relative overflow-hidden group">
                                <div className="absolute inset-0 flex items-center justify-center text-[120px] font-black text-black/[0.03] dark:text-white/[0.03] tracking-tighter select-none pointer-events-none uppercase">
                                    {vehicle.vehicleType.split('-')[0]}
                                </div>
                                <div className="relative w-[90%] h-[90%] transition-transform duration-500 group-hover:scale-110">
                                    <Image 
                                        src={vehicle.image || "/vehicles/minicar.png"} 
                                        alt={vehicle.name} 
                                        fill
                                        priority={idx < 2}
                                        className="object-contain scale-125 group-hover:scale-150 transition-transform duration-700" 
                                        sizes="(max-width: 768px) 85vw, 400px"
                                    />
                                </div>
                            </div>

                            {/* Description Box */}
                            <div className="p-6 flex-1">
                                <h3 className="text-2xl font-black text-black dark:text-white mb-6 uppercase tracking-tight">{vehicle.name}</h3>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-black dark:text-white">
                                        <div className="w-8 h-8 border border-slate-100 dark:border-white/10 flex items-center justify-center shrink-0">
                                            <Users size={16} />
                                        </div>
                                        {vehicle.capacity} PAX
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-black dark:text-white">
                                        <div className="w-8 h-8 border border-slate-100 dark:border-white/10 flex items-center justify-center shrink-0">
                                            <Briefcase size={16} />
                                        </div>
                                        {vehicle.luggage} LUG
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-black dark:text-white">
                                        <div className="w-8 h-8 border border-slate-100 dark:border-white/10 flex items-center justify-center shrink-0">
                                            <ShoppingBag size={16} />
                                        </div>
                                        {vehicle.handLuggage} HAND
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#00A99D]">
                                        <div className="w-8 h-8 border border-slate-100 dark:border-white/10 flex items-center justify-center shrink-0">
                                            <Wind size={16} />
                                        </div>
                                        AC ON
                                    </div>
                                </div>
                            </div>

                            {/* Pricing Marquee */}
                            <div className="overflow-hidden bg-[#FACC15] relative">
                                <motion.div 
                                    className="flex"
                                    animate={{ x: ["0%", "-50%"] }}
                                    transition={{ 
                                        duration: 15, 
                                        repeat: Infinity, 
                                        ease: "linear" 
                                    }}
                                >
                                    {[...popularPoints, ...popularPoints].map((point, i) => {
                                        const dist = getDistance(point);
                                        const priceLKR = calculateBasePrice(dist, vehicle, 'one-way', 'Airport', point, dynamicDestinations);
                                        const usdRate = rates['USD'] || 0.0031;
                                        const displayUSD = (priceLKR * usdRate).toFixed(0);
                                        
                                        return (
                                            <div key={`${point}-${i}`} className="flex flex-col items-center justify-center py-4 px-8 border-r border-black/10 min-w-[120px]">
                                                <span className="text-[8px] font-black uppercase tracking-widest mb-1 text-black/50">{point}</span>
                                                <span className="text-[10px] font-bold text-black leading-none">Rs {priceLKR.toLocaleString()}</span>
                                                <span className="text-[10px] font-black text-black">$ {displayUSD}</span>
                                            </div>
                                        );
                                    })}
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FleetSection;
