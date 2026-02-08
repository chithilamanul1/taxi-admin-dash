import React from 'react';
import { Sparkles, X } from 'lucide-react';

const SmartOfferNudge = ({ offer, onClose }) => {
    if (!offer) return null;

    return (
        <div className="fixed bottom-24 right-4 md:bottom-8 md:left-8 md:right-auto z-[9999] animate-slide-up-fade max-w-[calc(100vw-32px)]">
            <div className="relative bg-gradient-to-br from-amber-500 to-yellow-600 text-white p-[1.5px] rounded-2xl shadow-[0_20px_50px_rgba(245,158,11,0.3)]">
                <div className="bg-white dark:bg-slate-900 rounded-[14.5px] p-4 flex items-start gap-4 relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="bg-amber-100 dark:bg-amber-900/40 p-2.5 rounded-xl text-amber-600 dark:text-amber-400 shrink-0 shadow-inner">
                        <Sparkles size={20} className="animate-pulse" />
                    </div>

                    <div className="flex-1 pr-4">
                        <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-[0.2em] mb-1">
                            Smart Offer Found!
                        </p>
                        <h4 className="font-extrabold text-slate-900 dark:text-white leading-tight mb-1 text-sm md:text-base">
                            {offer.title || offer.name || 'Special Discount Unlocked'}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            {offer.description || `You're saving ${offer.discountPercentage || 0}% on this trip!`}
                        </p>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-white/5 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 rounded-full transition-all duration-300 text-slate-400 group"
                        title="Close Offer"
                    >
                        <X size={16} className="group-hover:rotate-90 transition-transform" />
                    </button>

                    {/* Animated Progress Bar */}
                    <div className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-amber-500 to-yellow-400 w-full origin-left animate-timer-progress"></div>
                </div>
            </div>
        </div>
    );
};

export default SmartOfferNudge;
