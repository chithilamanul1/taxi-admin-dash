import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Users, Briefcase, ShoppingBag, Info, Lock, Wind, Backpack, Check, ArrowRight, Car } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const displayName = (name) => (name || '').replace(/\bKDH\s*/gi, '').trim();

const VehicleCarousel = ({ vehicles, selectedId, onSelect, passengerCount, pickupLocation, dropoffLocation, isCondensed = false, onToggleExpand }) => {
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
        const pax = passengerCount || { adults: 1, children: 0, luggage: 0 };
        const totalPax = (pax.adults || 0) + (pax.children || 0);
        const totalBags = pax.bags || pax.luggage || 0;

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
                className="relative bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-3 sm:p-4 flex items-center gap-3 sm:gap-6 animate-slide-up group/condensed shadow-sm cursor-pointer hover:shadow-md transition-all overflow-hidden"
                onClick={onToggleExpand}
            >
                <div className="w-16 sm:w-28 h-12 sm:h-20 bg-slate-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center p-1.5 sm:p-2 shrink-0 overflow-hidden border border-slate-100 dark:border-white/5">
                    <img 
                        src={vehicle.image} 
                        alt={vehicle.name} 
                        className="w-full h-full object-contain scale-110 group-hover/condensed:scale-125 transition-transform duration-500"
                    />
                </div>
                <div className="flex-1 min-w-0 pr-2">
                    <h4 className="text-[10px] sm:text-xs md:text-sm font-black text-emerald-950 dark:text-white uppercase tracking-widest truncate">{displayName(vehicle.name)}</h4>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 sm:mt-1.5">
                        {[
                            { icon: Users, val: vehicle.capacity || 4 },
                            { icon: Briefcase, val: vehicle.suitcases || 2 },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                                <item.icon size={10} className="text-emerald-600 shrink-0" />
                                <span className="text-[9px] sm:text-[10px] font-bold">{item.val}</span>
                            </div>
                        ))}
                        <div className="h-3 w-[1px] bg-slate-200 dark:bg-white/10 mx-0.5 hidden sm:block"></div>
                        <span className="text-[9px] font-black text-[#FACC15] uppercase tracking-widest truncate">
                            Selected
                        </span>
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <p className="text-[7px] sm:text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Fare</p>
                    <p className="text-base sm:text-lg font-black text-emerald-950 dark:text-white leading-none">
                        {convertPrice(Number(vehicle.calculatedTotal) || 0).symbol}
                        <span className="ml-0.5">{convertPrice(Number(vehicle.calculatedTotal) || 0).value.toLocaleString()}</span>
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
                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-white dark:bg-zinc-900 rounded-2xl p-4 rounded-2xl border border-slate-100 dark:border-white/5 w-fit shadow-sm">
                            <span className="truncate max-w-[120px] sm:max-w-xs">{pickupLocation.split(',')[0]}</span>
                            <div className="flex items-center justify-center w-6 h-6 bg-emerald-600 rounded-full">
                                <ArrowRight size={12} className="text-white" strokeWidth={3} />
                            </div>
                            <span className="truncate max-w-[120px] sm:max-w-xs">{dropoffLocation.split(',')[0]}</span>
                        </div>
                    )}

                    <h3 className="text-2xl md:text-3xl font-black text-emerald-950 dark:text-white flex flex-wrap items-center gap-4 uppercase tracking-tight">
                        Vehicle Options
                        <span className="text-[10px] bg-emerald-600 text-white px-5 py-1.5 rounded-full tracking-[0.2em] font-bold shadow-lg">
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
                                    ? 'border border-slate-100 dark:border-white/10 bg-[#FACC15]/5 shadow-2xl shadow-slate-200/50 dark:shadow-none -translate-y-2' 
                                    : 'border border-slate-100 dark:border-white/10 hover:-translate-y-2 hover:shadow-2xl hover:border-slate-200 dark:border-white/10/20'}
                                ${!suitable ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer'}
                                bg-white dark:bg-zinc-900 rounded-[2.5rem]
                                overflow-hidden h-full
                            `}
                            onClick={() => suitable && onSelect(vehicle.vehicleType)}
                        >
                            {!suitable && (
                                <div className="absolute inset-0 z-30 bg-white dark:bg-zinc-900 rounded-[2.5rem]/60 dark:bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-8 text-center">
                                    <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-2xl mb-6 flex items-center justify-center border border-red-100 dark:border-red-900/20">
                                        <Lock size={28} className="text-red-500" strokeWidth={2.5} />
                                    </div>
                                    <p className="text-xl font-bold text-emerald-950 dark:text-white uppercase tracking-tight leading-tight">{reason}</p>
                                    <p className="text-[10px] text-red-600 font-bold mt-4 uppercase tracking-[0.2em] bg-red-50 dark:bg-red-950/30 px-6 py-2 rounded-full border border-red-100 dark:border-red-900/20">Select Larger Vehicle</p>
                                </div>
                            )}

                            <div className="p-4 sm:p-6 pb-2 relative flex flex-col items-center flex-1 h-full">
                                <h4 className="text-lg sm:text-xl font-bold text-emerald-950 dark:text-white uppercase tracking-tight mb-1 text-center relative z-10">
                                    {displayName(vehicle.name)}
                                </h4>
                                <p className="text-[9px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.2em] mb-2 sm:mb-4">Premium Class</p>

                                {vehicle.calculatedTotal >= 0 && (
                                    <div className="text-center relative z-10 flex flex-col items-center mb-4">
                                        <div className="flex items-baseline justify-center gap-1 sm:gap-2">
                                            <span className="text-xl font-black text-[#FACC15]">{convertPrice(Number(vehicle.calculatedTotal) || 0).symbol}</span>
                                            <span className="text-5xl font-black text-black dark:text-white tracking-tighter leading-none">
                                                {(Number(convertPrice(Number(vehicle.calculatedTotal) || 0).value) || 0).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-3 text-[11px] font-black !text-black dark:!text-white uppercase tracking-widest">
                                            {['USD', 'EUR', 'GBP', 'LKR'].filter(c => c !== currency).slice(0, 2).map((c, i) => {
                                                const rate = rates[c] || 1;
                                                const symbol = c === 'USD' ? '$' : c === 'EUR' ? '€' : c === 'GBP' ? '£' : 'Rs';
                                                return (
                                                    <React.Fragment key={c}>
                                                        {i > 0 && <span className="opacity-20">•</span>}
                                                        <span className="!text-black dark:!text-white">
                                                            {symbol} {(vehicle.calculatedTotal * rate).toLocaleString(undefined, { minimumFractionDigits: (c === 'LKR' ? 0 : 2), maximumFractionDigits: (c === 'LKR' ? 0 : 2) })}
                                                        </span>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                <div className="w-full flex justify-center items-center py-2 relative z-10 mt-auto min-h-[100px] sm:min-h-[140px]">
                                    <img
                                        src={vehicle.image}
                                        alt={vehicle.name}
                                        className={`
                                            w-[95%] sm:w-[90%] h-[120px] sm:h-[160px] object-contain
                                            transition-transform duration-700
                                            ${isSelected ? 'scale-[1.25] sm:scale-[1.3]' : 'scale-110 group-hover/card:scale-[1.2]'}
                                        `}
                                    />
                                </div>
                            </div>

                            <div className="px-4 sm:px-6 pb-6 mt-2 relative z-40 shrink-0">
                                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                                    {[
                                        { icon: Users, label: 'PAX', value: vehicle.capacity || 4 },
                                        { icon: Briefcase, label: 'LUG', value: vehicle.suitcases || 2 },
                                        { icon: ShoppingBag, label: 'HAND', value: vehicle.handLuggage || 2 },
                                        { icon: Wind, label: 'AC', value: 'ON' }
                                    ].map((item, i) => (
                                        <div key={i} className={`
                                            bg-slate-50 dark:bg-white dark:bg-zinc-900 rounded-2xl rounded-2xl p-3 
                                            flex flex-col items-center justify-center 
                                            transition-all duration-300 border border-slate-100 dark:border-white/5
                                            ${isSelected ? 'bg-[#FACC15] text-black border-slate-200 dark:border-white/10 shadow-lg' : 'group-hover/card:border-slate-200 dark:border-white/10/10'}
                                        `}>
                                            <item.icon size={14} className={`${isSelected ? 'text-black' : 'text-slate-400'} mb-1`} strokeWidth={3} />
                                            <span className={`text-[10px] font-black leading-none mt-1 ${isSelected ? 'text-black' : 'text-black dark:text-white'}`}>{item.value}</span>
                                            <span className={`text-[7px] font-bold uppercase tracking-widest leading-none mt-1 ${isSelected ? 'text-black/60' : 'text-slate-400'}`}>{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="relative group/help">
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#FACC15] text-black text-[9px] font-black px-4 py-2 rounded-xl border border-slate-100 dark:border-white/10 shadow-lg whitespace-nowrap opacity-0 group-hover/card:opacity-100 transition-all transform translate-y-2 group-hover/card:translate-y-0 z-50">
                                        NEED HELP?
                                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#FACC15] border-r-2 border-b-2 border-slate-200 dark:border-white/10 rotate-45"></div>
                                    </div>
                                    <div className={`w-full py-5 text-center rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all border border-slate-100 dark:border-white/10
                                        ${isSelected 
                                            ? 'bg-[#FACC15] text-black border-slate-200 dark:border-white/10 shadow-xl' 
                                            : 'bg-white dark:bg-zinc-900 rounded-[2.5rem] dark:bg-zinc-800 text-black dark:text-white border-slate-200 dark:border-white/10 hover:bg-[#FACC15] hover:text-black hover:shadow-xl'}`}
                                    >
                                        {isSelected ? 'SELECTED ✓' : 'SELECT RIDE'}
                                    </div>
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
