'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MapPin, Navigation, ArrowRightLeft, Loader2, Info, Users, Briefcase, Wind, Calendar, Clock, ChevronRight, Plus, Minus, Tag, Zap, Check, Car, ChevronDown, ShieldCheck, Lock, Signpost, X } from 'lucide-react'

import Image from 'next/image'
import ToursWidget from './ToursWidget'
import RentalsWidget from './RentalsWidget'
import BookingModal from './BookingModal'
import { useCurrency } from '../context/CurrencyContext'
import VehicleSelectionDrawer from './VehicleSelectionDrawer'
import VehicleCarousel from './VehicleCarousel'
import LocationInput from './LocationInput'
import SmartOfferNudge from './SmartOfferNudge'
import TripMap from './TripMap'


import { calculateBasePrice, calculateSurcharges } from '@/lib/pricing-util';

// (Helper to calculate price)
const calculatePrice = (distance, vehicleId, tripType, pricingMap, waitingHours, hasNameBoard, nameBoardPrice = 2000) => {
    if (!distance || !pricingMap[vehicleId]) return { total: 0 };
    const vehicleData = pricingMap[vehicleId];

    const basePrice = calculateBasePrice(distance, vehicleData, tripType);
    const surcharges = calculateSurcharges({ waitingHours, hasNameBoard, nameBoardPrice }, vehicleData);

    return { total: basePrice + surcharges };
};

// Internal Loader Component to avoid hook conflicts

