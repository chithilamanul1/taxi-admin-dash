'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MapPin, Navigation, ArrowRightLeft, Loader2, Info, Users, Lock, Briefcase, Wind, Zap } from 'lucide-react'
import { debounce } from '@/lib/utils'
import { useCurrency } from '@/context/CurrencyContext'
import { calculateBasePrice } from '@/lib/pricing-util'
import { destinations as staticDestinations } from '@/lib/destinations'

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
        image: '/vehicles/sedancar.png',
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
        name: 'SUV / VEZEL',
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
    'kdh-van': {
        name: 'VAN (KDH)',
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
    'mini-bus': {
        name: 'MINI BUS',
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
    'bus': {
        name: 'BUS (20+ SEATER)',
        model: '',
        image: '/vehicles/coach-bus.png',
        maxPassengers: 25,
        imageScale: 1.0,
        specs: { luggage: 20, handLuggage: 20, ac: true },
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 20000 },
            { min: 20, max: 40, type: 'flat', price: 30000 },
            { min: 40, max: 100, type: 'flat', price: 50000 },
            { min: 100, max: 150, type: 'flat', price: 70000 },
            { min: 150, max: 200, type: 'flat', price: 85000 },
            { min: 200, max: 300, type: 'flat', price: 120000 },
            { min: 300, max: Infinity, type: 'per_km', rate: 400 }
        ]
    },
    'coach-bus': {
        name: 'COACH BUS (40+ SEATER)',
        model: '',
        image: '/vehicles/coach-bus.png',
        maxPassengers: 45,
        imageScale: 1.0,
        specs: { luggage: 40, handLuggage: 40, ac: true },
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 25000 },
            { min: 20, max: 40, type: 'flat', price: 45000 },
            { min: 40, max: 100, type: 'flat', price: 60000 },
            { min: 100, max: 150, type: 'flat', price: 85000 },
            { min: 150, max: 200, type: 'flat', price: 95000 },
            { min: 200, max: 300, type: 'flat', price: 135000 },
            { min: 300, max: Infinity, type: 'per_km', rate: 450 }
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

    useEffect(() => {
        fetch('/api/destinations').then(res => res.json()).then(data => {
            if (data.success) setDynamicDestinations(data.data)
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
        return SUPPORTED_CURRENCIES.map(c => ({
            ...c,
            value: Math.ceil(amountLKR * (rates?.[c.code] || 1))
        }));
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
        <div className="pt-32 pb-20 max-w-6xl mx-auto px-6 dark:bg-slate-950 transition-colors">
            <div id="prices" className="py-12 text-center scroll-mt-32">
                <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-900 dark:text-white mb-4">Price <span className="text-emerald-600 dark:text-emerald-400">Calculator</span></h1>
                <p className="text-emerald-900/60 dark:text-white/60 max-w-2xl mx-auto">Select your pickup and destination points for an instant, transparent quote.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mt-8">
                {/* Left: Input Controls */}
                <div className="space-y-8 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-white/5">

                    {/* Pickup Search */}
                    <div className="relative">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                            <MapPin size={16} className="text-emerald-600 dark:text-emerald-400" /> Pickup Point
                        </label>
                        <input
                            type="text"
                            value={pickupSearch}
                            onChange={(e) => {
                                setPickupSearch(e.target.value)
                                debouncedSearchPickup(e.target.value)
                            }}
                            placeholder="Start searching..."
                            className="w-full bg-slate-50 dark:bg-white/5 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-900/20 dark:focus:ring-emerald-500/20 outline-none text-emerald-900 dark:text-white placeholder:text-gray-400/50"
                        />
                        {pickupResults.length > 0 && (
                            <div className="absolute z-20 w-full mt-2 bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
                                {pickupResults.map((r, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setPickup(r)
                                            setPickupSearch(r.name)
                                            setPickupResults([])
                                        }}
                                        className="w-full text-left px-6 py-4 hover:bg-slate-50 dark:hover:bg-white/5 border-b border-gray-50 dark:border-white/5 last:border-none flex items-center gap-3 text-emerald-900 dark:text-white"
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
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                            <MapPin size={16} className="text-emerald-900 dark:text-emerald-400" /> Destination
                        </label>
                        <input
                            type="text"
                            value={dropoffSearch}
                            onChange={(e) => {
                                setDropoffSearch(e.target.value)
                                debouncedSearchDropoff(e.target.value)
                            }}
                            placeholder="Where are you going?"
                            className="w-full bg-slate-50 dark:bg-white/5 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-900/20 dark:focus:ring-emerald-500/20 outline-none text-emerald-900 dark:text-white placeholder:text-gray-400/50"
                        />
                        {dropoffResults.length > 0 && (
                            <div className="absolute z-20 w-full mt-2 bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
                                {dropoffResults.map((r, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setDropoff(r)
                                            setDropoffSearch(r.name)
                                            setDropoffResults([])
                                        }}
                                        className="w-full text-left px-6 py-4 hover:bg-slate-50 dark:hover:bg-white/5 border-b border-gray-50 dark:border-white/5 last:border-none flex items-center gap-3 text-emerald-900 dark:text-white"
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
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                                <Users size={16} className="text-emerald-600 dark:text-emerald-400" /> Passengers
                            </label>
                            <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 px-4 py-3 rounded-2xl border border-transparent hover:border-emerald-600/30 transition-all">
                                <span className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mr-2">Count:</span>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setPassengers(Math.max(1, passengers - 1))}
                                        className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full shadow-md text-emerald-900 dark:text-white font-bold hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:text-white active:scale-95 transition-all text-xl"
                                        aria-label="Decrease passengers"
                                    >
                                        -
                                    </button>
                                    <span className="font-extrabold text-emerald-900 dark:text-white text-xl w-6 text-center">{passengers}</span>
                                    <button
                                        onClick={() => setPassengers(Math.min(15, passengers + 1))}
                                        className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full shadow-md text-emerald-900 dark:text-white font-bold hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:text-white active:scale-95 transition-all text-xl"
                                        aria-label="Increase passengers"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                                <ArrowRightLeft size={16} className="text-emerald-900 dark:text-emerald-400" /> Trip Type
                            </label>
                            <div className="flex bg-slate-50 dark:bg-white/5 p-1.5 rounded-2xl">
                                {['one-way', 'round-trip'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setTripType(t)}
                                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tripType === t ? 'bg-emerald-900 text-white shadow-md' : 'text-gray-400 hover:text-emerald-900'}`}
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
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                                <span className="text-emerald-600">✉️</span> Your Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full bg-slate-50 dark:bg-white/5 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-900/20 dark:focus:ring-emerald-500/20 outline-none text-emerald-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                                <span className="text-emerald-600">📱</span> WhatsApp No.
                            </label>
                            <input
                                type="tel"
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                                placeholder="+1 66 77 88 99 ..."
                                className="w-full bg-slate-50 dark:bg-white/5 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-900/20 dark:focus:ring-emerald-500/20 outline-none text-emerald-900 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Date, Time & Payment Method */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                                <span className="text-emerald-600">📅</span> Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-900/20 outline-none"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                                <span className="text-emerald-600">⏰</span> Time
                            </label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-900/20 outline-none"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                                <span className="text-emerald-600 dark:text-emerald-400">💳</span> Payment
                            </label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-white/5 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-900/20 dark:focus:ring-emerald-500/20 outline-none cursor-pointer text-emerald-900 dark:text-white"
                            >
                                <option value="cash" className="dark:bg-slate-900">Cash to Driver</option>
                                <option value="card" className="dark:bg-slate-900">Card Payment</option>
                            </select>
                        </div>
                    </div>

                    {/* Airport Greeting (Board Show) Option */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:border-emerald-600/50 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-900/10 dark:bg-white/5 rounded-full flex items-center justify-center text-2xl">
                                🛫
                            </div>
                            <div>
                                <h4 className="text-emerald-900 dark:text-white font-bold text-lg">Airport Greeting (NAME BOARD)</h4>
                                <p className="text-gray-500 dark:text-slate-400 text-xs max-w-xs">Our driver will wait for you at the arrival terminal hall with your name on a NAME BOARD.</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <div className="flex flex-col items-end">
                                <span className="text-emerald-600 font-bold text-lg">+ Rs 2,000.00</span>
                                {rates?.USD && (
                                    <span className="text-xs text-gray-400 font-medium">
                                        (≈ ${(2000 * rates.USD).toFixed(2)} USD)
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
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                </label>
                            </div>

                            {/* Input for Name on Board & Flight Details */}
                            <div className={`transition-all duration-300 overflow-hidden ${boardShow ? 'max-h-96 opacity-100 w-full mt-4' : 'max-h-0 opacity-0 w-0'}`}>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Name on Board</label>
                                        <input
                                            type="text"
                                            value={boardName}
                                            onChange={(e) => setBoardName(e.target.value)}
                                            placeholder="e.g. Mr. John Doe"
                                            className="w-full bg-slate-50 border-none px-4 py-3 rounded-xl text-sm focus:ring-1 focus:ring-emerald-900/20 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Flight Number</label>
                                        <input
                                            type="text"
                                            value={flightNumber}
                                            onChange={(e) => setFlightNumber(e.target.value)}
                                            placeholder="e.g. UL 504"
                                            className="w-full bg-slate-50 border-none px-4 py-3 rounded-xl text-sm focus:ring-1 focus:ring-emerald-900/20 outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Arrival Date</label>
                                            <input
                                                type="date"
                                                value={arrivalDate}
                                                onChange={(e) => setArrivalDate(e.target.value)}
                                                className="w-full bg-slate-50 border-none px-4 py-3 rounded-xl text-sm focus:ring-1 focus:ring-emerald-900/20 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Arrival Time</label>
                                            <input
                                                type="time"
                                                value={arrivalTime}
                                                onChange={(e) => setArrivalTime(e.target.value)}
                                                className="w-full bg-slate-50 border-none px-4 py-3 rounded-xl text-sm focus:ring-1 focus:ring-emerald-900/20 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Selection */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Select Vehicle</label>
                            {!isVehicleListExpanded && (
                                <button
                                    onClick={() => setIsVehicleListExpanded(true)}
                                    className="text-xs font-bold text-emerald-600 hover:text-emerald-900 transition-colors uppercase tracking-widest flex items-center gap-1"
                                >
                                    Change Vehicle <ArrowRightLeft size={12} />
                                </button>
                            )}
                        </div>

                        {/* Collapsed View (Selected Vehicle Only) */}
                        {!isVehicleListExpanded && (
                            <div
                                onClick={() => setIsVehicleListExpanded(true)}
                                className="relative w-full overflow-hidden rounded-2xl border-2 border-emerald-600 ring-2 ring-emerald-600/20 shadow-lg cursor-pointer group"
                            >
                                <div className="aspect-[21/9] w-full relative">
                                    <img
                                        src={VEHICLE_PRICING[vehicle].image}
                                        alt={VEHICLE_PRICING[vehicle].name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/40 to-transparent"></div>
                                    <div className="absolute inset-0 p-6 flex flex-col justify-center text-white">
                                        <div className="bg-emerald-600 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full w-fit mb-2">SELECTED</div>
                                        <div className="font-bold text-2xl mb-1">{VEHICLE_PRICING[vehicle].name}</div>
                                        <div className="text-sm text-white/80 mb-2">{VEHICLE_PRICING[vehicle].model}</div>
                                        {VEHICLE_PRICING[vehicle].specs && (
                                            <div className="flex flex-col gap-1 mb-2 opacity-90">
                                                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                                                    <Users size={12} className="text-emerald-600" /> 1-{VEHICLE_PRICING[vehicle].maxPassengers} PASSENGERS
                                                </span>
                                                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                                                    <Briefcase size={12} className="text-emerald-600" /> {VEHICLE_PRICING[vehicle].specs.luggage} LUGGAGE
                                                </span>
                                                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                                                    <Briefcase size={12} className="text-emerald-600 scale-75" /> {VEHICLE_PRICING[vehicle].specs.handLuggage} HAND LUGGAGE
                                                </span>
                                                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                                                    <Wind size={12} className="text-emerald-600" /> AIR - CONDITIONING
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-4 mt-1 text-xs font-bold text-emerald-600 uppercase tracking-widest">
                                            <span>Click to Change</span>
                                            <ArrowRightLeft size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Expanded Grid View */}
                        {isVehicleListExpanded && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in mt-4">
                                {Object.entries(VEHICLE_PRICING).map(([key, v]) => {
                                    const isLocked = v.maxPassengers < passengers;
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
                                            className={`relative w-full overflow-hidden rounded-[2.5rem] border-[3px] transition-all group text-left bg-white dark:bg-slate-800 p-8
                                                ${vehicle === key
                                                    ? 'border-emerald-700 shadow-2xl scale-[1.02]'
                                                    : isLocked
                                                        ? 'border-gray-100 dark:border-white/5 opacity-60 cursor-not-allowed grayscale'
                                                        : 'border-black dark:border-white/20 hover:border-emerald-700 shadow-lg hover:shadow-xl'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-full text-center">
                                                    <h3 className="font-black text-black dark:text-white text-3xl md:text-4xl leading-tight pb-1 uppercase tracking-tight">{v.name}</h3>
                                                    <p className="text-sm text-gray-400 dark:text-slate-500 font-bold">{v.model}</p>
                                                </div>
                                            </div>

                                            <div className="aspect-[16/9] w-full relative mb-4 flex items-center justify-center p-2">
                                                <img
                                                    src={v.image}
                                                    alt={v.name}
                                                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                                    style={{ transform: v.imageScale ? `scale(${v.imageScale})` : 'none' }}
                                                />
                                            </div>

                                            <div className="space-y-3 mb-6">
                                                <div className="flex items-center gap-4 text-base font-bold text-gray-700 dark:text-slate-300">
                                                    <Users size={20} className="text-slate-400" />
                                                    <span>1 - {v.maxPassengers} Passengers</span>
                                                </div>
                                                {v.specs && (
                                                    <>
                                                        <div className="flex items-center gap-4 text-base font-bold text-gray-700 dark:text-slate-300">
                                                            <Briefcase size={20} className="text-slate-400" />
                                                            <span>{v.specs.luggage} Luggages</span>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-base font-bold text-gray-700 dark:text-slate-300">
                                                            <Briefcase size={18} className="text-slate-400" />
                                                            <span>{v.specs.handLuggage} Hand Baggages</span>
                                                        </div>
                                                        {v.specs.ac && (
                                                            <div className="flex items-center gap-4 text-base font-bold text-gray-700 dark:text-slate-300">
                                                                <Wind size={20} className="text-slate-400" />
                                                                <span>Air Conditioning</span>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            {distance > 0 && (
                                                <div className="space-y-1 mb-6 rounded-xl overflow-hidden shadow-inner font-black">
                                                    {(() => {
                                                        const basePrice = calculateBasePrice(distance, { ...v, vehicleType: key }, tripType, pickupSearch, dropoffSearch, [...staticDestinations, ...dynamicDestinations]);
                                                        const usdVal = Math.ceil(basePrice * (rates?.USD || 0.0033));
                                                        const eurVal = Math.ceil(basePrice * (rates?.EUR || 0.0031));
                                                        return (
                                                            <>
                                                                <div className="bg-black text-white p-3 flex justify-center items-center text-lg">
                                                                    Rs {basePrice.toLocaleString()}
                                                                </div>
                                                                <div className="bg-[#D1E1EC] text-slate-800 p-3 flex justify-center items-center text-lg">
                                                                    $ {usdVal.toLocaleString()}
                                                                </div>
                                                                <div className="bg-[#E4E9ED] text-slate-800 p-3 flex justify-center items-center text-lg">
                                                                    € {eurVal.toLocaleString()}
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            )}

                                            <div
                                                className={`w-full py-4 text-center rounded-2xl font-black text-xl uppercase tracking-widest transition-all shadow-xl
                                                    ${vehicle === key
                                                        ? 'bg-emerald-900 text-white shadow-emerald-900/20'
                                                        : 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/20'}`}
                                            >
                                                {vehicle === key ? 'Selected ✓' : 'Select'}
                                            </div>

                                            {isLocked && (
                                                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                                                    <div className="bg-red-500/90 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                                                        <Lock size={14} /> Too Small
                                                    </div>
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
                <div ref={quoteRef} className="bg-emerald-900 rounded-[2.5rem] p-8 md:p-14 text-white shadow-3xl lg:sticky lg:top-28 flex flex-col h-fit">
                    <h3 className="text-emerald-400 text-2xl font-bold mb-8 flex items-center gap-3">
                        Trip Quote
                    </h3>

                    {(() => {
                        const baseTotal = calculateBasePrice(distance, { ...VEHICLE_PRICING[vehicle], vehicleType: vehicle }, tripType, pickupSearch, dropoffSearch, [...staticDestinations, ...dynamicDestinations]);
                        const totalLKR = baseTotal + (boardShow ? 2000 : 0)

                        const currentSymbol = SUPPORTED_CURRENCIES.find(c => c.code === currency)?.symbol || 'Rs'
                        const rate = rates?.[currency] || 1
                        const totalSelected = Math.ceil(totalLKR * rate)

                        return (
                            <>
                                <div className="space-y-6 flex-grow">
                                    {/* Currency Indicator */}
                                    <div className="flex items-center gap-2 text-amber-500 mb-2">
                                        <Zap size={14} fill="currentColor" className="animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{currency} ESTIMATE</span>
                                    </div>

                                    <div className="text-5xl md:text-7xl font-black leading-tight tracking-tighter flex items-center gap-3">
                                        <span className="text-xl md:text-3xl font-bold text-amber-500">
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
                                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                                            <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                            <p className="text-[11px] font-bold text-amber-500/90 leading-relaxed uppercase tracking-wider">
                                                Note: Highway tolls must be paid by the customer during the journey.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            {convertToAllCurrencies(totalLKR).map((c) => (
                                                <button
                                                    key={c.code}
                                                    type="button"
                                                    onClick={() => changeCurrency(c.code)}
                                                    className={`p-3 rounded-2xl border-2 transition-all flex flex-col gap-1 text-left cursor-pointer group/card ${currency === c.code
                                                        ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                                                        : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                                                            <span className="text-xs">{c.flag}</span> {c.code}
                                                        </span>
                                                        {currency === c.code && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgb(245,158,11)]"></div>}
                                                    </div>
                                                    <div className={`text-sm md:text-base font-black ${currency === c.code ? 'text-amber-500' : 'text-white'}`}>
                                                        <span className="text-[10px] font-bold mr-1 opacity-60">{c.symbol}</span>
                                                        {c.value.toLocaleString()}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Important Notices */}
                                <div className="bg-red-500/10 border-2 border-red-500 rounded-xl p-4 mb-4 text-sm text-white space-y-2 animate-pulse">
                                    <div className="flex items-start gap-2 font-bold text-red-200">
                                        <Info size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                                        <p className="uppercase tracking-wide">Highway tickets needed for the trip must be paid by the customer.</p>
                                    </div>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 mb-8 text-xs text-white/80 space-y-2">
                                    <div className="flex items-start gap-2 font-bold text-white">
                                        <Info size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                                        <p>IMPORTANT: We accept card payments (Visa/Mastercard).</p>
                                    </div>
                                </div>

                                <div className="mb-10 text-center">
                                    <p className="text-white/60 uppercase tracking-widest text-xs mb-2">Total</p>
                                    <div className="text-4xl md:text-6xl font-extrabold text-emerald-400 leading-none pb-2 break-words">
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
                                            whatsapp: whatsapp || 'Not Provided',
                                            payment: paymentMethod.toUpperCase(),
                                            boardShow: boardShow ? 'YES' : 'NO',
                                            boardDetails: boardShow ? "Name: " + boardName + ", Flight: " + flightNumber + ", Arrival: " + arrivalDate + " @ " + arrivalTime : 'N/A',
                                            total: "Rs " + totalLKR.toLocaleString(),
                                            usdTotal: rates?.USD ? "$" + (totalLKR * rates.USD).toFixed(2) : 'N/A'
                                        }

                                        // 1. Open WhatsApp Immediately (User Experience Priority)
                                        const usdValue = rates?.USD ? Math.ceil(totalLKR * rates.USD) : 0;
                                        const usdText = usdValue ? " (~$" + usdValue + ")" : ''
                                        const boardText = boardShow ? "%0A---%0ABoard Show: YES (+Rs 2000)%0AName: " + boardName + "%0AFlight: " + flightNumber + "%0AArrival: " + arrivalDate + " @ " + arrivalTime : ''
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
                                                    totalPrice: total,
                                                    guestPhone: whatsapp,
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
                                                            { name: "Total Price", value: "Rs " + total.toLocaleString(), inline: true },
                                                            { name: "Contact", value: "Email: " + (email || 'N/A') + "\nWA: " + (whatsapp || 'N/A'), inline: false },
                                                            { name: "Date & Time", value: date + " @ " + time, inline: true },
                                                            { name: "Payment", value: paymentMethod.toUpperCase(), inline: true },
                                                            { name: "Airport Greeting", value: boardShow ? "YES (+Rs 2000)\nName: " + boardName + "\nFlight: " + flightNumber + "\nArr: " + arrivalDate + " @ " + arrivalTime : "NO", inline: false }
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
                                    className="w-full bg-emerald-600 text-emerald-900 font-extrabold py-6 rounded-2xl text-xl hover:scale-[1.02] transition-all shadow-2xl disabled:opacity-50 disabled:grayscale"
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
