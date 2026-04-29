'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { destinations } from '@/lib/destinations';

const DestinationsSection = () => {
    // Select a subset of popular destinations for the grid
    const featuredDestinations = [
        'sigiriya', 
        'trincomalee', 
        'ella', 
        'kandy', 
        'mirissa', 
        'nuwaraeliya'
    ];
    
    const displayDestinations = destinations.filter(d => featuredDestinations.includes(d.id));

    return (
        <section className="py-24 bg-white dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-6">
                {/* Header Section */}
                <div className="mb-16">
                    <h2 className="text-4xl md:text-6xl font-black text-black dark:text-white uppercase tracking-tighter mb-4">
                        Explore Sri Lankan <span className="text-[#FACC15]">Destinations</span>
                    </h2>
                    <p className="text-xl text-gray-500 dark:text-gray-400 font-medium tracking-tight">
                        Discover amazing deals and seamless transfers across the paradise island.
                    </p>
                </div>

                {/* Destinations Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                    {displayDestinations.map((dest, idx) => (
                        <motion.div
                            key={dest.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            onClick={() => {
                                window.location.href = `/?destination=${dest.name}#booking`;
                            }}
                            className="group relative cursor-pointer"
                        >
                            {/* Card Wrapper */}
                            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 dark:border-white/10 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                {/* Destination Image */}
                                <Image
                                    src={dest.img || '/placeholder-destination.jpg'}
                                    alt={dest.name}
                                    fill
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                {/* Content Overlay */}
                                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                                    <div className="flex items-center gap-1.5 text-white/80 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-1 md:mb-2">
                                        <MapPin size={10} className="text-[#FACC15] md:w-3 md:h-3" />
                                        SRI LANKA
                                    </div>
                                    
                                    <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter mb-1 md:mb-2">
                                        {dest.name}
                                    </h3>
                                    
                                    <p className="hidden md:block text-white/60 text-xs font-medium line-clamp-2 mb-4">
                                        {dest.meta || dest.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="bg-[#FACC15] text-black px-3 md:px-5 py-1.5 md:py-2 rounded-full text-[9px] md:text-xs font-black uppercase tracking-widest border border-slate-100 dark:border-white/10 shadow-lg group-hover:shadow-none transition-all">
                                            {(idx * 3) + 12}+ Deals
                                        </div>
                                        
                                        <div className="hidden md:flex w-8 h-8 md:w-10 md:h-10 bg-white border border-slate-100 dark:border-white/10 items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                            <ArrowRight size={16} className="text-black md:w-5 md:h-5" />
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
