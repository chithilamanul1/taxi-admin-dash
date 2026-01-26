'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, ArrowRight, CheckCircle, Car, Star, ShieldCheck } from 'lucide-react';
import BookingModal from '@/components/BookingModal';
import { destinations } from '@/lib/destinations';
import { useParams } from 'next/navigation';

export default function DestinationPage() {
    const params = useParams();
    const { slug } = params;
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    // Find destination based on URL slug (e.g. 'mirissa' from /destination/mirissa)
    // Note: The homepage links use .split(' ').pop(), which might be 'Mirissa'.
    // We should normalize comparison.
    const destination = destinations.find(d =>
        d.id.toLowerCase() === slug?.toLowerCase() ||
        d.name.toLowerCase() === slug?.toLowerCase()
    );

    if (!destination) {
        return <div className="min-h-screen flex items-center justify-center">Destination not found</div>;
    }

    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full">
                <Image
                    src={destination.img}
                    alt={destination.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-900/40 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-6 max-w-4xl">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-200 text-xs font-bold uppercase tracking-widest mb-6">
                            {destination.badge}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-lg">
                            {destination.title}
                        </h1>
                        <div className="flex items-center justify-center gap-6 text-white/90">
                            <div className="flex items-center gap-2 font-bold">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                    <MapPin size={16} />
                                </div>
                                {destination.distance}
                            </div>
                            <div className="flex items-center gap-2 font-bold">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                    <Clock size={16} />
                                </div>
                                {destination.time}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Overview Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-emerald-900/5 dark:border-white/5">
                            <h2 className="text-2xl font-bold text-emerald-900 dark:text-white mb-4">About the Journey</h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                                {destination.description}
                            </p>

                            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                                <h3 className="font-bold text-emerald-900 dark:text-white mb-4 uppercase text-sm tracking-widest">Highlights</h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {destination.highlights.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl">
                                            <CheckCircle className="text-emerald-600 dark:text-emerald-400 shrink-0" size={20} />
                                            <span className="font-medium text-emerald-900 dark:text-emerald-100">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Pricing Table */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-emerald-900/5 dark:border-white/5">
                            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-emerald-900 dark:text-white">Fixed Pricing</h2>
                                <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                                    <ShieldCheck size={14} /> All Inclusive
                                </div>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {Object.entries(destination.pricing).map(([vehicle, price]) => (
                                    <div key={vehicle} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500">
                                                <Car size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-emerald-900 dark:text-white">{vehicle}</h3>
                                                <p className="text-xs text-slate-500 uppercase tracking-wide">Fixed Rate</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                                ${price}
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase">Per Vehicle</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-emerald-900 rounded-3xl p-8 text-white shadow-2xl sticky top-24">
                            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-xs mb-6">
                                <Star fill="currentColor" size={14} /> Popular Choice
                            </div>
                            <h3 className="text-3xl font-black mb-2">Book This Trip</h3>
                            <p className="text-emerald-200/80 mb-8">Secure your transfer to {destination.name} now. Pay later options available.</p>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center py-3 border-b border-emerald-800">
                                    <span className="text-emerald-200">Distance</span>
                                    <span className="font-bold">{destination.distance}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-emerald-800">
                                    <span className="text-emerald-200">Duration</span>
                                    <span className="font-bold">{destination.time}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-emerald-800">
                                    <span className="text-emerald-200">Starting From</span>
                                    <span className="font-bold text-xl text-emerald-400">${destination.price}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsBookingOpen(true)}
                                className="w-full py-4 bg-white text-emerald-900 rounded-xl font-black text-lg hover:bg-emerald-50 transition-colors shadow-lg flex items-center justify-center gap-2 group"
                            >
                                Book Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            <p className="text-center text-xs text-emerald-400/60 mt-4 font-bold uppercase tracking-widest">
                                Free Cancellation • 24/7 Support
                            </p>
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
