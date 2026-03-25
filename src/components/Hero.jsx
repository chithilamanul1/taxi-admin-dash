'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Compass, ArrowRight } from 'lucide-react';

const Hero = ({ onBookClick }) => {
    const destinations = [
        { id: 1, name: 'Mirissa Beach', image: '/Hero/hero_mirissa.jpg' },
        { id: 2, name: 'Yala Safari', image: '/Hero/safari_tour.png' },
        { id: 3, name: 'Ella Nine Arch', image: '/Hero/ella.jpg' },
        { id: 4, name: 'Sigiriya Rock', image: '/Hero/hero_mirissa.jpg' }, // Reusing for variety if needed
        { id: 5, name: 'Galle Fort', image: '/Hero/safari_tour.png' },
    ];

    const [index, setIndex] = React.useState(0);

    return (
        <section className="relative min-h-[90vh] md:min-h-screen bg-white dark:bg-[#0a0a0a] pt-32 md:pt-40 pb-20 overflow-hidden border-b-8 border-black">
            {/* Clean Premium Background */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#FACC15]/20 to-transparent opacity-50"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left: Refined Text Content */}
                    <div className="flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-3 bg-black text-[#FACC15] px-6 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-fit mb-8"
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Official Service</span>
                        </motion.div>

                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-black dark:text-white uppercase italic tracking-tighter leading-none mb-8">
                            CURATED <span className="underline decoration-[#FACC15] decoration-8 underline-offset-8">EXPERIENCES</span> <br /> 
                            <span className="text-black/20 dark:text-white/20">ACROSS SRI LANKA</span>
                        </h2>

                        <p className="text-sm md:text-lg font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 max-w-lg italic mb-12 leading-relaxed">
                            Trusted professional chauffeurs at your service. Experience the island like never before with our premium fleet.
                        </p>

                        {/* Stats Row */}
                        <div className="flex flex-wrap gap-8 md:gap-16 border-t-4 border-black pt-12">
                            <div>
                                <div className="text-4xl md:text-5xl font-black text-black dark:text-white italic tracking-tighter mb-1">24/7</div>
                                <div className="text-[10px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.4em]">Available Always</div>
                            </div>
                            <div>
                                <div className="text-4xl md:text-5xl font-black text-black dark:text-white italic tracking-tighter mb-1">5000+</div>
                                <div className="text-[10px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.4em]">Happy Travelers</div>
                            </div>
                            <div>
                                <div className="text-4xl md:text-5xl font-black text-[#FACC15] italic tracking-tighter mb-1">#1</div>
                                <div className="text-[10px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.4em]">Top Rated Choice</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: The "Flower/Wheel" Carousel */}
                    <div className="relative h-[500px] md:h-[600px] flex items-center justify-center">
                        {/* Central Circle Background */}
                        <div className="absolute w-[300px] md:w-[450px] h-[300px] md:h-[450px] rounded-full border-8 border-black border-dashed opacity-10 animate-spin-slow"></div>

                        {destinations.map((dest, i) => {
                            const angle = (i - index) * (360 / destinations.length);
                            const isActive = i === index;

                            return (
                                <motion.div
                                    key={dest.id}
                                    initial={false}
                                    animate={{
                                        rotate: angle,
                                        scale: isActive ? 1.2 : 0.7,
                                        opacity: isActive ? 1 : 0.4,
                                        zIndex: isActive ? 30 : 10,
                                    }}
                                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                                    className="absolute origin-center"
                                    style={{
                                        transformOrigin: `50% 150%`, // Pivot point below the image
                                    }}
                                    onClick={() => setIndex(i)}
                                >
                                    <div 
                                        className={`relative w-48 md:w-64 aspect-square rounded-full overflow-hidden border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-all hover:border-[#FACC15] hover:shadow-[15px_15px_0px_0px_#000]`}
                                        style={{ rotate: -angle }} // Keep image upright
                                    >
                                        <Image 
                                            src={dest.image} 
                                            alt={dest.name} 
                                            fill 
                                            className="object-cover"
                                            priority={isActive}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center w-full px-4">
                                            <p className="text-white font-black uppercase italic text-[10px] md:text-xs tracking-widest whitespace-nowrap">{dest.name}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Connection Line to Center */}
                                    <div className="absolute top-[100%] left-1/2 -translate-x-1/2 w-4 bg-black h-24 hidden md:block"></div>
                                </motion.div>
                            );
                        })}

                        {/* Navigation Controls */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-4 z-40">
                            <button 
                                onClick={() => setIndex((prev) => (prev - 1 + destinations.length) % destinations.length)}
                                className="w-12 h-12 bg-white border-4 border-black flex items-center justify-center hover:bg-[#FACC15] transition-all shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:shadow-none"
                            >
                                <ArrowRight className="rotate-180" size={24} />
                            </button>
                            <button 
                                onClick={() => setIndex((prev) => (prev + 1) % destinations.length)}
                                className="w-12 h-12 bg-[#FACC15] border-4 border-black flex items-center justify-center hover:bg-black hover:text-[#FACC15] transition-all shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:shadow-none"
                            >
                                <ArrowRight size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Side Ornaments */}
            <div className="absolute top-1/2 left-6 -translate-y-1/2 hidden xl:flex flex-col gap-4">
                 <div className="w-1 h-32 bg-black opacity-20"></div>
                 <div className="w-12 h-12 rounded-none border-4 border-black flex items-center justify-center bg-[#FACC15] shadow-[6px_6px_0px_0px_#000]">
                    <Compass className="animate-spin-slow" size={24} />
                 </div>
            </div>
        </section>
    );
};

export default Hero;
