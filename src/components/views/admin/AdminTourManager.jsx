'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, CheckCircle, Clock, MapPin, List, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminTourManager() {
    const [tours, setTours] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Editor State
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        try {
            const res = await fetch('/api/tours');
            const data = await res.json();
            if (data.success) setTours(data.data);
        } catch (error) {
            console.error("Failed to fetch tours:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateNew = () => {
        setFormData({
            title: '',
            slug: '',
            category: 'tour-package',
            duration: { days: 1, nights: 0 },
            description: '',
            price: { amount: 0, currency: 'USD', type: 'from' },
            images: [],
            itinerary: [],
            inclusions: [],
            exclusions: [],
            destinations: [],
            isActive: true
        });
        setIsEditing(true);
    };

    const handleEdit = (tour) => {
        setFormData({ ...tour });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this tour?')) return;
        try {
            const res = await fetch(`/api/tours?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchTours();
            } else {
                alert('Failed to delete');
            }
        } catch (error) {
            alert('Error deleting tour');
        }
    };

    const handleSave = async () => {
        try {
            const method = formData._id ? 'PUT' : 'POST';
            const res = await fetch('/api/tours', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                setIsEditing(false);
                fetchTours();
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to save tour');
        }
    };

    // Helper to update nested state
    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateNestedField = (parent, field, value) => {
        setFormData(prev => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: value }
        }));
    };

    if (isEditing) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-white/10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-emerald-900 dark:text-white">
                        {formData._id ? 'Edit Tour' : 'Create New Tour'}
                    </h2>
                    <div className="flex gap-2">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 font-bold">Cancel</button>
                        <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg">Save Tour</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Basic Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Title</label>
                                <input
                                    value={formData.title}
                                    onChange={e => updateField('title', e.target.value)}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-white/10 font-bold outline-none focus:border-emerald-500"
                                    placeholder="e.g. 7 Day Island Paradise"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Slug (URL)</label>
                                <input
                                    value={formData.slug}
                                    onChange={e => updateField('slug', e.target.value)}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-white/10 outline-none focus:border-emerald-500 text-sm font-mono"
                                    placeholder="e.g. 7-day-island-paradise"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Description (Markdown Supported)</label>
                            <textarea
                                value={formData.description}
                                onChange={e => updateField('description', e.target.value)}
                                className="w-full p-3 h-40 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-white/10 outline-none focus:border-emerald-500"
                                placeholder="Full tour description..."
                            />
                        </div>

                        {/* Itinerary Builder */}
                        <div className="border-t border-slate-200 dark:border-white/10 pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg text-emerald-900 dark:text-white flex items-center gap-2">
                                    <List size={20} /> Itinerary
                                </h3>
                                <button
                                    onClick={() => {
                                        const newItin = [...(formData.itinerary || [])];
                                        newItin.push({ day: newItin.length + 1, title: '', description: '', activities: [] });
                                        updateField('itinerary', newItin);
                                    }}
                                    className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold hover:bg-emerald-200"
                                >+ Add Day</button>
                            </div>

                            <div className="space-y-4">
                                {formData.itinerary?.map((day, idx) => (
                                    <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                                        <div className="flex gap-4 mb-2">
                                            <div className="w-16">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Day</label>
                                                <input
                                                    type="number"
                                                    value={day.day}
                                                    onChange={e => {
                                                        const newItin = [...formData.itinerary];
                                                        newItin[idx].day = parseInt(e.target.value);
                                                        updateField('itinerary', newItin);
                                                    }}
                                                    className="w-full p-2 rounded bg-white dark:bg-slate-800 font-bold text-center border dark:border-white/10"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Title</label>
                                                <input
                                                    value={day.title}
                                                    onChange={e => {
                                                        const newItin = [...formData.itinerary];
                                                        newItin[idx].title = e.target.value;
                                                        updateField('itinerary', newItin);
                                                    }}
                                                    className="w-full p-2 rounded bg-white dark:bg-slate-800 font-bold border dark:border-white/10"
                                                    placeholder="e.g. Arrival in Colombo"
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newItin = formData.itinerary.filter((_, i) => i !== idx);
                                                    updateField('itinerary', newItin);
                                                }}
                                                className="text-red-400 hover:text-red-600 px-2"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <textarea
                                            value={day.description}
                                            onChange={e => {
                                                const newItin = [...formData.itinerary];
                                                newItin[idx].description = e.target.value;
                                                updateField('itinerary', newItin);
                                            }}
                                            className="w-full p-2 text-sm bg-white dark:bg-slate-800 rounded border dark:border-white/10 h-20"
                                            placeholder="Day description..."
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Settings, Pricing, Images */}
                    <div className="space-y-6">
                        <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/10">
                            <h3 className="font-bold text-sm uppercase text-slate-500 mb-4">Settings</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-bold mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => updateField('category', e.target.value)}
                                        className="w-full p-2 rounded bg-white dark:bg-slate-800 border dark:border-white/10"
                                    >
                                        <option value="tour-package">Tour Package</option>
                                        <option value="day-trip">Day Trip</option>
                                        <option value="safari">Safari</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs font-bold mb-1">Days</label>
                                        <input
                                            type="number"
                                            value={formData.duration?.days}
                                            onChange={e => updateNestedField('duration', 'days', parseInt(e.target.value))}
                                            className="w-full p-2 rounded bg-white dark:bg-slate-800 border dark:border-white/10"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold mb-1">Nights</label>
                                        <input
                                            type="number"
                                            value={formData.duration?.nights}
                                            onChange={e => updateNestedField('duration', 'nights', parseInt(e.target.value))}
                                            className="w-full p-2 rounded bg-white dark:bg-slate-800 border dark:border-white/10"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.isFeatured}
                                        onChange={e => updateField('isFeatured', e.target.checked)}
                                        id="featured"
                                    />
                                    <label htmlFor="featured" className="text-sm font-bold">Featured on Homepage</label>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/10">
                            <h3 className="font-bold text-sm uppercase text-slate-500 mb-4">Pricing (From)</h3>
                            <div className="flex gap-2">
                                <span className="bg-emerald-100 text-emerald-800 px-3 py-2 rounded font-bold text-sm flex items-center">{formData.price?.currency || 'USD'}</span>
                                <input
                                    type="number"
                                    value={formData.price?.amount}
                                    onChange={e => updateNestedField('price', 'amount', parseInt(e.target.value))}
                                    className="flex-1 p-2 rounded bg-white dark:bg-slate-800 border dark:border-white/10 font-bold"
                                />
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/10">
                            <h3 className="font-bold text-sm uppercase text-slate-500 mb-4">Images</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold mb-1">Hero Image (Cover)</label>
                                    <input
                                        value={formData.heroImage}
                                        onChange={e => updateField('heroImage', e.target.value)}
                                        className="w-full p-2 rounded bg-white dark:bg-slate-800 border dark:border-white/10 text-xs"
                                        placeholder="https://..."
                                    />
                                    {formData.heroImage && (
                                        <img src={formData.heroImage} className="mt-2 w-full h-32 object-cover rounded-lg border dark:border-white/10" alt="Preview" />
                                    )}
                                </div>

                                <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-xs font-bold uppercase">Gallery Images</label>
                                        <button
                                            onClick={() => {
                                                const newImages = [...(formData.images || [])];
                                                newImages.push('');
                                                updateField('images', newImages);
                                            }}
                                            className="text-[10px] bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-bold"
                                        >+ Add Image</button>
                                    </div>
                                    <div className="space-y-2">
                                        {(formData.images || []).map((img, idx) => (
                                            <div key={idx} className="flex gap-2 items-start">
                                                <input
                                                    value={img}
                                                    onChange={e => {
                                                        const newImages = [...formData.images];
                                                        newImages[idx] = e.target.value;
                                                        updateField('images', newImages);
                                                    }}
                                                    className="flex-1 p-2 rounded bg-white dark:bg-slate-800 border dark:border-white/10 text-[10px]"
                                                    placeholder="Gallery image URL"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newImages = formData.images.filter((_, i) => i !== idx);
                                                        updateField('images', newImages);
                                                    }}
                                                    className="p-2 text-red-400 hover:text-red-500"
                                                ><Trash2 size={14} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // LIST VIEW
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-8 border border-white/5">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-emerald-900 dark:text-white">Tour Management</h2>
                <button
                    onClick={handleCreateNew}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                >
                    <Plus size={18} /> New Tour
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-20">
                    <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading tours...</p>
                </div>
            ) : tours.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10">
                    <p className="text-slate-500 font-medium">No tours found. Create your first one!</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {tours.map(tour => (
                        <div key={tour._id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-white/5 flex items-center gap-4 hover:shadow-md transition-shadow group">
                            <img
                                src={tour.heroImage || '/placeholder.png'}
                                alt={tour.title}
                                className="w-24 h-16 object-cover rounded-lg bg-slate-200"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-black tracking-widest ${tour.category === 'safari' ? 'bg-orange-100 text-orange-700' :
                                        tour.category === 'day-trip' ? 'bg-blue-100 text-blue-700' :
                                            'bg-purple-100 text-purple-700'
                                        }`}>
                                        {tour.category}
                                    </span>
                                    {tour.isFeatured && <span className="text-[10px] text-yellow-600 font-bold flex items-center"><CheckCircle size={10} className="mr-0.5" /> Featured</span>}
                                </div>
                                <h3 className="font-bold text-emerald-900 dark:text-white text-lg">{tour.title}</h3>
                                <div className="flex gap-4 text-xs text-slate-500 mt-1">
                                    <span className="flex items-center gap-1"><Clock size={12} /> {tour.duration.days}D / {tour.duration.nights}N</span>
                                    <span className="flex items-center gap-1"><DollarSign size={12} /> {tour.price.currency} {tour.price.amount.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(tour)} className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                    <Edit2 size={18} />
                                </button>
                                <button onClick={() => handleDelete(tour._id)} className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
