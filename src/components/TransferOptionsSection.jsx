'use client';

import React from 'react';
import { PlaneLanding, PlaneTakeoff, Building2, Home } from 'lucide-react';

export default function TransferOptionsSection() {
    const options = [
        {
            icon: PlaneLanding,
            title: "AIRPORT PICKUPS",
            desc: "Arrive stress-free. We pick you up directly from the arrivals hall at Bandaranaike International Airport and take you anywhere in Sri Lanka."
        },
        {
            icon: PlaneTakeoff,
            title: "AIRPORT DROP-OFFS",
            desc: "Never miss a flight. Reliable, on-time transfers from any location, hotel, or home directly to the airport departures."
        },
        {
            icon: Building2,
            title: "HOTEL TRANSFERS",
            desc: "Moving between cities or changing accommodations? We provide seamless point-to-point transfers between any hotels or resorts."
        },
        {
            icon: Home,
            title: "HOME & INTERCITY",
            desc: "Book a ride right from your doorstep. Whether it's a day trip or an intercity journey, we pick you up from home and drive you safely."
        }
    ];

    return (
        <section className="py-16 md:py-24 px-6 bg-white dark:bg-[#050505] transition-colors duration-300 border-t border-slate-100 dark:border-white/5">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center bg-[#FACC15] text-black px-6 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-6 shadow-xl shadow-yellow-500/20">
                        Total Flexibility
                    </div>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-emerald-950 dark:text-white leading-none mb-4 font-cursive">
                        Anywhere <span className="text-[#FACC15]">to</span> Anywhere
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-bold uppercase tracking-[0.2em] max-w-2xl mx-auto leading-relaxed">
                        Seamless point-to-point transportation across Sri Lanka. Book from home, hotel, or the airport.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {options.map((option, idx) => (
                        <div key={idx} className="bg-white dark:bg-[#0a0a0a] rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 border border-slate-200 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-none hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-emerald-600/30 dark:hover:border-[#FACC15]/30 transition-all duration-300 group">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-[#FACC15] rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-yellow-500/20 group-hover:scale-110 transition-transform">
                                <option.icon size={20} className="text-black md:w-6 md:h-6 w-5 h-5" />
                            </div>
                            <h3 className="text-lg md:text-xl font-black text-emerald-950 dark:text-white uppercase tracking-tight mb-2 md:mb-4">
                                {option.title}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed font-medium">
                                {option.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
