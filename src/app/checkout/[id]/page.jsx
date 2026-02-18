'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ExpressCheckoutModal from '@/components/ExpressCheckoutModal';
import { flatRates } from '@/data/flatRates';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const id = params.id;
        if (id && flatRates[id]) {
            setProduct(flatRates[id]);
            setLoading(false);
        } else if (id) {
            // Try fetching from database
            const fetchDynamicLink = async () => {
                try {
                    const res = await fetch(`/api/checkout/verify/${id}`);
                    const data = await res.json();
                    if (data.success) {
                        setProduct(data.data);
                    } else {
                        setError(true);
                    }
                } catch (err) {
                    setError(true);
                } finally {
                    setLoading(false);
                }
            };
            fetchDynamicLink();
        } else {
            setError(true);
            setLoading(false);
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center space-y-4">
                    <Loader2 className="animate-spin text-emerald-600 mx-auto" size={48} />
                    <p className="text-slate-500 font-medium">Securing your booking session...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-xl text-center space-y-6">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                        <AlertCircle size={40} />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-black text-slate-800 uppercase italic">Link Expired or Invalid</h1>
                        <p className="text-slate-500">The product you're looking for doesn't exist or the link is broken.</p>
                    </div>
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-900 text-white rounded-2xl font-bold hover:bg-emerald-800 transition-all"
                    >
                        <ArrowLeft size={20} /> Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden p-6">
            {/* Background elements to make it look premium */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 hover:opacity-10 transition-opacity pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 text-center space-y-8 animate-fade-in">
                <Link href="/" className="inline-block">
                    <img src="/logo.png" alt="Airport Taxis Sri Lanka" className="h-12 md:h-16 mx-auto mb-4" />
                </Link>

                <div className="space-y-2">
                    <h1 className="text-3xl md:text-5xl font-black text-emerald-900 uppercase">Secure Payment</h1>
                    <p className="text-slate-500 font-medium max-w-lg mx-auto">Complete your booking for <strong>{product.title}</strong> securely via our bank-verified portal.</p>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-sm mx-auto transform hover:scale-105 transition-transform duration-500">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            <img src={product.img} alt={product.title} className="w-full h-full object-cover rounded-2xl" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-slate-800 text-xl">{product.title}</h3>
                            <span className="text-4xl font-black text-emerald-900">${product.price}</span>
                        </div>
                        <button
                            onClick={() => router.refresh()} // Modal handles its own state if needed, but here we just want it to be "always open" or triggered
                            className="hidden" // We'll trigger it automatically or use a simpler layout
                        ></button>
                    </div>
                </div>
            </div>

            <ExpressCheckoutModal
                isOpen={true}
                onClose={() => router.push('/')}
                product={product}
            />
        </div>
    );
}
