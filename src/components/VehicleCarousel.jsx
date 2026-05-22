import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Users, Briefcase, ShoppingBag, Wind, Lock, Check, ArrowRight } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const displayName = (name) => (name || '').replace(/\bKDH\s*/gi, '').trim();

const isMiniCar = (vehicle) => {
    const t = (vehicle.vehicleType || '').toLowerCase();
    const n = (vehicle.name || '').toLowerCase();
    return t.includes('mini') || n.includes('mini') || n.includes('wagon');
};

const VehicleCarousel = ({ vehicles, selectedId, onSelect, passengerCount, pickupLocation, dropoffLocation, isCondensed = false, onToggleExpand }) => {
    const scrollRef = useRef(null);
    const { convertPrice, rates, currency } = useCurrency();

    // Custom sorting logic for vehicles
    const sortedVehicles = [...vehicles].sort((a, b) => {
        const getPriority = (type) => {
            const t = type?.toLowerCase() || '';
            if (t.includes('mini-car') || t.includes('wagon')) return 1;
            if (t.includes('sedan')) return 2;
            if (t.includes('vezel') || t.includes('vessel')) return 3;
            if (t.includes('suv')) return 4;
            if (t.includes('mini-van-05')) return 5;
            if (t.includes('mini-van')) return 5.5; // Catch other mini-vans
            if (t.includes('kdh-van') || t.includes('flatroof') || t.includes('kdh')) return 6;
            if (t.includes('highroof')) return 7;
            if (t.includes('bus') || t.includes('coach')) return 8;
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
            scrollRef.current.scrollBy({ left: direction === 'left' ? -320 : 320, behavior: 'smooth' });
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

        if (totalPax > vehiclePax) return { suitable: false, reason: 'Too many passengers' };
        if (totalBags > maxBagUnits) return { suitable: false, reason: 'Luggage limit exceeded' };
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
            {/* Open Uber-style list — no outer box wrappers */}
            <div
                ref={scrollRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-1 py-1 pb-4 w-full no-scrollbar scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {displayVehicles.map((vehicle) => {
                    const { suitable, reason } = isSuitable(vehicle);
                    const isSelected = selectedId === vehicle.vehicleType;
                    const mini = isMiniCar(vehicle);

                    return (
                        <div
                            key={vehicle._id || vehicle.vehicleType}
                            onClick={() => suitable && onSelect(vehicle.vehicleType)}
                            className={`
                                relative flex-shrink-0 w-[72vw] sm:w-[260px] md:w-[230px] snap-start
                                cursor-${suitable ? 'pointer' : 'not-allowed'}
                                transition-all duration-300 group/card flex flex-col
                                rounded-[2rem] bg-white dark:bg-zinc-900
                                ${!suitable ? 'opacity-50 grayscale' : ''}
                                ${isSelected
                                    ? 'border-2 border-[#FACC15] bg-[#FACC15]/5 dark:bg-[#FACC15]/10'
                                    : 'border-2 border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10'
                                }
                            `}
                            style={{ contain: 'layout' }}
                        >
                            {!suitable && (
                                <div className="absolute inset-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center rounded-[2rem]">
                                    <div className="w-12 h-12 bg-red-50 dark:bg-red-950/30 rounded-2xl mb-4 flex items-center justify-center border border-red-100 dark:border-red-900/20">
                                        <Lock size={22} className="text-red-500" strokeWidth={2.5} />
                                    </div>
                                    <p className="text-sm font-bold text-emerald-950 dark:text-white uppercase tracking-tight leading-tight">{reason}</p>
                                    <p className="text-[9px] text-red-600 font-bold mt-3 uppercase tracking-[0.2em] bg-red-50 dark:bg-red-950/30 px-4 py-1 rounded-full border border-red-100 dark:border-red-900/20">Select Larger Vehicle</p>
                                </div>
                            )}

                            <div className="p-3 sm:p-4 pb-2 relative flex flex-col items-center flex-1">
                                {/* Vehicle Name */}
                                <h4 className="text-sm font-black text-emerald-950 dark:text-white uppercase tracking-tight mb-0.5 text-center relative z-10">
                                    {displayName(vehicle.name)}
                                </h4>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-2">Premium Class</p>

                                {/* Pricing */}
                                {vehicle.calculatedTotal >= 0 && (
                                    <div className="text-center relative z-10 flex flex-col items-center mb-2">
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-sm font-black text-[#FACC15]">{convertPrice(Number(vehicle.calculatedTotal) || 0).symbol}</span>
                                            <span className="text-3xl font-black text-black dark:text-white tracking-tighter leading-none">
                                                {(Number(convertPrice(Number(vehicle.calculatedTotal) || 0).value) || 0).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                            {['USD', 'EUR', 'LKR'].filter(c => c !== currency).slice(0, 1).map((c) => {
                                                const rate = rates[c] || 1;
                                                const symbol = c === 'USD' ? '$' : c === 'EUR' ? '€' : 'Rs';
                                                return (
                                                    <span key={c} className="text-slate-400">
                                                        {symbol} {(vehicle.calculatedTotal * rate).toLocaleString(undefined, { minimumFractionDigits: c === 'LKR' ? 0 : 2, maximumFractionDigits: c === 'LKR' ? 0 : 2 })}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Vehicle Image — Wagon R (mini-car) stays bigger */}
                                <div className={`w-full flex justify-center items-center relative z-10 mt-auto ${mini ? 'min-h-[120px] sm:min-h-[140px] py-1' : 'min-h-[90px] sm:min-h-[110px] py-1'}`}>
                                    <img
                                        src={vehicle.image}
                                        alt={vehicle.name}
                                        className={`
                                            object-contain transition-transform duration-500
                                            ${mini
                                                ? `w-[95%] h-[110px] sm:h-[130px] ${isSelected ? 'scale-[1.35] sm:scale-[1.45]' : 'scale-[1.25] sm:scale-[1.3] group-hover/card:scale-[1.35]'}`
                                                : (vehicle.vehicleType === 'sedan' || (vehicle.name || '').toLowerCase().includes('sedan'))
                                                    ? `w-[90%] h-[80px] sm:h-[95px] ${isSelected ? 'scale-[1.5] sm:scale-[1.6]' : 'scale-[1.4] sm:scale-[1.45] group-hover/card:scale-[1.5]'}`
                                                    : `w-[88%] h-[75px] sm:h-[90px] ${isSelected ? 'scale-[1.35] sm:scale-[1.45]' : 'scale-[1.15] sm:scale-[1.25] group-hover/card:scale-[1.25]'}`
                                            }
                                        `}
                                    />
                                </div>
                            </div>

                            {/* Specs & CTA */}
                            <div className="px-3 sm:px-4 pb-4 mt-1 relative z-10 shrink-0">
                                <div className="grid grid-cols-4 gap-1">
                                    {[
                                        { icon: Users, label: 'PAX', value: vehicle.capacity || 4 },
                                        { icon: Briefcase, label: 'LUG', value: vehicle.suitcases || 2 },
                                        { icon: ShoppingBag, label: 'HAND', value: vehicle.handLuggage || 2 },
                                        { icon: Wind, label: 'AC', value: 'ON' }
                                    ].map((item, i) => (
                                        <div key={i} className={`
                                            rounded-xl p-2 flex flex-col items-center justify-center border transition-all duration-300
                                            ${isSelected
                                                ? 'bg-[#FACC15] text-black border-[#FACC15] shadow'
                                                : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 group-hover/card:border-slate-200 dark:group-hover/card:border-white/20'
                                            }
                                        `}>
                                            <item.icon size={11} className={`${isSelected ? 'text-black' : 'text-slate-400'} mb-0.5`} strokeWidth={3} />
                                            <span className={`text-[9px] font-black leading-none ${isSelected ? 'text-black' : 'text-black dark:text-white'}`}>{item.value}</span>
                                            <span className={`text-[6px] font-bold uppercase tracking-widest leading-none mt-0.5 ${isSelected ? 'text-black/60' : 'text-slate-400'}`}>{item.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={(e) => { e.stopPropagation(); suitable && onSelect(vehicle.vehicleType); }}
                                    className={`w-full mt-2 py-3 text-center rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border
                                        ${isSelected
                                            ? 'bg-[#FACC15] text-black border-[#FACC15] shadow-md'
                                            : 'bg-white dark:bg-zinc-900 text-black dark:text-white border-slate-200 dark:border-white/10 hover:bg-[#FACC15] hover:text-black hover:border-[#FACC15] hover:shadow-md'
                                        }`}
                                >
                                    {isSelected ? 'SELECTED ✓' : 'SELECT'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Carousel Nav Buttons */}
            <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 justify-between pointer-events-none px-1">
                <button
                    onClick={() => scroll('left')}
                    className="w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md border border-slate-200 dark:border-white/10 flex items-center justify-center text-emerald-950 dark:text-white shadow pointer-events-auto hover:bg-[#FACC15] hover:text-black transition-all active:scale-95"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={() => scroll('right')}
                    className="w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md border border-slate-200 dark:border-white/10 flex items-center justify-center text-emerald-950 dark:text-white shadow pointer-events-auto hover:bg-[#FACC15] hover:text-black transition-all active:scale-95"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default VehicleCarousel;
