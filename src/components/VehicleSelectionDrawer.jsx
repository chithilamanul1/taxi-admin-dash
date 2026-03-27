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

            {/* Drawer Content - Boxy Style */}
            <div className={`absolute inset-0 max-h-screen bg-white dark:bg-[#111] rounded-none transform transition-transform duration-500 ease-out z-50 overflow-hidden flex flex-col ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                {/* Header */}
                <div className="p-6 md:p-8 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-white/10 shrink-0">
                    <div>
                        <div className="yellow-badge mb-1 md:mb-4 scale-75 md:scale-100 origin-left">Elite Fleet</div>
                        <h2 className="text-xl md:text-5xl font-black text-black dark:text-white uppercase tracking-tighter">SELECT YOUR <span className="text-[#FACC15]">RIDE</span></h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 md:w-20 md:h-20 rounded-none bg-black dark:bg-[#FACC15] text-[#FACC15] dark:text-black flex items-center justify-center hover:bg-black/80 transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        aria-label="Close drawer"
                    >
                        <X size={20} strokeWidth={3} className="md:hidden" />
                        <X size={32} strokeWidth={4} className="hidden md:block" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-6">
                            <div className="w-16 h-16 border-8 border-[#FACC15] border-t-transparent rounded-full animate-spin"></div>
                            <p className="font-black text-black/40 uppercase tracking-widest">Calculating Best Rates...</p>
                        </div>
                    ) : vehicles && vehicles.length > 0 ? (
                        <div className="space-y-6 max-w-5xl mx-auto pb-10">
                            <VehicleCarousel 
                                vehicles={vehicles} 
                                selectedId={selectedId} 
                                onSelect={(id) => { onSelect(id); onClose(); }}
                                passengerCount={passengerCount}
                                pickupLocation={pickupLocation}
                                dropoffLocation={dropoffLocation}
                            />
                            
                            {/* Boxy Feature Highlight */}
                            <div className="p-10 bg-black text-[#FACC15] rounded-none border-4 border-[#FACC15] shadow-[15px_15px_0px_0px_rgba(250,204,21,0.2)]">
                                <h3 className="text-2xl font-black uppercase tracking-tight mb-4 flex items-center gap-3">
                                    <ShieldCheck size={28} strokeWidth={3} />
                                    ALL-INCLUSIVE SERVICE
                                </h3>
                                <div className="space-y-2">
                                    <p className="text-xs font-black uppercase tracking-[0.2em] leading-relaxed opacity-80">
                                        Fuel, Insurance, Chauffeur & Tax Included. No Hidden Surprises.
                                    </p>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/60">
                                        * Note: Highway tickets are not included and must be paid by the customer.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center text-black/20">
                                <X size={40} />
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-black dark:text-white uppercase tracking-tight">No Vehicles Available</h4>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2 px-10">We couldn't find any vehicles for this route. Please contact support.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VehicleSelectionDrawer;
