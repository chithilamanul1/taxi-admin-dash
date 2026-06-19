'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { Tag, X, MapPin, Clock, Navigation, ChevronRight, ChevronLeft, Plane, Car, Minus, Plus, Send, CheckCircle2, User, Mail, Phone, Loader2, AlertCircle, Info, Sparkles, CreditCard, ChevronDown, Briefcase } from 'lucide-react';
import { calculateBasePrice, calculateTrafficSurge, TAXI_TOUR_PACKAGES } from '@/lib/pricing-util';
const SmartOfferNudge = dynamic(() => import('./SmartOfferNudge'), { ssr: false });
import { loadGoogleMapsScript } from '@/lib/google-maps';
import TripMap from './TripMap';
import { useSession } from 'next-auth/react';
import { useCurrency } from '@/context/CurrencyContext';

const getVehicleTransform = (imagePath, isSelected, isHovered = false, h_target = 0.58, b_target = 0.12) => {
    const baseFilename = (imagePath || '').split('/').pop().split('?')[0].toLowerCase().replace(/\.(png|jpg|webp)$/, '');
    
    // Bounding box data for transparency correction
    const imgData = {
        'coach-bus': { h_orig: 0.7772, c_prime_orig: 1 - 183.5/359 },
        'costerbus': { h_orig: 0.6373, c_prime_orig: 1 - 216.5/408 },
        'hondavezel': { h_orig: 0.6889, c_prime_orig: 1 - 216.0/360 },
        'suv': { h_orig: 0.6889, c_prime_orig: 0.43 },
        'minicar': { h_orig: 0.5220, c_prime_orig: 1 - 251.0/500 },
        'minivan5seat': { h_orig: 0.4642, c_prime_orig: 1 - 227.5/433 },
        'sedan': { h_orig: 0.3040, c_prime_orig: 0.4934 },
        'sedan2': { h_orig: 0.4300, c_prime_orig: 0.4801 },
        'sedancar': { h_orig: 0.4668, c_prime_orig: 0.5310 },
        'sedancar2': { h_orig: 0.4300, c_prime_orig: 0.4801 },
        'susukievery': { h_orig: 0.5543, c_prime_orig: 1 - 228.5/433 },
        'toyota-highroof': { h_orig: 0.65, c_prime_orig: 1 - 227.5/433 },
        'van': { h_orig: 0.5497, c_prime_orig: 1 - 227.5/433 },
    }[baseFilename] || { h_orig: 0.55, c_prime_orig: 0.5 }; // Default fallback

    // Base scale to make bbox height exactly h_target
    let scale = h_target / imgData.h_orig;

    if (isSelected) {
        scale *= 1.15; // Selected zoom
    } else if (isHovered) {
        scale *= 1.08; // Hover zoom
    }

    // Centering and baseline calculations
    const c_prime_scaled = 0.5 + scale * (imgData.c_prime_orig - 0.5);
    const b_scaled = c_prime_scaled - (scale * imgData.h_orig) / 2;
    const shift_up = b_target - b_scaled;
    const translateY = -shift_up * 100;

    return { scale, translateY };
};

