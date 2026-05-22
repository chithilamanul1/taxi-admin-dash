import React from 'react'
import { PlaneLanding, PlaneTakeoff, Route, Signpost, MapPin, Calendar, Car, Info, ChevronDown, CircleDot } from 'lucide-react'

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
                            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 md:gap-2.5 px-2 sm:px-6 py-3 rounded-xl text-[9px] sm:text-xs md:text-sm font-bold opacity-60`}
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
                    
                    {/* Left Column: Form Fields */}
                    <div className="flex-1 text-center lg:text-left min-w-0">
                        {/* Upper controls line */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mb-8">
                            {/* One Way / Round Trip Pill */}
                            <div className="flex bg-slate-100 dark:bg-zinc-800 rounded-xl p-1 w-full sm:w-auto shadow-inner">
                                <div className="px-4 sm:px-8 py-2.5 bg-white dark:bg-zinc-700 text-slate-800 dark:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                    One Way
                                </div>
                                <div className="px-4 sm:px-8 py-2.5 text-slate-400 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                    Round Trip
                                </div>
                            </div>

                            {/* Currency & Detect buttons */}
                            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto sm:overflow-visible pb-1 sm:pb-0">
                                <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold text-slate-400 shadow-sm w-24">
                                    <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-zinc-700 animate-pulse" />
                                    <span className="uppercase">LKR</span>
                                    <ChevronDown size={14} className="opacity-40" />
                                </div>
                                <div className="flex-1 sm:flex-none text-slate-400 text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-2 bg-slate-50 dark:bg-zinc-800/50 px-4 sm:px-6 py-2 sm:py-2.5 md:py-3 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm w-32 justify-center">
                                    <div className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-zinc-700 animate-pulse" />
                                    <span>Detecting</span>
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

                        {/* Passenger & Luggage Counter Skeleton */}
                        <div className="mt-8 lg:mt-10 space-y-4">
                            <div className="h-4 w-44 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse mb-4 ml-1" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                {[
                                    { id: 'adults', label: 'Adults' },
                                    { id: 'children', label: 'Children' },
                                    { id: 'luggage', label: 'Luggage' },
                                    { id: 'handLuggage', label: 'Hand Luggage' }
                                ].map(c => (
                                    <div key={c.id} className="bg-slate-50/50 dark:bg-zinc-800/30 border border-slate-200/50 dark:border-white/5 shadow-sm p-4 rounded-2xl flex items-center justify-between h-16 sm:h-18">
                                        <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{c.label}</span>
                                        <div className="w-28 h-10 bg-slate-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Vehicle Selection Skeleton */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-3 px-1">
                                <div className="h-3 w-28 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
                            </div>
                            <div className="w-full min-h-[4.5rem] sm:min-h-[5.5rem] py-3 px-4 sm:px-6 flex items-center justify-between bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
                                <div className="flex items-center gap-4 sm:gap-6 w-full">
                                    <div className="w-20 h-14 sm:w-28 sm:h-16 rounded-2xl bg-slate-200 dark:bg-zinc-700/60 animate-pulse shrink-0" />
                                    <div className="space-y-2 w-1/3">
                                        <div className="h-4 w-full bg-slate-200 dark:bg-zinc-700/60 rounded animate-pulse" />
                                        <div className="h-3 w-2/3 bg-slate-100 dark:bg-zinc-700/40 rounded animate-pulse" />
                                    </div>
                                </div>
                                <ChevronDown size={24} className="opacity-30 shrink-0" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Trip Summary & Pricing Card */}
                    <div className="bg-slate-50/50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm p-5 lg:p-6 flex flex-col justify-start h-auto lg:h-full lg:min-h-0 gap-6">
                        <div className="space-y-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-center mb-2">
                                <div className="h-5 w-32 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
                                <div className="h-8 w-16 bg-slate-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
                            </div>

                            {/* Map Container Skeleton */}
                            <div className="h-48 lg:flex-1 w-full rounded-2xl bg-slate-150 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 shadow-inner flex-shrink-0 lg:flex-shrink flex items-center justify-center overflow-hidden min-h-[200px] lg:min-h-[220px]">
                                <div className="w-full h-full relative flex items-center justify-center bg-slate-100 dark:bg-zinc-900">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200/20 dark:via-zinc-800/40 to-transparent -translate-x-full animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
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

                                {/* Divider & breakdown skeleton */}
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
