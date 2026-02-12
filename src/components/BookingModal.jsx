'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { X, MapPin, User, Users, CreditCard, Calendar, Clock, Phone, Mail, ChevronRight, ChevronLeft, Check, Loader2, Car, Navigation, ShieldCheck, Zap, Signpost, Tag, Briefcase, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useCurrency } from '../context/CurrencyContext';
import { calculateBasePrice, calculateSurcharges, calculatePaymentFees } from '../lib/pricing-util';
import LocationInput from './LocationInput';
import CustomDateTimePicker from './CustomDateTimePicker';

const STEPS = [
    { id: 1, title: 'Route', icon: MapPin },
    { id: 2, title: 'Details', icon: User },
    { id: 3, title: 'Confirm', icon: CreditCard },
];


export default function BookingModal({ isOpen, onClose, initialData = {}, pricingCategory = 'airport-transfer' }) {
    const { data: session } = useSession();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [pricing, setPricing] = useState([]);
    const [distance, setDistance] = useState(0);
    const [verifiedCoupons, setVerifiedCoupons] = useState(initialData.verifiedCoupons || (initialData.verifiedCoupon ? [initialData.verifiedCoupon] : []));
    const [couponInput, setCouponInput] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);

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
        email: initialData.email || '',
        flightNumber: initialData.flightNumber || '',
        notes: initialData.notes || '',
        duration: initialData.duration || '',
        paymentMethod: 'cash',
        paymentType: 'full', // 'full' or 'partial'
    });

    // Coupon handlers

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
        { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee', flag: '🇱🇰' },
        { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
        { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
        { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
        { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
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

            const distKm = Math.ceil(distance);
            const baseTotal = calculateBasePrice(distKm, vehicleData, formData.tripType, formData.pickup, formData.dropoff);
            const surcharges = calculateSurcharges({
                waitingHours: formData.waitingHours,
                hasNameBoard: formData.hasNameBoard
            }, vehicleData);

            // Payment Method Surcharges per User Request
            // 1. Calculate for the current display currency (for UI)
            const paymentSurcharge = calculatePaymentFees(baseTotal + surcharges, formData.paymentMethod, currency);

            // 2. Calculate for LKR (for backend storage/consistency)
            const paymentSurchargeLKR = calculatePaymentFees(baseTotal + surcharges, formData.paymentMethod, 'LKR');

            let total = baseTotal + surcharges + paymentSurcharge; // Total in current currency context (mixed if rates missing, resolved below)

            // Coupon Logic (Stacking Rules & Auto-Discounts)
            const isAirportPickup = initialData.isAirportPickup || formData.pickup?.toLowerCase().includes('airport');

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

            // 2. Calculate Long Distance Discount (>175km = 10% off) - ONLY FOR AIRPORT PICKUPS
            let longDistanceDiscountAmount = 0;
            if (distKm > 175 && isAirportPickup) {
                longDistanceDiscountAmount = total * 0.10;
            }

            // 3. Apply MAX Rule (User gets the higher discount, no stacking)
            const finalDiscount = Math.max(couponDiscountAmount, longDistanceDiscountAmount);
            total = Math.max(0, total - finalDiscount);

            const payNow = formData.paymentType === 'partial' ? total * 0.5 : total;
            const balance = total - payNow;

            // Convert values to the selected currency
            const rate = rates?.[currency];

            // If the rate for the selected currency is missing (e.g. API failed), fallback to LKR display
            // This prevents "USD 4200" (LKR value with USD label)
            const effectiveRate = rate || 1;
            const usingFallback = !rate && currency !== 'LKR';
            const convertedTotal = Math.ceil(total * rate);
            const convertedPayNow = Math.ceil(payNow * rate);
            const convertedBalance = Math.ceil(balance * rate);
            const convertedSubtotal = Math.ceil(baseTotal * rate);
            const convertedSurcharges = Math.ceil((surcharges + paymentSurcharge) * rate);
            const convertedDiscounts = Math.ceil(finalDiscount * rate);

            // Detailed Surcharges for UI
            const detailedExtras = [
                { label: 'Waiting Time', value: Math.ceil(calculateSurcharges({ waitingHours: formData.waitingHours, hasNameBoard: false }, vehicleData) * rate) },
                { label: 'Name Board', value: Math.ceil(calculateSurcharges({ waitingHours: 0, hasNameBoard: formData.hasNameBoard }, vehicleData) * rate) }
            ].filter(s => s.value > 0);

            return {
                total: convertedTotal,
                subtotal: convertedSubtotal,
                surcharges: convertedSurcharges, // Keep this for legacy or total extra sum
                paymentFee: Math.ceil(paymentSurcharge * rate),
                detailedExtras,
                discounts: convertedDiscounts,
                appliedCoupons: verifiedCoupons,
                payNow: convertedPayNow,
                balance: convertedBalance,
                lkr: {
                    total: Math.ceil(baseTotal + surcharges + paymentSurchargeLKR - finalDiscount), // Re-calculate total strictly in LKR
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
    const { total: totalPrice, subtotal, surcharges, payNow, balance: balanceAmount, ...detailedBreakdown } = getPriceBreakdown();

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
                notes: formData.notes
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

    // Scroll to top when step changes and handle clock behavior
    useEffect(() => {
        if (modalContentRef.current) {
            modalContentRef.current.scrollTo({ top: 0, behavior: 'instant' });
        }
    }, [step]);

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-emerald-900/95 p-0 sm:p-4 overflow-hidden touch-none overscroll-none select-none">
            {/* Prevent Body Scroll Shadow Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>

            <style jsx global>{`
                body {
                    overflow: hidden !important;
                    touch-action: none;
                    -webkit-overflow-scrolling: none;
                }
            `}</style>

            {/* Modal Container */}
            <div id="modal-container" className="bg-white w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:rounded-[2rem] sm:border sm:border-emerald-900/10 shadow-2xl sm:max-w-4xl overflow-hidden flex flex-col animate-slide-up relative max-w-full overflow-y-auto">
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
                {/* Header */}
                <div className="p-4 md:p-8 pb-3 md:pb-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)] shrink-0">
                            <Zap size={22} className="text-amber-500 fill-amber-500" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 leading-none truncate">SECURE <span className="text-emerald-600 uppercase">BOOKING</span></h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Encrypted Payment</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 md:w-10 md:h-10 bg-emerald-50 rounded-lg md:rounded-xl flex items-center justify-center border border-emerald-900/10 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Progress Indicators */}
                <div className="px-5 md:px-8 py-4 flex gap-2">
                    {STEPS.map((s) => (
                        <div key={s.id} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s.id ? 'bg-emerald-900' : 'bg-emerald-50'}`}></div>
                    ))}
                </div>

                {/* Main Viewport */}
                <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar">
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
                                            {/* Red countdown bar removed as requested */}
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 min-h-0">
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
                                                    className={`group/card relative p-4 md:p-6 rounded-[2rem] border-2 transition-all cursor-pointer overflow-hidden flex flex-col gap-3 md:gap-4 h-full
                                                ${isSelected ? 'border-amber-500 bg-white shadow-xl shadow-amber-500/10' : 'border-emerald-900/5 bg-white hover:border-emerald-900/10 hover:shadow-lg'}
                                                ${!isFit ? 'opacity-40 grayscale pointer-events-none' : ''}
                                            `}
                                                >
                                                    {!isFit && (
                                                        <div className="absolute top-2 right-2 bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full z-10 uppercase tracking-widest">Limited Capacity</div>
                                                    )}
                                                    <div className="flex items-center gap-1.5 absolute top-2 right-2 opacity-60">
                                                        <div className="flex items-center gap-0.5 bg-white/50 px-1 rounded text-[8px] font-bold text-emerald-900">
                                                            <Users size={8} /> {v.capacity}
                                                        </div>
                                                    </div>

                                                    {v.image ? (
                                                        <img src={v.image} alt={v.name} className="w-20 h-10 object-contain mb-1 mix-blend-multiply" />
                                                    ) : (
                                                        <Car className={isSelected ? 'text-emerald-900' : 'text-emerald-900/20'} size={24} />
                                                    )}

                                                    <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-center leading-tight mb-1 ${isSelected ? 'text-emerald-900' : 'text-emerald-900/40'}`}>{v.name}</span>

                                                    <div className="flex items-center gap-2 text-[8px] font-bold text-emerald-900/50">
                                                        <div className="flex items-center gap-0.5" title="Max Luggage">
                                                            <Briefcase size={9} /> {v.luggage || 0}
                                                        </div>
                                                        <div className="flex items-center gap-0.5" title="Max Hand Luggage">
                                                            <ShoppingBag size={9} /> {v.handLuggage || 0}
                                                        </div>
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
                                                    {formData.arrivalDate ? new Date(formData.arrivalDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : '---'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {isOverCapacity && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-pulse">
                                            <div className="pt-0.5 text-red-600"><Lock size={14} /></div>
                                            <p className="text-[10px] font-bold text-red-900 leading-tight uppercase tracking-widest">
                                                Capacity Exceeded: {totalPassengers} Pax (Max {selectedVehicle.capacity}), {formData.passengerCount.luggage} Lugg (Max {selectedVehicle.luggage || 0}), {formData.passengerCount.handLuggage} Hand (Max {selectedVehicle.handLuggage || 0})
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
                                                    <span className="text-[10px] md:text-xs font-bold block uppercase tracking-tight">Board</span>
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

                            <div className="p-6 md:p-8 bg-slate-900 rounded-[2.5rem] text-white flex flex-col shadow-2xl gap-8 relative overflow-hidden group">
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
                                                className={`p-3 rounded-2xl border-2 transition-all flex flex-col gap-1 text-left cursor-pointer group/card ${currency === c.code
                                                    ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                                                    : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                                                        <span className="text-xs">{c.flag}</span> {c.code}
                                                    </span>
                                                    {currency === c.code && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgb(245,158,11)]"></div>}
                                                </div>
                                                <div className={`text-sm md:text-base font-black ${currency === c.code ? 'text-amber-500' : 'text-white'}`}>
                                                    <span className="text-[10px] font-bold mr-1 opacity-60">{c.symbol}</span>
                                                    {c.value.toLocaleString()}
                                                </div>
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

                            <div className="flex items-center justify-center gap-1.5 mt-4 text-emerald-600/80">
                                <ShieldCheck size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Inclusive of taxes & tolls</span>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 md:space-y-8 animate-slide-up">
                            {!session && (
                                <div className="bg-emerald-50 border border-emerald-900/10 p-4 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><User size={16} /></div>
                                        <div>
                                            <p className="text-xs font-bold text-emerald-900">Have an account?</p>
                                            <p className="text-[10px] text-emerald-900/60">Log in to track bookings easily.</p>
                                        </div>
                                    </div>
                                    <button onClick={() => signIn()} className="px-4 py-2 bg-white border border-emerald-900/10 rounded-lg text-xs font-bold text-emerald-900 hover:bg-emerald-50 transition-colors">Log In</button>
                                </div>
                            )}

                            <h3 className="text-xl font-bold text-emerald-600 tracking-tight text-center md:text-left">Client Verification</h3>
                            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                                {[
                                    { label: 'Full Legal Name', key: 'name', type: 'text', placeholder: 'Passenger Name' },
                                    { label: 'Primary Contact No', key: 'phone', type: 'tel', placeholder: '+94 XXX XXX XXX' },
                                    { label: 'WhatsApp Number', key: 'whatsapp', type: 'tel', placeholder: 'For driver communication' }, // New Field
                                    { label: 'Email Address', key: 'email', type: 'email', placeholder: 'for confirmation' },
                                    { label: 'Flight Identifier', key: 'flightNumber', type: 'text', placeholder: 'e.g. EK 654' },
                                ].map(f => (
                                    <div key={f.key} className="space-y-2">
                                        <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest pl-2">{f.label}</label>
                                        <input
                                            type={f.type}
                                            value={formData[f.key] || ''}
                                            onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                                            className={`w-full ${f.key === 'flightNumber' || f.key === 'whatsapp' ? 'h-20 md:h-24 text-xl md:text-2xl shadow-emerald-500/10' : 'h-14 md:h-16 text-base'} bg-white border-2 border-emerald-900/10 px-4 md:px-6 rounded-2xl outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-900/5 transition-all font-black text-emerald-900 placeholder:font-medium placeholder:text-slate-300 shadow-sm`}
                                            placeholder={f.placeholder}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest pl-2">Pick-up Logistics</label>
                                <CustomDateTimePicker
                                    date={formData.date}
                                    time={formData.time}
                                    onChange={(d, t) => setFormData({ ...formData, date: d, time: t })}
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 md:space-y-8 animate-slide-up">
                            <div className="flex items-center gap-4 p-4 md:p-6 bg-emerald-50 rounded-3xl border border-emerald-900/10 shadow-sm">
                                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                    <ShieldCheck size={28} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-emerald-900">Verified Route Summary</h4>
                                    <p className="text-[10px] text-emerald-600 uppercase font-extrabold tracking-widest">Ready for deployment</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-900/10"><MapPin size={16} /></div>
                                            <div>
                                                <p className="text-[8px] font-black text-emerald-900/40 uppercase tracking-[0.2em] mb-1">Pick up From</p>
                                                <p className="text-sm font-bold leading-relaxed text-emerald-900">{formData.pickup}</p>
                                            </div>
                                        </div>
                                        {formData.waypoints.map((wp, i) => (
                                            <div key={i} className="flex items-start gap-4">
                                                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-900/10"><Navigation size={14} /></div>
                                                <div>
                                                    <p className="text-[8px] font-black text-emerald-900/40 uppercase tracking-[0.2em] mb-1">Stop {i + 1}</p>
                                                    <p className="text-sm font-bold leading-relaxed text-emerald-900">{wp.name}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex items-start gap-4">
                                            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-red-600 shrink-0 border border-emerald-900/10"><MapPin size={16} /></div>
                                            <div>
                                                <p className="text-[8px] font-black text-emerald-900/40 uppercase tracking-[0.2em] mb-1">Drop off To</p>
                                                <p className="text-sm font-bold leading-relaxed text-emerald-900">{formData.dropoff}</p>
                                            </div>
                                        </div>
                                        <div className="p-4 sm:p-5 md:p-6 bg-[#FFC107] rounded-3xl border border-amber-600/20 space-y-3 md:space-y-4 shadow-lg w-full">
                                            <div className="flex justify-between items-center w-full">
                                                <span className="text-[10px] md:text-xs font-bold text-emerald-900/60 uppercase tracking-widest">Subtotal</span>
                                                <span className="text-sm md:text-base font-bold text-emerald-900 text-right">{currentSymbol} {subtotal.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center w-full">
                                                <span className="text-[10px] md:text-xs font-bold text-emerald-900/60 uppercase tracking-widest">Extra Services</span>
                                                <span className="text-sm md:text-base font-bold text-emerald-900 text-right">{currentSymbol} {(subtotal + surcharges - subtotal).toLocaleString()}</span>
                                            </div>

                                            {/* Applied Coupons Summary - Styled Row */}
                                            {detailedBreakdown.discounts > 0 && (
                                                <div className="flex justify-between items-center w-full py-2 border-t border-b border-amber-600/10 my-2">
                                                    <div className="flex items-center gap-2 text-amber-900">
                                                        <Tag size={14} className="fill-amber-900/20" />
                                                        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Discount Applied</span>
                                                    </div>
                                                    <span className="text-sm md:text-base font-black text-amber-900 text-right">
                                                        - {currentSymbol} {detailedBreakdown.discounts.toLocaleString()}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Applied Coupons Summary */}
                                            {/* This section is removed as the discount is now consolidated in detailedBreakdown.discounts */}
                                            {/* {verifiedCoupons.length > 0 && verifiedCoupons.map((c, i) => (
                                                <div key={i} className="flex justify-between items-center w-full text-emerald-800">
                                                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                                                        <Tag size={10} /> {c.code}
                                                    </span>
                                                    <span className="text-sm md:text-base font-bold text-right">- {currentSymbol} {c.discountType === 'percentage' ? ((totalPrice * c.value) / 100).toLocaleString() : c.value}</span>
                                                </div>
                                            ))} */}

                                            <div className="pt-3 md:pt-4 border-t border-emerald-900/10 space-y-2 w-full">
                                                <div className="flex flex-row flex-wrap justify-between items-center w-full gap-2">
                                                    <span className="text-[10px] md:text-xs font-bold text-emerald-900/60 uppercase tracking-widest shrink-0">Subtotal</span>
                                                    <span className="text-sm md:text-base font-bold text-emerald-900/60 text-right truncate">
                                                        {currentSymbol} {subtotal.toLocaleString()}
                                                    </span>
                                                </div>

                                                {/* Break down Extras */}
                                                {detailedBreakdown.detailedExtras?.map((s, idx) => (
                                                    <div key={idx} className={`flex justify-between items-center w-full gap-2 ${s.isFee ? 'text-amber-700 font-black' : 'text-emerald-900/40'}`}>
                                                        <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-tight shrink-0">{s.label}</span>
                                                        <span className="text-[11px] md:text-sm font-bold text-right truncate">+{currentSymbol} {s.value.toLocaleString()}</span>
                                                    </div>
                                                ))}

                                                {/* Applied Coupons Summary (In Step 3) */}
                                                {(detailedBreakdown.discounts > 0 || verifiedCoupons.length > 0) && (
                                                    <div className="flex justify-between items-center w-full gap-2 text-emerald-700 bg-white/50 p-2 rounded-lg">
                                                        <div className="flex items-center gap-1.5 min-w-0">
                                                            <Tag size={12} className="shrink-0" />
                                                            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-tight truncate">
                                                                {verifiedCoupons.length > 0 ? `Coupon: ${verifiedCoupons.map(c => c.code).join(', ')}` : 'Discount Applied'}
                                                            </span>
                                                        </div>
                                                        <span className="text-[11px] md:text-sm font-black text-right shrink-0">-{currentSymbol} {detailedBreakdown.discounts.toLocaleString()}</span>
                                                    </div>
                                                )}

                                                <div className="pt-2 mt-2 border-t border-emerald-900/10">
                                                    <div className="flex flex-row flex-wrap justify-between items-center w-full gap-2">
                                                        <span className="text-[10px] sm:text-xs md:text-sm font-black text-emerald-900 uppercase tracking-widest leading-tight">
                                                            {formData.paymentType === 'partial' ? 'Pay Now (50%)' : 'Total Payable'}
                                                        </span>
                                                        <span className="text-lg sm:text-2xl md:text-3xl font-black text-emerald-900 text-right leading-none shrink-0 bg-white/90 px-3 py-1 rounded-xl shadow-md border border-emerald-900/5">
                                                            {currentSymbol} {payNow.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                {formData.paymentType === 'partial' && (
                                                    <div className="flex justify-between items-end pt-2 border-t border-dashed border-emerald-900/20 gap-2">
                                                        <span className="font-bold text-red-600 uppercase text-[10px] md:text-xs tracking-wider md:tracking-[0.2em]">Balance Due</span>
                                                        <span className="text-base md:text-lg font-bold text-red-600 ml-auto text-right">{currentSymbol} {balanceAmount.toLocaleString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest pl-2">Discount Coupon</label>
                                        <div className="flex gap-2 relative">
                                            <input
                                                value={couponInput}
                                                onChange={e => setCouponInput(e.target.value.toUpperCase())}
                                                placeholder="ENTER CODE"
                                                className="flex-1 h-14 bg-white border-2 border-amber-300 px-4 rounded-xl outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all font-black text-lg text-emerald-900 uppercase placeholder:normal-case shadow-sm"
                                            />
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={couponLoading || !couponInput}
                                                className={`px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center min-w-[100px] shadow-lg ${couponInput ? 'bg-emerald-900 text-white hover:scale-105' : 'bg-slate-200 text-slate-400'}`}
                                            >
                                                {couponLoading ? <Loader2 className="animate-spin" size={16} /> : 'APPLY'}
                                            </button>
                                        </div>
                                        {verifiedCoupons.length > 0 && (
                                            <div className="flex flex-col gap-2 animate-fade-in mt-2">
                                                {verifiedCoupons.map((c, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200 text-xs font-bold pl-2">
                                                        <Check size={14} className="bg-emerald-500 text-white rounded-full p-0.5" />
                                                        <span>Coupon: <span className="uppercase">{c.code}</span></span>
                                                        <span className="text-emerald-900/60 font-medium ml-auto">
                                                            (-{c.discountType === 'percentage' ? `${c.value}%` : `Rs ${c.value}`})
                                                        </span>
                                                        <button
                                                            onClick={() => setVerifiedCoupons(prev => prev.filter(vc => vc.code !== c.code))}
                                                            className="ml-2 text-red-500 hover:bg-red-50 rounded-full p-1"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest pl-2">Payment Method</label>
                                    <div className="grid grid-cols-1 gap-4">
                                        {[
                                            { id: 'cash', label: 'Cash Payment', icon: '💵', desc: 'Pay directly to chauffeur' },
                                            { id: 'card', label: 'Online Payment', icon: '💳', desc: 'Secure digital transaction' },
                                        ].map(m => (
                                            <div key={m.id}>
                                                <button onClick={() => setFormData({ ...formData, paymentMethod: m.id })} className={`w-full p-4 md:p-6 rounded-[1.5rem] border-2 transition-all flex items-center gap-4 md:gap-6 text-left ${formData.paymentMethod === m.id ? 'border-emerald-900 bg-emerald-50' : 'border-emerald-900/5 bg-white hover:border-emerald-900/20 shadow-sm'}`}>
                                                    <span className="text-3xl md:text-4xl">{m.icon}</span>
                                                    <div>
                                                        <p className="font-bold text-emerald-900 text-sm tracking-tight">{m.label}</p>
                                                        <p className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest">{m.desc}</p>
                                                    </div>
                                                </button>

                                                {/* Payment Options (Full vs 50%) for Card */}
                                                {formData.paymentMethod === 'card' && m.id === 'card' && (
                                                    <div className="mt-3 ml-4 pl-4 border-l-2 border-emerald-900/10 space-y-3 animate-slide-up">
                                                        <button
                                                            onClick={() => setFormData({ ...formData, paymentType: 'full' })}
                                                            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${formData.paymentType === 'full' ? 'bg-emerald-900 text-white border-emerald-900 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-900/30'}`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.paymentType === 'full' ? 'border-white' : 'border-slate-400'}`}>
                                                                    {formData.paymentType === 'full' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                                                </div>
                                                                <span className="text-xs font-bold uppercase tracking-wide">Pay Full Amount</span>
                                                            </div>
                                                            <span className="text-xs font-bold text-emerald-400">100%</span>
                                                        </button>

                                                        <button
                                                            onClick={() => setFormData({ ...formData, paymentType: 'partial' })}
                                                            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${formData.paymentType === 'partial' ? 'bg-emerald-900 text-white border-emerald-900 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-900/30'}`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.paymentType === 'partial' ? 'border-white' : 'border-slate-400'}`}>
                                                                    {formData.paymentType === 'partial' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                                                </div>
                                                                <div className="text-left">
                                                                    <span className="text-xs font-bold uppercase tracking-wide block">Pay Advance Only</span>
                                                                    <span className="text-[10px] opacity-60">Pay balance to driver</span>
                                                                </div>
                                                            </div>
                                                            <span className="text-xs font-bold text-amber-400">50%</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest pl-2">Extra Services</label>
                                    <div className="p-4 rounded-2xl border transition-all flex items-center justify-between bg-amber-500/5 border-amber-500/20">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.hasNameBoard ? 'bg-amber-500/10 text-amber-500' : 'bg-white/5 text-white/40'}`}>
                                                <Signpost size={16} />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block leading-tight">Board</span>
                                                <span className="text-[11px] font-bold text-white uppercase">{formData.hasNameBoard ? 'Confirmed' : 'Not Requested'}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setFormData(prev => ({ ...prev, hasNameBoard: !prev.hasNameBoard }))}
                                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${formData.hasNameBoard ? 'bg-amber-500 text-black' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                                        >
                                            {formData.hasNameBoard ? 'Remove' : 'Add'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="p-4 md:p-8 pt-3 md:pt-4 border-t border-emerald-900/10 bg-emerald-50/50 shrink-0">
                    <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-3 md:gap-4">
                        <button
                            onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
                            className="flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-white rounded-xl md:rounded-2xl text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-emerald-50 transition-all text-emerald-900 border border-emerald-900/10 shadow-sm w-full md:w-auto min-w-[120px]"
                        >
                            <ChevronLeft size={16} className="md:block hidden" /> {step === 1 ? 'Cancel' : 'Back'}
                        </button>

                        {step < 3 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                disabled={(step === 1 && (!formData.pickup || !formData.dropoff || isOverCapacity)) || (step === 2 && (!formData.name || !formData.phone))}
                                className="group flex items-center justify-center gap-2 md:gap-3 px-8 md:px-12 py-3 md:py-4 bg-emerald-900 text-white rounded-xl md:rounded-2xl text-xs md:text-sm font-black uppercase tracking-widest hover:bg-emerald-800 transition-all disabled:opacity-30 shadow-lg w-full md:w-auto min-w-[140px]"
                            >
                                Continue <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform md:block hidden" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="group flex items-center justify-center gap-2 md:gap-3 px-8 md:px-12 py-3 md:py-4 bg-emerald-900 text-white rounded-xl md:rounded-2xl text-xs md:text-sm font-black uppercase tracking-widest hover:bg-emerald-800 transition-all disabled:opacity-30 shadow-lg w-full md:w-auto min-w-[160px]"
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} className="md:block hidden" />}
                                {loading ? 'Processing...' : 'Complete Booking'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
