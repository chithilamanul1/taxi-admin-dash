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
    const [selectedPaymentType, setSelectedPaymentType] = useState(
        product?.allowedPaymentMode === 'partial' ? 'partial' : 'full'
    );

    if (!isOpen || !product) return null;

    const getCurrencySymbol = (curr) => {
        switch (curr) {
            case 'LKR': return 'Rs.';
            case 'EUR': return '€';
            case 'GBP': return '£';
            case 'INR': return '₹';
            case 'USD': return '$';
            default: return '$';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                type: 'transfer',
                tripType: 'one-way',
                pickupLocation: { address: 'Bandaranaike International Airport (CMB)', lat: 7.1811, lng: 79.8837 },
                dropoffLocation: { address: product?.title || '', lat: 0, lng: 0 },
                totalPrice: product?.price || 0,
                paidAmount: selectedPaymentType === 'partial' ? ((product?.price || 0) * 0.5) : (product?.price || 0),
                currency: product?.currency || 'USD',
                displayPrice: product?.price || 0,
                displayPaidAmount: selectedPaymentType === 'partial' ? ((product?.price || 0) * 0.5) : (product?.price || 0),
                paymentMethod: 'card',
                paymentType: selectedPaymentType,
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
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-0 sm:p-4 md:p-8 overflow-hidden touch-none no-scrollbar">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" onClick={onClose}></div>

            <div className="relative w-full h-full sm:h-auto sm:max-h-[95vh] max-w-4xl bg-white sm:rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden animate-zoom-in flex flex-col">
                {/* Header */}
                <div className="bg-emerald-900 p-6 md:p-12 text-white relative flex-shrink-0 pt-10 sm:pt-6">
                    <button onClick={onClose} className="absolute top-4 right-4 md:top-8 md:right-10 p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-[101]">
                        <X size={26} />
                    </button>
                    <div className="flex items-center gap-2 text-emerald-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2 md:mb-5">
                        <ShieldCheck size={14} className="md:w-4 md:h-4" /> Bank Verified Secure Checkout
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
                        <div>
                            <h2 className="text-xl md:text-5xl font-black mb-0 md:mb-3 leading-tight uppercase tracking-tight">Express Checkout</h2>
                            <p className="text-[10px] md:text-lg text-emerald-200/80 font-medium">{product?.title}</p>
                        </div>

                        <div className="flex flex-col items-end gap-2 bg-white/5 w-fit px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl border border-white/10 backdrop-blur-md">
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl md:text-6xl font-black text-white">
                                    {getCurrencySymbol(product?.currency)}
                                    {(selectedPaymentType === 'partial' ? ((product?.price || 0) * 0.5) : (product?.price || 0)).toLocaleString(undefined, { minimumFractionDigits: product?.currency === 'LKR' ? 0 : 2, maximumFractionDigits: 2 })}
                                </span>
                                <span className="text-emerald-400 font-bold uppercase text-[8px] md:text-[11px] tracking-widest">
                                    {selectedPaymentType === 'partial' ? 'Deposit (50%)' : 'Full Payment'}
                                </span>
                            </div>
                            {product?.allowedPaymentMode === 'both' && (
                                <div className="flex bg-black/20 p-1 rounded-xl border border-white/5">
                                    {['full', 'partial'].map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setSelectedPaymentType(t)}
                                            className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${selectedPaymentType === t ? 'bg-emerald-500 text-white shadow-lg' : 'text-emerald-300 hover:text-white hover:bg-white/5'}`}
                                        >
                                            {t === 'full' ? '100%' : '50%'}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form - Scrollable for small screens */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
                            {[
                                { label: 'Full Name', key: 'customerName', type: 'text', placeholder: 'John Doe', required: true },
                                { label: 'Email Address', key: 'customerEmail', type: 'email', placeholder: 'john@example.com', required: true },
                                { label: 'International Phone', key: 'guestPhone', type: 'tel', placeholder: '+1 234 567 890', required: true },
                                { label: 'Country', key: 'country', type: 'text', placeholder: 'United Kingdom', required: true },
                            ].map((field) => (
                                <div key={field.key} className="space-y-2.5">
                                    <label className="text-[10px] md:text-xs font-bold text-emerald-900/40 uppercase tracking-widest ml-1">{field.label}</label>
                                    <input
                                        required={field.required}
                                        type={field.type}
                                        value={formData[field.key]}
                                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-emerald-900 placeholder:text-slate-300"
                                        placeholder={field.placeholder}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-[10px] md:text-xs font-bold text-emerald-900/40 uppercase tracking-widest ml-1">Billing Address</label>
                            <textarea
                                required
                                rows="2"
                                value={formData.billingAddress}
                                onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all resize-none font-bold text-emerald-900 placeholder:text-slate-300"
                                placeholder="123 Street Name, Apartment, Suite"
                            ></textarea>
                        </div>

                        <div className="pt-2 md:pt-6">
                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full py-6 md:py-7 bg-emerald-900 text-white rounded-[2rem] md:rounded-[2.5rem] font-black text-xl md:text-2xl hover:bg-emerald-800 transition-all shadow-2xl shadow-emerald-900/20 flex items-center justify-center gap-4 group disabled:opacity-70"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={28} />
                                ) : (
                                    <>
                                        <CreditCard size={28} />
                                        Pay {getCurrencySymbol(product?.currency)}
                                        {(selectedPaymentType === 'partial' ? ((product?.price || 0) * 0.5) : (product?.price || 0)).toLocaleString()} Now
                                        <ArrowRight size={26} className="group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 pt-4 text-emerald-900/40">
                            <div className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest">
                                <CheckCircle size={14} className="text-emerald-500" /> Instant Confirmation
                            </div>
                            <div className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest">
                                <CheckCircle size={14} className="text-emerald-500" /> 24/7 Support
                            </div>
                            <div className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest">
                                <CheckCircle size={14} className="text-emerald-500" /> Secure SSL
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ExpressCheckoutModal;
