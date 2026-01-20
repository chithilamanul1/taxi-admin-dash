import React, { useState, useEffect, useRef } from 'react'
import { MapPin, Navigation, ArrowRightLeft, Loader2, Info, Users, Lock, Briefcase, Wind } from 'lucide-react'
import _ from 'lodash'

// Tiered Pricing Configuration (in LKR - Sri Lankan Rupees)
const VEHICLE_PRICING = {
    'mini-car': {
        name: 'MINI CAR',
        model: 'Wagon R',
        image: '/vehicles/minicar.png',
        maxPassengers: 2,
        specs: {
            luggage: 2,
            handLuggage: 2,
            ac: true
        },
        tiers: [
            { max: 20, type: 'flat', price: 3500 },
            { max: 40, type: 'flat', price: 4000 },
            { max: 130, type: 'per_km', rate: 100 },
            { max: Infinity, type: 'per_km', rate: 92.50 }
        ]
    },
    'sedan': {
        name: 'SEDAN CAR',
        model: 'Prius / Axio',
        image: '/vehicles/sedan.png',
        maxPassengers: 3,
        specs: {
            luggage: 3,
            handLuggage: 3,
            ac: true
        },
        tiers: [
            { max: 20, type: 'flat', price: 4500 },
            { max: 40, type: 'flat', price: 6000 },
            { max: 50, type: 'per_km', rate: 150 },
            { max: 100, type: 'per_km', rate: 130 },
            { max: 140, type: 'per_km', rate: 120 },
            { max: 200, type: 'per_km', rate: 115 },
            { max: Infinity, type: 'per_km', rate: 110 }
        ]
    },
    'mini-van-every': {
        name: 'MINI VAN (Every)',
        model: 'Suzuki Every',
        image: 'https://media.discordapp.net/attachments/1462329915969114142/1462884935248384060/WhatsApp_Image_2026-01-20_at_12.07.14_AM.jpeg?ex=696fd143&is=696e7fc3&hm=4c0a2ebece5c8e5c93ccf60a7b4241a2559582f353bf773bc992de5eed5aaba1&=&format=webp',
        maxPassengers: 3,
        specs: {
            luggage: 3,
            handLuggage: 3,
            ac: true
        },
        tiers: [
            { max: 20, type: 'flat', price: 4500 },
            { max: 40, type: 'flat', price: 6000 },
            { max: 50, type: 'per_km', rate: 150 },
            { max: 100, type: 'per_km', rate: 130 },
            { max: 140, type: 'per_km', rate: 120 },
            { max: 200, type: 'per_km', rate: 115 },
            { max: Infinity, type: 'per_km', rate: 110 }
        ]
    },
    'mini-van-05': {
        name: 'MINI VAN (4 Seat)',
        model: 'Nissan / Toyota',
        image: 'https://media.discordapp.net/attachments/1462329915969114142/1462884935718277356/WhatsApp_Image_2026-01-20_at_12.08.14_AM_1.jpeg?ex=696fd143&is=696e7fc3&hm=14409285b39103836b9238173e86fae7db369e56e5a89f1f9ab7784caf78e645&=&format=webp',
        maxPassengers: 4,
        specs: {
            luggage: 4,
            handLuggage: 4,
            ac: true
        },
        tiers: [
            { max: 20, type: 'flat', price: 6000 },
            { max: 40, type: 'flat', price: 8500 },
            { max: 100, type: 'per_km', rate: 200 },
            { max: 140, type: 'per_km', rate: 160 },
            { max: 200, type: 'per_km', rate: 130 },
            { max: Infinity, type: 'per_km', rate: 120 }
        ]
    },
    'suv': {
        name: 'SUV',
        model: 'Toyota C-HR',
        image: 'https://media.discordapp.net/attachments/1462329915969114142/1462884936213074116/WhatsApp_Image_2026-01-20_at_12.11.55_AM.jpeg?ex=696fd143&is=696e7fc3&hm=9b94943ba87aad29714a14cf3b52e02445ea9a6a53197f3affdab1b9c0f6c9d2&=&format=webp',
        maxPassengers: 3,
        specs: {
            luggage: 3,
            handLuggage: 3,
            ac: true
        },
        tiers: [
            { max: 20, type: 'flat', price: 7000 },
            { max: 40, type: 'flat', price: 12000 },
            { max: 100, type: 'per_km', rate: 250 },
            { max: Infinity, type: 'per_km', rate: 180 }
        ]
    },
    'kdh-van': {
        name: 'VAN',
        model: '',
        image: '/vehicles/kdh_van_new.png',
        maxPassengers: 6,
        specs: {
            luggage: 7,
            handLuggage: 7,
            ac: true
        },
        tiers: [
            { max: 20, type: 'flat', price: 6000 },
            { max: 40, type: 'flat', price: 8500 },
            { max: 100, type: 'per_km', rate: 200 },
            { max: 140, type: 'per_km', rate: 160 },
            { max: 200, type: 'per_km', rate: 130 },
            { max: Infinity, type: 'per_km', rate: 120 }
        ]
    },
    'mini-bus': {
        name: 'MINI BUS',
        model: '',
        image: '/vehicles/minibus_new.png',
        maxPassengers: 15,
        specs: {
            luggage: 10,
            handLuggage: 8,
            ac: true
        },
        tiers: [
            { max: 20, type: 'flat', price: 7500 },
            { max: 40, type: 'flat', price: 12000 },
            { max: 100, type: 'per_km', rate: 220 },
            { max: 140, type: 'per_km', rate: 200 },
            { max: 200, type: 'per_km', rate: 140 },
            { max: Infinity, type: 'per_km', rate: 130 }
        ]
    }
}

