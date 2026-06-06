'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Navigation, ChevronRight, Plane, Car, Minus, Plus, Send, CheckCircle2, User, Mail, Phone, Loader2, AlertCircle, Info, Sparkles, CreditCard } from 'lucide-react';
import { TAXI_TOUR_PACKAGES, findMatchingDestination, hasPricingData, calculatePaymentFees } from '../lib/pricing-util';
import { useCurrency } from '../context/CurrencyContext';
import TripMap from './TripMap';
import { loadGoogleMapsScript } from '@/lib/google-maps';

const VehicleCarousel = dynamic(() => import('./VehicleCarousel'), { ssr: false });

const displayVehicleName = (name) => (name || '').split('(')[0].trim();

const RoundTripBooking = () => {
  const { currency, rates, changeCurrency } = useCurrency();
  const currentSymbol = currency === 'LKR' ? 'Rs.' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'INR' ? '₹' : '$';
  const [tab, setTab] = useState('airport-round-tour');
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [step, setStep] = useState(1);
  const [locations, setLocations] = useState(['']);
  const [distance, setDistance] = useState(0);
  const [basePackage, setBasePackage] = useState({ hours: 2, km: 40 });
  const [pricingSettings, setPricingSettings] = useState(null);
  const [destinationsList, setDestinationsList] = useState([]);
  const [airportTours, setAirportTours] = useState([]);
  const [normalTours, setNormalTours] = useState([]);
  
  useEffect(() => {
    fetch('/api/destinations')
      .then(res => res.json())
      .then(data => {
        if (data.success) setDestinationsList(data.data || []);
      })
      .catch(err => console.error("Error fetching destinations:", err));

    fetch('/api/pricing?category=tours')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          const mapped = data.data.map(v => {
            let img = v.image || '/vehicles/placeholder.png';
            if (v.vehicleType === 'mini-car') img = '/vehicles/minicar.png';
            if (v.vehicleType === 'sedan') img = '/vehicles/sedancar.png';
            if (v.vehicleType === 'vezel') img = '/vehicles/van.png';
            if (v.vehicleType === 'van') img = '/vehicles/van.png';
            if (v.vehicleType === 'suv') img = '/vehicles/sedancar.png';

            return {
              id: v.vehicleType,
              vehicleType: v.vehicleType,
              name: v.name,
              baseRate: v.basePrice,
              perKm: v.perKmRate,
              image: img,
              capacity: v.capacity || 4,
              suitcases: v.luggage || 2,
              luggage: v.luggage || 2,
              handLuggage: v.handLuggage || 2
            };
          });
          setVehicles(mapped);
          setSelectedVehicle(mapped[0]);
        } else {
          const defaults = [
            { id: 'mini-car', vehicleType: 'mini-car', name: 'Mini', baseRate: 4000, perKm: 110, image: '/vehicles/minicar.png', capacity: 4, suitcases: 2, luggage: 2, handLuggage: 2 },
            { id: 'sedan', vehicleType: 'sedan', name: 'Sedan', baseRate: 8000, perKm: 130, image: '/vehicles/sedancar.png', capacity: 4, suitcases: 3, luggage: 3, handLuggage: 2 },
            { id: 'vezel', vehicleType: 'vezel', name: 'Vezel', baseRate: 12000, perKm: 160, image: '/vehicles/van.png', capacity: 4, suitcases: 4, luggage: 4, handLuggage: 2 },
            { id: 'kdh-flatroof', vehicleType: 'kdh-flatroof', name: 'Van', baseRate: 15000, perKm: 180, image: '/vehicles/van.png', capacity: 7, suitcases: 5, luggage: 5, handLuggage: 4 },
            { id: 'suv', vehicleType: 'suv', name: 'SUV', baseRate: 20000, perKm: 220, image: '/vehicles/sedancar.png', capacity: 6, suitcases: 4, luggage: 4, handLuggage: 3 },
          ];
          setVehicles(defaults);
          setSelectedVehicle(defaults[0]);
        }
      })
      .catch(err => console.error("Error fetching vehicles:", err));

    fetch('/api/admin/pricing-settings')
      .then(res => res.json())
      .then(data => {
        if (data.success) setPricingSettings(data.data);
      })
      .catch(err => console.error("Error fetching pricing settings:", err));

    Promise.all([
      fetch('/api/admin/airport-tours').then(res => res.json()),
      fetch('/api/admin/heavy-airport-tours').then(res => res.json())
    ])
      .then(([normal, heavy]) => {
        let combined = [];
        if (normal.success) combined = [...combined, ...normal.data];
        if (heavy.success) combined = [...combined, ...heavy.data];
        setAirportTours(combined);
      })
      .catch(err => console.error("Error fetching airport tours:", err));

    Promise.all([
      fetch('/api/admin/normal-tours').then(res => res.json()),
      fetch('/api/admin/heavy-normal-tours').then(res => res.json())
    ])
      .then(([normal, heavy]) => {
        let combined = [];
        if (normal.success) combined = [...combined, ...normal.data];
        if (heavy.success) combined = [...combined, ...heavy.data];
        setNormalTours(combined);
      })
      .catch(err => console.error("Error fetching normal tours:", err));
  }, []);
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    passengers: 1,
    luggage: 0,
    name: '',
    email: '',
    phone: '',
    notes: '',
    placesList: [''],
    taxiTourHours: 2,
    taxiTourKm: 40,
    paymentMethod: 'card'
  });

  const syncWithCalculator = (targetTab, targetVehicle) => {
    const vehicleId = targetVehicle?.id || selectedVehicle?.id;
    const event = new CustomEvent('syncCustomTourBooking', {
      detail: {
        tab: targetTab,
        vehicleId: vehicleId,
        hours: formData.taxiTourHours,
        km: formData.taxiTourKm
      }
    });
    window.dispatchEvent(event);
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getActivePackages = () => {
    let pkgs = [];
    if (tab === 'airport-round-tour') {
      pkgs = airportTours || [];
    } else if (tab === 'normal-round-tour') {
      pkgs = normalTours || [];
    } else if (tab === 'destination-based-tour') {
      const pickupOverride = findMatchingDestination(locations[0], destinationsList);
      const dropoffOverride = findMatchingDestination(locations[locations.length - 1], destinationsList);
      const destMatch = dropoffOverride || pickupOverride;
      if (destMatch && destMatch.roundTripPackages && destMatch.roundTripPackages.length > 0) {
        pkgs = destMatch.roundTripPackages;
      } else {
        pkgs = pricingSettings?.destinationRoundTripPackages || [];
      }
    }
    if (selectedVehicle) {
      pkgs = pkgs.filter(p => 
        p.vehicleType === selectedVehicle.id || 
        p.vehicleType === selectedVehicle.vehicleType || 
        (selectedVehicle.id === 'normal-kdh' && p.vehicleType === 'kdh-van')
      );
    }
    return pkgs;
  };

  const getAvailableHours = () => {
    const pkgs = getActivePackages();
    const hours = [...new Set(pkgs.map(p => p.hours))].sort((a, b) => a - b);
    return hours.length > 0 ? hours : [2, 4, 6, 8, 10, 12]; // Fallback
  };

  const getAvailableKmLimits = () => {
    const pkgs = getActivePackages();
    const match = pkgs.filter(p => p.hours === formData.taxiTourHours);
    if (match.length > 0) {
      const kms = [];
      match.forEach(p => {
        (p.tiers || []).forEach(t => {
          if (t.km && !kms.includes(t.km)) {
            kms.push(t.km);
          }
        });
      });
      return kms.sort((a, b) => a - b);
    }
    return [20, 30, 40, 50]; // Fallback
  };

  const handleRouteCalculated = (stats) => {
    setDistance(stats.distanceKm);
    
    if (stats.distanceKm <= 0) return;

    // We add 30% buffer to driving time for traffic/stops to get realistic required hours
    const reqHours = Math.ceil((stats.durationMin * 1.3) / 60);
    const reqKm = stats.distanceKm;

    const availableHours = getAvailableHours();
    if (availableHours.length === 0) return;

    // Baseline calculation relative to user selection
    let targetHours = Math.max(basePackage.hours, reqHours);
    const higherHours = availableHours.filter(h => h >= targetHours);
    targetHours = higherHours.length > 0 ? higherHours[0] : availableHours[availableHours.length - 1];

    const pkgs = getActivePackages();
    let match = [];
    if (selectedVehicle) {
      match = pkgs.filter(p => p.hours === targetHours && (p.vehicleType === selectedVehicle.id || p.vehicleType === selectedVehicle.vehicleType || (selectedVehicle.id === 'normal-kdh' && p.vehicleType === 'kdh-van')));
    }
    if (match.length === 0) {
      match = pkgs.filter(p => p.hours === targetHours);
    }
    
    let targetKm = basePackage.km;
    const minRequiredKm = Math.max(basePackage.km, reqKm);
    if (match.length > 0) {
      const kms = [];
      match.forEach(p => {
        (p.tiers || []).forEach(t => {
          if (t.km && !kms.includes(t.km)) kms.push(t.km);
        });
      });
      kms.sort((a, b) => a - b);
      
      const validKms = kms.filter(k => k >= minRequiredKm);
      targetKm = validKms.length > 0 ? validKms[0] : kms[kms.length - 1];
    } else {
      // Fallback
      const fallbacks = [20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200, 250, 300, 400, 500];
      const higher = fallbacks.filter(k => k >= minRequiredKm);
      targetKm = higher.length > 0 ? higher[0] : fallbacks[fallbacks.length - 1];
    }

    // Only update state if it actually needs an upgrade/downgrade relative to current form values
    if (targetHours !== formData.taxiTourHours || targetKm !== formData.taxiTourKm) {
       setFormData(prev => ({
          ...prev,
          taxiTourHours: targetHours,
          taxiTourKm: targetKm
       }));
    }
  };

  const calculateVehiclePrice = (v) => {
    if (!v) return 0;
    
    if (tab === 'airport-round-tour') {
      const pkg = (airportTours || []).find(p => p.hours === Number(formData.taxiTourHours) && (p.vehicleType === v.id || p.vehicleType === v.vehicleType || (v.id === 'normal-kdh' && p.vehicleType === 'kdh-van')));
      if (pkg) {
        const tier = (pkg.tiers || []).find(t => t.km === Number(formData.taxiTourKm));
        if (tier && tier.price) {
          let baseP = Math.round(tier.price);
                      // No extra distance cost for round trips
             
          
          return Math.round(baseP);
        }
      }
    }
    
    if (tab === 'normal-round-tour') {
      const pkg = (normalTours || []).find(p => p.hours === Number(formData.taxiTourHours) && (p.vehicleType === v.id || p.vehicleType === v.vehicleType || (v.id === 'normal-kdh' && p.vehicleType === 'kdh-van')));
      if (pkg) {
        const tier = (pkg.tiers || []).find(t => t.km === Number(formData.taxiTourKm));
        if (tier && tier.price) {
          let baseP = Math.round(tier.price);
                      // No extra distance cost for round trips
             baseP += (distance - formData.taxiTourKm) * (v.perKmRate || v.perKm || 100);
          }
          return Math.round(baseP);
        }
      }
    }

    if (tab === 'destination-based-tour') {
      const pickupOverride = findMatchingDestination(locations[0], destinationsList);
      const dropoffOverride = findMatchingDestination(locations[locations.length - 1], destinationsList);
      const destMatch = dropoffOverride || pickupOverride;
      
      // 1. Matched destination roundTripPackages
      if (destMatch && destMatch.roundTripPackages && destMatch.roundTripPackages.length > 0) {
        const pkg = destMatch.roundTripPackages.find(p => 
          p.hours === Number(formData.taxiTourHours) && 
          (p.vehicleType === v.id || p.vehicleType === v.vehicleType || (v.id === 'normal-kdh' && p.vehicleType === 'kdh-van'))
        );
        if (pkg) {
          const tier = (pkg.tiers || []).find(t => t.km === Number(formData.taxiTourKm));
          if (tier && tier.price) {
          let baseP = Math.round(tier.price);
          if (distance > formData.taxiTourKm) {
             baseP += (distance - formData.taxiTourKm) * (v.perKmRate || v.perKm || 100);
          }
          return Math.round(baseP);
        }
        }
      }

      // 2. Global destinationRoundTripPackages
      const pkg = (pricingSettings?.destinationRoundTripPackages || []).find(p => 
        p.hours === Number(formData.taxiTourHours) && 
        (p.vehicleType === v.id || p.vehicleType === v.vehicleType || (v.id === 'normal-kdh' && p.vehicleType === 'kdh-van'))
      );
      if (pkg) {
        const tier = (pkg.tiers || []).find(t => t.km === Number(formData.taxiTourKm));
        if (tier && tier.price) {
          let baseP = Math.round(tier.price);
          if (distance > formData.taxiTourKm) {
             baseP += (distance - formData.taxiTourKm) * (v.perKmRate || v.perKm || 100);
          }
          return Math.round(baseP);
        }
      }

      // 3. Flat rate override for the matched destination
      if (destMatch && hasPricingData(destMatch)) {
        let vPricing = {};
        if (destMatch.pricing) {
          if (typeof destMatch.pricing.get === 'function') vPricing = Object.fromEntries(destMatch.pricing);
          else vPricing = destMatch.pricing;
        }
        const vehicleSlug = v.vehicleType || v.id;
        const fixedPrice = vPricing[vehicleSlug] || vPricing[v.id] || 0;
        if (fixedPrice > 0) {
          return Number(fixedPrice);
        }
      }

      // Strictly no dynamic per-km fallback
      return v.baseRate || 0;
    }
    
    return v.baseRate || 0;
  };

  const updateDuration = (newHours) => {
    let pkgs = [];
    if (tab === 'airport-round-tour') {
      pkgs = airportTours || [];
    } else if (tab === 'normal-round-tour') {
      pkgs = normalTours || [];
    } else if (tab === 'destination-based-tour') {
      const pickupOverride = findMatchingDestination(locations[0], destinationsList);
      const dropoffOverride = findMatchingDestination(locations[locations.length - 1], destinationsList);
      const destMatch = dropoffOverride || pickupOverride;
      if (destMatch && destMatch.roundTripPackages && destMatch.roundTripPackages.length > 0) {
        pkgs = destMatch.roundTripPackages;
      } else {
        pkgs = pricingSettings?.destinationRoundTripPackages || [];
      }
    }
    if (selectedVehicle) {
      pkgs = pkgs.filter(p => 
        p.vehicleType === selectedVehicle.id || 
        p.vehicleType === selectedVehicle.vehicleType || 
        (selectedVehicle.id === 'normal-kdh' && p.vehicleType === 'kdh-van')
      );
    }
    const match = pkgs.find(p => p.hours === newHours);
    const tiers = match?.tiers || [];
    const newKm = tiers.length > 0 ? tiers[0].km : newHours * 20;
    setFormData(prev => ({ ...prev, taxiTourHours: newHours, taxiTourKm: newKm }));
  };

  useEffect(() => {
    const pkgs = getActivePackages();
    const hours = [...new Set(pkgs.map(p => p.hours))].sort((a, b) => a - b);
    if (hours.length > 0) {
      const defaultHours = hours.includes(formData.taxiTourHours) ? formData.taxiTourHours : hours[0];
      const pkg = pkgs.find(p => p.hours === defaultHours);
      const tiers = pkg?.tiers || [];
      const defaultKm = (tiers.some(t => t.km === formData.taxiTourKm)) ? formData.taxiTourKm : (tiers.length > 0 ? tiers[0].km : defaultHours * 20);
      setFormData(prev => ({
        ...prev,
        taxiTourHours: defaultHours,
        taxiTourKm: defaultKm
      }));
    }
  }, [pricingSettings, tab, locations, destinationsList, selectedVehicle, airportTours, normalTours]);

  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => setGoogleLoaded(true))
      .catch(err => console.error("Error loading Google Maps script:", err));
  }, []);

  const initAutocomplete = (node, index) => {
    if (!googleLoaded || !node || node.dataset.googleAutocomplete) return;
    const autocomplete = new window.google.maps.places.Autocomplete(node, { componentRestrictions: { country: "lk" }, fields: ["formatted_address"] });
    node.dataset.googleAutocomplete = 'true';
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.formatted_address) return;
      setLocations([place.formatted_address]);
    });
  };

  const handleLocationChange = (index, value) => { setLocations([value]); };

  const calculateTotal = () => {
    const baseLKR = calculateVehiclePrice(selectedVehicle);
    // Card surcharge applies for all bookings including round trips (3% LKR, 3.5% USD)
    const surcharge = calculatePaymentFees(baseLKR, formData.paymentMethod, 'LKR', selectedVehicle?.vehicleType || selectedVehicle?.id, false);
    return Math.round(baseLKR + surcharge);
  };

  // totalPriceLKR is always in LKR; convert for display
  const totalPriceLKR = calculateTotal();
  const convRate = rates?.[currency] || 1;
  const totalPrice = currency === 'LKR' ? totalPriceLKR : Number((totalPriceLKR * convRate).toFixed(2));

  const handleBooking = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time) {
      alert("Please fill in all required details.");
      return;
    }
    setIsBooking(true);
    try {
      const payload = {
        pickupLocation: { address: locations[0] || 'Pickup Location' },
        dropoffLocation: { address: locations[0] || 'Pickup Location' },
        waypoints: [],
        vehicleType: selectedVehicle.id,
        tripType: tab,
        type: 'tour',
        roundTripPackageId: `tour-${formData.taxiTourHours}h`,
        passengerCount: { adults: formData.passengers, children: 0, luggage: 0, handLuggage: 0 },
        distanceKm: distance,
        totalPrice: totalPriceLKR,
        paidAmount: formData.paymentMethod === 'cash' ? 0 : totalPriceLKR,
        balanceAmount: formData.paymentMethod === 'cash' ? totalPriceLKR : 0,
        displayPrice: totalPrice,
        displayPaidAmount: formData.paymentMethod === 'cash' ? 0 : totalPrice,
        displayBalanceAmount: formData.paymentMethod === 'cash' ? totalPrice : 0,
        currency: currency,
        scheduledDate: formData.date,
        scheduledTime: formData.time,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        whatsappNumber: formData.phone,
        guestPhone: formData.phone,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      };

      payload.tourDetails = {
        tourId: `${tab === 'destination-based-tour' ? 'dest' : tab === 'airport-round-tour' ? 'airport' : 'normal'}-tour-${formData.taxiTourHours}h-${formData.taxiTourKm}km`,
        tourTitle: `${tab === 'destination-based-tour' ? 'Destination' : tab === 'airport-round-tour' ? 'Airport' : 'Normal'} Round Tour (${formData.taxiTourHours}h / ${formData.taxiTourKm}km)`,
        duration: `${formData.taxiTourHours} Hours`
      };

      const res = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        try {
          const typeStr = tab === 'airport-round-tour' ? 'Airport Round Tour' : tab === 'normal-round-tour' ? 'Normal Round Tour' : 'Destination-Based Tour';
          const paymentStr = formData.paymentMethod === 'cash' ? 'Cash to Driver' : 'Pay Online (Card)';
          let message = `*New Booking Request*%0A` + 
                        `*Type:* ${typeStr}%0A` + 
                        `*Name:* ${formData.name}%0A` + 
                        `*WhatsApp:* ${formData.phone}%0A` + 
                        `*Vehicle:* ${selectedVehicle.name}%0A` +
                        `*Hours:* ${formData.taxiTourHours} Hours%0A` + 
                        `*KM Limit:* ${formData.taxiTourKm} KM%0A` + 
                        `*Stops:* ${formData.placesList.filter(Boolean).join(', ') || 'None'}%0A` +
                        `*Pickup/Dropoff:* ${locations[0] || 'Not provided'}%0A` + 
                        `*Date/Time:* ${formData.date} at ${formData.time}%0A` + 
                        `*Payment:* ${paymentStr}%0A` + 
                        `*Price:* ${currentSymbol} ${totalPrice.toLocaleString()}`;
          window.open(`https://wa.me/94712100500?text=${message}`, '_blank');
        } catch (e) {
          console.error("WhatsApp companion load blocked", e);
        }

        // Redirect to checkout or success URL
        window.location.href = data.paymentUrl;
      } else { 
        alert(data.message || "Booking failed"); 
      }
    } catch (e) { 
      alert("An error occurred"); 
    } finally { 
      setIsBooking(false); 
    }
  };

  const renderDurationSection = () => (
    <section className="animate-slide-up space-y-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3"><Clock className="text-emerald-600" size={18} /><h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Duration & Limit</h4></div>
        <div className="flex items-center gap-2 bg-emerald-100/50 px-3 py-1 rounded-full"><Sparkles size={12} className="text-emerald-600" /><span className="text-[9px] font-black text-emerald-700 uppercase tracking-tight">AI Estimated Limit</span></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="text-[9px] uppercase font-black text-slate-500 px-2 tracking-widest">Select Hours</label>
          <div className="flex items-center bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
            <button 
              onClick={() => {
                const avHours = getAvailableHours();
                const currentIndex = avHours.indexOf(formData.taxiTourHours);
                if (currentIndex > 0) {
                  updateDuration(avHours[currentIndex - 1]);
                }
              }} 
              className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600"
            >
              <Minus size={18} />
            </button>
            <div className="flex-1 text-center"><span className="text-xl font-black text-emerald-950">{formData.taxiTourHours}</span><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1.5">Hours</span></div>
            <button 
              onClick={() => {
                const avHours = getAvailableHours();
                const currentIndex = avHours.indexOf(formData.taxiTourHours);
                if (currentIndex < avHours.length - 1) {
                  updateDuration(avHours[currentIndex + 1]);
                } else if (currentIndex === -1 && avHours.length > 0) {
                  updateDuration(avHours[0]);
                }
              }} 
              className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <label className="text-[9px] uppercase font-black text-slate-500 px-2 tracking-widest">KM Limit</label>
          <div className="flex flex-col gap-3">
            <div className="bg-white border border-emerald-100 p-4 rounded-2xl shadow-sm flex items-center justify-between">
              <div className="flex flex-col"><span className="text-xl font-black text-emerald-600 leading-none">{formData.taxiTourKm} KM</span><span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Included</span></div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center"><Navigation size={18} /></div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {getAvailableKmLimits().map(km => (
                <button
                  key={km}
                  onClick={() => setFormData(prev => ({ ...prev, taxiTourKm: km }))}
                  className={`py-2 rounded-xl text-[10px] font-black transition-all border ${formData.taxiTourKm === km ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300'}`}
                >
                  {km}KM
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderLocationsSection = () => (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3"><MapPin className="text-emerald-600" size={18} /><h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Pickup Location</h4></div>
      </div>
      <div className="space-y-3">
        <div className="relative group">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"><MapPin size={16} /></div>
          <input type="text" value={locations[0]} ref={(el) => initAutocomplete(el, 0)} onChange={(e) => handleLocationChange(0, e.target.value)} placeholder="Pickup Location (Tour starts and ends here)" className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-5 pl-16 pr-8 outline-none font-bold text-slate-900 focus:bg-white transition-all shadow-sm" />
        </div>
      </div>
    </section>
  );

  if (isBooked) {
    return (
      <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-2xl border border-emerald-50 max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={40} /></div>
        <h3 className="text-3xl font-serif font-black text-emerald-950 mb-4 uppercase tracking-tighter">Confirmed!</h3>
        <p className="text-slate-500 mb-8">Your request has been received. Our team will contact you shortly.</p>
        <button onClick={() => setIsBooked(false)} className="px-10 py-4 bg-emerald-600 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg">Make Another Booking</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-white/5 relative">
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.06] dark:opacity-[0.02] pointer-events-none z-0"></div>
      <div className="relative z-10 flex bg-slate-900 p-2 border-b border-slate-800 overflow-x-auto gap-2 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <button onClick={() => { setTab('airport-round-tour'); syncWithCalculator('airport-round-tour', selectedVehicle); }} className={`flex-1 flex items-center justify-center gap-2 py-4 px-3 whitespace-nowrap rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.1em] ${tab === 'airport-round-tour' ? 'bg-[#FACC15] text-black shadow-sm' : 'text-slate-400'}`}><Plane size={16} /> Airport Round Tour</button>
        <button onClick={() => { setTab('normal-round-tour'); syncWithCalculator('normal-round-tour', selectedVehicle); }} className={`flex-1 flex items-center justify-center gap-2 py-4 px-3 whitespace-nowrap rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.1em] ${tab === 'normal-round-tour' ? 'bg-[#FACC15] text-black shadow-sm' : 'text-slate-400'}`}><Sparkles size={16} /> Normal Round Tour</button>
        <button onClick={() => { setTab('destination-based-tour'); syncWithCalculator('destination-based-tour', selectedVehicle); }} className={`flex-1 flex items-center justify-center gap-2 py-4 px-3 whitespace-nowrap rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.1em] ${tab === 'destination-based-tour' ? 'bg-[#FACC15] text-black shadow-sm' : 'text-slate-400'}`}><MapPin size={16} /> Destination-Based Tour</button>
      </div>

      <div className="relative z-10 p-8 md:p-12 space-y-12">
        {step === 1 ? (
          <>
            {tab === 'airport-round-tour' ? (
              <>
                {renderDurationSection()}
                {renderLocationsSection()}
              </>
            ) : (
              <>
                {renderLocationsSection()}
                {renderDurationSection()}
              </>
            )}

            <section className="space-y-4 mb-8">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <Car className="text-emerald-600" size={18} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Vehicle</h4>
                </div>
              </div>
              <VehicleCarousel
                vehicles={vehicles.map(v => ({
                  ...v,
                  calculatedTotal: calculateVehiclePrice(v)
                }))}
                selectedId={selectedVehicle?.vehicleType || selectedVehicle?.id}
                onSelect={(vType) => {
                  const found = vehicles.find(v => v.vehicleType === vType || v.id === vType);
                  if (found) {
                    setSelectedVehicle(found);
                    syncWithCalculator(tab, found);
                  }
                }}
                passengerCount={{ adults: formData.passengers, children: 0, luggage: 0 }}
                currency={currency}
                rates={rates}
              />
            </section>
            
            <div className="pt-2">
              <button onClick={() => {
                if (!locations[0]) {
                  alert("Please enter a pickup location.");
                  return;
                }
                setBasePackage({ hours: formData.taxiTourHours, km: formData.taxiTourKm });
                setStep(2);
              }} className="w-full py-5 bg-emerald-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-3">Next Step <ChevronRight size={16} /></button>
            </div>
          </>
        ) : (
          <>
            <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 flex items-center gap-2 mb-4">
              <ChevronRight size={14} className="rotate-180" /> Back to Package Selection
            </button>
            
            <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Package Summary</p>
                <p className="text-lg font-black text-emerald-950">{selectedVehicle?.name} — {formData.taxiTourHours} Hours — {formData.taxiTourKm} KM limit</p>
                {formData.paymentMethod === 'card' && (
                  <p className="text-[9px] font-bold text-amber-600 mt-1">
                    Incl. {currency === 'USD' ? '3.5%' : '3%'} card processing fee
                  </p>
                )}
              </div>
              <div className="md:text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Fare</p>
                <p className="text-2xl font-black text-emerald-600 tracking-tighter">{currentSymbol} {totalPrice.toLocaleString()}{currency === 'LKR' ? '.00' : ''}</p>
              </div>
            </div>

            
            {/* Block 2: Isolated Route Planning */}
            <section className="bg-slate-50 dark:bg-zinc-800/20 rounded-3xl border border-slate-100 dark:border-white/5 p-4 space-y-4">
              <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-white/5 pb-2">
                <Navigation className="text-emerald-600 dark:text-[#FACC15]" size={14} />
                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Round-Trip Route</h4>
              </div>

              <div className="space-y-4">
                {/* Start Location (Pickup) */}
                <div className="relative group flex flex-col gap-1 bg-white dark:bg-zinc-800 p-3 rounded-2xl border border-slate-200/60 dark:border-white/10">
                  <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Pickup Location</label>
                  <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600">
                      <MapPin size={14} />
                    </div>
                    <input 
                      type="text" 
                      value={locations[0] || ''} 
                      ref={(el) => initAutocomplete(el, 0)} 
                      onChange={(e) => handleLocationChange(0, e.target.value)} 
                      placeholder="Enter Pickup Location" 
                      className="w-full bg-slate-50/50 dark:bg-zinc-900 border border-slate-200/30 dark:border-white/5 rounded-xl py-2.5 pl-9 pr-4 outline-none font-bold text-[11px] text-slate-900 dark:text-white focus:border-[#FACC15] focus:ring-2 focus:ring-[#FACC15]/20 transition-all shadow-sm" 
                    />
                  </div>
                </div>

                {/* Add Places Matrix */}
                <div className="pl-4 border-l-2 border-dashed border-slate-200 dark:border-slate-700 ml-4 py-2 space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest block">Itinerary Stops</label>
                      <button 
                        type="button"
                        onClick={() => {
                          if (formData.placesList.length < 10) {
                            setFormData(prev => ({ ...prev, placesList: [...prev.placesList, ''] }))
                          }
                        }}
                        className="text-[9px] font-bold text-emerald-600 dark:text-[#FACC15] uppercase hover:underline flex items-center gap-1"
                      >
                        <Plus size={10} strokeWidth={3} /> Add Stop
                      </button>
                    </div>
                    {formData.placesList.map((place, idx) => (
                      <div key={idx} className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Sparkles size={12} /></div>
                        <input 
                          type="text"
                          value={place}
                          onChange={e => {
                            const newList = [...formData.placesList];
                            newList[idx] = e.target.value;
                            setFormData({ ...formData, placesList: newList });
                          }}
                          placeholder={`Stop ${idx + 1} (e.g. Sigiriya Rock)`}
                          className="w-full bg-white dark:bg-zinc-800 border border-slate-200/80 dark:border-white/10 rounded-xl py-2.5 pl-9 pr-8 outline-none font-bold text-[11px] text-slate-800 dark:text-white focus:border-[#FACC15] transition-all shadow-sm"
                        />
                        {formData.placesList.length > 1 && (
                          <button 
                            type="button"
                            onClick={() => {
                              const newList = formData.placesList.filter((_, i) => i !== idx);
                              setFormData({ ...formData, placesList: newList });
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                          >
                            <Minus size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* End Location */}
                <div className="flex items-center gap-3 bg-white dark:bg-zinc-800 p-3 rounded-2xl border border-slate-200/60 dark:border-white/10 opacity-80 cursor-not-allowed">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                    <MapPin size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">End Location (Return)</p>
                    <p className="text-xs font-black text-slate-800 dark:text-white truncate">{locations[0] || 'Bandaranaike International Airport (CMB)'}</p>
                  </div>
                </div>
              </div>
              {/* Dynamic Route Validation Overlay */}
              {distance > formData.taxiTourKm && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 p-3 sm:p-4 rounded-xl flex items-start gap-3 mt-4 animate-pulse shadow-sm">
                  <AlertCircle className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" size={18} />
                  <div>
                    <h5 className="text-[10px] sm:text-xs font-black text-red-700 dark:text-red-400 uppercase tracking-widest mb-1">⚠️ Package Limit Exceeded</h5>
                    <p className="text-[9px] sm:text-[10px] font-bold text-red-600/90 dark:text-red-300/90 leading-relaxed">
                      The requested route itinerary extends past your selected {formData.taxiTourKm} KM allowance. Please click 'Back' to adjust your vehicle selection or upgrade your hour package tier to prevent automatic overage fees.
                    </p>
                  </div>
                </div>
              )}

                {/* Trip Map Component */}
                <div className="w-full h-48 rounded-2xl overflow-hidden border border-slate-200/60 dark:border-white/10 mt-4 relative z-0">
                  <TripMap 
                    pickup={{ name: locations[0] || 'Bandaranaike International Airport' }} 
                    dropoff={{ name: locations[0] || 'Bandaranaike International Airport' }} 
                    waypoints={formData.placesList.filter(p => p.trim() !== '').map(p => ({ name: p }))} 
                    onRouteCalculated={handleRouteCalculated}
                  />
                </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5"><User className="text-emerald-600" size={18} /><h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Contact Details</h4></div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/5 text-emerald-600 border border-emerald-500/10" onClick={() => alert("Optimizing...")}><Sparkles size={14} /> <span className="text-[9px] font-black uppercase tracking-widest">AI Optimizer</span></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1.5"><label className="text-[8px] uppercase font-black text-slate-400 px-2 tracking-widest">Pickup Date</label><input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 outline-none font-bold text-slate-900 focus:bg-white text-sm" /></div>
                <div className="space-y-1.5"><label className="text-[8px] uppercase font-black text-slate-400 px-2 tracking-widest">Pickup Time</label><input type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 outline-none font-bold text-slate-900 focus:bg-white text-sm" /></div>
                <div className="space-y-1.5"><label className="text-[8px] uppercase font-black text-slate-400 px-2 tracking-widest">Full Name</label><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 outline-none font-bold text-slate-900 focus:bg-white text-sm" /></div>
                <div className="space-y-1.5"><label className="text-[8px] uppercase font-black text-slate-400 px-2 tracking-widest">Email</label><input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 outline-none font-bold text-slate-900 focus:bg-white text-sm" /></div>
                <div className="space-y-1.5">
                  <label className="text-[8px] uppercase font-black text-slate-400 px-2 tracking-widest">WhatsApp</label>
                  <div className="flex bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden focus-within:bg-white transition-all shadow-sm">
                    <div className="bg-slate-200/50 px-4 flex items-center justify-center border-r border-slate-100">
                      <span className="text-sm font-bold text-slate-600">+94</span>
                    </div>
                    <input 
                      type="tel" 
                      placeholder="7X XXX XXXX" 
                      value={formData.phone.replace('+94', '').replace(/^0+/, '')} 
                      onChange={e => setFormData({ ...formData, phone: '+94' + e.target.value.replace(/[^0-9]/g, '').slice(0, 9) })} 
                      className="w-full bg-transparent py-3 px-4 outline-none font-bold text-slate-900 text-sm" 
                    />
                  </div>
                </div>
                <div className="space-y-1.5"><label className="text-[8px] uppercase font-black text-slate-400 px-2 tracking-widest">Passengers</label><div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl p-1"><button onClick={() => setFormData({ ...formData, passengers: Math.max(1, formData.passengers - 1) })} className="w-10 h-10 flex items-center justify-center text-slate-400"><Minus size={16} /></button><div className="flex-1 text-center font-black text-emerald-950 text-[10px]">{formData.passengers}</div><button onClick={() => setFormData({ ...formData, passengers: Math.min(8, formData.passengers + 1) })} className="w-10 h-10 flex items-center justify-center text-slate-400"><Plus size={16} /></button></div></div>
                <div className="space-y-1.5">
                  <label className="text-[8px] uppercase font-black text-slate-400 px-2 tracking-widest">Payment Method</label>
                  <div className="flex bg-slate-50 border border-slate-100 rounded-2xl p-1 h-12 items-center gap-1">
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                      className={`flex-1 h-full rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${formData.paymentMethod === 'card' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-emerald-600'}`}
                    >
                      <CreditCard size={14} /> Card
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'cash' })}
                      className={`flex-1 h-full rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${formData.paymentMethod === 'cash' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-emerald-600'}`}
                    >
                      <Car size={14} /> Cash
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <div className="pt-2">
              <button onClick={handleBooking} disabled={isBooking} className="w-full py-5 bg-emerald-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-3 disabled:opacity-50">{isBooking ? <Loader2 className="animate-spin" size={16} /> : 'Complete Booking'} <ChevronRight size={16} /></button>
              <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3"><div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><Info size={12} /></div><div><p className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-0.5">Hire Charge Only</p><p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Covers vehicle hire and fuel. Parking & tolls extra.</p></div></div>
            </div>
          </>
        )}
        <div className="flex items-center justify-center gap-2 mt-8 opacity-40">
           <Sparkles size={10} className="text-emerald-600" />
           <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">Powered by Gemini 1.5 Pro</span>
        </div>
      </div>
    </div>
  );
};

export default RoundTripBooking;
