'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MapPin, ArrowRight, Expand, X, Loader2 } from 'lucide-react';
import Footer from '@/components/Footer';

export default function GalleryPage() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetch('/api/public/gallery')
            .then(res => res.json())
            .then(data => {
                if (data.success) setImages(data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const categories = ['All', ...new Set(images.map(img => img.category))];
    const filteredImages = filter === 'All' ? images : images.filter(img => img.category === filter);

    return (
        <main className="bg-white dark:bg-black min-h-screen transition-colors duration-500">

            {/* Hero Section */}
            <section className="pt-32 pb-20 border-b-[16px] border-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="max-w-3xl">
                            <h1 className="text-7xl md:text-9xl font-black text-black dark:text-white uppercase tracking-tighter leading-none mb-6">
                                VISUAL <br /><span className="text-[#FACC15]">JOURNEY</span>
                            </h1>
                            <p className="text-black/40 dark:text-white/40 font-black uppercase tracking-[0.3em] text-xs md:text-sm max-w-xl">
                                Explore the breathtaking landscapes, cultural heritage, and unforgettable moments captured across Sri Lanka.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="w-32 h-32 bg-black dark:bg-[#FACC15] flex items-center justify-center rotate-12 border-4 border-black">
                                <Camera size={48} className="text-[#FACC15] dark:text-black" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filter Bar */}
            <div className="sticky top-[80px] z-40 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b-4 border-black">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-nowrap gap-4 overflow-x-auto scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 font-black uppercase tracking-widest text-[10px] whitespace-nowrap transition-all border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none ${filter === cat ? 'bg-[#FACC15] text-black' : 'bg-white dark:bg-black text-black dark:text-white hover:bg-black hover:text-[#FACC15]'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Gallery Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40 grayscale opacity-20">
                            <Loader2 className="animate-spin mb-6" size={64} />
                            <p className="font-black uppercase tracking-[0.5em] text-sm italic">Developing master copies...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                            {filteredImages.map((img, idx) => (
                                <motion.div
                                    layout
                                    key={img._id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: (idx % 3) * 0.1 }}
                                    className="group relative"
                                >
                                    <div className="bg-black border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(250,204,21,0.5)] transition-all group-hover:translate-x-[-4px] group-hover:translate-y-[-4px] group-hover:shadow-[16px_16px_0px_0px_rgba(250,204,21,1)]">
                                        <div 
                                            className="aspect-[4/5] relative overflow-hidden cursor-zoom-in"
                                            onClick={() => setSelectedImage(img)}
                                        >
                                            <img
                                                src={img.url}
                                                alt={img.caption}
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Expand size={48} className="text-[#FACC15] scale-0 group-hover:scale-100 transition-transform duration-500" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className="bg-black text-[#FACC15] px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                                                {img.category}
                                            </span>
                                            <div className="flex-1 h-[2px] bg-black/10 dark:bg-white/10" />
                                        </div>
                                        <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter leading-none group-hover:text-[#FACC15] transition-colors line-clamp-2">
                                            {img.caption || 'Untitiled Experience'}
                                        </h3>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {!loading && filteredImages.length === 0 && (
                        <div className="text-center py-40 border-8 border-black border-dashed">
                            <h3 className="text-4xl font-black text-black dark:text-white uppercase tracking-tighter mb-4">No Visuals Found</h3>
                            <p className="text-black/40 uppercase tracking-widest font-black text-xs italic">The archives are currently empty for this sector.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 40 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 40 }}
                            className="relative max-w-6xl w-full max-h-full flex flex-col items-center"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-16 right-0 text-white hover:text-[#FACC15] transition-colors"
                            >
                                <X size={48} strokeWidth={3} />
                            </button>
                            
                            <div className="bg-[#FACC15] p-2 border-4 border-black shadow-[20px_20px_0px_0px_rgba(255,255,255,0.1)]">
                                <img
                                    src={selectedImage.url}
                                    className="max-h-[70vh] w-auto border-4 border-black object-contain"
                                    alt={selectedImage.caption}
                                />
                            </div>

                            <div className="mt-12 text-center space-y-4 max-w-2xl">
                                <span className="bg-[#FACC15] text-black px-4 py-2 text-xs font-black uppercase tracking-[0.3em] inline-block">
                                    {selectedImage.category}
                                </span>
                                <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                                    {selectedImage.caption || 'UNFORGETTABLE MOMENT'}
                                </h2>
                                <div className="flex items-center justify-center gap-6 mt-8">
                                    <button
                                        onClick={() => setSelectedImage(null)}
                                        className="bg-white text-black px-10 py-4 font-black text-xs uppercase tracking-widest flex items-center gap-3 border-4 border-black shadow-[8px_8px_0px_0px_rgba(250,204,21,1)] active:translate-y-1 active:shadow-none transition-all"
                                    >
                                        RETURN TO COLLECTION <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            
        </main>
    );
}
