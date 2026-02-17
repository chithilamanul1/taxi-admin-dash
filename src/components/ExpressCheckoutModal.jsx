'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

const ExpressCheckoutModal = ({ isOpen, onClose, product }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        guestPhone: '',
        billingAddress: '',
        country: '',
    });

    if (!isOpen || !product) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                type: 'transfer',
                tripType: 'one-way',
                pickupLocation: { address: 'Bandaranaike International Airport (CMB)', lat: 7.1811, lng: 79.8837 },
                dropoffLocation: { address: product.title, lat: 0, lng: 0 }, // Placeholder for fixed price
                totalPrice: 0, // Backend will calculate or we pass fixed
                paidAmount: product.price,
                currency: 'USD',
                displayPrice: product.price,
                displayPaidAmount: product.price,
                paymentMethod: 'card',
                paymentType: 'full',
                billingDetails: {
                    billingName: formData.customerName,
                    billingAddress: formData.billingAddress,
                    city: '', // Optional for now
                    country: formData.country
                }
            };

            const res = await fetch('/api/payment/initiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (data.success && data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                alert(data.message || 'Payment initiation failed');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('An error occurred during checkout.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>

            <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-zoom-in">
                {/* Header */}
                <div className="bg-emerald-900 p-8 text-white relative">
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                        <ShieldCheck size={14} /> Bank Verified Secure Checkout
                    </div>
                    <h2 className="text-3xl font-black mb-2">Express Checkout</h2>
                    <p className="text-emerald-200/80">{product.title}</p>

                    <div className="mt-6 flex items-baseline gap-2">
                        <span className="text-4xl font-black text-white">${product.price}</span>
                        <span className="text-emerald-400/80 font-bold uppercase text-[10px] tracking-widest">Fixed USD Amount</span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest ml-1">Full Name</label>
                            <input
                                required
                                type="text"
                                value={formData.customerName}
                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-emerald-900/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                required
                                type="email"
                                value={formData.customerEmail}
                                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-emerald-900/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest ml-1">International Phone</label>
                            <input
                                required
                                type="tel"
                                value={formData.guestPhone}
                                onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-emerald-900/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                placeholder="+1 234 567 890"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest ml-1">Country</label>
                            <input
                                required
                                type="text"
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-emerald-900/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                placeholder="United Kingdom"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest ml-1">Billing Address</label>
                        <textarea
                            required
                            rows="2"
                            value={formData.billingAddress}
                            onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-emerald-900/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                            placeholder="123 Street Name, Apartment, Suite"
                        ></textarea>
                    </div>

                    <div className="pt-4">
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full py-4 bg-emerald-900 text-white rounded-2xl font-black text-lg hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3 group disabled:opacity-70"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>
                                    <CreditCard size={22} />
                                    Pay ${product.price} Now
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-6 pt-4 text-emerald-900/30">
                        <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest">
                            <CheckCircle size={10} /> Instant Confirmation
                        </div>
                        <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest">
                            <CheckCircle size={10} /> 24/7 Support
                        </div>
                        <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest">
                            <CheckCircle size={10} /> Secure SSL
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExpressCheckoutModal;
