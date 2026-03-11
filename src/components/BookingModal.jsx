'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { X, MapPin, User, Users, CreditCard, Calendar, Clock, Phone, Mail, ChevronRight, ChevronLeft, Check, Loader2, Car, Navigation, ShieldCheck, Zap, Signpost, Tag, Briefcase, ShoppingBag, Info, AlertCircle, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import { useCurrency } from '../context/CurrencyContext';
import { calculateBasePrice, calculateSurcharges, calculatePaymentFees } from '../lib/pricing-util';
import LocationInput from './LocationInput';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
const STEPS = [
    { id: 1, title: 'Route & Vehicle', icon: MapPin },
    { id: 2, title: 'Checkout & Pay', icon: CreditCard },
];

// Strip 'KDH' from vehicle display names (DB IDs/records remain untouched)
const displayVehicleName = (name) => (name || '').replace(/\bKDH\s*/gi, '').trim();


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

            const isAirportPickup = (formData.pickup?.toLowerCase().includes('airport') || formData.dropoff?.toLowerCase().includes('airport')) || (typeof initialData.pickup === 'string' && initialData.pickup.toLowerCase().includes('airport'));

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
            <div id="modal-container" className="bg-white dark:bg-black w-full h-full sm:h-auto sm:max-h-[95vh] sm:rounded-[3rem] sm:border sm:border-slate-200 dark:border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] sm:max-w-4xl overflow-hidden flex flex-col animate-slide-up relative transition-colors duration-500">
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
                    <div className="p-8 md:p-12 pb-6 flex items-center justify-between shrink-0 pt-12 sm:pt-8 bg-white dark:bg-black transition-colors duration-500">
                        <div className="flex items-center gap-6 min-w-0">
                            <div className="w-14 h-14 bg-[#FACC15] rounded-2xl flex items-center justify-center shadow-2xl shrink-0 group hover:rotate-6 transition-transform">
                                <Zap size={32} className="text-black" strokeWidth={3} fill="currentColor" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-black dark:text-white leading-none truncate uppercase italic">
                                    SECURE <span className="text-[#FACC15]">BOOKING</span>
                                </h2>
                                <p className="text-[10px] md:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] mt-3">Elite Tier Encryption</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-14 h-14 bg-slate-100 dark:bg-white/10 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-white/10 hover:bg-red-500 hover:text-white transition-all z-[101] group shadow-sm">
                            <X size={28} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
                        </button>
                    </div>
                )}

                {/* Progress Indicators */}
                <div className="px-8 md:px-12 py-6 flex gap-4">
                    {STEPS.map((s) => (
                        <div key={s.id} className="flex-1 flex flex-col gap-3">
                            <div className={`h-3 rounded-full transition-all duration-1000 ${step >= s.id ? 'bg-[#FACC15] shadow-[0_0_20px_rgba(250,204,21,0.4)]' : 'bg-slate-100 dark:bg-white/5'}`}></div>
                            <span className={`text-[9px] font-black uppercase tracking-widest text-center ${step >= s.id ? 'text-black dark:text-[#FACC15]' : 'text-slate-400'}`}>{s.title}</span>
                        </div>
                    ))}
                </div>

                {/* Main Viewport */}
                <div ref={modalContentRef} className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar overscroll-contain">
                    {step === 1 && (
                        <div className="space-y-8 md:space-y-10 animate-slide-up">
                            {/* Trip Header */}
                            <div className="flex flex-wrap bg-slate-100 dark:bg-white/5 p-2 rounded-[2rem] border border-slate-200 dark:border-white/10 w-full md:w-fit gap-2">
                                {['one-way', 'round-trip'].map(t => (
                                    <button key={t} onClick={() => setFormData({ ...formData, tripType: t })} className={`flex-1 md:flex-none px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap italic ${formData.tripType === t ? 'bg-[#FACC15] text-black shadow-xl ring-2 ring-black/5' : 'text-slate-400 hover:text-black dark:hover:text-white'}`}>{t.replace('-', ' ')}</button>
                                ))}
                            </div>

                            {/* Location Inputs - Premium Sharp Card */}
                            <div className="premium-box bg-slate-50 dark:bg-[#0a0a0a] p-8 md:p-12 space-y-8 shadow-2xl">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-[10px] font-black text-black dark:text-white uppercase tracking-[0.4em] flex items-center gap-4 italic font-black">
                                        <div className="w-3 h-3 rounded-full bg-[#FACC15] animate-pulse"></div>
                                        ROUTING LOGISTICS
                                    </h3>
                                    <div className="px-6 py-2 bg-black text-[#FACC15] rounded-full text-[9px] font-black uppercase tracking-widest italic border border-white/10 shadow-xl">
                                        {formData.tripType.replace('-', ' ')}
                                    </div>
                                </div>
                                <div className="space-y-10 relative">
                                    <div className="relative group">
                                        <LocationInput
                                            label="Initial Pickup Point"
                                            icon={MapPin}
                                            placeholder="Where should we pick you up?"
                                            value={formData.pickup}
                                            onSelect={(loc) => setFormData(prev => ({ ...prev, pickup: loc.address, pickupCoords: loc.lat ? { lat: loc.lat, lon: loc.lon } : null }))}
                                        />
                                    </div>
                                    {/* Waypoints */}
                                    {formData.waypoints.map((wp, i) => (
                                        <div key={i} className="relative group animate-slide-in pl-12">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FACC15] z-10 p-2 bg-black rounded-lg shadow-lg">
                                                <Navigation size={18} strokeWidth={3} />
                                            </div>
                                            <div className="w-full pl-12 pr-6 py-6 bg-white dark:bg-white/5 rounded-2xl border-2 border-slate-100 dark:border-white/10 text-xs font-black text-black dark:text-white flex items-center justify-between shadow-sm group-hover:border-[#FACC15]/50 transition-all uppercase tracking-widest">
                                                <span className="truncate">{wp.address || wp.name}</span>
                                                <button
                                                    onClick={() => setFormData(prev => ({ ...prev, waypoints: prev.waypoints.filter((_, idx) => idx !== i) }))}
                                                    className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-white/10 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                                                >
                                                    <X size={18} strokeWidth={3} />
                                                </button>
                                            </div>
                                            {/* Connecting Line */}
                                            <div className="absolute left-6 -top-10 w-1 h-10 bg-gradient-to-b from-[#FACC15] to-transparent -z-10"></div>
                                        </div>
                                    ))}

                                    <div className="relative group">
                                        {/* Connecting Line from pickup to waypoints/dropoff */}
                                        <div className="absolute left-8 -top-10 w-1 h-10 bg-gradient-to-b from-slate-200 dark:from-white/10 to-transparent -z-10"></div>
                                        <LocationInput
                                            label="Final Destination"
                                            icon={Navigation}
                                            placeholder="Where are we heading?"
                                            value={formData.dropoff}
                                            onSelect={(loc) => setFormData(prev => ({ ...prev, dropoff: loc.address, dropoffCoords: loc.lat ? { lat: loc.lat, lon: loc.lon } : null }))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="space-y-6">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] pl-4 leading-none italic">Select Fleet Tier</label>
                                        <div className="grid grid-cols-1 gap-6">
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
                                                        className={`premium-box group/card relative w-full p-6 md:p-8 rounded-[2.5rem] border-4 transition-all cursor-pointer overflow-hidden flex flex-col gap-6 text-left
                                                        ${isSelected
                                                                ? 'border-[#FACC15] bg-slate-50 dark:bg-white/5 ring-8 ring-[#FACC15]/5 shadow-2xl'
                                                                : 'border-slate-100 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-black/20 dark:hover:border-white/30'}
                                                        ${!isFit ? 'opacity-30 grayscale pointer-events-none' : 'active:scale-[0.98]'}
                                                    `}
                                                    >
                                                        {/* Header info */}
                                                        <div className="flex items-center gap-8">
                                                            {/* Image Box */}
                                                            <div className="w-28 md:w-36 h-20 md:h-28 bg-white dark:bg-white/10 rounded-2xl flex items-center justify-center p-4 shrink-0 overflow-hidden border border-slate-100 dark:border-white/10 shadow-inner">
                                                                {v.image ? (
                                                                    <img src={v.image} alt={v.name} className="w-full h-full object-contain transition-transform duration-700 group-hover/card:scale-110" />
                                                                ) : (
                                                                    <Car className="text-slate-200 dark:text-white/10" size={40} />
                                                                )}
                                                            </div>

                                                            {/* Title & Badge */}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <span className="bg-[#FACC15] text-black text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest italic shadow-sm">100% A/C</span>
                                                                    {isSelected && <div className="w-2 h-2 rounded-full bg-[#FACC15] animate-ping"></div>}
                                                                </div>
                                                                <h4 className="text-2xl md:text-3xl font-black text-black dark:text-white uppercase italic tracking-tighter leading-none mb-1">{displayVehicleName(v.name)}</h4>
                                                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Premium Service Class</p>
                                                            </div>
                                                        </div>

                                                        {/* Capacity Grid */}
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="flex items-center gap-4 p-5 bg-white dark:bg-black/20 rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm transition-colors group-hover/card:bg-slate-50 dark:group-hover/card:bg-black/40">
                                                                <div className="w-12 h-12 bg-slate-50 dark:bg-white/10 rounded-xl flex items-center justify-center text-black dark:text-[#FACC15] shadow-sm">
                                                                    <Users size={22} strokeWidth={3} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Max PAX</p>
                                                                    <p className="text-base font-black text-black dark:text-white leading-none italic">{v.capacity}</p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-4 p-5 bg-white dark:bg-black/20 rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm transition-colors group-hover/card:bg-slate-50 dark:group-hover/card:bg-black/40">
                                                                <div className="w-12 h-12 bg-slate-50 dark:bg-white/10 rounded-xl flex items-center justify-center text-black dark:text-[#FACC15] shadow-sm">
                                                                    <Briefcase size={22} strokeWidth={3} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Baggage</p>
                                                                    <p className="text-base font-black text-black dark:text-white leading-none italic">{v.luggage || 0}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {pricingCategory !== 'ride-now' && (
                                        <div className="premium-box bg-slate-50 dark:bg-[#0a0a0a] p-8 md:p-10 space-y-10 shadow-xl overflow-hidden relative">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FACC15]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                            <div className="flex items-center gap-6 relative z-10">
                                                <div className="w-14 h-14 bg-black dark:bg-[#FACC15] rounded-2xl flex items-center justify-center text-[#FACC15] dark:text-black shadow-2xl transition-transform hover:rotate-6">
                                                    <Clock size={28} strokeWidth={3} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-black dark:text-white uppercase tracking-[0.4em] leading-none mb-2 italic">Schedule Protocol</p>
                                                    <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Time-Critical Dispatch</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 gap-8 relative z-10">
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] pl-4 leading-none italic">Flight/Voyage Signifier</label>
                                                    <div className="relative group">
                                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#FACC15] group-focus-within:text-black dark:group-focus-within:text-[#FACC15] transition-colors"><Zap size={18} strokeWidth={3} fill="currentColor" /></div>
                                                        <input
                                                            type="text"
                                                            value={formData.flightNumber || ''}
                                                            onChange={e => setFormData({ ...formData, flightNumber: e.target.value })}
                                                            className="w-full h-16 bg-white dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 pl-16 pr-8 rounded-3xl outline-none focus:border-[#FACC15] dark:focus:border-[#FACC15] transition-all font-black text-xs text-black dark:text-white shadow-sm uppercase tracking-widest placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                                            placeholder="e.g. UL 101"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] pl-4 leading-none italic">Target Date</label>
                                                        <input
                                                            type="date"
                                                            value={formData.flightArrivalDate || ''}
                                                            onChange={e => {
                                                                const d = e.target.value;
                                                                setFormData(prev => ({ ...prev, flightArrivalDate: d, arrivalDate: d, date: isAirportService ? d : prev.date }));
                                                            }}
                                                            className="w-full h-16 bg-white dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 px-8 rounded-3xl outline-none focus:border-[#FACC15] dark:focus:border-[#FACC15] transition-all font-black text-xs text-black dark:text-white shadow-sm uppercase tracking-widest invert dark:invert-0"
                                                        />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] pl-4 leading-none italic">Target Time</label>
                                                        <input
                                                            type="time"
                                                            value={formData.flightArrivalTime || ''}
                                                            onChange={e => {
                                                                const t = e.target.value;
                                                                setFormData(prev => ({ ...prev, flightArrivalTime: t, arrivalTime: t, time: isAirportService ? t : prev.time }));
                                                            }}
                                                            className="w-full h-16 bg-white dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 px-8 rounded-3xl outline-none focus:border-[#FACC15] dark:focus:border-[#FACC15] transition-all font-black text-xs text-black dark:text-white shadow-sm uppercase tracking-widest invert dark:invert-0"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] pl-3 leading-none">Passenger & Luggage</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            { id: 'adults', label: 'Adults', icon: Users },
                                            { id: 'children', label: 'Children', icon: User },
                                            { id: 'luggage', label: 'Check-in Luggage', icon: Briefcase },
                                            { id: 'handLuggage', label: 'Hand Luggage', icon: ShoppingBag }
                                        ].map((field) => (
                                            <div key={field.id} className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 md:p-5 rounded-[2rem] flex items-center justify-between shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-white dark:bg-white/10 rounded-lg flex items-center justify-center text-black dark:text-white shadow-sm border border-slate-100 dark:border-white/10">
                                                        <field.icon size={16} />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                                        {field.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={() => setFormData({
                                                            ...formData,
                                                            passengerCount: {
                                                                ...formData.passengerCount,
                                                                [field.id]: Math.max(0, formData.passengerCount[field.id] - 1)
                                                            }
                                                        })}
                                                        className="text-black dark:text-white font-black text-lg w-10 h-10 flex items-center justify-center bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/20 transition-all shadow-sm active:scale-95"
                                                    >
                                                        <Minus size={16} strokeWidth={3} />
                                                    </button>
                                                    <span className="text-lg font-black text-black dark:text-white min-w-[24px] text-center">{formData.passengerCount[field.id]}</span>
                                                    <button
                                                        onClick={() => setFormData({
                                                            ...formData,
                                                            passengerCount: {
                                                                ...formData.passengerCount,
                                                                [field.id]: formData.passengerCount[field.id] + 1
                                                            }
                                                        })}
                                                        className="text-white dark:text-black font-black text-lg w-10 h-10 flex items-center justify-center bg-black dark:bg-yellow-400 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
                                                    >
                                                        <Plus size={16} strokeWidth={3} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-black dark:bg-yellow-400 rounded-xl flex items-center justify-center text-white dark:text-black">
                                                    <Navigation size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-black dark:text-white uppercase tracking-[0.2em] leading-none mb-1">Total Distance</p>
                                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mt-1">Calculated via OSRM</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-black text-black dark:text-white leading-none italic">
                                                    {distance.toFixed(1)} <span className="text-xs text-slate-400 uppercase tracking-widest">KM</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {isOverCapacity && (
                                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-2xl flex items-center gap-4 animate-pulse">
                                            <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg text-red-600 dark:text-red-400">
                                                <AlertCircle size={18} />
                                            </div>
                                            <p className="text-[10px] md:text-xs font-black text-red-900 dark:text-red-400 leading-tight uppercase tracking-[0.1em]">
                                                Capacity Exceeded: {totalPassengers} Pax (Limit {selectedVehicle.capacity})
                                            </p>
                                        </div>
                                    )}

                                    <div className="pt-4 space-y-6">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] pl-3 leading-none">Greeting Service / Name Board</label>
                                        <div className="grid grid-cols-2 gap-5">
                                            <button
                                                onClick={() => setFormData({ ...formData, hasNameBoard: true })}
                                                className={`p-5 rounded-[2rem] border-2 transition-all flex items-center justify-between group/opt ${formData.hasNameBoard === true ? 'border-black dark:border-yellow-400 bg-black dark:bg-yellow-400 text-white dark:text-black shadow-xl scale-[1.02]' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 hover:border-black/30 dark:hover:border-white/30'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <Check size={20} strokeWidth={3} className={formData.hasNameBoard === true ? 'text-emerald-400 dark:text-emerald-950' : 'text-slate-300'} />
                                                    <span className="text-xs font-black uppercase tracking-widest italic">Yes, Please</span>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => setFormData({ ...formData, hasNameBoard: false, nameBoardText: '' })}
                                                className={`p-5 rounded-[2rem] border-2 transition-all flex items-center justify-between group/opt ${formData.hasNameBoard === false ? 'border-black dark:border-yellow-400 bg-black dark:bg-yellow-400 text-white dark:text-black shadow-xl scale-[1.02]' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 hover:border-black/30 dark:hover:border-white/30'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <X size={20} strokeWidth={3} className={formData.hasNameBoard === false ? 'text-red-400 dark:text-red-950' : 'text-slate-300'} />
                                                    <span className="text-xs font-black uppercase tracking-widest italic">No, Thanks</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {formData.hasNameBoard && (
                                        <div className="space-y-3 mt-6 animate-slide-up">
                                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] pl-3 leading-none">Name Board Content</label>
                                            <input
                                                type="text"
                                                value={formData.nameBoardText}
                                                onChange={e => setFormData({ ...formData, nameBoardText: e.target.value })}
                                                className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-8 rounded-2xl outline-none focus:border-black dark:focus:border-yellow-400 transition-all font-black text-xs text-black dark:text-white shadow-inner"
                                                placeholder="Enter pickup name or greeting..."
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-8 md:p-10 bg-black dark:bg-[#111] rounded-[3rem] text-white flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.4)] gap-10 relative overflow-hidden group border border-white/5">
                                {/* Decorative Background Glow */}
                                <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-400/5 rounded-full blur-[120px] -mr-36 -mt-36"></div>

                                <div className="relative z-10 space-y-10">
                                    <div className="flex items-center gap-3 text-yellow-400 mb-2">
                                        <Zap size={16} fill="currentColor" className="animate-pulse" />
                                        <span className="text-[11px] font-black uppercase tracking-[0.4em] italic">{formData.paymentType === 'partial' ? 'Deposit Payment' : 'Immediate Payment'}</span>
                                    </div>
                                    <div className="text-5xl md:text-7xl font-black leading-none tracking-tighter flex items-center gap-4 italic uppercase">
                                        <span className="text-2xl md:text-3xl font-black text-slate-500 not-italic">
                                            {(rates?.[currency]) ? currentSymbol : 'Rs'}
                                        </span>
                                        <span className="text-white">
                                            {payNow.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-left md:text-right bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-xl flex justify-between items-center">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Route Statistics</div>
                                    <div className="text-2xl font-black text-white italic">{distance.toFixed(1)} <span className="text-sm font-black text-yellow-400 not-italic ml-1 tracking-widest">KM</span></div>
                                </div>

                                {/* Multi-Currency Grid */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-px flex-1 bg-white/10"></div>
                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] whitespace-nowrap">Global Pricing</span>
                                        <div className="h-px flex-1 bg-white/10"></div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {convertToAllCurrencies(totalPrice / (rates?.[currency] || 1)).map((c) => (
                                            <button
                                                key={c.code}
                                                type="button"
                                                onClick={() => changeCurrency(c.code)}
                                                className={`p-4 rounded-2xl border-2 transition-all flex flex-col gap-3 text-left cursor-pointer relative overflow-hidden group/curr ${currency === c.code
                                                    ? 'bg-yellow-400 border-yellow-400 shadow-[0_10px_30px_rgba(250,204,21,0.2)] scale-[1.05]'
                                                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between relative z-10 w-full text-[10px] font-black uppercase tracking-[0.2em]">
                                                    <div className={`flex items-center gap-2 ${currency === c.code ? 'text-black' : 'text-slate-400 group-hover/curr:text-white transition-colors'}`}>
                                                        <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-black/10 shadow-sm bg-white p-0.5">
                                                            <img src={c.flag} alt={c.code} className="w-full h-full object-cover rounded-full" />
                                                        </div>
                                                        {c.code}
                                                    </div>
                                                </div>
                                                <div className={`text-xl font-black relative z-10 tracking-tighter flex items-baseline gap-1 mt-1 italic ${currency === c.code ? 'text-black' : 'text-white'}`}>
                                                    <span className={`text-[10px] font-black not-italic ${currency === c.code ? 'text-black/60' : 'text-slate-600'}`}>
                                                        {c.symbol}
                                                    </span>
                                                    <span>{c.value.toLocaleString()}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Breakdown & Coupons */}
                            <div className="space-y-4 bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm">
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
                                    <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500 bg-white dark:bg-black/40 p-3 rounded-xl border border-emerald-500/20">
                                        <div className="flex items-center gap-3">
                                            <Tag size={14} className="animate-bounce" />
                                            <span>
                                                {appliedCoupons?.length > 0 ? `Code applied` : 'Special Discount'}
                                            </span>
                                        </div>
                                        <span className="font-black italic">-{currentSymbol} {detailedBreakdown.discounts.toLocaleString()}</span>
                                    </div>
                                )}

                                {appliedCoupons?.length > 0 && (
                                    <div className="pt-3 border-t border-slate-200 dark:border-white/10">
                                        <div className="flex flex-wrap gap-2">
                                            {appliedCoupons.map((c, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-black dark:bg-yellow-400 text-white dark:text-black text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 shadow-sm">
                                                    <Check size={10} strokeWidth={4} /> {c}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-center justify-center gap-2 mt-4">
                                <div className="flex items-center gap-1.5 text-emerald-800">
                                    <ShieldCheck size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-900">Taxes Included • Tolls Excluded</span>
                                </div>
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-200">
                                    Highway Ticket paid by customer at counter
                                </p>
                            </div>
                        </div>
                    )}

                {step === 2 && (
                        <div className="animate-slide-up">
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h3 className="text-3xl md:text-5xl font-black text-black dark:text-white tracking-tighter uppercase italic leading-none mb-3">Final <span className="text-slate-400 dark:text-yellow-400">Checkout</span></h3>
                                    <p className="text-[10px] md:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] italic">Instant Confirmation • Secure Payment</p>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-12 gap-10">
                                {/* Left Column: Client Info & Logistics */}
                                <div className="lg:col-span-7 space-y-12">
                                    {!session && (
                                        <div className="bg-black dark:bg-yellow-400 border border-white/10 p-8 rounded-[2.5rem] flex items-center justify-between shadow-2xl relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                            <div className="flex items-center gap-6 relative z-10">
                                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-black flex items-center justify-center text-black dark:text-yellow-400 shadow-xl"><User size={28} /></div>
                                                <div>
                                                    <p className="text-sm font-black text-white dark:text-black uppercase tracking-widest italic">Personal Account?</p>
                                                    <p className="text-[10px] font-black text-white/40 dark:text-black/40 uppercase tracking-[0.2em] mt-1">Unlock priority support & booking history.</p>
                                                </div>
                                            </div>
                                            <button onClick={() => signIn()} className="relative z-10 px-10 py-4 bg-white dark:bg-black rounded-2xl text-xs font-black text-black dark:text-yellow-400 hover:scale-105 active:scale-95 transition-all shadow-xl uppercase tracking-widest italic">Sign In</button>
                                        </div>
                                    )}

                                    {/* Passenger & Luggage Summary/Adjust (Requested for Step 2) */}
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] pl-2">Adjust Logistics</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                { id: 'adults', label: 'Adults', icon: Users },
                                                { id: 'children', label: 'Children', icon: User },
                                                { id: 'luggage', label: 'Luggage', icon: Briefcase },
                                                { id: 'handLuggage', label: 'Hand', icon: ShoppingBag }
                                            ].map((field) => (
                                                <div key={field.id} className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5 rounded-[2rem] flex flex-col items-center justify-center gap-3 shadow-sm group">
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500/60 transition-colors group-hover:text-black dark:group-hover:text-yellow-400">{field.label}</span>
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={() => setFormData(prev => ({
                                                                ...prev,
                                                                passengerCount: {
                                                                    ...prev.passengerCount,
                                                                    [field.id]: Math.max(0, (prev.passengerCount[field.id] || 0) - 1)
                                                                }
                                                            }))}
                                                            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl text-black dark:text-white font-black hover:bg-slate-100 dark:hover:bg-white/20 transition-all shadow-sm active:scale-90"
                                                        ><Minus size={14} /></button>
                                                        <span className="font-black text-base text-black dark:text-white w-4 text-center">{(formData.passengerCount[field.id] || 0)}</span>
                                                        <button
                                                            onClick={() => setFormData(prev => ({
                                                                ...prev,
                                                                passengerCount: {
                                                                    ...prev.passengerCount,
                                                                    [field.id]: (prev.passengerCount[field.id] || 0) + 1
                                                                }
                                                            }))}
                                                            className="w-10 h-10 flex items-center justify-center bg-black dark:bg-yellow-400 border border-black dark:border-yellow-400 rounded-xl text-white dark:text-black font-black hover:scale-105 transition-all shadow-lg active:scale-90"
                                                        ><Plus size={14} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {isOverCapacity && (
                                            <div className="p-5 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-2xl flex items-center gap-4 animate-pulse">
                                                <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
                                                <p className="text-[10px] font-black text-red-900 dark:text-red-400 uppercase tracking-widest leading-none italic">
                                                    Capacity Warning: Selection exceeds {selectedVehicle?.name || 'Vehicle'} limits
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-10">
                                        <div className="grid md:grid-cols-2 gap-8">
                                            {[
                                                { label: 'Full Legal Name', key: 'name', type: 'text', placeholder: 'Passenger Name', icon: User },
                                                { label: 'Email Address', key: 'email', type: 'email', placeholder: 'for confirmation', icon: Mail },
                                                { label: 'Primary Contact No', key: 'phone', type: 'tel', placeholder: '+94 XXX XXX XXX', icon: Phone },
                                                { label: 'WhatsApp Number', key: 'whatsapp', type: 'tel', placeholder: 'For driver chat', icon: MessageSquare },
                                            ].map(f => (
                                                <div key={f.key} className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] pl-3 flex items-center gap-2">
                                                        <f.icon size={12} /> {f.label}
                                                    </label>
                                                    {f.type === 'tel' ? (
                                                        <PhoneInput
                                                            defaultCountry="lk"
                                                            value={formData[f.key] || ''}
                                                            onChange={(phone) => setFormData({ ...formData, [f.key]: phone })}
                                                            inputClassName="!w-full !h-14 !bg-transparent !border-none !px-4 !outline-none focus:!ring-0 !font-black !text-black dark:!text-white placeholder:!text-slate-300 dark:placeholder:!text-slate-600 !text-sm !uppercase !tracking-widest"
                                                            countrySelectorStyleProps={{
                                                                buttonClassName: '!h-14 !bg-slate-50 dark:!bg-white/5 !border-r !border-slate-200 dark:!border-white/10 !px-4 !flex !items-center !justify-center !min-w-[70px] !rounded-l-2xl',
                                                                flagClassName: '!w-8 !h-auto !shadow-sm',
                                                                dropdownStyleProps: {
                                                                    className: '!z-[20000] !min-w-[200px] !max-h-[300px] !rounded-2xl !border-2 !border-black dark:!border-yellow-400 !shadow-2xl !bg-white dark:!bg-black dark:!text-white'
                                                                }
                                                            }}
                                                            className="w-full bg-white dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 rounded-2xl flex focus-within:border-black dark:focus-within:border-yellow-400 transition-all overflow-visible shadow-sm"
                                                        />
                                                    ) : (
                                                        <input
                                                            type={f.type}
                                                            value={formData[f.key] || ''}
                                                            onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                                                            className="w-full h-14 bg-white dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 px-8 rounded-2xl outline-none focus:border-black dark:focus:border-yellow-400 transition-all font-black text-black dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-sm text-sm uppercase tracking-widest"
                                                            placeholder={f.placeholder}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-white/5">
                                            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] pl-2 flex items-center gap-3">
                                                <CreditCard size={14} /> Billing Details
                                            </h4>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <input
                                                    type="text"
                                                    value={formData.billingName || ''}
                                                    onChange={e => setFormData({ ...formData, billingName: e.target.value })}
                                                    className="w-full h-14 bg-white dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 px-8 rounded-2xl text-sm font-black text-black dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-sm uppercase tracking-widest outline-none focus:border-black dark:focus:border-yellow-400"
                                                    placeholder="Billing Name"
                                                />
                                                <input
                                                    type="text"
                                                    value={formData.billingCountry || ''}
                                                    onChange={e => setFormData({ ...formData, billingCountry: e.target.value })}
                                                    className="w-full h-14 bg-white dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 px-8 rounded-2xl text-sm font-black text-black dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-sm uppercase tracking-widest outline-none focus:border-black dark:focus:border-yellow-400"
                                                    placeholder="Country"
                                                />
                                                <textarea
                                                    rows="3"
                                                    value={formData.billingAddress}
                                                    onChange={e => setFormData({ ...formData, billingAddress: e.target.value })}
                                                    className="md:col-span-2 w-full px-8 py-5 bg-white dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 rounded-3xl text-sm font-black text-black dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 resize-none shadow-sm uppercase tracking-widest outline-none focus:border-black dark:focus:border-yellow-400"
                                                    placeholder="Full Billing Address"
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Summary & Payment */}
                                <div className="lg:col-span-5 space-y-8">
                                    <div className="p-8 md:p-10 bg-black dark:bg-[#111] rounded-[3rem] text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/5 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400/5 rounded-full blur-[80px] -mr-24 -mt-24"></div>

                                        <div className="relative z-10 space-y-8">
                                            <div className="flex items-center justify-between pb-6 border-b border-white/10">
                                                <div className="px-5 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-yellow-400 italic">
                                                    Route Confirmed
                                                </div>
                                                <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                                                    {formData.tripType.replace('-', ' ')}
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="flex gap-5">
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-yellow-400 shrink-0 border border-white/10 shadow-lg"><MapPin size={20} /></div>
                                                    <div className="min-w-0">
                                                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-1.5">Pick up</p>
                                                        <p className="text-xs font-black text-white leading-tight uppercase italic">{formData.pickup}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-5">
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 shrink-0 border border-white/10 shadow-lg"><Navigation size={20} /></div>
                                                    <div className="min-w-0">
                                                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-1.5">Drop off</p>
                                                        <p className="text-xs font-black text-white leading-tight uppercase italic">{formData.dropoff}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4 pt-8 mt-4 border-t border-white/10">
                                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                                                    <span>Base Fare</span>
                                                    <span className="text-white">{currentSymbol} {subtotal.toLocaleString()}</span>
                                                </div>

                                                {detailedBreakdown.detailedExtras?.filter(s => s.value > 0).map((s, idx) => (
                                                    <div key={idx} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                                                        <span>{s.label}</span>
                                                        <span className="text-emerald-400">+{currentSymbol} {s.value.toLocaleString()}</span>
                                                    </div>
                                                ))}

                                                {detailedBreakdown.discounts > 0 && (
                                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-yellow-500">
                                                        <span>Special discount</span>
                                                        <span className="font-black">-{currentSymbol} {detailedBreakdown.discounts.toLocaleString()}</span>
                                                    </div>
                                                )}

                                                <div className="pt-8 mt-4 border-t border-white/10 flex justify-between items-end">
                                                    <div>
                                                        <p className="text-[11px] font-black text-yellow-400 uppercase tracking-[0.4em] mb-3 italic animate-pulse">
                                                            {formData.paymentType === 'partial' ? 'Secure Deposit (50%)' : 'Total Amount'}
                                                        </p>
                                                        <p className="text-5xl font-black tracking-tighter text-white italic leading-none">
                                                            <span className="text-xl font-black mr-2 not-italic text-slate-500">{currentSymbol}</span>
                                                            {payNow.toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">Vehicle Fleet</p>
                                                        <p className="text-xs font-black text-white uppercase italic tracking-tighter">{displayVehicleName(selectedVehicle?.name)}</p>
                                                    </div>
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
                                                    className={`p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 group/pm ${formData.paymentMethod === m
                                                        ? 'border-black dark:border-yellow-400 bg-slate-50 dark:bg-yellow-400/10 shadow-xl'
                                                        : 'border-slate-100 dark:border-white/5 bg-white dark:bg-white/[0.02] opacity-40 hover:opacity-100'}`}
                                                >
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-transform group-hover/pm:scale-110 ${formData.paymentMethod === m ? 'bg-black dark:bg-yellow-400' : 'bg-slate-100 dark:bg-white/10'}`}>
                                                        {m === 'cash' ? <Coins size={24} className={formData.paymentMethod === m ? 'text-yellow-400 dark:text-black' : 'text-slate-400'} /> : <CreditCard size={24} className={formData.paymentMethod === m ? 'text-yellow-400 dark:text-black' : 'text-slate-400'} />}
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black dark:text-white">{m === 'cash' ? 'Pay Cash to Driver' : 'Online Secure Pay'}</span>
                                                </button>
                                            ))}
                                        </div>

                                        {formData.paymentMethod === 'card' && (
                                            <div className="grid grid-cols-2 gap-4 p-2 bg-slate-100 dark:bg-white/5 rounded-[2.5rem] border border-slate-200 dark:border-white/10">
                                                {['full', 'partial'].map(t => (
                                                    <button
                                                        key={t}
                                                        onClick={() => setFormData(prev => ({ ...prev, paymentType: t }))}
                                                        className={`py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${formData.paymentType === t
                                                            ? 'bg-black dark:bg-yellow-400 text-white dark:text-black'
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
                                            <div className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-2 rounded-2xl flex gap-2">
                                                <input
                                                    value={couponInput}
                                                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                                                    placeholder="ENTER COUPON..."
                                                    className="flex-1 h-12 bg-white dark:bg-black border border-slate-200 dark:border-white/10 px-6 rounded-xl text-[10px] font-black uppercase placeholder:normal-case tracking-widest outline-none focus:border-black dark:focus:border-yellow-400 text-black dark:text-white"
                                                />
                                                <button
                                                    onClick={() => handleApplyCoupon()}
                                                    disabled={couponLoading || !couponInput}
                                                    className="px-8 bg-black dark:bg-yellow-400 text-white dark:text-black rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-20 active:scale-95 transition-all shadow-lg"
                                                >
                                                    {couponLoading ? <Loader2 className="animate-spin" size={14} /> : 'Apply'}
                                                </button>
                                            </div>
                                        </div>
                                        {verifiedCoupons.length > 0 && (
                                            <div className="flex flex-wrap gap-2 px-2">
                                                {verifiedCoupons.map((c, i) => (
                                                    <span key={i} className="px-4 py-2 bg-black dark:bg-yellow-400 text-white dark:text-black rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-3 animate-slide-in">
                                                        <Tag size={12} fill="currentColor" /> {c.code}
                                                        <X size={14} className="cursor-pointer hover:rotate-90 transition-transform" onClick={() => setVerifiedCoupons(prev => prev.filter(vc => vc.code !== c.code))} />
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
                <div className="p-6 md:p-10 pt-4 md:pt-6 border-t border-slate-100 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-3xl shrink-0 transition-colors">
                    <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-4 md:gap-6">
                        <button
                            onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
                            className="flex items-center justify-center gap-4 px-10 py-5 bg-white dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-50 dark:hover:bg-white/10 transition-all text-black dark:text-white border-2 border-slate-100 dark:border-white/10 shadow-sm w-full md:w-auto min-w-[180px] italic active:scale-95"
                        >
                            <ChevronLeft size={18} /> {step === 1 ? 'Cancel Trip' : 'Return Back'}
                        </button>

                        {step < 2 ? (
                            <button
                                onClick={() => {
                                    setStep(step + 1);
                                    if (modalContentRef.current) modalContentRef.current.scrollTop = 0;
                                }}
                                disabled={(step === 1 && (!formData.pickup || !formData.dropoff || isOverCapacity || formData.hasNameBoard === null))}
                                className="group flex items-center justify-center gap-4 px-12 py-5 bg-black dark:bg-yellow-400 text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-800 dark:hover:scale-105 transition-all disabled:opacity-30 shadow-[0_15px_40px_rgba(0,0,0,0.3)] w-full md:w-auto min-w-[220px] italic active:scale-95"
                            >
                                Review & Checkout <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !formData.name || !formData.phone || (isAirportService && !formData.flightNumber)}
                                className="group flex items-center justify-center gap-4 px-12 py-5 bg-emerald-600 dark:bg-yellow-400 text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-700 dark:hover:scale-105 transition-all disabled:opacity-30 shadow-[0_20px_50px_rgba(5,150,105,0.3)] dark:shadow-[0_20px_50px_rgba(250,204,21,0.2)] w-full md:w-auto min-w-[240px] italic active:scale-95"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} fill="currentColor" />}
                                {loading ? 'Securing Spot...' : 'Confirm My Chauffeur'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
