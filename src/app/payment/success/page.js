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
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <Loader2 className="animate-spin text-slate-600" size={40} />
            </div>
        );
    }

    const isCash = booking?.paymentMethod === 'cash';

    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center pt-32 pb-12 px-4">
            <div className="bg-[#1a1a1a] rounded-none shadow-2xl max-w-md w-full p-8 text-center animate-slide-up border-4 border-[#FFDA00]">
                <div className="w-20 h-20 bg-[#22C55E]/10 rounded-none flex items-center justify-center mx-auto mb-6 border-2 border-[#22C55E]">
                    <CheckCircle className="text-[#22C55E]" size={48} />
                </div>

                <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                    {isCash ? 'Booking Confirmed!' : 'Payment Successful!'}
                </h1>

                <p className="text-white/60 mb-6 font-bold text-sm leading-relaxed">
                    {isCash
                        ? 'Your taxi is scheduled. You can pay the total amount directly to the driver at the end of your trip.'
                        : 'Transaction was processed successfully. We\'ll send you a confirmation via WhatsApp shortly.'}
                </p>

                {isCash && (
                    <div className="mb-6 p-4 bg-yellow-500/5 rounded-none border border-yellow-500/20 flex items-start gap-3 text-left">
                        <Info className="text-yellow-500 shrink-0" size={20} />
                        <div>
                            <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-1">Cash Payment Required</p>
                            <p className="text-[11px] text-white/60 leading-relaxed font-bold">Please ensure you have the cash ready for the driver. Our chauffeurs take local currency (LKR) or major currencies like USD/EUR.</p>
                        </div>
                    </div>
                )}

                {!isCash && (
                    <div className="mb-6 p-4 bg-[#22C55E]/5 rounded-none border border-[#22C55E]/20 flex items-start gap-3 text-left">
                        <Info className="text-[#22C55E] shrink-0" size={20} />
                        <div>
                            <p className="text-[10px] font-black text-[#22C55E] uppercase tracking-widest mb-1">Important Notice</p>
                            <p className="text-[11px] text-white/60 leading-relaxed font-bold">
                                Highway ticket is not included in this price. It means the customer must pay it at the counter.
                            </p>
                        </div>
                    </div>
                )}

                {!isCash && booking?.displayBalanceAmount > 0 && (
                    <div className="mb-6 p-4 bg-red-500/5 rounded-none border border-red-500/20 flex items-start gap-3 text-left">
                        <div className="w-10 h-10 bg-red-500/10 rounded-none flex items-center justify-center shrink-0 border border-red-500/20">
                            <span className="text-red-500 font-black">!</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Balance Due to Driver</p>
                            <p className="text-2xl font-black text-white leading-none">
                                <span className="text-red-500 mr-1">{booking.currency === 'GBP' ? '£' :
                                    booking.currency === 'USD' ? '$' :
                                        booking.currency === 'EUR' ? '€' :
                                            booking.currency === 'INR' ? '₹' : 'Rs'}</span>
                                {booking.displayBalanceAmount.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-white/40 mt-1 font-bold italic">Pay this to the driver at the end of your journey.</p>
                        </div>
                    </div>
                )}

                <div className="bg-black border border-white/5 rounded-none p-4 mb-6 grid grid-cols-2 gap-4 divide-x divide-white/5 text-center">
                    <div className="px-2">
                        <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Booking Ref</div>
                        <div className="text-base font-black text-[#FFDA00] break-all">#{bookingId?.slice(-8).toUpperCase()}</div>
                    </div>
                    {searchParams.get('txnId') && (
                        <div className="px-2">
                            <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Payment Ref</div>
                            <div className="text-sm font-black text-white break-all leading-tight">#{searchParams.get('txnId')}</div>
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 w-full bg-[#22C55E] text-black py-4 rounded-none font-black text-sm uppercase tracking-widest hover:bg-white transition-all shadow-lg active:scale-[0.98]"
                    >
                        <Home size={18} />
                        Return to Home
                    </Link>

                    <Link
                        href={`/booking/${bookingId}`}
                        className="flex items-center justify-center gap-2 w-full border border-white/10 text-white py-4 rounded-none font-black text-sm uppercase tracking-widest hover:bg-white/5 transition-all"
                    >
                        <FileText size={18} />
                        Full Trip Receipt
                    </Link>
                </div>

                <p className="text-[10px] text-white/20 mt-8 font-black uppercase tracking-widest">
                    Support: +94 71 688 5880
                </p>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Loader2 className="animate-spin text-slate-600" size={40} />
        </div>}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
