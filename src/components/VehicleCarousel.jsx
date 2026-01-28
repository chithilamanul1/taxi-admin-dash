import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Users, Briefcase, Info, Lock, Wind, Backpack } from 'lucide-react';
import VehicleDetailModal from './VehicleDetailModal';

const VehicleCarousel = ({ vehicles, selectedId, onSelect, passengerCount }) => {
    const scrollRef = useRef(null);
    const [detailVehicle, setDetailVehicle] = useState(null);

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
            <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                    Select Vehicle
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                        {vehicles.length} Options
                    </span>
                </h3>
                <div className="flex gap-2">
                    <button onClick={() => scroll('left')} className="p-2 rounded-full border border-emerald-900/10 hover:bg-emerald-50 text-emerald-900 transition-colors">
                        <ChevronLeft size={16} />
                    </button>
                    <button onClick={() => scroll('right')} className="p-2 rounded-full border border-emerald-900/10 hover:bg-emerald-50 text-emerald-900 transition-colors">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-6 px-4 snap-x snap-mandatory scrollbar-hide w-full"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {vehicles.map((vehicle) => {
                    const { suitable, reason } = isSuitable(vehicle);
                    const isSelected = selectedId === vehicle.vehicleType;

                    return (
                        <div
                            key={vehicle._id || vehicle.vehicleType}
                            className={`
                                relative flex-shrink-0 w-[300px] snap-center rounded-2xl border-2 transition-all duration-300
                                ${isSelected ? 'border-emerald-600 bg-emerald-600/5 shadow-xl ring-2 ring-emerald-600/20' : 'border-slate-100 dark:border-white/10 bg-white dark:bg-white/[0.03] shadow-sm hover:border-emerald-200 dark:hover:border-emerald-500/30'}
                                ${!suitable ? 'opacity-70 grayscale-[0.5]' : 'cursor-pointer'}
                            `}
                            onClick={() => suitable && onSelect(vehicle.vehicleType)}
                        >
                            {!suitable && (
                                <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] rounded-2xl flex flex-col items-center justify-center p-4 text-center">
                                    <div className="bg-red-50 p-3 rounded-full mb-2">
                                        <Lock size={20} className="text-red-500" />
                                    </div>
                                    <p className="text-xs font-bold text-red-600 uppercase tracking-widest">{reason}</p>
                                    <p className="text-[10px] text-red-400 font-medium mt-1">Upgrade vehicle</p>
                                </div>
                            )}

                            <div className="h-40 w-full p-4 bg-slate-50/50 rounded-t-2xl relative flex items-center justify-center">
                                <img
                                    src={vehicle.image}
                                    alt={vehicle.name}
                                    className="w-full h-full object-contain mix-blend-multiply"
                                />
                                <button
                                    onClick={(e) => { e.stopPropagation(); setDetailVehicle(vehicle); }}
                                    className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-sm text-emerald-900/40 hover:text-emerald-600 hover:scale-110 transition-all z-20"
                                >
                                    <Info size={16} />
                                </button>
                            </div>

                            <div className="p-5">
                                <div className="flex justify-between items-start mb-4 h-12">
                                    <h4 className="font-black text-emerald-900 dark:text-white uppercase text-sm tracking-wide leading-tight">
                                        {vehicle.name.split('(').map((part, i) => (
                                            <span key={i} className={i > 0 ? "block text-xs opacity-70 mt-0.5 normal-case" : "block"}>
                                                {i > 0 ? `(${part}` : part}
                                            </span>
                                        ))}
                                    </h4>
                                    {suitable && <div className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 dark:border-slate-600'}`}>
                                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                    </div>}
                                </div>

                                {/* Vehicle Specs Grid */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-400">
                                        <Users size={14} className="text-emerald-600 shrink-0" />
                                        <span>{vehicle.minCapacity || 1} - {vehicle.capacity} Passengers</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-400">
                                        <Briefcase size={14} className="text-emerald-600 shrink-0" />
                                        <span>{vehicle.luggage || 0} Luggages</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-400">
                                        <Backpack size={14} className="text-emerald-600 shrink-0" />
                                        <span>{vehicle.handLuggage || 0} Hand Baggages</span>
                                    </div>
                                    {vehicle.hasAC !== false && (
                                        <div className="flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-400">
                                            <Wind size={14} className="text-emerald-600 shrink-0" />
                                            <span>Air Conditioning</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-end border-t border-slate-100 dark:border-slate-700 pt-3">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Rate / Km</p>
                                        <p className="text-lg font-black text-emerald-900 dark:text-emerald-400">LKR {vehicle.perKmRate}</p>
                                    </div>
                                    <div className={`
                                        text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider
                                        ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}
                                    `}>
                                        {isSelected ? '✓ Selected' : 'Select'}
                                    </div>
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
            />
        </div>
    );
};

export default VehicleCarousel;
