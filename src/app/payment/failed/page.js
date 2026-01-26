'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { XCircle, RefreshCw, Home, Phone, Loader2 } from 'lucide-react';

function PaymentFailedContent() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('bookingId');

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="text-red-500" size={48} />
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h1>
                <p className="text-gray-600 mb-6">
                    We couldn't process your payment. Don't worry - no charges were made to your card.
                </p>

                <div className="bg-red-50 rounded-lg p-4 mb-6 text-left">
                    <div className="text-sm font-medium text-red-800 mb-1">Common reasons:</div>
                    <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                        <li>Insufficient funds</li>
                        <li>Card declined by bank</li>
                        <li>Incorrect card details</li>
                        <li>Network timeout</li>
                    </ul>
                </div>

                <div className="space-y-3">
                    <Link
                        href={`/payment/mock?bookingId=${bookingId}&amount=0`}
                        className="flex items-center justify-center gap-2 w-full bg-emerald-600 text-emerald-900 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
                    >
                        <RefreshCw size={20} />
                        Try Again
                    </Link>

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                    >
                        <Home size={20} />
                        Back to Home
                    </Link>

                    <a
                        href="tel:+94716885880"
                        className="flex items-center justify-center gap-2 w-full text-emerald-900 py-3 rounded-lg font-bold hover:underline"
                    >
                        <Phone size={20} />
                        Call for Assistance
                    </a>
                </div>

                <p className="text-xs text-gray-400 mt-6">
                    Booking Reference: #{bookingId?.slice(-8).toUpperCase()}
                </p>
            </div>
        </div>
    );
}

export default function PaymentFailedPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
            <Loader2 className="animate-spin text-red-500" size={40} />
        </div>}>
            <PaymentFailedContent />
        </Suspense>
    );
}
