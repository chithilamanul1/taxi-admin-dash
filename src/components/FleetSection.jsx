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
    const [vehicles, setVehicles] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

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
        fetchPricing();
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
        <section className="py-24 bg-white dark:bg-[#0a0a0a] border-t-8 border-black overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="bg-black text-[#FACC15] w-fit px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] italic mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">OUR PREMIUM FLEET</div>
                        <h2 className="text-5xl md:text-8xl font-black text-black dark:text-white uppercase italic tracking-tighter leading-none">
                            SELECT YOUR <span className="text-[#FACC15]">COMFORT</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto">
                    {vehicles.map((vehicle, idx) => (
                        <div key={vehicle._id} className="flex flex-col border-8 border-black bg-white dark:bg-[#111] shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] group hover:translate-y-[-8px] transition-all duration-500">

                            {/* Category Header */}
                            <div className="bg-black text-[#FACC15] p-5 text-center border-b-8 border-black font-black uppercase tracking-[0.4em] text-xs italic">
                                {vehicle.category.replace('-', ' ')}
                            </div>

                            {/* Image Box */}
                            <div className="p-12 h-80 flex items-center justify-center bg-slate-50 dark:bg-white/5 border-b-8 border-black relative overflow-hidden">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] font-black text-black/[0.05] italic tracking-tighter select-none pointer-events-none uppercase">
                                    {vehicle.vehicleType.split('-')[0]}
                                </div>
                                <div className="relative w-full h-full transform group-hover:scale-110 transition-transform duration-700">
                                    <Image 
                                        src={vehicle.image || "/vehicles/minicar.png"} 
                                        alt={vehicle.name} 
                                        fill
                                        className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)]" 
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>
                            </div>

                            {/* Description Box */}
                            <div className="p-10 flex-1 border-b-8 border-black">
                                <h3 className="text-3xl font-black text-black dark:text-white mb-8 uppercase italic tracking-tighter leading-none">{vehicle.name}</h3>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <div className="w-10 h-10 bg-black/5 dark:bg-white/5 border-4 border-black flex items-center justify-center shrink-0">
                                            <Users size={18} className="text-black dark:text-[#FACC15]" />
                                        </div>
                                        {vehicle.capacity} PAX
                                    </div>
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <div className="w-10 h-10 bg-black/5 dark:bg-white/5 border-4 border-black flex items-center justify-center shrink-0">
                                            <Briefcase size={18} className="text-black dark:text-[#FACC15]" />
                                        </div>
                                        {vehicle.luggage} LUG
                                    </div>
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <div className="w-10 h-10 bg-black/5 dark:bg-white/5 border-4 border-black flex items-center justify-center shrink-0">
                                            <ShoppingBag size={18} className="text-black dark:text-[#FACC15]" />
                                        </div>
                                        {vehicle.handLuggage} HAND
                                    </div>
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#00A99D]">
                                        <div className="w-10 h-10 bg-black/5 dark:bg-white/5 border-4 border-black flex items-center justify-center shrink-0">
                                            <Wind size={18} className="animate-pulse" />
                                        </div>
                                        AC ON
                                    </div>
                                </div>
                            </div>

                            {/* Auto-Sliding Dynamic Pricing Ticker */}
                            <div className="bg-[#FACC15] border-t-0 p-0 overflow-hidden relative h-24 flex items-center">
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
                                        const priceLKR = calculateBasePrice(dist, vehicle);
                                        
                                        return (
                                            <div key={`${point}-${i}`} className="inline-flex flex-col items-center justify-center min-w-[160px] px-8 border-r-4 border-black/10 py-4 h-24">
                                                <span className="text-[9px] font-black uppercase tracking-widest mb-1 text-black/40 italic">{point}</span>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-sm font-black text-black">Rs {priceLKR.toLocaleString()}</span>
                                                    <span className="text-[10px] font-black text-black/50">
                                                        $ {convertPrice(priceLKR, 'LKR', 'USD').toFixed(0)}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </motion.div>
                                
                                {/* Fade Edges */}
                                <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#FACC15] to-transparent z-10"></div>
                                <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#FACC15] to-transparent z-10"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FleetSection;
