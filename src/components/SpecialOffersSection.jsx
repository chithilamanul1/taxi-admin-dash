'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Percent, ArrowRight, Sparkles, Tag, Copy, Check, MapPin, Calendar } from 'lucide-react';

export default function SpecialOffersSection() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedCode, setCopiedCode] = useState(null);

    useEffect(() => {
        fetch('/api/coupons?public=true')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Filter out expired coupons
                    const activeCoupons = data.filter(c => {
                        if (!c.expiryDate) return true;
                        return new Date(c.expiryDate) > new Date();
                    });
                    setCoupons(activeCoupons);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    if (!loading && coupons.length === 0) return null;

    return (
        <section id="offers" className="py-0 relative">
            <section className="relative py-16 md:py-32 overflow-hidden bg-gradient-to-br from-emerald-900 to-emerald-950 shadow-2xl">

                {/* Background Effects */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                </div>

                <div className="relative z-10 grid lg:grid-cols-2 gap-12 p-8 md:p-16 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-emerald-800/50 border border-emerald-700/50 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
                            <Sparkles size={14} className="text-emerald-300" />
                            <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Exclusive Deals</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                            Save on Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">Next Journey</span>
                        </h2>
                        <p className="text-emerald-100/70 text-lg mb-8 max-w-md">
                            Unlock special discounts on airport transfers and tour packages. Limited time offers available now.
                        </p>
                        <Link
                            href="/offers"
                            className="inline-flex items-center gap-3 bg-white text-emerald-900 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-lg group"
                        >
                            View All Offers
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Coupon Cards Preview - Slider */}
                    <div className="w-full overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar snap-x snap-mandatory">
                        <div className="flex gap-4 md:gap-6 min-w-max">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <div key={i} className="w-[280px] h-40 bg-white/5 rounded-2xl animate-pulse"></div>
                                ))
                            ) : coupons.map((coupon) => (
                                <div
                                    key={coupon._id}
                                    onClick={() => {
                                        const params = new URLSearchParams();
                                        params.set('coupon', coupon.code);
                                        if (coupon.applicableLocations && coupon.applicableLocations.length > 0) {
                                            params.set('destination', coupon.applicableLocations[0]);
                                        }
                                        window.location.href = `/?${params.toString()}#booking`;
                                    }}
                                    className="snap-center w-[280px] md:w-[320px] bg-white border border-slate-200 shadow-lg rounded-3xl p-6 hover:translate-y-[-4px] transition-transform cursor-pointer group/card flex-shrink-0 relative overflow-hidden"
                                >
                                    {/* Decorative Background Blob */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                                    <div className="relative z-10">
                                        {/* Header: Icon & Location Badge */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 text-white">
                                                <Percent size={28} strokeWidth={3} />
                                            </div>
                                            {coupon.applicableLocations && coupon.applicableLocations.length > 0 && (
                                                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-100">
                                                    <MapPin size={10} />
                                                    {coupon.applicableLocations[0]}
                                                </span>
                                            )}
                                        </div>

                                        {/* Discount Amount */}
                                        <div className="mb-2">
                                            <h3 className="text-5xl font-black text-slate-800 tracking-tight leading-none">
                                                {coupon.discountType === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                                                <span className="text-xl ml-1 text-slate-500 font-bold">{coupon.discountType === 'percentage' ? 'OFF' : 'Rs OFF'}</span>
                                            </h3>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-1 ml-1">Discount</p>
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm font-bold text-slate-600 mb-6 leading-relaxed">
                                            {coupon.description || `Valid for rides to/from ${coupon.applicableLocations?.[0] || 'selected locations'}`}
                                        </p>

                                        {/* Divider */}
                                        <div className="border-t-2 border-dashed border-slate-200 mb-6 relative">
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-8 w-4 h-4 bg-emerald-950 rounded-full"></div>
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-8 w-4 h-4 bg-emerald-950 rounded-full"></div>
                                        </div>

                                        {/* Footer: Code & Copy */}
                                        <div className="bg-slate-50 rounded-2xl p-2 pl-4 flex items-center justify-between border border-slate-200 shadow-inner group-hover/card:border-amber-500/50 transition-colors">
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Use Code</p>
                                                <p className="text-lg font-black text-amber-600 font-mono tracking-tight">{coupon.code}</p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const textToCopy = coupon.code;
                                                    navigator.clipboard.writeText(textToCopy);
                                                    setCopiedCode(textToCopy);
                                                    setTimeout(() => setCopiedCode(null), 2000);
                                                }}
                                                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm border border-transparent ${copiedCode === coupon.code ? 'bg-emerald-500 text-white' : 'bg-white text-slate-800 border-slate-200 hover:border-amber-500 hover:bg-amber-50 hover:text-amber-700'}`}
                                            >
                                                {copiedCode === coupon.code ? <Check size={14} /> : <Copy size={14} />}
                                                {copiedCode === coupon.code ? 'Copied' : 'Copy'}
                                            </button>
                                        </div>

                                        {/* Valid Until */}
                                        {coupon.expiryDate && (
                                            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400 justify-center">
                                                <Calendar size={12} />
                                                <span>Valid until {new Date(coupon.expiryDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
}
