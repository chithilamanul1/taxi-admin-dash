'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { calculateBasePrice } from '@/lib/pricing-util';
import { FLEET } from '@/lib/mock-taxi-db';

const Hero = () => {
    // Wagon R is the baseline for Hero prices (id: v3)
    const baselineVehicle = useMemo(() => FLEET.find(v => v.id === 'v3') || FLEET[0], []);

    const destinations = useMemo(() => [
        { id: 1, name: 'MIRISSA BEACH', image: '/Hero/mirissa_illust.jpg', distance: 150, rotate: -3 },
        { id: 2, name: 'YALA SAFARI', image: '/Hero/safari_tour.png', distance: 245, rotate: 2 },
        { id: 3, name: 'ELLA NINE ARCH', image: '/Hero/ella.jpg', distance: 210, rotate: -2 },
        { id: 4, name: 'SIGIRIYA ROCK', image: '/Hero/sigiriya_illust.jpg', distance: 150, rotate: 3 },
        { id: 5, name: 'ARUGAM BAY', image: '/Hero/arugam_surf.jpg', distance: 320, rotate: -1 },
        { id: 6, name: 'ANURADHAPURA', image: '/Hero/izanuradapura.jpg', distance: 170, rotate: 2 },
    ], []);

    // For infinite loop, we clone the first and last slides
    const extendedDestinations = useMemo(() => [
        destinations[destinations.length - 1],
        ...destinations,
        destinations[0]
    ], [destinations]);

    const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 (real first slide)
    const [isPaused, setIsPaused] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleNext = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(prev => prev + 1);
    }, [isTransitioning]);

    const handlePrev = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(prev => prev - 1);
    }, [isTransitioning]);

    // Loop logic: When we reach a clone, jump back to the real slide instantly
    useEffect(() => {
        if (currentIndex === 0) {
            setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(destinations.length);
            }, 500); // Match transition duration
        } else if (currentIndex === extendedDestinations.length - 1) {
            setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(1);
            }, 500); // Match transition duration
        } else {
            setIsTransitioning(false);
        }
    }, [currentIndex, destinations.length, extendedDestinations.length]);

    // Auto-slide effect
    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(handleNext, 4000);
        return () => clearInterval(timer);
    }, [isPaused, handleNext]);

    const handleDragEnd = (event, info) => {
        if (info.offset.x < -50) handleNext();
        else if (info.offset.x > 50) handlePrev();
    };

    return (
        <section className="relative min-h-[95vh] bg-white dark:bg-[#0a0a0a] overflow-hidden pt-32 pb-20 flex items-center justify-center">
            
            {/* Background Branding Elements */}
            <div className="absolute top-40 left-10 w-64 h-64 border-[4px] border-black/5 -rotate-12 -z-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.03)_10px,rgba(0,0,0,0.03)_20px)]"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 border-[4px] border-black/5 rotate-12 -z-10 rounded-full"></div>

            <div className="container mx-auto px-6 relative z-10" 
                 onMouseEnter={() => setIsPaused(true)}
                 onMouseLeave={() => setIsPaused(false)}>
                
                <div className="relative flex flex-col items-center justify-center">
                    
                    <div className="relative w-full max-w-[550px] flex items-center justify-center">
                        {/* Carousel Container */}
                        <div className="w-full overflow-hidden py-12 px-6 touch-none">
                            <motion.div 
                                className="flex cursor-grab active:cursor-grabbing"
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                onDragEnd={handleDragEnd}
                                animate={{ x: `-${currentIndex * 100}%` }}
                                transition={{ 
                                    type: isTransitioning ? "spring" : "tween", 
                                    stiffness: 200, 
                                    damping: 25,
                                    duration: isTransitioning ? 0 : 0.5 // Instant jump if not transitioning
                                }}
                            >
                                {extendedDestinations.map((dest, i) => {
                                    // Calculate dynamic price based on current Wagon R rate
                                    const price = calculateBasePrice(dest.distance, {
                                        ...baselineVehicle,
                                        basePrice: baselineVehicle.ratePerKm * 10,
                                        perKmRate: baselineVehicle.ratePerKm,
                                        baseKm: 10
                                    });

                                    return (
                                        <div key={`${dest.id}-${i}`} className="min-w-full flex justify-center px-4">
                                            <motion.div
                                                initial={false}
                                                animate={{ 
                                                    rotate: dest.rotate
                                                }}
                                                className="relative bg-white border-[12px] border-black p-6 pb-24 w-full shadow-[25px_25px_0px_0px_rgba(0,0,0,1)] group select-none"
                                            >
                                                {/* Card Number & Price Ticker */}
                                                <div className="absolute top-6 right-6 z-20 flex flex-col items-end gap-2">
                                                    <div className="w-16 h-16 bg-[#FACC15] border-4 border-black rounded-full flex items-center justify-center font-black italic text-xl shadow-[6px_6px_0px_0px_#000]">
                                                        0{dest.id}
                                                    </div>
                                                    <div className="bg-black text-white px-4 py-1 font-black italic text-sm border-2 border-black -rotate-2">
                                                        LKR {price.toLocaleString()}
                                                    </div>
                                                </div>

                                                {/* Image Container */}
                                                <div className="relative aspect-square overflow-hidden border-4 border-black bg-slate-200 pointer-events-none">
                                                    <Image
                                                        src={dest.image}
                                                        alt={dest.name}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                                        priority={i === 1}
                                                    />
                                                    
                                                    {/* "Starting From" Overlay */}
                                                    <div className="absolute bottom-4 left-4 z-10 bg-[#FACC15] border-2 border-black px-3 py-1 font-black text-xs uppercase italic tracking-tighter shadow-[4px_4px_0px_0px_#000]">
                                                        Budget Friendly
                                                    </div>
                                                </div>

                                                {/* Info Section */}
                                                <div className="mt-12 flex items-center justify-between">
                                                    <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-black leading-none">
                                                        {dest.name.split(' ')[0]}<br/>
                                                        <span className="text-[#FACC15] stroke-black stroke-2">{dest.name.split(' ')[1] || ''}</span>
                                                    </h3>
                                                    <div className="text-right">
                                                        <div className="text-xs font-bold uppercase opacity-50">Economy</div>
                                                        <div className="text-xl font-black italic leading-none">LKR {price.toLocaleString()}</div>
                                                    </div>
                                                </div>

                                                {/* Polaroid Texture Stripe */}
                                                <div className="absolute bottom-0 left-0 w-full h-2 bg-black/5"></div>
                                            </motion.div>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        </div>

                        {/* Navigation Buttons */}
                        <button 
                            onClick={handlePrev}
                            className="absolute left-[-30px] lg:-left-32 z-50 w-16 h-16 bg-white border-8 border-black flex items-center justify-center hover:bg-[#FACC15] transition-all shadow-[10px_10px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none hidden md:flex"
                        >
                            <ArrowLeft size={36} strokeWidth={5} />
                        </button>
                        <button 
                            onClick={handleNext}
                            className="absolute right-[-30px] lg:-right-32 z-50 w-16 h-16 bg-[#FACC15] border-8 border-black flex items-center justify-center hover:bg-black hover:text-[#FACC15] transition-all shadow-[10px_10px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none hidden md:flex"
                        >
                            <ArrowRight size={36} strokeWidth={5} />
                        </button>
                    </div>

                    {/* Pagination Indicator Bars */}
                    <div className="flex gap-4 my-12">
                        {destinations.map((_, i) => {
                            // Current display index logic for indicators
                            const displayIndex = currentIndex === 0 ? destinations.length - 1 : (currentIndex === extendedDestinations.length - 1 ? 0 : currentIndex - 1);
                            return (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i + 1)}
                                    className={`h-4 border-4 border-black transition-all ${i === displayIndex ? 'w-16 bg-[#FACC15]' : 'w-8 bg-white hover:w-12 hover:bg-slate-100'}`}
                                    aria-label={`View Slide ${i + 1}`}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Main CTA Label */}
                <div className="mt-4 text-center">
                     <div className="bg-black text-[#FACC15] inline-block px-12 py-6 border-8 border-black font-black text-4xl md:text-7xl italic uppercase tracking-tighter shadow-[20px_20px_0px_0px_#FACC15] -rotate-1">
                        Travel Smarter.
                    </div>
                </div>
            </div>

            {/* Bottom Border Accent */}
            <div className="absolute bottom-0 left-0 w-full h-10 bg-black"></div>
        </section>
    );
};

export default Hero;
