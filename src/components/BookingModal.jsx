'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { X, MapPin, User, Users, CreditCard, Calendar, Clock, Phone, Mail, ChevronRight, ChevronLeft, Check, Loader2, Car, Navigation, ShieldCheck, Zap, Signpost, Tag, Briefcase, ShoppingBag, Info, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import { useCurrency } from '../context/CurrencyContext';
import { calculateBasePrice, calculateSurcharges, calculatePaymentFees } from '../lib/pricing-util';
import LocationInput from './LocationInput';
import CustomDateTimePicker from './CustomDateTimePicker';

const STEPS = [
    { id: 1, title: 'Route & Vehicle', icon: MapPin },
    { id: 2, title: 'Checkout & Pay', icon: CreditCard },
];


export default function BookingModal({ isOpen, onClose, initialData = {}, pricingCategory = 'airport-transfer' }) {
    const { data: session } = useSession();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasAgreed, setHasAgreed] = useState(false);
    const [pricing, setPricing] = useState([]);
    const [distance, setDistance] = useState(0);
    const [verifiedCoupons, setVerifiedCoupons] = useState(initialData.verifiedCoupons || (initialData.verifiedCoupon ? [initialData.verifiedCoupon] : []));
    const [couponInput, setCouponInput] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [pricingSettings, setPricingSettings] = useState({ longDistanceThreshold: 175, longDistanceDiscountPercentage: 10, isActive: true });
    const [destinations, setDestinations] = useState([]);

    useEffect(() => {
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
    }, []);

    // Body Scroll Lock
    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            const originalTouchAction = document.body.style.touchAction;
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
            return () => {
                document.body.style.overflow = originalOverflow;
                document.body.style.touchAction = originalTouchAction;
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
        waitingHours: initialData.waitingHours || 0,
        hasNameBoard: initialData.hasNameBoard || false,
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

    const [infoVehicle, setInfoVehicle] = useState(null);

    const handleApplyCoupon = async (codeToApply = couponInput, contextPickup = formData.pickup, contextDropoff = formData.dropoff) => {
        const input = (codeToApply || '').trim();
        if (!input) return;

        // Validation: Must be from Airport
        // Note: We allow adding it, but it wont apply in price calc if not from airport. 
        // Better UX: Warn here if not from airport.
        if (!contextPickup.toLowerCase().includes('airport')) {
            if (!codeToApply) alert('Coupons are only valid for trips starting from the Airport.');
            // We still proceed to validate code exists, but user knows it won't apply yet.
            // Or we strict block? Let's strict block for clarity.
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
        return SUPPORTED_CURRENCIES.map(c => ({
            ...c,
            value: Math.ceil(amountLKR * (rates?.[c.code] || 1))
        }));
    };

    const getPriceBreakdown = () => {
        try {
            const vehicleData = pricing.find(p => p.vehicleType === formData.vehicle);
            if (!vehicleData || distance === 0) return { total: 0, subtotal: 0, surcharges: 0, payNow: 0, balance: 0, lkr: { total: 0, payNow: 0, balance: 0, surcharges: 0, subtotal: 0 }, originalLKR: 0 };

            const distKm = Math.ceil(distance || 0);
            const baseTotal = calculateBasePrice(distKm, vehicleData, formData.tripType, formData.pickup, formData.dropoff, destinations);
            const surcharges = calculateSurcharges({
                waitingHours: formData.waitingHours,
                hasNameBoard: formData.hasNameBoard
            }, vehicleData);

            // Payment Method Surcharges per User Request
            // 1. Calculate for the current display currency (for UI)
            const paymentSurcharge = calculatePaymentFees(baseTotal + surcharges, formData.paymentMethod, currency, formData.vehicle);

            // 2. Calculate for LKR (for backend storage/consistency)
            const paymentSurchargeLKR = calculatePaymentFees(baseTotal + surcharges, formData.paymentMethod, 'LKR', formData.vehicle);

            let total = baseTotal + surcharges + paymentSurcharge; // Total in current currency context (mixed if rates missing, resolved below)

            // Coupon Logic (Stacking Rules & Auto-Discounts)
            const isAirportPickup = initialData.isAirportPickup || formData.pickup?.toLowerCase().includes('airport') || formData.dropoff?.toLowerCase().includes('airport');

            let couponDiscountAmount = 0;
            if (verifiedCoupons && verifiedCoupons.length > 0) {
                // If it's an airport transfer OR the coupon isn't restricted to airport, apply it
                verifiedCoupons.forEach(coupon => {
                    if (!coupon.airportOnly || isAirportPickup) { // Apply if not airportOnly OR if it is airport pickup
                        const couponVal = Number(coupon.value) || 0;
                        if (coupon.discountType === 'percentage') {
                            couponDiscountAmount += total * (couponVal / 100);
                        } else {
                            couponDiscountAmount += couponVal;
                        }
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
                { label: 'Waiting Time', value: roundFn(calculateSurcharges({ waitingHours: formData.waitingHours, hasNameBoard: false }, vehicleData) * rate) },
                { label: 'Name Board', value: roundFn(calculateSurcharges({ waitingHours: 0, hasNameBoard: formData.hasNameBoard }, vehicleData) * rate) }
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
                    total: Math.ceil(baseTotal + surcharges + paymentSurchargeLKR - finalDiscount),
                    payNow: Math.ceil((formData.paymentType === 'partial' ? (baseTotal + surcharges + paymentSurchargeLKR - finalDiscount) * 0.5 : (baseTotal + surcharges + paymentSurchargeLKR - finalDiscount))),
                    balance: Math.ceil((baseTotal + surcharges + paymentSurchargeLKR - finalDiscount) - (formData.paymentType === 'partial' ? (baseTotal + surcharges + paymentSurchargeLKR - finalDiscount) * 0.5 : (baseTotal + surcharges + paymentSurchargeLKR - finalDiscount))),
                    surcharges: Math.ceil(surcharges),
                    paymentFee: Math.ceil(paymentSurchargeLKR),
                    subtotal: Math.ceil(baseTotal),
                    discounts: Math.ceil(finalDiscount)
                },
                originalLKR: baseTotal + surcharges + paymentSurchargeLKR - finalDiscount
            };
        } catch (err) {
            console.error("Price logic error:", err);
            return { total: 0, subtotal: 0, surcharges: 0, payNow: 0, balance: 0, lkr: { total: 0, payNow: 0, balance: 0, surcharges: 0, subtotal: 0 }, originalLKR: 0 };
        }
    };

    // Extract calculated values for render
    // Memoize the price breakdown to ensure reactivity and performance
    const { total: totalPrice, subtotal, surcharges, payNow, balance: balanceAmount, ...detailedBreakdown } = useMemo(() => {
        return getPriceBreakdown();
    }, [formData, pricing, verifiedCoupons, currency, rates, pricingSettings, distance]);

    const selectedVehicle = pricing.find(p => p.vehicleType === formData.vehicle);
    const totalPassengers = (formData.passengerCount.adults || 0) + (formData.passengerCount.children || 0);
    const isOverCapacity = selectedVehicle && totalPassengers > (selectedVehicle.capacity || 4);

    // 1. Initialize State from initialData (Once) - FIX: Added condition to skip if already initialized to preserve state
    const isInitialized = useRef(false);
    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0 && !isInitialized.current) {
            setFormData(prev => ({ ...prev, ...initialData }));
            if (initialData.verifiedCoupons) {
                setVerifiedCoupons(initialData.verifiedCoupons);
            }
            if (initialData.couponCode) {
                setCouponInput(initialData.couponCode);
            }
            isInitialized.current = true;
        }
    }, [initialData]);

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
            // Reset distance if coords changed to avoid showing old prices from previous trip
            if (initialData.distance) {
                setDistance(initialData.distance);
            } else {
                setDistance(0);
            }

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

    }, [isOpen, initialData, pricingCategory]);

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

    const handleSubmit = async () => {
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
                    lng: formData.pickupCoords?.lon || null
                },
                dropoffLocation: {
                    address: formData.dropoff,
                    lat: formData.dropoffCoords?.lat || null,
                    lng: formData.dropoffCoords?.lon || null
                },
                waypoints: formData.waypoints.map(wp => ({
                    address: wp.name,
                    lat: wp.lat,
                    lng: wp.lon
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
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-0 sm:p-4 overflow-hidden touch-none overscroll-none backdrop-blur-md">
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
            <div id="modal-container" className="bg-white w-full h-full sm:h-auto sm:max-h-[95vh] sm:rounded-[2rem] sm:border sm:border-emerald-900/10 shadow-2xl sm:max-w-4xl overflow-hidden flex flex-col animate-slide-up relative">
                {/* Coupon Verification Notification - Moved to Bottom */}
                <AnimatePresence>
                    {couponLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-[10010] bg-emerald-900 border border-emerald-700/50 text-white px-6 py-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center gap-3 backdrop-blur-xl"
                        >
                            <Loader2 className="animate-spin text-amber-400" size={18} />
                            <span className="text-xs font-black uppercase tracking-widest">Verifying code...</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                {/* Header - Hidden in Step 2 */}
                {step !== 2 && (
                    <div className="p-4 md:p-8 pb-3 md:pb-4 flex items-center justify-between shrink-0 pt-8 sm:pt-4">
                        <div className="flex items-center gap-2 md:gap-4 min-w-0">
                            <div className="w-8 h-8 md:w-12 md:h-12 bg-amber-500/10 rounded-lg md:rounded-xl flex items-center justify-center border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)] shrink-0">
                                <Zap size={18} className="text-amber-500 fill-amber-500 md:w-[22px] md:h-[22px]" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-lg md:text-2xl font-black tracking-tight text-slate-900 leading-none truncate uppercase">Secure <span className="text-emerald-600">Booking</span></h2>
                                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Encrypted Payment</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-900/10 hover:bg-red-50 hover:text-red-600 transition-colors z-[101]">
                            <X size={22} />
                        </button>
                    </div>
                )}

                {/* Progress Indicators */}
                <div className="px-5 md:px-8 py-4 flex gap-2">
                    {STEPS.map((s) => (
                        <div key={s.id} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s.id ? 'bg-emerald-900' : 'bg-emerald-50'}`}></div>
                    ))}
                </div>

                {/* Main Viewport */}
                <div ref={modalContentRef} className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar overscroll-contain">
                    {step === 1 && (
                        <div className="space-y-6 md:space-y-8 animate-slide-up">
                            {/* Trip Header */}
                            <div className="flex flex-wrap bg-emerald-50 p-1.5 rounded-2xl border border-emerald-900/10 w-full md:w-fit gap-2">
                                {['one-way', 'round-trip'].map(t => (
                                    <button key={t} onClick={() => setFormData({ ...formData, tripType: t })} className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${formData.tripType === t ? 'bg-emerald-900 text-white shadow-sm' : 'text-emerald-900/40 hover:text-emerald-900'}`}>{t.replace('-', ' ')}</button>
                                ))}
                            </div>

                            {/* Location Inputs */}
                            <div className="space-y-4 bg-white p-4 rounded-2xl border border-emerald-900/10 shadow-sm">
                                <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-widest pl-1 mb-2">My Journey</h3>
                                <div className="space-y-4">
                                    <LocationInput
                                        label="Pick-Up Location"
                                        icon={MapPin}
                                        placeholder="Enter pickup (e.g. Airport)"
                                        value={formData.pickup}
                                        onSelect={(loc) => setFormData(prev => ({ ...prev, pickup: loc.address, pickupCoords: loc.lat ? { lat: loc.lat, lon: loc.lon } : null }))}
                                    />

                                    {/* Waypoints */}
                                    {formData.waypoints.map((wp, i) => (
                                        <div key={i} className="relative group">
                                            <div className="absolute left-4 top-9 text-emerald-900/40"><Navigation size={20} /></div>
                                            <label className="text-[10px] font-bold text-emerald-900/50 uppercase tracking-widest pl-1 mb-1 block">Stop {i + 1}</label>
                                            <div className="w-full pl-12 pr-4 py-3.5 bg-emerald-50/50 rounded-xl border border-emerald-900/10 text-sm font-bold text-emerald-900">
                                                {wp.name}
                                            </div>
                                            {/* Connecting Line */}
                                            <div className="absolute left-6 -top-4 w-0.5 h-8 bg-emerald-900/10 -z-10"></div>
                                        </div>
                                    ))}

                                    <div className="relative">
                                        {/* Connecting Line if waypoints exist */}
                                        {formData.waypoints.length > 0 && <div className="absolute left-6 -top-4 w-0.5 h-8 bg-emerald-900/10 -z-10"></div>}
                                        <LocationInput
                                            label="Drop-Off Location"
                                            icon={Navigation}
                                            placeholder="Enter destination (e.g. Hotel)"
                                            value={formData.dropoff}
                                            onSelect={(loc) => setFormData(prev => ({ ...prev, dropoff: loc.address, dropoffCoords: loc.lat ? { lat: loc.lat, lon: loc.lon } : null }))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest pl-2">Vehicle Category</label>
                                    <div className="grid grid-cols-1 gap-4">
                                        {pricingData.map((v) => {
                                            const totalPax = (formData.passengerCount?.adults || 0) + (formData.passengerCount?.children || 0);
                                            const totalLuggage = formData.passengerCount?.luggage || 0;
                                            const isFit = totalPax <= v.capacity && totalLuggage <= (v.luggage || 0);
                                            const isSelected = formData.vehicle === v.vehicleType;

                                            if (!isFit && !isSelected) return null;

                                            return (
                                                <button
                                                    key={v.vehicleType}
                                                    onClick={() => isFit && setFormData({ ...formData, vehicle: v.vehicleType })}
                                                    className={`group/card relative w-full p-6 rounded-[2rem] border-2 transition-all cursor-pointer overflow-hidden flex flex-col gap-4 text-left
                                                        ${isSelected ? 'border-amber-500 bg-amber-50/30 shadow-xl' : 'border-black/20 bg-white hover:border-black/40'}
                                                        ${!isFit ? 'opacity-40 grayscale pointer-events-none' : ''}
                                                    `}
                                                >
                                                    {/* Selection Glow */}
                                                    {isSelected && (
                                                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none"></div>
                                                    )}

                                                    {/* Header info */}
                                                    <div className="flex items-center gap-5">
                                                        {/* Image Box */}
                                                        <div className="w-24 md:w-32 h-20 md:h-24 bg-slate-50 rounded-2xl flex items-center justify-center p-3 shrink-0 overflow-hidden border border-black/5 relative group-hover/card:bg-slate-100 transition-colors">
                                                            {v.image ? (
                                                                <img src={v.image} alt={v.name} className="w-full h-full object-contain transition-transform duration-500 group-hover/card:scale-110" />
                                                            ) : (
                                                                <Car className="text-slate-300" size={36} />
                                                            )}
                                                        </div>

                                                        {/* Title & Badge Container */}
                                                        <div className="flex-1 min-w-0">
                                                            {/* Badge for AC - Moved here to avoid overlap */}
                                                            <div className="inline-flex bg-amber-100/90 backdrop-blur-sm text-amber-900 text-[8px] md:text-[9px] font-black px-2.5 py-0.5 rounded-lg mb-2 uppercase items-center gap-1 shadow-sm border border-amber-200">
                                                                <Zap size={10} fill="currentColor" /> Premium A/C
                                                            </div>
                                                            <h4 className="text-lg md:text-2xl font-black text-slate-900 uppercase tracking-tight leading-tight mb-1">{v.name}</h4>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Professional Service</p>
                                                        </div>
                                                    </div>

                                                    {/* New Redesigned Capacity Grid */}
                                                    <div className="grid grid-cols-2 gap-3 mt-1">
                                                        <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-black/10 shadow-sm">
                                                            <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-amber-600">
                                                                <Users size={16} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Capacity</p>
                                                                <p className="text-sm font-black text-slate-900 leading-none">{v.capacity} <span className="text-[9px] text-slate-500 font-bold uppercase ml-0.5">Persons</span></p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-black/10 shadow-sm">
                                                            <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-amber-600">
                                                                <Briefcase size={16} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Luggage</p>
                                                                <p className="text-sm font-black text-slate-900 leading-none">{v.luggage || 0} <span className="text-[9px] text-slate-500 font-bold uppercase ml-0.5">Luggages</span></p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Included Perks */}
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {['100% A/C', 'Water Bottles', 'Hand Sanitizer', 'English Chauffeur'].slice(0, 3).map(f => (
                                                            <div key={f} className="flex items-center gap-1.5 text-[9px] font-black uppercase text-emerald-600 tracking-wider bg-emerald-50 px-2 py-1 rounded-lg">
                                                                <Check size={10} /> {f}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest pl-2">Passenger & Luggage</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {[
                                            { id: 'adults', label: 'Adults', icon: Users },
                                            { id: 'children', label: 'Children', icon: User },
                                            { id: 'luggage', label: 'Luggage', icon: Briefcase }, // Large Luggage
                                            { id: 'handLuggage', label: 'Hand Luggage', icon: Briefcase } // Small/Hand
                                        ].map((field) => (
                                            <div key={field.id} className="bg-white border border-emerald-900/10 p-3 md:p-4 rounded-xl flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-900/40">
                                                        {field.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => setFormData({
                                                            ...formData,
                                                            passengerCount: {
                                                                ...formData.passengerCount,
                                                                [field.id]: Math.max(0, formData.passengerCount[field.id] - 1)
                                                            }
                                                        })}
                                                        className="text-emerald-600 font-bold text-lg w-8 h-8 flex items-center justify-center bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                                                    >-</button>
                                                    <span className="font-bold text-sm min-w-[1rem] text-center text-emerald-900">{formData.passengerCount[field.id]}</span>
                                                    <button
                                                        onClick={() => setFormData({
                                                            ...formData,
                                                            passengerCount: {
                                                                ...formData.passengerCount,
                                                                [field.id]: formData.passengerCount[field.id] + 1
                                                            }
                                                        })}
                                                        className="text-emerald-600 font-bold text-lg w-8 h-8 flex items-center justify-center bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                                                    >+</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-white border border-emerald-900/10 rounded-2xl shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-900">
                                                    <Clock size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-emerald-900 uppercase tracking-widest leading-none">Arrival Time</p>
                                                    <p className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest mt-1">Flight landing time</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-emerald-900 leading-none">
                                                    {(formData.arrivalDate && !isNaN(new Date(formData.arrivalDate).getTime())) ? new Date(formData.arrivalDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : '---'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {isOverCapacity && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-pulse">
                                            <div className="pt-0.5 text-red-600"><Briefcase size={14} /></div>
                                            <p className="text-[10px] font-bold text-red-900 leading-tight uppercase tracking-widest">
                                                Capacity Exceeded: {totalPassengers} Pax (Max {selectedVehicle.capacity})
                                            </p>
                                        </div>
                                    )}

                                    <div className="pt-2">
                                        <button
                                            onClick={() => setFormData({ ...formData, hasNameBoard: !formData.hasNameBoard })}
                                            className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${formData.hasNameBoard ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm' : 'bg-white border-emerald-900/10 text-emerald-900/60 hover:bg-emerald-50/50'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Signpost size={18} className={formData.hasNameBoard ? 'text-emerald-600' : ''} />
                                                <div className="text-left">
                                                    <span className="text-[10px] md:text-xs font-bold block uppercase tracking-tight">Name Board</span>
                                                    <span className="text-[8px] font-medium opacity-60">Driver waits with name sign</span>
                                                </div>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.hasNameBoard ? 'border-emerald-600 bg-emerald-600' : 'border-emerald-900/20'}`}>
                                                {formData.hasNameBoard && <Check size={12} className="text-white" />}
                                            </div>
                                        </button>
                                    </div>

                                    {formData.hasNameBoard && (
                                        <div className="space-y-2 mt-4">
                                            <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest pl-2">Board Text</label>
                                            <input type="text" value={formData.nameBoardText} onChange={e => setFormData({ ...formData, nameBoardText: e.target.value })} className="w-full h-12 bg-white border border-emerald-900/10 px-6 rounded-xl outline-none focus:border-emerald-600 transition-all font-bold text-xs text-emerald-900" placeholder="Greeting text..." />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 md:p-8 bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-[2.5rem] text-white flex flex-col shadow-2xl gap-8 relative overflow-hidden group">
                                {/* Decorative Background Glow */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>

                                <div className="relative z-10 space-y-8">
                                    <div className="flex items-center gap-2 text-amber-500 mb-2">
                                        <Zap size={14} fill="currentColor" className="animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{formData.paymentType === 'partial' ? 'Deposit Amount' : 'Total Price'}</span>
                                    </div>
                                    <div className="text-4xl md:text-6xl font-black leading-tight tracking-tighter flex items-center gap-2">
                                        <span className="text-xl md:text-3xl font-bold text-amber-500">
                                            {(rates?.[currency]) ? currentSymbol : 'Rs'}
                                        </span>
                                        <span className="text-white">
                                            {/* Show Final PayNow Amount (Includes payment fees if applicable) */}
                                            {payNow.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-left md:text-right bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Route Distance</div>
                                    <div className="text-xl font-black text-white">{distance.toFixed(1)} <span className="text-sm font-bold text-emerald-400">KM</span></div>
                                </div>

                                {/* Multi-Currency Grid - Moved INSIDE dark box */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-px flex-1 bg-white/10"></div>
                                        <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] whitespace-nowrap">Price in all currencies</span>
                                        <div className="h-px flex-1 bg-white/10"></div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {convertToAllCurrencies(totalPrice / (rates?.[currency] || 1)).map((c) => (
                                            <button
                                                key={c.code}
                                                type="button"
                                                onClick={() => changeCurrency(c.code)}
                                                className={`p-3 rounded-2xl border-2 transition-all flex flex-col gap-1 text-left cursor-pointer group/card relative overflow-hidden ${currency === c.code
                                                    ? 'bg-amber-500 border-amber-600 shadow-xl scale-[1.02]'
                                                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between relative z-10">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${currency === c.code ? 'text-amber-900' : 'text-white/40'}`}>
                                                        <div className="w-4 h-4 rounded-full overflow-hidden border border-white/20">
                                                            <img src={c.flag} alt={c.code} className="w-full h-full object-cover scale-150" />
                                                        </div> {c.code}
                                                    </span>
                                                    {currency === c.code && (
                                                        <span className="text-[8px] font-black bg-amber-900/20 text-amber-900 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Selected</span>
                                                    )}
                                                </div>
                                                <div className={`text-base md:text-lg font-black relative z-10 ${currency === c.code ? 'text-white' : 'text-slate-200'}`}>
                                                    <span className={`text-[10px] font-bold mr-1 ${currency === c.code ? 'text-white/70' : 'opacity-40'}`}>{c.symbol}</span>
                                                    {c.value.toLocaleString()}
                                                </div>
                                                {currency === c.code && <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full blur-2xl -mr-8 -mt-8"></div>}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Breakdown & Coupons */}
                            <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/40">
                                    <span>Subtotal</span>
                                    <span className="text-white">{currentSymbol} {subtotal.toLocaleString()}</span>
                                </div>

                                {detailedBreakdown.detailedSurcharges?.map((s, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/40">
                                        <span>{s.label}</span>
                                        <span className="text-white">+{currentSymbol} {s.value.toLocaleString()}</span>
                                    </div>
                                ))}

                                {detailedBreakdown.discounts > 0 && (
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-white/10 p-1.5 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Tag size={12} />
                                            <span>
                                                {verifiedCoupons.length > 0 ? `Coupon: ${verifiedCoupons.map(c => c.code).join(', ')}` : 'Discount Applied'}
                                            </span>
                                        </div>
                                        <span className="font-black">-{currentSymbol} {detailedBreakdown.discounts.toLocaleString()}</span>
                                    </div>
                                )}

                                {verifiedCoupons.length > 0 && (
                                    <div className="pt-2 border-t border-white/5">
                                        <div className="flex flex-wrap gap-2">
                                            {verifiedCoupons.map((c, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-tighter rounded-md flex items-center gap-1">
                                                    <Check size={8} strokeWidth={4} /> {c.code}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-center justify-center gap-2 mt-4">
                                <div className="flex items-center gap-1.5 text-emerald-800">
                                    <ShieldCheck size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-950">Taxes Included • Tolls Excluded</span>
                                </div>
                                <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                                    Highway Ticket paid by customer at counter
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-slide-up">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Final <span className="text-emerald-600">Checkout</span></h3>
                                <button onClick={onClose} className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-900/10 hover:bg-red-50 hover:text-red-600 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="grid lg:grid-cols-12 gap-8">
                                {/* Left Column: Client Info & Logistics */}
                                <div className="lg:col-span-7 space-y-8">
                                    {!session && (
                                        <div className="bg-emerald-50 border border-emerald-900/10 p-5 rounded-[1.5rem] flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner"><User size={20} /></div>
                                                <div>
                                                    <p className="text-sm font-black text-emerald-900 uppercase">Have an account?</p>
                                                    <p className="text-[10px] font-bold text-emerald-900/60 uppercase tracking-widest">Auto-fill details & track bookings.</p>
                                                </div>
                                            </div>
                                            <button onClick={() => signIn()} className="px-5 py-2.5 bg-white border border-emerald-900/10 rounded-xl text-xs font-black text-emerald-900 hover:bg-emerald-900 hover:text-white transition-all shadow-sm">Log In</button>
                                        </div>
                                    )}

                                    {/* Passenger & Luggage Controls (Requested for Step 2) */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest pl-2">Adjust Passengers & Luggage</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {[
                                                { id: 'adults', label: 'Adults' },
                                                { id: 'children', label: 'Children' },
                                                { id: 'luggage', label: 'Luggage' },
                                                { id: 'handLuggage', label: 'Hand' }
                                            ].map((field) => (
                                                <div key={field.id} className="bg-slate-50 border border-emerald-900/5 p-3 rounded-2xl flex flex-col items-center justify-center gap-2">
                                                    <span className="text-[8px] font-black uppercase tracking-tighter text-emerald-900/40">{field.label}</span>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => setFormData(prev => ({
                                                                ...prev,
                                                                passengerCount: {
                                                                    ...prev.passengerCount,
                                                                    [field.id]: Math.max(0, (prev.passengerCount[field.id] || 0) - 1)
                                                                }
                                                            }))}
                                                            className="w-6 h-6 flex items-center justify-center bg-white border border-emerald-900/10 rounded-md text-emerald-600 font-bold hover:bg-emerald-50"
                                                        >-</button>
                                                        <span className="font-bold text-xs text-emerald-900">{(formData.passengerCount[field.id] || 0)}</span>
                                                        <button
                                                            onClick={() => setFormData(prev => ({
                                                                ...prev,
                                                                passengerCount: {
                                                                    ...prev.passengerCount,
                                                                    [field.id]: (prev.passengerCount[field.id] || 0) + 1
                                                                }
                                                            }))}
                                                            className="w-6 h-6 flex items-center justify-center bg-white border border-emerald-900/10 rounded-md text-emerald-600 font-bold hover:bg-emerald-50"
                                                        >+</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {isOverCapacity && (
                                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-pulse">
                                                <AlertCircle size={14} className="text-red-600" />
                                                <p className="text-[9px] font-black text-red-900 uppercase tracking-widest leading-none">
                                                    Capacity Warning: Trip exceeds {selectedVehicle?.name || 'Vehicle'} limits
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {[
                                                { label: 'Full Legal Name', key: 'name', type: 'text', placeholder: 'Passenger Name' },
                                                { label: 'Email Address', key: 'email', type: 'email', placeholder: 'for confirmation' },
                                                { label: 'Primary Contact No', key: 'phone', type: 'tel', placeholder: '+94 XXX XXX XXX' },
                                                { label: 'WhatsApp Number', key: 'whatsapp', type: 'tel', placeholder: 'For driver chat' },
                                            ].map(f => (
                                                <div key={f.key} className="space-y-2">
                                                    <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest pl-2">{f.label}</label>
                                                    <input
                                                        type={f.type}
                                                        value={formData[f.key] || ''}
                                                        onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                                                        className="w-full h-14 bg-white border border-slate-200 px-6 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-emerald-900 placeholder:text-gray-300"
                                                        placeholder={f.placeholder}
                                                    />
                                                </div>
                                            ))}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest pl-2">Flight Number (Optional)</label>
                                                <input
                                                    type="text"
                                                    value={formData.flightNumber || ''}
                                                    onChange={e => setFormData({ ...formData, flightNumber: e.target.value })}
                                                    className="w-full h-14 bg-white border border-slate-200 px-6 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-emerald-900 placeholder:text-gray-300"
                                                    placeholder="e.g. EK 654"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest pl-2">Waiting Hours</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={formData.waitingHours || 0}
                                                    onChange={e => setFormData({ ...formData, waitingHours: parseInt(e.target.value) || 0 })}
                                                    className="w-full h-14 bg-white border border-slate-200 px-6 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-emerald-900"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest pl-2">Pick-up Logistics</label>
                                            <CustomDateTimePicker
                                                date={formData.date}
                                                time={formData.time}
                                                onChange={(d, t) => setFormData({ ...formData, date: d, time: t })}
                                            />
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-slate-100">
                                            <h4 className="text-xs font-black text-emerald-900 uppercase tracking-widest flex items-center gap-2">
                                                <Mail size={14} className="text-emerald-600" />
                                                Billing Details
                                            </h4>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <input
                                                    type="text"
                                                    value={formData.billingName || ''}
                                                    onChange={e => setFormData({ ...formData, billingName: e.target.value })}
                                                    className="w-full h-14 bg-white border border-slate-200 px-6 rounded-2xl text-sm font-bold text-emerald-900 placeholder:text-slate-300"
                                                    placeholder="Billing Name"
                                                />
                                                <input
                                                    type="text"
                                                    value={formData.billingCountry || ''}
                                                    onChange={e => setFormData({ ...formData, billingCountry: e.target.value })}
                                                    className="w-full h-14 bg-white border border-slate-200 px-6 rounded-2xl text-sm font-bold text-emerald-900 placeholder:text-slate-300"
                                                    placeholder="Country"
                                                />
                                                <textarea
                                                    rows="2"
                                                    value={formData.billingAddress}
                                                    onChange={e => setFormData({ ...formData, billingAddress: e.target.value })}
                                                    className="md:col-span-2 w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-emerald-900 placeholder:text-slate-300 resize-none"
                                                    placeholder="Full Billing Address"
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Summary & Payment */}
                                <div className="lg:col-span-5 space-y-6">
                                    <div className="p-6 md:p-8 bg-emerald-900 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>

                                        <div className="relative z-10 space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-emerald-400">
                                                    Trip Summary
                                                </div>
                                                <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                                                    {formData.tripType.replace('-', ' ')}
                                                </div>
                                            </div>

                                            <div className="space-y-4 py-4 border-y border-white/10">
                                                <div className="flex gap-4">
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-emerald-400 shrink-0 border border-white/10"><MapPin size={16} /></div>
                                                    <div>
                                                        <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Pick up</p>
                                                        <p className="text-xs font-bold text-white leading-tight">{formData.pickup}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-orange-400 shrink-0 border border-white/10"><Navigation size={16} /></div>
                                                    <div>
                                                        <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Drop off</p>
                                                        <p className="text-xs font-bold text-white leading-tight">{formData.dropoff}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-white/40 font-bold uppercase tracking-widest">Base Rate</span>
                                                    <span className="font-black text-white">{currentSymbol} {subtotal.toLocaleString()}</span>
                                                </div>

                                                {detailedBreakdown.detailedExtras?.filter(s => s.value > 0).map((s, idx) => (
                                                    <div key={idx} className="flex justify-between items-center text-xs">
                                                        <span className="text-white/40 font-bold uppercase tracking-widest">{s.label}</span>
                                                        <span className="font-black text-white">+{currentSymbol} {s.value.toLocaleString()}</span>
                                                    </div>
                                                ))}

                                                {detailedBreakdown.discounts > 0 && (
                                                    <div className="flex justify-between items-center text-xs text-emerald-400">
                                                        <span className="font-bold uppercase tracking-widest">Discount</span>
                                                        <span className="font-black">-{currentSymbol} {detailedBreakdown.discounts.toLocaleString()}</span>
                                                    </div>
                                                )}

                                                <div className="pt-4 mt-2 border-t border-white/10 flex justify-between items-end">
                                                    <div>
                                                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">
                                                            {formData.paymentType === 'partial' ? 'Pay Now (50%)' : 'Total Price'}
                                                        </p>
                                                        <p className="text-4xl font-black tracking-tighter text-white">
                                                            {currentSymbol} {payNow.toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Vehicle</p>
                                                        <p className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">{selectedVehicle?.name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Selection */}
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            {['cash', 'card'].map(m => (
                                                <button
                                                    key={m}
                                                    onClick={() => setFormData(prev => ({
                                                        ...prev,
                                                        paymentMethod: m,
                                                        paymentType: m === 'cash' ? 'full' : prev.paymentType
                                                    }))}
                                                    className={`flex-1 p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${formData.paymentMethod === m ? 'border-emerald-900 bg-emerald-50 shadow-md' : 'border-slate-100 bg-slate-50 opacity-60'}`}
                                                >
                                                    <span className="text-2xl">{m === 'cash' ? '💵' : '💳'}</span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900">{m === 'cash' ? 'Cash' : 'Online'}</span>
                                                </button>
                                            ))}
                                        </div>

                                        {formData.paymentMethod === 'card' && (
                                            <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl">
                                                {['full', 'partial'].map(t => (
                                                    <button
                                                        key={t}
                                                        onClick={() => setFormData(prev => ({ ...prev, paymentType: t }))}
                                                        className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${formData.paymentType === t ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-400'}`}
                                                    >
                                                        {t === 'full' ? 'Pay 100%' : 'Pay 50%'}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <input
                                                value={couponInput}
                                                onChange={e => setCouponInput(e.target.value.toUpperCase())}
                                                placeholder="COUPON CODE"
                                                className="flex-1 h-12 bg-slate-50 border border-slate-200 px-4 rounded-xl text-xs font-bold uppercase placeholder:normal-case"
                                            />
                                            <button
                                                onClick={() => handleApplyCoupon()}
                                                disabled={couponLoading || !couponInput}
                                                className="px-5 bg-emerald-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-20"
                                            >
                                                {couponLoading ? <Loader2 className="animate-spin" size={14} /> : 'Apply'}
                                            </button>
                                        </div>
                                        {verifiedCoupons.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {verifiedCoupons.map((c, i) => (
                                                    <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold border border-emerald-100 flex items-center gap-2">
                                                        <Tag size={10} /> {c.code}
                                                        <X size={10} className="cursor-pointer" onClick={() => setVerifiedCoupons(prev => prev.filter(vc => vc.code !== c.code))} />
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 rounded-[1.5rem] bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
                                        <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
                                        <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase tracking-wider">
                                            Highway tolls are not included in the fixed price and must be paid by the customer at the counter.
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-4 p-5 bg-emerald-50 rounded-3xl border border-emerald-900/5 transition-all group-hover:border-emerald-900/20">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            checked={hasAgreed}
                                            onChange={e => setHasAgreed(e.target.checked)}
                                            className="w-5 h-5 rounded border-2 border-emerald-900/20 checked:bg-emerald-900 mt-0.5 cursor-pointer"
                                        />
                                        <label htmlFor="terms" className="text-[10px] font-bold text-emerald-900/60 leading-relaxed uppercase tracking-wide cursor-pointer select-none">
                                            I agree to the <Link href="/conditions" target="_blank" className="text-emerald-600 underline">Terms of Service</Link> & <Link href="/policy" target="_blank" className="text-emerald-600 underline">Refund Policy</Link>. Final payment is secure.
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls - Pinned to bottom */}
                <div className="p-4 md:p-8 pt-3 md:pt-4 border-t border-emerald-900/10 bg-white/80 backdrop-blur-sm shrink-0">
                    <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-3 md:gap-4">
                        <button
                            onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
                            className="flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-white rounded-xl md:rounded-2xl text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-emerald-50 transition-all text-emerald-900 border border-emerald-900/10 shadow-sm w-full md:w-auto min-w-[120px]"
                        >
                            <ChevronLeft size={16} className="md:block hidden" /> {step === 1 ? 'Cancel' : 'Back'}
                        </button>

                        {step < 2 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                disabled={(step === 1 && (!formData.pickup || !formData.dropoff || isOverCapacity))}
                                className="group flex items-center justify-center gap-2 md:gap-3 px-8 md:px-12 py-3 md:py-4 bg-emerald-900 text-white rounded-xl md:rounded-2xl text-xs md:text-sm font-black uppercase tracking-widest hover:bg-emerald-800 transition-all disabled:opacity-30 shadow-lg w-full md:w-auto min-w-[140px]"
                            >
                                Continue To Checkout <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform md:block hidden" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !hasAgreed || !formData.name || !formData.phone}
                                className="group flex items-center justify-center gap-2 md:gap-3 px-8 md:px-12 py-3 md:py-4 bg-emerald-900 text-white rounded-xl md:rounded-2xl text-xs md:text-sm font-black uppercase tracking-widest hover:bg-emerald-800 transition-all disabled:opacity-30 shadow-lg w-full md:w-auto min-w-[160px]"
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} className="md:block hidden" />}
                                {loading ? 'Processing...' : 'Complete Booking'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Vehicle Info Popup Modal */}
            <AnimatePresence>
                {infoVehicle && (
                    <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200"
                        >
                            {/* Header Image Area */}
                            <div className="relative h-56 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-12">
                                <button
                                    onClick={() => setInfoVehicle(null)}
                                    className="absolute top-6 right-6 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all z-10"
                                >
                                    <X size={20} />
                                </button>

                                {infoVehicle.image ? (
                                    <img
                                        src={infoVehicle.image}
                                        alt={infoVehicle.name}
                                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 hover:scale-110"
                                    />
                                ) : (
                                    <Car size={80} className="text-slate-300" />
                                )}
                            </div>

                            {/* Info Content */}
                            <div className="p-8 space-y-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{infoVehicle.name}</h3>
                                        <div className="bg-amber-100/80 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-lg uppercase border border-amber-200">
                                            Premium A/C
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-slate-500 leading-relaxed uppercase tracking-wide">
                                        Professional airport transfer service with experienced chauffeur.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-sm">
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Capacity</p>
                                            <p className="text-base font-black text-slate-900 leading-none">{infoVehicle.capacity} Persons</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                                            <Briefcase size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Luggage</p>
                                            <p className="text-base font-black text-slate-900 leading-none">{infoVehicle.luggage || 0} Luggages</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 bg-emerald-50/50 p-5 rounded-3xl border border-emerald-100">
                                    <h4 className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                        <ShieldCheck size={14} /> Included Amenities
                                    </h4>
                                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                        {['100% A/C', 'Water Bottles', 'Hand Sanitizer', 'English Speaking Chauffeur'].map(f => (
                                            <div key={f} className="flex items-center gap-2 text-[11px] font-bold text-slate-700">
                                                <Check size={12} className="text-emerald-500" /> {f}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setInfoVehicle(null)}
                                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95"
                                >
                                    Understood
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
