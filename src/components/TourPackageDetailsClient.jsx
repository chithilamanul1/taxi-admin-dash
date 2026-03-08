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

    return (
        <main className="min-h-screen bg-white pb-20 text-emerald-900">
            {/* Navigation Bar */}
            <div className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/tour-packages" className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors font-black uppercase tracking-widest text-xs">
                        <ArrowLeft size={18} /> Back to Packages
                    </Link>
                    <div className="hidden md:flex items-center gap-6">
                        <span className="text-[10px] font-black text-slate-600 font-bold uppercase tracking-widest">You are viewing</span>
                        <span className="text-sm font-black text-emerald-900 truncate max-w-[200px]">{tour.title}</span>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all">
                        Book Now
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative h-[70vh] w-full overflow-hidden pt-20">
                <Image
                    src={tour.image || tour.heroImage || tour.images?.[0]}
                    alt={tour.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-6 pb-20 md:p-12 md:pb-24 lg:p-20 lg:pb-32">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-wrap gap-3 mb-6">
                            <span className="px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                {tour.type || 'Premium Tour'}
                            </span>
                            <span className="px-4 py-1.5 bg-white/90 backdrop-blur text-emerald-900 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-2 border border-slate-100">
                                <Clock size={14} className="text-emerald-500" /> {typeof tour.duration === 'object' ? `${tour.duration.days}D / ${tour.duration.nights}N` : tour.duration}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-emerald-900 mb-6 leading-[1.1] max-w-5xl tracking-tighter drop-shadow-sm">
                            {tour.title}
                        </h1>
                        <div className="flex items-center gap-3 text-slate-700 font-black uppercase tracking-widest text-xs">
                            <MapPin size={18} className="text-emerald-500" />
                            <span>{Array.isArray(tour.destinations) ? tour.destinations.join(' • ') : 'Exploring Sri Lanka'}</span>
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
                                <Users size={24} className="text-emerald-500" />
                                <span className="text-[10px] font-black text-slate-600 font-bold uppercase tracking-widest">Group Size</span>
                                <span className="text-sm font-black text-emerald-900">Private Tour</span>
                            </div>
                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center gap-2">
                                <Navigation size={24} className="text-emerald-500" />
                                <span className="text-[10px] font-black text-slate-600 font-bold uppercase tracking-widest">Transport</span>
                                <span className="text-sm font-black text-emerald-900">Private AC Car</span>
                            </div>
                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center gap-2">
                                <Hotel size={24} className="text-emerald-500" />
                                <span className="text-[10px] font-black text-slate-600 font-bold uppercase tracking-widest">Stay</span>
                                <span className="text-sm font-black text-emerald-900">Quality Hotels</span>
                            </div>
                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center gap-2">
                                <ShieldCheck size={24} className="text-emerald-500" />
                                <span className="text-[10px] font-black text-slate-600 font-bold uppercase tracking-widest">Secure</span>
                                <span className="text-sm font-black text-emerald-900">Pay on Arrival</span>
                            </div>
                        </div>

                        {/* Overview */}
                        <section className="bg-white rounded-[3rem] p-10 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100">
                            <h2 className="text-3xl font-black text-emerald-900 mb-8 tracking-tight flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                    <Info className="text-emerald-500" size={24} />
                                </div>
                                Tour Overview
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-lg mb-10">
                                {tour.description}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {tour.highlights?.map((h, i) => (
                                    <div key={i} className="flex items-center gap-4 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 group hover:border-emerald-200 transition-colors">
                                        <div className="w-8 h-8 shrink-0 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-emerald-500 transition-colors">
                                            <Check size={16} className="text-emerald-500 group-hover:text-white" />
                                        </div>
                                        <span className="font-bold text-slate-700 text-sm leading-snug">{h}</span>
                                    </div>
                                ))}
                            </div>
                        </section>



                        {/* Itinerary */}
                        {tour.itinerary && tour.itinerary.length > 0 && (
                            <div className="mt-12 bg-white rounded-lg p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100">
                                <h2 className="text-2xl font-bold text-[#4B5E73] mb-8 border-b border-slate-200 pb-4">
                                    Itinerary
                                </h2>
                                <div className="space-y-0">
                                    {tour.itinerary.map((item, idx) => {
                                        const isExpanded = collapsedDay !== item.day;
                                        return (
                                            <div key={item.day || idx} className="group border-b border-[#FACC15]">
                                                <button
                                                    onClick={() => setCollapsedDay(collapsedDay === item.day ? null : item.day)}
                                                    className="w-full flex items-center justify-between py-5 transition-colors hover:bg-slate-50/50"
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className="bg-[#FACC15] text-slate-900 font-semibold px-4 py-1.5 text-sm whitespace-nowrap min-w-[80px] text-center shadow-sm">
                                                            Day {item.day}
                                                        </div>
                                                        <h3 className="text-sm font-bold text-[#4B5E73] text-left">
                                                            {item.title}
                                                        </h3>
                                                    </div>
                                                    <div className={`transition-transform duration-300 mr-2 ${isExpanded ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`}>
                                                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                </button>
                                                <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 overflow-hidden'}`}>
                                                    <div className="overflow-hidden">
                                                        <div className="p-6 bg-slate-50 mt-2 mb-4 text-sm text-slate-600 leading-relaxed max-w-3xl whitespace-pre-line border-l-2 border-[#FACC15]">
                                                            {item.description || item.desc}
                                                            {item.activities && item.activities.length > 0 && (
                                                                <div className="mt-4 flex flex-wrap gap-2">
                                                                    {item.activities.map((act, i) => (
                                                                        <span key={i} className="px-3 py-1 bg-white rounded text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200">{act}</span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Experience Timeline (for Day Trips / Single Day focus) */}
                        {tour.experience && tour.experience.length > 0 && (
                            <section className="bg-white rounded-[3rem] p-10 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100">
                                <h2 className="text-3xl font-black text-emerald-900 mb-12 tracking-tight flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                        <Navigation className="text-emerald-500" size={24} />
                                    </div>
                                    The Experience
                                </h2>
                                <div className="space-y-0 ml-4 border-l-2 border-dashed border-slate-200">
                                    {tour.experience.map((item, idx) => (
                                        <div key={idx} className="relative pb-12 pl-12 last:pb-0">
                                            {/* Dot */}
                                            <div className="absolute left-0 top-0 -translate-x-1/2 w-8 h-8 rounded-full bg-emerald-900 border-4 border-white shadow-lg flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                            </div>
                                            {/* Content */}
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-black text-emerald-900 uppercase tracking-tight">{item.heading}</h3>
                                                <p className="text-slate-600 font-bold leading-relaxed">{item.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Inclusions & Exclusions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <section className="bg-white rounded-[2rem] p-10 shadow-2xl shadow-slate-200/50 border-2 border-slate-100">
                                <h3 className="text-2xl font-black text-emerald-900 mb-8 uppercase tracking-tighter flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                                        <CheckCircle size={24} className="text-white" />
                                    </div>
                                    What's Included
                                </h3>
                                <ul className="grid grid-cols-1 gap-4">
                                    {tour.inclusions?.map((item, i) => (
                                        <li key={i} className="flex gap-4 text-slate-800 items-start group">
                                            <div className="shrink-0 mt-0.5 w-6 h-6 bg-slate-900 rounded flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
                                                <Check size={14} className="text-white" strokeWidth={3} />
                                            </div>
                                            <span className="text-base font-black leading-tight tracking-tight uppercase italic">{item}</span>
                                        </li>
                                    ))}
                                    {(!tour.inclusions || tour.inclusions.length === 0) && <li className="text-slate-400 text-xs italic">No inclusions specified</li>}
                                </ul>
                            </section>
                            <section className="bg-white rounded-[2rem] p-10 shadow-2xl shadow-slate-200/50 border-2 border-slate-100">
                                <h3 className="text-2xl font-black text-emerald-900 mb-8 uppercase tracking-tighter flex items-center gap-4">
                                    <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
                                        <XCircle size={24} className="text-white" />
                                    </div>
                                    Not Included
                                </h3>
                                <ul className="grid grid-cols-1 gap-4">
                                    {tour.exclusions?.map((item, i) => (
                                        <li key={i} className="flex gap-4 text-slate-800 items-start group">
                                            <div className="shrink-0 mt-0.5 w-6 h-6 bg-[#FACC15] rounded flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
                                                <X size={14} className="text-white" strokeWidth={3} />
                                            </div>
                                            <span className="text-base font-black leading-tight tracking-tight uppercase italic">{item}</span>
                                        </li>
                                    ))}
                                    {(!tour.exclusions || tour.exclusions.length === 0) && <li className="text-slate-400 text-xs italic">No exclusions specified</li>}
                                </ul>
                            </section>
                        </div>

                        {/* Suitability & Rules */}
                        {(tour.notSuitableFor?.length > 0 || tour.notAllowed?.length > 0) && (
                            <div className="space-y-12">
                                {tour.notSuitableFor?.length > 0 && (
                                    <section className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-slate-200/50 border border-slate-100">
                                        <h3 className="text-2xl font-black text-emerald-900 mb-10 uppercase tracking-tighter flex items-center gap-4">
                                            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shadow-sm">
                                                <Ban size={24} />
                                            </div>
                                            Not Suitable For - [ People With ]
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
                                            {tour.notSuitableFor.map((item, i) => (
                                                <div key={i} className="flex items-center gap-4 group">
                                                    <div className="shrink-0 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 transition-colors group-hover:bg-rose-50 group-hover:border-rose-200">
                                                        <Ban size={16} className="text-slate-400 group-hover:text-rose-500" />
                                                    </div>
                                                    <span className="text-base font-black text-slate-700 uppercase italic tracking-tight">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                                {tour.notAllowed?.length > 0 && (
                                    <section className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-slate-200/50 border border-slate-100">
                                        <h3 className="text-2xl font-black text-emerald-900 mb-10 uppercase tracking-tighter flex items-center gap-4">
                                            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shadow-sm">
                                                <TriangleAlert size={24} />
                                            </div>
                                            Not Allowed
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
                                            {tour.notAllowed.map((item, i) => (
                                                <div key={i} className="flex items-center gap-4 group">
                                                    <div className="shrink-0 w-8 h-8 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-200 transition-colors group-hover:bg-amber-50 group-hover:border-amber-200">
                                                        <TriangleAlert size={16} className="text-slate-400 group-hover:text-amber-500" />
                                                    </div>
                                                    <span className="text-base font-black text-slate-700 uppercase italic tracking-tight">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>
                        )}


                    </div>

                    {/* Right Column (4/12) - Sidebar */}
                    <div className="lg:col-span-4 space-y-10">
                        {/* Booking Widget */}
                        <div className="sticky top-28 space-y-10">
                            <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl -mr-24 -mt-24"></div>

                                <div className="mb-10 text-center">
                                    <span className="text-[10px] font-black text-slate-600 font-bold uppercase tracking-widest block mb-1">Unbeatable Value</span>
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="text-xl font-black text-emerald-500 uppercase">{priceCurrency}</span>
                                        <span className="text-6xl font-black text-emerald-900 tracking-tighter">{priceAmount?.toLocaleString()}</span>
                                    </div>
                                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">per person</span>
                                </div>

                                <div className="space-y-6 mb-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Adults</label>
                                        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <button onClick={() => setMemberCount(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 hover:border-emerald-400 rounded-xl transition-all shadow-sm"><Minus size={20} className="text-slate-400" /></button>
                                            <span className="text-2xl font-black text-emerald-900">{memberCount.adults}</span>
                                            <button onClick={() => setMemberCount(prev => ({ ...prev, adults: prev.adults + 1 }))} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 hover:border-emerald-400 rounded-xl transition-all shadow-sm"><Plus size={20} className="text-slate-400" /></button>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Children</label>
                                        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <button onClick={() => setMemberCount(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 hover:border-emerald-400 rounded-xl transition-all shadow-sm"><Minus size={20} className="text-slate-400" /></button>
                                            <span className="text-2xl font-black text-emerald-900">{memberCount.children}</span>
                                            <button onClick={() => setMemberCount(prev => ({ ...prev, children: prev.children + 1 }))} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 hover:border-emerald-400 rounded-xl transition-all shadow-sm"><Plus size={20} className="text-slate-400" /></button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <button onClick={() => setIsModalOpen(true)} className="w-full py-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[1.5rem] font-black text-xl shadow-xl shadow-emerald-200 transition-all hover:scale-[1.02] flex items-center justify-center gap-3">
                                        <Calendar size={24} /> Instant Booking
                                    </button>
                                    <a href={`https://wa.me/+94716885880?text=${encodeURIComponent(`Hi, I'm interested in booking "${tour.title}".`)}`} target="_blank" className="w-full py-6 bg-[#25D366] hover:bg-[#1fae54] text-white rounded-[1.5rem] font-black text-xl shadow-xl shadow-emerald-100 transition-all hover:scale-[1.02] flex items-center justify-center gap-3">
                                        <MessageCircle size={24} /> WhatsApp Us
                                    </a>
                                </div>

                                <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-center gap-6">
                                    <div className="flex flex-col items-center gap-1">
                                        <ShieldCheck size={20} className="text-emerald-500" />
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest text-center leading-tight">Secure Payments</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <Users size={20} className="text-emerald-500" />
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest text-center leading-tight">Private Transfers</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <Shield size={20} className="text-indigo-500" />
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest text-center leading-tight">Full Insurance</span>
                                    </div>
                                </div>
                            </div>

                            {/* Trip Planner Meta Callout */}
                            <div className="bg-emerald-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
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
