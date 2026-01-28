'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MapPin, Navigation, ArrowRightLeft, Loader2, Info, Users, Briefcase, Wind, Calendar, Clock, ChevronRight, Plus, Minus, Tag, Zap, Check, Car, ChevronDown, ShieldCheck, Lock, Signpost, X } from 'lucide-react'

import Image from 'next/image'
import { useJsApiLoader } from '@react-google-maps/api'
import ToursWidget from './ToursWidget'
import RentalsWidget from './RentalsWidget'
import BookingModal from './BookingModal'
import { useCurrency } from '../context/CurrencyContext'
import VehicleSelectionDrawer from './VehicleSelectionDrawer'
import VehicleCarousel from './VehicleCarousel'
import LocationInput from './LocationInput'

const libraries = ['places'];

// ... (calculatePrice helper remains same)

// Helper to calculate price
const calculatePrice = (distance, vehicleId, tripType, pricingMap, waitingHours, hasNameBoard, couponCode) => {
    if (!distance || !pricingMap[vehicleId]) return { total: 0 };

    const vehicleData = pricingMap[vehicleId];
    let baseRate = vehicleData.perKmRate || 0;

    // Sort tiers by min km
    let total = 0;
    const tiers = (vehicleData.tiers || []).sort((a, b) => a.min - b.min);
    const distKm = Math.ceil(distance);

    for (const tier of tiers) {
        if (distKm >= tier.min && distKm <= tier.max) {
            if (tier.type === 'flat') {
                total = tier.price;
            } else {
                const baseFlat = tiers.filter(t => t.type === 'flat' && t.max < tier.min).sort((a, b) => b.max - a.max)[0];
                const basePrice = baseFlat ? baseFlat.price : 0;
                const baseKm = baseFlat ? baseFlat.max : 0;
                total = basePrice + ((distKm - baseKm) * tier.rate);
            }
            break;
        }
    }

    if (total === 0) {
        total = (vehicleData.basePrice || 0) + (Math.max(0, distKm - (vehicleData.baseKm || 0)) * (vehicleData.perKmRate || 0));
    }

    if (tripType === 'round-trip') total = total * 2;

    // Dynamic Waiting charges
    if (waitingHours > 0) {
        if (vehicleData.waitingCharges && vehicleData.waitingCharges.length >= waitingHours) {
            total += vehicleData.waitingCharges[waitingHours - 1];
        } else {
            total += (waitingHours * (vehicleData.hourlyRate || 500));
        }
    }

    if (hasNameBoard) total += 1000;

    return { total: Math.round(total) };
};

// Internal Loader Component to avoid hook conflicts
const GoogleMapsLoader = ({ onLoaded }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries,
        // Removed preventGoogleFontsLoading to match LiveDriverMap options
    });

    useEffect(() => {
        if (isLoaded && onLoaded) onLoaded();
    }, [isLoaded, onLoaded]);

    return null;
};

