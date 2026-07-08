'use client'

import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import { MapPin, Navigation, ArrowRightLeft, Loader2, Info, Users, Briefcase, ShoppingBag, Wind, Calendar, Clock, ChevronRight, Plus, Minus, Tag, Zap, Check, Car, ChevronDown, ShieldCheck, Lock, Signpost, X, ArrowRight, PlaneTakeoff, PlaneLanding, CircleDot, Route } from 'lucide-react'

import Image from 'next/image'
import ToursWidget from './ToursWidget'
import RentalsWidget from './RentalsWidget'
import CustomTourBooking from './CustomTourBooking'
import RoundTripBooking from './RoundTripBooking'
const BookingModal = dynamic(() => import('./BookingModal'), { ssr: false })
const VehicleSelectionDrawer = dynamic(() => import('./VehicleSelectionDrawer'), { ssr: false })
import VehicleCarousel from './VehicleCarousel'
import LocationInput from './LocationInput'
import SmartOfferNudge from './SmartOfferNudge'
const TripMap = dynamic(() => import('./TripMap'), { ssr: false })
import CustomDateTimePicker from './CustomDateTimePicker'

import { useCurrency } from '../context/CurrencyContext'
import { calculateBasePrice, calculateSurcharges, calculateTrafficSurge, ROUND_TRIP_PACKAGES } from '@/lib/pricing-util';
import { detectLocalTimezone } from '@/lib/timezone-util';

// (Helper to calculate price)
const calculatePrice = (distance, vehicleId, tripType, pricingMap, waitingHours, hasNameBoard, nameBoardPrice = 2000, waitingHourRate = 1000, pickupName = '', dropoffName = '', destinations = [], scheduledTime = null, scheduledDate = null, surgeRules = [], roundTripPackageId = null, roundTripPackages = [], airportRoundTripPackages = [], destinationRoundTripPackages = []) => {
    if (!pricingMap[vehicleId]) return { total: 0, surgeAmount: 0 };
    const vehicleData = pricingMap[vehicleId];

    const basePrice = calculateBasePrice(distance, vehicleData, tripType, pickupName, dropoffName, destinations, { 
        roundTripPackageId, 
        roundTripPackages,
        airportRoundTripPackages,
        destinationRoundTripPackages
    });
    const surcharges = calculateSurcharges({ waitingHours, hasNameBoard, nameBoardPrice, waitingHourRate }, vehicleData);

    const surgePercent = calculateTrafficSurge(scheduledTime, scheduledDate, surgeRules, distance);
    const surgeAmount = surgePercent > 0 ? basePrice * (surgePercent / 100) : 0;

    return { total: basePrice + surcharges + surgeAmount, surgeAmount };
};

// Internal Loader Component to avoid hook conflicts
const formatDisplayDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return 'Select Date & Time';
    const [year, month, day] = dateStr.split('-');
    const parts = timeStr.trim().split(/\s+/);
    const timePart = parts[0];
    const period = parts[1] || '';
    return `${month}/${day}/${year}, ${timePart} ${period}`;
};

const FALLBACK_PRICING = {
    'mini-car': { vehicleType: 'mini-car', name: 'MINI CAR', image: '/vehicles/minicar.png', capacity: 2, luggage: 4, handLuggage: 2, basePrice: 3500, baseKm: 20, perKmRate: 100, tiers: [{ min: 0, max: 20, type: 'flat', price: 3500 }, { min: 21, max: 40, type: 'flat', price: 4000 }, { min: 41, max: 130, type: 'per_km', rate: 100 }, { min: 131, max: 9999, type: 'per_km', rate: 102 }] },
    'sedan': { vehicleType: 'sedan', name: 'SEDAN', image: '/vehicles/sedancar.png', capacity: 3, luggage: 3, handLuggage: 3, basePrice: 4500, baseKm: 20, perKmRate: 130, tiers: [{ min: 0, max: 20, type: 'flat', price: 4500 }, { min: 21, max: 40, type: 'flat', price: 6000 }, { min: 41, max: 50, type: 'per_km', rate: 150 }, { min: 51, max: 100, type: 'per_km', rate: 130 }, { min: 101, max: 140, type: 'per_km', rate: 130 }, { min: 141, max: 200, type: 'per_km', rate: 127 }, { min: 201, max: 9999, type: 'per_km', rate: 122 }] },
    'vezel': { vehicleType: 'vezel', name: 'HONDA VEZEL', image: '/vehicles/Hondavezel.png', capacity: 3, luggage: 3, handLuggage: 3, basePrice: 5500, baseKm: 20, perKmRate: 130, tiers: [{ min: 0, max: 20, type: 'flat', price: 6500 }, { min: 21, max: 40, type: 'flat', price: 9500 }, { min: 41, max: 100, type: 'per_km', rate: 150 }, { min: 101, max: 140, type: 'per_km', rate: 145 }, { min: 141, max: 200, type: 'per_km', rate: 140 }, { min: 201, max: 9999, type: 'per_km', rate: 135 }] },
    'suv': { vehicleType: 'suv', name: 'SUV', image: '/vehicles/suv.png', capacity: 3, luggage: 3, handLuggage: 3, basePrice: 8000, baseKm: 20, perKmRate: 160, tiers: [] },
    'mini-van-every': { vehicleType: 'mini-van-every', name: 'MINI VAN EVERY', image: '/vehicles/susukievery.png', capacity: 3, luggage: 3, handLuggage: 3, basePrice: 4500, baseKm: 20, perKmRate: 150, tiers: [{ min: 0, max: 20, type: 'flat', price: 4500 }, { min: 21, max: 40, type: 'flat', price: 6000 }, { min: 41, max: 50, type: 'per_km', rate: 150 }, { min: 51, max: 100, type: 'per_km', rate: 130 }, { min: 101, max: 140, type: 'per_km', rate: 129 }, { min: 141, max: 200, type: 'per_km', rate: 127 }, { min: 201, max: 9999, type: 'per_km', rate: 122 }] },
    'mini-van-05': { vehicleType: 'mini-van-05', name: 'MINI VAN 4 SEAT', image: '/vehicles/minivan5seat.png', capacity: 4, luggage: 4, handLuggage: 4, basePrice: 6000, baseKm: 20, perKmRate: 200, tiers: [{ min: 0, max: 20, type: 'flat', price: 6000 }, { min: 21, max: 40, type: 'flat', price: 8500 }, { min: 41, max: 100, type: 'per_km', rate: 200 }, { min: 101, max: 140, type: 'per_km', rate: 176 }, { min: 141, max: 200, type: 'per_km', rate: 143 }, { min: 201, max: 9999, type: 'per_km', rate: 132 }] },
    'normal-kdh': { vehicleType: 'normal-kdh', name: 'VAN KDH', image: '/vehicles/van.png', capacity: 6, luggage: 7, handLuggage: 7, basePrice: 8000, baseKm: 40, perKmRate: 175, tiers: [{ min: 0, max: 20, type: 'flat', price: 6000 }, { min: 21, max: 40, type: 'flat', price: 8500 }, { min: 41, max: 100, type: 'per_km', rate: 200 }, { min: 101, max: 140, type: 'per_km', rate: 180 }, { min: 141, max: 200, type: 'per_km', rate: 145 }, { min: 201, max: 9999, type: 'per_km', rate: 135 }] },
    'kdh-van': { vehicleType: 'kdh-van', name: 'MINI BUS', image: '/vehicles/toyota-highroof.png', capacity: 8, luggage: 8, handLuggage: 6, basePrice: 8500, baseKm: 40, perKmRate: 180, tiers: [{ min: 0, max: 20, type: 'flat', price: 6000 }, { min: 21, max: 40, type: 'flat', price: 8500 }, { min: 41, max: 100, type: 'per_km', rate: 200 }, { min: 101, max: 140, type: 'per_km', rate: 180 }, { min: 141, max: 200, type: 'per_km', rate: 145 }, { min: 201, max: 9999, type: 'per_km', rate: 135 }] },
    'mini-bus': { vehicleType: 'mini-bus', name: 'COASTER BUS', image: '/vehicles/costerbus.png', capacity: 25, luggage: 20, handLuggage: 15, basePrice: 15000, baseKm: 40, perKmRate: 250, tiers: [{ min: 0, max: 20, type: 'flat', price: 7500 }, { min: 21, max: 40, type: 'flat', price: 12000 }, { min: 41, max: 100, type: 'per_km', rate: 220 }, { min: 101, max: 140, type: 'per_km', rate: 220 }, { min: 141, max: 200, type: 'per_km', rate: 175 }, { min: 201, max: 9999, type: 'per_km', rate: 155 }] },
    'coach-bus': { vehicleType: 'coach-bus', name: 'COACH BUS', image: '/vehicles/coach-bus.png', capacity: 40, luggage: 40, handLuggage: 20, basePrice: 18000, baseKm: 40, perKmRate: 300, tiers: [] }
};

