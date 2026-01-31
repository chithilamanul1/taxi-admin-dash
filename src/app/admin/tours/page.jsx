'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Image as ImageIcon, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ToursAdmin() {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTour, setEditingTour] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Day Tours',
        price: '',
        duration: 1,
        image: '',
        description: '',
        highlights: '', // Comma separated for simplicity first
        isActive: true
    });

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
            category: tour.category,
            price: tour.price,
            duration: tour.duration,
            image: tour.image,
            description: tour.description,
            highlights: tour.highlights?.join(', ') || '',
            isActive: tour.isActive
        });
        setShowModal(true);
    };

    const handleCreate = () => {
        setEditingTour(null);
        setFormData({
            title: '', category: 'Day Tours', price: '', duration: 1, image: '', description: '', highlights: '', isActive: true
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            highlights: formData.highlights.split(',').map(s => s.trim()).filter(Boolean)
        };

        const method = editingTour ? 'PUT' : 'POST';
        const url = editingTour ? `/api/tours/${editingTour._id}` : '/api/tours';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                setShowModal(false);
                fetchTours();
            } else {
                alert(data.error);
            }
        } catch (e) {
            console.error(e);
            alert('Operation failed');
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
                                    <span className="text-slate-400">{tour.duration} Day(s)</span>
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
                                        <label className="font-bold text-slate-600 dark:text-slate-400">Category</label>
                                        <select className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                                            value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                            {['Day Tours', 'City Tours', 'Safari', 'Multi-Day'].map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-600 dark:text-slate-400">Price (USD)</label>
                                        <input type="number" required className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                                            value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-bold text-slate-600 dark:text-slate-400">Duration (Days)</label>
                                        <input type="number" required min="1" className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                                            value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-bold text-slate-600 dark:text-slate-400">Image URL</label>
                                    <input className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                                        placeholder="/tours/example.jpg or https://..."
                                        value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
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

                                <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 mt-4">
                                    {editingTour ? 'Update Tour' : 'Create Tour'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
