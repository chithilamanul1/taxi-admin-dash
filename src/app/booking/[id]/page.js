import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { notFound } from 'next/navigation';
import { CheckCircle, MapPin, Calendar, Clock, Car } from 'lucide-react';
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
        booking = await Booking.findById(id).lean(); // Use lean for POJO
        // Convert _id and dates to string if needed manually? 
        // lean() keeps _id as ObjectId usually. Next.js Client Component props require plain types.
        // We might need to serialize.
        if (booking) {
            booking._id = booking._id.toString();
            if (booking.customer) booking.customer = booking.customer.toString();
            if (booking.driver) booking.driver = booking.driver.toString();
            // Dates are Date objects. Client components can handle Date? No, warning.
            // Helper to serialize:
            booking = JSON.parse(JSON.stringify(booking));
        }
    } catch (e) {
        notFound();
    }

    if (!booking) notFound();

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-900/5">
                <div className="bg-emerald-600 p-8 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-emerald-900/10 pattern-grid-lg opacity-20"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm animate-bounce-slow">
                            <CheckCircle size={32} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Booking Confirmed!</h1>
                        <p className="text-emerald-100 font-medium text-sm">Reference ID: <span className="font-mono bg-white/10 px-2 py-1 rounded select-all">{booking._id}</span></p>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Status Banner */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5"><div className="w-2 h-2 bg-blue-500 rounded-full"></div></div>
                        <div>
                            <p className="text-blue-900 font-bold text-sm">Processing Request</p>
                            <p className="text-blue-700/80 text-xs mt-1">We have received your booking. Our team will assign a driver and contact you shortly via WhatsApp/Phone.</p>
                        </div>
                    </div>

                    {/* Live Tracking Map */}
                    <TrackingMap
                        pickup={booking.pickupLocation}
                        dropoff={booking.dropoffLocation}
                        driverId={booking.driver?.toString()}
                    />

                    {/* Details Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Journey Details</h3>
                            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl">
                                <div className="flex flex-col items-center gap-1 mt-1">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <div className="w-0.5 h-8 bg-gray-200"></div>
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                </div>
                                <div className="space-y-4 flex-1">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Pickup</p>
                                        <p className="font-bold text-gray-800 text-sm leading-tight">{booking.pickupLocation?.address || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Dropoff</p>
                                        <p className="font-bold text-gray-800 text-sm leading-tight">{booking.dropoffLocation?.address || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Schedule & Vehicle</h3>
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500"><Calendar size={16} /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Date</p>
                                    <p className="font-bold text-gray-800 text-sm">{new Date(booking.scheduledDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500"><Clock size={16} /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Time</p>
                                    <p className="font-bold text-gray-800 text-sm">{booking.scheduledTime}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500"><Car size={16} /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Vehicle</p>
                                    <p className="font-bold text-gray-800 text-sm uppercase">{booking.vehicleType?.replace('-', ' ') || 'Any'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="bg-slate-900 rounded-2xl p-6 text-white flex justify-between items-center shadow-lg">
                        <div>
                            <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1">Total Amount</p>
                            <p className="text-xs text-white/40">{booking.paymentMethod === 'card' ? 'Paid Online' : 'Pay to Driver'}</p>
                        </div>
                        <p className="text-3xl font-black">Rs {booking.totalPrice?.toLocaleString()}</p>
                    </div>

                    {/* Action Buttons (PDF, Email, Ticket) */}
                    <BookingActions booking={booking} />

                    <div className="text-center pt-4 border-t border-gray-100">
                        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-bold text-sm transition-colors group">
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
