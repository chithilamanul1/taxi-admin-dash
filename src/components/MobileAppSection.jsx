'use client';

import { Smartphone, Download, ShieldCheck, Zap, Star } from 'lucide-react';
import { FaApple, FaGooglePlay } from 'react-icons/fa';

export default function MobileAppSection() {
    return (
        <section className="py-24 px-6 relative overflow-hidden bg-white dark:bg-[#0a0a0a] transition-colors duration-300 border-t-4 border-black">
            <div className="max-w-7xl mx-auto">
                <div className="relative overflow-hidden bg-white dark:bg-[#111] border-4 border-black shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] dark:shadow-[15px_15px_0px_0px_rgba(250,204,21,0.15)] transition-colors duration-300">

                    <div className="relative z-10 p-8 md:p-16 lg:p-24 flex flex-col lg:flex-row items-center gap-16">
                        {/* Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 bg-[#FACC15] border-4 border-black px-4 py-1.5 mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <Smartphone size={14} className="text-black" strokeWidth={3} />
                                <span className="text-xs font-black text-black uppercase tracking-[0.2em]">Coming Soon</span>
                            </div>

                            <h2 className="text-5xl md:text-7xl font-black text-black dark:text-white mb-8 leading-none uppercase italic tracking-tighter">
                                YOUR PREMIUM JOURNEY, <br />
                                <span className="text-[#FACC15]">IN YOUR POCKET.</span>
                            </h2>

                            <p className="text-black/50 dark:text-white/50 font-black uppercase tracking-[0.1em] text-sm md:text-base mb-12 max-w-xl mx-auto lg:mx-0">
                                We're building the ultimate travel companion for your Sri Lankan adventures. Get instant bookings, real-time driver tracking, and exclusive app-only deals.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
                                <button className="flex items-center justify-center gap-3 bg-white dark:bg-white text-black px-6 py-3.5 rounded-none border-4 border-black hover:-translate-y-1 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group">
                                    <FaApple size={36} className="text-black" />
                                    <div className="text-left font-sans">
                                        <div className="text-[10px] uppercase tracking-[0.2em] text-black/50 font-black mb-0.5">Download on the</div>
                                        <div className="text-xl leading-none font-black text-black tracking-tighter">App Store</div>
                                    </div>
                                </button>
                                <button className="flex items-center justify-center gap-3 bg-black text-[#FACC15] px-6 py-3.5 rounded-none border-4 border-black hover:-translate-y-1 hover:bg-[#111] transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group">
                                    <FaGooglePlay size={32} className="text-[#FACC15]" />
                                    <div className="text-left font-sans">
                                        <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-black mb-0.5">Get it on</div>
                                        <div className="text-xl leading-none font-black text-white tracking-tighter">Google Play</div>
                                    </div>
                                </button>
                            </div>

                            {/* App Features Preview - Boxy Separator */}
                            <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-6 pt-12 border-t-4 border-black w-full">
                                <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 px-4 py-2 border-2 border-black">
                                    <ShieldCheck className="text-black dark:text-[#FACC15]" size={18} strokeWidth={3} />
                                    <span className="text-[10px] font-black text-black dark:text-white uppercase tracking-[0.2em]">Safe Rides</span>
                                </div>
                                <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 px-4 py-2 border-2 border-black">
                                    <Zap className="text-black dark:text-[#FACC15]" size={18} strokeWidth={3} />
                                    <span className="text-[10px] font-black text-black dark:text-white uppercase tracking-[0.2em]">Quick Booking</span>
                                </div>
                                <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 px-4 py-2 border-2 border-black">
                                    <Star className="text-black dark:text-[#FACC15]" size={18} strokeWidth={3} />
                                    <span className="text-[10px] font-black text-black dark:text-white uppercase tracking-[0.2em]">Premium Fleet</span>
                                </div>
                            </div>
                        </div>

                        {/* Visual Representation (Phone Mockup Aesthetic) */}
                        <div className="w-full lg:w-2/5 relative">
                            <div className="relative z-10 w-full aspect-[4/5] bg-black/5 dark:bg-white/5 border-4 border-black rounded-none p-2 flex items-center justify-center shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_rgba(250,204,21,0.15)] relative overflow-hidden group">

                                {/* App Screen Content */}
                                <div className="relative w-full h-full overflow-hidden bg-white dark:bg-[#0a0a0a] border-2 border-black">
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-20">
                                        <div className="w-20 h-20 bg-[#FACC15] border-4 border-black flex items-center justify-center mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                                            <Smartphone size={36} className="text-black" strokeWidth={3} />
                                        </div>
                                        <h3 className="text-2xl font-black text-black dark:text-white mb-3 uppercase italic tracking-tighter">Experience Sri Lanka</h3>
                                        <p className="text-black/40 dark:text-white/40 text-xs font-black uppercase tracking-[0.2em] max-w-[200px]">Coming soon to your favorite app store</p>
                                    </div>

                                    {/* Top bar mockup */}
                                    <div className="absolute top-4 left-4 right-4 h-8 bg-black/5 dark:bg-white/5 border-2 border-black flex items-center px-4 justify-between z-30">
                                        <div className="w-8 h-1 bg-black/20 dark:bg-white/20"></div>
                                        <div className="flex gap-2">
                                            <div className="w-2 h-2 bg-[#FACC15] border border-black"></div>
                                            <div className="w-2 h-2 bg-[#FACC15] border border-black"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
