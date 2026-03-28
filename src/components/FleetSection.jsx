'use client';

import React from 'react';
import Image from 'next/image';
import { Users, Briefcase, ShoppingBag, Wind, ArrowRight, Loader2 } from 'lucide-react';
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
        <section className="py-24 bg-white dark:bg-[#0a0a0a] border-t-8 border-black overflow-hidden relative group/section">
            <div className="container mx-auto px-6">
                <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="bg-black text-[#FACC15] w-fit px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] mb-6 border-2 border-[#FACC15]">OUR PREMIUM FLEET</div>
                        <h2 className="text-5xl md:text-8xl font-black text-black dark:text-white uppercase tracking-tighter leading-none">
                            SELECT YOUR <span className="text-[#FACC15]">COMFORT</span>
                        </h2>
                    </div>
                </div>

                <div 
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-8 md:gap-12 pb-12 snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing"
                >
                    {vehicles.map((vehicle, idx) => (
                        <div 
                            key={vehicle._id} 
                            className="flex-shrink-0 w-[85vw] md:w-[480px] snap-center flex flex-col border-[16px] border-black bg-white dark:bg-[#111] hover:bg-slate-50 transition-all duration-300"
                        >

                            {/* Category Header - Sharp UI (White & Black) */}
                            <div className="bg-white text-black p-2 text-center border-b-[10px] border-black font-black uppercase tracking-[0.4em] text-[10px]">
                                {vehicle.category.replace('-', ' ')}
                            </div>

                            {/* Image Box - Bigger Images, still compact */}
                            <div className="p-2 h-60 md:h-80 flex items-center justify-center bg-slate-50 dark:bg-white/5 border-b-[10px] border-black relative overflow-hidden">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[140px] font-black text-black/[0.05] tracking-tighter select-none pointer-events-none uppercase">
                                    {vehicle.vehicleType.split('-')[0]}
                                </div>
                                <div className="relative w-full h-full transform group-hover:scale-110 transition-transform duration-700">
                                    <Image 
                                        src={vehicle.image || "/vehicles/minicar.png"} 
                                        alt={vehicle.name} 
                                        fill
                                        className="object-contain" 
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>
                            </div>

                            {/* Description Box - Tighter */}
                            <div className="p-4 md:p-8 flex-1 border-b-[10px] border-black">
                                <h3 className="text-xl md:text-2xl font-black text-black dark:text-white mb-4 uppercase tracking-tighter leading-none">{vehicle.name}</h3>
                                <div className="grid grid-cols-2 gap-3 md:gap-6">
                                    <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <div className="w-8 h-8 bg-black/5 dark:bg-white/5 border-2 border-black flex items-center justify-center shrink-0">
                                            <Users size={16} className="text-black dark:text-[#FACC15]" />
                                        </div>
                                        {vehicle.capacity} PAX
                                    </div>
                                    <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <div className="w-8 h-8 bg-black/5 dark:bg-white/5 border-2 border-black flex items-center justify-center shrink-0">
                                            <Briefcase size={16} className="text-black dark:text-[#FACC15]" />
                                        </div>
                                        {vehicle.luggage} LUG
                                    </div>
                                    <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <div className="w-8 h-8 bg-black/5 dark:bg-white/5 border-2 border-black flex items-center justify-center shrink-0">
                                            <ShoppingBag size={16} className="text-black dark:text-[#FACC15]" />
                                        </div>
                                        {vehicle.handLuggage} HAND
                                    </div>
                                    <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#00A99D]">
                                        <div className="w-8 h-8 bg-black/5 dark:bg-white/5 border-2 border-black flex items-center justify-center shrink-0">
                                            <Wind size={16} className="animate-pulse" />
                                        </div>
                                        AC ON
                                    </div>
                                </div>
                            </div>

                            {/* Auto-Sliding Dynamic Pricing Ticker - Slimmer */}
                            <div className="bg-[#FACC15] border-t-[10px] border-black p-0 overflow-hidden relative h-20 md:h-24 flex items-center">
                                <motion.div 
                                    animate={{ x: ["0%", "-50%"] }}
                                    transition={{ 
                                        duration: 30, 
                                        repeat: Infinity, 
                                        ease: "linear" 
                                    }}
                                    className="flex whitespace-nowrap"
                                >
                                    {[...popularPoints, ...popularPoints].map((point, i) => {
                                        const dist = getDistance(point);
                                        const priceLKR = calculateBasePrice(dist, vehicle, 'one-way', 'Airport', point, dynamicDestinations);
                                        const usdRate = rates['USD'] || 0.0031;
                                        const displayUSD = (priceLKR * usdRate).toFixed(0);
                                        
                                        return (
                                            <div key={`${point}-${i}`} className="inline-flex flex-col items-center justify-center min-w-[140px] px-6 relative py-3 h-20 md:h-24">
                                                {/* Single Line Divider */}
                                                <div className="absolute right-0 inset-y-0 w-[6px] bg-black translate-x-1/2"></div>
                                                <span className="text-[8px] font-black uppercase tracking-widest mb-1 text-black/40">{point}</span>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-xs md:text-sm font-black text-black">Rs {priceLKR.toLocaleString()}</span>
                                                    <span className="text-[10px] md:text-xs font-black text-black">
                                                        $ {displayUSD}
                                                    </span>
                                                </div>
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
