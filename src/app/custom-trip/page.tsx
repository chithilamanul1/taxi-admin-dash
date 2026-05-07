'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Plus, Trash2, Calendar, User, Clock, Navigation, CheckCircle, ArrowRight, Loader2, Star, CreditCard, Tag, Compass, Sparkles } from 'lucide-react';
import LocationInput from '@/components/LocationInput';
import TripMap from '@/components/TripMap';
import { useRouter } from 'next/navigation';
import { calculateBasePrice } from '@/lib/pricing-util';
import { useCurrency } from '@/context/CurrencyContext';
import Link from 'next/link';
import TripPlannerClient from '@/components/TripPlannerClient';

interface VehiclePricing {
    _id?: string;
    vehicleType: string;
    name: string;
    basePrice: number;
    baseKm: number;
    perKmRate: number;
    tiers?: any[];
}

interface Stop {
    id: number;
    type: string;
    address: string;
    lat: number | null;
    lon: number | null;
}

export default function CustomTripPage() {
    const router = useRouter();
    const { convertPrice, currency } = useCurrency();
    const [stops, setStops] = useState<Stop[]>([
        { id: 1, type: 'pickup', address: '', lat: null, lon: null },
        { id: 2, type: 'dropoff', address: '', lat: null, lon: null }
    ]);
    const [routeStats, setRouteStats] = useState({ distanceKm: 0, durationMin: 0 });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [vehiclePricing, setVehiclePricing] = useState<VehiclePricing[]>([]);
    const [isLoadingPricing, setIsLoadingPricing] = useState(true);
    const [useAI, setUseAI] = useState(false);

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
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl shadow-slate-200 border border-slate-100">
                    <div className="w-24 h-24 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-200">
                        <CheckCircle size={48} className="text-white" strokeWidth={3} />
                    </div>
                    <h2 className="text-4xl font-black text-emerald-950 mb-4 tracking-tight uppercase">REQUEST SENT!</h2>
                    <p className="text-slate-500 mb-10 font-bold uppercase text-[10px] tracking-widest leading-relaxed">
                        We've received your custom itinerary. Our team will review the details and contact you via WhatsApp/Email to finalize the booking.
                    </p>
                    <button 
                        onClick={() => router.push('/')} 
                        className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-1 transition-all"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr,450px] gap-12">

                {/* Left Column: Map & Itinerary Builder */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-200 border border-slate-100">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full mb-4">
                                    <Compass size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Premium Trip Builder</span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black text-emerald-950 leading-none tracking-tight uppercase mb-4">
                                    Plan Your <span className="text-emerald-500">Trip</span>
                                </h1>
                                <p className="text-slate-700 text-xs font-black uppercase tracking-[0.2em]">Build your own multi-stop adventure across Sri Lanka.</p>
                            </div>
                            <button 
                                onClick={() => setUseAI(!useAI)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${useAI ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-emerald-50 hover:text-emerald-600'}`}
                            >
                                <Sparkles size={14} className={useAI ? 'text-white' : 'text-emerald-500'} /> {useAI ? 'Switch to Manual' : 'Use AI Planner'}
                            </button>
                        </div>

                        {useAI ? (
                            <div className="animate-fade-in">
                                <TripPlannerClient isEmbedded={true} />
                            </div>
                        ) : (
                            <div className="space-y-8 relative">
                                {/* Vertical Line */}
                                <div className="absolute left-8 md:left-10 top-8 bottom-8 w-1 bg-slate-50 -z-0"></div>

                                {stops.map((stop, index) => (
                                    <div key={stop.id} className="relative group" style={{ zIndex: stops.length - index }}>
                                        <div className="flex items-start gap-8">
                                            <div className={`w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg transition-all group-hover:scale-105
                                                ${index === 0 ? 'bg-emerald-600 text-white shadow-emerald-200' :
                                                    index === stops.length - 1 ? 'bg-rose-500 text-white shadow-rose-200' :
                                                        'bg-slate-100 text-slate-400 shadow-slate-100'}`}>
                                                {index === 0 ? (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <div className="w-3 h-3 rounded-full bg-emerald-300 animate-pulse" />
                                                        <span className="text-[10px] font-black uppercase tracking-tighter">Start</span>
                                                    </div>
                                                ) : index === stops.length - 1 ? (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <Navigation size={20} className="fill-white" />
                                                        <span className="text-[10px] font-black uppercase tracking-tighter">End</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-2xl font-black">{index}</span>
                                                )}
                                            </div>

                                            <div className="flex-1 space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 ml-2">
                                                        {index === 0 ? 'Pick Up Location' : index === stops.length - 1 ? 'Final Drop Off' : `Stopover ${index}`}
                                                    </span>
                                                    {stop.type === 'waypoint' && (
                                                        <button onClick={() => handleRemoveStop(stop.id)} className="text-rose-500 hover:text-rose-700 p-2 hover:bg-rose-50 rounded-xl transition-all">
                                                            <Trash2 size={18} strokeWidth={3} />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="relative">
                                                    <LocationInput
                                                        placeholder={index === 0 ? "ENTER PICKUP LOCATION" : "ENTER DESTINATION"}
                                                        value={stop.address}
                                                        zIndex={50}
                                                        onSelect={(loc) => handleUpdateStop(stop.id, { address: loc.address, lat: loc.lat, lon: loc.lon })}
                                                        onChange={(val) => {
                                                            if (val !== stop.address) {
                                                                handleUpdateStop(stop.id, { address: val, lat: null, lon: null });
                                                            }
                                                        }}
                                                    />
                                                    {stop.address && (stop.lat === null || stop.lon === null) && (
                                                        <div className="mt-3 text-[10px] font-black text-rose-500 flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-xl border border-rose-100 uppercase tracking-widest animate-fade-in">
                                                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                                                            Please select a location from the list to calculate distance.
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {index < stops.length - 1 && (
                                            <div className="pl-24 md:pl-28 py-6 relative z-30">
                                                <button
                                                    onClick={handleAddStop}
                                                    className="flex items-center gap-3 text-[10px] font-black text-emerald-600 px-6 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 transition-all uppercase tracking-widest"
                                                >
                                                    <Plus size={16} strokeWidth={4} /> Add Stopover
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {!useAI && (
                        <div className="bg-white rounded-[3rem] p-4 shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden h-[500px]">
                            <TripMap
                                pickup={stops[0]}
                                dropoff={stops[stops.length - 1]}
                                waypoints={stops.slice(1, -1)}
                                onRouteCalculated={setRouteStats}
                            />
                        </div>
                    )}
                </div>

                {/* Right Column: Quote Form */}
                {!useAI && (
                    <div className="relative">
                        <div className="sticky top-24 bg-white rounded-[3rem] p-8 shadow-2xl shadow-slate-200 border border-slate-100">
                            <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-100">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 mb-2 leading-none">Route Distance</p>
                                    <div className="flex items-baseline gap-1 text-emerald-950">
                                        <span className="text-5xl font-black tracking-tighter">{Math.round(routeStats.distanceKm)}</span>
                                        <span className="text-sm font-black opacity-30 uppercase">km</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 mb-2 leading-none">Approx. Time</p>
                                    <div className="flex items-baseline gap-1 text-emerald-950 justify-end">
                                        <span className="text-5xl font-black tracking-tighter">
                                            {Math.floor(routeStats.durationMin / 60)}<span className="text-xl text-slate-300">h</span> {routeStats.durationMin % 60}<span className="text-xl text-slate-300">m</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Estimated Price Section */}
                            {routeStats.distanceKm > 0 && (
                                <div className="mb-10 p-8 bg-emerald-950 rounded-[2.5rem] text-white shadow-xl shadow-emerald-100 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 -mr-24 -mt-24 rotate-45 transform pointer-events-none"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 text-emerald-500 mb-2">
                                            <Tag size={16} className="fill-emerald-500/20" strokeWidth={3} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">ESTIMATED RATE</span>
                                        </div>
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-5xl font-black tracking-tighter">{convertedEstimate.symbol} {convertedEstimate.value.toLocaleString()}</span>
                                            <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">{currency}</span>
                                        </div>
                                        <div className="mt-6 flex items-start gap-3 bg-white/5 p-4 rounded-2xl">
                                            <Star size={16} fill="#FACC15" className="text-[#FACC15] shrink-0 mt-0.5" />
                                            <p className="text-[9px] text-white/40 font-black uppercase tracking-widest leading-relaxed">
                                                Final price may vary based on vehicle availability and exact stops.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <h3 className="text-xl font-black text-emerald-950 uppercase tracking-tight mb-8 flex items-center gap-3">
                                    <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                                    Request Quote
                                </h3>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-600 tracking-[0.2em] ml-2">Your Name</label>
                                        <input
                                            required
                                            className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-black outline-none border border-transparent focus:border-emerald-500/20 focus:bg-white transition-all text-emerald-900 uppercase placeholder:text-slate-300"
                                            placeholder="JOHN DOE"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-600 tracking-[0.2em] ml-2">Mobile / WhatsApp</label>
                                        <input
                                            required
                                            className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-black outline-none border border-transparent focus:border-emerald-500/20 focus:bg-white transition-all text-emerald-900 uppercase placeholder:text-slate-300"
                                            placeholder="+94..."
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-600 tracking-[0.2em] ml-2">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-black outline-none border border-transparent focus:border-emerald-500/20 focus:bg-white transition-all text-emerald-900 uppercase placeholder:text-slate-300"
                                        placeholder="JOHN@EXAMPLE.COM"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-600 tracking-[0.2em] ml-2">Travel Date</label>
                                        <input
                                            required
                                            type="date"
                                            className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-black outline-none border border-transparent focus:border-emerald-500/20 focus:bg-white transition-all text-emerald-900 uppercase"
                                            value={formData.date}
                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-600 tracking-[0.2em] ml-2">Group Size</label>
                                        <select
                                            className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-black outline-none border border-transparent focus:border-emerald-500/20 focus:bg-white transition-all text-emerald-900 uppercase appearance-none"
                                            value={formData.passengers}
                                            onChange={e => setFormData({ ...formData, passengers: parseInt(e.target.value) })}
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map(n => (
                                                <option key={n} value={n}>{n} PAX</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-600 tracking-[0.2em] ml-2">Preferred Vehicle</label>
                                    <select
                                        className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-black outline-none border border-transparent focus:border-emerald-500/20 focus:bg-white transition-all text-emerald-900 uppercase appearance-none"
                                        value={formData.vehicleType}
                                        onChange={e => setFormData({ ...formData, vehicleType: e.target.value })}
                                    >
                                        {isLoadingPricing ? (
                                            <option>LOADING VEHICLES...</option>
                                        ) : (
                                            vehiclePricing.map(v => (
                                                <option key={v.vehicleType} value={v.vehicleType}>{v.name.toUpperCase()}</option>
                                            ))
                                        )}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-600 tracking-[0.2em] ml-2">Requirement</label>
                                    <textarea
                                        className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-black outline-none border border-transparent focus:border-emerald-500/20 focus:bg-white transition-all min-h-[100px] text-emerald-900 uppercase placeholder:text-slate-300"
                                        placeholder="EXTRA LUGGAGE, CHILD SEATS, ETC..."
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-4 uppercase tracking-widest"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : <>SEND QUOTE REQUEST <ArrowRight size={20} strokeWidth={4} /></>}
                                </button>
                                <div className="flex items-center justify-center gap-4 mt-8">
                                    <div className="h-0.5 flex-1 bg-slate-100"></div>
                                    <p className="text-center text-[8px] text-slate-300 font-black uppercase tracking-[0.4em]">24/7 DEDICATED SUPPORT</p>
                                    <div className="h-0.5 flex-1 bg-slate-100"></div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
