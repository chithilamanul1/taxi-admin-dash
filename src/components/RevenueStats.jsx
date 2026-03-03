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
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="grid md:grid-cols-3 gap-8">
                {/* Total Revenue */}
                <div className="bg-[#121212] border border-white/5 p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E]/5 blur-3xl rounded-full translate-x-16 -translate-y-16 group-hover:bg-[#22C55E]/10 transition-all"></div>

                    <div className="flex flex-col gap-6 relative z-10">
                        <div className="w-14 h-14 bg-[#22C55E] flex items-center justify-center text-white border border-white/10 shadow-lg shadow-[#22C55E]/20">
                            <DollarSign size={28} />
                        </div>
                        <div>
                            <p className="text-[#FFDA00] text-[10px] font-black uppercase tracking-widest mb-1">Total Revenue</p>
                            <h3 className="text-4xl font-black text-white tracking-tighter">
                                Rs. {stats.totalRevenue.toLocaleString()}
                            </h3>
                        </div>
                        <div className="flex items-center gap-2 text-[#22C55E] text-[10px] font-black uppercase tracking-widest">
                            <TrendingUp size={16} />
                            <span>{stats.completedTrips} Verified Operations</span>
                        </div>
                    </div>
                </div>

                {/* Estimate Fuel Cost */}
                <div className="bg-[#121212] border border-white/5 p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full translate-x-16 -translate-y-16 group-hover:bg-orange-500/10 transition-all"></div>

                    <div className="flex flex-col gap-6 relative z-10">
                        <div className="w-14 h-14 bg-white/5 border border-white/10 flex items-center justify-center text-orange-500">
                            <Fuel size={28} />
                        </div>
                        <div>
                            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Energy Expenditure</p>
                            <h3 className="text-4xl font-black text-white tracking-tighter">
                                Rs. {stats.totalFuelCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </h3>
                        </div>
                        <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-widest bg-white/5 p-2 border border-white/5">
                            <Activity size={14} />
                            <span>{stats.totalDistance.toFixed(0)} KM Vector Track</span>
                        </div>
                    </div>
                </div>

                {/* Net Profit */}
                <div className="bg-[#121212] border border-white/5 p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full translate-x-16 -translate-y-16 group-hover:bg-blue-500/10 transition-all"></div>

                    <div className="flex flex-col gap-6 relative z-10">
                        <div className="w-14 h-14 bg-[#FFDA00] flex items-center justify-center text-black border border-white/10 shadow-lg shadow-[#FFDA00]/20">
                            <TrendingUp size={28} />
                        </div>
                        <div>
                            <p className="text-[#22C55E] text-[10px] font-black uppercase tracking-widest mb-1">Net Performance</p>
                            <h3 className="text-4xl font-black text-white tracking-tighter">
                                Rs. {stats.totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </h3>
                        </div>
                        <div className="space-y-2">
                            <div className="w-full bg-white/5 h-1.5 overflow-hidden">
                                <div
                                    className="bg-[#22C55E] h-full transition-all duration-1000"
                                    style={{ width: `${Math.min(stats.profitMargin, 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-[10px] text-white/30 font-black uppercase tracking-widest text-right">
                                MARGIN: {stats.profitMargin.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Chart Section */}
                <div className="bg-[#121212] border border-white/5 p-8 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-[#22C55E] animate-pulse"></div>
                            Revenue Velocity <span className="text-white/20">/ 7D PERIOD</span>
                        </h4>
                    </div>

                    <div className="h-56 flex items-end justify-between gap-4 px-4 border-b border-white/5 pb-4">
                        {dailyData.map((val, i) => {
                            const height = (val / maxDaily) * 100;

                            // Color logic
                            let barColor = 'bg-[#22C55E]';
                            if (val === 0) barColor = 'bg-white/5';
                            else if (val < 15000) barColor = 'bg-[#FFDA00]';
                            else if (val < 35000) barColor = 'bg-blue-500';

                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-4 group relative">
                                    <div
                                        className={`w-full ${barColor}/20 group-hover:${barColor} border border-transparent group-hover:border-white/20 transition-all duration-500 relative`}
                                        style={{ height: `${Math.max(height, val > 0 ? 4 : 0)}%` }}
                                    >
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#22C55E] text-white text-[9px] font-black py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-10 shadow-xl tracking-widest uppercase">
                                            Rs. {val.toLocaleString()}
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-black text-white/30 uppercase tracking-tighter">D{i + 1}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Parameters Section */}
                <div className="bg-[#121212] border border-white/5 p-8 shadow-2xl relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#22C55E]/50 to-transparent"></div>

                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E]">
                            <Calculator size={18} />
                        </div>
                        <h4 className="text-xs font-black text-white uppercase tracking-widest text-[#FFDA00]">Algorithmic Strategy</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                        <div>
                            <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Fuel Index</p>
                            <p className="font-black text-white text-lg tracking-widest">Rs. {FUEL_PRICE}<span className="text-[10px] text-white/20">/L</span></p>
                        </div>
                        <div>
                            <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Base Efficiency</p>
                            <p className="font-black text-white text-lg tracking-tighter">{EFFICIENCY.sedan} KM/L <span className="text-[10px] text-white/20">/SEDAN</span></p>
                        </div>
                        <div>
                            <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Heavy Ops Eff.</p>
                            <p className="font-black text-white text-lg tracking-tighter">{EFFICIENCY.van} KM/L <span className="text-[10px] text-white/20">/VAN</span></p>
                        </div>
                        <div>
                            <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Tracked Vector</p>
                            <p className="font-black text-[#22C55E] text-lg tracking-widest">{stats.totalDistance.toFixed(0)} <span className="text-[10px] text-white/20">TOTAL KM</span></p>
                        </div>
                    </div>

                    <div className="mt-10 p-4 bg-white/5 border border-white/5">
                        <p className="text-[9px] text-white/20 font-black uppercase tracking-widest flex items-center gap-2">
                            <Activity size={12} />
                            NET Formula: Σ(Price) - Σ((Dist / Eff) * Index)
                        </p>
                    </div>
                </div>
            </div>

            {/* Detailed Profit Breakdown Table */}
            <div className="bg-[#121212] border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="px-8 py-6 border-b border-white/5 flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 bg-[#FFDA00] flex items-center justify-center text-black">
                        <TrendingUp size={20} />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Operation Breakdown</h3>
                </div>

                <div className="overflow-x-auto relative z-10">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-left">
                                <th className="px-8 py-4 text-[10px] font-black text-white/40 uppercase tracking-widest">Operation Timestamp</th>
                                <th className="px-8 py-4 text-[10px] font-black text-white/40 uppercase tracking-widest">Classification</th>
                                <th className="px-8 py-4 text-[10px] font-black text-white/40 uppercase tracking-widest">Asset Category</th>
                                <th className="px-8 py-4 text-[10px] font-black text-white/40 uppercase tracking-widest">Distance</th>
                                <th className="px-8 py-4 text-[10px] font-black text-white/40 uppercase tracking-widest">Gross Value</th>
                                <th className="px-8 py-4 text-[10px] font-black text-white/40 uppercase tracking-widest">Fuel Overhead</th>
                                <th className="px-8 py-4 text-[10px] font-black text-[#22C55E] uppercase tracking-widest">Net Yield</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
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
                                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                                            <td className="px-8 py-5 text-[11px] font-black text-white/60 uppercase tracking-widest">{b.scheduledDate || 'N/A'}</td>
                                            <td className="px-8 py-5">
                                                <span className={`text-[9px] font-black px-2 py-0.5 uppercase tracking-widest border ${isPackage ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20'}`}>
                                                    {isTour ? 'TOUR OPS' : isDayTrip ? 'DAY TRIP' : 'TRANSFER'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="text-[11px] font-black text-white uppercase tracking-tighter">
                                                    {isPackage ? (b.tourDetails?.tourTitle || (isDayTrip ? 'DAY TRIP' : 'TOUR PACKAGE')) : type}
                                                </div>
                                                {isPackage && <div className="text-[9px] text-white/30 uppercase font-bold mt-1">L: {b.tourDetails?.duration}</div>}
                                            </td>
                                            <td className="px-8 py-5 text-[11px] font-black text-white/60 tracking-widest">{dist} KM</td>
                                            <td className="px-8 py-5 text-[11px] font-black text-white tracking-widest">RS. {(b.totalPrice || 0).toLocaleString()}</td>
                                            <td className="px-8 py-5 text-[11px] font-black text-orange-500 tracking-widest">RS. {cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                            <td className="px-8 py-5 text-[11px] font-black text-[#22C55E] bg-[#22C55E]/5 tracking-widest border-l-2 border-l-[#22C55E]/20">RS. {profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
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
