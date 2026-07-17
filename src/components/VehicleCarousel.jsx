import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Users, Briefcase, ShoppingBag, Wind, Lock, Check, ArrowRight } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const displayName = (name) => (name || '')
    .replace(/\s*\(.*?\)/g, '')
    .replace(/\bKDH\s*/gi, '')
    .trim();

// Auto-serve WebP if available (vehicles/ directory has WebP versions)
const toWebpSrc = (src) => {
    if (!src) return src;
    if (src.startsWith('/vehicles/') && (src.endsWith('.png') || src.endsWith('.jpg'))) {
        return src.replace(/\.(png|jpg)$/, '.webp');
    }
    return src;
};

const isMiniCar = (vehicle) => {
    const t = (vehicle.vehicleType || '').toLowerCase();
    const n = (vehicle.name || '').toLowerCase();
    return t.includes('mini') || n.includes('mini') || n.includes('wagon');
};

// Calculate normalized scale and translation to visual alignment (wheels aligned to baseline, equal size)
const getVehicleTransform = (imagePath, isSelected, isHovered = false, h_target = 0.58, b_target = 0.12) => {
    const baseFilename = (imagePath || '').split('/').pop().split('?')[0].toLowerCase().replace(/\.(png|jpg|webp)$/, '');

    // Bounding box data for transparency correction
    const imgData = {
        'coach-bus': { h_orig: 0.7772, c_prime_orig: 1 - 183.5 / 359 },
        'costerbus': { h_orig: 0.6373, c_prime_orig: 1 - 216.5 / 408 },
        'hondavezel': { h_orig: 0.6889, c_prime_orig: 1 - 216.0 / 360 },
        'suv': { h_orig: 0.6889, c_prime_orig: 0.43 },
        'minicar': { h_orig: 0.5220, c_prime_orig: 1 - 251.0 / 500 },
        'minivan5seat': { h_orig: 0.4642, c_prime_orig: 1 - 227.5 / 433 },
        'sedan': { h_orig: 0.3040, c_prime_orig: 0.4934 },
        'sedan2': { h_orig: 0.4300, c_prime_orig: 0.4801 },
        'sedancar': { h_orig: 0.4668, c_prime_orig: 0.5310 },
        'sedancar2': { h_orig: 0.4300, c_prime_orig: 0.4801 },
        'susukievery': { h_orig: 0.5543, c_prime_orig: 1 - 228.5 / 433 },
        'toyota-highroof': { h_orig: 0.65, c_prime_orig: 1 - 227.5 / 433 },
        'van': { h_orig: 0.5497, c_prime_orig: 1 - 227.5 / 433 },
    }[baseFilename] || { h_orig: 0.55, c_prime_orig: 0.5 }; // Default fallback

    // Base scale to make bbox height exactly h_target
    let scale = h_target / imgData.h_orig;

    if (isSelected) {
        scale *= 1.15; // Selected zoom
    } else if (isHovered) {
        scale *= 1.08; // Hover zoom
    }

    // Centering and baseline calculations
    const c_prime_scaled = 0.5 + scale * (imgData.c_prime_orig - 0.5);
    const b_scaled = c_prime_scaled - (scale * imgData.h_orig) / 2;
    const shift_up = b_target - b_scaled;
    const translateY = -shift_up * 100;

    return { scale, translateY };
};

