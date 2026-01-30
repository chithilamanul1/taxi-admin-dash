'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Car, Check, Loader2, MessageCircle } from 'lucide-react';

export default function BookingAssignmentModal({ booking, onClose, onAssignSuccess }) {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [assigning, setAssigning] = useState(false);

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const res = await fetch('/api/drivers');
            const data = await res.json();
            if (Array.isArray(data)) {
                // Filter for verified drivers. 
                // Optionally sort by free/busy, but show all verified so admin can override if needed.
                const verified = data.filter(d => d.verificationStatus === 'verified' || !d.verificationStatus);
                setDrivers(verified);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const commissionAmount = (booking.totalPrice || 0) * 0.10; // 10% Commission

    const handleAssign = async () => {
        if (!selectedDriver) return;
        setAssigning(true);
        try {
            // 1. Call API to update booking
            const res = await fetch(`/api/bookings/${booking._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assignedDriver: selectedDriver._id,
                    status: 'assigned', // or 'ongoing' depending on workflow
                    commission: commissionAmount // Pass commission to backend for deduction
                })
            });

            if (res.ok) {
                // 2. Construct WhatsApp Message
                const message = `*Ride Assigned!* 🚖\n\n` +
                    `*Booking ID:* #${booking._id.slice(-6)}\n` +
                    `*Pickup:* ${booking.pickupLocation?.address}\n` +
                    `*Dropoff:* ${booking.dropoffLocation?.address}\n` +
                    `*Date/Time:* ${booking.scheduledDate} @ ${booking.scheduledTime}\n` +
                    `*Passenger:* ${booking.customerName || booking.guestName || 'Guest'} (${booking.guestPhone || 'N/A'})\n` +
                    `*Price:* Rs ${booking.totalPrice}\n\n` +
                    `Please start the trip on time.`;

                const phone = selectedDriver.phone.replace(/\D/g, '');
                const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

                // 3. Close & Notify
                onAssignSuccess();

                // 4. Open WhatsApp
                window.open(waLink, '_blank');

                onClose();
            } else {
                alert('Failed to assign driver.');
            }
        } catch (error) {
            console.error(error);
            alert('Error assigning driver.');
        } finally {
            setAssigning(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b dark:border-white/10 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-emerald-900 dark:text-white">Assign Driver</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full"><X size={20} /></button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    <div className="mb-4 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl">
                        <h4 className="font-bold text-emerald-900 dark:text-emerald-400 text-sm mb-1">Booking #{booking._id.slice(-6)}</h4>
                        <p className="text-xs text-emerald-700 dark:text-emerald-300">
                            {booking.pickupLocation?.address.split(',')[0]} ➝ {booking.dropoffLocation?.address.split(',')[0]}
                        </p>
                    </div>

                    <h4 className="font-bold text-slate-500 text-xs uppercase tracking-widest mb-3">Available Drivers</h4>

                    {loading ? (
                        <div className="text-center py-8"><Loader2 className="animate-spin mx-auto text-emerald-500" /></div>
                    ) : drivers.length === 0 ? (
                        <p className="text-center text-slate-400 py-8">No verified drivers found.</p>
                    ) : (
                        <div className="space-y-2">
                            {drivers.map(driver => {
                                const hasFunds = (driver.walletBalance || 0) >= 5000;
                                return (
                                    <div
                                        key={driver._id}
                                        onClick={() => hasFunds && setSelectedDriver(driver)}
                                        className={`p-3 rounded-xl border transition-all flex justify-between items-center ${!hasFunds ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'cursor-pointer'} ${selectedDriver?._id === driver._id
                                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 ring-1 ring-emerald-500'
                                                : 'border-slate-200 dark:border-white/10 hover:border-emerald-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${driver.status === 'free' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                <Car size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white text-sm">{driver.name}</p>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <span>{driver.vehicleNumber}</span>
                                                    <span className={`font-mono font-bold ${hasFunds ? 'text-emerald-600' : 'text-red-500'}`}>
                                                        Rs {(driver.walletBalance || 0).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${driver.status === 'free' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {driver.status}
                                            </div>
                                            {!hasFunds && <span className="text-[9px] text-red-500 font-bold block mt-1">Low Balance</span>}
                                            {selectedDriver?._id === driver._id && <Check size={16} className="text-emerald-600 ml-auto mt-1" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t dark:border-white/10">
                    <div className="flex justify-between items-center mb-4 text-xs">
                        <span className="text-slate-500">Trip Value: <strong>Rs {booking.totalPrice?.toLocaleString()}</strong></span>
                        <span className="text-emerald-600">Commission (10%): <strong>- Rs {commissionAmount.toLocaleString()}</strong></span>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                        <button
                            onClick={handleAssign}
                            disabled={!selectedDriver || assigning}
                            className="flex-[2] py-3 bg-emerald-900 text-white rounded-xl font-bold hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                        >
                            {assigning ? <Loader2 className="animate-spin" /> : <MessageCircle size={18} />}
                            {assigning ? 'Assigning...' : 'Assign & WhatsApp'}
                        </button>
                    </div>
                </div>
            </div>
            );
}
