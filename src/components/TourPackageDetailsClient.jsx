'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    Check, MessageCircle, MapPin, Clock, Calendar, ArrowLeft, Plus, Minus,
    ShieldCheck, User, Users, Hotel, CheckCircle, XCircle, AlertCircle, Info, Construction,
    Ship, Heart, Utensils, Camera, Home, Leaf, Coffee, Waves, Sun, Bike, Shield, Mountain, Landmark, Map as MapIcon, Navigation,
    Ban, TriangleAlert, X, Activity
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

    // Dynamic price calculation
    const totalPrice = (priceAmount * memberCount.adults) + (priceAmount * 0.5 * memberCount.children);

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
        <main className="min-h-screen bg-[#F8F9FA] pb-20 text-slate-900 font-sans">
            {/* Navigation Bar */}
            <div className="fixed top-0 left-0 w-full z-50 bg-black border-b-[6px] border-[#FACC15]">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/tour-packages" className="flex items-center gap-2 text-white hover:text-[#FACC15] transition-all font-black uppercase tracking-tighter text-sm group">
                        <ArrowLeft size={16} />
                        BACK TO TOURS
                    </Link>
                    <div className="hidden lg:flex items-center gap-8">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-[#FACC15] uppercase tracking-widest">Selected Package</span>
                            <span className="text-sm font-black text-white truncate max-w-[250px] uppercase tracking-tighter">{tour.title}</span>
                        </div>
                        <div className="h-8 w-px bg-[#FACC15]/20" />
                        <button onClick={() => setIsModalOpen(true)} className="px-8 py-3 bg-[#FACC15] text-black font-black uppercase tracking-widest hover:bg-white transition-all text-xs border-l-[6px] border-black">
                            BOOK NOW
                        </button>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="lg:hidden px-6 py-2 bg-[#FACC15] text-black font-black uppercase tracking-widest text-xs border-l-[6px] border-black">
                        BOOK
                    </button>
                </div>
            </div>

            {/* Immersive Hero Section */}
            <div className="relative h-[75vh] w-full overflow-hidden pt-20 bg-slate-900 border-b-[16px] border-black">
                <div className="absolute inset-0">
                    <Image
                        src={tour.heroImage || tour.image || tour.images?.[0] || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc63?q=80&w=1240&auto=format&fit=crop'}
                        alt={tour.title}
                        fill
                        className="object-cover transition-opacity duration-700"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>
 
                <div className="absolute inset-0 flex flex-col justify-end p-6 pb-20 md:p-12 lg:p-24">
                    <div className="max-w-7xl mx-auto w-full">
                        <div className="flex flex-wrap gap-2 mb-6">
                            <div className="inline-block bg-[#FACC15] text-black px-4 py-1 text-[10px] font-black uppercase tracking-widest mb-4 border-4 border-black">
                                {tour.type || 'Verified Premium'}
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tight max-w-5xl uppercase">
                            {tour.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-3 text-white font-black uppercase tracking-widest text-xs bg-black self-start p-6 border-[8px] border-[#FACC15]">
                                    <MapPin size={16} className="text-[#FACC15]" />
                                    <span>{Array.isArray(tour.destinations) ? tour.destinations.join(' / ') : 'Island Wide Tour'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column (8/12) */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Quick Stats bar */}
                        <div className="grid grid-cols-2 md:grid-cols-4 bg-black p-0 border-[10px] border-black">
                            {[
                                { icon: Users, label: 'Group', val: 'Private Only' },
                                { icon: Navigation, label: 'Transit', val: 'Luxury AC' },
                                { icon: Hotel, label: 'Hotels', val: '3-5 Star' },
                                { icon: ShieldCheck, label: 'Status', val: 'Verified', color: 'text-black' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-6 border-r-[6px] border-black flex flex-col items-center text-center gap-2 last:border-r-0">
                                    <stat.icon size={20} className={stat.color || 'text-black'} />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                                    <span className="text-sm font-black text-black uppercase">{stat.val}</span>
                                </div>
                            ))}
                        </div>

                        {/* Overview Section */}
                        <section className="bg-white border-[10px] border-black p-8 md:p-12 rounded-none">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-2 h-8 bg-[#FACC15] border border-black"></div>
                                <h2 className="text-3xl font-black text-black uppercase tracking-tighter">
                                    Package Overview
                                </h2>
                            </div>
                            <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-lg mb-10 font-bold">
                                {tour.description}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t-[10px] border-black">
                                {tour.highlights?.map((h, i) => (
                                    <div key={i} className="flex items-center gap-4 p-5 bg-white border-r-[6px] border-b-[6px] border-black last:border-b-0 md:even:border-r-0">
                                        <Check size={18} className="text-black shrink-0" strokeWidth={4} />
                                        <span className="font-black text-black text-sm uppercase tracking-tight">{h}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Visual Route Section */}
                        <section className="bg-white border-[10px] border-black p-8 md:p-12 rounded-none">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-2 h-8 bg-black"></div>
                                <h2 className="text-3xl font-black text-black uppercase tracking-tighter">
                                    Journey Visualization
                                </h2>
                            </div>
                            <div className="w-full h-[450px] bg-slate-100 border-[6px] border-black relative overflow-hidden mb-6">
                                {pickup ? (
                                    <TripMap
                                        pickup={pickup}
                                        dropoff={dropoff}
                                        waypoints={waypoints}
                                        onRouteCalculated={(data) => console.log('Route stats:', data)}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-slate-50">
                                        <MapIcon className="text-slate-300" size={48} />
                                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Satellite Data Syncing...</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 bg-black text-[#FACC15] font-black uppercase tracking-widest text-[10px] inline-block border-4 border-black">
                                <Activity size={16} className="animate-pulse inline mr-2" />
                                Interactive GPS Route Enabled • Accurate Point-to-Point Distances
                            </div>
                        </section>

                        {/* Itinerary Section */}
                        {tour.itinerary && tour.itinerary.length > 0 && (
                            <section className="bg-white border-[10px] border-black p-8 md:p-12 rounded-none">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-2 h-8 bg-[#FACC15] border-4 border-black"></div>
                                    <h2 className="text-3xl font-black text-black uppercase tracking-tighter">
                                        Day-by-Day Experience
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    {tour.itinerary.map((item, idx) => {
                                        const isExpanded = collapsedDay !== item.day;
                                        return (
                                            <div key={item.day || idx} className="border-[6px] border-black rounded-none overflow-hidden mb-4">
                                                <button
                                                    onClick={() => setCollapsedDay(collapsedDay === item.day ? null : item.day)}
                                                    className={`w-full flex items-center gap-6 py-6 px-4 transition-colors text-left ${isExpanded ? 'bg-[#FACC15]' : 'bg-white'}`}
                                                >
                                                    <div className={`w-12 h-12 shrink-0 flex flex-col items-center justify-center font-black transition-colors border-4 border-black ${isExpanded ? 'bg-black text-[#FACC15]' : 'bg-[#FACC15] text-black'}`}>
                                                        <span className="text-[8px] uppercase">DAY</span>
                                                        <span className="text-xl -mt-1">{item.day}</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-black tracking-tight text-black uppercase">
                                                            {item.title}
                                                        </h3>
                                                        {item.location && <span className="text-[10px] font-black uppercase tracking-widest block mt-1 text-black/60">{item.location}</span>}
                                                    </div>
                                                    <div className="text-black">
                                                        {isExpanded ? <Minus size={20} strokeWidth={6} /> : <Plus size={20} strokeWidth={6} />}
                                                    </div>
                                                </button>
                                                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[1000px] opacity-100 border-t-[6px] border-black' : 'max-h-0 opacity-0'}`}>
                                                    <div className="p-8 bg-white">
                                                        <p className="text-slate-800 leading-relaxed text-base font-black mb-6 uppercase">
                                                            {item.description || item.desc}
                                                        </p>
                                                        {item.activities && item.activities.length > 0 && (
                                                            <div className="flex flex-wrap gap-2">
                                                                {item.activities.map((act, i) => (
                                                                    <span key={i} className="px-3 py-1 bg-black text-[#FACC15] text-[10px] font-black uppercase tracking-widest border-2 border-black">{act}</span>
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
                            <section className="bg-white border-[10px] border-black p-8 md:p-12 rounded-none text-black">
                                <div className="flex items-center gap-4 mb-12">
                                    <div className="w-4 h-8 bg-black"></div>
                                    <h2 className="text-3xl font-black text-black uppercase tracking-tighter">
                                        Your Experience
                                    </h2>
                                </div>
                                <div className="space-y-0 relative ml-2">
                                    <div className="absolute left-1 top-0 bottom-0 w-2 bg-black opacity-20" />
                                    {tour.experience.map((exp, idx) => (
                                        <div key={idx} className="relative pl-12 pb-12 last:pb-0">
                                            <div className="absolute left-0 top-1.5 w-6 h-6 bg-black border-4 border-white" />
                                            <div className="flex flex-col gap-2">
                                                <h4 className="text-xl font-black text-black uppercase tracking-tighter italic">{exp.heading}</h4>
                                                <p className="text-slate-800 font-black text-base leading-relaxed max-w-2xl uppercase tracking-tight">{exp.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Inclusions & Exclusions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-[10px] border-black rounded-none overflow-hidden">
                            <section className="bg-white p-10 border-b-[10px] md:border-b-0 border-black">
                                <h3 className="text-2xl font-black text-black mb-8 uppercase tracking-tighter flex items-center gap-3">
                                    <CheckCircle size={24} className="text-[#FACC15] bg-black border-2 border-black" />
                                    INCLUSIONS
                                </h3>
                                <ul className="space-y-4">
                                    {validInclusions.length > 0 ? validInclusions.map((item, i) => (
                                        <li key={i} className="flex gap-3 text-black items-start group">
                                            <div className="shrink-0 mt-1 w-2 h-2 bg-black rounded-none" />
                                            <span className="text-sm font-black uppercase tracking-tight">{item}</span>
                                        </li>
                                    )) : (
                                        <li className="text-slate-400 text-xs text-black/40">No inclusions specified</li>
                                    )}
                                </ul>
                            </section>
                            <section className="bg-white p-10 md:border-l-[10px] border-black">
                                <h3 className="text-2xl font-black text-black mb-8 uppercase tracking-tighter flex items-center gap-3">
                                    <XCircle size={24} className="text-white bg-red-600 border-2 border-black" />
                                    EXCLUSIONS
                                </h3>
                                <ul className="space-y-4">
                                    {validExclusions.length > 0 ? validExclusions.map((item, i) => (
                                        <li key={i} className="flex gap-3 text-slate-500 items-start group">
                                            <div className="shrink-0 mt-1 w-2 h-2 bg-slate-300 rounded-none border border-black" />
                                            <span className="text-sm font-black uppercase tracking-tight line-through opacity-70">{item}</span>
                                        </li>
                                    )) : (
                                        <li className="text-slate-400 text-xs text-black/40">No exclusions specified</li>
                                    )}
                                </ul>
                            </section>
                        </div>
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="lg:col-span-4 mt-[-100px] lg:mt-0">
                        <div className="sticky top-32 space-y-8">
                            <div className="bg-white p-8 border-[10px] border-black rounded-none">
                                <div className="mb-8 text-center bg-black py-8 px-2 border-b-[12px] border-[#FACC15]">
                                    <span className="text-[10px] font-black text-[#FACC15] uppercase tracking-widest block mb-1">Exclusive Web Rate</span>
                                    <div className="flex items-center justify-center gap-1 text-white">
                                        <span className="text-xl font-black">{priceCurrency}</span>
                                        <span className="text-7xl font-black tracking-tighter leading-none">
                                            {totalPrice > 0 ? totalPrice.toLocaleString() : 'Price on Request'}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-black text-[#FACC15] uppercase tracking-widest mt-2 block italic">All-Inclusive Price</span>
                                </div>

                                {priceAmount > 0 && (
                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center justify-between border-4 border-black p-2 bg-slate-50">
                                            <span className="text-[10px] font-black uppercase tracking-widest px-4">Adults</span>
                                            <div className="flex items-center bg-black p-1 border-2 border-black">
                                                <button onClick={() => setMemberCount(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))} className="w-8 h-8 flex items-center justify-center text-white hover:text-[#FACC15] transition-all"><Minus size={14} /></button>
                                                <span className="w-8 text-center font-black text-white">{memberCount.adults}</span>
                                                <button onClick={() => setMemberCount(prev => ({ ...prev, adults: prev.adults + 1 }))} className="w-8 h-8 flex items-center justify-center text-white hover:text-[#FACC15] transition-all"><Plus size={14} /></button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between border-4 border-black p-2 bg-slate-50">
                                            <span className="text-[10px] font-black uppercase tracking-widest px-4">Children</span>
                                            <div className="flex items-center bg-black p-1 border-2 border-black">
                                                <button onClick={() => setMemberCount(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))} className="w-8 h-8 flex items-center justify-center text-white hover:text-[#FACC15] transition-all"><Minus size={14} /></button>
                                                <span className="w-8 text-center font-black text-white">{memberCount.children}</span>
                                                <button onClick={() => setMemberCount(prev => ({ ...prev, children: prev.children + 1 }))} className="w-8 h-8 flex items-center justify-center text-white hover:text-[#FACC15] transition-all"><Plus size={14} /></button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <button onClick={() => setIsModalOpen(true)} className="w-full h-16 bg-[#FACC15] text-black font-black uppercase tracking-[0.2em] text-sm hover:bg-black hover:text-[#FACC15] transition-all border-[6px] border-black">
                                        INSTANT BOOKING
                                    </button>
                                    <a href={`https://wa.me/+94716885880?text=${encodeURIComponent(`Hi, I'm interested in booking "${tour.title}".`)}`} target="_blank" className="w-full h-16 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] border-[6px] border-black flex items-center justify-center gap-3 transition-all hover:bg-slate-50">
                                        <MessageCircle size={20} /> WHATSAPP INQUIRY
                                    </a>
                                </div>
                            </div>

                            {/* Trust Features */}
                            <div className="bg-white p-8 border-[10px] border-black rounded-none flex flex-col gap-6">
                                <div className="flex items-center gap-4 border-b-[6px] border-black pb-4">
                                    <div className="w-12 h-12 bg-black flex items-center justify-center text-[#FACC15] border-4 border-black">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-black uppercase">100% Secure Tour</span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Insurance Included</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-black flex items-center justify-center text-[#FACC15] border-4 border-black">
                                        <Users size={24} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-black uppercase">Private Transit</span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Multi-lingual support</span>
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
                price={totalPrice}
                currency={priceCurrency}
            />
        </main>
    )
}
