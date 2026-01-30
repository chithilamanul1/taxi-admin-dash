'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Car, MapPin, Clock, Phone, LogOut, CheckCircle, XCircle, Navigation, Calendar, User, Loader2, Wifi, WifiOff, Radio } from 'lucide-react';

export default function DriverDashboard() {
    const router = useRouter();
    const [driver, setDriver] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');
    const [isOnline, setIsOnline] = useState(false);
    const [gpsStatus, setGpsStatus] = useState('off'); // 'off', 'tracking', 'error'
    const [lastLocation, setLastLocation] = useState(null);
    const [showTopupModal, setShowTopupModal] = useState(false);
    const [topupAmount, setTopupAmount] = useState('5000');
    const [customAmount, setCustomAmount] = useState('');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // GPS Location update function
    const updateLocation = useCallback(async (lat, lng) => {
        const driverId = localStorage.getItem('driver_id');
        if (!driverId) return;

        try {
            await fetch(`/api/drivers/${driverId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentLocation: { lat, lng },
                    isOnline: true
                })
            });
            setLastLocation({ lat, lng, time: new Date() });
        } catch (error) {
            console.error('Failed to update location:', error);
        }
    }, []);

    // Toggle online/offline status
    const toggleOnlineStatus = async () => {
        const driverId = localStorage.getItem('driver_id');
        if (!driverId) return;

        const newStatus = !isOnline;
        setIsOnline(newStatus);

        if (newStatus) {
            // Going online - start GPS tracking
            setGpsStatus('tracking');
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        updateLocation(pos.coords.latitude, pos.coords.longitude);
                    },
                    (err) => {
                        console.error('GPS Error:', err);
                        setGpsStatus('error');
                    },
                    { enableHighAccuracy: true }
                );
            }
        } else {
            // Going offline
            setGpsStatus('off');
            try {
                await fetch(`/api/drivers/${driverId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ isOnline: false })
                });
            } catch (error) {
                console.error('Failed to go offline:', error);
            }
        }
    };

    // Continuous GPS tracking when online
    useEffect(() => {
        let watchId = null;

        if (isOnline && navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    updateLocation(pos.coords.latitude, pos.coords.longitude);
                    setGpsStatus('tracking');
                },
                (err) => {
                    console.error('GPS Watch Error:', err);
                    setGpsStatus('error');
                },
                { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
            );
        }

        return () => {
            if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [isOnline, updateLocation]);

    useEffect(() => {
        // Check if driver is logged in
        const driverId = localStorage.getItem('driver_id');
        if (!driverId) {
            router.push('/driver/login');
            return;
        }

        // Fetch driver info and bookings
        Promise.all([
            fetch(`/api/drivers/${driverId}`).then(r => r.json()),
            fetch(`/api/bookings?driverId=${driverId}`).then(r => r.json())
        ])
            .then(([driverData, bookingsData]) => {
                if (driverData.error) {
                    localStorage.removeItem('driver_id');
                    router.push('/driver/login');
                    return;
                }
                setDriver(driverData);
                setIsOnline(driverData.isOnline || false);
                if (driverData.isOnline) setGpsStatus('tracking');
                setBookings(Array.isArray(bookingsData) ? bookingsData : []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [router]);

    const handleLogout = async () => {
        const driverId = localStorage.getItem('driver_id');
        if (driverId) {
            // Set offline before logout
            await fetch(`/api/drivers/${driverId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isOnline: false })
            });
        }
        localStorage.removeItem('driver_id');
        router.push('/driver/login');
    };

    const updateBookingStatus = async (bookingId, status) => {
        try {
            const res = await fetch(`/api/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status } : b));
            }
        } catch (error) {
            console.error('Failed to update booking:', error);
        }
    };

    const handlePayment = async () => {
        const amount = topupAmount === 'custom' ? customAmount : topupAmount;
        if (!amount || amount < 5000) {
            alert('Minimum topup amount is Rs 5,000');
            return;
        }

        setIsProcessingPayment(true);
        try {
            // Check if mock payment or real
            // For now, simulating a card payment via a new API
            const res = await fetch('/api/payment/create-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount,
                    driverId: driver._id,
                    description: `Wallet Topup - ${driver.name}`
                })
            });
            const data = await res.json();

            if (data.url) {
                // Redirect to payment gateway (or mock page)
                window.location.href = data.url;
            } else if (data.success) {
                // Direct success (Mock)
                alert('Payment Successful! Wallet Updated.');
                setShowTopupModal(false);
                // Refresh driver data
                const driverRes = await fetch(`/api/drivers/${driver._id}`);
                const driverData = await driverRes.json();
                setDriver(driverData);
            } else {
                alert('Payment Failed: ' + data.error);
            }
        } catch (e) {
            console.error(e);
            alert('Payment Error');
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const filteredBookings = bookings.filter(b => {
        if (activeTab === 'pending') return b.status === 'pending' || b.status === 'assigned';
        if (activeTab === 'ongoing') return b.status === 'ongoing';
        if (activeTab === 'completed') return b.status === 'completed';
        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <Loader2 className="animate-spin text-emerald-600" size={48} />
            </div>
        );
    }

    if (!driver) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-100 pt-20">
            {/* Header */}
            <div className="bg-emerald-900 text-white p-6">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 ${isOnline ? 'bg-green-500' : 'bg-white/20'} rounded-full flex items-center justify-center text-2xl font-bold relative`}>
                            {driver.name?.charAt(0) || 'D'}
                            {isOnline && (
                                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-emerald-900 flex items-center justify-center">
                                    <Radio size={10} className="animate-pulse" />
                                </span>
                            )}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">{driver.name}</h1>
                            <p className="text-emerald-300 text-sm">{driver.vehicleNumber}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Online Toggle */}
                        <button
                            onClick={toggleOnlineStatus}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${isOnline
                                ? 'bg-green-500 text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            {isOnline ? (
                                <>
                                    <Wifi size={18} />
                                    Online
                                </>
                            ) : (
                                <>
                                    <WifiOff size={18} />
                                    Offline
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>

                {/* GPS Status Bar */}
                {isOnline && (
                    <div className="max-w-4xl mx-auto mt-4">
                        <div className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg ${gpsStatus === 'tracking' ? 'bg-green-500/20 text-green-300' :
                            gpsStatus === 'error' ? 'bg-red-500/20 text-red-300' :
                                'bg-white/10 text-white/70'
                            }`}>
                            <Navigation size={14} className={gpsStatus === 'tracking' ? 'animate-pulse' : ''} />
                            {gpsStatus === 'tracking' && (
                                <>
                                    GPS Active
                                    {lastLocation && (
                                        <span className="text-xs opacity-70 ml-2">
                                            Last updated: {lastLocation.time.toLocaleTimeString()}
                                        </span>
                                    )}
                                </>
                            )}
                            {gpsStatus === 'error' && 'GPS Error - Please enable location'}
                            {gpsStatus === 'off' && 'GPS Off'}
                        </div>
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="max-w-4xl mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Pending', count: bookings.filter(b => b.status === 'pending' || b.status === 'assigned').length, color: 'bg-yellow-500' },
                        { label: 'Ongoing', count: bookings.filter(b => b.status === 'ongoing').length, color: 'bg-blue-500' },
                        { label: 'Completed', count: bookings.filter(b => b.status === 'completed').length, color: 'bg-green-500' },
                    ].map(stat => (
                        <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm">
                            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-white font-bold mb-2`}>
                                {stat.count}
                            </div>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                        </div>
                    ))}

                    {/* Wallet Stat */}
                    <div className="bg-white rounded-xl p-4 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Wallet Balance</p>
                                <p className={`text-2xl font-mono font-bold ${(driver?.walletBalance || 0) < 5000 ? 'text-red-600' : 'text-emerald-900'}`}>
                                    Rs {(driver?.walletBalance || 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 font-bold">
                                💰
                            </div>
                        </div>
                        <button
                            onClick={() => setShowTopupModal(true)}
                            className="w-full mt-3 bg-emerald-900 text-white py-2 rounded-lg text-sm font-bold hover:bg-emerald-800 transition-colors"
                        >
                            + Top Up
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {['pending', 'ongoing', 'completed'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-emerald-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                    {filteredBookings.length === 0 ? (
                        <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                            <Car className="mx-auto mb-4 opacity-20" size={48} />
                            <p>No {activeTab} bookings</p>
                        </div>
                    ) : (
                        filteredBookings.map(booking => (
                            <div key={booking._id} className="bg-white rounded-xl p-5 shadow-sm">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="font-bold text-emerald-900">{booking.customerName || 'Guest'}</p>
                                        <p className="text-xs text-gray-500">#{booking._id.slice(-6).toUpperCase()}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        booking.status === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin size={14} className="text-emerald-600" />
                                        <span className="text-gray-700">{booking.pickupLocation?.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Navigation size={14} className="text-red-500" />
                                        <span className="text-gray-700">{booking.dropoffLocation?.address}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {booking.scheduledDate}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {booking.scheduledTime}
                                        </span>
                                    </div>
                                </div>

                                {booking.guestPhone && (
                                    <a
                                        href={`tel:${booking.guestPhone}`}
                                        className="flex items-center gap-2 text-emerald-600 text-sm font-bold mb-4"
                                    >
                                        <Phone size={14} />
                                        {booking.guestPhone}
                                    </a>
                                )}

                                {/* Action Buttons */}
                                {booking.status === 'assigned' && (
                                    <button
                                        onClick={() => updateBookingStatus(booking._id, 'ongoing')}
                                        className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                                    >
                                        <Car size={18} />
                                        Start Trip
                                    </button>
                                )}

                                {booking.status === 'ongoing' && (
                                    <button
                                        onClick={() => updateBookingStatus(booking._id, 'completed')}
                                        className="w-full bg-green-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={18} />
                                        Complete Trip
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
            {/* Top Up Modal */}
            {
                showTopupModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-emerald-900">Top Up Wallet</h3>
                                <button onClick={() => setShowTopupModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><XCircle size={24} className="text-gray-400" /></button>
                            </div>

                            <p className="text-sm text-gray-500 mb-4">Select an amount to add to your wallet. Minimum amount is <strong>Rs 5,000</strong>.</p>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <button
                                    onClick={() => { setTopupAmount('5000'); setCustomAmount(''); }}
                                    className={`py-3 rounded-xl font-bold border-2 transition-all ${topupAmount === '5000' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500 hover:border-emerald-200'}`}
                                >
                                    Rs 5,000
                                </button>
                                <button
                                    onClick={() => { setTopupAmount('10000'); setCustomAmount(''); }}
                                    className={`py-3 rounded-xl font-bold border-2 transition-all ${topupAmount === '10000' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500 hover:border-emerald-200'}`}
                                >
                                    Rs 10,000
                                </button>
                            </div>

                            <div className="mb-6">
                                <button
                                    onClick={() => setTopupAmount('custom')}
                                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all mb-2 flex items-center gap-3 ${topupAmount === 'custom' ? 'border-emerald-500 bg-white ring-1 ring-emerald-500' : 'border-gray-200 bg-gray-50'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${topupAmount === 'custom' ? 'border-emerald-500' : 'border-gray-400'}`}>
                                        {topupAmount === 'custom' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                                    </div>
                                    <span className={topupAmount === 'custom' ? 'text-emerald-900 font-bold' : 'text-gray-500'}>Custom Amount</span>
                                </button>

                                {topupAmount === 'custom' && (
                                    <div className="animate-fade-in-down">
                                        <input
                                            type="number"
                                            placeholder="Enter amount (Min 5000)"
                                            className="w-full p-3 border-2 border-emerald-100 rounded-xl font-mono text-lg font-bold outline-none focus:border-emerald-500"
                                            value={customAmount}
                                            onChange={(e) => setCustomAmount(e.target.value)}
                                            min="5000"
                                        />
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={isProcessingPayment}
                                className="w-full py-4 bg-emerald-900 text-white rounded-xl font-bold text-lg hover:bg-emerald-800 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-emerald-900/20"
                            >
                                {isProcessingPayment ? <Loader2 className="animate-spin" /> : 'Pay Securely'}
                            </button>

                            <div className="mt-4 flex justify-center gap-4 opacity-50">
                                {/* Payment Logos (Text for now) */}
                                <span className="text-xs font-bold text-gray-400">VISA</span>
                                <span className="text-xs font-bold text-gray-400">MasterCard</span>
                                <span className="text-xs font-bold text-gray-400">Sampath Bank</span>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
