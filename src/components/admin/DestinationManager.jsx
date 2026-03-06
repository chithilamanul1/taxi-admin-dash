'use client';

import { useState, useEffect } from 'react';
import { MapPin, DollarSign, Clock, Edit2, Trash2, Plus, Check, X, Loader2, Image as ImageIcon, Search, Tag, Info, Car, Mountain, Zap, Shield, HelpCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LocationInput from '@/components/LocationInput';

const VEHICLE_TYPES = [
    { slug: "mini-car", label: "Mini Car" },
    { slug: "sedan", label: "Sedan" },
    { slug: "mini-van-every", label: "Mini Van (Every)" },
    { slug: "mini-van-05", label: "Mini Van (KDH)" },
    { slug: "suv", label: "SUV" },
    { slug: "mini-bus", label: "Mini Bus" },
    { slug: "bus", label: "Bus" }
];

export default function DestinationManager() {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({});
    const [selectedVehicle, setSelectedVehicle] = useState(VEHICLE_TYPES[0].slug);

    const VEHICLE_ICONS = {
        "mini-car": { icon: Zap, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        "sedan": { icon: Car, color: "text-blue-500", bg: "bg-blue-500/10" },
        "mini-van-every": { icon: Shield, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        "mini-van-05": { icon: ChevronRight, color: "text-purple-500", bg: "bg-purple-500/10" },
        "suv": { icon: Mountain, color: "text-red-500", bg: "bg-red-500/10" },
        "mini-bus": { icon: HelpCircle, color: "text-slate-500", bg: "bg-slate-500/10" },
        "bus": { icon: HelpCircle, color: "text-slate-500", bg: "bg-slate-500/10" },
        "tuk-tuk": { icon: Zap, color: "text-emerald-500", bg: "bg-emerald-500/10" }
    };

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
        const vehicleTiersMap = dest.vehicleTiers instanceof Map ? Object.fromEntries(dest.vehicleTiers) : (dest.vehicleTiers || {});
        setForm({ ...dest, pricing: pricingMap, vehicleRateOverrides: vehicleRatesMap, vehicleTiers: vehicleTiersMap });
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
            <div className="bg-white dark:bg-emerald-900 rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-emerald-900 dark:text-white">Manual Rate Management</h2>
                            <p className="text-[10px] md:text-xs text-slate-500 leading-tight">Fixed rates for specific destinations (Overrides auto-pricing)</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="relative flex-1 sm:flex-none">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search destinations..."
                                className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none w-full sm:w-64"
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
                                    vehicleRateOverrides: {},
                                    vehicleTiers: {},
                                    perKmRateOverride: 0,
                                    sortOrder: destinations.length + 1
                                });
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                        >
                            <Plus size={16} /> <span className="whitespace-nowrap">Add Destination</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-slate-400" size={32} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((dest) => (
                            <div key={dest.id} className="group relative bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-xl transition-all">
                                <div className="h-12 bg-slate-200 dark:bg-slate-800 relative flex items-center px-4">
                                    <h3 className="font-bold text-emerald-900 dark:text-white line-clamp-1">{dest.title}</h3>
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        <button onClick={() => startEdit(dest)} className="p-2 bg-white/90 dark:bg-emerald-900/90 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors shadow-sm">
                                            <Edit2 size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(dest._id)} className="p-2 bg-white/90 dark:bg-emerald-900/90 rounded-lg text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors shadow-sm">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-5 space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                            <span>Vehicle Type</span>
                                            <span>LKR/km</span>
                                        </div>
                                        {VEHICLE_TYPES.slice(0, 5).map(v => {
                                            const vOverrides = dest.vehicleRateOverrides instanceof Map ?
                                                Object.fromEntries(dest.vehicleRateOverrides) :
                                                (dest.vehicleRateOverrides || {});
                                            const vRate = vOverrides[v.slug];

                                            return (
                                                <div key={v.slug} className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{v.label}</span>
                                                    <span className={`text-[10px] font-bold ${vRate ? 'text-emerald-600' : 'text-slate-300 dark:text-slate-700'}`}>
                                                        {vRate ? `${vRate}` : (dest.perKmRateOverride > 0 ? `${dest.perKmRateOverride}` : '—')}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {dest.perKmRateOverride > 0 && (
                                        <div className="pt-2 border-t border-slate-200 dark:border-white/5 flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-emerald-600 uppercase">Global Fallback</span>
                                            <span className="text-xs font-black text-emerald-600">LKR {dest.perKmRateOverride}{"/km"}</span>
                                        </div>
                                    )}
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
                            className="bg-white dark:bg-emerald-900 rounded-3xl md:rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                        >
                            <div className="px-5 transition-all md:px-8 py-4 md:py-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-white/5">
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold text-emerald-900 dark:text-white">{editing === 'NEW' ? 'New Destination' : 'Edit Rate Plan'}</h3>
                                    <p className="text-[10px] md:text-xs text-slate-500">Configure override rates for this location</p>
                                </div>
                                <button onClick={() => setEditing(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-colors"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6 md:space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Destination Location (Google Search)</label>
                                            <LocationInput
                                                placeholder="Search for a city or place..."
                                                value={form.name}
                                                onChange={(val) => setForm({ ...form, name: val, title: val ? `Airport to ${val}` : '' })}
                                                onSelect={({ address }) => {
                                                    setForm({ ...form, name: address, title: `Airport to ${address}` });
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Full Display Title</label>
                                            <input required type="text" className="w-full px-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-2xl text-base font-bold outline-none ring-offset-0 focus:ring-4 focus:ring-blue-500/10 transition-all" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Airport to Galle Port" />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 p-6 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-slate-200 dark:border-white/5 space-y-6">
                                        <div className="flex flex-col gap-4">
                                            <div>
                                                <h4 className="text-xs md:text-sm font-black text-emerald-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                                    <Car size={18} className="text-blue-500" /> Vehicle Specific Wizard
                                                </h4>
                                                <p className="text-[10px] text-slate-500 font-medium">Select a vehicle to adjust its custom rates for this destination</p>
                                            </div>

                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-1.5 bg-white dark:bg-emerald-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm self-start sm:self-auto w-full sm:w-auto">
                                                <span className="text-[10px] font-black text-slate-400 uppercase px-2 py-1 sm:py-0 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800">Global Fallback</span>
                                                <div className="relative flex-1 sm:w-28 pl-2">
                                                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-600 text-[10px] font-black uppercase">LKR</span>
                                                    <input
                                                        type="number"
                                                        className="w-full pl-10 pr-2 py-2 bg-slate-50 dark:bg-white/5 border border-emerald-200 dark:border-emerald-900/40 rounded-xl text-xs font-black outline-none focus:ring-2 focus:ring-emerald-500/20"
                                                        value={form.perKmRateOverride || ''}
                                                        onChange={e => setForm({ ...form, perKmRateOverride: Number(e.target.value) })}
                                                        placeholder="130"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase px-2">Sort</label>
                                                <input type="number" className="w-16 px-2 py-1 bg-white dark:bg-emerald-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) })} />
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap md:flex-nowrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                            {VEHICLE_TYPES.map(v => {
                                                const IconComponent = VEHICLE_ICONS[v.slug]?.icon || Car;
                                                const isActive = selectedVehicle === v.slug;
                                                const hasOverride = (form.vehicleRateOverrides?.[v.slug] > 0) || (form.pricing?.[v.slug] > 0);

                                                return (
                                                    <button
                                                        key={v.slug}
                                                        type="button"
                                                        onClick={() => setSelectedVehicle(v.slug)}
                                                        className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-2xl border transition-all shrink-0 relative ${isActive
                                                            ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20'
                                                            : 'bg-white dark:bg-white/5 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-500/50'}`}
                                                    >
                                                        <IconComponent size={16} className={isActive ? 'text-white' : VEHICLE_ICONS[v.slug]?.color} />
                                                        <div className="text-left">
                                                            <div className="text-[9px] md:text-[10px] font-black uppercase tracking-wider md:tracking-widest opacity-80 leading-none">{v.label}</div>
                                                            {hasOverride && (
                                                                <div className={`text-[8px] md:text-[9px] font-bold mt-0.5 ${isActive ? 'text-blue-100' : 'text-emerald-500'}`}>Modified</div>
                                                            )}
                                                        </div>
                                                        {isActive && (
                                                            <motion.div layoutId="activeVehicle" className="absolute -bottom-1 left-2 right-2 h-0.5 md:h-1 bg-white rounded-full" />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-emerald-900/50 p-6 rounded-3xl border border-blue-500/20 shadow-inner">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-3 rounded-xl ${VEHICLE_ICONS[selectedVehicle]?.bg}`}>
                                                        {(() => {
                                                            const Icon = VEHICLE_ICONS[selectedVehicle]?.icon || Car;
                                                            return <Icon size={20} className={VEHICLE_ICONS[selectedVehicle]?.color} />;
                                                        })()}
                                                    </div>
                                                    <div>
                                                        <h5 className="text-base font-bold text-emerald-900 dark:text-white">{VEHICLE_TYPES.find(v => v.slug === selectedVehicle)?.label} Config</h5>
                                                        <p className="text-[10px] text-slate-500">Fine-tune rates for this specific vehicle category</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase pl-1">Custom Per-KM Rate (LKR)</label>
                                                        <div className="relative">
                                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 font-black">LKR</span>
                                                            <input
                                                                type="number"
                                                                className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-2xl text-lg font-black outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                                value={form.vehicleRateOverrides?.[selectedVehicle] || ''}
                                                                onChange={e => setForm({
                                                                    ...form,
                                                                    vehicleRateOverrides: {
                                                                        ...(form.vehicleRateOverrides || {}),
                                                                        [selectedVehicle]: Number(e.target.value)
                                                                    }
                                                                })}
                                                                placeholder={form.perKmRateOverride || "Global Default"}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-blue-500/5 rounded-2xl p-6 border border-blue-500/10 flex flex-col justify-center">
                                                <div className="flex items-start gap-3 mb-4">
                                                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-600"><Info size={16} /></div>
                                                    <div>
                                                        <h6 className="text-xs font-bold text-emerald-900 dark:text-white">Rate Logic Priority</h6>
                                                        <p className="text-[10px] text-slate-500 leading-relaxed mt-1">
                                                            1. <strong>Custom Rate ({VEHICLE_TYPES.find(v => v.slug === selectedVehicle)?.label})</strong>: Highest priority if set.<br />
                                                            2. <strong>Global Fallback ({form.perKmRateOverride || 130} LKR)</strong>: Used if no custom vehicle rate is set.<br />
                                                            3. <strong>Standard System Rates</strong>: Used if all overrides are zero.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-auto p-3 bg-white dark:bg-emerald-900 rounded-xl border border-blue-500/20 shadow-sm">
                                                    <div className="flex justify-between items-center text-[10px] font-bold">
                                                        <span className="text-slate-400 uppercase">Estimated Impact</span>
                                                        <span className="text-blue-500">Active Settings</span>
                                                    </div>
                                                    <div className="flex justify-between items-center mt-1">
                                                        <span className="text-sm font-black text-emerald-900 dark:text-white">Active Rate</span>
                                                        <span className="text-lg font-black text-emerald-600">
                                                            {form.vehicleRateOverrides?.[selectedVehicle] || form.perKmRateOverride || '--'}
                                                            <span className="text-[10px] ml-1 opacity-60">LKR/km</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-sm font-black text-emerald-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                                        <Zap size={18} className="text-emerald-500" /> Tiered Pricing ({selectedVehicle})
                                                    </h4>
                                                    <p className="text-[10px] text-slate-500 font-medium">Add distance ranges for specialized pricing (e.g. 0-20km flat rate)</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const currentTiers = form.vehicleTiers?.[selectedVehicle] || [];
                                                        setForm({
                                                            ...form,
                                                            vehicleTiers: {
                                                                ...(form.vehicleTiers || {}),
                                                                [selectedVehicle]: [...currentTiers, { minKm: 0, maxKm: 20, type: 'flat', value: 0 }]
                                                            }
                                                        });
                                                    }}
                                                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-2"
                                                >
                                                    <Plus size={14} /> Add Tier
                                                </button>
                                            </div>

                                            <div className="space-y-3">
                                                {(form.vehicleTiers?.[selectedVehicle] || []).map((tier, idx) => (
                                                    <div key={idx} className="flex flex-col md:flex-row items-stretch md:items-center gap-3 p-4 bg-white dark:bg-emerald-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative group">
                                                        <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3">
                                                            <div className="space-y-1">
                                                                <label className="text-[8px] font-black text-slate-400 uppercase">Min KM</label>
                                                                <input
                                                                    type="number"
                                                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                                                    value={tier.minKm}
                                                                    onChange={e => {
                                                                        const newTiers = [...form.vehicleTiers[selectedVehicle]];
                                                                        newTiers[idx].minKm = Number(e.target.value);
                                                                        setForm({ ...form, vehicleTiers: { ...form.vehicleTiers, [selectedVehicle]: newTiers } });
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[8px] font-black text-slate-400 uppercase">Max KM</label>
                                                                <input
                                                                    type="number"
                                                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                                                    value={tier.maxKm}
                                                                    onChange={e => {
                                                                        const newTiers = [...form.vehicleTiers[selectedVehicle]];
                                                                        newTiers[idx].maxKm = Number(e.target.value);
                                                                        setForm({ ...form, vehicleTiers: { ...form.vehicleTiers, [selectedVehicle]: newTiers } });
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[8px] font-black text-slate-400 uppercase">Type</label>
                                                                <select
                                                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/20 transition-all"
                                                                    value={tier.type}
                                                                    onChange={e => {
                                                                        const newTiers = [...form.vehicleTiers[selectedVehicle]];
                                                                        newTiers[idx].type = e.target.value;
                                                                        setForm({ ...form, vehicleTiers: { ...form.vehicleTiers, [selectedVehicle]: newTiers } });
                                                                    }}
                                                                >
                                                                    <option value="flat">Flat Price</option>
                                                                    <option value="per-km">Per KM</option>
                                                                </select>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[8px] font-black text-slate-400 uppercase">Value (LKR)</label>
                                                                <input
                                                                    type="number"
                                                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                                                    value={tier.value}
                                                                    onChange={e => {
                                                                        const newTiers = [...form.vehicleTiers[selectedVehicle]];
                                                                        newTiers[idx].value = Number(e.target.value);
                                                                        setForm({ ...form, vehicleTiers: { ...form.vehicleTiers, [selectedVehicle]: newTiers } });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newTiers = form.vehicleTiers[selectedVehicle].filter((_, i) => i !== idx);
                                                                setForm({ ...form, vehicleTiers: { ...form.vehicleTiers, [selectedVehicle]: newTiers } });
                                                            }}
                                                            className="absolute top-2 right-2 md:static p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                                {(form.vehicleTiers?.[selectedVehicle] || []).length === 0 && (
                                                    <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No tiers defined for {selectedVehicle}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-white/10">
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
