'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { destinations } from '@/lib/destinations';

const DestinationsSection = () => {
    // Select a subset of popular destinations for the grid
    const featuredDestinations = [
        'mirissa',
        'sigiriya', 
        'ella', 
        'kandy', 
        'nuwaraeliya',
        'trincomalee',
        'galle',
        'bentota'
    ];
    
    const displayDestinations = destinations.filter(d => featuredDestinations.includes(d.id));

    // Ensure they are displayed in the exact order specified
    const orderedDestinations = featuredDestinations.map(id => displayDestinations.find(d => d.id === id)).filter(Boolean);

    return (
        <section className="py-24 bg-slate-50 dark:bg-black transition-colors destinations-bg">
            <div className="container mx-auto px-6">
                {/* Header Section */}
                <div className="mb-16 text-center">
                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 leading-none uppercase tracking-tighter font-montserrat">
                        Explore Sri Lankan <br />
                        <span className="text-[#FACC15] italic font-serif normal-case">Destinations</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-bold uppercase tracking-[0.3em] max-w-xl mx-auto opacity-80">
                        Discover amazing deals and seamless transfers across the paradise island.
                    </p>
                </div>

                {/* Destinations Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {orderedDestinations.map((dest, idx) => (
                        <motion.div
                            key={dest.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            onClick={() => {
                                window.location.href = `/?tab=ride&destination=${encodeURIComponent(dest.name)}#booking`;
                            }}
                            className="group relative cursor-pointer"
                        >
                            {/* Card Wrapper */}
                            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:rounded-3xl border border-slate-200 dark:border-white/10 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                {/* Destination Image */}
                                <Image
                                    src={dest.img || '/placeholder-destination.jpg'}
                                    alt={dest.name}
                                    fill
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />

                                {/* Content Overlay */}
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
        </section>
    );
};

export default DestinationsSection;
