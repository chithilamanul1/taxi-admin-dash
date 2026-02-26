'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Image as ImageIcon, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ToursAdmin() {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingTour, setEditingTour] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category: 'day-trip',
        price: '',
        priceType: 'from',
        durationDays: 1,
        durationNights: 0,
        image: '',
        description: '',
        highlights: '', // Comma separated for simplicity first
        inclusions: '',
        exclusions: '',
        itinerary: [],
        isActive: true
    });

    const uploadFile = async (file) => {
        if (!file) return null;
        const data = new FormData();
        data.append('file', file);
        data.append('folder', 'tours');

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: data
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Upload failed');
        }

        const result = await res.json();
        return result.success ? result.url : null;
    };

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/tours');
            const data = await res.json();
            if (data.success) setTours(data.data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleEdit = (tour) => {
        setEditingTour(tour);
        setFormData({
            title: tour.title,
            slug: tour.slug || '',
            category: tour.category || 'day-trip',
            price: tour.price?.amount || tour.price || '',
            priceType: tour.price?.type || 'from',
            durationDays: tour.duration?.days || 1,
            durationNights: tour.duration?.nights || 0,
            image: tour.heroImage || tour.image || '',
            description: tour.description,
            highlights: tour.highlights?.join(', ') || '',
            inclusions: tour.inclusions?.join(', ') || '',
            exclusions: tour.exclusions?.join(', ') || '',
            itinerary: tour.itinerary || [],
            isActive: tour.isActive
        });
        setShowModal(true);
    };

    const handleCreate = () => {
        setEditingTour(null);
        setImageFile(null);
        setFormData({
            title: '', category: 'day-trip', price: '', priceType: 'from', durationDays: 1, durationNights: 0, image: '', description: '', highlights: '', inclusions: '', exclusions: '', itinerary: [], isActive: true
        });
        setShowModal(true);
    };

    const handleAddItineraryDay = () => {
        setFormData({
            ...formData,
            itinerary: [...formData.itinerary, { day: formData.itinerary.length + 1, title: '', description: '', activities: [] }]
        });
    };

    const handleUpdateItineraryDay = (index, field, value) => {
        const newItinerary = [...formData.itinerary];
        if (field === 'activities') {
            newItinerary[index][field] = value.split(',').map(s => s.trim()).filter(Boolean);
        } else {
            newItinerary[index][field] = value;
        }
        setFormData({ ...formData, itinerary: newItinerary });
    };

    const handleRemoveItineraryDay = (index) => {
        const newItinerary = formData.itinerary.filter((_, i) => i !== index).map((day, i) => ({ ...day, day: i + 1 }));
        setFormData({ ...formData, itinerary: newItinerary });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            let imageUrl = formData.image;
            if (imageFile) {
                const uploadedUrl = await uploadFile(imageFile);
                if (uploadedUrl) imageUrl = uploadedUrl;
            }

            const payload = {
                ...formData,
                slug: formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                image: imageUrl,
                heroImage: imageUrl,
                images: [imageUrl],
                price: {
                    amount: Number(formData.price),
                    currency: 'USD',
                    type: formData.priceType
                },
                duration: {
                    days: Number(formData.durationDays),
                    nights: Number(formData.durationNights)
                },
                highlights: formData.highlights.split(',').map(s => s.trim()).filter(Boolean),
                inclusions: formData.inclusions.split(',').map(s => s.trim()).filter(Boolean),
                exclusions: formData.exclusions.split(',').map(s => s.trim()).filter(Boolean)
            };

            const method = editingTour ? 'PUT' : 'POST';
            const url = editingTour ? `/api/tours/${editingTour._id}` : '/api/tours';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                setShowModal(false);
                setImageFile(null);
                fetchTours();
            } else {
                alert(data.error);
            }
        } catch (e) {
            console.error(e);
            alert(e.message || 'Operation failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await fetch(`/api/tours/${id}`, { method: 'DELETE' });
            fetchTours();
        } catch (e) { console.error(e); }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/admin" className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 mb-2 transition-colors">
                            <ArrowLeft size={16} /> Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Tour Packages</h1>
                        <p className="text-slate-500">Manage your tours, pricing, and content.</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                    >
                        <Plus size={20} /> Add New Tour
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tours.map(tour => (
                            <div key={tour._id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow group relative">
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-slate-900/90 p-1.5 rounded-lg backdrop-blur-sm shadow-sm z-10">
                                    <button onClick={() => handleEdit(tour)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(tour._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"><Trash2 size={16} /></button>
                                </div>

                                <div className="h-40 rounded-xl bg-slate-100 overflow-hidden mb-4 relative">
                                    {tour.image ? (
                                        <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon size={32} /></div>
                                    )}
                                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-md">
                                        {tour.category}
                                    </div>
                                </div>

                                <h3 className="font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{tour.title}</h3>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-emerald-600 font-bold">${tour.price}</span>
                                    <span className="text-slate-400">{tour.duration && typeof tour.duration === 'object' ? `${tour.duration.days}D / ${tour.duration.nights}N` : `${tour.duration || 0} Day(s)`}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                                <h2 className="text-xl font-bold dark:text-white">{editingTour ? 'Edit Tour' : 'Create Tour'}</h2>
                                <button onClick={() => setShowModal(false)}><X className="text-slate-400 hover:text-red-500" /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-sm">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-600 dark:text-slate-400">Title</label>
                                        <input required className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                                            value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-600 dark:text-slate-400">Slug (URL path)</label>
                                        <input required className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                                            value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-') })} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-600 dark:text-slate-400">Category</label>
                                        <select className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                                            value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                            <option value="day-trip">Day Trip</option>
                                            <option value="city-tour">City Tour</option>
                                            <option value="safari">Safari</option>
                                            <option value="tour-package">Multi-Day Package</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-600 dark:text-slate-400">Is Active?</label>
                                        <select className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                                            value={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.value === 'true' })}>
                                            <option value="true">Yes (Visible)</option>
                                            <option value="false">No (Hidden)</option>
                                        </select>
                                    </div>
                                </div>


                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-600 dark:text-slate-400">Price (USD)</label>
                                        <input type="number" required className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                                            value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-600 dark:text-slate-400">Days</label>
                                        <input type="number" required min="1" className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                                            value={formData.durationDays} onChange={e => setFormData({ ...formData, durationDays: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-600 dark:text-slate-400">Nights</label>
                                        <input type="number" required min="0" className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                                            value={formData.durationNights} onChange={e => setFormData({ ...formData, durationNights: e.target.value })} />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-bold text-slate-600 dark:text-slate-400">Tour Image</label>
                                    <div className="flex gap-4 items-start">
                                        <div className="w-24 h-24 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                                            {imageFile ? (
                                                <img src={URL.createObjectURL(imageFile)} className="w-full h-full object-cover" />
                                            ) : formData.image ? (
                                                <img src={formData.image} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon size={24} /></div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <label className="block w-full cursor-pointer bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 p-4 rounded-xl text-center hover:border-emerald-500 transition-colors">
                                                <input type="file" className="hidden" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
                                                <span className="text-xs font-bold text-slate-500">
                                                    {imageFile ? imageFile.name : 'Click to upload image'}
                                                </span>
                                            </label>
                                            <input className="w-full p-2 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none dark:text-white"
                                                placeholder="Or paste direct image URL here"
                                                value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-bold text-slate-600 dark:text-slate-400">Description</label>
                                    <textarea required rows="3" className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                                        value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                </div>

                                <div className="space-y-1">
                                    <label className="font-bold text-slate-600 dark:text-slate-400">Highlights (comma separated)</label>
                                    <textarea rows="2" className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                                        value={formData.highlights} onChange={e => setFormData({ ...formData, highlights: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="font-bold text-emerald-600">Inclusions (comma separated)</label>
                                        <textarea rows="2" className="w-full p-3 rounded-xl border bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                                            value={formData.inclusions} onChange={e => setFormData({ ...formData, inclusions: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-bold text-red-500">Exclusions (comma separated)</label>
                                        <textarea rows="2" className="w-full p-3 rounded-xl border bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800 outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                                            value={formData.exclusions} onChange={e => setFormData({ ...formData, exclusions: e.target.value })} />
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 dark:border-slate-800 pt-6 mt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-slate-800 dark:text-white text-lg">Itinerary Days</h3>
                                        <button type="button" onClick={handleAddItineraryDay} className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-100 font-bold">
                                            <Plus size={16} /> Add Day
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {formData.itinerary.map((day, index) => (
                                            <div key={index} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 relative">
                                                <button type="button" onClick={() => handleRemoveItineraryDay(index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
                                                    <Trash2 size={16} />
                                                </button>
                                                <h4 className="font-black text-slate-700 dark:text-slate-300 mb-3">Day {day.day}</h4>

                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="text-xs font-bold text-slate-500">Title</label>
                                                        <input className="w-full p-2 text-sm rounded-lg border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 dark:text-white"
                                                            value={day.title} onChange={e => handleUpdateItineraryDay(index, 'title', e.target.value)} placeholder="e.g. Arrival & Move to Sigiriya" />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-slate-500">Description</label>
                                                        <textarea rows="2" className="w-full p-2 text-sm rounded-lg border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 dark:text-white"
                                                            value={day.description} onChange={e => handleUpdateItineraryDay(index, 'description', e.target.value)} />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-slate-500">Activities (comma separated)</label>
                                                        <input className="w-full p-2 text-sm rounded-lg border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 dark:text-white"
                                                            value={day.activities?.join(', ') || ''} onChange={e => handleUpdateItineraryDay(index, 'activities', e.target.value)} placeholder="e.g. Climb Rock, Safari" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" disabled={uploading} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 mt-4 disabled:opacity-50 flex items-center justify-center gap-2">
                                    {uploading && <Loader2 className="animate-spin" size={20} />}
                                    {editingTour ? (uploading ? 'Updating...' : 'Update Tour') : (uploading ? 'Creating...' : 'Create Tour')}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
