'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Camera, Instagram, Plane, MapPin } from 'lucide-react';

export default function HomeGallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        fetch('/api/public/gallery')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // Limit to 5 images for home page as requested
                    setImages(data.data.slice(0, 5));
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Auto-slider logic
    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollContainerRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
                
                // If we reached the end, scroll back to 0
                if (scrollLeft + clientWidth >= scrollWidth - 10) {
                    scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    // Scroll by approx one item width
                    const itemWidth = window.innerWidth < 768 ? window.innerWidth * 0.85 : window.innerWidth / 3;
                    scrollContainerRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
                }
            }
        }, 3500); // 3.5 seconds
        
        return () => clearInterval(interval);
    }, []);

    // Fallback if no images uploaded yet
    const fallbackImages = [
        { url: 'https://images.unsplash.com/photo-1588258219511-64eb629cb833?q=80&w=1600&auto=format&fit=crop', caption: 'Sigiriya Rock Fortress', category: 'Sigiriya' },
        { url: 'https://images.unsplash.com/photo-1588258219511-64eb629cb833?q=80&w=1600&auto=format&fit=crop', caption: 'Ancient Royal Gardens', category: 'Sigiriya' },
        { url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1600&auto=format&fit=crop', caption: 'Tea Trails of Nuwara Eliya', category: 'Highlands' },
        { url: 'https://images.unsplash.com/photo-1588258219511-64eb629cb833?q=80&w=1600&auto=format&fit=crop', caption: 'Kandy Temple of Tooth', category: 'Cultural' },
        { url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1600&auto=format&fit=crop', caption: 'Mirissa Beach', category: 'Coastal' }
    ];

    const displayImages = images.length > 0 ? images : fallbackImages;

    return (
        <section className="py-8 bg-[#0a0a0a] dark:bg-black border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-10 h-10 bg-[#FACC15] flex items-center justify-center rounded-xl shadow-sm rotate-3">
                                <Camera size={20} className="text-black" strokeWidth={2.5} />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/60">Travel Memories</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl text-white leading-[1.1] font-black uppercase tracking-tighter">
                            Experience <br /><span className="text-[#FACC15]">Sri Lanka</span>
                        </h2>
                    </div>
                    
                    <Link 
                        href="/gallery"
                        aria-label="View our photo gallery of Sri Lanka"
                        className="group flex items-center justify-center gap-2 bg-[#FACC15] text-black px-6 py-2.5 rounded-full font-black uppercase tracking-widest text-[10px] border border-[#FACC15] shadow-sm hover:shadow-md hover:-translate-y-1 hover:bg-black hover:text-[#FACC15] hover:border-black transition-all duration-300 self-start md:self-end w-fit"
                    >
                        VIEW FULL GALLERY <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </Link>
                </div>

                <div 
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-8 scrollbar-hide scroll-smooth -mx-4 px-4 md:mx-0 md:px-0"
                >
                    {displayImages.map((img, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group relative min-w-[65vw] sm:min-w-[40vw] md:min-w-[calc(33.333%-16px)] snap-start shrink-0"
                        >
                            <div className="bg-black border border-slate-200 dark:border-slate-800 rounded-[1.5rem] shadow-lg overflow-hidden">
                                <div className="aspect-[4/5] relative">
                                    <Image 
                                        src={img.url} 
                                        alt={img.caption || 'Sri Lanka Travel Memory'}
                                        fill
                                        className="w-full h-full object-cover transition-all duration-700"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 384px"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    
                                    {img.category && img.category.toLowerCase() !== 'general' && (
                                        <div className="absolute top-6 right-6">
                                            <div className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] px-3 py-2 text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                                                {img.category.toLowerCase().includes('airport') ? (
                                                    <Plane size={16} className="text-[#FACC15] drop-shadow-md" />
                                                ) : (
                                                    <MapPin size={16} className="text-[#FACC15] drop-shadow-md" />
                                                )}
                                                {img.category}
                                            </div>
                                        </div>
                                    )}

                                    <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/60 to-transparent">
                                        <p className="text-white font-black uppercase tracking-tight text-xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] line-clamp-2">{img.caption}</p>
                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t-4 border-black/5 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
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
