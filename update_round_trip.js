const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'RoundTripBooking.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Import TripMap
if (!content.includes("import TripMap")) {
    content = content.replace(
        /import \{ TAXI_TOUR_PACKAGES[^}]*\} from '\.\.\/lib\/pricing-util';/,
        `import { TAXI_TOUR_PACKAGES, findMatchingDestination, hasPricingData } from '../lib/pricing-util';\nimport TripMap from './TripMap';`
    );
}

// 2. Add placesList to formData
content = content.replace(
    /notes: '',\s*taxiTourHours:/,
    `notes: '',
    placesList: [''],
    taxiTourHours:`
);

// 3. Update calculateVehiclePrice to handle distance overage
content = content.replace(
    /if \(tier && tier\.price\) return Math\.round\(tier\.price\);/g,
    `if (tier && tier.price) {
          let baseP = Math.round(tier.price);
          if (distance > formData.taxiTourKm) {
             baseP += (distance - formData.taxiTourKm) * (v.perKmRate || v.perKm || 100);
          }
          return Math.round(baseP);
        }`
);

// 4. Inject the Route Planning Block before Contact Details
const routePlanningBlock = `
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
                          placeholder={\`Stop \${idx + 1} (e.g. Sigiriya Rock)\`}
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
                    onRouteCalculated={(stats) => setDistance(stats.distanceKm)}
                  />
                </div>
            </section>
`;

content = content.replace(
    /<section className="space-y-6">\s*<div className="flex items-center justify-between">\s*<div className="flex items-center gap-2\.5"><User className="text-emerald-600"/,
    routePlanningBlock + '\n            <section className="space-y-6">\n              <div className="flex items-center justify-between">\n                <div className="flex items-center gap-2.5"><User className="text-emerald-600"'
);

// Fix the WhatsApp message to include Stops
content = content.replace(
    /`\*KM Limit:\* \$\{formData\.taxiTourKm\} KM%0A` \+/,
    `\`*KM Limit:* \${formData.taxiTourKm} KM%0A\` + \n                        \`*Stops:* \${formData.placesList.filter(Boolean).join(', ') || 'None'}%0A\` +`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('RoundTripBooking updated successfully.');
