'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle, Home, FileText, Loader2 } from 'lucide-react';

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('bookingId');

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center pt-32 pb-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-green-500" size={48} />
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2" id="payment-success-title">Payment Successful!</h1>
                <p className="text-gray-600 mb-6">
                    Your booking has been confirmed. We'll send you a confirmation via WhatsApp shortly.
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="text-sm text-gray-500">Booking Reference</div>
                    <div className="text-xl font-bold text-emerald-900">#{bookingId?.slice(-8).toUpperCase()}</div>
                </div>

                <div className="space-y-3">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 w-full bg-emerald-900 text-white py-3 rounded-lg font-bold hover:bg-emerald-900/90 transition-colors"
                    >
                        <Home size={20} />
                        Back to Home
                    </Link>

                    <Link
                        href={`/booking/${bookingId}`}
                        className="flex items-center justify-center gap-2 w-full border border-emerald-900 text-emerald-900 py-3 rounded-lg font-bold hover:bg-emerald-900/5 transition-colors"
                    >
                        <FileText size={20} />
                        View Booking Details
                    </Link>
                </div>

                <p className="text-xs text-gray-400 mt-6">
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
