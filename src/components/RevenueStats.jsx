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

    // Calculate daily data for last 7 days chart
    const getDailyData = () => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });

        return last7Days.map(date => {
            let dailyRev = 0;
            bookings.forEach(b => {
                if (b.scheduledDate === date && (b.status === 'completed' || b.paymentStatus === 'paid')) {
                    dailyRev += (b.totalPrice || 0);
                }
            });
            return dailyRev;
        });
    };

    const dailyData = getDailyData();
    const maxDaily = Math.max(...dailyData, 1000);

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
                            style={{ width: `${Math.min(stats.profitMargin, 100)}%` }}
                        ></div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">
                        Margin: {stats.profitMargin.toFixed(1)}%
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Chart Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h4 className="text-sm font-bold text-slate-800 mb-6">Revenue Trend (Last 7 Days)</h4>
                    <div className="h-48 flex items-end justify-between gap-2 px-2">
                        {dailyData.map((val, i) => {
                            const height = (val / maxDaily) * 100;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                                    <div
                                        className="w-full bg-emerald-500/20 group-hover:bg-emerald-500 rounded-t-lg transition-all duration-500 relative"
                                        style={{ height: `${height}%` }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl">
                                            Rs. {val.toLocaleString()}
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400">Day {i + 1}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Parameters Section */}
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-2xl flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                        <Calculator className="text-emerald-400" size={20} />
                        <h4 className="font-bold">Calculation Strategy</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                        <div>
                            <p className="text-slate-400 text-xs">Petrol Price</p>
                            <p className="font-mono text-emerald-400">Rs. {FUEL_PRICE}/L</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs">Avg. Sedan Eff.</p>
                            <p className="font-mono">{EFFICIENCY.sedan} km/L</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs">Avg. Van Eff.</p>
                            <p className="font-mono">{EFFICIENCY.van} km/L</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs">Total Tracked Dist.</p>
                            <p className="font-mono text-blue-400">{stats.totalDistance.toFixed(0)} KM</p>
                        </div>
                    </div>
                    <div className="mt-8 p-3 bg-white/5 rounded-xl border border-white/10">
                        <p className="text-[10px] text-slate-500 italic">
                            Formula: Total Price - ((Distance / Efficiency) * FuelPrice)
                        </p>
                    </div>
                </div>
            </div>

            {/* Detailed Profit Breakdown Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800">Verified Trip-by-Trip Profit Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="bg-slate-50 text-left text-slate-500 uppercase font-bold tracking-wider">
                                <th className="px-6 py-3">Trip Date</th>
                                <th className="px-6 py-3">Vehicle</th>
                                <th className="px-6 py-3">Dist. (KM)</th>
                                <th className="px-6 py-3">Revenue (Rs.)</th>
                                <th className="px-6 py-3">Fuel Cost (Est.)</th>
                                <th className="px-6 py-3">Net Profit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {bookings
                                .filter(b => b.status === 'completed' || b.paymentStatus === 'paid')
                                .slice(0, 10)
                                .map((b, idx) => {
                                    const dist = b.distanceKm || 0;
                                    const type = (b.vehicleType || 'sedan').toLowerCase();
                                    const eff = EFFICIENCY[type] || 12;
                                    const cost = (dist / eff) * FUEL_PRICE;
                                    const profit = (b.totalPrice || 0) - cost;

                                    return (
                                        <tr key={idx} className="hover:bg-slate-50">
                                            <td className="px-6 py-3 text-slate-600">{b.scheduledDate || 'N/A'}</td>
                                            <td className="px-6 py-3 capitalize text-slate-900 font-medium">{type}</td>
                                            <td className="px-6 py-3 font-mono">{dist} km</td>
                                            <td className="px-6 py-3 font-bold text-emerald-600">Rs. {(b.totalPrice || 0).toLocaleString()}</td>
                                            <td className="px-6 py-3 text-orange-600">Rs. {cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                            <td className="px-6 py-3 font-bold text-blue-600 bg-blue-50/50">Rs. {profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RevenueStats;
