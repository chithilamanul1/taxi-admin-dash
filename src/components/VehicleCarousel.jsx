import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Users, Briefcase, ShoppingBag, Info, Lock, Wind, Backpack, Check, ArrowRight, Car } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const displayName = (name) => (name || '').replace(/\bKDH\s*/gi, '').trim();

const VehicleCarousel = ({ vehicles, selectedId, onSelect, passengerCount, pickupLocation, dropoffLocation, isCondensed = false }) => {
    const scrollRef = useRef(null);
    const { convertPrice, rates, currency } = useCurrency();

    // Custom sorting logic for vehicles
    const sortedVehicles = [...vehicles].sort((a, b) => {
        const getPriority = (type) => {
            const t = type?.toLowerCase() || '';
            if (t.includes('mini')) return 1;
            if (t.includes('sedan')) return 2;
            if (t.includes('suv')) return 3;
            if (t.includes('vezel')) return 4;
            if (t.includes('van')) return 5;
            return 10;
        };
        return getPriority(a.vehicleType) - getPriority(b.vehicleType);
    });

    const displayVehicles = isCondensed && selectedId 
        ? sortedVehicles.filter(v => v.vehicleType === selectedId)
        : sortedVehicles;

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

    if (isCondensed && selectedId) {
        const vehicle = displayVehicles[0];
        if (!vehicle) return null;

        return (
            <div 
                className="relative bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 p-4 rounded-2xl flex items-center gap-4 sm:gap-6 animate-slide-up group/condensed shadow-sm cursor-pointer hover:shadow-md transition-all"
                onClick={() => onSelect(null)}
            >
                <div className="w-20 sm:w-28 h-16 sm:h-20 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center p-2 shrink-0 overflow-hidden border border-slate-100 dark:border-white/5">
                    <img 
                        src={vehicle.image} 
                        alt={vehicle.name} 
                        className="w-full h-full object-contain scale-110 group-hover/condensed:scale-125 transition-transform duration-500"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-[10px] sm:text-xs md:text-sm font-bold text-emerald-950 dark:text-white uppercase tracking-widest truncate">{displayName(vehicle.name)}</h4>
                    <div className="flex items-center gap-3 mt-1.5">
                        {[
                            { icon: Users, val: vehicle.capacity || 4 },
                            { icon: Briefcase, val: vehicle.suitcases || 2 },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                <item.icon size={12} className="text-emerald-600" />
                                <span className="text-[10px] font-bold">{item.val}</span>
                            </div>
                        ))}
                        <div className="h-3 w-[1px] bg-slate-200 dark:bg-white/10 mx-1"></div>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest truncate">
                            Selected
                        </span>
                    </div>
                </div>
                <div className="text-right shrink-0 pr-2">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Fare</p>
                    <p className="text-lg font-black text-emerald-950 dark:text-white leading-none">
                        {convertPrice(vehicle.calculatedTotal).symbol}{convertPrice(vehicle.calculatedTotal).value.toLocaleString()}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative group/carousel">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8 md:mb-12 px-2 lg:px-0">
                <div className="flex flex-col gap-4">
                    {pickupLocation && dropoffLocation && (
                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 w-fit shadow-sm">
                            <span className="truncate max-w-[120px] sm:max-w-xs">{pickupLocation.split(',')[0]}</span>
                            <div className="flex items-center justify-center w-6 h-6 bg-emerald-600 rounded-full">
                                <ArrowRight size={12} className="text-white" strokeWidth={3} />
                            </div>
                            <span className="truncate max-w-[120px] sm:max-w-xs">{dropoffLocation.split(',')[0]}</span>
                        </div>
                    )}

                    <h3 className="text-2xl md:text-3xl font-black text-emerald-950 dark:text-white flex flex-wrap items-center gap-4 uppercase tracking-tight">
                        Vehicle Options
                        <span className="text-[10px] bg-emerald-600 text-white px-5 py-1.5 rounded-full tracking-[0.2em] font-bold shadow-lg shadow-emerald-200 dark:shadow-none">
                            {displayVehicles.length} Units Available
                        </span>
                    </h3>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8 px-2 w-full"
            >
                {displayVehicles.map((vehicle, index) => {
                    const { suitable, reason } = isSuitable(vehicle);
                    const isSelected = selectedId === vehicle.vehicleType;

                    return (
                        <div
                            key={vehicle._id || vehicle.vehicleType}
                            className={`
                                relative flex-shrink-0 w-full snap-start transition-all duration-500 group/card flex flex-col
                                ${isSelected 
                                    ? 'ring-4 ring-emerald-600/20 border-emerald-600 bg-emerald-50/30 dark:bg-emerald-500/5 -translate-y-2' 
                                    : 'border-slate-200 dark:border-white/10 hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-200'}
                                ${!suitable ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer'}
                                bg-white dark:bg-zinc-800 rounded-[2.5rem] border
                                overflow-hidden h-full shadow-sm
                            `}
                            onClick={() => suitable && onSelect(vehicle.vehicleType)}
                        >
                            {!suitable && (
                                <div className="absolute inset-0 z-30 bg-white/60 dark:bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-8 text-center">
                                    <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-2xl mb-6 flex items-center justify-center border border-red-100 dark:border-red-900/20">
                                        <Lock size={28} className="text-red-500" strokeWidth={2.5} />
                                    </div>
                                    <p className="text-xl font-bold text-emerald-950 dark:text-white uppercase tracking-tight leading-tight">{reason}</p>
                                    <p className="text-[10px] text-red-600 font-bold mt-4 uppercase tracking-[0.2em] bg-red-50 dark:bg-red-950/30 px-6 py-2 rounded-full border border-red-100 dark:border-red-900/20">Select Larger Vehicle</p>
                                </div>
                            )}

                            <div className="p-8 pb-4 relative flex flex-col items-center flex-1 h-full">
                                <h4 className="text-xl font-bold text-emerald-950 dark:text-white uppercase tracking-tight mb-2 text-center relative z-10">
                                    {displayName(vehicle.name)}
                                </h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Premium Class</p>

                                {vehicle.calculatedTotal >= 0 && (
                                    <div className="text-center relative z-10 flex flex-col items-center mb-8">
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-sm font-bold text-emerald-600 mb-1">{convertPrice(vehicle.calculatedTotal).symbol}</span>
                                            <span className="text-4xl font-black text-emerald-950 dark:text-white tracking-tight leading-none">
                                                {convertPrice(vehicle.calculatedTotal).value.toLocaleString()}
                                            </span>
                                        </div>
                                        {!(passengerCount.distance > 0) && (
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Starting Estimate</p>
                                        )}
                                    </div>
                                )}

                                <div className="w-full flex justify-center items-center py-4 relative z-10 mt-auto min-h-[160px]">
                                    <img
                                        src={vehicle.image}
                                        alt={vehicle.name}
                                        className={`
                                            w-full h-[180px] object-contain
                                            transition-transform duration-700
                                            ${isSelected ? 'scale-110' : 'group-hover/card:scale-105'}
                                            ${vehicle.vehicleType?.toLowerCase().includes('sedan') || vehicle.vehicleType?.toLowerCase().includes('car') ? 'scale-[1.2]' : ''}
                                        `}
                                    />
                                </div>
                            </div>

                            <div className="px-8 pb-10 mt-4 relative z-40 shrink-0">
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { icon: Users, label: 'PAX', value: vehicle.capacity || 4 },
                                        { icon: Briefcase, label: 'BAGS', value: vehicle.suitcases || 2 },
                                        { icon: ShoppingBag, label: 'HAND', value: vehicle.handLuggage || 2 }
                                    ].map((item, i) => (
                                        <div key={i} className={`
                                            bg-slate-50 dark:bg-white/5 rounded-2xl p-4 
                                            flex flex-col items-center justify-center 
                                            transition-all duration-300 border border-slate-100 dark:border-white/5
                                            ${isSelected ? 'bg-emerald-600 text-white border-transparent shadow-lg shadow-emerald-200' : 'group-hover/card:border-emerald-100'}
                                        `}>
                                            <item.icon size={16} className={`${isSelected ? 'text-white' : 'text-emerald-600'} mb-1.5`} strokeWidth={2.5} />
                                            <span className={`text-[9px] font-bold uppercase tracking-widest leading-none ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>{item.label}</span>
                                            <span className={`text-lg font-black leading-none mt-1.5 ${isSelected ? 'text-white' : 'text-emerald-950 dark:text-white'}`}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className={`mt-6 w-full py-4 text-center rounded-2xl font-bold text-sm uppercase tracking-widest transition-all
                                    ${isSelected 
                                        ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200' 
                                        : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-lg'}`}
                                >
                                    {isSelected ? 'Selected ✓' : 'Select Ride'}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VehicleCarousel;
