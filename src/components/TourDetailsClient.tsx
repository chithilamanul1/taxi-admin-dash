'use client';

import React, { useState } from 'react';
import {
    Clock, MapPin, CheckCircle, ArrowLeft, ShieldCheck, Star, User, Plus, Minus, Check,
    MessageCircle, XCircle, AlertCircle, Info, Construction, Calendar,
    Ship, Heart, Utensils, Camera, Home, Leaf, Coffee, Waves, Sun, Bike, Shield, Mountain, Landmark, Map as MapIcon, Navigation, Users, Hotel,
    CheckSquare, X, Ban, TriangleAlert
} from 'lucide-react';
import Link from 'next/link';
import TourBookingModal from '@/components/TourBookingModal';
import TripMap from './TripMap';

export default function TourDetailsClient({ tour }) {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [collapsedDay, setCollapsedDay] = useState<number | null>(null); // null = all expanded
    const [memberCount, setMemberCount] = useState({ adults: 2, children: 0 });

    // Extract map points for visualization
    const getMapPoints = () => {
        const points: { lat?: number; lon?: number; name: string }[] = [];

        // Priority 1: Itinerary (Tour Packages)
        if (tour.itinerary && tour.itinerary.length > 0) {
            tour.itinerary.forEach((item: any) => {
                const name = item.location || item.title;
                if (name) {
                    points.push({
                        lat: item.lat,
                        lon: item.lng,
                        name: name
                    });
                }
            });
        }

        // Priority 2: Experience (Day Trips / Backup)
        if (points.length === 0 && tour.experience && tour.experience.length > 0) {
            tour.experience.forEach((item: any) => {
                if (item.heading) {
                    points.push({
                        lat: item.lat,
                        lon: item.lng,
                        name: item.heading
                    });
                }
            });
        }

        // Priority 3: Destination list
        if (points.length === 0 && Array.isArray(tour.destinations)) {
            tour.destinations.forEach((dest: string) => {
                points.push({ name: dest });
            });
        }

        return points;
    };

    const mapPoints = getMapPoints();
    const pickup = mapPoints[0] || null;
    const dropoff = mapPoints.length > 1 ? mapPoints[mapPoints.length - 1] : null;
    const waypoints = mapPoints.length > 2 ? mapPoints.slice(1, -1) : [];


    // Helper for icons mapping
    const getIcon = (name: string) => {
        const icons: { [key: string]: React.ReactNode } = {
            MapPin: <MapPin size={18} />,
            Ship: <Ship size={18} />,
            Heart: <Heart size={18} />,
            Utensils: <Utensils size={18} />,
            Castle: <Landmark size={18} />,
            Landmark: <Landmark size={18} />,
            Camera: <Camera size={18} />,
            Home: <Home size={18} />,
            Clock: <Clock size={18} />,
            Elephant: <AlertCircle size={18} />,
            Leaf: <Leaf size={18} />,
            Coffee: <Coffee size={18} />,
            Temple: <Landmark size={18} />,
            Music: <Info size={18} />,
            Sun: <Sun size={18} />,
            Mountain: <Mountain size={18} />,
            Waves: <Waves size={18} />,
            Bike: <Bike size={18} />,
            Shield: <Shield size={18} />,
            Car: <CheckCircle size={18} />,
        };
        return icons[name] || <MapPin size={18} />;
    };

    const priceAmount = typeof tour.price === 'object' ? tour.price.amount : tour.price;
    const priceCurrency = typeof tour.price === 'object' ? tour.price.currency : (tour.currency || 'USD');

    // Clean array logic for inclusions & exclusions (to avoid empty array rendering bugs and Next.js UI mismatch)
    const rawInclusions = (tour.inclusions?.length > 0 ? tour.inclusions : null) ||
        (tour.included?.length > 0 ? tour.included : null) ||
        (tour.includes?.length > 0 ? tour.includes : null) || [];
    const validInclusions = rawInclusions.filter((item: string) => {
        if (!item || typeof item !== 'string' || item.trim() === '') return false;
        const upper = item.toUpperCase();
        if (upper.includes('ADULT') && upper.includes('X') && upper.includes('$')) return false;
        return true;
    });

    const rawExclusions = (tour.exclusions?.length > 0 ? tour.exclusions : null) ||
        (tour.excluded?.length > 0 ? tour.excluded : null) ||
        (tour.excludes?.length > 0 ? tour.excludes : null) || [];
    const validExclusions = rawExclusions.filter((item: string) => {
        if (!item || typeof item !== 'string' || item.trim() === '') return false;
        return true;
    });

    return (
        <main className="min-h-screen bg-[#F8F9FA] pb-20 text-slate-900 font-sans">
            {/* Navigation Bar */}
            <div className="fixed top-0 left-0 w-full z-50 bg-black border-b-4 border-[#FACC15]">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/day-trips" className="flex items-center gap-2 text-white hover:text-[#FACC15] transition-colors font-black uppercase tracking-tighter text-sm">
                        <ArrowLeft size={18} /> Back
                    </Link>
                    <div className="hidden md:flex items-center gap-4">
                        <span className="text-[10px] font-black text-[#FACC15] uppercase tracking-widest">Selected Tour</span>
                        <span className="text-sm font-black text-white truncate max-w-[300px] uppercase tracking-tighter">{tour.title}</span>
                    </div>
                    <button onClick={() => setIsBookingOpen(true)} className="px-6 h-10 bg-[#FACC15] text-black font-black uppercase tracking-widest text-xs hover:bg-white transition-all">
                        Book Now
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden pt-16">
                <div className="absolute inset-0">
                    <img
                        src={tour.heroImage || tour.images?.[0] || tour.image || '/vehicles/placeholder.png'}
                        alt={tour.title}
                        className="w-full h-full object-cover grayscale-[20%]"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-6 pb-12 md:p-12 lg:p-20">
                    <div className="max-w-7xl mx-auto w-full">
                        <div className="inline-block bg-[#FACC15] text-black px-4 py-1 text-[10px] font-black uppercase tracking-widest mb-4">
                            {tour.category || 'Day Trip'}
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none tracking-tighter uppercase">
                            {tour.title}
                        </h1>
                        <div className="flex items-center gap-4 text-white/90 font-black uppercase tracking-widest text-xs bg-black/50 backdrop-blur-sm self-start p-3 border-l-4 border-[#FACC15]">
                            <MapPin size={16} className="text-[#FACC15]" />
                            <span>{Array.isArray(tour.destinations) ? tour.destinations.join(' / ') : tour.location || 'Sri Lanka'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column (8/12) */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Quick Stats bar */}
                        <div className="grid grid-cols-2 md:grid-cols-4 bg-black p-1 border-b-8 border-[#FACC15]">
                            <div className="bg-white p-6 border-r border-slate-100 flex flex-col items-center text-center gap-2">
                                <Clock size={20} className="text-black" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</span>
                                <span className="text-sm font-black text-black uppercase">{tour.duration?.days ? `${tour.duration.days} Days` : tour.duration}</span>
                            </div>
                            <div className="bg-white p-6 border-r border-slate-100 flex flex-col items-center text-center gap-2">
                                <Navigation size={20} className="text-black" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nature</span>
                                <span className="text-sm font-black text-black uppercase">Private AC</span>
                            </div>
                            <div className="bg-white p-6 border-r border-slate-100 flex flex-col items-center text-center gap-2">
                                <ShieldCheck size={20} className="text-black" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security</span>
                                <span className="text-sm font-black text-black uppercase">Fully Insured</span>
                            </div>
                            <div className="bg-white p-6 flex flex-col items-center text-center gap-2">
                                <Star size={20} className="text-[#FACC15]" fill="currentColor" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</span>
                                <span className="text-sm font-black text-black uppercase">5.0 Star</span>
                            </div>
                        </div>

                        {/* Overview */}
                        <section className="bg-white border-2 border-black p-8 md:p-12">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-2 h-8 bg-[#FACC15]"></div>
                                <h2 className="text-3xl font-black text-black uppercase tracking-tighter">
                                    Tour Overview
                                </h2>
                            </div>
                            <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-lg mb-10 font-medium">
                                {tour.description}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border border-slate-200">
                                {tour.highlights?.map((h, i) => (
                                    <div key={i} className="flex items-center gap-4 p-5 bg-white group hover:bg-slate-50 transition-colors">
                                        <Check size={18} className="text-[#FACC15] shrink-0" strokeWidth={4} />
                                        <span className="font-black text-black text-sm uppercase tracking-tight">{h}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Interactive Route Map */}
                        <section className="bg-white border-2 border-black p-8 md:p-12">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-2 h-8 bg-black"></div>
                                <h2 className="text-3xl font-black text-black uppercase tracking-tighter">
                                    Journey Visualization
                                </h2>
                            </div>

                            <div className="w-full h-[400px] bg-slate-100 border-4 border-black relative overflow-hidden mb-6">
                                {pickup ? (
                                    <TripMap
                                        pickup={pickup}
                                        dropoff={dropoff}
                                        waypoints={waypoints}
                                        onRouteCalculated={(data: any) => console.log('Route stats:', data)}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-slate-50">
                                        <MapIcon className="text-slate-300" size={48} />
                                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No route data available</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 bg-black text-[#FACC15] font-black uppercase tracking-widest text-[10px] inline-block">
                                Interactive GPS Route Active
                            </div>
                        </section>

                        {/* Itinerary */}
                        {(tour.itinerary?.length || 0) > 0 && (
                            <section className="bg-white border-2 border-black p-8 md:p-12">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-2 h-8 bg-[#FACC15]"></div>
                                    <h2 className="text-3xl font-black text-black uppercase tracking-tighter">
                                        Excursion Itinerary
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    {tour.itinerary.map((item, idx) => {
                                        const isExpanded = collapsedDay !== item.day;
                                        return (
                                            <div key={item.day || idx} className="border-t-4 border-black first:border-t-0">
                                                <button
                                                    onClick={() => setCollapsedDay(collapsedDay === item.day ? null : item.day)}
                                                    className={`w-full flex items-center gap-6 py-8 px-4 transition-colors text-left ${isExpanded ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'}`}
                                                >
                                                    <div className={`w-12 h-12 shrink-0 flex flex-col items-center justify-center font-black transition-colors ${isExpanded ? 'bg-black text-[#FACC15]' : 'bg-[#FACC15] text-black'}`}>
                                                        <span className="text-[8px] uppercase">DAY</span>
                                                        <span className="text-xl -mt-1">{item.day}</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-black tracking-tighter text-black uppercase">
                                                            {item.title}
                                                        </h3>
                                                        {item.location && <span className="text-[10px] font-black uppercase tracking-widest block mt-1 text-slate-500">{item.location}</span>}
                                                    </div>
                                                    <div className="text-black">
                                                        {isExpanded ? <Minus size={20} strokeWidth={3} /> : <Plus size={20} strokeWidth={3} />}
                                                    </div>
                                                </button>
                                                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[1000px] opacity-100 border-b-4 border-black' : 'max-h-0 opacity-0'}`}>
                                                    <div className="p-8 bg-white">
                                                        <p className="text-slate-800 leading-relaxed text-base font-bold mb-6">
                                                            {item.description || item.desc}
                                                        </p>
                                                        {item.activities && item.activities.length > 0 && (
                                                            <div className="flex flex-wrap gap-2">
                                                                {item.activities.map((act, i) => (
                                                                    <span key={i} className="px-3 py-1 bg-black text-[#FACC15] text-[10px] font-black uppercase tracking-widest border border-black">{act}</span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Inclusions & Exclusions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black border-4 border-black">
                            <section className="bg-white p-10">
                                <h3 className="text-2xl font-black text-black mb-8 uppercase tracking-tighter flex items-center gap-3">
                                    <CheckSquare size={24} className="text-[#FACC15]" />
                                    INCLUSIONS
                                </h3>
                                <ul className="space-y-4">
                                    {validInclusions.map((item: string, i: number) => (
                                        <li key={i} className="flex gap-3 text-black items-start group">
                                            <div className="shrink-0 mt-1 w-2 h-2 bg-black rounded-none"></div>
                                            <span className="text-sm font-black uppercase tracking-tight">{item}</span>
                                        </li>
                                    ))}
                                    {validInclusions.length === 0 && <li className="text-slate-400 text-xs italic">No inclusions specified</li>}
                                </ul>
                            </section>
                            <section className="bg-white p-10 border-l-4 border-black">
                                <h3 className="text-2xl font-black text-black mb-8 uppercase tracking-tighter flex items-center gap-3">
                                    <X size={24} className="text-red-500" />
                                    EXCLUSIONS
                                </h3>
                                <ul className="space-y-4">
                                    {validExclusions.map((item: string, i: number) => (
                                        <li key={i} className="flex gap-3 text-slate-500 items-start group">
                                            <div className="shrink-0 mt-1 w-2 h-2 bg-slate-300 rounded-none"></div>
                                            <span className="text-sm font-black uppercase tracking-tight line-through opacity-70">{item}</span>
                                        </li>
                                    ))}
                                    {validExclusions.length === 0 && <li className="text-slate-400 text-xs italic">No exclusions specified</li>}
                                </ul>
                            </section>
                        </div>

                        {/* Experience Timeline */}
                        {tour.experience && tour.experience.length > 0 && (
                            <section className="bg-white border-2 border-black p-8 md:p-12">
                                <div className="flex items-center gap-4 mb-12">
                                    <div className="w-2 h-8 bg-black"></div>
                                    <h2 className="text-3xl font-black text-black uppercase tracking-tighter">
                                        Your Experience
                                    </h2>
                                </div>
                                <div className="space-y-0 relative ml-2">
                                    <div className="absolute left-1 top-0 bottom-0 w-1 bg-black opacity-10" />
                                    {tour.experience.map((exp: any, idx: number) => (
                                        <div key={idx} className="relative pl-12 pb-12 last:pb-0">
                                            <div className="absolute left-0 top-1.5 w-3 h-3 bg-black ring-4 ring-white" />
                                            <div className="flex flex-col gap-2">
                                                <h4 className="text-xl font-black text-black uppercase tracking-tighter">{exp.heading}</h4>
                                                <p className="text-slate-600 font-bold text-base leading-relaxed max-w-2xl">{exp.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="sticky top-24 space-y-8">
                            <div className="bg-black text-white p-1 pt-0">
                                <div className="bg-white p-8 border-b-8 border-[#FACC15]">
                                    <div className="mb-8 text-center bg-black py-4 px-2">
                                        <span className="text-[10px] font-black text-[#FACC15] uppercase tracking-widest block mb-2">Exclusive Web Rate</span>
                                        <div className="flex items-center justify-center gap-1 text-white">
                                            <span className="text-xl font-black">{priceCurrency}</span>
                                            <span className="text-6xl font-black tracking-tighter">{priceAmount?.toLocaleString()}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest mt-2 block">All-Inclusive Price</span>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center justify-between border-2 border-black p-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest px-4">Adults</span>
                                            <div className="flex items-center bg-black p-1">
                                                <button onClick={() => setMemberCount(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))} className="w-8 h-8 flex items-center justify-center text-white hover:text-[#FACC15]"><Minus size={16} /></button>
                                                <span className="w-10 text-center font-black text-white">{memberCount.adults}</span>
                                                <button onClick={() => setMemberCount(prev => ({ ...prev, adults: prev.adults + 1 }))} className="w-8 h-8 flex items-center justify-center text-white hover:text-[#FACC15]"><Plus size={16} /></button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between border-2 border-black p-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest px-4">Children</span>
                                            <div className="flex items-center bg-black p-1">
                                                <button onClick={() => setMemberCount(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))} className="w-8 h-8 flex items-center justify-center text-white hover:text-[#FACC15]"><Minus size={16} /></button>
                                                <span className="w-10 text-center font-black text-white">{memberCount.children}</span>
                                                <button onClick={() => setMemberCount(prev => ({ ...prev, children: prev.children + 1 }))} className="w-8 h-8 flex items-center justify-center text-white hover:text-[#FACC15]"><Plus size={16} /></button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <button onClick={() => setIsBookingOpen(true)} className="w-full h-16 bg-[#FACC15] text-black font-black uppercase tracking-widest text-lg hover:bg-black hover:text-white transition-all border-4 border-black">
                                            Instant Booking
                                        </button>
                                        <a href={`https://wa.me/+94716885880?text=${encodeURIComponent(`Hi, I'm interested in booking "${tour.title}".`)}`} target="_blank" className="w-full h-16 bg-white text-black font-black uppercase tracking-widest text-lg border-4 border-black flex items-center justify-center gap-3 hover:bg-black hover:text-white transition-all">
                                            <MessageCircle size={22} /> WhatsApp Inquiry
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Seals */}
                            <div className="bg-white border-2 border-black p-6 grid grid-cols-2 gap-4">
                                <div className="flex flex-col items-center gap-2 text-center p-3 grayscale group-hover:grayscale-0 transition-all">
                                    <ShieldCheck size={24} className="text-[#FACC15]" />
                                    <span className="text-[8px] font-black text-black uppercase tracking-tight">Secured Booking</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 text-center p-3 grayscale group-hover:grayscale-0 transition-all">
                                    <Users size={24} className="text-[#FACC15]" />
                                    <span className="text-[8px] font-black text-black uppercase tracking-tight">Private Transport</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <TourBookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                tourTitle={tour.title}
                tourId={tour._id || tour.id}
                duration={tour.duration?.days ? `${tour.duration.days} Days` : tour.duration}
                price={priceAmount}
                currency={priceCurrency}
            />
        </main>
    );
}
