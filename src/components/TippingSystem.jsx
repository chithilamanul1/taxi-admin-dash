'use client';

import { useState } from 'react';
import { Heart, DollarSign, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TippingSystem({ bookingId, driverId, initialTip, initialTransactionId }) {
    const [amount, setAmount] = useState('');
    const [customAmount, setCustomAmount] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasTipped, setHasTipped] = useState(!!initialTip);

    const presetAmounts = [500, 1000, 2000, 5000];

    const handleTip = async () => {
        const tipValue = parseFloat(amount);
        if (!tipValue || tipValue <= 0) return;
        
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/payment/tip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: tipValue, bookingId, driverId }),
            });
            const data = await res.json();
            
            if (data.success && data.url) {
                window.location.href = data.url; // Redirect to payment gateway
            } else {
                alert('Failed to initiate tip payment: ' + (data.error || 'Unknown error'));
            }
        } catch (err) {
            console.error("Tip Error:", err);
            alert("Network error while processing tip.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (hasTipped) {
        return (
            <div className="bg-emerald-50 border-2 border-emerald-500 p-6 rounded-2xl text-center shadow-sm">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500">
                    <Heart size={32} fill="currentColor" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-emerald-900 mb-2">Thank You For Tipping!</h3>
                <p className="text-emerald-700 font-bold text-sm tracking-wide">
                    Your tip of LKR {initialTip} was sent to your chauffeur.
                </p>
                {initialTransactionId && (
                    <p className="text-emerald-600/60 text-xs mt-2 uppercase font-mono tracking-widest">
                        REF: {initialTransactionId}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white border-2 border-slate-100 p-8 md:p-10 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart size={32} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-800 mb-2 leading-none">SHOW APPRECIATION</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">100% of your tip goes directly to the driver</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                {presetAmounts.map((val) => (
                    <button
                        key={val}
                        onClick={() => { setAmount(val.toString()); setCustomAmount(false); }}
                        className={`py-4 rounded-xl font-bold text-sm transition-all border-2 ${
                            amount === val.toString() && !customAmount
                            ? 'bg-rose-500 text-white border-rose-500 shadow-md scale-105'
                            : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-rose-200 hover:bg-rose-50'
                        }`}
                    >
                        Rs. {val.toLocaleString()}
                    </button>
                ))}
            </div>

            <div className="mb-8">
                <button 
                    onClick={() => { setCustomAmount(true); setAmount(''); }}
                    className={`text-xs font-bold uppercase tracking-widest mb-3 ${customAmount ? 'text-rose-500' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Enter Custom Amount
                </button>
                
                {customAmount && (
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <DollarSign size={20} />
                        </div>
                        <input
                            type="number"
                            min="100"
                            step="100"
                            placeholder="Amount in LKR"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-slate-200 p-4 pl-12 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-rose-400 transition-colors"
                        />
                    </div>
                )}
            </div>

            <button
                onClick={handleTip}
                disabled={!amount || parseFloat(amount) <= 0 || isSubmitting}
                className={`w-full py-5 rounded-xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                    !amount || parseFloat(amount) <= 0 || isSubmitting
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg hover:shadow-rose-500/30 hover:-translate-y-1'
                }`}
            >
                {isSubmitting ? (
                    <Loader2 size={20} className="animate-spin" />
                ) : (
                    <>
                        <Heart size={20} fill="currentColor" />
                        Send Tip
                    </>
                )}
            </button>
        </div>
    );
}
