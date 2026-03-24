import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Users, Briefcase, ShoppingBag, Info, Lock, Wind, Backpack, Check, ArrowRight, Car } from 'lucide-react';
import VehicleDetailModal from './VehicleDetailModal';
import { useCurrency } from '../context/CurrencyContext';

const displayName = (name) => (name || '').replace(/\bKDH\s*/gi, '').trim();

const VehicleCarousel = ({ vehicles, selectedId, onSelect, passengerCount, pickupLocation, dropoffLocation }) => {
    const scrollRef = useRef(null);
    const [detailVehicle, setDetailVehicle] = useState(null);
    const { convertPrice, rates, currency } = useCurrency();

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    // Smart Capacity Logic
    const isSuitable = (vehicle) => {
        const totalPax = (passengerCount.adults || 0) + (passengerCount.children || 0);
        const totalBags = passengerCount.bags || 0;

        const vehiclePax = vehicle.capacity || 4;
        const vehicleLargeBags = vehicle.luggage || 0;
        const vehicleSmallBags = vehicle.handLuggage || 0;

        const spareSeats = Math.max(0, vehiclePax - totalPax);
        const extraBagCapacity = spareSeats * 2;

        const maxBagUnits = vehicleLargeBags + (vehicleSmallBags * 0.5) + extraBagCapacity;

        if (totalPax > vehiclePax) return { suitable: false, reason: "Too many passengers" };
        if (totalBags > maxBagUnits) return { suitable: false, reason: "Luggage limit exceeded" };

        return { suitable: true };
    };

    return (
        <div className="relative group/carousel">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8 md:mb-10 px-2 lg:px-0">
                <div className="flex flex-col gap-4">
                    <div className="yellow-badge w-fit scale-90 md:scale-100 origin-left">FLEET</div>
                    
                    {pickupLocation && dropoffLocation && (
                        <div className="flex items-center gap-3 text-[10px] sm:text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-white/5 p-3 rounded-none border-2 border-black w-fit">
                            <span className="truncate max-w-[150px] sm:max-w-xs">{pickupLocation.split(',')[0]}</span>
                            <ArrowRight size={14} className="text-[#FACC15]" strokeWidth={3} />
                            <span className="truncate max-w-[150px] sm:max-w-xs">{dropoffLocation.split(',')[0]}</span>
                        </div>
                    )}

                    <h3 className="text-xl md:text-2xl font-black text-black dark:text-white flex flex-wrap items-center gap-3 md:gap-4 uppercase italic tracking-tighter">
                        VEHICLE OPTIONS
                        <span className="text-[9px] md:text-[10px] bg-black dark:bg-[#FACC15] text-[#FACC15] dark:text-black px-4 md:px-6 py-1.5 rounded-none border-2 border-black not-italic tracking-[0.2em] font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            {vehicles.length} MODELS
                        </span>
                    </h3>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex flex-col gap-6 overflow-y-visible pb-8 px-2 w-full items-stretch"
            >
                {vehicles.map((vehicle, index) => {
                    const { suitable, reason } = isSuitable(vehicle);
                    const isSelected = selectedId === vehicle.vehicleType;
                    const displayIdx = (index + 1).toString().padStart(2, '0');

                    return (
                        <div
                            key={vehicle._id || vehicle.vehicleType}
                            className={`
                                relative flex-shrink-0 w-full max-w-[420px] mx-auto snap-start transition-all duration-300 group/card flex flex-col
                                ${isSelected 
                                    ? 'shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] dark:shadow-[15px_15px_0px_0px_#FACC15] border-[4px] border-black -translate-y-2' 
                                    : 'hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[10px_10px_0px_0px_#FACC15] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_#FACC15] border-[3px] border-black hover:-translate-y-1'}
                                ${!suitable ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer'}
                                bg-white dark:bg-[#111] rounded-none
                                overflow-visible h-full
                            `}
                            onClick={() => suitable && onSelect(vehicle.vehicleType)}
                        >
                            {!suitable && (
                                <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-8 text-center">
                                    <div className="w-16 h-16 bg-red-600 rounded-none mb-6 flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <Lock size={28} className="text-white" strokeWidth={3} />
                                    </div>
                                    <p className="text-xl font-black text-white uppercase italic tracking-tighter leading-tight">{reason}</p>
                                    <p className="text-[10px] text-white font-black mt-4 uppercase tracking-[0.3em] bg-red-700 px-6 py-2.5 rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">SELECT LARGER VEHICLE</p>
                                </div>
                            )}

                            {/* Selected indicator — thin top bar instead of full border */}
                            {isSelected && (
                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FACC15] z-10 pointer-events-none" />
                            )}

                            {/* ───── Card top: price + name area ───── */}
                            <div className="p-6 md:p-8 pb-4 relative flex flex-col items-center flex-1 h-full">

                                {/* Faint background index number */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[160px] font-black text-black/[0.03] dark:text-white/[0.02] italic tracking-tighter pointer-events-none select-none">
                                    {displayIdx}
                                </div>

                                {/* Info button */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); setDetailVehicle(vehicle); }}
                                    className="absolute top-4 right-4 w-9 h-9 bg-white dark:bg-[#111] text-black dark:text-[#FACC15] rounded-none border-2 border-black flex items-center justify-center hover:bg-[#FACC15] hover:text-black transition-all z-20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_#FACC15]"
                                    aria-label={`View details for ${vehicle.name}`}
                                >
                                    <Info size={16} strokeWidth={2.5} />
                                </button>

                                <h4 className="text-2xl font-black text-[#1A1A1A] dark:text-white uppercase tracking-tighter mb-4 text-center relative z-10 min-h-[64px] flex items-center justify-center">
                                    {displayName(vehicle.name)}
                                </h4>

                                {vehicle.calculatedTotal >= 0 && (
                                    <div className="text-center relative z-10 min-h-[80px] flex flex-col justify-end">
                                        {!(passengerCount.distance > 0) && (
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Starting from</p>
                                        )}
                                        <div className="flex items-center justify-center gap-3">
                                            {(vehicle.hasAC !== false) && (
                                                <div className="text-[#FACC15] animate-pulse">
                                                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="12" y1="2" x2="12" y2="6"></line>
                                                        <line x1="12" y1="18" x2="12" y2="22"></line>
                                                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                                                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                                                        <line x1="2" y1="12" x2="6" y2="12"></line>
                                                        <line x1="18" y1="12" x2="22" y2="12"></line>
                                                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                                                        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                                                    </svg>
                                                </div>
                                            )}
                                            <span className="text-[40px] font-black text-[#1A1A1A] dark:text-white tracking-tight leading-none">
                                                {convertPrice(vehicle.calculatedTotal).symbol} {convertPrice(vehicle.calculatedTotal).value.toLocaleString()}
                                            </span>
                                        </div>
                                        {/* Secondary currency display */}
                                        {currency === 'LKR' ? (
                                            <div className="flex justify-center gap-4 mt-2">
                                                <div className="text-[14px] font-semibold text-slate-500 dark:text-white/50 tracking-tight">
                                                    ~ $ {(vehicle.calculatedTotal * (rates['USD'] || 0.0032)).toFixed(2)}
                                                </div>
                                                <div className="text-[14px] font-semibold text-slate-500 dark:text-white/50 tracking-tight">
                                                    ~ € {(vehicle.calculatedTotal * (rates['EUR'] || 0.003)).toFixed(2)}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-[14px] font-semibold text-slate-500 dark:text-white/50 mt-1 tracking-tight">
                                                ~ Rs {vehicle.calculatedTotal.toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ───── Vehicle image — now in flow to stay below details ───── */}
                                <div className="w-full flex justify-center items-end py-2 relative z-10 mt-auto min-h-[160px] md:min-h-[200px]">
                                    <img
                                        src={vehicle.image}
                                        alt={vehicle.name}
                                        className={`
                                            w-full h-[200px] md:h-[240px] object-contain
                                            drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)]
                                            transition-transform duration-700
                                            ${isSelected ? 'scale-110' : 'group-hover/card:scale-105'}
                                        `}
                                    />
                                </div>

                            </div>

                            {/* Bottom Accent Bar */}
                            <div className={`h-3 w-full transition-colors duration-500 relative z-30 shrink-0 ${isSelected ? 'bg-[#FACC15]' : 'bg-black dark:bg-[#FACC15]/40'}`}></div>

                            {/* Capacity Stats - Relocated below everything */}
                            <div className="px-5 md:px-8 pb-10 mt-6 relative z-40 shrink-0">
                                <div className="grid grid-cols-3 gap-2 md:gap-3">
                                    {[
                                        { icon: Users, label: 'PAX', value: vehicle.capacity || 4 },
                                        { icon: Briefcase, label: 'BAGS', value: vehicle.suitcases || 2 },
                                        { icon: ShoppingBag, label: 'HAND', value: vehicle.handLuggage || 2 }
                                    ].map((item, i) => (
                                        <div key={i} className={`
                                            bg-white dark:bg-slate-800 border-2 border-black p-3 
                                            flex flex-col items-center justify-center 
                                            transition-all duration-300 
                                            ${isSelected ? 'shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_#FACC15]' : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_#FACC15]'}
                                        `}>
                                            <item.icon size={18} className="text-emerald-900 dark:text-[#FACC15] mb-1" strokeWidth={3} />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{item.label}</span>
                                            <span className="text-lg font-black text-slate-900 dark:text-white leading-none mt-1">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>


                        </div>
                    );
                })}
            </div>

            <VehicleDetailModal
                isOpen={!!detailVehicle}
                vehicle={detailVehicle}
                onClose={() => setDetailVehicle(null)}
                onSelect={onSelect}
            />
        </div>
    );
};

export default VehicleCarousel;
