'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { X, MapPin, User, Users, CreditCard, Calendar, Clock, Phone, Mail, ChevronRight, ChevronLeft, Check, Loader2, Car, Navigation, ShieldCheck, Zap, Signpost, Tag, ShoppingBag, Info, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import { useCurrency } from '../context/CurrencyContext';
import { calculateBasePrice, calculateSurcharges, calculatePaymentFees } from '../lib/pricing-util';
import LocationInput from './LocationInput';
import CustomDateTimePicker from './CustomDateTimePicker';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

const STEPS = [
    { id: 1, title: 'Route & Vehicle', icon: MapPin },
    { id: 2, title: 'Checkout & Pay', icon: CreditCard },
];


export default function BookingModal({ isOpen, onClose, initialData = {}, pricingCategory = 'airport-transfer' }) {
    const { data: session } = useSession();
    const [step, setStep] = useState(1);
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
        // waitingHours removed
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

            // CRITICAL: Ensure we have a valid distance and vehicle data
            const distKm = Math.ceil(distance || initialData.distance || 0);

            if (!vehicleData || distKm === 0) {
                return { total: 0, subtotal: 0, surcharges: 0, payNow: 0, balance: 0, lkr: { total: 0, payNow: 0, balance: 0, surcharges: 0, subtotal: 0 }, originalLKR: 0 };
            }

            const baseTotal = calculateBasePrice(distKm, vehicleData, formData.tripType, formData.pickup, formData.dropoff, destinations);
            const surcharges = calculateSurcharges({
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

    // 1. Initialize State from initialData when modal opens or initialData changes
    useEffect(() => {
        if (isOpen && initialData && Object.keys(initialData).length > 0) {
            console.log("Initializing Modal with data:", initialData);
            setFormData(prev => ({
                ...prev,
                ...initialData,
                // Ensure specific nested objects are merged correctly
                passengerCount: { ...prev.passengerCount, ...(initialData.passengerCount || {}) },
                waypoints: initialData.waypoints || prev.waypoints
            }));

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
            <div id="modal-container" className="bg-white w-full h-full sm:h-auto sm:max-h-[95vh] sm:rounded-[3rem] sm:border sm:border-slate-100 shadow-2xl sm:max-w-4xl overflow-hidden flex flex-col animate-slide-up relative">
                {/* Coupon Verification Notification - Moved to Bottom */}
                <AnimatePresence>
                    {couponLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-[10010] bg-black border border-slate-700 text-white px-6 py-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center gap-3 backdrop-blur-xl"
                        >
                            <Loader2 className="animate-spin text-white" size={18} />
                            <span className="text-xs font-black uppercase tracking-widest">Verifying code...</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                {/* Header - Hidden in Step 2 */}
                {step !== 2 && (
                    <div className="p-4 md:p-8 pb-3 md:pb-4 flex items-center justify-between shrink-0 pt-8 sm:pt-4">
                        <div className="flex items-center gap-2 md:gap-4 min-w-0">
                            <div className="w-8 h-8 md:w-12 md:h-12 bg-white rounded-lg md:rounded-xl flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                                <Zap size={18} className="text-black md:w-[22px] md:h-[22px]" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-lg md:text-2xl font-black tracking-tight text-slate-900 leading-none truncate uppercase">Secure <span className="text-black">Booking</span></h2>
                                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Encrypted Payment</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-black/10 hover:bg-red-50 hover:text-red-600 transition-colors z-[101]">
                            <X size={22} />
                        </button>
                    </div>
                )}

                {/* Progress Indicators */}
                <div className="px-5 md:px-8 py-4 flex gap-2">
                    {STEPS.map((s) => (
                        <div key={s.id} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s.id ? 'bg-black' : 'bg-slate-100'}`}></div>
                    ))}
                </div>

                {/* Main Viewport */}
                <div ref={modalContentRef} className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar overscroll-contain">
                    {step === 1 && (
                        <div className="space-y-6 md:space-y-8 animate-slide-up">
                            {/* Trip Header */}
                            <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-2xl border border-black/10 w-full md:w-fit gap-2">
                                {['one-way', 'round-trip'].map(t => (
                                    <button key={t} onClick={() => setFormData({ ...formData, tripType: t })} className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${formData.tripType === t ? 'bg-black text-white shadow-sm' : 'text-slate-400 hover:text-black'}`}>{t.replace('-', ' ')}</button>
                                ))}
                            </div>

                            {/* Location Inputs - Glassmorphism Card */}
                            <div className="space-y-4 bg-white p-6 rounded-3xl border border-black/10 shadow-xl shadow-black/5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xs font-black text-black uppercase tracking-widest flex items-center gap-2">
                                        <MapPin size={14} className="text-black" />
                                        My Journey Details
                                    </h3>
                                    <div className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-black uppercase tracking-tighter">
                                        {formData.tripType.replace('-', ' ')}
                                    </div>
                                </div>
                                <div className="space-y-5">
                                    <LocationInput
                                        label="Pick-Up Location"
                                        icon={MapPin}
                                        placeholder="Enter pickup (e.g. Airport)"
                                        value={formData.pickup}
                                        onSelect={(loc) => setFormData(prev => ({ ...prev, pickup: loc.address, pickupCoords: loc.lat ? { lat: loc.lat, lon: loc.lon } : null }))}
                                    />

                                    {/* Waypoints */}
                                    {formData.waypoints.map((wp, i) => (
                                        <div key={i} className="relative group animate-slide-in">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10">
                                                <Navigation size={18} />
                                            </div>
                                            <div className="w-full pl-12 pr-4 py-4 bg-slate-50/50 rounded-2xl border border-slate-200 text-sm font-bold text-slate-900 flex items-center justify-between">
                                                <span className="truncate">{wp.address || wp.name}</span>
                                                <button
                                                    onClick={() => setFormData(prev => ({ ...prev, waypoints: prev.waypoints.filter((_, idx) => idx !== i) }))}
                                                    className="p-1 hover:bg-black/10 hover:text-red-500 rounded-lg transition-colors"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                            {/* Connecting Line */}
                                            <div className="absolute left-6 -top-4 w-0.5 h-4 bg-slate-200/50 -z-10"></div>
                                        </div>
                                    ))}

                                    <div className="relative">
                                        {/* Connecting Line from pickup to waypoints/dropoff */}
                                        <div className="absolute left-6 -top-5 w-0.5 h-5 bg-slate-200/50 -z-10"></div>
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
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Vehicle Category</label>
                                    <div className="grid grid-cols-1 gap-4">
                                        {pricingData.map((v) => {
                                            const totalPax = (formData.passengerCount?.adults || 0) + (formData.passengerCount?.children || 0);
                                            const totalLuggage = formData.passengerCount?.luggage || 0;
                                            const totalHandLuggage = formData.passengerCount?.handLuggage || 0;
                                            const isFit = totalPax <= v.capacity && totalLuggage <= (v.luggage || 0) && totalHandLuggage <= (v.handLuggage || 0);
                                            const isSelected = formData.vehicle === v.vehicleType;

                                            if (!isFit && !isSelected) return null;

                                            return (
                                                <button
                                                    key={v.vehicleType}
                                                    onClick={() => isFit && setFormData({ ...formData, vehicle: v.vehicleType })}
                                                    className={`group/card relative w-full p-4 md:p-5 rounded-[2rem] border-2 transition-all cursor-pointer overflow-hidden flex flex-col gap-3 text-left
                                                        ${isSelected ? 'border-black bg-slate-50/50 shadow-xl' : 'border-black/10 bg-white hover:border-black/30'}
                                                        ${!isFit ? 'opacity-40 grayscale pointer-events-none' : ''}
                                                    `}
                                                >
                                                    {/* Selection Glow */}
                                                    {isSelected && (
                                                        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent pointer-events-none"></div>
                                                    )}

                                                    {/* Header info */}
                                                    <div className="flex items-center gap-5">
                                                        {/* Image Box */}
                                                        <div className="w-20 md:w-28 h-16 md:h-20 bg-slate-50 rounded-2xl flex items-center justify-center p-2 shrink-0 overflow-hidden border border-black/5 relative group-hover/card:bg-slate-100 transition-colors">
                                                            {v.image ? (
                                                                <img src={v.image} alt={v.name} className="w-full h-full object-contain transition-transform duration-500 group-hover/card:scale-110" />
                                                            ) : (
                                                                <Car className="text-slate-300" size={28} />
                                                            )}
                                                        </div>

                                                        {/* Title & Badge Container */}
                                                        <div className="flex-1 min-w-0">
                                                            {/* Badge for AC */}
                                                            <div className="inline-flex bg-slate-100 backdrop-blur-sm text-black text-[8px] md:text-[9px] font-black px-2.5 py-0.5 rounded-lg mb-2 uppercase items-center gap-1 shadow-sm border border-black/10">
                                                                <Zap size={10} fill="currentColor" /> Premium A/C
                                                            </div>
                                                            <h4 className="text-lg md:text-2xl font-black text-black uppercase tracking-tight leading-tight mb-1">{v.name}</h4>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Professional Service</p>
                                                        </div>
                                                    </div>

                                                    {/* New Redesigned Capacity Grid */}
                                                    <div className="grid grid-cols-3 gap-2 mt-1">
                                                        <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-black/10 shadow-sm">
                                                            <div className="w-6 h-6 bg-slate-50 rounded-lg flex items-center justify-center text-black shrink-0">
                                                                <Users size={12} />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Pax</p>
                                                                <p className="text-[10px] font-black text-black leading-none">{v.capacity}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-black/10 shadow-sm">
                                                            <div className="w-6 h-6 bg-slate-50 rounded-lg flex items-center justify-center text-black shrink-0">
                                                                <ShoppingBag size={12} />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Bags</p>
                                                                <p className="text-[10px] font-black text-black leading-none">{v.luggage || 0}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-black/10 shadow-sm">
                                                            <div className="w-6 h-6 bg-slate-50 rounded-lg flex items-center justify-center text-black shrink-0">
                                                                <ShoppingBag size={12} />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Hand</p>
                                                                <p className="text-[10px] font-black text-black leading-none">{v.handLuggage || 0}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Included Perks */}
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {['100% A/C', 'Water Bottles', 'Hand Sanitizer', 'English Chauffeur'].slice(0, 3).map(f => (
                                                            <div key={f} className="flex items-center gap-1.5 text-[9px] font-black uppercase text-black tracking-wider bg-slate-100 border border-black/10 px-2 py-1 rounded-lg">
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
                                    {pricingCategory !== 'ride-now' && (
                                        <div className="p-4 bg-white border-2 border-slate-200 rounded-2xl shadow-sm space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-black">
                                                    <Clock size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest leading-none">Arrival Information</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Flight & Time Details</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Flight Number</label>
                                                    <input
                                                        type="text"
                                                        value={formData.flightNumber || ''}
                                                        onChange={e => setFormData({ ...formData, flightNumber: e.target.value })}
                                                        className="w-full h-12 bg-white border-[3px] border-slate-900 px-6 rounded-xl outline-none focus:ring-4 focus:ring-black/5 transition-all font-bold text-xs text-slate-900 shadow-xl"
                                                        placeholder="e.g. EK 654"
                                                    />
                                                </div>
                                                <CustomDateTimePicker
                                                    date={formData.flightArrivalDate}
                                                    time={formData.flightArrivalTime}
                                                    onChange={(d, t) => setFormData({ ...formData, flightArrivalDate: d, flightArrivalTime: t, arrivalDate: d, arrivalTime: t })}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Passenger & Luggage</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {[
                                            { id: 'adults', label: 'Adults', icon: Users },
                                            { id: 'children', label: 'Children', icon: User },
                                            { id: 'luggage', label: 'Check-in Luggage', icon: ShoppingBag },
                                            { id: 'handLuggage', label: 'Hand Luggage', icon: ShoppingBag }
                                        ].map((field) => (
                                            <div key={field.id} className="bg-white border border-slate-200 p-3 md:p-4 rounded-xl flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
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
                                                        className="text-black font-bold text-lg w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                                                    >-</button>
                                                    <span className="font-bold text-sm min-w-[1rem] text-center text-black">{formData.passengerCount[field.id]}</span>
                                                    <button
                                                        onClick={() => setFormData({
                                                            ...formData,
                                                            passengerCount: {
                                                                ...formData.passengerCount,
                                                                [field.id]: formData.passengerCount[field.id] + 1
                                                            }
                                                        })}
                                                        className="text-black font-bold text-lg w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                                                    >+</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-white border-2 border-black/10 rounded-3xl shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-black">
                                                    <Navigation size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-black uppercase tracking-widest leading-none">Total Distance</p>
                                                    <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mt-1">Calculated via GPS</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-black leading-none">
                                                    {distance.toFixed(1)} KM
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-pulse">
                                        <div className="pt-0.5 text-red-600"><ShoppingBag size={14} /></div>
                                        <p className="text-[10px] font-bold text-red-900 leading-tight uppercase tracking-widest">
                                            Capacity Exceeded: {totalPassengers} Pax (Max {selectedVehicle.capacity})
                                        </p>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            onClick={() => setFormData({ ...formData, hasNameBoard: !formData.hasNameBoard })}
                                            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${formData.hasNameBoard ? 'border-black bg-slate-100 text-black shadow-sm' : 'bg-white border-black/10 text-black/60 hover:bg-slate-50'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Signpost size={18} className={formData.hasNameBoard ? 'text-black' : ''} />
                                                <div className="text-left">
                                                    <span className="text-[10px] md:text-xs font-bold block uppercase tracking-tight">Name Board</span>
                                                    <span className="text-[8px] font-medium opacity-60">Driver waits with name sign</span>
                                                </div>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.hasNameBoard ? 'border-black bg-black' : 'border-black/20'}`}>
                                                {formData.hasNameBoard && <Check size={12} className="text-white" />}
                                            </div>
                                        </button>
                                    </div>

                                    {formData.hasNameBoard && (
                                        <div className="space-y-2 mt-4">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Board Text</label>
                                            <input type="text" value={formData.nameBoardText} onChange={e => setFormData({ ...formData, nameBoardText: e.target.value })} className="w-full h-12 bg-white border border-slate-200 px-6 rounded-xl outline-none focus:border-black transition-all font-bold text-xs text-slate-900" placeholder="Greeting text..." />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 md:p-8 bg-black rounded-[3rem] text-white flex flex-col shadow-2xl gap-8 relative overflow-hidden group">
                                {/* Decorative Background Glow */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>

                                <div className="relative z-10 space-y-8">
                                    <div className="flex items-center gap-2 text-white/70 mb-2">
                                        <Zap size={14} fill="currentColor" className="animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{formData.paymentType === 'partial' ? 'Deposit Amount' : 'Total Price'}</span>
                                    </div>
                                    <div className="text-4xl md:text-6xl font-black leading-tight tracking-tighter flex items-center gap-2">
                                        <span className="text-xl md:text-3xl font-bold text-white/50">
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
                                    <div className="text-xl font-black text-white">{distance.toFixed(1)} <span className="text-sm font-bold text-white/50">KM</span></div>
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
                                                    ? 'bg-white border-black shadow-xl scale-[1.02]'
                                                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between relative z-10">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${currency === c.code ? 'text-black' : 'text-white/40'}`}>
                                                        <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-200 bg-white p-0.5 shadow-sm">
                                                            <img src={c.flag} alt={c.code} className="w-full h-full object-cover rounded-full" />
                                                        </div> {c.code}
                                                    </span>
                                                    {currency === c.code && (
                                                        <span className="text-[8px] font-black bg-black/10 text-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Selected</span>
                                                    )}
                                                </div>
                                                <div className={`text-base md:text-lg font-black relative z-10 ${currency === c.code ? 'text-black' : 'text-slate-200'}`}>
                                                    <span className={`text-[10px] font-bold mr-1 ${currency === c.code ? 'text-black/50' : 'opacity-40'}`}>{c.symbol}</span>
                                                    {c.value.toLocaleString()}
                                                </div>
                                                {currency === c.code && <div className="absolute top-0 right-0 w-16 h-16 bg-white/40 rounded-full blur-2xl -mr-8 -mt-8"></div>}
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
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white bg-white/10 p-1.5 rounded-lg border border-white/20">
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
                                                <span key={idx} className="px-2 py-1 bg-white/10 border border-white/20 text-white text-[8px] font-black uppercase tracking-tighter rounded-md flex items-center gap-1">
                                                    <Check size={8} strokeWidth={4} /> {c.code}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-center justify-center gap-2 mt-4">
                                <div className="flex items-center gap-1.5 text-slate-800">
                                    <ShieldCheck size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-950">Taxes Included • Tolls Excluded</span>
                                </div>
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-200">
                                    Highway Ticket paid by customer at counter
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 2 ? (
                        <div className="animate-slide-up pt-20 sm:pt-4">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Final Checkout</h3>
                                <button onClick={onClose} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-black/10 hover:bg-red-50 hover:text-red-600 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="grid lg:grid-cols-12 gap-8">
                                {/* Left Column: Client Info & Logistics */}
                                <div className="lg:col-span-7 space-y-8">
                                    {!session && (
                                        <div className="bg-slate-50 border border-black/10 p-5 rounded-[2rem] flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white border border-black/10 flex items-center justify-center text-black shadow-inner"><User size={20} /></div>
                                                <div>
                                                    <p className="text-sm font-black text-black uppercase">Have an account?</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auto-fill details & track bookings.</p>
                                                </div>
                                            </div>
                                            <button onClick={() => signIn()} className="px-5 py-2.5 bg-black rounded-full text-xs font-black text-white hover:bg-slate-800 transition-all shadow-md">Log In</button>
                                        </div>
                                    )}

                                    {/* Passenger & Luggage Controls (Requested for Step 2) */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Adjust Passengers & Luggage</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            {[
                                                { id: 'adults', label: 'Adults' },
                                                { id: 'children', label: 'Children' },
                                                { id: 'luggage', label: 'Luggage' },
                                                { id: 'handLuggage', label: 'Hand' }
                                            ].map((field) => (
                                                <div key={field.id} className="bg-white border-[3px] border-slate-900 p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-xl transition-all hover:translate-y-[-1px]">
                                                    <span className="text-[7.5px] font-black uppercase tracking-tighter text-slate-400">{field.label}</span>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => setFormData(prev => ({
                                                                ...prev,
                                                                passengerCount: {
                                                                    ...prev.passengerCount,
                                                                    [field.id]: Math.max(0, (prev.passengerCount[field.id] || 0) - 1)
                                                                }
                                                            }))}
                                                            className="w-5 h-5 flex items-center justify-center bg-white border-2 border-slate-900 rounded-md text-black font-bold hover:bg-slate-100 text-[10px] active:scale-95 transition-all shadow-sm"
                                                        >-</button>
                                                        <span className="font-black text-xs text-black">{(formData.passengerCount[field.id] || 0)}</span>
                                                        <button
                                                            onClick={() => setFormData(prev => ({
                                                                ...prev,
                                                                passengerCount: {
                                                                    ...prev.passengerCount,
                                                                    [field.id]: (prev.passengerCount[field.id] || 0) + 1
                                                                }
                                                            }))}
                                                            className="w-5 h-5 flex items-center justify-center bg-black text-white border-b-2 border-black rounded-md font-bold hover:bg-slate-800 text-[10px] active:scale-95 transition-all shadow-sm"
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
                                                    <label className="text-[10px] font-bold text-slate-900/40 uppercase tracking-widest pl-2">{f.label}</label>
                                                    {f.type === 'tel' ? (
                                                        <PhoneInput
                                                            defaultCountry="lk"
                                                            value={formData[f.key] || ''}
                                                            onChange={(phone) => setFormData({ ...formData, [f.key]: phone })}
                                                            inputClassName="!w-full !h-14 !bg-transparent !border-none !px-4 !outline-none focus:!ring-0 !font-bold !text-slate-900 placeholder:!text-gray-400 !text-base"
                                                            countrySelectorStyleProps={{
                                                                buttonClassName: '!h-14 !bg-slate-50 !border-r !border-slate-200 !px-4 !flex !items-center !justify-center !min-w-[70px]',
                                                                flagClassName: '!w-8 !h-auto !shadow-sm',
                                                                dropdownStyleProps: {
                                                                    className: '!z-[20000] !min-w-[200px] !max-h-[300px] !rounded-[2rem] !border-2 !border-black/10 !shadow-2xl !bg-white'
                                                                }
                                                            }}
                                                            className="w-full bg-white border-[3px] border-slate-900 rounded-2xl flex focus-within:ring-4 focus-within:ring-black/5 transition-all overflow-visible shadow-xl"
                                                        />
                                                    ) : (
                                                        <input
                                                            type={f.type}
                                                            value={formData[f.key] || ''}
                                                            onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                                                            className="w-full h-14 bg-white border-[3px] border-slate-900 px-6 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 transition-all font-bold text-slate-900 placeholder:text-gray-400 shadow-xl"
                                                            placeholder={f.placeholder}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                            {isAirportService && (
                                                <>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-slate-900/40 uppercase tracking-widest pl-2">Flight Number (Mandatory)</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={formData.flightNumber || ''}
                                                            onChange={e => setFormData({ ...formData, flightNumber: e.target.value })}
                                                            className="w-full h-14 bg-white border-[3px] border-slate-900 px-6 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 transition-all font-bold text-slate-900 placeholder:text-gray-400 shadow-xl"
                                                            placeholder="e.g. EK 654"
                                                        />
                                                    </div>

                                                    <div className="space-y-4 p-5 bg-white rounded-2xl border-2 border-slate-200">
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                                                            <Zap size={14} className="text-black" />
                                                            Final Flight Arrival Confirmation
                                                        </label>
                                                        <CustomDateTimePicker
                                                            date={formData.flightArrivalDate}
                                                            time={formData.flightArrivalTime}
                                                            onChange={(d, t) => setFormData({ ...formData, flightArrivalDate: d, flightArrivalTime: t })}
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-bold text-slate-900/40 uppercase tracking-widest pl-2">Pick-up Logistics</label>
                                                <CustomDateTimePicker
                                                    date={formData.date}
                                                    time={formData.time}
                                                    onChange={(d, t) => setFormData({ ...formData, date: d, time: t })}
                                                />
                                            </div>

                                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                                    <Mail size={14} className="text-black" />
                                                    Billing Details
                                                </h4>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <input
                                                        type="text"
                                                        value={formData.billingName || ''}
                                                        onChange={e => setFormData({ ...formData, billingName: e.target.value })}
                                                        className="w-full h-14 bg-white border-[3px] border-slate-900 px-6 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-gray-400 shadow-xl outline-none focus:ring-4 focus:ring-black/5"
                                                        placeholder="Billing Name"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={formData.billingCountry || ''}
                                                        onChange={e => setFormData({ ...formData, billingCountry: e.target.value })}
                                                        className="w-full h-14 bg-white border-[3px] border-slate-900 px-6 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-gray-400 shadow-xl outline-none focus:ring-4 focus:ring-black/5"
                                                        placeholder="Country"
                                                    />
                                                    <textarea
                                                        rows="2"
                                                        value={formData.billingAddress}
                                                        onChange={e => setFormData({ ...formData, billingAddress: e.target.value })}
                                                        className="md:col-span-2 w-full px-6 py-4 bg-white border-[3px] border-slate-900 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-gray-400 resize-none shadow-xl outline-none focus:ring-4 focus:ring-black/5"
                                                        placeholder="Full Billing Address"
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Summary & Payment */}
                                <div className="lg:col-span-5 space-y-6">
                                    <div className="p-6 md:p-8 bg-black rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                                        <div className="relative z-10 space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-300">
                                                    Trip Summary
                                                </div>
                                                <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                                                    {formData.tripType.replace('-', ' ')}
                                                </div>
                                            </div>

                                            <div className="space-y-4 py-4 border-y border-white/10">
                                                <div className="flex gap-4">
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-200 shrink-0 border border-white/10"><MapPin size={16} /></div>
                                                    <div>
                                                        <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Pick up</p>
                                                        <p className="text-xs font-bold text-white leading-tight">{formData.pickup}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-200 shrink-0 border border-white/10"><Navigation size={16} /></div>
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
                                                    <div className="flex justify-between items-center text-xs text-slate-400">
                                                        <span className="font-bold uppercase tracking-widest">Discount</span>
                                                        <span className="font-black">-{currentSymbol} {detailedBreakdown.discounts.toLocaleString()}</span>
                                                    </div>
                                                )}

                                                <div className="pt-4 mt-2 border-t border-white/10 flex justify-between items-end">
                                                    <div>
                                                        <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">
                                                            {formData.paymentType === 'partial' ? 'Pay Now (50%)' : 'Total Price'}
                                                        </p>
                                                        <p className="text-4xl font-black tracking-tighter text-white">
                                                            {currentSymbol} {payNow.toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Vehicle</p>
                                                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">{selectedVehicle?.name}</p>
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
                                                    className={`flex-1 p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${formData.paymentMethod === m ? 'border-black bg-slate-50 shadow-md' : 'border-slate-100 bg-slate-50 opacity-60'}`}
                                                >
                                                    <span className="text-2xl">{m === 'cash' ? '💵' : '💳'}</span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-black">{m === 'cash' ? 'Cash' : 'Online'}</span>
                                                </button>
                                            ))}
                                        </div>

                                        {formData.paymentMethod === 'card' && (
                                            <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl">
                                                {['full', 'partial'].map(t => (
                                                    <button
                                                        key={t}
                                                        onClick={() => setFormData(prev => ({ ...prev, paymentType: t }))}
                                                        className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${formData.paymentType === t ? 'bg-white text-black shadow-sm' : 'text-slate-400'}`}
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
                                                className="flex-1 h-12 bg-white border-[3px] border-slate-900 px-4 rounded-xl text-xs font-black uppercase placeholder:normal-case shadow-xl outline-none"
                                            />
                                            <button
                                                onClick={() => handleApplyCoupon()}
                                                disabled={couponLoading || !couponInput}
                                                className="px-5 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-20"
                                            >
                                                {couponLoading ? <Loader2 className="animate-spin" size={14} /> : 'Apply'}
                                            </button>
                                        </div>
                                        {verifiedCoupons.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {verifiedCoupons.map((c, i) => (
                                                    <span key={i} className="px-2 py-1 bg-slate-100 text-black rounded-lg text-[10px] font-bold border border-black/10 flex items-center gap-2">
                                                        <Tag size={10} /> {c.code}
                                                        <X size={10} className="cursor-pointer" onClick={() => setVerifiedCoupons(prev => prev.filter(vc => vc.code !== c.code))} />
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 rounded-[1.5rem] bg-white border border-slate-200 flex items-start gap-3">
                                        <Info size={16} className="text-slate-600 shrink-0 mt-0.5" />
                                        <p className="text-[10px] font-bold text-slate-700 leading-relaxed uppercase tracking-wider">
                                            Highway tolls are not included in the fixed price and must be paid by the customer at the counter.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
                <div className="p-4 md:p-8 pt-3 md:pt-4 border-t border-black/10 bg-white/80 backdrop-blur-sm shrink-0">
                    <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-3 md:gap-4">
                        <button
                            onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
                            className="flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-white rounded-xl md:rounded-2xl text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-slate-50 transition-all text-black border border-black shadow-sm w-full md:w-auto min-w-[120px]"
                        >
                            <ChevronLeft size={16} className="md:block hidden" /> {step === 1 ? 'Cancel' : 'Back'}
                        </button>

                        {step < 2 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                disabled={(step === 1 && (!formData.pickup || !formData.dropoff || isOverCapacity))}
                                className="group flex items-center justify-center gap-2 md:gap-3 px-8 md:px-12 py-3 md:py-4 bg-black text-white rounded-xl md:rounded-2xl text-xs md:text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-30 shadow-lg w-full md:w-auto min-w-[140px]"
                            >
                                Continue To Checkout <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform md:block hidden" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !formData.name || !formData.phone || (isAirportService && !formData.flightNumber)}
                                className="group flex items-center justify-center gap-2 md:gap-3 px-8 md:px-12 py-3 md:py-4 bg-black text-white rounded-xl md:rounded-2xl text-xs md:text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-30 shadow-lg w-full md:w-auto min-w-[160px]"
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} className="md:block hidden" />}
                                {loading ? 'Processing...' : 'Complete Booking'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}
