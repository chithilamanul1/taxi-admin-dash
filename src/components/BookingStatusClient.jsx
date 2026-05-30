'use client';

import React from 'react';
import { CheckCircle, MapPin, Calendar, Clock, Car, Star, Phone, MessageSquare, ArrowRight, ShieldCheck, Zap, AlertCircle, Info, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import BookingActions from '@/components/BookingActions';
import TrackingMap from '@/components/TrackingMap';
import RatingSystem from '@/components/RatingSystem';

export default function BookingStatusClient({ booking }) {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 font-sans select-none">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                {/* Header Section */}
                <div className="bg-slate-900 p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#FACC15]/5 pattern-grid-lg opacity-40"></div>
                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-white/5 text-[#FACC15] border border-white/10 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
                            <CheckCircle size={48} strokeWidth={2} />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-4 leading-none">
                            BOOKING <span className="text-[#FACC15]">ACTIVE</span>
                        </h1>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-[#FACC15]/80 font-bold uppercase text-xs tracking-[0.4em]">
                             <span>ESTABLISHED BY ADMIN</span>
                             <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-[#FACC15]/40"></div>
                             <span>REF: {booking._id.toUpperCase()}</span>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-14 space-y-16">
                    {/* Status Banner */}
                    {!booking.driver ? (
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center -mt-24 shadow-lg relative z-20">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                                <div className="w-5 h-5 bg-amber-500 rounded-full animate-ping"></div>
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="text-2xl font-black uppercase tracking-tight text-amber-900 mb-2">Sourcing Premium Chauffeur</h3>
                                <p className="text-amber-700/80 font-bold uppercase text-xs tracking-widest leading-relaxed max-w-xl">System is broadcasting your request to our elite fleet. You will receive a secure WhatsApp link upon assignment.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center -mt-24 shadow-lg relative z-20">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                                <Car size={32} className="text-emerald-600" strokeWidth={2} />
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="text-2xl font-black uppercase tracking-tight text-emerald-900 mb-2">Chauffeur Assigned</h3>
                                <p className="text-emerald-700/80 font-bold uppercase text-xs tracking-widest leading-relaxed max-w-xl">Your journey is ready for pickup. Driver {booking.driver.name} is standing by for your arrival.</p>
                            </div>
                        </div>
                    )}

                    {/* Trip Status Timeline */}
                    <div className="px-6 py-12 bg-white rounded-2xl border border-slate-100 shadow-sm relative">
                        <div className="absolute top-0 left-8 px-4 bg-white text-slate-800 text-[10px] font-bold uppercase tracking-[.3em] -translate-y-1/2">Booking Progress</div>
                        <div className="flex justify-between relative">
                            {/* Connecting Lines */}
                            <div className="absolute top-6 left-0 right-0 h-1 bg-slate-100 -z-0 rounded-full"></div>
                            <div className={`absolute top-6 left-0 h-1 bg-emerald-500 rounded-full transition-all duration-1000 -z-0 ${
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
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border ${
                                            isActive ? 'bg-emerald-500 border-emerald-500 shadow-lg text-white scale-110' : 
                                            isPast ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-white text-slate-300 border-slate-100'
                                        }`}>
                                            <s.icon size={20} strokeWidth={2.5} />
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                                            {s.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Action Hub - Grid Refresh */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-slate-50 text-slate-800 p-8 rounded-2xl border border-slate-100 shadow-sm relative group">
                           <h4 className="text-xl font-black uppercase tracking-tight mb-8 flex items-center gap-3 text-slate-800">
                               <ShieldCheck className="text-[#FACC15]" size={24} strokeWidth={2.5} />
                               SECURE HUB
                           </h4>
                           <div className="grid grid-cols-2 gap-4">
                               <button 
                                   onClick={() => {
                                       if(navigator.share) {
                                           navigator.share({ title: 'Airport Taxi Tracker', url: window.location.href });
                                       } else {
                                           navigator.clipboard.writeText(window.location.href);
                                           alert('Secure tracking link copied.');
                                       }
                                   }}
                                   className="aspect-square flex flex-col items-center justify-center gap-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-[#FACC15] transition-all group/btn shadow-sm"
                               >
                                   <Zap size={28} className="text-[#FACC15]" />
                                   <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 group-hover/btn:text-slate-900">Share</span>
                               </button>
                               <button 
                                   onClick={() => {
                                       if(confirm("ALERT: Connect with emergency rapid response?")) {
                                           window.location.href = "tel:119";
                                       }
                                   }}
                                   className="aspect-square flex flex-col items-center justify-center gap-3 bg-red-50 border border-red-100 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-600 transition-all group/sos shadow-sm"
                               >
                                   <AlertCircle size={28} className="text-red-500 group-hover/sos:text-white" />
                                   <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 group-hover/sos:text-white">SOS</span>
                               </button>
                           </div>
                        </div>

                        <div className="bg-yellow-50 text-yellow-900 p-8 rounded-2xl border border-yellow-100 shadow-sm">
                           <h4 className="text-xl font-black uppercase tracking-tight mb-8 flex items-center gap-3 text-yellow-900">
                               <MessageSquare className="text-yellow-600" size={24} strokeWidth={2.5} />
                               CONCIERGE
                           </h4>
                           <div className="space-y-4">
                                <button 
                                   onClick={() => window.dispatchEvent(new CustomEvent('open-live-chat'))}
                                   className="flex items-center justify-between w-full bg-white text-slate-800 p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left"
                                >
                                   <div className="flex items-center gap-3">
                                       <MessageSquare size={18} className="text-[#FACC15]" strokeWidth={2.5} />
                                       <span className="text-[11px] font-bold uppercase tracking-widest">Live Chat</span>
                                   </div>
                                   <ArrowRight size={18} className="text-slate-400" />
                                </button>
                               <a href="https://wa.me/94716885880" target="_blank" className="flex items-center justify-between bg-emerald-500 text-white p-4 rounded-xl border border-emerald-400 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                                   <div className="flex items-center gap-3">
                                       <MessageSquare size={18} className="text-white" strokeWidth={2.5} />
                                       <span className="text-[11px] font-bold uppercase tracking-widest">WhatsApp</span>
                                   </div>
                                   <ArrowRight size={18} className="text-emerald-200" />
                               </a>
                           </div>
                        </div>
                    </div>

                    {/* Driver Profile */}
                    {booking.driver && (
                        <div className="bg-white border border-slate-100 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-md">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl font-black">
                                    {booking.driver.name?.[0].toUpperCase()}
                                </div>
                                <div className="space-y-2">
                                    <div className="inline-block bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">Verified Driver</div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight text-slate-800 leading-none">{booking.driver.name}</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-slate-600">
                                            <Star size={14} fill="currentColor" className="text-yellow-400" />
                                            <span className="text-sm font-bold">{booking.driver.ratings || 5.0}</span>
                                        </div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{booking.driver.totalRides || 0}+ Total Rides</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center md:items-end gap-5 w-full md:w-auto">
                                <div className="bg-slate-50 px-6 py-3 rounded-xl border border-slate-100 text-center w-full">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fleet Plate</p>
                                    <p className="font-mono text-xl font-black text-slate-800">{booking.driver.vehicleNumber}</p>
                                </div>
                                <div className="flex gap-3 w-full">
                                    <a href={`tel:${booking.driver.phone}`} className="flex-1 bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
                                        <Phone size={20} strokeWidth={2} />
                                    </a>
                                    <a href={`https://wa.me/${booking.driver.phone?.replace(/[^0-9]/g, '')}`} target="_blank" className="flex-[3] bg-emerald-500 rounded-xl p-3 text-center font-bold uppercase text-xs text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all tracking-wider flex items-center justify-center gap-2">
                                        <MessageSquare size={16} /> WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tracking Map Container */}
                    <div className="border border-slate-100 shadow-md bg-slate-50 rounded-2xl overflow-hidden min-h-[400px]">
                        <TrackingMap
                            pickup={booking.pickupLocation}
                            dropoff={booking.dropoffLocation}
                            driverId={booking.driver?._id}
                        />
                    </div>

                    {/* Technical Grid */}
                    <div className="grid md:grid-cols-2 gap-12 pt-8">
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Route Details</h3>
                            <div className="space-y-8">
                                <div className="relative pl-8 border-l-2 border-slate-100">
                                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center border-2 border-white"></div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Origin</p>
                                    <p className="font-bold text-slate-800 text-sm leading-tight">{booking.pickupLocation?.address}</p>
                                </div>
                                {booking.waypoints?.map((wp, i) => (
                                    <div key={i} className="relative pl-8 border-l-2 border-slate-100">
                                        <div className="absolute left-[-7px] top-1 w-3 h-3 rounded-full bg-white border-2 border-slate-300"></div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Checkpoint {i+1}</p>
                                        <p className="font-bold text-slate-700 text-xs leading-tight">{wp.address}</p>
                                    </div>
                                ))}
                                <div className="relative pl-8 border-l-2 border-transparent">
                                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white"></div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Destination</p>
                                    <p className="font-bold text-slate-800 text-sm leading-tight">{booking.dropoffLocation?.address}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Trip Details</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center gap-5 p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                                    <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                                        <Calendar size={20} strokeWidth={2} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Scheduled Date</p>
                                        <p className="font-bold text-lg text-slate-800">{booking.scheduledDate ? new Date(booking.scheduledDate + (booking.scheduledDate.includes('T') ? '' : 'T12:00:00')).toLocaleDateString() : 'TBD'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                                    <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-yellow-500">
                                        <Clock size={20} strokeWidth={2} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Pickup Time</p>
                                        <p className="font-bold text-lg text-slate-800">{booking.scheduledTime || 'TBD'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                                    <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700">
                                        <Car size={20} strokeWidth={2} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Vehicle Category</p>
                                        <p className="font-bold text-lg text-slate-800 uppercase">{booking.vehicleType?.replace('-', ' ') || 'STANDARD'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Block */}
                    <div className="bg-slate-900 p-10 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl">
                        <div className="text-center md:text-left space-y-1">
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Total Price</p>
                            <p className="text-[#FACC15] font-bold uppercase text-[9px] tracking-wider">{booking.paymentMethod === 'card' ? 'PAYMENT PROCESSED' : 'PAYMENT DUE UPON ARRIVAL'}</p>
                        </div>
                        <div className="flex items-baseline gap-3">
                            <span className="text-xl font-bold text-slate-500 tracking-wider">{booking.currency || 'LKR'}</span>
                            <span className="text-5xl md:text-6xl font-black tracking-tight text-white leading-none">
                                {(booking.currency && booking.currency !== 'LKR' && booking.displayPrice) ? booking.displayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : booking.totalPrice?.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Rating Focus */}
                    {booking.status === 'completed' && !booking.rating && (
                        <div className="py-8 border-y border-slate-100 bg-slate-50/50 rounded-2xl">
                            <p className="text-center text-[10px] font-bold uppercase tracking-[.4em] mb-6 text-slate-500">Rate Your Experience</p>
                            <RatingSystem 
                                bookingId={booking._id} 
                                initialRating={booking.rating} 
                                initialReview={booking.review} 
                            />
                        </div>
                    )}

                    <BookingActions booking={booking} />

                    <div className="text-center pt-8 pb-4">
                        <Link href="/" className="inline-flex items-center justify-center w-full md:w-auto gap-3 bg-slate-900 text-white px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md hover:bg-slate-800 hover:-translate-y-1 transition-all group">
                            <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
            
            <p className="text-center mt-12 text-[9px] font-bold uppercase tracking-[.5em] text-slate-400">AIRPORT TAXI TOURS • PREMIUM TRANSPORTATION SERVICES</p>
        </div>
    );
}
