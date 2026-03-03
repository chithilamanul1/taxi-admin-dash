'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { XCircle, RefreshCw, Home, Phone, Loader2 } from 'lucide-react';

function PaymentFailedContent() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('bookingId');
    const reason = searchParams.get('reason');
    const isCancelled = reason === 'cancelled';

    return (
        <div className={`min-h-screen bg-gradient-to-br ${isCancelled ? 'from-amber-50 to-orange-100' : 'from-red-50 to-orange-100'} flex items-center justify-center p-4`}>
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
                <div className={`w-20 h-20 ${isCancelled ? 'bg-amber-100' : 'bg-red-100'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    {isCancelled ? (
                        <AlertCircle className="text-amber-500" size={48} />
                    ) : (
                        <XCircle className="text-red-500" size={48} />
                    )}
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    {isCancelled ? 'Transaction Cancelled' : 'Payment Failed'}
                </h1>
                <p className="text-gray-600 mb-6 font-medium">
                    {isCancelled
                        ? 'Your session timed out or the transaction was cancelled.'
                        : 'Payment Declined - Please try an alternative card.'}
                </p>

                {reason && (
                    <div className={`mb-6 p-4 rounded-xl border text-left ${isCancelled ? 'bg-amber-50 border-amber-100' : 'bg-red-50 border-red-100'}`}>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isCancelled ? 'text-amber-500' : 'text-red-500'}`}>
                            {isCancelled ? 'Status Update' : 'Error Details'}
                        </p>
                        <p className={`text-sm font-bold capitalize ${isCancelled ? 'text-amber-900' : 'text-red-900'}`}>{reason.replace(/_/g, ' ')}</p>
                    </div>
                )}

                <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left border border-slate-100">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                        {isCancelled ? 'Why did this happen?' : 'Common reasons:'}
                    </div>
                    <ul className="space-y-2">
                        {(isCancelled
                            ? ['Session expired (15+ mins)', 'Closed the payment window', 'Incomplete MFA/OTP verification', 'Back button pressed']
                            : ['Insufficient funds', 'Card declined by bank', 'Network timeout', 'Security verification failed']
                        ).map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                <div className={`w-1.5 h-1.5 rounded-full ${isCancelled ? 'bg-amber-400' : 'bg-red-400'}`}></div>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="grid gap-3">
                    <button
                        onClick={async () => {
                            const btn = document.getElementById('retry-btn');
                            if (btn) btn.disabled = true;
                            const icon = document.getElementById('retry-icon');
                            if (icon) icon.classList.add('animate-spin');

                            try {
                                const res = await fetch('/api/payment/initiate', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ bookingId, retry: true })
                                });
                                const data = await res.json();
                                if (data.success && data.paymentUrl) {
                                    window.location.href = data.paymentUrl;
                                } else {
                                    alert(data.message || 'Error re-initiating payment. Please try again or contact support.');
                                    if (btn) btn.disabled = false;
                                    if (icon) icon.classList.remove('animate-spin');
                                }
                            } catch (err) {
                                console.error(err);
                                alert('Network error. Please try again.');
                                if (btn) btn.disabled = false;
                                if (icon) icon.classList.remove('animate-spin');
                            }
                        }}
                        id="retry-btn"
                        className="flex items-center justify-center gap-2 w-full bg-amber-500 text-black py-4 rounded-xl font-black hover:bg-amber-400 transition-all shadow-lg active:scale-[0.98] group"
                    >
                        <RefreshCw id="retry-icon" size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                        Try Again (Re-enter Details)
                    </button>

                    <a
                        href="https://wa.me/94722885885"
                        target="_blank"
                        className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
                    >
                        <Phone size={20} />
                        Talk to Support
                    </a>

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                    >
                        <Home size={20} />
                        Back to Home
                    </Link>

                    <a
                        href="tel:+94716885880"
                        className="flex items-center justify-center gap-2 w-full text-slate-900 py-3 rounded-lg font-bold hover:underline"
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
