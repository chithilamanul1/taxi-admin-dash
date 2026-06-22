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
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedBooking, setSelectedBooking] = React.useState<any | null>(null);

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

    const filteredBookings = ACTIVE_BOOKINGS.filter(booking => {
        if (!searchQuery.trim()) return true;
        const searchLower = searchQuery.toLowerCase();
        return (
            booking.customerName.toLowerCase().includes(searchLower) ||
            booking.id.toLowerCase().includes(searchLower) ||
            booking.pickupLocation.toLowerCase().includes(searchLower) ||
            booking.dropLocation.toLowerCase().includes(searchLower)
        );
    });

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
                                    placeholder="Search customer name, ref..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-600 transition-all w-64 shadow-sm text-emerald-950 font-semibold placeholder:text-slate-400"
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
                                    {filteredBookings.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-8 py-10 text-center text-gray-400 font-bold">
                                                No bookings found matching "{searchQuery}"
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredBookings.map((booking) => (
                                            <tr 
                                                key={booking.id} 
                                                onClick={() => setSelectedBooking(booking)}
                                                className="hover:bg-slate-50/50 transition-colors group border-b border-slate-100 cursor-pointer"
                                            >
                                                <td className="px-8 py-6">
                                                    <span className="font-mono text-xs text-emerald-600 bg-emerald-600/10 px-2 py-1 rounded border border-emerald-600/10">#{booking.id.toUpperCase()}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <p className="font-bold text-emerald-900">{booking.customerName}</p>
                                                    <p className="text-xs text-gray-500">Regular Client</p>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> {booking.pickupLocation}
                                                        </p>
                                                        <p className="text-sm font-medium flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> {booking.dropLocation}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-sm">
                                                    <p className="font-bold text-emerald-900">{booking.date}</p>
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
                                                <td className="px-8 py-6 text-center" onClick={(e) => e.stopPropagation()}>
                                                    <button 
                                                        onClick={() => setSelectedBooking(booking)}
                                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-emerald-900"
                                                    >
                                                        <MoreVertical size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
                            <AlertCircle size={18} className="text-emerald-600" />
                            <p className="text-sm text-gray-500 font-medium">
                                Showing {filteredBookings.length} of {ACTIVE_BOOKINGS.length} active bookings. Auto-refreshing every 30 seconds.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Booking Details Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-scale-up">
                        <div className="bg-emerald-900 text-white p-6 relative">
                            <h3 className="text-xl font-bold">Booking Details</h3>
                            <p className="text-emerald-300 text-xs mt-1">Reference: #{selectedBooking.id.toUpperCase()}</p>
                            <button 
                                onClick={() => setSelectedBooking(null)}
                                className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Customer Name</span>
                                    <span className="font-bold text-emerald-900 text-base">{selectedBooking.customerName}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Status</span>
                                    <div className="mt-1">
                                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusColor(selectedBooking.status)}`}>
                                            {selectedBooking.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div className="space-y-3">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Route Details</span>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                        <div>
                                            <span className="text-[9px] font-black text-slate-400 uppercase block">Pickup Location</span>
                                            <span className="text-sm font-medium text-emerald-900">{selectedBooking.pickupLocation}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                        <div>
                                            <span className="text-[9px] font-black text-slate-400 uppercase block">Dropoff Location</span>
                                            <span className="text-sm font-medium text-emerald-900">{selectedBooking.dropLocation}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Date & Time</span>
                                    <span className="text-sm font-bold text-emerald-900">{selectedBooking.date} at {selectedBooking.time}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Vehicle Selected</span>
                                    <span className="text-sm font-bold text-emerald-900">{selectedBooking.vehicleType}</span>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Est. Fare</span>
                                    <span className="text-xs text-slate-500 font-medium">LKR Currency</span>
                                </div>
                                <span className="text-xl font-black text-emerald-900">LKR {selectedBooking.price?.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button 
                                    onClick={() => setSelectedBooking(null)}
                                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
                                >
                                    Close
                                </button>
                                <button className="px-6 py-2.5 bg-emerald-600 text-black font-bold rounded-xl text-sm hover:bg-emerald-500 transition-colors shadow-md shadow-emerald-600/10">
                                    Assign Driver
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
