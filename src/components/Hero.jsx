'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { calculateBasePrice } from '@/lib/pricing-util';
import { FLEET } from '@/lib/mock-taxi-db';
import { useCurrency } from '@/context/CurrencyContext';

const Hero = () => {
    const { convertPrice } = useCurrency();
    // Wagon R is the baseline for Hero prices (id: v3)
    const baselineVehicle = useMemo(() => FLEET.find(v => v.id === 'v3') || FLEET[0], []);

    const destinations = useMemo(() => [
        { id: 1, name: 'MIRISSA BEACH', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc63?q=80&w=1600&auto=format&fit=crop', distance: 150, rotate: -3 },
        { id: 2, name: 'YALA SAFARI', image: 'https://images.unsplash.com/photo-1554593455-83f089304323?q=80&w=1600&auto=format&fit=crop', distance: 245, rotate: 2 },
        { id: 3, name: 'ELLA NINE ARCH', image: 'https://images.unsplash.com/photo-1590603740183-980e7f6920eb?q=80&w=1600&auto=format&fit=crop', distance: 210, rotate: -2 },
        { id: 4, name: 'SIGIRIYA ROCK', image: 'https://images.unsplash.com/photo-1588258219511-64eb629cb833?q=80&w=1600&auto=format&fit=crop', distance: 150, rotate: 3 },
        { id: 5, name: 'ARUGAM BAY', image: 'https://images.unsplash.com/photo-1549488398-aa66870ac45b?q=80&w=1600&auto=format&fit=crop', distance: 320, rotate: -1 },
        { id: 6, name: 'ANURADHAPURA', image: 'https://images.unsplash.com/photo-1582239454124-7186104bc7a0?q=80&w=1600&auto=format&fit=crop', distance: 170, rotate: 2 },
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
        <section className="relative h-[400px] md:h-[550px] bg-slate-50 dark:bg-[#0a0a0a] overflow-hidden pt-16 md:pt-24 pb-12 flex items-center justify-center">
            
            {/* Minimal Background Elements */}
            <div className="absolute top-10 left-10 w-32 h-32 border border-slate-200 dark:border-white/5 rounded-[2rem] -rotate-12 -z-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.02)_10px,rgba(0,0,0,0.02)_20px)]"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 border border-slate-200 dark:border-white/5 rotate-12 -z-10 rounded-[3rem]"></div>

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
                                                onClick={() => {
                                                    window.location.href = `/?destination=${dest.name}#booking`;
                                                }}
                                                 className="relative bg-white p-4 pb-16 w-full group select-none rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 cursor-pointer"
                                            >
                                                {/* Card Number & Price Ticker */}
                                                <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-1">
                                                    <div className="w-10 h-10 bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 rounded-xl flex items-center justify-center font-black text-sm">
                                                        0{dest.id}
                                                    </div>
                                                    <div className="bg-emerald-950 text-white px-3 py-0.5 font-black text-[10px] rounded-lg shadow-md -rotate-2">
                                                        {convertPrice(price).symbol} {convertPrice(price).value.toLocaleString()}
                                                    </div>
                                                </div>

                                                {/* Image Container - Slimmer aspect ratio */}
                                                 <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-slate-100 pointer-events-none shadow-inner">
                                                    <Image
                                                        src={dest.image}
                                                        alt={dest.name}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                                        priority={i === currentIndex}
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                                                    />
                                                    
                                                    <div className="absolute bottom-3 left-3 z-10 bg-white text-emerald-600 shadow-md rounded-lg px-2.5 py-1 font-black text-[9px] uppercase tracking-tighter">
                                                        HOT DEAL
                                                    </div>
                                                </div>

                                                {/* Info Section - Smaller fonts */}
                                                <div className="mt-6 flex items-center justify-between">
                                                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black leading-none">
                                                        {dest.name.split(' ')[0]}<br/>
                                                        <span className="text-emerald-400">{dest.name.split(' ')[1] || ''}</span>
                                                    </h3>
                                                     <div className="text-right">
                                                        <div className="text-[10px] font-black uppercase text-black/40">Economy</div>
                                                        <div className="text-lg font-black leading-none text-black">{convertPrice(price).symbol} {convertPrice(price).value.toLocaleString()}</div>
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
                            aria-label="Previous destination"
                            className="absolute left-[-20px] lg:-left-24 z-50 w-14 h-14 bg-white rounded-2xl shadow-xl shadow-slate-200/50 flex items-center justify-center hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-all active:scale-95 hidden md:flex border border-slate-100 dark:border-white/10 dark:bg-zinc-900"
                        >
                            <ArrowLeft size={24} strokeWidth={3} aria-hidden="true" />
                        </button>
                        <button 
                            onClick={handleNext}
                            aria-label="Next destination"
                            className="absolute right-[-20px] lg:-right-24 z-50 w-14 h-14 bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-600/20 flex items-center justify-center text-white hover:bg-emerald-700 transition-all active:scale-95 hidden md:flex border border-emerald-500"
                        >
                            <ArrowRight size={24} strokeWidth={3} aria-hidden="true" />
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
                                className={`h-2 rounded-full transition-all ${i === displayIndex ? 'w-10 bg-emerald-600 shadow-md shadow-emerald-600/20' : 'w-4 bg-slate-300 dark:bg-slate-700 hover:w-6'}`}
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
