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
        <div className="fixed top-24 bottom-auto right-4 md:top-auto md:bottom-6 md:right-6 z-[1000] max-w-[calc(100vw-32px)] w-80 group/nudge">
            <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                className="relative bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/10 p-4 flex items-start gap-3 overflow-hidden rounded-[1.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.1)] backdrop-blur-xl"
            >
                {/* Premium Background Pattern */}
                <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                </div>

                {/* Animated Glow */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-orange-500/10 rounded-full blur-[30px] pointer-events-none"></div>

                {/* Icon Section */}
                <div className="w-10 h-10 bg-[#FACC15] rounded-xl flex items-center justify-center shrink-0 shadow-sm shadow-yellow-200 dark:shadow-none animate-bounce-slow mt-1">
                    <CheckCircle2 size={20} className="text-black" />
                </div>
                {/* Content */}
                <div className="relative z-10 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[9px] font-black text-black uppercase tracking-widest bg-yellow-400 px-1.5 py-0.5 rounded-full">Active Offer</span>
                    </div>
                    
                    <h4 className="font-black text-slate-900 dark:text-white leading-tight mb-1 text-sm tracking-tight pr-6">
                        {offer.name} <span className="text-emerald-600">Applied!</span>
                    </h4>

                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug font-bold opacity-90 mb-2">
                        {offer.description || `Luxury discount successfully applied to your booking.`}
                    </p>

                    <div className="flex items-center gap-2">
                        <div className="px-2.5 py-1 bg-[#FACC15] rounded-lg shadow-sm">
                            <span className="text-[10px] font-black text-white uppercase tracking-wider">
                                {offer.discountPercentage > 0 ? `${offer.discountPercentage}% OFF` : `Save Rs. ${offer.discountAmount}`}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none mb-0.5">Verified Code</span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Price Updated</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 rounded-full transition-all duration-300 text-slate-400 hover:text-emerald-600 z-50 cursor-pointer pointer-events-auto"
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
