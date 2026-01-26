"use client";

import React from 'react';
import { Clock, MapPin, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { TOURS } from '@/lib/mock-taxi-db';

export default function ToursPage() {
    return (
        <div className="min-h-screen bg-white text-emerald-900 pt-24 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-emerald-900">
                        Premium <span className="text-emerald-600">Sri Lankan</span> Tours
                    </h1>
                    <p className="text-emerald-900/60 text-lg md:text-xl max-w-2xl mx-auto font-light">
                        Discover the wonder of Asia with our curated selection of high-end,
                        professional chauffeur-driven tour packages.
                    </p>
                    <div className="flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={20} className="fill-emerald-500 text-emerald-500" />
                        ))}
                    </div>
                </div>

                {/* Tours Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {TOURS.map((tour) => (
                        <Card key={tour.id} className="group hover:-translate-y-2 transition-transform duration-500 border-none shadow-xl bg-slate-50">
                            <div className="h-64 relative overflow-hidden rounded-t-3xl">
                                <img
                                    src={tour.image}
                                    alt={tour.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&q=80&w=800";
                                    }}
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                                        {tour.category}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 right-4">
                                    <span className="px-4 py-2 bg-white text-emerald-900 text-lg font-bold rounded-xl shadow-xl">
                                        LKR {tour.price.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <CardHeader className="pb-2 px-8 pt-8">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-2xl text-emerald-900">{tour.title}</CardTitle>
                                </div>
                                <div className="flex items-center gap-4 text-emerald-900/40 text-xs mt-2 uppercase tracking-widest font-bold">
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} className="text-emerald-600" /> {tour.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPin size={14} className="text-emerald-600" /> Sri Lanka
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="px-8 pb-8">
                                <CardDescription className="line-clamp-3 mb-6 text-emerald-900/60">
                                    {tour.description}
                                </CardDescription>

                                <div className="space-y-4">
                                    <p className="text-xs font-black text-emerald-900 uppercase tracking-widest">What's Included</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {tour.includes.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-xs text-emerald-900/70 font-medium">
                                                <CheckCircle size={14} className="text-emerald-600" />
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="px-8 pb-8">
                                <button className="w-full py-4 bg-emerald-900 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-xl hover:bg-emerald-800 hover:scale-[1.02]">
                                    Book This Tour
                                    <ArrowRight size={18} />
                                </button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-20 p-12 bg-emerald-900 text-white rounded-[2.5rem] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                    <div className="absolute top-0 right-0 opacity-10 rotate-12 scale-150 pointer-events-none">
                        <Star size={300} fill="white" />
                    </div>
                    <div className="space-y-2 relative">
                        <h2 className="text-3xl md:text-4xl font-black">Want a Custom Tour?</h2>
                        <p className="font-medium opacity-80 text-emerald-100">Tailor-made itineraries for your unique Sri Lankan adventure.</p>
                    </div>
                    <button className="px-10 py-5 bg-white text-emerald-900 font-black rounded-2xl hover:scale-105 transition-all shadow-2xl relative">
                        Talk to an Expert
                    </button>
                </div>
            </div>
        </div>
    );
}
