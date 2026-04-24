'use client';
import React from 'react';
import { X, Users, Briefcase, Lock, Loader2, Info, Wind, ShieldCheck, Backpack, Check, ArrowRight } from 'lucide-react';
import VehicleCarousel from './VehicleCarousel';

// Strip the word 'KDH' from display names only (keeps DB IDs intact)
const displayName = (name) => (name || '').replace(/\bKDH\s*/gi, '').trim();

const VehicleSelectionDrawer = ({ isOpen, onClose, pickupLocation, dropoffLocation, vehicles, selectedId, onSelect, passengerCount, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div 
            className={`fixed inset-0 z-[100] transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Drawer Content - Luxury Modern Style */}
            <div className={`absolute bottom-0 left-0 right-0 max-h-[90vh] bg-white dark:bg-zinc-900 rounded-t-[3rem] transform transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] z-50 overflow-hidden flex flex-col shadow-2xl ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                {/* Header */}
                <div className="p-8 md:p-10 pb-6 flex items-center justify-between border-b border-slate-100 dark:border-white/5 shrink-0">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 border border-emerald-100 dark:border-emerald-500/20">
                            <ShieldCheck size={14} /> Elite Fleet Selection
                        </div>
                        <h2 className="text-2xl md:text-5xl font-black text-emerald-950 dark:text-white uppercase tracking-tight">Select Your <span className="text-emerald-600">Ride</span></h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shadow-sm border border-slate-200 dark:border-white/10"
                        aria-label="Close drawer"
                    >
                        <X size={24} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-6">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-emerald-100 dark:border-white/5 rounded-full"></div>
                                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Calculating Luxury Rates...</p>
                        </div>
                    ) : vehicles && vehicles.length > 0 ? (
                        <div className="space-y-10 max-w-6xl mx-auto pb-12">
                            <VehicleCarousel 
                                vehicles={vehicles} 
                                selectedId={selectedId} 
                                onSelect={(id) => { onSelect(id); onClose(); }}
                                passengerCount={passengerCount}
                                pickupLocation={pickupLocation}
                                dropoffLocation={dropoffLocation}
                            />
                            
                            {/* Modern Feature Highlight */}
                            <div className="p-8 md:p-12 bg-emerald-950 dark:bg-zinc-800 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
                                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors"></div>
                                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-6 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/40">
                                        <ShieldCheck size={28} />
                                    </div>
                                    All-Inclusive Service
                                </h3>
                                <div className="space-y-4 relative z-10">
                                    <p className="text-base md:text-lg font-medium text-emerald-50/80 leading-relaxed">
                                        Fuel, Comprehensive Insurance, Professional Chauffeur & Government Tax are all included in your quote. No hidden fees or surprises at your destination.
                                    </p>
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400/60 bg-emerald-900/50 dark:bg-white/5 w-fit px-4 py-2 rounded-lg border border-emerald-800/30">
                                        <Info size={14} /> Highway tickets are not included
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center gap-8">
                            <div className="w-24 h-24 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-300">
                                <X size={48} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h4 className="text-3xl font-black text-emerald-950 dark:text-white uppercase tracking-tight">No Vehicles Available</h4>
                                <p className="text-slate-500 dark:text-slate-400 font-medium mt-3 max-w-sm mx-auto">We couldn't find any vehicles matching your criteria for this route. Please try adjusting your passenger count or contact our concierge.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VehicleSelectionDrawer;
