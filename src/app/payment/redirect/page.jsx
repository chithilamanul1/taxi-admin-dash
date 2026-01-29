'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, ShieldCheck, Lock } from 'lucide-react';
import { generateSampathPayload } from '@/lib/payment';

// Server Action to get booking securely
import { getBookingForPayment } from './actions';

export default function PaymentRedirectPage() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('bookingId');
    const formRef = useRef(null);
    const [payload, setPayload] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!bookingId) {
            setError('Missing Booking ID');
            return;
        }

        const fetchPayload = async () => {
            try {
                // Fetch booking and generate secure payload server-side
                const result = await getBookingForPayment(bookingId);

                if (result.error) {
                    setError(result.error);
                } else {
                    setPayload(result.payload);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to initialize payment');
            }
        };

        fetchPayload();
    }, [bookingId]);

    // Auto-submit form when payload is ready
    useEffect(() => {
        if (payload && formRef.current) {
            const timer = setTimeout(() => {
                formRef.current.submit();
            }, 1500); // 1.5s delay to show the "Securing" animation
            return () => clearTimeout(timer);
        }
    }, [payload]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 max-w-md text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-xl font-bold text-slate-800 mb-2">Security Check Failed</h1>
                    <p className="text-slate-500 mb-6">{error}</p>
                    <a href="/" className="text-sm font-bold text-emerald-900 hover:underline">Return to Home</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-950 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

            <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-emerald-900/50 border border-emerald-500/20 flex items-center justify-center mb-8 relative">
                    <div className="absolute inset-0 rounded-full border-t-2 border-emerald-400 animate-spin"></div>
                    <ShieldCheck size={40} className="text-emerald-400" />
                </div>

                <h1 className="text-3xl font-bold mb-3 tracking-tight">Securing Connection</h1>
                <p className="text-emerald-400/60 font-medium text-sm uppercase tracking-widest mb-12">Redirecting to Sampath Bank IPG</p>

                <div className="flex items-center gap-3 bg-emerald-900/50 px-6 py-3 rounded-xl border border-emerald-500/10 backdrop-blur-sm">
                    <Lock size={16} className="text-emerald-400" />
                    <span className="text-xs font-mono text-emerald-200/80">TLS 1.3 Encryption Active</span>
                </div>

                {/* Hidden Form for Auto-Submission */}
                {payload && (
                    <form ref={formRef} action={payload.action} method="POST" className="hidden">
                        {Object.entries(payload.fields).map(([key, value]) => (
                            <input key={key} type="hidden" name={key} value={value} />
                        ))}
                    </form>
                )}
            </div>
        </div>
    );
}
