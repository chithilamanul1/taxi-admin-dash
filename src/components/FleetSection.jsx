'use client';

import React from 'react';
import { Users, Briefcase, ShoppingBag, Wind, CheckCircle2 } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const fleetData = [
    {
        category: "Mini Cars",
        name: "Suzuki Wagon R / Similar",
        image: "/vehicles/minicar.png",
        capacity: 2,
        luggage: 2,
        handLuggage: 2,
        features: ["Air Conditioning", "Professional Driver", "Clean & Comfortable"],
        popularRoutes: [
            { name: "Galle", priceLKR: 18500 },
            { name: "Ahangama", priceLKR: 19500 },
            { name: "Sigiriya", priceLKR: 28500 }
        ]
    },
    {
        category: "Sedan Cars",
        name: "Toyota Prius / Axio / Similar",
        image: "/vehicles/sedan2.png",
        capacity: 3,
        luggage: 3,
        handLuggage: 2,
        features: ["Extra Legroom", "Hybrid Comfort", "Climate Control"],
        popularRoutes: [
            { name: "Galle", priceLKR: 21500 },
            { name: "Ahangama", priceLKR: 22500 },
            { name: "Sigiriya", priceLKR: 32500 }
        ]
    }
];

const FleetSection = () => {
    const { convertPrice, rates } = useCurrency();

    return (
        <section className="py-24 bg-white dark:bg-[#0a0a0a] border-t-4 border-black">
            <div className="container mx-auto px-6">
                <div className="mb-16">
                    <div className="yellow-badge w-fit mb-6">OUR FLEET</div>
                    <h2 className="text-5xl md:text-7xl font-black text-black dark:text-white uppercase italic tracking-tighter leading-none">
                        SELECT YOUR <span className="text-[#FACC15]">COMFORT</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {fleetData.map((item, idx) => (
                        <div key={idx} className="flex flex-col border-4 border-black bg-white dark:bg-[#111]">

                            {/* Category Header */}
                            <div className="bg-black text-[#FACC15] p-4 text-center border-b-4 border-black font-black uppercase tracking-[0.3em] text-sm">
                                {item.category}
                            </div>

                            {/* Image Box */}
                            <div className="p-8 h-64 flex items-center justify-center bg-slate-50 dark:bg-white/5 border-b-4 border-black relative overflow-hidden group">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] font-black text-black/[0.03] italic tracking-tighter select-none pointer-events-none">
                                    0{idx + 1}
                                </div>
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className={`w-full max-h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500 
                                        ${item.category.includes('Sedan') || item.category.includes('Mini') ? 'scale-[1.4] md:scale-[1.5]' : ''}`} 
                                />
                            </div>

                            {/* Description Box */}
                            <div className="p-8 flex-1 border-b-4 border-black">
                                <h3 className="text-xl font-black text-black dark:text-white mb-6 uppercase italic tracking-tight">{item.name}</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                        <div className="w-8 h-8 bg-black/5 dark:bg-white/5 border-2 border-black flex items-center justify-center shrink-0">
                                            <Users size={16} className="text-black dark:text-[#FACC15]" />
                                        </div>
                                        {item.capacity} Passengers
                                    </li>
                                    <li className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                        <div className="w-8 h-8 bg-black/5 dark:bg-white/5 border-2 border-black flex items-center justify-center shrink-0">
                                            <Briefcase size={16} className="text-black dark:text-[#FACC15]" />
                                        </div>
                                        {item.luggage} Luggages
                                    </li>
                                    <li className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                        <div className="w-8 h-8 bg-black/5 dark:bg-white/5 border-2 border-black flex items-center justify-center shrink-0">
                                            <ShoppingBag size={16} className="text-black dark:text-[#FACC15]" />
                                        </div>
                                        {item.handLuggage} Hand Baggages
                                    </li>
                                    <li className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                        <div className="w-8 h-8 bg-black/5 dark:bg-white/5 border-2 border-black flex items-center justify-center shrink-0 text-emerald-500">
                                            <Wind size={16} />
                                        </div>
                                        Fully Air Conditioned
                                    </li>
                                </ul>
                            </div>

                            {/* Price Table Footer */}
                            <div className="bg-[#FACC15] p-1 flex">
                                {item.popularRoutes.map((route, i) => (
                                    <div key={i} className="flex-1 border-r-2 border-black last:border-0 p-3 flex flex-col items-center">
                                        <span className="text-[10px] font-black uppercase tracking-widest mb-1 text-black underline decoration-2 underline-offset-4">{route.name}</span>
                                        <div className="flex flex-col items-center">
                                            <span className="text-[11px] font-black text-black">Rs {route.priceLKR.toLocaleString()}</span>
                                            <span className="text-[9px] font-bold text-black/60">
                                                $ {(route.priceLKR * (rates['USD'] || 0.0032)).toFixed(0)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FleetSection;
