'use client';

import React from 'react';
import Image from 'next/image';
import { Users, Briefcase, ShoppingBag, Wind, Check, Info, ArrowRight, MessageCircle } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const displayName = (name) => (name || '').replace(/\bKDH\s*/gi, '').trim();

const VehicleList = ({ vehicles, selectedId, onSelect, onInspect, passengerCount }) => {
    const { convertPrice, rates } = useCurrency();

    return (
        <div className="space-y-4 max-w-4xl mx-auto pb-10">
            {vehicles.map((vehicle) => {
                const isSelected = selectedId === vehicle.vehicleType;
                const totalPax = passengerCount.adults + passengerCount.children;
                const isExceeded = totalPax > (vehicle.capacity || 4) || passengerCount.luggage > (vehicle.luggage || 0);

                // Triple Currency Calculation
                const lkrPrice = vehicle.calculatedTotal || 0;
                const usdRate = rates['USD'] || 0.0032;
                const eurRate = rates['EUR'] || 0.003;
                
                const usdPrice = (lkrPrice * usdRate).toFixed(2);
                const eurPrice = (lkrPrice * eurRate).toFixed(2);

                return (
                    <div 
                        key={vehicle._id}
                        className={`group relative bg-white dark:bg-zinc-800 rounded-xl border-2 transition-all duration-300 overflow-hidden flex flex-col md:flex-row items-stretch shadow-sm hover:shadow-md ${isSelected ? 'border-emerald-600 dark:border-emerald-500 shadow-emerald-100 dark:shadow-emerald-900/20' : 'border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10'}`}
                    >
                        {/* Vehicle Image Section */}
                        <div className="w-full md:w-64 h-44 md:h-auto bg-slate-50 dark:bg-zinc-900/50 flex items-center justify-center p-4 relative shrink-0">
                            <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-500">
                                <Image
                                    src={vehicle.image || "/vehicles/minicar.png"}
                                    alt={vehicle.name}
                                    fill
                                    className="object-contain drop-shadow-xl"
                                    sizes="(max-width: 768px) 100vw, 256px"
                                />
                            </div>
                            {isExceeded && (
                                <div className="absolute top-3 left-3 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg z-10 flex items-center gap-1">
                                    <Info size={10} /> Capacity Exceeded
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="flex-1 p-4 md:p-5 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-100 dark:border-white/5">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight leading-tight">
                                            {displayName(vehicle.name)}
                                        </h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                            {vehicle.vehicleType.replace('-', ' ')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                                            Rs {lkrPrice.toLocaleString()}
                                        </div>
                                        {/* Triple Currency Row */}
                                        <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <span className="flex items-center gap-1">$ {usdPrice}</span>
                                            <div className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                            <span className="flex items-center gap-1">€ {eurPrice}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Spec Grid - Aligned */}
                                <div className="grid grid-cols-4 gap-2 md:gap-4 mb-6">
                                    {[
                                        { icon: Users, val: vehicle.capacity, label: 'PAX' },
                                        { icon: Briefcase, val: vehicle.luggage, label: 'LUG' },
                                        { icon: ShoppingBag, val: vehicle.handLuggage || 0, label: 'HAND' },
                                        { icon: Wind, val: 'ON', label: 'AC', color: 'text-emerald-500' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-white/5">
                                            <item.icon size={14} className={item.color || 'text-slate-400'} />
                                            <span className="text-[11px] font-black text-slate-800 dark:text-white mt-1 leading-none">{item.val}</span>
                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 leading-none">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => onInspect(vehicle)}
                                    className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                                >
                                    <Info size={14} /> Details
                                </button>
                                <button 
                                    onClick={() => onSelect(vehicle.vehicleType)}
                                    className={`flex-[2] py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm ${isSelected 
                                        ? 'bg-emerald-600 text-white shadow-emerald-600/20' 
                                        : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'}`}
                                >
                                    {isSelected ? (
                                        <><Check size={14} strokeWidth={3} /> Selected</>
                                    ) : (
                                        <><ArrowRight size={14} strokeWidth={3} /> Select Vehicle</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default VehicleList;
