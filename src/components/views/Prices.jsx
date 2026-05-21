'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MapPin, Navigation, ArrowRightLeft, Loader2, Info, Users, Lock, Briefcase, Wind, Zap } from 'lucide-react'
import { debounce } from '@/lib/utils'
import { useCurrency } from '@/context/CurrencyContext'
import { calculateBasePrice } from '@/lib/pricing-util'
import { destinations as staticDestinations } from '@/lib/destinations'

const displayName = (name) => (name || '').replace(/\bKDH\s*/gi, '').trim();

// Tiered Pricing Configuration (in LKR - Sri Lankan Rupees)
const VEHICLE_PRICING = {
    'mini-car': {
        name: 'MINI CAR',
        model: '',
        image: '/vehicles/minicar.png',
        specs: {
            luggage: 2,
            handLuggage: 2,
            ac: true
        },
        maxPassengers: 2,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 3500 },
            { min: 20, max: 40, type: 'flat', price: 4000 },
            { min: 40, max: 130, type: 'per_km', rate: 102 },
            { min: 130, max: Infinity, type: 'per_km', rate: 102 }
        ]
    },
    'sedan': {
        name: 'SEDAN',
        model: '',
        image: '/vehicles/sedan2.png',
        specs: {
            luggage: 3,
            handLuggage: 3,
            ac: true
        },
        maxPassengers: 3,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 4500 },
            { min: 20, max: 40, type: 'flat', price: 6000 },
            { min: 40, max: 50, type: 'per_km', rate: 150 },
            { min: 50, max: 100, type: 'per_km', rate: 130 },
            { min: 100, max: 140, type: 'per_km', rate: 120 },
            { min: 140, max: 200, type: 'per_km', rate: 115 },
            { min: 200, max: Infinity, type: 'per_km', rate: 110 }
        ]
    },
    'mini-van-every': {
        name: 'MINI VAN (Every)',
        model: '',
        image: '/vehicles/susukievery.png',
        specs: {
            luggage: 3,
            handLuggage: 3,
            ac: true
        },
        maxPassengers: 3,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 4500 },
            { min: 20, max: 40, type: 'flat', price: 6000 },
            { min: 40, max: 50, type: 'per_km', rate: 150 },
            { min: 50, max: 100, type: 'per_km', rate: 130 },
            { min: 100, max: 140, type: 'per_km', rate: 120 },
            { min: 140, max: 200, type: 'per_km', rate: 115 },
            { min: 200, max: Infinity, type: 'per_km', rate: 110 }
        ]
    },
    'mini-van-05': {
        name: 'MINI VAN (4 Seat)',
        model: '',
        image: '/vehicles/minivan5seat.png',
        specs: {
            luggage: 4,
            handLuggage: 4,
            ac: true
        },
        maxPassengers: 4,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 6000 },
            { min: 20, max: 40, type: 'flat', price: 8500 },
            { min: 40, max: 100, type: 'per_km', rate: 200 },
            { min: 100, max: 140, type: 'per_km', rate: 160 },
            { min: 140, max: 200, type: 'per_km', rate: 130 },
            { min: 200, max: Infinity, type: 'per_km', rate: 120 }
        ]
    },
    'suv': {
        name: 'SUV',
        model: '',
        image: '/vehicles/Hondavezel.png',
        specs: {
            luggage: 3,
            handLuggage: 3,
            ac: true
        },
        maxPassengers: 3,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 6500 },
            { min: 20, max: 40, type: 'flat', price: 9500 },
            { min: 40, max: 100, type: 'per_km', rate: 150 },
            { min: 100, max: 140, type: 'per_km', rate: 145 },
            { min: 140, max: 200, type: 'per_km', rate: 140 },
            { min: 200, max: Infinity, type: 'per_km', rate: 135 }
        ]
    },
    'vezel': {
        name: 'HONDA VEZEL',
        model: '',
        image: '/vehicles/Hondavezel.png',
        specs: {
            luggage: 3,
            handLuggage: 3,
            ac: true
        },
        maxPassengers: 3,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 6500 },
            { min: 20, max: 40, type: 'flat', price: 9500 },
            { min: 40, max: 100, type: 'per_km', rate: 150 },
            { min: 100, max: 140, type: 'per_km', rate: 145 },
            { min: 140, max: 200, type: 'per_km', rate: 140 },
            { min: 200, max: Infinity, type: 'per_km', rate: 135 }
        ]
    },
    'normal-kdh': {
        name: 'VAN (KDH Flat Roof)',
        model: '',
        image: '/vehicles/van.png',
        maxPassengers: 6,
        imageScale: 1.35,
        specs: {
            luggage: 7,
            handLuggage: 7,
            ac: true
        },
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 6000 },
            { min: 20, max: 40, type: 'flat', price: 8500 },
            { min: 40, max: 100, type: 'per_km', rate: 200 },
            { min: 100, max: 140, type: 'per_km', rate: 160 },
            { min: 140, max: 200, type: 'per_km', rate: 130 },
            { min: 200, max: Infinity, type: 'per_km', rate: 120 }
        ]
    },
    'kdh-van': {
        name: 'MINI BUS (KDH High Roof)',
        model: '',
        image: '/vehicles/toyota-highroof.png',
        specs: {
            luggage: 8,
            handLuggage: 6,
            ac: true
        },
        maxPassengers: 8,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 6000 },
            { min: 20, max: 40, type: 'flat', price: 8500 },
            { min: 40, max: 100, type: 'per_km', rate: 200 },
            { min: 100, max: 140, type: 'per_km', rate: 160 },
            { min: 140, max: 200, type: 'per_km', rate: 130 },
            { min: 200, max: Infinity, type: 'per_km', rate: 120 }
        ]
    },
    'mini-bus': {
        name: 'COASTER BUS',
        model: '',
        image: '/vehicles/costerbus.png',
        specs: {
            luggage: 8,
            handLuggage: 6,
            ac: true
        },
        maxPassengers: 8,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 7500 },
            { min: 20, max: 40, type: 'flat', price: 12000 },
            { min: 40, max: 100, type: 'per_km', rate: 220 },
            { min: 100, max: 140, type: 'per_km', rate: 220 },
            { min: 140, max: 200, type: 'per_km', rate: 175 },
            { min: 200, max: Infinity, type: 'per_km', rate: 155 }
        ]
    },
    'coach-bus': {
        name: 'COACH BUS',
        model: '',
        image: '/vehicles/coach-bus.png',
        specs: {
            luggage: 30,
            handLuggage: 20,
            ac: true
        },
        maxPassengers: 40,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 15000 },
            { min: 20, max: 40, type: 'flat', price: 20000 },
            { min: 40, max: 100, type: 'per_km', rate: 300 },
            { min: 100, max: 140, type: 'per_km', rate: 300 },
            { min: 140, max: 200, type: 'per_km', rate: 250 },
            { min: 200, max: Infinity, type: 'per_km', rate: 220 }
        ]
    }
}

