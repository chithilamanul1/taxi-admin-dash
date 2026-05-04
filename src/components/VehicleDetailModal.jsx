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
            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] w-full max-w-lg border border-slate-100 dark:border-white/10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                
                <div className="overflow-y-auto custom-scrollbar relative z-10">
                    <div className="relative h-56 md:h-64 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 p-6 shrink-0 flex items-center justify-center overflow-hidden">
                        <img
                            src={vehicle.image}
                            alt={vehicle.name}
                            className={`w-full h-full object-contain transition-transform duration-700
                                ${vehicle.vehicleType?.toLowerCase().includes('sedan') || vehicle.vehicleType?.toLowerCase().includes('car') ? 'scale-[1.05] md:scale-[1.1]' : ''}
                                ${vehicle.vehicleType?.toLowerCase().includes('wagon') ? 'scale-[1.02]' : ''}
                            `}
                        />
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 w-12 h-12 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md text-slate-500 dark:text-slate-400 rounded-2xl flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shadow-sm border border-slate-100 dark:border-white/10"
                        >
                            <X size={20} strokeWidth={3} />
                        </button>
                        <div className="absolute bottom-6 left-6 bg-emerald-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20">
                            {displayName(vehicle.name)}
                        </div>
                    </div>

                    <div className="p-10">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h3 className="text-3xl md:text-4xl font-black text-emerald-950 dark:text-white uppercase tracking-tight leading-none mb-3">{displayName(vehicle.name)}</h3>
                                <div className="flex items-center gap-3">
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{vehicle.vehicleType}</p>
                                    <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                                    <p className="text-emerald-600 font-bold uppercase tracking-widest text-[10px]">Elite Class</p>
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end shrink-0">
                                <span className="flex items-center gap-2 text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-5 py-2.5 rounded-full border border-emerald-100 dark:border-emerald-500/20 font-black uppercase tracking-widest shadow-sm">
                                    <CheckCircle2 size={14} strokeWidth={3} /> PREMIUM
                                </span>
                            </div>
                        </div>

                        {/* Price Section */}
                        {calculatedTotal > 0 && (
                            <div className="mb-10 rounded-[2rem] border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 overflow-hidden flex flex-col shadow-inner">
                                <div className="bg-emerald-600 text-white p-6 flex flex-col items-center justify-center border-b border-emerald-500 shadow-lg relative">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-2 opacity-70">Estimated Total Fare</span>
                                    <span className="text-4xl font-black tracking-tight">
                                        Rs {calculatedTotal.toLocaleString()}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2">
                                    <div className="p-5 flex flex-col items-center justify-center border-r border-slate-100 dark:border-white/5 bg-white/40 dark:bg-transparent">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-60">USD Est.</span>
                                        <span className="text-base font-black text-emerald-950 dark:text-white">
                                            $ {(() => {
                                                const rate = rates['USD'] || 0.0032;
                                                const convertedRaw = calculatedTotal * rate;
                                                const value = Number(convertedRaw.toFixed(2));
                                                return value.toLocaleString();
                                            })()}
                                        </span>
                                    </div>
                                    <div className="p-5 flex flex-col items-center justify-center bg-white/40 dark:bg-transparent">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-60">EUR Est.</span>
                                        <span className="text-base font-black text-emerald-950 dark:text-white">
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

                        <div className="grid grid-cols-3 gap-4 mb-10">
                            {[
                                { icon: Users, val: `1-${vehicle.capacity}`, label: 'Pax' },
                                { icon: Briefcase, val: vehicle.luggage, label: 'Luggages' },
                                { icon: Briefcase, val: vehicle.handLuggage || 0, label: 'Small Bags', size: 16 }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col items-center gap-3 shadow-sm hover:border-emerald-200 transition-colors">
                                    <item.icon size={item.size || 22} className="text-emerald-600" strokeWidth={2.5} />
                                    <div className="text-center">
                                        <p className="text-xl font-black text-emerald-950 dark:text-white leading-none">{item.val}</p>
                                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mt-1.5">{item.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 mb-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] pl-1">Elite Features</p>
                            <div className="grid grid-cols-2 gap-4">
                                {(vehicle.features || ['Air Conditioning', 'Bluetooth Audio', 'Usb Charging', 'Comfort Seating']).map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 text-xs font-black uppercase tracking-tight text-emerald-950 dark:text-slate-300 bg-slate-50 dark:bg-white/5 px-4 py-3 rounded-xl border border-slate-100 dark:border-white/5">
                                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" strokeWidth={3} />
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-12">
                            {onSelect ? (
                                <>
                                    <button
                                        onClick={onClose}
                                        className="flex-1 py-5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
                                    >
                                        CLOSE
                                    </button>
                                    <button
                                        onClick={() => { onSelect(vehicle.vehicleType); onClose(); }}
                                        className="flex-[2] py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:translate-y-[-4px] transition-all shadow-lg shadow-emerald-600/20"
                                    >
                                        CONFIRM SELECTION
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={onClose}
                                    className="w-full py-5 bg-emerald-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl"
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
