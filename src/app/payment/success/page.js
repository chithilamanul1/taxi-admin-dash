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
            <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
                <Loader2 className="animate-spin text-emerald-600" size={40} />
            </div>
        );
    }

    const isCash = booking?.paymentMethod === 'cash';

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center pt-32 pb-12 px-4">
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

                <div className="bg-gray-50 rounded-lg p-4 mb-6 grid grid-cols-2 gap-4 divide-x divide-gray-200 text-center">
                    <div className="px-2">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Booking Ref</div>
                        <div className="text-base font-black text-emerald-900 break-all">#{bookingId?.slice(-8).toUpperCase()}</div>
                    </div>
                    {searchParams.get('txnId') && (
                        <div className="px-2">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Transaction Ref</div>
                            <div className="text-sm font-black text-emerald-900 break-all leading-tight">#{searchParams.get('txnId')}</div>
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 w-full bg-emerald-900 text-white py-4 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg active:scale-[0.98]"
                    >
                        <Home size={20} />
                        Back to Home
                    </Link>

                    <Link
                        href={`/booking/${bookingId}`}
                        className="flex items-center justify-center gap-2 w-full border-2 border-emerald-900/10 text-emerald-900 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-all"
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
        <Suspense fallback={<div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
            <Loader2 className="animate-spin text-emerald-600" size={40} />
        </div>}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