const BookingWidgetContent = ({ defaultTab = 'pickup', onTabChange }) => {
    const router = useRouter();
    const [activeOffers, setActiveOffers] = useState([]);
    const [appliedOffers, setAppliedOffers] = useState([]); // Support multiple coupons
    const [vehiclePricing, setVehiclePricing] = useState({});
    const [isLoadingPricing, setIsLoadingPricing] = useState(true);
    const activePricing = (vehiclePricing && Object.keys(vehiclePricing).length > 0) ? vehiclePricing : FALLBACK_PRICING;
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [tripType, setTripType] = useState('one-way');
    const [pickup, setPickup] = useState({ name: 'Bandaranaike International Airport (CMB)', lat: 7.1804, lng: 79.8837 })
    const [dropoff, setDropoff] = useState({ name: '', lat: null, lng: null })

    useEffect(() => {
        if (onTabChange) {
            onTabChange(activeTab);
        }
    }, [activeTab, onTabChange]);

    const [waypoints, setWaypoints] = useState([])
    const [pickupSearch, setPickupSearch] = useState('Bandaranaike International Airport (CMB)')
    const [dropoffSearch, setDropoffSearch] = useState('')
    const [waypointSearches, setWaypointSearches] = useState([])
    const [roundTripPackageId, setRoundTripPackageId] = useState(null)
    const [pickupResults, setPickupResults] = useState([])
    const [dropoffResults, setDropoffResults] = useState([])
    const [waypointResults, setWaypointResults] = useState([])

    const [passengerCount, setPassengerCount] = useState({
        adults: 0,
        children: 0,
        luggage: 0,
        handLuggage: 0
    })

    const [distance, setDistance] = useState(null)
    const [duration, setDuration] = useState(null)
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
    const [step, setStep] = useState(1); // 1=Route, 2=Passengers+Vehicle, 3=Summary(mobile)
    const [isPassengerVerified, setIsPassengerVerified] = useState(false);

    useEffect(() => {
        const event = new CustomEvent('bookingStepChange', { detail: { step } });
        window.dispatchEvent(event);
    }, [step]);

    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        
        const timer = setTimeout(() => {
            const element = document.getElementById('booking');
            if (element) {
                const html = document.documentElement;
                const originalScrollBehavior = html.style.scrollBehavior;
                html.style.scrollBehavior = 'auto';
                element.scrollIntoView({ behavior: 'auto', block: 'start' });
                html.style.scrollBehavior = originalScrollBehavior;
            }
        }, 150);

        return () => clearTimeout(timer);
    }, [step]);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setStep(1);
        const syncTab = ['pickup', 'drop'].includes(tabId) ? 'airport' : 'tour';
        const event = new CustomEvent('syncCustomTourBooking', {
            detail: {
                tab: syncTab,
                vehicleId: vehicle
            }
        });
        window.dispatchEvent(event);
        const element = document.getElementById('booking');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const [availableCoupons, setAvailableCoupons] = useState([])
    const [isLoadingCoupons, setIsLoadingCoupons] = useState(false)
    const [isCouponOpen, setIsCouponOpen] = useState(false)
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)

    const [dismissedOfferIds, setDismissedOfferIds] = useState([]);
    const [nameBoardPrice, setNameBoardPrice] = useState(2000); // Default, updated via API
    const [pricingSettings, setPricingSettings] = useState({ longDistanceThreshold: 175, longDistanceDiscountPercentage: 10, isActive: true });
    const [destinations, setDestinations] = useState([]);
    const [airportTours, setAirportTours] = useState([]);
    const [normalTours, setNormalTours] = useState([]);
    const [surgeRules, setSurgeRules] = useState([]);

    const [scheduledDate, setScheduledDate] = useState(null);
    const [scheduledTime, setScheduledTime] = useState(null);
    const [isDateTimePickerOpen, setIsDateTimePickerOpen] = useState(false);

    // Date and time must be manually selected by user

    const pickupRef = useRef(null);
    const dropoffRef = useRef(null);
    const dateTimeRef = useRef(null);
    const [step1Errors, setStep1Errors] = useState({
        pickup: false,
        dropoff: false,
        dateTime: false
    });

    const validateStep1 = () => {
        const errors = {
            pickup: !pickup?.lat || !pickup?.name,
            dropoff: !dropoff?.lat || !dropoff?.name,
            dateTime: !scheduledDate || !scheduledTime
        };
        setStep1Errors(errors);

        const hasErrors = errors.pickup || errors.dropoff || errors.dateTime;

        if (hasErrors) {
            if (errors.pickup && pickupRef.current) {
                pickupRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (errors.dropoff && dropoffRef.current) {
                dropoffRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (errors.dateTime && dateTimeRef.current) {
                dateTimeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        return !hasErrors;
    };


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
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout fallback
                
                let res;
                try {
                    res = await fetch(`/api/pricing?category=${category}`, { signal: controller.signal });
                } catch (err) {
                    console.error('Pricing fetch error/timeout:', err.message);
                    setIsLoadingPricing(false);
                    return;
                } finally {
                    clearTimeout(timeoutId);
                }

                if (!res.ok) {
                    console.error('Pricing Fetch Failed', res.status);
                    setIsLoadingPricing(false);
                    return;
                }
                const response = await res.json();
                console.log(`Fetched Pricing for ${category}:`, response); // Debug Log

                const vehicles = response.data || [];
                if (!Array.isArray(vehicles)) return;

                const pricingMap = {};
                vehicles.forEach(v => { 
                    if (v.vehicleType?.toLowerCase() === 'sedan' || v.name?.toLowerCase().includes('sedan')) {
                        v.image = '/vehicles/sedancar.png';
                    }
                    if (v.vehicleType?.toLowerCase() === 'suv' || v.name?.toLowerCase().includes('suv')) {
                        v.image = '/vehicles/suv.png';
                    }
                    pricingMap[v.vehicleType] = v; 
                });
                setVehiclePricing(pricingMap);

                // Set Nameboard Price if available
                if (response.meta?.nameBoardPrice) {
                    setNameBoardPrice(response.meta.nameBoardPrice);
                }

            } catch (error) { console.error(error); } finally { setIsLoadingPricing(false); }
        };
        if (activeTab !== 'tours') fetchPricing();
    }, [activeTab]);

    // URL Params Effect for Offers, Destination, and Tab
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.__urlParamsProcessed) return;
            window.__urlParamsProcessed = true;
        }

        const params = new URLSearchParams(window.location.search);
        const couponParam = params.get('coupon');
        const destParam = params.get('destination');
        const tabParam = params.get('tab');
        let needsUrlCleanup = false;

        if (tabParam && ['pickup', 'drop', 'ride', 'tours'].includes(tabParam)) {
            setActiveTab(tabParam);
            needsUrlCleanup = true;
            setTimeout(() => {
                const element = document.getElementById('booking');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }

        if (couponParam) {
            setCouponCode(couponParam);
            needsUrlCleanup = true;
        }

        if (destParam) {
            setDropoff({
                address: destParam,
                lat: null,
                lng: null,
                name: destParam
            });
            setDropoffSearch(destParam);
            
            if (tabParam === 'ride') {
                setPickup({ name: '', lat: null, lng: null });
                setPickupSearch('');
            } else if (!tabParam) {
                setActiveTab('pickup');
            }
            needsUrlCleanup = true;
        }

        if (needsUrlCleanup) {
            // Clean up the URL search params so they do not cause unwanted reactive resets later
            const newUrl = window.location.pathname;
            router.replace(newUrl, { scroll: false });
        }

    }, [router]);

    // Auto-swap vehicle if capacity exceeded
    useEffect(() => {
        if (!activePricing || Object.keys(activePricing).length === 0) return;
        
        const pax = passengerCount || { adults: 1, children: 0, luggage: 0, handLuggage: 0 };
        const totalPax = (pax.adults || 0) + (pax.children || 0);
        const totalBags = (pax.luggage || 0);

        const currentVehicle = activePricing[vehicle];
        
        const checkSuitability = (v) => {
            if (!v) return false;
            const vehiclePax = v.capacity || 4;
            const vehicleLargeBags = v.luggage || 0;
            const vehicleSmallBags = v.handLuggage || 0;
            const spareSeats = Math.max(0, vehiclePax - totalPax);
            const extraBagCapacity = spareSeats * 2;
            const maxBagUnits = vehicleLargeBags + (vehicleSmallBags * 0.5) + extraBagCapacity;
            if (totalPax > vehiclePax) return false;
            if (totalBags > maxBagUnits) return false;
            return true;
        };

        if (!checkSuitability(currentVehicle)) {
            const getPriority = (type) => {
                const t = type?.toLowerCase() || '';
                if (t.includes('mini-car') || t.includes('wagon')) return 1;
                if (t.includes('sedan')) return 2;
                if (t.includes('vezel') || t.includes('vessel')) return 3;
                if (t.includes('suv')) return 4;
                if (t.includes('mini-van-05')) return 5;
                if (t.includes('mini-van')) return 5.5;
                if (t.includes('kdh-van') || t.includes('flatroof') || t.includes('kdh')) return 6;
                if (t.includes('highroof')) return 7;
                if (t.includes('bus') || t.includes('coach')) return 8;
                return 10;
            };
            const sorted = Object.values(activePricing).sort((a, b) => getPriority(a.vehicleType) - getPriority(b.vehicleType));
            
            const suitable = sorted.find(checkSuitability);
            if (suitable && suitable.vehicleType !== vehicle) {
                setVehicle(suitable.vehicleType);
            }
        }
    }, [passengerCount, activePricing, vehicle]);

    // Tab Logic - reset fields based on mode
    useEffect(() => {
        console.log("BookingWidget: Active Tab changed to:", activeTab);
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
        if (data.durationMin) {
            const hrs = Math.floor(data.durationMin / 60);
            const mins = Math.round(data.durationMin % 60);
            const durationStr = hrs > 0 ? `${hrs} hr ${mins} min` : `${mins} min`;
            setDuration(durationStr);
        } else {
            setDuration(null);
        }
    }

    // Fetch Marketing Offers, Destinations, Global Settings, Surge Rules, and Coupons on mount in parallel
    useEffect(() => {
        const fetchGlobalData = async () => {
            setIsLoadingCoupons(true);
            try {
                const [marketingRes, destinationsRes, settingsRes, airportToursRes, normalToursRes, surgeRes, couponsRes] = await Promise.all([
                    fetch('/api/admin/marketing').then(r => r.json()).catch(err => { console.error("Error fetching offers:", err); return null; }),
                    fetch('/api/admin/destinations').then(r => r.json()).catch(err => { console.error("Error fetching destinations:", err); return null; }),
                    fetch('/api/admin/pricing-settings', { cache: 'no-store' }).then(r => r.json()).catch(err => { console.error("Failed to fetch pricing settings", err); return null; }),
                    fetch('/api/admin/airport-tours', { cache: 'no-store' }).then(r => r.json()).catch(err => { console.error("Error", err); return null; }),
                    fetch('/api/admin/normal-tours', { cache: 'no-store' }).then(r => r.json()).catch(err => { console.error("Error", err); return null; }),
                    fetch('/api/traffic-surge', { cache: 'no-store' }).then(r => r.json()).catch(err => { console.error("Failed to fetch surge rules", err); return null; }),
                    fetch('/api/coupons?public=true', { cache: 'no-store' }).then(r => r.json()).catch(err => { console.error("Error fetching coupons:", err); return null; })
                ]);

                if (marketingRes?.offers) {
                    setActiveOffers(marketingRes.offers);
                }
                if (destinationsRes?.success && destinationsRes.data) {
                    setDestinations(destinationsRes.data);
                }
                if (settingsRes?.success && settingsRes.data) {
                    setPricingSettings(settingsRes.data);
                }
                if (airportToursRes?.success && airportToursRes.data) {
                    setAirportTours(airportToursRes.data);
                }
                if (normalToursRes?.success && normalToursRes.data) {
                    setNormalTours(normalToursRes.data);
                }
                if (surgeRes?.success && surgeRes.data) {
                    setSurgeRules(surgeRes.data);
                }
                if (Array.isArray(couponsRes)) {
                    setAvailableCoupons(couponsRes);
                }
            } catch (err) {
                console.error("Error in BookingWidget mount fetch waterfall resolver:", err);
            } finally {
                setIsLoadingCoupons(false);
            }
        };
        fetchGlobalData();
    }, []);

    // Dynamic Coupon Filtering based on Location
    const filteredCoupons = React.useMemo(() => {
        if (!availableCoupons.length) return [];

        const pickupText = (pickup?.name || pickupSearch || '').toLowerCase();
        const dropoffText = (dropoff?.name || dropoffSearch || '').toLowerCase();

        const isAirport = (name) => {
            if (!name) return false;
            const n = name.toLowerCase();
            return (n.includes('bandaranaike') || n.includes('cmb') || n.includes('airport'));
        };

        const isAirportRide = isAirport(pickupText) || isAirport(dropoffText);
        const isTour = activeTab === 'tours';
        const isIntercity = activeTab === 'ride';
        const isAirportTransfer = ['pickup', 'drop'].includes(activeTab);

        if (isAirportTransfer && !isAirportRide) {
            return []; // Coupons are only applicable for airport drop and pickup
        }

        return availableCoupons.filter(coupon => {
            // Check applicableFor compatibility with activeTab
            if (coupon.applicableFor && coupon.applicableFor !== 'all') {
                if (coupon.applicableFor === 'round-trips' && !isTour) return false;
                if ((coupon.applicableFor === 'airport-transfer' || coupon.applicableFor === 'transfers') && !isAirportTransfer) return false;
                if (coupon.applicableFor === 'ride-now' && !isIntercity) return false;
            }

            // If coupon has no location restrictions, consider it global
            if (!coupon.applicableLocations || coupon.applicableLocations.length === 0) {
                return true;
            }

            const isRealMatch = (address, keyword) => {
                if (!address || !keyword) return false;
                const addr = address.toLowerCase().trim();
                const kw = keyword.toLowerCase().trim();
                
                const streetPattern1 = kw + ' road';
                const streetPattern2 = kw + ' face';
                const streetPattern3 = kw + ' street';
                const streetPattern4 = kw + ' lane';
                const streetPattern5 = kw + ' hotel';

                if (addr.includes(streetPattern1) || addr.includes(streetPattern2) || addr.includes(streetPattern3) || addr.includes(streetPattern4) || addr.includes(streetPattern5)) {
                    const cleanedAddr = addr
                        .split(streetPattern1).join('')
                        .split(streetPattern2).join('')
                        .split(streetPattern3).join('')
                        .split(streetPattern4).join('')
                        .split(streetPattern5).join('');
                        
                    const regex = new RegExp(`\\b${kw}\\b`, 'i');
                    return regex.test(cleanedAddr);
                }
                
                const regex = new RegExp(`\\b${kw}\\b`, 'i');
                return regex.test(addr);
            };

            // Check if any applicable location matches the current route
            return coupon.applicableLocations.some(loc => {
                const l = loc.toLowerCase().trim();
                if (l.includes('->')) {
                    const [fromPart, toPart] = l.split('->').map(s => s.trim());
                    return isRealMatch(pickupText, fromPart) && isRealMatch(dropoffText, toPart);
                }
                return isRealMatch(pickupText, l) || isRealMatch(dropoffText, l);
            });
        });
    }, [availableCoupons, pickup, pickupSearch, dropoff, dropoffSearch, activeTab]);

    // Auto-Select Vehicle based on Passengers (ONLY if not manually selected)
    useEffect(() => {
        if (isManualVehicle) return;

        const currentVehicleData = activePricing[vehicle];
        if (!currentVehicleData) return;

        const totalPax = (passengerCount.adults || 0) + (passengerCount.children || 0);
        const totalLuggage = passengerCount.luggage || 0;

        // Find best fit (Cheapest that fits capacity)
        const sortedVehicles = Object.values(activePricing).sort((a, b) => (a.basePrice || 0) - (b.basePrice || 0));
        const bestFit = sortedVehicles.find(v =>
            totalPax <= (v.capacity || 4) && totalLuggage <= (v.luggage || 0)
        );

        if (bestFit && bestFit.vehicleType !== vehicle) {
            setVehicle(bestFit.vehicleType);
        }
    }, [passengerCount, activePricing, vehicle, isManualVehicle]);



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

            // ALLOW AUTOMATED OFFERS FOR AIRPORT RIDES
            const isAirportRide = start.includes('airport') || dest.includes('airport');

            if (isAirportRide) {
                // PRIORITY 1: Precise Database Coupons
                availableCoupons.forEach(coupon => {
                    // Check applicableFor compatibility with activeTab
                    if (coupon.applicableFor && coupon.applicableFor !== 'all') {
                        if (coupon.applicableFor === 'round-trips' && activeTab !== 'tours') return;
                        if ((coupon.applicableFor === 'airport-transfer' || coupon.applicableFor === 'transfers') && !['pickup', 'drop'].includes(activeTab)) return;
                        if (coupon.applicableFor === 'ride-now' && activeTab !== 'ride') return;
                    }

                    if (coupon.applicableLocations && coupon.applicableLocations.length > 0) {
                        let matchedLoc = '';
                        const isMatch = coupon.applicableLocations.some(loc => {
                            const l = loc.toLowerCase().trim();
                            if (l.length < 3) return false;

                            const isRealMatch = (address, keyword) => {
                                if (!address || !keyword) return false;
                                const addr = address.toLowerCase().trim();
                                const kw = keyword.toLowerCase().trim();
                                
                                const streetPattern1 = kw + ' road';
                                const streetPattern2 = kw + ' face';
                                const streetPattern3 = kw + ' street';
                                const streetPattern4 = kw + ' lane';
                                const streetPattern5 = kw + ' hotel';

                                if (addr.includes(streetPattern1) || addr.includes(streetPattern2) || addr.includes(streetPattern3) || addr.includes(streetPattern4) || addr.includes(streetPattern5)) {
                                    const cleanedAddr = addr
                                        .split(streetPattern1).join('')
                                        .split(streetPattern2).join('')
                                        .split(streetPattern3).join('')
                                        .split(streetPattern4).join('')
                                        .split(streetPattern5).join('');
                                        
                                    const regex = new RegExp(`\\b${kw}\\b`, 'i');
                                    return regex.test(cleanedAddr);
                                }
                                
                                const regex = new RegExp(`\\b${kw}\\b`, 'i');
                                return regex.test(addr);
                            };

                            if (l.includes('->')) {
                                const [fromPart, toPart] = l.split('->').map(s => s.trim());
                                const match = isRealMatch(start, fromPart) && isRealMatch(dest, toPart);
                                if (match) matchedLoc = loc;
                                return match;
                            }

                            const match = isRealMatch(dest, l) || isRealMatch(start, l);
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
                if (pricingSettings?.isActive && Number(distance) > Number(pricingSettings?.longDistanceThreshold || 175)) {
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

    // Automatically re-evaluate and clean up applied coupons if the user changes location or tab
    useEffect(() => {
        const dest = (dropoff?.name || dropoffSearch || '').toLowerCase().trim();
        const start = (pickup?.name || pickupSearch || '').toLowerCase().trim();
        const isTour = activeTab === 'tours';
        const isIntercity = activeTab === 'ride';
        const isAirportTransfer = ['pickup', 'drop'].includes(activeTab);

        const isAirport = (name) => {
            if (!name) return false;
            const n = name.toLowerCase();
            return (n.includes('bandaranaike') || n.includes('cmb') || n.includes('airport'));
        };

        const isAirportRide = isAirport(start) || isAirport(dest);

        setAppliedOffers(prev => {
            return prev.filter(offer => {
                if (offer.type !== 'coupon') return true;

                // Check applicableFor compatibility with activeTab
                if (offer.applicableFor && offer.applicableFor !== 'all') {
                    if (offer.applicableFor === 'round-trips' && !isTour) return false;
                    if ((offer.applicableFor === 'airport-transfer' || offer.applicableFor === 'transfers') && !isAirportTransfer) return false;
                    if (offer.applicableFor === 'ride-now' && !isIntercity) return false;
                }

                // Check location compatibility
                if (isAirportTransfer && !isAirportRide) {
                    if (offer.applicableFor === 'airport-transfer' || offer.applicableFor === 'transfers') {
                        return false;
                    }
                }

                if (offer.applicableLocations && offer.applicableLocations.length > 0) {
                    const isRealMatch = (address, keyword) => {
                        if (!address || !keyword) return false;
                        const addr = address.toLowerCase().trim();
                        const kw = keyword.toLowerCase().trim();
                        
                        const streetPattern1 = kw + ' road';
                        const streetPattern2 = kw + ' face';
                        const streetPattern3 = kw + ' street';
                        const streetPattern4 = kw + ' lane';
                        const streetPattern5 = kw + ' hotel';

                        if (addr.includes(streetPattern1) || addr.includes(streetPattern2) || addr.includes(streetPattern3) || addr.includes(streetPattern4) || addr.includes(streetPattern5)) {
                            const cleanedAddr = addr
                                .split(streetPattern1).join('')
                                .split(streetPattern2).join('')
                                .split(streetPattern3).join('')
                                .split(streetPattern4).join('')
                                .split(streetPattern5).join('');
                                
                            const regex = new RegExp(`\\b${kw}\\b`, 'i');
                            return regex.test(cleanedAddr);
                        }
                        
                        const regex = new RegExp(`\\b${kw}\\b`, 'i');
                        return regex.test(addr);
                    };

                    const isMatch = offer.applicableLocations.some(loc => {
                        const l = loc.toLowerCase().trim();
                        if (l.includes('->')) {
                            const [fromPart, toPart] = l.split('->').map(s => s.trim());
                            return isRealMatch(start, fromPart) && isRealMatch(dest, toPart);
                        }
                        return isRealMatch(start, l) || isRealMatch(dest, l);
                    });

                    if (!isMatch) return false;
                }

                return true;
            });
        });
    }, [pickup, dropoff, pickupSearch, dropoffSearch, activeTab]);


    // Calculate total waiting hours including waypoints securely with integers
    const totalWaitingHours = parseInt(waitingHours || 0, 10) + waypoints.reduce((sum, wp) => sum + parseInt(wp.waitingTime || 0, 10), 0);
    // Current time for "Ride Now" estimation
    const now = new Date();
    const currentTime = activeTab === 'ride' ? `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}` : null;
    const currentDate = activeTab === 'ride' ? now.toISOString().split('T')[0] : null;

    // Updated calculatePrice call with nameBoardPrice and locations
    const { total, surgeAmount } = calculatePrice(
        distance,
        vehicle,
        tripType,
        activePricing,
        totalWaitingHours,
        false, // hasNameBoard removed from landing page
        nameBoardPrice,
        pricingSettings.waitingHourRate || 1000,
        pickup?.name || pickupSearch,
        dropoff?.name || dropoffSearch,
        destinations,
        scheduledTime || currentTime,
        scheduledDate || currentDate,
        surgeRules,
        roundTripPackageId,
        normalTours,
                                                                    airportTours,
        pricingSettings.destinationRoundTripPackages
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

        if (!passengerCount.adults || passengerCount.adults < 1) {
            alert("Please select at least one adult passenger.");
            return;
        }

        const currentVehicleData = activePricing[vehicle];
        if (currentVehicleData) {
            const totalPax = (passengerCount.adults || 0) + (passengerCount.children || 0);
            const totalLuggage = passengerCount.luggage || 0;
            const exceedsCapacity =
                totalPax > (currentVehicleData.capacity || 4) ||
                totalLuggage > (currentVehicleData.luggage || 0);

            if (exceedsCapacity) {
                alert(`The selected vehicle (${currentVehicleData.name}) does not have enough capacity for your passenger and luggage count. Please select a suitable vehicle.`);
                setIsVehicleDrawerOpen(true);
                return;
            }
        }

        const verifiedCoupons = appliedOffers.map(offer => ({
            code: offer.name,
            discountType: offer.discountPercentage > 0 ? 'percentage' : 'flat',
            value: offer.discountPercentage > 0 ? offer.discountPercentage : offer.discountAmount
        }));

        console.log("BookingWidget: Initiating Booking with data:", {
            pickup: pickup.name,
            dropoff: dropoff.name,
            vehicle,
            tripType,
            verifiedCoupons
        });
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
            duration,
            vehicle,
            couponCode: verifiedCoupons.length > 0 ? verifiedCoupons[0].code : '',
            verifiedCoupons,
            nameBoardPrice,
            isAirportPickup: activeTab === 'pickup',
            activeTab,
            scheduledDate: scheduledDate || currentDate,
            scheduledTime: scheduledTime || currentTime,
            roundTripPackageId,
            pricing: Object.values(activePricing)
        });
        setShowModal(true);
    };


    const swapLocations = () => {
        const t = { ...pickup }; const ts = pickupSearch;
        setPickup(dropoff); setPickupSearch(dropoffSearch);
        setDropoff(t); setDropoffSearch(ts);
        setDistance(null); // Force re-calculation trigger
        setDuration(null);
    }

    // Determine Pricing Category
    const isAirportService = ['pickup', 'drop'].includes(activeTab);
    const pricingCategory = isAirportService ? 'airport-transfer' : 'ride-now';

    const isStep2Disabled = !vehicle || !passengerCount.adults || passengerCount.adults < 1 || passengerCount.luggage < 1 || passengerCount.handLuggage < 1;
    const isCheckoutDisabled = !distance || isStep2Disabled;

    return (
        <div id="booking" className="w-full max-w-6xl mx-auto pt-6 md:pt-8 pb-8 md:pb-0 relative z-40 md:px-4">
            <h1 className="sr-only">Book Airport Taxis & Transfers in Sri Lanka - Fixed Rates</h1>
            {/* Tab Navigation - Luxury Pill Style */}
            <div className="flex bg-slate-100 dark:bg-zinc-900 rounded-2xl w-full sm:w-fit mx-auto lg:mx-0 mb-6 p-1.5 shadow-inner" role="tablist">
                <div className="grid grid-cols-4 w-full sm:w-auto gap-1">
                    {[
                        { id: 'pickup', label: 'Airport Pickup', icon: PlaneLanding },
                        { id: 'drop', label: 'Airport Dropoff', icon: PlaneTakeoff },
                        { id: 'ride', label: 'Intercity Ride', icon: Route },
                        { id: 'tours', label: 'Taxi Round Tour', icon: Signpost }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            aria-controls={`panel-${tab.id}`}
                            id={`tab-${tab.id}`}
                            aria-label={tab.label}
                            onClick={() => handleTabChange(tab.id)}
                            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 md:gap-2.5 px-2 sm:px-6 py-3 rounded-xl text-[9px] sm:text-xs md:text-sm font-bold transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-emerald-950 dark:bg-yellow-400 text-white dark:text-black shadow-lg border-2 border-emerald-950 dark:border-yellow-400'
                                : 'text-slate-500 dark:text-slate-400 hover:text-emerald-900 dark:hover:text-yellow-400 hover:bg-slate-200/50 dark:hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={16} className={activeTab === tab.id ? 'text-[#FACC15] dark:text-black' : 'text-slate-400 group-hover:text-emerald-900 dark:group-hover:text-yellow-400'} aria-hidden="true" />
                            <span className="uppercase tracking-wider">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Widget Main Content - Modern Flat Luxury Style */}
            <div
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            className={`animate-slide-up relative z-10 w-full box-border ${
                activeTab === 'tours' 
                ? '' 
                : 'bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-400 dark:border-white/10 p-4 sm:p-6 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none'
            }`}>

                {activeTab === 'tours' ? <CustomTourBooking /> : (
                    <div className="grid lg:grid-cols-[1.5fr,380px] xl:grid-cols-[1fr,380px] gap-8 lg:gap-10 min-w-0">
                        <div className="flex-1 text-center lg:text-left min-w-0">
                            {/* Step indicator + currency row */}
                            <div className="flex items-center gap-2 mb-6">
                                {[{n:1,label:'Route'},{n:2,label:'Details'},{n:3,label:'Review',mobileOnly:true}].map((s, i, arr) => (
                                    <React.Fragment key={s.n}>
                                        <button
                                            onClick={() => s.n < step && setStep(s.n)}
                                            className={`flex items-center gap-2 ${s.mobileOnly ? 'flex lg:hidden' : 'flex'} ${s.n < step ? 'cursor-pointer' : 'cursor-default'}`}
                                            aria-label={`${s.n}${s.label}`}
                                        >
                                            <div className="flex items-center justify-center w-8 h-8">
                                                {step === s.n ? (
                                                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shadow-lg shadow-black/20 scale-110 z-10">
                                                        <div className="w-6 h-6 bg-[#FACC15] text-black rounded-full flex items-center justify-center text-[10px] font-black">
                                                            {s.n}
                                                        </div>
                                                    </div>
                                                ) : step > s.n ? (
                                                    <div className="w-8 h-8 rounded-full border-2 border-black bg-white dark:bg-zinc-800 flex items-center justify-center text-black dark:text-white shadow-sm z-10">
                                                        <Check size={12} strokeWidth={3} className="text-black dark:text-white" />
                                                    </div>
                                                ) : (
                                                    <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-500 flex items-center justify-center text-[10px] font-black">
                                                        {s.n}
                                                    </div>
                                                )}
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                                                step === s.n ? 'text-slate-900 dark:text-white' :
                                                step > s.n ? 'text-slate-500' : 'text-slate-500 dark:text-slate-600'
                                            } ${s.mobileOnly ? 'hidden sm:block lg:hidden' : 'hidden sm:block'}`}>{s.label}</span>
                                        </button>
                                        {i < arr.length - 1 && (
                                            <div className={`flex-1 h-px transition-all duration-500 ${step > s.n ? 'bg-black' : 'bg-slate-300 dark:bg-zinc-700'} ${arr[i+1].mobileOnly ? 'flex lg:hidden' : ''}`} />
                                        )}
                                    </React.Fragment>
                                ))}
                                {/* Currency Selector */}
                                <div className="relative ml-3 shrink-0">
                                    <button
                                        onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                                        className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-[10px] font-bold text-slate-700 dark:text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                                        aria-label={`Select currency: Current currency is ${currency}`}
                                    >
                                        <div className="w-4 h-4 overflow-hidden rounded-full border border-slate-200 dark:border-white/20">
                                            <img src={SUPPORTED_CURRENCIES.find(c => c.code === currency)?.flag} alt={`${currency} flag`} className="w-full h-full object-cover scale-150" />
                                        </div>
                                        <span className="uppercase">{currency}</span>
                                        <ChevronDown size={12} className={`opacity-70 transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                                    </button>
                                    <AnimatePresence>
                                        {isCurrencyOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-[calc(100%+8px)] right-0 mt-2 w-36 bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden z-[200]"
                                            >
                                                {SUPPORTED_CURRENCIES.map(c => (
                                                    <button
                                                        key={c.code}
                                                        onClick={() => { changeCurrency(c.code); setIsCurrencyOpen(false); }}
                                                         className={`w-full text-left px-4 py-2.5 text-[10px] font-black flex items-center gap-3 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-[#FACC15] transition-colors ${currency === c.code ? 'text-black bg-[#FACC15] border-l-4 border-amber-600' : 'text-slate-700 dark:text-white border-b border-slate-100 last:border-0'}`}
                                                    >
                                                        <div className="w-4 h-4 rounded-full overflow-hidden border border-slate-200"><img src={c.flag} alt={c.code} className="w-full h-full object-cover scale-150" /></div>
                                                        <span>{c.code}</span>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* STEPS */}
                            <AnimatePresence>

                                {step === 1 && (
                                    <motion.div key="step1" initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-16}} transition={{duration:0.2}}>
                                        <div className="relative">
                                            <div className="absolute left-[16px] top-10 bottom-10 w-5 z-0 pointer-events-none overflow-visible">
                                                <svg className="w-full h-full" viewBox="0 0 20 100" preserveAspectRatio="none">
                                                    <motion.path d="M 10 0 Q 0 50 10 100" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" className="text-emerald-500/30 dark:text-[#FACC15]/20" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }} />
                                                    <motion.path d="M 10 0 Q 0 50 10 100" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" className="text-emerald-500 dark:text-[#FACC15]" initial={{ pathLength: 0.2, pathOffset: 0 }} animate={{ pathOffset: 1 }} transition={{ duration: 3, ease: "linear", repeat: Infinity }} />
                                                </svg>
                                            </div>
                                            <div className="space-y-4 md:space-y-3 relative z-10">
                                                <div ref={pickupRef} className="relative">
                                                    <div className="absolute left-[18px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-emerald-500 bg-white dark:bg-zinc-800 z-20 flex items-center justify-center text-emerald-500">
                                                        <CircleDot size={10} strokeWidth={4} />
                                                    </div>
                                                    <LocationInput placeholder="Pick-up Location" value={pickupSearch} icon={activeTab === 'pickup' ? PlaneTakeoff : MapPin} disabled={activeTab === 'pickup'} onChange={(val) => setPickupSearch(val)} zIndex={100} onSelect={(loc) => { setPickup({ name: loc.address, lat: loc.lat, lng: loc.lng }); setPickupSearch(loc.address); setStep1Errors(prev => ({ ...prev, pickup: false })); }} error={step1Errors.pickup} />
                                                    {step1Errors.pickup && (
                                                        <span className="text-[10px] font-bold text-red-500 mt-1 block pl-1">Please select a valid pick-up location</span>
                                                    )}
                                                </div>
                                                {waypoints.map((wp, idx) => (
                                                    <div key={idx} className="relative group animate-slide-up bg-white dark:bg-zinc-800 rounded-2xl border border-slate-400 dark:border-white/10 shadow-sm p-1 sm:p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-1 mb-3">
                                                        <div className="flex items-center flex-1 min-w-0">
                                                            <div className="flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 bg-slate-100 dark:bg-zinc-900 p-2 rounded-full ml-1 sm:ml-2"><Navigation size={16} /></div>
                                                            <input type="text" readOnly value={wp.name} className="flex-1 min-w-0 pl-3 sm:pl-4 pr-2 sm:pr-4 h-10 sm:h-12 bg-transparent border-none text-[11px] sm:text-sm font-medium text-slate-800 dark:text-white outline-none truncate" />
                                                        </div>
                                                        <div className="flex items-center justify-between sm:justify-end border-t sm:border-t-0 sm:border-l-2 border-slate-200 dark:border-white/10 px-2 sm:px-3 py-1 sm:py-0 min-h-[40px] sm:min-h-0">
                                                            <div className="flex items-center flex-col sm:flex-row gap-0 sm:gap-2 mr-auto sm:mr-3">
                                                                <span className="text-[8px] sm:text-[9px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-wider mb-0.5 sm:mb-0">Wait Time</span>
                                                                <div className="flex items-center gap-2">
                                                                    <button onClick={(e) => { e.stopPropagation(); setWaypoints(prev => prev.map((w, i) => i === idx ? { ...w, waitingTime: Math.max(0, (w.waitingTime || 0) - 1) } : w)); }} aria-label="Decrease waiting time" className="w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/10 text-slate-700 dark:text-white text-[10px] sm:text-xs font-black transition-colors hover:bg-slate-200 active:scale-95">-</button>
                                                                    <span className="text-[10px] sm:text-sm font-black text-slate-700 dark:text-white w-4 sm:w-6 text-center">{wp.waitingTime || 0}h</span>
                                                                    <button onClick={(e) => { e.stopPropagation(); setWaypoints(prev => prev.map((w, i) => i === idx ? { ...w, waitingTime: (w.waitingTime || 0) + 1 } : w)); }} aria-label="Increase waiting time" className="w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 text-[10px] sm:text-xs font-black transition-colors hover:bg-emerald-200 active:scale-95">+</button>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => setWaypoints(prev => prev.filter((_, i) => i !== idx))} className="p-1.5 sm:p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all flex items-center justify-center active:scale-95" aria-label="Remove stop"><X size={14} /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {waypoints.length < 4 && (
                                                    <>
                                                        {waypointSearches.length === 0 && (
                                                            <div className="flex justify-start pl-10 md:pl-14 py-2">
                                                                <button onClick={() => setWaypointSearches([{ active: true }])} aria-label={`Add Stop (${waypoints.length} of 4)`} className="text-slate-800 dark:text-slate-100 bg-white dark:bg-zinc-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-2 py-3 px-5 rounded-xl border border-slate-400 dark:border-white/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                                                                    <Plus size={14} strokeWidth={4} className="text-emerald-500" /> ADD STOP ({waypoints.length}/4)
                                                                </button>
                                                            </div>
                                                        )}
                                                        {waypointSearches.length > 0 && (
                                                            <div className="relative group animate-fade-in">
                                                                <LocationInput placeholder="Add Stop (Search City)" icon={Navigation} zIndex={40} onSelect={(loc) => { setWaypoints([...waypoints, { name: loc.address, lat: loc.lat, lng: loc.lng, waitingTime: 0 }]); setWaypointSearches([]); }} />
                                                                <button onClick={() => setWaypointSearches([])} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 z-30" aria-label="Cancel add stop"><X size={16} /></button>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                                <div ref={dropoffRef} className="relative mt-2">
                                                    <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 transition-colors z-10 flex items-center justify-center"><MapPin size={20} className="text-red-500" strokeWidth={2.5} /></div>
                                                    <LocationInput placeholder="Drop-off Location" value={dropoffSearch} icon={activeTab === 'drop' ? PlaneLanding : MapPin} zIndex={100} disabled={activeTab === 'drop'} onChange={(val) => setDropoffSearch(val)} onSelect={(loc) => { setDropoff({ name: loc.address, lat: loc.lat, lng: loc.lng }); setDropoffSearch(loc.address); setStep1Errors(prev => ({ ...prev, dropoff: false })); }} error={step1Errors.dropoff} />
                                                    {step1Errors.dropoff && (
                                                        <span className="text-[10px] font-bold text-red-500 mt-1 block pl-1">Please select a valid drop-off location</span>
                                                    )}
                                                </div>
                                                <div ref={dateTimeRef} className="relative mt-2">
                                                    <CustomDateTimePicker 
                                                        date={scheduledDate} 
                                                        time={scheduledTime} 
                                                        onChange={(d, t) => { setScheduledDate(d); setScheduledTime(t); setStep1Errors(prev => ({ ...prev, dateTime: false })); }}
                                                        className={`w-full h-14 bg-white dark:bg-zinc-800 border rounded-2xl px-6 text-sm font-bold text-slate-700 dark:text-white shadow-sm hover:shadow-md transition-all outline-none focus:ring-2 focus:ring-[#FACC15] ${step1Errors.dateTime ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-400 dark:border-white/10'}`}
                                                    />
                                                    {step1Errors.dateTime && (
                                                        <span className="text-[10px] font-bold text-red-500 mt-1 block pl-1">Please select date and time</span>
                                                    )}
                                                </div>

                                                {distance && distance > 0 && (
                                                    <div className={`mt-4 animate-slide-up space-y-4`}>
                                                        <div className="flex items-center justify-between px-1">
                                                            <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none">Select Vehicle</label>
                                                            <button
                                                                onClick={() => setIsVehicleDrawerOpen(true)}
                                                                className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 text-[8px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-sm hover:bg-emerald-100 hover:shadow transition-all"
                                                            >
                                                                <Info size={10} strokeWidth={3} /> Fleet Specs
                                                            </button>
                                                        </div>
                                                        {isLoadingPricing ? (
                                                            <div className="flex gap-4 overflow-x-auto py-2 no-scrollbar">
                                                                {[1, 2, 3].map(n => (
                                                                    <div key={n} className="w-[72vw] sm:w-[260px] md:w-[230px] shrink-0 h-[280px] rounded-[2rem] bg-slate-100 dark:bg-zinc-800 animate-pulse border border-slate-200 dark:border-white/5" />
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <VehicleCarousel
                                                                vehicles={Object.values(activePricing).map(v => {
                                                                    const priceInfo = calculatePrice(
                                                                        distance,
                                                                        v.vehicleType,
                                                                        tripType,
                                                                        activePricing,
                                                                        totalWaitingHours,
                                                                        false, // hasNameBoard removed from landing page
                                                                        nameBoardPrice,
                                                                        pricingSettings.waitingHourRate || 1000,
                                                                        pickup?.name || pickupSearch,
                                                                        dropoff?.name || dropoffSearch,
                                                                        destinations,
                                                                        scheduledTime || currentTime,
                                                                        scheduledDate || currentDate,
                                                                        surgeRules,
                                                                        roundTripPackageId,
                                                                        normalTours,
                                                                        airportTours,
                                                                        pricingSettings.destinationRoundTripPackages
                                                                    );
                                                                    // Calculate discount specifically for this vehicle's total
                                                                    const vehicleDiscount = appliedOffers.reduce((max, offer) => {
                                                                        const val = (offer.discountAmount || (priceInfo.total * (offer.discountPercentage / 100)));
                                                                        return Math.max(max, val);
                                                                    }, 0);

                                                                    return {
                                                                        ...v,
                                                                        calculatedTotal: Math.max(0, priceInfo.total - vehicleDiscount),
                                                                        originalTotal: priceInfo.total,
                                                                        hasDiscount: vehicleDiscount > 0
                                                                    };
                                                                })}
                                                                selectedId={vehicle}
                                                                onSelect={(vType) => {
                                                                    if (!scheduledDate || !scheduledTime) {
                                                                        setStep1Errors(prev => ({ ...prev, dateTime: true }));
                                                                        dateTimeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                                        return;
                                                                    }
                                                                    setVehicle(vType);
                                                                    setIsManualVehicle(true);
                                                                    const syncTab = ['pickup', 'drop'].includes(activeTab) ? 'airport' : 'tour';
                                                                    const event = new CustomEvent('syncCustomTourBooking', {
                                                                        detail: {
                                                                            tab: syncTab,
                                                                            vehicleId: vType
                                                                        }
                                                                    });
                                                                    window.dispatchEvent(event);
                                                                }}
                                                                passengerCount={passengerCount}
                                                                pickupLocation={pickup}
                                                                dropoffLocation={dropoff}
                                                                isCondensed={false}
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-6 flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (validateStep1()) {
                                                        setStep(2);
                                                    }
                                                }}
                                                className="flex-1 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest py-4 rounded-2xl transition-all active:scale-[0.98] bg-[#FACC15] hover:bg-yellow-500 text-black hover:-translate-y-0.5"
                                                aria-label="Continue to Booking"
                                            >
                                                Continue to Booking <ArrowRight size={16} strokeWidth={3}/>
                                            </button>
                                            <button type="button" onClick={handleGetCurrentLocation} aria-label="Auto Detect My Location" className="shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                                                {isLocating ? <Loader2 size={16} className="animate-spin text-emerald-500"/> : <Zap size={16} className="text-emerald-500"/>}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div key="step2" initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:16}} transition={{duration:0.2}}>
                                        <div className="space-y-4 mb-6" id="booking-widget-passengers">
                                            <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest pl-1 leading-none block mb-4 flex items-center gap-2">
                                                Passenger and Luggage
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[{ id: 'adults', label: 'Adults' }, { id: 'children', label: 'Children' }, { id: 'luggage', label: 'Luggage' }, { id: 'handLuggage', label: 'Hand Luggage' }].map(c => {
                                                    const isFieldUnselected = (c.id === 'luggage' && !(passengerCount.luggage > 0)) || (c.id === 'adults' && !(passengerCount.adults > 0)) || (c.id === 'handLuggage' && !(passengerCount.handLuggage > 0));
                                                    return (
                                                        <div key={c.id} className={`bg-white dark:bg-zinc-800 border shadow-sm p-2 rounded-xl flex flex-col gap-1 transition-all ${isFieldUnselected ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-300 dark:border-white/15'}`}>
                                                            <span className={`text-[9px] font-black uppercase tracking-widest ${isFieldUnselected ? 'text-red-500 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>{c.label}</span>
                                                            <div className="flex items-center justify-between gap-1">
                                                                <button onClick={() => setPassengerCount(p => ({ ...p, [c.id]: Math.max(0, (Number(p[c.id]) || 0) - 1) }))} className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-600 dark:text-white active:scale-95"><Minus size={12} /></button>
                                                                <span className="font-bold text-sm" aria-live="polite">{passengerCount[c.id] || 0}</span>
                                                                <button onClick={() => setPassengerCount(p => ({ ...p, [c.id]: (Number(p[c.id]) || 0) + 1 }))} className="w-7 h-7 rounded-lg bg-emerald-500 border border-transparent flex items-center justify-center text-white shadow-sm active:scale-95"><Plus size={12} /></button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                        </div>
                                        <div className="mb-6 mt-6">
                                            <div className="flex items-center justify-between mb-4 px-1">
                                                <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none">Select Vehicle</label>
                                                <button
                                                    onClick={() => setIsVehicleDrawerOpen(true)}
                                                    className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 text-[8px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-sm hover:bg-emerald-100 hover:shadow transition-all"
                                                >
                                                    <Info size={10} strokeWidth={3} /> Fleet Specs
                                                </button>
                                            </div>
                                            <VehicleCarousel
                                                vehicles={Object.values(activePricing).map(v => {
                                                    const priceInfo = calculatePrice(
                                                        distance,
                                                        v.vehicleType,
                                                        tripType,
                                                        activePricing,
                                                        totalWaitingHours,
                                                        false, // hasNameBoard removed from landing page
                                                        nameBoardPrice,
                                                        pricingSettings.waitingHourRate || 1000,
                                                        pickup?.name || pickupSearch,
                                                        dropoff?.name || dropoffSearch,
                                                        destinations,
                                                        scheduledTime || currentTime,
                                                        scheduledDate || currentDate,
                                                        surgeRules,
                                                        roundTripPackageId,
                                                        normalTours,
                                                                    airportTours,
                                                        pricingSettings.destinationRoundTripPackages
                                                    );

                                                    // Calculate discount specifically for this vehicle's total
                                                    const vehicleDiscount = appliedOffers.reduce((max, offer) => {
                                                        const val = (offer.discountAmount || (priceInfo.total * (offer.discountPercentage / 100)));
                                                        return Math.max(max, val);
                                                    }, 0);

                                                    return {
                                                        ...v,
                                                        calculatedTotal: Math.max(0, priceInfo.total - vehicleDiscount),
                                                        originalTotal: priceInfo.total,
                                                        hasDiscount: vehicleDiscount > 0
                                                    };
                                                })}
                                                selectedId={vehicle}
                                                onSelect={(vType) => {
                                                    if (!scheduledDate || !scheduledTime) {
                                                        setStep1Errors(prev => ({ ...prev, dateTime: true }));
                                                        dateTimeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                        return;
                                                    }
                                                    setVehicle(vType);
                                                    setIsManualVehicle(true);
                                                    const syncTab = ['pickup', 'drop'].includes(activeTab) ? 'airport' : 'tour';
                                                    const event = new CustomEvent('syncCustomTourBooking', {
                                                        detail: {
                                                            tab: syncTab,
                                                            vehicleId: vType
                                                        }
                                                    });
                                                    window.dispatchEvent(event);
                                                }}
                                                passengerCount={passengerCount}
                                                pickupLocation={pickup}
                                                dropoffLocation={dropoff}
                                                isCondensed={false}
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setStep(1)} className="flex items-center justify-center gap-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-black text-xs uppercase tracking-widest px-5 py-4 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all" aria-label="Back to step 1">
                                                <ArrowRight size={14} strokeWidth={3} className="rotate-180"/> Back
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    if (!scheduledDate || !scheduledTime) {
                                                        setStep1Errors(prev => ({ ...prev, dateTime: true }));
                                                        dateTimeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                        return;
                                                    }
                                                    if (!passengerCount.adults || passengerCount.adults < 1 || passengerCount.luggage < 1 || passengerCount.handLuggage < 1) {
                                                        alert("Please enter all required passenger and luggage details to proceed (✓ minimum 1 adult, 1 luggage, 1 hand luggage)");
                                                        const passengerContainer = document.getElementById('booking-widget-passengers');
                                                        if (passengerContainer) passengerContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                        return;
                                                    }

                                                    setStep(3);
                                                }}
                                                disabled={isStep2Disabled}
                                                className={`flex-1 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest py-4 rounded-2xl transition-all lg:hidden ${isStep2Disabled ? 'bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-zinc-700' : 'active:scale-[0.98] bg-[#0a0a0a] hover:bg-black text-white dark:bg-[#FACC15] dark:text-black dark:hover:bg-yellow-400 shadow-lg hover:-translate-y-0.5'}`} 
                                                aria-label="Go to booking"
                                            >
                                                GO TO BOOKING <ArrowRight size={16} strokeWidth={3}/>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div key="step3" initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:16}} transition={{duration:0.2}} className="lg:hidden">
                                        <button onClick={() => setStep(2)} className="mb-4 flex items-center gap-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-black text-xs uppercase tracking-widest px-5 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all" aria-label="Back to step 2">
                                            <ArrowRight size={14} strokeWidth={3} className="rotate-180"/> Back to Details
                                        </button>
                                    </motion.div>
                                )}

                            </AnimatePresence>
                        </div>

                        {/* Section 2: Summary & Checkout */}
                        <div className={`bg-slate-50/50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm p-5 lg:p-6 flex flex-col justify-start lg:justify-between h-auto lg:h-full lg:min-h-0 gap-6 lg:gap-0 transition-colors ${step === 3 ? 'flex' : 'hidden lg:flex'}`}>
                            <div className="space-y-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-lg font-black text-emerald-950 dark:text-white tracking-wide uppercase">Trip Summary</h2>

                                    {/* Quick Currency Selector */}
                                    <div className="relative group">
                                        <button
                                            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 text-slate-600 dark:text-white border border-slate-200 dark:border-white/10 shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0"
                                            aria-label="Select currency"
                                        >
                                            <span>{currency}</span>
                                            <ChevronDown size={14} className="group-hover:rotate-180 transition-transform opacity-70" />
                                        </button>
                                        <div className="absolute top-[calc(100%+8px)] right-0 mt-2 w-32 bg-white dark:bg-zinc-800 rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-slate-200 dark:border-white/10 shadow-xl z-[120] overflow-hidden">
                                            {SUPPORTED_CURRENCIES.map(c => (
                                                <button
                                                    key={c.code}
                                                    onClick={() => changeCurrency(c.code)}
                                                    className={`w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-xs font-bold flex items-center gap-3 ${currency === c.code ? 'bg-slate-50 dark:bg-white/5 text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}
                                                >
                                                    <div className="w-4 h-4 rounded-full overflow-hidden border border-slate-200 dark:border-white/20">
                                                        <img src={c.flag} alt={c.code} className="w-full h-full object-cover scale-150" />
                                                    </div>
                                                    <span>{c.code}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Map Container - Refined styling */}
                                <div className="h-48 lg:flex-1 w-full rounded-2xl overflow-hidden relative isolate min-h-[200px] lg:min-h-[220px] border border-slate-200 dark:border-white/10 shadow-inner flex-shrink-0 lg:flex-shrink group transition-all duration-500">
                                    <TripMap pickup={pickup} dropoff={dropoff} waypoints={waypoints} onRouteCalculated={handleRouteCalculated} />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-900 dark:text-slate-100">Est. Distance</span>
                                        <span className="text-black dark:text-white">{distance ? `${distance.toFixed(1)} KM` : '--'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                                        <span className="text-slate-900 dark:text-slate-100">Select Vehicle</span>
                                        <div className="flex items-center gap-3 text-black dark:text-emerald-400">
                                            {activePricing[vehicle]?.image && (
                                                <div className="w-12 h-9 p-0.5 overflow-hidden shrink-0">
                                                    <img src={activePricing[vehicle].image} alt="" className="w-full h-full object-contain scale-[1.5]" />
                                                </div>
                                            )}
                                            <span>{activePricing[vehicle]?.name || 'Select Vehicle'}</span>
                                        </div>
                                    </div>

                                    {/* Coupon Section inside Summary Panel */}
                                    <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-3">
                                        <button 
                                            type="button"
                                            onClick={() => setIsCouponOpen(!isCouponOpen)} 
                                            className={`flex items-center gap-3 text-xs font-bold min-h-[3rem] transition-all px-4 py-2.5 rounded-xl w-full justify-center uppercase tracking-widest border shadow-sm hover:shadow-md ${isCouponOpen ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-900 dark:text-amber-400 border-amber-200 dark:border-amber-500/30' : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-50'}`}
                                        >
                                            <Tag size={14} className={`${isCouponOpen ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'} shrink-0`} fill="currentColor" />
                                            {isCouponOpen ? 'Close Offers' : 'Coupon Code?'}
                                        </button>
                                        
                                        {appliedOffers.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 animate-fade-in">
                                                {appliedOffers.map((offer, i) => (
                                                    <div key={i} className="flex items-center gap-2 bg-[#FACC15] dark:bg-yellow-500/20 text-black dark:text-yellow-400 px-3 py-1.5 rounded-lg border border-yellow-400 dark:border-yellow-500/30 shadow-sm">
                                                        <Tag size={12} className="text-black/70 dark:text-yellow-500" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{offer.name}</span>
                                                        <span className="text-[10px] font-bold opacity-80">(-{offer.discountPercentage > 0 ? `${offer.discountPercentage}%` : `Rs ${offer.discountAmount}`})</span>
                                                        <button 
                                                            type="button"
                                                            onClick={() => setAppliedOffers(prev => prev.filter(o => o.name !== offer.name))} 
                                                            className="ml-1 p-0.5 hover:bg-black/10 dark:hover:bg-yellow-500/30 rounded transition-colors"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {isCouponOpen && (
                                            <div className="relative h-11 animate-slide-up">
                                                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                                <input 
                                                    type="text" 
                                                    placeholder="ENTER COUPON" 
                                                    value={couponCode} 
                                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())} 
                                                    className="w-full h-full pl-10 pr-20 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none uppercase text-emerald-950 dark:text-white placeholder:text-slate-500 tracking-widest focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-inner" 
                                                    aria-label="Coupon code" 
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={async () => {
                                                        if (!couponCode) return;
                                                        const dest = (dropoff?.name || dropoffSearch || '').toLowerCase().trim();
                                                        const start = (pickup?.name || pickupSearch || '').toLowerCase().trim();
                                                        try {
                                                            const res = await fetch('/api/coupons/validate', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({ code: couponCode, pickup: start, dropoff: dest, tripType: activeTab })
                                                            });
                                                            const data = await res.json();
                                                            if (data.valid) {
                                                                const known = data.coupon;
                                                                const couponOffer = {
                                                                    _id: 'coupon-' + known.code,
                                                                    name: known.code,
                                                                    discountPercentage: known.discountType === 'percentage' ? known.value : 0,
                                                                    discountAmount: known.discountType === 'flat' ? known.value : 0,
                                                                    type: 'coupon',
                                                                    applicableFor: known.applicableFor,
                                                                    applicableLocations: known.applicableLocations
                                                                };
                                                                setAppliedOffers(prev => [...prev.filter(o => o.type !== 'coupon'), couponOffer]);
                                                                setCouponCode('');
                                                                setIsCouponOpen(false);
                                                            } else {
                                                                alert(data.message || "Invalid or expired coupon code.");
                                                            }
                                                        } catch (e) {
                                                            alert("Validation failed.");
                                                        }
                                                    }} 
                                                    aria-label="Apply Coupon" 
                                                    className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#FACC15] text-black px-4 rounded-lg text-[9px] font-black uppercase hover:bg-yellow-400 transition-all shadow-md shadow-yellow-500/10"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        )}

                                        {filteredCoupons.length > 0 && isCouponOpen && (
                                            <div className="space-y-3 animate-fade-in mt-3">
                                                <div className="flex items-center gap-2 px-1">
                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                                    <span className="text-[9px] font-black text-slate-400 dark:text-white/40 uppercase tracking-[0.2em]">Exclusive Offers</span>
                                                </div>
                                                <div className="flex overflow-x-auto pb-2 gap-3 hide-scrollbar snap-x touch-pan-x">
                                                    {filteredCoupons.map((c) => (
                                                        <button 
                                                            key={c._id} 
                                                            type="button"
                                                            onClick={() => { 
                                                                const isApplied = appliedOffers.some(o => o.name === c.code); 
                                                                if (isApplied) { 
                                                                    setAppliedOffers(prev => prev.filter(o => o.name !== c.code)); 
                                                                } else { 
                                                                    const couponOffer = {
                                                                        _id: 'coupon-' + c.code,
                                                                        name: c.code,
                                                                        discountPercentage: c.discountType === 'percentage' ? c.value : 0,
                                                                        discountAmount: c.discountType === 'flat' ? c.value : 0,
                                                                        type: 'coupon',
                                                                        applicableFor: c.applicableFor,
                                                                        applicableLocations: c.applicableLocations
                                                                    }; 
                                                                    setAppliedOffers(prev => [...prev.filter(o => o.type !== 'coupon'), couponOffer]); 
                                                                } 
                                                            }} 
                                                            className={`snap-start min-w-[220px] group relative flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all text-left flex-shrink-0 shadow-md hover:shadow-lg ${appliedOffers.some(o => o.name === c.code) ? 'border-[#FACC15] bg-[#FACC15]/5 dark:bg-[#FACC15]/10' : 'border-slate-100 dark:border-white/5 bg-white dark:bg-zinc-800'}`}
                                                        >
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-zinc-900 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-white/5">
                                                                    {c.imageUrl ? <img src={c.imageUrl} alt={c.code} className="w-full h-full object-cover" /> : <Tag size={16} className="text-[#FACC15]" />}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-base font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                                                                            {c.value}{c.discountType === 'percentage' ? '%' : ''}
                                                                            <span className="text-[#FACC15] ml-1">OFF</span>
                                                                        </span>
                                                                        <div className="flex items-center gap-1.5 mt-1">
                                                                            <div className="px-2 py-0.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/10 flex items-center gap-1.5 shadow-sm">
                                                                                <span className="text-[8px] font-black text-amber-800 dark:text-[#FACC15] uppercase tracking-widest">{c.code}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {appliedOffers.some(o => o.name === c.code) ? (
                                                                <div className="flex-shrink-0 w-6 h-6 bg-[#FACC15] rounded-full flex items-center justify-center text-black shadow animate-scale-in">
                                                                    <Check size={12} strokeWidth={4} />
                                                                </div>
                                                            ) : (
                                                                <div className="flex-shrink-0 w-6 h-6 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-300 group-hover:bg-[#FACC15] group-hover:text-black group-hover:border-[#FACC15] transition-all">
                                                                    <Plus size={12} strokeWidth={3} />
                                                                </div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Detailed Price Breakdown */}
                                    <div className="pt-6 border-t border-slate-200 dark:border-white/10 space-y-4">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.15em]">
                                            <span className="text-slate-900 dark:text-slate-100">Trip Subtotal</span>
                                            <span className="text-black dark:text-white font-black">{convertPrice(total - surgeAmount).symbol} {convertPrice(total - surgeAmount).value.toLocaleString()}</span>
                                        </div>

                                        {surgeAmount > 0 && (
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.15em] text-indigo-600 dark:text-indigo-400">
                                                <span>Peak Traffic Surge</span>
                                                <span className="font-black">+{convertPrice(surgeAmount).symbol} {convertPrice(surgeAmount).value.toLocaleString()}</span>
                                            </div>
                                        )}

                                        {discountAmount > 0 && (
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-600/20">
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

                            <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex-shrink-0">
                                <div className="flex justify-between items-end mb-6">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-[0.2em]">Total Payable</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl lg:text-4xl font-black text-black dark:text-white tracking-tighter">
                                                {distance && finalTotal > 0 ? (
                                                    <>
                                                        <span className="text-lg align-top mr-1">{convertPrice(finalTotal).symbol}</span>
                                                        {convertPrice(finalTotal).value.toLocaleString()}
                                                    </>
                                                ) : (pickup?.lat && dropoff?.lat && !distance) ? (
                                                    <div className="flex items-center gap-2">
                                                        <Loader2 size={24} className="animate-spin text-emerald-500" />
                                                        <span className="text-slate-300 dark:text-slate-700 text-xl font-bold animate-pulse">Calculating...</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-300 dark:text-slate-700">Rates</span>
                                                )}
                                            </span>
                                        </div>
                                        {/* Multi-Currency Price Summary Block */}
                                        {distance && finalTotal > 0 && (
                                            <div className="mt-4 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
                                                <div className="grid grid-cols-2 bg-slate-50/50 dark:bg-white/5 p-3 gap-2">
                                                    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/5 shadow-sm">
                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">USD Estimate</span>
                                                        <span className="text-sm font-black text-black dark:text-white">
                                                            $ {(() => {
                                                                const rate = (rates && rates['USD']) || 0.0032;
                                                                return (finalTotal * rate).toFixed(2);
                                                            })()}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/5 shadow-sm">
                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">EUR Estimate</span>
                                                        <span className="text-sm font-black text-black dark:text-white">
                                                            € {(() => {
                                                                const rate = (rates && rates['EUR']) || 0.003;
                                                                return (finalTotal * rate).toFixed(2);
                                                            })()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl flex items-start gap-3">
                                    <div className="w-6 h-6 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                                        <Info size={14} strokeWidth={2.5} />
                                    </div>
                                    <p className="text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest leading-relaxed">
                                        Note: Highway tickets are not included and must be paid by the customer.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <button
                                        onClick={handleBook}
                                        disabled={isCheckoutDisabled}
                                        className={`w-full min-h-16 sm:h-[72px] py-2 sm:py-0 rounded-2xl shadow-md transition-all group flex items-center justify-center border
                                        ${isCheckoutDisabled
                                            ? 'bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-zinc-700 cursor-not-allowed'
                                            : 'bg-[#FACC15] hover:bg-yellow-500 text-black active:scale-[0.98] border-yellow-500/20'}`}
                                    >
                                        {isLoadingPricing ? (
                                            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <div className="flex items-center justify-between w-full px-4 sm:px-6 gap-2">
                                                <div className="flex-1 text-center text-base sm:text-lg font-black tracking-widest uppercase">
                                                    BOOK TRIP NOW
                                                </div>
                                                <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform ${isCheckoutDisabled ? 'bg-black/5 text-black/40' : 'bg-black/10 text-black'}`}>
                                                    <ArrowRight size={18} className="sm:size-6" strokeWidth={2.5} />
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
                vehicles={Object.values(activePricing).map(v => {
                    const priceInfo = calculatePrice(
                        distance,
                        v.vehicleType,
                        tripType,
                        activePricing,
                        totalWaitingHours,
                        false, // hasNameBoard removed from landing page
                        nameBoardPrice,
                        pricingSettings.waitingHourRate || 1000,
                        pickup.name,
                        dropoff.name,
                        destinations,
                        scheduledTime || currentTime,
                        scheduledDate || currentDate,
                        surgeRules,
                        roundTripPackageId,
                        normalTours,
                                                                    airportTours,
                        pricingSettings.destinationRoundTripPackages
                    );
                    return {
                        ...v,
                        calculatedTotal: priceInfo.total
                    };
                })}
                selectedId={vehicle}
                onSelect={(vType) => {
                    if (!scheduledDate || !scheduledTime) {
                        setStep1Errors(prev => ({ ...prev, dateTime: true }));
                        setIsVehicleDrawerOpen(false);
                        setTimeout(() => dateTimeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                        return;
                    }
                    setVehicle(vType);
                    setIsManualVehicle(true);
                    const syncTab = ['pickup', 'drop'].includes(activeTab) ? 'airport' : 'tour';
                    const event = new CustomEvent('syncCustomTourBooking', {
                        detail: {
                            tab: syncTab,
                            vehicleId: vType
                        }
                    });
                    window.dispatchEvent(event);
                }}
                passengerCount={passengerCount}
                isLoading={isLoadingPricing}
            />
        </div>
    );
}

export default function BookingWidget(props) {
    return (
        <React.Suspense fallback={<div className="h-96 w-full animate-pulse bg-slate-100 dark:bg-zinc-900 rounded-3xl" />}>
            <BookingWidgetContent {...props} />
        </React.Suspense>
    );
}
