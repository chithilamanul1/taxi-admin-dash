'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Star, Shield, Zap, MapPin, Users, Award } from 'lucide-react'

const heroMedia = [
    { type: 'video', src: 'https://www.pexels.com/download/video/14932551/', alt: 'Sri Lanka Aerial Video' },
    { type: 'image', src: 'https://images.pexels.com/photos/1005417/pexels-photo-1005417.jpeg', alt: 'Sri Lanka Train' },
    { type: 'video', src: 'https://www.pexels.com/download/video/2187246/', alt: 'Sri Lanka Coast Video' }
]

const HeroFeatures = [
    { label: 'Luxury Service', icon: Shield, desc: 'all kinds of premium vehicles as your needs' },
    { label: 'Language Friendly', icon: Users, desc: 'English speaking drivers' },
    { label: 'Affordable Rates', icon: Award, desc: 'No hidden charges' }
]

const Hero = ({ onBookClick }) => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroMedia.length)
        }, 6000)
        return () => clearInterval(timer)
    }, [])

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroMedia.length)
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroMedia.length) % heroMedia.length)

    return (
        <section className="relative min-h-[95vh] flex items-center justify-center pt-32 pb-32 overflow-hidden bg-white">
            {/* Background Slideshow */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 z-10"></div>

                {heroMedia.map((media, index) => {
                    const isVisible = index === currentSlide;
                    return (
                        <div
                            key={index}
                            className={`absolute inset-0 w-full h-full transition-all duration-[2500ms] ease-in-out ${isVisible ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}`}
                        >
                            {media.type === 'image' ? (
                                <Image
                                    src={media.src}
                                    alt={media.alt}
                                    fill
                                    priority={index === 0}
                                    className="object-cover"
                                    sizes="100vw"
                                />
                            ) : (
                                <video
                                    src={media.src}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="object-cover w-full h-full"
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-6 relative z-20">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Left: Premium Typography */}
                    <div className="flex-1 space-y-10 text-center lg:text-left">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/20 px-6 py-2 rounded-full shadow-xl">
                                <Star size={14} className="text-[#FFDA00] fill-[#FFDA00]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Elite Sri Lanka Travels</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tighter text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                                Your Premium <br />
                                <span
                                    className="text-[#FFDA00] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] italic"
                                    style={{ fontFamily: 'var(--font-playfair), serif' }}
                                >
                                    Journey
                                </span> Awaits
                            </h1>

                            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto lg:mx-0 font-semibold leading-relaxed drop-shadow-md">
                                Experience the gold standard of transportation in Sri Lanka. From VIP airport arrivals to bespoke island tours.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4">
                            <button
                                onClick={onBookClick}
                                className="group relative px-8 py-4 bg-[#FFDA00] text-black font-black uppercase tracking-widest text-xs rounded-full transition-all hover:bg-black hover:text-white hover:scale-105 active:scale-95 shadow-2xl"
                            >
                                <span className="flex items-center gap-2">
                                    Instant Booking <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>

                            <Link
                                href="/tour-packages"
                                className="px-10 py-5 bg-white/60 backdrop-blur-md border border-white/40 text-slate-900 font-black uppercase tracking-widest text-sm rounded-full hover:bg-white transition-all shadow-lg"
                            >
                                Explore Tours
                            </Link>
                        </div>
                    </div>

                    {/* Right: Glass Panel */}
                    <div className="lg:w-[450px] relative group hidden lg:block">
                        <div className="absolute inset-0 bg-[#FFDA00]/20 blur-[100px] rounded-full group-hover:bg-[#FFDA00]/30 transition-all duration-1000"></div>

                        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 space-y-10 shadow-2xl">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-[#FFDA00] uppercase tracking-[0.4em]">Available 24/7</p>
                                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Premier Fleet</h2>
                            </div>

                            <div className="space-y-6">
                                {HeroFeatures.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-5 group/item bg-white/5 p-4 rounded-3xl border border-white/10 hover:bg-white/10 transition-all">
                                        <div className="w-14 h-14 bg-[#FFDA00] rounded-2xl flex items-center justify-center shadow-lg">
                                            <item.icon size={24} className="text-black" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-white uppercase tracking-wider">{item.label}</h4>
                                            <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slide Navigation */}
            <div className="absolute bottom-10 right-10 z-30 flex items-center gap-4">
                <div className="flex gap-2 bg-black/20 backdrop-blur-md p-3 rounded-full border border-white/10">
                    {heroMedia.map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 rounded-full transition-all duration-500 hover:bg-[#FFDA00]/60 cursor-pointer ${currentSlide === i ? 'bg-[#FFDA00] w-8' : 'bg-white/50 w-2'}`}
                            onClick={() => setCurrentSlide(i)}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Hero
