'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Home, FileText, Loader2, Info } from 'lucide-react';

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('bookingId');
    const [booking, setBooking] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (bookingId) {
            fetch(`/api/bookings/${bookingId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setBooking(data.booking);
                    }
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching booking:", err);
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [bookingId]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
                <Loader2 className="animate-spin text-emerald-600" size={40} />
            </div>
        );
    }

    const isCash = booking?.paymentMethod === 'cash';

    return (
        <div className="min-h-screen bg-white flex items-center justify-center pt-32 pb-12 px-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FACC15]/20 -mr-32 -mt-32 blur-3xl rounded-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 -ml-32 -mb-32 blur-2xl rounded-none"></div>

            <div className="bg-white rounded-none border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-lg w-full p-8 md:p-12 text-center animate-slide-up relative z-10">
                <div className="w-24 h-24 bg-[#FACC15] rounded-none border-4 border-black flex items-center justify-center mx-auto mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-3 hover:rotate-0 transition-transform">
                    <CheckCircle className="text-black" size={56} strokeWidth={3} />
                </div>

                <h1 className="text-3xl font-black text-black mb-3 uppercase italic tracking-tighter leading-none">
                    {isCash ? 'Booking Secured!' : 'Payment Complete!'}
                </h1>

                <p className="text-black/60 mb-8 font-black uppercase tracking-widest text-[10px] italic leading-relaxed">
                    {isCash
                        ? 'Your taxi is scheduled. Pay directly to the driver at the end of your trip.'
                        : 'Transaction processed! Your confirmation will arrive via WhatsApp shortly.'}
                </p>
                
                {/* Details Section directly queried from booking object to show something to User */}
                {booking && (
                    <div className="mb-8 p-5 bg-slate-50 border-4 border-black rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left flex flex-col gap-4">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Route</p>
                            <p className="text-sm font-bold text-black uppercase">
                                {typeof booking.pickup === 'object' ? booking.pickup?.name : booking.pickup} ➔ {typeof booking.dropoff === 'object' ? booking.dropoff?.name : booking.dropoff}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Date</p>
                                <p className="text-sm font-bold text-black uppercase">
                                    {booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleDateString() : 'TBD'} 
                                    {booking.scheduledTime ? ` at ${booking.scheduledTime}` : ''}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Total Fare</p>
                                <p className="text-sm font-bold text-black uppercase">{booking.currency || 'Rs'} {booking.totalPrice?.toLocaleString() || booking.displayBalanceAmount?.toLocaleString() || '--'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {isCash && (
                    <div className="mb-8 p-5 bg-[#FACC15] rounded-none border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-start gap-4 text-left relative overflow-hidden group">
                        <div className="absolute top-0 right-0 bg-black text-[#FACC15] text-[7px] font-black px-2 py-1 uppercase tracking-widest italic border-l-2 border-b-2 border-black">REQUIRED</div>
                        <Info className="text-black shrink-0 mt-1" size={24} strokeWidth={3} />
                        <div>
                            <p className="text-[11px] font-black text-black uppercase tracking-widest mb-1 italic">Cash Payment Only</p>
                            <p className="text-[12px] text-black font-bold leading-tight uppercase">Please have cash ready for the driver. We accept LKR, USD, or EUR.</p>
                        </div>
                    </div>
                )}

                {!isCash && (
                    <div className="mb-8 p-5 bg-black border-4 border-black rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-start gap-4 text-left">
                        <Info className="text-[#FACC15] shrink-0 mt-1" size={24} strokeWidth={3} />
                        <div>
                            <p className="text-[11px] font-black text-[#FACC15] uppercase tracking-widest mb-1 italic">Important Notice</p>
                            <p className="text-[12px] text-white font-bold leading-tight uppercase tracking-tighter">
                                Highway ticket is NOT included. Customer must pay at the counter.
                            </p>
                        </div>
                    </div>
                )}

                {!isCash && booking?.displayBalanceAmount > 0 && (
                    <div className="mb-8 p-5 bg-red-600 border-4 border-black rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-start gap-4 text-left animate-pulse">
                        <div className="w-12 h-12 bg-white rounded-none border-2 border-black flex items-center justify-center shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <span className="text-red-600 font-black text-2xl italic">!</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1 italic">Balance Due Today</p>
                            <p className="text-2xl font-black text-white italic tracking-tighter leading-none">
                                {booking.currency === 'GBP' ? '£' :
                                    booking.currency === 'USD' ? '$' :
                                        booking.currency === 'EUR' ? '€' :
                                            booking.currency === 'INR' ? '₹' : 'Rs'} {booking.displayBalanceAmount.toLocaleString()}
                            </p>
                        </div>
                    </div>
                )}

                <div className="bg-slate-50 border-4 border-black rounded-none p-5 mb-8 grid grid-cols-2 gap-4 divide-x-4 divide-black text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="px-2">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Booking Ref</div>
                        <div className="text-xl font-black text-black italic tracking-tighter truncate">#{bookingId ? bookingId.slice(-8).toUpperCase() : 'PENDING'}</div>
                    </div>
                    {searchParams.get('txnId') && (
                        <div className="px-2">
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Txn Ref</div>
                            <div className="text-sm font-black text-black tracking-tighter leading-tight truncate">#{searchParams.get('txnId')}</div>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-3 w-full bg-black text-[#FACC15] py-5 rounded-none border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-black uppercase italic tracking-[0.2em] transform transition-all hover:translate-y-[-4px] active:translate-y-0 text-xs"
                    >
                        <Home size={20} strokeWidth={3} />
                        Back to Home
                    </Link>

                    {bookingId && (
                        <Link
                            href={`/booking/${bookingId}`}
                            className="flex items-center justify-center gap-3 w-full bg-white text-black py-4 rounded-none border-4 border-black font-black uppercase italic tracking-[0.15em] hover:bg-slate-50 transition-all text-[10px]"
                        >
                            <FileText size={18} strokeWidth={3} />
                            Track My Ride
                        </Link>
                    )}
                </div>

                <p className="text-[9px] font-black text-slate-400 mt-10 uppercase tracking-widest italic">
                    Need Help? Call +94 71 688 5880
                </p>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
            <Loader2 className="animate-spin text-emerald-600" size={40} />
        </div>}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
