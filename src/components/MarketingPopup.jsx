'use client';
import { useState, useEffect } from 'react';
import { X, Copy, ArrowRight, Sparkles, Check } from 'lucide-react';
import Link from 'next/link';

export default function MarketingPopup({ offer, onClose }) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (offer) {
            // Small delay for entrance animation
            const timer = setTimeout(() => setIsOpen(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [offer]);

    const handleCopy = () => {
        navigator.clipboard.writeText(offer.code || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(() => {
            if (onClose) onClose();
        }, 300); // Wait for exit anim
    };

    if (!offer) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-all duration-300 ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose}></div>

            {/* Modal */}
            <div className={`relative w-full max-w-sm bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl transform transition-all duration-500 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'}`}>

                {/* Close Button */}
                <button onClick={handleClose} className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                    <X size={16} />
                </button>

                {/* Content */}
                <div className="p-8 pt-12 text-center relative">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-900/50 to-transparent"></div>
                    <Sparkles className="absolute top-8 left-8 text-amber-400 animate-pulse" size={24} />

                    <h2 className="text-3xl font-black text-amber-400 mb-2 relative z-10 leading-none">
                        Next<br />
                        <span className="text-white">Journey</span>
                    </h2>

                    <p className="text-slate-300 text-sm mb-8 relative z-10 leading-relaxed px-2">
                        {offer.description || "Unlock special discounts on airport transfers and tour packages. Limited time offers available now."}
                    </p>

                    <Link
                        href="/offers"
                        onClick={handleClose}
                        className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors mb-8 w-full justify-center group"
                    >
                        View All Offers <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {/* Coupon Card */}
                    {offer.code && (
                        <div className="bg-white rounded-[2rem] p-5 flex items-center justify-between shadow-2xl relative z-10 border-2 border-dashed border-emerald-900/10">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 font-black text-2xl border border-amber-200/50">
                                    %
                                </div>
                                <div className="text-left">
                                    <div className="text-3xl font-black text-slate-900 leading-none">
                                        {offer.discountPercentage || 20}<span className="text-lg">%</span>
                                        <span className="text-xs font-bold text-slate-400 ml-1 uppercase">OFF</span>
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Discount Code</div>
                                </div>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-1.5 py-1.5 flex items-center gap-3">
                                <span className="text-xs font-black text-slate-800 font-mono uppercase tracking-wider">{offer.code}</span>
                                <button
                                    onClick={handleCopy}
                                    className={`px-3 py-2 border rounded-xl text-[10px] font-bold transition-all flex items-center gap-1.5 shadow-sm ${copied ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-500'}`}
                                >
                                    {copied ? 'Copied' : 'Copy'}
                                    {copied && <Check size={12} strokeWidth={3} />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
