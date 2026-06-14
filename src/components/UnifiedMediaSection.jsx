'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin, ArrowRight, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { destinations } from '@/lib/destinations';

const UnifiedMediaSection = () => {
    const [galleryImages, setGalleryImages] = useState([]);
    const [galleryVideos, setGalleryVideos] = useState([]);

    useEffect(() => {
        // Fetch gallery images
        fetch('/api/admin/gallery')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    let activeImages = data.data.filter(img => img.isActive !== false);
                    const pinnedId = "gallery/dxmldi7mwuwygv9zpgh6";
                    const pinnedImgIndex = activeImages.findIndex(img => img.public_id === pinnedId);
                    if (pinnedImgIndex > -1) {
                        const pinnedImg = activeImages.splice(pinnedImgIndex, 1)[0];
                        activeImages.unshift(pinnedImg);
                    }
                    setGalleryImages(activeImages);
                }
            })
            .catch(console.error);

        // Fetch gallery videos
        fetch('/api/admin/gallery-videos')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setGalleryVideos(data.data.filter(vid => vid.isActive !== false));
                }
            })
            .catch(console.error);
    }, []);

    const featuredDestinations = [
        'mirissa', 'sigiriya', 'ella', 'kandy', 
        'nuwaraeliya', 'trincomalee', 'galle', 'bentota',
        'ahangama', 'arugambay', 'yala', 'colombo', 'udawalawa'
    ];
    
    const displayDestinations = destinations.filter(d => featuredDestinations.includes(d.id));
    const orderedDestinations = featuredDestinations.map(id => displayDestinations.find(d => d.id === id)).filter(Boolean);

    // Fallback video if DB is empty, as per previous state
    const videosToDisplay = galleryVideos.length > 0 ? galleryVideos : [
        { _id: 'default-vid', url: 'https://www.youtube.com/watch?v=cDo130uXlEQ', platform: 'youtube' }
    ];

    const getEmbedUrl = (url, platform) => {
        if (!url) return '';
        if (platform === 'youtube') {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = url.match(regExp);
            if (match && match[2].length === 11) {
                return `https://www.youtube.com/embed/${match[2]}?rel=0`;
            }
        }
        if (platform === 'facebook') {
            return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=560`;
        }
        if (platform === 'tiktok') {
            // TikTok embed is tricky via iframe without their script, but we try a basic approach
            const videoIdMatch = url.match(/video\/(\d+)/);
            if (videoIdMatch && videoIdMatch[1]) {
                return `https://www.tiktok.com/embed/v2/${videoIdMatch[1]}`;
            }
        }
        return url; // fallback
    };

    return (
        <section id="unified-media" className="pt-12 pb-0 bg-slate-50 dark:bg-[#050505] overflow-hidden transition-colors duration-300">
            <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
                
                {/* 1. Destinations Sub-Section */}
                <div className="mb-12">
                    <div className="mb-6 text-left md:text-center">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 leading-none tracking-tighter font-montserrat">
                            Top Destinations
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] md:mx-auto opacity-80">
                            Discover amazing deals and seamless transfers
                        </p>
                    </div>

                    <div className="flex overflow-x-auto gap-4 md:gap-6 snap-x hide-scrollbar pb-4">
                        {orderedDestinations.map((dest, idx) => (
                            <motion.div
                                key={dest.id}
                                initial={{ opacity: 1, y: 0 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => {
                                    window.location.href = `/?tab=ride&destination=${encodeURIComponent(dest.name)}#booking`;
                                }}
                                className="group relative cursor-pointer shrink-0 snap-start w-[50vw] sm:w-[35vw] md:w-[28vw] lg:w-[20vw]"
                            >
                                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:rounded-3xl border border-slate-200 dark:border-white/10 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <Image
                                        src={dest.img || '/placeholder-destination.jpg'}
                                        alt={dest.name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
                                    <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                                        <div className="flex items-center gap-1.5 text-white/90 text-[10px] md:text-xs font-black tracking-wider mb-1 md:mb-2 font-montserrat">
                                            <MapPin size={12} className="text-[#FACC15] md:w-3.5 md:h-3.5" />
                                            SRI LANKA
                                        </div>
                                        <h3 className="text-xl md:text-3xl font-black text-white tracking-tight mb-1 md:mb-2 uppercase font-montserrat">
                                            {dest.name}
                                        </h3>
                                        <p className="hidden md:block text-white/80 text-xs md:text-sm font-medium line-clamp-2 mb-4">
                                            {dest.meta || dest.description}
                                        </p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="bg-[#FACC15] text-black px-3 md:px-5 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest shadow-sm transition-all">
                                                {(idx * 3) + 12}+ Deals
                                            </div>
                                            <div className="hidden md:flex w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-md text-white items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 hover:bg-[#FACC15] hover:text-black">
                                                <ArrowRight size={16} className="md:w-5 md:h-5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* 2. Video Player Sub-Section */}
                <div className="mb-12">
                    <div className="flex overflow-x-auto gap-6 snap-x hide-scrollbar pb-4">
                        {videosToDisplay.map((vid, idx) => (
                            <div 
                                key={vid._id || idx} 
                                className={`shrink-0 snap-center rounded-2xl md:rounded-[2.5rem] overflow-hidden ${videosToDisplay.length === 1 ? 'w-full max-w-4xl mx-auto' : 'w-[85vw] md:w-[60vw] lg:w-[50vw]'}`}
                            >
                                <div className="relative w-full aspect-video bg-black flex items-center justify-center group">
                                    {getEmbedUrl(vid.url, vid.platform) ? (
                                        <iframe 
                                            src={getEmbedUrl(vid.url, vid.platform)} 
                                            title="Video Player" 
                                            className="absolute top-0 left-0 w-full h-full"
                                            frameBorder="0" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <p className="text-white">Invalid video URL</p>
                                    )}
                                </div>
                                {vid.caption && (
                                    <div className="bg-white dark:bg-zinc-900 p-4 text-center">
                                        <p className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest">{vid.caption}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Photo Gallery Carousel Sub-Section */}
                {galleryImages.length > 0 && (
                    <div className="mb-8">
                        <div className="mb-6 text-left md:text-center">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 leading-none tracking-tighter font-montserrat">
                                Traveler Moments
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] md:mx-auto opacity-80">
                                Swipe through our latest journeys
                            </p>
                        </div>
                        
                        <div className="flex overflow-x-auto gap-4 md:gap-6 snap-x hide-scrollbar pb-4">
                            {galleryImages.map((img, idx) => (
                                <motion.div
                                    key={img._id}
                                    initial={{ opacity: 1, y: 0 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="group relative shrink-0 snap-start w-[50vw] sm:w-[35vw] md:w-[28vw] lg:w-[20vw]"
                                >
                                    {/* Must match destination card dimensions aspect-[4/5] */}
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:rounded-3xl border border-slate-200 dark:border-white/10 shadow-md">
                                        <Image
                                            src={img.url}
                                            alt={img.caption || 'Travel gallery'}
                                            fill
                                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        
                                        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            <div className="bg-white/10 backdrop-blur-md p-3 md:p-4 rounded-xl border border-white/20">
                                                {img.category && (
                                                    <span className="text-[9px] md:text-[10px] font-black text-[#FACC15] uppercase tracking-widest bg-black px-2 py-1 rounded-md mb-1 inline-block">
                                                        {img.category}
                                                    </span>
                                                )}
                                                {img.caption && (
                                                    <p className="text-white text-xs md:text-sm font-bold line-clamp-2">{img.caption}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default UnifiedMediaSection;
