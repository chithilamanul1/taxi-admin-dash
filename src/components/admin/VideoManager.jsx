'use client';

import { useState, useEffect } from 'react';
import { Video, Plus, Trash2, Edit2, Loader2, X, Check, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VideoManager() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newVideo, setNewVideo] = useState({ url: '', caption: '' });
    const [editVideo, setEditVideo] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/gallery-videos');
            const data = await res.json();
            if (data.success) setVideos(data.data);
        } catch (err) {
            console.error('Failed to fetch videos', err);
        } finally {
            setLoading(false);
        }
    };

    const detectPlatform = (url) => {
        if (!url) return 'other';
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'youtube';
        if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.watch')) return 'facebook';
        if (lowerUrl.includes('tiktok.com')) return 'tiktok';
        return 'other';
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newVideo.url) return alert('Please enter a video URL');

        setAdding(true);
        try {
            const platform = detectPlatform(newVideo.url);
            
            const res = await fetch('/api/admin/gallery-videos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: newVideo.url,
                    platform,
                    caption: newVideo.caption
                })
            });
            const data = await res.json();

            if (data.success) {
                setVideos([data.data, ...videos]);
                setShowAddModal(false);
                setNewVideo({ url: '', caption: '' });
            } else {
                throw new Error(data.error || 'Failed to save to database');
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this video?')) return;
        try {
            const res = await fetch(`/api/admin/gallery-videos?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setVideos(videos.filter(v => v._id !== id));
            } else {
                alert('Delete failed');
            }
        } catch (err) {
            alert('Error deleting video');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const res = await fetch('/api/admin/gallery-videos', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    _id: editVideo._id,
                    caption: editVideo.caption,
                    isActive: editVideo.isActive,
                    sortOrder: editVideo.sortOrder
                })
            });
            const data = await res.json();
            if (data.success) {
                setVideos(videos.map(v => v._id === editVideo._id ? data.data : v));
                setShowEditModal(false);
                setEditVideo(null);
            } else {
                alert('Update failed: ' + data.error);
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setUpdating(false);
        }
    };

    const toggleStatus = async (video) => {
        try {
            const res = await fetch('/api/admin/gallery-videos', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    _id: video._id,
                    isActive: !video.isActive
                })
            });
            const data = await res.json();
            if (data.success) {
                setVideos(videos.map(v => v._id === video._id ? data.data : v));
            }
        } catch (err) {
            alert('Status toggle failed');
        }
    };

    // Very basic thumbnail extraction for UI preview purposes only (Frontend player will handle proper embeds)
    const getPreviewEmbed = (url, platform) => {
        if (platform === 'youtube') {
            let videoId = '';
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = url.match(regExp);
            if (match && match[2].length === 11) {
                videoId = match[2];
            }
            if (videoId) {
                return <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} className="w-full h-full object-cover" />;
            }
        }
        return (
            <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white p-4 text-center">
                <Video size={32} className="mb-2 opacity-50" />
                <span className="text-[10px] font-black uppercase tracking-widest">{platform} Video</span>
                <span className="text-xs text-slate-400 mt-1 truncate w-full">{url}</span>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Video Gallery</h2>
                    <p className="text-slate-500 mt-1">Manage videos (YouTube, Facebook, TikTok) to display.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                    <Plus size={20} /> Add Video Link
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 italic text-slate-400">
                    <Loader2 className="animate-spin mb-4" size={40} />
                    <p>Loading video links...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {videos.map((vid) => (
                        <motion.div
                            layout
                            key={vid._id}
                            className={`group relative bg-white rounded-[2rem] overflow-hidden border ${!vid.isActive ? 'border-red-200 opacity-60 grayscale' : 'border-slate-100 shadow-sm hover:shadow-xl'} transition-all`}
                        >
                            <div className="aspect-video relative bg-slate-100 overflow-hidden">
                                {getPreviewEmbed(vid.url, vid.platform)}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="absolute top-4 right-4 flex gap-2 translate-y-[-10px] group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                                    <button
                                        onClick={() => toggleStatus(vid)}
                                        className={`p-2 rounded-xl shadow-lg transition-all text-white ${vid.isActive ? 'bg-orange-500 hover:bg-orange-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                                        title={vid.isActive ? 'Hide Video' : 'Show Video'}
                                    >
                                        {vid.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditVideo(vid);
                                            setShowEditModal(true);
                                        }}
                                        className="p-2 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-all"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(vid._id)}
                                        className="p-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 border-t border-slate-100">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mb-2 inline-block ${vid.platform === 'youtube' ? 'bg-red-100 text-red-600' : vid.platform === 'facebook' ? 'bg-blue-100 text-blue-600' : vid.platform === 'tiktok' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                    {vid.platform}
                                </span>
                                <p className="text-slate-800 text-sm font-bold truncate">{vid.caption || 'No caption'}</p>
                            </div>
                        </motion.div>
                    ))}

                    {videos.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem]">
                            <Video size={48} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="text-xl font-bold text-slate-400">No videos yet</h3>
                            <p className="text-slate-400 text-sm mt-2">Add YouTube, Facebook, or TikTok links to feature them!</p>
                        </div>
                    )}
                </div>
            )}

            {/* Add Modal */}
            <AnimatePresence>
                {showAddModal && (
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
                                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Add Video Link</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Paste URL below</p>
                                </div>
                                <button onClick={() => setShowAddModal(false)} className="p-3 hover:bg-slate-200 rounded-2xl transition-all text-slate-400">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleAdd} className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Video URL</label>
                                        <input
                                            type="url"
                                            required
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-800"
                                            value={newVideo.url}
                                            onChange={e => setNewVideo({ ...newVideo, url: e.target.value })}
                                        />
                                        <p className="text-[9px] text-slate-400 font-bold uppercase px-1">Supports: YouTube, Facebook, TikTok</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Caption (Optional)</label>
                                        <input
                                            type="text"
                                            placeholder="Airport Taxi Transfer Video..."
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-800"
                                            value={newVideo.caption}
                                            onChange={e => setNewVideo({ ...newVideo, caption: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={adding || !newVideo.url}
                                        className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all"
                                    >
                                        {adding ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />} Add Video
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Modal */}
            <AnimatePresence>
                {showEditModal && editVideo && (
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
                                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Edit Video</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Update details</p>
                                </div>
                                <button onClick={() => { setShowEditModal(false); setEditVideo(null); }} className="p-3 hover:bg-slate-200 rounded-2xl transition-all text-slate-400">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="p-8 space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Video URL (Read Only)</label>
                                    <input
                                        type="url"
                                        disabled
                                        value={editVideo.url}
                                        className="w-full bg-slate-100 border-2 border-slate-200 px-6 py-4 rounded-2xl block text-slate-500 font-bold mt-2"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Caption</label>
                                    <input
                                        type="text"
                                        value={editVideo.caption}
                                        onChange={(e) => setEditVideo({ ...editVideo, caption: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-slate-200 px-6 py-4 rounded-2xl block text-slate-700 font-bold mt-2 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                                        placeholder="Update caption..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-8"
                                >
                                    {updating ? <Loader2 size={24} className="animate-spin" /> : "Save Changes"}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
