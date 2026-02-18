'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Tag, MapPin, ArrowRight, Loader2, Zap, Car, Users, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function OffersPage() {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await fetch('/api/admin/quick-links');
                const json = await res.json();
                if (json.success) {
                    setOffers(json.data);
                }
            } catch (err) {
                console.error('Failed to fetch offers', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    return (
        <main className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Hero Section */}
            <div className="pt-32 pb-16 bg-emerald-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10 mix-blend-overlay"></div>
                <div className="container mx-auto px-4 relative z-10 text-center text-white">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-400/20 rounded-full border border-emerald-400/30 text-emerald-400 text-xs font-black uppercase tracking-widest mb-6">
                        <Zap size={14} fill="currentColor" /> Exclusive Deals
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight uppercase">
                        Flat Rate <span className="text-emerald-400">Destinations</span>
                    </h1>
                    <p className="text-lg text-emerald-100/80 max-w-2xl mx-auto font-medium">
                        Premium airport transfers and city-to-city taxi services at guaranteed fixed prices. No hidden costs, no meters.
                    </p>
                </div>
            </div>

            {/* Offers Grid */}
            <div className="container mx-auto px-4 py-16">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 gap-4">
                        <Loader2 className="animate-spin text-emerald-600" size={48} />
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Best Prices...</p>
                    </div>
                ) : offers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {offers.map((offer) => (
                            <div key={offer._id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                                            <MapPin size={28} />
                                        </div>
                                        <div className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest rounded-full">
                                            {offer.badge || 'Special Offer'}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight leading-tight">
                                        {offer.title}
                                    </h3>

                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-8">
                                        <div className="flex items-center gap-1">
                                            <Car size={14} className="text-emerald-600" />
                                            <span>Private Taxi</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Zap size={14} className="text-amber-500" />
                                            <span>Door-to-Door</span>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fixed Price From</p>
                                            <div className="text-3xl font-black text-emerald-900">
                                                <span className="text-sm font-bold text-emerald-600 mr-1">Rs</span>
                                                {offer.price.toLocaleString()}
                                            </div>
                                        </div>
                                        <Link
                                            href={`/checkout/${offer.slug}`}
                                            className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 transition-colors shadow-lg"
                                        >
                                            <ArrowRight size={24} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-300">
                        <Tag className="mx-auto text-slate-200 mb-4" size={64} />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Offers</h3>
                        <p className="text-slate-500">Check back soon for seasonal flat rates and discounts.</p>
                        <Link href="/" className="inline-flex mt-6 font-bold text-emerald-600 hover:underline">Return to Booking Widget</Link>
                    </div>
                )}

                {/* Info Section */}
                <div className="mt-24 grid md:grid-cols-3 gap-8 text-center bg-emerald-900/5 p-12 rounded-[3rem] border border-emerald-900/10">
                    <div className="space-y-3">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto text-emerald-600">
                            <Users size={24} />
                        </div>
                        <h4 className="font-black text-slate-900 uppercase text-sm tracking-widest">Group Friendly</h4>
                        <p className="text-xs text-slate-500 font-medium">Vehicles available for up to 10 passengers with luggage.</p>
                    </div>
                    <div className="space-y-3">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto text-emerald-600">
                            <Briefcase size={24} />
                        </div>
                        <h4 className="font-black text-slate-900 uppercase text-sm tracking-widest">Ample Space</h4>
                        <p className="text-xs text-slate-500 font-medium">Our vans guarantee enough space for all your belongings.</p>
                    </div>
                    <div className="space-y-3">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto text-emerald-600">
                            <Zap size={24} />
                        </div>
                        <h4 className="font-black text-slate-900 uppercase text-sm tracking-widest">Instant Booking</h4>
                        <p className="text-xs text-slate-500 font-medium">Secure your flat rate in seconds with our express checkout.</p>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
