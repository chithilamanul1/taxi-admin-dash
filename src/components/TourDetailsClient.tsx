'use client';

import React, { useState } from 'react';
import {
    Clock, MapPin, CheckCircle, ArrowLeft, ShieldCheck, Star, User, Plus, Minus, Check,
    MessageCircle, XCircle, AlertCircle, Info, Construction, Calendar,
    Ship, Heart, Utensils, Camera, Home, Leaf, Coffee, Waves, Sun, Bike, Shield, Mountain, Landmark, Map as MapIcon, Navigation, Users, Hotel
} from 'lucide-react';
import Link from 'next/link';
import TourBookingModal from '@/components/TourBookingModal';
import TripMap from './TripMap';

export default function TourDetailsClient({ tour }) {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [activeDay, setActiveDay] = useState(1);
    const [memberCount, setMemberCount] = useState({ adults: 2, children: 0 });

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

    return (
        <main className="min-h-screen bg-white pb-20 text-slate-900">
            {/* Navigation Bar */}
            <div className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/day-trips" className="flex items-center gap-2 text-slate-700 hover:text-amber-600 transition-colors font-black uppercase tracking-widest text-xs">
                        <ArrowLeft size={18} /> Back to Day Trips
                    </Link>
                    <div className="hidden md:flex items-center gap-6">
                        <span className="text-[10px] font-black text-slate-600 font-bold uppercase tracking-widest">You are viewing</span>
                        <span className="text-sm font-black text-slate-900 truncate max-w-[200px]">{tour.title}</span>
                    </div>
                    <button onClick={() => setIsBookingOpen(true)} className="px-6 py-2.5 bg-amber-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all">
                        Book Now
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative h-[70vh] w-full overflow-hidden pt-20">
                <div className="absolute inset-0">
                    <img
                        src={tour.heroImage || tour.images?.[0] || tour.image || '/vehicles/placeholder.png'}
                        alt={tour.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 pb-20 md:p-12 md:pb-24 lg:p-20 lg:pb-32">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-wrap gap-3 mb-6">
                            <span className="px-4 py-1.5 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                {tour.category || 'Day Trip'}
                            </span>
                            <div className="flex items-center gap-1 px-4 py-1.5 bg-white/90 backdrop-blur text-amber-500 rounded-full shadow-lg border border-slate-100">
                                <Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-slate-900 mb-6 leading-[1.1] max-w-5xl tracking-tighter drop-shadow-sm">
                            {tour.title}
                        </h1>
                        <div className="flex items-center gap-3 text-slate-700 font-black uppercase tracking-widest text-xs">
                            <MapPin size={18} className="text-amber-500" />
                            <span>{Array.isArray(tour.destinations) ? tour.destinations.join(' • ') : tour.location || 'Sri Lanka'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column (8/12) */}
                    <div className="lg:col-span-8 space-y-16">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center gap-2">
                                <Clock size={24} className="text-amber-500" />
                                <span className="text-[10px] font-black text-slate-600 font-bold uppercase tracking-widest">Duration</span>
                                <span className="text-sm font-black text-slate-900">{tour.duration?.days ? `${tour.duration.days} Days` : tour.duration}</span>
                            </div>
                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center gap-2">
                                <Navigation size={24} className="text-amber-500" />
                                <span className="text-[10px] font-black text-slate-600 font-bold uppercase tracking-widest">Transport</span>
                                <span className="text-sm font-black text-slate-900">Private AC Car</span>
                            </div>
                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center gap-2">
                                <ShieldCheck size={24} className="text-amber-500" />
                                <span className="text-[10px] font-black text-slate-600 font-bold uppercase tracking-widest">Status</span>
                                <span className="text-sm font-black text-slate-900">Instant Book</span>
                            </div>
                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center gap-2">
                                <Users size={24} className="text-amber-500" />
                                <span className="text-[10px] font-black text-slate-600 font-bold uppercase tracking-widest">Group</span>
                                <span className="text-sm font-black text-slate-900">Private</span>
                            </div>
                        </div>

                        {/* Overview */}
                        <section className="bg-white rounded-[3rem] p-10 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100">
                            <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-4">
                                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                                    <Info className="text-amber-500" size={24} />
                                </div>
                                Tour Overview
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-lg mb-10">
                                {tour.description}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {tour.highlights?.map((h, i) => (
                                    <div key={i} className="flex items-center gap-4 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 group hover:border-amber-200 transition-colors">
                                        <div className="w-8 h-8 shrink-0 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-amber-500 transition-colors">
                                            <Check size={16} className="text-amber-500 group-hover:text-white" />
                                        </div>
                                        <span className="font-bold text-slate-700 text-sm leading-snug">{h}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Interactive Route Map */}
                        <section className="bg-white rounded-[3rem] p-10 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <MapIcon size={120} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-4">
                                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                                    <MapIcon className="text-amber-500" size={24} />
                                </div>
                                Route Visualization
                            </h2>
                            <p className="text-slate-700 mb-8 text-lg font-bold">See your journey across Sri Lanka's most beautiful destinations.</p>

                            {/* Google Map Placeholder */}
                            {/* Google Map Integration */}
                            <div className="w-full h-96 bg-slate-100 rounded-[2.5rem] border-4 border-white shadow-inner relative group overflow-hidden">
                                <TripMap
                                    pickup={tour.destinations?.[0] ? { name: tour.destinations[0] } : null}
                                    dropoff={tour.destinations?.length > 1 ? { name: tour.destinations[tour.destinations.length - 1] } : (tour.location ? { name: tour.location } : null)}
                                    waypoints={tour.destinations?.slice(1, -1).map((d: string) => ({ name: d })) || []}
                                    onRouteCalculated={(data: any) => console.log('Route stats:', data)}
                                />
                            </div>
                        </section>

                        {/* Itinerary */}
                        {(tour.itinerary?.length || 0) > 0 && (
                            <section className="bg-white rounded-[3rem] p-10 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100">
                                <h2 className="text-3xl font-black text-slate-900 mb-10 tracking-tight flex items-center gap-4">
                                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                                        <Calendar className="text-amber-500" size={24} />
                                    </div>
                                    Tour Schedule
                                </h2>
                                <div className="space-y-6 relative">
                                    <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-slate-50 border-r border-slate-100 md:block hidden" />
                                    {tour.itinerary.map((item, idx) => (
                                        <div key={item.day} className="group relative">
                                            <button
                                                onClick={() => setActiveDay(activeDay === item.day ? null : item.day)}
                                                className={`w-full flex items-center gap-8 p-8 rounded-[2rem] border transition-all duration-500 text-left ${activeDay === item.day ? 'bg-slate-900 border-slate-900 shadow-2xl scale-[1.02]' : 'bg-white border-slate-100 hover:border-amber-200'}`}
                                            >
                                                <div className={`w-16 h-16 shrink-0 rounded-2xl flex flex-col items-center justify-center font-black shadow-lg transition-all duration-500 ${activeDay === item.day ? 'bg-amber-500 text-white rotate-6' : 'bg-slate-50 text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-600'}`}>
                                                    <span className="text-[10px] uppercase tracking-tighter">Day</span>
                                                    <span className="text-2xl -mt-1">{item.day}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className={`text-xl font-black tracking-tight ${activeDay === item.day ? 'text-white' : 'text-slate-800'}`}>
                                                        {item.title}
                                                    </h3>
                                                    {item.location && <span className={`text-[10px] font-bold uppercase tracking-widest block mt-1 ${activeDay === item.day ? 'text-amber-400' : 'text-slate-400'}`}>{item.location}</span>}
                                                </div>
                                                <div className={`transition-all duration-500 ${activeDay === item.day ? 'rotate-180 text-amber-500' : 'text-slate-300'}`}>
                                                    {activeDay === item.day ? <Minus size={24} /> : <Plus size={24} />}
                                                </div>
                                            </button>
                                            <div className={`grid transition-all duration-500 ease-in-out ${activeDay === item.day ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 overflow-hidden'}`}>
                                                <div className="overflow-hidden">
                                                    <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 ml-0 md:ml-6">
                                                        <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-line font-bold mb-6">
                                                            {item.description || item.desc}
                                                        </p>
                                                        {item.activities && (
                                                            <div className="flex flex-wrap gap-2">
                                                                {item.activities.map((act, i) => (
                                                                    <span key={i} className="px-4 py-2 bg-white rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">{act}</span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Inclusions & Exclusions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <section className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-950/5 border border-slate-50">
                                <h3 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-widest flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                                        <CheckCircle size={20} className="text-amber-500" />
                                    </div>
                                    What's Included
                                </h3>
                                <ul className="space-y-5">
                                    {(tour.includes || tour.inclusions)?.map((item, i) => (
                                        <li key={i} className="flex gap-4 text-slate-700 group">
                                            <div className="shrink-0 mt-1 w-5 h-5 bg-amber-50 rounded flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                                                <Check size={12} className="text-amber-500 group-hover:text-white" />
                                            </div>
                                            <span className="text-sm font-bold leading-snug">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                            <section className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-rose-900/5 border border-slate-50">
                                <h3 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-widest flex items-center gap-3">
                                    <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                                        <XCircle size={20} className="text-rose-500" />
                                    </div>
                                    Not Included
                                </h3>
                                <ul className="space-y-5">
                                    {(tour.excludes || tour.exclusions)?.map((item, i) => (
                                        <li key={i} className="flex gap-4 text-slate-700 group">
                                            <div className="shrink-0 mt-1 w-5 h-5 bg-rose-50 rounded flex items-center justify-center group-hover:bg-rose-500 transition-colors">
                                                <Plus size={12} className="text-rose-500 group-hover:text-white rotate-45" />
                                            </div>
                                            <span className="text-sm font-bold leading-snug">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="lg:col-span-4 space-y-10">
                        {/* Booking Widget */}
                        <div className="sticky top-28 space-y-10">
                            <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl -mr-24 -mt-24"></div>

                                <div className="mb-10 text-center">
                                    <span className="text-[10px] font-black text-slate-600 font-bold uppercase tracking-widest block mb-1">Unbeatable Value</span>
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="text-xl font-black text-amber-500 uppercase">{priceCurrency}</span>
                                        <span className="text-6xl font-black text-slate-900 tracking-tighter">{priceAmount?.toLocaleString()}</span>
                                    </div>
                                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">per person</span>
                                </div>

                                <div className="space-y-6 mb-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Adults</label>
                                        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <button onClick={() => setMemberCount(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 hover:border-amber-400 rounded-xl transition-all shadow-sm"><Minus size={20} className="text-slate-400" /></button>
                                            <span className="text-2xl font-black text-slate-900">{memberCount.adults}</span>
                                            <button onClick={() => setMemberCount(prev => ({ ...prev, adults: prev.adults + 1 }))} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 hover:border-amber-400 rounded-xl transition-all shadow-sm"><Plus size={20} className="text-slate-400" /></button>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Children</label>
                                        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <button onClick={() => setMemberCount(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 hover:border-amber-400 rounded-xl transition-all shadow-sm"><Minus size={20} className="text-slate-400" /></button>
                                            <span className="text-2xl font-black text-slate-900">{memberCount.children}</span>
                                            <button onClick={() => setMemberCount(prev => ({ ...prev, children: prev.children + 1 }))} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 hover:border-amber-400 rounded-xl transition-all shadow-sm"><Plus size={20} className="text-slate-400" /></button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <button onClick={() => setIsBookingOpen(true)} className="w-full py-6 bg-amber-500 hover:bg-amber-600 text-white rounded-[1.5rem] font-black text-xl shadow-xl shadow-amber-200 transition-all hover:scale-[1.02] flex items-center justify-center gap-3">
                                        <Calendar size={24} /> Instant Booking
                                    </button>
                                    <a href={`https://wa.me/+94716885880?text=${encodeURIComponent(`Hi, I'm interested in booking "${tour.title}".`)}`} target="_blank" className="w-full py-6 bg-[#25D366] hover:bg-[#1fae54] text-white rounded-[1.5rem] font-black text-xl shadow-xl shadow-amber-100 transition-all hover:scale-[1.02] flex items-center justify-center gap-3">
                                        <MessageCircle size={24} /> WhatsApp Us
                                    </a>
                                </div>

                                <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-center gap-6">
                                    <div className="flex flex-col items-center gap-1">
                                        <ShieldCheck size={20} className="text-amber-500" />
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest text-center leading-tight">Secure Payments</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <Users size={20} className="text-amber-500" />
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest text-center leading-tight">Private Transfers</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <Shield size={20} className="text-indigo-500" />
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest text-center leading-tight">Full Insurance</span>
                                    </div>
                                </div>
                            </div>

                            {/* Trip Planner Callout */}
                            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
                                <div className="absolute bottom-0 right-0 p-4 opacity-10">
                                    <Navigation size={100} />
                                </div>
                                <h4 className="text-xl font-black mb-4 tracking-tight">Need a custom plan?</h4>
                                <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">Use our AI Trip Planner to create a completely unique itinerary based on your interests.</p>
                                <Link href="/trip-planner" className="flex items-center justify-center gap-2 py-4 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 font-black text-xs uppercase tracking-widest transition-colors">
                                    Launch Planner <Plus size={16} />
                                </Link>
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
