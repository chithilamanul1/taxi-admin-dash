'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, CheckCircle, CreditCard } from 'lucide-react';

export default function MockGateway() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const amount = searchParams.get('amount');
    const driverId = searchParams.get('driverId');

    const [status, setStatus] = useState('idle'); // idle, processing, success, error

    const handlePay = async () => {
        setStatus('processing');
        try {
            // Call the Webhook/Notification API to confirm payment
            const res = await fetch('/api/payment/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    driverId,
                    amount,
                    status: 'success', // Simulating bank response
                    transactionId: 'TXN_' + Date.now()
                })
            });
            const data = await res.json();

            if (data.success) {
                setStatus('success');
                setTimeout(() => {
                    router.push('/driver'); // Return to dashboard
                }, 2000);
            } else {
                setStatus('error');
            }
        } catch (e) {
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
                <CheckCircle className="text-green-500 w-24 h-24 mb-4 animate-bounce" />
                <h1 className="text-2xl font-bold text-green-900">Payment Successful!</h1>
                <p className="text-green-700">Redirecting to merchant...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border-t-8 border-blue-600">
                <div className="flex items-center gap-3 mb-8">
                    <CreditCard className="text-blue-600 w-8 h-8" />
                    <h1 className="text-2xl font-bold text-slate-800">Secure Payment Gateway</h1>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl mb-8">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Merchant</span>
                        <span className="font-bold">Airport Taxi Tours</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Amount</span>
                        <span className="font-bold text-xl">LKR {Number(amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Reference</span>
                        <span className="font-mono text-xs">{searchParams.get('ref')}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <input
                        className="w-full p-4 border rounded-lg bg-gray-50 font-mono tracking-widest"
                        placeholder="0000 0000 0000 0000"
                        value="4242 4242 4242 4242"
                        readOnly
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input className="p-4 border rounded-lg bg-gray-50" value="12/25" readOnly />
                        <input className="p-4 border rounded-lg bg-gray-50" value="123" readOnly />
                    </div>
                </div>

                <button
                    onClick={handlePay}
                    disabled={status === 'processing'}
                    className="w-full mt-8 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors flex justify-center items-center gap-2"
                >
                    {status === 'processing' ? <Loader2 className="animate-spin" /> : `Pay LKR ${Number(amount).toLocaleString()}`}
                </button>

                <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Encrypted & Secure (Mock Mode)
                </p>
            </div>
        </div>
    );
}
