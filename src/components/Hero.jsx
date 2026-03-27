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
            }, 500);
        } else if (currentIndex === extendedDestinations.length - 1) {
            setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(1);
            }, 500);
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
        <section className="relative h-[350px] md:h-[450px] bg-white dark:bg-[#0a0a0a] overflow-hidden pt-4 pb-12 flex items-center justify-center border-b-8 border-black">
            
            {/* Minimal Background Elements */}
            <div className="absolute top-10 left-10 w-32 h-32 border-[2px] border-black/5 -rotate-12 -z-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.03)_10px,rgba(0,0,0,0.03)_20px)]"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 border-[2px] border-black/5 rotate-12 -z-10 rounded-full"></div>

            <div className="container mx-auto px-6 relative z-10" 
                 onMouseEnter={() => setIsPaused(true)}
                 onMouseLeave={() => setIsPaused(false)}>
                
                <div className="relative flex flex-col items-center justify-center">
                    
                    <div className="relative w-full max-w-[450px] flex items-center justify-center">
                        {/* Carousel Container */}
                        <div className="w-full overflow-hidden py-4 px-4 touch-none">
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
                                    duration: isTransitioning ? 0 : 0.5
                                }}
                            >
                                {extendedDestinations.map((dest, i) => {
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
                                                className="relative bg-white border-[16px] border-black p-4 pb-16 w-full group select-none"
                                            >
                                                {/* Card Number & Price Ticker */}
                                                <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-1">
                                                    <div className="w-10 h-10 bg-[#FACC15] border-6 border-black rounded-none flex items-center justify-center font-black text-sm">
                                                        0{dest.id}
                                                    </div>
                                                    <div className="bg-black text-white px-3 py-0.5 font-black text-[10px] border-4 border-black -rotate-2">
                                                        LKR {price.toLocaleString()}
                                                    </div>
                                                </div>

                                                {/* Image Container - Slimmer aspect ratio */}
                                                <div className="relative aspect-[3/2] overflow-hidden border-10 border-black bg-slate-200 pointer-events-none">
                                                    <Image
                                                        src={dest.image}
                                                        alt={dest.name}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                                        priority={i === 1}
                                                    />
                                                    
                                                    <div className="absolute bottom-2 left-2 z-10 bg-[#FACC15] border-2 border-black px-2 py-0.5 font-black text-[9px] uppercase tracking-tighter">
                                                        HOT DEAL
                                                    </div>
                                                </div>

                                                {/* Info Section - Smaller fonts */}
                                                <div className="mt-6 flex items-center justify-between">
                                                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black leading-none">
                                                        {dest.name.split(' ')[0]}<br/>
                                                        <span className="text-[#FACC15] stroke-black stroke-1">{dest.name.split(' ')[1] || ''}</span>
                                                    </h3>
                                                    <div className="text-right">
                                                        <div className="text-[10px] font-bold uppercase opacity-50">Economy</div>
                                                        <div className="text-lg font-black leading-none">Rs {price.toLocaleString()}</div>
                                                    </div>
                                                </div>

                                                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/5"></div>
                                            </motion.div>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        </div>

                        {/* Navigation Buttons - Smaller and more compact */}
                        <button 
                            onClick={handlePrev}
                            className="absolute left-[-20px] lg:-left-24 z-50 w-12 h-12 bg-white border-4 border-black flex items-center justify-center hover:bg-[#FACC15] transition-all active:translate-x-1 active:translate-y-1 hidden md:flex"
                        >
                            <ArrowLeft size={24} strokeWidth={5} />
                        </button>
                        <button 
                            onClick={handleNext}
                            className="absolute right-[-20px] lg:-right-24 z-50 w-12 h-12 bg-[#FACC15] border-4 border-black flex items-center justify-center hover:bg-black hover:text-[#FACC15] transition-all active:translate-x-1 active:translate-y-1 hidden md:flex"
                        >
                            <ArrowRight size={24} strokeWidth={5} />
                        </button>
                    </div>

                {/* Pagination Indicator Bars - Slimmer - More Space */}
                <div className="flex gap-2 my-10">
                    {destinations.map((_, i) => {
                        const displayIndex = currentIndex === 0 ? destinations.length - 1 : (currentIndex === extendedDestinations.length - 1 ? 0 : currentIndex - 1);
                        return (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i + 1)}
                                className={`h-2 border-2 border-black transition-all ${i === displayIndex ? 'w-10 bg-[#FACC15]' : 'w-4 bg-white hover:w-6'}`}
                                aria-label={`View Slide ${i + 1}`}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    </section>
);
};

export default Hero;
