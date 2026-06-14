'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Ticket, Check, AlertCircle } from 'lucide-react';

export default function CouponManager() {
    const [coupons, setCoupons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        code: '', discountType: 'percentage', value: '', expiryDate: '', usageLimit: '', 
        description: '', isActive: true, displayInWidget: false, applicableLocations: '', applicableFor: 'all'
    });

    useEffect(() => { fetchCoupons(); }, []);

    const fetchCoupons = async () => {
        try {
            const res = await fetch('/api/coupons');
            const data = await res.json();
            if (res.ok) setCoupons(data);
            else setError(data.error || 'Failed to fetch coupons');
        } catch (err) { setError('Network error fetching coupons'); }
        setIsLoading(false);
    };

    const handleEdit = (coupon) => {
        setEditingId(coupon._id);
        setFormData({
            ...coupon,
            expiryDate: coupon.expiryDate ? coupon.expiryDate.split('T')[0] : '',
            applicableLocations: coupon.applicableLocations ? coupon.applicableLocations.join(', ') : '',
            applicableFor: coupon.applicableFor || 'all',
            usageLimit: coupon.usageLimit || ''
        });
        setError(''); setSuccess('');
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({ code: '', discountType: 'percentage', value: '', expiryDate: '', usageLimit: '', description: '', isActive: true, displayInWidget: false, applicableLocations: '', applicableFor: 'all' });
        setError('');
    };

    const handleSave = async () => {
        try {
            const payload = {
                ...formData,
                applicableLocations: formData.applicableLocations.split(',').map(l => l.trim()).filter(Boolean),
                usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
                value: parseFloat(formData.value)
            };

            const res = await fetch('/api/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Failed to save coupon');
                return;
            }

            setSuccess('Coupon saved successfully');
            handleCancel();
            fetchCoupons();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to save coupon');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;
        try {
            const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setSuccess('Coupon deleted');
                fetchCoupons();
            } else {
                setError('Failed to delete coupon');
            }
        } catch (err) { setError('Failed to delete coupon'); }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Ticket size={24} className="text-emerald-600" />
                        Coupon Management
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Create and manage discount codes for rides and tours.</p>
                </div>
                {!editingId && (
                    <button onClick={() => handleEdit({ code: '' })} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors">
                        <Plus size={16} /> Add Coupon
                    </button>
                )}
            </div>

            <div className="p-6">
                {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm"><AlertCircle size={16} />{error}</div>}
                {success && <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 rounded-xl flex items-center gap-2 text-sm"><Check size={16} />{success}</div>}

                {editingId !== null && (
                    <div className="mb-8 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                        <h3 className="font-bold text-slate-800 mb-4">{editingId ? 'Edit Coupon' : 'New Coupon'}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Coupon Code *</label>
                                <input type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className="w-full p-2 border border-slate-300 rounded-lg text-sm" placeholder="e.g. SUMMER20" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Discount Type</label>
                                <select value={formData.discountType} onChange={e => setFormData({ ...formData, discountType: e.target.value })} className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white">
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="flat">Flat Amount</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Applicable For</label>
                                <select value={formData.applicableFor} onChange={e => setFormData({ ...formData, applicableFor: e.target.value })} className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white">
                                    <option value="all">All Trips</option>
                                    <option value="transfers">Airport Transfers Only</option>
                                    <option value="round-trips">Round Trips Only</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Value *</label>
                                <input type="number" value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value })} className="w-full p-2 border border-slate-300 rounded-lg text-sm" placeholder={formData.discountType === 'percentage' ? "e.g. 10" : "e.g. 1500"} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Expiry Date</label>
                                <input type="date" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} className="w-full p-2 border border-slate-300 rounded-lg text-sm" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 mb-1">Applicable Locations (Comma separated)</label>
                                <input type="text" value={formData.applicableLocations} onChange={e => setFormData({ ...formData, applicableLocations: e.target.value })} className="w-full p-2 border border-slate-300 rounded-lg text-sm" placeholder="e.g. Galle, Ella, Mirissa (Leave blank for all)" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Usage Limit</label>
                                <input type="number" value={formData.usageLimit} onChange={e => setFormData({ ...formData, usageLimit: e.target.value })} className="w-full p-2 border border-slate-300 rounded-lg text-sm" placeholder="e.g. 100" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Description</label>
                                <input type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border border-slate-300 rounded-lg text-sm" placeholder="e.g. 10% off for Galle" />
                            </div>
                            <div className="flex items-center gap-2 md:col-span-2 mt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 text-emerald-600 rounded" />
                                    <span className="text-sm font-medium text-slate-700">Active</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer ml-6">
                                    <input type="checkbox" checked={formData.displayInWidget} onChange={e => setFormData({ ...formData, displayInWidget: e.target.checked })} className="w-4 h-4 text-emerald-600 rounded" />
                                    <span className="text-sm font-medium text-slate-700">Display in Widget</span>
                                </label>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-colors"><Save size={16} /> Save Coupon</button>
                        </div>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="text-xs uppercase bg-slate-50 text-slate-500">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-xl">Code</th>
                                    <th className="px-4 py-3">Value</th>
                                    <th className="px-4 py-3">Locations</th>
                                    <th className="px-4 py-3">Valid For</th>
                                    <th className="px-4 py-3">Usage</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 rounded-tr-xl text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coupons.map((coupon) => (
                                    <tr key={coupon._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-3 font-bold text-slate-800">{coupon.code}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md font-bold text-xs">
                                                {coupon.discountType === 'percentage' ? `${coupon.value}% OFF` : `Rs. ${coupon.value}`}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 max-w-[200px] truncate" title={coupon.applicableLocations?.join(', ')}>
                                            {coupon.applicableLocations?.length ? coupon.applicableLocations.join(', ') : <span className="text-slate-400 italic">All Locations</span>}
                                        </td>
                                        <td className="px-4 py-3 text-xs">
                                            {coupon.applicableFor === 'round-trips' ? 'Round Trips' : coupon.applicableFor === 'transfers' ? 'Transfers' : 'All Trips'}
                                        </td>
                                        <td className="px-4 py-3 text-xs">
                                            {coupon.usedCount || 0} / {coupon.usageLimit ? coupon.usageLimit : '∞'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${coupon.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                                            {coupon.isActive ? 'Active' : 'Inactive'}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEdit(coupon)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><Edit2 size={16} /></button>
                                                <button onClick={() => handleDelete(coupon._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {coupons.length === 0 && (
                                    <tr><td colSpan="6" className="text-center py-8 text-slate-500">No coupons found. Create your first coupon to offer discounts!</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
