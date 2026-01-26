"use client";

import React from 'react';
import {
    Users,
    TrendingUp,
    Map,
    Clock,
    Search,
    Filter,
    MoreVertical,
    Download,
    AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { ACTIVE_BOOKINGS } from '@/lib/mock-taxi-db';

export default function AdminDashboard() {
    const stats = [
        { label: "Total Rides Today", value: "8", icon: <Clock className="text-blue-400" />, trend: "+12%" },
        { label: "Daily Revenue", value: "LKR 145,000", icon: <TrendingUp className="text-green-400" />, trend: "+8.5%" },
        { label: "Active Drivers", value: "32", icon: <Users className="text-emerald-600" />, trend: "Steady" },
        { label: "Fleet Utilization", value: "88%", icon: <Map className="text-purple-400" />, trend: "+4%" },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-500/20 text-green-400 border-green-500/20';
            case 'Driver Assigned': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
            case 'Pending Driver': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-emerald-900 pt-24 pb-12 px-8">
            <div className="max-w-[1600px] mx-auto space-y-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                            Dispatcher <span className="text-emerald-600 underline underline-offset-8 decoration-emerald-600/30">Control Centre</span>
                        </h1>
                        <p className="text-gray-500 font-medium">Real-time terminal for airport operations & luxury transfers.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm">
                            <Download size={18} /> Export Data
                        </button>
                        <button className="px-5 py-2.5 bg-emerald-600 text-black rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-emerald-600/20">
                            New Direct Booking
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <Card key={idx} className="relative overflow-hidden group bg-white border-slate-200 shadow-sm transition-all hover:shadow-md">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/5 blur-3xl -mr-12 -mt-12 group-hover:bg-emerald-600/10 transition-colors" />
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                        {React.cloneElement(stat.icon as React.ReactElement<{ size: number }>, { size: 24 })}
                                    </div>
                                    <span className="text-xs font-bold text-gray-500 bg-slate-100 py-1 px-2 rounded-lg border border-slate-200">{stat.trend}</span>
                                </div>
                                <h3 className="text-gray-500 text-sm font-bold uppercase tracking-widest">{stat.label}</h3>
                                <p className="text-3xl font-black mt-1">{stat.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Bookings Table */}
                <Card className="border-slate-200 bg-white shadow-sm">
                    <CardHeader className="flex md:flex-row justify-between items-center border-b border-slate-100 p-8">
                        <div>
                            <CardTitle className="text-2xl font-black">Active Bookings</CardTitle>
                            <CardDescription>Live dispatch queue for today's transfers.</CardDescription>
                        </div>
                        <div className="flex gap-4 mt-4 md:mt-0">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-600 transition-colors" size={18} />
                                <input
                                    placeholder="Search ref, customer, or location..."
                                    className="bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-600 transition-all w-64 shadow-sm"
                                />
                            </div>
                            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-emerald-900 transition-colors shadow-sm">
                                <Filter size={18} />
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-emerald-900">
                                        <th className="px-8 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Reference</th>
                                        <th className="px-8 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Customer</th>
                                        <th className="px-8 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Route (Pickup to Drop)</th>
                                        <th className="px-8 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Schedule</th>
                                        <th className="px-8 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Vehicle</th>
                                        <th className="px-8 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-5 text-center text-xs font-black text-gray-500 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {ACTIVE_BOOKINGS.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group border-b border-slate-100">
                                            <td className="px-8 py-6">
                                                <span className="font-mono text-xs text-emerald-600 bg-emerald-600/10 px-2 py-1 rounded border border-emerald-600/10">#{booking.id.toUpperCase()}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="font-bold text-slate-900">{booking.customerName}</p>
                                                <p className="text-xs text-gray-500">Regular Client</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-blue-400" /> {booking.pickupLocation}
                                                    </p>
                                                    <p className="text-sm font-medium flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-red-400" /> {booking.dropLocation}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-sm">
                                                <p className="font-bold text-slate-900">{booking.date}</p>
                                                <p className="text-gray-500">{booking.time}</p>
                                            </td>
                                            <td className="px-8 py-6 text-sm text-slate-700 font-medium">
                                                {booking.vehicleType}
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusColor(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-emerald-900">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
                            <AlertCircle size={18} className="text-emerald-600" />
                            <p className="text-sm text-gray-500 font-medium">
                                Showing {ACTIVE_BOOKINGS.length} active bookings for terminal tracking. Auto-refreshing every 30 seconds.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
