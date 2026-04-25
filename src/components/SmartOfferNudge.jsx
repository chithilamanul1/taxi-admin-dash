import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Sparkles, X, ChevronRight, CheckCircle2 } from 'lucide-react';

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
        <div className="fixed top-24 bottom-auto right-6 md:top-auto md:bottom-10 md:right-10 z-[1000] max-w-[calc(100vw-48px)] w-96 group/nudge">
            <motion.div 
                initial={{ opacity: 0, y: -50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="relative bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/10 p-6 flex items-start gap-5 overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-xl"
            >
                {/* Premium Background Pattern */}
                <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                </div>

                {/* Animated Glow */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/10 rounded-full blur-[40px] pointer-events-none"></div>

                {/* Icon Section */}
                <div className="w-14 h-14 bg-[#FF5C00] rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-200 dark:shadow-none animate-bounce-slow">
                    <CheckCircle2 size={28} className="text-white" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-[#FF5C00] uppercase tracking-widest bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-full">Active Offer</span>
                    </div>
                    
                    <h4 className="font-black text-slate-900 dark:text-white leading-tight mb-1 text-xl tracking-tight">
                        {offer.name} <span className="text-[#FF5C00]">Applied!</span>
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-bold opacity-80 mb-4">
                        {offer.description || `Luxury discount successfully applied to your booking.`}
                    </p>

                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-[#FF5C00] rounded-xl shadow-md">
                            <span className="text-xs font-black text-white uppercase tracking-wider">
                                {offer.discountPercentage > 0 ? `${offer.discountPercentage}% OFF` : `Save Rs. ${offer.discountAmount}`}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none mb-1">Verified Code</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Price Updated</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 rounded-full transition-all duration-300 text-slate-400 hover:text-emerald-600"
                    title="Dismiss"
                >
                    <X size={20} />
                </button>

                {/* Minimal Progress Bar */}
                <div className="absolute bottom-0 left-0 h-1 bg-emerald-600 w-full origin-left animate-timer-progress"></div>
            </motion.div>
        </div>
    );
};

export default SmartOfferNudge;