// Calculate price based on tiered pricing
const calculatePrice = (distance, vehicleType, tripType) => {
    if (!distance || !vehicleType) return { total: 0, breakdown: [] }

    const vehicle = VEHICLE_PRICING[vehicleType]
    let oneWayPrice = 0
    let breakdown = []
    let previousMax = 0

    for (let tier of vehicle.tiers) {
        const tierStart = previousMax
        const tierEnd = (tier.max === Infinity) ? distance : Math.min(tier.max, distance)
        const tierKm = tierEnd - tierStart

        if (tierKm <= 0) break

        if (tier.type === 'flat') {
            oneWayPrice = tier.price
            // Flat rate overrides previous base, so we reset breakdown
            breakdown = [{
                range: "0 - " + tierEnd.toFixed(0) + " km",
                description: 'Flat rate',
                amount: tier.price
            }]
        } else {
            const tierCost = tierKm * tier.rate
            oneWayPrice += tierCost
            breakdown.push({
                range: `${tierStart.toFixed(0)} - ${tierEnd.toFixed(1)} km`,
                description: `${tierKm.toFixed(1)} km × Rs ${tier.rate} `,
                amount: tierCost
            })
        }

        previousMax = tier.max
        if (distance <= tier.max) break
    }

    const total = tripType === 'round-trip' ? oneWayPrice * 2 : oneWayPrice
    return { total, breakdown, oneWayPrice }
}

