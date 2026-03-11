'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

const heroImages = [
    { src: '/Hero/safari_tour.png', alt: 'Sri Lanka Elephant Safari' },
    { src: '/Hero/arugam_beach.png', alt: 'Arugam Bay Beach Transfers' },
    { src: '/Hero/airport_city.jpg', alt: 'Premium Airport Transfers' },
    { src: '/Hero/island_relax.png', alt: 'Sri Lanka Island Discovery' },
]

const Hero = ({ onBookClick }) => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isLoaded, setIsLoaded] = useState(false);

    // Auto-advance slideshow
    useEffect(() => {
        setIsLoaded(true);
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length)
        }, 6000)
        return () => clearInterval(timer)
    }, [])

    const goToSlide = (index) => setCurrentSlide(index)
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length)

    return (
        <section className="relative h-auto min-h-[100vh] flex flex-col items-center justify-center pt-32 md:pt-48 pb-20 md:pb-32 overflow-hidden bg-white dark:bg-black transition-colors border-b-[20px] border-[#FACC15]">
            {/* Background Slideshow */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent dark:from-black dark:via-black/40 dark:to-black/10 pointer-events-none z-10"></div>

                {/* 
                  PERFORMANCE OPTIMIZATION: 
                  - We only render the first image eagerly.
                */}
                {heroImages.map((image, index) => {
                    const isVisible = index === currentSlide;
                    const shouldRender = index === 0 || isVisible;

                    if (!shouldRender) return null;

                    return (
                        <div
                            key={index}
                            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                priority={index === 0}
                                fetchPriority={index === 0 ? "high" : "auto"}
                                loading={index === 0 ? "eager" : "lazy"}
                                sizes="100vw"
                                className="object-cover"
                                quality={index === 0 ? 75 : 60}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Slideshow Navigation */}
            <div className="absolute bottom-40 right-10 z-20 flex items-center gap-4 hidden md:flex">
                <button
                    onClick={prevSlide}
                    className="w-14 h-14 bg-white/80 dark:bg-black/80 backdrop-blur-md text-black dark:text-[#FACC15] hover:bg-[#FACC15] hover:text-black transition-all border border-black/10 dark:border-[#FACC15]/20 flex items-center justify-center"
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={28} />
                </button>
                <button
                    onClick={nextSlide}
                    className="w-14 h-14 bg-white/80 dark:bg-black/80 backdrop-blur-md text-black dark:text-[#FACC15] hover:bg-[#FACC15] hover:text-black transition-all border border-black/10 dark:border-[#FACC15]/20 flex items-center justify-center"
                    aria-label="Next slide"
                >
                    <ChevronRight size={28} />
                </button>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 relative z-10 text-center">
                <div className="yellow-badge mb-6 md:mb-8 animate-slide-up opacity-0 [animation-delay:0.2s] [animation-fill-mode:forwards] mx-auto shadow-2xl scale-90 md:scale-100">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-30"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
                    </span>
                    Luxury Transport • Colombo • Port
                </div>

                <div className="relative inline-block mb-12 animate-slide-up opacity-0 [animation-delay:0.4s] [animation-fill-mode:forwards]">
                    <h1 className="text-4xl md:text-8xl lg:text-9xl font-black leading-[1] md:leading-[0.9] text-black dark:text-white tracking-tighter max-w-5xl mx-auto uppercase italic relative z-10 transition-all">
                        THE SMART <br />WAY TO <span className="text-[#FACC15]">EXPLORE</span>
                    </h1>
                    {/* Decorative Shadow Box for Heading (Premium Look) */}
                    <div className="absolute -inset-4 bg-[#FACC15]/20 dark:bg-white/5 -rotate-1 -z-10 border-2 border-black/10"></div>
                </div>

                {/* Sri Lanka Info Text */}
                <div className="max-w-3xl mb-12 animate-slide-up opacity-0 [animation-delay:0.5s] [animation-fill-mode:forwards] mx-auto">
                    <div className="inline-block px-6 py-4 md:px-10 md:py-6 bg-black dark:bg-[#FACC15] text-[#FACC15] dark:text-black mb-10 shadow-2xl skew-x-[-10deg]">
                        <p className="text-base md:text-2xl leading-relaxed font-black uppercase tracking-widest italic skew-x-[10deg]">
                            Premium airport transfers and curated luxury tours in Sri Lanka.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                        <button
                            onClick={onBookClick}
                            className="w-full md:w-auto px-10 md:px-16 py-5 md:py-6 bg-[#FACC15] text-black font-black uppercase tracking-[0.2em] italic text-xs md:text-sm hover:translate-y-[-4px] active:translate-y-0 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-4 group border-4 border-black"
                        >
                            BOOK NOW <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                        <Link
                            href="/tour-packages"
                            className="w-full md:w-auto px-10 md:px-16 py-5 md:py-6 bg-white dark:bg-black border-4 border-black dark:border-white text-black dark:text-white font-black uppercase tracking-[0.2em] italic text-xs md:text-sm hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                        >
                            BROWSE TOURS
                        </Link>
                    </div>
                </div>
            </div>

            {/* Vertical Text Ornament */}
            <div className="absolute top-1/2 -translate-y-1/2 left-8 hidden 2xl:block opacity-30 select-none">
                <div className="text-[10px] font-bold tracking-[0.5em] uppercase [writing-mode:vertical-rl] text-black dark:text-white h-64 border-r border-black/30 dark:border-white/30 pr-4">
                    EST. 2024 • COLOMBO • SRI LANKA
                </div>
            </div>
        </section>
    )
}

export default Hero
