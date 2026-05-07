'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Edit2, Loader2, X, Check, Image as ImageIcon, Star, ShieldCheck, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DriverManager() {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingDriver, setEditingDriver] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [form, setForm] = useState({
        name: '',
        image: '',
        experience: '',
        trips: '',
        sortOrder: 0,
        isActive: true,
        preview: null
    });

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/drivers');
            const data = await res.json();
            if (data.success) setDrivers(data.data);
        } catch (err) {
            console.error('Failed to fetch drivers', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setForm({ ...form, preview: reader.result });
        };
        reader.readAsDataURL(file);

        // Upload
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'drivers');

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setForm(prev => ({ ...prev, image: data.secure_url }));
            } else {
                alert('Upload failed: ' + data.error);
            }
        } catch (err) {
            alert('Upload error');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.image) return alert('Name and Image are required');

        setIsSaving(true);
        try {
            const url = editingDriver 
                ? `/api/admin/drivers/${editingDriver._id}` 
                : '/api/admin/drivers';
            
            const res = await fetch(url, {
                method: editingDriver ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();

            if (data.success) {
                if (editingDriver) {
                    setDrivers(drivers.map(d => d._id === editingDriver._id ? data.data : d));
                } else {
                    setDrivers([...drivers, data.data]);
                }
                setShowModal(false);
                resetForm();
            } else {
                alert('Save failed: ' + data.error);
            }
        } catch (err) {
            alert('Error saving driver');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this driver?')) return;
        try {
            const res = await fetch(`/api/admin/drivers/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setDrivers(drivers.filter(d => d._id !== id));
            }
        } catch (err) {
            alert('Delete failed');
        }
    };

    const resetForm = () => {
        setForm({
            name: '',
            image: '',
            experience: '',
            trips: '',
            sortOrder: 0,
            isActive: true,
            preview: null
        });
        setEditingDriver(null);
    };

    const openEdit = (driver) => {
        setEditingDriver(driver);
        setForm({
            name: driver.name,
            image: driver.image,
            experience: driver.experience,
            trips: driver.trips,
            sortOrder: driver.sortOrder || 0,
            isActive: driver.isActive !== undefined ? driver.isActive : true,
            preview: driver.image
        });
        setShowModal(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Our Elite Drivers</h2>
                    <p className="text-slate-500 font-medium mt-1">Manage the profiles of your experienced driving team.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                    <Plus size={20} /> Add New Driver
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-slate-100 italic text-slate-400">
                    <Loader2 className="animate-spin mb-4 text-emerald-500" size={40} />
                    <p className="font-bold uppercase tracking-widest text-xs">Loading our heroes...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {drivers.map((driver) => (
                        <motion.div
                            layout
                            key={driver._id}
                            className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all"
                        >
                            <div className="aspect-[4/5] relative overflow-hidden">
                                <img
                                    src={driver.image}
                                    alt={driver.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                
                                <div className="absolute top-4 right-4 flex gap-2 translate-y-[-10px] group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <button
                                        onClick={() => openEdit(driver)}
                                        className="p-3 bg-white/20 backdrop-blur-md text-white rounded-xl shadow-lg hover:bg-emerald-500 transition-all"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(driver._id)}
                                        className="p-3 bg-white/20 backdrop-blur-md text-white rounded-xl shadow-lg hover:bg-red-500 transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">{driver.name}</h3>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-emerald-400">
                                            <Briefcase size={14} strokeWidth={3} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{driver.experience} Experience</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-amber-400">
                                            <ShieldCheck size={14} strokeWidth={3} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{driver.trips} Safe Trips</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {drivers.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-slate-50 border-4 border-dashed border-slate-100 rounded-[3rem]">
                            <Users size={48} className="mx-auto text-slate-200 mb-4" />
                            <h3 className="text-xl font-black text-slate-300 uppercase tracking-tight">No drivers listed</h3>
                            <p className="text-slate-400 text-sm font-medium mt-2">Start building your elite driving team!</p>
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
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
                                        {editingDriver ? 'Edit Driver' : 'New Driver'}
                                    </h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Profile Details</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-3 hover:bg-slate-200 rounded-2xl transition-all text-slate-400">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Driver Photo</label>
                                        {!form.preview ? (
                                            <label className="border-4 border-dashed border-slate-100 rounded-[2rem] p-12 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-50/30 transition-all group">
                                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-emerald-100 group-hover:text-emerald-500 transition-all mb-4">
                                                    <ImageIcon size={32} />
                                                </div>
                                                <p className="text-slate-600 font-bold uppercase text-xs tracking-widest">Select Image</p>
                                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                            </label>
                                        ) : (
                                            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden border-8 border-slate-50 shadow-inner group">
                                                <img src={form.preview} className="w-full h-full object-cover" />
                                                {uploading && (
                                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                                                        <Loader2 className="animate-spin text-white" size={32} />
                                                    </div>
                                                )}
                                                <button 
                                                    type="button"
                                                    onClick={() => setForm({ ...form, image: '', preview: null })}
                                                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-xl shadow-lg transition-all"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            placeholder="e.g. Ruwan Perera"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Experience</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                            value={form.experience}
                                            onChange={e => setForm({ ...form, experience: e.target.value })}
                                            placeholder="e.g. 15 Years"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Safe Trips</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                            value={form.trips}
                                            onChange={e => setForm({ ...form, trips: e.target.value })}
                                            placeholder="e.g. 1200+"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Sort Order</label>
                                        <input
                                            type="number"
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                            value={form.sortOrder}
                                            onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) })}
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 pt-6">
                                        <button
                                            type="button"
                                            onClick={() => setForm({ ...form, isActive: !form.isActive })}
                                            className={`w-12 h-6 rounded-full transition-all relative ${form.isActive ? 'bg-emerald-500' : 'bg-slate-200'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.isActive ? 'right-1' : 'left-1'}`} />
                                        </button>
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">Active Profile</span>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4 border-t mt-8">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all uppercase tracking-widest text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={isSaving || uploading}
                                        className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all uppercase tracking-widest text-xs"
                                    >
                                        {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
                                        {editingDriver ? 'Update Profile' : 'Create Profile'}
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
