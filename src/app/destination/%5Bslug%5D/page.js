'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Clock, Calendar, Check, Compass, Star, ChevronRight, Zap, ShieldCheck } from 'lucide-react';
import { destinations } from '@/data/destinations';
import BookingModal from '@/components/BookingModal';

export default function DestinationPage() {
    const params = useParams();
    const router = useRouter();
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const slug = params.slug?.toLowerCase();
    const data = destinations[slug];

    if (!data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <Compass size={64} className="text-emerald-900/20 mb-4" />
                <h1 className="text-2xl font-black text-emerald-900 mb-2 uppercase">Destination Not Found</h1>
                <p className="text-slate-500 mb-8 max-w-md">We couldn't find the destination you're looking for. Maybe try another one?</p>
                <Link href="/" className="px-8 py-3 bg-emerald-900 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-lg">
                    Return Home
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen pb-20">
            {/* Nav Offset */}
            <div className="h-20"></div>

            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
                <Image
                    src={data.image}
                    alt={data.title}
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/20 to-transparent"></div>

                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-20 max-w-7xl mx-auto w-full">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 group bg-black/20 backdrop-blur-md px-4 py-2 rounded-full w-fit transition-all">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest">Back to Routes</span>
                    </Link>

                    <div className="max-w-3xl">
                        <span className="inline-block bg-emerald-600 text-white text-[10px] md:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-4 shadow-lg">
                            {data.badge}
                        </span>
                        <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-[0.9] tracking-tighter">
                            {data.title.toUpperCase()}
                        </h1>
                        <p className="text-lg md:text-xl text-white/80 leading-relaxed font-medium mb-8">
                            {data.description}
                        </p>

                        <div className="flex flex-wrap gap-4 md:gap-8">
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
                                <MapPin size={24} className="text-emerald-400" />
                                <div>
                                    <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">Distance</p>
                                    <p className="text-lg font-bold text-white">{data.distance}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
                                <Clock size={24} className="text-emerald-400" />
                                <div>
                                    <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">Duration</p>
                                    <p className="text-lg font-bold text-white">{data.duration}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="max-w-7xl mx-auto px-6 mt-20 grid lg:grid-cols-[1fr,400px] gap-12 lg:gap-20">
                <div className="space-y-12">
                    <div>
                        <h2 className="text-3xl font-black text-emerald-900 dark:text-white uppercase tracking-tight mb-8">
                            What to <span className="text-emerald-600">Experience</span>
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {data.activities.map((activity, i) => (
                                <div key={i} className="flex items-center gap-4 bg-emerald-50 dark:bg-white/5 p-5 rounded-2xl border border-emerald-900/5 dark:border-white/5 group hover:bg-emerald-900 hover:text-white transition-all duration-300">
                                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-white/20 group-hover:text-white shadow-sm transition-colors">
                                        <Check size={20} />
                                    </div>
                                    <span className="font-bold text-sm md:text-base">{activity}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-emerald-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Zap size={120} fill="currentColor" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-black mb-4 uppercase leading-tight">Book your transfer <br />starting from <span className="text-emerald-400">${data.startingPrice}</span></h3>
                            <p className="text-emerald-100/60 mb-8 max-w-md">Our premium highway service ensures a smooth journey from Colombo Bandaranaike International Airport direct to {data.title}.</p>
                            <button
                                onClick={() => setIsBookingOpen(true)}
                                className="bg-white text-emerald-900 px-10 py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-sm hover:scale-105 transition-all shadow-xl flex items-center gap-3 w-fit"
                            >
                                Get Instant Quote
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <aside className="space-y-8">
                    {/* Trust Sidebar */}
                    <div className="bg-white dark:bg-slate-900 border border-emerald-900/10 dark:border-white/10 p-8 rounded-[2rem] shadow-sm">
                        <h4 className="text-lg font-black text-emerald-900 dark:text-white uppercase tracking-widest mb-6">Why Book With Us?</h4>
                        <div className="space-y-6">
                            {[
                                { icon: ShieldCheck, title: "Verified Service", desc: "Top-rated by tourists worldwide" },
                                { icon: Star, title: "4.9/5 Rating", desc: "Based on 1,200+ Google reviews" },
                                { icon: Zap, title: "Instant Booking", desc: "Secure your ride in 60 seconds" }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-12 h-12 bg-emerald-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-emerald-900 dark:text-white text-sm">{item.title}</p>
                                        <p className="text-xs text-slate-500 dark:text-white/40 mt-0.5">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 pt-8 border-t border-emerald-900/5 dark:border-white/5 flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-100 flex items-center justify-center overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Join 500+ Travellers</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">visiting {data.title} this week</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-50 dark:bg-white/5 p-8 rounded-[2rem] border border-emerald-900/5 dark:border-white/5">
                        <div className="flex items-center gap-2 text-emerald-600 mb-4">
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                        </div>
                        <p className="italic text-emerald-900/70 dark:text-white/70 text-sm leading-relaxed mb-6 font-medium">
                            "The transfer from Airport to {data.title} was flawless. Our driver was waiting with a clear sign and the vehicle was spotless. Highly recommend!"
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-200 overflow-hidden">
                                <img src="https://i.pravatar.cc/100?u=jane" alt="Jane" />
                            </div>
                            <div>
                                <p className="font-black text-emerald-900 dark:text-white text-xs uppercase tracking-widest">Jane Cooper</p>
                                <p className="text-[10px] text-emerald-600 font-bold uppercase">Verified Traveller</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </section>

            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                initialData={{ dropoff: data.title + ', Sri Lanka' }}
            />
        </div>
    );
}
