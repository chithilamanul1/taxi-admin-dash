'use client'

import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { MapPin, Navigation, ArrowRightLeft, Loader2, Info, Users, Briefcase, ShoppingBag, Wind, Calendar, Clock, ChevronRight, Plus, Minus, Tag, Zap, Check, Car, ChevronDown, ShieldCheck, Lock, Signpost, X, ArrowRight, PlaneTakeoff, PlaneLanding } from 'lucide-react'

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
const calculatePrice = (distance, vehicleId, tripType, pricingMap, waitingHours, hasNameBoard, nameBoardPrice = 2000, pickupName = '', dropoffName = '', destinations = []) => {
    if (!pricingMap[vehicleId]) return { total: 0 };
    const vehicleData = pricingMap[vehicleId];

    const basePrice = calculateBasePrice(distance, vehicleData, tripType, pickupName, dropoffName, destinations);
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
    const [pickup, setPickup] = useState({ name: 'Bandaranaike International Airport (CMB)', lat: 7.1804, lng: 79.8837 })
    const [dropoff, setDropoff] = useState({ name: '', lat: null, lng: null })
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
        luggage: 0,
        handLuggage: 0
    })

    const [distance, setDistance] = useState(null)
    const [vehicle, setVehicle] = useState('mini-car')
    const [waitingHours, setWaitingHours] = useState(0)
    const [couponCode, setCouponCode] = useState('')
    const [isManualVehicle, setIsManualVehicle] = useState(false)
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
    const [pricingSettings, setPricingSettings] = useState({ longDistanceThreshold: 175, longDistanceDiscountPercentage: 10, isActive: true });
    const [destinations, setDestinations] = useState([]);


    // Manage body class for hiding chat
    useEffect(() => {
        if (distance) {
            document.body.classList.add('booking-active');
        } else {
            document.body.classList.remove('booking-active');
        }
        return () => document.body.classList.remove('booking-active');
    }, [distance]);

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

                // Fetch Global Settings
                try {
                    const settingsRes = await fetch('/api/admin/pricing-settings', { cache: 'no-store' });
                    const settingsData = await settingsRes.json();
                    if (settingsData.success && settingsData.data) {
                        setPricingSettings(settingsData.data);
                    }
                } catch (err) {
                    console.error("Failed to fetch pricing settings", err);
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
                lng: null,
                name: destParam
            });
            setDropoffSearch(destParam);
            setActiveTab('pickup');
        }

    }, []);

    // Tab Logic - reset fields based on mode
    useEffect(() => {
        if (activeTab === 'pickup') {
            setPickup({ name: 'Bandaranaike International Airport (CMB)', lat: 7.1804, lng: 79.8837 })
            setPickupSearch('Bandaranaike International Airport (CMB)')
            setDropoff({ name: '', lat: null, lng: null })
            setDropoffSearch('')
            setTripType('one-way')
        } else if (activeTab === 'drop') {
            setPickup({ name: '', lat: null, lng: null })
            setPickupSearch('')
            setDropoff({ name: 'Bandaranaike International Airport (CMB)', lat: 7.1804, lng: 79.8837 })
            setDropoffSearch('Bandaranaike International Airport (CMB)')
            setTripType('one-way')
        } else if (activeTab === 'ride') {
            setPickup({ name: '', lat: null, lng: null })
            setPickupSearch('')
            setDropoff({ name: '', lat: null, lng: null })
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
                                lng: longitude
                            };
                            setPickup(loc);
                            setPickupSearch(loc.name);
                        } else {
                            // Fallback to coords
                            setPickup({ name: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, lat: latitude, lng: longitude });
                            setPickupSearch(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                        }
                        setIsLocating(false);
                    });
                } else {
                    // Very fallback
                    setPickup({ name: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, lat: latitude, lng: longitude });
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

    // Fetch Marketing Offers & Destinations
    useEffect(() => {
        fetch('/api/admin/marketing')
            .then(res => res.json())
            .then(data => {
                if (data.offers) setActiveOffers(data.offers);
            })
            .catch(err => console.error("Error fetching offers:", err));

        fetch('/api/admin/destinations')
            .then(res => res.json())
            .then(data => {
                if (data.success) setDestinations(data.data);
            })
            .catch(err => console.error("Error fetching destinations:", err));
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

        return availableCoupons.filter(coupon => {
            // If coupon has no location restrictions, consider it global
            if (!coupon.applicableLocations || coupon.applicableLocations.length === 0) {
                return true;
            }

            // Check if any applicable location matches the current route
            return coupon.applicableLocations.some(loc => {
                const l = loc.toLowerCase().trim();
                if (l.includes('->')) {
                    const [fromPart, toPart] = l.split('->').map(s => s.trim());
                    return pickupText.includes(fromPart) && dropoffText.includes(toPart);
                }
                return pickupText.includes(l) || dropoffText.includes(l);
            });
        });
    }, [availableCoupons, pickup, pickupSearch, dropoff, dropoffSearch]);

    // Auto-Select Vehicle based on Passengers (ONLY if not manually selected)
    useEffect(() => {
        if (isManualVehicle) return;

        const currentVehicleData = vehiclePricing[vehicle];
        if (!currentVehicleData) return;

        const totalPax = (passengerCount.adults || 0) + (passengerCount.children || 0);
        const totalLuggage = passengerCount.luggage || 0;

        // Find best fit (Cheapest that fits capacity)
        const sortedVehicles = Object.values(vehiclePricing).sort((a, b) => (a.basePrice || 0) - (b.basePrice || 0));
        const bestFit = sortedVehicles.find(v =>
            totalPax <= (v.capacity || 4) && totalLuggage <= (v.luggage || 0)
        );

        if (bestFit && bestFit.vehicleType !== vehicle) {
            setVehicle(bestFit.vehicleType);
        }
    }, [passengerCount, vehiclePricing, vehicle, isManualVehicle]);

    // Auto-open vehicle drawer when passengers/luggage exceed current vehicle capacity
    useEffect(() => {
        const currentVehicleData = vehiclePricing[vehicle];
        if (!currentVehicleData) return;

        const totalPax = passengerCount.adults + passengerCount.children;
        const totalLuggage = passengerCount.luggage;

        const exceedsCapacity =
            totalPax > (currentVehicleData.capacity || 4) ||
            totalLuggage > (currentVehicleData.luggage || 0);

        if (exceedsCapacity && !isVehicleDrawerOpen) {
            const timer = setTimeout(() => {
                setIsVehicleDrawerOpen(true);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [passengerCount, vehiclePricing, vehicle, isVehicleDrawerOpen]);

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

            // ONLY ALLOW AUTOMATED OFFERS FOR AIRPORT PICKUPS
            const isAirportPickup = start.includes('airport');

            if (isAirportPickup) {
                // PRIORITY 1: Precise Database Coupons
                availableCoupons.forEach(coupon => {
                    if (coupon.applicableLocations && coupon.applicableLocations.length > 0) {
                        let matchedLoc = '';
                        const isMatch = coupon.applicableLocations.some(loc => {
                            const l = loc.toLowerCase().trim();
                            if (l.length < 3) return false;

                            if (l.includes('->')) {
                                const [fromPart, toPart] = l.split('->').map(s => s.trim());
                                const match = start.includes(fromPart) && dest.includes(toPart);
                                if (match) matchedLoc = loc;
                                return match;
                            }

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

                // PRIORITY 3: Automated Rules (e.g. 175km Discount)
                if (pricingSettings.isActive && distance > pricingSettings.longDistanceThreshold) {
                    dynamicOffers.push({
                        _id: 'auto-long-distance',
                        name: 'Long Distance Discount',
                        discountPercentage: pricingSettings.longDistanceDiscountPercentage,
                        discountAmount: 0,
                        description: `Special ${pricingSettings.longDistanceDiscountPercentage}% discount automatically applied for long distance airport transfers!`,
                        isActive: true,
                        type: 'location'
                    });
                }
            }

            // Combine, Sort by Value, and Limit to Best Offer
            const finalDynamic = [];

            // 1. Sort all found offers by discount value (higher first)
            const sortedDynamic = [...dynamicOffers].sort((a, b) => {
                const valA = a.discountPercentage || (a.discountAmount / 100) || 0; // Normalize flat values roughly
                const valB = b.discountPercentage || (b.discountAmount / 100) || 0;
                return valB - valA;
            });

            // 2. Clear dynamic offers if manual coupon is present
            if (existingManual.length > 0) {
                return [...existingManual];
            }

            // 3. Only take the TOP 1 best offer that isn't already applied manually
            if (sortedDynamic.length > 0) {
                finalDynamic.push(sortedDynamic[0]);
            }

            return [...finalDynamic];
        });
    }, [dropoff, dropoffSearch, pickup, pickupSearch, availableCoupons, activeOffers, distance, pricingSettings]);


    // Calculate total waiting hours including waypoints
    const totalWaitingHours = waitingHours + waypoints.reduce((sum, wp) => sum + (wp.waitingTime || 0), 0);
    // Updated calculatePrice call with nameBoardPrice and locations
    const { total } = calculatePrice(
        distance,
        vehicle,
        tripType,
        vehiclePricing,
        totalWaitingHours,
        false, // hasNameBoard removed from landing page
        nameBoardPrice,
        pickup?.name || pickupSearch,
        dropoff?.name || dropoffSearch,
        destinations
    );

    // Calculate total discount from all applied offers (MAX RULE: No Stacking)
    const discountAmount = appliedOffers.reduce((max, offer) => {
        const val = (offer.discountAmount || (total * (offer.discountPercentage / 100)));
        return Math.max(max, val);
    }, 0);

    const finalTotal = Math.max(0, total - discountAmount);

    const handleBook = () => {
        if (!distance || distance <= 0) {
            alert("Please select valid pickup and dropoff locations to calculate the distance.");
            return;
        }

        if (!total || total <= 0) {
            alert("Pricing calculation failed. Please try re-selecting your locations or vehicle.");
            return;
        }

        const verifiedCoupons = appliedOffers.map(offer => ({
            code: offer.name,
            discountType: offer.discountPercentage > 0 ? 'percentage' : 'flat',
            value: offer.discountPercentage > 0 ? offer.discountPercentage : offer.discountAmount
        }));

        setBookingInitialData({
            pickup: pickup.name,
            pickupCoords: { lat: pickup.lat, lng: pickup.lng },
            dropoff: dropoff.name,
            dropoffCoords: { lat: dropoff.lat, lng: dropoff.lng },
            waypoints,
            passengerCount,
            tripType,
            waitingHours: totalWaitingHours,
            hasNameBoard: null, // Force selection in modal
            distance,
            vehicle,
            couponCode: verifiedCoupons.length > 0 ? verifiedCoupons[0].code : '',
            verifiedCoupons,
            nameBoardPrice,
            isAirportPickup: (pickup?.name || '').toLowerCase().includes('airport') || (dropoff?.name || '').toLowerCase().includes('airport')
        });
        setShowModal(true);
    };


    const swapLocations = () => {
        const t = { ...pickup }; const ts = pickupSearch;
        setPickup(dropoff); setPickupSearch(dropoffSearch);
        setDropoff(t); setDropoffSearch(ts);
        setDistance(null); // Force re-calculation trigger
    }

    // Determine Pricing Category
    const isAirportService = ['pickup', 'drop'].includes(activeTab);
    const pricingCategory = isAirportService ? 'airport-transfer' : 'ride-now';

    return (
        <div className="w-full max-w-6xl mx-auto pt-28 md:pt-36 relative z-40 px-3 sm:px-4">
            {/* Tab Navigation - Boxy Style */}
            <div className="flex bg-white dark:bg-[#111] rounded-none w-full sm:w-fit mx-auto lg:mx-0 mb-8 border-[10px] border-black transition-all overflow-hidden divide-x-[6px] divide-black" role="tablist">

                <div className="grid grid-cols-4 w-full sm:w-auto">
                    {[
                        { id: 'pickup', label: 'Airport Pickup', icon: PlaneTakeoff },
                        { id: 'drop', label: 'Airport Drop', icon: PlaneLanding },
                        { id: 'ride', label: 'Ride', icon: Zap },
                        { id: 'tours', label: 'Tours', icon: Signpost }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            aria-controls={`panel-${tab.id}`}
                            id={`tab-${tab.id}`}
                            aria-label={`Switch to ${tab.label} tab`}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col sm:flex-row items-center justify-center gap-1 md:gap-3 px-2 sm:px-6 py-3.5 md:py-4 rounded-none text-[8px] sm:text-xs md:text-sm font-black transition-all ${activeTab === tab.id
                                ? 'bg-[#FACC15] text-black'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={16} className={activeTab === tab.id ? 'text-black' : 'text-slate-400'} aria-hidden="true" />
                            <span className="uppercase tracking-widest">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Widget Main Content - Booking.com Sharp Style */}
            <div className="bg-white dark:bg-[#111] border-[16px] border-[#FACC15] p-4 md:p-12 animate-slide-up relative z-10 rounded-none w-full box-border">

                {activeTab === 'tours' ? <ToursWidget /> : (
                    <div className="grid lg:grid-cols-[1.5fr,380px] xl:grid-cols-[1fr,420px] gap-8 lg:gap-12 min-w-0">
                        <div className="flex-1 text-center lg:text-left">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                                <div className="flex bg-white dark:bg-[#111] rounded-none border-[6px] border-black w-full sm:w-auto overflow-hidden p-1 divide-x-2 divide-black">
                                    <button 
                                        onClick={() => setTripType('one-way')} 
                                        aria-label="One Way Trip" 
                                        className={`flex-1 sm:flex-none px-3 sm:px-8 py-2.5 rounded-none text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-widest transition-all ${tripType === 'one-way' ? 'bg-[#FACC15] text-black border-2 border-black' : 'text-slate-400 hover:text-black dark:hover:text-[#FACC15]'}`}
                                    >
                                        One Way
                                    </button>
                                    <button
                                        onClick={() => (activeTab !== 'pickup' && activeTab !== 'drop') && setTripType('round-trip')}
                                        disabled={activeTab === 'pickup' || activeTab === 'drop'}
                                        aria-label="Round Trip"
                                        className={`flex-1 sm:flex-none px-3 sm:px-8 py-2.5 rounded-none text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-widest transition-all relative flex items-center justify-center gap-1 sm:gap-2
                                            ${tripType === 'round-trip' && activeTab !== 'pickup' && activeTab !== 'drop' ? 'bg-black dark:bg-[#FACC15] text-white dark:text-black border-2 border-black' : 'text-slate-500 dark:text-slate-400 hover:bg-black/5'}
                                            ${(activeTab === 'pickup' || activeTab === 'drop') ? 'opacity-40 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        Round Trip
                                        {(activeTab === 'pickup' || activeTab === 'drop') && (
                                            <span className="w-4 h-4 bg-emerald-500 dark:bg-[#FACC15] flex items-center justify-center text-[8px] text-white dark:text-black rounded-none border border-black">🔒</span>
                                        )}
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    {/* Currency Selector */}
                                    <div className="relative group z-[110]">
                                        <button 
                                            className="flex items-center gap-2 bg-white dark:bg-[#1a1a1a] border-2 border-black rounded-none px-4 py-2.5 text-xs font-black text-black dark:text-white hover:-translate-y-0.5 transition-all"
                                            aria-label="Select Currency"
                                        >
                                            <div className="w-5 h-5 overflow-hidden rounded-none border-[1.5px] border-black">
                                                <img 
                                                    src={SUPPORTED_CURRENCIES.find(c => c.code === currency)?.flag} 
                                                    alt={`${currency} flag`} 
                                                    className="w-full h-full object-cover scale-150" 
                                                />
                                            </div>
                                            <span className="uppercase text-black dark:text-white">{currency}</span>
                                            <ChevronDown size={14} className="opacity-100 text-black dark:text-white" aria-hidden="true" />
                                        </button>
                                        <div className="absolute top-full left-0 mt-3 w-40 bg-white dark:bg-[#111] rounded-none border-[3px] border-black overflow-hidden hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="py-0">
                                                {SUPPORTED_CURRENCIES.map(c => (
                                                    <button
                                                        key={c.code}
                                                        onClick={() => changeCurrency(c.code)}
                                                        className={`w-full text-left px-5 py-3 text-xs font-black flex items-center gap-3 hover:bg-[#FACC15] hover:text-black transition-colors ${currency === c.code ? 'text-black bg-[#FACC15] border-l-[4px] border-black' : 'text-black dark:text-white border-b-[3px] border-black last:border-0'}`}
                                                    >
                                                        <div className="w-5 h-5 rounded-none overflow-hidden border-2 border-black">
                                                            <img src={c.flag} alt={c.code} className="w-full h-full object-cover scale-150" />
                                                        </div>
                                                        <span>{c.code}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={handleGetCurrentLocation} aria-label="Auto Detect Location" className="flex-1 text-black text-[10px] md:text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 bg-[#FACC15] px-4 md:px-6 py-2.5 md:py-3 rounded-none border-2 border-black hover:-translate-y-0.5 justify-center whitespace-nowrap">

                                        {isLocating ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} className="fill-current" />}
                                        <span className="hidden sm:inline">Auto Detect</span>
                                        <span className="sm:hidden uppercase">Detect</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4 md:space-y-3">
                                {/* Pickup Input */}
                                <LocationInput
                                    placeholder="Pick-up Location"
                                    value={pickupSearch}
                                    icon={activeTab === 'pickup' ? PlaneTakeoff : MapPin}
                                    disabled={activeTab === 'pickup'}
                                    onChange={(val) => setPickupSearch(val)}
                                    zIndex={100}
                                    onSelect={(loc) => {
                                        setPickup({ name: loc.address, lat: loc.lat, lng: loc.lng });
                                        setPickupSearch(loc.address);
                                    }}
                                />


                                {/* Waypoints List */}
                                {waypoints.map((wp, idx) => (
                                    <div key={idx} className="relative group animate-slide-up bg-white dark:bg-white/5 rounded-none border-2 border-black p-1 flex items-center overflow-hidden">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FACC15] pointer-events-none z-10 bg-black p-1 border border-[#FACC15] rounded-none">
                                            <Navigation size={16} />
                                        </div>
                                        <input
                                            type="text"
                                            readOnly
                                            value={wp.name}
                                            className="flex-1 min-w-0 pl-14 pr-2 sm:pr-4 h-12 bg-transparent border-none text-[10px] sm:text-sm font-black text-black dark:text-white outline-none truncate"
                                        />

                                        <div className="flex flex-col items-center border-l-2 border-black/20 px-1 sm:px-3 min-w-[60px] sm:min-w-[100px] justify-center">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setWaypoints(prev => prev.map((w, i) => i === idx ? { ...w, waitingTime: Math.max(0, (w.waitingTime || 0) - 1) } : w)); }}
                                                    className="w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center rounded-none bg-white dark:bg-white/10 text-black dark:text-white text-[10px] sm:text-xs font-black hover:bg-slate-100 transition-colors border border-black"
                                                >−</button>
                                                <span className="text-[10px] sm:text-sm font-black text-black dark:text-white w-4 sm:w-6 text-center">{wp.waitingTime || 0}h</span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setWaypoints(prev => prev.map((w, i) => i === idx ? { ...w, waitingTime: (w.waitingTime || 0) + 1 } : w)); }}
                                                    className="w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center rounded-none bg-black dark:bg-yellow-400 text-white dark:text-black text-[10px] sm:text-xs font-black hover:bg-slate-800 transition-colors border border-black"
                                                >+</button>
                                            </div>
                                            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-wider mt-1">Wait Time</span>
                                        </div>

                                        <button
                                            onClick={() => setWaypoints(prev => prev.filter((_, i) => i !== idx))}
                                            className="ml-0 sm:ml-2 mr-1 sm:mr-3 p-1 sm:p-2 text-black hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-none transition-all"
                                            aria-label="Remove stop"
                                        >
                                            <X size={14} className="sm:hidden" />
                                            <X size={18} className="hidden sm:block" />
                                        </button>
                                    </div>
                                ))}


                                {/* Add Waypoint Search - supports up to 4 stops */}
                                {waypoints.length < 4 && (
                                    <>
                                        {/* "Add Stop" Button - Aligned with icons */}
                                        {waypointSearches.length === 0 && (
                                            <div className="flex justify-start pl-12 py-1">
                                                <button
                                                    onClick={() => setWaypointSearches([{ active: true }])}
                                                    aria-label="Add Stop"
                                                    className="text-black bg-white dark:bg-[#111] dark:text-[#FACC15] text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 py-2 px-3 rounded-none border-2 border-black hover:-translate-y-0.5 transition-all"

                                                >
                                                    <Plus size={14} strokeWidth={3} /> ADD STOP ({waypoints.length}/4)
                                                </button>
                                            </div>
                                        )}

                                        {/* Active Search Input */}
                                        {waypointSearches.length > 0 && (
                                            <div className="relative group animate-fade-in">
                                                <LocationInput
                                                    placeholder="Add Stop (Search City)"
                                                    icon={Navigation}
                                                    zIndex={40}
                                                    onSelect={(loc) => {
                                                        setWaypoints([...waypoints, { name: loc.address, lat: loc.lat, lng: loc.lng, waitingTime: 0 }]);
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



                                {/* Dropoff Input */}
                                <div className="relative">
                                    {/* Uber-style vertical connecting line */}
                                    <div className="absolute left-[22px] top-[-36px] bottom-[28px] w-[2px] bg-black dark:bg-white/30 z-0">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-none border-2 border-black bg-white dark:bg-black z-10"></div>
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-none border-2 border-black bg-[#FACC15] z-10"></div>
                                    </div>
                                    <LocationInput
                                        placeholder="Drop-off Location"
                                        value={dropoffSearch}
                                        icon={activeTab === 'drop' ? PlaneLanding : MapPin}
                                        zIndex={100}
                                        disabled={activeTab === 'drop'}
                                        onChange={(val) => setDropoffSearch(val)}
                                        onSelect={(loc) => {
                                            setDropoff({ name: loc.address, lat: loc.lat, lng: loc.lng });
                                            setDropoffSearch(loc.address);
                                        }}
                                    />
                                </div>
                            </div>

                                {/* Extra Options Grid - Refined Spacing & Alignment */}
                                <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 mt-12 lg:mt-8 mb-6 lg:mb-4">

                                <div className="flex-1 space-y-4">
                                    <button
                                        onClick={() => setIsCouponOpen(!isCouponOpen)}
                                        className={`flex items-center gap-3 text-[10px] lg:text-[9px] font-black h-full min-h-[4rem] sm:min-h-[5rem] lg:min-h-[3.5rem] transition-all px-4 sm:px-8 lg:px-6 py-3 sm:py-4 lg:py-2 rounded-none w-full justify-center uppercase tracking-[0.2em] lg:tracking-[0.15em] border-[3px] border-black ${isCouponOpen ? 'bg-[#FACC15] text-black' : 'bg-white text-black hover:bg-slate-50'}`}
                                    >
                                        <Tag size={18} className={`${isCouponOpen ? 'text-black' : 'text-[#FACC15]'} w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4`} fill="currentColor" />
                                        {isCouponOpen ? 'Close Offers' : 'Coupon Code?'}
                                    </button>

                                    {/* Applied Coupons List */}
                                    {appliedOffers.length > 0 && (
                                        <div className="flex flex-wrap gap-2 animate-fade-in">
                                            {appliedOffers.map((offer, i) => (
                                                <div key={i} className="flex items-center gap-1.5 bg-[#FACC15] text-black px-3 py-1.5 rounded-none border-2 border-black">
                                                    <Tag size={12} className="fill-black/10" />
                                                    <span className="text-[10px] font-black uppercase">{offer.name}</span>
                                                    <span className="text-[10px] font-black opacity-60">
                                                        (-{offer.discountPercentage > 0 ? `${offer.discountPercentage}%` : `Rs ${offer.discountAmount}`})
                                                    </span>
                                                    <button
                                                        onClick={() => setAppliedOffers(prev => prev.filter(o => o.name !== offer.name))}
                                                        className="ml-1 p-0.5 hover:bg-black hover:text-white rounded-none transition-colors border border-transparent hover:border-black"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {isCouponOpen && (
                                        <div className="relative h-16 animate-slide-up">
                                            <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-black dark:text-white" size={20} />
                                            <input
                                                type="text"
                                                placeholder="ENTER COUPON CODE"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                className="w-full h-full pl-14 pr-24 rounded-none bg-white dark:bg-white/5 border-2 border-black text-base font-black outline-none transition-all uppercase text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 tracking-widest focus:border-black focus:ring-0"
                                                aria-label="Coupon code"
                                            />
                                            <button
                                                onClick={async () => {
                                                    /* apply logic */
                                                }}
                                                aria-label="Apply Coupon"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-[#FACC15] px-4 py-2 rounded-none border-2 border-black text-xs font-black uppercase hover:bg-[#FACC15] hover:text-black transition-all"
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
                                                    className={`snap-start min-w-[280px] sm:min-w-[320px] group relative flex items-center justify-between gap-4 p-5 rounded-none border-2 transition-all text-left flex-shrink-0 ${appliedOffers.some(o => o.name === c.code) ? 'border-black bg-[#FACC15]' : 'border-black bg-white hover:bg-slate-50'}`}
                                                >
                                                    <div className="flex items-center gap-4 min-w-0">
                                                        <div className="w-14 h-14 rounded-none bg-white dark:bg-black flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-black">
                                                            {c.imageUrl ? (
                                                                <img src={c.imageUrl} alt={c.code} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-xl font-bold text-emerald-600">%</span>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex flex-col">
                                                                <span className="text-2xl font-black text-emerald-900 dark:text-white leading-tight">
                                                                    {c.value}{c.discountType === 'percentage' ? '%' : ''}
                                                                    <span className="font-bold text-emerald-950 uppercase">OFF</span>
                                                                </span>
                                                                <div className="flex items-center gap-2 mt-2">
                                                                    <div className="px-3 py-1.5 rounded-none bg-white dark:bg-white/5 border-2 border-black flex items-center gap-2">
                                                                        <span className="text-xs font-black text-emerald-700 dark:text-emerald-500 uppercase tracking-wider">{c.code}</span>
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
                                                        <div className="flex-shrink-0 w-8 h-8 bg-black border-2 border-white rounded-none flex items-center justify-center text-[#FACC15]">
                                                            <Check size={18} strokeWidth={3} />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Counters Section with Label */}
                            <div className="mt-8 lg:mt-10 space-y-4">
                                <label className="text-[11px] font-black text-black dark:text-[#FACC15] uppercase tracking-[0.3em] pl-1 leading-none block mb-4">Passenger & Luggage</label>
                                <div className="grid grid-cols-2 gap-3 md:gap-4">
                                    {[
                                    { id: 'adults', label: 'Adults' },
                                    { id: 'children', label: 'Children' },
                                    { id: 'luggage', label: 'Luggage' },
                                    { id: 'handLuggage', label: 'Hand Luggage' }
                                ].map(c => (
                                    <div key={c.id} className="bg-white dark:bg-white/5 border-2 border-black p-3 rounded-none flex items-center justify-between transition-all group/counter min-h-[72px]">
                                        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex-1 pr-2">{c.label}</span>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <button
                                                onClick={() => setPassengerCount(p => ({ ...p, [c.id]: Math.max(0, (Number(p[c.id]) || 0) - 1) }))}
                                                className="w-8 h-8 rounded-none bg-white dark:bg-white/10 border-2 border-black flex items-center justify-center hover:bg-slate-100 transition-all text-black dark:text-white active:scale-95"
                                                aria-label={`Decrease ${c.label}`}
                                            >
                                                <Minus size={12} strokeWidth={3} />
                                            </button>
                                            <span className="font-black text-lg text-black dark:text-white min-w-[20px] text-center" aria-live="polite">{passengerCount[c.id] || 0}</span>
                                            <button
                                                onClick={() => setPassengerCount(p => ({ ...p, [c.id]: (Number(p[c.id]) || 0) + 1 }))}
                                                className="w-8 h-8 rounded-none bg-black dark:bg-[#FACC15] border-2 border-black flex items-center justify-center transition-all text-white dark:text-black active:scale-95"
                                                aria-label={`Increase ${c.label}`}
                                            >
                                                <Plus size={12} strokeWidth={3} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                            {/* Vehicle Selection - Unified for Desktop & Mobile */}
                            <div className="">
                                <button
                                    onClick={() => setIsVehicleDrawerOpen(true)}
                                    className="w-full h-16 px-6 flex items-center justify-between bg-white dark:bg-white/5 border-2 border-black rounded-none hover:-translate-y-0.5 transition-all group overflow-hidden relative mt-4"
                                    aria-label="Select Vehicle"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-10 bg-white dark:bg-white/10 rounded-none flex items-center justify-center p-1 border-2 border-black">
                                            {vehiclePricing[vehicle]?.image ? (
                                                <div className="relative w-full h-full">
                                                    <Image
                                                        src={vehiclePricing[vehicle].image}
                                                        alt={vehiclePricing[vehicle]?.name || "Vehicle"}
                                                        fill
                                                        className="object-contain scale-110"
                                                        sizes="48px"
                                                    />
                                                </div>
                                            ) : (
                                                <Car className="text-black dark:text-white" size={16} />
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-black text-sm text-black dark:text-white uppercase tracking-tight leading-none">{vehiclePricing[vehicle]?.name || 'Select Vehicle'}</p>
                                            <div className="flex items-center gap-2 text-[8px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest mt-1">
                                                <span>{vehiclePricing[vehicle]?.capacity || 4} Pax</span>
                                                <span className="w-1 h-1 bg-black dark:bg-white/20 rounded-full"></span>
                                                <span>{vehiclePricing[vehicle]?.luggage || 2} Luggage</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-none bg-[#FACC15] dark:bg-[#FACC15]/20 text-black dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform border-2 border-black shrink-0">
                                        <ChevronDown size={16} />
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Section 2: Summary & Checkout */}
                        <div className="bg-slate-50 dark:bg-[#0a0a0a] border-4 border-black rounded-none p-6 lg:p-8 flex flex-col justify-start lg:justify-between h-auto lg:h-full lg:min-h-0 gap-8 lg:gap-0 transition-colors">
                            <div className="space-y-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-black text-black dark:text-white uppercase tracking-tight">Trip Summary</h2>

                                    {/* Quick Currency Selector */}
                                    <div className="relative group">
                                        <button
                                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-none bg-[#FACC15] text-black border-2 border-black transition-transform hover:translate-y-[-2px] active:translate-y-0"
                                            aria-label="Select currency"
                                        >
                                            <span>{currency}</span>
                                            <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                                        </button>
                                        <div className="absolute top-full right-0 mt-3 w-32 bg-white dark:bg-[#111] rounded-none py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border-4 border-black z-[120] overflow-hidden">
                                            {SUPPORTED_CURRENCIES.map(c => (
                                                <button
                                                    key={c.code}
                                                    onClick={() => changeCurrency(c.code)}
                                                    className={`w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-xs font-black flex items-center gap-3 ${currency === c.code ? 'bg-slate-50 dark:bg-white/5 text-black dark:text-yellow-400' : 'text-slate-500 dark:text-slate-400'}`}
                                                >
                                                    <div className="w-4 h-4 rounded-full overflow-hidden border border-black/10 dark:border-white/20">
                                                        <img src={c.flag} alt={c.code} className="w-full h-full object-cover scale-150" />
                                                    </div>
                                                    <span>{c.code}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Map Container - Refined styling for dual theme */}
                                <div className="h-64 lg:flex-1 w-full rounded-none overflow-hidden relative isolate min-h-[300px] lg:min-h-[300px] border border-black/5 dark:border-white/10 flex-shrink-0 lg:flex-shrink group transition-all duration-500 hover:border-black dark:hover:border-yellow-400">
                                    <TripMap pickup={pickup} dropoff={dropoff} waypoints={waypoints} onRouteCalculated={handleRouteCalculated} />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                                        <span className="text-slate-500 dark:text-slate-400">Est. Distance</span>
                                        <span className="text-black dark:text-white">{distance ? `${distance.toFixed(1)} KM` : '--'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                                        <span className="text-slate-500 dark:text-slate-400">Vehicle Type</span>
                                        <div className="flex items-center gap-3 text-black dark:text-yellow-400">
                                            {vehiclePricing[vehicle]?.image && (
                                                <div className="w-8 h-6 bg-white dark:bg-white/10 border border-black p-0.5 overflow-hidden shrink-0">
                                                    <img src={vehiclePricing[vehicle].image} alt="" className="w-full h-full object-contain" />
                                                </div>
                                            )}
                                            <span>{vehiclePricing[vehicle]?.name || 'Select Vehicle'}</span>
                                        </div>
                                    </div>

                                    {/* Detailed Price Breakdown */}
                                    <div className="pt-6 border-t border-slate-200 dark:border-white/10 space-y-4">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.15em]">
                                            <span className="text-slate-500 dark:text-slate-400">Trip Subtotal</span>
                                            <span className="text-black dark:text-white font-black">{convertPrice(total).symbol} {convertPrice(total).value.toLocaleString()}</span>
                                        </div>

                                        {discountAmount > 0 && (
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.15em] text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-400/10 p-3 rounded-none border border-yellow-200 dark:border-yellow-400/20">
                                                <div className="flex items-center gap-2">
                                                    <Tag size={12} className="shrink-0" />
                                                    <span className="truncate max-w-[150px]">
                                                        {appliedOffers.length > 0 ? appliedOffers.map(o => o.name).join(', ') : 'Offer Applied'}
                                                    </span>
                                                </div>
                                                <span className="font-black">-{convertPrice(discountAmount).symbol} {convertPrice(discountAmount).value.toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex-shrink-0">
                                <div className="flex justify-between items-end mb-8">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em]">Total Payable</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl lg:text-5xl font-black text-black dark:text-white tracking-tighter">
                                                {distance && finalTotal > 0 ? (
                                                    <>
                                                        <span className="text-lg align-top mr-1">{convertPrice(finalTotal).symbol}</span>
                                                        {convertPrice(finalTotal).value.toLocaleString()}
                                                    </>
                                                ) : (
                                                    <span className="text-slate-200 dark:text-white/10">Rates</span>
                                                )}
                                            </span>
                                        </div>
                                        {/* Multi-Currency Price Summary Block */}
                                        {distance && finalTotal > 0 && (
                                            <div className="mt-4 border-2 border-dashed border-black/20 dark:border-white/10 rounded-none overflow-hidden">
                                                <div className="grid grid-cols-2 bg-slate-100/50 dark:bg-white/5 p-3 gap-2">
                                                    <div className="flex flex-col items-center justify-center p-2 rounded-none bg-white dark:bg-zinc-900 border border-black/5">
                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">USD Estimate</span>
                                                        <span className="text-sm font-black text-black dark:text-white">
                                                            $ {(() => {
                                                                const rate = rates['USD'] || 0.0032;
                                                                return (finalTotal * rate).toFixed(2);
                                                            })()}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col items-center justify-center p-2 rounded-none bg-white dark:bg-zinc-900 border border-black/5 shadow-sm">
                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">EUR Estimate</span>
                                                        <span className="text-sm font-black text-black dark:text-white">
                                                            € {(() => {
                                                                const rate = rates['EUR'] || 0.003;
                                                                return (finalTotal * rate).toFixed(2);
                                                            })()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="mt-6 p-4 bg-yellow-400/20 border-2 border-black rounded-none flex items-start gap-3 animate-pulse">
                                    <div className="w-5 h-5 bg-black rounded-none flex items-center justify-center text-[#FACC15] shrink-0 mt-0.5">
                                        <Info size={14} strokeWidth={3} />
                                    </div>
                                    <p className="text-[11px] font-black text-black dark:text-yellow-400 uppercase tracking-tight leading-tight">
                                        Note: Highway tickets are not included and must be paid by the customer.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-6 pt-4">
                                    <button
                                        onClick={handleBook}
                                        disabled={!distance}
                                        className="w-full bg-[#FACC15] text-black h-20 md:h-24 rounded-none border-4 border-black font-black uppercase tracking-[0.2em] text-lg md:text-xl hover:translate-y-[-4px] active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center"
                                    >
                                        {isLoadingPricing ? (
                                            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <div className="flex items-center justify-between w-full px-4 sm:px-6">
                                                <div className="flex-1 text-center ml-8 sm:ml-12 text-[18px] sm:text-2xl">
                                                    BOOK TRIP NOW
                                                </div>
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-black border-2 border-black rounded-none flex items-center justify-center text-[#FACC15] group-hover:scale-110 transition-transform">
                                                    <ArrowRight size={20} className="sm:w-6 sm:h-6" strokeWidth={4} />
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                </div>
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
                pickupLocation={pickup?.name || pickupSearch}
                dropoffLocation={dropoff?.name || dropoffSearch}
                vehicles={Object.values(vehiclePricing).map(v => {
                    const priceInfo = calculatePrice(
                        distance,
                        v.vehicleType,
                        tripType,
                        vehiclePricing,
                        waitingHours,
                        false, // hasNameBoard removed from landing page
                        nameBoardPrice,
                        pickup.name,
                        dropoff.name,
                        destinations
                    );
                    return {
                        ...v,
                        calculatedTotal: priceInfo.total
                    };
                })}
                selectedId={vehicle}
                onSelect={(vType) => {
                    setVehicle(vType);
                    setIsManualVehicle(true);
                }}
                passengerCount={passengerCount}
                isLoading={isLoadingPricing}
            />
        </div>
    );
}

export default BookingWidget
