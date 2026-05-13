'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Navigation, ChevronRight, Plane, Car, Minus, Plus, Send, CheckCircle2, User, Mail, Phone, Loader2, AlertCircle, Info, Sparkles } from 'lucide-react';
import { TAXI_TOUR_PACKAGES } from '../lib/pricing-util';

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
  
  useEffect(() => {
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
          const defaults = [
            { id: 'mini-car', name: 'Mini', baseRate: 4000, perKm: 110, image: '/vehicles/minicar.png' },
            { id: 'sedan', name: 'Sedan', baseRate: 8000, perKm: 130, image: '/vehicles/sedancar.png' },
            { id: 'vezel', name: 'Vezel', baseRate: 12000, perKm: 160, image: '/vehicles/van.png' },
            { id: 'van', name: 'Van', baseRate: 15000, perKm: 180, image: '/vehicles/van.png' },
            { id: 'suv', name: 'SUV', baseRate: 20000, perKm: 220, image: '/vehicles/sedancar.png' },
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
    taxiTourKm: 40
  });

  const updateDuration = (newHours) => {
    const kmMap = { 2: 40, 4: 80, 6: 120, 8: 160, 10: 200, 12: 300 };
    let newKm = kmMap[newHours] || newHours * 20;
    if (newHours > 12) newKm = 300;
    setFormData(prev => ({ ...prev, taxiTourHours: newHours, taxiTourKm: newKm }));
  };

  useEffect(() => {
    if (window.google) { setGoogleLoaded(true); return; }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => setGoogleLoaded(true);
    document.head.appendChild(script);
  }, []);

  const initAutocomplete = (node, index) => {
    if (!googleLoaded || !node || node.dataset.googleAutocomplete) return;
    const autocomplete = new window.google.maps.places.Autocomplete(node, { componentRestrictions: { country: "lk" }, fields: ["formatted_address"] });
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

  const handleAddLocation = () => { if (locations.length < 3) setLocations([...locations, '']); };
  const handleLocationChange = (index, value) => { const newLocs = [...locations]; newLocs[index] = value; setLocations(newLocs); };

  const calculateTotal = () => {
    if (!selectedVehicle) return 0;
    if (tab === 'tour') {
      const tourPkg = TAXI_TOUR_PACKAGES.find(p => p.hours === Number(formData.taxiTourHours));
      if (tourPkg) {
        let total = tourPkg.price;
        if (distance > formData.taxiTourKm) { total += (distance - formData.taxiTourKm) * (selectedVehicle.perKm || 110); }
        return Math.round(total);
      }
    }
    const base = selectedVehicle.baseRate;
    const extraKm = Math.max(0, distance - 20);
    return Math.round(base + (extraKm * selectedVehicle.perKm));
  };

  const totalPrice = calculateTotal();

  const handleBooking = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time) {
      alert("Please fill in all required details.");
      return;
    }
    setIsBooking(true);
    try {
      const res = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickupLocation: { address: locations[0] },
          dropoffLocation: { address: locations[locations.length - 1] },
          waypoints: locations.slice(1, -1).map(l => ({ address: l })),
          vehicleType: selectedVehicle.id,
          tripType: 'round-trip',
          roundTripPackageId: tab === 'tour' ? `tour-${formData.taxiTourHours}h` : null,
          passengerCount: { adults: formData.passengers, children: 0, luggage: 0, handLuggage: 0 },
          distanceKm: distance,
          totalPrice: totalPrice,
          scheduledDate: formData.date,
          scheduledTime: formData.time,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          notes: formData.notes
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsBooked(true);
        const message = `*New Booking Request*%0A` + `Type: Round Trip%0A` + `Name: ${formData.name}%0A` + `Vehicle: ${selectedVehicle.name}%0A` + `Price: Rs. ${totalPrice.toLocaleString()}`;
        window.open(`https://wa.me/94768743357?text=${message}`, '_blank');
      } else { alert(data.message || "Booking failed"); }
    } catch (e) { alert("An error occurred"); } finally { setIsBooking(false); }
  };

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
    <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
      <div className="flex bg-slate-50 p-2 border-b border-slate-100">
        <button onClick={() => setTab('airport')} className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-[0.2em] ${tab === 'airport' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}><Plane size={18} /> Airport</button>
        <button onClick={() => setTab('ride')} className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-[0.2em] ${tab === 'ride' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}><Car size={18} /> Ride</button>
        <button onClick={() => setTab('tour')} className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-[0.2em] ${tab === 'tour' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}><Sparkles size={18} /> Taxi Tour</button>
      </div>

      <div className="p-8 md:p-12 space-y-12">
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5"><div className="h-4 w-1 bg-emerald-600 rounded-full" /><h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Select Class</h4></div>
          </div>
          <div className="flex bg-slate-100/50 dark:bg-white/5 p-1 rounded-2xl w-full mb-6 overflow-x-auto gap-1">
            {vehicles.map((v) => (
              <button key={v.id} onClick={() => setSelectedVehicle(v)} className={`min-w-[80px] flex-1 py-3 px-2 rounded-xl text-center transition-all ${selectedVehicle?.id === v.id ? 'bg-white shadow-lg border border-slate-100' : 'text-slate-400 hover:text-emerald-600'}`}>
                <div className="h-8 mb-1 flex items-center justify-center">{v.image && <img src={v.image} alt={v.name} className="h-full object-contain" />}</div>
                <p className="text-[8px] font-black uppercase tracking-tight truncate">{v.name.split(' ')[0]}</p>
                <p className="text-[9px] font-bold mt-0.5">Rs. {v.baseRate.toLocaleString()}</p>
              </button>
            ))}
          </div>
        </section>

        {tab === 'tour' && (
          <section className="animate-slide-up space-y-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3"><Clock className="text-emerald-600" size={18} /><h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Duration & Limit</h4></div>
              <div className="flex items-center gap-2 bg-emerald-100/50 px-3 py-1 rounded-full"><Sparkles size={12} className="text-emerald-600" /><span className="text-[9px] font-black text-emerald-700 uppercase tracking-tight">AI Estimated Limit</span></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-[9px] uppercase font-black text-slate-500 px-2 tracking-widest">Select Hours</label>
                <div className="flex items-center bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
                  <button onClick={() => updateDuration(Math.max(1, formData.taxiTourHours - 1))} className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600"><Minus size={18} /></button>
                  <div className="flex-1 text-center"><span className="text-xl font-black text-emerald-950">{formData.taxiTourHours}</span><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1.5">Hours</span></div>
                  <button onClick={() => updateDuration(Math.min(24, formData.taxiTourHours + 1))} className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600"><Plus size={18} /></button>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[9px] uppercase font-black text-slate-500 px-2 tracking-widest">KM Limit</label>
                <div className="bg-white border border-emerald-100 p-4 rounded-2xl shadow-sm flex items-center justify-between">
                  <div className="flex flex-col"><span className="text-xl font-black text-emerald-600 leading-none">{formData.taxiTourKm} KM</span><span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Included</span></div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center"><Navigation size={18} /></div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><MapPin className="text-emerald-600" size={18} /><h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Route & Locations</h4></div>
            {locations.length < 3 && <button onClick={handleAddLocation} className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 px-4 py-2 hover:bg-emerald-50 rounded-xl transition-all"><Plus size={14} /> Add Stop</button>}
          </div>
          <div className="space-y-3">
            {locations.map((loc, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">{idx === 0 ? <Plane size={16} /> : idx === locations.length - 1 ? <MapPin size={16} /> : <Navigation size={16} />}</div>
                <input type="text" value={loc} ref={(el) => initAutocomplete(el, idx)} onChange={(e) => handleLocationChange(idx, e.target.value)} placeholder={idx === 0 ? "Pickup Location" : idx === locations.length - 1 ? "Final Destination" : `Stop ${idx}`} className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-5 pl-16 pr-8 outline-none font-bold text-slate-900 focus:bg-white transition-all shadow-sm" />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 items-center justify-between bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 mt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">{isCalculating ? <Loader2 className="animate-spin" size={24} /> : <Navigation size={24} />}</div>
              <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Distance</p><p className="text-xl font-black text-emerald-950 uppercase tracking-tight">{distance > 0 ? `${distance} KM` : 'Calculating...'}</p></div>
            </div>
            <div className="text-right"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Estimated Price</p><p className="text-3xl font-black text-emerald-600 tracking-tighter">Rs. {totalPrice.toLocaleString()}.00</p></div>
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
            <div className="space-y-1.5"><label className="text-[8px] uppercase font-black text-slate-400 px-2 tracking-widest">WhatsApp</label><input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 outline-none font-bold text-slate-900 focus:bg-white text-sm" /></div>
            <div className="space-y-1.5"><label className="text-[8px] uppercase font-black text-slate-400 px-2 tracking-widest">Passengers</label><div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl p-1"><button onClick={() => setFormData({ ...formData, passengers: Math.max(1, formData.passengers - 1) })} className="w-10 h-10 flex items-center justify-center text-slate-400"><Minus size={16} /></button><div className="flex-1 text-center font-black text-emerald-950 text-[10px]">{formData.passengers}</div><button onClick={() => setFormData({ ...formData, passengers: Math.min(8, formData.passengers + 1) })} className="w-10 h-10 flex items-center justify-center text-slate-400"><Plus size={16} /></button></div></div>
          </div>
        </section>

        <div className="pt-2">
          <button onClick={handleBooking} disabled={isBooking || (tab !== 'tour' && distance === 0)} className="w-full py-5 bg-emerald-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-3 disabled:opacity-50">{isBooking ? <Loader2 className="animate-spin" size={16} /> : 'Complete Booking'} <ChevronRight size={16} /></button>
          <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3"><div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><Info size={12} /></div><div><p className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-0.5">Hire Charge Only</p><p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Covers vehicle hire and fuel. Parking & tolls extra.</p></div></div>
        </div>
        <div className="flex items-center justify-center gap-2 mt-8 opacity-40">
           <Sparkles size={10} className="text-emerald-600" />
           <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">Powered by Gemini 1.5 Pro</span>
        </div>
      </div>
    </div>
  );
};

export default RoundTripBooking;
