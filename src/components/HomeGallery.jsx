'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, Instagram } from 'lucide-react';

export default function HomeGallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/public/gallery')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // Take first 6 images or a few featured ones
                    setImages(data.data.slice(0, 6));
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Fallback if no images uploaded yet
    const fallbackImages = [
        { url: 'https://images.unsplash.com/photo-1588258219511-64eb629cb833?q=80&w=1600&auto=format&fit=crop', caption: 'Sigiriya Rock Fortress', category: 'Sigiriya' },
        { url: 'https://images.unsplash.com/photo-1588258219511-64eb629cb833?q=80&w=1600&auto=format&fit=crop', caption: 'Ancient Royal Gardens', category: 'Sigiriya' },
        { url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1600&auto=format&fit=crop', caption: 'Tea Trails of Nuwara Eliya', category: 'Highlands' }
    ];

    const displayImages = images.length > 0 ? images : fallbackImages;

    return (
        <section className="py-24 bg-white dark:bg-black border-t-8 border-black">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-black dark:bg-[#FACC15] flex items-center justify-center border-4 border-black rotate-3">
                                <Camera size={24} className="text-[#FACC15] dark:text-black" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40 dark:text-white/40">Travel Memories</span>
                        </div>
                        <h2 className="text-5xl md:text-8xl font-black text-black dark:text-white uppercase tracking-tighter leading-none">
                            EXPERIENCE <br /><span className="text-[#FACC15]">SRI LANKA</span>
                        </h2>
                    </div>
                    
                    <Link 
                        href="/gallery"
                        className="group flex items-center gap-4 bg-black text-[#FACC15] px-8 py-4 font-black uppercase tracking-widest text-xs border-4 border-black shadow-[8px_8px_0px_0px_rgba(250,204,21,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                    >
                        VIEW FULL GALLERY <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {displayImages.map((img, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={`group relative ${idx % 2 === 1 ? 'md:mt-12' : ''}`}
                        >
                            <div className="bg-black border-4 border-black rounded-[2rem] shadow-xl overflow-hidden transition-all group-hover:shadow-2xl group-hover:-translate-y-2">
                                <div className="aspect-[4/5] relative">
                                    <img 
                                        src={img.url} 
                                        alt={img.caption}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    
                                    <div className="absolute top-6 right-6">
                                        <div className="bg-[#FACC15] text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2 border-black">
                                            {img.category}
                                        </div>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="bg-white p-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                            <p className="text-black font-black uppercase tracking-tight text-sm line-clamp-1">{img.caption}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-24 pt-12 border-t-4 border-black/5 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-black/40 dark:text-white/40 font-black uppercase tracking-[0.2em] text-[10px] max-w-sm text-center md:text-left">
                        Our gallery is updated daily with authentic moments from our travelers. Join the journey and share your moments with #AirportTaxisSL
                    </p>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-black dark:text-[#FACC15] font-black uppercase tracking-widest text-[10px]">
                            <Instagram size={18} /> @AIRPORTTAXIS.SL
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
