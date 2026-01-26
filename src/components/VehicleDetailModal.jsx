import React from 'react';
import { X, Users, Briefcase, Info, CheckCircle2 } from 'lucide-react';

const VehicleDetailModal = ({ isOpen, onClose, vehicle }) => {
    if (!isOpen || !vehicle) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="relative h-56 bg-emerald-50">
                    <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                    />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/50 hover:bg-white rounded-full flex items-center justify-center backdrop-blur-md transition-all text-emerald-900"
                    >
                        <X size={20} />
                    </button>
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold text-emerald-900 border border-emerald-900/10">
                        {vehicle.name}
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-2xl font-black text-emerald-900">{vehicle.name}</h3>
                            <p className="text-emerald-900/60 font-medium">{vehicle.vehicleType}</p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <p className="text-xs font-bold text-emerald-900/40 uppercase tracking-wider">Per Km</p>
                            <p className="text-xl font-bold text-emerald-600 mb-1">LKR {vehicle.perKmRate}</p>
                            <span className="flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                                <CheckCircle2 size={10} /> Professional Driver
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center gap-2">
                            <Users size={20} className="text-emerald-600" />
                            <div className="text-center">
                                <p className="text-lg font-bold text-emerald-900">{vehicle.capacity}</p>
                                <p className="text-[10px] text-emerald-900/40 uppercase font-bold">Passengers</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center gap-2">
                            <Briefcase size={20} className="text-emerald-600" />
                            <div className="text-center">
                                <p className="text-lg font-bold text-emerald-900">{vehicle.luggage}</p>
                                <p className="text-[10px] text-emerald-900/40 uppercase font-bold">Large Bags</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center gap-2">
                            <Briefcase size={16} className="text-emerald-600/70" />
                            <div className="text-center">
                                <p className="text-lg font-bold text-emerald-900">{vehicle.handLuggage || 0}</p>
                                <p className="text-[10px] text-emerald-900/40 uppercase font-bold">Small Bags</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mb-8">
                        <p className="text-xs font-bold text-emerald-900/40 uppercase tracking-widest pl-1">Features</p>
                        <div className="grid grid-cols-2 gap-3">
                            {(vehicle.features || ['Air Conditioning', 'Bluetooth Audio', 'Usb Charging', 'Comfort Seating']).map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm font-medium text-emerald-900/70">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                        {onSelect ? (
                            <>
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold text-lg hover:bg-slate-200 transition-all"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => { onSelect(vehicle.vehicleType); onClose(); }}
                                    className="flex-[2] py-4 bg-emerald-900 text-white rounded-xl font-bold text-lg hover:bg-emerald-800 transition-all shadow-lg"
                                >
                                    Confirm & Select
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-emerald-900 text-white rounded-xl font-bold text-lg hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20"
                            >
                                Close Details
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailModal;
