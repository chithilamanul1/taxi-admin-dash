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
            <div className="relative w-full max-w-lg bg-white dark:bg-black rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[85vh] animate-slide-up flex flex-col transition-colors">
                <div className="p-4 md:p-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-white dark:bg-[#111] shrink-0 z-10">
                    <div>
                        <h3 className="text-xl font-black text-black dark:text-white uppercase italic tracking-tight">Select Vehicle {vehicles.length > 0 && `(${vehicles.length})`}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest mt-1">Choose the best ride for your trip</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-slate-100 dark:bg-white/10 rounded-full text-slate-500 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto p-4 space-y-4 custom-scrollbar flex-1 pb-10">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="animate-spin text-black dark:text-yellow-400" size={32} />
                            <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Loading Vehicles...</p>
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
                                        flex items-center gap-4 p-4 md:p-5 rounded-3xl border-2 transition-all relative overflow-hidden
                                        ${isSelected
                                            ? 'border-black dark:border-yellow-400 bg-slate-50 dark:bg-white/5 shadow-xl shadow-black/10'
                                            : 'border-slate-100 dark:border-white/5 bg-white dark:bg-white/[0.02] shadow-sm'}
                                        ${!suitable ? 'opacity-40 grayscale pointer-events-none' : 'active:scale-[0.98] cursor-pointer hover:border-black dark:hover:border-yellow-400'}
                                    `}
                                >
                                    {/* AC Badge */}
                                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-slate-100 dark:bg-emerald-900/50 text-black dark:text-slate-400 px-2 py-1 rounded-lg text-[8px] font-black z-10 uppercase tracking-tighter border border-slate-200 dark:border-slate-800">
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
                                                                <h4 className="font-black text-black dark:text-white uppercase italic tracking-tight">{match[1].trim()}</h4>
                                                                <span className="text-[10px] font-black text-emerald-600 dark:text-yellow-400 uppercase tracking-widest">{match[2]}</span>
                                                            </>
                                                        );
                                                    }
                                                    return <h4 className="font-black text-black dark:text-white uppercase italic tracking-tight">{cleanName}</h4>;
                                                })()}
                                            </div>
                                            {isSelected && <CheckCircle2 size={20} className="text-black dark:text-yellow-400 shrink-0" />}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-black uppercase tracking-tight mt-2 opacity-80">
                                            <div className="flex items-center gap-1">
                                                <Users size={14} /> {vehicle.capacity}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Briefcase size={14} /> {vehicle.luggage}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Wind size={14} /> AC
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
                    <div className="absolute inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in transition-all" onClick={() => setDetailVehicle(null)}>
                        <div className="w-full max-w-sm bg-white dark:bg-black rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl border-t sm:border border-slate-100 dark:border-white/10 flex flex-col animate-scale-in relative max-h-[85vh] sm:max-h-[90vh] transition-colors" onClick={(e) => e.stopPropagation()}>

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
                                <div className="aspect-video bg-slate-50 dark:bg-white/5 rounded-3xl flex items-center justify-center p-6 border border-slate-100 dark:border-white/5">
                                    <img src={detailVehicle.image} alt={detailVehicle.name} className="w-full h-full object-contain" />
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="flex flex-col items-center gap-1 p-4 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
                                        <Users size={18} className="text-black dark:text-yellow-400" />
                                        <span className="text-base font-black text-black dark:text-white">{detailVehicle.capacity}</span>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pax</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 p-4 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
                                        <Briefcase size={18} className="text-black dark:text-yellow-400" />
                                        <span className="text-base font-black text-black dark:text-white">{detailVehicle.luggage}</span>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Bags</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 p-4 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
                                        <Wind size={18} className="text-black dark:text-yellow-400" />
                                        <span className="text-base font-black text-black dark:text-white">AC</span>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Clim</span>
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
                            <div className="p-6 pt-4 shrink-0 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-[#111] rounded-b-[2.5rem]">
                                <button
                                    onClick={() => {
                                        onSelect(detailVehicle.vehicleType);
                                        setDetailVehicle(null);
                                        onClose();
                                    }}
                                    className="w-full h-16 bg-black dark:bg-yellow-400 text-white dark:text-black rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-black/10 dark:shadow-yellow-400/10"
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
