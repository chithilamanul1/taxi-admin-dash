import React from 'react';
import { X, Users, Briefcase, CheckCircle2, Lock, Car, Loader2 } from 'lucide-react';

const VehicleSelectionDrawer = ({ isOpen, onClose, vehicles, selectedId, onSelect, passengerCount, isLoading }) => {
    if (!isOpen) return null;

    // Smart Capacity Logic (Duplicated for standalone use, or could be shared util)
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
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer Content */}
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden max-h-[85vh] animate-slide-up flex flex-col">
                <div className="p-4 md:p-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-white dark:bg-slate-800 shrink-0 z-10">
                    <div>
                        <h3 className="text-lg font-black text-emerald-900 dark:text-white">Select Vehicle {vehicles.length > 0 && `(${vehicles.length})`}</h3>
                        <p className="text-xs text-slate-500 dark:text-white/60 font-medium">Choose the best ride for your trip</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-slate-100 dark:bg-white/10 rounded-full text-slate-500 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar flex-1 pb-10">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="animate-spin text-emerald-600" size={32} />
                            <p className="text-sm font-bold text-emerald-900/40 dark:text-white/40 uppercase tracking-widest">Loading Vehicles...</p>
                        </div>
                    ) : vehicles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                            <div className="w-16 h-16 bg-emerald-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 text-emerald-600">
                                <Car size={32} />
                            </div>
                            <h4 className="font-bold text-emerald-900 dark:text-white mb-2">No Vehicles Available</h4>
                            <p className="text-xs text-slate-500 dark:text-white/60">We couldn't find any vehicles for this route. Please contact support or try again later.</p>
                        </div>
                    ) : (
                        vehicles.map((vehicle) => {
                            const { suitable, reason } = isSuitable(vehicle);
                            const isSelected = selectedId === vehicle.vehicleType;

                            return (
                                <div
                                    key={vehicle.vehicleType}
                                    onClick={() => {
                                        if (suitable) {
                                            onSelect(vehicle.vehicleType);
                                            onClose();
                                        }
                                    }}
                                    className={`
                                        flex items-center gap-4 p-3 md:p-4 rounded-2xl border-2 transition-all relative overflow-hidden
                                        ${isSelected ? 'border-emerald-600 bg-white dark:bg-slate-800 ring-2 ring-emerald-600/10 shadow-lg' : 'border-slate-50 dark:border-white/5 bg-white dark:bg-white/5 shadow-sm'}
                                        ${!suitable ? 'opacity-60 grayscale-[0.8]' : 'active:scale-95 cursor-pointer hover:border-emerald-600/50'}
                                    `}
                                >
                                    {/* Warning Overlay for Unsuitable */}
                                    {!suitable && (
                                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-lg text-[10px] font-bold z-10">
                                            <Lock size={10} /> {reason}
                                        </div>
                                    )}

                                    <div className="w-20 h-16 bg-slate-50 dark:bg-white/10 rounded-xl flex items-center justify-center shrink-0 p-1">
                                        {vehicle.image ? (
                                            <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                                        ) : (
                                            <Car className="text-emerald-900/20 dark:text-white/20" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-emerald-900 dark:text-white truncate">{vehicle.name}</h4>
                                            {isSelected && <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-white/40 mt-1">
                                            <div className="flex items-center gap-1">
                                                <Users size={12} className="text-emerald-600" /> {vehicle.capacity}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Briefcase size={12} className="text-emerald-600" /> {vehicle.luggage}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Per Km Rate Removed as per request */}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default VehicleSelectionDrawer;
