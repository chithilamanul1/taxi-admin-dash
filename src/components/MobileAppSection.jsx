'use client';

import { Smartphone, Download, ShieldCheck, Zap, Star } from 'lucide-react';
import { FaApple, FaGooglePlay } from 'react-icons/fa'; export default function MobileAppSection() {
    return (
        <section className="py-24 px-6 relative overflow-hidden bg-white dark:bg-transparent transition-colors duration-300">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="relative rounded-[3rem] overflow-hidden bg-slate-50 dark:bg-emerald-900 shadow-2xl border border-black/5 dark:border-white/10 transition-colors duration-300">
                    {/* Animated Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/5 dark:from-emerald-900/40 via-transparent to-black/5 dark:to-orange-950/20 opacity-50"></div>

                    <div className="relative z-10 p-8 md:p-16 lg:p-24 flex flex-col lg:flex-row items-center gap-16">
                        {/* Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md rounded-full px-4 py-1.5 mb-8">
                                <Smartphone size={14} className="text-emerald-600 dark:text-emerald-400" />
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Coming Soon</span>
                            </div>

                            <h2 className="text-4xl md:text-6xl font-black text-black dark:text-white mb-8 leading-tight">
                                Your Premium Journey, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400 dark:from-emerald-400 dark:to-orange-400">In Your Pocket.</span>
                            </h2>

                            <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                We're building the ultimate travel companion for your Sri Lankan adventures. Get instant bookings, real-time driver tracking, and exclusive app-only deals.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
                                <button className="flex items-center justify-center gap-3 bg-white dark:bg-white text-emerald-900 px-6 py-3.5 rounded-2xl hover:bg-slate-100 transition-transform hover:scale-105 shadow-xl group border border-slate-200 dark:border-transparent">
                                    <FaApple size={36} className="text-emerald-900 group-hover:drop-shadow-md transition-all" />
                                    <div className="text-left font-sans">
                                        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-0.5">Download on the</div>
                                        <div className="text-xl leading-none font-black text-emerald-900 tracking-tight">App Store</div>
                                    </div>
                                </button>
                                <button className="flex items-center justify-center gap-3 bg-emerald-900 dark:bg-emerald-950 text-white px-6 py-3.5 rounded-2xl border-2 border-emerald-800 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-950 transition-all hover:scale-105 shadow-xl group">
                                    <FaGooglePlay size={32} className="text-emerald-400 group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] transition-all" />
                                    <div className="text-left font-sans">
                                        <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Get it on</div>
                                        <div className="text-xl leading-none font-black text-white tracking-tight">Google Play</div>
                                    </div>
                                </button>
                            </div>

                            {/* App Features Preview */}
                            <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-6 pt-12 border-t border-black/5 dark:border-white/5">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="text-emerald-600 dark:text-emerald-500" size={18} />
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Safe Rides</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap className="text-emerald-600 dark:text-emerald-500" size={18} />
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Quick Booking</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="text-emerald-500 dark:text-emerald-400" size={18} />
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Premium Fleet</span>
                                </div>
                            </div>
                        </div>

                        {/* Visual Representation (Phone Mockup Aesthetic) */}
                        <div className="w-full lg:w-2/5 relative">
                            <div className="relative z-10 w-full aspect-[4/5] rounded-[2.5rem] bg-slate-200 dark:bg-emerald-900 border border-black/5 dark:border-white/10 p-2 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>

                                {/* App Screen Content (Mockup Carousel) */}
                                <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-white dark:bg-emerald-900">
                                    <div className="absolute inset-0 transition-opacity duration-1000 opacity-100">
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-200/80 dark:from-emerald-900/80 via-transparent to-transparent z-10"></div>
                                    </div>

                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-20">
                                        <div className="w-16 h-16 bg-emerald-600/10 dark:bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-3xl border border-emerald-600/20 dark:border-white/20">
                                            <Smartphone size={32} className="text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <h3 className="text-xl font-black text-black dark:text-white mb-2 tracking-tight">Experience Sri Lanka</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium max-w-[200px]">Coming soon to your favorite app store</p>
                                    </div>

                                    {/* Floating UI Elements over image */}
                                    <div className="absolute top-6 left-6 right-6 h-8 bg-black/5 dark:bg-white/5 rounded-full border border-black/10 dark:border-white/10 backdrop-blur-md flex items-center px-4 justify-between z-30">
                                        <div className="w-8 h-1 bg-black/20 dark:bg-white/20 rounded-full"></div>
                                        <div className="flex gap-1">
                                            <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                                            <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating UI Elements outside screen */}
                                <div className="absolute top-10 right-10 w-16 h-16 bg-black/5 dark:bg-white/5 rounded-2xl animate-float blur-sm"></div>
                                <div className="absolute bottom-10 left-10 w-24 h-24 bg-emerald-500/5 rounded-full animate-pulse blur-xl"></div>
                            </div>

                            {/* Glowing shadow behind "phone" */}
                            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
