'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Hero = () => {
    const destinations = [
        { id: 1, name: 'MIRISSA BEACH', image: '/Hero/mirissa_illust.jpg', rotate: -3 },
        { id: 2, name: 'YALA SAFARI', image: '/Hero/safari_tour.png', rotate: 2 },
        { id: 3, name: 'ELLA NINE ARCH', image: '/Hero/ella.jpg', rotate: -2 },
        { id: 4, name: 'SIGIRIYA ROCK', image: '/Hero/sigiriya_illust.jpg', rotate: 3 },
        { id: 5, name: 'ARUGAM BAY', image: '/Hero/arugam_surf.jpg', rotate: -1 },
        { id: 6, name: 'KANDY TOWER', image: '/Hero/tower.jpg', rotate: 2 },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => setCurrentIndex((prev) => (prev + 1) % destinations.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + destinations.length) % destinations.length);

    return (
        <section className="relative min-h-[90vh] bg-white dark:bg-[#0a0a0a] overflow-hidden pt-32 pb-20 flex items-center justify-center">
            
            {/* Background Doodles/Accents */}
            <div className="absolute top-40 left-10 w-64 h-64 border-2 border-black/5 -rotate-12 -z-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.02)_10px,rgba(0,0,0,0.02)_20px)]"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 border-2 border-black/5 rotate-12 -z-10 rounded-full"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="relative flex items-center justify-center">
                    
                    {/* Carousel Container */}
                    <div className="w-full max-w-[500px] overflow-hidden py-12 px-4">
                        <motion.div 
                            className="flex"
                            animate={{ x: `-${currentIndex * 100}%` }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            {destinations.map((dest, i) => (
                                <div key={dest.id} className="min-w-full flex justify-center">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ 
                                            opacity: 1, 
                                            scale: 1,
                                            rotate: dest.rotate
                                        }}
                                        className="relative bg-white border-[10px] border-black p-5 pb-20 w-full shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] group"
                                    >
                                        {/* Card Number */}
                                        <div className="absolute top-6 right-6 z-20 w-14 h-14 bg-[#FACC15] border-4 border-black rounded-full flex items-center justify-center font-black italic text-lg shadow-[4px_4px_0px_0px_#000]">
                                            0{dest.id}
                                        </div>

                                        {/* Image Container */}
                                        <div className="relative aspect-square overflow-hidden border-4 border-black bg-slate-100">
                                            <Image
                                                src={dest.image}
                                                alt={dest.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                priority={i === 0}
                                            />
                                        </div>

                                        {/* Info Section */}
                                        <div className="mt-10">
                                            <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-black">
                                                {dest.name}
                                            </h3>
                                        </div>

                                        {/* Polaroid Texture */}
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/5"></div>
                                    </motion.div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Navigation Buttons */}
                    <button 
                        onClick={prev}
                        className="absolute left-0 lg:-left-20 z-50 w-16 h-16 bg-white border-8 border-black flex items-center justify-center hover:bg-[#FACC15] transition-all shadow-[10px_10px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
                    >
                        <ArrowLeft size={32} strokeWidth={4} />
                    </button>
                    <button 
                        onClick={next}
                        className="absolute right-0 lg:-right-20 z-50 w-16 h-16 bg-[#FACC15] border-8 border-black flex items-center justify-center hover:bg-black hover:text-[#FACC15] transition-all shadow-[10px_10px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
                    >
                        <ArrowRight size={32} strokeWidth={4} />
                    </button>
                </div>

                {/* Main CTA Label */}
                <div className="mt-16 text-center">
                     <div className="bg-black text-[#FACC15] inline-block px-10 py-5 border-8 border-black font-black text-4xl md:text-6xl italic uppercase tracking-tighter shadow-[15px_15px_0px_0px_#FACC15]">
                        Your Journey Starts Here
                    </div>
                </div>
            </div>

            {/* Bottom Border Accent */}
            <div className="absolute bottom-0 left-0 w-full h-8 bg-black"></div>
        </section>
    );
};

export default Hero;
