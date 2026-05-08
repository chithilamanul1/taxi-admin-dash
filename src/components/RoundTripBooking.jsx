'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Navigation, ChevronRight, Plane, Car, Minus, Plus, Send, CheckCircle2 } from 'lucide-react';

const vehicles = [
  { 
    id: 'mini', 
    name: 'Mini', 
    baseRate: 4000, 
    image: '/vehicles/minicar.png',
    description: 'Compact & efficient for city rides.'
  },
  { 
    id: 'sedan', 
    name: 'Sedan', 
    baseRate: 8000, 
    image: '/vehicles/sedancar.png',
    description: 'Comfortable & spacious for small groups.'
  },
  { 
    id: 'vezel', 
    name: 'Vezel', 
    baseRate: 15000, 
    image: '/vehicles/Hondavezel.png',
    description: 'Premium SUV experience for maximum comfort.'
  }
];

const RoundTripBooking = () => {
  const [tab, setTab] = useState('airport');
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]);
  const [hours, setHours] = useState(2);
  const [selectedKm, setSelectedKm] = useState(10);
  const [locations, setLocations] = useState(['', '']);
  const [isBooked, setIsBooked] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);

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

  // Dynamic KM options based on hours
  const getKmOptions = (h) => {
    if (h <= 1) return [10];
    if (h <= 2) return [10, 20, 30];
    if (h <= 4) return [30, 40, 50, 60];
    if (h <= 8) return [60, 80, 100];
    return [100, 150, 200];
  };

  const kmOptions = getKmOptions(hours);

  // Reset selected KM if it's not in the new options
  useEffect(() => {
    if (!kmOptions.includes(selectedKm)) {
      setSelectedKm(kmOptions[0]);
    }
  }, [hours, kmOptions, selectedKm]);

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
    return selectedVehicle.baseRate;
  };

  const handleBooking = () => {
    const locationStr = locations.filter(l => l).join(' to ');
    const message = `*Round Trip Booking Request*%0A%0A` +
      `Type: ${tab.toUpperCase()}%0A` +
      `Vehicle: ${selectedVehicle.name}%0A` +
      `Duration: ${hours} Hours%0A` +
      `Max Distance: ${selectedKm} KM%0A` +
      `Route: ${locationStr}%0A` +
      `Total Estimate: Rs. ${calculateTotal().toLocaleString()}`;
    
    window.open(`https://wa.me/94768743357?text=${message}`, '_blank');
    setIsBooked(true);
  };

  if (isBooked) {
    return (
      <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-2xl border border-emerald-50 max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-3xl font-serif font-black text-emerald-950 mb-4 uppercase tracking-tighter">Request Sent!</h3>
        <p className="text-slate-500 mb-8 font-medium">We've received your round trip request. Redirecting to WhatsApp for confirmation...</p>
        <button 
          onClick={() => setIsBooked(false)}
          className="text-emerald-600 font-black text-xs uppercase tracking-widest hover:underline"
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

        {/* Time & Distance Selection */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Clock className="text-emerald-600" size={20} />
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Hour Count</h4>
            </div>
            <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-[2rem] border border-slate-100">
              <button 
                onClick={() => setHours(Math.max(1, hours - 1))}
                className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100 hover:bg-emerald-600 hover:text-white transition-all"
              >
                <Minus size={20} />
              </button>
              <div className="flex-1 text-center">
                <span className="text-4xl font-black text-emerald-950 tracking-tighter">{hours}</span>
                <span className="ml-2 text-xs font-black text-slate-400 uppercase tracking-widest">Hours</span>
              </div>
              <button 
                onClick={() => setHours(Math.min(12, hours + 1))}
                className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100 hover:bg-emerald-600 hover:text-white transition-all"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Navigation className="text-emerald-600" size={20} />
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Select KM</h4>
            </div>
            <div className="flex flex-wrap gap-3">
              {kmOptions.map((km) => (
                <button 
                  key={km}
                  onClick={() => setSelectedKm(km)}
                  className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2 ${selectedKm === km ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-emerald-200'}`}
                >
                  {km}KM
                </button>
              ))}
            </div>
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
        </section>

        {/* Final Step */}
        <div className="pt-6">
          <button 
            onClick={handleBooking}
            className="w-full py-6 bg-emerald-950 text-white rounded-full font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-emerald-950/20 flex items-center justify-center gap-4 hover:bg-emerald-900 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Confirm Booking <ChevronRight size={20} />
          </button>
          <p className="text-center mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Fixed rates inclusive of all taxes. Fuel surcharge may apply for extra KM.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoundTripBooking;
