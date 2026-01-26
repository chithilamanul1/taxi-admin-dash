'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Percent, ArrowRight, Sparkles, Tag, Copy, Check } from 'lucide-react';

export default function SpecialOffersSection() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedCode, setCopiedCode] = useState(null);

    useEffect(() => {
        fetch('/api/coupons')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Filter out expired coupons
                    const activeCoupons = data.filter(c => {
                        if (!c.expiryDate) return true;
                        return new Date(c.expiryDate) > new Date();
                    });
                    setCoupons(activeCoupons.slice(0, 2)); // Show top 2 only for layout balance
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
        <section className="py-20 px-6 relative">
            <div className="max-w-7xl mx-auto">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 to-emerald-950 shadow-2xl">

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

                        {/* Coupon Cards Preview */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                            {loading ? (
                                <div className="h-40 bg-white/5 rounded-2xl animate-pulse"></div>
                            ) : coupons.map((coupon) => (
                                <div key={coupon._id} className="bg-white rounded-2xl p-5 shadow-lg hover:translate-y-[-4px] transition-transform">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                            <Percent size={20} className="text-emerald-600" />
                                        </div>
                                        <div className="text-3xl font-black text-emerald-900">
                                            {coupon.value}{coupon.discountType === 'percentage' ? '%' : ''}
                                            <span className="text-xs font-bold text-slate-400 block -mt-1 uppercase text-right">Off</span>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex justify-between items-center">
                                        <code className="font-mono font-bold text-emerald-700">{coupon.code}</code>
                                        <button
                                            onClick={() => copyToClipboard(coupon.code)}
                                            className="text-xs font-bold text-slate-400 hover:text-emerald-600 flex items-center gap-1"
                                        >
                                            {copiedCode === coupon.code ? <Check size={14} /> : <Copy size={14} />}
                                            {copiedCode === coupon.code ? 'Copied' : 'Copy'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
