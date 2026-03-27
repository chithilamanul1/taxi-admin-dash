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
    { id: 2, title: 'Checkout & Pay', icon: CreditCard },
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
                const res = await fetch('/api/admin/pricing-settings', { cache: 'no-store' });
                const data = await res.json();
                if (data.success && data.data) {
                    setPricingSettings(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch settings in modal", err);
            }
        };
        const fetchDestinations = async () => {
            try {
                const res = await fetch('/api/admin/destinations', { cache: 'no-store' });
                const data = await res.json();
                if (data.success) setDestinations(data.data);
            } catch (err) {
                console.error("Failed to fetch destinations in modal", err);
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

        // Step 2 Validation
        if (targetStep >= 2) {
            if (!formData.name) newErrors.name = true;
            if (!formData.phone) newErrors.phone = true;
            if (!formData.email) newErrors.email = true;
            if (isAirportService && !formData.flightNumber) newErrors.flightNumber = true;
            if (formData.hasNameBoard && !formData.nameBoardText) newErrors.nameBoardText = true;
        }

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
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 p-0 sm:p-4 overflow-hidden touch-none overscroll-none backdrop-blur-xl transition-all duration-500">
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
            <div id="modal-container" className="bg-white dark:bg-black w-full h-full sm:h-auto sm:max-h-[95vh] rounded-none border-4 border-black sm:max-w-4xl overflow-hidden flex flex-col animate-slide-up relative transition-colors duration-500">
                {/* Coupon Verification Notification - Moved to Bottom */}
                <AnimatePresence>
                    {couponLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-[10010] bg-black border-4 border-[#FACC15] text-white px-8 py-4 rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 backdrop-blur-xl"
                        >
                            <Loader2 className="animate-spin text-[#FACC15]" size={20} />
                            <span className="text-xs font-black uppercase tracking-widest text-[#FACC15]">Verifying Security Code...</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                {/* Header - Hidden in Step 2 */}
                {step !== 2 && (
                    <div className="p-4 sm:p-8 md:p-12 pb-4 flex items-center justify-between shrink-0 pt-6 sm:pt-8 bg-white dark:bg-black transition-colors duration-500">
                        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-[#FACC15] rounded-none border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0 group hover:-translate-y-1 transition-transform">
                                <Zap size={24} className="text-black sm:w-8 sm:h-8" strokeWidth={3} fill="currentColor" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-xl sm:text-2xl md:text-4xl font-black tracking-tighter text-black dark:text-white leading-none truncate uppercase">
                                    SECURE <span className="text-[#FACC15]">BOOKING</span>
                                </h2>
                                <p className="text-[8px] sm:text-[10px] md:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] sm:tracking-[0.4em] mt-1 sm:mt-3">Elite Tier Encryption</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 sm:w-14 sm:h-14 bg-slate-100 dark:bg-white/10 rounded-none flex items-center justify-center border-4 border-black hover:bg-black hover:text-white transition-all z-[101] group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <X size={20} strokeWidth={3} className="sm:w-7 sm:h-7 group-hover:rotate-90 transition-transform" />
                        </button>
                    </div>
                )}

                {/* Progress Indicators */}
                <div className="px-4 sm:px-8 md:px-12 py-2 md:py-6 flex gap-2 md:gap-4">
                    {STEPS.map((s) => (
                        <div key={s.id} className="flex-1 flex flex-col gap-2 md:gap-3">
                            <div className={`h-2 md:h-3 rounded-none transition-all duration-1000 border-2 border-black ${step >= s.id ? 'bg-[#FACC15] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-slate-100 dark:bg-white/5'}`}></div>
                            <span className={`text-[7px] md:text-[9px] font-black uppercase tracking-wider md:tracking-widest text-center ${step >= s.id ? 'text-black dark:text-[#FACC15]' : 'text-slate-400'}`}>{s.title}</span>
                        </div>
                    ))}
                </div>

                {/* Main Viewport */}
                <div ref={modalContentRef} className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar overscroll-contain">
                    {step === 1 && (
                        <div className="space-y-8 md:space-y-10 animate-slide-up">
                            {/* Trip Header */}
                            <div className="flex flex-wrap bg-slate-100 dark:bg-white/5 p-2 rounded-none border-4 border-black w-full md:w-fit gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                {['one-way', 'round-trip'].map(t => (
                                    <button key={t} onClick={() => setFormData({ ...formData, tripType: t })} className={`flex-1 md:flex-none px-8 py-4 rounded-none text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border-4 ${formData.tripType === t ? 'bg-[#FACC15] border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'border-transparent text-slate-400 hover:text-black dark:hover:text-white'}`}>{t.replace('-', ' ')}</button>
                                ))}
                            </div>

                            {/* Location Inputs - Premium Sharp Card */}
                            <div className="premium-box bg-slate-50 dark:bg-[#0a0a0a] p-8 md:p-12 space-y-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black rounded-none">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-[10px] font-black text-black dark:text-white uppercase tracking-[0.4em] flex items-center gap-4 font-black">
                                        <div className="w-3 h-3 rounded-none bg-[#FACC15] animate-pulse border-2 border-black"></div>
                                        ROUTING LOGISTICS
                                    </h3>
                                    <div className="px-6 py-2 bg-black text-[#FACC15] rounded-none text-[9px] font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        {formData.tripType.replace('-', ' ')}
                                    </div>
                                </div>
                                <div className="space-y-10 relative">
                                        <div id="field-pickup" className={`relative group border-4 transition-all ${errors.pickup ? 'border-red-500 animate-shake' : 'border-transparent'}`}>
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
                                        <div key={i} className="relative group animate-slide-in pl-12">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FACC15] z-10 p-2 bg-black rounded-none shadow-[2px_2px_0px_0px_rgba(250,204,21,1)] border-2 border-[#FACC15]">
                                                <Navigation size={18} strokeWidth={3} />
                                            </div>
                                            <div className="w-full pl-12 pr-6 py-6 bg-white dark:bg-white/5 rounded-none border-2 border-black text-xs font-black text-black dark:text-white flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-[#FACC15]/5 transition-all uppercase tracking-widest">
                                                <span className="truncate">{wp.address || wp.name}</span>
                                                <button
                                                    onClick={() => setFormData(prev => ({ ...prev, waypoints: prev.waypoints.filter((_, idx) => idx !== i) }))}
                                                    className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-white/10 hover:bg-black hover:text-white rounded-none transition-all border border-black/30"
                                                >
                                                    <X size={18} strokeWidth={3} />
                                                </button>
                                            </div>
                                            {/* Connecting Line */}
                                            <div className="absolute left-6 -top-10 w-1 h-10 bg-gradient-to-b from-[#FACC15] to-transparent -z-10"></div>
                                        </div>
                                    ))}

                                    <div id="field-dropoff" className={`relative group border-4 transition-all ${errors.dropoff ? 'border-red-500 animate-shake' : 'border-transparent'}`}>
                                        {/* Connecting Line from pickup to waypoints/dropoff */}
                                        <div className="absolute left-8 -top-10 w-1 h-10 bg-gradient-to-b from-slate-200 dark:from-white/10 to-transparent -z-10"></div>
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
                                                    className="text-[9px] font-black uppercase tracking-widest text-[#FACC15] bg-black px-4 py-2 border-2 border-black hover:translate-y-[-2px] active:translate-y-0 transition-all font-black"
                                                >
                                                    {isVehicleExpanded ? 'Collapse List' : 'Change Vehicle'}
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

                                <div className="space-y-6">
                                    {pricingCategory !== 'ride-now' && (
                                        <div className="premium-box bg-slate-50 dark:bg-[#0a0a0a] p-8 md:p-10 space-y-10 shadow-xl overflow-hidden relative">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FACC15]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                            <div className="flex items-center gap-4 sm:gap-6 relative z-10">
                                                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-black dark:bg-[#FACC15] rounded-none border-4 border-black flex items-center justify-center text-[#FACC15] dark:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:rotate-6">
                                                    <Clock size={20} className="sm:w-7 sm:h-7" strokeWidth={3} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] sm:text-[10px] font-black text-black dark:text-white uppercase tracking-[0.2em] sm:tracking-[0.4em] leading-none mb-1 sm:mb-2">Schedule Details</p>
                                                    <p className="text-[8px] sm:text-[11px] font-black text-black dark:text-[#FACC15] uppercase tracking-widest">Time-Critical Dispatch</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 gap-6 sm:gap-8 relative z-10">
                                                <div className="space-y-3 sm:space-y-4">
                                                    <label className="text-[8px] sm:text-[10px] font-black text-black dark:text-white uppercase tracking-[0.2em] sm:tracking-[0.4em] pl-2 sm:pl-4 leading-none">Flight Number (Optional)</label>
                                                    <div className="relative group">
                                                        <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-[#FACC15] group-focus-within:text-black dark:group-focus-within:text-[#FACC15] transition-colors"><Zap size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={3} fill="currentColor" /></div>
                                                        <input
                                                            type="text"
                                                            value={formData.flightNumber || ''}
                                                            onChange={e => setFormData({ ...formData, flightNumber: e.target.value })}
                                                            className="w-full h-12 sm:h-16 bg-white dark:bg-white/5 border-4 border-black pl-12 sm:pl-16 pr-6 sm:pr-8 rounded-none outline-none focus:bg-[#FACC15]/5 transition-all font-black text-[10px] sm:text-xs text-black dark:text-white uppercase tracking-widest placeholder:text-black/20 dark:placeholder:text-white/20"
                                                            placeholder="e.g. UL 101"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 sm:gap-6">
                                                    <div className="space-y-3 sm:space-y-4">
                                                         <label className={`text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] pl-2 sm:pl-4 leading-none ${errors.date ? 'text-red-500' : 'text-black dark:text-white'}`}>Target Date</label>
                                                         <input
                                                             id="field-date"
                                                             type="date"
                                                             value={formData.flightArrivalDate || ''}
                                                             onChange={e => {
                                                                 const d = e.target.value;
                                                                 setFormData(prev => ({ ...prev, flightArrivalDate: d, arrivalDate: d, date: isAirportService ? d : prev.date }));
                                                                 if (errors.date) setErrors(prev => ({ ...prev, date: false }));
                                                             }}
                                                             className={`w-full h-12 md:h-16 bg-white dark:bg-white/5 border-4 px-4 md:px-8 rounded-none outline-none focus:bg-[#FACC15]/5 transition-all font-black text-[10px] md:text-xs text-black dark:text-white uppercase tracking-widest ${errors.date ? 'border-red-500 animate-shake' : 'border-black'}`}
                                                             placeholder="YYYY-MM-DD"
                                                         />
                                                     </div>
                                                     <div className="space-y-3 sm:space-y-4">
                                                         <label className={`text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] pl-2 sm:pl-4 leading-none ${errors.time ? 'text-red-500' : 'text-black dark:text-white'}`}>Target Time</label>
                                                         <input
                                                             id="field-time"
                                                             type="time"
                                                             value={formData.flightArrivalTime || ''}
                                                             onChange={e => {
                                                                 const t = e.target.value;
                                                                 setFormData(prev => ({ ...prev, flightArrivalTime: t, arrivalTime: t, time: isAirportService ? t : prev.time }));
                                                                 if (errors.time) setErrors(prev => ({ ...prev, time: false }));
                                                             }}
                                                             className={`w-full h-12 md:h-16 bg-white dark:bg-white/5 border-4 px-4 md:px-8 rounded-none outline-none focus:bg-[#FACC15]/5 transition-all font-black text-[10px] md:text-xs text-black dark:text-white uppercase tracking-widest ${errors.time ? 'border-red-500 animate-shake' : 'border-black'}`}
                                                         />
                                                     </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Passenger & Luggage Section Removed as it's redundant with home page/widget info */}


                                    {isOverCapacity && (
                                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-4 border-black rounded-none flex items-center gap-4 animate-pulse shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                            <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-none text-red-600 dark:text-red-400 border-2 border-black">
                                                <AlertCircle size={18} />
                                            </div>
                                            <p className="text-[10px] md:text-xs font-black text-red-900 dark:text-red-400 leading-tight uppercase tracking-[0.1em]">
                                                Capacity Exceeded: {totalPassengers} Pax (Limit {selectedVehicle.capacity})
                                            </p>
                                        </div>
                                    )}

                                    <div className="pt-4 space-y-6">
                                         <label className={`text-[10px] font-black uppercase tracking-[0.3em] pl-3 leading-none ${errors.hasNameBoard ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`}>Greeting Service / Name Board</label>
                                         <div id="field-hasNameBoard" className={`relative overflow-hidden group rounded-none border-4 transition-all ${errors.hasNameBoard ? 'border-red-500 animate-shake' : ''} ${formData.hasNameBoard ? 'border-black dark:border-[#FACC15] bg-white dark:bg-[#111]' : 'border-black bg-white dark:bg-white/5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}>
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-none blur-3xl -mr-16 -mt-16"></div>
                                            
                                            <div className="relative z-10 p-6 md:p-8 flex flex-col items-start gap-6">
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-16 h-16 rounded-none flex items-center justify-center border-4 transition-colors overflow-hidden shrink-0 ${formData.hasNameBoard ? 'bg-[#FACC15] border-black text-black' : 'bg-white dark:bg-white/5 border-black text-slate-400'}`}>
                                                        <Signpost size={32} strokeWidth={3} fill="currentColor" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <h4 className={`text-2xl font-black uppercase tracking-tighter ${formData.hasNameBoard ? 'text-white' : 'text-black dark:text-white'}`}>Airport Greeting</h4>
                                                        <p className={`text-[10px] font-black uppercase tracking-widest ${formData.hasNameBoard ? 'text-[#FACC15]' : 'text-slate-400'}`}>Arrival Hall Meeting Service</p>
                                                    </div>
                                                </div>
 
                                                <div className="flex flex-wrap items-center gap-4 w-full">
                                                    <span className={`px-4 py-2 rounded-none text-[10px] font-black uppercase tracking-widest border-4 ${formData.hasNameBoard ? 'bg-white/10 border-white/20 text-[#FACC15]' : 'bg-[#FACC15]/20 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}`}>
                                                        + Rs {(pricingSettings?.nameBoardPrice || 2000).toLocaleString()}
                                                    </span>
                                                    <p className={`text-[9px] font-bold uppercase tracking-tight flex-1 min-w-[200px] ${formData.hasNameBoard ? 'text-white/40' : 'text-slate-400'}`}>
                                                        Our driver will wait with a name sign at the arrival hall.
                                                    </p>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-4 w-full">
                                                    <button
                                                        onClick={() => setFormData({ ...formData, hasNameBoard: true })}
                                                        className={`p-4 rounded-none border-4 transition-all flex items-center justify-center gap-3 ${formData.hasNameBoard === true ? 'border-black bg-[#FACC15] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-black/40 backdrop-blur-md border-black text-white hover:border-black'}`}
                                                    >
                                                        <Check size={18} strokeWidth={4} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Add Service</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setFormData({ ...formData, hasNameBoard: false, nameBoardText: '' })}
                                                        className={`p-4 rounded-none border-4 transition-all flex items-center justify-center gap-3 ${formData.hasNameBoard === false ? 'border-black bg-red-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-black/40 backdrop-blur-md border-black text-white hover:border-black'}`}
                                                    >
                                                        <X size={18} strokeWidth={4} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Skip Service</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {formData.hasNameBoard && (
                                        <div className="space-y-3 mt-6 animate-slide-up">
                                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] pl-3 leading-none">Name Board Content</label>
                                            <input
                                                type="text"
                                                value={formData.nameBoardText}
                                                onChange={e => setFormData({ ...formData, nameBoardText: e.target.value })}
                                                className="w-full h-14 bg-slate-50 dark:bg-white/5 border-4 border-black px-8 rounded-none outline-none focus:bg-[#FACC15]/5 transition-all font-black text-xs text-black dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest"
                                                placeholder="Enter pickup name or greeting..."
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                                <div className="p-8 md:p-10 bg-white dark:bg-[#111] rounded-none text-black dark:text-white flex flex-col gap-10 relative overflow-hidden group border-4 border-black transition-all">
                                    {/* Decorative Background Glow */}
                                    <div className="absolute top-0 right-0 w-72 h-72 bg-[#FACC15]/10 rounded-none blur-3xl -mr-36 -mt-36"></div>

                                    <div className="relative z-10 space-y-10">
                                        <div className="flex items-center gap-3 text-black dark:text-[#FACC15] mb-2">
                                            <Zap size={16} fill="currentColor" className="animate-pulse" />
                                            <span className="text-[11px] font-black uppercase tracking-[0.4em]">{formData.paymentType === 'partial' ? 'Deposit Payment' : 'Immediate Payment'}</span>
                                        </div>
                                        <div className="text-5xl md:text-8xl font-black leading-none tracking-tighter flex items-center gap-4 uppercase">
                                            <span className="text-2xl md:text-3xl font-black text-slate-400">
                                                {(rates?.[currency]) ? currentSymbol : 'Rs'}
                                            </span>
                                            <span className="text-black dark:text-white">
                                                {payNow.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                {/* Multi-Currency Grid */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-px flex-1 bg-white/10"></div>
                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] whitespace-nowrap">Global Pricing</span>
                                        <div className="h-px flex-1 bg-white/10"></div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {convertToAllCurrencies(totalPrice / (rates?.[currency] || 1)).map((c) => (
                                            <button
                                                key={c.code}
                                                type="button"
                                                onClick={() => changeCurrency(c.code)}
                                                className={`px-3 py-2 rounded-none border-2 transition-all flex items-center gap-2 text-left cursor-pointer group/curr ${currency === c.code
                                                    ? 'bg-[#FACC15] border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                                                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 text-slate-400 hover:text-white'
                                                    }`}
                                            >
                                                <div className="w-4 h-4 rounded-none overflow-hidden shrink-0 border border-black/20 bg-white p-px">
                                                    <img src={c.flag} alt={c.code} className="w-full h-full object-cover rounded-none" />
                                                </div>
                                                <span className="text-[9px] font-black uppercase tracking-widest">{c.code}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Detailed Breakdown & Coupons */}
                                <div className="space-y-4 bg-slate-50 dark:bg-white/5 p-6 rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">

                                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                                    <span>Fare Subtotal</span>
                                    <span className="text-black dark:text-white">{currentSymbol} {subtotal.toLocaleString()}</span>
                                </div>
 
                                {detailedBreakdown.detailedExtras?.map((s, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                                        <span>{s.label}</span>
                                        <span className="text-black dark:text-white">+{currentSymbol} {s.value.toLocaleString()}</span>
                                    </div>
                                ))}
 
                                {detailedBreakdown.discounts > 0 && (
                                    <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500 bg-white dark:bg-black/40 p-4 rounded-none border-4 border-emerald-500/20 shadow-[4px_4px_0px_0px_rgba(16,185,129,0.1)]">
                                        <div className="flex items-center gap-3">
                                            <Tag size={14} className="animate-pulse" />
                                            <span>
                                                {detailedBreakdown.appliedCoupons?.length > 0 ? `Code applied` : 'Special Discount'}
                                            </span>
                                        </div>
                                        <span className="font-black">-{currentSymbol} {detailedBreakdown.discounts.toLocaleString()}</span>
                                    </div>
                                )}

                                {detailedBreakdown.appliedCoupons?.length > 0 && (
                                    <div className="pt-3 border-t border-slate-200 dark:border-white/10">
                                        <div className="flex flex-wrap gap-2">
                                            {detailedBreakdown.appliedCoupons.map((c, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-black text-[#FACC15] text-[9px] font-black uppercase tracking-widest rounded-none flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border border-black">
                                                    <Check size={10} strokeWidth={4} /> {c.code || c}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            </div>

                            <div className="flex flex-col items-center justify-center gap-2 mt-4">
                                <div className="flex items-center gap-1.5 text-emerald-800">
                                    <ShieldCheck size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-900">Taxes Included • Tolls Excluded</span>
                                </div>
                            </div>
                        </div>
                    )}

                {step === 2 && (
                        <div className="animate-slide-up">
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h3 className="text-3xl md:text-5xl font-black text-black dark:text-white tracking-tighter uppercase leading-none mb-3">Final <span className="text-slate-400 dark:text-yellow-400">Checkout</span></h3>
                                    <p className="text-[10px] md:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">Instant Confirmation • Secure Payment</p>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-12 gap-10">
                                {/* Left Column: Client Info & Logistics */}
                                <div className="lg:col-span-7 space-y-12">
                                    {!session && (
                                        <div className="bg-[#FACC15] border-4 border-black p-8 rounded-none flex items-center justify-between relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                            <div className="flex items-center gap-6 relative z-10">
                                                <div className="w-14 h-14 rounded-none border-2 border-black bg-black flex items-center justify-center text-[#FACC15] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"><User size={28} /></div>
                                                <div>
                                                    <p className="text-sm font-black text-black uppercase tracking-widest">Personal Account?</p>
                                                    <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em] mt-1">Unlock priority support & booking history.</p>
                                                </div>
                                            </div>
                                            <button onClick={() => signIn()} className="relative z-10 px-10 py-4 bg-black rounded-none border-4 border-black text-xs font-black text-[#FACC15] hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">Sign In</button>
                                        </div>
                                    )}

                                    {/* Redundant Logistics Adjustment Removed as per User Request */}

                                    <div className="space-y-10">
                                        <div className="grid md:grid-cols-2 gap-8">
                                            {[
                                                { label: 'Full Legal Name', key: 'name', type: 'text', placeholder: 'Passenger Name', icon: User },
                                                { label: 'Email Address', key: 'email', type: 'email', placeholder: 'for confirmation', icon: Mail },
                                                { label: 'Primary Contact No', key: 'phone', type: 'tel', placeholder: '+94 XXX XXX XXX', icon: Phone },
                                                { label: 'WhatsApp Number', key: 'whatsapp', type: 'tel', placeholder: 'For driver chat', icon: MessageSquare },
                                            ].map(f => (
                                                <div key={f.key} className="space-y-3">
                                                     <label className={`text-[10px] font-black uppercase tracking-[0.3em] pl-3 flex items-center gap-2 ${errors[f.key] ? 'text-red-500' : 'text-black dark:text-white'}`}>
                                                         <f.icon size={12} /> {f.label}
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
                                                             inputClassName="!w-full !h-14 !bg-transparent !border-none !px-4 !outline-none focus:!ring-0 !font-black !text-black dark:!text-white placeholder:!text-black/20 dark:placeholder:!text-white/20 !text-sm !uppercase !tracking-widest"
                                                             countrySelectorStyleProps={{
                                                                 buttonClassName: '!h-14 !bg-slate-50 dark:!bg-white/5 !border-r-2 !border-black !px-4 !flex !items-center !justify-center !min-w-[70px] !rounded-none',
                                                                 flagClassName: '!w-8 !h-auto !shadow-sm',
                                                                 dropdownStyleProps: {
                                                                     className: '!z-[20000] !min-w-[200px] !max-h-[300px] !rounded-none !border-4 !border-black !shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] !bg-white dark:!bg-black dark:!text-white'
                                                                 }
                                                             }}
                                                             className={`w-full bg-white dark:bg-white/5 border-4 rounded-none flex focus-within:border-[#FACC15] transition-all overflow-visible ${errors[f.key] ? 'border-red-500 animate-shake' : 'border-black'}`}
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
                                                             className={`w-full h-14 bg-white dark:bg-white/5 border-4 px-8 rounded-none outline-none focus:border-[#FACC15] transition-all font-black text-black dark:text-white placeholder:text-black/20 dark:placeholder:text-white/20 text-sm uppercase tracking-widest ${errors[f.key] ? 'border-red-500 animate-shake' : 'border-black'}`}
                                                             placeholder={f.placeholder}
                                                         />
                                                     )}
                                                 </div>
                                            ))}
                                        </div>

                                        <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-white/5">
                                             <h4 className="text-[10px] font-black text-black dark:text-white uppercase tracking-[0.3em] pl-2 flex items-center gap-3">
                                                 <CreditCard size={14} /> Billing Details
                                             </h4>
                                             <div className="grid md:grid-cols-2 gap-8">
                                                 <input
                                                     type="text"
                                                     value={formData.billingName || ''}
                                                     onChange={e => setFormData({ ...formData, billingName: e.target.value })}
                                                     className={`w-full h-14 bg-white dark:bg-white/5 border-4 px-8 rounded-none text-sm font-black text-black dark:text-white placeholder:text-black/20 dark:placeholder:text-white/20 uppercase tracking-widest outline-none focus:border-[#FACC15] border-black`}
                                                     placeholder="Billing Name"
                                                 />
                                                 <input
                                                     type="text"
                                                     value={formData.billingCountry || ''}
                                                     onChange={e => setFormData({ ...formData, billingCountry: e.target.value })}
                                                     className={`w-full h-14 bg-white dark:bg-white/5 border-4 px-8 rounded-none text-sm font-black text-black dark:text-white placeholder:text-black/20 dark:placeholder:text-white/20 uppercase tracking-widest outline-none focus:border-[#FACC15] border-black`}
                                                     placeholder="Country"
                                                 />
                                                 <textarea
                                                     rows="3"
                                                     value={formData.billingAddress}
                                                     onChange={e => setFormData({ ...formData, billingAddress: e.target.value })}
                                                     className={`md:col-span-2 w-full px-8 py-5 bg-white dark:bg-white/5 border-4 px-8 rounded-none text-sm font-black text-black dark:text-white placeholder:text-black/20 dark:placeholder:text-white/20 resize-none uppercase tracking-widest outline-none focus:border-[#FACC15] border-black`}
                                                     placeholder="Full Billing Address"
                                                 ></textarea>
                                             </div>
                                          </div>
                                     </div>
                                </div>
                                    {/* Right Column: Summary & Payment */}
                                    <div className="lg:col-span-5 space-y-8">
                                        <div className="p-8 md:p-10 bg-white dark:bg-[#111] rounded-none text-black dark:text-white border-4 border-black relative overflow-hidden group border-t-[12px] border-t-[#FACC15]">
                                            <div className="absolute top-0 right-0 w-48 h-48 bg-[#FACC15]/5 rounded-none blur-[80px] -mr-24 -mt-24"></div>

                                            <div className="relative z-10 space-y-8">
                                                <div className="flex items-center justify-between pb-6 border-b-2 border-black/5 dark:border-white/10">
                                                    <div className="px-5 py-2 bg-black text-[#FACC15] rounded-none border-2 border-black text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                                        Route Confirmed
                                                    </div>
                                                    <div className="text-[10px] font-black text-black/40 dark:text-white/40 uppercase tracking-[0.3em]">
                                                        {formData.tripType.replace('-', ' ')}
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="flex gap-5">
                                                        <div className="w-10 h-10 rounded-none bg-black text-[#FACC15] flex items-center justify-center shrink-0 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"><MapPin size={20} /></div>
                                                        <div className="min-w-0">
                                                            <p className="text-[9px] font-black text-black/30 dark:text-white/40 uppercase tracking-[0.4em] mb-1.5">Pick up</p>
                                                            <p className="text-xs font-black text-black dark:text-white leading-tight uppercase font-black">{formData.pickup}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-5">
                                                        <div className="w-10 h-10 rounded-none bg-[#FACC15] text-black flex items-center justify-center shrink-0 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"><Navigation size={20} /></div>
                                                        <div className="min-w-0">
                                                            <p className="text-[9px] font-black text-black/30 dark:text-white/40 uppercase tracking-[0.4em] mb-1.5">Drop off</p>
                                                            <p className="text-xs font-black text-black dark:text-white leading-tight uppercase font-black">{formData.dropoff}</p>
                                                        </div>
                                                    </div>
                                                    {formData.hasNameBoard && (
                                                      <div className="flex gap-5 bg-slate-50 dark:bg-white/5 p-4 rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                                             <div className="w-12 h-12 rounded-none bg-white flex items-center justify-center shrink-0 border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                                                 <Signpost size={28} className="text-black" strokeWidth={3} />
                                                             </div>
                                                            <div className="min-w-0">
                                                                <p className="text-[9px] font-black text-black dark:text-[#FACC15] uppercase tracking-[0.4em] mb-1">Airport Greeting</p>
                                                                <p className="text-[10px] font-black text-black dark:text-white uppercase truncate">"{formData.nameBoardText || 'Elite Greeting'}"</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-4 pt-8 mt-4 border-t-2 border-black/5 dark:border-white/10">
                                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">
                                                        <span>Base Fare</span>
                                                        <span className="text-black dark:text-white">{currentSymbol} {subtotal.toLocaleString()}</span>
                                                    </div>

                                                    {detailedBreakdown.detailedExtras?.filter(s => s.value > 0).map((s, idx) => (
                                                        <div key={idx} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">
                                                            <span>{s.label}</span>
                                                            <span className="text-emerald-600 font-black">+{currentSymbol} {s.value.toLocaleString()}</span>
                                                        </div>
                                                    ))}

                                                    {detailedBreakdown.discounts > 0 && (
                                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-amber-600">
                                                            <span>Special discount</span>
                                                            <span className="font-black">-{currentSymbol} {detailedBreakdown.discounts.toLocaleString()}</span>
                                                        </div>
                                                    )}

                                                    <div className="pt-8 mt-4 border-t-4 border-black flex justify-between items-end">
                                                        <div>
                                                            <p className="text-[11px] font-black text-[#FACC15] dark:text-yellow-400 bg-black px-3 py-1 mb-3 w-fit">
                                                                {formData.paymentType === 'partial' ? 'Secure Deposit (50%)' : 'Total Amount'}
                                                            </p>
                                                            <p className="text-6xl font-black tracking-tighter text-black dark:text-white leading-none">
                                                                <span className="text-xl font-black mr-2 text-slate-400">{currentSymbol}</span>
                                                                {payNow.toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[9px] font-black text-black/30 dark:text-white/40 uppercase tracking-[0.3em] mb-2">Fleet Tier</p>
                                                            <p className="text-xs font-black text-black dark:text-white uppercase tracking-tighter">{displayVehicleName(selectedVehicle?.name)}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Disclaimer Section */}
                                                    <div className="pt-4 mt-2 text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider leading-relaxed">
                                                        * Note: Highway tickets are not included and must be paid by the customer.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    {/* Payment Selection */}
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] pl-2">Select Method</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {['cash', 'card'].map(m => (
                                                <button
                                                    key={m}
                                                    onClick={() => setFormData(prev => ({
                                                        ...prev,
                                                        paymentMethod: m,
                                                        paymentType: m === 'cash' ? 'full' : prev.paymentType
                                                    }))}
                                                    className={`p-6 rounded-none border-4 transition-all flex flex-col items-center gap-4 group/pm ${formData.paymentMethod === m
                                                        ? 'border-black bg-[#FACC15]'
                                                        : 'border-black/5 dark:border-white/5 bg-white dark:bg-white/[0.02] opacity-40 hover:opacity-100 hover:border-black'}`}
                                                >
                                                    <div className={`w-12 h-12 rounded-none flex items-center justify-center text-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover/pm:scale-110 ${formData.paymentMethod === m ? 'bg-black' : 'bg-slate-100 dark:bg-white/10'}`}>
                                                        {m === 'cash' ? <Coins size={24} className={formData.paymentMethod === m ? 'text-[#FACC15]' : 'text-slate-400'} /> : <CreditCard size={24} className={formData.paymentMethod === m ? 'text-[#FACC15]' : 'text-slate-400'} />}
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black dark:text-white">{m === 'cash' ? 'Pay Cash to Driver' : 'Online Secure Pay'}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                        {formData.paymentMethod === 'card' && (
                                            <div className="grid grid-cols-2 gap-4 p-2 bg-slate-100 dark:bg-white/5 rounded-none border-4 border-black">
                                                {['full', 'partial'].map(t => (
                                                    <button
                                                        key={t}
                                                        onClick={() => setFormData(prev => ({ ...prev, paymentType: t }))}
                                                        className={`py-4 rounded-none text-[10px] font-black uppercase tracking-widest transition-all ${formData.paymentType === t
                                                            ? 'bg-black dark:bg-[#FACC15] text-white dark:text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_#FACC15]'
                                                            : 'text-slate-400 hover:text-black dark:hover:text-white'}`}
                                                    >
                                                        {t === 'full' ? 'Complete 100%' : 'Deposit 50%'}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            <div className="flex-1 bg-white dark:bg-white/5 border-2 border-black p-1 rounded-none flex gap-2">
                                                <input
                                                    value={couponInput}
                                                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                                                    placeholder="COUPON?"
                                                    className="flex-1 h-9 bg-white dark:bg-black border border-black/10 px-4 rounded-none text-[9px] font-black uppercase tracking-widest outline-none focus:border-[#FACC15] text-black dark:text-white"
                                                />
                                                <button
                                                    onClick={() => handleApplyCoupon()}
                                                    disabled={couponLoading || !couponInput}
                                                    className="px-6 bg-[#FACC15] text-black rounded-none border border-black text-[9px] font-black uppercase tracking-widest disabled:opacity-20 active:scale-95 transition-all"
                                                >
                                                    {couponLoading ? <Loader2 className="animate-spin" size={12} /> : 'Apply'}
                                                </button>
                                            </div>
                                        </div>
                                        {verifiedCoupons.length > 0 && (
                                            <div className="flex flex-wrap gap-2 px-2">
                                                {verifiedCoupons.map((c, i) => (
                                                    <span key={i} className="px-4 py-2 bg-[#FACC15] text-black rounded-none border-2 border-black text-[9px] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3 animate-slide-in">
                                                        <Tag size={12} fill="currentColor" /> {c.code}
                                                        <X size={14} className="cursor-pointer hover:rotate-90 transition-transform" onClick={() => setVerifiedCoupons(prev => prev.filter(vc => vc.code !== c.code))} />
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-4 pb-6 md:p-10 md:pb-10 pt-3 md:pt-6 border-t-4 border-black bg-white/80 dark:bg-black/80 backdrop-blur-3xl shrink-0 transition-colors">
                    <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-6 md:gap-6">
                        <button
                            onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
                            className="flex items-center justify-center gap-2 md:gap-4 px-6 md:px-10 py-2.5 md:py-5 bg-white dark:bg-white/5 rounded-none text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] hover:bg-slate-50 dark:hover:bg-white/10 transition-all text-black dark:text-white border-4 border-black w-full md:w-auto md:min-w-[180px] active:scale-95"
                        >
                            <ChevronLeft size={16} className="md:w-4 md:h-4" /> {step === 1 ? 'Cancel Trip' : 'Return Back'}
                        </button>
 
                        {step < 2 ? (
                            <button
                                onClick={() => {
                                     if (validateForm(1)) {
                                         setStep(step + 1);
                                         if (modalContentRef.current) modalContentRef.current.scrollTop = 0;
                                     } else {
                                         scrollToFirstError();
                                     }
                                 }}
                                 disabled={isOverCapacity}
                                 className="group flex items-center justify-center gap-2 md:gap-4 px-6 md:px-12 py-2.5 md:py-5 bg-[#FACC15] text-black rounded-none text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] hover:bg-[#EAB308] hover:scale-105 transition-all outline-none border-4 border-black disabled:opacity-30 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full md:w-auto md:min-w-[220px] active:scale-95"
                            >
                                Review & Checkout <ChevronRight size={16} className="md:w-4 md:h-4 group-hover:translate-x-2 transition-transform" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                 disabled={loading || isOverCapacity}
                                 className="group flex items-center justify-center gap-2 md:gap-4 px-6 md:px-12 py-2.5 md:py-5 bg-[#FACC15] text-black rounded-none text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] hover:scale-105 transition-all border-4 border-black disabled:opacity-30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full md:w-auto md:min-w-[240px] active:scale-95"
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} className="md:w-4 md:h-4" fill="currentColor" />}
                                {loading ? 'Securing Spot...' : 'Confirm My Order'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


