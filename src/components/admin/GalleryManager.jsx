'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, Loader2, X, Check, Search, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GalleryManager() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [newImage, setNewImage] = useState({
        file: null,
        caption: '',
        category: 'General',
        preview: null
    });

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/gallery');
            const data = await res.json();
            if (data.success) setImages(data.data);
        } catch (err) {
            console.error('Failed to fetch gallery images', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImage({ ...newImage, file, preview: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const compressImage = async (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new window.Image();
                img.src = event.target.result;
                img.onload = () => {
                    // Start compression
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Calculate new dimensions (max 1920x1920)
                    const MAX_SIZE = 1920;
                    let width = img.width;
                    let height = img.height;

                    if (width > height && width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    } else if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert back to blob
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                resolve(file); // fail safe, return original
                                return;
                            }
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        },
                        'image/jpeg',
                        0.85 // 85% quality
                    );
                };
            };
        });
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!newImage.file) return alert('Please select an image');

        setUploading(true);
        try {
            // Compress 'real' high-res images to avoid Vercel 4.5MB payload limits
            const compressedFile = await compressImage(newImage.file);

            // 1. Upload to Cloudinary via our upload API
            const formData = new FormData();
            formData.append('file', compressedFile);
            formData.append('folder', 'gallery');

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const uploadData = await uploadRes.json();

            if (!uploadData.success) throw new Error(uploadData.error || 'Upload failed');

            // 2. Save to DB
            const dbRes = await fetch('/api/admin/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: uploadData.secure_url,
                    public_id: uploadData.public_id,
                    caption: newImage.caption,
                    category: newImage.category
                })
            });
            const dbData = await dbRes.json();

            if (dbData.success) {
                setImages([dbData.data, ...images]);
                setShowUploadModal(false);
                setNewImage({ file: null, caption: '', category: 'General', preview: null });
            } else {
                throw new Error(dbData.error || 'Failed to save to database');
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this image?')) return;
        try {
            const res = await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setImages(images.filter(img => img._id !== id));
            } else {
                alert('Delete failed');
            }
        } catch (err) {
            alert('Error deleting image');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Gallery Management</h2>
                    <p className="text-slate-500 mt-1">Manage the images displayed on your website gallery.</p>
                </div>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                    <Plus size={20} /> Upload Image
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 italic text-slate-400">
                    <Loader2 className="animate-spin mb-4" size={40} />
                    <p>Loading your masterpiece collection...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {images.map((img) => (
                        <motion.div
                            layout
                            key={img._id}
                            className="group relative bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all"
                        >
                            <div className="aspect-[4/5] relative">
                                <img
                                    src={img.url}
                                    alt={img.caption}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="absolute top-4 right-4 flex gap-2 translate-y-[-10px] group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <button
                                        onClick={() => handleDelete(img._id)}
                                        className="p-3 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 active:scale-90 transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                                        <span className="text-[10px] font-black text-[#FACC15] uppercase tracking-widest bg-black px-2 py-1 rounded-md mb-2 inline-block">
                                            {img.category}
                                        </span>
                                        <p className="text-white text-sm font-bold truncate">{img.caption || 'No caption'}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {images.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem]">
                            <ImageIcon size={48} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="text-xl font-bold text-slate-400">No images yet</h3>
                            <p className="text-slate-400 text-sm mt-2">Start by uploading some beautiful shots of Sri Lanka!</p>
                        </div>
                    )}
                </div>
            )}

            {/* Upload Modal */}
            <AnimatePresence>
                {showUploadModal && (
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
                            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
                        >
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">New Masterpiece</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Upload a gallery image</p>
                                </div>
                                <button onClick={() => setShowUploadModal(false)} className="p-3 hover:bg-slate-200 rounded-2xl transition-all text-slate-400">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleUpload} className="p-8 space-y-6">
                                <div className="space-y-4">
                                    {!newImage.preview ? (
                                        <label className="border-4 border-dashed border-slate-100 rounded-[2rem] p-12 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-50/30 transition-all group">
                                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-emerald-100 group-hover:text-emerald-500 transition-all mb-4">
                                                <ImageIcon size={32} />
                                            </div>
                                            <p className="text-slate-600 font-bold">Select Image</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-2">JPG, PNG, WEBP (Max 10MB)</p>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    ) : (
                                        <div className="relative aspect-video rounded-3xl overflow-hidden border-4 border-slate-50 shadow-inner group">
                                            <img src={newImage.preview} className="w-full h-full object-cover" />
                                            <button 
                                                type="button"
                                                onClick={() => setNewImage({ ...newImage, file: null, preview: null })}
                                                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black text-white rounded-xl backdrop-blur-md transition-all"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Caption</label>
                                            <input
                                                type="text"
                                                placeholder="Beautiful Sigiriya Sunrise..."
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                                value={newImage.caption}
                                                onChange={e => setNewImage({ ...newImage, caption: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                            <select
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none cursor-pointer focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                                value={newImage.category}
                                                onChange={e => setNewImage({ ...newImage, category: e.target.value })}
                                            >
                                                <option>General</option>
                                                <option>Sigiriya</option>
                                                <option>Destination</option>
                                                <option>Vehicles</option>
                                                <option>Tours</option>
                                                <option>Customer Memories</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowUploadModal(false)}
                                        className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={uploading || !newImage.file}
                                        className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all"
                                    >
                                        {uploading ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Check size={20} />
                                                Finish Upload
                                            </>
                                        )}
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
