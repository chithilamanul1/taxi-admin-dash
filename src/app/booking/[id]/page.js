import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import User from '@/models/User'; // Ensure User is registered
import Driver from '@/models/Driver'; // Ensure Driver is registered
import { notFound } from 'next/navigation';
import { CheckCircle, MapPin, Calendar, Clock, Car, Star, Phone, MessageSquare, ArrowRight, ShieldCheck, Zap, AlertCircle, Info } from 'lucide-react';
import Link from 'next/link';
import BookingActions from '@/components/BookingActions';
import TrackingMap from '@/components/TrackingMap';
import RatingSystem from '@/components/RatingSystem';

export const dynamic = 'force-dynamic';

export default async function BookingStatusPage({ params }) {
    await dbConnect();

    // Fix: Await params (Next.js 15)
    const { id } = await params;

    let booking;
    try {
        booking = await Booking.findById(id).populate('driver').lean();

        if (!booking) {
            notFound();
        }

        // Serialize
        booking._id = booking._id.toString();
        if (booking.customer) booking.customer = booking.customer.toString();
        if (booking.driver) booking.driver = JSON.parse(JSON.stringify(booking.driver));
        booking = JSON.parse(JSON.stringify(booking));

    } catch (e) {
        console.error(`Error loading booking ${id}:`, e);
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-none shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] overflow-hidden border-8 border-black">
                <div className="bg-[#006064] p-10 text-center text-white relative overflow-hidden border-b-8 border-black">
                    <div className="absolute inset-0 bg-black/10 pattern-grid-lg opacity-20"></div>
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-black/20 rounded-none border-4 border-black flex items-center justify-center mx-auto mb-6 backdrop-blur-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-bounce-slow">
                            <CheckCircle size={40} className="text-[#FACC15]" strokeWidth={3} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-2 leading-none">BOOKING CONFIRMED!</h1>
                        <p className="text-[#00A99D] font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-2">
                             Reference ID: <span className="font-mono bg-black/20 px-3 py-1 border-2 border-black/20 select-all">{booking._id.toUpperCase()}</span>
                        </p>
                    </div>
                </div>

                <div className="p-8 md:p-12 space-y-12">
                    {/* Status Banner */}
                    {!booking.driver ? (
                        <div className="bg-[#FACC15] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 flex gap-4 items-start translate-y-[-40px]">
                            <div className="w-8 h-8 bg-black rounded-none flex items-center justify-center shrink-0 mt-0.5 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]">
                                <div className="w-3 h-3 bg-[#FACC15] rounded-none animate-pulse"></div>
                            </div>
                            <div>
                                <p className="text-black font-black uppercase italic text-lg tracking-tighter leading-none mb-1">Processing Your Request</p>
                                <p className="text-black/70 font-bold uppercase text-[10px] tracking-widest leading-relaxed">We have received your booking. A professional driver will be assigned shortly. You'll receive a WhatsApp notification once assigned.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-emerald-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 flex gap-4 items-start translate-y-[-40px]">
                            <div className="w-8 h-8 bg-black rounded-none flex items-center justify-center shrink-0 mt-0.5 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]">
                                <div className="w-3 h-3 bg-emerald-400 rounded-none"></div>
                            </div>
                            <div>
                                <p className="text-black font-black uppercase italic text-lg tracking-tighter leading-none mb-1">Driver Assigned & Ready</p>
                                <p className="text-black/70 font-bold uppercase text-[10px] tracking-widest leading-relaxed">Your journey is confirmed. {booking.driver.name} has been assigned to your trip.</p>
                            </div>
                        </div>
                    )}

                    {/* Trip Status Timeline */}
                    <div className="px-4 py-8 bg-slate-50 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] mb-12">
                        <div className="flex justify-between relative">
                            {/* Connecting Lines */}
                            <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200 -z-0"></div>
                            <div className={`absolute top-5 left-0 h-1 bg-[#006064] transition-all duration-1000 -z-0 ${
                                booking.status === 'pending' ? 'w-0' : 
                                booking.status === 'confirmed' ? 'w-1/3' : 
                                booking.status === 'ongoing' ? 'w-2/3' : 'w-full'
                            }`}></div>

                            {[
                                { id: 'pending', label: 'Booked', icon: CheckCircle },
                                { id: 'confirmed', label: 'Assigned', icon: User },
                                { id: 'ongoing', label: 'En Route', icon: Car },
                                { id: 'completed', label: 'Finished', icon: Star }
                            ].map((s, idx) => {
                                const isActive = booking.status === s.id || (s.id === 'pending' && booking.status !== 'cancelled');
                                const isPast = ['completed', 'cancelled', 'ongoing', 'confirmed'].includes(booking.status) && idx <= ['pending', 'confirmed', 'ongoing', 'completed'].indexOf(booking.status);
                                
                                return (
                                    <div key={s.id} className="flex flex-col items-center gap-3 relative z-10 flex-1">
                                        <div className={`w-10 h-10 rounded-none border-4 border-black flex items-center justify-center transition-all ${
                                            isActive ? 'bg-[#FACC15] scale-110 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 
                                            isPast ? 'bg-[#006064] text-white' : 'bg-white text-slate-300'
                                        }`}>
                                            <s.icon size={20} strokeWidth={3} />
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest italic ${isActive ? 'text-black' : 'text-slate-400'}`}>
                                            {s.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Safety & Sharing Panel (STREET STYLE) */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-black text-white p-8 border-4 border-black shadow-[10px_10px_0px_0px_#006064] relative overflow-hidden group">
                           <div className="absolute top-0 right-0 bg-[#006064] text-white text-[8px] font-black px-4 py-1 uppercase italic tracking-widest border-b-2 border-l-2 border-black">LIVE HUB</div>
                           <h4 className="text-xl font-black uppercase italic tracking-tighter mb-6 flex items-center gap-3">
                               <ShieldCheck className="text-[#FACC15]" size={24} />
                               SAFETY CENTER
                           </h4>
                           <div className="grid grid-cols-2 gap-4">
                               <button 
                                   onClick={() => {
                                       if(navigator.share) {
                                           navigator.share({
                                               title: 'Track My Airport Taxi',
                                               text: `I'm on my way! Track my ride here:`,
                                               url: window.location.href
                                           });
                                       } else {
                                           navigator.clipboard.writeText(window.location.href);
                                           alert('Tracking link copied to clipboard!');
                                       }
                                   }}
                                   className="flex flex-col items-center justify-center gap-3 bg-white/10 hover:bg-[#FACC15] hover:text-black p-4 border-2 border-white/20 hover:border-black transition-all group/btn"
                               >
                                   <Zap size={24} className="text-[#FACC15] group-hover/btn:text-black" />
                                   <span className="text-[10px] font-black uppercase tracking-widest">Share Trip</span>
                               </button>
                               <button 
                                   onClick={() => {
                                       if(confirm("EMERGENCY SOS: Do you need to contact local emergency services?")) {
                                           window.location.href = "tel:119";
                                       }
                                   }}
                                   className="flex flex-col items-center justify-center gap-3 bg-red-600/20 hover:bg-red-600 p-4 border-2 border-red-600/30 hover:border-black transition-all group/sos"
                               >
                                   <AlertCircle size={24} className="text-red-500 group-hover/sos:text-white animate-pulse" />
                                   <span className="text-[10px] font-black uppercase tracking-widest text-red-500 group-hover/sos:text-white">SOS / Help</span>
                               </button>
                           </div>
                           <p className="mt-6 text-[8px] font-bold text-white/40 uppercase tracking-[0.2em] italic">Encrypted Connection Ref: {booking._id.slice(-8)}</p>
                        </div>

                        <div className="bg-[#FACC15] p-8 border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                           <div className="absolute top-0 right-0 bg-black text-[#FACC15] text-[8px] font-black px-4 py-1 uppercase italic tracking-widest border-b-4 border-l-4 border-black">HOSPITALITY</div>
                           <h4 className="text-xl font-black uppercase italic tracking-tighter mb-6 flex items-center gap-3 text-black">
                               <Info className="text-black" size={24} />
                               TRIP SUPPORT
                           </h4>
                           <div className="space-y-4">
                               <a href="tel:+94716885880" className="flex items-center justify-between bg-black text-white p-4 border-2 border-black hover:translate-y-[-2px] transition-all">
                                   <div className="flex items-center gap-3">
                                       <Phone size={18} className="text-[#FACC15]" />
                                       <span className="text-[10px] font-black uppercase tracking-widest">24/7 Agent</span>
                                   </div>
                                   <ArrowRight size={16} />
                               </a>
                               <a href="https://wa.me/94716885880" target="_blank" className="flex items-center justify-between bg-white text-black p-4 border-2 border-black hover:translate-y-[-2px] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                   <div className="flex items-center gap-3">
                                       <MessageSquare size={18} className="text-emerald-500" />
                                       <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp Support</span>
                                   </div>
                                   <ArrowRight size={16} />
                               </a>
                           </div>
                        </div>
                    </div>

                    {/* Driver Profile Section (Boxy Style) */}
                    {booking.driver && (
                        <div className="bg-white border-4 border-black rounded-none p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group hover:translate-y-[-4px] transition-all">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FACC15]/10 rounded-none -mr-16 -mt-16 group-hover:bg-[#FACC15]/20 transition-all rotate-45"></div>
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="w-20 h-20 bg-[#006064] rounded-none border-4 border-black flex items-center justify-center text-white font-black text-4xl shadow-[6px_6px_0px_0px_#FACC15] italic">
                                    {booking.driver.name?.[0].toUpperCase()}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white bg-black px-3 py-1 rounded-none italic">Verified Chauffeur</p>
                                        <div className="flex items-center gap-1 text-[#006064]">
                                            <Star size={12} fill="currentColor" strokeWidth={3} />
                                            <span className="text-[12px] font-black italic">{booking.driver.ratings || 5.0}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-black text-black leading-none uppercase italic tracking-tighter">{booking.driver.name}</h3>
                                    <div className="flex items-center gap-4 text-[10px] text-slate-400 font-black uppercase tracking-widest italic">
                                        <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-[#00A99D]" strokeWidth={3} /> {booking.driver.totalRides || 0}+ Trips</span>
                                        <div className="w-1.5 h-1.5 bg-black rounded-none"></div>
                                        <span>English Speaking</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center md:items-end gap-4 relative z-10 w-full md:w-auto border-t-4 border-slate-100 md:border-t-0 pt-6 md:pt-0 mt-2 md:mt-0">
                                <div className="flex flex-col items-center md:items-end">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 italic">VEHICLE PLATE</p>
                                    <div className="bg-black text-white px-6 py-3 rounded-none font-mono font-black tracking-tight text-2xl shadow-[8px_8px_0px_0px_#006064] border-2 border-white/10 uppercase italic">
                                        {booking.driver.vehicleNumber}
                                    </div>
                                </div>
                                <div className="flex gap-4 w-full">
                                    <a href={`tel:${booking.driver.phone}`} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-100 text-black p-4 rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all">
                                        <Phone size={20} strokeWidth={3} />
                                    </a>
                                    <a href={`https://wa.me/${booking.driver.phone.replace(/[^0-9]/g, '')}`} target="_blank" className="flex-[3] md:flex-none flex items-center justify-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-none border-4 border-black font-black uppercase italic text-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] transition-all tracking-widest">
                                        <MessageSquare size={18} strokeWidth={3} />
                                        WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Live Tracking Map */}
                    <div className="border-8 border-black shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                        <TrackingMap
                            pickup={booking.pickupLocation}
                            dropoff={booking.dropoffLocation}
                            driverId={booking.driver?.toString()}
                        />
                    </div>

                    {/* Details Grid */}
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic mb-4">JOURNEY DETAILS</h3>
                            <div className="flex items-start gap-5 bg-slate-50 p-6 border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)]">
                                <div className="flex flex-col items-center gap-1 mt-1">
                                    <div className="w-3 h-3 bg-[#00A99D] border-2 border-black" />
                                    <div className="w-1.5 h-12 bg-slate-200" />
                                    <div className="w-3 h-3 bg-rose-500 border-2 border-black" />
                                </div>
                                <div className="space-y-8 flex-1">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">PICKUP</p>
                                        <p className="font-black text-black text-sm uppercase italic leading-tight">{booking.pickupLocation?.address || 'N/A'}</p>
                                    </div>
                                    {booking.waypoints?.length > 0 && booking.waypoints.map((wp, idx) => (
                                        <div key={idx} className="relative">
                                            <div className="absolute -left-7 top-1 w-3 h-3 bg-white border-2 border-slate-300"></div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">STOP {idx + 1}</p>
                                            <p className="font-black text-black text-sm uppercase italic leading-tight">{wp.address}</p>
                                        </div>
                                    ))}
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">DROPOFF</p>
                                        <p className="font-black text-black text-sm uppercase italic leading-tight">{booking.dropoffLocation?.address || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic mb-4">SCHEDULE & VEHICLE</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 border-b-4 border-slate-50 pb-4">
                                    <div className="w-10 h-10 bg-[#FACC15] border-2 border-black flex items-center justify-center text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"><Calendar size={20} strokeWidth={3} /></div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">DATE</p>
                                        <p className="font-black text-black text-lg italic tracking-tighter leading-none">{new Date(booking.scheduledDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 border-b-4 border-slate-50 pb-4">
                                    <div className="w-10 h-10 bg-black text-[#FACC15] border-2 border-[#FACC15] flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"><Clock size={20} strokeWidth={3} /></div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">TIME</p>
                                        <p className="font-black text-black text-lg italic tracking-tighter leading-none">{booking.scheduledTime}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 border-b-4 border-slate-50 pb-4">
                                    <div className="w-10 h-10 bg-[#006064] text-white border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"><Car size={20} strokeWidth={3} /></div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">VEHICLE</p>
                                        <p className="font-black text-black text-lg italic tracking-tighter leading-none uppercase">{booking.vehicleType?.replace('-', ' ') || 'Any'}</p>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="bg-black rounded-none p-10 text-white flex flex-col md:flex-row justify-between items-center border-4 border-black shadow-[15px_15px_0px_0px_#006064] gap-6">
                        <div className="text-center md:text-left">
                            <p className="text-[#FACC15] font-black text-[10px] uppercase tracking-[0.4em] italic mb-2">TOTAL AMOUNT DUE</p>
                            <p className="text-white/40 font-black uppercase text-[8px] tracking-[0.2em]">{booking.paymentMethod === 'card' ? 'PREPAID ONLINE' : 'PAY TO DRIVER ON ARRIVAL'}</p>
                        </div>
                        <div className="flex items-baseline gap-4">
                            <span className="text-xl font-black text-white/40 italic uppercase tracking-widest">{booking.currency || 'LKR'}</span>
                            <span className="text-5xl md:text-7xl font-black italic tracking-tighter text-[#FACC15]">
                                {(booking.currency && booking.currency !== 'LKR' && booking.displayPrice) ? booking.displayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : booking.totalPrice?.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Rating System (Visible when Completed) */}
                    {booking.status === 'completed' && (
                        <div className="mt-8">
                            <RatingSystem 
                                bookingId={booking._id} 
                                initialRating={booking.rating} 
                                initialReview={booking.review} 
                            />
                        </div>
                    )}

                    {/* Action Buttons (PDF, Email, Ticket) */}
                    <BookingActions booking={booking} />

                    <div className="text-center pt-8 border-t-8 border-slate-50">
                        <Link href="/" className="inline-flex items-center justify-center w-full md:w-auto gap-3 bg-black text-white px-10 py-5 rounded-none font-black text-xs uppercase italic tracking-widest transition-all hover:translate-y-[-2px] group border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <ArrowRight size={16} className="rotate-180 group-hover:translate-x-[-4px] transition-transform" />
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
