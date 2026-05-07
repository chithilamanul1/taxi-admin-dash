'use client';

import { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Edit2, Loader2, X, Check, AlertTriangle, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrafficSurgeManager() {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingRule, setEditingRule] = useState(null);

    const [form, setForm] = useState({
        startTime: '17:00',
        endTime: '19:00',
        percentage: 10,
        label: 'Peak Hour Traffic Surge',
        isActive: true,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
    });

    const DAYS = [
        { id: 0, label: 'Sun' },
        { id: 1, label: 'Mon' },
        { id: 2, label: 'Tue' },
        { id: 3, label: 'Wed' },
        { id: 4, label: 'Thu' },
        { id: 5, label: 'Fri' },
        { id: 6, label: 'Sat' }
    ];

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/traffic-surge');
            const data = await res.json();
            if (data.success) setRules(data.data);
        } catch (err) {
            console.error('Failed to fetch surge rules', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const url = '/api/admin/traffic-surge';
            const method = editingRule ? 'PUT' : 'POST';
            const body = editingRule ? { ...form, _id: editingRule._id } : form;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            if (data.success) {
                if (editingRule) {
                    setRules(rules.map(r => r._id === editingRule._id ? data.data : r));
                } else {
                    setRules([...rules, data.data]);
                }
                setShowModal(false);
                resetForm();
            } else {
                alert('Save failed: ' + data.error);
            }
        } catch (err) {
            alert('Error saving rule');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this surge rule?')) return;
        try {
            const res = await fetch(`/api/admin/traffic-surge?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setRules(rules.filter(r => r._id !== id));
            }
        } catch (err) {
            alert('Delete failed');
        }
    };

    const resetForm = () => {
        setForm({
            startTime: '17:00',
            endTime: '19:00',
            percentage: 10,
            label: 'Peak Hour Traffic Surge',
            isActive: true,
            daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
        });
        setEditingRule(null);
    };

    const toggleDay = (dayId) => {
        setForm(prev => {
            const days = prev.daysOfWeek.includes(dayId)
                ? prev.daysOfWeek.filter(d => d !== dayId)
                : [...prev.daysOfWeek, dayId];
            return { ...prev, daysOfWeek: days.sort() };
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Traffic Surge Pricing</h2>
                    <p className="text-slate-500 font-medium mt-1">Configure extra charges for peak traffic hours.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                >
                    <Plus size={20} /> Add Time Window
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-slate-100">
                    <Loader2 className="animate-spin mb-4 text-indigo-500" size={40} />
                    <p className="font-bold uppercase tracking-widest text-xs text-slate-400">Loading traffic patterns...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rules.map((rule) => (
                        <motion.div
                            layout
                            key={rule._id}
                            className={`relative bg-white rounded-[2rem] p-6 border-2 transition-all shadow-sm hover:shadow-xl ${rule.isActive ? 'border-indigo-100' : 'border-slate-100 grayscale opacity-60'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                    <Clock size={24} />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setEditingRule(rule); setForm(rule); setShowModal(true); }}
                                        className="p-2 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 rounded-xl transition-all"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(rule._id)}
                                        className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{rule.label}</h3>
                                    <p className="text-2xl font-black text-indigo-600 mt-1">+{rule.percentage}%</p>
                                </div>

                                <div className="flex items-center gap-4 py-3 border-y border-slate-50">
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Time</p>
                                        <p className="font-bold text-slate-700">{rule.startTime}</p>
                                    </div>
                                    <div className="w-px h-8 bg-slate-100" />
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End Time</p>
                                        <p className="font-bold text-slate-700">{rule.endTime}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                    {DAYS.map(day => (
                                        <span 
                                            key={day.id}
                                            className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${rule.daysOfWeek.includes(day.id) ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-50 text-slate-300'}`}
                                        >
                                            {day.label}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {!rule.isActive && (
                                <div className="absolute top-4 right-14">
                                    <span className="text-[9px] font-black uppercase bg-slate-200 text-slate-500 px-2 py-1 rounded-full">Inactive</span>
                                </div>
                            )}
                        </motion.div>
                    ))}

                    {rules.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-slate-50 border-4 border-dashed border-slate-100 rounded-[3rem]">
                            <AlertTriangle size={48} className="mx-auto text-slate-200 mb-4" />
                            <h3 className="text-xl font-black text-slate-300 uppercase tracking-tight">No Surge Rules</h3>
                            <p className="text-slate-400 text-sm font-medium mt-2">Add rules to automatically handle peak hour pricing.</p>
                        </div>
                    )}
                </div>
            )}

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
                                <div>
                                    <h3 className="text-2xl font-black text-indigo-900 uppercase tracking-tighter">
                                        {editingRule ? 'Edit Surge Rule' : 'New Surge Window'}
                                    </h3>
                                    <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest mt-1">Configure Time & Rate</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-3 hover:bg-indigo-100 rounded-2xl transition-all text-indigo-400">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Rule Label</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                            value={form.label}
                                            onChange={e => setForm({ ...form, label: e.target.value })}
                                            placeholder="e.g. Evening Peak Traffic"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Start Time (24h)</label>
                                        <input
                                            type="time"
                                            required
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                            value={form.startTime}
                                            onChange={e => setForm({ ...form, startTime: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">End Time (24h)</label>
                                        <input
                                            type="time"
                                            required
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                            value={form.endTime}
                                            onChange={e => setForm({ ...form, endTime: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Extra Percentage (%)</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            max="100"
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                            value={form.percentage}
                                            onChange={e => setForm({ ...form, percentage: parseInt(e.target.value) })}
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 pt-6">
                                        <button
                                            type="button"
                                            onClick={() => setForm({ ...form, isActive: !form.isActive })}
                                            className={`w-12 h-6 rounded-full transition-all relative ${form.isActive ? 'bg-indigo-500' : 'bg-slate-200'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.isActive ? 'right-1' : 'left-1'}`} />
                                        </button>
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">Active Rule</span>
                                    </div>

                                    <div className="col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-3 block">Applicable Days</label>
                                        <div className="flex flex-wrap gap-2">
                                            {DAYS.map(day => (
                                                <button
                                                    key={day.id}
                                                    type="button"
                                                    onClick={() => toggleDay(day.id)}
                                                    className={`px-4 py-2 rounded-xl font-bold text-xs transition-all border-2 ${form.daysOfWeek.includes(day.id) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'}`}
                                                >
                                                    {day.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-8">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all uppercase tracking-widest text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={isSaving}
                                        className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 transition-all uppercase tracking-widest text-xs"
                                    >
                                        {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
                                        {editingRule ? 'Update Rule' : 'Create Rule'}
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
