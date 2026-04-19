import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingWidget from '@/components/BookingWidget';
import { Users, Briefcase, Wind, ShieldCheck, Star } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
    title: 'Reliable Taxi for 6 Passengers in Sri Lanka - KDH & Mini Van Transfers',
    description: 'Looking for a taxi for 6 people? We offer comfortable Mini Vans and KDH Vans for group airport transfers and tours in Sri Lanka. Fixed prices, AC, and plenty of luggage space.',
    keywords: '6 passenger taxi sri lanka, taxi for 6 people, 6 seater van colombo airport, group transfer sri lanka, kdh van 6 passengers',
};

export default function SixPassengerTaxiPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            
            
            {/* Hero Section */}
            <div className="bg-emerald-900 pt-32 pb-24 text-white">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-block bg-emerald-500 text-black px-4 py-1 rounded-full font-black text-xs uppercase tracking-widest mb-6">
                                Group Travel Experts
                            </div>
                            <h1 className="text-4xl md:text-7xl font-black mb-8 uppercase tracking-tighter leading-none">
                                Reliable Taxi for <span className="text-emerald-400">6+ Passengers</span> in Sri Lanka
                            </h1>
                            <p className="text-xl text-emerald-100/80 mb-10 leading-relaxed max-w-xl">
                                Traveling with family or a group of friends? Our fleet of spacious Mini Vans and Luxury KDH Vans ensures everyone travels together in comfort and style.
                            </p>
                            <div className="flex flex-wrap gap-6">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="text-emerald-400" />
                                    <span className="font-bold">Fully Insured</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="text-emerald-400" fill="currentColor" />
                                    <span className="font-bold">Top Rated Service</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-emerald-500/20 rounded-[3rem] blur-2xl group-hover:bg-emerald-500/30 transition-all"></div>
                            <div className="relative bg-white/5 backdrop-blur-sm border-2 border-white/10 p-8 rounded-[3rem]">
                                <Image 
                                    src="/vehicles/kdh_new.png" 
                                    alt="KDH Van for 6 Passengers" 
                                    width={600} 
                                    height={400} 
                                    className="object-contain hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-black uppercase mb-4">Why Book Our Group Vans?</h2>
                        <div className="w-24 h-2 bg-emerald-600 mx-auto"></div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="bg-slate-50 p-10 rounded-[3rem] border-2 border-slate-100 hover:border-emerald-500 transition-colors group">
                            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                <Users size={32} />
                            </div>
                            <h3 className="text-2xl font-black mb-4 uppercase">Spacious Seating</h3>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                Our vans are configured for maximum legroom. Perfect for 6 passengers with plenty of space to stretch out during long journeys.
                            </p>
                        </div>

                        <div className="bg-slate-50 p-10 rounded-[3rem] border-2 border-slate-100 hover:border-emerald-500 transition-colors group">
                            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                <Briefcase size={32} />
                            </div>
                            <h3 className="text-2xl font-black mb-4 uppercase">Luggage Capacity</h3>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                Don't worry about your bags. Our 6-passenger taxis can easily accommodate 6+ large suitcases and hand luggage.
                            </p>
                        </div>

                        <div className="bg-slate-50 p-10 rounded-[3rem] border-2 border-slate-100 hover:border-emerald-500 transition-colors group">
                            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                <Wind size={32} />
                            </div>
                            <h3 className="text-2xl font-black mb-4 uppercase">Dual A/C</h3>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                Beat the Sri Lankan heat. All our group vehicles feature powerful dual air-conditioning systems for all rows.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Booking & Fleet */}
            <section className="py-24 bg-emerald-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('/pattern.png')]"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto bg-white p-2 rounded-[3.5rem] shadow-2xl border-8 border-black">
                        <div className="p-12">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-black uppercase mb-2">Book Your 6-Seater Taxi</h2>
                                <p className="text-slate-500 font-bold italic">Instant confirmation & professional English speaking drivers</p>
                            </div>
                            <BookingWidget />
                        </div>
                    </div>
                </div>
            </section>

            
        </main>
    );
}
