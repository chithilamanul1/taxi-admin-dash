'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    Check, MessageCircle, MapPin, Clock, Calendar, ArrowLeft, Plus, Minus,
    ShieldCheck, User, CheckCircle, XCircle, AlertCircle, Info, Construction,
    Ship, Heart, Utensils, Camera, Home, Leaf, Coffee, Waves, Sun, Bike, Shield, Mountain, Landmark
} from 'lucide-react'
import TourBookingModal from './TourBookingModal'

export default function TourPackageDetailsClient({ tour }) {
    const [activeDay, setActiveDay] = useState(1)
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
            Elephant: <AlertCircle size={18} />, // No Elephant in basic lucide
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
        <main className="min-h-screen bg-white dark:bg-slate-950 pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-6 pb-24 md:p-12 md:pb-28 lg:p-20 lg:pb-32">
                    <div className="max-w-7xl mx-auto">
                        <Link href="/tour-packages" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors font-medium">
                            <ArrowLeft size={20} /> Back to Packages
                        </Link>
                        <div className="flex flex-wrap gap-4 mb-4">
                            <span className="px-3 py-1 bg-[#00A99D] text-white text-xs font-bold uppercase tracking-wider rounded-full">
                                {tour.type || 'Tour Package'}
                            </span>
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-2">
                                <Clock size={14} /> {typeof tour.duration === 'object' ? `${tour.duration.days}D / ${tour.duration.nights}N` : tour.duration}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-4 leading-tight max-w-4xl tracking-tight">
                            {tour.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-white/90 font-medium">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                                <span className="text-3xl font-black text-[#00A99D]">{priceCurrency} {priceAmount?.toLocaleString()}</span>
                                <span className="text-xs uppercase tracking-widest opacity-70">/ {tour.priceType || 'Person'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column (8/12) */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* About/Overview */}
                        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-slate-100 dark:border-slate-800">
                            <h2 className="text-3xl font-black text-[#006064] mb-6 tracking-tight">About this Tour</h2>
                            <div className="prose prose-slate max-w-none text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-8">
                                {tour.description}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                {tour.highlights?.map((h, i) => (
                                    <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <div className="mt-1 bg-[#00A99D]/10 p-1.5 rounded-lg">
                                            <CheckCircle size={18} className="text-[#00A99D]" />
                                        </div>
                                        <span className="font-bold text-slate-700 dark:text-slate-200 text-sm leading-snug">{h}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Itinerary */}
                        {tour.itinerary && (
                            <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-slate-100 dark:border-slate-800">
                                <h2 className="text-3xl font-black text-[#006064] mb-10 tracking-tight flex items-center gap-4">
                                    <Calendar className="text-[#00A99D]" size={36} /> Itinerary
                                </h2>
                                <div className="space-y-6">
                                    {tour.itinerary.map((item) => (
                                        <div key={item.day} className="group">
                                            <button
                                                onClick={() => setActiveDay(activeDay === item.day ? null : item.day)}
                                                className={`w-full flex items-center gap-6 p-6 rounded-3xl border transition-all duration-300 text-left ${activeDay === item.day ? 'bg-[#006064] border-[#006064] shadow-xl shadow-cyan-900/20' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-[#00A99D]'}`}
                                            >
                                                <div className={`w-14 h-14 shrink-0 rounded-2xl flex flex-col items-center justify-center font-black transition-colors ${activeDay === item.day ? 'bg-white text-[#006064]' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                                                    <span className="text-[10px] uppercase tracking-tighter">Day</span>
                                                    <span className="text-2xl -mt-1">{item.day}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className={`text-xl font-bold tracking-tight ${activeDay === item.day ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
                                                        {item.title}
                                                    </h3>
                                                </div>
                                                <div className={`transition-transform duration-300 ${activeDay === item.day ? 'rotate-180 text-white' : 'text-slate-400'}`}>
                                                    {activeDay === item.day ? <Minus size={24} /> : <Plus size={24} />}
                                                </div>
                                            </button>
                                            <div className={`grid transition-all duration-500 ease-in-out ${activeDay === item.day ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 overflow-hidden'}`}>
                                                <div className="overflow-hidden">
                                                    <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg whitespace-pre-line">
                                                            {item.description || item.desc}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Inclusions & Exclusions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800">
                                <h3 className="text-xl font-black text-[#006064] mb-6 uppercase tracking-widest flex items-center gap-2">
                                    <CheckCircle size={20} className="text-[#00A99D]" /> Include
                                </h3>
                                <ul className="space-y-4">
                                    {tour.includes?.map((item, i) => (
                                        <li key={i} className="flex gap-3 text-slate-600 dark:text-slate-400">
                                            <div className="shrink-0 mt-1"><Check size={16} className="text-[#00A99D]" /></div>
                                            <span className="text-sm font-bold">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                            <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800">
                                <h3 className="text-xl font-black text-rose-800 mb-6 uppercase tracking-widest flex items-center gap-2">
                                    <XCircle size={20} className="text-rose-600" /> Exclude
                                </h3>
                                <ul className="space-y-4">
                                    {tour.excludes?.map((item, i) => (
                                        <li key={i} className="flex gap-3 text-slate-600 dark:text-slate-400">
                                            <div className="shrink-0 mt-1"><Plus size={16} className="text-rose-500 rotate-45" /></div>
                                            <span className="text-sm font-bold">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>

                        {/* Safety & Restrictions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {tour.notSuitable && (
                                <section className="bg-amber-50 dark:bg-amber-900/10 rounded-[2.5rem] p-8 border border-amber-100 dark:border-amber-900/30">
                                    <h3 className="text-lg font-black text-amber-900 dark:text-amber-200 mb-4 uppercase tracking-wider flex items-center gap-2">
                                        <AlertCircle size={20} /> Not Suitable For
                                    </h3>
                                    <ul className="space-y-2">
                                        {tour.notSuitable.map((item, i) => (
                                            <li key={i} className="text-sm font-bold text-amber-800 dark:text-amber-300 flex gap-2">
                                                <span>•</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                            {tour.notAllowed && (
                                <section className="bg-rose-50 dark:bg-rose-900/10 rounded-[2.5rem] p-8 border border-rose-100 dark:border-rose-900/30">
                                    <h3 className="text-lg font-black text-rose-900 dark:text-rose-200 mb-4 uppercase tracking-wider flex items-center gap-2">
                                        <XCircle size={20} /> Not Allowed
                                    </h3>
                                    <ul className="space-y-2">
                                        {tour.notAllowed.map((item, i) => (
                                            <li key={i} className="text-sm font-bold text-rose-800 dark:text-rose-300 flex gap-2">
                                                <span>•</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                        </div>
                    </div>

                    {/* Right Column (4/12) - Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Booking Widget */}
                        <div className="sticky top-32 space-y-8">
                            <div className="bg-[#006064] rounded-[2.5rem] p-8 shadow-2xl text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24"></div>
                                <h3 className="text-2xl font-black mb-2 relative z-10 tracking-tight">Reserve Your Spot</h3>
                                <p className="text-cyan-100 text-sm mb-8 relative z-10 font-medium">Pay nothing today. Flexible cancellation.</p>

                                <div className="space-y-6 relative z-10 mb-8">
                                    <div className="flex items-center justify-between bg-white/10 p-4 rounded-2xl border border-white/10">
                                        <span className="font-bold">Adults</span>
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => setMemberCount(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))} className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-xl transition-colors"><Minus size={18} /></button>
                                            <span className="text-xl font-black w-4 text-center">{memberCount.adults}</span>
                                            <button onClick={() => setMemberCount(prev => ({ ...prev, adults: prev.adults + 1 }))} className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-xl transition-colors"><Plus size={18} /></button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between bg-white/10 p-4 rounded-2xl border border-white/10">
                                        <span className="font-bold">Children</span>
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => setMemberCount(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))} className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-xl transition-colors"><Minus size={18} /></button>
                                            <span className="text-xl font-black w-4 text-center">{memberCount.children}</span>
                                            <button onClick={() => setMemberCount(prev => ({ ...prev, children: prev.children + 1 }))} className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-xl transition-colors"><Plus size={18} /></button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    <button onClick={() => setIsModalOpen(true)} className="w-full py-5 bg-[#00A99D] hover:bg-[#008c82] text-white rounded-2xl font-black text-xl shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-3">
                                        <Calendar size={24} /> Book Now
                                    </button>
                                    <a href={`https://wa.me/+94716885880?text=${encodeURIComponent(`Hi, I'm interested in booking "${tour.title}".`)}`} target="_blank" className="w-full py-5 bg-[#25D366] hover:bg-[#1fae54] text-white rounded-2xl font-black text-xl shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-3">
                                        <MessageCircle size={24} /> WhatsApp Inquiry
                                    </a>
                                </div>
                            </div>

                            {/* Experience Timeline */}
                            {tour.experience && (
                                <div className="bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                                    <h3 className="text-xl font-black text-[#006064] dark:text-white mb-8 uppercase tracking-widest">Experience</h3>
                                    <div className="space-y-6">
                                        {tour.experience.map((exp, i) => (
                                            <div key={i} className="flex gap-4 relative">
                                                {i < tour.experience.length - 1 && (
                                                    <div className="absolute left-[17px] top-8 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800"></div>
                                                )}
                                                <div className="w-9 h-9 shrink-0 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center text-[#00A99D] relative z-10 shadow-sm">
                                                    {getIcon(exp.icon)}
                                                </div>
                                                <div className="pb-4">
                                                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">{exp.time}</span>
                                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">{exp.activity}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Trust Badges */}
                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-2xl text-emerald-600 dark:text-emerald-400">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <p className="font-black text-[#006064] dark:text-white text-sm">Secure Booking</p>
                                        <p className="text-xs text-slate-400">Pay on the day of tour</p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-2xl text-emerald-600 dark:text-emerald-400">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <p className="font-black text-[#006064] dark:text-white text-sm">Expert Chauffeur</p>
                                        <p className="text-xs text-slate-400">English speaking professional</p>
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
                tourId={tour.id}
                duration={typeof tour.duration === 'object' ? `${tour.duration.days}D / ${tour.duration.nights}N` : tour.duration}
                price={priceAmount}
                currency={priceCurrency}
            />
        </main>
    )
}
