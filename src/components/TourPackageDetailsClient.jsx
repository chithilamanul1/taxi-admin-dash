'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    Check, MessageCircle, MapPin, Clock, Calendar, ArrowLeft, Plus, Minus,
    ShieldCheck, User, Users, Hotel, CheckCircle, XCircle, AlertCircle, Info, Construction,
    Ship, Heart, Utensils, Camera, Home, Leaf, Coffee, Waves, Sun, Bike, Shield, Mountain, Landmark, Map as MapIcon, Navigation,
    Ban, TriangleAlert, X
} from 'lucide-react'
import TourBookingModal from './TourBookingModal'
import TripMap from './TripMap'

export default function TourPackageDetailsClient({ tour }) {
    const [collapsedDay, setCollapsedDay] = useState(null) // null = all expanded
    const [memberCount, setMemberCount] = useState({ adults: 2, children: 0 })
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Extract map points for visualization
    const getMapPoints = () => {
        const points = [];

        // Priority 1: Itinerary (Tour Packages)
        if (tour.itinerary && tour.itinerary.length > 0) {
            tour.itinerary.forEach((item) => {
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

        // Priority 2: Experience (Backup)
        if (points.length === 0 && tour.experience && tour.experience.length > 0) {
            tour.experience.forEach((item) => {
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
            tour.destinations.forEach((dest) => {
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
    const getIcon = (name) => {
        const icons = {
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
        }
        return icons[name] || <MapPin size={18} />
    }

    const priceAmount = typeof tour.price === 'object' ? tour.price.amount : tour.price;
    const priceCurrency = typeof tour.price === 'object' ? tour.price.currency : (tour.currency || 'USD');

    // Clean array logic for inclusions & exclusions
    const rawInclusions = (tour.inclusions?.length > 0 ? tour.inclusions : null) ||
        (tour.included?.length > 0 ? tour.included : null) ||
        (tour.includes?.length > 0 ? tour.includes : null) || [];
    const validInclusions = rawInclusions.filter((item) => {
        if (!item || typeof item !== 'string' || item.trim() === '') return false;
        const upper = item.toUpperCase();
        if (upper.includes('ADULT') && upper.includes('X') && upper.includes('$')) return false;
        return true;
    });

    const rawExclusions = (tour.exclusions?.length > 0 ? tour.exclusions : null) ||
        (tour.excluded?.length > 0 ? tour.excluded : null) ||
        (tour.excludes?.length > 0 ? tour.excludes : null) || [];
    const validExclusions = rawExclusions.filter((item) => {
        if (!item || typeof item !== 'string' || item.trim() === '') return false;
        return true;
    });

    return (
        <main className="min-h-screen bg-slate-50 pb-20 text-slate-900 font-sans">
            {/* Premium Glass Header */}
            <div className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/tour-packages" className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-all font-bold text-sm group">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                            <ArrowLeft size={16} />
                        </div>
                        Back to Tours
                    </Link>
                    <div className="hidden lg:flex items-center gap-8">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Package</span>
                            <span className="text-sm font-bold text-slate-900 truncate max-w-[250px]">{tour.title}</span>
                        </div>
                        <div className="h-8 w-px bg-slate-200" />
                        <button onClick={() => setIsModalOpen(true)} className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:scale-105 transition-all text-sm">
                            Book Now
                        </button>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="lg:hidden px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl text-sm">
                        Book
                    </button>
                </div>
            </div>

            {/* Immersive Hero Section */}
            <div className="relative h-[75vh] w-full overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={tour.heroImage || tour.images?.[0] || tour.image || '/vehicles/placeholder.png'}
                        alt={tour.title}
                        fill
                        className="object-cover transition-transform duration-[10s] hover:scale-110"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-6 pb-20 md:p-12 lg:p-24">
                    <div className="max-w-7xl mx-auto w-full">
                        <div className="flex flex-wrap gap-3 mb-6">
                            <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                <ShieldCheck size={14} />
                                {tour.type || 'Verified Premium'}
                            </div>
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30">
                                <Clock size={14} />
                                {typeof tour.duration === 'object' ? `${tour.duration.days}D / ${tour.duration.nights}N` : tour.duration}
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tight max-w-5xl">
                            {tour.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-3 text-white/90 font-bold text-sm bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                    <MapPin size={20} className="text-emerald-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-white/50 uppercase tracking-widest font-black">Route</span>
                                    <span>{Array.isArray(tour.destinations) ? tour.destinations.join(' • ') : 'Island Wide Tour'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Decorative curve */}
                <div className="absolute bottom-0 left-0 w-full h-16 bg-slate-50 rounded-t-[3rem]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column (8/12) */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Quick Stats bar - Modern Floating Style */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                            {[
                                { icon: Users, label: 'Group', val: 'Private Only' },
                                { icon: Navigation, label: 'Transit', val: 'Luxury AC' },
                                { icon: Hotel, label: 'Hotels', val: '3-5 Star' },
                                { icon: ShieldCheck, label: 'Status', val: 'Verified', color: 'text-emerald-500' }
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col items-center text-center p-4 rounded-3xl hover:bg-slate-50 transition-colors">
                                    <div className={`w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3 ${stat.color || 'text-emerald-600'}`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</span>
                                    <span className="text-xs font-bold text-slate-900 uppercase">{stat.val}</span>
                                </div>
                            ))}
                        </div>

                        {/* Overview Section */}
                        <section className="bg-white rounded-[3rem] p-8 md:p-14 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-1.5 bg-emerald-500 rounded-full" />
                                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                                        Package Overview
                                    </h2>
                                </div>
                                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg mb-12 font-medium">
                                    {tour.description}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {tour.highlights?.map((h, i) => (
                                        <div key={i} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl hover:bg-emerald-50 transition-colors group">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-emerald-500 transition-all">
                                                <Check size={14} className="text-emerald-500 group-hover:text-white" strokeWidth={3} />
                                            </div>
                                            <span className="font-bold text-slate-700 text-sm uppercase tracking-tight">{h}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Visual Route Section */}
                        <section className="bg-white rounded-[3rem] p-8 md:p-14 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-1.5 bg-slate-900 rounded-full" />
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                                    Journey Visualization
                                </h2>
                            </div>

                            <div className="w-full h-[450px] bg-slate-100 rounded-[2rem] relative overflow-hidden mb-8 border border-slate-100 shadow-inner">
                                {pickup ? (
                                    <TripMap
                                        pickup={pickup}
                                        dropoff={dropoff}
                                        waypoints={waypoints}
                                        onRouteCalculated={(data) => console.log('Route stats:', data)}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-slate-50">
                                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
                                            <MapIcon className="text-slate-300" size={32} />
                                        </div>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Satellite Data Syncing...</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-3 px-6 py-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-700 font-bold text-xs">
                                <Activity size={16} className="animate-pulse" />
                                <span>Interactive GPS Route Enabled • Accurate Point-to-Point Distances</span>
                            </div>
                        </section>

                        {/* Elegant Itinerary Section */}
                        {tour.itinerary && tour.itinerary.length > 0 && (
                            <section className="space-y-8">
                                <div className="flex items-center gap-4 px-4">
                                    <div className="w-12 h-1.5 bg-emerald-500 rounded-full" />
                                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                                        Day-by-Day Experience
                                    </h2>
                                </div>
                                <div className="space-y-6">
                                    {tour.itinerary.map((item, idx) => {
                                        const isExpanded = collapsedDay !== item.day;
                                        return (
                                            <div key={item.day || idx} className="group">
                                                <button
                                                    onClick={() => setCollapsedDay(collapsedDay === item.day ? null : item.day)}
                                                    className={`w-full flex items-center gap-6 p-6 rounded-[2rem] transition-all text-left border ${isExpanded ? 'bg-white shadow-xl shadow-slate-200/50 border-emerald-100' : 'bg-white border-slate-100 hover:bg-slate-50'}`}
                                                >
                                                    <div className={`w-14 h-14 shrink-0 flex flex-col items-center justify-center rounded-2xl font-black transition-all ${isExpanded ? 'bg-emerald-600 text-white rotate-3 shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                                                        <span className="text-[8px] uppercase tracking-tighter">DAY</span>
                                                        <span className="text-2xl -mt-1">{item.day}</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-bold text-slate-900 leading-tight">
                                                            {item.title}
                                                        </h3>
                                                        {item.location && <span className="text-[10px] font-black uppercase tracking-widest block mt-2 text-emerald-600/70">{item.location}</span>}
                                                    </div>
                                                    <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-emerald-50 text-emerald-600' : 'text-slate-400'}`}>
                                                        <Plus size={20} strokeWidth={3} />
                                                    </div>
                                                </button>
                                                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                                                    <div className="p-10 bg-white rounded-[2.5rem] border border-emerald-50 shadow-inner ml-4 mr-4">
                                                        <p className="text-slate-600 leading-relaxed text-lg font-medium mb-8 whitespace-pre-line bg-slate-50/50 p-6 rounded-2xl border-l-4 border-emerald-500">
                                                            {item.description || item.desc}
                                                        </p>
                                                        {item.activities && item.activities.length > 0 && (
                                                            <div className="flex flex-wrap gap-2">
                                                                {item.activities.map((act, i) => (
                                                                    <span key={i} className="px-4 py-2 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100/50">{act}</span>
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

                        {/* Experience Visual Timeline */}
                        {tour.experience && tour.experience.length > 0 && (
                            <section className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white overflow-hidden relative shadow-2xl">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-600/20 to-transparent pointer-events-none" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-16">
                                        <div className="w-12 h-1.5 bg-emerald-500 rounded-full" />
                                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                                            The Experience
                                        </h2>
                                    </div>
                                    <div className="space-y-0 relative ml-4">
                                        <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10" />
                                        {tour.experience.map((exp, idx) => (
                                            <div key={idx} className="relative pl-12 pb-14 last:pb-0 group">
                                                <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-150 transition-transform shadow-[0_0_15px_#10b981]" />
                                                <div className="flex flex-col gap-3">
                                                    <h4 className="text-2xl font-bold text-white tracking-tight">{exp.heading}</h4>
                                                    <p className="text-white/60 font-medium text-lg leading-relaxed max-w-2xl">{exp.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Premium Inclusions/Exclusions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <section className="bg-white p-10 rounded-[2.5rem] shadow-lg border border-slate-100">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                        <CheckCircle size={24} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">
                                        Included
                                    </h3>
                                </div>
                                <ul className="space-y-5">
                                    {validInclusions.map((item, i) => (
                                        <li key={i} className="flex gap-4 text-slate-600 items-start group">
                                            <div className="shrink-0 mt-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                            <span className="text-sm font-bold leading-tight">{item}</span>
                                        </li>
                                    ))}
                                    {validInclusions.length === 0 && <li className="text-slate-400 text-xs italic">No inclusions specified</li>}
                                </ul>
                            </section>
                            <section className="bg-white p-10 rounded-[2.5rem] shadow-lg border border-slate-100">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                                        <XCircle size={24} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">
                                        Excluded
                                    </h3>
                                </div>
                                <ul className="space-y-5">
                                    {validExclusions.map((item, i) => (
                                        <li key={i} className="flex gap-4 text-slate-400 items-start group">
                                            <div className="shrink-0 mt-1.5 w-1.5 h-1.5 bg-slate-300 rounded-full" />
                                            <span className="text-sm font-bold opacity-70 leading-tight">{item}</span>
                                        </li>
                                    ))}
                                    {validExclusions.length === 0 && <li className="text-slate-400 text-xs italic">No exclusions specified</li>}
                                </ul>
                            </section>
                        </div>
                    </div>

                    {/* Right Column (High-End Sidebar) */}
                    <div className="lg:col-span-4 mt-[-150px] lg:mt-0">
                        <div className="sticky top-32 space-y-8">
                            <div className="bg-slate-950 rounded-[3rem] p-1 shadow-2xl overflow-hidden relative group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
                                <div className="bg-white rounded-[2.8rem] p-8 md:p-10">
                                    <div className="mb-10 text-center relative">
                                        <div className="inline-block bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100">
                                            Best Value Guaranteed
                                        </div>
                                        <div className="flex flex-col items-center justify-center gap-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Starting from</span>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-black text-emerald-600">{priceCurrency}</span>
                                                <span className="text-7xl font-black text-slate-900 tracking-tighter">
                                                    {priceAmount > 0 ? priceAmount.toLocaleString() : 'Price on Request'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {priceAmount > 0 && (
                                        <div className="space-y-4 mb-10">
                                            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">Adults</span>
                                                <div className="flex items-center gap-4 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                                                    <button onClick={() => setMemberCount(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"><Minus size={14} /></button>
                                                    <span className="w-4 text-center font-black text-slate-900">{memberCount.adults}</span>
                                                    <button onClick={() => setMemberCount(prev => ({ ...prev, adults: prev.adults + 1 }))} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"><Plus size={14} /></button>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">Children</span>
                                                <div className="flex items-center gap-4 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                                                    <button onClick={() => setMemberCount(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"><Minus size={14} /></button>
                                                    <span className="w-4 text-center font-black text-slate-900">{memberCount.children}</span>
                                                    <button onClick={() => setMemberCount(prev => ({ ...prev, children: prev.adults + 1 }))} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"><Plus size={14} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <button onClick={() => setIsModalOpen(true)} className="group relative w-full h-16 bg-emerald-600 text-white rounded-[1.5rem] overflow-hidden shadow-xl shadow-emerald-200 hover:shadow-2xl hover:scale-[1.02] transition-all">
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <span className="relative font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3">
                                                Book This Package <ArrowRight size={20} />
                                            </span>
                                        </button>
                                        <a href={`https://wa.me/+94716885880?text=${encodeURIComponent(`Hi, I'm interested in booking "${tour.title}".`)}`} target="_blank" className="w-full h-16 bg-white text-slate-900 font-black uppercase tracking-widest text-xs rounded-[1.5rem] border border-slate-200 flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-sm">
                                            <MessageCircle size={20} className="text-emerald-500" /> WhatsApp Inquiry
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Features */}
                            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900">100% Secure Tour</span>
                                        <span className="text-[10px] items-center gap-1 font-black text-slate-400 uppercase tracking-widest">Insurance Included</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Users size={24} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900">Private Professional Guide</span>
                                        <span className="text-[10px] items-center gap-1 font-black text-slate-400 uppercase tracking-widest">Multi-lingual support</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <TourBookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tourTitle={tour.title}
                tourId={tour.id || tour._id}
                duration={typeof tour.duration === 'object' ? `${tour.duration.days}D / ${tour.duration.nights}N` : tour.duration}
                price={priceAmount}
                currency={priceCurrency}
            />
        </main>
    )
}
