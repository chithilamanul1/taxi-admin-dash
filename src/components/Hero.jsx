'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Hero = () => {
    const destinations = [
        { id: 1, name: 'MIRISSA BEACH', image: '/Hero/hero_mirissa.jpg' },
        { id: 2, name: 'YALA SAFARI', image: '/Hero/safari_tour.png' },
        { id: 3, name: 'ELLA NINE ARCH', image: '/Hero/ella.jpg' },
        { id: 4, name: 'SIGIRIYA ROCK', image: '/Hero/sigiriya.jpg' },
        { id: 5, name: 'GALLE FORT', image: '/tours/galle3.jpg' },
        { id: 6, name: 'KANDY TEMPLE', image: '/tours/kandy.jpg' },
    ];

    const [index, setIndex] = React.useState(0);

    const next = () => setIndex((prev) => (prev + 1) % destinations.length);
    const prev = () => setIndex((prev) => (prev - 1 + destinations.length) % destinations.length);

    React.useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-[70vh] md:h-[85vh] bg-white dark:bg-[#0a0a0a] overflow-hidden border-b-[12px] border-black pt-24 md:pt-32">
            
            {/* Minimalist Image Slider */}
            <div className="relative w-full h-full flex items-center justify-center px-6 md:px-20 py-10">
                
                <div className="relative w-full max-w-7xl h-full flex items-center">
                    
                    <div className="relative w-full h-full overflow-hidden border-8 border-black shadow-[30px_30px_0px_0px_rgba(0,0,0,1)] bg-black">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative w-full h-full"
                        >
                            <Image
                                src={destinations[index].image}
                                alt={destinations[index].name}
                                fill
                                className="object-cover opacity-80"
                                priority
                            />
                            
                            {/* Simple Label */}
                            <div className="absolute top-10 left-10 z-20">
                                <div className="bg-[#FACC15] text-black px-8 py-4 border-4 border-black font-black text-2xl md:text-4xl italic uppercase tracking-tighter shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                    {destinations[index].name}
                                </div>
                            </div>
                        </motion.div>

                        {/* Navigation Overlay (Minimal) */}
                        <div className="absolute bottom-10 right-10 flex gap-4 z-30">
                            <button 
                                onClick={prev}
                                className="w-16 h-16 bg-white border-4 border-black flex items-center justify-center hover:bg-[#FACC15] transition-all shadow-[8px_8px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
                            >
                                <ArrowLeft size={32} strokeWidth={3} />
                            </button>
                            <button 
                                onClick={next}
                                className="w-16 h-16 bg-[#FACC15] border-4 border-black flex items-center justify-center hover:bg-black hover:text-[#FACC15] transition-all shadow-[8px_8px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
                            >
                                <ArrowRight size={32} strokeWidth={3} />
                            </button>
                        </div>
                    </div>

                    {/* Background Accents (Brutalist) */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 border-8 border-black -z-10 bg-[#FACC15] hidden lg:block"></div>
                    <div className="absolute -bottom-10 -left-10 w-64 h-64 border-8 border-black -z-10 opacity-5 hidden lg:block bg-[repeating-linear-gradient(45deg,#000,#000_10px,transparent_10px,transparent_20px)]"></div>
                    
                </div>
            </div>

            {/* Pagination Progress */}
            <div className="absolute bottom-0 left-0 w-full h-3 bg-black/10">
                <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: `${((index + 1) / destinations.length) * 100}%` }}
                    className="h-full bg-[#FACC15]"
                />
            </div>
        </section>
    );
};

export default Hero;
