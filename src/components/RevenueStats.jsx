'use client';

import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Fuel, Calculator } from 'lucide-react';

const RevenueStats = ({ bookings = [] }) => {
    // Constants for profit calculation (Configurable)
    const FUEL_PRICE = 370; // LKR per Liter
    const EFFICIENCY = {
        'sedan': 14,
        'van': 10,
        'standard': 14,
        'luxury': 10,
        'suv': 10,
        'bus': 6,
        'mini-van': 12
    };

    const calculateStats = () => {
        let totalRevenue = 0;
        let totalFuelCost = 0;
        let completedTrips = 0;
        let totalDistance = 0;

        bookings.forEach(booking => {
            if (booking.status === 'completed' || booking.paymentStatus === 'paid') {
                const price = booking.totalPrice || 0;
                const distance = booking.distanceKm || 0;
                const vehType = (booking.vehicleType || 'sedan').toLowerCase();

                const efficiency = EFFICIENCY[vehType] || 12;
                const fuelNeeded = distance / efficiency;
                const fuelCost = fuelNeeded * FUEL_PRICE;

                totalRevenue += price;
                totalFuelCost += fuelCost;
                totalDistance += distance;
                completedTrips++;
            }
        });

        const totalProfit = totalRevenue - totalFuelCost;
        const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

        return {
            totalRevenue,
            totalFuelCost,
            totalProfit,
            profitMargin,
            completedTrips,
            totalDistance
        };
    };

    const stats = calculateStats();

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
                {/* Total Revenue */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-slate-800">
                                Rs. {stats.totalRevenue.toLocaleString()}
                            </h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
                        <TrendingUp size={14} />
                        <span>Income from {stats.completedTrips} trips</span>
                    </div>
                </div>

                {/* Estimate Fuel Cost */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                            <Fuel size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Est. Fuel Cost</p>
                            <h3 className="text-2xl font-bold text-slate-800">
                                Rs. {stats.totalFuelCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </h3>
                        </div>
                    </div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                        Based on {stats.totalDistance.toFixed(0)} km traveled
                    </p>
                </div>

                {/* Net Profit */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Net Profit</p>
                            <h3 className="text-2xl font-bold text-slate-800">
                                Rs. {stats.totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </h3>
                        </div>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-blue-500 h-full transition-all duration-1000"
                            style={{ width: `${Math.min(profitMargin, 100)}%` }}
                        ></div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">
                        Margin: {stats.profitMargin.toFixed(1)}%
                    </p>
                </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                    <Calculator className="text-emerald-400" size={20} />
                    <h4 className="font-bold">Amazing Calculation Parameters</h4>
                </div>
                <div className="grid md:grid-cols-4 gap-6 text-sm">
                    <div className="space-y-1">
                        <p className="text-slate-400 text-xs">Petrol Price</p>
                        <p className="font-mono text-emerald-400">Rs. {FUEL_PRICE}/L</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-slate-400 text-xs">Sedan Efficiency</p>
                        <p className="font-mono">{EFFICIENCY.sedan} km/L</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-slate-400 text-xs">Van Efficiency</p>
                        <p className="font-mono">{EFFICIENCY.van} km/L</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-slate-400 text-xs">Bus Efficiency</p>
                        <p className="font-mono">{EFFICIENCY.bus} km/L</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueStats;
