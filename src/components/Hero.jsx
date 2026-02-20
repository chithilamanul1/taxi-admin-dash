'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

const heroImages = [
    { src: '/Hero/elephants.jpg', alt: 'Sri Lanka Elephants' },
    { src: 'https://images.unsplash.com/photo-1586861635167-e52a3a1e262c?auto=format&fit=crop&q=80&w=1920', alt: 'Ahangama Coastline' },
    { src: '/Hero/izanuradapura.jpg', alt: 'Anuradhapura' },
    { src: '/Hero/monkey.jpg', alt: 'Wildlife' },
    { src: '/Hero/sigiriya.jpg', alt: 'Sigiriya Lion Rock' },
    { src: '/Hero/tower.jpg', alt: 'Lotus Tower Colombo' },
    { src: '/Hero/view.jpg', alt: 'Scenic Views' },
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
        <section className="relative h-[85vh] md:h-[90vh] min-h-[600px] flex items-center justify-center pt-28 md:pt-32 pb-20 md:pb-40 overflow-hidden bg-emerald-950 transition-colors">
            {/* Background Slideshow */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/70 to-black/30 pointer-events-none z-10"></div>

                {/* 
                  PERFORMANCE OPTIMIZATION: 
                  - We only render the first image eagerly.
                  - Subsequent images only render when they become the current slide.
                  - This prevents the browser from downloading 7 high-res images on initial pageload.
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
            <div className="absolute bottom-32 right-10 z-20 flex items-center gap-4 hidden md:flex">
                <button
                    onClick={prevSlide}
                    className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/10"
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={nextSlide}
                    className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/10"
                    aria-label="Next slide"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 relative z-10 text-left lg:text-left md:mt-[-5vh]">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/80 backdrop-blur-md border border-emerald-400/30 text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-4 animate-slide-up opacity-0 [animation-delay:0.2s] [animation-fill-mode:forwards] shadow-lg">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Sri Lanka's #1 Luxury Provider
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.1] text-white animate-slide-up opacity-0 [animation-delay:0.4s] [animation-fill-mode:forwards] tracking-tight max-w-4xl">
                    The Smart Way <br />to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">Explore</span> Sri Lanka
                </h1>

                {/* Sri Lanka Info Text */}
                <div className="max-w-2xl mb-8 animate-slide-up opacity-0 [animation-delay:0.5s] [animation-fill-mode:forwards]">
                    <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6 font-medium text-shadow-sm">
                        Reliable airport transfers and curated luxury tours.
                        Professional service tailored to your journey.
                    </p>
                    <div className="flex flex-col gap-2 p-5 bg-emerald-950/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg max-w-xl">
                        <p className="text-sm text-white/80 leading-relaxed">
                            🇱🇰 <strong className="text-emerald-300">Premium Fleet & Service:</strong>
                        </p>
                        <ul className="text-xs md:text-sm text-white/70 space-y-1 ml-1">
                            <li className="flex items-center gap-2">✓ Modern Air-Conditioned Vehicles</li>
                            <li className="flex items-center gap-2">✓ English-Speaking Chauffeurs</li>
                            <li className="flex items-center gap-2">✓ Fixed Prices (No Hidden Charges)</li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-start gap-4 animate-slide-up opacity-0 [animation-delay:0.8s] [animation-fill-mode:forwards] pb-8 md:pb-0">
                    <button
                        onClick={onBookClick}
                        className="group w-full sm:w-auto px-8 py-4 bg-emerald-700 text-white rounded-xl font-bold text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2 min-w-[200px]"
                    >
                        Plan Your Trip
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <Link
                        href="/offers"
                        className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-bold text-lg transition-all border border-white/20 hover:bg-white/20 text-center min-w-[200px]"
                    >
                        See Offers
                    </Link>
                </div>
            </div>

            {/* Vertical Text Ornament */}
            <div className="absolute top-1/2 -translate-y-1/2 left-8 hidden 2xl:block opacity-30 select-none">
                <div className="text-[10px] font-bold tracking-[0.5em] uppercase [writing-mode:vertical-rl] text-white h-64 border-r border-white/30 pr-4">
                    EST. 2024 • COLOMBO • SRI LANKA
                </div>
            </div>
        </section>
    )
}

export default Hero
