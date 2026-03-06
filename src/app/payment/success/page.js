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
        }
    }, [bookingId]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
                <Loader2 className="animate-spin text-amber-600" size={40} />
            </div>
        );
    }

    const isCash = booking?.paymentMethod === 'cash';

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-100 flex items-center justify-center pt-32 pb-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center animate-slide-up">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-green-500" size={48} />
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    {isCash ? 'Booking Confirmed!' : 'Payment Successful!'}
                </h1>

                <p className="text-gray-600 mb-6 font-medium">
                    {isCash
                        ? 'Your taxi is scheduled. You can pay the total amount directly to the driver at the end of your trip.'
                        : 'Transaction was processed successfully. We\'ll send you a confirmation via WhatsApp shortly.'}
                </p>

                {isCash && (
                    <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3 text-left">
                        <Info className="text-amber-600 shrink-0" size={20} />
                        <div>
                            <p className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">Cash Payment Required</p>
                            <p className="text-[11px] text-amber-800 leading-relaxed font-medium">Please ensure you have the cash ready for the driver. Our chauffeurs take local currency (LKR) or major currencies like USD/EUR.</p>
                        </div>
                    </div>
                )}

                {!isCash && (
                    <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3 text-left">
                        <Info className="text-amber-600 shrink-0" size={20} />
                        <div>
                            <p className="text-xs font-bold text-slate-950 uppercase tracking-wider mb-1">Important Notice</p>
                            <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                                Highway ticket is not included in this price. It means the customer must pay it at the counter.
                            </p>
                        </div>
                    </div>
                )}

                {!isCash && booking?.displayBalanceAmount > 0 && (
                    <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200 flex items-start gap-3 text-left animate-pulse-subtle">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-red-600 font-black">!</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-red-900 uppercase tracking-wider mb-1">Balance Due to Driver</p>
                            <p className="text-lg font-black text-red-600 leading-none">
                                {booking.currency === 'GBP' ? '£' :
                                    booking.currency === 'USD' ? '$' :
                                        booking.currency === 'EUR' ? '€' :
                                            booking.currency === 'INR' ? '₹' : 'Rs'} {booking.displayBalanceAmount.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-red-800/60 mt-1 font-medium italic">Please pay this amount to the driver at the end of your journey.</p>
                        </div>
                    </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4 mb-6 grid grid-cols-2 gap-4 divide-x divide-gray-200 text-center">
                    <div className="px-2">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Booking Ref</div>
                        <div className="text-base font-black text-slate-950 break-all">#{bookingId?.slice(-8).toUpperCase()}</div>
                    </div>
                    {searchParams.get('txnId') && (
                        <div className="px-2">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Transaction Ref</div>
                            <div className="text-sm font-black text-slate-950 break-all leading-tight">#{searchParams.get('txnId')}</div>
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 w-full bg-slate-950 text-white py-4 rounded-xl font-bold hover:bg-amber-800 transition-all shadow-lg active:scale-[0.98]"
                    >
                        <Home size={20} />
                        Back to Home
                    </Link>

                    <Link
                        href={`/booking/${bookingId}`}
                        className="flex items-center justify-center gap-2 w-full border-2 border-slate-950/10 text-slate-950 py-4 rounded-xl font-bold hover:bg-amber-50 transition-all"
                    >
                        <FileText size={20} />
                        View Booking Details
                    </Link>
                </div>

                <p className="text-xs text-gray-400 mt-8 font-medium">
                    Questions? Contact us at +94 71 688 5880
                </p>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
            <Loader2 className="animate-spin text-amber-600" size={40} />
        </div>}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
