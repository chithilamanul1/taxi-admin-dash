'use client';

import React from 'react';
import { CheckCircle, MapPin, Calendar, Clock, Car, Star, Phone, MessageSquare, ArrowRight, ShieldCheck, Zap, AlertCircle, Info, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import BookingActions from '@/components/BookingActions';
import TrackingMap from '@/components/TrackingMap';
import RatingSystem from '@/components/RatingSystem';

export default function BookingStatusClient({ booking }) {
    return (
        <div className="min-h-screen bg-white pt-24 pb-20 px-4 font-sans select-none">
            <div className="max-w-4xl mx-auto border-[10px] border-black shadow-[30px_30px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
                {/* Header Section */}
                <div className="bg-black p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#FACC15]/5 pattern-grid-lg opacity-40"></div>
                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-[#FACC15] border-4 border-black flex items-center justify-center mx-auto mb-8 shadow-[10px_10px_0px_0px_rgba(255,255,255,0.2)]">
                            <CheckCircle size={48} className="text-black" strokeWidth={3} />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white mb-4 leading-none strike-through">
                            BOOKING <span className="text-[#FACC15]">ACTIVE</span>
                        </h1>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-[#FACC15]/60 font-black uppercase text-xs tracking-[0.4em]">
                             <span>ESTABLISHED BY ADMIN</span>
                             <div className="hidden md:block w-2 h-2 bg-[#FACC15]/20 rotate-45"></div>
                             <span>REF: {booking._id.toUpperCase()}</span>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-14 space-y-16">
                    {/* Status Banner - Ultra Brutalist */}
                    {!booking.driver ? (
                        <div className="bg-[#FACC15] border-[6px] border-black p-8 flex flex-col md:flex-row gap-8 items-center translate-y-[-60px] shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
                            <div className="w-16 h-16 bg-black flex items-center justify-center shrink-0 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.5)]">
                                <div className="w-5 h-5 bg-[#FACC15] animate-ping"></div>
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-black leading-none mb-2 underline decoration-4">Sourcing Premium Chauffeur</h3>
                                <p className="text-black/80 font-bold uppercase text-xs tracking-widest leading-relaxed max-w-xl">System is broadcasting your request to our elite fleet. You will receive a secure WhatsApp link upon assignment.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-black text-white border-[6px] border-[#FACC15] p-8 flex flex-col md:flex-row gap-8 items-center translate-y-[-60px] shadow-[15px_15px_0px_0px_#FACC15]">
                            <div className="w-16 h-16 bg-[#FACC15] flex items-center justify-center shrink-0 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)]">
                                <Car size={32} className="text-black" strokeWidth={3} />
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-[#FACC15] leading-none mb-2">Chauffeur Locked & Loaded</h3>
                                <p className="text-white/70 font-bold uppercase text-xs tracking-widest leading-relaxed max-w-xl">Your journey is mission-ready. Agent {booking.driver.name} is standing by for your arrival.</p>
                            </div>
                        </div>
                    )}

                    {/* Trip Status Timeline - Clean Black/Yellow */}
                    <div className="px-6 py-12 bg-slate-50 border-[4px] border-black relative">
                        <div className="absolute top-0 left-8 px-4 bg-black text-white text-[10px] font-black uppercase tracking-[.3em] -translate-y-1/2">Trip Evolution</div>
                        <div className="flex justify-between relative">
                            {/* Connecting Lines */}
                            <div className="absolute top-6 left-0 right-0 h-2 bg-black/10 -z-0"></div>
                            <div className={`absolute top-6 left-0 h-2 bg-black transition-all duration-1000 -z-0 ${
                                booking.status === 'pending' ? 'w-0' : 
                                booking.status === 'confirmed' || booking.status === 'assigned' ? 'w-1/3' : 
                                booking.status === 'ongoing' ? 'w-2/3' : 'w-full'
                            }`}></div>

                            {[
                                { id: 'pending', label: 'Queued', icon: CheckCircle },
                                { id: 'confirmed', alternateId: 'assigned', label: 'Secured', icon: UserIcon },
                                { id: 'ongoing', label: 'Transit', icon: Car },
                                { id: 'completed', label: 'Arrived', icon: Star }
                            ].map((s, idx) => {
                                const isActive = booking.status === s.id || booking.status === s.alternateId || (s.id === 'pending' && booking.status !== 'cancelled');
                                const statusOrder = ['pending', 'confirmed', 'assigned', 'ongoing', 'completed'];
                                const bookingIdx = statusOrder.indexOf(booking.status);
                                const currentIdx = statusOrder.indexOf(s.id);
                                const isPast = bookingIdx > currentIdx;
                                
                                return (
                                    <div key={s.id} className="flex flex-col items-center gap-4 relative z-10 flex-1">
                                        <div className={`w-14 h-14 border-[4px] border-black flex items-center justify-center transition-all ${
                                            isActive ? 'bg-[#FACC15] scale-110 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black' : 
                                            isPast ? 'bg-black text-[#FACC15]' : 'bg-white text-slate-300 border-slate-200'
                                        }`}>
                                            <s.icon size={24} strokeWidth={3} />
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest italic ${isActive ? 'text-black' : 'text-slate-400'}`}>
                                            {s.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Action Hub - Grid Refresh */}
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="bg-black text-white p-10 border-[6px] border-black shadow-[20px_20px_0px_0px_#FACC15] relative group">
                           <h4 className="text-2xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-4">
                               <ShieldCheck className="text-[#FACC15]" size={28} strokeWidth={3} />
                               SECURE HUB
                           </h4>
                           <div className="grid grid-cols-2 gap-6">
                               <button 
                                   onClick={() => {
                                       if(navigator.share) {
                                           navigator.share({ title: 'Airport Taxi Tracker', url: window.location.href });
                                       } else {
                                           navigator.clipboard.writeText(window.location.href);
                                           alert('Secure tracking link copied.');
                                       }
                                   }}
                                   className="aspect-square flex flex-col items-center justify-center gap-4 bg-white/5 border-[3px] border-white/10 hover:bg-[#FACC15] hover:text-black hover:border-black transition-all group/btn"
                               >
                                   <Zap size={32} className="text-[#FACC15] group-hover/btn:text-black" />
                                   <span className="text-[11px] font-black uppercase tracking-[.2em]">Share</span>
                               </button>
                               <button 
                                   onClick={() => {
                                       if(confirm("ALERT: Connect with emergency rapid response?")) {
                                           window.location.href = "tel:119";
                                       }
                                   }}
                                   className="aspect-square flex flex-col items-center justify-center gap-4 bg-red-600/10 border-[3px] border-red-600/20 hover:bg-red-600 hover:text-white hover:border-black transition-all group/sos"
                               >
                                   <AlertCircle size={32} className="text-red-500 group-hover/sos:text-white" />
                                   <span className="text-[11px] font-black uppercase tracking-[.2em] text-red-500 group-hover/sos:text-white">SOS</span>
                               </button>
                           </div>
                        </div>

                        <div className="bg-[#FACC15] text-black p-10 border-[6px] border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
                           <h4 className="text-2xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-4">
                               <MessageSquare className="text-black" size={28} strokeWidth={3} />
                               CONCIERGE
                           </h4>
                           <div className="space-y-6">
                               <a href="tel:+94716885880" className="flex items-center justify-between bg-black text-white p-5 border-[3px] border-black hover:translate-x-2 transition-transform">
                                   <div className="flex items-center gap-4">
                                       <Phone size={20} className="text-[#FACC15]" strokeWidth={3} />
                                       <span className="text-[12px] font-black uppercase tracking-widest">Voice Call</span>
                                   </div>
                                   <ArrowRight size={20} />
                               </a>
                               <a href="https://wa.me/94716885880" target="_blank" className="flex items-center justify-between bg-white text-black p-5 border-[3px] border-black hover:translate-x-2 transition-transform shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                                   <div className="flex items-center gap-4">
                                       <MessageSquare size={20} className="text-emerald-500" strokeWidth={3} />
                                       <span className="text-[12px] font-black uppercase tracking-widest">WhatsApp</span>
                                   </div>
                                   <ArrowRight size={20} />
                               </a>
                           </div>
                        </div>
                    </div>

                    {/* Driver Profile */}
                    {booking.driver && (
                        <div className="bg-white border-[6px] border-black p-10 flex flex-col md:flex-row items-center justify-between gap-10 shadow-[25px_25px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex items-center gap-8">
                                <div className="w-24 h-24 bg-black text-[#FACC15] flex items-center justify-center text-5xl font-black italic shadow-[8px_8px_0px_0px_#FACC15]">
                                    {booking.driver.name?.[0].toUpperCase()}
                                </div>
                                <div className="space-y-3">
                                    <div className="inline-block bg-black text-white text-[9px] font-black px-3 py-1 uppercase tracking-widest italic">Verified Driver</div>
                                    <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none">{booking.driver.name}</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 text-black">
                                            <Star size={16} fill="currentColor" strokeWidth={3} className="text-[#FACC15]" />
                                            <span className="text-sm font-black italic">{booking.driver.ratings || 5.0}</span>
                                        </div>
                                        <div className="w-2 h-2 bg-black rotate-45"></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">{booking.driver.totalRides || 0}+ Missions</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center md:items-end gap-6 w-full md:w-auto">
                                <div className="bg-slate-100 p-4 border-[3px] border-black w-full text-center">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Fleet Plate</p>
                                    <p className="font-mono text-3xl font-black italic text-black">{booking.driver.vehicleNumber}</p>
                                </div>
                                <div className="flex gap-4 w-full">
                                    <a href={`tel:${booking.driver.phone}`} className="flex-1 bg-white border-[4px] border-black p-4 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                                        <Phone size={24} strokeWidth={3} />
                                    </a>
                                    <a href={`https://wa.me/${booking.driver.phone?.replace(/[^0-9]/g, '')}`} target="_blank" className="flex-[3] bg-emerald-500 border-[4px] border-black p-4 text-center font-black uppercase italic text-sm text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] transition-all tracking-[.2em]">
                                        WhatsApp Chauffeur
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tracking Map Container */}
                    <div className="border-[10px] border-black shadow-[30px_30px_0px_0px_rgba(0,0,0,1)] bg-slate-100 min-h-[400px]">
                        <TrackingMap
                            pickup={booking.pickupLocation}
                            dropoff={booking.dropoffLocation}
                            driverId={booking.driver?._id}
                        />
                    </div>

                    {/* Technical Grid */}
                    <div className="grid md:grid-cols-2 gap-16 pt-10">
                        <div className="space-y-8">
                            <h3 className="text-xs font-black text-black uppercase tracking-[.4em] italic mb-6 border-l-[6px] border-[#FACC15] pl-4">Route Manifest</h3>
                            <div className="space-y-12">
                                <div className="relative pl-10 border-l-[4px] border-black/10">
                                    <div className="absolute left-[-12px] top-0 w-6 h-6 bg-black flex items-center justify-center">
                                        <div className="w-2 h-2 bg-[#FACC15]"></div>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Origin</p>
                                    <p className="font-black text-black text-lg uppercase italic leading-tight">{booking.pickupLocation?.address}</p>
                                </div>
                                {booking.waypoints?.map((wp, i) => (
                                    <div key={i} className="relative pl-10 border-l-[4px] border-black/10">
                                        <div className="absolute left-[-8px] top-1 w-4 h-4 bg-white border-[3px] border-black"></div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Checkpoint {i+1}</p>
                                        <p className="font-black text-black text-sm uppercase italic leading-tight">{wp.address}</p>
                                    </div>
                                ))}
                                <div className="relative pl-10 border-l-[4px] border-black/10">
                                    <div className="absolute left-[-12px] top-0 w-6 h-6 bg-red-600 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white animate-pulse"></div>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Termination</p>
                                    <p className="font-black text-black text-lg uppercase italic leading-tight">{booking.dropoffLocation?.address}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <h3 className="text-xs font-black text-black uppercase tracking-[.4em] italic mb-6 border-l-[6px] border-black pl-4">Mission Specs</h3>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="flex items-center gap-6 group">
                                    <div className="w-16 h-16 bg-[#FACC15] border-[3px] border-black flex items-center justify-center text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:bg-black group-hover:text-white transition-colors">
                                        <Calendar size={28} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Deployment Date</p>
                                        <p className="font-black text-2xl italic tracking-tighter text-black">{booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleDateString() : 'TBD'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 group">
                                    <div className="w-16 h-16 bg-black border-[3px] border-black flex items-center justify-center text-[#FACC15] shadow-[6px_6px_0px_0px_#FACC15] group-hover:bg-[#FACC15] group-hover:text-black transition-colors">
                                        <Clock size={28} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Pickup Windows</p>
                                        <p className="font-black text-2xl italic tracking-tighter text-black">{booking.scheduledTime || 'TBD'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 group">
                                    <div className="w-16 h-16 bg-white border-[3px] border-black flex items-center justify-center text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[6px_6px_0px_0px_#FACC15] transition-all">
                                        <Car size={28} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Asset Category</p>
                                        <p className="font-black text-2xl italic tracking-tighter text-black uppercase underline decoration-4 decoration-[#FACC15]">{booking.vehicleType?.replace('-', ' ') || 'STANDARD'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Block */}
                    <div className="bg-black p-12 flex flex-col md:flex-row justify-between items-center border-[8px] border-black shadow-[25px_25px_0px_0px_rgba(0,0,0,0.1)] gap-10">
                        <div className="text-center md:text-left space-y-2">
                            <p className="text-[#FACC15] font-black text-[12px] uppercase tracking-[.5em] italic">Settlement Total</p>
                            <p className="text-white/30 font-black uppercase text-[10px] tracking-widest">{booking.paymentMethod === 'card' ? 'DIGITAL CLEARANCE COMPLETE' : 'UPON MISSION COMPLETION'}</p>
                        </div>
                        <div className="flex items-baseline gap-6">
                            <span className="text-2xl font-black text-white/20 italic uppercase tracking-widest">{booking.currency || 'LKR'}</span>
                            <span className="text-7xl md:text-9xl font-black italic tracking-tighter text-[#FACC15] leading-none drop-shadow-[10px_10px_0px_rgba(255,255,255,0.05)]">
                                {(booking.currency && booking.currency !== 'LKR' && booking.displayPrice) ? booking.displayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : booking.totalPrice?.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Rating Focus */}
                    {booking.status === 'completed' && !booking.rating && (
                        <div className="py-10 border-y-[6px] border-black bg-slate-50">
                            <p className="text-center text-[10px] font-black uppercase tracking-[.6em] mb-8 italic">Mission Review Required</p>
                            <RatingSystem 
                                bookingId={booking._id} 
                                initialRating={booking.rating} 
                                initialReview={booking.review} 
                            />
                        </div>
                    )}

                    <BookingActions booking={booking} />

                    <div className="text-center pt-16">
                        <Link href="/" className="inline-flex items-center justify-center w-full md:w-auto gap-4 bg-white text-black px-14 py-6 border-[6px] border-black font-black text-sm uppercase italic tracking-[.3em] transition-all hover:bg-black hover:text-[#FACC15] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] group">
                            <ArrowRight size={20} className="rotate-180 group-hover:translate-x-[-8px] transition-transform" />
                            Return to Base
                        </Link>
                    </div>
                </div>
            </div>
            
            <p className="text-center mt-12 text-[10px] font-black uppercase tracking-[.8em] text-black/10">AIRPORT TAXI TOURS • MISSION CRITICAL INFRASTRUCTURE</p>
        </div>
    );
}
