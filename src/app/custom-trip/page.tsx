'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Plus, Trash2, Calendar, User, Clock, Navigation, CheckCircle, ArrowRight, Loader2, Star, CreditCard, Tag } from 'lucide-react';
import LocationInput from '@/components/LocationInput';
import TripMap from '@/components/TripMap';
import { useRouter } from 'next/navigation';
import { calculateBasePrice } from '@/lib/pricing-util';
import { useCurrency } from '@/context/CurrencyContext';

interface VehiclePricing {
    _id?: string;
    vehicleType: string;
    name: string;
    basePrice: number;
    baseKm: number;
    perKmRate: number;
    tiers?: any[];
}

export default function CustomTripPage() {
    const router = useRouter();
    const { convertPrice, currency } = useCurrency();
    const [stops, setStops] = useState<any[]>([
        { id: 1, type: 'pickup', address: '', lat: null, lon: null },
        { id: 2, type: 'dropoff', address: '', lat: null, lon: null }
    ]);
    const [routeStats, setRouteStats] = useState({ distanceKm: 0, durationMin: 0 });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [vehiclePricing, setVehiclePricing] = useState<VehiclePricing[]>([]);
    const [isLoadingPricing, setIsLoadingPricing] = useState(true);

    // User Details
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '',
        date: '', passengers: 2, vehicleType: 'mini-car', message: ''
    });

    // Fetch Pricing
    useEffect(() => {
        const fetchPricing = async () => {
            try {
                const res = await fetch('/api/pricing?category=ride-now');
                const response = await res.json();
                if (response.success) {
                    setVehiclePricing(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch pricing:', error);
            } finally {
                setIsLoadingPricing(false);
            }
        };
        fetchPricing();
    }, []);

    // Calculate Estimate
    const estimate = useMemo(() => {
        const vehicleData = vehiclePricing.find(v => v.vehicleType === formData.vehicleType) || vehiclePricing[0];
        if (!vehicleData || routeStats.distanceKm === 0) return 0;

        return calculateBasePrice(routeStats.distanceKm, vehicleData, 'one-way');
    }, [routeStats.distanceKm, formData.vehicleType, vehiclePricing]);

    const convertedEstimate = convertPrice(estimate);

    const handleAddStop = () => {
        // Limit to 5 Stopovers (Waypoints)
        const waypointsCount = stops.filter(s => s.type === 'waypoint').length;
        if (waypointsCount >= 5) {
            alert("Maximum of 5 stopovers allowed.");
            return;
        }

        const newStop = { id: Date.now(), type: 'waypoint', address: '', lat: null, lon: null };
        const newStops = [...stops];
        newStops.splice(newStops.length - 1, 0, newStop);
        setStops(newStops);
    };

    const handleRemoveStop = (id) => {
        setStops(stops.filter(s => s.id !== id));
    };

    const handleUpdateStop = (id, data) => {
        setStops(stops.map(s => s.id === id ? { ...s, ...data } : s));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                ...formData,
                pickup: stops[0],
                dropoff: stops[stops.length - 1],
                waypoints: stops.slice(1, stops.length - 1),
                distance: routeStats.distanceKm,
                duration: routeStats.durationMin,
                estimatedPrice: estimate,
                currency: 'LKR'
            };

            const res = await fetch('/api/bookings/custom', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setIsSuccess(true);
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to send request.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-slate-50 rounded-3xl p-8 text-center shadow-2xl">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-black text-[#006064] mb-4">Request Sent!</h2>
                    <p className="text-slate-600 mb-8">
                        We've received your custom itinerary. Our team will review the details and contact you via WhatsApp/Email to finalize the booking.
                    </p>
                    <button onClick={() => router.push('/')} className="w-full py-4 bg-[#006064] text-white rounded-xl font-bold">
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr,450px] gap-8">

                {/* Left Column: Map & Itinerary Builder */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2rem] p-8 shadow-xl border-none">
                        <div className="flex items-center justify-between mb-6 md:mb-8">
                            <div>
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#006064] leading-tight flex items-center gap-3">
                                    <MapPin className="text-[#00A99D]" /> Plan Your Trip
                                </h1>
                                <p className="text-slate-500 text-sm font-medium mt-1 md:mt-2">Build your own multi-stop adventure across Sri Lanka.</p>
                            </div>
                        </div>

                        {/* Stops List */}
                        <div className="space-y-4 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-6 md:left-8 top-8 bottom-8 w-0.5 bg-slate-100 -z-0"></div>

                            {stops.map((stop, index) => (
                                <div key={stop.id} className="relative group" style={{ zIndex: stops.length - index }}>
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-2xl flex items-center justify-center font-black text-base md:text-lg shadow-sm border-2 
                                            ${index === 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                                index === stops.length - 1 ? 'bg-rose-50 border-rose-100 text-rose-600' :
                                                    'bg-white border-slate-100 text-slate-400'}`}>
                                            {index === 0 ? (
                                                <div className="flex flex-col items-center gap-0.5 md:gap-1">
                                                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                                                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-tighter">Start</span>
                                                </div>
                                            ) : index === stops.length - 1 ? (
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <Navigation size={18} className="fill-rose-600 md:size-5" />
                                                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-tighter">End</span>
                                                </div>
                                            ) : (
                                                <span className="text-lg md:text-xl font-black">{index}</span>
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                                    {index === 0 ? 'Pick Up Location' : index === stops.length - 1 ? 'Final Drop Off' : 'Stopover'}
                                                </span>
                                                {stop.type === 'waypoint' && (
                                                    <button onClick={() => handleRemoveStop(stop.id)} className="text-red-400 hover:text-red-600 p-1">
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <LocationInput
                                                    placeholder={index === 0 ? "Enter pickup location" : "Enter destination"}
                                                    value={stop.address}
                                                    onSelect={(loc) => handleUpdateStop(stop.id, { address: loc.address, lat: loc.lat, lon: loc.lon })}
                                                    onChange={(val) => {
                                                        // CRITICAL: Only reset if the value is actually different and NOT just a manual tweak to a selected address
                                                        // This prevents the 'Please select a location' warning from appearing too aggressively
                                                        if (val !== stop.address) {
                                                            handleUpdateStop(stop.id, { address: val, lat: null, lon: null });
                                                        }
                                                    }}
                                                />
                                                {/* Validation Warning - Shifted down to avoid overlapping the Add Stop button */}
                                                {stop.address && (stop.lat === null || stop.lon === null) && (
                                                    <div className="absolute top-full left-0 mt-3 text-[10px] sm:text-xs font-bold text-amber-600 flex items-center gap-1 z-10 bg-amber-50 px-2 py-1 rounded-lg">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                                        Please select a location from the list to calculate distance.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Add Button Logic - Increased padding and z-index to avoid overlap */}
                                    {index < stops.length - 1 && (
                                        <div className="pl-16 md:pl-20 py-4 relative z-30">
                                            <button
                                                onClick={handleAddStop}
                                                className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-[#00A99D] hover:text-[#006064] transition-colors bg-cyan-50 hover:bg-cyan-100 px-3 py-1.5 rounded-full w-fit shadow-sm"
                                            >
                                                <Plus size={14} /> Add Stopover
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Map Visualization */}
                    <div className="bg-white rounded-[2rem] p-2 shadow-xl border-none overflow-hidden h-[400px]">
                        <TripMap
                            pickup={stops[0]}
                            dropoff={stops[stops.length - 1]}
                            waypoints={stops.slice(1, stops.length - 1)}
                            onRouteCalculated={setRouteStats}
                        />
                    </div>
                </div>

                {/* Right Column: Quote Form */}
                <div className="relative">
                    <div className="sticky top-24 bg-white rounded-[2rem] p-8 shadow-2xl border border-[#00A99D]/10">
                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Route Distance</p>
                                <div className="flex items-baseline gap-1 text-[#006064]">
                                    <span className="text-3xl md:text-4xl font-black">{Math.round(routeStats.distanceKm)}</span>
                                    <span className="text-xs md:text-sm font-bold opacity-60">km</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Approx. Time</p>
                                <div className="flex items-baseline gap-1 text-[#006064] justify-end">
                                    <span className="text-3xl md:text-4xl font-black">
                                        {Math.floor(routeStats.durationMin / 60)}<span className="text-base md:text-lg text-slate-400">h</span> {routeStats.durationMin % 60}<span className="text-base md:text-lg text-slate-400">m</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Estimated Price Section */}
                        {routeStats.distanceKm > 0 && (
                            <div className="mb-8 p-6 bg-emerald-900 rounded-3xl text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 text-emerald-400 mb-2">
                                        <Tag size={14} className="fill-emerald-400/20" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Estimated Rate</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black">{convertedEstimate.symbol} {convertedEstimate.value.toLocaleString()}</span>
                                        <span className="text-xs font-bold text-emerald-400/60 uppercase">{currency}</span>
                                    </div>
                                    <p className="text-[10px] text-white/40 mt-3 font-medium flex items-center gap-1.5 leading-relaxed italic">
                                        <Star size={10} fill="currentColor" /> Final price may vary based on vehicle availability and exact stops.
                                    </p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h3 className="text-xl font-bold text-[#006064] mb-4">Request Your Quote</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Your Name</label>
                                    <input
                                        required
                                        className="w-full bg-slate-50 rounded-xl px-4 py-3 font-bold outline-none border border-slate-100 focus:border-[#00A99D] transition-colors text-slate-900"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Mobile / WhatsApp</label>
                                    <input
                                        required
                                        className="w-full bg-slate-50 rounded-xl px-4 py-3 font-bold outline-none border border-slate-100 focus:border-[#00A99D] transition-colors text-slate-900"
                                        placeholder="+94..."
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full bg-slate-50 rounded-xl px-4 py-3 font-bold outline-none border border-slate-100 focus:border-[#00A99D] transition-colors text-slate-900"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Travel Date</label>
                                    <input
                                        required
                                        type="date"
                                        className="w-full bg-slate-50 rounded-xl px-4 py-3 font-bold outline-none border border-slate-100 focus:border-[#00A99D] transition-colors text-slate-900"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Group Size</label>
                                    <select
                                        className="w-full bg-slate-50 rounded-xl px-4 py-3 font-bold outline-none border border-slate-100 focus:border-[#00A99D] transition-colors text-slate-900"
                                        value={formData.passengers}
                                        onChange={e => setFormData({ ...formData, passengers: parseInt(e.target.value) })}
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map(n => (
                                            <option key={n} value={n}>{n} Pax</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Preferred Vehicle</label>
                                <select
                                    className="w-full bg-slate-50 rounded-xl px-4 py-3 font-bold outline-none border border-slate-100 focus:border-[#00A99D] transition-colors text-slate-900"
                                    value={formData.vehicleType}
                                    onChange={e => setFormData({ ...formData, vehicleType: e.target.value })}
                                >
                                    {isLoadingPricing ? (
                                        <option>Loading vehicles...</option>
                                    ) : (
                                        vehiclePricing.map(v => (
                                            <option key={v.vehicleType} value={v.vehicleType}>{v.name}</option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Special Requirements</label>
                                <textarea
                                    className="w-full bg-slate-50 rounded-xl px-4 py-3 font-bold outline-none border border-slate-100 focus:border-[#00A99D] transition-colors min-h-[80px] text-slate-900"
                                    placeholder="Extra luggage, child seats, etc..."
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-5 bg-[#006064] text-white rounded-2xl font-black text-lg shadow-xl shadow-cyan-900/20 hover:bg-[#004D40] hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" /> : <>Contact for Best Quote <ArrowRight size={20} /></>}
                            </button>
                            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">24/7 dedicated travel support</p>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}
