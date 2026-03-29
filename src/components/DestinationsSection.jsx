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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayDestinations.map((dest, idx) => (
                        <motion.div
                            key={dest.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative cursor-pointer"
                        >
                            {/* Card Wrapper */}
                            <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-[2.5rem] border-4 border-black shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                {/* Destination Image */}
                                <Image
                                    src={dest.img || '/placeholder-destination.jpg'}
                                    alt={dest.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                {/* Content Overlay */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                    <div className="flex items-center gap-2 text-white/80 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                                        <MapPin size={12} className="text-[#FACC15]" />
                                        SRI LANKA
                                    </div>
                                    
                                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
                                        {dest.name}
                                    </h3>
                                    
                                    <p className="text-white/60 text-sm font-medium line-clamp-2 mb-6">
                                        {dest.meta || dest.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="bg-[#FF5C00] text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none transition-all">
                                            {Math.floor(Math.random() * 15) + 5}+ Deals
                                        </div>
                                        
                                        <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                            <ArrowRight size={20} className="text-black" />
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
