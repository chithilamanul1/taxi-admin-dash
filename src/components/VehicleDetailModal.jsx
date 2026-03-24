import React from 'react';
import { X, Users, Briefcase, Info, CheckCircle2 } from 'lucide-react';

import { useCurrency } from '../context/CurrencyContext';

const displayName = (name) => (name || '').replace(/\bKDH\s*/gi, '').trim();

const VehicleDetailModal = ({ isOpen, onClose, vehicle, onSelect }) => {
    const { convertPrice, rates } = useCurrency();
    if (!isOpen || !vehicle) return null;

    const calculatedTotal = vehicle.calculatedTotal || vehicle.basePrice || 0;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-none w-full max-w-lg shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] border-4 border-black animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] overflow-hidden">
                <div className="overflow-y-auto custom-scrollbar">
                    <div className="relative h-56 md:h-64 bg-slate-50 dark:bg-white/5 border-b-4 border-black p-8 shrink-0">
                        <img
                            src={vehicle.image}
                            alt={vehicle.name}
                            className="w-full h-full object-contain drop-shadow-xl"
                        />
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-12 h-12 bg-black text-[#FACC15] border-2 border-black rounded-none flex items-center justify-center hover:bg-[#FACC15] hover:text-black transition-all"
                        >
                            <X size={20} strokeWidth={3} />
                        </button>
                        <div className="absolute bottom-4 left-4 bg-black text-[#FACC15] px-4 py-1.5 rounded-none text-xs font-black uppercase italic tracking-widest border-2 border-black">
                            {displayName(vehicle.name)}
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-3xl font-black text-black uppercase italic tracking-tighter leading-none">{displayName(vehicle.name)}</h3>
                                <p className="text-black/40 font-bold uppercase tracking-widest text-xs mt-2">{vehicle.vehicleType}</p>
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <span className="flex items-center gap-2 text-[10px] bg-[#FACC15] text-black px-4 py-2 rounded-none border-2 border-black font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <CheckCircle2 size={12} strokeWidth={3} /> 5★ SERVICE
                                </span>
                            </div>
                        </div>

                        {/* Price Section */}
                        {calculatedTotal > 0 && (
                            <div className="mb-8 border-4 border-black bg-white dark:bg-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
                                <div className="bg-black text-white p-3 flex items-center justify-center border-b-2 border-black">
                                    <span className="text-sm font-black tracking-tight">
                                        Rs {calculatedTotal.toLocaleString()}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2">
                                    <div className="bg-[#E2E8F0] text-black p-2 flex items-center justify-center border-r-2 border-black">
                                        <span className="text-[10px] font-black tracking-tight">
                                            $ {(() => {
                                                const rate = rates['USD'] || 0.0032;
                                                const convertedRaw = calculatedTotal * rate;
                                                const value = Number(convertedRaw.toFixed(2));
                                                return value.toLocaleString();
                                            })()}
                                        </span>
                                    </div>
                                    <div className="bg-[#F1F5F9] text-black p-2 flex items-center justify-center">
                                        <span className="text-[10px] font-black tracking-tight">
                                            € {(() => {
                                                const rate = rates['EUR'] || 0.003;
                                                const convertedRaw = calculatedTotal * rate;
                                                const value = Number(convertedRaw.toFixed(2));
                                                return value.toLocaleString();
                                            })()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="bg-black/5 p-4 rounded-none border-2 border-black flex flex-col items-center gap-2">
                                <Users size={20} className="text-black" strokeWidth={3} />
                                <div className="text-center">
                                    <p className="text-lg font-black text-black">1-{vehicle.capacity}</p>
                                    <p className="text-[10px] text-black/40 uppercase font-black tracking-widest">Passengers</p>
                                </div>
                            </div>
                            <div className="bg-black/5 p-4 rounded-none border-2 border-black flex flex-col items-center gap-2">
                                <Briefcase size={20} className="text-black" strokeWidth={3} />
                                <div className="text-center">
                                    <p className="text-lg font-black text-black">{vehicle.luggage}</p>
                                    <p className="text-[10px] text-black/40 uppercase font-black tracking-widest">Luggages</p>
                                </div>
                            </div>
                            <div className="bg-black/5 p-4 rounded-none border-2 border-black flex flex-col items-center gap-2">
                                <Briefcase size={16} className="text-black/60" strokeWidth={3} />
                                <div className="text-center">
                                    <p className="text-lg font-black text-black">{vehicle.handLuggage || 0}</p>
                                    <p className="text-[10px] text-black/40 uppercase font-black tracking-widest">Small Bags</p>
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

                        <div className="flex gap-4 mt-8">
                            {onSelect ? (
                                <>
                                    <button
                                        onClick={onClose}
                                        className="flex-1 py-4 bg-black/5 text-black border-4 border-black rounded-none font-black text-sm uppercase tracking-widest hover:bg-black/10 transition-all"
                                    >
                                        CLOSE
                                    </button>
                                    <button
                                        onClick={() => { onSelect(vehicle.vehicleType); onClose(); }}
                                        className="flex-[2] py-4 bg-[#FACC15] text-black border-4 border-black rounded-none font-black text-sm uppercase tracking-widest hover:translate-y-[-4px] transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                                    >
                                        CONFIRM SELECTION
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 bg-black text-white border-4 border-black rounded-none font-black text-sm uppercase tracking-widest hover:bg-[#FACC15] hover:text-black transition-all"
                                >
                                    CLOSE DETAILS
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailModal;
