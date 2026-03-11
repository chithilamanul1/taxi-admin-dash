import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Users, Briefcase, Info, Lock, Wind, Backpack, Check, ArrowRight } from 'lucide-react';
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
            <div className="flex justify-between items-end mb-10 px-2">
                <div>
                    <div className="yellow-badge mb-4">FLEET</div>
                    <h3 className="text-2xl font-black text-black dark:text-white flex items-center gap-4 uppercase italic tracking-tighter">
                        VEHICLE OPTIONS
                        <span className="text-[10px] bg-black text-[#FACC15] px-4 py-1 rounded-full not-italic tracking-[0.2em]">
                            {vehicles.length} MODELS
                        </span>
                    </h3>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => scroll('left')}
                        className="w-14 h-14 rounded-2xl bg-black dark:bg-[#FACC15] text-[#FACC15] dark:text-black flex items-center justify-center hover:translate-x-[-4px] transition-all shadow-xl"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={24} strokeWidth={3} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-14 h-14 rounded-2xl bg-black dark:bg-[#FACC15] text-[#FACC15] dark:text-black flex items-center justify-center hover:translate-x-[4px] transition-all shadow-xl"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={24} strokeWidth={3} />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-8 overflow-x-auto pb-12 px-2 snap-x snap-mandatory scrollbar-hide w-full"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {vehicles.map((vehicle) => {
                    const { suitable, reason } = isSuitable(vehicle);
                    const isSelected = selectedId === vehicle.vehicleType;

                    return (
                        <div
                            key={vehicle._id || vehicle.vehicleType}
                            className={`
                                relative flex-shrink-0 w-[350px] snap-center rounded-[3rem] border-4 transition-all duration-500 overflow-hidden group/card
                                ${isSelected ? 'border-[#FACC15] bg-[#FACC15]/5 shadow-[0_30px_60px_rgba(250,204,21,0.2)]' : 'border-slate-100 dark:border-white/5 bg-white dark:bg-white/5 shadow-xl hover:border-[#FACC15]/30'}
                                ${!suitable ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer'}
                            `}
                            onClick={() => suitable && onSelect(vehicle.vehicleType)}
                        >
                            {!suitable && (
                                <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-8 text-center">
                                    <div className="w-16 h-16 bg-red-600 rounded-full mb-6 flex items-center justify-center shadow-2xl">
                                        <Lock size={28} className="text-white" />
                                    </div>
                                    <p className="text-lg font-black text-white uppercase italic tracking-tighter leading-tight">{reason}</p>
                                    <p className="text-[10px] text-[#FACC15] font-black mt-4 uppercase tracking-[0.3em]">Select Larger Vehicle</p>
                                </div>
                            )}

                            <div className="h-56 w-full p-8 bg-slate-50 dark:bg-black/20 relative flex items-center justify-center group-hover/card:scale-105 transition-transform duration-700">
                                <img
                                    src={vehicle.image}
                                    alt={vehicle.name}
                                    width={240}
                                    height={150}
                                    className="w-auto h-5/6 object-contain drop-shadow-2xl"
                                />
                                <button
                                    onClick={(e) => { e.stopPropagation(); setDetailVehicle(vehicle); }}
                                    className="absolute top-6 right-6 w-12 h-12 bg-white dark:bg-black rounded-xl shadow-xl text-black dark:text-[#FACC15] flex items-center justify-center hover:scale-110 transition-all z-20"
                                    aria-label={`View details for ${vehicle.name}`}
                                >
                                    <Info size={20} strokeWidth={3} />
                                </button>
                            </div>

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-8 min-h-[64px]">
                                    <h4 className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tighter leading-tight">
                                        {vehicle.name.split('(').map((part, i) => (
                                            <span key={i} className={i > 0 ? "block text-sm opacity-40 not-italic font-black mt-2 tracking-widest" : "block"}>
                                                {i > 0 ? `(${part}` : part}
                                            </span>
                                        ))}
                                    </h4>
                                    {suitable && <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all ${isSelected ? 'border-black bg-[#FACC15]' : 'border-slate-200 dark:border-white/10'}`}>
                                        {isSelected && <Check size={20} strokeWidth={4} className="text-black" />}
                                    </div>}
                                </div>

                                {/* Vehicle Specs Grid - Premium Boxes */}
                                <div className="grid grid-cols-2 gap-3 mb-10">
                                    {[
                                        { icon: Users, label: `${vehicle.minCapacity || 1}-${vehicle.capacity} PAX` },
                                        { icon: Briefcase, label: `${vehicle.luggage || 0} BAGS` },
                                        { icon: Backpack, label: `${vehicle.handLuggage || 0} SMALL` },
                                        ...(vehicle.hasAC !== false ? [{ icon: Wind, label: 'A/C' }] : [])
                                    ].map((spec, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-transparent group-hover/card:border-black/5 transition-all">
                                            <spec.icon size={14} className="text-[#FACC15]" strokeWidth={3} />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">{spec.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center pt-8 border-t-2 border-slate-100 dark:border-white/5">
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-black/30 dark:text-white/30 tracking-[0.2em] mb-1">RATE PER KM</p>
                                        <p className="text-3xl font-black text-black dark:text-white italic tracking-tighter">LKR {vehicle.perKmRate}</p>
                                    </div>
                                    <div className={`
                                        w-12 h-12 rounded-xl flex items-center justify-center transition-all
                                        ${isSelected ? 'bg-black text-[#FACC15]' : 'bg-slate-100 dark:bg-white/5 text-black/20 dark:text-white/20'}
                                    `}>
                                        <ArrowRight size={24} strokeWidth={3} className={isSelected ? 'translate-x-0' : '-translate-x-2 opacity-0'} />
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
