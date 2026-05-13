'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { X, MapPin, User, Users, CreditCard, Calendar, Clock, Phone, Mail, ChevronRight, ChevronLeft, ArrowLeft, ArrowRight, Check, Loader2, Car, Navigation, ShieldCheck, Zap, Signpost, Tag, Briefcase, ShoppingBag, Info, AlertCircle, Plus, Minus, MessageSquare, Coins, ChevronDown, Wind, PlaneTakeoff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import { useCurrency } from '../context/CurrencyContext';
import { calculateBasePrice, calculateSurcharges, calculatePaymentFees, calculateTrafficSurge } from '../lib/pricing-util';
import LocationInput from './LocationInput';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import VehicleCarousel from './VehicleCarousel';

const STEPS = [
    { id: 1, title: 'Route & Vehicle', icon: MapPin },
    { id: 2, title: 'Passenger Details', icon: User },
    { id: 3, title: 'Confirm & Pay', icon: CreditCard },
];

// Strip 'KDH' and any model details in parentheses from vehicle display names
const displayVehicleName = (name) => (name || '').replace(/\bKDH\s*/gi, '').split('(')[0].trim();

export default function BookingModal({ isOpen, onClose, initialData = {}, pricingCategory = 'airport-transfer' }) {
    const { data: session } = useSession();
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});
    const isAirportService = pricingCategory === 'airport-transfer';
    const [loading, setLoading] = useState(false);
    const [hasAgreed, setHasAgreed] = useState(false);
    const [pricing, setPricing] = useState(initialData.pricing || []);
    const [distance, setDistance] = useState(0);
    const [verifiedCoupons, setVerifiedCoupons] = useState(initialData.verifiedCoupons || (initialData.verifiedCoupon ? [initialData.verifiedCoupon] : []));
    const [couponInput, setCouponInput] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [pricingSettings, setPricingSettings] = useState({ longDistanceThreshold: 175, longDistanceDiscountPercentage: 10, isActive: true });
    const [destinations, setDestinations] = useState([]);
    const [isVehicleExpanded, setIsVehicleExpanded] = useState(true);
    const [isFleetExpanded, setIsFleetExpanded] = useState(false);
    const [surgeRules, setSurgeRules] = useState([]);

    const { currency, rates, changeCurrency } = useCurrency();
    const currentSymbol = rates?.[currency]?.symbol || (currency === 'LKR' ? 'Rs' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'INR' ? '₹' : '$');

    const SUPPORTED_CURRENCIES = [
        { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee', flag: 'https://flagcdn.com/w40/lk.png' },
        { code: 'USD', symbol: '$', name: 'US Dollar', flag: 'https://flagcdn.com/w40/us.png' },
        { code: 'EUR', symbol: '€', name: 'Euro', flag: 'https://flagcdn.com/w40/eu.png' },
        { code: 'GBP', symbol: '£', name: 'British Pound', flag: 'https://flagcdn.com/w40/gb.png' },
        { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: 'https://flagcdn.com/w40/in.png' },
    ];

    // Fetch Settings and Destinations
    useEffect(() => {
        if (!isOpen) return;
        
        document.body.classList.add('booking-active');
        
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/admin/pricing-settings', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.data) setPricingSettings(data.data);
                }
            } catch (err) { console.error("Fetch Settings Error:", err); }
        };
        
        const fetchDestinations = async () => {
            try {
                const res = await fetch('/api/admin/destinations', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) setDestinations(data.data);
                }
            } catch (err) { console.error("Fetch Destinations Error:", err); }
        };

        fetchSettings();
        fetchDestinations();
        
        return () => document.body.classList.remove('booking-active');
    }, [isOpen]);

    // Body Scroll Lock & Hide Chat & Hide Bottom Nav
    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            const originalTouchAction = document.body.style.touchAction;
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';

            const chatTrigger = document.querySelector('.live-chat-trigger');
            if (chatTrigger) chatTrigger.style.display = 'none';

            // Always hide bottom nav when modal is open to prevent overlapping buttons
            document.body.classList.add('hide-bottom-nav');

            return () => {
                document.body.style.overflow = originalOverflow;
                document.body.style.touchAction = originalTouchAction;
                document.body.classList.remove('hide-bottom-nav');
                const chatTriggerBack = document.querySelector('.live-chat-trigger');
                if (chatTriggerBack) chatTriggerBack.style.display = 'flex';
            };
        }
    }, [isOpen]);

    // Form State
    const [formData, setFormData] = useState({
        vehicle: initialData.vehicle || 'mini-car',
        pickup: initialData.pickup || '',
        pickupCoords: initialData.pickupCoords || null,
        waypoints: initialData.waypoints || [],
        dropoff: initialData.dropoff || '',
        dropoffCoords: initialData.dropoffCoords || null,
        tripType: initialData.tripType || 'one-way',
        roundTripPackageId: initialData.roundTripPackageId || null,
        passengerCount: initialData.passengerCount || { adults: 1, children: 0, luggage: 0, handLuggage: 0 },
        hasNameBoard: (initialData.hasNameBoard === true || initialData.hasNameBoard === false) ? initialData.hasNameBoard : null,
        nameBoardText: initialData.nameBoardText || '',
        couponCode: initialData.couponCode || '',
        date: initialData.date || '',
        time: initialData.time || '',
        name: initialData.name || '',
        phone: initialData.phone || '',
        whatsapp: initialData.whatsapp || '',
        passport: initialData.passport || '',
        email: initialData.email || '',
        flightNumber: initialData.flightNumber || '',
        flightArrivalDate: initialData.flightArrivalDate || '',
        flightArrivalTime: initialData.flightArrivalTime || '',
        arrivalDate: initialData.arrivalDate || '',
        returnDate: initialData.returnDate || '',
        returnTime: initialData.returnTime || '',
        notes: initialData.notes || '',
        duration: initialData.duration || '',
        paymentMethod: 'cash',
        paymentType: 'full',
        billingName: '',
        billingAddress: '',
        billingCity: '',
        billingCountry: '',
    });

    // Initialize State from initialData
    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({ 
                ...prev, 
                ...initialData,
                pickup: initialData.pickup || prev.pickup,
                dropoff: initialData.drop || initialData.dropoff || prev.dropoff,
                vehicle: initialData.vehicle || prev.vehicle,
                passengerCount: { ...prev.passengerCount, ...(initialData.passengerCount || {}) },
                waypoints: initialData.waypoints || prev.waypoints,
                roundTripPackageId: initialData.roundTripPackageId || prev.roundTripPackageId,
                hasNameBoard: !isAirportService ? false : ((initialData.hasNameBoard === true || initialData.hasNameBoard === false) ? initialData.hasNameBoard : null)
            }));
            
            setIsVehicleExpanded(!initialData.vehicle);
            setStep(1);

            if (initialData.pricing) setPricing(initialData.pricing);
            if (initialData.distance) setDistance(Number(initialData.distance));
            if (initialData.verifiedCoupons) setVerifiedCoupons(initialData.verifiedCoupons);
            if (initialData.couponCode) {
                setCouponInput(initialData.couponCode);
                handleApplyCoupon(initialData.couponCode, initialData.pickup || formData.pickup, initialData.dropoff || formData.dropoff);
            }
        }
    }, [isOpen, initialData, isAirportService]);

    // Auto-detect coupons for the route
    useEffect(() => {
        if (formData.pickup && formData.dropoff) {
            const detectBestCoupon = async () => {
                try {
                    const res = await fetch('/api/coupons?public=true');
                    const coupons = await res.json();
                    if (!Array.isArray(coupons)) return;

                    const p = formData.pickup.toLowerCase();
                    const d = formData.dropoff.toLowerCase();

                    // Find best applicable coupon
                    const applicable = coupons.filter(c => {
                        if (!c.applicableLocations || c.applicableLocations.length === 0) return true;
                        return c.applicableLocations.some(loc => {
                            const l = loc.toLowerCase().trim();
                            if (l.includes('->')) {
                                const [from, to] = l.split('->').map(s => s.trim());
                                return p.includes(from) && d.includes(to);
                            }
                            return p.includes(l) || d.includes(l);
                        });
                    });

                    if (applicable.length > 0 && verifiedCoupons.length === 0) {
                        // Apply the first one automatically if none applied
                        handleApplyCoupon(applicable[0].code, formData.pickup, formData.dropoff);
                    }
                } catch (err) {
                    console.error("Auto-coupon detection failed", err);
                }
            };
            
            const timer = setTimeout(detectBestCoupon, 1000);
            return () => clearTimeout(timer);
        }
    }, [formData.pickup, formData.dropoff]);

    const handleApplyCoupon = async (codeToApply = couponInput, contextPickup = formData.pickup, contextDropoff = formData.dropoff) => {
        const input = (codeToApply || '').trim();
        if (!input || !contextPickup) return false;

        setCouponLoading(true);
        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: input, pickup: contextPickup, dropoff: contextDropoff })
            });
            const data = await res.json();
            if (data.valid) {
                setVerifiedCoupons(prev => {
                    if (prev.some(c => c.code.toUpperCase() === data.coupon.code.toUpperCase())) return prev;
                    return [...prev, data.coupon];
                });
                setFormData(prev => ({ ...prev, couponCode: data.coupon.code }));
                if (!codeToApply) setCouponInput('');
                return true;
            } else {
                if (!codeToApply) alert(data.message);
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

    const convertToAllCurrencies = (amountLKR) => {
        return SUPPORTED_CURRENCIES.map(c => {
            const rate = rates?.[c.code] || 1;
            const convertedRaw = amountLKR * rate;
            const value = c.code === 'LKR' ? Math.round(amountLKR) : Number(convertedRaw.toFixed(2));
            return { ...c, value };
        });
    };

    const getPriceBreakdown = () => {
        try {
            const vehicleData = pricing.find(p => p.vehicleType === formData.vehicle);
            const distKm = Number(distance || initialData.distance || 0);
            const isAirportPickup = (formData.pickup?.toLowerCase().includes('airport') || formData.dropoff?.toLowerCase().includes('airport')) || (typeof initialData.pickup === 'string' && initialData.pickup.toLowerCase().includes('airport'));

            if (!vehicleData) {
                return { total: 0, subtotal: 0, surcharges: 0, payNow: 0, balance: 0, lkr: { total: 0, payNow: 0, balance: 0, surcharges: 0, subtotal: 0 }, originalLKR: 0 };
            }

            const baseTotal = calculateBasePrice(distKm, vehicleData, formData.tripType, formData.pickup, formData.dropoff, destinations, { 
                roundTripPackageId: formData.roundTripPackageId,
                roundTripPackages: pricingSettings?.roundTripPackages,
                taxiTourHours: formData.taxiTourHours,
                taxiTourKm: formData.taxiTourKm
            });

            const surcharges = calculateSurcharges({
                hasNameBoard: formData.hasNameBoard,
                nameBoardPrice: pricingSettings?.nameBoardPrice
            }, vehicleData);

            // Traffic Surge Calculation
            const tripTime = formData.time || formData.flightArrivalTime;
            const tripDate = formData.date || formData.flightArrivalDate;
            const surgePercent = calculateTrafficSurge(tripTime, tripDate, surgeRules);
            const surgeAmount = surgePercent > 0 ? baseTotal * (surgePercent / 100) : 0;

            const paymentSurcharge = calculatePaymentFees(baseTotal + surcharges + surgeAmount, formData.paymentMethod, currency, formData.vehicle);
            const paymentSurchargeLKR = calculatePaymentFees(baseTotal + surcharges + surgeAmount, formData.paymentMethod, 'LKR', formData.vehicle);

            let total = baseTotal + surcharges + surgeAmount + paymentSurcharge;

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

            let longDistanceDiscountAmount = 0;
            if (pricingSettings?.isActive && distKm > (pricingSettings?.longDistanceThreshold || 175) && isAirportPickup) {
                longDistanceDiscountAmount = total * ((pricingSettings?.longDistanceDiscountPercentage || 10) / 100);
            }

            const finalDiscount = Math.max(couponDiscountAmount, longDistanceDiscountAmount);
            total = Math.max(0, total - finalDiscount);

            const rate = rates?.[currency] || 1;
            const roundFn = formData.vehicle === 'sampath-test' ? Math.round : Math.ceil;

            const convertedSubtotal = roundFn((Number(baseTotal) || 0) * rate);
            const convertedSurcharges = roundFn((Number(surcharges) || 0) * rate);
            const convertedSurge = roundFn((Number(surgeAmount) || 0) * rate);
            const convertedPaymentFee = roundFn((Number(paymentSurcharge) || 0) * rate);
            const convertedDiscounts = roundFn((Number(finalDiscount) || 0) * rate);
            const convertedTotal = Math.max(0, convertedSubtotal + convertedSurcharges + convertedSurge + convertedPaymentFee - convertedDiscounts);

            const payNowRatio = formData.paymentType === 'partial' ? 0.5 : 1;
            const convertedPayNow = roundFn(convertedTotal * payNowRatio);
            const convertedBalance = convertedTotal - convertedPayNow;

            const detailedExtras = [
                { label: 'Name Board', value: roundFn(calculateSurcharges({ hasNameBoard: formData.hasNameBoard, nameBoardPrice: pricingSettings.nameBoardPrice }, vehicleData) * rate) }
            ];

            if (surgeAmount > 0) {
                detailedExtras.push({ label: 'Peak Traffic Surge', value: convertedSurge });
            }

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
                    total: Math.round(baseTotal + surcharges + surgeAmount + paymentSurchargeLKR - finalDiscount),
                    payNow: Math.round((formData.paymentType === 'partial' ? (baseTotal + surcharges + surgeAmount + paymentSurchargeLKR - finalDiscount) * 0.5 : (baseTotal + surcharges + surgeAmount + paymentSurchargeLKR - finalDiscount))),
                    balance: Math.round((baseTotal + surcharges + surgeAmount + paymentSurchargeLKR - finalDiscount) - (formData.paymentType === 'partial' ? (baseTotal + surcharges + surgeAmount + paymentSurchargeLKR - finalDiscount) * 0.5 : (baseTotal + surcharges + surgeAmount + paymentSurchargeLKR - finalDiscount))),
                    surcharges: Math.round(surcharges),
                    surge: Math.round(surgeAmount),
                    paymentFee: Math.round(paymentSurchargeLKR),
                    subtotal: Math.round(baseTotal),
                    discounts: Math.round(finalDiscount)
                },
                originalLKR: Math.round(baseTotal + surcharges + surgeAmount + paymentSurchargeLKR - finalDiscount)
            };
        } catch (err) {
            console.error("Price logic error:", err);
            return { total: 0, subtotal: 0, surcharges: 0, payNow: 0, balance: 0, lkr: { total: 0, payNow: 0, balance: 0, surcharges: 0, subtotal: 0 }, originalLKR: 0 };
        }
    };

    const pricingWithTotals = useMemo(() => {
        const isAirportPickup = (formData.pickup?.toLowerCase().includes('airport') || formData.dropoff?.toLowerCase().includes('airport')) || (typeof initialData.pickup === 'string' && initialData.pickup.toLowerCase().includes('airport'));
        const distKm = Number(distance || initialData.distance || 0);

        return pricing.map(v => {
            const baseTotal = calculateBasePrice(distKm, v, formData.tripType, formData.pickup, formData.dropoff, destinations, { 
                roundTripPackageId: formData.roundTripPackageId,
                roundTripPackages: pricingSettings?.roundTripPackages 
            });
            const surcharges = calculateSurcharges({
                hasNameBoard: formData.hasNameBoard,
                nameBoardPrice: pricingSettings?.nameBoardPrice
            }, v);
            
            const tripTime = formData.time || formData.flightArrivalTime;
            const tripDate = formData.date || formData.flightArrivalDate;
            const surgePercent = calculateTrafficSurge(tripTime, tripDate, surgeRules);
            const surgeAmount = surgePercent > 0 ? baseTotal * (surgePercent / 100) : 0;

            const paymentSurcharge = calculatePaymentFees(baseTotal + surcharges + surgeAmount, formData.paymentMethod, currency, v.vehicleType);
            
            let total = baseTotal + surcharges + surgeAmount + paymentSurcharge;

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

            let longDistanceDiscountAmount = 0;
            if (pricingSettings?.isActive && distKm > (pricingSettings?.longDistanceThreshold || 175) && isAirportPickup) {
                longDistanceDiscountAmount = total * ((pricingSettings?.longDistanceDiscountPercentage || 10) / 100);
            }

            const finalDiscount = Math.max(couponDiscountAmount, longDistanceDiscountAmount);
            total = Math.max(0, total - finalDiscount);

            // To avoid double currency conversion in VehicleCarousel, since VehicleCarousel uses convertPrice, we need to pass LKR base total.
            // Wait, VehicleCarousel converts it?
            // VehicleCarousel says: {convertPrice(Number(vehicle.calculatedTotal) || 0).symbol}
            // convertPrice expects LKR! So we should compute total in LKR.
            // Wait, paymentSurcharge in getPriceBreakdown uses `currency`. Wait. If VehicleCarousel expects LKR, it should be calculated with 'LKR'.
            const paymentSurchargeLKR = calculatePaymentFees(baseTotal + surcharges + surgeAmount, formData.paymentMethod, 'LKR', v.vehicleType);
            let totalLKR = baseTotal + surcharges + surgeAmount + paymentSurchargeLKR;
            
            let couponDiscountAmountLKR = 0;
            if (verifiedCoupons && verifiedCoupons.length > 0) {
                verifiedCoupons.forEach(coupon => {
                    const couponVal = Number(coupon.value) || 0;
                    if (coupon.discountType === 'percentage') {
                        couponDiscountAmountLKR += totalLKR * (couponVal / 100);
                    } else {
                        couponDiscountAmountLKR += couponVal;
                    }
                });
            }

            let longDistanceDiscountAmountLKR = 0;
            if (pricingSettings?.isActive && distKm > (pricingSettings?.longDistanceThreshold || 175) && isAirportPickup) {
                longDistanceDiscountAmountLKR = totalLKR * ((pricingSettings?.longDistanceDiscountPercentage || 10) / 100);
            }

            const finalDiscountLKR = Math.max(couponDiscountAmountLKR, longDistanceDiscountAmountLKR);
            totalLKR = Math.max(0, totalLKR - finalDiscountLKR);

            return {
                ...v,
                calculatedTotal: totalLKR
            };
        });
    }, [pricing, distance, formData.tripType, formData.pickup, formData.dropoff, destinations, formData.hasNameBoard, pricingSettings, formData.paymentMethod, currency, verifiedCoupons, initialData]);

    const { total: totalPrice, subtotal, surcharges, payNow, balance: balanceAmount, ...detailedBreakdown } = useMemo(() => {
        return getPriceBreakdown();
    }, [formData, pricing, verifiedCoupons, currency, rates, pricingSettings, distance]);

    // Data fetching for pricing
    useEffect(() => {
        if (isOpen) {
            fetch(`/api/pricing?category=${pricingCategory}`, { cache: 'no-store' })
                .then(res => res.json())
                .then(response => {
                    if (response.success && Array.isArray(response.data)) {
                        setPricing(response.data);
                    }
                })
                .catch(err => console.error("Error fetching pricing:", err));

            fetch('/api/traffic-surge')
                .then(res => res.json())
                .then(data => {
                    if (data.success) setSurgeRules(data.data);
                })
                .catch(err => console.error("Error fetching surge rules:", err));
        }
    }, [isOpen, pricingCategory]);

    // OSRM Distance Fetching
    useEffect(() => {
        if (initialData.distance && initialData.distance > 0) return;

        if (formData.pickupCoords?.lat && formData.pickupCoords?.lon && formData.dropoffCoords?.lat && formData.dropoffCoords?.lon) {
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

    const validateForm = (targetStep) => {
        const newErrors = {};
        if (targetStep >= 1) {
            if (!formData.pickup) newErrors.pickup = true;
            if (!formData.dropoff) newErrors.dropoff = true;
            if (isAirportService && initialData.isAirportPickup && formData.hasNameBoard === null) newErrors.hasNameBoard = true;
            if (initialData.isAirportPickup && formData.hasNameBoard && !formData.nameBoardText) newErrors.nameBoardText = true;
        }
        if (targetStep >= 2) {
            if (!formData.name) newErrors.name = true;
            if (!formData.phone) newErrors.phone = true;
            if (!formData.email) newErrors.email = true;
            if (isAirportService || formData.hasNameBoard) {
                if (!formData.flightArrivalDate && !formData.date) newErrors.date = true;
                if (!formData.flightArrivalTime && !formData.time) newErrors.time = true;
                // Flight number is now optional as per user request
                // if (formData.hasNameBoard && !formData.flightNumber) newErrors.flightNumber = true;
            }
            if (formData.tripType === 'round-trip') {
                if (!formData.returnDate) newErrors.returnDate = true;
                if (!formData.returnTime) newErrors.returnTime = true;
            }
            // Enforce luggage selection and adult count (Hard Stop)
            if (formData.passengerCount.luggage === undefined || formData.passengerCount.luggage === null) newErrors.luggage = true;
            if (!formData.passengerCount.adults || formData.passengerCount.adults < 1) newErrors.adults = true;
        }
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length > 0) {
            // Trigger a visual alert for hard stop
            const firstError = Object.keys(newErrors)[0];
            alert(`MANDATORY FIELD: Please complete the ${firstError.replace(/([A-Z])/g, ' $1').toLowerCase()} before proceeding.`);
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (step === 1 && validateForm(1)) setStep(2);
        else if (step === 2 && validateForm(2)) setStep(3);
        else if (step === 3) handleSubmit();
    };

    const handleSubmit = async () => {
        if (!validateForm(2)) return;
        setLoading(true);
        try {
            const breakdown = getPriceBreakdown();
            const { lkr } = breakdown;
            if (lkr.total === 0) {
                alert("Pricing is not available for this selection. Please try selecting a different vehicle or route.");
                setLoading(false);
                return;
            }

            const bookingData = {
                customer: session?.user?.id || null,
                pickupLocation: { address: formData.pickup, lat: formData.pickupCoords?.lat || null, lng: formData.pickupCoords?.lng || null },
                dropoffLocation: { address: formData.dropoff, lat: formData.dropoffCoords?.lat || null, lng: formData.dropoffCoords?.lng || null },
                waypoints: formData.waypoints.map(wp => ({ address: wp.name, lat: wp.lat, lng: wp.lng })),
                vehicleType: formData.vehicle,
                tripType: formData.tripType,
                passengerCount: formData.passengerCount,
                distanceKm: distance,
                duration: formData.duration,
                totalPrice: lkr.total,
                paidAmount: lkr.payNow,
                balanceAmount: lkr.balance,
                displayPrice: breakdown.total,
                displayPaidAmount: breakdown.payNow,
                displayBalanceAmount: breakdown.balance,
                currency: currency || 'LKR',
                scheduledDate: formData.date || formData.flightArrivalDate,
                scheduledTime: formData.time || formData.flightArrivalTime,
                customerName: formData.name,
                customerEmail: formData.email,
                guestPhone: formData.phone,
                whatsappNumber: formData.whatsapp || formData.phone,
                passport: formData.passport,
                nameBoard: { enabled: formData.hasNameBoard, text: formData.nameBoardText },
                paymentMethod: formData.paymentMethod,
                flightNumber: formData.flightNumber,
                returnDate: formData.returnDate,
                returnTime: formData.returnTime,
                notes: formData.notes
            };

            const res = await fetch('/api/payment/initiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData),
            });

            const data = await res.json();
            if (data.success) {
                window.location.href = formData.paymentMethod === 'card' ? data.paymentUrl : `/payment/success?bookingId=${data.bookingId}`;
            } else {
                alert('Booking failed: ' + (data.message || 'Server error'));
            }
        } catch (error) {
            console.error("Submit Error:", error);
            alert('An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const selectedVehicle = pricing.find(p => p.vehicleType === formData.vehicle);

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-0 sm:p-4 md:p-8 bg-emerald-950/20 backdrop-blur-xl">
            <div className="w-full h-full max-w-7xl bg-white dark:bg-zinc-950 sm:rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.2)] dark:shadow-none overflow-hidden flex flex-col relative border border-white/20">
                {/* Header */}
                <div className="p-6 sm:p-10 border-b border-slate-100 dark:border-white/5 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-[#FACC15] transition-all hover:scale-110 active:scale-95 group">
                                <X size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                            </button>
                            <div className="h-10 w-px bg-slate-100 dark:bg-white/10 mx-2 hidden sm:block"></div>
                            <div className="hidden sm:flex items-center gap-10">
                                {STEPS.map((s, idx) => (
                                    <div key={s.id} className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black transition-all duration-500 ${step >= s.id ? 'bg-[#FACC15] text-white shadow-lg scale-110' : 'bg-slate-50 dark:bg-white/5 text-slate-300'}`}>
                                            {step > s.id ? <Check size={14} strokeWidth={4} /> : s.id}
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${step >= s.id ? 'text-black dark:text-white' : 'text-slate-300'}`}>{s.title}</span>
                                        {idx < STEPS.length - 1 && <ChevronRight size={14} className="text-slate-100 dark:text-white/5 mx-2" />}
                                    </div>
                                ))}
                            </div>
                            <div className="flex sm:hidden items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-[#FACC15] text-white flex items-center justify-center shadow-lg">
                                    <span className="text-xs font-black">{step}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-[#FACC15] uppercase tracking-widest leading-none mb-1">Step {step} of 3</span>
                                    <span className="text-[10px] font-black text-black dark:text-white uppercase tracking-tight leading-none">{STEPS[step-1].title}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 sm:p-12 space-y-12">
                    {step === 1 && (
                        <div className="animate-slide-up space-y-12">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-100 dark:border-white/10">
                                <div>
                                    <h3 className="text-4xl sm:text-6xl font-black text-black dark:text-white tracking-tighter uppercase leading-none mb-3">
                                        Route <span className="text-[#FACC15]">& Vehicle</span>
                                    </h3>
                                    <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Initialize Your Elite Transfer</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="group/field relative">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-3">
                                            <MapPin size={14} className="text-[#FACC15]" strokeWidth={3} /> Pickup Location
                                        </label>
                                        <LocationInput
                                            id="field-pickup"
                                            value={formData.pickup}
                                            onChange={(val, coords) => setFormData(prev => ({ ...prev, pickup: val, pickupCoords: coords }))}
                                            placeholder="Enter Airport or Hotel Name"
                                            className={errors.pickup ? 'border-red-500 animate-shake' : ''}
                                        />
                                    </div>
                                    <div className="group/field relative">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-3">
                                            <Navigation size={14} className="text-[#FACC15]" strokeWidth={3} /> Dropoff Location
                                        </label>
                                        <LocationInput
                                            id="field-dropoff"
                                            value={formData.dropoff}
                                            onChange={(val, coords) => setFormData(prev => ({ ...prev, dropoff: val, dropoffCoords: coords }))}
                                            placeholder="Where are you heading?"
                                            className={errors.dropoff ? 'border-red-500 animate-shake' : ''}
                                        />
                                    </div>
                                </div>

                                {isAirportService && initialData.isAirportPickup && (
                                    <div className="space-y-8">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-3">
                                            <Signpost size={14} className="text-[#FACC15]" strokeWidth={3} /> Airport Greeting Service
                                        </label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { val: true, label: 'Name Board', sub: 'Standard Service', icon: Check, color: 'emerald' },
                                                { val: false, label: 'No Board', sub: 'Direct Pickup', icon: X, color: 'rose' }
                                            ].map(opt => (
                                                <button
                                                    key={opt.label}
                                                    onClick={() => setFormData({ ...formData, hasNameBoard: opt.val })}
                                                    className={`p-6 rounded-3xl border text-left transition-all relative overflow-hidden group ${formData.hasNameBoard === opt.val ? 'bg-[#FACC15] border-transparent text-white shadow-xl' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 hover:border-[#FACC15]/50'}`}
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${formData.hasNameBoard === opt.val ? 'bg-white/20' : 'bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/10 shadow-sm'}`}>
                                                            <opt.icon size={18} strokeWidth={4} className={formData.hasNameBoard === opt.val ? 'text-white' : (opt.val ? 'text-emerald-500' : 'text-rose-500')} />
                                                        </div>
                                                        {formData.hasNameBoard === opt.val && (
                                                            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                                                        )}
                                                    </div>
                                                    <span className="block text-xs font-black uppercase tracking-widest mb-1">{opt.label}</span>
                                                    <span className={`text-[9px] font-bold uppercase tracking-widest ${formData.hasNameBoard === opt.val ? 'text-white/70' : 'text-slate-400'}`}>{opt.sub}</span>
                                                </button>
                                            ))}
                                        </div>

                                        {formData.hasNameBoard && (
                                            <div className="space-y-6 animate-slide-up pt-4">
                                                <div className="relative">
                                                    <input
                                                        value={formData.nameBoardText}
                                                        onChange={e => setFormData({ ...formData, nameBoardText: e.target.value })}
                                                        className="w-full h-16 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 px-8 rounded-3xl font-black text-sm uppercase tracking-widest outline-none focus:border-[#FACC15] transition-all"
                                                        placeholder="NAME ON BOARD (e.g. MR. JOHN SMITH)"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="relative">
                                                        <input
                                                            value={formData.flightNumber}
                                                            onChange={e => setFormData({ ...formData, flightNumber: e.target.value })}
                                                            className="w-full h-16 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 px-14 rounded-3xl font-black text-sm uppercase tracking-widest outline-none focus:border-[#FACC15] transition-all"
                                                            placeholder="FLIGHT NO (OPTIONAL)"
                                                        />
                                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#FACC15]">
                                                            <PlaneTakeoff size={20} strokeWidth={3} />
                                                        </div>
                                                    </div>
                                                    <div className="relative">
                                                        <input
                                                            type="time"
                                                            value={formData.flightArrivalTime || ''}
                                                            onChange={e => setFormData({ ...formData, flightArrivalTime: e.target.value, time: e.target.value })}
                                                            className="w-full h-16 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 px-8 rounded-3xl font-black text-sm uppercase tracking-widest outline-none focus:border-[#FACC15] transition-all"
                                                        />
                                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 text-[8px] font-black uppercase tracking-widest pointer-events-none">ARR TIME</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-10 pt-10 border-t border-slate-100 dark:border-white/10">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-2xl font-black text-black dark:text-white uppercase tracking-tight">Select <span className="text-[#FACC15]">Fleet</span></h4>
                                    <div className="bg-rose-600 text-white text-[8px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-rose-600/20 uppercase tracking-widest animate-pulse flex items-center gap-2">
                                        <Info size={10} strokeWidth={4} />
                                        SEE ALL OPTIONS
                                    </div>
                                </div>
                                <VehicleCarousel
                                    vehicles={pricingWithTotals}
                                    selectedId={formData.vehicle}
                                    onSelect={(v) => {
                                        setFormData(prev => ({ ...prev, vehicle: v.vehicleType }));
                                        setIsFleetExpanded(false);
                                    }}
                                    passengerCount={formData.passengerCount}
                                    currency={currency}
                                    rates={rates}
                                    isCondensed={!isFleetExpanded && !!formData.vehicle}
                                    onToggleExpand={() => setIsFleetExpanded(true)}
                                />
                                
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
                                                className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-3 text-left cursor-pointer group/curr ${currency === c.code ? 'bg-[#FACC15] border-transparent text-white shadow-lg' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 hover:border-[#FACC15] text-slate-400 hover:text-[#FACC15]'}`}
                                            >
                                                <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-white dark:border-zinc-800 shadow-sm">
                                                    <img src={c.flag} alt={c.code} className="w-full h-full object-cover" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">{c.code}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {verifiedCoupons.length > 0 && (
                                    <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 px-6 py-3 rounded-2xl border border-emerald-100 dark:border-emerald-400/20 w-fit mx-auto animate-bounce mt-6 shadow-sm">
                                        <Tag size={14} className="shrink-0" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">
                                            Special Offer "{verifiedCoupons[0].code}" Automatically Applied!
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-slide-up space-y-10">
                            <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                                <div className="absolute top-4 left-6 z-20 flex items-center gap-2">
                                    <div className="bg-[#FACC15] text-black text-[9px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-widest">Selected Fleet</div>
                                    <button onClick={() => setStep(1)} className="bg-white dark:bg-zinc-800 text-black dark:text-white text-[9px] font-black px-3 py-1 rounded-full border border-slate-100 dark:border-white/10 shadow-lg uppercase tracking-widest hover:bg-slate-50 transition-all">Change</button>
                                </div>
                                <div className="flex flex-col md:flex-row items-center p-6 md:p-10 gap-8 md:gap-12">
                                    <div className="w-full md:w-1/3 flex justify-center relative mt-6 md:mt-0">
                                        <img src={selectedVehicle?.image} alt={selectedVehicle?.name} className="w-full max-w-[280px] object-contain scale-125 md:scale-150 drop-shadow-2xl" />
                                    </div>
                                    <div className="flex-1 space-y-5">
                                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                            <div>
                                                <h4 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter mb-1">{displayVehicleName(selectedVehicle?.name)}</h4>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Premium Elite Tier</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-baseline justify-end gap-1.5">
                                                    <span className="text-xl font-black text-[#FACC15]">{currentSymbol}</span>
                                                    <span className="text-4xl font-black text-black dark:text-white tracking-tighter leading-none">{(Number(totalPrice) || 0).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2.5">
                                            {[
                                                { icon: Users, label: 'PAX', value: selectedVehicle?.capacity || 4 },
                                                { icon: Briefcase, label: 'LUG', value: selectedVehicle?.suitcases || 2 },
                                                { icon: ShoppingBag, label: 'HAND', value: selectedVehicle?.handLuggage || 2 },
                                                { icon: Wind, label: 'AC', value: 'ON' }
                                            ].map((item, i) => (
                                                <div key={i} className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 border border-slate-100 dark:border-white/10 flex flex-col items-center justify-center">
                                                    <item.icon size={14} className="text-[#FACC15] mb-1.5" strokeWidth={3} />
                                                    <span className="text-xs font-black text-black dark:text-white leading-none">{item.value}</span>
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">{item.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-10">
                                {[
                                    { label: 'Full Legal Name', key: 'name', type: 'text', placeholder: 'Passenger Name', icon: User },
                                    { label: 'Email Address', key: 'email', type: 'email', placeholder: 'for confirmation', icon: Mail },
                                    { label: 'Primary Contact No', key: 'phone', type: 'tel', placeholder: '+94 XXX XXX XXX', icon: Phone },
                                    { label: 'WhatsApp Number', key: 'whatsapp', type: 'tel', placeholder: 'For driver chat', icon: MessageSquare },
                                    ...(formData.hasNameBoard ? [] : [])
                                ].map(f => (
                                    <div key={f.key}>
                                        <label className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-3 transition-colors ${errors[f.key] ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                                            <f.icon size={14} className={errors[f.key] ? 'text-red-500' : 'text-[#FACC15]'} strokeWidth={3} /> {f.label}
                                        </label>
                                        {f.type === 'tel' ? (
                                            <PhoneInput
                                                defaultCountry="lk"
                                                value={formData[f.key] || ''}
                                                onChange={(phone) => setFormData({ ...formData, [f.key]: phone })}
                                                inputClassName="!w-full !h-16 !bg-transparent !border-none !pl-2 !pr-8 !outline-none !font-black !text-black dark:!text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 !text-sm !uppercase !tracking-widest"
                                                countrySelectorStyleProps={{
                                                    buttonClassName: "!bg-transparent !border-none !h-16 !pl-6 !pr-2 hover:!bg-slate-100/50 dark:hover:!bg-white/5 !transition-colors !rounded-l-3xl",
                                                }}
                                                className={`w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl flex items-center transition-all overflow-hidden ${errors[f.key] ? 'border-red-500' : ''}`}
                                            />
                                        ) : (
                                            <input
                                                type={f.type}
                                                value={formData[f.key] || ''}
                                                onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                                                className={`w-full h-16 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-10 rounded-3xl outline-none font-black text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm uppercase tracking-widest ${errors[f.key] ? 'border-red-500' : ''}`}
                                                placeholder={f.placeholder}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-12 border-t border-slate-200 dark:border-white/10">
                                <div className="space-y-4">
                                    <label className={`text-[10px] font-black uppercase tracking-widest pl-4 ${errors.date ? 'text-red-500' : 'text-slate-500'}`}>
                                        {formData.hasNameBoard ? 'Arrival Date' : 'Pickup Date'}
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.date || formData.flightArrivalDate || ''}
                                        onChange={e => setFormData(prev => ({ ...prev, date: e.target.value, flightArrivalDate: e.target.value }))}
                                        className={`w-full h-16 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-10 rounded-3xl font-black text-sm uppercase tracking-widest outline-none focus:border-[#FACC15] ${errors.date ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className={`text-[10px] font-black uppercase tracking-widest pl-4 ${errors.time ? 'text-red-500' : 'text-slate-500'}`}>
                                        {formData.hasNameBoard ? 'Arrival Time' : 'Pickup Time'}
                                    </label>
                                    <input
                                        type="time"
                                        value={formData.time || formData.flightArrivalTime || ''}
                                        onChange={e => setFormData(prev => ({ ...prev, time: e.target.value, flightArrivalTime: e.target.value }))}
                                        className={`w-full h-16 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-10 rounded-3xl font-black text-sm uppercase tracking-widest outline-none focus:border-[#FACC15] ${errors.time ? 'border-red-500' : ''}`}
                                    />
                                </div>
                            </div>

                            {formData.tripType === 'round-trip' && (
                                <div className="animate-slide-up space-y-8 pt-10 border-t border-slate-100 dark:border-white/10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-2 h-2 bg-[#FACC15] rounded-full animate-pulse"></div>
                                        <h4 className="text-xl font-black text-black dark:text-white uppercase tracking-tight">Return Journey <span className="text-[#FACC15]">Details</span></h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className={`text-[10px] font-black uppercase tracking-widest pl-4 ${errors.returnDate ? 'text-red-500' : 'text-slate-500'}`}>
                                                Return Date
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.returnDate || ''}
                                                onChange={e => setFormData(prev => ({ ...prev, returnDate: e.target.value }))}
                                                className={`w-full h-16 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-10 rounded-3xl font-black text-sm uppercase tracking-widest outline-none focus:border-[#FACC15] ${errors.returnDate ? 'border-red-500' : ''}`}
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className={`text-[10px] font-black uppercase tracking-widest pl-4 ${errors.returnTime ? 'text-red-500' : 'text-slate-500'}`}>
                                                Return Time
                                            </label>
                                            <input
                                                type="time"
                                                value={formData.returnTime || ''}
                                                onChange={e => setFormData(prev => ({ ...prev, returnTime: e.target.value }))}
                                                className={`w-full h-16 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-10 rounded-3xl font-black text-sm uppercase tracking-widest outline-none focus:border-[#FACC15] ${errors.returnTime ? 'border-red-500' : ''}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-slide-up">
                            <div className="grid lg:grid-cols-12 gap-12">
                                <div className="lg:col-span-7 space-y-8">
                                    <div className="p-6 sm:p-10 bg-white dark:bg-zinc-900/40 rounded-3xl sm:rounded-[3rem] text-emerald-950 dark:text-white border border-slate-100 dark:border-white/10 shadow-2xl relative overflow-hidden">
                                        <div className="relative z-10 space-y-10">
                                            <div className="flex items-center justify-between pb-8 border-b border-slate-100 dark:border-white/5">
                                                <div className="px-6 py-2.5 bg-[#FACC15] text-white rounded-full text-[10px] font-black uppercase tracking-widest">Booking Summary</div>
                                                <div className="text-[10px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-[0.3em]">{formData.tripType.replace('-', ' ')}</div>
                                            <div className="space-y-6">
                                                <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 dark:bg-white/5 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-white/10 shadow-inner">
                                                    <div className="w-40 sm:w-32 h-28 sm:h-24 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center p-0.5 overflow-hidden shrink-0 shadow-sm">
                                                        <img src={selectedVehicle?.image} alt={selectedVehicle?.name} className="w-full h-full object-contain scale-[1.8]" />
                                                    </div>
                                                    <div className="min-w-0 flex-1 text-center sm:text-left">
                                                        <p className="text-base sm:text-sm font-black text-emerald-950 dark:text-white uppercase truncate tracking-tight">{displayVehicleName(selectedVehicle?.name)}</p>
                                                        <div className="flex items-center justify-center sm:justify-start gap-4 mt-2">
                                                            <div className="flex items-center gap-2">
                                                                <Users size={12} className="text-[#FACC15]" />
                                                                <span className="text-[9px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">
                                                                    {(formData.passengerCount?.adults || 0) + (formData.passengerCount?.children || 0)} Pax
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Briefcase size={12} className="text-[#FACC15]" />
                                                                <span className="text-[9px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">
                                                                    {formData.passengerCount?.luggage || 0} Bags
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="grid sm:grid-cols-2 gap-8 px-2">
                                                    <div className="flex gap-5">
                                                        <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-white flex items-center justify-center shrink-0 shadow-xl"><MapPin size={22} /></div>
                                                        <div className="min-w-0">
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Origin</p>
                                                            <p className="text-[11px] font-black text-emerald-950 dark:text-white uppercase line-clamp-2">{formData.pickup}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-5">
                                                        <div className="w-12 h-12 rounded-2xl bg-[#FACC15] text-white flex items-center justify-center shrink-0 shadow-xl"><Navigation size={22} /></div>
                                                        <div className="min-w-0">
                                                            <p className="text-[9px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-2">Destination</p>
                                                            <p className="text-[11px] font-black text-emerald-950 dark:text-white uppercase line-clamp-2">{formData.dropoff}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {formData.hasNameBoard && (
                                                    <div className="flex gap-6 bg-emerald-50 dark:bg-yellow-400/5 p-6 rounded-[2.5rem] border border-emerald-100 dark:border-yellow-400/10 shadow-sm group/board mt-4">
                                                        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-white/5 overflow-hidden shadow-sm group-hover/board:border-yellow-400 transition-colors">
                                                            <Signpost size={28} className="text-[#FACC15]" strokeWidth={3} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[9px] font-black text-[#FACC15] uppercase tracking-widest mb-2">Airport Greeting</p>
                                                            <p className="text-[11px] font-black text-emerald-950 dark:text-white uppercase truncate">"{formData.nameBoardText || 'Elite Greeting'}"</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-4 pt-8 mt-4 border-t border-slate-100 dark:border-white/10">
                                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-100">
                                                    <span>Trip Base Fare</span>
                                                    <span className="font-black">{currentSymbol} {subtotal.toLocaleString()}</span>
                                                </div>
                                                {detailedBreakdown.detailedExtras?.filter(s => s.value > 0).map((s, idx) => (
                                                    <div key={idx} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                                        <span>{s.label}</span>
                                                        <span className="text-[#FACC15] font-black">+{currentSymbol} {s.value.toLocaleString()}</span>
                                                    </div>
                                                ))}
                                                <div className="pt-6 sm:pt-8 mt-6 border-t border-slate-100 dark:border-white/10">
                                                    <div className="flex flex-col gap-2">
                                                        <p className="text-[10px] font-black text-[#FACC15] tracking-[0.2em] uppercase">
                                                            {formData.paymentType === 'partial' ? 'Secure Deposit (50%)' : 'Total Amount (Fixed)'}
                                                        </p>
                                                        <p className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-emerald-950 dark:text-white leading-none break-words">
                                                            <span className="text-lg sm:text-2xl font-black mr-2 text-slate-500/50">{currentSymbol}</span>
                                                            {payNow.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Cost Disclosures */}
                                                <div className="mt-8 p-6 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-slate-100 dark:border-white/10 space-y-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-400/20 text-amber-600 flex items-center justify-center shrink-0 shadow-sm">
                                                            <Info size={16} strokeWidth={3} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">Hire Charge Only</p>
                                                            <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-tight">
                                                                The quoted price covers the vehicle hire charge and fuel only.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-4 border-t border-slate-200/50 dark:border-white/5 pt-4">
                                                        <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-400/20 text-rose-600 flex items-center justify-center shrink-0 shadow-sm">
                                                            <AlertCircle size={16} strokeWidth={3} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Customer Responsibility</p>
                                                            <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-tight">
                                                                Parking tickets and highway tolls are the responsibility of the customer.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-3 mt-6">
                                                    {convertToAllCurrencies(detailedBreakdown.lkr?.payNow || 0)
                                                        .filter(c => ['USD', 'EUR', 'GBP'].includes(c.code) && c.code !== currency)
                                                        .map(c => (
                                                            <span key={c.code} className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-lg border border-slate-200 dark:border-white/5">
                                                                ≈ {c.symbol}{c.value.toLocaleString()}
                                                            </span>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-5 space-y-12">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-px flex-1 bg-slate-100 dark:bg-white/5"></div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Method</span>
                                                <div className="h-px flex-1 bg-slate-100 dark:bg-white/5"></div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                            {['cash', 'card'].map(m => (
                                                <button
                                                    key={m}
                                                    onClick={() => setFormData({ ...formData, paymentMethod: m })}
                                                    className={`p-4 sm:p-6 rounded-3xl sm:rounded-[2rem] border transition-all flex flex-col items-center gap-2 sm:gap-3 ${formData.paymentMethod === m ? 'bg-[#FACC15] border-transparent text-white shadow-xl' : 'bg-white dark:bg-zinc-900 border-slate-100 dark:border-white/10 text-slate-600 hover:border-[#FACC15]'}`}
                                                >
                                                    {m === 'cash' ? <Coins size={22} /> : <CreditCard size={22} />}
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{m === 'cash' ? 'Cash' : 'Card'}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {formData.paymentMethod === 'card' && (
                                        <div className="space-y-6 animate-slide-in">
                                            <div className="grid grid-cols-2 gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 dark:bg-white/5 rounded-[1.8rem] border border-slate-100 dark:border-white/10 shadow-inner">
                                                {['full', 'partial'].map(t => (
                                                    <button
                                                        key={t}
                                                        onClick={() => setFormData(prev => ({ ...prev, paymentType: t }))}
                                                        className={`py-3 sm:py-4 rounded-2xl text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all ${formData.paymentType === t ? 'bg-[#FACC15] text-white shadow-xl' : 'text-slate-400 hover:text-[#FACC15]'}`}
                                                    >
                                                        {t === 'full' ? 'Complete (100%)' : 'Deposit (50%)'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-6 pt-6">
                                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] pl-6">Promo Code</h4>
                                        <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-2 sm:p-3 rounded-3xl sm:rounded-[2rem] flex gap-2 sm:gap-4 shadow-inner">
                                            <input
                                                value={couponInput}
                                                onChange={e => setCouponInput(e.target.value.toUpperCase())}
                                                placeholder="CODE?"
                                                className="flex-1 min-w-0 h-12 sm:h-14 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/10 px-4 sm:px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none text-emerald-950 dark:text-white shadow-sm"
                                            />
                                            <button
                                                onClick={() => handleApplyCoupon()}
                                                disabled={couponLoading || !couponInput}
                                                className="px-4 sm:px-8 bg-emerald-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl whitespace-nowrap"
                                            >
                                                {couponLoading ? <Loader2 className="animate-spin" size={16} /> : 'Apply'}
                                            </button>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 sm:p-10 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-zinc-950 shrink-0">
                    <div className="flex flex-row items-center justify-between gap-3 sm:gap-4">
                        <button
                            onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-8 py-3 sm:py-4 text-[9px] sm:text-xs font-black uppercase tracking-widest text-slate-500 hover:text-black transition-all bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5"
                        >
                            {step === 1 ? 'Cancel' : 'Back'}
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={loading}
                            className="flex-[2] sm:flex-none flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-12 py-3 sm:py-5 bg-gradient-to-br from-yellow-400 via-orange-500 to-orange-600 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 text-white rounded-[2rem] text-[9px] sm:text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-orange-500/40 transition-all group"
                        >
                            {step === 1 ? 'Select Details' : step === 2 ? 'Review & Checkout' : loading ? 'Securing...' : 'Confirm Order'}
                            <ArrowRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