const Prices = () => {
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
    const [usdRate, setUsdRate] = useState(null)

    // Refs for scrolling
    const quoteRef = useRef(null)

    // Fetch live exchange rate (LKR -> USD)
    useEffect(() => {
        const fetchRate = async () => {
            try {
                const res = await fetch('https://open.er-api.com/v6/latest/LKR')
                const data = await res.json()
                if (data && data.rates && data.rates.USD) {
                    setUsdRate(data.rates.USD)
                }
            } catch (error) {
                console.error("Failed to fetch exchange rate:", error)
            }
        }
        fetchRate()
    }, [])

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

    const debouncedSearchPickup = useRef(_.debounce((q) => searchLocation(q, setPickupResults), 500)).current
    const debouncedSearchDropoff = useRef(_.debounce((q) => searchLocation(q, setDropoffResults), 500)).current

    // Calculate route using OSRM
    useEffect(() => {
        if (pickup.lat && dropoff.lat) {
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
        <div className="pb-20 max-w-6xl mx-auto px-6">
            <div id="prices" className="py-12 text-center scroll-mt-32">
                <h1 className="text-4xl md:text-5xl font-extrabold text-navy mb-4">Price <span className="text-gold">Calculator</span></h1>
                <p className="text-gray-500 max-w-2xl mx-auto">Select your pickup and destination points for an instant, transparent quote.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mt-8">
                {/* Left: Input Controls */}
                <div className="space-y-8 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100">

                    {/* Pickup Search */}
                    <div className="relative">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                            <MapPin size={16} className="text-gold" /> Pickup Point
                        </label>
                        <input
                            type="text"
                            value={pickupSearch}
                            onChange={(e) => {
                                setPickupSearch(e.target.value)
                                debouncedSearchPickup(e.target.value)
                            }}
                            placeholder="Start searching..."
                            className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-gold outline-none"
                        />
                        {pickupResults.length > 0 && (
                            <div className="absolute z-20 w-full mt-2 bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden">
                                {pickupResults.map((r, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setPickup(r)
                                            setPickupSearch(r.name)
                                            setPickupResults([])
                                        }}
                                        className="w-full text-left px-6 py-4 hover:bg-slate-50 border-b border-gray-50 last:border-none flex items-center gap-3"
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
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                            <MapPin size={16} className="text-navy" /> Destination
                        </label>
                        <input
                            type="text"
                            value={dropoffSearch}
                            onChange={(e) => {
                                setDropoffSearch(e.target.value)
                                debouncedSearchDropoff(e.target.value)
                            }}
                            placeholder="Where are you going?"
                            className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-gold outline-none"
                        />
                        {dropoffResults.length > 0 && (
                            <div className="absolute z-20 w-full mt-2 bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden">
                                {dropoffResults.map((r, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setDropoff(r)
                                            setDropoffSearch(r.name)
                                            setDropoffResults([])
                                        }}
                                        className="w-full text-left px-6 py-4 hover:bg-slate-50 border-b border-gray-50 last:border-none flex items-center gap-3"
                                    >
                                        <Navigation size={14} className="text-gray-400" />
                                        <span>{r.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Passengers & Trip Type Row */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                                <Users size={16} className="text-gold" /> Passengers
                            </label>
                            <div className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-2xl">
                                <button
                                    onClick={() => setPassengers(Math.max(1, passengers - 1))}
                                    className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-navy font-bold hover:bg-gold/20 active:scale-95 transition-all text-lg"
                                >
                                    -
                                </button>
                                <span className="font-bold text-navy text-lg">{passengers}</span>
                                <button
                                    onClick={() => setPassengers(Math.min(15, passengers + 1))}
                                    className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-navy font-bold hover:bg-gold/20 active:scale-95 transition-all text-lg"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                                <ArrowRightLeft size={16} className="text-navy" /> Trip Type
                            </label>
                            <div className="flex bg-slate-50 p-1.5 rounded-2xl">
                                {['one-way', 'round-trip'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setTripType(t)}
                                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tripType === t ? 'bg-navy text-white shadow-md' : 'text-gray-400 hover:text-navy'}`}
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
                                <span className="text-gold">✉️</span> Your Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-gold outline-none"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                                <span className="text-gold">📱</span> WhatsApp No.
                            </label>
                            <input
                                type="tel"
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                                placeholder="+94 77 ..."
                                className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-gold outline-none"
                            />
                        </div>
                    </div>

                    {/* Date, Time & Payment Method */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                                <span className="text-gold">📅</span> Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-gold outline-none"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                                <span className="text-gold">⏰</span> Time
                            </label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-gold outline-none"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                                <span className="text-gold">💳</span> Payment
                            </label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-gold outline-none cursor-pointer"
                            >
                                <option value="cash">Cash to Driver</option>
                                <option value="card">Card Payment</option>
                            </select>
                        </div>
                    </div>

                    {/* Airport Greeting (Board Show) Option */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:border-gold/50 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-2xl">
                                🛫
                            </div>
                            <div>
                                <h4 className="text-navy font-bold text-lg">Airport Greeting (Board Show)</h4>
                                <p className="text-gray-500 text-xs max-w-xs">Our driver will wait for you at the arrival terminal with your name on a board.</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <div className="flex flex-col items-end">
                                <span className="text-gold font-bold text-lg">+ Rs 2,000.00</span>
                                {usdRate && (
                                    <span className="text-xs text-gray-400 font-medium">
                                        (≈ ${(2000 * usdRate).toFixed(2)} USD)
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
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
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
                                            className="w-full bg-slate-50 border-none px-4 py-3 rounded-xl text-sm focus:ring-1 focus:ring-gold outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Flight Number</label>
                                        <input
                                            type="text"
                                            value={flightNumber}
                                            onChange={(e) => setFlightNumber(e.target.value)}
                                            placeholder="e.g. UL 504"
                                            className="w-full bg-slate-50 border-none px-4 py-3 rounded-xl text-sm focus:ring-1 focus:ring-gold outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Arrival Date</label>
                                            <input
                                                type="date"
                                                value={arrivalDate}
                                                onChange={(e) => setArrivalDate(e.target.value)}
                                                className="w-full bg-slate-50 border-none px-4 py-3 rounded-xl text-sm focus:ring-1 focus:ring-gold outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Arrival Time</label>
                                            <input
                                                type="time"
                                                value={arrivalTime}
                                                onChange={(e) => setArrivalTime(e.target.value)}
                                                className="w-full bg-slate-50 border-none px-4 py-3 rounded-xl text-sm focus:ring-1 focus:ring-gold outline-none"
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
                                    className="text-xs font-bold text-gold hover:text-navy transition-colors uppercase tracking-widest flex items-center gap-1"
                                >
                                    Change Vehicle <ArrowRightLeft size={12} />
                                </button>
                            )}
                        </div>

                        {/* Collapsed View (Selected Vehicle Only) */}
                        {!isVehicleListExpanded && (
                            <div
                                onClick={() => setIsVehicleListExpanded(true)}
                                className="relative w-full overflow-hidden rounded-2xl border-2 border-gold ring-2 ring-gold/20 shadow-lg cursor-pointer group"
                            >
                                <div className="aspect-[21/9] w-full relative">
                                    <img
                                        src={VEHICLE_PRICING[vehicle].image}
                                        alt={VEHICLE_PRICING[vehicle].name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/40 to-transparent"></div>
                                    <div className="absolute inset-0 p-6 flex flex-col justify-center text-white">
                                        <div className="bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full w-fit mb-2">SELECTED</div>
                                        <div className="font-bold text-2xl mb-1">{VEHICLE_PRICING[vehicle].name}</div>
                                        <div className="text-sm text-white/80 mb-2">{VEHICLE_PRICING[vehicle].model}</div>
                                        {VEHICLE_PRICING[vehicle].specs && (
                                            <div className="flex flex-wrap items-center gap-3 mb-2 opacity-80">
                                                <span className="flex items-center gap-1.5 text-xs font-medium">
                                                    <Users size={14} className="text-gold" /> {VEHICLE_PRICING[vehicle].maxPassengers}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-xs font-medium">
                                                    <Briefcase size={14} className="text-gold" /> {VEHICLE_PRICING[vehicle].specs.luggage}L + {VEHICLE_PRICING[vehicle].specs.handLuggage}S
                                                </span>
                                                <span className="flex items-center gap-1.5 text-xs font-medium">
                                                    <Wind size={14} className="text-gold" /> A/C
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-4 mt-1 text-xs font-bold text-gold uppercase tracking-widest">
                                            <span>Click to Change</span>
                                            <ArrowRightLeft size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Expanded Grid View */}
                        {isVehicleListExpanded && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                                {Object.entries(VEHICLE_PRICING).map(([key, v]) => {
                                    const isLocked = v.maxPassengers < passengers;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                if (!isLocked) {
                                                    setVehicle(key)
                                                    setIsVehicleListExpanded(false)
                                                    // On mobile, smooth scroll to quote after selection
                                                    if (window.innerWidth < 1024) {
                                                        setTimeout(() => quoteRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100)
                                                    }
                                                }
                                            }}
                                            disabled={isLocked}
                                            className={`relative w-full overflow-hidden rounded-2xl border-2 transition-all group text-left
                                                    ${vehicle === key
                                                    ? 'border-gold ring-2 ring-gold/20 shadow-lg'
                                                    : isLocked
                                                        ? 'border-gray-100 opacity-60 cursor-not-allowed grayscale'
                                                        : 'border-slate-100 hover:border-gold/50'
                                                }`}
                                        >
                                            <div className="aspect-[16/9] w-full relative">
                                                <img
                                                    src={v.image}
                                                    alt={v.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className={`absolute inset-0 bg-gradient-to-t from-navy/90 to-transparent ${vehicle === key ? 'opacity-90' : 'opacity-70 group-hover:opacity-60'}`}></div>

                                                <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                                                    <div className="font-bold text-sm mb-1">{v.name}</div>
                                                    <div className="text-xs text-white/70 flex flex-col gap-2">
                                                        <span>{v.model}</span>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
                                                                <Users size={10} /> {v.maxPassengers}
                                                            </span>
                                                            {v.specs && (
                                                                <>
                                                                    <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px]" title="Luggage">
                                                                        <Briefcase size={10} /> {v.specs.luggage}
                                                                    </span>
                                                                    <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px]" title="Hand Luggage">
                                                                        <Briefcase size={10} className="scale-75" /> {v.specs.handLuggage}
                                                                    </span>
                                                                    {v.specs.ac && (
                                                                        <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px]" title="Air Conditioned">
                                                                            <Wind size={10} /> A/C
                                                                        </span>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {vehicle === key && (
                                                    <div className="absolute top-3 right-3 bg-gold text-navy p-1 rounded-full shadow-lg">
                                                        <MapPin size={12} fill="currentColor" />
                                                    </div>
                                                )}

                                                {isLocked && (
                                                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                                                        <div className="bg-red-500/90 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                                                            <Lock size={12} /> Small
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Summary & Quote */}
                <div ref={quoteRef} className="bg-navy rounded-[2.5rem] p-8 md:p-14 text-white shadow-3xl lg:sticky lg:top-28 flex flex-col h-fit">
                    <h3 className="text-gold text-2xl font-bold mb-8 flex items-center gap-3">
                        Trip Quote
                    </h3>

                    {(() => {
                        const { total: baseTotal, breakdown } = calculatePrice(distance, vehicle, tripType)
                        const total = baseTotal + (boardShow ? 2000 : 0)

                        return (
                            <>
                                <div className="space-y-6 flex-grow">
                                    <div className="flex justify-between border-b border-white/10 pb-4">
                                        <span className="text-white/60">Distance</span>
                                        <span className="font-bold">{loading ? <Loader2 className="animate-spin inline" /> : (distance ? `${distance.toFixed(1)} km` : '--')}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/10 pb-4 text-sm italic">
                                        <span className="text-white/60">Vehicle</span>
                                        <span className="capitalize">{VEHICLE_PRICING[vehicle]?.name}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/10 pb-4 text-sm italic">
                                        <span className="text-white/60">Trip Type</span>
                                        <span className="capitalize">{tripType.replace('-', ' ')}</span>
                                    </div>

                                    {/* Price Breakdown */}
                                    {breakdown.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-white/10">
                                            <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Price Breakdown</p>
                                            <div className="space-y-2 text-sm">
                                                {breakdown.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between text-white/70">
                                                        <span className="text-xs">{item.range}: {item.description}</span>
                                                        <span className="text-gold font-bold">Rs {item.amount.toLocaleString()}</span>
                                                    </div>
                                                ))}
                                                {boardShow && (
                                                    <div className="flex justify-between text-white/70">
                                                        <span className="text-xs">Airport Greeting (Board Show)</span>
                                                        <span className="text-gold font-bold">Rs 2,000</span>
                                                    </div>
                                                )}
                                                {tripType === 'round-trip' && (
                                                    <div className="flex justify-between text-gold/80 pt-2 border-t border-white/5">
                                                        <span className="text-xs">× 2 (Round Trip)</span>
                                                        <span className="font-bold">Rs {total.toLocaleString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
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
                                        <Info size={14} className="text-gold flex-shrink-0 mt-0.5" />
                                        <p>IMPORTANT: We accept card payments (Visa/Mastercard).</p>
                                    </div>
                                </div>

                                <div className="mb-10 text-center">
                                    <p className="text-white/60 uppercase tracking-widest text-xs mb-2">Estimated Total</p>
                                    <div className="text-4xl md:text-6xl font-extrabold text-gold leading-none pb-2 break-words">
                                        Rs {total.toLocaleString()}
                                    </div>
                                    {usdRate && total > 0 && (
                                        <div className="text-xl font-medium text-white/50">
                                            ≈ ${(total * usdRate).toFixed(2)} USD
                                        </div>
                                    )}
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
                                            total: "Rs " + total.toLocaleString(),
                                            usdTotal: usdRate ? "$" + (total * usdRate).toFixed(2) : 'N/A'
                                        }

                                        // 1. Open WhatsApp Immediately (User Experience Priority)
                                        const usdText = usdRate ? " (~$" + (total * usdRate).toFixed(2) + ")" : ''
                                        const boardText = boardShow ? "%0A---%0ABoard Show: YES (+Rs 2000)%0AName: " + boardName + "%0AFlight: " + flightNumber + "%0AArrival: " + arrivalDate + " @ " + arrivalTime : ''
                                        const emailText = email ? "%0AEmail: " + email : ''
                                        const waText = whatsapp ? "%0AWhatsApp: " + whatsapp : ''
                                        const msg = "Booking Request: %0AFrom: " + pickup.name + "%0ATo: " + dropoff.name + "%0ADistance: " + distance.toFixed(1) + "km%0AVehicle: " + VEHICLE_PRICING[vehicle].name + "%0ATrip: " + tripType + "%0ADate: " + date + "%0ATime: " + time + emailText + waText + "%0APayment: " + paymentMethod.toUpperCase() + boardText + "%0ATotal: Rs " + total.toLocaleString() + usdText

                                        window.open("https://wa.me/94716885880?text=" + msg, '_blank')

                                        // 2. Send to Discord Webhook
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
                                        }

                                        // 3. Send Background Email (Reliability Backup)
                                        try {
                                            await fetch("https://formsubmit.co/ajax/airporttaxis.lk@gmail.com", {
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
                                    className="w-full bg-gold text-navy font-extrabold py-6 rounded-2xl text-xl hover:scale-[1.02] transition-all shadow-2xl disabled:opacity-50 disabled:grayscale"
                                >
                                    {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Book This Trip Now'}
                                </button>
                            </>
                        )
                    })()}
                </div >
            </div>
        </div>
    )
}

export default Prices
