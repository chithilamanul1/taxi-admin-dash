import React from 'react';
import { X, Users, Briefcase, CheckCircle2, Lock, Car, Loader2, Info, Wind } from 'lucide-react';

// Strip the word 'KDH' from display names only (keeps DB IDs intact)
const displayName = (name) => (name || '').replace(/\bKDH\s*/gi, '').trim();

const VehicleSelectionDrawer = ({ isOpen, onClose, vehicles, selectedId, onSelect, passengerCount, isLoading }) => {
    const [detailVehicle, setDetailVehicle] = React.useState(null);

    if (!isOpen) return null;
    if (!vehicles) return null;

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
                        <h3 className="text-lg font-black text-black dark:text-white">Select Vehicle {vehicles.length > 0 && `(${vehicles.length})`}</h3>
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
                            <Loader2 className="animate-spin text-black" size={32} />
                            <p className="text-sm font-bold text-slate-900/40 dark:text-white/40 uppercase tracking-widest">Loading Vehicles...</p>
                        </div>
                    ) : vehicles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                            <div className="w-16 h-16 bg-emerald-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 text-emerald-600">
                                <Car size={32} />
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-2">No Vehicles Available</h4>
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
                                        ${isSelected ? 'border-black bg-white dark:bg-slate-800 ring-4 ring-slate-900/10 shadow-xl' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-white/5 shadow-sm'}
                                        ${!suitable ? 'opacity-60 grayscale-[0.8]' : 'active:scale-95 cursor-pointer hover:border-black'}
                                    `}
                                >
                                    {/* AC Badge */}
                                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-slate-100 dark:bg-slate-900/50 text-black dark:text-slate-400 px-2 py-1 rounded-lg text-[8px] font-black z-10 uppercase tracking-tighter border border-slate-200 dark:border-slate-800">
                                        <Wind size={8} className="animate-pulse" /> 100% A/C
                                    </div>

                                    {/* Warning Overlay for Unsuitable */}
                                    {!suitable && (
                                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-lg text-[10px] font-bold z-10">
                                            <Lock size={10} /> {reason}
                                        </div>
                                    )}

                                    <div className="w-24 h-20 bg-slate-50 dark:bg-white/10 rounded-xl flex items-center justify-center shrink-0 p-1 overflow-hidden">
                                        {vehicle.image ? (
                                            <img
                                                src={vehicle.image}
                                                alt={vehicle.name}
                                                className={`w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform ${['mini-car', 'sedan'].includes(vehicle.vehicleType) ? 'scale-125' : ''
                                                    }`}
                                            />
                                        ) : (
                                            <Car className="text-emerald-900/20 dark:text-white/20" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                {(() => {
                                                    const cleanName = displayName(vehicle.name);
                                                    const match = cleanName.match(/^(.+?)\s*\((.+)\)$/);
                                                    if (match) {
                                                        return (
                                                            <>
                                                                <h4 className="font-bold text-slate-900 dark:text-white truncate">{match[1].trim()}</h4>
                                                                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">{match[2]}</span>
                                                            </>
                                                        );
                                                    }
                                                    return <h4 className="font-bold text-slate-900 dark:text-white truncate">{cleanName}</h4>;
                                                })()}
                                            </div>
                                            {isSelected && <CheckCircle2 size={18} className="text-black shrink-0" />}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-white/40 mt-1">
                                            <div className="flex items-center gap-1">
                                                <Users size={12} className="text-black" /> 1-{vehicle.capacity} Passengers
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Briefcase size={12} className="text-black" /> {vehicle.luggage}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Briefcase size={10} className="text-black" /> {vehicle.handLuggage || 0} Hand
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 items-end">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDetailVehicle(vehicle);
                                            }}
                                            className="p-2 text-slate-400 hover:text-black hover:bg-slate-50 dark:hover:bg-white/5 rounded-full transition-all"
                                            title="View Details"
                                        >
                                            <Info size={18} />
                                        </button>
                                        <div className="text-[10px] font-black text-black/40 uppercase tracking-widest hidden sm:block">Details</div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* More Details Modal */}
                {detailVehicle && (
                    <div className="absolute inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in" onClick={() => setDetailVehicle(null)}>
                        <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl border-t sm:border border-emerald-900/10 dark:border-white/10 flex flex-col animate-scale-in relative max-h-[85vh] sm:max-h-[90vh]" onClick={(e) => e.stopPropagation()}>

                            {/* Header - Fixed */}
                            <div className="p-6 pb-2 shrink-0 flex justify-between items-start relative">
                                <h4 className="text-lg font-black text-black dark:text-white uppercase tracking-tight pr-8">{displayName(detailVehicle.name)}</h4>
                                <button
                                    onClick={() => setDetailVehicle(null)}
                                    className="p-2.5 bg-slate-100 dark:bg-white/10 rounded-full text-slate-500 dark:text-white/60 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="p-6 pt-2 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                                <div className="aspect-video bg-slate-50 dark:bg-white/5 rounded-3xl flex items-center justify-center p-4">
                                    <img src={detailVehicle.image} alt={detailVehicle.name} className="w-full h-full object-contain" />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="flex flex-col items-center gap-1 p-3 bg-slate-50 dark:bg-white/5 rounded-2xl">
                                        <Users size={16} className="text-black" />
                                        <span className="text-sm font-black text-black dark:text-white">1-{detailVehicle.capacity}</span>
                                        <span className="text-[8px] font-bold text-slate-400 uppercase">Passengers</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 p-3 bg-slate-50 dark:bg-white/5 rounded-2xl">
                                        <Briefcase size={16} className="text-black" />
                                        <span className="text-sm font-black text-black dark:text-white">{detailVehicle.luggage}</span>
                                        <span className="text-[8px] font-bold text-slate-400 uppercase">Luggage</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 p-3 bg-slate-50 dark:bg-white/5 rounded-2xl">
                                        <Briefcase size={14} className="text-black" />
                                        <span className="text-sm font-black text-black dark:text-white">{detailVehicle.handLuggage || 0}</span>
                                        <span className="text-[8px] font-bold text-slate-400 uppercase">Hand Bags</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Key Features</span>
                                    <div className="flex flex-wrap gap-2">
                                        {['100% Air Conditioned', 'Professional Chauffeur', 'GPS Tracked', '24/7 Support', ...(detailVehicle.features || [])].map((f, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-slate-50 dark:bg-white/5 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-white/5 line-clamp-1">
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer - Fixed */}
                            <div className="p-6 pt-4 shrink-0 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-slate-800 rounded-b-[2.5rem]">
                                <button
                                    onClick={() => {
                                        onSelect(detailVehicle.vehicleType);
                                        setDetailVehicle(null);
                                        onClose();
                                    }}
                                    className="w-full h-14 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
                                >
                                    Select This Ride
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VehicleSelectionDrawer;
