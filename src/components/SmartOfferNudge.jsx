import React from 'react';
import { Sparkles, X } from 'lucide-react';

const SmartOfferNudge = ({ offer, onClose }) => {
    if (!offer) return null;

    return (
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 animate-slide-up-fade">
            <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black p-0.5 rounded-2xl shadow-2xl shadow-amber-500/20 max-w-sm">
                <div className="bg-white dark:bg-slate-900 rounded-[14px] p-4 flex items-start gap-3 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl -mr-10 -mt-10"></div>

                    <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-xl text-amber-600 dark:text-amber-400 shrink-0">
                        <Sparkles size={20} className="animate-pulse" />
                    </div>

                    <div className="flex-1 pr-6">
                        <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-0.5">
                            Smart Offer Found!
                        </p>
                        <h4 className="font-bold text-slate-900 dark:text-white leading-tight mb-1">
                            {offer.title || 'Special Discount Unlocked'}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            {offer.description || `You're saving ${offer.discountPercentage}% on this trip!`}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-slate-300 hover:text-slate-500 dark:hover:text-white transition-colors p-1"
                    >
                        <X size={14} />
                    </button>

                    {/* Progress Bar (Optional auto-dismiss visual) */}
                    <div className="absolute bottom-0 left-0 h-0.5 bg-amber-400 w-full animate-shrink-width"></div>
                </div>
            </div>
        </div>
    );
};

export default SmartOfferNudge;
