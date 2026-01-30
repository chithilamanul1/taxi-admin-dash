'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { X, MapPin, User, CreditCard, Calendar, Clock, Phone, Mail, ChevronRight, ChevronLeft, Check, Loader2, Car, Navigation, ShieldCheck, Zap, Signpost } from 'lucide-react';
import LocationSearchInput from './LocationSearchInput';

import { useCurrency } from '../context/CurrencyContext';

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
    const [verifiedCoupon, setVerifiedCoupon] = useState(null);
    const [couponInput, setCouponInput] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);

    // Form State - declared early so functions below can access it
    const [formData, setFormData] = useState({
        vehicle: initialData.vehicle || 'mini-car',
        pickup: initialData.pickup || '',
        pickupCoords: initialData.pickupCoords || null,
        waypoints: initialData.waypoints || [],
        dropoff: initialData.dropoff || '',
        dropoffCoords: initialData.dropoffCoords || null,
        tripType: initialData.tripType || 'one-way',
        passengerCount: initialData.passengerCount || { adults: 1, children: 0, infants: 0, bags: 0 },
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
        paymentMethod: 'cash',
        paymentType: 'full', // 'full' or 'partial'
    });

    // Coupon handlers

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;
        setCouponLoading(true);
        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponInput, location: formData.dropoff }) // Use Dropoff for location check
            });
            const data = await res.json();
            if (data.valid) {
                setVerifiedCoupon(data.coupon);
                setFormData(prev => ({ ...prev, couponCode: data.coupon.code }));
            } else {
                alert(data.message);
                setVerifiedCoupon(null);
                setFormData(prev => ({ ...prev, couponCode: '' }));
            }
        } catch (e) {
            console.error(e);
            alert('Validation failed');
        } finally {
            setCouponLoading(false);
        }
    };

    const { currency } = useCurrency(); // Import Currency Context

    const getPriceBreakdown = () => {
        const vehicleData = pricing.find(p => p.vehicleType === formData.vehicle);
        if (!vehicleData || distance === 0) return { total: 0, subtotal: 0, surcharges: 0, payNow: 0, balance: 0 };

        const tiers = (vehicleData.tiers || []).sort((a, b) => a.min - b.min);
        let baseTotal = 0;
        const distKm = Math.ceil(distance);

        for (const tier of tiers) {
            if (distKm >= tier.min && distKm <= tier.max) {
                if (tier.type === 'flat') {
                    baseTotal = tier.price;
                } else {
                    const baseFlat = tiers.filter(t => t.type === 'flat' && t.max < tier.min).sort((a, b) => b.max - a.max)[0];
                    const basePrice = baseFlat ? baseFlat.price : 0;
                    const baseKm = baseFlat ? baseFlat.max : 0;
                    baseTotal = basePrice + ((distKm - baseKm) * tier.rate);
                }
                break;
            }
        }

        if (baseTotal === 0) {
            baseTotal = (vehicleData.basePrice || 0) + (Math.max(0, distKm - (vehicleData.baseKm || 0)) * (vehicleData.perKmRate || 0));
        }

        if (formData.tripType === 'round-trip') baseTotal *= 2;

        let surcharges = 0;
        if (formData.waitingHours > 0) {
            if (vehicleData.waitingCharges && vehicleData.waitingCharges.length >= formData.waitingHours) {
                surcharges += vehicleData.waitingCharges[formData.waitingHours - 1];
            } else {
                surcharges += (formData.waitingHours * (vehicleData.hourlyRate || 200));
            }
        }
        if (formData.hasNameBoard) surcharges += 500;

        // Payment Method Surcharges per User Request
        let paymentSurcharge = 0;
        if (formData.paymentMethod === 'cash') {
            // +5% for Cash
            paymentSurcharge = (baseTotal + surcharges) * 0.05;
        } else if (formData.paymentMethod === 'card') {
            if (currency === 'USD') {
                // +3.5% for USD Card
                paymentSurcharge = (baseTotal + surcharges) * 0.035;
            } else {
                // +2.5% for LKR Card (default)
                paymentSurcharge = (baseTotal + surcharges) * 0.025;
            }
        }

        let total = baseTotal + surcharges + paymentSurcharge;

        // Coupon Logic
        if (verifiedCoupon) {
            if (verifiedCoupon.discountType === 'percentage') {
                total = total * (1 - (verifiedCoupon.value / 100));
            } else {
                total = Math.max(0, total - verifiedCoupon.value);
            }
        } else if (formData.couponCode === 'SAVE10') {
            total *= 0.9;
        }

        const payNow = formData.paymentType === 'partial' ? total * 0.5 : total;
        const balance = total - payNow;

        return {
            total: Math.round(total),
            subtotal: Math.round(baseTotal),
            surcharges: Math.round(surcharges + paymentSurcharge),
            payNow: Math.round(payNow),
            balance: Math.round(balance)
        };
    };

    // Extract calculated values for render
    const { total: totalPrice, subtotal, surcharges, payNow, balance: balanceAmount } = getPriceBreakdown();

    // useEffects for data fetching
    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({ ...prev, ...initialData }));
            // Fetch pricing based on category
            fetch(`/api/pricing?category=${pricingCategory}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setPricing(data);
                    } else {
                        setPricing([]);
                    }
                })
                .catch(err => console.error("Error fetching pricing:", err));
        }
    }, [isOpen, initialData, pricingCategory]);

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
                .then(data => { if (data.routes?.[0]) setDistance(data.routes[0].distance / 1000); })
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
            const { total, payNow, balance, surcharges } = getPriceBreakdown();
            console.log("Price Breakdown:", { total, payNow });

            if (total === 0) {
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
                waitingHours: formData.waitingHours,

                // Detailed Payment Breakdown
                totalPrice: total,
                paidAmount: payNow,
                balanceAmount: balance,
                surchargeAmount: surcharges,
                paymentType: formData.paymentType || 'full', // Default to full if undefined
                currency: currency || 'LKR',

                scheduledDate: formData.date,
                scheduledTime: formData.time,
                customerName: formData.name,
                customerEmail: formData.email,
                guestPhone: formData.phone,
                nameBoard: {
                    enabled: formData.hasNameBoard,
                    text: formData.nameBoardText
                },
                couponCode: formData.couponCode,
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

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-emerald-900/80 p-1 md:p-4 overflow-hidden">
            <div className="bg-white rounded-[2rem] border border-emerald-900/10 shadow-2xl w-full max-w-4xl max-h-[90vh] md:max-h-[90vh] overflow-hidden flex flex-col animate-slide-up mx-auto mt-16 md:mt-0">
                {/* Header */}
                <div className="p-4 md:p-8 pb-3 md:pb-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-50 rounded-lg md:rounded-xl flex items-center justify-center border border-emerald-900/10">
                            <Zap size={18} className="text-emerald-600 md:hidden" />
                            <Zap size={20} className="text-emerald-600 hidden md:block" />
                        </div>
                        <h2 className="text-lg md:text-2xl font-black tracking-tight text-emerald-900 uppercase">SECURE <span className="text-emerald-600">BOOKING</span></h2>
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
                                    <LocationSearchInput
                                        label="Pick-Up Location"
                                        icon={MapPin}
                                        placeholder="Enter pickup (e.g. Airport)"
                                        initialValue={formData.pickup}
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
                                        <LocationSearchInput
                                            label="Drop-Off Location"
                                            icon={Navigation}
                                            placeholder="Enter destination (e.g. Hotel)"
                                            initialValue={formData.dropoff}
                                            onSelect={(loc) => setFormData(prev => ({ ...prev, dropoff: loc.address, dropoffCoords: loc.lat ? { lat: loc.lat, lon: loc.lon } : null }))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest pl-2">Vehicle Category</label>
                                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                                        {pricing.map(v => (
                                            <button key={v.vehicleType} onClick={() => setFormData({ ...formData, vehicle: v.vehicleType })} className={`p-4 md:p-6 rounded-[1.5rem] border-2 transition-all flex flex-col items-center gap-3 relative overflow-hidden ${formData.vehicle === v.vehicleType ? 'border-emerald-900 bg-emerald-50' : 'border-emerald-900/5 bg-white hover:border-emerald-900/20 shadow-sm'}`}>
                                                {v.image ? (
                                                    <img src={v.image} alt={v.name} className="w-24 h-14 object-contain mb-1 mix-blend-multiply" />
                                                ) : (
                                                    <Car className={formData.vehicle === v.vehicleType ? 'text-emerald-900' : 'text-emerald-900/20'} size={24} />
                                                )}
                                                <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-center ${formData.vehicle === v.vehicleType ? 'text-emerald-900' : 'text-emerald-900/40'}`}>{v.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest pl-2">Passenger Details</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {Object.entries(formData.passengerCount).map(([type, count]) => (
                                            <div key={type} className="bg-white border border-emerald-900/10 p-3 md:p-4 rounded-xl flex items-center justify-between">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-900/40">{type}</span>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => setFormData({ ...formData, passengerCount: { ...formData.passengerCount, [type]: Math.max(0, count - 1) } })} className="text-emerald-600 font-bold text-lg w-8 h-8 flex items-center justify-center bg-emerald-50 rounded-lg">-</button>
                                                    <span className="font-bold text-sm w-4 text-center text-emerald-900">{count}</span>
                                                    <button onClick={() => setFormData({ ...formData, passengerCount: { ...formData.passengerCount, [type]: count + 1 } })} className="text-emerald-600 font-bold text-lg w-8 h-8 flex items-center justify-center bg-emerald-50 rounded-lg">+</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            onClick={() => setFormData({ ...formData, hasNameBoard: !formData.hasNameBoard })}
                                            className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${formData.hasNameBoard ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm' : 'bg-white border-emerald-900/10 text-emerald-900/60 hover:bg-emerald-50/50'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Signpost size={18} className={formData.hasNameBoard ? 'text-emerald-600' : ''} />
                                                <div className="text-left">
                                                    <span className="text-[10px] md:text-xs font-bold block uppercase tracking-tight">Airport Name Board</span>
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
                                            <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest pl-2">Name Board Text</label>
                                            <input type="text" value={formData.nameBoardText} onChange={e => setFormData({ ...formData, nameBoardText: e.target.value })} className="w-full h-12 bg-white border border-emerald-900/10 px-6 rounded-xl outline-none focus:border-emerald-600 transition-all font-bold text-xs text-emerald-900" placeholder="Greeting text..." />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-5 md:p-8 bg-emerald-900 rounded-[2rem] text-white flex flex-col md:flex-row items-start md:items-center justify-between shadow-xl gap-4 md:gap-0">
                                <div className="w-full md:w-auto">
                                    <div className="flex items-center gap-2 text-emerald-400 mb-1">
                                        <Zap size={14} fill="currentColor" />
                                        <span className="text-[10px] font-extrabold uppercase tracking-widest">{formData.paymentType === 'partial' ? 'Pay Now' : 'Total Price'}</span>
                                    </div>
                                    <div className="text-2xl md:text-4xl font-black leading-tight">Rs {payNow.toLocaleString()}</div>
                                    {formData.couponCode && <div className="text-[10px] text-emerald-300 font-bold uppercase mt-1">Coupon {formData.couponCode} Applied</div>}
                                </div>
                                <div className="text-left md:text-right w-full md:w-auto border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
                                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Route Distance</div>
                                    <div className="text-lg md:text-xl font-bold text-white">{distance.toFixed(1)} KM</div>
                                </div>
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
                                    { label: 'Email Address', key: 'email', type: 'email', placeholder: 'for confirmation' },
                                    { label: 'Flight Identifier', key: 'flightNumber', type: 'text', placeholder: 'e.g. EK 654' },
                                ].map(f => (
                                    <div key={f.key} className="space-y-2">
                                        <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest pl-2">{f.label}</label>
                                        <input type={f.type} value={formData[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} className="w-full h-12 md:h-14 bg-white border border-emerald-900/10 px-4 md:px-6 rounded-2xl outline-none focus:border-emerald-900 focus:ring-4 focus:ring-emerald-900/5 transition-all font-bold text-sm text-emerald-900" placeholder={f.placeholder} />
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest pl-2">Pick-up Date & Time</label>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="flex-1 h-12 md:h-14 bg-white border border-emerald-900/10 px-4 md:px-6 rounded-2xl outline-none text-sm font-bold text-emerald-900" />
                                    <input type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} className="flex-1 h-12 md:h-14 bg-white border border-emerald-900/10 px-4 md:px-6 rounded-2xl outline-none text-sm font-bold text-emerald-900" />
                                </div>
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
                                    </div>
                                    <div className="p-4 md:p-6 bg-emerald-50 rounded-3xl border border-emerald-900/10 space-y-4">
                                        <div className="flex justify-between text-xs font-bold text-emerald-900/40 uppercase tracking-widest">
                                            <span>Subtotal</span>
                                            <span className="text-emerald-900 font-bold">Rs {subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold text-emerald-900/40 uppercase tracking-widest">
                                            <span>Surcharges</span>
                                            <span className="text-emerald-900 font-bold">Rs {surcharges.toLocaleString()}</span>
                                        </div>
                                        <div className="pt-4 border-t border-emerald-900/10 space-y-2">
                                            <div className="flex justify-between items-end">
                                                <span className="font-bold text-emerald-900/60 uppercase text-xs">Total Amount</span>
                                                <span className="text-xl font-bold text-emerald-900/60">Rs {totalPrice.toLocaleString()}</span>
                                            </div>

                                            <div className="flex justify-between items-end">
                                                <span className="font-black text-emerald-600 uppercase tracking-[0.2em]">{formData.paymentType === 'partial' ? 'Pay Now (50%)' : 'Total Payable'}</span>
                                                <span className="text-2xl md:text-3xl font-black text-emerald-900">Rs {payNow.toLocaleString()}</span>
                                            </div>

                                            {formData.paymentType === 'partial' && (
                                                <div className="flex justify-between items-end pt-2 border-t border-dashed border-emerald-900/20">
                                                    <span className="font-bold text-red-500 uppercase text-xs tracking-wider">Balance Due</span>
                                                    <span className="text-lg font-bold text-red-500">Rs {balanceAmount.toLocaleString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest pl-2">Discount Coupon</label>
                                        <div className="flex gap-2">
                                            <input
                                                value={couponInput}
                                                onChange={e => setCouponInput(e.target.value.toUpperCase())}
                                                placeholder="Enter Code"
                                                className="flex-1 h-12 bg-white border border-emerald-900/10 px-4 rounded-xl outline-none focus:border-emerald-600 transition-all font-bold text-sm text-emerald-900 uppercase placeholder:normal-case"
                                            />
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={couponLoading || !couponInput}
                                                className="px-6 bg-emerald-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-800 disabled:opacity-50 transition-colors flex items-center justify-center min-w-[80px]"
                                            >
                                                {couponLoading ? <Loader2 className="animate-spin" size={16} /> : 'Apply'}
                                            </button>
                                        </div>
                                        {verifiedCoupon && (
                                            <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold pl-2 animate-fade-in">
                                                <Check size={14} /> Coupon applied: {verifiedCoupon.code}
                                                <span className="text-emerald-900/40 font-normal">
                                                    (-{verifiedCoupon.discountType === 'percentage' ? `${verifiedCoupon.value}%` : `Rs ${verifiedCoupon.value}`})
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest pl-2">Payment Method</label>
                                    <div className="grid grid-cols-1 gap-4">
                                        {[
                                            { id: 'cash', label: 'Cash Payment', icon: '💵', desc: 'Pay directly to chauffeur' },
                                            { id: 'card', label: 'Online Payment', icon: '💳', desc: 'Secure digital transaction' },
                                        ].map(m => (
                                            <button key={m.id} onClick={() => setFormData({ ...formData, paymentMethod: m.id })} className={`p-4 md:p-6 rounded-[1.5rem] border-2 transition-all flex items-center gap-4 md:gap-6 text-left ${formData.paymentMethod === m.id ? 'border-emerald-900 bg-emerald-50' : 'border-emerald-900/5 bg-white hover:border-emerald-900/20 shadow-sm'}`}>
                                                <span className="text-3xl md:text-4xl">{m.icon}</span>
                                                <div>
                                                    <p className="font-bold text-emerald-900 text-sm tracking-tight">{m.label}</p>
                                                    <p className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest">{m.desc}</p>
                                                </div>
                                            </button>
                                        ))}
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
                            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                            className="flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-white rounded-xl md:rounded-2xl text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-emerald-50 transition-all text-emerald-900 border border-emerald-900/10 shadow-sm w-full md:w-auto min-w-[120px]"
                        >
                            <ChevronLeft size={16} className="md:block hidden" /> {step === 1 ? 'Cancel' : 'Back'}
                        </button>

                        {step < 3 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                disabled={(step === 1 && (!formData.pickup || !formData.dropoff)) || (step === 2 && (!formData.name || !formData.phone))}
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
