'use client';

import React, { useState, useEffect } from 'react';
import { Car, Phone, MapPin, User, Plus, CheckCircle, XCircle, Loader2, UserPlus, X } from 'lucide-react';

const DriversFleetView = ({ bookings = [] }) => {
    const [drivers, setDrivers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [assignModal, setAssignModal] = useState({ open: false, bookingId: null });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newDriver, setNewDriver] = useState({
        name: '',
        phone: '',
        email: '',
        vehicleType: 'sedan',
        vehicleNumber: ''
    });

    // Fetch drivers
    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/drivers');
            const data = await res.json();
            if (Array.isArray(data)) {
                setDrivers(data);
            } else {
                console.error('API did not return an array:', data);
                setDrivers([]);
            }
        } catch (err) {
            console.error('Error fetching drivers:', err);
            setDrivers([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Assign driver to booking
    const assignDriver = async (driverId, bookingId) => {
        try {
            await fetch(`/api/bookings/${bookingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assignedDriver: driverId,
                    status: 'assigned'
                })
            });

            // Update driver status
            await fetch(`/api/drivers/${driverId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'busy' })
            });

            // Send notification
            // Send notification
            const notifRes = await fetch('/api/notifications/driver-assigned', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId, driverId })
            });

            const notifData = await notifRes.json();

            setAssignModal({ open: false, bookingId: null });
            fetchDrivers();

            if (notifData.whatsappLinks?.customer) {
                if (confirm('Driver Assigned Successfully! \n\nClick OK to open WhatsApp and notify the customer.')) {
                    window.open(notifData.whatsappLinks.customer, '_blank');
                }
            } else {
                alert('Driver assigned successfully!');
            }
        } catch (err) {
            console.error('Error assigning driver:', err);
            alert('Failed to assign driver');
        }
    };

    // Create new driver handler
    const createDriver = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/drivers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDriver)
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create driver');
            }

            setShowAddModal(false);
            setNewDriver({ name: '', phone: '', email: '', vehicleType: 'sedan', vehicleNumber: '' });
            fetchDrivers();
            alert('Driver added successfully!');
        } catch (err) {
            console.error('Error creating driver:', err);
            alert(err.message || 'Failed to create driver');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Pending bookings that need driver assignment
    const pendingBookings = bookings.filter(b => b.status === 'pending');

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-emerald-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-emerald-900 dark:text-white">Fleet Management</h2>
                    <p className="text-gray-500 dark:text-slate-400">Manage drivers and assign rides</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                >
                    <Plus size={18} />
                    Add Driver
                </button>
            </div>

            {/* Pending Bookings Alert */}
            {pendingBookings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <h3 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                        <UserPlus size={18} />
                        {pendingBookings.length} Booking{pendingBookings.length > 1 ? 's' : ''} Need Driver Assignment
                    </h3>
                    <div className="space-y-2">
                        {pendingBookings.slice(0, 3).map(booking => (
                            <div key={booking._id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                                <div className="text-sm">
                                    <span className="font-bold text-emerald-900">#{booking._id.slice(-6)}</span>
                                    <span className="text-gray-500 ml-2">{booking.pickupLocation?.address?.split(',')[0]}</span>
                                    <span className="text-gray-400 mx-1">→</span>
                                    <span className="text-gray-500">{booking.dropoffLocation?.address?.split(',')[0]}</span>
                                </div>
                                <button
                                    onClick={() => setAssignModal({ open: true, bookingId: booking._id })}
                                    className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-700"
                                >
                                    Assign Driver
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Drivers Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drivers.length === 0 ? (
                    <div className="col-span-full bg-white dark:bg-slate-900 rounded-2xl p-12 text-center">
                        <Car size={48} className="text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-500">No Drivers Yet</h3>
                        <p className="text-gray-400 text-sm mt-1">Add drivers to start assigning rides</p>
                    </div>
                ) : (
                    drivers.map(driver => (
                        <div key={driver._id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-white/5 hover:shadow-md transition-shadow relative group">
                            {/* Delete Button */}
                            <button
                                onClick={async () => {
                                    if (confirm('Are you sure you want to delete this driver?')) {
                                        try {
                                            await fetch(`/api/drivers/${driver._id}`, { method: 'DELETE' });
                                            fetchDrivers();
                                        } catch (e) { alert('Failed to delete'); }
                                    }
                                }}
                                className="absolute top-4 right-4 p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <X size={16} />
                            </button>

                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${driver.isOnline ? 'bg-green-100' : 'bg-gray-100'}`}>
                                        <User size={24} className={driver.isOnline ? 'text-green-600' : 'text-gray-400'} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-emerald-900 dark:text-white">{driver.user?.name || driver.name || 'Driver'}</h4>
                                        <p className="text-xs text-gray-500">{driver.vehicleNumber}</p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold ${driver.isOnline
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    <span className={`w-2 h-2 rounded-full ${driver.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                                    {driver.isOnline ? 'Online' : 'Offline'}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                                <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-2">
                                    <p className="text-xs text-gray-500">Vehicle</p>
                                    <p className="font-bold text-emerald-900 dark:text-white capitalize">{driver.vehicleType}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-2">
                                    <p className="text-xs text-gray-500">Status</p>
                                    <p className={`font-bold capitalize ${driver.status === 'free' ? 'text-green-600' : 'text-orange-600'}`}>
                                        {driver.status}
                                    </p>
                                </div>
                                <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-2">
                                    <p className="text-xs text-gray-500">Rating</p>
                                    <p className="font-bold text-emerald-900 dark:text-white">⭐ {driver.ratings?.toFixed(1) || '5.0'}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-2">
                                    <p className="text-xs text-gray-500">Total Rides</p>
                                    <p className="font-bold text-emerald-900 dark:text-white">{driver.totalRides || 0}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <a
                                    href={`tel:${driver.user?.phone || driver.phone}`}
                                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 py-2 rounded-lg text-sm font-bold hover:bg-emerald-100 transition-colors"
                                >
                                    <Phone size={14} />
                                    Call
                                </a>
                                {driver.currentLocation?.lat && (
                                    <a
                                        href={`https://www.google.com/maps?q=${driver.currentLocation.lat},${driver.currentLocation.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors"
                                    >
                                        <MapPin size={14} />
                                        Locate
                                    </a>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Assign Driver Modal */}
            {assignModal.open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-emerald-900 dark:text-white mb-4">Assign Driver</h3>
                        <p className="text-gray-500 text-sm mb-4">Select an available driver for this booking:</p>

                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {drivers.filter(d => d.isOnline && d.status === 'free').length === 0 ? (
                                <p className="text-center text-gray-400 py-4">No available drivers online</p>
                            ) : (
                                drivers.filter(d => d.isOnline && d.status === 'free').map(driver => (
                                    <button
                                        key={driver._id}
                                        onClick={() => assignDriver(driver._id, assignModal.bookingId)}
                                        className="w-full flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors text-left"
                                    >
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                            <User size={20} className="text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-emerald-900 dark:text-white">{driver.name || driver.user?.name}</p>
                                            <p className="text-xs text-gray-500">{driver.vehicleType} • {driver.vehicleNumber}</p>
                                        </div>
                                        <CheckCircle size={20} className="text-emerald-600" />
                                    </button>
                                ))
                            )}
                        </div>

                        <button
                            onClick={() => setAssignModal({ open: false, bookingId: null })}
                            className="w-full mt-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Add Driver Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-emerald-900 dark:text-white">Add New Driver</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={createDriver} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Driver Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={newDriver.name}
                                    onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    placeholder="Enter driver name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                                <input
                                    type="tel"
                                    required
                                    value={newDriver.phone}
                                    onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    placeholder="+94 77 123 4567"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email (Optional)</label>
                                <input
                                    type="email"
                                    value={newDriver.email}
                                    onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    placeholder="driver@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicle Type *</label>
                                <select
                                    required
                                    value={newDriver.vehicleType}
                                    onChange={(e) => setNewDriver({ ...newDriver, vehicleType: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                >
                                    <option value="sedan">Sedan</option>
                                    <option value="suv">SUV</option>
                                    <option value="van">Van (KDH)</option>
                                    <option value="minibus">Minibus</option>
                                    <option value="luxury">Luxury</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicle Number *</label>
                                <input
                                    type="text"
                                    required
                                    value={newDriver.vehicleNumber}
                                    onChange={(e) => setNewDriver({ ...newDriver, vehicleNumber: e.target.value.toUpperCase() })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    placeholder="CAB-1234"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={18} />
                                            Add Driver
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DriversFleetView;

