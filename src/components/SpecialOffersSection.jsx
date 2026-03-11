'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Percent, ArrowRight, Tag, Copy, Check, MapPin, Calendar } from 'lucide-react';

export default function SpecialOffersSection() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedCode, setCopiedCode] = useState(null);

    useEffect(() => {
        fetch('/api/coupons?public=true')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
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
        <section id="offers" className="py-0 relative transition-colors duration-300">
            <section className="relative py-16 md:py-32 overflow-hidden bg-white dark:bg-[#0a0a0a] border-t-4 border-black transition-colors duration-300">

                <div className="relative z-10 grid lg:grid-cols-2 gap-12 p-8 md:p-16 items-center max-w-7xl mx-auto">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-[#FACC15] border-4 border-black px-4 py-1.5 mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <Tag size={14} className="text-black" strokeWidth={3} />
                            <span className="text-xs font-black text-black uppercase tracking-[0.2em]">Exclusive Deals</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-black dark:text-white mb-8 leading-none uppercase italic tracking-tighter">
                            SAVE ON YOUR <br />
                            <span className="text-[#FACC15]">NEXT JOURNEY</span>
                        </h2>
                        <p className="text-black/50 dark:text-white/50 font-black uppercase tracking-[0.1em] text-sm md:text-base mb-10 max-w-md">
                            Unlock special discounts on airport transfers and tour packages. Limited time offers available now.
                        </p>
                        <Link
                            href="/offers"
                            className="inline-flex items-center gap-4 bg-[#FACC15] text-black px-10 py-5 rounded-none border-4 border-black font-black uppercase tracking-[0.2em] text-sm hover:translate-y-[-4px] active:translate-y-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all group"
                        >
                            VIEW ALL OFFERS
                            <span className="w-10 h-10 bg-black text-[#FACC15] flex items-center justify-center group-hover:bg-[#FACC15] group-hover:text-black group-hover:border-2 group-hover:border-black transition-all">
                                <ArrowRight size={20} strokeWidth={3} />
                            </span>
                        </Link>
                    </div>

                    {/* Coupon Cards Preview - Slider */}
                    <div className="w-full overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar snap-x snap-mandatory">
                        <div className="flex gap-6 min-w-max">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <div key={i} className="w-[280px] h-40 bg-black/5 dark:bg-white/5 rounded-none border-4 border-black animate-pulse"></div>
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
                                    className="snap-center w-[280px] md:w-[320px] bg-white dark:bg-[#111] border-4 border-black rounded-none p-6 hover:translate-y-[-4px] hover:border-[#FACC15] transition-all cursor-pointer group/card flex-shrink-0 relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(250,204,21,0.2)]"
                                >
                                    <div className="relative z-10">
                                        {/* Header: Icon & Location Badge */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-14 h-14 bg-[#FACC15] border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
                                                <Percent size={28} strokeWidth={3} />
                                            </div>
                                            {coupon.applicableLocations && coupon.applicableLocations.length > 0 && (
                                                <span className="inline-flex items-center gap-1 bg-black text-[#FACC15] px-3 py-1 text-[10px] font-black uppercase tracking-wider border-2 border-black">
                                                    <MapPin size={10} />
                                                    {coupon.applicableLocations[0]}
                                                </span>
                                            )}
                                        </div>

                                        {/* Discount Amount */}
                                        <div className="mb-2">
                                            <h3 className="text-5xl font-black text-black dark:text-white tracking-tighter leading-none uppercase italic">
                                                {coupon.discountType === 'percentage' ? `${coupon.value}%` : `Rs ${coupon.value}`}
                                                <span className="text-xl ml-1 text-black/40 dark:text-white/40 font-black not-italic">OFF</span>
                                            </h3>
                                            <p className="text-[10px] font-black text-black/30 dark:text-white/30 uppercase tracking-[0.3em] mt-2">Discount</p>
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm font-bold text-black/60 dark:text-white/60 mb-6 leading-relaxed">
                                            {coupon.description || `Valid for rides to/from ${coupon.applicableLocations?.[0] || 'selected locations'}`}
                                        </p>

                                        {/* Divider */}
                                        <div className="border-t-4 border-dashed border-black/10 dark:border-white/10 mb-6"></div>

                                        {/* Footer: Code & Copy */}
                                        <div className="bg-black/5 dark:bg-white/5 p-3 flex items-center justify-between border-2 border-black group-hover/card:border-[#FACC15] transition-colors">
                                            <div>
                                                <p className="text-[9px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.2em] mb-0.5">Use Code</p>
                                                <p className="text-lg font-black text-black dark:text-[#FACC15] font-mono tracking-tight">{coupon.code}</p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const textToCopy = coupon.code;
                                                    navigator.clipboard.writeText(textToCopy);
                                                    setCopiedCode(textToCopy);
                                                    setTimeout(() => setCopiedCode(null), 2000);
                                                }}
                                                className={`px-4 py-2.5 font-black text-xs flex items-center gap-2 transition-all border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none ${copiedCode === coupon.code ? 'bg-[#FACC15] text-black' : 'bg-white dark:bg-black text-black dark:text-white hover:bg-[#FACC15] hover:text-black'}`}
                                            >
                                                {copiedCode === coupon.code ? <Check size={14} /> : <Copy size={14} />}
                                                {copiedCode === coupon.code ? 'COPIED' : 'COPY'}
                                            </button>
                                        </div>

                                        {/* Valid Until */}
                                        {coupon.expiryDate && (
                                            <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-black/30 dark:text-white/30 justify-center uppercase tracking-[0.2em]">
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
