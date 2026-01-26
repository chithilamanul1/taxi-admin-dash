'use client'

import React from 'react'
import { Clock, MapPin, Check, ArrowRight, Calendar, Users, Plane, Hotel, Car, Utensils } from 'lucide-react'
import { tourPackages } from '@/data/tours-data'
import Link from 'next/link'

export default function TourPackagesPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-emerald-900 to-slate-950 pt-32 pb-20">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-6">
                        <Plane size={14} />
                        Multi-Day Adventures
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                        Tour <span className="text-emerald-400">Packages</span>
                    </h1>
                    <p className="text-white/70 max-w-2xl mx-auto text-lg">
                        Complete Sri Lanka tour packages with accommodation, transport, and guided experiences. Everything taken care of for an unforgettable journey.
                    </p>
                </div>

                {/* What's Included Banner */}
                <div className="max-w-5xl mx-auto mb-16">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        <h3 className="text-white font-bold mb-4 text-center">All Tours Include:</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center gap-3 text-white/80">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                    <Hotel size={18} className="text-emerald-400" />
                                </div>
                                <span className="text-sm">Quality Hotels</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                    <Car size={18} className="text-emerald-400" />
                                </div>
                                <span className="text-sm">Private AC Vehicle</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                    <Utensils size={18} className="text-emerald-400" />
                                </div>
                                <span className="text-sm">Daily Breakfast</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                    <Users size={18} className="text-emerald-400" />
                                </div>
                                <span className="text-sm">Expert Driver-Guide</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tour Packages */}
                <div className="max-w-6xl mx-auto space-y-8">
                    {tourPackages.map((tour, index) => (
                        <div key={tour.id} className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all">
                            <div className="grid md:grid-cols-[300px,1fr] lg:grid-cols-[350px,1fr]">
                                {/* Image Side */}
                                <div className="relative h-64 md:h-full bg-gradient-to-br from-emerald-400 to-emerald-700">
                                    <div className="absolute inset-0 bg-black/20" />
                                    {/* Duration Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-4 py-2 bg-white/90 text-emerald-900 text-sm font-bold rounded-full flex items-center gap-2">
                                            <Calendar size={14} />
                                            {tour.duration}
                                        </span>
                                    </div>
                                    {/* Price */}
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="bg-emerald-900/90 backdrop-blur-sm rounded-2xl p-4 text-white">
                                            <div className="text-sm opacity-80 mb-1">Starting from</div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-black">${tour.price}</span>
                                                <span className="text-sm opacity-80">/{tour.priceType}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Side */}
                                <div className="p-6 md:p-8">
                                    <h3 className="text-2xl font-bold text-emerald-900 mb-3">
                                        {tour.title}
                                    </h3>

                                    <p className="text-slate-600 mb-4">
                                        {tour.description}
                                    </p>

                                    {/* Destinations */}
                                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                                        <MapPin size={16} className="text-emerald-600" />
                                        {tour.destinations.map((dest, i) => (
                                            <span key={i} className="text-sm text-slate-500">
                                                {dest}{i < tour.destinations.length - 1 ? ' →' : ''}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Highlights */}
                                    <div className="grid md:grid-cols-2 gap-2 mb-6">
                                        {tour.highlights.map((highlight, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                                <Check size={14} className="text-emerald-500 shrink-0" />
                                                <span>{highlight}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Includes */}
                                    <div className="bg-emerald-50 rounded-xl p-4 mb-6">
                                        <h4 className="text-sm font-bold text-emerald-900 mb-2">Package Includes:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {tour.includes.map((item, i) => (
                                                <span key={i} className="px-3 py-1 bg-white text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Link
                                            href={`/tour-packages/${tour.id}`}
                                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-900 text-white rounded-xl font-bold hover:bg-emerald-800 transition-colors"
                                        >
                                            View Full Itinerary <ArrowRight size={16} />
                                        </Link>
                                        <Link
                                            href={`https://wa.me/+94722885885?text=I'm interested in: ${tour.title}`}
                                            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-emerald-900 text-emerald-900 rounded-xl font-bold hover:bg-emerald-50 transition-colors"
                                        >
                                            Inquire on WhatsApp
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Custom Tour CTA */}
                <div className="max-w-4xl mx-auto mt-16 text-center">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-8 md:p-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            Want a Custom Tour?
                        </h2>
                        <p className="text-white/90 mb-6 max-w-xl mx-auto">
                            Tell us your dream Sri Lanka experience and we'll create a personalized itinerary just for you.
                            Family trips, honeymoons, adventure tours - we do it all!
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 rounded-2xl font-bold shadow-lg hover:bg-orange-50 transition-all"
                        >
                            Create Custom Tour <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="max-w-4xl mx-auto mt-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="bg-white/5 rounded-2xl p-6">
                            <div className="text-3xl font-black text-emerald-400 mb-2">500+</div>
                            <div className="text-white/60 text-sm">Happy Travelers</div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-6">
                            <div className="text-3xl font-black text-emerald-400 mb-2">5★</div>
                            <div className="text-white/60 text-sm">TripAdvisor Rating</div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-6">
                            <div className="text-3xl font-black text-emerald-400 mb-2">24/7</div>
                            <div className="text-white/60 text-sm">Support Available</div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-6">
                            <div className="text-3xl font-black text-emerald-400 mb-2">100%</div>
                            <div className="text-white/60 text-sm">Customizable</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
