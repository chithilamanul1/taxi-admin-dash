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
        <section className="py-24 bg-white dark:bg-[#0a0a0a] border-t-2 border-black overflow-hidden relative">
            <div className="container mx-auto px-6">
                <div className="mb-16">
                    <div className="bg-[#FACC15] text-black w-fit px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] mb-4">OUR PREMIUM FLEET</div>
                    <h2 className="text-6xl md:text-8xl font-black text-black dark:text-white uppercase tracking-tighter leading-[0.9]">
                        SELECT YOUR <span className="text-[#FACC15]">COMFORT</span>
                    </h2>
                </div>

                <div 
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-8 pb-12 snap-x snap-mandatory no-scrollbar"
                >
                    {vehicles.map((vehicle, idx) => (
                        <div 
                            key={vehicle._id} 
                            className="flex-shrink-0 w-[85vw] md:w-[400px] snap-center flex flex-col border-[3px] border-black bg-white dark:bg-zinc-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200"
                        >
                            {/* Category Header */}
                            <div className="bg-white dark:bg-zinc-800 text-black dark:text-white p-3 text-center border-b-2 border-black font-black uppercase tracking-[0.3em] text-[10px]">
                                {vehicle.category.replace('-', ' ')}
                            </div>

                            {/* Image Box */}
                            <div className="h-64 md:h-72 flex items-center justify-center bg-[#F1F3F4] dark:bg-zinc-800 border-b-2 border-black relative overflow-hidden group">
                                <div className="absolute inset-0 flex items-center justify-center text-[100px] font-black text-black/[0.03] dark:text-white/[0.03] tracking-tighter select-none pointer-events-none uppercase">
                                    {vehicle.vehicleType.split('-')[0]}
                                </div>
                                <div className="relative w-4/5 h-4/5 transition-transform duration-500 group-hover:scale-110">
                                    <Image 
                                        src={vehicle.image || "/vehicles/minicar.png"} 
                                        alt={vehicle.name} 
                                        fill
                                        priority={idx < 2}
                                        className="object-contain" 
                                        sizes="(max-width: 768px) 85vw, 400px"
                                    />
                                </div>
                            </div>

                            {/* Description Box */}
                            <div className="p-6 flex-1">
                                <h3 className="text-2xl font-black text-black dark:text-white mb-6 uppercase tracking-tight">{vehicle.name}</h3>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-black dark:text-white">
                                        <div className="w-8 h-8 border-2 border-black flex items-center justify-center shrink-0">
                                            <Users size={16} />
                                        </div>
                                        {vehicle.capacity} PAX
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-black dark:text-white">
                                        <div className="w-8 h-8 border-2 border-black flex items-center justify-center shrink-0">
                                            <Briefcase size={16} />
                                        </div>
                                        {vehicle.luggage} LUG
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-black dark:text-white">
                                        <div className="w-8 h-8 border-2 border-black flex items-center justify-center shrink-0">
                                            <ShoppingBag size={16} />
                                        </div>
                                        {vehicle.handLuggage} HAND
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#00A99D]">
                                        <div className="w-8 h-8 border-2 border-black flex items-center justify-center shrink-0">
                                            <Wind size={16} className="animate-pulse" />
                                        </div>
                                        AC ON
                                    </div>
                                </div>
                            </div>

                            {/* Pricing Grid */}
                            <div className="grid grid-cols-4 border-t-2 border-black">
                                {popularPoints.slice(0, 4).map((point, i) => {
                                    const dist = getDistance(point);
                                    const priceLKR = calculateBasePrice(dist, vehicle, 'one-way', 'Airport', point, dynamicDestinations);
                                    const usdRate = rates['USD'] || 0.0031;
                                    const displayUSD = (priceLKR * usdRate).toFixed(0);
                                    
                                    return (
                                        <div key={point} className={`flex flex-col items-center justify-center py-3 border-r-2 last:border-r-0 border-black bg-[#FACC15] text-black`}>
                                            <span className="text-[7px] font-black uppercase tracking-tighter mb-1 opacity-50">{point}</span>
                                            <span className="text-[10px] font-bold leading-none">Rs {priceLKR.toLocaleString()}</span>
                                            <span className="text-[10px] font-black">$ {displayUSD}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FleetSection;
