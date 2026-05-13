'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Navigation, ChevronRight, Plane, Car, Minus, Plus, Send, CheckCircle2, User, Mail, Phone, Loader2, AlertCircle, Info, Sparkles } from 'lucide-react';
import { TAXI_TOUR_PACKAGES } from '../lib/pricing-util';



// Strip specific models in parentheses (e.g. "Mini Car (Alto/Axia)" -> "Mini Car")
const displayVehicleName = (name) => (name || '').split('(')[0].trim();

const RoundTripBooking = () => {
  const [tab, setTab] = useState('airport');
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
  
  // Fetch vehicles and pricing settings
  useEffect(() => {
    // Fetch vehicles for 'tours' category
    fetch('/api/pricing?category=tours')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          const mapped = data.data.map(v => {
            // Sanitize image paths from DB if they are missing or incorrect
            let img = v.image || '/vehicles/placeholder.png';
            if (v.vehicleType === 'mini-car' && (!v.image || v.image.includes('mini-car'))) img = '/vehicles/minicar.png';
            if (v.vehicleType === 'sedan' && (!v.image || v.image.includes('sedan.png'))) img = '/vehicles/sedancar.png';

            return {
              id: v.vehicleType,
              name: v.name,
              baseRate: v.basePrice,
              perKm: v.perKmRate,
              image: img,
              capacity: v.capacity,
              suitcases: v.luggage
            };
          });
          setVehicles(mapped);
          setSelectedVehicle(mapped[0]);
        } else {
          // Fallback if none in DB
          const defaults = [
            { id: 'mini-car', name: 'Mini', baseRate: 4000, perKm: 110, image: '/vehicles/minicar.png' },
            { id: 'sedan', name: 'Sedan', baseRate: 8000, perKm: 130, image: '/vehicles/sedancar.png' },
            { id: 'van', name: 'Vezel', baseRate: 15000, perKm: 180, image: '/vehicles/van.png' },
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
    taxiTourHours: 2,
    taxiTourKm: 10
  });

  // Load Google Maps Script
  useEffect(() => {
    if (window.google) {
      setGoogleLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => setGoogleLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Initialize Autocomplete for all fields
  const initAutocomplete = (node, index) => {
    if (!googleLoaded || !node || node.dataset.googleAutocomplete) return;

    const options = {
      componentRestrictions: { country: "lk" },
      fields: ["address_components", "geometry", "icon", "name", "formatted_address"],
      strictBounds: false,
    };

    const autocomplete = new window.google.maps.places.Autocomplete(node, options);
    node.dataset.googleAutocomplete = 'true';
    
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.formatted_address) return;

      setLocations(prev => {
        const newLocations = [...prev];
        newLocations[index] = place.formatted_address;
        return newLocations;
      });
    });
  };

  // Calculate Distance when locations change
  useEffect(() => {
    const validLocations = locations.filter(l => l.trim().length > 3);
    if (validLocations.length >= 2 && googleLoaded) {
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
            }, (res, status) => {
              if (status === 'OK') resolve(res);
              else reject(status);
            });
          });

          const dist = result.routes[0].legs.reduce((acc, leg) => acc + leg.distance.value, 0) / 1000;
          setDistance(Math.ceil(dist));
          setDuration(result.routes[0].legs[0].duration.text);
        } catch (error) {
          console.error("Routing error:", error);
        } finally {
          setIsCalculating(false);
        }
      };

      const timer = setTimeout(calculateRoute, 1000);
      return () => clearTimeout(timer);
    }
  }, [locations, googleLoaded]);

  const handleAddLocation = () => {
    if (locations.length < 3) {
      setLocations([...locations, '']);
    }
  };

  const handleLocationChange = (index, value) => {
    const newLocations = [...locations];
    newLocations[index] = value;
    setLocations(newLocations);
  };

  const calculateTotal = () => {
    if (!selectedVehicle) return 0;
    if (tab === 'tour') {
      // Use dynamic packages if available
      const activePackages = pricingSettings?.roundTripPackages || [];
      // Find package group that matches vehicle and hours
      const pkgGroup = activePackages.find(p => 
        p.hours === Number(formData.taxiTourHours) && 
        (p.vehicleType === selectedVehicle.id || (!p.vehicleType && selectedVehicle.id === 'mini-car'))
      );
      
      const tier = pkgGroup?.tiers?.find(t => t.km === Number(formData.taxiTourKm));
      
      if (tier) {
        return Math.round(tier.price);
      }

      // Fallback to static packages
      const tourPkg = TAXI_TOUR_PACKAGES.find(p => p.hours === Number(formData.taxiTourHours));
      if (tourPkg) {
        const vType = selectedVehicle.id === 'mini-car' ? 'mini-car' : (selectedVehicle.id === 'van' ? 'van' : 'sedan');
        const baseRate = tourPkg.rates[vType] || tourPkg.rates['mini-car'] || 5000;
        let total = baseRate;
        
        // Add excess KM if distance > selected package KM
        if (distance > formData.taxiTourKm) {
          const perKmRate = selectedVehicle.perKm || 110;
          total += (distance - formData.taxiTourKm) * perKmRate;
        }
        return Math.round(total);
      }
    }

    const base = selectedVehicle.baseRate;
    const baseKm = 20; // First 20km included in base rate
    if (distance > baseKm) {
      const extraKm = distance - baseKm;
      return Math.round(base + (extraKm * selectedVehicle.perKm));
    }
    return base;
  };

  if (vehicles.length === 0 || !selectedVehicle) {
      return (
          <div className="min-h-[400px] flex items-center justify-center">
              <Loader2 className="animate-spin text-emerald-600" size={32} />
          </div>
      );
  }

  const totalPrice = calculateTotal();

  const handleBooking = async () => {
    if (tab === 'tour' && locations[0].trim() !== locations[locations.length - 1].trim()) {
      alert("Round Tour must have the same Pickup and Drop-off location (e.g. Seeduwa to Seeduwa).");
      return;
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time) {
      alert("Please fill in all required contact and trip details.");
      return;
    }

    setIsBooking(true);
    try {
      const bookingData = {
        pickupLocation: { address: locations[0] },
        dropoffLocation: { address: locations[locations.length - 1] },
        waypoints: locations.slice(1, -1).map(l => ({ address: l })),
        vehicleType: selectedVehicle.id,
        tripType: 'round-trip', 
        roundTripPackageId: tab === 'tour' ? `tour-${formData.taxiTourHours}h` : null,
        passengerCount: { adults: formData.passengers, children: 0, luggage: 0, handLuggage: 0 },
        distanceKm: distance,
        duration: duration,
        totalPrice: totalPrice,
        paidAmount: 0,
        balanceAmount: totalPrice,
        currency: 'LKR',
        scheduledDate: formData.date,
        scheduledTime: formData.time,
        customerName: formData.name,
        customerEmail: formData.email,
        guestPhone: formData.phone,
        whatsappNumber: formData.phone,
        paymentMethod: 'cash',
        notes: formData.notes
      };

      const res = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const data = await res.json();
      if (data.success) {
        setIsBooked(true);
        // Also open WhatsApp as a secondary confirmation if user wants
        const message = `*Booking Confirmed (Cash)*%0A%0A` +
          `Booking ID: ${data.bookingId}%0A` +
          `Name: ${formData.name}%0A` +
          `Route: ${locations[0].split(',')[0]} to ${locations[locations.length - 1].split(',')[0]}%0A` +
          `Vehicle: ${displayVehicleName(selectedVehicle.name)}%0A` +
          `Price: Rs. ${totalPrice.toLocaleString()}`;
        
        window.open(`https://wa.me/94768743357?text=${message}`, '_blank');
      } else {
        alert("Booking failed: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Booking submission error:", error);
      alert("An error occurred while processing your booking.");
    } finally {
      setIsBooking(false);
    }
  };

  if (isBooked) {
    return (
      <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-2xl border border-emerald-50 max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-3xl font-serif font-black text-emerald-950 mb-4 uppercase tracking-tighter">Booking Confirmed!</h3>
        <p className="text-slate-500 mb-8 font-medium">Your request has been received. A confirmation email has been sent to <strong>{formData.email}</strong>. Our team will contact you shortly.</p>
        <button 
          onClick={() => setIsBooked(false)}
          className="px-10 py-4 bg-emerald-600 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-all"
        >
          Make Another Booking
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
      {/* Top Selection Bar */}
      <div className="flex bg-slate-50 p-2 border-b border-slate-100">
        <button 
          onClick={() => setTab('airport')}
          className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-[0.2em] ${tab === 'airport' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:bg-white/50'}`}
        >
          <Plane size={18} /> Airport
        </button>
        <button 
          onClick={() => setTab('ride')}
          className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-[0.2em] ${tab === 'ride' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:bg-white/50'}`}
        >
          <Car size={18} /> Ride
        </button>
        <button 
          onClick={() => setTab('tour')}
          className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-[0.2em] ${tab === 'tour' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:bg-white/50'}`}
        >
          <Sparkles size={18} /> Taxi Tour
        </button>
      </div>

      <div className="p-8 md:p-12 space-y-12">
        {/* Vehicle Category */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-4 w-1 bg-emerald-600 rounded-full" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Select Vehicle Class</h4>
            </div>
            <div className="bg-rose-600 text-white text-[8px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-rose-600/20 uppercase tracking-widest flex items-center gap-2">
                <Info size={10} strokeWidth={4} />
                SEE ALL OPTIONS
            </div>
          </div>
          <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl w-full mb-8">
            {vehicles.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVehicle(v)}
                className={`flex-1 py-4 rounded-xl text-center transition-all ${selectedVehicle.id === v.id ? 'bg-white dark:bg-zinc-800 shadow-xl scale-[1.02] border border-slate-100 dark:border-white/10' : 'text-slate-400 hover:text-emerald-600'}`}
              >
                <p className={`text-[10px] font-black uppercase tracking-widest ${selectedVehicle.id === v.id ? 'text-emerald-950 dark:text-white' : 'text-slate-400'}`}>
                    {displayVehicleName(v.name)}
                </p>
                <p className={`text-xs font-black mt-1 ${selectedVehicle.id === v.id ? 'text-emerald-600' : 'text-slate-300'}`}>
                    Rs. {v.baseRate.toLocaleString()}
                </p>
              </button>
            ))}
          </div>
        </section>

        {tab === 'tour' && (
           <section className="animate-slide-up space-y-8 bg-emerald-50/30 p-8 rounded-[2.5rem] border border-emerald-100">
              <div className="flex items-center gap-3">
                <Clock className="text-emerald-600" size={20} />
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Taxi Tour Duration & Distance</h4>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                     <label className="text-[10px] uppercase font-black text-slate-400 px-4 tracking-[0.3em]">Hour count</label>
                     <div className="flex items-center bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-white/5 p-2 rounded-[2rem] shadow-inner">
                        <button 
                            onClick={() => {
                                const newHours = Math.max(1, formData.taxiTourHours - 1);
                                setFormData({...formData, taxiTourHours: newHours});
                            }}
                            className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all active:scale-90"
                        >
                            <Minus size={20} strokeWidth={3} />
                        </button>
                        <div className="flex-1 text-center">
                            <span className="text-2xl font-black text-emerald-950 dark:text-white">{formData.taxiTourHours}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Hours</span>
                        </div>
                        <button 
                            onClick={() => {
                                const newHours = Math.min(24, formData.taxiTourHours + 1);
                                setFormData({...formData, taxiTourHours: newHours});
                            }}
                            className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all active:scale-90"
                        >
                            <Plus size={20} strokeWidth={3} />
                        </button>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <label className="text-[10px] uppercase font-black text-slate-400 px-4 tracking-[0.3em]">Select KM</label>
                     <div className="flex flex-wrap gap-3">
                        {pricingSettings?.roundTripPackages
                            ?.filter(p => p.hours === formData.taxiTourHours && (p.vehicleType === selectedVehicle.id || (!p.vehicleType && selectedVehicle.id === 'mini-car')))
                            .flatMap(p => p.tiers || [])
                            .map((tier, tIdx) => (
                                <button
                                    key={`${formData.taxiTourHours}-${tier.km}-${tIdx}`}
                                    onClick={() => setFormData({...formData, taxiTourKm: tier.km})}
                                    className={`px-8 py-4 rounded-2xl font-black text-xs transition-all border-2 flex flex-col items-center gap-1 ${formData.taxiTourKm === tier.km ? 'border-emerald-600 bg-emerald-600 text-white shadow-xl scale-105' : 'border-slate-100 dark:border-white/5 bg-white dark:bg-zinc-800 text-slate-400 hover:border-emerald-200'}`}
                                >
                                    <span>{tier.km} KM</span>
                                    <span className={`text-[9px] ${formData.taxiTourKm === tier.km ? 'text-emerald-100' : 'text-emerald-600/50'}`}>Rs.{tier.price.toLocaleString()}</span>
                                </button>
                            ))
                        }
                        {(!pricingSettings?.roundTripPackages?.some(p => p.hours === formData.taxiTourHours && (p.vehicleType === selectedVehicle.id || (!p.vehicleType && selectedVehicle.id === 'mini-car')))) && (
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest p-4 bg-slate-100/50 rounded-2xl w-full text-center">No KM packages for {formData.taxiTourHours}H</p>
                        )}
                     </div>
                  </div>
               </div>

              <div className="flex items-center gap-4 p-4 bg-emerald-100/50 rounded-2xl border border-emerald-100">
                 <AlertCircle size={16} className="text-emerald-600 shrink-0" />
                 <p className="text-[9px] font-bold text-emerald-900 uppercase tracking-tight">Maximum 300KM limit per day applies for all round-tours.</p>
              </div>
           </section>
        )}

        {/* Location Details */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="text-emerald-600" size={20} />
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Route Details</h4>
            </div>
            {locations.length < 3 && (
              <button 
                onClick={handleAddLocation}
                className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-50 px-4 py-2 rounded-xl transition-all"
              >
                <Plus size={14} /> Add Location
              </button>
            )}
          </div>
          <div className="space-y-4">
            {locations.map((loc, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-emerald-600">
                  {idx === 0 ? <Plane size={18} /> : idx === locations.length - 1 ? <MapPin size={18} /> : <Navigation size={18} />}
                </div>
                <input 
                  type="text"
                  value={loc}
                  ref={(el) => initAutocomplete(el, idx)}
                  onChange={(e) => handleLocationChange(idx, e.target.value)}
                  placeholder={idx === 0 ? "Pickup Location" : idx === locations.length - 1 ? "Final Destination" : `Stop ${idx}`}
                  className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-5 pl-16 pr-8 outline-none font-bold text-slate-900 placeholder:text-slate-300 focus:border-emerald-200 focus:bg-white transition-all shadow-sm"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-between bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                   {isCalculating ? <Loader2 className="animate-spin" size={24} /> : <Navigation size={24} />}
                </div>
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Distance</p>
                   <p className="text-xl font-black text-emerald-950 uppercase tracking-tight">{distance > 0 ? `${distance} KM` : 'Calculating...'}</p>
                </div>
             </div>
             <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Estimated Price</p>
                <p className="text-3xl font-black text-emerald-600 tracking-tighter">Rs. {totalPrice.toLocaleString()}.00</p>
             </div>
          </div>
        </section>

        {/* Contact Details */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <User className="text-emerald-600" size={20} />
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Passenger & Contact Info</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="text-[10px] uppercase font-black text-slate-400 px-4 tracking-widest">Pickup Date</label>
               <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-4 px-6 outline-none font-bold text-slate-900 focus:bg-white transition-all" />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] uppercase font-black text-slate-400 px-4 tracking-widest">Pickup Time</label>
               <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-4 px-6 outline-none font-bold text-slate-900 focus:bg-white transition-all" />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] uppercase font-black text-slate-400 px-4 tracking-widest">Full Name</label>
               <input type="text" placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-4 px-6 outline-none font-bold text-slate-900 focus:bg-white transition-all" />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] uppercase font-black text-slate-400 px-4 tracking-widest">Email Address</label>
               <input type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-4 px-6 outline-none font-bold text-slate-900 focus:bg-white transition-all" />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] uppercase font-black text-slate-400 px-4 tracking-widest">WhatsApp Number</label>
               <input type="tel" placeholder="+94 7X XXX XXXX" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-4 px-6 outline-none font-bold text-slate-900 focus:bg-white transition-all" />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] uppercase font-black text-slate-400 px-4 tracking-widest">Passengers</label>
               <div className="flex items-center bg-slate-50 border border-slate-100 rounded-3xl p-1">
                  <button 
                    onClick={() => setFormData({...formData, passengers: Math.max(1, formData.passengers - 1)})}
                    className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    <Minus size={20} strokeWidth={3} />
                  </button>
                  <div className="flex-1 text-center font-black text-emerald-950 uppercase tracking-widest text-sm">
                    {formData.passengers} Adults
                  </div>
                  <button 
                    onClick={() => setFormData({...formData, passengers: Math.min(8, formData.passengers + 1)})}
                    className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    <Plus size={20} strokeWidth={3} />
                  </button>
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] uppercase font-black text-slate-400 px-4 tracking-widest">Luggage</label>
               <div className="flex items-center bg-slate-50 border border-slate-100 rounded-3xl p-1">
                  <button 
                    onClick={() => setFormData({...formData, luggage: Math.max(0, formData.luggage - 1)})}
                    className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    <Minus size={20} strokeWidth={3} />
                  </button>
                  <div className="flex-1 text-center font-black text-emerald-950 uppercase tracking-widest text-sm">
                    {formData.luggage} Bags
                  </div>
                  <button 
                    onClick={() => setFormData({...formData, luggage: Math.min(10, formData.luggage + 1)})}
                    className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    <Plus size={20} strokeWidth={3} />
                  </button>
               </div>
            </div>
          </div>
        </section>

        {/* Final Step */}
        <div className="pt-6">
          <button 
            onClick={handleBooking}
            disabled={isBooking || distance === 0}
            className="w-full py-6 bg-emerald-950 text-white rounded-full font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-emerald-950/20 flex items-center justify-center gap-4 hover:bg-emerald-900 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
          >
            {isBooking ? <Loader2 className="animate-spin" /> : 'Confirm & Book Now'} <ChevronRight size={20} />
          </button>
          <div className="mt-8 p-6 bg-amber-50 rounded-3xl border border-amber-100 space-y-4">
              <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-sm">
                      <Info size={16} strokeWidth={3} />
                  </div>
                  <div>
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">Hire Charge Only</p>
                      <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
                          The quoted price covers the vehicle hire charge and fuel only.
                      </p>
                  </div>
              </div>
              <div className="flex items-start gap-4 border-t border-amber-200/50 pt-4">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-sm">
                      <AlertCircle size={16} strokeWidth={3} />
                  </div>
                  <div>
                      <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Customer Responsibility</p>
                      <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
                          Parking tickets and highway tolls are the responsibility of the customer.
                      </p>
                  </div>
              </div>
          </div>
          <p className="text-center mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <CheckCircle2 size={12} className="text-emerald-600" /> Professional Service Guaranteed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoundTripBooking;
