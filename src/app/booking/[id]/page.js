import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import User from '@/models/User'; // Ensure User is registered
import Driver from '@/models/Driver'; // Ensure Driver is registered
import { notFound } from 'next/navigation';
import { CheckCircle, MapPin, Calendar, Clock, Car, Star, Phone, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import BookingActions from '@/components/BookingActions';
import TrackingMap from '@/components/TrackingMap';

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
        <div className="min-h-screen bg-[#121212] pt-32 pb-20 px-4">
            <div className="max-w-3xl mx-auto bg-[#1a1a1a] rounded-none shadow-2xl overflow-hidden border-4 border-[#FFDA00]">
                <div className="bg-[#22C55E] p-8 text-center text-black relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 pattern-grid-lg opacity-20"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 rounded-none flex items-center justify-center mx-auto mb-4 backdrop-blur-sm animate-bounce-slow border-2 border-black">
                            <CheckCircle size={32} className="text-black" />
                        </div>
                        <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Booking Confirmed!</h1>
                        <p className="text-black/70 font-bold text-sm">Reference ID: <span className="font-mono bg-black/10 px-2 py-1 rounded-none select-all">{booking._id}</span></p>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Status Banner */}
                    {/* Status Banner */}
                    {!booking.driver ? (
                        <div className="bg-zinc-900 border border-yellow-500/30 rounded-none p-4 flex gap-3 items-start">
                            <div className="w-5 h-5 bg-yellow-500/20 rounded-none flex items-center justify-center shrink-0 mt-0.5"><div className="w-2 h-2 bg-yellow-500 rounded-none"></div></div>
                            <div>
                                <p className="text-yellow-500 font-bold text-sm uppercase tracking-wider">Processing Your Request</p>
                                <p className="text-white/60 text-xs mt-1">We have received your booking. A professional driver will be assigned shortly. You'll receive a WhatsApp notification once assigned.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-zinc-900 border border-[#22C55E]/30 rounded-none p-4 flex gap-3 items-start">
                            <div className="w-5 h-5 bg-[#22C55E]/20 rounded-none flex items-center justify-center shrink-0 mt-0.5"><div className="w-2 h-2 bg-[#22C55E] rounded-none"></div></div>
                            <div>
                                <p className="text-[#22C55E] font-bold text-sm uppercase tracking-wider">Driver Assigned & Ready</p>
                                <p className="text-white/60 text-xs mt-1">Your journey is confirmed. {booking.driver.name} has been assigned to your trip.</p>
                            </div>
                        </div>
                    )}

                    {/* Driver Profile Section (Premium Look) */}
                    {booking.driver && (
                        <div className="bg-zinc-900 border border-white/5 rounded-none p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden group hover:border-yellow-500/30 transition-all">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E]/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                            <div className="flex items-center gap-5 relative z-10">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#22C55E] to-slate-700 rounded-none flex items-center justify-center text-black font-black text-2xl shadow-lg border-2 border-white">
                                    {booking.driver.name?.[0]}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-none">Verified Chauffeur</p>
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <Star size={10} fill="currentColor" />
                                            <span className="text-[10px] font-bold">{booking.driver.ratings || 5.0}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black text-white leading-tight">{booking.driver.name}</h3>
                                    <div className="flex items-center gap-3 text-xs text-white/40 font-bold">
                                        <span className="flex items-center gap-1"><CheckCircle size={12} className="text-[#22C55E]" /> {booking.driver.totalRides || 0}+ Trips</span>
                                        <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                                        <span>English Speaking</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center md:items-end gap-3 relative z-10 w-full md:w-auto border-t border-white/5 md:border-t-0 pt-4 md:pt-0 mt-4 md:mt-0">
                                <div className="flex flex-col items-center md:items-end">
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Vehicle Plate</p>
                                    <div className="bg-black text-white px-4 py-2 rounded-none font-mono font-bold tracking-tighter text-lg shadow-xl shadow-black/20 border border-white/10">
                                        {booking.driver.vehicleNumber}
                                    </div>
                                </div>
                                <div className="flex gap-2 w-full">
                                    <a href={`tel:${booking.driver.phone}`} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 text-white p-3 rounded-none border border-white/10 font-bold text-sm hover:bg-white/10 transition-all">
                                        <Phone size={16} />
                                    </a>
                                    <a href={`https://wa.me/${booking.driver.phone.replace(/[^0-9]/g, '')}`} target="_blank" className="flex-[3] md:flex-none flex items-center justify-center gap-2 bg-[#22C55E] text-black px-6 py-3 rounded-none font-black text-sm hover:bg-white transition-all shadow-lg shadow-[#22C55E]/10">
                                        <MessageSquare size={16} />
                                        WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Live Tracking Map */}
                    <TrackingMap
                        pickup={booking.pickupLocation}
                        dropoff={booking.dropoffLocation}
                        driverId={booking.driver?.toString()}
                    />

                    {/* Details Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-[#FFDA00] uppercase tracking-widest pl-1">Journey Details</h3>
                            <div className="flex items-start gap-3 bg-white/5 p-4 rounded-none border border-white/5">
                                <div className="flex flex-col items-center gap-1 mt-1">
                                    <div className="w-2 h-2 rounded-none bg-[#22C55E]"></div>
                                    <div className="w-0.5 h-8 bg-white/10"></div>
                                    <div className="w-2 h-2 rounded-none bg-red-500"></div>
                                </div>
                                <div className="space-y-4 flex-1">
                                    <div>
                                        <p className="text-[10px] font-bold text-white/40 uppercase">Pickup Location</p>
                                        <p className="font-bold text-white text-sm leading-tight">{booking.pickupLocation?.address || 'N/A'}</p>
                                    </div>
                                    {booking.waypoints?.length > 0 && booking.waypoints.map((wp, idx) => (
                                        <div key={idx} className="relative">
                                            <div className="absolute -left-5 top-1 w-1.5 h-1.5 rounded-none border border-white/20 bg-black"></div>
                                            <p className="text-[10px] font-bold text-white/40 uppercase">Stop {idx + 1}</p>
                                            <p className="font-bold text-white text-sm leading-tight">{wp.address}</p>
                                        </div>
                                    ))}
                                    <div>
                                        <p className="text-[10px] font-bold text-white/40 uppercase">Dropoff Destination</p>
                                        <p className="font-bold text-white text-sm leading-tight">{booking.dropoffLocation?.address || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-[#FFDA00] uppercase tracking-widest pl-1">Schedule & Vehicle</h3>
                            <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                                <div className="w-8 h-8 rounded-none bg-orange-500/10 flex items-center justify-center text-orange-500"><Calendar size={16} /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-white/40 uppercase">Trip Date</p>
                                    <p className="font-bold text-white text-sm">{new Date(booking.scheduledDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                                <div className="w-8 h-8 rounded-none bg-blue-500/10 flex items-center justify-center text-blue-500"><Clock size={16} /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-white/40 uppercase">Pickup Time</p>
                                    <p className="font-bold text-white text-sm">{booking.scheduledTime}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                                <div className="w-8 h-8 rounded-none bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E]"><Car size={16} /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-white/40 uppercase">Selected Vehicle</p>
                                    <p className="font-bold text-white text-sm uppercase">{booking.vehicleType?.replace('-', ' ') || 'ANY VEHICLE'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="bg-black border border-white/5 rounded-none p-6 text-white flex justify-between items-center shadow-lg">
                        <div>
                            <p className="text-[#22C55E] font-black text-xs uppercase tracking-widest mb-1">Final Total Payable</p>
                            <p className="text-xs text-white/40 font-bold">{booking.paymentMethod === 'card' ? 'Online Transaction Verified' : 'Pay Directly to Chauffeur'}</p>
                        </div>
                        <p className="text-3xl font-black text-white">
                            <span className="text-[#FFDA00] mr-2">{booking.currency || 'LKR'}</span>
                            {(booking.currency && booking.currency !== 'LKR' && booking.displayPrice) ? booking.displayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : booking.totalPrice?.toLocaleString()}
                        </p>
                    </div>

                    {/* Action Buttons (PDF, Email, Ticket) */}
                    <BookingActions booking={booking} />

                    <div className="text-center pt-6 border-t border-white/5">
                        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#22C55E] font-black text-xs uppercase tracking-widest transition-all group">
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
