'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

const Hero = ({ onBookClick }) => {
    return (
        <section className="relative min-h-[90vh] md:min-h-screen bg-white dark:bg-[#0a0a0a] pt-28 md:pt-32 pb-20 md:pb-32 overflow-hidden border-b-8 border-[#FACC15]">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]" 
                 style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            <div className="container mx-auto px-6 relative z-10 h-full">
                {/* Two-Column Desktop Layout */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-0 items-center min-h-[70vh]">

                    {/* Left: Text Content */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black text-black dark:text-white uppercase italic tracking-tighter leading-[0.85] mb-6">
                            AIRPORT <br /><span className="text-[#FACC15]">TAXIS</span>
                        </h1>
                        <div className="text-3xl md:text-4xl lg:text-5xl font-black text-black/20 dark:text-white/20 uppercase italic tracking-tighter mb-8">
                            SRI LANKA
                        </div>
                        <p className="text-sm md:text-base font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 max-w-md italic mb-10">
                            Premium Transfers & Curated Tours. Professional Chauffeurs Waiting For You 24/7.
                        </p>

                        {/* Stats Row */}
                        <div className="flex gap-8 md:gap-12">
                            <div>
                                <div className="text-3xl md:text-4xl font-black text-black dark:text-white italic tracking-tighter">24/7</div>
                                <div className="text-[9px] font-black text-black/30 dark:text-white/30 uppercase tracking-[0.3em]">Available</div>
                            </div>
                            <div className="w-px bg-black/10 dark:bg-white/10"></div>
                            <div>
                                <div className="text-3xl md:text-4xl font-black text-black dark:text-white italic tracking-tighter">5000+</div>
                                <div className="text-[9px] font-black text-black/30 dark:text-white/30 uppercase tracking-[0.3em]">Trips Done</div>
                            </div>
                            <div className="w-px bg-black/10 dark:bg-white/10"></div>
                            <div>
                                <div className="text-3xl md:text-4xl font-black text-[#FACC15] italic tracking-tighter">EST.</div>
                                <div className="text-[9px] font-black text-black/30 dark:text-white/30 uppercase tracking-[0.3em]">Since 2012</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Polaroid Gallery */}
                    <div className="relative h-[400px] md:h-[550px] lg:h-[600px]">
                        {/* Background Grid */}
                        <div className="absolute inset-0 flex items-center justify-center -z-10">
                             <div className="w-full h-full border-2 border-black/5 dark:border-white/5 grid grid-cols-8 grid-rows-6 opacity-30">
                                {[...Array(48)].map((_, i) => <div key={i} className="border-[0.5px] border-black/5 dark:border-white/5"></div>)}
                             </div>
                        </div>

                        {/* Polaroid 1 - Mirissa */}
                        <motion.div 
                            initial={{ opacity: 0, rotate: -15, x: -100 }}
                            animate={{ opacity: 1, rotate: -8, x: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="absolute left-0 lg:left-4 top-0 w-52 md:w-64 lg:w-72 bg-white p-3 md:p-5 shadow-[15px_15px_40px_rgba(0,0,0,0.08)] border-2 border-slate-100 rotate-[-8deg] z-10"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 mb-4 border-2 border-black/5">
                                <Image 
                                    src="/Hero/hero_mirissa.jpg" 
                                    alt="Mirissa Beach Sri Lanka" 
                                    fill 
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 768px) 208px, 288px"
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                 <div className="font-black italic uppercase tracking-tighter text-black text-sm">MIRISSA BEACH</div>
                                 <div className="w-8 h-8 rounded-full border-3 border-black/10 flex items-center justify-center italic font-black text-black text-xs">01</div>
                            </div>
                        </motion.div>

                        {/* Polaroid 2 - Yala */}
                        <motion.div 
                            initial={{ opacity: 0, rotate: 15, x: 100 }}
                            animate={{ opacity: 1, rotate: 6, x: 0 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="absolute right-0 lg:right-4 bottom-0 md:bottom-10 w-52 md:w-64 lg:w-72 bg-white p-3 md:p-5 shadow-[15px_15px_40px_rgba(0,0,0,0.08)] border-2 border-slate-100 rotate-[6deg] z-20"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 mb-4 border-2 border-black/5">
                                <Image 
                                    src="/Hero/safari_tour.png" 
                                    alt="Yala Safari Sri Lanka" 
                                    fill 
                                    className="object-cover"
                                    sizes="(max-width: 768px) 208px, 288px"
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                 <div className="font-black italic uppercase tracking-tighter text-black text-sm">SAFARI YALA</div>
                                 <div className="w-8 h-8 rounded-full border-3 border-black/10 flex items-center justify-center italic font-black text-black text-xs">02</div>
                            </div>
                        </motion.div>

                        {/* Polaroid 3 - Ella */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8, y: 100 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="absolute left-1/2 -translate-x-1/2 top-1/3 w-48 md:w-56 lg:w-64 bg-white p-3 md:p-4 shadow-[15px_15px_40px_rgba(0,0,0,0.08)] border-2 border-slate-100 rotate-[-3deg] z-[15]"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 mb-3 border-2 border-black/5">
                                <Image 
                                    src="/Hero/ella.jpg" 
                                    alt="Ella Nine Arch Bridge" 
                                    fill 
                                    className="object-cover"
                                    sizes="(max-width: 768px) 192px, 256px"
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                 <div className="font-black italic uppercase tracking-tighter text-black text-xs">ELLA NINE ARCH</div>
                                 <div className="text-[10px] font-black text-black opacity-20 italic">03</div>
                            </div>
                        </motion.div>

                        {/* Compass Ornament */}
                        <div className="absolute bottom-4 left-4 hidden lg:block z-30">
                             <div className="w-16 h-16 bg-[#FACC15] border-4 border-black flex items-center justify-center" aria-hidden="true">
                                <Compass size={32} className="text-black animate-spin-slow" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Side Ornaments */}
            <div className="absolute top-1/2 left-10 -translate-y-1/2 hidden xl:flex flex-col gap-2 opacity-50">
                 <div className="w-2 h-2 bg-black dark:bg-[#FACC15]"></div>
                 <div className="w-2 h-12 border-l-2 border-black dark:border-white/20"></div>
                 <div className="w-2 h-2 border-2 border-black dark:border-[#FACC15]"></div>
            </div>
        </section>
    );
};

export default Hero;
