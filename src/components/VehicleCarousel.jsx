import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Users, Briefcase, Info, Lock, Wind, Backpack, Check, ArrowRight, Car } from 'lucide-react';
import VehicleDetailModal from './VehicleDetailModal';
import { useCurrency } from '../context/CurrencyContext';const VehicleCarousel = ({ vehicles, selectedId, onSelect, passengerCount }) => {
    const scrollRef = useRef(null);
    const [detailVehicle, setDetailVehicle] = useState(null);
    const { convertPrice, rates } = useCurrency();

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
        // Infants usually free/lap, but let's count 0.
        // Luggage logic:
        const totalBags = passengerCount.bags || 0;

        const vehiclePax = vehicle.capacity || 4;
        const vehicleLargeBags = vehicle.luggage || 0;
        const vehicleSmallBags = vehicle.handLuggage || 0;

        // Effective Luggage Capacity:
        // Assume 1 empty seat = 2 large bags worth of space?
        // Or strictly strictly stick to guidelines? 
        // User "Think usage practical".
        // Let's be lenient:
        const spareSeats = Math.max(0, vehiclePax - totalPax);
        const extraBagCapacity = spareSeats * 2;

        // Combined 'Bag Units' capacity. Let's say Large = 1 unit, Small = 0.5 unit.
        // User input 'bags' are undefined size. Assume Large (1 unit).
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
                    <h3 className="text-xl md:text-2xl font-black text-black dark:text-white flex flex-wrap items-center gap-3 md:gap-4 uppercase italic tracking-tighter">
                        VEHICLE OPTIONS
                        <span className="text-[9px] md:text-[10px] bg-black dark:bg-yellow-400 text-yellow-400 dark:text-black px-3 md:px-4 py-1 rounded-full not-italic tracking-[0.2em] font-black">
                            {vehicles.length} MODELS
                        </span>
                    </h3>
                </div>
                <div className="flex gap-3 md:gap-4 self-end md:self-auto">
                    <button
                        onClick={() => scroll('left')}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-none bg-black dark:bg-[#FACC15] text-[#FACC15] dark:text-black flex items-center justify-center hover:translate-y-[-4px] transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] border-4 border-black"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={24} strokeWidth={4} className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-none bg-black dark:bg-[#FACC15] text-[#FACC15] dark:text-black flex items-center justify-center hover:translate-y-[-4px] transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] border-4 border-black"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={24} strokeWidth={4} className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-8 overflow-x-auto pb-12 px-2 snap-x snap-mandatory scrollbar-hide w-full"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {vehicles.map((vehicle, index) => {
                    const { suitable, reason } = isSuitable(vehicle);
                    const isSelected = selectedId === vehicle.vehicleType;
                    const displayIdx = (index + 1).toString().padStart(2, '0');

                    return (
                        <div
                            key={vehicle._id || vehicle.vehicleType}
                            className={`
                                relative flex-shrink-0 w-[300px] md:w-[380px] snap-center transition-all duration-500 overflow-hidden group/card
                                ${isSelected ? 'shadow-[0_20px_50px_rgba(0,0,0,0.1)] -translate-y-2' : 'hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1'}
                                ${!suitable ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer'}
                                bg-white dark:bg-[#1a1a1a]
                            `}
                            onClick={() => suitable && onSelect(vehicle.vehicleType)}
                        >
                            {!suitable && (
                                <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-8 text-center">
                                    <div className="w-16 h-16 bg-red-600 rounded-none mb-6 flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black">
                                        <Lock size={28} className="text-white" strokeWidth={3} />
                                    </div>
                                    <p className="text-xl font-black text-white uppercase italic tracking-tighter leading-tight">{reason}</p>
                                    <p className="text-[10px] text-[#FACC15] font-black mt-4 uppercase tracking-[0.3em] bg-black px-4 py-2 border-2 border-black">SELECT LARGER VEHICLE</p>
                                </div>
                            )}

                            {/* Selection Border Overlay */}
                            {isSelected && (
                                <div className="absolute inset-0 border-[6px] border-[#FACC15] z-10 pointer-events-none"></div>
                            )}

                            <div className="h-48 md:h-64 w-full p-6 md:p-8 bg-slate-50 dark:bg-black/20 relative flex items-center justify-center overflow-hidden">
                                {/* Background Index - Large Faint Number */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[180px] font-black text-black/[0.03] dark:text-white/[0.02] italic tracking-tighter pointer-events-none select-none italic">
                                    {displayIdx}
                                </div>

                                <img
                                    src={vehicle.image}
                                    alt={vehicle.name}
                                    className="w-auto h-4/5 object-contain drop-shadow-[15px_15px_30px_rgba(0,0,0,0.1)] relative z-10 group-hover/card:scale-110 transition-transform duration-700"
                                />
                                <button
                                    onClick={(e) => { e.stopPropagation(); setDetailVehicle(vehicle); }}
                                    className="absolute top-4 right-4 w-10 h-10 bg-white/80 dark:bg-black/80 backdrop-blur-md text-slate-400 border border-slate-100 dark:border-white/10 rounded-full flex items-center justify-center hover:bg-[#FACC15] hover:text-black transition-all z-20 shadow-sm"
                                    aria-label={`View details for ${vehicle.name}`}
                                >
                                    <Info size={18} strokeWidth={2.5} />
                                </button>
                            </div>

                            <div className="p-8 pb-12 relative flex flex-col items-center">
                                <h4 className="text-2xl font-black text-[#1A1A1A] dark:text-white uppercase tracking-tighter mb-4 text-center">
                                    {displayName(vehicle.name)}
                                </h4>

                                {vehicle.calculatedTotal > 0 && (
                                    <div className="mb-8 text-center">
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
                                                Rs {vehicle.calculatedTotal.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="text-[24px] font-bold text-slate-400 mt-2 tracking-tight">
                                            ~ $ {(() => {
                                                const rate = rates['USD'] || 0.0032;
                                                return (vehicle.calculatedTotal * rate).toFixed(2);
                                            })()}
                                        </div>
                                    </div>
                                )}

                                {/* Capacity Stats - Distinct Boxes */}
                                <div className="grid grid-cols-3 gap-4 w-full mb-2">
                                    {[
                                        { icon: Users, label: 'PAX', value: vehicle.capacity || 4 },
                                        { icon: Briefcase, label: 'BAGS', value: vehicle.luggage || 0 },
                                        { icon: Backpack, label: 'HAND', value: vehicle.handLuggage || 0 }
                                    ].map((spec, i) => (
                                        <div key={i} className="flex flex-col items-center p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 shadow-sm group-hover/card:shadow-md transition-shadow">
                                            <spec.icon size={24} className="text-slate-400 mb-2" strokeWidth={1.5} />
                                            <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] mb-1">{spec.label}</span>
                                            <span className="text-2xl font-black text-[#1A1A1A] dark:text-white">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom Accent Bar */}
                            <div className={`h-3 w-full transition-colors duration-500 ${isSelected ? 'bg-black dark:bg-[#FACC15]' : 'bg-[#FACC15]'}`}></div>
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
