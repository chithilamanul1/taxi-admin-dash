'use client';

import { Smartphone, Download, ShieldCheck, Zap, Star } from 'lucide-react';
import { FaApple, FaGooglePlay } from 'react-icons/fa';

export default function MobileAppSection() {
    return (
        <section className="pt-4 pb-8 px-6 relative overflow-hidden bg-slate-50 dark:bg-[#050505] transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="relative overflow-hidden bg-white dark:bg-[#111] rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-white/10 transition-colors duration-300">
                    
                    {/* Background Gradients */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-amber-50 dark:bg-amber-900/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 p-5 md:p-8 lg:p-10 flex flex-col lg:flex-row items-center gap-6">
                        {/* Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full px-2 py-1 mb-4">
                                <Smartphone size={12} className="text-emerald-600 dark:text-emerald-400" />
                                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Coming Soon</span>
                            </div>

                            <h2 className="text-2xl md:text-4xl font-black text-emerald-950 dark:text-white mb-3 leading-tight tracking-tight">
                                Your Premium Journey, <br />
                                <span className="text-emerald-600 dark:text-emerald-400">In Your Pocket.</span>
                            </h2>

                            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                We're building the ultimate travel companion for your Sri Lankan adventures. Get instant bookings, real-time tracking, and exclusive deals.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 mt-4 justify-center lg:justify-start">
                                <button className="flex items-center justify-center gap-2 bg-white dark:bg-zinc-800 text-slate-800 dark:text-white px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 hover:shadow-md hover:border-slate-300 dark:hover:border-white/20 hover:-translate-y-0.5 transition-all group">
                                    <FaApple size={18} className="text-slate-800 dark:text-white" />
                                    <div className="text-left font-sans">
                                        <div className="text-[7px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Download on the</div>
                                        <div className="text-xs leading-none font-bold tracking-tight">App Store</div>
                                    </div>
                                </button>
                                <button className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl hover:shadow-md hover:shadow-slate-900/20 hover:-translate-y-0.5 transition-all group border border-transparent">
                                    <FaGooglePlay size={16} className="text-white dark:text-slate-900" />
                                    <div className="text-left font-sans">
                                        <div className="text-[7px] uppercase tracking-widest text-slate-300 dark:text-slate-600 font-bold mb-0.5">Get it on</div>
                                        <div className="text-xs leading-none font-bold tracking-tight">Google Play</div>
                                    </div>
                                </button>
                            </div>

                            {/* App Features Preview */}
                            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3 pt-6 border-t border-slate-100 dark:border-white/5 w-full">
                                <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                                    <ShieldCheck className="text-emerald-600 dark:text-emerald-400" size={14} />
                                    <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Safe Rides</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                                    <Zap className="text-amber-500 dark:text-amber-400" size={14} />
                                    <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Quick Booking</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                                    <Star className="text-emerald-600 dark:text-emerald-400" size={14} />
                                    <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Premium Fleet</span>
                                </div>
                            </div>
                        </div>

                        {/* Visual Representation (Phone Mockup Aesthetic) */}
                        <div className="hidden md:block w-full lg:w-1/3 relative max-w-[280px] mx-auto lg:max-w-none">
                            <div className="relative z-10 w-full aspect-[4/5] bg-slate-100 dark:bg-zinc-800 rounded-[2rem] p-2.5 flex items-center justify-center shadow-2xl border border-white dark:border-white/10 overflow-hidden group">

                                {/* App Screen Content */}
                                <div className="relative w-full h-full overflow-hidden bg-white dark:bg-[#0a0a0a] rounded-[2rem] shadow-inner border border-slate-200 dark:border-white/5">
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-20">
                                        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-emerald-100 dark:border-emerald-500/20">
                                            <Smartphone size={32} className="text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <h3 className="text-xl font-black text-emerald-950 dark:text-white mb-2">Experience Sri Lanka</h3>
                                        <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">Coming soon to your favorite app store</p>
                                    </div>

                                    {/* Top bar mockup */}
                                    <div className="absolute top-0 left-0 right-0 h-12 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5 flex items-center px-6 justify-between z-30">
                                        <div className="w-10 h-1.5 rounded-full bg-slate-200 dark:bg-white/10"></div>
                                        <div className="flex gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                            <div className="w-2 h-2 rounded-full bg-amber-400"></div>
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
