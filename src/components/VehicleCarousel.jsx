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
                {vehicles.map((vehicle) => {
                    const { suitable, reason } = isSuitable(vehicle);
                    const isSelected = selectedId === vehicle.vehicleType;

                    return (
                        <div
                            key={vehicle._id || vehicle.vehicleType}
                            className={`
                                relative flex-shrink-0 w-[290px] md:w-[350px] snap-center rounded-none border-4 transition-all duration-500 overflow-hidden group/card
                                ${isSelected ? 'border-black bg-[#FACC15]/5 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] -translate-y-2' : 'border-black bg-white dark:bg-white/5 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1'}
                                ${!suitable ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer'}
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

                            <div className="h-48 md:h-56 w-full p-6 md:p-8 bg-slate-50 dark:bg-black/20 relative flex items-center justify-center group-hover/card:scale-105 transition-transform duration-700">
                                <img
                                    src={vehicle.image}
                                    alt={vehicle.name}
                                    width={240}
                                    height={150}
                                    className="w-auto h-3/4 object-contain drop-shadow-[5px_5px_0px_rgba(0,0,0,0.2)]"
                                />
                                <button
                                    onClick={(e) => { e.stopPropagation(); setDetailVehicle(vehicle); }}
                                    className="absolute top-6 right-6 w-12 h-12 bg-black text-[#FACC15] border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:bg-[#FACC15] hover:text-black transition-all z-20"
                                    aria-label={`View details for ${vehicle.name}`}
                                >
                                    <Info size={20} strokeWidth={4} />
                                </button>
                            </div>

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6 min-h-[64px]">
                                    <h4 className="text-2xl font-black text-black dark:text-white uppercase italic tracking-tighter leading-none">
                                        {vehicle.name.split('(').map((part, i) => (
                                            <span key={i} className={i > 0 ? "block text-[10px] opacity-40 not-italic font-black mt-2 tracking-widest leading-none" : "block leading-none"}>
                                                {i > 0 ? `(${part}` : part}
                                            </span>
                                        ))}
                                    </h4>
                                    {suitable && <div className={`w-8 h-8 rounded-none border-4 flex items-center justify-center transition-all ${isSelected ? 'border-black bg-[#FACC15] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'border-black/5'}`}>
                                        {isSelected && <Check size={16} strokeWidth={5} className="text-black" />}
                                    </div>}
                                </div>

                                {/* Vehicle Specs Grid - Premium Boxes */}
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {[
                                        { icon: Users, label: `${vehicle.minCapacity || 1}-${vehicle.capacity} Passengers` },
                                        { icon: Briefcase, label: `${vehicle.luggage || 0} Luggages` },
                                        { icon: Backpack, label: `${vehicle.handLuggage || 0} Small Bags` },
                                        ...(vehicle.hasAC !== false ? [{ icon: Wind, label: 'Air Conditioning' }] : [])
                                    ].map((spec, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-black/5 dark:bg-white/5 rounded-none border-2 border-black transition-all">
                                            <spec.icon size={14} className="text-black dark:text-white" strokeWidth={3} />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">{spec.label}</span>
                                        </div>
                                    ))}
                                </div>

                                {vehicle.calculatedTotal > 0 && (
                                    <div className="mb-6 border-4 border-black bg-white dark:bg-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
                                        {/* LKR - Primary */}
                                        <div className="bg-black text-white p-3 flex items-center justify-center border-b-2 border-black">
                                            <span className="text-sm font-black tracking-tight">
                                                Rs {vehicle.calculatedTotal.toLocaleString()}
                                            </span>
                                        </div>
                                        {/* USD - Secondary */}
                                        <div className="bg-[#E2E8F0] text-black p-2 flex items-center justify-center border-b-2 border-black">
                                            <span className="text-xs font-black tracking-tight">
                                                $ {(() => {
                                                    const rate = rates['USD'] || 0.0032;
                                                    const convertedRaw = (vehicle.calculatedTotal || 0) * rate;
                                                    const value = currency === 'LKR' ? Math.round(convertedRaw) : Number(convertedRaw.toFixed(2));
                                                    return value.toLocaleString();
                                                })()}
                                            </span>
                                        </div>
                                        {/* EUR - Tertiary */}
                                        <div className="bg-[#F1F5F9] text-black p-2 flex items-center justify-center">
                                            <span className="text-xs font-black tracking-tight">
                                                € {(() => {
                                                    const rate = rates['EUR'] || 0.003;
                                                    const convertedRaw = (vehicle.calculatedTotal || 0) * rate;
                                                    const value = currency === 'LKR' ? Math.round(convertedRaw) : Number(convertedRaw.toFixed(2));
                                                    return value.toLocaleString();
                                                })()}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <button
                                    className={`w-full py-4 rounded-none border-4 border-black font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(250,204,21,0.2)] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${isSelected ? 'bg-[#FACC15] text-black border-black' : 'bg-black hover:bg-[#111] text-[#FACC15] dark:border-white/20 dark:hover:border-[#FACC15]'}`}
                                    onClick={(e) => { e.stopPropagation(); suitable && onSelect(vehicle.vehicleType); }}
                                >
                                    {isSelected ? 'SELECTED' : 'SELECT'} 
                                    <ArrowRight size={20} strokeWidth={4} />
                                </button>
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