const BookingWidget = ({ defaultTab = 'pickup' }) => {
    const [activeOffers, setActiveOffers] = useState([]);
    const [appliedOffers, setAppliedOffers] = useState([]); // Support multiple coupons
    const [vehiclePricing, setVehiclePricing] = useState({});
    const [isLoadingPricing, setIsLoadingPricing] = useState(true);
    const [activeTab, setActiveTab] = useState(defaultTab);
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
    const { convertPrice, currency, changeCurrency, SUPPORTED_CURRENCIES, rates } = useCurrency()

    const [isBookingOpen, setIsBookingOpen] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [isVehicleDrawerOpen, setIsVehicleDrawerOpen] = useState(false)
    const [bookingInitialData, setBookingInitialData] = useState({})
    const [availableCoupons, setAvailableCoupons] = useState([])
    const [isLoadingCoupons, setIsLoadingCoupons] = useState(false)
    const [isCouponOpen, setIsCouponOpen] = useState(false)

    const [dismissedOfferIds, setDismissedOfferIds] = useState([]);
    const [nameBoardPrice, setNameBoardPrice] = useState(2000); // Default, updated via API


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
                const res = await fetch(`/api/pricing?category=${category}`, { cache: 'no-store' });
                if (!res.ok) {
                    console.error('Pricing Fetch Failed', res.status);
                    return;
                }
                const response = await res.json();
                console.log(`Fetched Pricing for ${category}:`, response); // Debug Log

                const vehicles = response.data || [];
                if (!Array.isArray(vehicles)) return;

                const pricingMap = {};
                vehicles.forEach(v => { pricingMap[v.vehicleType] = v; });
                setVehiclePricing(pricingMap);

                // Set Nameboard Price if available
                if (response.meta?.nameBoardPrice) {
                    setNameBoardPrice(response.meta.nameBoardPrice);
                }
            } catch (error) { console.error(error); } finally { setIsLoadingPricing(false); }
        };
        if (activeTab !== 'tours') fetchPricing();
    }, [activeTab]);

    // URL Params Effect for Offers
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const couponParam = params.get('coupon');
        const destParam = params.get('destination');

        if (couponParam) {
            setCouponCode(couponParam);
            // Coupon verification will happen in the modal

            // Clean up URL
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }

        if (destParam) {
            setDropoff({
                address: destParam,
                lat: null,
                lon: null,
                name: destParam
            });
            setDropoffSearch(destParam);
            setActiveTab('pickup');
        }

    }, []);

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
        if (!navigator.geolocation) return;
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                const { latitude, longitude } = pos.coords;

                // Load Google Maps Script if not already loaded (Generic check)
                if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
                    // Ideally rely on it being loaded, but basic safety
                    // In this app structure, LocationInput loads it fast. 
                    // If not loaded, we might fail here, but assuming script is present:
                }

                if (window.google && window.google.maps) {
                    const geocoder = new window.google.maps.Geocoder();
                    geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
                        if (status === 'OK' && results[0]) {
                            const loc = {
                                name: results[0].formatted_address,
                                lat: latitude,
                                lon: longitude
                            };
                            setPickup(loc);
                            setPickupSearch(loc.name);
                        } else {
                            // Fallback to coords
                            setPickup({ name: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, lat: latitude, lon: longitude });
                            setPickupSearch(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                        }
                        setIsLocating(false);
                    });
                } else {
                    // Very fallback
                    setPickup({ name: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, lat: latitude, lon: longitude });
                    setPickupSearch(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                    setIsLocating(false);
                }

            } catch (err) {
                console.error("Locating Error:", err);
                setIsLocating(false);
            }
        }, () => setIsLocating(false));
    }

    // Distance updated via TripMap callback now
    const handleRouteCalculated = (data) => {
        setDistance(data.distanceKm);
        // We could also set duration if needed
    }

    // Fetch Marketing Offers
    useEffect(() => {
        fetch('/api/admin/marketing')
            .then(res => res.json())
            .then(data => {
                if (data.offers) setActiveOffers(data.offers);
            })
            .catch(err => console.error("Error fetching offers:", err));
    }, []);

    // Fetch Available Coupons for Widget
    useEffect(() => {
        const fetchCoupons = async () => {
            setIsLoadingCoupons(true);
            try {
                const res = await fetch('/api/coupons?public=true', { cache: 'no-store' });
                const data = await res.json();
                if (Array.isArray(data)) setAvailableCoupons(data);
            } catch (e) {
                console.error("Error fetching coupons:", e);
            } finally {
                setIsLoadingCoupons(false);
            }
        };
        fetchCoupons();
    }, []);

    // Dynamic Coupon Filtering based on Location
    const filteredCoupons = React.useMemo(() => {
        if (!availableCoupons.length) return [];

        const pickupText = (pickup?.name || pickupSearch || '').toLowerCase();
        const dropoffText = (dropoff?.name || dropoffSearch || '').toLowerCase();
        const fullRoute = `${pickupText} ${dropoffText}`;

        return availableCoupons.filter(coupon => {
            // If coupon has no location restrictions, consider it global
            if (!coupon.applicableLocations || coupon.applicableLocations.length === 0) {
                return true;
            }

            // Check if any applicable location matches the current route
            return coupon.applicableLocations.some(loc =>
                fullRoute.includes(loc.toLowerCase())
            );
        });
    }, [availableCoupons, pickup, pickupSearch, dropoff, dropoffSearch]);

    // Check for Location Offers (Smart Offers)
    useEffect(() => {
        const dest = (dropoff?.name || dropoffSearch || '').toLowerCase().trim();
        const start = (pickup?.name || pickupSearch || '').toLowerCase().trim();

        // Prevent matching on very short/generic strings to avoid false positives
        if (dest.length < 3 && start.length < 3) {
            setAppliedOffers(prev => prev.filter(o => o.type !== 'location'));
            return;
        }

        setAppliedOffers(prev => {
            // Keep manual coupons
            const existingManual = prev.filter(o => o.type === 'coupon');
            const dynamicOffers = [];

            // PRIORITY 1: Precise Database Coupons
            availableCoupons.forEach(coupon => {
                if (coupon.applicableLocations && coupon.applicableLocations.length > 0) {
                    let matchedLoc = null;
                    const isMatch = coupon.applicableLocations.some(loc => {
                        const l = loc.toLowerCase().trim();
                        if (l.length < 3) return false;

                        // Exact word match or prominent presence in route
                        const regex = new RegExp(`\\b${l}\\b`, 'i');
                        const match = regex.test(dest) || regex.test(start);
                        if (match) matchedLoc = loc; // Store the actual matched location name
                        return match;
                    });

                    if (isMatch) {
                        dynamicOffers.push({
                            _id: 'auto-' + coupon.code,
                            name: coupon.code,
                            discountPercentage: coupon.discountType === 'percentage' ? coupon.value : 0,
                            discountAmount: coupon.discountType === 'flat' ? coupon.value : 0,
                            description: coupon.description || `Special offer for ${matchedLoc}!`,
                            isActive: true,
                            type: 'location',
                            imageUrl: coupon.imageUrl
                        });
                    }
                }
            });

            // PRIORITY 2: Marketing offers (Backwards compatibility)
            if (activeOffers && activeOffers.length > 0) {
                activeOffers.forEach(o => {
                    const kw = o.locationKeyword?.toLowerCase().trim();
                    if (kw && kw.length >= 3) {
                        const regex = new RegExp(`\\b${kw}\\b`, 'i');
                        if (regex.test(dest) || regex.test(start)) {
                            dynamicOffers.push({ ...o, type: 'location' });
                        }
                    }
                });
            }

            // Combine, Sort by Value, and Limit to Best Offer
            const finalDynamic = [];

            // 1. Sort all found offers by discount value (higher first)
            const sortedDynamic = [...dynamicOffers].sort((a, b) => {
                const valA = a.discountPercentage || (a.discountAmount / 100) || 0; // Normalize flat values roughly
                const valB = b.discountPercentage || (b.discountAmount / 100) || 0;
                return valB - valA;
            });

            // 2. Only take the TOP 1 best offer that isn't already applied manually
            if (sortedDynamic.length > 0) {
                const bestOffer = sortedDynamic[0];
                const alreadyApplied = existingManual.some(m => m.name === bestOffer.name);
                if (!alreadyApplied) {
                    finalDynamic.push(bestOffer);
                }
            }

            return [...existingManual, ...finalDynamic];
        });
    }, [dropoff, dropoffSearch, pickup, pickupSearch, availableCoupons, activeOffers]);


    // Calculate total waiting hours including waypoints
    const totalWaitingHours = waitingHours + waypoints.reduce((sum, wp) => sum + (wp.waitingTime || 0), 0);
    // Updated calculatePrice call with nameBoardPrice
    const { total } = calculatePrice(distance, vehicle, tripType, vehiclePricing, totalWaitingHours, hasNameBoard, nameBoardPrice);

    // Calculate total discount from all applied offers
    const discountAmount = appliedOffers.reduce((sum, offer) => {
        return sum + (offer.discountAmount || (total * (offer.discountPercentage / 100)));
    }, 0);

    const finalTotal = Math.max(0, total - discountAmount);

    const handleBook = () => {
        const verifiedCoupons = appliedOffers.map(offer => ({
            code: offer.name,
            discountType: offer.discountPercentage > 0 ? 'percentage' : 'flat',
            value: offer.discountPercentage > 0 ? offer.discountPercentage : offer.discountAmount
        }));

        setBookingInitialData({
            pickup: pickup.name,
            pickupCoords: { lat: pickup.lat, lon: pickup.lon },
            dropoff: dropoff.name,
            dropoffCoords: { lat: dropoff.lat, lon: dropoff.lon },
            waypoints,
            passengerCount,
            tripType,
            waitingHours: totalWaitingHours,
            hasNameBoard,
            date,
            time,
            distance,
            vehicle,
            couponCode: verifiedCoupons.length > 0 ? verifiedCoupons[0].code : '',
            verifiedCoupons,
            nameBoardPrice
        });
        setShowModal(true);
    };

    const swapLocations = () => {
        const t = { ...pickup }; const ts = pickupSearch;
        setPickup(dropoff); setPickupSearch(dropoffSearch);
        setDropoff(t); setDropoffSearch(ts);
    }

    // Determine Pricing Category
    const pricingCategory = ['pickup', 'drop'].includes(activeTab) ? 'airport-transfer' : 'ride-now';

    return (
        <div className="w-full max-w-6xl mx-auto -mt-4 md:-mt-24 relative z-40 px-4">
            {/* Google Maps Loader (Conditional) */}

            {/* Tab Navigation */}
            <div className="flex flex-wrap bg-white dark:bg-slate-900 p-1 rounded-2xl w-full mb-6 md:mb-8 gap-1.5 shadow-sm border border-slate-200 dark:border-slate-800" role="tablist">
                {[
                    { id: 'pickup', label: 'Airport Pickup', icon: MapPin },
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
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs md:text-sm font-bold transition-all min-w-[120px] ${activeTab === tab.id ? 'bg-[#FFC107] text-black shadow-md border-b-2 border-amber-600/30 ring-1 ring-amber-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Widget Main Content */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 lg:p-8 shadow-2xl border-2 border-black dark:border-slate-700 animate-slide-up relative z-10">

                {activeTab === 'tours' ? <ToursWidget /> : (
                    <div className="grid lg:grid-cols-[1.5fr,380px] xl:grid-cols-[1fr,420px] gap-8 lg:gap-12 min-w-0">
                        {/* Section 1: Inputs */}
                        <div className="space-y-6 min-w-0">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto gap-1">
                                    <button onClick={() => setTripType('one-way')} aria-label="One Way Trip" className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${tripType === 'one-way' ? 'bg-black text-white shadow-md' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/50'}`}>One Way</button>
                                    <button
                                        onClick={() => (activeTab !== 'pickup' && activeTab !== 'drop') && setTripType('round-trip')}
                                        disabled={activeTab === 'pickup' || activeTab === 'drop'}
                                        aria-label="Round Trip"
                                        className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-xs font-bold transition-all relative
                                            ${tripType === 'round-trip' && activeTab !== 'pickup' && activeTab !== 'drop' ? 'bg-black text-white shadow-md' : 'text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-white hover:bg-emerald-200/50 dark:hover:bg-emerald-800/30'}
                                            ${(activeTab === 'pickup' || activeTab === 'drop') ? 'opacity-40 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        Round Trip
                                        {(activeTab === 'pickup' || activeTab === 'drop') && (
                                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-[7px] text-white shadow-sm">🔒</span>
                                        )}
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    {/* Currency Selector */}
                                    <div className="relative group z-[110]">
                                        <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-900 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-black text-slate-700 dark:text-slate-300 hover:border-black transition-all shadow-sm">
                                            <span className="text-sm">{SUPPORTED_CURRENCIES.find(c => c.code === currency)?.flag}</span>
                                            <span className="opacity-80 uppercase">{currency}</span>
                                            <ChevronDown size={14} className="opacity-50" />
                                        </button>
                                        <div className="absolute top-full left-0 mt-3 w-40 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="py-2">
                                                {SUPPORTED_CURRENCIES.map(c => (
                                                    <button
                                                        key={c.code}
                                                        onClick={() => changeCurrency(c.code)}
                                                        className={`w-full text-left px-5 py-3 text-xs font-bold flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${currency === c.code ? 'text-amber-700 bg-amber-50 dark:bg-slate-700 border-l-2 border-amber-700' : 'text-slate-600 dark:text-slate-400'}`}
                                                    >
                                                        <span className="text-base">{c.flag}</span>
                                                        <span>{c.code}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={handleGetCurrentLocation} aria-label="Auto Detect Location" className="flex-1 text-black text-xs font-black hover:scale-105 active:scale-95 transition-all flex items-center gap-2 bg-[#FFC107] px-6 py-3 rounded-xl border border-black justify-center whitespace-nowrap shadow-sm hover:shadow-md hover:bg-[#FFC107]/90">
                                        {isLocating ? <Loader2 size={16} className="animate-spin text-black" /> : <Zap size={16} className="fill-black text-black" />}
                                        <span className="hidden sm:inline">Auto Detect</span>
                                        <span className="sm:hidden">GPS</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4 md:space-y-3">
                                {/* Pickup Input */}
                                <LocationInput
                                    placeholder="Pick-up Location"
                                    value={pickupSearch}
                                    icon={MapPin}
                                    disabled={activeTab === 'pickup'}
                                    onChange={(val) => setPickupSearch(val)}
                                    zIndex="z-[100]"
                                    onSelect={(loc) => {
                                        setPickup({ name: loc.address, lat: loc.lat, lon: loc.lon });
                                        setPickupSearch(loc.address);
                                    }}
                                />


                                {/* Waypoints List */}
                                {waypoints.map((wp, idx) => (
                                    <div key={idx} className="relative group animate-slide-up bg-white dark:bg-emerald-900/20 rounded-2xl border border-slate-900 dark:border-emerald-800/50 p-1 flex items-center overflow-hidden">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900/40 dark:text-emerald-400/40 pointer-events-none z-10">
                                            <Navigation size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            readOnly
                                            value={wp.name}
                                            className="flex-1 min-w-0 pl-12 pr-4 h-12 bg-transparent border-none text-sm font-bold text-slate-900 dark:text-white outline-none truncate"
                                        />

                                        <div className="flex flex-col items-center border-l border-slate-900/10 dark:border-white/10 px-2 min-w-[70px] sm:min-w-[100px] justify-center">
                                            <div className="flex items-center gap-1">
                                                <div className="relative">
                                                    <Clock size={12} className="text-slate-900/40 dark:text-white/40 shrink-0 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                    <select
                                                        value={wp.waitingTime || 0}
                                                        onChange={(e) => {
                                                            const newWps = [...waypoints];
                                                            newWps[idx].waitingTime = parseInt(e.target.value);
                                                            setWaypoints(newWps);
                                                        }}
                                                        className="bg-slate-100 dark:bg-white/10 pl-5 pr-5 py-1.5 rounded-lg text-[10px] font-black text-slate-900 dark:text-white outline-none cursor-pointer appearance-none text-center hover:bg-slate-200 transition-colors border border-transparent focus:border-amber-500"
                                                    >
                                                        {[0, 1, 2, 3, 4, 5, 6].map(h => (
                                                            <option key={h} value={h} className="bg-white text-slate-900 text-xs">{h}h</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <span className="text-[8px] font-black text-slate-400 mt-0.5 leading-none">(Rs 500/hr)</span>
                                        </div>

                                        <button
                                            onClick={() => setWaypoints(prev => prev.filter((_, i) => i !== idx))}
                                            className="ml-2 mr-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            aria-label="Remove stop"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}


                                {/* Add Waypoint Search */}
                                {waypoints.length < 8 && (
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
                                                    zIndex="z-40"
                                                    onSelect={(loc) => {
                                                        setWaypoints([...waypoints, { name: loc.address, lat: loc.lat, lon: loc.lon, waitingTime: 0 }]);
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

                                {/* Swap Button Visual - Floating between inputs */}
                                <div className="relative h-0 z-30 flex justify-end pr-6 pointer-events-none">
                                    <button
                                        onClick={swapLocations}
                                        className="w-8 h-8 -translate-y-1/2 pointer-events-auto bg-white dark:bg-slate-800 border border-emerald-900/10 dark:border-white/10 rounded-full flex items-center justify-center hover:scale-110 active:rotate-180 transition-all text-emerald-900 dark:text-white shadow-sm"
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
                                    zIndex="z-[20]"
                                    disabled={activeTab === 'drop'}
                                    onChange={(val) => setDropoffSearch(val)}
                                    onSelect={(loc) => {
                                        setDropoff({ name: loc.address, lat: loc.lat, lon: loc.lon });
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
                                        className={`h-16 px-4 rounded-2xl border transition-all flex items-center justify-between group ${hasNameBoard ? 'border-amber-700 bg-amber-50 dark:bg-emerald-900/30 dark:border-emerald-500/50 text-amber-900 dark:text-emerald-50' : 'bg-white dark:bg-white/5 border-slate-900 dark:border-white/10 text-slate-900/60 dark:text-white/60 hover:border-black'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Signpost size={20} className={hasNameBoard ? 'text-emerald-600' : 'text-slate-400'} />
                                            <div className="text-left">
                                                <span className="text-xs font-bold block uppercase tracking-tight text-slate-700">Display Name Board</span>
                                                <span className="text-[10px] font-medium text-slate-400">Driver waits with name sign</span>
                                            </div>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${hasNameBoard ? 'border-amber-700 bg-amber-700 dark:border-emerald-500 dark:bg-emerald-500' : 'border-slate-900/20 dark:border-white/20'}`}>
                                            {hasNameBoard && <Check size={12} className="text-white" />}
                                        </div>
                                    </button>
                                )}

                                <div className="space-y-3">
                                    <button
                                        onClick={() => setIsCouponOpen(!isCouponOpen)}
                                        className="flex items-center gap-2 text-xs font-bold text-black hover:text-slate-900 transition-colors bg-[#FFC107] box-shadow-md px-4 py-3 rounded-xl w-full justify-center"
                                    >
                                        <Tag size={16} className="fill-black/20" />
                                        {isCouponOpen ? 'Hide Coupon Field' : 'Do you have a Coupon Code?'}
                                    </button>

                                    {/* Applied Coupons List */}
                                    {appliedOffers.length > 0 && (
                                        <div className="flex flex-wrap gap-2 animate-fade-in">
                                            {appliedOffers.map((offer, i) => (
                                                <div key={i} className="flex items-center gap-1.5 bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-lg border border-emerald-200 shadow-sm">
                                                    <Tag size={12} className="fill-emerald-500/20" />
                                                    <span className="text-[10px] font-bold uppercase">{offer.name}</span>
                                                    <span className="text-[10px] font-bold opacity-60">
                                                        (-{offer.discountPercentage > 0 ? `${offer.discountPercentage}%` : `Rs ${offer.discountAmount}`})
                                                    </span>
                                                    <button
                                                        onClick={() => setAppliedOffers(prev => prev.filter(o => o.name !== offer.name))}
                                                        className="ml-1 p-0.5 hover:bg-emerald-200 rounded-md transition-colors"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {isCouponOpen && (
                                        <div className="relative h-16 animate-slide-up">
                                            <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-600 dark:text-amber-400" size={20} />
                                            <input
                                                type="text"
                                                placeholder="ENTER COUPON CODE"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                className="w-full h-full pl-14 pr-24 rounded-2xl bg-white dark:bg-white/5 border-2 border-amber-200 dark:border-amber-900/50 text-base font-black outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all uppercase text-slate-900 dark:text-white placeholder:text-slate-900/30 dark:placeholder:text-white/30 tracking-widest"
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
                                                            setAppliedOffers(prev => {
                                                                if (prev.some(o => o.name === couponOffer.name)) return prev;
                                                                return [...prev, couponOffer];
                                                            });
                                                            alert('Coupon Applied: ' + data.coupon.code);
                                                        } else {
                                                            alert(data.message || 'Invalid Coupon');
                                                            // data.valid is false, do nothing
                                                        }
                                                    } catch (e) {
                                                        console.error(e);
                                                        alert('Validation failed');
                                                    }
                                                }}
                                                aria-label="Apply Coupon"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Visual Coupon Selector */}
                                {filteredCoupons.length > 0 && isCouponOpen && (
                                    <div className="lg:col-span-2 space-y-3 animate-fade-in">
                                        <div className="flex items-center gap-2 px-1">
                                            <Tag size={12} className="text-emerald-600" />
                                            <span className="text-[10px] font-bold text-emerald-900/50 uppercase tracking-widest">Available Offers</span>
                                        </div>
                                        <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar snap-x touch-pan-x">
                                            {filteredCoupons.map((c) => (
                                                <button
                                                    key={c._id}
                                                    onClick={() => {
                                                        const isApplied = appliedOffers.some(o => o.name === c.code);
                                                        if (isApplied) {
                                                            setAppliedOffers(prev => prev.filter(o => o.name !== c.code));
                                                        } else {
                                                            setCouponCode(c.code);
                                                            const couponOffer = {
                                                                _id: 'coupon-' + c.code,
                                                                name: c.code,
                                                                discountPercentage: c.discountType === 'percentage' ? c.value : 0,
                                                                discountAmount: c.discountType === 'flat' ? c.value : 0,
                                                                type: 'coupon'
                                                            };
                                                            setAppliedOffers(prev => [...prev, couponOffer]);
                                                        }
                                                    }}
                                                    className={`snap-start min-w-[280px] sm:min-w-[320px] group relative flex items-center justify-between gap-4 p-5 rounded-[2.5rem] border-2 border-dashed transition-all hover:shadow-2xl text-left flex-shrink-0 ${appliedOffers.some(o => o.name === c.code) ? 'border-emerald-500 bg-emerald-50/80' : 'border-emerald-900/10 bg-white shadow-xl shadow-slate-200/40 dark:shadow-none dark:bg-slate-900/50'}`}
                                                >
                                                    <div className="flex items-center gap-4 min-w-0">
                                                        <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex-shrink-0 flex items-center justify-center overflow-hidden border border-amber-200/50">
                                                            {c.imageUrl ? (
                                                                <img src={c.imageUrl} alt={c.code} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-xl font-bold text-amber-600">%</span>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex flex-col">
                                                                <span className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                                                                    {c.value}{c.discountType === 'percentage' ? '%' : ''}
                                                                    <span className="text-sm font-bold text-slate-400 ml-1 uppercase">OFF</span>
                                                                </span>
                                                                <div className="flex items-center gap-2 mt-2">
                                                                    <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-2">
                                                                        <span className="text-xs font-black text-amber-700 dark:text-amber-500 uppercase tracking-wider">{c.code}</span>
                                                                        <div className="h-3 w-px bg-slate-300 dark:bg-white/10"></div>
                                                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 group-hover:text-emerald-500 transition-colors">
                                                                            {appliedOffers.some(o => o.name === c.code) ? 'Applied' : 'Apply'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {appliedOffers.some(o => o.name === c.code) && (
                                                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                                                            <Check size={18} strokeWidth={3} />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Date & Time Selection */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-emerald-900 dark:text-white uppercase tracking-widest mb-2 block pl-1">Date</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={date}
                                            min={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full h-16 pl-4 pr-4 bg-white dark:bg-white/5 border border-black dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-bold outline-none focus:border-amber-500 dark:focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 transition-all w-full appearance-none"
                                            aria-label="Pickup Date"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-emerald-900 dark:text-white uppercase tracking-widest mb-2 block pl-1">Time</label>
                                    <div className="relative">
                                        <input
                                            type="time"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className="w-full h-16 pl-4 pr-4 bg-white dark:bg-white/5 border border-black dark:border-white/10 rounded-2xl text-emerald-900 dark:text-white font-bold outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:ring-4 focus:ring-emerald-900/5 transition-all w-full appearance-none"
                                            aria-label="Pickup Time"
                                        />
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
                                    <div key={c.id} className="bg-[#FFC107] border border-black/10 p-3 rounded-2xl flex flex-col items-center justify-center transition-colors shadow-sm">
                                        <span className="text-[9px] font-black text-black uppercase tracking-widest mb-2 opacity-80">{c.label}</span>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setPassengerCount(p => ({ ...p, [c.id]: Math.max(0, p[c.id] - 1) }))}
                                                className="w-8 h-8 rounded-xl bg-white border border-black/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-black shadow-sm"
                                                aria-label={`Decrease ${c.label}`}
                                            >
                                                <Minus size={12} strokeWidth={3} />
                                            </button>
                                            <span className="font-black text-lg text-black min-w-[12px] text-center" aria-live="polite">{passengerCount[c.id]}</span>
                                            <button
                                                onClick={() => setPassengerCount(p => ({ ...p, [c.id]: p[c.id] + 1 }))}
                                                className="w-8 h-8 rounded-xl bg-black border border-black/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white shadow-sm"
                                                aria-label={`Increase ${c.label}`}
                                            >
                                                <Plus size={12} strokeWidth={3} />
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
                                    <div className="w-8 h-8 rounded-full bg-[#FFC107] text-black hover:bg-[#FFC107]/90 transition-colors flex items-center justify-center">
                                        <ChevronDown size={16} />
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Section 2: Summary & Checkout */}
                        <div className="bg-[#FFC107] border-2 border-amber-600/30 rounded-3xl p-6 shadow-xl flex flex-col justify-start lg:justify-between h-auto lg:h-full lg:min-h-0 gap-8 lg:gap-0">

                            <div className="space-y-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-emerald-900 tracking-tight">Trip Summary</h2>

                                    {/* Currency Dropdown */}
                                    <div className="relative group">
                                        <button
                                            className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg bg-black text-white shadow-md hover:bg-slate-800 transition-colors"
                                            aria-label="Select currency"
                                        >
                                            <span className="font-black">{currency}</span>
                                            <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                                        </button>
                                        <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-slate-900 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-emerald-900/10 dark:border-slate-800 z-50">
                                            {SUPPORTED_CURRENCIES.map(c => (
                                                <button
                                                    key={c.code}
                                                    onClick={() => {
                                                        changeCurrency(c.code);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-xs font-bold flex items-center gap-2 ${currency === c.code ? 'bg-black text-white' : 'text-slate-500 dark:text-slate-400'}`}
                                                >
                                                    <span className="text-sm">{c.flag}</span>
                                                    <span>{c.code}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Map Container - Fixed Height Mobile, Flex Desktop */}
                                <div className="h-64 lg:flex-1 w-full rounded-2xl overflow-hidden shadow-inner relative isolate min-h-[300px] lg:min-h-[300px] border border-black/10 flex-shrink-0 lg:flex-shrink">
                                    <TripMap pickup={pickup} dropoff={dropoff} waypoints={waypoints} onRouteCalculated={handleRouteCalculated} />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-black font-bold">Est. Distance</span>
                                        <span className="text-black font-black">{distance ? `${distance.toFixed(1)} KM` : '--'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-black font-bold">Vehicle Type</span>
                                        <span className="font-bold text-black bg-white/40 px-3 py-1 rounded-lg">
                                            {vehiclePricing[vehicle]?.name || 'Select Vehicle'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-black font-bold">Waiting Hours</span>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setWaitingHours(Math.max(0, waitingHours - 1))} className="text-black font-bold" aria-label="Decrease waiting hours"><Minus size={12} /></button>
                                            <span className="font-bold text-black">{waitingHours}</span>
                                            <button onClick={() => setWaitingHours(waitingHours + 1)} className="text-black font-bold" aria-label="Increase waiting hours"><Plus size={12} /></button>
                                        </div>
                                    </div>
                                    {hasNameBoard && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-black font-bold">Meet & Greet</span>
                                            <span className="text-black font-black">Included</span>
                                        </div>
                                    )}
                                </div>

                            </div>

                            <div className="pt-6 border-t border-emerald-900/10 dark:border-white/10 flex-shrink-0">
                                <div className="flex justify-between items-end mb-8">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest">Grand Total</span>
                                        <span className="text-4xl font-black text-emerald-900">
                                            {distance && finalTotal > 0 ? (
                                                <>
                                                    {convertPrice(finalTotal).symbol} {convertPrice(finalTotal).value.toLocaleString()}
                                                </>
                                            ) : (
                                                <span className="text-emerald-900/20">---</span>
                                            )}
                                        </span>
                                        {/* Secondary Currency Display */}
                                        {distance && finalTotal > 0 && (
                                            <div className="text-sm font-bold text-black mt-1">
                                                {(() => {
                                                    const secCode = currency === 'LKR' ? 'USD' : 'LKR';
                                                    const secRate = rates ? (rates[secCode] || 1) : 1;
                                                    const secValue = Math.ceil(finalTotal * secRate);
                                                    const secSymbol = SUPPORTED_CURRENCIES.find(c => c.code === secCode)?.symbol || secCode;
                                                    return `approx. ${secSymbol} ${secValue.toLocaleString()}`;
                                                })()}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={handleBook}
                                    disabled={!distance}
                                    className="w-full py-5 bg-black dark:bg-emerald-600 text-white rounded-[2rem] font-bold text-lg hover:bg-slate-900 dark:hover:bg-emerald-500 active:scale-[0.98] transition-all shadow-xl disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 group"
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

            {/* Booking Modal */}
            <BookingModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                initialData={bookingInitialData}
                pricingCategory={pricingCategory}
            />

            {/* Smart Offer Nudge - Show first non-dismissed offer */}
            <SmartOfferNudge
                offer={appliedOffers.find(o => !dismissedOfferIds.includes(o._id)) || null}
                onClose={() => {
                    const visibleOffer = appliedOffers.find(o => !dismissedOfferIds.includes(o._id));
                    if (visibleOffer) {
                        setDismissedOfferIds(prev => [...prev, visibleOffer._id]);
                    }
                }}
            />

            {/* Vehicle Selection Drawer */}
            <VehicleSelectionDrawer
                isOpen={isVehicleDrawerOpen}
                onClose={() => setIsVehicleDrawerOpen(false)}
                vehicles={Object.values(vehiclePricing)}
                selectedId={vehicle}
                onSelect={setVehicle}
                passengerCount={passengerCount}
                isLoading={isLoadingPricing}
            />

        </div>
    );
}

export default BookingWidget
