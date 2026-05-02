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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-32 pb-12 px-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 -mr-48 -mt-48 blur-3xl rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 -ml-48 -mb-48 blur-3xl rounded-full pointer-events-none"></div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 max-w-lg w-full p-8 md:p-12 text-center animate-slide-up relative z-10 border border-slate-100">
                <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/20 transform -rotate-3 hover:rotate-0 transition-all duration-500 relative group">
                    <CheckCircle className="text-white group-hover:scale-110 transition-transform" size={48} strokeWidth={3} />
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
                    {isCash ? 'Booking Secured!' : 'Payment Complete!'}
                </h1>

                <p className="text-slate-500 mb-8 font-medium text-sm leading-relaxed max-w-sm mx-auto">
                    {isCash
                        ? 'Your taxi is scheduled. Pay directly to the driver at the end of your trip.'
                        : 'Transaction processed! Your confirmation will arrive via WhatsApp shortly.'}
                </p>
                
                {/* Details Section */}
                {booking && (
                    <div className="mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 text-left flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Route</p>
                            <p className="text-sm font-semibold text-slate-900 leading-tight">
                                {typeof booking.pickup === 'object' ? booking.pickup?.name : booking.pickup} 
                                <span className="mx-2 text-slate-300">➔</span>
                                {typeof booking.dropoff === 'object' ? booking.dropoff?.name : booking.dropoff}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200/50">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                                <p className="text-sm font-semibold text-slate-900">
                                    {booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleDateString() : 'TBD'} 
                                    {booking.scheduledTime ? ` at ${booking.scheduledTime}` : ''}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Fare</p>
                                <p className="text-sm font-semibold text-emerald-600">{booking.currency || 'Rs'} {booking.totalPrice?.toLocaleString() || booking.displayBalanceAmount?.toLocaleString() || '--'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {isCash && (
                    <div className="mb-8 p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-start gap-4 text-left relative overflow-hidden group">
                        <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[8px] font-bold px-3 py-1 rounded-bl-xl tracking-widest">REQUIRED</div>
                        <div className="bg-white p-2 rounded-xl shadow-sm text-emerald-600 shrink-0">
                            <Info size={20} strokeWidth={3} />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-widest mb-0.5">Cash Payment Only</p>
                            <p className="text-[12px] text-emerald-800/80 font-medium leading-tight">Please have cash ready for the driver. We accept LKR, USD, or EUR.</p>
                        </div>
                    </div>
                )}

                {!isCash && (
                    <div className="mb-8 p-6 bg-slate-900 rounded-3xl flex items-start gap-4 text-left">
                        <div className="bg-white/10 p-2 rounded-xl text-emerald-400 shrink-0">
                            <Info size={20} strokeWidth={3} />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-0.5">Important Notice</p>
                            <p className="text-[12px] text-slate-300 font-medium leading-tight">
                                Highway ticket is NOT included. Customer must pay at the counter.
                            </p>
                        </div>
                    </div>
                )}

                {!isCash && booking?.displayBalanceAmount > 0 && (
                    <div className="mb-8 p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4 text-left">
                        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                            <span className="text-white font-bold text-xl">!</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-0.5">Balance Due Today</p>
                            <p className="text-xl font-bold text-amber-900 leading-none">
                                {booking.currency === 'GBP' ? '£' :
                                    booking.currency === 'USD' ? '$' :
                                        booking.currency === 'EUR' ? '€' :
                                            booking.currency === 'INR' ? '₹' : 'Rs'} {booking.displayBalanceAmount.toLocaleString()}
                            </p>
                        </div>
                    </div>
                )}

                <div className="bg-slate-50 rounded-3xl p-5 mb-8 grid grid-cols-2 gap-4 border border-slate-100">
                    <div className="px-2 border-r border-slate-200">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Booking Ref</div>
                        <div className="text-lg font-bold text-slate-900 truncate">#{bookingId ? bookingId.slice(-8).toUpperCase() : 'PENDING'}</div>
                    </div>
                    {searchParams.get('txnId') && (
                        <div className="px-2">
                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Txn Ref</div>
                            <div className="text-xs font-bold text-slate-900 truncate">#{searchParams.get('txnId')}</div>
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold transition-all hover:bg-slate-800 shadow-xl shadow-slate-900/10"
                    >
                        <Home size={18} />
                        Back to Home
                    </Link>

                    {bookingId && (
                        <Link
                            href={`/booking/${bookingId}`}
                            className="flex items-center justify-center gap-2 w-full bg-white text-slate-900 py-4 rounded-2xl border border-slate-200 font-bold hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <FileText size={18} />
                            Track My Ride
                        </Link>
                    )}
                </div>

                <p className="text-[10px] font-medium text-slate-400 mt-10 uppercase tracking-[0.2em]">
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
