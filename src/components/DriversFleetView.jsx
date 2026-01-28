'use client';

import React, { useState, useEffect } from 'react';
import { Car, Phone, MapPin, User, Plus, CheckCircle, XCircle, Loader2, UserPlus, X, ShieldCheck, FileText, AlertCircle } from 'lucide-react';

const DriversFleetView = ({ bookings = [] }) => {
    const [drivers, setDrivers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active'); // 'active' | 'pending'
    const [showAddModal, setShowAddModal] = useState(false);
    const [assignModal, setAssignModal] = useState({ open: false, bookingId: null });
    const [approvalModal, setApprovalModal] = useState(null); // Driver object to approve
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newDriver, setNewDriver] = useState({
        name: '',
        phone: '',
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
                setDrivers([]);
            }
        } catch (err) {
            console.error('Error fetching drivers:', err);
            setDrivers([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter drivers based on tab
    const activeDrivers = drivers.filter(d => d.verificationStatus === 'verified' || !d.verificationStatus); // Support legacy drivers without status
    const pendingDrivers = drivers.filter(d => d.verificationStatus === 'pending' || d.verificationStatus === 'unverified');

    // Approve Driver Logic
    const handleApprove = async (driverId, action) => {
        if (!confirm(`Are you sure you want to ${action} this driver?`)) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/drivers/${driverId}/approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }) // 'approve' or 'reject'
            });
            const data = await res.json();
            if (data.success) {
                alert(`Driver ${action}d successfully`);
                setApprovalModal(null);
                fetchDrivers();
            } else {
                alert(data.message || 'Action failed');
            }
        } catch (e) {
            console.error(e);
            alert('Server error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Assign driver to booking (existing logic)
    const assignDriver = async (driverId, bookingId) => {
        try {
            await fetch(`/api/bookings/${bookingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assignedDriver: driverId, status: 'assigned' })
            });
            await fetch(`/api/drivers/${driverId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'busy' })
            });

            // Notification logic...
            const notifRes = await fetch('/api/notifications/driver-assigned', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId, driverId })
            });
            const notifData = await notifRes.json();

            setAssignModal({ open: false, bookingId: null });
            fetchDrivers();

            if (notifData.whatsappLinks?.customer) {
                if (confirm('Driver Assigned! Open WhatsApp to notify customer?')) {
                    window.open(notifData.whatsappLinks.customer, '_blank');
                }
            }
        } catch (err) {
            console.error('Error assigning driver:', err);
            alert('Failed to assign driver');
        }
    };

    // Create new driver (manual)
    const createDriver = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/drivers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newDriver, verificationStatus: 'verified' }) // Manual adds are auto-verified
            });
            if (res.ok) {
                setShowAddModal(false);
                setNewDriver({ name: '', phone: '', vehicleType: 'sedan', vehicleNumber: '' });
                fetchDrivers();
                alert('Driver added successfully!');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed');
            }
        } catch (err) {
            alert('Error creating driver');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-emerald-600" size={32} /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-emerald-900 dark:text-white">Fleet Management</h2>
                    <p className="text-gray-500 dark:text-slate-400">Manage drivers and approvals</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'active' ? 'bg-white text-emerald-900 shadow-sm' : 'text-gray-500 hover:text-emerald-900'}`}
                        >
                            Active Fleet ({activeDrivers.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'pending' ? 'bg-white text-emerald-900 shadow-sm flex items-center gap-2' : 'text-gray-500 hover:text-emerald-900 flex items-center gap-2'}`}
                        >
                            Requests
                            {pendingDrivers.length > 0 && <span className="bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">{pendingDrivers.length}</span>}
                        </button>
                    </div>
                    <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                        <Plus size={18} /> Add Driver
                    </button>
                </div>
            </div>

            {/* Pending Requests View */}
            {activeTab === 'pending' && (
                <div className="space-y-4 animate-fade-in-up">
                    {pendingDrivers.length === 0 ? (
                        <div className="bg-white p-12 rounded-2xl text-center border border-dashed border-gray-200">
                            <CheckCircle className="mx-auto text-emerald-200 mb-4" size={48} />
                            <h3 className="text-lg font-bold text-gray-500">All Caught Up!</h3>
                            <p className="text-gray-400 text-sm">No pending driver applications.</p>
                        </div>
                    ) : (
                        pendingDrivers.map(driver => (
                            <div key={driver._id} className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 font-bold text-lg">
                                        {driver.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-emerald-900">{driver.name}</h4>
                                        <div className="flex gap-3 text-xs text-gray-500 mt-1">
                                            <span className="flex items-center gap-1"><Phone size={12} /> {driver.phone}</span>
                                            <span className="flex items-center gap-1"><Car size={12} /> {driver.vehicleModel} ({driver.vehicleNumber})</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setApprovalModal(driver)}
                                        className="px-4 py-2 bg-emerald-900 text-white rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-emerald-800 transition-colors"
                                    >
                                        Review Application
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Active Fleet View (Grid) */}
            {activeTab === 'active' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up">
                    {activeDrivers.map(driver => (
                        <div key={driver._id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-white/5 hover:shadow-md transition-shadow relative group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${driver.isOnline ? 'bg-green-100' : 'bg-gray-100'}`}>
                                        <User size={24} className={driver.isOnline ? 'text-green-600' : 'text-gray-400'} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-emerald-900 dark:text-white">{driver.name}</h4>
                                        <p className="text-xs text-gray-500 uppercase">{driver.vehicleType}</p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold ${driver.isOnline ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                                    <span className={`w-2 h-2 rounded-full ${driver.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                                    {driver.isOnline ? 'Online' : 'Offline'}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                                <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-2">
                                    <p className="text-xs text-gray-500">Vehicle</p>
                                    <p className="font-bold text-emerald-900">{driver.vehicleNumber}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-2">
                                    <p className="text-xs text-gray-500">Status</p>
                                    <p className={`font-bold capitalize ${driver.status === 'free' ? 'text-green-600' : 'text-orange-600'}`}>{driver.status}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <a href={`tel:${driver.phone}`} className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 py-2 rounded-lg text-sm font-bold hover:bg-emerald-100 transition-colors">
                                    <Phone size={14} /> Call
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Approval Modal */}
            {approvalModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="text-xl font-bold text-emerald-900">Review Application</h3>
                            <button onClick={() => setApprovalModal(null)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Applicant</h4>
                                    <p className="text-lg font-bold text-emerald-900">{approvalModal.name}</p>
                                    <p className="text-gray-500">{approvalModal.phone}</p>
                                    <p className="text-gray-500">{approvalModal.email || 'No email provided'}</p>
                                    <p className="text-sm text-gray-500 mt-2">{approvalModal.address}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Vehicle</h4>
                                    <p className="text-lg font-bold text-emerald-900">{approvalModal.vehicleModel} ({approvalModal.vehicleYear})</p>
                                    <p className="text-gray-500">{approvalModal.vehicleNumber}</p>
                                    <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs font-bold uppercase mt-2">{approvalModal.vehicleType}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Documents</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {approvalModal.documents && Object.entries(approvalModal.documents).map(([key, url]) => (
                                        <div key={key} className="border rounded-xl p-3 hover:border-emerald-500 transition-colors cursor-pointer group relative">
                                            <p className="text-xs font-bold text-gray-500 capitalize mb-2">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                            {/* In production, use real images via next/image */}
                                            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                                {url ? (
                                                    <img src={url} alt={key} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">No file</span>
                                                )}
                                            </div>
                                            {url && (
                                                <a href={url} target="_blank" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold text-sm transition-opacity rounded-xl">View Full</a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4">
                            <button
                                onClick={() => handleApprove(approvalModal._id, 'reject')}
                                className="flex-1 py-3 bg-white border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => handleApprove(approvalModal._id, 'approve')}
                                disabled={isSubmitting}
                                className="flex-[2] py-3 bg-emerald-900 text-white rounded-xl font-bold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" /> : <ShieldCheck size={18} />}
                                Approve & Create Account
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Modal (Existing) */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    {/* Simplified manual add for brevity - same as before */}
                    <div className="bg-white p-6 rounded-xl w-96">
                        <h3 className="font-bold mb-4">Quick Add Driver</h3>
                        <form onSubmit={createDriver} className="space-y-3">
                            <input className="w-full border p-2 rounded" placeholder="Name" value={newDriver.name} onChange={e => setNewDriver({ ...newDriver, name: e.target.value })} required />
                            <input className="w-full border p-2 rounded" placeholder="Phone" value={newDriver.phone} onChange={e => setNewDriver({ ...newDriver, phone: e.target.value })} required />
                            <input className="w-full border p-2 rounded" placeholder="Vehicle No" value={newDriver.vehicleNumber} onChange={e => setNewDriver({ ...newDriver, vehicleNumber: e.target.value })} required />
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 p-2 bg-gray-100 rounded">Cancel</button>
                                <button type="submit" className="flex-1 p-2 bg-emerald-600 text-white rounded">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DriversFleetView;

