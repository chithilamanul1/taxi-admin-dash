import React from 'react'
import { PlaneLanding, PlaneTakeoff, Route, Signpost, MapPin, Calendar, Car, Info, ChevronDown, CircleDot, Check, ArrowRight } from 'lucide-react'

export default function BookingWidgetSkeleton() {
    return (
        <div id="booking" className="w-full max-w-6xl mx-auto pt-28 md:pt-36 pb-24 md:pb-0 relative z-40 px-3 sm:px-4">
            {/* Tab Navigation Skeleton - Luxury Pill Style */}
            <div className="flex bg-slate-100 dark:bg-zinc-900 rounded-2xl w-full sm:w-fit mx-auto lg:mx-0 mb-6 p-1.5 shadow-inner" role="tablist">
                <div className="grid grid-cols-4 w-full sm:w-auto gap-1">
                    {[
                        { id: 'pickup', label: 'Airport Pickup', icon: PlaneLanding },
                        { id: 'drop', label: 'Airport Dropoff', icon: PlaneTakeoff },
                        { id: 'ride', label: 'Intercity Ride', icon: Route },
                        { id: 'tours', label: 'Taxi Round Tour', icon: Signpost }
                    ].map(tab => (
                        <div
                            key={tab.id}
                            className="flex flex-col sm:flex-row items-center justify-center gap-1.5 md:gap-2.5 px-2 sm:px-6 py-3 rounded-xl text-[9px] sm:text-xs md:text-sm font-bold opacity-60"
                        >
                            <tab.icon size={16} className="text-slate-400" />
                            <span className="uppercase tracking-wider text-slate-400">{tab.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Widget Main Content Skeleton - Matching BookingWidget style */}
            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-200 dark:border-white/10 p-4 sm:p-6 md:p-8 relative z-10 w-full box-border shadow-xl shadow-slate-200/50 dark:shadow-none">
                <div className="grid lg:grid-cols-[1.5fr,380px] xl:grid-cols-[1fr,380px] gap-8 lg:gap-10 min-w-0">

                    {/* Left Column: Step 1 Skeleton */}
                    <div className="flex-1 text-center lg:text-left min-w-0">

                        {/* Step Progress Indicator Skeleton */}
                        <div className="flex items-center justify-between mb-6">
                            {/* Step 1 — active */}
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-emerald-500/30">1</div>
                                <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Route</span>
                            </div>
                            <div className="flex-1 h-px mx-2 bg-slate-200 dark:bg-zinc-700" />
                            {/* Step 2 — inactive */}
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black text-slate-400">2</div>
                                <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600">Details</span>
                            </div>
                            {/* Step 3 — mobile only */}
                            <div className="flex lg:hidden items-center gap-2">
                                <div className="flex-1 h-px mx-2 bg-slate-200 dark:bg-zinc-700" />
                                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black text-slate-400">3</div>
                                <span className="hidden sm:block lg:hidden text-[10px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600">Review</span>
                            </div>
                            {/* Currency placeholder */}
                            <div className="flex items-center gap-2 ml-4 shrink-0">
                                <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-[10px] font-bold text-slate-400 shadow-sm w-20">
                                    <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-zinc-700 animate-pulse" />
                                    <span className="uppercase">LKR</span>
                                    <ChevronDown size={14} className="opacity-40" />
                                </div>
                            </div>
                        </div>

                        {/* Fields container with dashed connector line */}
                        <div className="relative">
                            <div className="absolute left-[16px] top-10 bottom-10 w-5 z-0 pointer-events-none overflow-visible">
                                <svg className="w-full h-full" viewBox="0 0 20 100" preserveAspectRatio="none">
                                    <path
                                        d="M 10 0 Q 0 50 10 100"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeDasharray="4 6"
                                        strokeLinecap="round"
                                        className="text-emerald-500/20 dark:text-[#FACC15]/10"
                                    />
                                </svg>
                            </div>

                            <div className="space-y-4 md:space-y-3 relative z-10">
                                {/* Pickup Input Skeleton */}
                                <div className="relative">
                                    <div className="absolute left-[18px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-emerald-500/30 bg-white dark:bg-zinc-800 z-20 flex items-center justify-center text-emerald-500/30">
                                        <CircleDot size={10} strokeWidth={4} />
                                    </div>
                                    <div className="w-full h-14 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-white/5 rounded-2xl pl-14 pr-6 flex items-center justify-between shadow-sm">
                                        <div className="h-4 w-2/3 bg-slate-200 dark:bg-zinc-700/60 rounded animate-pulse" />
                                        <PlaneLanding size={18} className="text-slate-300 dark:text-zinc-600" />
                                    </div>
                                </div>

                                {/* Dropoff Input Skeleton */}
                                <div className="relative mt-2">
                                    <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
                                        <MapPin size={20} className="text-red-500/30" strokeWidth={2.5} />
                                    </div>
                                    <div className="w-full h-14 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-white/5 rounded-2xl pl-14 pr-6 flex items-center justify-between shadow-sm">
                                        <div className="h-4 w-1/3 bg-slate-200 dark:bg-zinc-700/60 rounded animate-pulse" />
                                        <MapPin size={18} className="text-slate-300 dark:text-zinc-600" />
                                    </div>
                                </div>

                                {/* Date & Time Selector Skeleton */}
                                <div className="relative mt-2">
                                    <div className="w-full h-14 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-white/5 rounded-2xl px-6 flex items-center justify-between shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <Calendar size={18} className="text-slate-300 dark:text-zinc-600" />
                                            <div className="h-4 w-36 bg-slate-200 dark:bg-zinc-700/60 rounded animate-pulse" />
                                        </div>
                                        <ChevronDown size={16} className="opacity-30" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button Skeleton */}
                        <div className="mt-6 flex items-center gap-3">
                            <div className="flex-1 h-14 bg-emerald-600/20 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center animate-pulse">
                                <div className="h-4 w-48 bg-emerald-600/40 rounded" />
                            </div>
                            <div className="shrink-0 w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-white/10 animate-pulse" />
                        </div>
                    </div>

                    {/* Right Column: Trip Summary & Pricing Card */}
                    <div className="hidden lg:flex bg-slate-50/50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm p-5 lg:p-6 flex-col justify-start h-auto lg:h-full lg:min-h-0 gap-6">
                        <div className="space-y-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-center mb-2">
                                <div className="h-5 w-32 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
                                <div className="h-8 w-16 bg-slate-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
                            </div>

                            {/* Map Container Skeleton */}
                            <div className="h-48 lg:flex-1 w-full rounded-2xl bg-slate-150 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 shadow-inner flex-shrink-0 lg:flex-shrink flex items-center justify-center overflow-hidden min-h-[200px] lg:min-h-[220px]">
                                <div className="w-full h-full relative flex items-center justify-center bg-slate-100 dark:bg-zinc-900">
                                    <div className="flex flex-col items-center gap-2 opacity-30">
                                        <Car size={32} className="text-slate-400 dark:text-zinc-500 animate-bounce" />
                                        <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-zinc-500">Loading Map...</span>
                                    </div>
                                </div>
                            </div>

                            {/* Price details line skeletons */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="h-3 w-24 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
                                    <div className="h-3 w-12 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="h-3 w-20 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
                                    <div className="h-3 w-28 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
                                </div>
                                <div className="pt-6 border-t border-slate-200 dark:border-white/10 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="h-3.5 w-24 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
                                        <div className="h-3.5 w-20 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Total & Checkout button skeleton */}
                        <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex-shrink-0 space-y-6">
                            <div className="flex justify-between items-end">
                                <div className="flex flex-col gap-1.5 w-full">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-zinc-700 animate-pulse" />
                                        <div className="h-3 w-28 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
                                    </div>
                                    <div className="h-8 w-2/3 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
                                </div>
                            </div>
                            <div className="p-4 bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200/50 dark:border-amber-500/10 rounded-2xl flex items-start gap-3">
                                <Info size={14} className="text-amber-500/40 shrink-0 mt-0.5" />
                                <div className="h-3 w-4/5 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-zinc-800/80 min-h-16 sm:h-[72px] rounded-2xl flex items-center justify-center border border-slate-200/50 dark:border-white/5">
                                <div className="h-5 w-1/3 bg-slate-200 dark:bg-zinc-700/60 rounded animate-pulse" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
