'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Clock, MapPin, CheckCircle, X, Calendar, User, Info, ArrowLeft, ShieldCheck, Star } from 'lucide-react';
import Link from 'next/link';
import TourBookingModal from '@/components/TourBookingModal';

interface Tour {
    _id: string;
    title: string;
    slug: string;
    category: string;
    type?: string;
    duration: { days: number; nights: number };
    description: string;
    price: { amount: number; currency: string; type: string };
    images: string[];
    heroImage?: string;
    itinerary?: { day: number; title: string; description: string; activities: string[] }[];
    inclusions?: string[];
    exclusions?: string[];
    destinations?: string[];
    isFeatured?: boolean;
    isActive?: boolean;
}

export default function TourDetailsPage() {
    const params = useParams();
    const { slug } = params;

    const [tour, setTour] = useState<Tour | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    useEffect(() => {
        const fetchTour = async () => {
            if (!slug) return;
            try {
                const res = await fetch(`/api/tours?slug=${slug}`);
                const data = await res.json();
                if (data.success) {
                    setTour(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch tour:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTour();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-[#006064] rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading...</p>
                </div>
            </div>
        );
    }

    if (!tour) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Tour Not Found</h2>
                <Link href="/tours" className="text-[#00A99D] underline font-bold">Back to Tours</Link>
            </div>
        );
    }

    // Colors
    const primaryColor = '#006064'; // Deep Cyan
    const accentColor = '#00A99D'; // Teal

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] lg:h-[70vh]">
                <div className="absolute inset-0">
                    <img
                        src={tour.heroImage || tour.images?.[0] || '/vehicles/placeholder.png'}
                        alt={tour.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                </div>

                <div className="absolute top-24 left-0 w-full p-4">
                    <div className="container mx-auto max-w-7xl">
                        <Link href="/tours" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold">
                            <ArrowLeft size={16} /> Back to Tours
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 pb-12">
                    <div className="container mx-auto max-w-7xl">
                        <div className="max-w-3xl space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-[#00A99D] text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                                    {tour.type === 'safari' ? 'Safari Experience' : 'Tour Package'}
                                </span>
                                <div className="flex items-center gap-1 text-amber-400">
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                </div>
                            </div>
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                                {tour.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-white/90 font-medium text-sm md:text-base">
                                <span className="flex items-center gap-2">
                                    <Clock size={18} className="text-[#00A99D]" />
                                    {tour.duration?.days} Days {tour.duration?.nights > 0 && `& ${tour.duration.nights} Nights`}
                                </span>
                                <span className="flex items-center gap-2">
                                    <MapPin size={18} className="text-[#00A99D]" />
                                    {tour.destinations?.length ? `${tour.destinations?.length || 0} Destinations` : 'Sri Lanka'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-4 -mt-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-8">

                    {/* Left Column: Details */}
                    <div className="space-y-8">
                        {/* Description Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border-none">
                            <h2 className="text-2xl font-black text-[#006064] mb-4">About this Tour</h2>
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                                {tour.description}
                            </div>

                            {/* Key Highlights / Inclusions Grid */}
                            <div className="mt-8 pt-8 border-t border-slate-100">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Experience Highlights</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {tour.inclusions?.map((inc, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                            <div className="mt-0.5 min-w-[20px]">
                                                <CheckCircle size={20} className="text-[#00A99D]" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{inc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Itinerary Timeline */}
                        {tour.itinerary?.length > 0 && (
                            <div className="bg-white rounded-3xl p-8 shadow-xl border-none">
                                <h2 className="text-2xl font-black text-[#006064] mb-8">Tour Itinerary</h2>
                                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-3.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                                    {tour.itinerary.map((day, i) => (
                                        <div key={i} className="relative flex items-start group">
                                            {/* Timeline dot */}
                                            <div className="absolute left-0 w-7 h-7 bg-white border-4 border-[#00A99D] rounded-full z-10 shadow-lg group-hover:scale-110 transition-transform"></div>

                                            <div className="ml-12 w-full">
                                                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                                                    <span className="text-xs font-black text-[#00A99D] uppercase tracking-widest bg-cyan-50 px-3 py-1 rounded-full">
                                                        Day {day.day}
                                                    </span>
                                                    <h3 className="text-xl font-bold text-slate-800">{day.title}</h3>
                                                </div>
                                                <p className="text-slate-600 leading-relaxed mb-4">{day.description}</p>

                                                {/* Activities */}
                                                {day.activities?.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {day.activities.map((act, j) => (
                                                            <span key={j} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">
                                                                {act}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Booking Sidebar */}
                    <div className="relative">
                        <div className="sticky top-24 space-y-6">
                            {/* Pricing Card */}
                            <div className="bg-white rounded-3xl p-6 shadow-2xl border border-[#00A99D]/20 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00A99D]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                                <div className="text-center mb-6">
                                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-1">Starting From</p>
                                    <div className="flex items-baseline justify-center gap-1 text-[#006064]">
                                        <span className="text-lg font-bold">{tour.price?.currency}</span>
                                        <span className="text-5xl font-black tracking-tight">{tour.price?.amount?.toLocaleString()}</span>
                                    </div>
                                    <p className="text-slate-400 text-xs mt-2 font-medium">Per Person (Based on 2 Pax)</p>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">
                                        <ShieldCheck size={18} className="text-[#00A99D]" />
                                        <span className="font-bold">Best Price Guarantee</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">
                                        <User size={18} className="text-[#00A99D]" />
                                        <span className="font-bold">Professional Chauffeur</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">
                                        <CheckCircle size={18} className="text-[#00A99D]" />
                                        <span className="font-bold">No Hidden Charges</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsBookingOpen(true)}
                                    className="w-full py-4 bg-[#006064] text-white rounded-xl font-black text-lg transition-all hover:bg-[#004D40] hover:scale-[1.02] shadow-xl shadow-cyan-900/20"
                                >
                                    Request to Book
                                </button>

                                <p className="text-center text-xs text-slate-400 mt-4 font-medium">
                                    Free cancellation up to 24 hours before
                                </p>
                            </div>

                            {/* Need Help? */}
                            <div className="bg-[#006064] rounded-3xl p-6 text-white text-center shadow-xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="font-bold text-xl mb-2">Need a Custom Plan?</h3>
                                    <p className="text-cyan-100 text-sm mb-4">We can tailor this trip to your exact needs.</p>
                                    <Link href="/contact" className="inline-block px-6 py-2 bg-white text-[#006064] rounded-full text-sm font-bold hover:scale-105 transition-transform">
                                        Contact Us
                                    </Link>
                                </div>
                                {/* Decorative rings */}
                                <div className="absolute -bottom-12 -right-12 w-32 h-32 border-4 border-white/10 rounded-full"></div>
                                <div className="absolute -top-12 -left-12 w-32 h-32 border-4 border-white/10 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <TourBookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                tourTitle={tour.title}
                tourId={tour._id}
                duration={`${tour.duration?.days} Days`}
                price={tour.price?.amount} // This is 'From' price, modal handles estimation
                currency={tour.price?.currency}
            />
        </div>
    );
}
