"use client";

import React, { useState, useEffect } from 'react';
import { Clock, MapPin, CheckCircle, ArrowRight, Star, Filter, Loader2, Car, Ticket, UserCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import Link from 'next/link';



interface Tour {
    _id: string;
    title: string;
    slug: string;
    category: string;
    type?: string;
    duration: { days: number; nights: number };
    description: string;
    shortDescription?: string;
    price: { amount: number; currency: string; type: string };
    images: string[];
    heroImage?: string;
    inclusions?: string[];
    destinations?: string[];
    isFeatured?: boolean;
    isActive?: boolean;
}

export default function ToursPage() {
    const [tours, setTours] = useState<Tour[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, safari, tour-package, day-trip

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const res = await fetch('/api/tours');
                const data = await res.json();
                if (data.success) {
                    setTours(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch tours:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTours();
    }, []);

    const filteredTours = filter === 'all'
        ? tours
        : tours.filter(t => t.type === filter || t.category === filter);

    const categories = [
        { id: 'all', label: 'All Experiences' },
        { id: 'safari', label: 'Safaris' },
        { id: 'tour-package', label: 'Multi-Day Tours' },
        { id: 'day-trip', label: 'Day Trips' }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-800 pt-24 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#006064]">
                        Premium <span className="text-[#00A99D]">Sri Lankan</span> Tours
                    </h1>
                    <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto font-light">
                        Discover the wonder of Asia with our curated selection of high-end,
                        professional chauffeur-driven tour packages and safaris.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter(cat.id)}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${filter === cat.id
                                ? 'bg-[#006064] text-white shadow-lg shadow-cyan-900/20'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 size={40} className="animate-spin text-[#00A99D]" />
                        <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Adventures...</p>
                    </div>
                )}

                {/* Tours Grid */}
                {!isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTours.map((tour) => (
                            <Card key={tour._id} className="group hover:-translate-y-2 transition-transform duration-500 border-none shadow-xl bg-slate-50 overflow-hidden flex flex-col h-full">
                                <div className="h-64 relative overflow-hidden">
                                    <img
                                        src={tour.heroImage || tour.images?.[0] || '/vehicles/placeholder.png'}
                                        alt={tour.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&q=80&w=800";
                                        }}
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-[#00A99D] text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                                            {tour.type === 'safari' ? 'Safari' : tour.type === 'day-trip' ? 'Day Trip' : 'Package'}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 right-4">
                                        <div className="px-4 py-2 bg-white/90 backdrop-blur text-[#006064] text-lg font-bold rounded-xl shadow-xl">
                                            {tour.price.type === 'from' && <span className="text-[10px] uppercase font-bold text-slate-400 block -mb-1">From</span>}
                                            {tour.price.currency} {tour.price.amount?.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <CardHeader className="pb-2 px-8 pt-8">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-2xl text-[#006064] leading-tight line-clamp-2">{tour.title}</CardTitle>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-400 text-xs mt-2 uppercase tracking-widest font-bold">
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} className="text-[#00A99D]" />
                                            {tour.duration?.days} Days {tour.duration?.nights > 0 && `& ${tour.duration.nights} Nights`}
                                        </span>
                                    </div>
                                </CardHeader>

                                <CardContent className="px-8 pb-8 flex-1">
                                    <CardDescription className="line-clamp-3 mb-6 text-slate-500">
                                        {tour.shortDescription || tour.description}
                                    </CardDescription>

                                    <div className="space-y-4">
                                        {tour.inclusions && tour.inclusions.length > 0 && (
                                            <>
                                                <p className="text-xs font-black text-[#006064] uppercase tracking-widest">Highlights</p>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {tour.inclusions.slice(0, 3).map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                                                            <CheckCircle size={14} className="text-[#00A99D]" />
                                                            <span className="truncate">{item}</span>
                                                        </div>
                                                    ))}
                                                    {tour.inclusions.length > 3 && (
                                                        <div className="text-xs text-[#00A99D] font-bold pl-6">
                                                            + {tour.inclusions.length - 3} more
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </CardContent>

                                <CardFooter className="px-8 pb-8 mt-auto">
                                    <Link href={`/tours/${tour.slug}`} className="w-full">
                                        <button className="w-full py-4 bg-[#006064] text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-xl hover:bg-[#004D40] hover:scale-[1.02]">
                                            View Details
                                            <ArrowRight size={18} />
                                        </button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {!isLoading && filteredTours.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-400 text-lg">No tours found in this category.</p>
                        <button onClick={() => setFilter('all')} className="mt-4 text-[#00A99D] font-bold hover:underline">View All Tours</button>
                    </div>
                )}

                {/* CTA Section */}
                <div className="mt-20 p-12 bg-[#006064] text-white rounded-[2.5rem] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                    <div className="absolute top-0 right-0 opacity-10 rotate-12 scale-150 pointer-events-none">
                        <Star size={300} fill="white" />
                    </div>
                    <div className="space-y-2 relative">
                        <h2 className="text-3xl md:text-4xl font-black">Want a Custom Tour?</h2>
                        <p className="font-medium opacity-80 text-cyan-100">Tailor-made itineraries for your unique Sri Lankan adventure.</p>
                    </div>
                    <Link href="/custom-trip">
                        <button className="px-10 py-5 bg-white text-[#006064] font-black rounded-2xl hover:scale-105 transition-all shadow-2xl relative">
                            Talk to an Expert
                        </button>
                    </Link>
                </div>

                {/* Custom Safari Packages Section */}
                <div className="mt-24 space-y-16">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-800">Featured Wildlife Safaris</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">Explore Sri Lanka's breathtaking national parks. Choose from our specialized safari packages designed for the ultimate wildlife experience.</p>
                    </div>

                    {/* Yala National Park */}
                    <div className="rounded-[2.5rem] overflow-hidden shadow-2xl relative bg-white border border-slate-100">
                        <div className="absolute top-0 left-0 w-full h-[340px] z-0">
                            <img src="/yala-new.png" alt="Yala National Park Safari" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-[#006064]/80 to-transparent"></div>
                        </div>
                        <div className="relative z-10 pt-20 px-6 md:px-12 pb-12">
                            <h3 className="text-4xl md:text-5xl font-black text-white drop-shadow-md mb-12">Yala National Park</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Morning Safari */}
                                <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
                                    <div className="inline-block px-3 py-1 bg-[#FFC107]/20 text-[#D4A000] text-sm font-bold rounded-full mb-4">Half Day</div>
                                    <h4 className="text-xl font-black text-[#006064] mb-2">Morning Safari</h4>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-5">
                                        <Clock size={16} />
                                        <span>5:30 AM - 10:00 AM</span>
                                    </div>
                                    <ul className="space-y-3 mb-8 text-sm font-medium text-slate-600">
                                        <li className="flex items-start gap-2"><Car size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> 4x4 Safari Jeep</li>
                                        <li className="flex items-start gap-2"><UserCircle size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> Experienced Driver</li>
                                        <li className="flex items-start gap-2"><Ticket size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> Park Entry Included</li>
                                        <li className="flex items-start gap-2"><MapPin size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> Free Pickup/Drop-off</li>
                                    </ul>
                                    <Link href="/safari">
                                        <button className="w-full py-3.5 bg-[#006064] text-white rounded-2xl font-bold hover:bg-[#004D40] transition-colors">Book Now</button>
                                    </Link>
                                </div>

                                {/* Evening Safari */}
                                <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
                                    <div className="inline-block px-3 py-1 bg-[#FFC107]/20 text-[#D4A000] text-sm font-bold rounded-full mb-4">Half Day</div>
                                    <h4 className="text-xl font-black text-[#006064] mb-2">Evening Safari</h4>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-5">
                                        <Clock size={16} />
                                        <span>2:30 PM - 6:00 PM</span>
                                    </div>
                                    <ul className="space-y-3 mb-8 text-sm font-medium text-slate-600">
                                        <li className="flex items-start gap-2"><Car size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> 4x4 Safari Jeep</li>
                                        <li className="flex items-start gap-2"><UserCircle size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> Experienced Driver</li>
                                        <li className="flex items-start gap-2"><Ticket size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> Park Entry Included</li>
                                        <li className="flex items-start gap-2"><MapPin size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> Free Pickup/Drop-off</li>
                                    </ul>
                                    <Link href="/safari">
                                        <button className="w-full py-3.5 bg-[#006064] text-white rounded-2xl font-bold hover:bg-[#004D40] transition-colors">Book Now</button>
                                    </Link>
                                </div>

                                {/* 3-Hour Quick Safari */}
                                <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
                                    <div className="inline-block px-3 py-1 bg-[#00A99D]/20 text-[#00897B] text-sm font-bold rounded-full mb-4">3 Hours</div>
                                    <h4 className="text-xl font-black text-[#006064] mb-2">Quick Safari</h4>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-5">
                                        <Clock size={16} />
                                        <span>Flexible Timing</span>
                                    </div>
                                    <ul className="space-y-3 mb-8 text-sm font-medium text-slate-600">
                                        <li className="flex items-start gap-2"><Car size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> 4x4 Safari Jeep</li>
                                        <li className="flex items-start gap-2"><UserCircle size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> Experienced Driver</li>
                                        <li className="flex items-start gap-2"><Ticket size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> Park Entry Included</li>
                                        <li className="flex items-start gap-2"><MapPin size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> Free Pickup/Drop-off</li>
                                    </ul>
                                    <Link href="/safari">
                                        <button className="w-full py-3.5 bg-[#006064] text-white rounded-2xl font-bold hover:bg-[#004D40] transition-colors">Book Now</button>
                                    </Link>
                                </div>

                                {/* Full Day Safari */}
                                <div className="bg-white rounded-3xl p-6 shadow-[0_15px_40px_rgb(0,0,0,0.12)] border-2 border-[#FFC107] relative hover:-translate-y-2 transition-transform duration-300">
                                    <div className="absolute top-0 right-0 bg-[#FFC107] text-[#006064] text-[10px] font-black px-3 py-1.5 tracking-wider rounded-bl-2xl rounded-tr-[1.3rem]">POPULAR</div>
                                    <div className="inline-block px-3 py-1 bg-[#006064]/10 text-[#006064] text-sm font-bold rounded-full mb-4">Full Day</div>
                                    <h4 className="text-xl font-black text-[#006064] mb-2">1-Day Safari</h4>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-5">
                                        <Clock size={16} />
                                        <span>Full Day Experience</span>
                                    </div>
                                    <ul className="space-y-3 mb-8 text-sm font-medium text-slate-600">
                                        <li className="flex items-start gap-2"><Car size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> 4x4 Safari Jeep</li>
                                        <li className="flex items-start gap-2"><UserCircle size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> Experienced Driver</li>
                                        <li className="flex items-start gap-2"><Ticket size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> Park Entry Included</li>
                                        <li className="flex items-start gap-2"><MapPin size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> Free Pickup/Drop-off</li>
                                    </ul>
                                    <Link href="/safari">
                                        <button className="w-full py-3.5 bg-[#FFC107] text-[#006064] rounded-2xl font-black hover:bg-[#FFD54F] transition-colors shadow-lg shadow-[#FFC107]/30">Book Now</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Udawalawe National Park */}
                    <div className="rounded-[2.5rem] overflow-hidden shadow-2xl relative bg-white border border-slate-100">
                        <div className="absolute top-0 left-0 w-full h-[340px] z-0">
                            <img src="/wilpattu-new.png" alt="Udawalawe National Park Safari" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-[#006064]/80 to-transparent"></div>
                        </div>
                        <div className="relative z-10 pt-20 px-6 md:px-12 pb-12">
                            <h3 className="text-4xl md:text-5xl font-black text-white drop-shadow-md mb-12">Udawalawe National Park</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Morning Safari */}
                                <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
                                    <div className="inline-block px-3 py-1 bg-[#FFC107]/20 text-[#D4A000] text-sm font-bold rounded-full mb-4">Half Day</div>
                                    <h4 className="text-xl font-black text-[#006064] mb-2">Morning Safari</h4>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-5">
                                        <Clock size={16} />
                                        <span>5:30 AM - 10:00 AM</span>
                                    </div>
                                    <ul className="space-y-3 mb-8 text-sm font-medium text-slate-600">
                                        <li className="flex items-start gap-2"><Car size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> 4x4 Safari Jeep</li>
                                        <li className="flex items-start gap-2"><UserCircle size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> Experienced Driver</li>
                                        <li className="flex items-start gap-2"><Ticket size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> Park Entry Included</li>
                                        <li className="flex items-start gap-2"><MapPin size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> Free Pickup/Drop-off</li>
                                    </ul>
                                    <Link href="/safari">
                                        <button className="w-full py-3.5 bg-[#006064] text-white rounded-2xl font-bold hover:bg-[#004D40] transition-colors">Book Now</button>
                                    </Link>
                                </div>

                                {/* Evening Safari */}
                                <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
                                    <div className="inline-block px-3 py-1 bg-[#FFC107]/20 text-[#D4A000] text-sm font-bold rounded-full mb-4">Half Day</div>
                                    <h4 className="text-xl font-black text-[#006064] mb-2">Evening Safari</h4>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-5">
                                        <Clock size={16} />
                                        <span>2:30 PM - 6:00 PM</span>
                                    </div>
                                    <ul className="space-y-3 mb-8 text-sm font-medium text-slate-600">
                                        <li className="flex items-start gap-2"><Car size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> 4x4 Safari Jeep</li>
                                        <li className="flex items-start gap-2"><UserCircle size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> Experienced Driver</li>
                                        <li className="flex items-start gap-2"><Ticket size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> Park Entry Included</li>
                                        <li className="flex items-start gap-2"><MapPin size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> Free Pickup/Drop-off</li>
                                    </ul>
                                    <Link href="/safari">
                                        <button className="w-full py-3.5 bg-[#006064] text-white rounded-2xl font-bold hover:bg-[#004D40] transition-colors">Book Now</button>
                                    </Link>
                                </div>

                                {/* 3-Hour Quick Safari */}
                                <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
                                    <div className="inline-block px-3 py-1 bg-[#00A99D]/20 text-[#00897B] text-sm font-bold rounded-full mb-4">3 Hours</div>
                                    <h4 className="text-xl font-black text-[#006064] mb-2">Quick Safari</h4>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-5">
                                        <Clock size={16} />
                                        <span>Flexible Timing</span>
                                    </div>
                                    <ul className="space-y-3 mb-8 text-sm font-medium text-slate-600">
                                        <li className="flex items-start gap-2"><Car size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> 4x4 Safari Jeep</li>
                                        <li className="flex items-start gap-2"><UserCircle size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> Experienced Driver</li>
                                        <li className="flex items-start gap-2"><Ticket size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> Park Entry Included</li>
                                        <li className="flex items-start gap-2"><MapPin size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> Free Pickup/Drop-off</li>
                                    </ul>
                                    <Link href="/safari">
                                        <button className="w-full py-3.5 bg-[#006064] text-white rounded-2xl font-bold hover:bg-[#004D40] transition-colors">Book Now</button>
                                    </Link>
                                </div>

                                {/* Full Day Safari */}
                                <div className="bg-white rounded-3xl p-6 shadow-[0_15px_40px_rgb(0,0,0,0.12)] border-2 border-[#FFC107] relative hover:-translate-y-2 transition-transform duration-300">
                                    <div className="absolute top-0 right-0 bg-[#FFC107] text-[#006064] text-[10px] font-black px-3 py-1.5 tracking-wider rounded-bl-2xl rounded-tr-[1.3rem]">POPULAR</div>
                                    <div className="inline-block px-3 py-1 bg-[#006064]/10 text-[#006064] text-sm font-bold rounded-full mb-4">Full Day</div>
                                    <h4 className="text-xl font-black text-[#006064] mb-2">1-Day Safari</h4>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-5">
                                        <Clock size={16} />
                                        <span>Full Day Experience</span>
                                    </div>
                                    <ul className="space-y-3 mb-8 text-sm font-medium text-slate-600">
                                        <li className="flex items-start gap-2"><Car size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> 4x4 Safari Jeep</li>
                                        <li className="flex items-start gap-2"><UserCircle size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> Experienced Driver</li>
                                        <li className="flex items-start gap-2"><Ticket size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> Park Entry Included</li>
                                        <li className="flex items-start gap-2"><MapPin size={16} className="text-[#00A99D] shrink-0 mt-0.5" /> Free Pickup/Drop-off</li>
                                    </ul>
                                    <Link href="/safari">
                                        <button className="w-full py-3.5 bg-[#FFC107] text-[#006064] rounded-2xl font-black hover:bg-[#FFD54F] transition-colors shadow-lg shadow-[#FFC107]/30">Book Now</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
