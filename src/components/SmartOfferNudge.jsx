import React from 'react';
import { Sparkles, X } from 'lucide-react';

const SmartOfferNudge = ({ offer, onClose }) => {
    React.useEffect(() => {
        if (!offer) return;
        const timer = setTimeout(() => {
            onClose();
        }, 6000); // Auto close after 6 seconds
        return () => clearTimeout(timer);
    }, [offer, onClose]);

    if (!offer) return null;

    return (
        <div className="fixed bottom-6 right-4 md:bottom-8 md:left-8 md:right-auto z-[60] animate-slide-up-fade max-w-[calc(100vw-32px)] group/nudge">
            <div className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-teal-600 p-[1px] rounded-[2rem] shadow-[0_25px_60px_-15px_rgba(16,185,129,0.3)]">
                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[1.95rem] p-5 flex items-start gap-4 relative overflow-hidden">

                    {/* Premium Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                    </div>

                    {/* Animated Glow Component */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-[40px] pointer-events-none animate-pulse"></div>

                    {/* Icon Container with Gradient */}
                    <div className="relative">
                        <div className="bg-gradient-to-tr from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-800/20 p-3 rounded-2xl text-emerald-600 dark:text-emerald-400 shrink-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] border border-emerald-200/50 dark:border-emerald-500/10">
                            <Sparkles size={22} className="animate-spin-slow" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm animate-bounce"></div>
                    </div>

                    <div className="flex-1 pr-6">
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                            <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.25em]">
                                Exclusive Deal Unlocked
                            </p>
                        </div>

                        <h4 className="font-black text-slate-900 dark:text-white leading-tight mb-1 text-base md:text-lg tracking-tight">
                            {offer.name} <span className="text-emerald-600 font-extrabold ml-1">Applied!</span>
                        </h4>

                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-bold opacity-80 mb-3">
                            {offer.description || `Special discount active for your current route.`}
                        </p>

                        <div className="flex items-center gap-2">
                            <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                                <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase">
                                    {offer.discountPercentage > 0 ? `${offer.discountPercentage}% OFF` : `Save Rs. ${offer.discountAmount}`}
                                </span>
                            </div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Added to Booking</span>
                        </div>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-slate-50 dark:bg-white/5 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 rounded-full transition-all duration-300 text-slate-400 group"
                        title="Dismiss"
                    >
                        <X size={16} className="group-hover:rotate-90 transition-transform" />
                    </button>

                    {/* Minimal Progress Bar */}
                    <div className="absolute bottom-0 left-0 h-[2.5px] bg-gradient-to-r from-emerald-500 to-teal-400 w-full origin-left animate-timer-progress opacity-60"></div>
                </div>
            </div>
        </div>
    );
};

export default SmartOfferNudge;