const BookingWidget = () => {
    const [activeOffers, setActiveOffers] = useState([]);
    const [appliedOffer, setAppliedOffer] = useState(null);
    const [vehiclePricing, setVehiclePricing] = useState({});
    const [isLoadingPricing, setIsLoadingPricing] = useState(true);
    const [activeTab, setActiveTab] = useState('pickup');
    const [tripType, setTripType] = useState('one-way');
    const [pickup, setPickup] = useState({ name: 'Bandaranaike International Airport (CMB)', lat: 7.1804, lon: 79.8837 })
    const [dropoff, setDropoff] = useState({ name: '', lat: null, lon: null })
    const [waypoints, setWaypoints] = useState([])
    const [pickupSearch, setPickupSearch] = useState('Bandaranaike International Airport (CMB)')
    const [dropoffSearch, setDropoffSearch] = useState('')
    const [waypointSearches, setWaypointSearches] = useState([])
    const [pickupResults, setPickupResults] = useState([])
    const [dropoffResults, setDropoffResults] = useState([])
    const [waypointResults, setWaypointResults] = useState([])

    const [passengerCount, setPassengerCount] = useState({
        adults: 1,
        children: 0,
        infants: 0,
        bags: 0
    })

    const [distance, setDistance] = useState(null)
    const [vehicle, setVehicle] = useState('mini-car')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [waitingHours, setWaitingHours] = useState(0)
    const [hasNameBoard, setHasNameBoard] = useState(false)
    const [couponCode, setCouponCode] = useState('')
    const [isLocating, setIsLocating] = useState(false)
    const { convertPrice, currency } = useCurrency()

    const [isBookingOpen, setIsBookingOpen] = useState(false)
    const [isVehicleDrawerOpen, setIsVehicleDrawerOpen] = useState(false)
    const [bookingInitialData, setBookingInitialData] = useState({})

    // Lazy Map Loading State
    const [shouldLoadMap, setShouldLoadMap] = useState(false);
    const [isMapReady, setIsMapReady] = useState(false);

    // Fetch Pricing based on Tab
    useEffect(() => {
        const fetchPricing = async () => {
            try {
                const categoryMap = {
                    'pickup': 'airport-transfer',
                    'drop': 'airport-transfer',
                    'ride': 'ride-now',
                    'tours': 'tours'
                };
                const category = categoryMap[activeTab] || 'airport-transfer';

                setIsLoadingPricing(true);
                const res = await fetch(`/api/pricing?category=${category}`);
                if (!res.ok) return;
                const data = await res.json();
                if (!Array.isArray(data)) return;
                const pricingMap = {};
                data.forEach(v => { pricingMap[v.vehicleType] = v; });
                setVehiclePricing(pricingMap);
            } catch (error) { console.error(error); } finally { setIsLoadingPricing(false); }
        };
        if (activeTab !== 'tours') fetchPricing();
    }, [activeTab]);

    // Tab Logic - reset fields based on mode
    useEffect(() => {
        if (activeTab === 'pickup') {
            setPickup({ name: 'Bandaranaike International Airport (CMB)', lat: 7.1804, lon: 79.8837 })
            setPickupSearch('Bandaranaike International Airport (CMB)')
            setDropoff({ name: '', lat: null, lon: null })
            setDropoffSearch('')
            setTripType('one-way')
        } else if (activeTab === 'drop') {
            setPickup({ name: '', lat: null, lon: null })
            setPickupSearch('')
            setDropoff({ name: 'Bandaranaike International Airport (CMB)', lat: 7.1804, lon: 79.8837 })
            setDropoffSearch('Bandaranaike International Airport (CMB)')
            setTripType('one-way')
        } else if (activeTab === 'ride') {
            setPickup({ name: '', lat: null, lon: null })
            setPickupSearch('')
            setDropoff({ name: '', lat: null, lon: null })
            setDropoffSearch('')
        }
    }, [activeTab])

    const handleGetCurrentLocation = () => {
        setShouldLoadMap(true); // Trigger Load
        if (!navigator.geolocation) return;
        // Trigger Script Load if not loaded
        // However, we can use browser API without google maps script for lat/lon
        // But we need Geocoder for address name. So we wait/trigger.
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                // Use Google Geocoder if loaded, else fallback? Or just component logic?
                // For simplicity, we can rely on browser coords. 
                // To get address name, we need Geocoder.
                const { latitude, longitude } = pos.coords;

                if (isMapReady) {
                    const geocoder = new window.google.maps.Geocoder();
                    const response = await geocoder.geocode({ location: { lat: latitude, lng: longitude } });
                    if (response.results[0]) {
                        const loc = {
                            name: response.results[0].formatted_address,
                            lat: latitude,
                            lon: longitude
                        };
                        setPickup(loc);
                        setPickupSearch(loc.name);
                    }
                } else {
                    // Fallback without name if script fails?
                    setPickup({ name: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, lat: latitude, lon: longitude });
                    setPickupSearch(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                }

            } catch (err) { console.error(err); } finally { setIsLocating(false); }
        }, () => setIsLocating(false));
    }

    // Distance Calculation (Google Directions)
    useEffect(() => {
        if (isMapReady && pickup.lat && dropoff.lat) {
            const calculateRoute = async () => {
                try {
                    const directionsService = new window.google.maps.DirectionsService();

                    const waypointsList = waypoints.map(w => ({
                        location: { lat: w.lat, lng: w.lon },
                        stopover: true
                    }));

                    const result = await directionsService.route({
                        origin: { lat: pickup.lat, lng: pickup.lon },
                        destination: { lat: dropoff.lat, lng: dropoff.lon },
                        waypoints: waypointsList,
                        travelMode: window.google.maps.TravelMode.DRIVING,
                    });

                    if (result.routes.length > 0) {
                        const route = result.routes[0];
                        let totalMeters = 0;
                        route.legs.forEach(leg => {
                            totalMeters += leg.distance.value;
                        });
                        setDistance(totalMeters / 1000);
                    }
                } catch (err) {
                    console.error("Directions Error:", err);
                    // Fallback to straight line or 0?
                }
            }
            calculateRoute()
        }
    }, [isMapReady, pickup, dropoff, waypoints])

    // Fetch Marketing Offers
    useEffect(() => {
        fetch('/api/admin/marketing')
            .then(res => res.json())
            .then(data => {
                if (data.offers) setActiveOffers(data.offers);
            })
            .catch(err => console.error("Error fetching offers:", err));
    }, []);

    // Check for Location Offers
    useEffect(() => {
        if (!activeOffers.length || !dropoff.name) {
            setAppliedOffer(null);
            return;
        }
        const lowerLoc = dropoff.name.toLowerCase();
        const match = activeOffers.find(o => o.isActive && lowerLoc.includes(o.locationKeyword.toLowerCase()));
        setAppliedOffer(match || null);
    }, [dropoff, activeOffers]);

    const { total } = calculatePrice(distance, vehicle, tripType, vehiclePricing, waitingHours, hasNameBoard, couponCode);

    const discountAmount = appliedOffer
        ? (appliedOffer.discountAmount || (total * (appliedOffer.discountPercentage / 100)))
        : 0;
    const finalTotal = Math.max(0, total - discountAmount);

    const handleBook = () => {
        setBookingInitialData({ pickup: pickup.name, pickupCoords: { lat: pickup.lat, lon: pickup.lon }, dropoff: dropoff.name, dropoffCoords: { lat: dropoff.lat, lon: dropoff.lon }, waypoints, passengerCount, tripType, waitingHours, vehicle, date, time })
        setIsBookingOpen(true)
    };

    const swapLocations = () => {
        const t = { ...pickup }; const ts = pickupSearch;
        setPickup(dropoff); setPickupSearch(dropoffSearch);
        setDropoff(t); setDropoffSearch(ts);
    }

    return (
        <div className="w-full max-w-6xl mx-auto -mt-4 md:-mt-24 relative z-40 px-4">
            {/* Google Maps Loader (Conditional) */}
            {shouldLoadMap && <GoogleMapsLoader onLoaded={() => setIsMapReady(true)} />}

            {/* Tab Navigation */}
            <div className="flex flex-wrap bg-slate-100 dark:bg-white/5 p-1 rounded-2xl w-full mb-6 md:mb-8 gap-1.5 shadow-sm border border-emerald-900/5" role="tablist">
                {[
                    { id: 'pickup', label: 'Pick-up', icon: MapPin },
                    { id: 'drop', label: 'Airport Drop', icon: Navigation },
                    { id: 'ride', label: 'Ride Now', icon: Zap },
                    { id: 'tours', label: 'Tours', icon: Signpost }
                ].map(tab => (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`panel-${tab.id}`}
                        id={`tab-${tab.id}`}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs md:text-sm font-bold transition-all min-w-[120px] ${activeTab === tab.id ? 'bg-emerald-900 text-white shadow-lg' : 'text-emerald-900/80 dark:text-emerald-400/80 hover:bg-emerald-900/5'}`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Widget Main Content */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 lg:p-8 shadow-xl border border-emerald-900/10 dark:border-white/10 animate-slide-up transition-colors duration-300">

                {activeTab === 'tours' ? <ToursWidget /> : (
                    <div className="grid lg:grid-cols-[1.5fr,380px] xl:grid-cols-[1fr,420px] gap-8 lg:gap-12">
                        {/* Section 1: Inputs */}
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex bg-emerald-900/5 dark:bg-white/5 p-1 rounded-xl border border-emerald-900/10 dark:border-white/10 w-full sm:w-auto gap-1">
                                    <button onClick={() => setTripType('one-way')} aria-label="One Way Trip" className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${tripType === 'one-way' ? 'bg-emerald-900 text-white shadow-sm dark:bg-emerald-600' : 'text-emerald-900/80 hover:text-emerald-900 dark:text-white/80 dark:hover:text-white'}`}>One Way</button>
                                    <button
                                        onClick={() => (activeTab !== 'pickup' && activeTab !== 'drop') && setTripType('round-trip')}
                                        disabled={activeTab === 'pickup' || activeTab === 'drop'}
                                        aria-label="Round Trip"
                                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all relative
                                            ${tripType === 'round-trip' && activeTab !== 'pickup' && activeTab !== 'drop' ? 'bg-emerald-900 text-white shadow-sm dark:bg-emerald-600' : 'text-emerald-900/80 dark:text-white/80'}
                                            ${(activeTab === 'pickup' || activeTab === 'drop') ? 'opacity-40 cursor-not-allowed' : 'hover:text-emerald-900 dark:hover:text-white'}
                                        `}
                                    >
                                        Round Trip
                                        {(activeTab === 'pickup' || activeTab === 'drop') && (
                                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-[7px] text-white shadow-sm">🔒</span>
                                        )}
                                    </button>
                                </div>
                                <button onClick={handleGetCurrentLocation} aria-label="Auto Detect Location" className="text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:underline flex items-center gap-2 bg-emerald-50 dark:bg-white/5 px-4 py-2 rounded-xl border border-emerald-600/10 w-full sm:w-auto justify-center whitespace-nowrap">
                                    {isLocating ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                                    Auto Detect
                                </button>
                            </div>

                            <div className="space-y-3">
                                {/* Pickup Input */}
                                <LocationInput
                                    placeholder="Pick-up Location"
                                    value={pickupSearch}
                                    icon={MapPin}
                                    disabled={activeTab === 'pickup'}
                                    isLoaded={isMapReady}
                                    onFocus={() => setShouldLoadMap(true)}
                                    onChange={(val) => setPickupSearch(val)}
                                    onSelect={(loc) => {
                                        setPickup({ name: loc.address, lat: loc.lat, lon: loc.lng });
                                        setPickupSearch(loc.address);
                                    }}
                                />


                                {/* Waypoints List */}
                                {waypoints.map((wp, idx) => (
                                    <div key={idx} className="relative group animate-slide-up">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-900/40 dark:text-emerald-400/40"><Navigation size={18} /></div>
                                        <input
                                            type="text"
                                            readOnly
                                            value={wp.name}
                                            className="w-full pl-16 pr-12 h-14 rounded-2xl text-sm font-bold bg-white dark:bg-white/5 border border-emerald-900/10 dark:border-white/10 text-emerald-900/60 dark:text-white/60"
                                        />
                                        <button
                                            onClick={() => setWaypoints(prev => prev.filter((_, i) => i !== idx))}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                            aria-label="Remove stop"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}


                                {/* Add Waypoint Search */}
                                {waypoints.length < 4 && (
                                    <>
                                        {/* "Add Stop" Button - Aligned with icons */}
                                        {waypointSearches.length === 0 && (
                                            <div className="flex justify-start pl-14 py-1">
                                                <button
                                                    onClick={() => setWaypointSearches([{ active: true }])}
                                                    aria-label="Add Stop"
                                                    className="text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 hover:bg-emerald-50 dark:hover:bg-white/5 py-1.5 px-3 rounded-lg transition-colors"
                                                >
                                                    <Plus size={14} /> Add Stop
                                                </button>
                                            </div>
                                        )}

                                        {/* Active Search Input */}
                                        {waypointSearches.length > 0 && (
                                            <div className="relative group animate-fade-in">
                                                <LocationInput
                                                    placeholder="Add Stop (Search City)"
                                                    icon={Navigation}
                                                    isLoaded={isMapReady}
                                                    onFocus={() => setShouldLoadMap(true)}
                                                    onSelect={(loc) => {
                                                        setWaypoints([...waypoints, { name: loc.address, lat: loc.lat, lon: loc.lng }]);
                                                        setWaypointSearches([]);
                                                    }}
                                                />
                                                <button
                                                    onClick={() => setWaypointSearches([])}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 z-30"
                                                    aria-label="Cancel add stop"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Swap Button Visual - Aligned Left */}
                                <div className="flex justify-end pr-6 -my-5 relative z-10 pointer-events-none">
                                    <button
                                        onClick={swapLocations}
                                        className="w-8 h-8 pointer-events-auto bg-white dark:bg-slate-800 border border-emerald-900/10 dark:border-white/10 rounded-full flex items-center justify-center hover:scale-110 active:rotate-180 transition-all text-emerald-900 dark:text-white shadow-sm"
                                        aria-label="Swap pickup and dropoff locations"
                                    >
                                        <ArrowRightLeft size={14} />
                                    </button>
                                </div>

                                {/* Dropoff Input */}
                                <LocationInput
                                    placeholder="Drop-off Location"
                                    value={dropoffSearch}
                                    icon={MapPin}
                                    disabled={activeTab === 'drop'}
                                    isLoaded={isMapReady}
                                    onFocus={() => setShouldLoadMap(true)}
                                    onChange={(val) => setDropoffSearch(val)}
                                    onSelect={(loc) => {
                                        setDropoff({ name: loc.address, lat: loc.lat, lon: loc.lng });
                                        setDropoffSearch(loc.address);
                                    }}
                                />
                            </div>

                            {/* Extra Options Grid - Stack on LG, Grid on XL */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                {activeTab === 'pickup' && (
                                    <button
                                        onClick={() => setHasNameBoard(!hasNameBoard)}
                                        aria-pressed={hasNameBoard}
                                        className={`h-16 px-4 rounded-2xl border transition-all flex items-center justify-between group ${hasNameBoard ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:border-emerald-500/50 text-emerald-900 dark:text-emerald-50' : 'bg-white dark:bg-white/5 border-emerald-900/10 dark:border-white/10 text-emerald-900/60 dark:text-white/60 hover:border-emerald-600/30'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Signpost size={18} className={hasNameBoard ? 'text-emerald-600 dark:text-emerald-400' : ''} />
                                            <div className="text-left">
                                                <span className="text-xs font-bold block">Name Board</span>
                                                <span className="text-[10px] font-medium opacity-60">Meet & Greet</span>
                                            </div>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${hasNameBoard ? 'border-emerald-600 bg-emerald-600 dark:border-emerald-500 dark:bg-emerald-500' : 'border-emerald-900/20 dark:border-white/20'}`}>
                                            {hasNameBoard && <Check size={12} className="text-white" />}
                                        </div>
                                    </button>
                                )}

                                <div className="relative h-16">
                                    <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-900/70 dark:text-white/70" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Coupon Code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        className="w-full h-full pl-14 pr-20 rounded-2xl bg-white dark:bg-white/5 border border-emerald-900/10 dark:border-white/10 text-sm font-bold outline-none focus:border-emerald-600 dark:focus:border-emerald-500 transition-all uppercase text-emerald-900 dark:text-white placeholder:text-emerald-900/30 dark:placeholder:text-white/30"
                                        aria-label="Coupon code"
                                    />
                                    <button
                                        onClick={async () => {
                                            if (!couponCode.trim()) return;
                                            try {
                                                const res = await fetch('/api/coupons/validate', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({
                                                        code: couponCode,
                                                        pickup: pickup.name || pickupSearch,
                                                        dropoff: dropoff.name || dropoffSearch
                                                    })
                                                });
                                                const data = await res.json();
                                                if (data.valid) {
                                                    const couponOffer = {
                                                        _id: 'coupon-' + data.coupon.code,
                                                        name: data.coupon.code,
                                                        discountPercentage: data.coupon.discountType === 'percentage' ? data.coupon.value : 0,
                                                        discountAmount: data.coupon.discountType === 'flat' ? data.coupon.value : 0,
                                                        type: 'coupon'
                                                    };
                                                    setAppliedOffer(couponOffer);
                                                    alert('Coupon Applied: ' + data.coupon.code);
                                                } else {
                                                    alert(data.message || 'Invalid Coupon');
                                                    setAppliedOffer(null);
                                                }
                                            } catch (e) {
                                                console.error(e);
                                                alert('Validation failed');
                                            }
                                        }}
                                        aria-label="Apply Coupon"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>

                            {/* Date & Time Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-emerald-900 dark:text-white uppercase tracking-widest mb-2 block pl-1">Date</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={date}
                                            min={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full h-16 pl-4 pr-4 bg-white dark:bg-white/5 border border-emerald-900/10 dark:border-white/10 rounded-2xl text-emerald-900 dark:text-white font-bold outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:ring-4 focus:ring-emerald-900/5 transition-all w-full appearance-none"
                                            aria-label="Pickup Date"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-900/70 dark:text-white/70">
                                            <Calendar size={18} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-emerald-900 dark:text-white uppercase tracking-widest mb-2 block pl-1">Time</label>
                                    <div className="relative">
                                        <input
                                            type="time"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className="w-full h-16 pl-4 pr-4 bg-white dark:bg-white/5 border border-emerald-900/10 dark:border-white/10 rounded-2xl text-emerald-900 dark:text-white font-bold outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:ring-4 focus:ring-emerald-900/5 transition-all w-full appearance-none"
                                            aria-label="Pickup Time"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-900/70 dark:text-white/70">
                                            <Clock size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Counters Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                {[
                                    { id: 'adults', label: 'Adults' },
                                    { id: 'children', label: 'Children' },
                                    { id: 'infants', label: 'Infants' },
                                    { id: 'bags', label: 'Bags' }
                                ].map(c => (
                                    <div key={c.id} className="bg-emerald-50 dark:bg-white/[0.03] border border-emerald-900/5 dark:border-white/10 p-2 rounded-xl flex flex-col items-center justify-center transition-colors">
                                        <span className="text-[9px] font-bold text-emerald-900 dark:text-white uppercase tracking-widest mb-2">{c.label}</span>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setPassengerCount(p => ({ ...p, [c.id]: Math.max(0, p[c.id] - 1) }))}
                                                className="w-6 h-6 rounded-lg bg-white dark:bg-white/10 border border-emerald-900/10 dark:border-white/10 flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-white/20 transition-colors text-emerald-900 dark:text-white"
                                                aria-label={`Decrease ${c.label}`}
                                            >
                                                <Minus size={10} />
                                            </button>
                                            <span className="font-extrabold text-sm text-emerald-900 dark:text-white min-w-[12px] text-center" aria-live="polite">{passengerCount[c.id]}</span>
                                            <button
                                                onClick={() => setPassengerCount(p => ({ ...p, [c.id]: p[c.id] + 1 }))}
                                                className="w-6 h-6 rounded-lg bg-white dark:bg-white/10 border border-emerald-900/10 dark:border-white/10 flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-white/20 transition-colors text-emerald-900 dark:text-white"
                                                aria-label={`Increase ${c.label}`}
                                            >
                                                <Plus size={10} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Vehicle Selection - Unified for Desktop & Mobile */}
                            <div className="mt-4">
                                <label className="text-[10px] font-bold text-emerald-900 dark:text-white uppercase tracking-widest mb-2 block pl-1">Selected Vehicle</label>
                                <button
                                    onClick={() => setIsVehicleDrawerOpen(true)}
                                    className="w-full h-20 px-4 flex items-center justify-between bg-white dark:bg-white/5 border border-emerald-900/10 dark:border-white/10 rounded-2xl hover:border-emerald-600 dark:hover:border-emerald-500 hover:shadow-md transition-all group"
                                    aria-label="Select Vehicle"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-12 bg-slate-50 dark:bg-white/10 rounded-xl flex items-center justify-center p-1">
                                            {vehiclePricing[vehicle]?.image ? (
                                                <div className="relative w-full h-full">
                                                    <Image
                                                        src={vehiclePricing[vehicle].image}
                                                        alt={vehiclePricing[vehicle]?.name || "Vehicle"}
                                                        fill
                                                        className="object-contain mix-blend-multiply dark:mix-blend-normal"
                                                        sizes="64px"
                                                    />
                                                </div>
                                            ) : (
                                                <Car className="text-emerald-900/40 dark:text-white/40" />
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-base text-emerald-900 dark:text-white">{vehiclePricing[vehicle]?.name || 'Select Vehicle'}</p>
                                            <div className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                                                <span>{vehiclePricing[vehicle]?.capacity || 4} Passengers</span>
                                                <span className="w-1 h-1 bg-emerald-600/30 rounded-full"></span>
                                                <span>{vehiclePricing[vehicle]?.luggage || 2} Luggage</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-white/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                        <ChevronDown size={16} />
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Section 2: Summary & Checkout */}
                        <div className="lg:border-l lg:border-emerald-900/10 dark:lg:border-white/10 lg:pl-8 flex flex-col justify-between h-full">

                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-emerald-900 dark:text-white tracking-tight">Trip Summary</h2>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-emerald-900/40 dark:text-white/40">Est. Distance</span>
                                        <span className="text-emerald-900 dark:text-white font-bold">{distance ? `${distance.toFixed(1)} KM` : '--'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-emerald-900/40 dark:text-white/40">Vehicle Type</span>
                                        <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/50 px-3 py-1 rounded-lg">
                                            {vehiclePricing[vehicle]?.name || 'Select Vehicle'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-emerald-900/40 dark:text-white/40">Waiting Hours</span>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setWaitingHours(Math.max(0, waitingHours - 1))} className="text-emerald-600 dark:text-emerald-400 font-bold"><Minus size={12} /></button>
                                            <span className="font-bold text-emerald-900 dark:text-white">{waitingHours}</span>
                                            <button onClick={() => setWaitingHours(waitingHours + 1)} className="text-emerald-600 dark:text-emerald-400 font-bold"><Plus size={12} /></button>
                                        </div>
                                    </div>
                                    {hasNameBoard && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-emerald-900/40 dark:text-white/40">Meet & Greet</span>
                                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Included</span>
                                        </div>
                                    )}
                                </div>

                            </div>

                            <div className="pt-6 border-t border-emerald-900/10 dark:border-white/10">
                                <div className="flex justify-between items-end mb-8">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-emerald-900/40 dark:text-white/40 uppercase tracking-widest">Grand Total</span>
                                        <span className="text-4xl font-black text-emerald-900 dark:text-white">
                                            {convertPrice(finalTotal).symbol} {convertPrice(finalTotal).value.toLocaleString()}
                                        </span>
                                    </div>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs bg-emerald-50 dark:bg-emerald-900/50 px-3 py-1 rounded-full uppercase tracking-tighter flex items-center gap-1">
                                        <Check size={12} /> ALL INCLUSIVE
                                    </span>
                                </div>

                                <button
                                    onClick={handleBook}
                                    disabled={!distance}
                                    className="w-full py-5 bg-emerald-900 dark:bg-emerald-600 text-white rounded-[1.5rem] font-bold text-lg hover:bg-emerald-800 dark:hover:bg-emerald-500 active:scale-[0.98] transition-all shadow-xl disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 group"
                                >
                                    <ShieldCheck size={18} className="opacity-60" />
                                    Secure Booking
                                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} initialData={bookingInitialData} />
            <VehicleSelectionDrawer
                isOpen={isVehicleDrawerOpen}
                onClose={() => setIsVehicleDrawerOpen(false)}
                vehicles={Object.values(vehiclePricing)}
                selectedId={vehicle}
                onSelect={setVehicle}
                passengerCount={passengerCount}
                isLoading={isLoadingPricing}
            />
        </div >
    )
}

export default BookingWidget
