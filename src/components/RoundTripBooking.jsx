'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Navigation, ChevronRight, Plane, Car, Minus, Plus, Send, CheckCircle2, User, Mail, Phone, Loader2, AlertCircle } from 'lucide-react';

const vehicles = [
  { 
    id: 'mini-car', 
    name: 'Mini', 
    baseRate: 4000, 
    image: '/vehicles/minicar.png',
    description: 'Compact & efficient for city rides.',
    perKm: 110
  },
  { 
    id: 'sedan', 
    name: 'Sedan', 
    baseRate: 8000, 
    image: '/vehicles/sedancar.png',
    description: 'Comfortable & spacious for small groups.',
    perKm: 130
  },
  { 
    id: 'vezel', 
    name: 'Vezel', 
    baseRate: 15000, 
    image: '/vehicles/Hondavezel.png',
    description: 'Premium SUV experience for maximum comfort.',
    perKm: 180
  }
];

const RoundTripBooking = () => {
  const [tab, setTab] = useState('airport');
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]);
  const [hours, setHours] = useState(2);
  const [locations, setLocations] = useState(['', '']);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    passengers: 1,
    name: '',
    email: '',
    phone: '',
    notes: ''
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
    const base = selectedVehicle.baseRate;
    const baseKm = 20; // First 20km included in base rate
    if (distance > baseKm) {
      const extraKm = distance - baseKm;
      return Math.round(base + (extraKm * selectedVehicle.perKm));
    }
    return base;
  };

  const totalPrice = calculateTotal();

  const handleBooking = async () => {
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
        tripType: 'one-way', // User specified it's a ride/airport transfer
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
          `Vehicle: ${selectedVehicle.name}%0A` +
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
      </div>

      <div className="p-8 md:p-12 space-y-12">
        {/* Vehicle Category */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-4 w-1 bg-emerald-600 rounded-full" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Select Vehicle Class</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <motion.div 
                key={v.id}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedVehicle(v)}
                className={`cursor-pointer p-6 rounded-3xl border-2 transition-all relative overflow-hidden group ${selectedVehicle.id === v.id ? 'border-emerald-600 bg-emerald-50/30' : 'border-slate-100 hover:border-emerald-200 bg-white'}`}
              >
                <div className="aspect-video mb-4 relative flex items-center justify-center">
                  <img src={v.image} alt={v.name} className="max-h-full object-contain transition-transform duration-500 group-hover:scale-110" />
                </div>
                <h5 className="font-black text-emerald-950 uppercase tracking-tight mb-1">{v.name}</h5>
                <p className="text-xl font-black text-emerald-600 tracking-tighter">Rs. {v.baseRate.toLocaleString()}.00</p>
                {selectedVehicle.id === v.id && (
                  <div className="absolute top-4 right-4 text-emerald-600">
                    <CheckCircle2 size={20} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

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
               <select value={formData.passengers} onChange={e => setFormData({...formData, passengers: parseInt(e.target.value)})} className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-4 px-6 outline-none font-bold text-slate-900 focus:bg-white transition-all">
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Passengers</option>)}
               </select>
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
          <p className="text-center mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <AlertCircle size={12} /> Cash Payment to Driver. Official Confirmation will be emailed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoundTripBooking;
