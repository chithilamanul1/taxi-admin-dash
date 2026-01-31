'use client';

import React, { useState, useEffect } from 'react';
import { Car, Phone, MapPin, User, Plus, CheckCircle, XCircle, Loader2, UserPlus, X, ShieldCheck, FileText, AlertCircle, Trash2, MessageCircle, Wallet } from 'lucide-react';

const DriversFleetView = ({ bookings = [] }) => {
    const [drivers, setDrivers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active'); // 'active' | 'pending'
    const [showAddModal, setShowAddModal] = useState(false);
    const [assignModal, setAssignModal] = useState({ open: false, bookingId: null });
    const [approvalModal, setApprovalModal] = useState(null); // Driver object to approve
    const [topupModal, setTopupModal] = useState(null); // Driver object to top up
    const [topupAmount, setTopupAmount] = useState('');
    const [topupReceipt, setTopupReceipt] = useState(null); // File
    const [receiptPreview, setReceiptPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lightbox, setLightbox] = useState({ open: false, url: '', title: '' });
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

    const handleDeleteDriver = async (driverId) => {
        if (!confirm('Are you sure you want to PERMANENTLY DELETE this driver?')) return;
        try {
            const res = await fetch(`/api/drivers/${driverId}`, { method: 'DELETE' });
            if (res.ok) {
                setDrivers(drivers.filter(d => d._id !== driverId));
                alert('Driver deleted successfully');
            } else {
                alert('Failed to delete driver');
            }
        } catch (e) {
            console.error(e);
            alert('Error deleting driver');
        }
    };

    // Filter drivers based on tab
    const activeDrivers = drivers.filter(d => d.verificationStatus === 'verified' || !d.verificationStatus); // Support legacy drivers without status
    const pendingDrivers = drivers.filter(d => d.verificationStatus === 'pending' || d.verificationStatus === 'unverified');

    // Top Up Wallet Logic
    const handleTopUp = async (e) => {
        e.preventDefault();
        if (!topupAmount || isNaN(topupAmount)) return;
        setIsSubmitting(true);
        try {
            let receiptUrl = null;

            // Upload receipt if exists
            if (topupReceipt) {
                const formData = new FormData();
                formData.append('file', topupReceipt);
                const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
                const uploadData = await uploadRes.json();
                if (uploadData.success) {
                    receiptUrl = uploadData.url;
                }
            }

            const res = await fetch(`/api/drivers/${topupModal._id}/wallet`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'topup',
                    amount: topupAmount,
                    receiptUrl
                })
            });
            const data = await res.json();
            if (data.success) {
                alert(`Successfully added Rs ${topupAmount} to wallet`);
                setTopupModal(null);
                setTopupAmount('');
                setTopupReceipt(null);
                setReceiptPreview(null);
                fetchDrivers();
            } else {
                alert(data.error);
            }
        } catch (e) {
            console.error(e);
            alert('Top up failed');
        } finally {
            setIsSubmitting(false);
        }
    };

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

    // Lightbox Component
    const Lightbox = ({ url, title, onClose }) => (
        <div
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-[110]"
            >
                <X size={28} />
            </button>
            <div
                className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center gap-4"
                onClick={e => e.stopPropagation()}
            >
                <div className="text-center">
                    <h3 className="text-white text-xl font-bold mb-1">{title}</h3>
                    <p className="text-white/50 text-xs uppercase tracking-widest font-bold">Image Preview</p>
                </div>
                <div className="relative w-full h-[80vh] flex items-center justify-center">
                    <img
                        src={url}
                        alt={title}
                        className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-500"
                    />
                </div>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full text-sm font-bold backdrop-blur-sm transition-all border border-white/10"
                >
                    Open in New Tab
                </a>
            </div>
        </div>
    );

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
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-orange-600 text-white px-6 py-2.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 active:scale-95 shrink-0"
                    >
                        <Plus size={18} strokeWidth={3} /> Add Driver
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
                            <div key={driver._id} className="bg-white p-6 rounded-3xl shadow-sm border border-orange-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:shadow-md">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 font-black text-2xl border border-orange-100 shadow-sm shrink-0">
                                        {driver.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-black text-xl text-emerald-900 truncate">{driver.name}</h4>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1 font-bold">
                                            <span className="flex items-center gap-1.5"><Phone size={14} className="text-orange-500" /> {driver.phone}</span>
                                            <span className="flex items-center gap-1.5"><Car size={14} className="text-orange-500" /> {driver.vehicleModel} <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded uppercase">{driver.vehicleNumber}</span></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-auto shrink-0 mt-2 md:mt-0">
                                    <button
                                        onClick={() => setApprovalModal(driver)}
                                        className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
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

                            {/* Wallet Section */}
                            <div className="mb-4 bg-emerald-50/50 dark:bg-emerald-900/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/20 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] text-emerald-800 dark:text-emerald-400 font-bold uppercase tracking-wider">Wallet Balance</p>
                                    <p className={`font-mono font-bold text-lg ${driver.walletBalance < 5000 ? 'text-red-600' : 'text-emerald-900 dark:text-emerald-300'}`}>
                                        Rs {(driver.walletBalance || 0).toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setTopupModal(driver)}
                                    className="bg-emerald-900 text-white text-xs px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-800"
                                >
                                    + Top Up
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <a href={`tel:${driver.phone}`} className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 py-2 rounded-lg text-sm font-bold hover:bg-emerald-100 transition-colors">
                                    <Phone size={14} /> Call
                                </a>
                                <a
                                    href={`https://wa.me/${driver.phone?.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-600 py-2 rounded-lg text-sm font-bold hover:bg-green-100 transition-colors border border-green-200"
                                >
                                    <MessageCircle size={14} /> Chat
                                </a>
                                <button
                                    onClick={() => handleDeleteDriver(driver._id)}
                                    className="w-10 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
                                    title="Delete Driver"
                                >
                                    <Trash2 size={16} />
                                </button>
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
                                        <div
                                            key={key}
                                            className="border rounded-xl p-3 hover:border-emerald-500 transition-colors cursor-pointer group relative bg-slate-50/50"
                                            onClick={() => url && setLightbox({ open: true, url, title: key.replace(/([A-Z])/g, ' $1').trim() })}
                                        >
                                            <p className="text-xs font-bold text-gray-500 capitalize mb-2">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                            <div className="aspect-video bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-100 shadow-inner">
                                                {url ? (
                                                    <img
                                                        src={url}
                                                        alt={key}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "https://placehold.co/600x400?text=File+Not+Found";
                                                            e.target.className = "w-full h-full object-contain p-4 opacity-50";
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-1 opacity-20">
                                                        <FileText size={20} />
                                                        <span className="text-[10px] uppercase font-black">No file</span>
                                                    </div>
                                                )}
                                            </div>
                                            {url && (
                                                <div className="absolute inset-0 bg-emerald-900/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white font-bold text-xs transition-opacity rounded-xl z-10 backdrop-blur-[2px]">
                                                    <Plus size={20} className="mb-1" />
                                                    Click to view
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {approvalModal.initialDeposit && approvalModal.initialDeposit.amount > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-amber-50/50">
                                <h4 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Wallet size={16} /> Initial Deposit Verification
                                </h4>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm">
                                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Declared Amount</p>
                                        <p className="text-2xl font-mono font-bold text-emerald-900">Rs {approvalModal.initialDeposit.amount.toLocaleString()}</p>
                                        <div className="mt-2 text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded inline-block font-bold">
                                            Status: {approvalModal.initialDeposit.status}
                                        </div>
                                    </div>

                                    <div
                                        className="border rounded-xl p-3 bg-white hover:border-emerald-500 transition-colors group relative cursor-pointer"
                                        onClick={() => approvalModal.initialDeposit.receipt && setLightbox({ open: true, url: approvalModal.initialDeposit.receipt, title: 'Initial Deposit Receipt' })}
                                    >
                                        <p className="text-xs font-bold text-gray-500 mb-2">Receipt Proof</p>
                                        <div className="aspect-video bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
                                            {approvalModal.initialDeposit.receipt ? (
                                                <img
                                                    src={approvalModal.initialDeposit.receipt}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    alt="Deposit Receipt"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://placehold.co/600x400?text=No+Receipt";
                                                        e.target.className = "w-full h-full object-contain p-4 opacity-50";
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center gap-1 opacity-20 text-gray-400">
                                                    <FileText size={20} />
                                                    <span className="text-[10px] uppercase font-black text-center px-4">No receipt uploaded</span>
                                                </div>
                                            )}
                                        </div>
                                        {approvalModal.initialDeposit.receipt && (
                                            <div className="absolute inset-0 bg-emerald-900/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white font-bold text-xs transition-opacity rounded-xl z-10 backdrop-blur-[2px]">
                                                <Plus size={20} className="mb-1" />
                                                Click to view
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-4 italic">
                                    * Approving this driver will automatically credit <strong>Rs {approvalModal.initialDeposit.amount.toLocaleString()}</strong> to their wallet.
                                </p>
                            </div>
                        )}
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

            {/* Top Up Modal */}
            {topupModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-slide-up">
                        <h3 className="text-lg font-bold text-emerald-900 dark:text-white mb-4">Top Up Wallet</h3>
                        <p className="text-sm text-gray-500 mb-4">Adding funds for <strong>{topupModal.name}</strong></p>

                        <form onSubmit={handleTopUp}>
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Amount (LKR)</label>
                                <input
                                    type="number"
                                    className="w-full p-3 border rounded-xl font-mono text-lg font-bold outline-none ring-emerald-500 focus:ring-2"
                                    placeholder="5000"
                                    value={topupAmount}
                                    onChange={e => setTopupAmount(e.target.value)}
                                    required
                                    min="100"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Proof of Transfer (Receipt)</label>
                                <div className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl p-4 text-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setTopupReceipt(file);
                                                setReceiptPreview(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                    {receiptPreview ? (
                                        <div className="relative">
                                            <img src={receiptPreview} className="h-32 mx-auto rounded-lg object-contain" />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setTopupReceipt(null);
                                                    setReceiptPreview(null);
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400">
                                            <FileText className="mx-auto mb-2" size={24} />
                                            <p className="text-xs">Click to upload receipt image</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button type="button" onClick={() => setTopupModal(null)} className="flex-1 py-3 bg-gray-100 dark:bg-white/10 rounded-xl font-bold text-gray-500">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-emerald-900 text-white rounded-xl font-bold flex justify-center items-center gap-2">
                                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <span>Confirm</span>}
                                </button>
                            </div>
                        </form>
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
            {/* Lightbox Rendering */}
            {lightbox.open && (
                <Lightbox
                    url={lightbox.url}
                    title={lightbox.title}
                    onClose={() => setLightbox({ ...lightbox, open: false })}
                />
            )}
        </div>
    );
};

export default DriversFleetView;

