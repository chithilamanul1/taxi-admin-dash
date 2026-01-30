'use client';

import React, { useState } from 'react';
import { X, Calendar, User, Mail, Phone, Users, Loader2, CheckCircle } from 'lucide-react';

const TourBookingModal = ({ isOpen, onClose, tourTitle, tourId, duration }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        adults: 2,
        children: 0,
        specialRequests: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/bookings/tour', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    tourTitle,
                    tourId,
                    duration
                })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Booking failed');

            setIsSuccess(true);
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
                <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl text-center animate-fade-in">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-900 dark:text-white mb-2">Booking Request Sent!</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-8">
                        Thank you for your interest in the <strong>{tourTitle}</strong>. We have received your details and will contact you shortly with a quote and availability.
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 relative z-10">
                    <div>
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Book Tour</span>
                        <h3 className="text-xl font-bold text-emerald-900 dark:text-white line-clamp-1">{tourTitle}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                {/* Form */}
                <div className="overflow-y-auto p-6 custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Your Name</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-3 top-3 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                                <div className="relative">
                                    <Phone size={18} className="absolute left-3 top-3 text-slate-400" />
                                    <input
                                        type="tel"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                                        placeholder="+1 234 567 890"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Travel Date</label>
                                <div className="relative">
                                    <Calendar size={18} className="absolute left-3 top-3 text-slate-400" />
                                    <input
                                        type="date"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Passengers</label>
                                <div className="relative">
                                    <Users size={18} className="absolute left-3 top-3 text-slate-400" />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            min="1"
                                            className="w-full pl-10 pr-2 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-sm"
                                            placeholder="Adults"
                                            value={formData.adults}
                                            onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) || 0 })}
                                        />
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-full pl-2 pr-2 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-sm"
                                            placeholder="Kids"
                                            value={formData.children}
                                            onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Special Requests / Questions</label>
                            <textarea
                                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium min-h-[100px]"
                                placeholder="Any specific requirements, dietary needs, or questions?"
                                value={formData.specialRequests}
                                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-emerald-900 text-white rounded-xl font-bold hover:bg-emerald-800 transition-all hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 mt-4"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} /> Sending Request...
                                </>
                            ) : (
                                'Submit Booking Request'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TourBookingModal;
