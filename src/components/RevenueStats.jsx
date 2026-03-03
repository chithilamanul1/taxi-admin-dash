'use client';

import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, ArrowUpRight, ArrowDownRight, BarChart2, PieChart } from 'lucide-react';

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
            // Robust local date string (YYYY-MM-DD) to avoid UTC shift
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        });

        return last7Days.map(date => {
            let dailyRev = 0;
            bookings.forEach(b => {
                if (b.scheduledDate && b.scheduledDate.includes(date) && (b.status === 'completed' || b.paymentStatus === 'paid')) {
                    dailyRev += (b.totalPrice || 0);
                }
            });
            return dailyRev;
        });
    };

    const dailyData = getDailyData();
    const maxDaily = Math.max(...dailyData, 1000);

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="grid md:grid-cols-3 gap-6">
                {/* Total Revenue */}
                <div className="bg-white border border-slate-200 p-6 shadow-sm rounded-lg relative overflow-hidden group">
                    <div className="flex flex-col gap-4 relative z-10">
                        <div className="flex items-center justify-between">
                            <p className="text-black text-[10px] font-black uppercase tracking-widest">Total Revenue</p>
                            <div className="w-8 h-8 bg-black text-white rounded flex items-center justify-center">
                                <DollarSign size={18} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-black tracking-tighter">
                                Rs. {stats.totalRevenue.toLocaleString()}
                            </h3>
                            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{stats.completedTrips} Verified Bookings</p>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest bg-emerald-50 self-start px-2 py-0.5 rounded border border-emerald-100">
                            <TrendingUp size={14} />
                            <span>Operational Growth</span>
                        </div>
                    </div>
                </div>

                {/* Estimate Fuel Cost */}
                <div className="bg-white border border-slate-200 p-6 shadow-sm rounded-lg relative overflow-hidden group">
                    <div className="flex flex-col gap-4 relative z-10">
                        <div className="flex items-center justify-between">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Energy Cost</p>
                            <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded flex items-center justify-center">
                                <BarChart2 size={18} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-black tracking-tighter">
                                Rs. {stats.totalFuelCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </h3>
                            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{stats.totalDistance.toFixed(0)} KM Tracked</p>
                        </div>
                        <div className="flex items-center gap-2 text-orange-600 text-[10px] font-black uppercase tracking-widest bg-orange-50 self-start px-2 py-0.5 rounded border border-orange-100">
                            <BarChart2 size={14} />
                            <span>Fuel Overhead</span>
                        </div>
                    </div>
                </div>

                {/* Net Profit */}
                <div className="bg-black text-white border border-black p-6 shadow-xl rounded-lg relative overflow-hidden group">
                    <div className="flex flex-col gap-4 relative z-10">
                        <div className="flex items-center justify-between">
                            <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Net Performance</p>
                            <div className="w-8 h-8 bg-white text-black rounded flex items-center justify-center">
                                <TrendingUp size={18} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white tracking-tighter">
                                Rs. {stats.totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </h3>
                            <p className="text-[10px] text-white/40 font-bold mt-1 uppercase tracking-wider">Estimated Yield</p>
                        </div>
                        <div className="space-y-2 pt-2">
                            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                                <div
                                    className="bg-white h-full transition-all duration-1000"
                                    style={{ width: `${Math.min(stats.profitMargin, 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-[9px] text-white/40 font-black uppercase tracking-widest text-right">
                                MARGIN: {stats.profitMargin.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Chart Section */}
                <div className="bg-white border border-slate-200 p-6 shadow-sm rounded-lg relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                        <h4 className="text-[10px] font-black text-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                            Revenue Velocity
                        </h4>
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">7D ANALYSIS</span>
                    </div>

                    <div className="h-56 flex items-end justify-between gap-3 px-2">
                        {dailyData.map((val, i) => {
                            const height = (val / maxDaily) * 100;

                            // Minimalist color logic
                            let barColor = 'bg-black';
                            if (val === 0) barColor = 'bg-slate-100';
                            else if (val < 20000) barColor = 'bg-slate-400';
                            else if (val < 40000) barColor = 'bg-slate-800';

                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative">
                                    <div
                                        className={`w-full ${barColor} hover:bg-black transition-all duration-300 relative rounded-sm shadow-sm`}
                                        style={{ height: `${Math.max(height, val > 0 ? 4 : 0)}%` }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] font-black py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-10 shadow-lg tracking-wider">
                                            Rs {val.toLocaleString()}
                                        </div>
                                    </div>
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">DAY {i + 1}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Parameters Section */}
                <div className="bg-white border border-slate-200 p-6 shadow-sm rounded-lg relative overflow-hidden flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-black">
                            <PieChart size={14} />
                        </div>
                        <h4 className="text-[10px] font-black text-black uppercase tracking-[0.2em]">Asset Configuration</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                        <div>
                            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Fuel Index</p>
                            <p className="font-black text-black text-lg tracking-tight">Rs. {FUEL_PRICE}<span className="text-[10px] text-slate-300">/L</span></p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Base Efficiency</p>
                            <p className="font-black text-black text-lg tracking-tight">{EFFICIENCY.sedan} KM/L <span className="text-[10px] text-slate-300">/SEDAN</span></p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Heavy Fleet</p>
                            <p className="font-black text-black text-lg tracking-tight">{EFFICIENCY.van} KM/L <span className="text-[10px] text-slate-300">/VAN</span></p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Tracked Flux</p>
                            <p className="font-black text-black text-lg tracking-tight">{stats.totalDistance.toFixed(0)} <span className="text-[10px] text-slate-300">KM</span></p>
                        </div>
                    </div>

                    <div className="mt-8 p-3 bg-slate-50 border border-slate-100 rounded flex items-center gap-3">
                        <BarChart2 size={12} className="text-slate-400" />
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest uppercase">
                            YIELD FORMULA: GROSS REVENUE - CALCULATED OVERHEAD
                        </p>
                    </div>
                </div>
            </div>

            {/* Detailed Profit Breakdown Table */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-lg relative overflow-hidden group">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between relative z-10 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-black text-white rounded flex items-center justify-center">
                            <TrendingUp size={14} />
                        </div>
                        <h3 className="text-xs font-black text-black uppercase tracking-widest">Operation Log</h3>
                    </div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Units: {bookings.filter(b => b.status === 'completed' || b.paymentStatus === 'paid').length}</span>
                </div>

                <div className="overflow-x-auto relative z-10">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-white text-left border-b border-slate-50">
                                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Operation</th>
                                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Asset</th>
                                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Distance</th>
                                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Value</th>
                                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Yield</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {bookings
                                .filter(b => b.status === 'completed' || b.paymentStatus === 'paid')
                                .slice(0, 10)
                                .map((b, idx) => {
                                    const dist = b.distanceKm || 0;
                                    const type = (b.vehicleType || 'sedan').toLowerCase();
                                    const eff = EFFICIENCY[type] || 12;
                                    const cost = (dist / eff) * FUEL_PRICE;
                                    const profit = (b.totalPrice || 0) - cost;
                                    const isTour = b.type === 'tour';
                                    const isDayTrip = b.type === 'day-trip';
                                    const isPackage = isTour || isDayTrip;

                                    return (
                                        <tr key={idx} className="hover:bg-[#fafafa] transition-colors border-b border-slate-50 last:border-0">
                                            <td className="px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-tighter">{b.scheduledDate || 'N/A'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[8px] font-black px-2 py-0.5 uppercase tracking-widest border rounded-full ${isPackage ? 'bg-black text-white border-black' : 'bg-white text-black border-slate-200'}`}>
                                                    {isTour ? 'TOURS' : isDayTrip ? 'DAY TRIP' : 'TRANS'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-[10px] font-black text-black uppercase tracking-tight">
                                                    {isPackage ? (b.tourDetails?.tourTitle || (isDayTrip ? 'DAY TRIP' : 'TOUR')) : type}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[10px] font-black text-slate-400 tracking-tighter text-center">{dist} KM</td>
                                            <td className="px-6 py-4 text-[10px] font-black text-black tracking-tight text-right">LKR {(b.totalPrice || 0).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-[10px] font-black text-black bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                                    +{profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                                </span>
                                            </td>
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
