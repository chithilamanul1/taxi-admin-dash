'use client';

import { useState, useEffect } from 'react';
import { MapPin, DollarSign, Clock, Edit2, Trash2, Plus, Check, X, Loader2, Image as ImageIcon, Search, Tag, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VEHICLE_TYPES = [
    "Mini Car", "Sedan", "Mini Van", "KDH Van", "SUV", "Bus", "Tuk Tuk"
];

export default function DestinationManager() {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({});

    useEffect(() => {
        fetchDestinations();
    }, []);

    const fetchDestinations = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/destinations');
            const data = await res.json();
            if (data.success) setDestinations(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const method = form._id ? 'PUT' : 'POST';
        try {
            const res = await fetch('/api/admin/destinations', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (data.success) {
                alert('Saved successfully');
                setEditing(null);
                fetchDestinations();
            } else {
                alert(data.error || 'Failed to save');
            }
        } catch (err) {
            alert('Error occurred');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this destination?')) return;
        try {
            const res = await fetch(`/api/admin/destinations?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchDestinations();
        } catch (err) {
            alert('Delete failed');
        }
    };

    const startEdit = (dest) => {
        setEditing(dest.id);
        const pricingMap = dest.pricing instanceof Map ? Object.fromEntries(dest.pricing) : (dest.pricing || {});
        const vehicleRatesMap = dest.vehicleRateOverrides instanceof Map ? Object.fromEntries(dest.vehicleRateOverrides) : (dest.vehicleRateOverrides || {});
        setForm({ ...dest, pricing: pricingMap, vehicleRateOverrides: vehicleRatesMap });
    };

    const updatePricing = (vehicle, value) => {
        setForm({
            ...form,
            pricing: {
                ...(form.pricing || {}),
                [vehicle]: Number(value)
            }
        });
    };

    const filtered = destinations.filter(d =>
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Manual Rate Management</h2>
                            <p className="text-xs text-slate-500">Fixed rates for specific destinations (Overrides auto-pricing)</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search destinations..."
                                className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none w-64"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => {
                                setEditing('NEW');
                                setForm({
                                    id: `loc-${Date.now()}`,
                                    title: '',
                                    name: '',
                                    pricing: {},
                                    perKmRateOverride: 0,
                                    sortOrder: destinations.length + 1
                                });
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                        >
                            <Plus size={16} /> Add Destination
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-400" size={32} /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((dest) => (
                            <div key={dest.id} className="group relative bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-xl transition-all">
                                <div className="h-32 bg-slate-200 dark:bg-slate-800 relative">
                                    {dest.img ? (
                                        <img src={dest.img} alt={dest.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon size={32} /></div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        <button onClick={() => startEdit(dest)} className="p-2 bg-white/90 dark:bg-slate-900/90 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors shadow-sm"><Edit2 size={14} /></button>
                                        <button onClick={() => handleDelete(dest._id)} className="p-2 bg-white/90 dark:bg-slate-900/90 rounded-lg text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors shadow-sm"><Trash2 size={14} /></button>
                                    </div>
                                    <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/40 backdrop-blur rounded-lg text-white text-[10px] font-bold uppercase tracking-widest">
                                        {dest.time || 'N/A'} • {dest.distance || 'N/A'}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{dest.title}</h3>
                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-full">{dest.badge || 'Standard'}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">{dest.description || 'No description provided.'}</p>

                                    <div className="space-y-2 border-t border-slate-200 dark:border-white/5 pt-3">
                                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                            <span>Vehicle Type</span>
                                            <span>Fixed Rate (USD)</span>
                                        </div>
                                        {VEHICLE_TYPES.slice(0, 4).map(v => (
                                            <div key={v} className="flex justify-between items-center">
                                                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{v}</span>
                                                <span className="text-xs font-black text-emerald-600">${dest.pricing?.[v] || (dest.pricing?.get?.(v)) || '—'}</span>
                                            </div>
                                        ))}
                                        {dest.perKmRateOverride > 0 && (
                                            <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-white/5">
                                                <span className="text-[10px] font-bold text-amber-600 uppercase">Rate Override</span>
                                                <span className="text-xs font-black text-amber-600">LKR {dest.perKmRateOverride}/km</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {editing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                        >
                            <div className="px-8 py-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-white/5">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{editing === 'NEW' ? 'New Destination' : 'Edit Rate Plan'}</h3>
                                    <p className="text-xs text-slate-500">Configure override rates for this location</p>
                                </div>
                                <button onClick={() => setEditing(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-colors"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Full Title (e.g. Airport to Galle)</label>
                                            <input required type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Short Name (Galle)</label>
                                                <input required type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Badge (Top Choice)</label>
                                                <input type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none" value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Image URL</label>
                                            <div className="relative">
                                                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                <input type="text" className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none" value={form.img} onChange={e => setForm({ ...form, img: e.target.value })} placeholder="https://..." />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Distance (km)</label>
                                                <input type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none" value={form.distance} onChange={e => setForm({ ...form, distance: e.target.value })} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Est. Time</label>
                                                <input type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-6">
                                        <div className="bg-amber-50 dark:bg-amber-500/5 p-6 rounded-[2rem] border border-amber-500/10">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                                <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
                                                    <Tag size={16} /> Per KM Rate Overrides
                                                </h4>
                                                <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                                                    <span className="text-[10px] font-bold text-amber-600 uppercase">Global Fallback</span>
                                                    <div className="relative w-24">
                                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-amber-600 text-[10px] font-bold">LKR</span>
                                                        <input
                                                            type="number"
                                                            className="w-full pl-8 pr-2 py-1 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/30 rounded-lg text-xs font-bold outline-none"
                                                            value={form.perKmRateOverride || ''}
                                                            onChange={e => setForm({ ...form, perKmRateOverride: Number(e.target.value) })}
                                                            placeholder="130"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                {VEHICLE_TYPES.map(v => (
                                                    <div key={v} className="bg-white dark:bg-slate-900/50 p-4 rounded-2xl border border-amber-500/10 space-y-2">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none block">{v}</label>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 text-[10px] font-bold">LKR</span>
                                                            <input
                                                                type="number"
                                                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                                                                value={form.vehicleRateOverrides?.[v] || ''}
                                                                onChange={e => setForm({
                                                                    ...form,
                                                                    vehicleRateOverrides: {
                                                                        ...(form.vehicleRateOverrides || {}),
                                                                        [v]: Number(e.target.value)
                                                                    }
                                                                })}
                                                                placeholder="Rate..."
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-4 p-3 bg-amber-500/10 rounded-xl border border-amber-500/10">
                                                <p className="text-[10px] text-amber-600/90 font-bold flex items-center gap-2">
                                                    <Info size={12} /> Specific vehicle rates take priority over the global fallback rate.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Description</label>
                                        <textarea className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none h-24 resize-none" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
                                    <button type="button" onClick={() => setEditing(null)} className="flex-1 py-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 rounded-2xl font-bold transition-all">Cancel</button>
                                    <button type="submit" className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all">
                                        <Check size={20} />
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
