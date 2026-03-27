import React from 'react';
import { Tag, X } from 'lucide-react';

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
        <div className="fixed bottom-2 right-2 md:bottom-4 md:right-4 z-[60] animate-slide-up-fade max-w-[calc(100vw-24px)] group/nudge">
            <div className="relative bg-white dark:bg-[#111] border-4 border-black p-5 flex items-start gap-4 overflow-hidden rounded-none shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">

                    {/* Premium Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                    </div>

                    {/* Animated Glow Component */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-[40px] pointer-events-none animate-pulse"></div>

                    {/* Content */}
                    <div className="relative z-10 flex-1">
                        <h4 className="font-black text-emerald-900 dark:text-white leading-tight mb-1 text-base md:text-lg tracking-tight">
                            {offer.name} <span className="text-emerald-600 font-extrabold ml-1">Applied!</span>
                        </h4>

                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-bold opacity-80 mb-3">
                            {offer.description || `Special discount active for your current route.`}
                        </p>

                        <div className="flex items-center gap-2">
                            <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 border-2 border-black rounded-none">
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
                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-slate-50 dark:bg-white/5 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 rounded-none border-2 border-black transition-all duration-300 text-slate-400 group"
                        title="Dismiss"
                    >
                        <X size={16} className="group-hover:rotate-90 transition-transform" />
                    </button>

                    {/* Minimal Progress Bar */}
                    <div className="absolute bottom-0 left-0 h-[2.5px] bg-gradient-to-r from-emerald-500 to-orange-400 w-full origin-left animate-timer-progress opacity-60"></div>
            </div>
        </div>
    );
};

export default SmartOfferNudge;