const VehicleCarousel = ({ vehicles, selectedId, onSelect, passengerCount, pickupLocation, dropoffLocation, isCondensed = false, onToggleExpand }) => {
    const scrollRef = useRef(null);
    const cardRefs = useRef({});
    const [dismissedWarnings, setDismissedWarnings] = useState([]);
    const [hoveredId, setHoveredId] = useState(null);
    const [condensedHovered, setCondensedHovered] = useState(false);
    const { convertPrice, rates, currency, SUPPORTED_CURRENCIES } = useCurrency();

    const convertToAllCurrencies = (amountLKR) => {
        return SUPPORTED_CURRENCIES.map(c => {
            if (c.code === 'LKR') return { ...c, value: Math.round(amountLKR) };
            let rate = rates?.[c.code];
            if (!rate) {
                const staticRates = { 'USD': 0.0032, 'EUR': 0.003, 'GBP': 0.0026, 'INR': 0.27 };
                rate = staticRates[c.code] || 1;
            }
            return { ...c, value: Number((amountLKR * rate).toFixed(2)) };
        });
    };

    useEffect(() => {
        if (selectedId && cardRefs.current[selectedId]) {
            cardRefs.current[selectedId].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [selectedId]);

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

        const { scale: condScale, translateY: condTranslateY } = getVehicleTransform(
            vehicle.image,
            false,
            condensedHovered,
            0.65,
            0.12
        );

        return (
            <div
                className="relative bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-3 sm:p-4 flex items-center gap-3 sm:gap-6 animate-slide-up group/condensed shadow-sm cursor-pointer hover:shadow-md transition-all overflow-hidden"
                onClick={onToggleExpand}
                onMouseEnter={() => setCondensedHovered(true)}
                onMouseLeave={() => setCondensedHovered(false)}
            >
                <div className="w-16 sm:w-28 h-12 sm:h-20 bg-slate-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center p-1.5 sm:p-2 shrink-0 overflow-hidden border border-slate-100 dark:border-white/5">
                    <img
                        src={toWebpSrc(vehicle.image)}
                        alt={vehicle.name}
                        className="w-full h-full object-contain transition-transform duration-500"
                        style={{
                            transform: `scale(${condScale}) translateY(${condTranslateY}%)`
                        }}
                    />
                </div>
                <div className="flex-1 min-w-0 pr-2">
                    <h4 className="text-[10px] sm:text-xs md:text-sm font-black text-emerald-950 dark:text-white uppercase tracking-widest truncate">{displayName(vehicle.name)}</h4>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 sm:mt-1.5">
                        {[
                            { icon: Users, val: vehicle.capacity || 4 },
                            { icon: Briefcase, val: vehicle.luggage || vehicle.suitcases || 2 },
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
                    const isHovered = hoveredId === vehicle.vehicleType;
                    const { scale, translateY } = getVehicleTransform(
                        vehicle.image,
                        isSelected,
                        isHovered,
                        0.72,
                        0.12
                    );

                    return (
                        <div
                            ref={(el) => (cardRefs.current[vehicle.vehicleType] = el)}
                            key={vehicle._id || vehicle.vehicleType}
                            onClick={() => suitable && onSelect(vehicle.vehicleType)}
                            onMouseEnter={() => suitable && setHoveredId(vehicle.vehicleType)}
                            onMouseLeave={() => setHoveredId(null)}
                            className={`
                                relative flex-shrink-0 w-[72vw] sm:w-[260px] md:w-[230px] snap-start
                                cursor-${suitable ? 'pointer' : 'not-allowed'}
                                transition-all duration-300 group/card flex flex-col
                                rounded-[2rem] bg-white dark:bg-zinc-900 overflow-hidden
                                ${!suitable ? 'opacity-50 grayscale' : ''}
                                ${isSelected
                                    ? 'border-[3px] border-[#FACC15] bg-[#FACC15]/10 dark:bg-[#FACC15]/20'
                                    : 'border-2 border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10'
                                }
                            `}
                            style={{ contain: 'layout' }}
                        >
                            {!suitable && !dismissedWarnings.includes(vehicle.vehicleType) && (
                                <div
                                    className="absolute inset-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center rounded-[2rem] cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDismissedWarnings([...dismissedWarnings, vehicle.vehicleType]);
                                    }}
                                >
                                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-3">
                                        <Users className="text-red-600 dark:text-red-500" size={24} />
                                    </div>
                                    <p className="text-sm font-bold text-emerald-950 dark:text-white uppercase tracking-tight leading-tight">{reason}</p>
                                    <p className="text-[9px] text-red-600 font-bold mt-3 uppercase tracking-[0.2em] bg-red-50 dark:bg-red-950/30 px-4 py-1 rounded-full border border-red-100 dark:border-red-900/20">Select Larger Vehicle</p>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDismissedWarnings([...dismissedWarnings, vehicle.vehicleType]);
                                        }}
                                        className="mt-4 bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                                    >
                                        Close Warning
                                    </button>
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
                                    <div className="text-center relative z-10 flex flex-col items-center mb-4">
                                        {vehicle.hasDiscount && (
                                            <div className="text-[10px] font-bold text-slate-400 line-through mb-0.5">
                                                {convertPrice(Number(vehicle.originalTotal) || 0).symbol}
                                                {(Number(convertPrice(Number(vehicle.originalTotal) || 0).value) || 0).toLocaleString()}
                                            </div>
                                        )}
                                        <div className="flex items-baseline justify-center gap-1.5">
                                            <span className="text-xl font-black text-[#FACC15]">{convertPrice(Number(vehicle.calculatedTotal) || 0).symbol}</span>
                                            <span className="text-4xl sm:text-5xl font-black text-black dark:text-white tracking-tighter leading-none">
                                                {(Number(convertPrice(Number(vehicle.calculatedTotal) || 0).value) || 0).toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Multi-currency sub-display */}
                                        <div className="flex flex-wrap gap-3 justify-center mt-0.5">
                                            {convertToAllCurrencies(Number(vehicle.calculatedTotal) || 0)
                                                .filter(c => ['USD', 'EUR', 'GBP', 'LKR'].includes(c.code) && c.code !== (convertPrice(Number(vehicle.calculatedTotal)).code || 'LKR'))
                                                .map(c => (
                                                    <span key={c.code} className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                                        {c.symbol} {c.value.toLocaleString()}
                                                    </span>
                                                ))}
                                        </div>
                                    </div>
                                )}

                                {/* Vehicle Image — uniform premium dimensions */}
                                <div className="w-full flex justify-center items-center relative z-10 mt-auto h-[110px] sm:h-[130px] py-1">
                                    <img
                                        src={toWebpSrc(vehicle.image)}
                                        alt={vehicle.name}
                                        className="w-full h-full object-contain transition-transform duration-500"
                                        style={{
                                            filter: 'drop-shadow(0 12px 12px rgba(0,0,0,0.12))',
                                            transform: `scale(${scale}) translateY(${translateY}%)`
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Specs & CTA */}
                            <div className="px-3 sm:px-4 pb-4 mt-1 relative z-10 shrink-0">
                                <div className="grid grid-cols-4 gap-1.5">
                                    {[
                                        { icon: Users, label: 'MAX PAX', value: vehicle.capacity || 4 },
                                        { icon: Briefcase, label: 'MAX LUG', value: vehicle.luggage || vehicle.suitcases || 2 },
                                        { icon: ShoppingBag, label: 'MAX HAND', value: vehicle.handLuggage || 2 },
                                        { icon: Wind, label: 'AC', value: 'ON' }
                                    ].map((item, i) => (
                                        <div key={i} className={`flex flex-col items-center justify-center p-1.5 sm:p-2.5 rounded-xl sm:rounded-[14px] border ${isSelected ? 'bg-[#FACC15] border-[#FACC15] text-black shadow-md' : 'bg-zinc-900 border-black text-[#FACC15] dark:bg-black dark:border-white/10 dark:text-[#FACC15]'}`}>
                                            <item.icon size={14} className="mb-1" strokeWidth={isSelected ? 3 : 2.5} />
                                            <span className={`text-[11px] sm:text-[13px] font-black leading-none mb-0.5 ${isSelected ? 'text-black' : 'text-white'}`}>{item.value}</span>
                                            <span className={`text-[7px] sm:text-[9px] text-center font-black uppercase tracking-tight sm:tracking-widest leading-none opacity-90 ${isSelected ? 'text-black/80' : 'text-zinc-400'}`}>{item.label}</span>
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
