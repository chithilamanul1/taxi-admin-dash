'use client';
import React from 'react';
import { X, Users, Briefcase, Lock, Loader2, Info, Wind, ShieldCheck, Backpack, Check, ArrowRight } from 'lucide-react';
import VehicleCarousel from './VehicleCarousel';

// Strip the word 'KDH' from display names only (keeps DB IDs intact)
const displayName = (name) => (name || '').replace(/\bKDH\s*/gi, '').trim();

const VehicleSelectionDrawer = ({ isOpen, onClose, vehicles, selectedId, onSelect, passengerCount, isLoading }) => {
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

            {/* Drawer Content - Premium Box Style */}
            <div className={`absolute bottom-0 left-0 right-0 max-h-[90vh] bg-white dark:bg-[#111] rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.3)] transform transition-transform duration-500 ease-out z-50 overflow-hidden flex flex-col border-t-8 border-[#FACC15] ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                {/* Header */}
                <div className="p-8 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-white/10 shrink-0">
                    <div>
                        <div className="yellow-badge mb-4">Elite Fleet</div>
                        <h2 className="text-3xl md:text-5xl font-black text-black dark:text-white uppercase italic tracking-tighter">SELECT YOUR <span className="text-[#FACC15]">RIDE</span></h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-16 h-16 rounded-2xl bg-black dark:bg-[#FACC15] text-[#FACC15] dark:text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl"
                        aria-label="Close drawer"
                    >
                        <X size={24} strokeWidth={3} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-6">
                            <div className="w-16 h-16 border-8 border-[#FACC15] border-t-transparent rounded-full animate-spin"></div>
                            <p className="font-black text-black/40 uppercase tracking-widest italic">Calculating Best Rates...</p>
                        </div>
                    ) : vehicles && vehicles.length > 0 ? (
                        <div className="space-y-6 max-w-5xl mx-auto pb-10">
                            <VehicleCarousel 
                                vehicles={vehicles} 
                                selectedId={selectedId} 
                                onSelect={(id) => { onSelect(id); onClose(); }}
                                passengerCount={passengerCount}
                            />
                            
                            {/* Premium Feature Highlight */}
                            <div className="premium-box p-10 bg-[#FACC15] border-none text-black">
                                <h3 className="text-2xl font-black uppercase italic tracking-tight mb-4 flex items-center gap-3">
                                    <ShieldCheck size={28} />
                                    ALL-INCLUSIVE PRICING
                                </h3>
                                <p className="text-sm font-bold uppercase tracking-widest leading-relaxed opacity-80">
                                    No hidden fees. Your quote includes fuel, insurance, and professional English-speaking chauffeur service.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center text-black/20">
                                <X size={40} />
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tight">No Vehicles Available</h4>
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