const CustomTourBooking = () => {
  const { data: session } = useSession();
  const { currency, changeCurrency, SUPPORTED_CURRENCIES, convertPrice } = useCurrency();
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [tab, setTab] = useState('airport'); // 'airport' | 'tour'
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [locations, setLocations] = useState(['', '']);
  const [distance, setDistance] = useState(0);
  const [basePackage, setBasePackage] = useState({ hours: 2, km: 40 });
  const [appliedOffers, setAppliedOffers] = useState([]);
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  // Auto-swap vehicle if capacity exceeded
  useEffect(() => {
    if (!selectedVehicle || vehicles.length === 0) return;
    
    const pax = formData.passengers || 1;
    const lug = formData.luggage || 0;
    
    const vehiclePax = selectedVehicle.capacity || 4;
    const vehicleLug = selectedVehicle.suitcases || selectedVehicle.luggage || 4;

    if (pax > vehiclePax || lug > vehicleLug) {
      const suitable = vehicles.filter(v => {
         const vPax = v.capacity || 4;
         const vLug = v.suitcases || v.luggage || 4;
         return pax <= vPax && lug <= vLug;
      });
      if (suitable.length > 0) {
        suitable.sort((a,b) => (a.baseRate || a.totalPrice) - (b.baseRate || b.totalPrice));
        if (suitable[0].id !== selectedVehicle.id) {
          setSelectedVehicle(suitable[0]);
        }
      }
    }
  }, [formData.passengers, formData.luggage, selectedVehicle, vehicles]);
  const [dismissedOfferIds, setDismissedOfferIds] = useState([]);
  const [duration, setDuration] = useState('');
  const [pricingSettings, setPricingSettings] = useState(null);
  const [airportTours, setAirportTours] = useState([]);
  const [roundTours, setRoundTours] = useState([]);
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
    placesList: [''],
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
            if (v.vehicleType?.toLowerCase() === 'sedan' || v.name?.toLowerCase().includes('sedan')) {
              img = '/vehicles/sedancar.png';
            }
            if (v.vehicleType?.toLowerCase() === 'suv' || v.name?.toLowerCase().includes('suv')) {
              img = '/vehicles/suv.png';
            }
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
            { id: 'mini-car', name: 'MINI CAR', baseRate: 5000, perKm: 100, image: '/vehicles/minicar.png', capacity: 2, suitcases: 4 },
            { id: 'sedan', name: 'SEDAN', baseRate: 6500, perKm: 130, image: '/vehicles/sedancar.png', capacity: 4, suitcases: 3 },
            { id: 'vezel', name: 'HONDA VEZEL', baseRate: 8000, perKm: 135, image: '/vehicles/Hondavezel.png', capacity: 4, suitcases: 3 },
            { id: 'mini-van-every', name: 'MINI VAN (EVERY)', baseRate: 7000, perKm: 110, image: '/vehicles/susukievery.png', capacity: 4, suitcases: 4 },
            { id: 'mini-van-05', name: 'MINI VAN (5 SEATER)', baseRate: 7500, perKm: 130, image: '/vehicles/minivan5seat.png', capacity: 5, suitcases: 5 },
            { id: 'suv', name: 'SUV (LUXURY)', baseRate: 9000, perKm: 160, image: '/vehicles/suv.png', capacity: 4, suitcases: 4 },
            { id: 'kdh-van', name: 'VAN', baseRate: 10000, perKm: 180, image: '/vehicles/toyota-highroof.png', capacity: 9, suitcases: 8 },
            { id: 'mini-bus', name: 'KDH HIGH ROOF', baseRate: 15000, perKm: 250, image: '/vehicles/toyota-highroof.png', capacity: 20, suitcases: 15 },
            { id: 'coach-bus', name: 'LUXURY COACH', baseRate: 25000, perKm: 450, image: '/vehicles/coach-bus.png', capacity: 45, suitcases: 50 }
          ];
          setVehicles(defaults);
          setSelectedVehicle(defaults[0]);
        }
      })
      .catch(err => {
        console.error("Error fetching vehicles:", err);
        const defaults = [
          { id: 'mini-car', name: 'MINI CAR', baseRate: 5000, perKm: 100, image: '/vehicles/minicar.png', capacity: 2, suitcases: 4 },
          { id: 'sedan', name: 'SEDAN', baseRate: 6500, perKm: 130, image: '/vehicles/sedancar.png', capacity: 4, suitcases: 3 },
          { id: 'vezel', name: 'HONDA VEZEL', baseRate: 8000, perKm: 135, image: '/vehicles/Hondavezel.png', capacity: 4, suitcases: 3 },
          { id: 'mini-van-every', name: 'MINI VAN (EVERY)', baseRate: 7000, perKm: 110, image: '/vehicles/susukievery.png', capacity: 4, suitcases: 4 },
          { id: 'mini-van-05', name: 'MINI VAN (5 SEATER)', baseRate: 7500, perKm: 130, image: '/vehicles/minivan5seat.png', capacity: 5, suitcases: 5 },
          { id: 'suv', name: 'SUV (LUXURY)', baseRate: 9000, perKm: 160, image: '/vehicles/suv.png', capacity: 4, suitcases: 4 },
          { id: 'kdh-van', name: 'VAN', baseRate: 10000, perKm: 180, image: '/vehicles/toyota-highroof.png', capacity: 9, suitcases: 8 },
          { id: 'mini-bus', name: 'KDH HIGH ROOF', baseRate: 15000, perKm: 250, image: '/vehicles/toyota-highroof.png', capacity: 20, suitcases: 15 },
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

    Promise.all([
      fetch('/api/admin/airport-tours').then(res => res.json()),
      fetch('/api/admin/heavy-airport-tours').then(res => res.json())
    ])
      .then(([normal, heavy]) => {
        let combined = [];
        if (normal.success && normal.data) combined = [...combined, ...normal.data];
        if (heavy.success && heavy.data) combined = [...combined, ...heavy.data];
        setAirportTours(combined);
      })
      .catch(err => console.error("Error fetching airport tours:", err));

    Promise.all([
      fetch('/api/admin/normal-tours').then(res => res.json()),
      fetch('/api/admin/heavy-normal-tours').then(res => res.json())
    ])
      .then(([normal, heavy]) => {
        let combined = [];
        if (normal.success && normal.data) combined = [...combined, ...normal.data];
        if (heavy.success && heavy.data) combined = [...combined, ...heavy.data];
        setRoundTours(combined);
      })
      .catch(err => console.error("Error fetching round tours:", err));

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

  const getMatchingDestination = () => {
    if (!locations[0] || destinations.length === 0) return null;
    const searchLower = locations[0].toLowerCase();
    // Sort destinations by length descending so "Sigiriya Rock" matches before "Sigiriya" if both exist
    const sortedDests = [...destinations].sort((a, b) => b.name.length - a.name.length);
    return sortedDests.find(d => d.name && searchLower.includes(d.name.toLowerCase()));
  };

  const getActivePackages = () => {
    const destOverride = getMatchingDestination();
    if (destOverride && destOverride.roundTripPackages && destOverride.roundTripPackages.length > 0) {
      return destOverride.roundTripPackages;
    }
    return tab === 'airport'
      ? (airportTours || [])
      : (roundTours || []);
  };

  const getAvailableHours = () => {
    let pkgs = getActivePackages();
    if (selectedVehicle) {
      pkgs = pkgs.filter(p => 
        p.vehicleType === selectedVehicle.id || 
        p.vehicleType === selectedVehicle.vehicleType || 
        (selectedVehicle.id === 'normal-kdh' && p.vehicleType === 'kdh-van')
      );
    }
    const hours = [...new Set(pkgs.map(p => p.hours))].sort((a, b) => a - b);
    return hours.length > 0 ? hours : [2, 4, 6, 8, 10, 12]; // Fallback
  };

  const getAvailableKmLimits = () => {
    let pkgs = getActivePackages();
    if (selectedVehicle) {
      pkgs = pkgs.filter(p => 
        p.vehicleType === selectedVehicle.id || 
        p.vehicleType === selectedVehicle.vehicleType || 
        (selectedVehicle.id === 'normal-kdh' && p.vehicleType === 'kdh-van')
      );
    }
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
      if (kms.length > 0) return kms.sort((a, b) => a - b);
    }
    return [20, 30, 40, 50, 100, 150, 200]; // Fallback
  };

  // Update hours and dynamic KM limit defaults
  const updateDuration = (newHours) => {
    let pkgs = getActivePackages();
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
    let pkgs = getActivePackages();
    if (selectedVehicle) {
      pkgs = pkgs.filter(p => 
        p.vehicleType === selectedVehicle.id || 
        p.vehicleType === selectedVehicle.vehicleType || 
        (selectedVehicle.id === 'normal-kdh' && p.vehicleType === 'kdh-van')
      );
    }
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
  }, [pricingSettings, tab, selectedVehicle, airportTours, roundTours]);

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

  // Route calculation is intentionally bypassed for Round Tours (fixed km/hr limits)

  const handleAddLocation = () => { if (locations.length < 4) setLocations([...locations, '']); };
  const handleRemoveLocation = (index) => {
    if (locations.length > 2) {
      const newLocs = [...locations];
      newLocs.splice(index, 1);
      setLocations(newLocs);
    }
  };
  const handleLocationChange = (index, value) => { const newLocs = [...locations]; newLocs[index] = value; setLocations(newLocs); };

  // Auto-adjust package based on actual route requirements
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
      match = pkgs.filter(p => p.hours === targetHours && p.vehicleType === selectedVehicle.id);
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

  // Calculate pricing based on selected vehicle & hours & KM limit
  const calculateTotalForVehicle = (veh) => {
    if (!veh) return 0;
    
    let basePrice = 0;
    const pkgs = getActivePackages();
      
    const pkg = pkgs.find(p => p.hours === Number(formData.taxiTourHours) && (p.vehicleType === veh.id || (veh.id === 'normal-kdh' && p.vehicleType === 'kdh-van')));
    if (pkg) {
      const tier = (pkg.tiers || []).find(t => t.km === Number(formData.taxiTourKm));
      if (tier && tier.price) {
        basePrice = Math.round(tier.price);
      }
    }
    
    if (!basePrice) {
      // Fallback calculation using taxiTourKm
      const tourPkg = TAXI_TOUR_PACKAGES.find(p => p.hours === Number(formData.taxiTourHours));
      let fallbackBasePrice = tourPkg ? tourPkg.price : (formData.taxiTourHours * 2500);
      
      // Calculate extra KM if the selected km limit is higher than the standard package distance
      const defaultDist = tourPkg ? tourPkg.distance : (formData.taxiTourHours * 20);
      if (formData.taxiTourKm > defaultDist) {
        fallbackBasePrice += (formData.taxiTourKm - defaultDist) * (veh.perKmRate || veh.perKm || 100);
      } else if (formData.taxiTourKm < defaultDist) {
        fallbackBasePrice -= (defaultDist - formData.taxiTourKm) * ((veh.perKmRate || veh.perKm || 100) * 0.5);
      }

      if (veh.id === 'sedan') fallbackBasePrice *= 1.2;
      if (veh.id === 'vezel' || veh.id === 'suv') fallbackBasePrice *= 1.4;
      if (veh.id === 'mini-van-every' || veh.id === 'mini-van-05') fallbackBasePrice *= 1.3;
      if (veh.id === 'van' || veh.id === 'kdh-van' || veh.id === 'normal-kdh' || veh.id === 'kdh-flatroof') fallbackBasePrice *= 1.7;
      if (veh.id === 'mini-bus' || veh.id === 'minibus' || veh.name.includes('MINI BUS')) fallbackBasePrice *= 2.5;
      if (veh.id === 'coach-bus') fallbackBasePrice *= 4.5;
      
      basePrice = Math.round(fallbackBasePrice);
    }

    // Handle extra KMs if route exceeds selections
    let total = basePrice;
    if (distance > formData.taxiTourKm) {
      total += (distance - formData.taxiTourKm) * (veh.perKmRate || veh.perKm || 100);
    }
    return Math.round(total);
  };

  const baseTotal = calculateTotalForVehicle(selectedVehicle);
  const totalDiscount = appliedOffers.reduce((max, offer) => {
      const val = (offer.discountAmount || (baseTotal * (offer.discountPercentage / 100)));
      return Math.max(max, val);
  }, 0);
  const totalPrice = Math.max(0, baseTotal - totalDiscount);


  const handleBooking = async () => {
    const errors = {};
    if (!formData.name) errors.name = true;
    if (!formData.phone) errors.phone = true;
    if (!formData.email) errors.email = true;
    if (!formData.date) errors.date = true;
    if (!formData.time) errors.time = true;

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setTimeout(() => {
        const firstError = Object.keys(errors)[0];
        const element = document.querySelector(`[name="${firstError}"]`) || document.getElementById(`field-${firstError}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
        } else {
            const errorInput = document.querySelector('.border-red-500');
            if (errorInput) {
                errorInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                errorInput.focus();
            }
        }
      }, 50);
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
          dropoffLocation: { address: locations[0] || 'Same as Pickup' },
          waypoints: formData.placesList.filter(Boolean).map(p => ({ address: p })),
          vehicleType: selectedVehicle.id,
          tripType: 'round-trip',
          type: 'tour',
          isRoundTrip: true,
          tourDetails: {
            tourTitle: "Custom Round Tour",
            duration: `${formData.taxiTourHours} Hours`,
          },
          totalPrice: totalPrice,
          displayPrice: convertPrice(totalPrice).value,
          appliedCoupons: appliedOffers.map(o => o.code),
          currency: currency || 'LKR',
          paymentMethod: 'cash',
          paymentStatus: 'pending',
          roundTripPackageId: tab === 'tour' ? `custom-tour-${formData.taxiTourHours}h` : 'airport-round-tour',
          passengerCount: { adults: formData.passengers, children: 0, luggage: formData.luggage, handLuggage: 0 },
          distanceKm: distance || formData.taxiTourKm,
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
          notes: `Custom Tour: ${formData.taxiTourHours} Hours, Limit: ${formData.taxiTourKm} KM.\nStops/Places: ${formData.placesList.filter(Boolean).join(', ') || 'None'}\n${formData.notes || ''}`
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
                          `*Route:* ${locations[0] || 'Airport'} ➔ ${formData.placesList.filter(Boolean).join(', ') || 'Custom Stops'} ➔ ${locations[0] || 'Airport'}%0A` + 
                          `*Date/Time:* ${formData.date} at ${formData.time}%0A` + 
                          `*Payment:* ${formData.paymentMethod === 'cash' ? 'Cash to Driver' : 'Pay Online (Card)'}%0A` + 
                          `*Price:* ${currency} ${convertPrice(totalPrice).value.toLocaleString()}`;
          window.open(`https://wa.me/94712100500?text=${message}`, '_blank');
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
  const currentKmLimits = getAvailableKmLimits();

  return (
    <div className="max-w-2xl mx-auto bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200/80 dark:border-white/10 p-4 sm:p-6 relative">
      <div className="absolute inset-0 bg-[url('/pattern.webp')] opacity-[0.06] dark:opacity-[0.02] pointer-events-none z-0"></div>
      
      {/* Dynamic Header Step Indicator */}
      <div className="flex items-center justify-between mb-5 px-2 border-b border-slate-100 dark:border-white/5 pb-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-black tracking-[0.3em] uppercase text-emerald-600 dark:text-[#FACC15] flex items-center gap-1.5">
            <Sparkles size={10} /> Premium Round Tours
          </span>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
            {step === 1 ? "Choose Your Vehicle Class" : step === 2 ? "Configure Route Details" : "Contact & Finalize Booking"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Currency Selector */}
          <div className="relative z-50">
            <button
                type="button"
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                aria-label="Select Currency"
            >
                <div className="w-4 h-4 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 flex items-center justify-center">
                    <img src={SUPPORTED_CURRENCIES?.find(c => c.code === currency)?.flag || 'https://flagcdn.com/w40/lk.png'} alt={`${currency} flag`} className="w-full h-full object-cover scale-150" />
                </div>
                <span className="uppercase">{currency}</span>
                <ChevronDown size={12} className={`opacity-70 transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {isCurrencyOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsCurrencyOpen(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-slate-100 dark:border-zinc-700 overflow-hidden z-50 py-1">
                        {SUPPORTED_CURRENCIES?.map(c => (
                            <button
                                key={c.code}
                                type="button"
                                onClick={() => { changeCurrency(c.code); setIsCurrencyOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-[10px] font-black flex items-center gap-3 hover:bg-emerald-50 hover:text-emerald-600 transition-colors ${currency === c.code ? 'text-white bg-emerald-600 border-l-4 border-emerald-800' : 'text-slate-700 dark:text-white border-b border-slate-100 last:border-0'}`}
                            >
                                <div className="w-4 h-4 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 flex items-center justify-center">
                                    <img src={c.flag} alt={`${c.code} flag`} className="w-full h-full object-cover scale-150" />
                                </div>
                                <span className="flex-1">{c.name}</span>
                                <span className="text-[9px] font-bold opacity-70">{c.code}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
          </div>
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden sm:block">
            Step {step} of 3
          </span>
        </div>
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
              <div className="inline-flex w-full bg-slate-900 p-1.5 rounded-2xl border border-slate-800 relative">
                <button 
                  type="button"
                  onClick={() => setTab('airport')} 
                  className={`flex-1 py-2.5 rounded-xl transition-all duration-300 font-black text-[9px] uppercase tracking-wider flex items-center justify-center gap-1.5 z-10
                    ${tab === 'airport' 
                      ? 'bg-[#FACC15] text-black shadow-md font-bold' 
                      : 'text-slate-400 hover:text-slate-300'}`}
                >
                  <Plane size={12} /> AirPort Round TOUR
                </button>
                <button 
                  type="button"
                  onClick={() => setTab('tour')} 
                  className={`flex-1 py-2.5 rounded-xl transition-all duration-300 font-black text-[9px] uppercase tracking-wider flex items-center justify-center gap-1.5 z-10
                    ${tab === 'tour' 
                      ? 'bg-[#FACC15] text-black shadow-md font-bold' 
                      : 'text-slate-400 hover:text-slate-300'}`}
                >
                  <Car size={12} /> Round TOUR
                </button>
              </div>
            </div>
            {/* Route Planning (Pickup Location) */}
            <div className="space-y-2 pt-2 px-1">
              <label className="text-[9px] uppercase font-black text-slate-500 dark:text-slate-400 tracking-widest px-2 block">Pickup Location</label>
              <div className="relative group flex items-center">
                <div className="relative flex-1">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600">
                    <MapPin size={14} />
                  </div>
                  <input 
                    type="text" 
                    value={locations[0] || ''} 
                    ref={(el) => initAutocomplete(el, 0)} 
                    onChange={(e) => handleLocationChange(0, e.target.value)} 
                    placeholder="Enter Pickup Location" 
                    className="w-full bg-slate-100/70 dark:bg-zinc-800/60 border border-slate-400 dark:border-white/5 rounded-xl py-2.5 pl-9 pr-4 outline-none font-bold text-[11px] text-black dark:text-white focus:border-[#FACC15] focus:ring-2 focus:ring-[#FACC15]/20 transition-all shadow-sm" 
                  />
                </div>
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
                  
                  return (
                    <button 
                      key={v.id} 
                      type="button"
                      onClick={() => setSelectedVehicle(v)} 
                      className={`flex-shrink-0 w-[44vw] sm:w-auto snap-start flex flex-col items-center p-2 sm:p-2.5 rounded-2xl transition-all duration-300 border text-center relative overflow-hidden group
                        ${isActive 
                          ? 'bg-[#FACC15]/10 dark:bg-zinc-800/80 border-2 border-[#FACC15]' 
                          : 'bg-white dark:bg-zinc-900 border border-slate-400 dark:border-white/10 hover:border-slate-500 dark:hover:border-white/20'}`}
                    >
                      {/* Vehicle images — uniform fixed box, object-contain handles all sizing */}
                      {(() => {
                        const { scale, translateY } = getVehicleTransform(v.image, isActive, false, 0.72, 0.12);
                        return (
                          <div className="h-24 sm:h-28 mb-1 flex items-center justify-center w-full group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                            <img 
                              src={v.image || '/vehicles/minicar.png'} 
                              alt={v.name} 
                              className="w-full h-full object-contain select-none pointer-events-none transition-transform duration-500"
                              style={{
                                transform: `scale(${scale}) translateY(${translateY}%)`,
                                filter: 'drop-shadow(0 8px 8px rgba(0,0,0,0.08))'
                              }}
                            />
                          </div>
                        );
                      })()}
                      
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-800 dark:text-white mb-0.5">{v.name}</p>
                      <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 mb-1">{convertPrice(dynamicPrice).symbol} {convertPrice(dynamicPrice).value.toLocaleString()}</p>
                      
                      {/* Passenger capacity and baggage count details */}
                      <div className="flex gap-2.5 mt-2 ml-1 text-slate-500 justify-start w-full px-4">
                        <span className="flex items-center gap-1 text-[8px] font-bold"><User size={8} /> {v.capacity}</span>
                        <span className="flex items-center gap-1 text-[8px] font-bold"><Briefcase size={8} /> {v.luggage || v.suitcases}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stepper Selection & KM Limit (Step 1) */}
            <div className="space-y-4 bg-slate-50/50 dark:bg-zinc-800/10 p-4 rounded-3xl border border-slate-400 dark:border-white/5">
              {/* Stepper Selection */}
              <div className="space-y-2">
                <label className="text-[9px] uppercase font-black text-slate-500 dark:text-slate-400 tracking-widest px-2 block">Select hours</label>
                <div className="flex items-center bg-white dark:bg-zinc-850 border border-slate-400 dark:border-white/10 p-1 rounded-2xl shadow-sm">
                  <button 
                    type="button"
                    onClick={() => {
                      const avHours = getAvailableHours();
                      const currentIndex = avHours.indexOf(formData.taxiTourHours);
                      if (currentIndex > 0) {
                        updateDuration(avHours[currentIndex - 1]);
                      }
                    }} 
                    className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-zinc-700/50 flex items-center justify-center text-black dark:text-white hover:bg-slate-100 active:scale-95 transition-all shadow-sm"
                  >
                    <Minus size={16} strokeWidth={3} />
                  </button>
                  <div className="flex-1 text-center font-black text-black dark:text-white flex items-center justify-center gap-1.5">
                    <span className="text-lg font-black">{formData.taxiTourHours}</span>
                    <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">hours</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      const avHours = getAvailableHours();
                      const currentIndex = avHours.indexOf(formData.taxiTourHours);
                      if (currentIndex < avHours.length - 1) {
                        updateDuration(avHours[currentIndex + 1]);
                      } else if (currentIndex === -1 && avHours.length > 0) {
                        updateDuration(avHours[0]);
                      }
                    }} 
                    className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-zinc-700/50 flex items-center justify-center text-black dark:text-white hover:bg-slate-100 active:scale-95 transition-all shadow-sm"
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
                            : 'bg-white dark:bg-zinc-850 text-black dark:text-slate-300 border-slate-400 dark:border-white/10 hover:border-yellow-400'}`}
                      >
                        {km} KM
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>



            {/* Smart Offers Section */}
            <div className="mt-4 mb-2">
              <button onClick={() => setIsCouponOpen(!isCouponOpen)} className={`flex items-center gap-3 text-[10px] font-bold min-h-[3rem] transition-all px-4 py-2 rounded-2xl w-full justify-center uppercase tracking-widest border shadow-sm hover:shadow-md ${isCouponOpen ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-900 dark:text-amber-400 border-amber-200 dark:border-amber-500/30' : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-50'}`}>
                  <Tag size={14} className={`${isCouponOpen ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'} shrink-0`} fill="currentColor" />
                  {isCouponOpen ? 'Close Offers' : 'Coupon Code?'}
              </button>
              {appliedOffers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 animate-fade-in">
                      {appliedOffers.map((offer, i) => (
                          <div key={i} className="flex items-center gap-2 bg-[#FACC15] dark:bg-yellow-500/20 text-black dark:text-yellow-400 px-4 py-2 rounded-xl border border-yellow-400 dark:border-yellow-500/30 shadow-md">
                              <Tag size={14} className="text-black/70 dark:text-yellow-500" />
                              <span className="text-[10px] font-black uppercase tracking-widest">{offer.name}</span>
                              <span className="text-[10px] font-bold opacity-80">(-{offer.discountPercentage > 0 ? `${offer.discountPercentage}%` : `Rs ${offer.discountAmount}`})</span>
                              <button onClick={() => setAppliedOffers(prev => prev.filter(o => o.name !== offer.name))} className="ml-1.5 p-1 hover:bg-black/10 dark:hover:bg-yellow-500/30 rounded-md transition-colors"><X size={14} /></button>
                          </div>
                      ))}
                  </div>
              )}
              <AnimatePresence>
                  {isCouponOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-3">
                          <div className="relative h-14 animate-slide-up">
                              <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                              <input type="text" placeholder="ENTER COUPON CODE" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} className="w-full h-full pl-14 pr-24 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-bold outline-none uppercase text-emerald-950 dark:text-white placeholder:text-slate-500 tracking-widest focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-inner" aria-label="Coupon code" />
                              <button onClick={async () => {
                                  if (!couponCode) return;
                                  try {
                                      const res = await fetch('/api/coupons/validate', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ code: couponCode, pickup: locations[0], dropoff: locations[locations.length - 1] || locations[0], tripType: 'tour' })
                                      });
                                      const data = await res.json();
                                      if (data.valid) {
                                          const known = data.coupon;
                                          const couponOffer = { _id: 'coupon-' + known.code, name: known.code, discountPercentage: known.discountType === 'percentage' ? known.value : 0, discountAmount: known.discountType === 'flat' ? known.value : 0, type: 'coupon' };
                                          setAppliedOffers(prev => {
                                              if (!prev.find(o => o.name === couponOffer.name)) {
                                                  return [...prev.filter(o => o.type !== 'coupon'), couponOffer];
                                              }
                                              return prev;
                                          });
                                          setCouponCode('');
                                          setIsCouponOpen(false);
                                      } else {
                                          alert(data.message || "Invalid or expired coupon code.");
                                      }
                                  } catch (e) {
                                      alert("Validation failed.");
                                  }
                              }} aria-label="Apply Coupon" className="absolute right-2 top-2 bottom-2 bg-[#FACC15] text-black px-6 rounded-xl text-[10px] font-black uppercase hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/10">Apply</button>
                          </div>
                      </motion.div>
                  )}
              </AnimatePresence>
            </div>

            {/* Next Button */}
            <div className="pt-2 text-center">
              <button 
                type="button"
                disabled={!selectedVehicle || !formData.taxiTourKm}
                onClick={() => {
                  setBasePackage({ hours: formData.taxiTourHours, km: formData.taxiTourKm });
                  setStep(2);
                }} 
                className={`w-full py-3.5 bg-black hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2 ${(!selectedVehicle || !formData.taxiTourKm) ? 'opacity-50 cursor-not-allowed' : 'shadow-xl hover:scale-[1.01] active:scale-95'}`}
              >
                NEXT <ChevronRight size={14} strokeWidth={3} />
              </button>
            </div>

          </motion.div>
        ) : step === 2 ? (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >

            {/* Block 1: Package Summary */}
            <section className="bg-emerald-50 dark:bg-zinc-800/40 rounded-3xl border border-emerald-100 dark:border-white/5 p-5 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 sm:gap-6">
                  {(() => {
                    const { scale, translateY } = getVehicleTransform(selectedVehicle?.image || '/vehicles/sedancar.png', false, false, 0.75, 0.12);
                    return (
                      <div className="w-24 sm:w-32 h-14 sm:h-16 flex items-center justify-center relative shrink-0 overflow-hidden">
                        <img 
                          src={selectedVehicle?.image || '/vehicles/sedancar.png'}
                          alt="Vehicle" 
                          className="w-full h-full object-contain select-none pointer-events-none transition-transform duration-500"
                          style={{
                            transform: `scale(${scale}) translateY(${translateY}%)`
                          }}
                        />
                      </div>
                    );
                  })()}
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-emerald-950 dark:text-white uppercase tracking-wider leading-tight">{selectedVehicle?.name || 'Selected Vehicle'}</h4>
                    <div className="flex gap-3 text-[10px] font-bold text-emerald-700/70 dark:text-emerald-400/70 uppercase tracking-widest mt-1">
                      <span>{formData.taxiTourHours} Hours</span>
                      <span>•</span>
                      <span>{formData.taxiTourKm} KM Limit</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-emerald-600/70 dark:text-[#FACC15]/70 uppercase tracking-widest mb-0.5">Total Fare</p>
                  <p className="text-xl font-black text-emerald-700 dark:text-[#FACC15]">Rs. {totalPrice.toLocaleString()}.00</p>
                </div>
              </div>

              {/* Payload Restrictions & Legal Inclusions */}
              <div className="flex flex-col gap-3 pt-3 border-t border-emerald-200/50 dark:border-white/10">
                <div className="bg-white/60 dark:bg-zinc-900/50 rounded-xl p-3 flex items-start gap-2 border border-orange-200/50 dark:border-orange-900/30">
                  <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={14} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-orange-700 dark:text-orange-400">Strict Vehicle Capacity</p>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-2">
                      Maximum {selectedVehicle?.capacity || 2} Passengers & {selectedVehicle?.luggage || selectedVehicle?.suitcases || 4} Luggage Bags.
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 dark:bg-zinc-900/50 rounded-xl p-3 flex items-start gap-2 border border-slate-200/60 dark:border-white/5">
                  <Info className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" size={14} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-400">Inclusions & Exclusions</p>
                    <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 mt-0.5 leading-tight">
                      Included: Vehicle + Fuel Only.<br/>
                      Excluded: All secondary travel expenses, including Highway Tickets, Parking Fees, and Entrance Tickets, must be paid separately by the passenger.
                    </p>
                  </div>
                </div>
              </div>
            </section>

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
                      className="w-full bg-slate-50/50 dark:bg-zinc-900 border border-slate-400 dark:border-white/5 rounded-xl py-2.5 pl-9 pr-4 outline-none font-bold text-[11px] text-black dark:text-white focus:border-[#FACC15] focus:ring-2 focus:ring-[#FACC15]/20 transition-all shadow-sm" 
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
                      <div key={idx} className="relative group flex flex-col">
                        <div className="relative">
                          <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${!place ? 'text-red-400' : 'text-slate-400'}`}><Sparkles size={12} /></div>
                          <input 
                            type="text"
                            value={place}
                            onChange={e => {
                              const newList = [...formData.placesList];
                              newList[idx] = e.target.value;
                              setFormData({ ...formData, placesList: newList });
                            }}
                            placeholder={`Stop ${idx + 1} (e.g. Sigiriya Rock)`}
                            className={`w-full rounded-xl py-2.5 pl-9 pr-8 outline-none font-bold text-[11px] transition-all shadow-sm ${!place ? 'bg-red-50 dark:bg-red-950/20 border-2 border-red-400 text-red-900 dark:text-red-200 placeholder:text-red-400/70 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'bg-white dark:bg-zinc-800 border border-slate-400 dark:border-white/10 text-black dark:text-white focus:border-[#FACC15]'}`}
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
                        {!place && (
                          <p className="text-[9px] font-bold text-red-500 px-1 uppercase tracking-widest mt-1.5 mb-1.5">
                            <AlertCircle size={10} className="inline mr-1 -mt-0.5" /> Please specify your tour destination
                          </p>
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

            {/* Stepper buttons (Back & Next) */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button 
                type="button"
                onClick={() => setStep(1)} 
                className="py-3.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-700 dark:text-white rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-1 shadow-sm"
              >
                <ChevronLeft size={12} strokeWidth={3} /> CHANGE VEHICLE
              </button>
              <button 
                type="button"
                disabled={!locations[0] || !formData.placesList[0]}
                onClick={() => {
                  setStep(3);
                  document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }} 
                className={`py-3.5 bg-black hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2 ${(!locations[0] || !formData.placesList[0]) ? 'opacity-50 cursor-not-allowed' : 'shadow-xl hover:scale-[1.01] active:scale-95'}`}
              >
                NEXT <ChevronRight size={14} strokeWidth={3} />
              </button>
            </div>

          </motion.div>
        ) : (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Block 3: Isolated Timing & Contact Information */}
            <section className="bg-slate-50 dark:bg-zinc-800/20 rounded-3xl border border-slate-100 dark:border-white/5 p-4 space-y-3">
              <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-white/5 pb-2">
                <User className="text-emerald-600 dark:text-[#FACC15]" size={14} />
                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Contact & Schedule</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <label className="text-[8px] uppercase font-black text-slate-400 tracking-widest px-2">Pickup Date</label>
                  <input name="date" type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value, ...setFormErrors({...formErrors, date: false}) })} className={`w-full bg-white dark:bg-zinc-800 border ${formErrors.date ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-400 dark:border-white/10'} rounded-xl py-2 px-3 outline-none font-bold text-[11px] text-black dark:text-white transition-all`} />
                </div>
                <div className="space-y-0.5">
                  <label className="text-[8px] uppercase font-black text-slate-400 tracking-widest px-2">Pickup Time</label>
                  <input name="time" type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value, ...setFormErrors({...formErrors, time: false}) })} className={`w-full bg-white dark:bg-zinc-800 border ${formErrors.time ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-400 dark:border-white/10'} rounded-xl py-2 px-3 outline-none font-bold text-[11px] text-black dark:text-white transition-all`} />
                </div>
                <div className="space-y-0.5">
                  <label className="text-[8px] uppercase font-black text-slate-400 tracking-widest px-2">Full Name</label>
                  <input name="name" type="text" placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value, ...setFormErrors({...formErrors, name: false}) })} className={`w-full bg-white dark:bg-zinc-800 border ${formErrors.name ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-400 dark:border-white/10'} rounded-xl py-2 px-3 outline-none font-bold text-[11px] text-black dark:text-white transition-all`} />
                </div>
                <div className="space-y-0.5">
                  <label className="text-[8px] uppercase font-black text-slate-400 tracking-widest px-2">Email Address</label>
                  <input name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value, ...setFormErrors({...formErrors, email: false}) })} className={`w-full bg-white dark:bg-zinc-800 border ${formErrors.email ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-400 dark:border-white/10'} rounded-xl py-2 px-3 outline-none font-bold text-[11px] text-black dark:text-white transition-all`} />
                </div>
                <div className="space-y-0.5">
                  <label className="text-[8px] uppercase font-black text-slate-400 tracking-widest px-2">WhatsApp / Phone</label>
                  <PhoneInput
                    defaultCountry="lk"
                    value={formData.phone}
                    onChange={(phone) => { setFormData({ ...formData, phone }); setFormErrors({...formErrors, phone: false}); }}
                    inputClassName={`!w-full !bg-white dark:!bg-zinc-800 !border-none !py-2 !px-3 !outline-none !font-bold !text-[11px] !text-black dark:!text-white !transition-all`}
                    countrySelectorStyleProps={{
                      buttonClassName: "!bg-slate-100 dark:!bg-zinc-800/80 !border-r !border-slate-400 dark:!border-white/10 !h-full !px-3",
                    }}
                    className={`flex border ${formErrors.phone ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-400 dark:border-white/10'} rounded-xl overflow-hidden focus-within:border-[#FACC15] focus-within:ring-2 focus-within:ring-[#FACC15]/20 transition-all shadow-sm`}
                  />
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

            {/* Extra Usage Disclaimer Card */}
            <div className="bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-900/30 rounded-2xl p-4 flex gap-3 mt-4 items-start">
              <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={16} />
              <div>
                <h4 className="text-[10px] font-black text-orange-800 dark:text-orange-400 uppercase tracking-widest">Extra Usage Disclaimer</h4>
                <p className="text-[10px] font-bold text-orange-700/80 dark:text-orange-300/80 mt-1 leading-relaxed">
                  Your package is strictly capped at {formData.taxiTourHours} Hours & {formData.taxiTourKm} KM. Any usage extending beyond these hard boundaries will incur additional automated fees calculated separately.
                </p>
              </div>
            </div>

            {/* Stepper buttons (Back & Complete Booking) */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button 
                type="button"
                onClick={() => setStep(2)} 
                className="py-3.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-700 dark:text-white rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-1 shadow-sm"
              >
                <ChevronLeft size={12} strokeWidth={3} /> BACK TO ROUTE
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
