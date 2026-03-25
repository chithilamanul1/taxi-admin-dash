'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Hero = () => {
    const destinations = [
        { id: 1, name: 'MIRISSA BEACH', image: '/Hero/hero_mirissa.jpg', rotate: -6, zIndex: 10 },
        { id: 2, name: 'YALA SAFARI', image: '/Hero/safari_tour.png', rotate: 4, zIndex: 20 },
        { id: 3, name: 'ELLA NINE ARCH', image: '/Hero/ella.jpg', rotate: -2, zIndex: 15 },
        { id: 4, name: 'SIGIRIYA ROCK', image: '/Hero/sigiriya.jpg', rotate: 8, zIndex: 5 },
    ];

    return (
        <section className="relative min-h-[90vh] bg-white dark:bg-[#0a0a0a] overflow-hidden pt-32 pb-20 flex items-center justify-center">
            
            {/* Background Doodles/Accents */}
            <div className="absolute top-40 left-10 w-64 h-64 border-2 border-black/5 -rotate-12 -z-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.02)_10px,rgba(0,0,0,0.02)_20px)]"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 border-2 border-black/5 rotate-12 -z-10 rounded-full"></div>

            <div className="container mx-auto px-6 relative">
                <div className="flex flex-wrap justify-center gap-8 md:gap-4 items-center">
                    {destinations.map((dest, i) => (
                        <motion.div
                            key={dest.id}
                            initial={{ opacity: 0, y: 50, rotate: 0 }}
                            animate={{ opacity: 1, y: 0, rotate: dest.rotate }}
                            whileHover={{ 
                                rotate: 0, 
                                scale: 1.05, 
                                zIndex: 50,
                                transition: { duration: 0.3 }
                            }}
                            className="relative bg-white border-[8px] border-black p-4 pb-16 w-full max-w-[320px] shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] cursor-pointer group"
                            style={{ zIndex: dest.zIndex }}
                        >
                            {/* Card Number */}
                            <div className="absolute top-4 right-4 z-20 w-12 h-12 bg-slate-100 border-4 border-black rounded-full flex items-center justify-center font-black italic text-sm">
                                0{dest.id}
                            </div>

                            {/* Image Container */}
                            <div className="relative aspect-square overflow-hidden border-4 border-black">
                                <Image
                                    src={dest.image}
                                    alt={dest.name}
                                    fill
                                    className="object-cover grayscale-[0%] group-hover:grayscale-0 transition-all duration-500"
                                />
                            </div>

                            {/* Info Section */}
                            <div className="mt-8">
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-black">
                                    {dest.name}
                                </h3>
                            </div>

                            {/* Polaroid Bottom Shine/Texture */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-black/5"></div>
                        </motion.div>
                    ))}
                </div>

                {/* Main CTA Overlay (Floating) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[100] w-full text-center hidden md:block">
                     <div className="bg-black text-[#FACC15] inline-block px-12 py-6 border-8 border-black font-black text-6xl italic uppercase tracking-tighter shadow-[20px_20px_0px_0px_#FACC15]">
                        Explored by You
                    </div>
                </div>
            </div>

            {/* Bottom Border Accent */}
            <div className="absolute bottom-0 left-0 w-full h-8 bg-black"></div>
        </section>
    );
};

export default Hero;
