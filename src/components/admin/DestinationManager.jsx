'use client';

import { useState, useEffect } from 'react';
import { MapPin, DollarSign, Clock, Edit2, Trash2, Plus, Check, X, Loader2, Image as ImageIcon, Search, Tag, Info, Car, Mountain, Zap, Shield, HelpCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LocationInput from '@/components/LocationInput';

const VEHICLE_TYPES = [
    { slug: "mini-car", label: "Mini Car" },
    { slug: "sedan", label: "Sedan" },
    { slug: "vezel", label: "Honda Vezel" },
    { slug: "suv", label: "SUV" },
    { slug: "mini-van-every", label: "Mini Van (Every)" },
    { slug: "mini-van-05", label: "Mini Van 4 Seat" },
    { slug: "normal-kdh", label: "Van KDH" },
    { slug: "kdh-van", label: "Mini Bus" },
    { slug: "mini-bus", label: "Coaster Bus" },
    { slug: "coach-bus", label: "Coach Bus" }
];

export default function DestinationManager() {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({});
    const [selectedVehicle, setSelectedVehicle] = useState(VEHICLE_TYPES[0].slug);
    const [saving, setSaving] = useState(false);
    const [activeModalTab, setActiveModalTab] = useState('transfers');

    const VEHICLE_ICONS = {
        "mini-car": { icon: Zap, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        "sedan": { icon: Car, color: "text-blue-500", bg: "bg-blue-500/10" },
        "vezel": { icon: Car, color: "text-blue-500", bg: "bg-blue-500/10" },
        "suv": { icon: Mountain, color: "text-red-500", bg: "bg-red-500/10" },
        "mini-van-every": { icon: Shield, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        "mini-van-05": { icon: ChevronRight, color: "text-purple-500", bg: "bg-purple-500/10" },
        "normal-kdh": { icon: Shield, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        "kdh-van": { icon: Shield, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        "mini-bus": { icon: HelpCircle, color: "text-slate-500", bg: "bg-slate-500/10" },
        "coach-bus": { icon: HelpCircle, color: "text-slate-500", bg: "bg-slate-500/10" }
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
        setSaving(true);
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
        } finally {
            setSaving(false);
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
        const packagesList = dest.roundTripPackages || [];
        setForm({ ...dest, pricing: pricingMap, vehicleRateOverrides: vehicleRatesMap, vehicleTiers: vehicleTiersMap, roundTripPackages: packagesList });
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
                                    pickupLocation: '',
                                    pricing: {},
                                    vehicleRateOverrides: {},
                                    vehicleTiers: {},
                                    roundTripPackages: [],
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
                                    {/* Normal rates summary */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                            <span>Fixed Rates</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(() => {
                                                const pricing = dest.pricing instanceof Map ? Object.fromEntries(dest.pricing) : (dest.pricing || {});
                                                const entries = Object.entries(pricing).filter(([, v]) => v > 0);
                                                if (entries.length === 0) return <span className="text-[10px] text-slate-400 italic">No fixed rates set</span>;
                                                return entries.slice(0, 4).map(([veh, price]) => (
                                                    <span key={veh} className="px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-700 rounded text-[9px] font-black uppercase">
                                                        {veh.replace('mini-van-', 'Van ').replace('mini-', '')} · Rs.{Number(price).toLocaleString()}
                                                    </span>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                    {/* Hourly packages */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                            <span>Tour Packages</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {[...new Set((dest.roundTripPackages || []).map(p => p.hours))].sort((a,b)=>a-b).map(hours => (
                                                <span key={hours} className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-[10px] font-black uppercase">{hours} Hours</span>
                                            ))}
                                            {(dest.roundTripPackages || []).length === 0 && (
                                                <span className="text-[10px] text-slate-400 italic">No packages configured</span>
                                            )}
                                        </div>
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
                            className="bg-white dark:bg-emerald-900 rounded-3xl md:rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                        >
                            <div className="px-5 transition-all md:px-8 pt-4 md:pt-6 border-b border-slate-100 dark:border-white/10 flex flex-col gap-4 bg-slate-50 dark:bg-white/5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg md:text-xl font-bold text-emerald-900 dark:text-white">{editing === 'NEW' ? 'New Destination' : 'Edit Rate Plan'}</h3>
                                        <p className="text-[10px] md:text-xs text-slate-500">Configure override rates for this location</p>
                                    </div>
                                    <button onClick={() => setEditing(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-colors"><X size={20} /></button>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setActiveModalTab('transfers')}
                                        className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeModalTab === 'transfers' ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                    >
                                        Point-to-Point / Transfers
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveModalTab('tours')}
                                        className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeModalTab === 'tours' ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                    >
                                        Round Tour Packages
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6 md:space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Pickup Location (Google Search)</label>
                                                <LocationInput
                                                    placeholder="Leave blank for Global..."
                                                    value={form.pickupLocation || ''}
                                                    onChange={(val) => setForm({ ...form, pickupLocation: val, title: (val && form.name) ? `${val} to ${form.name}` : (form.name ? `Airport to ${form.name}` : '') })}
                                                    onSelect={({ address, lat, lng }) => {
                                                        setForm({ 
                                                            ...form, 
                                                            pickupLocation: address, 
                                                            title: (address && form.name) ? `${address} to ${form.name}` : (form.name ? `Airport to ${form.name}` : ''),
                                                            pickup_location: { name: address, latitude: lat, longitude: lng }
                                                        });
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Destination Location (Google Search)</label>
                                                <LocationInput
                                                    placeholder="Search for a city or place..."
                                                    value={form.name}
                                                    onChange={(val) => setForm({ ...form, name: val, title: (val && form.pickupLocation) ? `${form.pickupLocation} to ${val}` : (val ? `Airport to ${val}` : '') })}
                                                    onSelect={({ address, lat, lng }) => {
                                                        setForm({ 
                                                            ...form, 
                                                            name: address, 
                                                            title: (address && form.pickupLocation) ? `${form.pickupLocation} to ${address}` : (address ? `Airport to ${address}` : ''),
                                                            destination_location: { name: address, latitude: lat, longitude: lng }
                                                        });
                                                    }}
                                                />
                                            </div>
                                            {!form.pickupLocation && (
                                                <div className="space-y-2 pt-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Apply this rate to:</label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                        <button type="button" onClick={() => setForm({...form, applicableRideType: 'airport-only'})} className={`px-3 py-2 rounded-xl text-xs font-bold border ${form.applicableRideType === 'airport-only' || !form.applicableRideType ? 'bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400' : 'bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-500 hover:border-slate-300'}`}>Airport Transfers Only</button>
                                                        <button type="button" onClick={() => setForm({...form, applicableRideType: 'non-airport-only'})} className={`px-3 py-2 rounded-xl text-xs font-bold border ${form.applicableRideType === 'non-airport-only' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-500 hover:border-slate-300'}`}>Non-Airport Only</button>
                                                        <button type="button" onClick={() => setForm({...form, applicableRideType: 'all'})} className={`px-3 py-2 rounded-xl text-xs font-bold border ${form.applicableRideType === 'all' ? 'bg-purple-500/10 border-purple-500 text-purple-600 dark:text-purple-400' : 'bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-500 hover:border-slate-300'}`}>All Rides</button>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Full Display Title</label>
                                                <input required type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-2xl text-base font-bold outline-none ring-offset-0 focus:ring-4 focus:ring-blue-500/10 transition-all" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Sigiriya to Kandy" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Sort Order</label>
                                                <input type="number" className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-2xl text-base font-bold outline-none ring-offset-0 focus:ring-4 focus:ring-blue-500/10 transition-all" value={form.sortOrder || ''} onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) })} placeholder="e.g. 1" />
                                            </div>
                                        </div>
                                    </div>

                                    {activeModalTab === 'transfers' && (
                                        <>
                                            {/* ── BASE PRICES (V2 Coordinate-based Routing Engine) ── */}
                                            <div className="md:col-span-2 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-[2.5rem] border border-blue-200 dark:border-blue-800/30 space-y-4">
                                                <div>
                                                    <h4 className="text-sm font-black text-blue-900 dark:text-blue-300 uppercase tracking-wider flex items-center gap-2">
                                                        <DollarSign size={18} className="text-blue-500" /> Base Prices (Coordinate Routing)
                                                    </h4>
                                                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">Defines structured point-to-point pricing for exact coordinate matching.</p>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {VEHICLE_TYPES.map(vt => {
                                                        const VIcon = VEHICLE_ICONS[vt.slug]?.icon || Car;
                                                        const vColor = VEHICLE_ICONS[vt.slug]?.color || 'text-slate-500';
                                                        const vBg = VEHICLE_ICONS[vt.slug]?.bg || 'bg-slate-500/10';
                                                        
                                                        const currentBasePrices = form.base_prices_per_vehicle || [];
                                                        const vehicleBaseData = currentBasePrices.find(bp => bp.vehicle_category === vt.slug) || {
                                                            vehicle_category: vt.slug,
                                                            base_fare_flat: (form.pricing || {})[vt.slug] || 0,
                                                            included_km: 0,
                                                            per_extra_km: 0
                                                        };

                                                        const updateBaseData = (field, value) => {
                                                            const newBasePrices = [...currentBasePrices];
                                                            const existingIndex = newBasePrices.findIndex(bp => bp.vehicle_category === vt.slug);
                                                            if (existingIndex >= 0) {
                                                                newBasePrices[existingIndex] = { ...newBasePrices[existingIndex], [field]: Number(value) };
                                                            } else {
                                                                newBasePrices.push({ ...vehicleBaseData, [field]: Number(value) });
                                                            }
                                                            
                                                            // Keep legacy pricing in sync for backward compatibility
                                                            const newPricing = { ...(form.pricing || {}) };
                                                            if (field === 'base_fare_flat') newPricing[vt.slug] = Number(value);
                                                            
                                                            setForm({ ...form, base_prices_per_vehicle: newBasePrices, pricing: newPricing });
                                                        };

                                                        return (
                                                            <div key={vt.slug} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <div className={`w-8 h-8 ${vBg} rounded-lg flex items-center justify-center`}>
                                                                        <VIcon size={16} className={vColor} />
                                                                    </div>
                                                                    <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">{vt.label}</span>
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                                                    <div className="space-y-1">
                                                                        <label className="text-[9px] font-bold text-slate-400 uppercase">Flat Fare</label>
                                                                        <input type="number" min="0" placeholder="0" value={vehicleBaseData.base_fare_flat || ''} onChange={e => updateBaseData('base_fare_flat', e.target.value)} className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 outline-none" />
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <label className="text-[9px] font-bold text-slate-400 uppercase">Inc. KM</label>
                                                                        <input type="number" min="0" placeholder="0" value={vehicleBaseData.included_km || ''} onChange={e => updateBaseData('included_km', e.target.value)} className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none" />
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <label className="text-[9px] font-bold text-slate-400 uppercase">Per Ex. KM</label>
                                                                        <input type="number" min="0" placeholder="0" value={vehicleBaseData.per_extra_km || ''} onChange={e => updateBaseData('per_extra_km', e.target.value)} className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* ── VEHICLE TIERS (Range-based Pricing) ── */}
                                            <div className="md:col-span-2 p-6 bg-purple-50 dark:bg-purple-900/10 rounded-[2.5rem] border border-purple-200 dark:border-purple-800/30 space-y-6">
                                                <div>
                                                    <h4 className="text-sm font-black text-purple-900 dark:text-purple-300 uppercase tracking-wider flex items-center gap-2">
                                                        <Mountain size={18} className="text-purple-500" /> Range-Based Pricing Tiers
                                                    </h4>
                                                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">Configure distance-based tiered pricing for each vehicle. (e.g. 0-20km Flat, 20-50km Per-KM)</p>
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    {VEHICLE_TYPES.map(vt => {
                                                        const tiers = (form.vehicleTiers || {})[vt.slug] || [];
                                                        return (
                                                            <div key={vt.slug} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase">{vt.label}</span>
                                                                    <button 
                                                                        type="button" 
                                                                        onClick={() => {
                                                                            const newTiers = [...tiers, { minKm: 0, maxKm: 0, type: 'flat', value: 0 }];
                                                                            setForm({ ...form, vehicleTiers: { ...(form.vehicleTiers || {}), [vt.slug]: newTiers } });
                                                                        }}
                                                                        className="text-[10px] px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded font-bold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                                                                    >
                                                                        + Add Tier
                                                                    </button>
                                                                </div>
                                                                {tiers.length === 0 && <p className="text-[10px] text-slate-400 italic">No tiers configured.</p>}
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                    {tiers.map((tier, idx) => (
                                                                        <div key={idx} className="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-white/5 p-2.5 rounded-xl border border-slate-100 dark:border-white/5">
                                                                            <input type="number" placeholder="Min KM" className="w-16 px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-white outline-none" value={tier.minKm} onChange={e => {
                                                                                const t = [...tiers]; t[idx].minKm = Number(e.target.value);
                                                                                setForm({ ...form, vehicleTiers: { ...(form.vehicleTiers || {}), [vt.slug]: t } });
                                                                            }} />
                                                                            <span className="text-xs text-slate-400">-</span>
                                                                            <input type="number" placeholder="Max KM" className="w-16 px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-white outline-none" value={tier.maxKm} onChange={e => {
                                                                                const t = [...tiers]; t[idx].maxKm = Number(e.target.value);
                                                                                setForm({ ...form, vehicleTiers: { ...(form.vehicleTiers || {}), [vt.slug]: t } });
                                                                            }} />
                                                                            
                                                                            <select className="flex-1 px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-white outline-none" value={tier.type} onChange={e => {
                                                                                const t = [...tiers]; t[idx].type = e.target.value;
                                                                                setForm({ ...form, vehicleTiers: { ...(form.vehicleTiers || {}), [vt.slug]: t } });
                                                                            }}>
                                                                                <option value="flat">Flat Rate</option>
                                                                                <option value="per-km">Per KM</option>
                                                                            </select>
                                                                            
                                                                            <input type="number" placeholder="Value (Rs.)" className="w-24 px-2 py-1.5 text-xs rounded-lg border border-emerald-200 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-900/10 font-bold text-emerald-700 dark:text-emerald-400 outline-none" value={tier.value} onChange={e => {
                                                                                const t = [...tiers]; t[idx].value = Number(e.target.value);
                                                                                setForm({ ...form, vehicleTiers: { ...(form.vehicleTiers || {}), [vt.slug]: t } });
                                                                            }} />
                                                                            
                                                                            <button type="button" onClick={() => {
                                                                                const t = tiers.filter((_, i) => i !== idx);
                                                                                setForm({ ...form, vehicleTiers: { ...(form.vehicleTiers || {}), [vt.slug]: t } });
                                                                            }} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg ml-auto transition-colors">
                                                                                <Trash2 size={14} />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* ── DESTINATION ROUND TRIP / HOURLY PACKAGES ── */}
                                    {activeModalTab === 'tours' && (
                                        <div className="md:col-span-2 p-6 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-slate-200 dark:border-white/5 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-sm font-black text-emerald-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                                    <Clock size={18} className="text-emerald-500" /> Destination Tour Packages
                                                </h4>
                                                <p className="text-[10px] text-slate-500 font-medium">Configure tiered tour packages specifically for this destination</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const hoursStr = prompt("Enter hour count for this destination package (e.g. 2, 4, 8):");
                                                    if (!hoursStr) return;
                                                    const newHours = Number(hoursStr);
                                                    if (isNaN(newHours) || newHours <= 0) {
                                                        alert("Please enter a valid number of hours.");
                                                        return;
                                                    }
                                                    const currentPkgs = form.roundTripPackages || [];
                                                    const exists = currentPkgs.some(p => p.hours === newHours);
                                                    if (exists) {
                                                        alert(`Package for ${newHours} hours already exists.`);
                                                        return;
                                                    }
                                                    // Create package for all vehicle types
                                                    const newPackages = VEHICLE_TYPES.map(vt => ({
                                                        id: `dest-pkg-${newHours}h-${vt.slug}-${Date.now()}`,
                                                        hours: newHours,
                                                        vehicleType: vt.slug,
                                                        tiers: [
                                                            { km: 50, price: 0 },
                                                            { km: 100, price: 0 },
                                                            { km: 150, price: 0 },
                                                            { km: 200, price: 0 }
                                                        ]
                                                    }));
                                                    setForm({
                                                        ...form,
                                                        roundTripPackages: [...currentPkgs, ...newPackages]
                                                    });
                                                }}
                                                className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-2"
                                            >
                                                <Plus size={14} /> Add Hour Package
                                            </button>
                                        </div>

                                        {(() => {
                                            const currentPkgs = form.roundTripPackages || [];
                                            const uniqueHours = [...new Set(currentPkgs.map(p => p.hours))].sort((a, b) => a - b);
                                            if (uniqueHours.length === 0) {
                                                return (
                                                    <div className="py-8 text-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl bg-white/50">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No packages configured for this destination</p>
                                                        <p className="text-[8px] text-slate-400 uppercase mt-0.5">Click 'Add Hour Package' to define destination-specific packages.</p>
                                                    </div>
                                                );
                                            }

                                            return uniqueHours.map(hours => (
                                                <div key={`dest-grp-${hours}`} className="bg-white dark:bg-emerald-950/45 border border-slate-205 dark:border-slate-800 rounded-3xl p-4 space-y-4">
                                                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                                                        <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-md text-[10px] font-black uppercase tracking-wider">{hours} Hours Package</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const val = prompt(`Change hours for this package:`, hours);
                                                                if (val === null) return;
                                                                const newHours = Number(val);
                                                                if (isNaN(newHours) || newHours <= 0) return;
                                                                setForm({
                                                                    ...form,
                                                                    roundTripPackages: (form.roundTripPackages || []).map(p => p.hours === hours ? { ...p, hours: newHours } : p)
                                                                });
                                                            }}
                                                            className="text-[10px] font-bold text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 px-2 py-1 rounded"
                                                        >
                                                            Edit Hours
                                                        </button>
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleSave(e);
                                                                }}
                                                                disabled={saving}
                                                                className="px-2 py-1 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors shadow-sm"
                                                            >
                                                                {saving ? 'Saving...' : `Save ${hours}H Data`}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (!confirm(`Delete all packages for ${hours} hours?`)) return;
                                                                    setForm({
                                                                        ...form,
                                                                        roundTripPackages: (form.roundTripPackages || []).filter(p => p.hours !== hours)
                                                                    });
                                                                }}
                                                                className="text-[10px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 px-2 py-1 rounded"
                                                            >
                                                                Delete Group
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-left">
                                                            <thead>
                                                                <tr className="border-b border-slate-100 dark:border-slate-800">
                                                                    <th className="pb-2 text-[9px] font-black text-slate-400 uppercase tracking-widest w-1/4">Vehicle Type</th>
                                                                    <th className="pb-2 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Tier 1</th>
                                                                    <th className="pb-2 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Tier 2</th>
                                                                    <th className="pb-2 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Tier 3</th>
                                                                    <th className="pb-2 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Tier 4</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                                                {VEHICLE_TYPES.map(vt => {
                                                                    const pkg = (form.roundTripPackages || []).find(p => p.hours === hours && p.vehicleType === vt.slug);
                                                                    if (!pkg) return null;
                                                                    return (
                                                                        <tr key={vt.slug} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                                                            <td className="py-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300">{vt.label}</td>
                                                                            {[0, 1, 2, 3].map(tIdx => (
                                                                                <td key={tIdx} className="py-2 px-1 text-center">
                                                                                    <div className="inline-block space-y-1 text-left">
                                                                                        <div className="flex items-center gap-1">
                                                                                            <input
                                                                                                type="number"
                                                                                                placeholder="KM"
                                                                                                className="w-10 bg-slate-50 dark:bg-zinc-800 border-none rounded px-1 py-0.5 text-[8px] font-bold text-slate-700 dark:text-slate-300"
                                                                                                value={pkg.tiers?.[tIdx]?.km || 0}
                                                                                                onChange={e => {
                                                                                                    const val = e.target.value;
                                                                                                    const updated = (form.roundTripPackages || []).map(p => {
                                                                                                        if (p.id === pkg.id) {
                                                                                                            const tiers = [...p.tiers];
                                                                                                            tiers[tIdx] = { ...tiers[tIdx], km: val === '' ? '' : Number(val) };
                                                                                                            return { ...p, tiers };
                                                                                                        }
                                                                                                        return p;
                                                                                                    });
                                                                                                    setForm({ ...form, roundTripPackages: updated });
                                                                                                }}
                                                                                            />
                                                                                            <span className="text-[7px] text-slate-300 font-bold">KM</span>
                                                                                        </div>
                                                                                        <div className="flex items-center gap-0.5">
                                                                                            <span className="text-[7px] font-bold text-emerald-600">Rs.</span>
                                                                                            <input
                                                                                                type="number"
                                                                                                placeholder="Price"
                                                                                                className="w-16 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-slate-700 rounded px-1 py-0.5 text-[10px] font-bold text-emerald-600"
                                                                                                value={pkg.tiers?.[tIdx]?.price || 0}
                                                                                                onChange={e => {
                                                                                                    const val = e.target.value;
                                                                                                    const updated = (form.roundTripPackages || []).map(p => {
                                                                                                        if (p.id === pkg.id) {
                                                                                                            const tiers = [...p.tiers];
                                                                                                            tiers[tIdx] = { ...tiers[tIdx], price: val === '' ? '' : Number(val) };
                                                                                                            return { ...p, tiers };
                                                                                                        }
                                                                                                        return p;
                                                                                                    });
                                                                                                    setForm({ ...form, roundTripPackages: updated });
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                            ))}
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                )}
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
