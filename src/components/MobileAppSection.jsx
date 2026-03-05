'use client';

import { Smartphone, Download, ShieldCheck, Zap, Star, Apple, Play } from 'lucide-react';

export default function MobileAppSection() {
    return (
        <section className="py-24 px-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="relative rounded-[3rem] overflow-hidden bg-slate-950 shadow-2xl border border-white/10">
                    {/* Animated Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-transparent to-amber-900/20 opacity-50"></div>

                    <div className="relative z-10 p-8 md:p-16 lg:p-24 flex flex-col lg:flex-row items-center gap-16">
                        {/* Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md rounded-full px-4 py-1.5 mb-8">
                                <Smartphone size={14} className="text-emerald-400" />
                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Coming Soon</span>
                            </div>

                            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                                Your Premium Journey, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">In Your Pocket.</span>
                            </h2>

                            <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                We're building the ultimate travel companion for your Sri Lankan adventures. Get instant bookings, real-time driver tracking, and exclusive app-only deals.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-4 group hover:bg-white/10 transition-all cursor-not-allowed">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white">
                                        <Apple size={24} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Soon on</p>
                                        <p className="text-base font-black text-white">App Store</p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-4 group hover:bg-white/10 transition-all cursor-not-allowed">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white">
                                        <Play size={24} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Soon on</p>
                                        <p className="text-base font-black text-white">Google Play</p>
                                    </div>
                                </div>
                            </div>

                            {/* App Features Preview */}
                            <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-6 pt-12 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="text-emerald-500" size={18} />
                                    <span className="text-xs font-bold text-slate-300">Safe Rides</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap className="text-amber-500" size={18} />
                                    <span className="text-xs font-bold text-slate-300">Quick Booking</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="text-emerald-400" size={18} />
                                    <span className="text-xs font-bold text-slate-300">Premium Fleet</span>
                                </div>
                            </div>
                        </div>

                        {/* Visual Representation (Phone Mockup Aesthetic) */}
                        <div className="w-full lg:w-2/5 relative">
                            <div className="relative z-10 w-full aspect-[4/5] rounded-[2.5rem] bg-gradient-to-br from-emerald-500/20 to-slate-900 border border-white/10 p-6 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>

                                <div className="text-center relative z-20">
                                    <div className="w-24 h-24 bg-white/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 backdrop-blur-3xl border border-white/20">
                                        <Smartphone size={40} className="text-emerald-400 animate-pulse" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">App Under Design</h3>
                                    <p className="text-slate-400 text-sm font-medium">Launching Q3 2026</p>
                                </div>

                                {/* Floating UI Elements */}
                                <div className="absolute top-10 right-10 w-16 h-16 bg-white/5 rounded-2xl animate-float blur-sm"></div>
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
