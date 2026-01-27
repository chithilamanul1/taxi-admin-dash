'use client'

import React, { useState } from 'react';
import { Users, Car, MapPin, DollarSign, Activity, Bell } from 'lucide-react';
import DriversFleetView from '../../components/DriversFleetView';

// Mock Data Removed. Using Real API.

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentView, setCurrentView] = useState('dashboard');
    const [vehiclePricing, setVehiclePricing] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState(null); // Vehicle object being edited
    const [editForm, setEditForm] = useState({}); // Form state

    // Fetch Pricing Data
    React.useEffect(() => {
        if (currentView === 'pricing') {
            setIsLoading(true);
            fetch('/api/pricing')
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    const contentType = res.headers.get('content-type');
                    if (!contentType || !contentType.includes('application/json')) {
                        throw new Error('API returned non-JSON response');
                    }
                    return res.json();
                })
                .then(data => {
                    setVehiclePricing(Array.isArray(data) ? data : []);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching pricing:", err);
                    setIsLoading(false);
                });
        }
    }, [currentView]);

    const handleEditClick = (vehicle) => {
        setEditingVehicle(vehicle);
        setEditForm({ ...vehicle }); // Clone for editing
    };

    const handleSavePricing = async () => {
        try {
            const res = await fetch(`/api/pricing/${editingVehicle.vehicleType}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });
            if (res.ok) {
                const updated = await res.json();
                setVehiclePricing(prev => prev.map(v => v.vehicleType === updated.vehicleType ? updated : v));
                setEditingVehicle(null);
                alert("Pricing updated successfully!");
            } else {
                alert("Failed to update pricing.");
            }
        } catch (err) {
            console.error(err);
            alert("Error updating pricing.");
        }
    };

    const handleFormChange = (e, field, tierIndex = null) => {
        if (tierIndex !== null) {
            const newTiers = [...editForm.tiers];
            newTiers[tierIndex] = { ...newTiers[tierIndex], [field]: e.target.value };
            setEditForm({ ...editForm, tiers: newTiers });
        } else {
            setEditForm({ ...editForm, [field]: e.target.value });
        }
    };


    const [bookings, setBookings] = useState([]);

    // Fetch Bookings Data
    React.useEffect(() => {
        if (currentView === 'dashboard' || currentView === 'bookings') {
            fetch('/api/bookings')
                .then(res => res.json())
                .then(data => setBookings(data))
                .catch(err => console.error("Error fetching bookings:", err));
        }
    }, [currentView]);

    // Calculate Real Stats
    const stats = React.useMemo(() => {
        const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
        const activeRides = bookings.filter(b => b.status === 'ongoing' || b.status === 'assigned').length;
        const pendingBookings = bookings.filter(b => b.status === 'pending').length;
        // Mock online drivers for now as we don't have driver socket yet
        const onlineDrivers = 8;

        return [
            { title: 'Total Revenue', value: `LKR ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-500' },
            { title: 'Active Rides', value: activeRides.toString(), icon: Car, color: 'text-blue-500' },
            { title: 'Online Drivers', value: onlineDrivers.toString(), icon: Users, color: 'text-emerald-600' },
            { title: 'Pending Bookings', value: pendingBookings.toString(), icon: Bell, color: 'text-red-500' },
        ];
    }, [bookings]);

    // Real-time Clock
    const [currentTime, setCurrentTime] = useState(new Date());
    React.useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // ... (rest of component)

    return (
        <div className="flex h-screen bg-slate-100 dark:bg-slate-950 transition-colors">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 bg-emerald-900 dark:bg-slate-900 text-white transition-all duration-300 ${sidebarOpen && 'md:w-64'} ${!sidebarOpen && 'md:w-20'} w-64 flex flex-col`}>
                {/* Close button for mobile */}
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="md:hidden absolute top-4 right-4 text-white/80 hover:text-white"
                >
                    ✕
                </button>
                <div className="p-4 flex items-center justify-center border-b border-white/10">
                    <h1 className={`font-bold text-xl ${!sidebarOpen && 'md:hidden'}`}>Admin Panel</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setCurrentView('dashboard')} className={`flex items-center gap-3 p-3 w-full rounded transition-colors ${currentView === 'dashboard' ? 'bg-emerald-600 text-emerald-900' : 'hover:bg-white/10'}`}>
                        <Activity size={20} />
                        <span className={`${!sidebarOpen && 'hidden'}`}>Dashboard</span>
                    </button>
                    <button className="flex items-center gap-3 p-3 w-full hover:bg-white/10 rounded transition-colors">
                        <MapPin size={20} />
                        <span className={`${!sidebarOpen && 'hidden'}`}>Live Map</span>
                    </button>
                    <button onClick={() => setCurrentView('drivers')} className={`flex items-center gap-3 p-3 w-full rounded transition-colors ${currentView === 'drivers' ? 'bg-emerald-600 text-emerald-900' : 'hover:bg-white/10'}`}>
                        <Car size={20} />
                        <span className={`${!sidebarOpen && 'hidden'}`}>Drivers</span>
                    </button>
                    <button onClick={() => setCurrentView('pricing')} className={`flex items-center gap-3 p-3 w-full rounded transition-colors ${currentView === 'pricing' ? 'bg-emerald-600 text-emerald-900' : 'hover:bg-white/10'}`}>
                        <DollarSign size={20} />
                        <span className={`${!sidebarOpen && 'hidden'}`}>Pricing</span>
                    </button>
                    <button onClick={() => setCurrentView('bookings')} className={`flex items-center gap-3 p-3 w-full rounded transition-colors ${currentView === 'bookings' ? 'bg-emerald-600 text-emerald-900' : 'hover:bg-white/10'}`}>
                        <Users size={20} />
                        <span className={`${!sidebarOpen && 'hidden'}`}>Bookings</span>
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm p-4 flex justify-between items-center border-b border-white/5 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-emerald-900 dark:text-emerald-400 font-bold hover:bg-emerald-50 dark:hover:bg-white/5 p-2 rounded-lg transition-colors">
                            ☰
                        </button>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Location</span>
                            <span className="text-sm font-black text-emerald-900 dark:text-white capitalize flex items-center gap-2">
                                Admin <span className="text-slate-300">/</span> {currentView}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                                {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                            <span className="text-lg font-black text-emerald-900 dark:text-white tabular-nums leading-none">
                                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>
                        <Bell className="text-slate-500 cursor-pointer hover:text-emerald-900 transition-colors" />
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-xl text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-900/20 text-sm">A</div>
                    </div>
                </header>

                <main className="p-8">
                    {currentView === 'dashboard' && (
                        <>
                            <h2 className="text-2xl font-bold text-emerald-900 dark:text-white mb-6">Dashboard Overview</h2>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {stats.map((stat, index) => (
                                    <div key={index} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-white/5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.title}</p>
                                                <p className="text-2xl font-bold text-emerald-900 dark:text-white mt-1">{stat.value}</p>
                                            </div>
                                            <stat.icon className={`${stat.color} opacity-80`} size={32} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Recent Bookings & Map Placeholder */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Bookings Table */}
                                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-white/5">
                                    <h3 className="text-lg font-bold text-emerald-900 dark:text-white mb-4">Recent Bookings</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-left text-sm text-slate-500 border-b">
                                                    <th className="pb-3">ID</th>
                                                    <th className="pb-3">Type</th>
                                                    <th className="pb-3">Route</th>
                                                    <th className="pb-3">Price</th>
                                                    <th className="pb-3">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                {bookings.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="5" className="py-8 text-center text-gray-400">No bookings yet.</td>
                                                    </tr>
                                                ) : (
                                                    bookings.slice(0, 5).map((booking) => (
                                                        <tr key={booking._id} className="border-b dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-emerald-900 dark:text-white">
                                                            <td className="py-4 font-medium text-emerald-900 dark:text-emerald-400">#{booking._id.slice(-6)}</td>
                                                            <td className="py-4 capitalize">{booking.vehicleType}</td>
                                                            <td className="py-4 text-slate-500 dark:text-slate-400">
                                                                <div className="max-w-[150px] truncate" title={booking.pickupLocation?.address}>{booking.pickupLocation?.address?.split(',')[0]}</div>
                                                                <div className="text-xs text-gray-300 dark:text-slate-600">to</div>
                                                                <div className="max-w-[150px] truncate" title={booking.dropoffLocation?.address}>{booking.dropoffLocation?.address?.split(',')[0]}</div>
                                                            </td>
                                                            <td className="py-4 font-bold">Rs {booking.totalPrice?.toLocaleString()}</td>
                                                            <td className="py-4">
                                                                <span className={`px-2 py-1 rounded text-xs font-bold capitalize
                                                                    ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                        booking.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                                                                            booking.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                                                                    }`}>
                                                                    {booking.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Live Map Stub */}
                                <div className="bg-emerald-900 text-white rounded-xl shadow-sm p-6 flex flex-col justify-center items-center text-center">
                                    <MapPin size={48} className="mb-4 text-emerald-600 animate-bounce" />
                                    <h3 className="text-lg font-bold">God's Eye Map</h3>
                                    <p className="text-white/60 text-sm mt-2">Real-time driver tracking will be rendered here via Socket.io.</p>
                                    <button className="mt-6 px-4 py-2 bg-emerald-600 text-emerald-900 font-bold rounded-lg hover:brightness-110 transition-all">
                                        Launch Map View
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {currentView === 'bookings' && (
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-8 border border-white/5">
                            <h3 className="text-lg font-bold text-emerald-900 dark:text-white mb-4">All Bookings</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-sm text-slate-500 border-b">
                                            <th className="pb-3">ID</th>
                                            <th className="pb-3">Customer/Guest</th>
                                            <th className="pb-3">Type</th>
                                            <th className="pb-3">Route</th>
                                            <th className="pb-3">Date</th>
                                            <th className="pb-3">Price</th>
                                            <th className="pb-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {bookings.map((booking) => (
                                            <tr key={booking._id} className="border-b dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-emerald-900 dark:text-white">
                                                <td className="py-4 font-medium text-emerald-900 dark:text-emerald-400">#{booking._id.slice(-6)}</td>
                                                <td className="py-4">
                                                    {booking.customer ? 'Reg. User' : (booking.guestPhone || 'Guest')}
                                                </td>
                                                <td className="py-4 capitalize">{booking.vehicleType}</td>
                                                <td className="py-4 text-slate-500 dark:text-slate-400">
                                                    <div className="max-w-[200px] truncate" title={booking.pickupLocation?.address}>{booking.pickupLocation?.address}</div>
                                                    <div className="text-xs text-gray-300 dark:text-slate-600">to</div>
                                                    <div className="max-w-[200px] truncate" title={booking.dropoffLocation?.address}>{booking.dropoffLocation?.address}</div>
                                                </td>
                                                <td className="py-4">
                                                    <div>{booking.scheduledDate}</div>
                                                    <div className="text-xs text-gray-400 dark:text-slate-500">{booking.scheduledTime}</div>
                                                </td>
                                                <td className="py-4 font-bold">Rs {booking.totalPrice?.toLocaleString()}</td>
                                                <td className="py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold capitalize
                                                                ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            booking.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                                                                booking.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                                                        }`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {currentView === 'pricing' && (
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-8 border border-white/5">
                            <h2 className="text-2xl font-bold text-emerald-900 dark:text-white mb-6">Pricing Configuration</h2>
                            <p className="text-gray-500 dark:text-slate-400 mb-6">Manage vehicle rates and tiers dynamically across different service categories.</p>

                            {isLoading ? <p>Loading...</p> : (
                                <div className="grid gap-6">
                                    {vehiclePricing.map((v) => (
                                        <div key={v._id} className="border dark:border-white/5 p-4 rounded-xl hover:border-emerald-600 transition-colors">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-4">
                                                    <img src={v.image} alt={v.name} className="w-16 h-10 object-contain bg-slate-50 dark:bg-white/5 rounded" />
                                                    <div>
                                                        <h3 className="font-bold text-lg text-emerald-900 dark:text-white flex items-center gap-2">
                                                            {v.name}
                                                            <span className="text-[10px] px-2 py-0.5 bg-emerald-900 dark:bg-emerald-600 text-white rounded-full uppercase tracking-tighter">
                                                                {v.category || 'Legacy'}
                                                            </span>
                                                        </h3>
                                                        <p className="text-sm text-gray-400 dark:text-slate-500">{v.model}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleEditClick(v)}
                                                    className="text-blue-500 text-sm font-bold hover:underline"
                                                >
                                                    Edit
                                                </button>
                                            </div>

                                            {/* Tiers Preview */}
                                            <div className="text-sm text-gray-600 dark:text-slate-400 bg-slate-50 dark:bg-white/5 p-3 rounded">
                                                <p className="font-bold text-xs uppercase mb-2">Pricing Tiers:</p>
                                                <div className="grid grid-cols-2 gap-y-1">
                                                    {v.tiers.map((t, i) => (
                                                        <div key={i} className="flex justify-between border-b border-gray-100 dark:border-white/5 last:border-0 pb-1">
                                                            <span>0 - {t.max === 'Infinity' || t.max === null ? '∞' : t.max} km</span>
                                                            <span className="font-bold">{t.type === 'flat' ? `Rs ${t.price}` : `Rs ${t.rate}/km`}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {currentView === 'drivers' && (
                        <DriversFleetView bookings={bookings} />
                    )}

                    {/* EDIT MODAL OVERLAY */}
                    {editingVehicle && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/5">
                                <h2 className="text-xl font-bold text-emerald-900 dark:text-white mb-4">Edit Pricing: {editingVehicle.name}</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-slate-400">Display Name</label>
                                        <input
                                            value={editForm.name || ''}
                                            onChange={(e) => handleFormChange(e, 'name')}
                                            className="w-full p-2 bg-white dark:bg-slate-800 border dark:border-white/10 rounded mt-1 text-emerald-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-slate-400">Model</label>
                                        <input
                                            value={editForm.model || ''}
                                            onChange={(e) => handleFormChange(e, 'model')}
                                            className="w-full p-2 bg-white dark:bg-slate-800 border dark:border-white/10 rounded mt-1 text-emerald-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-slate-400">Category</label>
                                        <select
                                            value={editForm.category || 'airport-transfer'}
                                            onChange={(e) => handleFormChange(e, 'category')}
                                            className="w-full p-2 bg-white dark:bg-slate-800 border dark:border-white/10 rounded mt-1 text-emerald-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-600"
                                        >
                                            <option value="airport-transfer">Airport Transfer</option>
                                            <option value="ride-now">Ride Now</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-slate-400 mb-2">Pricing Tiers</label>
                                        <div className="space-y-3">
                                            {editForm.tiers?.map((tier, i) => (
                                                <div key={i} className="flex gap-2 items-center bg-slate-50 dark:bg-white/5 p-2 rounded border dark:border-white/10">
                                                    <div className="w-1/4">
                                                        <label className="text-xs text-gray-500 dark:text-slate-500">Max KM</label>
                                                        <input
                                                            value={tier.max || ''}
                                                            onChange={(e) => handleFormChange(e, 'max', i)}
                                                            className="w-full p-1 bg-white dark:bg-slate-800 border dark:border-white/10 rounded text-sm text-emerald-900 dark:text-white"
                                                            placeholder="Infinity for last"
                                                        />
                                                    </div>
                                                    <div className="w-1/4">
                                                        <label className="text-xs text-gray-500 dark:text-slate-500">Type</label>
                                                        <select
                                                            value={tier.type}
                                                            onChange={(e) => handleFormChange(e, 'type', i)}
                                                            className="w-full p-1 bg-white dark:bg-slate-800 border dark:border-white/10 rounded text-sm text-emerald-900 dark:text-white"
                                                        >
                                                            <option value="flat">Flat Rate</option>
                                                            <option value="per_km">Per KM</option>
                                                        </select>
                                                    </div>
                                                    <div className="w-1/4">
                                                        <label className="text-xs text-gray-500 dark:text-slate-500">{tier.type === 'flat' ? 'Price' : 'Rate'}</label>
                                                        <input
                                                            value={tier.type === 'flat' ? (tier.price || '') : (tier.rate || '')}
                                                            onChange={(e) => handleFormChange(e, tier.type === 'flat' ? 'price' : 'rate', i)}
                                                            className="w-full p-1 bg-white dark:bg-slate-800 border dark:border-white/10 rounded text-sm text-emerald-900 dark:text-white"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        onClick={() => setEditingVehicle(null)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSavePricing}
                                        className="px-6 py-2 bg-emerald-600 text-emerald-900 font-bold rounded shadow hover:bg-yellow-400"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
