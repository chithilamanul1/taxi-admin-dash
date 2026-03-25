'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PlaneTakeoff, PlaneLanding, Car, Compass, ArrowRight } from 'lucide-react';

const Hero = ({ onBookClick }) => {
    return (
        <section className="relative min-h-screen bg-white dark:bg-[#0a0a0a] pt-32 pb-20 overflow-hidden border-b-8 border-[#FACC15]">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]" 
                 style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            <div className="container mx-auto px-6 relative z-10 h-full flex flex-col items-center justify-center">
                {/* Header Section from Sketch */}
                <div className="w-full flex justify-between items-start mb-12">
                    <div className="max-w-xl">
                        <h1 className="text-6xl md:text-8xl font-black text-black dark:text-white uppercase italic tracking-tighter leading-[0.85] mb-6">
                            AIRPORT <span className="text-[#FACC15]">TAXIS</span>
                            <br /><span className="text-4xl md:text-5xl opacity-30">SRI LANKA</span>
                        </h1>
                        <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 max-w-md italic">
                            Premium Transfers & Curated Tours. Professional Chauffeurs Waiting For You 24/7.
                        </p>
                    </div>

                    {/* Right side buttons from sketch */}
                    <div className="hidden md:flex flex-col gap-4">
                        <div className="w-20 h-20 bg-[#FACC15] border-4 border-black flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <Compass size={40} className="text-black animate-spin-slow" />
                        </div>
                    </div>
                </div>

                {/* Polaroid Grid Layout */}
                <div className="relative w-full max-w-6xl h-[400px] md:h-[600px] flex items-center justify-center mb-20 px-4">
                    {/* Background Grid Lines from Sketch Image 2 */}
                    <div className="absolute inset-0 flex items-center justify-center -z-10">
                         <div className="w-[800px] h-[500px] border-2 border-black/5 dark:border-white/5 grid grid-cols-10 grid-rows-6 opacity-50">
                            {[...Array(60)].map((_, i) => <div key={i} className="border-[0.5px] border-black/5 dark:border-white/5"></div>)}
                         </div>
                    </div>

                    {/* Polaroid 1 - Mirissa */}
                    <motion.div 
                        initial={{ opacity: 0, rotate: -15, x: -100 }}
                        animate={{ opacity: 1, rotate: -8, x: -20 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="absolute left-0 md:left-20 top-0 w-64 md:w-80 bg-white p-4 md:p-6 shadow-[20px_20px_60px_rgba(0,0,0,0.1)] border-2 border-slate-100 rotate-[-8deg] z-10"
                    >
                        <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 mb-6 border-2 border-black/5">
                            <Image 
                                src="/Hero/hero_mirissa.jpg" 
                                alt="Mirissa Beach Sri Lanka" 
                                fill 
                                className="object-cover"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                             <div className="font-black italic uppercase tracking-tighter text-black">MIRISSA BEACH</div>
                             <div className="w-10 h-10 rounded-full border-4 border-black/10 flex items-center justify-center italic font-black text-black">01</div>
                        </div>
                    </motion.div>

                    {/* Polaroid 2 - Yala */}
                    <motion.div 
                        initial={{ opacity: 0, rotate: 15, x: 100 }}
                        animate={{ opacity: 1, rotate: 6, x: 20 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="absolute right-0 md:right-20 bottom-10 w-64 md:w-80 bg-white p-4 md:p-6 shadow-[20px_20px_60px_rgba(0,0,0,0.1)] border-2 border-slate-100 rotate-[6deg] z-20"
                    >
                        <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 mb-6 border-2 border-black/5">
                            <Image 
                                src="/Hero/safari_tour.png" 
                                alt="Yala Safari Sri Lanka" 
                                fill 
                                className="object-cover"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                             <div className="font-black italic uppercase tracking-tighter text-black">SAFARI YALA</div>
                             <div className="w-10 h-10 rounded-full border-4 border-black/10 flex items-center justify-center italic font-black text-black">02</div>
                        </div>
                    </motion.div>

                    {/* Polaroid 3 - Ella (NEW) */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8, y: 100 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="absolute left-1/2 -translate-x-1/2 top-40 w-56 md:w-72 bg-white p-4 shadow-[20px_20px_60px_rgba(0,0,0,0.1)] border-2 border-slate-100 rotate-[-4deg] z-[15]"
                    >
                        <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 mb-4 border-2 border-black/5">
                            <Image 
                                src="/Hero/ella.jpg" 
                                alt="Ella Nine Arch Bridge" 
                                fill 
                                className="object-cover"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                             <div className="font-black italic uppercase tracking-tighter text-black text-xs">ELLA NINE ARCH</div>
                             <div className="text-[10px] font-black text-black opacity-20 italic">03</div>
                        </div>
                    </motion.div>

                    {/* Central Icon Ornament */}
                    <div className="absolute top-1/2 left-3/4 -translate-y-1/2 z-30 hidden lg:block translate-x-12">
                         <div className="p-4 bg-white border-2 border-black rounded-lg shadow-xl shadow-black/10 flex items-center gap-4">
                            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-[#FACC15]">
                                <Compass size={24} />
                            </div>
                            <div className="pr-4">
                                <div className="text-[10px] font-black text-black/40 uppercase tracking-widest">WIND SPEED</div>
                                <div className="text-xl font-black italic tracking-tighter">18 KNOTS</div>
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
