'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { X, MapPin, User, Users, CreditCard, Calendar, Clock, Phone, Mail, ChevronRight, ChevronLeft, Check, Loader2, Car, Navigation, ShieldCheck, Zap, Signpost, Tag, Briefcase, ShoppingBag, Info, AlertCircle, Plus, Minus, MessageSquare, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import { useCurrency } from '../context/CurrencyContext';
import { calculateBasePrice, calculateSurcharges, calculatePaymentFees } from '../lib/pricing-util';
import LocationInput from './LocationInput';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import VehicleCarousel from './VehicleCarousel';
const STEPS = [
    { id: 1, title: 'Route & Vehicle', icon: MapPin },
    { id: 2, title: 'Passenger Details', icon: User },
    { id: 3, title: 'Confirm & Pay', icon: CreditCard },
];

// Strip 'KDH' from vehicle display names (DB IDs/records remain untouched)
const displayVehicleName = (name) => (name || '').replace(/\bKDH\s*/gi, '').trim();


export default function BookingModal({ isOpen, onClose, initialData = {}, pricingCategory = 'airport-transfer' }) {
    const { data: session } = useSession();
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});
    const isAirportService = pricingCategory === 'airport-transfer';
    const [loading, setLoading] = useState(false);
    const [hasAgreed, setHasAgreed] = useState(false);
    const [pricing, setPricing] = useState([]);
    const [distance, setDistance] = useState(0);
    const [verifiedCoupons, setVerifiedCoupons] = useState(initialData.verifiedCoupons || (initialData.verifiedCoupon ? [initialData.verifiedCoupon] : []));
    const [couponInput, setCouponInput] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [pricingSettings, setPricingSettings] = useState({ longDistanceThreshold: 175, longDistanceDiscountPercentage: 10, isActive: true });
    const [destinations, setDestinations] = useState([]);
    const [isVehicleExpanded, setIsVehicleExpanded] = useState(true);

    useEffect(() => {
        document.body.classList.add('booking-active');
        const fetchSettings = async () => {
            try {
                console.log("BookingModal: Fetching pricing settings...");
                const res = await fetch('/api/admin/pricing-settings', { cache: 'no-store' });
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                if (data.success && data.data) {
                    console.log("BookingModal: Pricing settings fetched successfully", data.data);
                    setPricingSettings(data.data);
                }
            } catch (err) {
                console.error("BookingModal: Failed to fetch settings", err);
            }
        };
        const fetchDestinations = async () => {
            try {
                console.log("BookingModal: Fetching destinations...");
                const res = await fetch('/api/admin/destinations', { cache: 'no-store' });
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                if (data.success) {
                    console.log("BookingModal: Destinations fetched successfully", data.data.length);
                    setDestinations(data.data);
                }
            } catch (err) {
                console.error("BookingModal: Failed to fetch destinations", err);
            }
        };
        fetchSettings();
        fetchDestinations();
        return () => document.body.classList.remove('booking-active');
    }, []);

    // Body Scroll Lock & Hide Chat
    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            const originalTouchAction = document.body.style.touchAction;
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';

            // Hide Live Chat
            const chatTrigger = document.querySelector('.live-chat-trigger');
            if (chatTrigger) chatTrigger.style.display = 'none';

            return () => {
                document.body.style.overflow = originalOverflow;
                document.body.style.touchAction = originalTouchAction;
                // Show Live Chat
                const chatTriggerBack = document.querySelector('.live-chat-trigger');
                if (chatTriggerBack) chatTriggerBack.style.display = 'flex';
            };
        }
    }, [isOpen]);

    // Form State - declared early so functions below can access it
    const [formData, setFormData] = useState({
        vehicle: initialData.vehicle || 'mini-car',
        pickup: initialData.pickup || '',
        pickupCoords: initialData.pickupCoords || null,
        waypoints: initialData.waypoints || [],
        dropoff: initialData.dropoff || '',
        dropoffCoords: initialData.dropoffCoords || null,
        tripType: initialData.tripType || 'one-way',
        passengerCount: initialData.passengerCount || { adults: 1, children: 0, luggage: 0, handLuggage: 0 },
        // waitingHours removed
        hasNameBoard: (initialData.hasNameBoard === true || initialData.hasNameBoard === false) ? initialData.hasNameBoard : null,
        nameBoardText: initialData.nameBoardText || '',
        couponCode: initialData.couponCode || '',
        date: initialData.date || '',
        time: initialData.time || '',
        name: initialData.name || '',
        phone: initialData.phone || '',
        whatsapp: initialData.whatsapp || '',
        email: initialData.email || '',
        flightNumber: initialData.flightNumber || '',
        flightArrivalDate: initialData.flightArrivalDate || '',
        flightArrivalTime: initialData.flightArrivalTime || '',
        arrivalDate: initialData.arrivalDate || '', // Added to prevent crash
        notes: initialData.notes || '',
        duration: initialData.duration || '',
        paymentMethod: 'cash',
        paymentType: 'full', // 'full' or 'partial'
        billingName: '',
        billingAddress: '',
        billingCity: '',
        billingCountry: '',
    });


    const handleApplyCoupon = async (codeToApply = couponInput, contextPickup = formData.pickup, contextDropoff = formData.dropoff) => {
        const input = (codeToApply || '').trim();
        if (!input) return;

        // Initial valid check - we rely on API now for specific route validation
        if (!contextPickup) {
            return false;
        }

        setCouponLoading(true);
        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: input,
                    pickup: contextPickup,
                    dropoff: contextDropoff
                })
            });
            const data = await res.json();
            if (data.valid) {
                setVerifiedCoupons(prev => {
                    if (prev.some(c => c.code.toUpperCase() === data.coupon.code.toUpperCase())) return prev;
                    return [...prev, data.coupon];
                });
                setFormData(prev => ({ ...prev, couponCode: data.coupon.code }));
                if (!codeToApply) setCouponInput(''); // Only clear if it was from manual input
                return true;
            } else {
                if (!codeToApply) alert(data.message); // Only alert if manually applied
                setFormData(prev => ({ ...prev, couponCode: '' }));
                return false;
            }
        } catch (e) {
            console.error(e);
            if (!codeToApply) alert('Validation failed');
            return false;
        } finally {
            setCouponLoading(false);
        }
    };

    const { currency, rates, changeCurrency } = useCurrency(); // Import Currency Context

    // Currency conversion helper
    const SUPPORTED_CURRENCIES = [
        { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee', flag: 'https://flagcdn.com/w40/lk.png' },
        { code: 'USD', symbol: '$', name: 'US Dollar', flag: 'https://flagcdn.com/w40/us.png' },
        { code: 'EUR', symbol: '€', name: 'Euro', flag: 'https://flagcdn.com/w40/eu.png' },
        { code: 'GBP', symbol: '£', name: 'British Pound', flag: 'https://flagcdn.com/w40/gb.png' },
        { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: 'https://flagcdn.com/w40/in.png' },
    ];

    const convertToAllCurrencies = (amountLKR) => {
        return SUPPORTED_CURRENCIES.map(c => {
            const rate = rates?.[c.code] || 1;
            const convertedRaw = amountLKR * rate;
            // Round LKR to whole, others to 2 decimal places
            const value = c.code === 'LKR' ? Math.round(amountLKR) : Number(convertedRaw.toFixed(2));
            return { ...c, value };
        });
    };

    const getPriceBreakdown = () => {
        try {
            const vehicleData = pricing.find(p => p.vehicleType === formData.vehicle);

            // CRITICAL: Ensure we have a valid distance and vehicle data
            const distKm = Number(distance || initialData.distance || 0);

            const isAirportPickup = (formData.pickup?.toLowerCase().includes('airport') || formData.dropoff?.toLowerCase().includes('airport')) || (typeof initialData.pickup === 'string' && initialData.pickup.toLowerCase().includes('airport'));

            if (!vehicleData || distKm === 0) {
                return { total: 0, subtotal: 0, surcharges: 0, payNow: 0, balance: 0, lkr: { total: 0, payNow: 0, balance: 0, surcharges: 0, subtotal: 0 }, originalLKR: 0 };
            }

            const baseTotal = calculateBasePrice(distKm, vehicleData, formData.tripType, formData.pickup, formData.dropoff, destinations);
            const surcharges = calculateSurcharges({
                hasNameBoard: formData.hasNameBoard,
                nameBoardPrice: pricingSettings?.nameBoardPrice
            }, vehicleData);

            // Payment Method Surcharges per User Request
            // 1. Calculate for the current display currency (for UI)
            const paymentSurcharge = calculatePaymentFees(baseTotal + surcharges, formData.paymentMethod, currency, formData.vehicle);

            // 2. Calculate for LKR (for backend storage/consistency)
            const paymentSurchargeLKR = calculatePaymentFees(baseTotal + surcharges, formData.paymentMethod, 'LKR', formData.vehicle);

            let total = baseTotal + surcharges + paymentSurcharge; // Total in current currency context (mixed if rates missing, resolved below)

            let couponDiscountAmount = 0;
            if (verifiedCoupons && verifiedCoupons.length > 0) {
                verifiedCoupons.forEach(coupon => {
                    const couponVal = Number(coupon.value) || 0;
                    if (coupon.discountType === 'percentage') {
                        couponDiscountAmount += total * (couponVal / 100);
                    } else {
                        couponDiscountAmount += couponVal;
                    }
                });
            }

            // 2. Calculate Long Distance Discount (Dynamic from Settings) - ONLY FOR AIRPORT PICKUPS
            let longDistanceDiscountAmount = 0;
            if (pricingSettings?.isActive && distKm > (pricingSettings?.longDistanceThreshold || 175) && isAirportPickup) {
                longDistanceDiscountAmount = total * ((pricingSettings?.longDistanceDiscountPercentage || 10) / 100);
            }

            // 3. Apply MAX Rule (User gets the higher discount, no stacking) - Consistent with Widget
            const finalDiscount = Math.max(couponDiscountAmount, longDistanceDiscountAmount);
            total = Math.max(0, total - finalDiscount);

            const payNow = formData.paymentType === 'partial' ? total * 0.5 : total;
            const balance = total - payNow;

            // Convert values TO the selected currency individually to ensure they SUM correctly in the UI
            const rate = rates?.[currency] || 1;
            const roundFn = formData.vehicle === 'sampath-test' ? Math.round : Math.ceil;

            const convertedSubtotal = roundFn(baseTotal * rate);
            const convertedSurcharges = roundFn(surcharges * rate);
            const convertedPaymentFee = roundFn(paymentSurcharge * rate);
            const convertedDiscounts = roundFn(finalDiscount * rate);

            // The Total displayed MUST be the sum of its parts to avoid "Rs 0" or mismatch errors
            const convertedTotal = convertedSubtotal + convertedSurcharges + convertedPaymentFee - convertedDiscounts;

            const payNowRatio = formData.paymentType === 'partial' ? 0.5 : 1;
            const convertedPayNow = roundFn(convertedTotal * payNowRatio);
            const convertedBalance = convertedTotal - convertedPayNow;

            // Detailed Surcharges for UI
            const detailedExtras = [
                { label: 'Name Board', value: roundFn(calculateSurcharges({ hasNameBoard: formData.hasNameBoard, nameBoardPrice: pricingSettings.nameBoardPrice }, vehicleData) * rate) }
            ];

            return {
                total: convertedTotal,
                subtotal: convertedSubtotal,
                surcharges: convertedSurcharges + convertedPaymentFee,
                paymentFee: convertedPaymentFee,
                detailedExtras,
                discounts: convertedDiscounts,
                appliedCoupons: verifiedCoupons,
                payNow: convertedPayNow,
                balance: convertedBalance,
                lkr: {
                    total: Math.round(baseTotal + surcharges + paymentSurchargeLKR - finalDiscount),
                    payNow: Math.round((formData.paymentType === 'partial' ? (baseTotal + surcharges + paymentSurchargeLKR - finalDiscount) * 0.5 : (baseTotal + surcharges + paymentSurchargeLKR - finalDiscount))),
                    balance: Math.round((baseTotal + surcharges + paymentSurchargeLKR - finalDiscount) - (formData.paymentType === 'partial' ? (baseTotal + surcharges + paymentSurchargeLKR - finalDiscount) * 0.5 : (baseTotal + surcharges + paymentSurchargeLKR - finalDiscount))),
                    surcharges: Math.round(surcharges),
                    paymentFee: Math.round(paymentSurchargeLKR),
                    subtotal: Math.round(baseTotal),
                    discounts: Math.round(finalDiscount)
                },
                originalLKR: Math.round(baseTotal + surcharges + paymentSurchargeLKR - finalDiscount)
            };
        } catch (err) {
            console.error("Price logic error:", err);
            return { total: 0, subtotal: 0, surcharges: 0, payNow: 0, balance: 0, lkr: { total: 0, payNow: 0, balance: 0, surcharges: 0, subtotal: 0 }, originalLKR: 0 };
        }
    };

    // Price Calculation Helper for Vehicle List
    const calculatePrice = (v) => {
        const distKm = Number(distance || initialData.distance || 0);
        const baseTotal = calculateBasePrice(distKm, v, formData.tripType, formData.pickup, formData.dropoff, destinations);
        const surcharges = calculateSurcharges({
            hasNameBoard: formData.hasNameBoard,
            nameBoardPrice: pricingSettings?.nameBoardPrice
        }, v);
        return baseTotal + surcharges;
    };

    // Extract calculated values for render

    // Memoize the price breakdown to ensure reactivity and performance
    const { total: totalPrice, subtotal, surcharges, payNow, balance: balanceAmount, ...detailedBreakdown } = useMemo(() => {
        return getPriceBreakdown();
    }, [formData, pricing, verifiedCoupons, currency, rates, pricingSettings, distance]);

    const selectedVehicle = pricing.find(p => p.vehicleType === formData.vehicle);
    const totalPassengers = (formData.passengerCount.adults || 0) + (formData.passengerCount.children || 0);
    const isOverCapacity = selectedVehicle && totalPassengers > (selectedVehicle.capacity || 4);

    // 1. Initialize State from initialData when modal opens or initialData changes
    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({ 
                ...prev, 
                ...initialData,
                // Ensure initial data maps correctly to form fields
                pickup: initialData.pickup || prev.pickup,
                dropoff: initialData.drop || initialData.dropoff || prev.dropoff,
                vehicle: initialData.vehicle || prev.vehicle,
                // Ensure specific nested objects are merged correctly
                passengerCount: { ...prev.passengerCount, ...(initialData.passengerCount || {}) },
                waypoints: initialData.waypoints || prev.waypoints
            }));
            
            // If vehicle is pre-selected, collapse the list by default for a focused view
            if (initialData.vehicle) {
                setIsVehicleExpanded(false);
            } else {
                setIsVehicleExpanded(true);
            }
            
            setStep(1);

            if (initialData.distance) {
                const d = Number(initialData.distance);
                console.log("Setting distance from initialData:", d);
                setDistance(d);
            }
            if (initialData.verifiedCoupons) {
                setVerifiedCoupons(initialData.verifiedCoupons);
            }
            if (initialData.couponCode) {
                setCouponInput(initialData.couponCode);
                // Automatically validate the coupon if it's passed in
                handleApplyCoupon(initialData.couponCode, initialData.pickup || formData.pickup, initialData.dropoff || formData.dropoff);
            }
        }
    }, [isOpen, initialData]);


    const [pricingData, setPricingData] = useState([]);

    // 2. Auto-Select Optimal Vehicle when capacity changes (Inside Modal)
    useEffect(() => {
        if (!pricingData.length) return;

        const totalPax = (formData.passengerCount?.adults || 0) + (formData.passengerCount?.children || 0);
        const totalLuggage = formData.passengerCount?.luggage || 0;

        // Find best fit (Cheapest that fits)
        const sortedVehicles = [...pricingData].sort((a, b) => (a.basePrice || 0) - (b.basePrice || 0));
        const bestFit = sortedVehicles.find(v =>
            totalPax <= v.capacity && totalLuggage <= (v.luggage || 0)
        );

        if (bestFit && bestFit.vehicleType !== formData.vehicle) {
            setFormData(prev => ({ ...prev, vehicle: bestFit.vehicleType }));
        }
    }, [formData.passengerCount, pricingData]);

    // useEffects for data fetching
    useEffect(() => {
        if (isOpen) {
            // Fetch pricing based on category
            fetch(`/api/pricing?category=${pricingCategory}`, { cache: 'no-store' })
                .then(res => res.json())
                .then(response => {
                    if (response.success && Array.isArray(response.data)) {
                        setPricingData(response.data);
                        setPricing(response.data);
                    } else {
                        setPricingData([]);
                        setPricing([]);
                    }
                })
                .catch(err => console.error("Error fetching pricing:", err));
        }

    }, [isOpen, pricingCategory]);

    const modalContentRef = useRef(null);
    // Scroll to top on step change
    useEffect(() => {
        console.log("BookingModal: Step changed to:", step);
        if (modalContentRef.current) {
            modalContentRef.current.scrollTo({ top: 0, behavior: 'instant' });
        }
    }, [step]);

    useEffect(() => {
        // If we already have a valid distance passed from parent (Google Maps), DO NOT overwrite it with OSRM (less accurate)
        // Only fetch if distance is missing
        if (initialData.distance && initialData.distance > 0) return;

        if (
            formData.pickupCoords?.lat && formData.pickupCoords?.lon &&
            formData.dropoffCoords?.lat && formData.dropoffCoords?.lon
        ) {
            const coords = [
                `${formData.pickupCoords.lon},${formData.pickupCoords.lat}`,
                ...formData.waypoints.map(wp => `${wp.lon},${wp.lat}`),
                `${formData.dropoffCoords.lon},${formData.dropoffCoords.lat}`
            ].join(';');
            fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=false`)
                .then(res => res.json())
                .then(data => {
                    if (data.routes?.[0]) {
                        setDistance(data.routes[0].distance / 1000);
                        // Calculate duration
                        const seconds = data.routes[0].duration;
                        const hours = Math.floor(seconds / 3600);
                        const minutes = Math.floor((seconds % 3600) / 60);
                        const durationStr = hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;
                        setFormData(prev => ({ ...prev, duration: durationStr }));
                    }
                })
                .catch(err => console.error("OSRM Error:", err));
        }
    }, [formData.pickupCoords, formData.dropoffCoords, formData.waypoints]);



    // Removed duplicate declaration

    const validateForm = (targetStep) => {
        const newErrors = {};
        
        // Step 1 Validation
        if (targetStep >= 1) {
            if (!formData.pickup) newErrors.pickup = true;
            if (!formData.dropoff) newErrors.dropoff = true;
            if (formData.hasNameBoard === null) newErrors.hasNameBoard = true;
            if (isAirportService) {
                if (!formData.flightArrivalDate) newErrors.date = true;
                if (!formData.flightArrivalTime) newErrors.time = true;
            }
        }

        // Step 2 Validation (Passenger Details)
        if (targetStep >= 2) {
            if (!formData.name) newErrors.name = true;
            if (!formData.phone) newErrors.phone = true;
            if (!formData.email) newErrors.email = true;
            // Removed flightNumber requirement to make it optional as requested
            if (formData.hasNameBoard && !formData.nameBoardText) newErrors.nameBoardText = true;
        }

        console.log(`BookingModal: Validating Step ${targetStep}, Errors:`, newErrors);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const scrollToFirstError = (newErrors = errors) => {
        const firstErrorKey = Object.keys(newErrors)[0];
        if (!firstErrorKey) return;

        // If error is on a different step, switch first
        const step1Keys = ['pickup', 'dropoff', 'hasNameBoard', 'date', 'time'];
        const errorIsInStep1 = step1Keys.includes(firstErrorKey);

        if (errorIsInStep1 && step !== 1) {
            setStep(1);
            // Wait for step change to render before scrolling
            setTimeout(() => {
                const el = document.getElementById(`field-${firstErrorKey}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            return;
        }

        const el = document.getElementById(`field-${firstErrorKey}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const handleSubmit = async () => {
        if (!validateForm(2)) {
            scrollToFirstError();
            return;
        }
        console.log("Submitting Booking... Step 1");
        setLoading(true);
        try {
            // Sanitize customer ID (prevent Google ID string from causing CastError)
            const customerId = session?.user?.id;
            const isValidObjectId = (id) => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);

            // Verify breakdown before sending
            console.log("Getting Price Breakdown...");
            const breakdown = getPriceBreakdown();
            const { lkr } = breakdown;
            console.log("Price Breakdown (LKR):", lkr);

            if (lkr.total === 0) {
                alert("Error: Total price is 0. Please re-select vehicle.");
                setLoading(false);
                return;
            }

            // Map form data to Booking model schema
            const bookingData = {
                customer: isValidObjectId(customerId) ? customerId : null,
                pickupLocation: {
                    address: formData.pickup,
                    lat: formData.pickupCoords?.lat || null,
                    lng: formData.pickupCoords?.lng || null
                },
                dropoffLocation: {
                    address: formData.dropoff,
                    lat: formData.dropoffCoords?.lat || null,
                    lng: formData.dropoffCoords?.lng || null
                },
                waypoints: formData.waypoints.map(wp => ({
                    address: wp.name,
                    lat: wp.lat,
                    lng: wp.lng
                })),
                vehicleType: formData.vehicle,
                tripType: formData.tripType,
                passengerCount: formData.passengerCount,
                distanceKm: distance,
                duration: formData.duration,
                waitingHours: formData.waitingHours,

                // Detailed Payment Breakdown (Always send LKR to API, backend will convert)
                totalPrice: lkr.total,
                paidAmount: lkr.payNow,
                balanceAmount: lkr.balance,
                surchargeAmount: lkr.surcharges,

                // Converted values for display/admin
                displayPrice: breakdown.total,
                displayPaidAmount: breakdown.payNow,
                displayBalanceAmount: breakdown.balance,

                paymentType: formData.paymentType || 'full',
                currency: currency || 'LKR',

                scheduledDate: formData.date,
                scheduledTime: formData.time,
                customerName: formData.name,
                customerEmail: formData.email,
                guestPhone: formData.phone,
                // Add WhatsApp if present, or fallback to phone, or store in notes
                whatsappNumber: formData.whatsapp,
                nameBoard: {
                    enabled: formData.hasNameBoard,
                    text: formData.nameBoardText
                },
                couponCode: formData.couponCode,
                appliedCoupons: verifiedCoupons.map(c => c.code),
                paymentMethod: formData.paymentMethod,
                flightNumber: formData.flightNumber,
                flightArrivalDate: formData.flightArrivalDate,
                flightArrivalTime: formData.flightArrivalTime,
                notes: formData.notes,
                billingDetails: {
                    billingName: formData.billingName,
                    billingAddress: formData.billingAddress,
                    city: formData.billingCity,
                    country: formData.billingCountry
                }
            };

            console.log("Sending booking data:", bookingData);

            const res = await fetch('/api/payment/initiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData),
            });

            console.log("Response status:", res.status);
            const data = await res.json();
            console.log("Response data:", data);

            if (data.success) {
                // Save guest booking to local storage if not logged in
                if (!session && data.bookingId) {
                    try {
                        const existing = JSON.parse(localStorage.getItem('guest_bookings') || '[]');
                        if (!existing.includes(data.bookingId)) {
                            existing.push(data.bookingId);
                            localStorage.setItem('guest_bookings', JSON.stringify(existing));
                        }
                    } catch (e) { console.error("Error saving guest booking:", e); }
                }

                window.location.href = formData.paymentMethod === 'card' ? data.paymentUrl : `/payment/success?bookingId=${data.bookingId}`;
            } else {
                alert('Booking failed: ' + (data.message || data.error || 'Server error'));
            }
        } catch (error) {
            console.error("Submit Error:", error);
            alert('An error occurred during booking: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const currentSymbol = SUPPORTED_CURRENCIES.find(c => c.code === currency)?.symbol || 'Rs';


    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 p-0 sm:p-4 overflow-hidden touch-none overscroll-none backdrop-blur-xl transition-all duration-500">
            {/* Prevent Body Scroll Shadow Overlay */}
            <div className="absolute inset-0" onClick={onClose}></div>

            <style jsx global>{`
                body {
                    overflow: hidden !important;
                    touch-action: none;
                    -webkit-overflow-scrolling: none;
                }
            `}</style>

            {/* Modal Container */}
            <div id="modal-container" className="bg-white dark:bg-zinc-950 w-full h-full sm:h-auto sm:max-h-[95vh] rounded-none sm:rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.4)] sm:max-w-4xl overflow-x-hidden overflow-y-hidden flex flex-col animate-slide-up relative transition-all duration-500 border border-slate-100 dark:border-white/5">
                {/* Header - Hidden in Step 2 */}
                {step !== 2 && (
                    <div className="p-6 sm:p-10 pb-4 flex items-center justify-between shrink-0 pt-8 sm:pt-10 bg-white dark:bg-zinc-950 transition-colors duration-500">
                        <div className="flex items-center gap-5 min-w-0">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/20">
                                <Zap size={24} className="text-white sm:w-8 sm:h-8" strokeWidth={3} fill="currentColor" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-emerald-950 dark:text-white leading-none truncate uppercase">
                                    SECURE <span className="text-emerald-600">BOOKING</span>
                                </h2>
                                <p className="text-[9px] sm:text-[10px] md:text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.3em] mt-2">Elite Tier Encryption</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-white/10 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all z-[101] group">
                            <X size={20} className="sm:w-7 sm:h-7 text-slate-400 group-hover:text-emerald-600 group-hover:rotate-90 transition-transform" />
                        </button>
                    </div>
                )}

                {/* Progress Indicators */}
                <div className="px-4 sm:px-12 py-4 md:py-6 flex gap-2 md:gap-6 shrink-0">
                    {STEPS.map((s) => (
                        <div key={s.id} className="flex-1 flex flex-col gap-2">
                            <div className={`h-1.5 md:h-2 rounded-full transition-all duration-1000 ${step >= s.id ? 'bg-emerald-600 shadow-sm shadow-emerald-600/30' : 'bg-slate-100 dark:bg-white/5'}`}></div>
                            <span className={`text-[7px] md:text-[10px] font-black uppercase tracking-normal md:tracking-widest text-center leading-tight ${step >= s.id ? 'text-emerald-950 dark:text-emerald-400' : 'text-slate-500'}`}>{s.title}</span>
                        </div>
                    ))}
                </div>

                {/* Main Viewport */}
                <div ref={modalContentRef} className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-8 md:px-12 py-8 sm:py-10 md:py-12 custom-scrollbar overscroll-contain relative z-10">
                    {step === 1 && (
                        <div className="space-y-8 md:space-y-10 animate-slide-up">
                            {/* Trip Header */}
                            <div className="flex flex-wrap bg-slate-50 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-100 dark:border-white/10 w-full md:w-fit gap-1 shadow-inner">
                                {['one-way', 'round-trip'].map(t => (
                                    <button 
                                        key={t} 
                                        onClick={() => setFormData({ ...formData, tripType: t })} 
                                        className={`flex-1 md:flex-none px-4 md:px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-wider md:tracking-widest transition-all whitespace-nowrap ${formData.tripType === t ? 'bg-white dark:bg-zinc-800 text-emerald-600 shadow-md border border-slate-100 dark:border-white/5' : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'}`}
                                    >
                                        {t.replace('-', ' ')}
                                    </button>
                                ))}
                            </div>

                            {/* Location Inputs - Premium Luxury Card */}
                            <div className="bg-white dark:bg-zinc-900/50 p-6 sm:p-10 space-y-8 border border-slate-100 dark:border-white/10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                <div className="space-y-8 relative">
                                    {/* Flow Connection Line - Premium Curved Animated Style */}
                                    <div className="absolute left-[20px] top-12 bottom-12 w-5 z-0 pointer-events-none overflow-visible hidden sm:block">
                                        <svg 
                                            className="w-full h-full"
                                            viewBox="0 0 20 100"
                                            preserveAspectRatio="none"
                                        >
                                            <motion.path
                                                d="M 10 0 Q 0 50 10 100"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeDasharray="4 6"
                                                strokeLinecap="round"
                                                className="text-emerald-500/30 dark:text-[#FACC15]/20"
                                                initial={{ pathLength: 0, opacity: 0 }}
                                                animate={{ pathLength: 1, opacity: 1 }}
                                                transition={{ 
                                                    duration: 2, 
                                                    ease: "easeInOut",
                                                    repeat: Infinity,
                                                    repeatType: "reverse",
                                                    repeatDelay: 1
                                                }}
                                            />
                                            <motion.path
                                                d="M 10 0 Q 0 50 10 100"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeDasharray="4 6"
                                                strokeLinecap="round"
                                                className="text-emerald-500 dark:text-[#FACC15]"
                                                initial={{ pathLength: 0, pathOffset: 1 }}
                                                animate={{ pathOffset: 0, pathLength: 0.2 }}
                                                transition={{ 
                                                    duration: 3, 
                                                    ease: "linear",
                                                    repeat: Infinity,
                                                }}
                                            />
                                        </svg>
                                    </div>
                                    <div id="field-pickup" className={`relative group transition-all ${errors.pickup ? 'ring-2 ring-red-500 rounded-2xl animate-shake' : ''}`}>
                                            <LocationInput
                                                label="Initial Pickup Point"
                                                icon={MapPin}
                                                placeholder="Where should we pick you up?"
                                                value={formData.pickup}
                                                onSelect={(loc) => {
                                                    setFormData(prev => ({ ...prev, pickup: loc.address, pickupCoords: loc.lat ? { lat: loc.lat, lon: loc.lon } : null }));
                                                    if (errors.pickup) setErrors(prev => ({ ...prev, pickup: false }));
                                                }}
                                            />
                                        </div>
                                    {/* Waypoints */}
                                    {formData.waypoints.map((wp, i) => (
                                        <div key={i} className="relative group animate-slide-in pl-10">
                                            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-emerald-600 z-10 p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-white/5">
                                                <Navigation size={18} strokeWidth={3} />
                                            </div>
                                            <div className="w-full pl-12 pr-6 py-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 text-xs font-black text-emerald-950 dark:text-white flex items-center justify-between group-hover:bg-white dark:group-hover:bg-zinc-800 transition-all uppercase tracking-widest shadow-sm">
                                                <span className="truncate">{wp.address || wp.name}</span>
                                                <button
                                                    onClick={() => setFormData(prev => ({ ...prev, waypoints: prev.waypoints.filter((_, idx) => idx !== i) }))}
                                                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-900 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all border border-slate-100 dark:border-white/10"
                                                >
                                                    <X size={18} strokeWidth={3} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <div id="field-dropoff" className={`relative group transition-all ${errors.dropoff ? 'ring-2 ring-red-500 rounded-2xl animate-shake' : ''}`}>
                                        <LocationInput
                                            label="Final Destination"
                                            icon={Navigation}
                                            placeholder="Where are we heading?"
                                            value={formData.dropoff}
                                            onSelect={(loc) => {
                                                setFormData(prev => ({ ...prev, dropoff: loc.address, dropoffCoords: loc.lat ? { lat: loc.lat, lon: loc.lon } : null }));
                                                if (errors.dropoff) setErrors(prev => ({ ...prev, dropoff: false }));
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between pl-4">
                                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] leading-none">
                                                {isVehicleExpanded ? 'Select Fleet Tier' : 'Your Selected Fleet'}
                                            </label>
                                            {formData.vehicle && (
                                                <button 
                                                    onClick={() => setIsVehicleExpanded(!isVehicleExpanded)}
                                                    className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-100 dark:border-white/5 hover:bg-emerald-600 hover:text-white transition-all"
                                                >
                                                    {isVehicleExpanded ? 'Collapse' : 'Change'}
                                                </button>
                                            )}
                                        </div>

                                        <AnimatePresence mode="wait">
                                            <motion.div 
                                                key={isVehicleExpanded ? 'expanded' : 'collapsed'}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <VehicleCarousel 
                                                    vehicles={pricingData.map(v => ({
                                                        ...v,
                                                        calculatedTotal: calculatePrice(v)
                                                    }))}
                                                    selectedId={formData.vehicle}
                                                    onSelect={(vehicleType) => {
                                                        setFormData({ ...formData, vehicle: vehicleType });
                                                    }}
                                                    passengerCount={formData}
                                                    pickupLocation={formData.pickup}
                                                    dropoffLocation={formData.dropoff}
                                                    isCondensed={!isVehicleExpanded}
                                                />
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>

                                </div>

                                <div className="space-y-8">
                                    {pricingCategory !== 'ride-now' && (
                                        <div className="bg-white dark:bg-zinc-900/50 p-6 sm:p-10 space-y-8 overflow-hidden relative border border-slate-100 dark:border-white/10 rounded-[2.5rem] shadow-xl">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                            <div className="flex items-center gap-4 sm:gap-6 relative z-10">
                                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 shrink-0">
                                                    <Clock size={20} className="sm:w-8 sm:h-8" strokeWidth={3} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.4em] leading-none mb-2">Schedule Details</p>
                                                    <p className="text-[10px] sm:text-xs font-black text-emerald-600 uppercase tracking-widest">Time-Critical Dispatch</p>
                                                </div>
                                            </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest pl-4 leading-none">Flight Number (Optional)</label>
                                                        <div className="relative group">
                                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600 transition-colors"><Zap size={16} strokeWidth={3} fill="currentColor" /></div>
                                                            <input
                                                                type="text"
                                                                value={formData.flightNumber || ''}
                                                                onChange={e => setFormData({ ...formData, flightNumber: e.target.value })}
                                                                className="w-full h-14 sm:h-16 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 pl-16 pr-8 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-black text-xs text-emerald-950 dark:text-white uppercase tracking-widest placeholder:text-slate-300 shadow-inner"
                                                                placeholder="e.g. UL 101"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-3">
                                                         <label className={`text-[10px] font-black uppercase tracking-widest pl-4 leading-none ${errors.date ? 'text-red-500' : 'text-slate-600 dark:text-slate-400'}`}>Target Date</label>
                                                         <input
                                                             id="field-date"
                                                             type="date"
                                                             value={formData.flightArrivalDate || ''}
                                                             onChange={e => {
                                                                 const d = e.target.value;
                                                                 setFormData(prev => ({ ...prev, flightArrivalDate: d, arrivalDate: d, date: isAirportService ? d : prev.date }));
                                                                 if (errors.date) setErrors(prev => ({ ...prev, date: false }));
                                                             }}
                                                             className={`w-full h-14 md:h-16 bg-slate-50 dark:bg-white/5 border px-6 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-black text-xs text-emerald-950 dark:text-white uppercase tracking-widest shadow-inner ${errors.date ? 'border-red-500 animate-shake' : 'border-slate-100 dark:border-white/10'}`}
                                                         />
                                                     </div>
                                                     <div className="space-y-3">
                                                         <label className={`text-[10px] font-black uppercase tracking-widest pl-4 leading-none ${errors.time ? 'text-red-500' : 'text-slate-600 dark:text-slate-400'}`}>Target Time</label>
                                                         <input
                                                             id="field-time"
                                                             type="time"
                                                             value={formData.flightArrivalTime || ''}
                                                             onChange={e => {
                                                                 const t = e.target.value;
                                                                 setFormData(prev => ({ ...prev, flightArrivalTime: t, arrivalTime: t, time: isAirportService ? t : prev.time }));
                                                                 if (errors.time) setErrors(prev => ({ ...prev, time: false }));
                                                             }}
                                                             className={`w-full h-14 md:h-16 bg-slate-50 dark:bg-white/5 border px-6 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-black text-xs text-emerald-950 dark:text-white uppercase tracking-widest shadow-inner ${errors.time ? 'border-red-500 animate-shake' : 'border-slate-100 dark:border-white/10'}`}
                                                         />
                                                     </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {isOverCapacity && (
                                        <div className="p-5 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-center gap-4 animate-pulse">
                                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600">
                                                <AlertCircle size={20} />
                                            </div>
                                            <p className="text-[10px] md:text-xs font-black text-red-900 dark:text-red-400 leading-tight uppercase tracking-widest">
                                                Capacity Exceeded: {totalPassengers} Pax (Limit {selectedVehicle.capacity})
                                            </p>
                                        </div>
                                    )}

                                    <div className="pt-4 space-y-6">
                                         <label className={`text-[10px] font-black uppercase tracking-[0.4em] pl-4 leading-none ${errors.hasNameBoard ? 'text-red-500' : 'text-slate-600 dark:text-slate-400'}`}>Greeting Service / Name Board</label>
                                         <div id="field-hasNameBoard" className={`relative overflow-hidden group rounded-[2.5rem] border transition-all ${errors.hasNameBoard ? 'border-red-500 animate-shake' : 'border-slate-100 dark:border-white/10'} ${formData.hasNameBoard ? 'bg-emerald-50/30 dark:bg-emerald-500/5' : 'bg-white dark:bg-zinc-900/30'} shadow-lg`}>
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                            
                                            <div className="relative z-10 p-6 sm:p-10 flex flex-col items-start gap-8">
                                                <div className="flex items-center gap-4 sm:gap-6 w-full overflow-hidden">
                                                     <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center border transition-all shrink-0 ${formData.hasNameBoard ? 'bg-emerald-600 border-transparent text-white shadow-xl shadow-emerald-600/30' : 'bg-slate-50 dark:bg-white/5 border-slate-100 text-slate-300'}`}>
                                                        <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="sm:w-10 sm:h-10">
                                                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                                            <circle cx="9" cy="7" r="4"></circle>
                                                            <path d="M19 8v6"></path>
                                                            <path d="M22 11h-6"></path>
                                                        </svg>
                                                     </div>
                                                     <div className="flex flex-col min-w-0">
                                                         <h4 className={`text-xl sm:text-3xl font-black uppercase tracking-tight truncate ${formData.hasNameBoard ? 'text-emerald-950 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>Airport Greeting</h4>
                                                         <p className={`text-[8px] sm:text-[10px] font-black uppercase tracking-widest ${formData.hasNameBoard ? 'text-emerald-600' : 'text-slate-500'}`}>Arrival Hall Meeting Service</p>
                                                     </div>
                                                </div>
 
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full bg-slate-50 dark:bg-white/5 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden">
                                                     <span className="px-4 py-1.5 sm:px-5 sm:py-2 bg-emerald-600 text-white rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-md shrink-0">
                                                         + Rs {(pricingSettings?.nameBoardPrice || 2000).toLocaleString()}
                                                     </span>
                                                     <p className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-tight leading-tight ${formData.hasNameBoard ? 'text-slate-600 dark:text-slate-400' : 'text-slate-600 dark:text-slate-300'}`}>
                                                         Our driver will wait with a name sign at the arrival hall.
                                                     </p>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
                                                    <button
                                                        onClick={() => setFormData({ ...formData, hasNameBoard: true })}
                                                        className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl border transition-all flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 ${formData.hasNameBoard === true ? 'border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/10 text-slate-500 hover:border-emerald-600 hover:text-emerald-600'}`}
                                                    >
                                                        <Check size={18} strokeWidth={4} className="shrink-0" />
                                                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Add Service</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setFormData({ ...formData, hasNameBoard: false, nameBoardText: '' })}
                                                        className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl border transition-all flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 ${formData.hasNameBoard === false ? 'border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/10 text-slate-500 dark:text-slate-300 hover:border-red-500 hover:text-red-500'}`}
                                                    >
                                                        <X size={18} strokeWidth={4} className="shrink-0" />
                                                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Skip Service</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {formData.hasNameBoard && (
                                         <div className="space-y-3 mt-8 animate-slide-up">
                                             <label className="text-[10px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-widest pl-4 leading-none">Name Board Content</label>
                                             <input
                                                 type="text"
                                                 value={formData.nameBoardText}
                                                 onChange={e => setFormData({ ...formData, nameBoardText: e.target.value })}
                                                 className="w-full h-16 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 px-8 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-black text-xs text-emerald-950 dark:text-white uppercase tracking-widest placeholder:text-slate-300 shadow-inner"
                                                 placeholder="Enter pickup name or greeting..."
                                             />
                                         </div>
                                    )}
                                </div>
                            </div>

                                <div className="p-8 sm:p-12 bg-white dark:bg-zinc-900/50 rounded-[3rem] text-emerald-950 dark:text-white flex flex-col gap-8 relative overflow-hidden group border border-slate-100 dark:border-white/10 shadow-2xl">
                                    {/* Decorative Background Block */}
                                    <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full -mr-36 -mt-36 blur-3xl"></div>

                                    <div className="relative z-10 space-y-6">
                                        <div className="flex items-center gap-3 text-emerald-600 mb-2">
                                            <Zap size={18} fill="currentColor" className="animate-pulse" />
                                            <span className="text-[12px] font-black uppercase tracking-[0.4em]">{formData.paymentType === 'partial' ? 'Deposit Payment' : 'Immediate Payment'}</span>
                                        </div>
                                        <div className="text-5xl xs:text-6xl md:text-8xl font-black leading-none tracking-tighter flex items-center gap-4 uppercase">
                                            <span className="text-2xl sm:text-3xl font-black text-slate-300 dark:text-white/20">
                                                {(rates?.[currency]) ? currentSymbol : 'Rs'}
                                            </span>
                                            <span className="text-emerald-950 dark:text-white">
                                                {payNow.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                {/* Multi-Currency Grid */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-px flex-1 bg-slate-100 dark:bg-white/5"></div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Global Pricing</span>
                                        <div className="h-px flex-1 bg-slate-100 dark:bg-white/5"></div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {convertToAllCurrencies(totalPrice / (rates?.[currency] || 1)).map((c) => (
                                            <button
                                                key={c.code}
                                                type="button"
                                                onClick={() => changeCurrency(c.code)}
                                                className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-3 text-left cursor-pointer group/curr ${currency === c.code
                                                    ? 'bg-emerald-600 border-transparent text-white shadow-lg shadow-emerald-600/20'
                                                    : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 hover:border-emerald-600 text-slate-400 hover:text-emerald-600'
                                                    }`}
                                            >
                                                <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-white dark:border-zinc-800 shadow-sm">
                                                    <img src={c.flag} alt={c.code} className="w-full h-full object-cover" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">{c.code}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Detailed Breakdown & Coupons */}
                                <div className="space-y-4 bg-slate-50 dark:bg-white/5 p-8 rounded-[2rem] border border-slate-100 dark:border-white/10 shadow-inner">

                                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Fare Subtotal</span>
                                    <span className="text-emerald-950 dark:text-white">{currentSymbol} {subtotal.toLocaleString()}</span>
                                </div>
 
                                {detailedBreakdown.detailedExtras?.map((s, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                                        <span>{s.label}</span>
                                        <span className="text-emerald-600">+{currentSymbol} {s.value.toLocaleString()}</span>
                                    </div>
                                ))}
 
                                {detailedBreakdown.discounts > 0 && (
                                    <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-emerald-600 bg-white dark:bg-emerald-500/5 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-500/10 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <Tag size={16} className="animate-pulse" />
                                            <span>
                                                {detailedBreakdown.appliedCoupons?.length > 0 ? `Code applied` : 'Special Discount'}
                                            </span>
                                        </div>
                                        <span className="font-black">-{currentSymbol} {detailedBreakdown.discounts.toLocaleString()}</span>
                                    </div>
                                )}

                                {detailedBreakdown.appliedCoupons?.length > 0 && (
                                    <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                                        <div className="flex flex-wrap gap-2">
                                            {detailedBreakdown.appliedCoupons.map((c, idx) => (
                                                <span key={idx} className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 shadow-sm">
                                                    <Check size={12} strokeWidth={4} /> {c.code || c}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            </div>

                            <div className="flex flex-col items-center justify-center gap-3 mt-6">
                                <div className="flex items-center gap-2 text-emerald-600/60">
                                    <ShieldCheck size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Taxes Included • Tolls Excluded</span>
                                </div>
                            </div>
                        </div>
                    )}

                {step === 2 && (
                        <div className="animate-slide-up">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                                <div>
                                    <h3 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FACC15] to-[#FF5C00] tracking-tight uppercase leading-none mb-3">
                                        Passenger <span className="text-emerald-950 dark:text-white">Details</span>
                                    </h3>
                                    <p className="text-[10px] md:text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.4em]">Seamless Journey Planning</p>
                                </div>
                                <div className="flex items-center gap-4 bg-emerald-50 dark:bg-emerald-500/10 px-6 py-3 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
                                    <Zap size={18} className="text-emerald-600" />
                                    <span className="text-[10px] font-black text-emerald-950 dark:text-white uppercase tracking-widest">Instant Confirmation</span>
                                </div>
                            </div>

                            <div className="space-y-10 max-w-3xl mx-auto">
                                {!session && (
                                    <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group shadow-2xl">
                                        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10 mix-blend-overlay"></div>
                                        <div className="flex items-center gap-6 relative z-10 text-white">
                                            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg"><User size={28} /></div>
                                            <div>
                                                <p className="text-sm font-black uppercase tracking-widest leading-none">Exclusive Benefits?</p>
                                                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mt-2">Sign in for member rates & trip history.</p>
                                            </div>
                                        </div>
                                        <button onClick={() => signIn()} className="relative z-10 px-10 py-4 bg-white text-emerald-950 rounded-2xl text-[10px] font-black hover:bg-emerald-50 transition-all uppercase tracking-widest shadow-xl active:scale-95">Member Login</button>
                                    </div>
                                )}

                                <div className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-x-10 gap-y-8 bg-white dark:bg-zinc-900/40 p-1 md:p-4 rounded-[2.5rem]">
                                        {[
                                            { label: 'Full Legal Name', key: 'name', type: 'text', placeholder: 'Passenger Name', icon: User },
                                            { label: 'Email Address', key: 'email', type: 'email', placeholder: 'for confirmation', icon: Mail },
                                            { label: 'Primary Contact No', key: 'phone', type: 'tel', placeholder: '+94 XXX XXX XXX', icon: Phone },
                                            { label: 'WhatsApp Number', key: 'whatsapp', type: 'tel', placeholder: 'For driver chat', icon: MessageSquare },
                                        ].map(f => (
                                                <div key={f.key} className="group/field">
                                                    <label className={`text-[9px] font-black uppercase tracking-[0.2em] mb-3 ml-6 flex items-center gap-2 transition-colors ${errors[f.key] ? 'text-red-500' : 'text-slate-600 dark:text-slate-400 group-focus-within/field:text-emerald-600'}`}>
                                                        <f.icon size={11} className={errors[f.key] ? 'text-red-500' : 'text-emerald-600'} /> {f.label}
                                                    </label>
                                                    {f.type === 'tel' ? (
                                                        <PhoneInput
                                                            id={`field-${f.key}`}
                                                            defaultCountry="lk"
                                                            value={formData[f.key] || ''}
                                                            onChange={(phone) => {
                                                                setFormData({ ...formData, [f.key]: phone });
                                                                if (errors[f.key]) setErrors(prev => ({ ...prev, [f.key]: false }));
                                                            }}
                                                            inputClassName="!w-full !h-16 !bg-transparent !border-none !px-6 !outline-none focus:!ring-0 !font-black !text-emerald-950 dark:!text-white placeholder:!text-slate-400 !text-sm !uppercase !tracking-widest"
                                                            countrySelectorStyleProps={{
                                                                buttonClassName: '!h-16 !bg-slate-50 dark:!bg-white/5 !border-r !border-slate-100 dark:!border-white/10 !px-4 !flex !items-center !justify-center !min-w-[80px] !rounded-l-3xl',
                                                                flagClassName: '!w-8 !h-auto',
                                                                dropdownStyleProps: {
                                                                    className: '!z-[20000] !min-w-[200px] !max-h-[300px] !rounded-2xl !border !border-slate-100 !bg-white dark:!bg-zinc-900 dark:!text-white shadow-2xl'
                                                                }
                                                            }}
                                                            className={`w-full bg-slate-50 dark:bg-white/5 border rounded-3xl flex focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all shadow-sm group-hover/field:border-emerald-200 dark:group-hover/field:border-emerald-500/20 ${errors[f.key] ? 'border-red-500 animate-shake' : 'border-slate-100 dark:border-white/10'}`}
                                                        />
                                                    ) : (
                                                        <input
                                                            id={`field-${f.key}`}
                                                            type={f.type}
                                                            value={formData[f.key] || ''}
                                                            onChange={e => {
                                                                setFormData({ ...formData, [f.key]: e.target.value });
                                                                if (errors[f.key]) setErrors(prev => ({ ...prev, [f.key]: false }));
                                                            }}
                                                            className={`w-full h-16 bg-slate-50 dark:bg-white/5 border px-8 rounded-3xl outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-black text-emerald-950 dark:text-white placeholder:text-slate-500 text-sm uppercase tracking-widest shadow-sm group-hover/field:border-emerald-200 dark:group-hover/field:border-emerald-500/20 ${errors[f.key] ? 'border-red-500 animate-shake' : 'border-slate-100 dark:border-white/10'}`}
                                                            placeholder={f.placeholder}
                                                        />
                                                    )}
                                                </div>
                                        ))}
                                    </div>

                                        <div className="space-y-8 pt-12 mt-12 border-t border-slate-100 dark:border-white/5">
                                            <h4 className="text-[11px] font-black text-emerald-950 dark:text-white uppercase tracking-[0.4em] pl-6 flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-600 shadow-sm"><CreditCard size={18} /></div> Billing Details <span className="text-slate-600 dark:text-slate-400">(Optional)</span>
                                            </h4>
                                            <div className="grid md:grid-cols-2 gap-8 px-2">
                                                <input
                                                    type="text"
                                                    value={formData.billingName || ''}
                                                    onChange={e => setFormData({ ...formData, billingName: e.target.value })}
                                                    className="w-full h-16 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 px-8 rounded-3xl text-sm font-black text-emerald-950 dark:text-white placeholder:text-slate-600 uppercase tracking-widest outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                                                    placeholder="Full Billing Name"
                                                    aria-label="Full Billing Name"
                                                />
                                                <input
                                                    type="text"
                                                    value={formData.billingCountry || ''}
                                                    onChange={e => setFormData({ ...formData, billingCountry: e.target.value })}
                                                    className="w-full h-16 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 px-8 rounded-3xl text-sm font-black text-emerald-950 dark:text-white placeholder:text-slate-600 uppercase tracking-widest outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                                                    placeholder="Country of Residence"
                                                    aria-label="Country of Residence"
                                                />
                                                <textarea
                                                    rows="3"
                                                    value={formData.billingAddress}
                                                    onChange={e => setFormData({ ...formData, billingAddress: e.target.value })}
                                                    className="md:col-span-2 w-full p-8 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[2.5rem] text-sm font-black text-emerald-950 dark:text-white placeholder:text-slate-600 resize-none uppercase tracking-widest outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                                                    placeholder="Full Billing Address"
                                                    aria-label="Full Billing Address"
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    )}

                {step === 3 && (
                        <div className="animate-slide-up">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                                <div>
                                    <h3 className="text-4xl md:text-6xl font-black text-emerald-950 dark:text-white tracking-tight uppercase leading-none mb-3">Final <span className="text-emerald-600">Checkout</span></h3>
                                    <p className="text-[10px] md:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">Premium Booking Experience</p>
                                </div>
                                <div className="flex items-center gap-5 bg-emerald-50 dark:bg-emerald-500/10 px-6 py-3 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
                                    <ShieldCheck size={18} className="text-emerald-600" />
                                    <span className="text-[10px] font-black text-emerald-950 dark:text-white uppercase tracking-widest">Secured by SSL</span>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-12 gap-12">
                                    {/* Left Column: Summary */}
                                    <div className="lg:col-span-7 space-y-12">
                                        <div className="p-8 md:p-14 bg-white dark:bg-zinc-900/40 rounded-[3rem] text-emerald-950 dark:text-white border border-emerald-100 dark:border-white/10 shadow-2xl relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-emerald-600/10 transition-all duration-700"></div>

                                            <div className="relative z-10 space-y-10">
                                                <div className="flex items-center justify-between pb-8 border-b border-slate-100 dark:border-white/5">
                                                     <div className="px-6 py-2.5 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20">
                                                         Booking Summary
                                                     </div>
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                                                        {formData.tripType.replace('-', ' ')}
                                                    </div>
                                                </div>

                                                 <div className="space-y-8">
                                                    {/* Compact Vehicle Summary */}
                                                    <div className="flex items-center gap-6 bg-slate-50 dark:bg-white/5 p-6 rounded-[2.5rem] border border-slate-100 dark:border-white/10 group/v-summary animate-slide-in shadow-inner">
                                                        <div className="w-24 h-16 bg-white dark:bg-zinc-800 rounded-2xl border border-slate-100 dark:border-white/10 flex items-center justify-center p-2 overflow-hidden shrink-0 shadow-sm">
                                                            <img src={selectedVehicle?.image} alt={selectedVehicle?.name} className="w-full h-full object-contain scale-110 group-hover/v-summary:scale-125 transition-transform duration-500" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm font-black text-emerald-950 dark:text-white uppercase truncate tracking-tight">{displayVehicleName(selectedVehicle?.name)}</p>
                                                            <div className="flex items-center gap-4 mt-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Users size={12} className="text-emerald-600" />
                                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{selectedVehicle?.capacity || 4} Pax</span>
                                                                </div>
                                                                <span className="w-1 h-1 bg-slate-200 dark:bg-white/10 rounded-full"></span>
                                                                <div className="flex items-center gap-2">
                                                                    <Briefcase size={12} className="text-emerald-600" />
                                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{selectedVehicle?.luggage || 2} Bags</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid sm:grid-cols-2 gap-8 px-2">
                                                        <div className="flex gap-5">
                                                             <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-white flex items-center justify-center shrink-0 shadow-xl"><MapPin size={22} /></div>
                                                             <div className="min-w-0">
                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Origin</p>
                                                                <p className="text-[11px] font-black text-emerald-950 dark:text-white leading-tight uppercase line-clamp-2">{formData.pickup}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-5">
                                                             <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xl shadow-emerald-600/20"><Navigation size={22} /></div>
                                                             <div className="min-w-0">
                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Destination</p>
                                                                <p className="text-[11px] font-black text-emerald-950 dark:text-white leading-tight uppercase line-clamp-2">{formData.dropoff}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {formData.hasNameBoard && (
                                                      <div className="flex gap-6 bg-emerald-50 dark:bg-emerald-500/5 p-6 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-500/10 shadow-sm group/board">
                                                             <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-white/5 overflow-hidden shadow-sm group-hover/board:border-emerald-500 transition-colors">
                                                                 <Signpost size={28} className="text-emerald-600" strokeWidth={3} />
                                                             </div>
                                                            <div className="min-w-0">
                                                                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-2">Airport Greeting</p>
                                                                <p className="text-[11px] font-black text-emerald-950 dark:text-white uppercase truncate">"{formData.nameBoardText || 'Elite Greeting'}"</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-5 pt-10 mt-6 border-t border-slate-100 dark:border-white/10">
                                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                        <span>Trip Base Fare</span>
                                                        <span className="text-emerald-950 dark:text-white font-black">{currentSymbol} {subtotal.toLocaleString()}</span>
                                                    </div>

                                                    {detailedBreakdown.detailedExtras?.filter(s => s.value > 0).map((s, idx) => (
                                                        <div key={idx} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                            <span>{s.label}</span>
                                                            <span className="text-emerald-600 font-black">+{currentSymbol} {s.value.toLocaleString()}</span>
                                                        </div>
                                                    ))}

                                                    {detailedBreakdown.discounts > 0 && (
                                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-500/5 px-4 py-2 rounded-xl">
                                                            <span>Special promotion applied</span>
                                                            <span className="font-black">-{currentSymbol} {detailedBreakdown.discounts.toLocaleString()}</span>
                                                        </div>
                                                    )}

                                                    <div className="pt-10 mt-8 border-t border-slate-100 dark:border-white/10 flex justify-between items-end">
                                                        <div>
                                                            <p className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-5 py-2 mb-5 rounded-full w-fit tracking-[0.2em] shadow-sm">
                                                                {formData.paymentType === 'partial' ? 'Secure Deposit (50%)' : 'Total Amount (Fixed)'}
                                                            </p>
                                                            <p className="text-6xl md:text-8xl font-black tracking-tighter text-emerald-950 dark:text-white leading-none">
                                                                <span className="text-xl md:text-2xl font-black mr-2 text-slate-300 dark:text-white/20">{currentSymbol}</span>
                                                                {payNow.toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Disclaimer Section */}
                                                    <div className="pt-8 mt-6 text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-relaxed flex items-center gap-4">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500/30 shrink-0"></div>
                                                        Fixed price includes taxes & fuel. Highway tolls excluded.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Payment */}
                                    <div className="lg:col-span-5 space-y-12">
                                        {/* Payment Selection */}
                                        <div className="space-y-8">
                                            <h4 className="text-[11px] font-black text-emerald-950 dark:text-white uppercase tracking-[0.4em] pl-6">Secure Payment</h4>
                                            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
                                                {['cash', 'card'].map(m => (
                                                    <button
                                                        key={m}
                                                        onClick={() => setFormData(prev => ({
                                                            ...prev,
                                                            paymentMethod: m,
                                                            paymentType: m === 'cash' ? 'full' : prev.paymentType
                                                        }))}
                                                        className={`p-10 rounded-[2.5rem] border-2 transition-all flex items-center gap-8 group/pm relative overflow-hidden ${formData.paymentMethod === m
                                                            ? 'border-emerald-600 bg-emerald-600 text-white shadow-2xl shadow-emerald-600/20'
                                                            : 'border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 opacity-60 hover:opacity-100 hover:border-emerald-600'}`}
                                                    >
                                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-500 group-hover/pm:scale-110 ${formData.paymentMethod === m ? 'bg-white/20' : 'bg-white dark:bg-zinc-800 shadow-md'}`}>
                                                            {m === 'cash' ? <Coins size={28} className={formData.paymentMethod === m ? 'text-white' : 'text-emerald-600'} /> : <CreditCard size={28} className={formData.paymentMethod === m ? 'text-white' : 'text-emerald-600'} />}
                                                        </div>
                                                        <div className="text-left">
                                                            <span className="block text-[11px] font-black uppercase tracking-widest">{m === 'cash' ? 'Pay to Driver' : 'Pay via Card'}</span>
                                                            <span className={`text-[8px] font-bold uppercase tracking-widest mt-1 block ${formData.paymentMethod === m ? 'text-white/60' : 'text-slate-400'}`}>{m === 'cash' ? 'Pay after arrival' : 'Stripe / PayHere'}</span>
                                                        </div>
                                                        {formData.paymentMethod === m && <Check size={24} className="absolute right-10 opacity-20" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {formData.paymentMethod === 'card' && (
                                            <div className="space-y-6 animate-slide-in">
                                                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] pl-6">Installment Option</h4>
                                                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-[1.8rem] border border-slate-100 dark:border-white/10 shadow-inner">
                                                    {['full', 'partial'].map(t => (
                                                        <button
                                                            key={t}
                                                            onClick={() => setFormData(prev => ({ ...prev, paymentType: t }))}
                                                            className={`py-5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${formData.paymentType === t
                                                                ? 'bg-emerald-600 text-white shadow-xl'
                                                                : 'text-slate-400 hover:text-emerald-600'}`}
                                                        >
                                                            {t === 'full' ? 'Complete (100%)' : 'Deposit (50%)'}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-6 pt-6">
                                             <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] pl-6">Promo Codes</h4>
                                             <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-3 rounded-[2rem] flex gap-4 shadow-inner">
                                                <input
                                                    value={couponInput}
                                                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                                                    placeholder="HAVE A CODE?"
                                                    className="flex-1 h-14 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/10 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-emerald-500/10 text-emerald-950 dark:text-white shadow-sm transition-all"
                                                />
                                                <button
                                                    onClick={() => handleApplyCoupon()}
                                                    disabled={couponLoading || !couponInput}
                                                    className="px-10 bg-emerald-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 active:scale-95 transition-all shadow-xl hover:bg-black"
                                                >
                                                    {couponLoading ? <Loader2 className="animate-spin" size={16} /> : 'Apply'}
                                                </button>
                                            </div>
                                            {verifiedCoupons.length > 0 && (
                                                <div className="flex flex-wrap gap-3 px-3">
                                                    {verifiedCoupons.map((c, i) => (
                                                        <span key={i} className="px-6 py-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-4 animate-slide-in shadow-sm group">
                                                            <Tag size={12} fill="currentColor" className="group-hover:rotate-12 transition-transform" /> {c.code}
                                                            <X size={16} className="cursor-pointer hover:rotate-90 transition-all ml-2 opacity-40 hover:opacity-100" onClick={() => setVerifiedCoupons(prev => prev.filter(vc => vc.code !== c.code))} />
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                 <div className="p-6 sm:p-10 pt-4 pb-28 sm:pb-10 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-zinc-950 shrink-0 transition-colors">
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
                        <button
                            onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
                            className="flex items-center justify-center gap-2 px-8 py-4.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 w-full sm:w-auto sm:min-w-[180px] active:scale-95 shadow-sm"
                        >
                            <ChevronLeft size={16} /> {step === 1 ? 'Cancel Trip' : 'Return'}
                        </button>
 
                        {step < 3 ? (
                            <button
                                onClick={() => {
                                     if (validateForm(step)) {
                                         setStep(step + 1);
                                         if (modalContentRef.current) modalContentRef.current.scrollTop = 0;
                                     } else {
                                         scrollToFirstError();
                                     }
                                 }}
                                 disabled={isOverCapacity}
                                 className="group flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-[#FACC15] to-[#FF5C00] text-white rounded-2xl text-[11px] sm:text-[12px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-orange-500/20 disabled:opacity-30 w-full sm:w-auto sm:min-w-[220px] active:scale-95"
                            >
                                {step === 1 ? 'Review & Checkout' : 'Final Step: Review & Pay'} <ChevronRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                 disabled={loading || isOverCapacity}
                                 className="group flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-[#FACC15] to-[#FF5C00] text-white rounded-2xl text-[11px] sm:text-[12px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-orange-500/20 disabled:opacity-30 w-full sm:w-auto sm:min-w-[240px] active:scale-95"
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} fill="currentColor" />}
                                {loading ? 'Securing Spot...' : 'Confirm My Order'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


