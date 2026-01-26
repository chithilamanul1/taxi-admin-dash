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
                <div className="grid grid-cols-3 gap-4 mb-6">
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
        </div>
    );
}