// Local pricing calculation removed in favor of centralized pricing-util

const Prices = ({ initialDestination }) => {
    const [pickup, setPickup] = useState({ name: 'Bandaranaike International Airport (CMB)', lat: 7.1804, lon: 79.8837 })
    const [dropoff, setDropoff] = useState({ name: '', lat: null, lon: null })
    const [pickupSearch, setPickupSearch] = useState('Bandaranaike International Airport (CMB)')
    const [dropoffSearch, setDropoffSearch] = useState('')
    const [pickupResults, setPickupResults] = useState([])
    const [dropoffResults, setDropoffResults] = useState([])

    const [distance, setDistance] = useState(null)
    const [loading, setLoading] = useState(false)
    const [tripType, setTripType] = useState('one-way')
    const [vehicle, setVehicle] = useState('mini-car')
    const [passengers, setPassengers] = useState(1)
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [email, setEmail] = useState('')
    const [whatsapp, setWhatsapp] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('card')
    const [boardShow, setBoardShow] = useState(false)
    const [boardName, setBoardName] = useState('')
    const [flightNumber, setFlightNumber] = useState('')
    const [arrivalDate, setArrivalDate] = useState('')
    const [arrivalTime, setArrivalTime] = useState('')
    const [isVehicleListExpanded, setIsVehicleListExpanded] = useState(true)
    const [dynamicDestinations, setDynamicDestinations] = useState([])
    const [pricingSettings, setPricingSettings] = useState({ nameBoardPrice: 2000 })

    useEffect(() => {
        fetch('/api/destinations').then(res => res.json()).then(data => {
            if (data.success) setDynamicDestinations(data.data)
        }).catch(err => console.error(err))

        fetch('/api/pricing-settings').then(res => res.json()).then(data => {
            if (data.success && data.data) setPricingSettings(data.data)
        }).catch(err => console.error(err))
    }, [])

    const { currency, rates, changeCurrency } = useCurrency()

    const SUPPORTED_CURRENCIES = [
        { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee', flag: '🇱🇰' },
        { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
        { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
        { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
        { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
    ];

    const convertToAllCurrencies = (amountLKR) => {
        return SUPPORTED_CURRENCIES.map(c => {
            const rate = rates?.[c.code] || 1;
            const convertedRaw = amountLKR * rate;
            const value = c.code === 'LKR' ? Math.round(amountLKR) : Number(convertedRaw.toFixed(2));
            return { ...c, value };
        });
    };

    // Refs for scrolling
    const quoteRef = useRef(null)

    // Exchange rate logic removed as it now uses global context

    // Handle initial destination from props (Popular Routes)
    useEffect(() => {
        if (initialDestination) {
            setDropoffSearch(initialDestination)
            searchLocation(initialDestination, setDropoffResults)
        }
    }, [initialDestination])

    // Auto-switch vehicle if passenger count exceeds capacity
    useEffect(() => {
        const currentCapacity = VEHICLE_PRICING[vehicle].maxPassengers;
        if (passengers > currentCapacity) {
            // Find the first vehicle that can fit the passengers
            const suitableVehicle = Object.keys(VEHICLE_PRICING).find(key =>
                VEHICLE_PRICING[key].maxPassengers >= passengers
            );
            if (suitableVehicle) {
                setVehicle(suitableVehicle);
            }
        }
    }, [passengers, vehicle]);

    // Search logic using Photon API
    const searchLocation = async (query, setResults) => {
        if (query.length < 3) return
        try {
            const res = await fetch("https://photon.komoot.io/api/?q=" + query + "&limit=5&lang=en&bbox=79.5,5.8,82.0,10.0")
            const data = await res.json()
            setResults(data.features.map(f => ({
                name: (f.properties.name || '') + " " + (f.properties.city || f.properties.state || ''),
                lat: f.geometry.coordinates[1],
                lon: f.geometry.coordinates[0]
            })))
        } catch (err) { console.error(err) }
    }

    const debouncedSearchPickup = useRef(debounce((q) => searchLocation(q, setPickupResults), 500)).current
    const debouncedSearchDropoff = useRef(debounce((q) => searchLocation(q, setDropoffResults), 500)).current

    // Calculate route using OSRM
    useEffect(() => {
        if (pickup.lat && pickup.lon && dropoff.lat && dropoff.lon) {
            const getDistance = async () => {
                setLoading(true)
                try {
                    const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${pickup.lon},${pickup.lat};${dropoff.lon},${dropoff.lat}?overview=false`)
                    const data = await res.json()
                    if (data.routes && data.routes[0]) {
                        setDistance(data.routes[0].distance / 1000) // Convert to KM
                    }
                } catch (err) { console.error(err) }
                setLoading(false)
            }
            getDistance()
        }
    }, [pickup, dropoff])

    return (
        <div className="pt-32 pb-20 max-w-6xl mx-auto px-6  transition-colors">
            <div id="prices" className="py-12 text-center scroll-mt-32">
                <h1 className="text-4xl md:text-5xl font-black text-emerald-950 mb-4 tracking-tight">Price <span className="text-[#FACC15] ">Calculator</span></h1>
                <p className="text-gray-500 max-w-2xl mx-auto font-medium text-sm">Select your pickup and destination points for an instant, transparent quote.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mt-8">
                {/* Left: Input Controls */}
                <div className="space-y-8 bg-white p-8 md:p-12 rounded-[2rem] border border-gray-100 shadow-2xl">

                    {/* Pickup Search */}
                    <div className="relative">
                        <label className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-widest mb-3">
                            <MapPin size={16} className="text-emerald-600 " /> Pickup Point
                        </label>
                        <input
                            type="text"
                            value={pickupSearch}
                            onChange={(e) => {
                                setPickupSearch(e.target.value)
                                debouncedSearchPickup(e.target.value)
                            }}
                            placeholder="Start searching..."
                            className="w-full bg-slate-50/50 border border-gray-200 px-6 py-4 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#FACC15]/30 focus:border-[#FACC15] outline-none text-emerald-950 placeholder:text-gray-400 font-medium transition-all shadow-sm"
                        />
                        {pickupResults.length > 0 && (
                            <div className="absolute z-20 w-full mt-2 bg-white  shadow-2xl rounded-2xl border border-gray-100  overflow-hidden">
                                {pickupResults.map((r, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setPickup(r)
                                            setPickupSearch(r.name)
                                            setPickupResults([])
                                        }}
                                        className="w-full text-left px-6 py-4 hover:bg-slate-50  border-b border-gray-50  last:border-none flex items-center gap-3 text-emerald-900 "
                                    >
                                        <Navigation size={14} className="text-gray-400" />
                                        <span>{r.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Dropoff Search */}
                    <div className="relative">
                        <label className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-widest mb-3">
                            <MapPin size={16} className="text-emerald-900 " /> Destination
                        </label>
                        <input
                            type="text"
                            value={dropoffSearch}
                            onChange={(e) => {
                                setDropoffSearch(e.target.value)
                                debouncedSearchDropoff(e.target.value)
                            }}
                            placeholder="Where are you going?"
                            className="w-full bg-slate-50/50 border border-gray-200 px-6 py-4 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#FACC15]/30 focus:border-[#FACC15] outline-none text-emerald-950 placeholder:text-gray-400 font-medium transition-all shadow-sm"
                        />
                        {dropoffResults.length > 0 && (
                            <div className="absolute z-20 w-full mt-2 bg-white  shadow-2xl rounded-2xl border border-gray-100  overflow-hidden">
                                {dropoffResults.map((r, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setDropoff(r)
                                            setDropoffSearch(r.name)
                                            setDropoffResults([])
                                        }}
                                        className="w-full text-left px-6 py-4 hover:bg-slate-50  border-b border-gray-50  last:border-none flex items-center gap-3 text-emerald-900 "
                                    >
                                        <Navigation size={14} className="text-gray-400" />
                                        <span>{r.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Passengers & Trip Type Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-widest mb-3">
                            <Users size={16} className="text-emerald-600 " /> Passengers
                        </label>
                            <div className="flex items-center justify-between bg-slate-50/50 px-4 py-3 rounded-2xl border border-gray-100 shadow-inner">
                                <span className="text-xs font-black text-emerald-950 uppercase tracking-wider mr-2">Count:</span>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setPassengers(Math.max(1, passengers - 1))}
                                        className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-emerald-950 font-bold hover:bg-emerald-600/10 hover:border-emerald-600 active:translate-y-1 transition-all text-xl"
                                        aria-label="Decrease passengers"
                                    >
                                        -
                                    </button>
                                    <span className="font-black text-emerald-950 text-xl w-6 text-center">{passengers}</span>
                                    <button
                                        onClick={() => setPassengers(Math.min(15, passengers + 1))}
                                        className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-emerald-950 font-bold hover:bg-emerald-600/10 hover:border-emerald-600 active:translate-y-1 transition-all text-xl"
                                        aria-label="Increase passengers"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-widest mb-3">
                            <ArrowRightLeft size={16} className="text-emerald-900 " /> Trip Type
                        </label>
                            <div className="flex bg-slate-50/50 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
                                {['one-way', 'round-trip'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setTripType(t)}
                                        className={`flex-1 py-2.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${tripType === t ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-emerald-950'}`}
                                    >
                                        {t === 'one-way' ? 'One Way' : 'Return'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Details (Email & WhatsApp) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                <span className="text-emerald-600">✉️</span> Your Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 py-4 rounded-2xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-emerald-950 dark:text-white placeholder:text-slate-400 font-medium transition-all shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                <span className="text-emerald-600">📱</span> WhatsApp No.
                            </label>
                            <input
                                type="tel"
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                                placeholder="+1 66 77 88 99 ..."
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 py-4 rounded-2xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-emerald-950 dark:text-white placeholder:text-slate-400 font-medium transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Date, Time & Payment Method */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                <span className="text-emerald-600">📅</span> Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 py-4 rounded-2xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-emerald-950 dark:text-white font-medium transition-all shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                <span className="text-emerald-600">⏰</span> Time
                            </label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 py-4 rounded-2xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-emerald-950 dark:text-white font-medium transition-all shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-400  uppercase tracking-widest mb-3">
                                <span className="text-emerald-600 ">💳</span> Payment
                            </label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full bg-slate-50/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 py-4 rounded-2xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none cursor-pointer text-emerald-950 dark:text-white font-medium transition-all shadow-sm appearance-none"
                            >
                                <option value="cash">Cash to Driver</option>
                                <option value="card">Card Payment</option>
                            </select>
                        </div>
                    </div>

                    {/* Airport Greeting (Board Show) Option */}
                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:bg-white dark:hover:bg-white/10 hover:shadow-xl group mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg shadow-emerald-200 dark:shadow-none transition-transform group-hover:scale-110">
                                🛫
                            </div>
                            <div>
                                <h4 className="text-emerald-950 dark:text-white font-bold text-lg">Airport Greeting</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-xs max-w-xs">Driver will wait with a name board at arrival terminal hall.</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <div className="flex flex-col items-end">
                                <span className="text-emerald-600 dark:text-emerald-400 font-black text-xl">+ Rs {(pricingSettings?.nameBoardPrice || 2000).toLocaleString()}</span>
                                {rates?.USD && (
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        ≈ ${((pricingSettings?.nameBoardPrice || 2000) * rates.USD).toFixed(2)} USD
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={boardShow}
                                        onChange={(e) => setBoardShow(e.target.checked)}
                                    />
                                    <div className="w-14 h-7 bg-slate-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-[20px] after:w-[20px] after:transition-all peer-checked:bg-emerald-600 shadow-inner"></div>
                                </label>
                            </div>

                            {/* Input for Name on Board & Flight Details */}
                            <div className={`transition-all duration-500 overflow-hidden ${boardShow ? 'max-h-96 opacity-100 w-full mt-6' : 'max-h-0 opacity-0 w-0'}`}>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={boardName}
                                            onChange={(e) => setBoardName(e.target.value)}
                                            placeholder="Customer's Name"
                                            className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 px-5 py-3.5 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none shadow-sm transition-all text-emerald-950 dark:text-white"
                                        />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={flightNumber}
                                            onChange={(e) => setFlightNumber(e.target.value)}
                                            placeholder="Flight Number (e.g. UL 504)"
                                            className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 px-5 py-3.5 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none shadow-sm transition-all text-emerald-950 dark:text-white"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="date"
                                            value={arrivalDate}
                                            onChange={(e) => setArrivalDate(e.target.value)}
                                            className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 px-5 py-3.5 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none shadow-sm transition-all text-emerald-950 dark:text-white"
                                        />
                                        <input
                                            type="time"
                                            value={arrivalTime}
                                            onChange={(e) => setArrivalTime(e.target.value)}
                                            className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 px-5 py-3.5 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none shadow-sm transition-all text-emerald-950 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Selection */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Luxury Vehicle</label>
                            {!isVehicleListExpanded && (
                                <button
                                    onClick={() => setIsVehicleListExpanded(true)}
                                    className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-widest flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-100 dark:border-emerald-500/20 shadow-sm"
                                >
                                    Change Vehicle <ArrowRightLeft size={12} />
                                </button>
                            )}
                        </div>

                        {/* Collapsed View (Selected Vehicle Only) */}
                        {!isVehicleListExpanded && (
                            <div
                                onClick={() => setIsVehicleListExpanded(true)}
                                className="relative w-full overflow-hidden rounded-[2.5rem] border border-emerald-600 bg-emerald-50/30 dark:bg-emerald-500/5 cursor-pointer group shadow-xl transition-all hover:-translate-y-1"
                            >
                                <div className="aspect-[21/9] w-full relative">
                                    <img
                                        src={VEHICLE_PRICING[vehicle].image}
                                        alt={VEHICLE_PRICING[vehicle].name}
                                        className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/40 to-transparent"></div>
                                    <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
                                        <div className="bg-emerald-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full w-fit mb-3 shadow-lg">SELECTED RIDE</div>
                                        <div className="font-black text-3xl mb-1 tracking-tight">{VEHICLE_PRICING[vehicle].name}</div>
                                        <div className="flex flex-wrap gap-4 mt-4">
                                            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                                                <Users size={12} /> {VEHICLE_PRICING[vehicle].maxPassengers} PAX
                                            </span>
                                            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                                                <Briefcase size={12} /> {VEHICLE_PRICING[vehicle].specs.luggage} BAGS
                                            </span>
                                            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                                                <Wind size={12} /> A/C
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Expanded Grid View */}
                        {isVehicleListExpanded && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 animate-fade-in">
                                {Object.entries(VEHICLE_PRICING).map(([key, v]) => {
                                    const isLocked = v.maxPassengers < passengers;
                                    const isSelected = vehicle === key;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                if (!isLocked) {
                                                    setVehicle(key)
                                                    setIsVehicleListExpanded(false)
                                                    if (window.innerWidth < 1024) {
                                                        setTimeout(() => quoteRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100)
                                                    }
                                                }
                                            }}
                                            disabled={isLocked}
                                            className={`relative w-full overflow-hidden rounded-[2.5rem] border transition-all duration-500 group text-left p-8 flex flex-col h-full
                                                ${isSelected
                                                    ? 'border-emerald-600 bg-emerald-50/30 dark:bg-emerald-500/5 shadow-2xl ring-4 ring-emerald-600/10 -translate-y-2'
                                                    : isLocked
                                                        ? 'border-slate-100 dark:border-white/5 opacity-40 grayscale cursor-not-allowed bg-slate-50'
                                                        : 'border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-800 hover:border-emerald-200 hover:shadow-2xl hover:-translate-y-1'
                                                }`}
                                        >
                                            <div className="flex-1">
                                                <div className="text-center mb-6">
                                                    <h3 className="font-black text-emerald-950 dark:text-white text-2xl md:text-3xl tracking-tight uppercase leading-tight mb-2">{displayName(v.name)}</h3>
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Premium Class</span>
                                                        <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{v.maxPassengers} Seater</span>
                                                    </div>
                                                </div>

                                                <div className="aspect-[16/9] w-full relative mb-10 flex items-center justify-center">
                                                    <img
                                                        src={v.image}
                                                        alt={v.name}
                                                        className={`w-full h-full object-contain transition-transform duration-700 group-hover:scale-125 ${v.imageScale ? 'scale-[1.5]' : 'scale-125'}`}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-3 gap-3 mb-8">
                                                    {[
                                                        { icon: Users, val: v.maxPassengers, label: 'PAX' },
                                                        { icon: Briefcase, val: v.specs.luggage, label: 'BAGS' },
                                                        { icon: Wind, val: v.specs.ac ? 'AC' : 'NO', label: 'CLIMATE' },
                                                    ].map((item, i) => (
                                                        <div key={i} className="flex flex-col items-center justify-center bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/10 group-hover:bg-white transition-colors">
                                                            <item.icon size={14} className="text-emerald-600 mb-1" />
                                                            <span className="text-lg font-black text-emerald-950 dark:text-white leading-none">{item.val}</span>
                                                            <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{item.label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {distance > 0 && (
                                                <div className="mb-6 rounded-2xl overflow-hidden border border-emerald-100 dark:border-white/10 shadow-sm flex flex-col font-black divide-y divide-emerald-100 dark:divide-white/10">
                                                    {(() => {
                                                        const basePrice = calculateBasePrice(distance, { ...v, vehicleType: key }, tripType, pickupSearch, dropoffSearch, [...staticDestinations, ...dynamicDestinations]);
                                                        const usdVal = Number((basePrice * (rates?.USD || 0.0033)).toFixed(2));
                                                        return (
                                                            <>
                                                                <div className="bg-emerald-950 text-white p-4 flex justify-between items-center px-6">
                                                                    <span className="text-[10px] text-emerald-400 uppercase tracking-widest">LKR Total</span>
                                                                    <span className="text-xl">Rs {Math.round(basePrice).toLocaleString()}</span>
                                                                </div>
                                                                <div className="bg-slate-50 dark:bg-zinc-900 text-emerald-950 dark:text-emerald-400 p-4 flex justify-between items-center px-6">
                                                                    <span className="text-[10px] text-slate-400 uppercase tracking-widest">USD Estimate</span>
                                                                    <span className="text-xl">$ {usdVal.toLocaleString()}</span>
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            )}

                                            <div
                                                className={`w-full py-4.5 text-center rounded-2xl font-black text-lg uppercase tracking-widest transition-all shadow-lg
                                                    ${isSelected
                                                        ? 'bg-emerald-600 text-white shadow-emerald-200 dark:shadow-none translate-y-[-2px]'
                                                        : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white shadow-none'}`}
                                            >
                                                {isSelected ? 'Selected Ride ✓' : 'Select Ride'}
                                            </div>

                                            {isLocked && (
                                                <div className="absolute inset-0 bg-white/70 dark:bg-black/70 backdrop-blur-[2px] flex flex-col items-center justify-center z-20">
                                                    <div className="w-14 h-14 bg-red-50 dark:bg-red-950/30 rounded-2xl mb-4 flex items-center justify-center border border-red-100 dark:border-red-900/20">
                                                        <Lock size={24} className="text-red-500" />
                                                    </div>
                                                    <span className="bg-red-600 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-xl">
                                                        Capacity Limit
                                                    </span>
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Summary & Quote */}
                <div ref={quoteRef} className="bg-emerald-950 dark:bg-zinc-900 rounded-[3rem] p-8 md:p-12 text-white lg:sticky lg:top-28 flex flex-col h-fit shadow-[0_20px_50px_rgba(5,150,105,0.2)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] group-hover:bg-emerald-500/20 transition-all duration-1000"></div>
                    <h3 className="text-emerald-400 text-2xl font-black mb-10 flex items-center gap-4 tracking-tight uppercase">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Zap size={20} fill="currentColor" />
                        </div>
                        Trip Quote
                    </h3>

                    {(() => {
                        const baseTotal = calculateBasePrice(distance, { ...VEHICLE_PRICING[vehicle], vehicleType: vehicle }, tripType, pickupSearch, dropoffSearch, [...staticDestinations, ...dynamicDestinations]);
                        const totalLKR = baseTotal + (boardShow ? (pricingSettings?.nameBoardPrice || 2000) : 0)

                        const currentSymbol = SUPPORTED_CURRENCIES.find(c => c.code === currency)?.symbol || 'Rs'
                        const rate = rates?.[currency] || 1
                        const convertedRaw = totalLKR * rate;
                        const totalSelected = currency === 'LKR' ? Math.round(totalLKR) : Number(convertedRaw.toFixed(2));

                        return (
                            <>
                                <div className="space-y-8 flex-grow relative z-10">
                                    {/* Currency Indicator */}
                                    <div className="flex items-center gap-3 text-emerald-400 mb-2">
                                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">{currency} Real-time Estimate</span>
                                    </div>

                                    <div className="text-5xl md:text-7xl font-black leading-tight tracking-tighter flex items-center gap-3">
                                        <span className="text-xl md:text-3xl font-bold text-[#FACC15]">
                                            {currentSymbol}
                                        </span>
                                        <span className="text-white">
                                            {totalSelected.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Price Breakdown removed for simplicity/cleanliness in this view */}

                                    {/* Multi-Currency Grid with Flags */}
                                    <div className="mt-8 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-px flex-1 bg-white/10"></div>
                                        </div>

                                        {/* Highway Toll Notice */}
                                        <div className="p-4 rounded-2xl bg-[#FACC15]/10 border border-[#FACC15]/30 flex items-start gap-3">
                                            <Info size={16} className="text-black shrink-0 mt-0.5" />
                                            <p className="text-[11px] font-bold text-black/90 leading-relaxed uppercase tracking-wider">
                                                Note: Highway tolls must be paid by the customer during the journey.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            {convertToAllCurrencies(totalLKR)
                                                .filter(c => {
                                                    if (currency === 'LKR') return ['USD', 'GBP', 'EUR'].includes(c.code);
                                                    if (currency === 'USD') return ['LKR', 'GBP', 'EUR'].includes(c.code);
                                                    if (currency === 'INR') return ['USD'].includes(c.code);
                                                    if (currency === 'GBP') return ['USD', 'EUR'].includes(c.code);
                                                    if (currency === 'EUR') return ['USD', 'GBP'].includes(c.code);
                                                    return c.code !== currency;
                                                })
                                                .map((c) => (
                                                <button
                                                    key={c.code}
                                                    type="button"
                                                    onClick={() => changeCurrency(c.code)}
                                                    className="p-3 rounded-2xl border bg-white/5 border-emerald-800/30 hover:border-[#FACC15]/50 hover:bg-white/10 transition-all flex flex-col gap-1 text-left cursor-pointer group/card"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                                                            <span className="text-xs">{c.flag}</span> {c.code}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm md:text-base font-black text-white">
                                                        <span className="text-[10px] font-bold mr-1 opacity-60">{c.symbol}</span>
                                                        {c.value.toLocaleString()}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Important Notices */}
                                <div className="bg-red-500/10 border-2 border-dashed border-red-500 rounded-2xl p-4 mb-4 text-sm text-white space-y-2 animate-pulse">
                                    <div className="flex items-start gap-2 font-bold text-red-200">
                                        <Info size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                                        <p className="uppercase tracking-wide">Highway tickets needed for the trip must be paid by the customer.</p>
                                    </div>
                                </div>
                                <div className="bg-white/10 rounded-2xl p-4 mb-8 text-xs text-white/80 space-y-2">
                                    <div className="flex items-start gap-2 font-bold text-white">
                                        <Info size={14} className="text-black flex-shrink-0 mt-0.5" />
                                        <p>IMPORTANT: We accept card payments (Visa/Mastercard).</p>
                                    </div>
                                </div>

                                <div className="mb-10 text-center">
                                    <p className="text-white/60 uppercase tracking-widest text-[10px] font-black mb-2">Total Estimated Price</p>
                                    <div className="text-4xl md:text-6xl font-black text-[#FACC15] leading-none pb-2 break-words">
                                        {currentSymbol} {totalSelected.toLocaleString()}
                                    </div>
                                </div>

                                <button
                                    disabled={!distance || loading}
                                    onClick={async () => {
                                        if (!date || !time) {
                                            alert("Please select a Date and Time for your trip.")
                                            return
                                        }

                                        // Set loading state
                                        setLoading(true);

                                        const tripDetails = {
                                            pickup: pickup.name,
                                            dropoff: dropoff.name,
                                            distance: distance.toFixed(1) + " km",
                                            vehicle: VEHICLE_PRICING[vehicle].name,
                                            passengers: passengers,
                                            tripType: tripType,
                                            date: date,
                                            time: time,
                                            email: email || 'Not Provided',
                                            whatsappNumber: whatsapp || 'Not Provided',
                                            payment: paymentMethod.toUpperCase(),
                                            boardShow: boardShow ? 'YES' : 'NO',
                                            boardDetails: boardShow ? "Name: " + boardName + ", Flight: " + flightNumber + ", Arrival: " + arrivalDate + " @ " + arrivalTime : 'N/A',
                                            total: "Rs " + totalLKR.toLocaleString(),
                                            usdTotal: rates?.USD ? "$" + (totalLKR * rates.USD).toFixed(2) : 'N/A'
                                        }

                                        // 1. Open WhatsApp Immediately (User Experience Priority)
                                        const usdValue = rates?.USD ? Math.ceil(totalLKR * rates.USD) : 0;
                                        const usdText = usdValue ? " (~$" + usdValue + ")" : ''
                                        const boardText = boardShow ? "%0A---%0ABoard Show: YES (+Rs " + (pricingSettings?.nameBoardPrice || 2000).toLocaleString() + ")%0AName: " + boardName + "%0AFlight: " + flightNumber + "%0AArrival: " + arrivalDate + " @ " + arrivalTime : ''
                                        const emailText = email ? "%0AEmail: " + email : ''
                                        const waText = whatsapp ? "%0AWhatsApp: " + whatsapp : ''
                                        const msg = "Booking Request: %0AFrom: " + pickup.name + "%0ATo: " + dropoff.name + "%0ADistance: " + distance.toFixed(1) + "km%0AVehicle: " + VEHICLE_PRICING[vehicle].name + "%0ATrip: " + tripType + "%0ADate: " + date + "%0ATime: " + time + emailText + waText + "%0APayment: " + paymentMethod.toUpperCase() + boardText + "%0ATotal: Rs " + totalLKR.toLocaleString() + usdText

                                        window.open("https://wa.me/94716885880?text=" + msg, '_blank')

                                        // 2. Save to Database (New Backend)
                                        try {
                                            fetch('/api/bookings', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    pickupLocation: { address: pickup.name, lat: pickup.lat, lng: pickup.lon },
                                                    dropoffLocation: { address: dropoff.name, lat: dropoff.lat, lng: dropoff.lon },
                                                    vehicleType: vehicle,
                                                    distanceKm: distance,
                                                    totalPrice: totalLKR, // Corrected total logic
                                                    whatsappNumber: whatsapp,
                                                    date: date,
                                                    time: time,
                                                    status: 'pending'
                                                })
                                            }).catch(err => console.error("DB Save Background Error:", err));
                                        } catch (err) { console.error("DB Save Error:", err) }

                                        // 3. Send to Discord Webhook
                                        try {
                                            await fetch("https://discord.com/api/webhooks/1463042919693815872/n3E2TD5Bwo9vOZ2KpF3dOAWZF9d7rUMPghS0e-FnjQ3DQrCdRTquulIMrf29cHCQFPff", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({
                                                    username: "Booking Bot",
                                                    embeds: [{
                                                        title: "🚖 New Booking Request",
                                                        color: 0xFFD700, // Gold color
                                                        fields: [
                                                            { name: "From", value: pickup.name || "N/A", inline: true },
                                                            { name: "To", value: dropoff.name || "N/A", inline: true },
                                                            { name: "Vehicle", value: VEHICLE_PRICING[vehicle].name, inline: true },
                                                            { name: "Distance", value: distance.toFixed(1) + " km", inline: true },
                                                            { name: "Passengers", value: String(passengers), inline: true },
                                                            { name: "Total Price", value: "Rs " + totalLKR.toLocaleString(), inline: true },
                                                            { name: "Contact", value: "Email: " + (email || 'N/A') + "\nWA: " + (whatsapp || 'N/A'), inline: false },
                                                            { name: "Date & Time", value: date + " @ " + time, inline: true },
                                                            { name: "Payment", value: paymentMethod.toUpperCase(), inline: true },
                                                            { name: "Airport Greeting", value: boardShow ? "YES (+Rs " + (pricingSettings?.nameBoardPrice || 2000).toLocaleString() + ")\nName: " + boardName + "\nFlight: " + flightNumber + "\nArr: " + arrivalDate + " @ " + arrivalTime : "NO", inline: false }
                                                        ]
                                                    }]
                                                })
                                            })
                                        } catch (error) {
                                            console.error("Discord webhook failed", error)
                                            alert("Notice: Discord notification failed (Network/CORS). WhatsApp opened successfully.")
                                        }

                                        // 3. Send Background Email (Reliability Backup)
                                        try {
                                            await fetch("https://formsubmit.co/ajax/info@airporttaxi.lk", {
                                                method: "POST",
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Accept': 'application/json'
                                                },
                                                body: JSON.stringify({
                                                    _subject: `New Booking: ${pickup.name} -> ${dropoff.name}`,
                                                    ...tripDetails,
                                                    _template: 'table'
                                                })
                                            })
                                        } catch (error) {
                                            console.error("Background email failed", error) // Silent fail as WA is primary
                                        } finally {
                                            setLoading(false); // Reset loading state
                                        }
                                    }}
                                    className="w-full bg-[#FACC15] text-black font-black py-6 rounded-2xl text-xl hover:bg-white transition-all border-2 border-black disabled:opacity-50 disabled:grayscale"
                                >
                                    {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Book This Trip Now'}
                                </button>
                            </>
                        )
                    })()}
                </div >
            </div>
        </div >
    )
}

export default Prices
