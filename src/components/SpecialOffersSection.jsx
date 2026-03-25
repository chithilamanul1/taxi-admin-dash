'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Percent, ArrowRight, Tag, Copy, Check, MapPin, Calendar, Clock } from 'lucide-react';

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
            <section className="relative py-16 md:py-32 overflow-hidden bg-[#FACC15] border-t-4 border-black transition-colors duration-300">

                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16">
                    {/* Header */}
                    <div className="mb-12 md:mb-16">
                        <div className="inline-flex items-center gap-2 bg-black px-4 py-1.5 mb-6">
                            <Tag size={14} className="text-[#FACC15]" strokeWidth={3} />
                            <span className="text-xs font-black text-[#FACC15] uppercase tracking-[0.2em]">Exclusive Deals</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-black mb-6 leading-none uppercase italic tracking-tighter">
                            SAVE ON YOUR <br />
                            <span className="text-white">NEXT JOURNEY</span>
                        </h2>
                        <p className="text-black/60 font-black uppercase tracking-[0.1em] text-sm max-w-lg">
                            Unlock special discounts on airport transfers and tour packages. Limited time offers available now.
                        </p>
                    </div>

                    {/* Coupon Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="h-64 bg-black/5 border-4 border-black animate-pulse"></div>
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
                                className="bg-white border-4 border-black p-6 md:p-8 hover:translate-y-[-4px] transition-all cursor-pointer group/card relative overflow-hidden"
                            >
                                <div className="relative z-10">
                                    {/* Header: Icon & Badge */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 bg-[#FACC15] border-2 border-black flex items-center justify-center text-black">
                                            <Tag size={22} strokeWidth={3} />
                                        </div>
                                        {coupon.applicableLocations && coupon.applicableLocations.length > 0 && (
                                            <span className="inline-flex items-center gap-1 bg-black text-[#FACC15] px-3 py-1 text-[10px] font-black uppercase tracking-wider border-2 border-black">
                                                <MapPin size={10} />
                                                {coupon.applicableLocations[0]}
                                            </span>
                                        )}
                                    </div>

                                    {/* Discount */}
                                    <div className="mb-4">
                                        <h3 className="text-4xl md:text-5xl font-black text-black tracking-tighter leading-none uppercase italic">
                                            {coupon.discountType === 'percentage' ? `${coupon.value}%` : `Rs. ${coupon.value}`}
                                            <span className="text-lg ml-2 text-black/40 font-black not-italic">OFF</span>
                                        </h3>
                                    </div>

                                    {/* Description */}
                                    <p className="text-xs font-bold text-black/50 mb-6 leading-relaxed uppercase tracking-wider">
                                        {coupon.description || `Valid for rides to/from ${coupon.applicableLocations?.[0] || 'selected locations'}`}
                                    </p>

                                    {/* Code Bar */}
                                    <div className="bg-black p-3 flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-lg font-black text-[#FACC15] tracking-wider">{coupon.code}</p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigator.clipboard.writeText(coupon.code);
                                                setCopiedCode(coupon.code);
                                                setTimeout(() => setCopiedCode(null), 2000);
                                            }}
                                            className={`px-4 py-2 font-black text-xs flex items-center gap-2 transition-all border-2 border-[#FACC15] uppercase tracking-widest ${copiedCode === coupon.code ? 'bg-[#FACC15] text-black' : 'bg-transparent text-[#FACC15] hover:bg-[#FACC15] hover:text-black'}`}
                                        >
                                            {copiedCode === coupon.code ? <Check size={14} /> : <Copy size={14} />}
                                            {copiedCode === coupon.code ? 'COPIED' : 'COPY'}
                                        </button>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between">
                                        {coupon.expiryDate && (
                                            <div className="flex items-center gap-2 text-[10px] font-black text-black/40 uppercase tracking-[0.15em]">
                                                <Calendar size={12} />
                                                <span>EXP: {new Date(coupon.expiryDate).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                        )}
                                        <div className="bg-[#FACC15] border-2 border-black px-4 py-2 text-[10px] font-black text-black uppercase tracking-widest flex items-center gap-2 group-hover/card:bg-black group-hover/card:text-[#FACC15] transition-all">
                                            BOOK NOW <ArrowRight size={12} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* View All Button */}
                    <div className="text-center">
                        <Link
                            href="/offers"
                            className="inline-flex items-center gap-4 bg-black text-[#FACC15] px-10 py-5 border-4 border-black font-black uppercase tracking-[0.2em] text-sm hover:translate-y-[-4px] active:translate-y-0 transition-all group"
                        >
                            VIEW ALL OFFERS
                            <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>
        </section>
    );
}
