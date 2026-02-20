'use client';
import React from 'react';
import { ArrowRight, Star, ShieldCheck, Clock } from 'lucide-react';

const MobileHero = ({ onBookClick }) => {
    return (
        <div className="lg:hidden flex flex-col bg-slate-950 dark:bg-slate-950 pt-28 pb-12 px-6 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>

            <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-900/40 rounded-full border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    <Star size={10} fill="currentColor" />
                    Premium Chauffeur Service
                </div>

                <h1 className="text-4xl font-black text-white leading-[1.1] tracking-tight">
                    Travel Sri Lanka <br />
                    <span className="text-emerald-500">With Confidence.</span>
                </h1>

                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                    Reliable airport transfers, day tours, and luxury fleet at your fingertips.
                </p>

                <div className="grid grid-cols-3 gap-3">
                    {[
                        { icon: ShieldCheck, text: 'Secure' },
                        { icon: Clock, text: '24/7' },
                        { icon: Star, text: 'Luxury' }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/5 p-3 rounded-2xl flex flex-col items-center gap-1">
                            <item.icon size={16} className="text-emerald-500" />
                            <span className="text-[10px] font-bold text-slate-300">{item.text}</span>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onBookClick}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 active:scale-95 transition-all text-lg"
                >
                    BOOK YOUR RIDE
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default MobileHero;
