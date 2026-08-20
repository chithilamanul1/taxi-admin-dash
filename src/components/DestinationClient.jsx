'use client';

import Image from 'next/image';
import { MapPin, Clock, CheckCircle, Car, Info, Calendar, Landmark } from 'lucide-react';
import BookingWidget from '@/components/BookingWidget';

export default function DestinationClient({ destination }) {
    const targetLocation = destination.name;
    const defaultDropoff = {
        name: destination.fullAddress || `${destination.name}, Sri Lanka`,
        lat: destination.coords?.lat || null,
        lng: destination.coords?.lon || null
    };

    return (
        <div className="bg-white dark:bg-emerald-900 min-h-screen pb-20">
            {/* Hero Section */}
            <div className="relative h-[45vh] md:h-[60vh] w-full">
                <Image
                    src={destination.img || '/hero-bg.jpg'}
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
                        <h1 className="text-4xl md:text-7xl font-black text-white mb-2 md:mb-4 drop-shadow-lg tracking-tight">
                            {destination.name}
                        </h1>
                        <p className="text-base md:text-xl text-white/90 font-medium mb-4 md:mb-8 drop-shadow-md max-w-2xl mx-auto line-clamp-2 md:line-clamp-none">
                            {destination.description}
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-white/90">
                            <div className="flex items-center gap-2 font-bold bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                                <Car size={18} className="text-emerald-400" />
                                24/7 Service
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-20 relative z-10 space-y-10">

                {/* Booking Widget */}
                <div className="-mx-4 md:mx-0 bg-white dark:bg-zinc-900 rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl border-t border-slate-100 md:border dark:border-white/5 overflow-hidden">
                    <BookingWidget
                        defaultTab="pickup"
                        targetLocation={targetLocation}
                    />
                </div>

                {/* Overview Card */}
                <div className="bg-white dark:bg-emerald-900 rounded-3xl p-8 md:p-12 shadow-xl border border-emerald-900/5 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <Info size={24} />
                        </div>
                        <h2 className="text-3xl font-black text-emerald-900 dark:text-white">Experience {destination.name}</h2>
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
                                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest text-xs">
                                        <Calendar size={16} /> Best Time to Visit
                                    </div>
                                    <p className="font-bold text-emerald-900 dark:text-white text-lg">
                                        {destination.bestTimeToVisit}
                                    </p>
                                </div>
                            )}
                            {destination.localAttractions && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest text-xs">
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
                        <h3 className="font-bold text-emerald-900 dark:text-white mb-8 uppercase text-sm tracking-widest">Journey Highlights</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {destination.highlights && destination.highlights.map((item, i) => (
                                <div key={i} className="flex items-center gap-4 bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-2xl border border-emerald-100/50 dark:border-emerald-500/10">
                                    <div className="w-10 h-10 bg-white dark:bg-emerald-500/20 rounded-xl flex items-center justify-center shadow-sm">
                                        <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={20} />
                                    </div>
                                    <span className="font-bold text-emerald-900 dark:text-emerald-100 tracking-tight">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
