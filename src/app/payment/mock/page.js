'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { CreditCard, CheckCircle, XCircle, Loader2 } from 'lucide-react';

/**
 * Mock Payment Page
 * 
 * Simulates a payment gateway for testing.
 * In production, this would be replaced by actual Sampath Bank IPG.
 */
function MockPaymentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [processing, setProcessing] = useState(false);
    const [cardNumber, setCardNumber] = useState('');

    const bookingId = searchParams.get('bookingId');
    const amount = searchParams.get('amount');

    const handlePayment = async (success) => {
        setProcessing(true);

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Call callback API
        try {
            await fetch('/api/payment/callback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId,
                    status: success ? 'success' : 'failed',
                    transactionId: success ? `TXN${Date.now()}` : null,
                }),
            });

            // Redirect to result page
            if (success) {
                router.push(`/payment/success?bookingId=${bookingId}`);
            } else {
                router.push(`/payment/failed?bookingId=${bookingId}`);
            }
        } catch (error) {
            console.error('Payment error:', error);
            router.push(`/payment/failed?bookingId=${bookingId}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className="bg-emerald-900 p-6 text-white text-center">
                    <div className="text-xs uppercase tracking-wider opacity-70 mb-1">Mock Payment Gateway</div>
                    <div className="text-3xl font-bold">Rs {Number(amount).toLocaleString()}</div>
                    <div className="text-xs opacity-70 mt-1">Booking #{bookingId?.slice(-6)}</div>
                </div>

                {/* Card Form */}
                <div className="p-6 space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                        ⚠️ This is a <strong>TEST</strong> payment page. No real charges will be made.
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="4242 4242 4242 4242"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-600/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                            <input
                                type="text"
                                placeholder="123"
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-600/20"
                            />
                        </div>
                    </div>

                    {/* Test Buttons */}
                    <div className="pt-4 space-y-3">
                        <button
                            onClick={() => handlePayment(true)}
                            disabled={processing}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {processing ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                            {processing ? 'Processing...' : 'Simulate Success'}
                        </button>

                        <button
                            onClick={() => handlePayment(false)}
                            disabled={processing}
                            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <XCircle size={20} />
                            Simulate Failure
                        </button>
                    </div>

                    <div className="text-center text-xs text-gray-400 pt-4">
                        🔒 Secure Mock Payment Environment
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function MockPaymentPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <Loader2 className="animate-spin text-emerald-500" size={40} />
        </div>}>
            <MockPaymentContent />
        </Suspense>
    );
}
