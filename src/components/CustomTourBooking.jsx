'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Navigation, ChevronRight, ChevronLeft, Plane, Car, Minus, Plus, Send, CheckCircle2, User, Mail, Phone, Loader2, AlertCircle, Info, Sparkles, CreditCard } from 'lucide-react';
import { calculateBasePrice, calculateTrafficSurge, TAXI_TOUR_PACKAGES } from '@/lib/pricing-util';
import { loadGoogleMapsScript } from '@/lib/google-maps';
import { useSession } from 'next-auth/react';

const CustomTourBooking = () => {
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [tab, setTab] = useState('airport'); // 'airport' | 'tour'
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [locations, setLocations] = useState(['', '']);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState('');
  const [pricingSettings, setPricingSettings] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [surgeRules, setSurgeRules] = useState([]);

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    passengers: 1,
    luggage: 0,
    name: '',
    email: '',
    phone: '',
    notes: '',
    taxiTourHours: 2,
    taxiTourKm: 40,
    paymentMethod: 'card'
  });

  // Load vehicles and settings
  useEffect(() => {
    fetch('/api/pricing?category=airport-transfer')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          const mapped = data.data.map(v => {
            let img = v.image || '/vehicles/placeholder.png';
            if (v.vehicleType === 'sedan') img = '/vehicles/sedan2.png';
            if (v.vehicleType === 'mini-car') img = '/vehicles/minicar.png';
            return {
              ...v, // Preserve database-supplied tiers and other properties
              id: v.vehicleType,
              name: v.name.split('(')[0].trim().toUpperCase(),
              baseRate: v.basePrice || 5000,
              perKm: v.perKmRate || 110,
              image: img,
              capacity: v.capacity || 2,
              suitcases: v.luggage || 4
            };
          });
          setVehicles(mapped);
          setSelectedVehicle(mapped[0]);
        } else {
          const defaults = [
            { id: 'mini-car', name: 'MINI CAR', baseRate: 5000, perKm: 100, image: '/vehicles/minicar.png', capacity: 3, suitcases: 2 },
            { id: 'sedan', name: 'SEDAN', baseRate: 6500, perKm: 130, image: '/vehicles/sedan2.png', capacity: 4, suitcases: 3 },
            { id: 'vezel', name: 'HONDA VEZEL', baseRate: 8000, perKm: 135, image: '/vehicles/Hondavezel.png', capacity: 4, suitcases: 3 },
            { id: 'mini-van-every', name: 'MINI VAN (EVERY)', baseRate: 7000, perKm: 110, image: '/vehicles/susukievery.png', capacity: 4, suitcases: 4 },
            { id: 'mini-van-05', name: 'MINI VAN (5 SEATER)', baseRate: 7500, perKm: 130, image: '/vehicles/minivan5seat.png', capacity: 5, suitcases: 5 },
            { id: 'suv', name: 'SUV (LUXURY)', baseRate: 9000, perKm: 160, image: '/vehicles/Hondavezel.png', capacity: 4, suitcases: 4 },
            { id: 'kdh-van', name: 'KDH HIGH ROOF', baseRate: 10000, perKm: 180, image: '/vehicles/toyota-highroof.png', capacity: 9, suitcases: 8 },
            { id: 'mini-bus', name: 'MINI BUS (COSTER)', baseRate: 15000, perKm: 250, image: '/vehicles/costerbus.png', capacity: 20, suitcases: 15 },
            { id: 'coach-bus', name: 'LUXURY COACH', baseRate: 25000, perKm: 450, image: '/vehicles/coach-bus.png', capacity: 45, suitcases: 50 }
          ];
          setVehicles(defaults);
          setSelectedVehicle(defaults[0]);
        }
      })
      .catch(err => {
        console.error("Error fetching vehicles:", err);
        const defaults = [
          { id: 'mini-car', name: 'MINI CAR', baseRate: 5000, perKm: 100, image: '/vehicles/minicar.png', capacity: 3, suitcases: 2 },
          { id: 'sedan', name: 'SEDAN', baseRate: 6500, perKm: 130, image: '/vehicles/sedan_luxury.png', capacity: 4, suitcases: 3 },
          { id: 'vezel', name: 'HONDA VEZEL', baseRate: 8000, perKm: 135, image: '/vehicles/Hondavezel.png', capacity: 4, suitcases: 3 },
          { id: 'mini-van-every', name: 'MINI VAN (EVERY)', baseRate: 7000, perKm: 110, image: '/vehicles/susukievery.png', capacity: 4, suitcases: 4 },
          { id: 'mini-van-05', name: 'MINI VAN (5 SEATER)', baseRate: 7500, perKm: 130, image: '/vehicles/minivan5seat.png', capacity: 5, suitcases: 5 },
          { id: 'suv', name: 'SUV (LUXURY)', baseRate: 9000, perKm: 160, image: '/vehicles/Hondavezel.png', capacity: 4, suitcases: 4 },
          { id: 'kdh-van', name: 'KDH HIGH ROOF', baseRate: 10000, perKm: 180, image: '/vehicles/toyota-highroof.png', capacity: 9, suitcases: 8 },
          { id: 'mini-bus', name: 'MINI BUS (COSTER)', baseRate: 15000, perKm: 250, image: '/vehicles/costerbus.png', capacity: 20, suitcases: 15 },
          { id: 'coach-bus', name: 'LUXURY COACH', baseRate: 25000, perKm: 450, image: '/vehicles/coach-bus.png', capacity: 45, suitcases: 50 }
        ];
        setVehicles(defaults);
        setSelectedVehicle(defaults[0]);
      });

    fetch('/api/admin/pricing-settings')
      .then(res => res.json())
      .then(data => {
        if (data.success) setPricingSettings(data.data);
      })
      .catch(err => console.error("Error fetching pricing settings:", err));

    fetch('/api/admin/destinations')
      .then(res => res.json())
      .then(data => {
        if (data.success) setDestinations(data.data);
      })
      .catch(err => console.error("Error fetching destinations:", err));

    fetch('/api/traffic-surge')
      .then(res => res.json())
      .then(data => {
        if (data.success) setSurgeRules(data.data);
      })
      .catch(err => console.error("Error fetching surge rules:", err));
  }, []);

  // Pre-fill user details if session exists
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || session.user.name || '',
        email: prev.email || session.user.email || ''
      }));
    }
  }, [session]);

  // Window Event Listener for syncCustomTourBooking
  useEffect(() => {
    const handleSync = (e) => {
      const { tab: syncTab, vehicleId, hours, km } = e.detail || {};
      if (syncTab) {
        setTab(syncTab);
      }
      if (vehicleId) {
        const found = vehicles.find(v => v.id === vehicleId || v.vehicleType === vehicleId || v.vehicleSlug === vehicleId);
        if (found) {
          setSelectedVehicle(found);
        }
      }
      setFormData(prev => ({
        ...prev,
        taxiTourHours: hours || prev.taxiTourHours,
        taxiTourKm: km || prev.taxiTourKm
      }));
    };

    window.addEventListener('syncCustomTourBooking', handleSync);
    return () => {
      window.removeEventListener('syncCustomTourBooking', handleSync);
    };
  }, [vehicles]);

    // Auto-fill/clear pickup location based on tab
  useEffect(() => {
    if (tab === 'airport') {
      setLocations(prev => {
        const newLocs = [...prev];
        newLocs[0] = "Bandaranaike International Airport (CMB)";
        return newLocs;
      });
    } else {
      setLocations(prev => {
        const newLocs = [...prev];
        if (newLocs[0] === "Bandaranaike International Airport (CMB)") {
          newLocs[0] = '';
        }
        return newLocs;
      });
    }
  }, [tab]);

  // Update hours and dynamic KM limit defaults
  const updateDuration = (newHours) => {
    const newKm = newHours * 20;
    setFormData(prev => ({ ...prev, taxiTourHours: newHours, taxiTourKm: newKm }));
  };

  // Google Maps Places Autocomplete setup
  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => setGoogleLoaded(true))
      .catch(err => console.error("Error loading Google Maps script:", err));
  }, []);

  const initAutocomplete = (node, index) => {
    if (!googleLoaded || !node || node.dataset.googleAutocomplete) return;
    const autocomplete = new window.google.maps.places.Autocomplete(node, { 
      componentRestrictions: { country: "lk" }, 
      fields: ["formatted_address"] 
    });
    node.dataset.googleAutocomplete = 'true';
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.formatted_address) return;
      setLocations(prev => {
        const newLocs = [...prev];
        newLocs[index] = place.formatted_address;
        return newLocs;
      });
    });
  };

  // Route calculation
  useEffect(() => {
    const valid = locations.filter(l => l.trim().length > 3);
    if (valid.length >= 2 && googleLoaded) {
      const calculateRoute = async () => {
        setIsCalculating(true);
        const directionsService = new window.google.maps.DirectionsService();
        try {
          const result = await new Promise((resolve, reject) => {
            directionsService.route({
              origin: locations[0],
              destination: locations[locations.length - 1],
              waypoints: locations.slice(1, -1).map(l => ({ location: l, stopover: true })),
              travelMode: window.google.maps.TravelMode.DRIVING,
            }, (res, status) => { if (status === 'OK') resolve(res); else reject(status); });
          });
          const dist = result.routes[0].legs.reduce((acc, leg) => acc + leg.distance.value, 0) / 1000;
          setDistance(Math.ceil(dist));
          setDuration(result.routes[0].legs[0].duration.text);
        } catch (e) { console.error(e); } finally { setIsCalculating(false); }
      };
      const timer = setTimeout(calculateRoute, 1000);
      return () => clearTimeout(timer);
    }
  }, [locations, googleLoaded]);

  const handleAddLocation = () => { if (locations.length < 4) setLocations([...locations, '']); };
  const handleRemoveLocation = (index) => {
    if (locations.length > 2) {
      const newLocs = [...locations];
      newLocs.splice(index, 1);
      setLocations(newLocs);
    }
  };
  const handleLocationChange = (index, value) => { const newLocs = [...locations]; newLocs[index] = value; setLocations(newLocs); };

  // Calculate pricing based on selected vehicle & hours & KM limit
  const calculateTotalForVehicle = (veh) => {
    if (!veh) return 0;
    const tourPkg = TAXI_TOUR_PACKAGES.find(p => p.hours === Number(formData.taxiTourHours));
    let basePrice = tourPkg ? tourPkg.price : (formData.taxiTourHours * 2500);
    
    // Scale dynamic rate slightly depending on vehicle class tier
    if (veh.id === 'sedan') basePrice *= 1.2;
    if (veh.id === 'vezel' || veh.id === 'suv') basePrice *= 1.4;
    if (veh.id === 'mini-van-every' || veh.id === 'mini-van-05') basePrice *= 1.3;
    if (veh.id === 'van' || veh.id === 'kdh-van') basePrice *= 1.7;
    if (veh.id === 'mini-bus') basePrice *= 2.5;
    if (veh.id === 'coach-bus') basePrice *= 4.5;

    // Handle extra KMs if route exceeds selections
    let total = basePrice;
    if (distance > formData.taxiTourKm) {
      total += (distance - formData.taxiTourKm) * (veh.perKmRate || veh.perKm || 100);
    }
    return Math.round(total);
  };

  const totalPrice = calculateTotalForVehicle(selectedVehicle);


  const handleBooking = async () => {
    if (!formData.name || !formData.phone || !formData.email || !formData.date || !formData.time) {
      alert("Please fill in all required contact, email, and timing details.");
      return;
    }
    setIsBooking(true);
    try {
      const res = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: session?.user?.id || null,
          pickupLocation: { address: locations[0] || 'Airport' },
          dropoffLocation: { address: locations[locations.length - 1] || 'Tour Destination' },
          waypoints: locations.slice(1, -1).map(l => ({ address: l })),
          vehicleType: selectedVehicle.id,
          tripType: 'round-trip',
          type: 'tour',
          tourDetails: {
            tourId: `custom-tour-${formData.taxiTourHours}h-${formData.taxiTourKm}km`,
            tourTitle: `${tab === 'airport' ? 'Airport' : 'Custom'} Round Tour (${formData.taxiTourHours}h / ${formData.taxiTourKm}km)`,
            duration: `${formData.taxiTourHours} Hours`
          },
          roundTripPackageId: tab === 'tour' ? `custom-tour-${formData.taxiTourHours}h` : 'airport-round-tour',
          passengerCount: { adults: formData.passengers, children: 0, luggage: formData.luggage, handLuggage: 0 },
          distanceKm: distance || formData.taxiTourKm,
          totalPrice: totalPrice,
          paidAmount: formData.paymentMethod === 'cash' ? 0 : totalPrice,
          balanceAmount: formData.paymentMethod === 'cash' ? totalPrice : 0,
          displayPrice: totalPrice,
          displayPaidAmount: formData.paymentMethod === 'cash' ? 0 : totalPrice,
          displayBalanceAmount: formData.paymentMethod === 'cash' ? totalPrice : 0,
          currency: 'LKR',
          scheduledDate: formData.date,
          scheduledTime: formData.time,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          guestPhone: formData.phone,
          whatsappNumber: formData.phone,
          paymentMethod: formData.paymentMethod,
          notes: `Custom Tour: ${formData.taxiTourHours} Hours, Limit: ${formData.taxiTourKm} KM. ${formData.notes || ''}`
        })
      });
      const data = await res.json();
      if (data.success) {
        // Open WhatsApp confirmation companion window
        try {
          const tourTypeStr = tab === 'airport' ? 'AirPort Round TOUR' : 'Round TOUR';
          const message = `*New Tour Booking Request*%0A` + 
                          `*Type:* ${tourTypeStr}%0A` + 
                          `*Name:* ${formData.name}%0A` + 
                          `*WhatsApp:* ${formData.phone}%0A` + 
                          `*Vehicle:* ${selectedVehicle.name}%0A` + 
                          `*Hours:* ${formData.taxiTourHours} Hours%0A` + 
                          `*KM Limit:* ${formData.taxiTourKm} KM%0A` + 
                          `*Route:* ${locations.filter(Boolean).join(' ➔ ')}%0A` + 
                          `*Date/Time:* ${formData.date} at ${formData.time}%0A` + 
                          `*Payment:* ${formData.paymentMethod === 'cash' ? 'Cash to Driver' : 'Pay Online (Card)'}%0A` + 
                          `*Price:* Rs. ${totalPrice.toLocaleString()}`;
          window.open(`https://wa.me/94768743357?text=${message}`, '_blank');
        } catch (e) {
          console.error("WhatsApp companion load blocked", e);
        }
        
        // Redirect to gateway or success page
        window.location.href = data.paymentUrl;
      } else { 
        alert(data.message || "Booking failed"); 
      }
    } catch (e) { 
      alert("An error occurred. Please try again."); 
    } finally { 
      setIsBooking(false); 
    }
  };

  // Custom premium line art SVGs for vehicle display
  const renderVehicleIcon = (id, isActive) => {
    const strokeColor = isActive ? '#000000' : '#475569';
    const accentColor = isActive ? '#FACC15' : 'transparent';
    
    if (id === 'mini-car' || id === 'mini') {
      return (
        <svg className="w-20 h-10 transition-all duration-300" viewBox="0 0 100 45" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 32H12C13.5 32 14.5 30.5 14.5 29C14.5 27.5 15.8 26.2 17.5 26.2C19.2 26.2 20.5 27.5 20.5 29C20.5 30.5 21.5 32 23 32H77C78.5 32 79.5 30.5 79.5 29C79.5 27.5 80.8 26.2 82.5 26.2C84.2 26.2 85.5 27.5 85.5 29C85.5 30.5 86.5 32 88 32H95C96.5 32 97.5 30.5 97.5 29V24C97.5 21 95 19 91 18.5L82 18L72 9C70.5 7.5 68 7 66 7H38C35 7 32.5 9 31 11.5L21 21H8C6 21 5 22.5 5 24V29C5 30.5 5 32 5 32Z" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={accentColor} fillOpacity="0.2"/>
          <path d="M34 8L36 21H68L65 8H38Z" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="17.5" cy="29" r="6" stroke={strokeColor} strokeWidth="2" fill="#fff"/>
          <circle cx="17.5" cy="29" r="2.5" fill={strokeColor}/>
          <circle cx="82.5" cy="29" r="6" stroke={strokeColor} strokeWidth="2" fill="#fff"/>
          <circle cx="82.5" cy="29" r="2.5" fill={strokeColor}/>
        </svg>
      );
    }
    if (id === 'sedan') {
      return (
        <svg className="w-20 h-10 transition-all duration-300" viewBox="0 0 100 45" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 31H12C13.5 31 14.5 29.5 14.5 28C14.5 26.5 15.8 25.2 17.5 25.2C19.2 25.2 20.5 26.5 20.5 28C20.5 29.5 21.5 31 23 31H77C78.5 31 79.5 29.5 79.5 28C79.5 26.5 80.8 25.2 82.5 25.2C84.2 25.2 85.5 26.5 85.5 28C85.5 29.5 86.5 31 88 31H96C97.5 31 98.5 29.5 98.5 28V22C98.5 19 96 17.5 93 17.2L74 16.5L61 8C59 6.8 56.5 6.5 54 6.5H35C32.5 6.5 30 7.8 28.5 9.8L18 20.5H6C4 20.5 3 22 3 23.5V28C3 29.5 3 31 4 31Z" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={accentColor} fillOpacity="0.2"/>
          <path d="M30.5 10L32.5 20H60L56.5 10H35Z" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="17.5" cy="28" r="6" stroke={strokeColor} strokeWidth="2" fill="#fff"/>
          <circle cx="17.5" cy="28" r="2.5" fill={strokeColor}/>
          <circle cx="82.5" cy="28" r="6" stroke={strokeColor} strokeWidth="2" fill="#fff"/>
          <circle cx="82.5" cy="28" r="2.5" fill={strokeColor}/>
        </svg>
      );
    }
    if (id === 'vezel' || id === 'suv') {
      return (
        <svg className="w-20 h-10 transition-all duration-300" viewBox="0 0 100 45" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 33H12C13.5 33 14.5 31.5 14.5 30C14.5 28.5 15.8 27.2 17.5 27.2C19.2 27.2 20.5 28.5 20.5 30C20.5 31.5 21.5 33 23 33H77C78.5 33 79.5 31.5 79.5 30C79.5 28.5 80.8 27.2 82.5 27.2C84.2 27.2 85.5 28.5 85.5 30C85.5 31.5 86.5 33 88 33H95C96.5 33 97.5 31.5 97.5 30V22C97.5 19 95 16.5 90 16L79 15.5L66 7.5C64.5 6.5 62 6 60 6H38C35.5 6 33.2 7.2 31.8 9.2L20 20H8C6 20 5 21.5 5 23V30C5 31.5 5 33 5 33Z" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={accentColor} fillOpacity="0.2"/>
          <path d="M33 9.5L35 19.5H64.5L59.5 9.5H38Z" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="17.5" cy="30" r="6" stroke={strokeColor} strokeWidth="2" fill="#fff"/>
          <circle cx="17.5" cy="30" r="2.5" fill={strokeColor}/>
          <circle cx="82.5" cy="30" r="6" stroke={strokeColor} strokeWidth="2" fill="#fff"/>
          <circle cx="82.5" cy="30" r="2.5" fill={strokeColor}/>
        </svg>
      );
    }
    // Default Van Outline
    return (
      <svg className="w-20 h-10 transition-all duration-300" viewBox="0 0 100 45" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 33H12C13.5 33 14.5 31.5 14.5 30C14.5 28.5 15.8 27.2 17.5 27.2C19.2 27.2 20.5 28.5 20.5 30C20.5 31.5 21.5 33 23 33H77C78.5 33 79.5 31.5 79.5 30C79.5 28.5 80.8 27.2 82.5 27.2C84.2 27.2 85.5 28.5 85.5 30C85.5 31.5 86.5 33 88 33H96C97.5 33 98.5 31.5 98.5 30V19C98.5 14.5 96.5 12.5 92 12H72L58 6.5C56.2 5.8 54.2 5.5 52 5.5H24C19 5.5 16 8.5 15 13L10 20H6C4 20 3 21.5 3 23V30C3 31.5 3 33 4 33Z" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={accentColor} fillOpacity="0.2"/>
        <path d="M22 8L17 19.5H48L46 8H24Z" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M51 8H76V19.5H49L51 8Z" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="17.5" cy="30" r="6" stroke={strokeColor} strokeWidth="2" fill="#fff"/>
        <circle cx="17.5" cy="30" r="2.5" fill={strokeColor}/>
        <circle cx="82.5" cy="30" r="6" stroke={strokeColor} strokeWidth="2" fill="#fff"/>
        <circle cx="82.5" cy="30" r="2.5" fill={strokeColor}/>
      </svg>
    );
  };

  if (isBooked) {
    return (
      <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-2xl border border-slate-100 max-w-2xl mx-auto py-16">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"><CheckCircle2 size={48} /></div>
        <h3 className="text-3xl font-black text-emerald-950 mb-4 uppercase tracking-tighter">Tour Confirmed!</h3>
        <p className="text-slate-500 mb-10 max-w-md mx-auto text-sm font-medium">Your request has been successfully processed. We have prepared your WhatsApp confirmation details.</p>
        <button onClick={() => { setIsBooked(false); setStep(1); }} className="px-10 py-5 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Create New Booking</button>
      </div>
    );
  }

  // Dynamic KM limits selection array
  const currentKmLimits = [
    formData.taxiTourHours * 5,
    formData.taxiTourHours * 10,
    formData.taxiTourHours * 15,
    formData.taxiTourHours * 20
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200/80 dark:border-white/10 p-4 sm:p-6">
      
      {/* Dynamic Header Step Indicator */}
      <div className="flex items-center justify-between mb-5 px-2 border-b border-slate-100 dark:border-white/5 pb-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-black tracking-[0.3em] uppercase text-emerald-600 dark:text-[#FACC15] flex items-center gap-1.5">
            <Sparkles size={10} /> Premium Round Tours
          </span>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
            {step === 1 ? "Choose Your Vehicle Class" : "Configure Route & Booking Details"}
          </span>
        </div>
        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Step {step} of 2
        </span>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* 1. Consolidated Category Selection (Segmented Toggle Control) */}
            <div className="flex justify-center">
              <div className="inline-flex w-full bg-slate-100/70 dark:bg-zinc-800/60 p-1 rounded-2xl border border-slate-200/30 dark:border-white/5 relative">
                <button 
                  type="button"
                  onClick={() => setTab('airport')} 
                  className={`flex-1 py-2 rounded-xl transition-all duration-300 font-black text-[9px] uppercase tracking-wider flex items-center justify-center gap-1.5 z-10
                    ${tab === 'airport' 
                      ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-md font-bold' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  <Plane size={12} /> AirPort Round TOUR
                </button>
                <button 
                  type="button"
                  onClick={() => setTab('tour')} 
                  className={`flex-1 py-2 rounded-xl transition-all duration-300 font-black text-[9px] uppercase tracking-wider flex items-center justify-center gap-1.5 z-10
                    ${tab === 'tour' 
                      ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-md font-bold' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  <Car size={12} /> Round TOUR
                </button>
              </div>
            </div>

            {/* 2. Distinct Vehicle Selection Slider/Grid */}
            <div className="space-y-2">
              <label className="text-[9px] uppercase font-black text-slate-500 dark:text-slate-400 tracking-widest px-2 block">
                Select Vehicle
              </label>
              <div 
                className="flex overflow-x-auto snap-x snap-mandatory gap-2 pb-3 pt-0.5 px-1 no-scrollbar sm:grid sm:grid-cols-3 sm:gap-3 select-none"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {vehicles.map((v) => {
                  const isActive = selectedVehicle?.id === v.id;
                  const dynamicPrice = calculateTotalForVehicle(v);
                  const imageClass = 'h-12 sm:h-14';
                  
                  const isMini = v.id?.toLowerCase().includes('mini') || v.name?.toLowerCase().includes('mini') || v.name?.toLowerCase().includes('wagon');
                  const isSedan = v.id?.toLowerCase().includes('sedan') || v.name?.toLowerCase().includes('sedan');
                  
                  let imgScale = 'scale-100';
                  if (isSedan) {
                    imgScale = 'scale-[1.35] sm:scale-[1.4]';
                  } else if (isMini) {
                    imgScale = 'scale-[1.05] sm:scale-[1.1]';
                  } else {
                    imgScale = 'scale-[1.1] sm:scale-[1.15]';
                  }
                  
                  return (
                    <button 
                      key={v.id} 
                      type="button"
                      onClick={() => setSelectedVehicle(v)} 
                      className={`flex-shrink-0 w-[44vw] sm:w-auto snap-start flex flex-col items-center p-2 sm:p-2.5 rounded-2xl transition-all duration-300 border text-center relative overflow-hidden group
                        ${isActive 
                          ? 'bg-[#FACC15]/10 dark:bg-zinc-800/80 border-[#FACC15] shadow-sm' 
                          : 'bg-transparent border-transparent hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 shadow-none'}`}
                    >
                      {/* Vehicle images */}
                      <div className={`${imageClass} mb-1 flex items-center justify-center w-full group-hover:scale-105 transition-transform duration-300 relative`}>
                        <img 
                          src={v.image || '/vehicles/minicar.png'} 
                          alt={v.name} 
                          className={`object-contain max-h-full max-w-full drop-shadow-sm select-none pointer-events-none transition-transform duration-300 ${imgScale}`}
                        />
                      </div>
                      
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-800 dark:text-white mb-0.5">{v.name}</p>
                      <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 mb-1">RS : {v.baseRate.toLocaleString()}</p>
                      
                      {/* Passenger capacity and baggage count details */}
                      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-white/5 pt-1 w-full justify-center">
                        <span className="flex items-center gap-1 text-[8px] font-bold"><User size={8} /> {v.capacity}</span>
                        <span className="flex items-center gap-0.5 text-[8px] font-bold">💼 {v.suitcases}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stepper Selection & KM Limit (Step 1) */}
            <div className="space-y-4 bg-slate-50/50 dark:bg-zinc-800/10 p-4 rounded-3xl border border-slate-100 dark:border-white/5">
              {/* Stepper Selection */}
              <div className="space-y-2">
                <label className="text-[9px] uppercase font-black text-slate-500 dark:text-slate-400 tracking-widest px-2 block">Select hours</label>
                <div className="flex items-center bg-white dark:bg-zinc-850 border border-slate-200/80 dark:border-white/10 p-1 rounded-2xl shadow-sm">
                  <button 
                    type="button"
                    onClick={() => updateDuration(Math.max(1, formData.taxiTourHours - 1))} 
                    className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-zinc-700/50 flex items-center justify-center text-slate-600 dark:text-white hover:bg-slate-100 active:scale-95 transition-all shadow-sm"
                  >
                    <Minus size={16} strokeWidth={3} />
                  </button>
                  <div className="flex-1 text-center font-black text-slate-800 dark:text-white flex items-center justify-center gap-1.5">
                    <span className="text-lg font-black">{formData.taxiTourHours}</span>
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">hours</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => updateDuration(Math.min(12, formData.taxiTourHours + 1))} 
                    className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-zinc-700/50 flex items-center justify-center text-slate-600 dark:text-white hover:bg-slate-100 active:scale-95 transition-all shadow-sm"
                  >
                    <Plus size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>

              {/* Dynamic KM selection */}
              <div className="space-y-2">
                <label className="text-[9px] uppercase font-black text-slate-500 dark:text-slate-400 tracking-widest px-2 block">Select KM Limit</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {currentKmLimits.map((km) => {
                    const isSelected = formData.taxiTourKm === km;
                    return (
                      <button
                        type="button"
                        key={km}
                        onClick={() => setFormData(prev => ({ ...prev, taxiTourKm: km }))}
                        className={`py-2 rounded-xl text-[10px] font-black transition-all border text-center tracking-widest
                          ${isSelected 
                            ? 'bg-[#FACC15] text-black border-[#FACC15] shadow-md' 
                            : 'bg-white dark:bg-zinc-850 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-white/10 hover:border-yellow-400'}`}
                      >
                        {km} KM
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>



            {/* Next Button */}
            <div className="pt-2 text-center">
              <button 
                type="button"
                onClick={() => setStep(2)} 
                className="w-full py-3.5 bg-black hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                NEXT <ChevronRight size={14} strokeWidth={3} />
              </button>
            </div>

          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >

            {/* Block 2: Isolated Route Planning */}
            <section className="bg-slate-50 dark:bg-zinc-800/20 rounded-3xl border border-slate-100 dark:border-white/5 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                <div className="flex items-center gap-1.5">
                  <MapPin className="text-emerald-600 dark:text-[#FACC15]" size={14} />
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Route details</h4>
                </div>
                {locations.length < 4 && (
                  <button 
                    type="button"
                    onClick={handleAddLocation} 
                    className="text-[9px] font-black text-emerald-600 dark:text-[#FACC15] uppercase tracking-widest flex items-center gap-1 hover:underline"
                  >
                    <Plus size={10} /> Add Stop
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {locations.map((loc, idx) => (
                  <div key={idx} className="relative group flex items-center gap-1.5">
                    <div className="relative flex-1">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        {idx === 0 ? <Plane size={14} /> : idx === locations.length - 1 ? <MapPin size={14} /> : <Navigation size={14} />}
                      </div>
                      <input 
                        type="text" 
                        value={loc} 
                        ref={(el) => initAutocomplete(el, idx)} 
                        onChange={(e) => handleLocationChange(idx, e.target.value)} 
                        placeholder={idx === 0 ? "Pickup Location (Sri Lanka)" : idx === locations.length - 1 ? "Final Destination" : `Stop ${idx}`} 
                        className="w-full bg-white dark:bg-zinc-800 border border-slate-200/60 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 outline-none font-bold text-[11px] text-slate-900 dark:text-white focus:border-[#FACC15] transition-all shadow-sm" 
                      />
                    </div>
                    {locations.length > 2 && (
                      <button 
                        type="button"
                        onClick={() => handleRemoveLocation(idx)} 
                        className="p-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 text-red-500 rounded-lg transition-all"
                      >
                        <Minus size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Distance Display & Details */}
              <div className="flex flex-wrap gap-3 items-center justify-between bg-white dark:bg-zinc-800/80 p-4 rounded-xl border border-slate-100 dark:border-white/5 mt-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-slate-50 dark:bg-zinc-700/50 rounded-lg flex items-center justify-center text-emerald-600 shadow-sm">
                    {isCalculating ? <Loader2 className="animate-spin" size={14} /> : <Navigation size={16} />}
                  </div>
                  <div>
                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Total Distance</p>
                    <p className="text-sm font-black text-slate-800 dark:text-white">{distance > 0 ? `${distance} KM` : 'Calculating...'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Selected Tour Fare</p>
                  <p className="text-base font-black text-emerald-700 dark:text-emerald-400">Rs. {totalPrice.toLocaleString()}.00</p>
                </div>
              </div>
            </section>

            {/* Block 3: Isolated Timing & Contact Information */}
            <section className="bg-slate-50 dark:bg-zinc-800/20 rounded-3xl border border-slate-100 dark:border-white/5 p-4 space-y-3">
              <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-white/5 pb-2">
                <User className="text-emerald-600 dark:text-[#FACC15]" size={14} />
                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Contact & Schedule</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <label className="text-[8px] uppercase font-black text-slate-400 tracking-widest px-2">Pickup Date</label>
                  <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full bg-white dark:bg-zinc-800 border border-slate-200/80 dark:border-white/10 rounded-xl py-2 px-3 outline-none font-bold text-[11px] text-slate-900 dark:text-white" />
                </div>
                <div className="space-y-0.5">
                  <label className="text-[8px] uppercase font-black text-slate-400 tracking-widest px-2">Pickup Time</label>
                  <input type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} className="w-full bg-white dark:bg-zinc-800 border border-slate-200/80 dark:border-white/10 rounded-xl py-2 px-3 outline-none font-bold text-[11px] text-slate-900 dark:text-white" />
                </div>
                <div className="space-y-0.5">
                  <label className="text-[8px] uppercase font-black text-slate-400 tracking-widest px-2">Full Name</label>
                  <input type="text" placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white dark:bg-zinc-800 border border-slate-200/80 dark:border-white/10 rounded-xl py-2 px-3 outline-none font-bold text-[11px] text-slate-900 dark:text-white" />
                </div>
                <div className="space-y-0.5">
                  <label className="text-[8px] uppercase font-black text-slate-400 tracking-widest px-2">Email Address</label>
                  <input type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-white dark:bg-zinc-800 border border-slate-200/80 dark:border-white/10 rounded-xl py-2 px-3 outline-none font-bold text-[11px] text-slate-900 dark:text-white" />
                </div>
                <div className="space-y-0.5">
                  <label className="text-[8px] uppercase font-black text-slate-400 tracking-widest px-2">WhatsApp / Phone</label>
                  <input type="tel" placeholder="+94 7X XXX XXXX" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-white dark:bg-zinc-800 border border-slate-200/80 dark:border-white/10 rounded-xl py-2 px-3 outline-none font-bold text-[11px] text-slate-900 dark:text-white" />
                </div>
                <div className="space-y-0.5">
                  <label className="text-[8px] uppercase font-black text-slate-400 tracking-widest px-2">Payment Method</label>
                  <div className="flex bg-slate-100 dark:bg-zinc-800/60 p-0.5 rounded-xl border border-slate-200/80 dark:border-white/10 gap-0.5 h-[34px] items-center animate-fade-in">
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                      className={`flex-1 h-full rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1 ${formData.paymentMethod === 'card' ? 'bg-[#FACC15] text-black shadow-md font-bold' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                      <CreditCard size={10} /> Card
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'cash' })}
                      className={`flex-1 h-full rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1 ${formData.paymentMethod === 'cash' ? 'bg-[#FACC15] text-black shadow-md font-bold' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                      <Car size={10} /> Cash
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Stepper buttons (Back & Complete Booking) */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button 
                type="button"
                onClick={() => setStep(1)} 
                className="py-3.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-700 dark:text-white rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-1"
              >
                <ChevronLeft size={12} strokeWidth={3} /> BACK
              </button>
              <button 
                type="button"
                onClick={handleBooking} 
                disabled={isBooking}
                className="col-span-2 py-3.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                {isBooking ? <Loader2 className="animate-spin" size={12} /> : <><Send size={10} /> COMPLETE BOOKING</>}
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-center gap-1.5 mt-4 opacity-30">
        <Sparkles size={8} className="text-emerald-600 dark:text-[#FACC15]" />
        <span className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-400">Sri Lanka Premium Tour Engine</span>
      </div>

    </div>
  );
};

export default CustomTourBooking;
