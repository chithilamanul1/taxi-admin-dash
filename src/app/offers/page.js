'use client';

import { useState, useEffect } from 'react';
import { Percent, MapPin, Calendar, Tag, Copy, Check, Sparkles, Gift } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function OffersPage() {
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

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pt-24 pb-20">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 text-white py-20">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 right-10 w-48 h-48 bg-emerald-300/20 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                            <Sparkles size={16} />
                            <span className="text-sm font-bold">Exclusive Discounts</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-4">
                            Special Offers & Deals
                        </h1>
                        <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
                            Save on your next taxi ride with our exclusive promotional codes.
                            Apply at checkout to enjoy instant discounts!
                        </p>
                    </div>
                </div>

                {/* Coupons Section */}
                <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20">
                    {loading ? (
                        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                            <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-slate-500">Loading offers...</p>
                        </div>
                    ) : coupons.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Gift className="text-slate-400" size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-3">No Active Offers</h3>
                            <p className="text-slate-500 max-w-md mx-auto">
                                Check back soon! We regularly add new promotional codes and special discounts.
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {coupons.map((coupon) => (
                                <div
                                    key={coupon._id}
                                    className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
                                >
                                    {/* Decorative Pattern */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2"></div>

                                    {/* Punch Holes Effect */}
                                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-100 rounded-full"></div>
                                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-100 rounded-full"></div>

                                    {/* Content */}
                                    <div className="p-6 relative z-10">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                                <Percent className="text-white" size={24} />
                                            </div>
                                            {coupon.applicableLocations && coupon.applicableLocations.length > 0 && (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
                                                    <MapPin size={12} />
                                                    {coupon.applicableLocations[0]}
                                                </span>
                                            )}
                                        </div>

                                        {/* Discount Amount */}
                                        <div className="mb-4">
                                            <div className="text-5xl font-black text-slate-800 leading-none">
                                                {coupon.value}
                                                <span className="text-2xl">{coupon.discountType === 'percentage' ? '%' : ' Rs'}</span>
                                            </div>
                                            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-1">
                                                {coupon.discountType === 'percentage' ? 'Discount' : 'Off Your Ride'}
                                            </div>
                                        </div>

                                        {/* Description if applicable locations */}
                                        {coupon.applicableLocations && coupon.applicableLocations.length > 0 && (
                                            <p className="text-slate-600 text-sm mb-4">
                                                Valid for rides to/from <span className="font-bold">{coupon.applicableLocations.join(', ')}</span>
                                            </p>
                                        )}

                                        {/* Dotted Border */}
                                        <div className="border-t-2 border-dashed border-slate-200 my-4"></div>

                                        {/* Coupon Code */}
                                        <div className="flex items-center justify-between bg-slate-100 rounded-xl p-4">
                                            <div>
                                                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Use Code</div>
                                                <code className="text-xl font-mono font-black text-emerald-600 tracking-wider">
                                                    {coupon.code}
                                                </code>
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(coupon.code)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${copiedCode === coupon.code
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105'
                                                    }`}
                                            >
                                                {copiedCode === coupon.code ? (
                                                    <>
                                                        <Check size={16} />
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy size={16} />
                                                        Copy
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {/* Expiry */}
                                        <div className="flex items-center gap-2 text-slate-400 text-xs mt-4">
                                            <Calendar size={14} />
                                            {coupon.expiryDate
                                                ? `Valid until ${new Date(coupon.expiryDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                                                : 'No expiry date'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* How to Use Section */}
                    <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 md:p-12">
                        <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">How to Use Your Coupon</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { step: 1, title: 'Copy the Code', desc: 'Click the copy button next to your preferred offer to copy the code' },
                                { step: 2, title: 'Book Your Ride', desc: 'Complete your booking details in our booking form' },
                                { step: 3, title: 'Apply at Checkout', desc: 'Paste the code in the coupon field to see your discount' }
                            ].map((item) => (
                                <div key={item.step} className="text-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                                        {item.step}
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                                    <p className="text-slate-500 text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
