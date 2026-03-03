'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Clock, ArrowRight, CheckCircle, Car, Star, ShieldCheck, Info, HelpCircle, Calendar, Landmark } from 'lucide-react';
import BookingModal from '@/components/BookingModal';

export default function DestinationClient({ destination }) {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen pb-20">
            {/* Hero Section */}
            <div className="relative h-[65vh] w-full">
                <Image
                    src={destination.img || '/hero-bg.jpg'}
                    alt={destination.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-6 max-w-4xl">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/30 text-amber-200 text-xs font-bold uppercase tracking-widest mb-6">
                            {destination.badge}
                        </span>
                        <h1 className="text-4xl md:text-7xl font-black text-white mb-6 drop-shadow-lg tracking-tight">
                            {destination.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-white/90">
                            <div className="flex items-center gap-2 font-bold bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                                <MapPin size={18} className="text-amber-400" />
                                {destination.distance}
                            </div>
                            <div className="flex items-center gap-2 font-bold bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                                <Clock size={18} className="text-amber-400" />
                                {destination.time}
                            </div>
                            <div className="flex items-center gap-2 font-bold bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                                <Car size={18} className="text-amber-400" />
                                24/7 Service
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Overview Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-900/5 dark:border-white/5">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900/30 rounded-2xl flex items-center justify-center text-slate-600 dark:text-amber-400">
                                    <Info size={24} />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Experience {destination.name}</h2>
                            </div>

                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-xl mb-6 font-medium">
                                    {destination.description}
                                </p>
                                {destination.longDescription && (
                                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg">
                                        {destination.longDescription}
                                    </p>
                                )}
                            </div>

                            {/* Destination Facts / Guide */}
                            {(destination.bestTimeToVisit || destination.localAttractions) && (
                                <div className="grid md:grid-cols-2 gap-8 mt-12 pt-12 border-t border-gray-100 dark:border-gray-800">
                                    {destination.bestTimeToVisit && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-slate-600 dark:text-amber-400 font-bold uppercase tracking-widest text-xs">
                                                <Calendar size={16} /> Best Time to Visit
                                            </div>
                                            <p className="font-bold text-slate-900 dark:text-white text-lg">
                                                {destination.bestTimeToVisit}
                                            </p>
                                        </div>
                                    )}
                                    {destination.localAttractions && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-slate-600 dark:text-amber-400 font-bold uppercase tracking-widest text-xs">
                                                <Landmark size={16} /> Key Attractions
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {destination.localAttractions.map((attr, idx) => (
                                                    <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg text-sm font-bold">
                                                        {attr}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mt-12 pt-12 border-t border-gray-100 dark:border-gray-800">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-8 uppercase text-sm tracking-widest">Journey Highlights</h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {destination.highlights && destination.highlights.map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/20 p-5 rounded-2xl border border-slate-100/50 dark:border-amber-500/10">
                                            <div className="w-10 h-10 bg-white dark:bg-amber-500/20 rounded-xl flex items-center justify-center shadow-sm">
                                                <CheckCircle className="text-slate-600 dark:text-amber-400" size={20} />
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-slate-100 tracking-tight">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Pricing Table */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-900/5 dark:border-white/5">
                            <div className="p-8 md:p-10 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Fixed Rates from Airport</h2>
                                    <p className="text-slate-500 text-sm mt-1">Transparent pricing, no hidden surprises.</p>
                                </div>
                                <div className="flex items-center gap-2 text-rose-600 text-[10px] font-black uppercase tracking-widest bg-rose-50 dark:bg-rose-900/20 px-4 py-2 rounded-full border border-rose-100 dark:border-rose-500/20 self-start md:self-center">
                                    <ShieldCheck size={14} /> Excludes Highway Tolls
                                </div>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {destination.pricing && Object.entries(destination.pricing).map(([vehicle, price]) => (
                                    <div key={vehicle} className="p-8 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-slate-100 dark:group-hover:bg-slate-900/30 group-hover:text-slate-600 transition-colors">
                                                <Car size={32} />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-xl text-slate-900 dark:text-white">{vehicle}</h3>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                                                    <CheckCircle size={10} className="text-amber-500" />
                                                    All Included
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-black text-slate-600 dark:text-amber-400">
                                                ${price}
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Net Total</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FAQs Section */}
                        {destination.faqs && destination.faqs.length > 0 && (
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-900/5 dark:border-white/5">
                                <div className="flex items-center gap-3 mb-10">
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900/30 rounded-2xl flex items-center justify-center text-slate-600 dark:text-amber-400">
                                        <HelpCircle size={24} />
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">Route FAQs</h2>
                                </div>
                                <div className="space-y-4">
                                    {destination.faqs.map((faq, i) => (
                                        <div key={i} className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
                                            <button
                                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                                className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                            >
                                                <span className="font-black text-slate-900 dark:text-white text-lg tracking-tight">{faq.q}</span>
                                                <ArrowRight size={20} className={`text-amber-500 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
                                            </button>
                                            {openFaq === i && (
                                                <div className="p-6 pt-0 text-gray-500 dark:text-gray-400 font-medium leading-relaxed bg-slate-50/50 dark:bg-slate-800/30">
                                                    {faq.a}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl sticky top-24 border border-slate-700/50 overflow-hidden group">
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-amber-500/20 transition-colors"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-widest text-[10px] mb-8 bg-amber-500/10 w-fit px-4 py-1.5 rounded-full border border-amber-500/20">
                                    <Star fill="currentColor" size={12} /> Travel Recommended
                                </div>
                                <h3 className="text-4xl font-black mb-4 leading-none">Instant Booking</h3>
                                <p className="text-amber-200/70 mb-10 font-medium">Safe, reliable, and comfortable airport pickup to {destination.name}.</p>

                                <div className="space-y-6 mb-10">
                                    <div className="flex justify-between items-center py-4 border-b border-slate-800/50">
                                        <span className="text-amber-200/80 font-bold uppercase tracking-widest text-[10px]">Distance</span>
                                        <span className="font-black text-xl">{destination.distance}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-4 border-b border-slate-800/50">
                                        <span className="text-amber-200/80 font-bold uppercase tracking-widest text-[10px]">Est. Duration</span>
                                        <span className="font-black text-xl">{destination.time}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-4">
                                        <span className="text-amber-200/80 font-bold uppercase tracking-widest text-[10px]">Starting From</span>
                                        <div className="text-right">
                                            <span className="block font-black text-4xl text-amber-400">${destination.price}</span>
                                            <span className="text-[10px] font-bold text-amber-500/50 uppercase tracking-widest">Fixed Rate</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsBookingOpen(true)}
                                    className="w-full py-6 bg-white text-slate-900 rounded-[1.5rem] font-black text-xl hover:bg-slate-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3 group/btn"
                                >
                                    Book This Trip <ArrowRight size={24} className="group-hover/btn:translate-x-2 transition-transform" />
                                </button>

                                <div className="mt-8 flex items-center justify-center gap-3 text-[10px] font-black text-amber-400/60 uppercase tracking-widest">
                                    <ShieldCheck size={14} /> 256-bit Secure Booking
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                initialData={{
                    dropoff: destination.name,
                    tripType: 'one-way'
                }}
            />
        </div>
    );
}
