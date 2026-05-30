const fs = require('fs');
const path = require('path');

const pageJsPath = path.join(__dirname, 'src/app/admin/page.js');
let content = fs.readFileSync(pageJsPath, 'utf8');

// 1. Add isPackageEditing state
content = content.replace(
    /const \[sidebarOpen, setSidebarOpen\] = useState\(true\)\n\s*const \[currentView, setCurrentView\] = useState\('dashboard'\)/g,
    `const [sidebarOpen, setSidebarOpen] = useState(true)
    const [currentView, setCurrentView] = useState('dashboard')
    const [isPackageEditing, setIsPackageEditing] = useState(false)`
);

// 2. Add isEditing package to polling
content = content.replace(
    /const isEditing = !!editingVehicle \|\| !!editingTour \|\| !!editingPost \|\| !!editingTeam \|\| !!selectedTicket \|\| !!selectedBooking;/g,
    `const isEditing = !!editingVehicle || !!editingTour || !!editingPost || !!editingTeam || !!selectedTicket || !!selectedBooking || isPackageEditing;`
);

// 3. Modify AdminPackageGroup Props
content = content.replace(
    /const AdminPackageGroup = \(\{ hours, initialPackages, onSaveGroup, onDeleteGroup, onEditHours, typeColor \}\) => \{/g,
    `const AdminPackageGroup = ({ hours, initialPackages, onSaveGroup, onDeleteGroup, onEditHours, typeColor, onFocus, onBlur }) => {`
);

// 4. Add onFocus/onBlur to AdminPackageGroup KM input
content = content.replace(
    /onChange=\{\(e\) => handleInputChange\(vt\.value, tIdx, 'km', e\.target\.value\)\}/g,
    `onChange={(e) => handleInputChange(vt.value, tIdx, 'km', e.target.value)}
                                                        onFocus={onFocus}
                                                        onBlur={onBlur}`
);

// 5. Add onFocus/onBlur to AdminPackageGroup Price input
content = content.replace(
    /onChange=\{\(e\) => handleInputChange\(vt\.value, tIdx, 'price', e\.target\.value\)\}/g,
    `onChange={(e) => handleInputChange(vt.value, tIdx, 'price', e.target.value)}
                                                        onFocus={onFocus}
                                                        onBlur={onBlur}`
);

// 6. Restructure roundTripSubTab === 'packages' layout
const layoutTarget = `{roundTripSubTab === 'packages' && (
                                <div className="bg-white rounded-xl shadow-sm p-8 animate-fade-in-up">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                                            <Route size={24} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-emerald-950 uppercase tracking-tight">Round Trip & Taxi Tour Packages</h2>
                                            <p className="text-sm text-slate-500 font-medium mt-1">Configure time and distance based hire packages with custom pricing.</p>
                                        </div>
                                    </div>

                                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-[2rem] p-6 sm:p-8 shadow-sm mb-6">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h4 className="font-black text-emerald-950 uppercase tracking-tight text-xl">Airport Round Tour Packages</h4>
                                                <p className="text-xs text-emerald-800/60 font-medium mt-1">Pricing tiers for round tours starting from the Airport.</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                
                                                <button 
                                                onClick={() => {
                                                    const hoursStr = prompt("Enter hour count for the new Airport Package (e.g. 5, 8, 12):");`;

const layoutReplacement = `{roundTripSubTab === 'packages' && (
                                <div className="bg-white rounded-xl shadow-sm p-8 animate-fade-in-up">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                                            <Route size={24} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-emerald-950 uppercase tracking-tight">Round Trip & Taxi Tour Packages</h2>
                                            <p className="text-sm text-slate-500 font-medium mt-1">Configure time and distance based hire packages with custom pricing.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                                        {/* Column 1: Airport Pickup & Base Rules */}
                                        <div className="bg-blue-50/50 border border-blue-100 rounded-[2rem] p-6 sm:p-8 shadow-sm">
                                            <div className="flex flex-col mb-8">
                                                <h4 className="font-black text-blue-950 uppercase tracking-tight text-xl mb-1">Airport Pickup & Settings</h4>
                                                <p className="text-xs text-blue-800/60 font-medium">Global rules, wait rates, and name board fees.</p>
                                            </div>
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">Name Board Price (LKR)</label>
                                                    <input type="number" value={pricingSettings.nameBoardPrice || 2000} onFocus={() => setIsPackageEditing(true)} onBlur={() => setIsPackageEditing(false)} onChange={e => setPricingSettings({ ...pricingSettings, nameBoardPrice: Number(e.target.value) })} className="w-full bg-white border border-blue-900/10 rounded-lg px-3 py-2 text-sm font-bold text-blue-900 outline-none focus:ring-2 focus:ring-blue-500/20" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">Wait Hour Rate (LKR)</label>
                                                    <input type="number" value={pricingSettings.waitingHourRate || 1000} onFocus={() => setIsPackageEditing(true)} onBlur={() => setIsPackageEditing(false)} onChange={e => setPricingSettings({ ...pricingSettings, waitingHourRate: Number(e.target.value) })} className="w-full bg-white border border-blue-900/10 rounded-lg px-3 py-2 text-sm font-bold text-blue-900 outline-none focus:ring-2 focus:ring-blue-500/20" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">Long Dist. Threshold (km)</label>
                                                    <input type="number" value={pricingSettings.longDistanceThreshold || 175} onFocus={() => setIsPackageEditing(true)} onBlur={() => setIsPackageEditing(false)} onChange={e => setPricingSettings({ ...pricingSettings, longDistanceThreshold: Number(e.target.value) })} className="w-full bg-white border border-blue-900/10 rounded-lg px-3 py-2 text-sm font-bold text-blue-900 outline-none focus:ring-2 focus:ring-blue-500/20" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">Discount Percentage (%)</label>
                                                    <input type="number" value={pricingSettings.longDistanceDiscountPercentage || 10} onFocus={() => setIsPackageEditing(true)} onBlur={() => setIsPackageEditing(false)} onChange={e => setPricingSettings({ ...pricingSettings, longDistanceDiscountPercentage: Number(e.target.value) })} className="w-full bg-white border border-blue-900/10 rounded-lg px-3 py-2 text-sm font-bold text-blue-900 outline-none focus:ring-2 focus:ring-blue-500/20" />
                                                </div>
                                                <div className="flex items-center">
                                                    <label className="flex items-center gap-2 cursor-pointer select-none">
                                                        <input type="checkbox" checked={pricingSettings.isActive} onChange={e => setPricingSettings({ ...pricingSettings, isActive: e.target.checked })} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer" />
                                                        <span className="text-sm font-medium text-blue-900">Enable Auto Discount</span>
                                                    </label>
                                                </div>
                                                <button 
                                                    onClick={async () => {
                                                        try {
                                                            const updates = [
                                                                { key: 'LONG_DISTANCE_THRESHOLD', value: pricingSettings.longDistanceThreshold, group: 'pricing' },
                                                                { key: 'LONG_DISTANCE_DISCOUNT_PERCENTAGE', value: pricingSettings.longDistanceDiscountPercentage, group: 'pricing' },
                                                                { key: 'DISCOUNT_IS_ACTIVE', value: pricingSettings.isActive, group: 'pricing' },
                                                                { key: 'NAME_BOARD_PRICE', value: pricingSettings.nameBoardPrice, group: 'pricing' },
                                                                { key: 'WAITING_HOUR_RATE', value: pricingSettings.waitingHourRate, group: 'pricing' }
                                                            ];
                                                            for (const update of updates) {
                                                                await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(update) });
                                                            }
                                                            alert('Pickup settings saved successfully!');
                                                        } catch (error) {
                                                            alert('Failed to save pickup settings.');
                                                        }
                                                    }}
                                                    className="w-full mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                                                >
                                                    Save Pickup Settings
                                                </button>
                                            </div>
                                        </div>

                                        {/* Column 2: Airport Round Tour Packages */}
                                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-[2rem] p-6 sm:p-8 shadow-sm">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                                                <div>
                                                    <h4 className="font-black text-emerald-950 uppercase tracking-tight text-xl">Airport Round Tours</h4>
                                                    <p className="text-xs text-emerald-800/60 font-medium mt-1">Starting from the Airport.</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    
                                                    <button 
                                                    onClick={() => {
                                                        const hoursStr = prompt("Enter hour count for the new Airport Package (e.g. 5, 8, 12):");`;

content = content.replace(layoutTarget, layoutReplacement);

// 7. Change Add button layout
content = content.replace(
    /className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-\[0\.2em\] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900\/10 flex items-center gap-2"\n\s*>\n\s*<Plus size=\{16\} strokeWidth=\{3\} \/> Add Airport Package/g,
    `className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10 flex items-center gap-2 whitespace-nowrap"
                                                >
                                                <Plus size={14} strokeWidth={3} /> Add`
);

content = content.replace(
    /className="px-6 py-3 bg-emerald-900 text-white rounded-xl font-black text-xs uppercase tracking-\[0\.2em\] hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900\/10 flex items-center gap-2"\n\s*>\n\s*<Plus size=\{16\} strokeWidth=\{3\} \/> Add Hour Package/g,
    `className="px-6 py-3 bg-emerald-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/10 flex items-center gap-2 whitespace-nowrap"
                                            >
                                                <Plus size={14} strokeWidth={3} /> Add`
);

// 8. Add onFocus/onBlur to AdminPackageGroup map
content = content.replace(
    /initialPackages=\{airportTours\.filter\(p => p\.hours === hours\)\}/g,
    `initialPackages={airportTours.filter(p => p.hours === hours)}
                                                    onFocus={() => setIsPackageEditing(true)}
                                                    onBlur={() => setIsPackageEditing(false)}`
);

content = content.replace(
    /initialPackages=\{normalTours\.filter\(p => p\.hours === hours\)\}/g,
    `initialPackages={normalTours.filter(p => p.hours === hours)}
                                                    onFocus={() => setIsPackageEditing(true)}
                                                    onBlur={() => setIsPackageEditing(false)}`
);

// 9. Close the grid
content = content.replace(
    /                                        \}\)\(\)\}\n                                    <\/div>\n                                <\/div>\n                            \)}/g,
    `                                        })()}
                                        </div>
                                    </div>
                                </div>
                            )}`
);

// 10. Replace old pickup settings
const oldSettingsTarget = `<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">
                                                Distance Threshold (km)
                                            </label>
                                            <input
                                                type="number"
                                                value={pricingSettings.longDistanceThreshold}
                                                onChange={e => setPricingSettings({ ...pricingSettings, longDistanceThreshold: Number(e.target.value) })}
                                                className="w-full bg-white border border-emerald-900/10 rounded-lg px-3 py-2 text-sm font-bold text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                                            />
                                            <p className="text-[10px] text-emerald-900/60 mt-1">Minimum distance to automatically trigger discount.</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">
                                                Discount Percentage (%)
                                            </label>
                                            <input
                                                type="number"
                                                value={pricingSettings.longDistanceDiscountPercentage}
                                                onChange={e => setPricingSettings({ ...pricingSettings, longDistanceDiscountPercentage: Number(e.target.value) })}
                                                className="w-full bg-white border border-emerald-900/10 rounded-lg px-3 py-2 text-sm font-bold text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                                            />
                                            <p className="text-[10px] text-emerald-900/60 mt-1">Percentage deducted from the total fare.</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">
                                                Name Board Price (LKR)
                                            </label>
                                            <input
                                                type="number"
                                                value={pricingSettings.nameBoardPrice || 2000}
                                                onChange={e => setPricingSettings({ ...pricingSettings, nameBoardPrice: Number(e.target.value) })}
                                                className="w-full bg-white border border-emerald-900/10 rounded-lg px-3 py-2 text-sm font-bold text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                                            />
                                            <p className="text-[10px] text-emerald-900/60 mt-1">Fee for airport pickup name sign service.</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">
                                                Wait Hour Rate (LKR)
                                            </label>
                                            <input
                                                type="number"
                                                value={pricingSettings.waitingHourRate || 1000}
                                                onChange={e => setPricingSettings({ ...pricingSettings, waitingHourRate: Number(e.target.value) })}
                                                className="w-full bg-white border border-emerald-900/10 rounded-lg px-3 py-2 text-sm font-bold text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                                            />
                                            <p className="text-[10px] text-emerald-900/60 mt-1">Standard hourly rate for additional waiting time.</p>
                                        </div>
                                        <div className="flex items-center pt-4">
                                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={pricingSettings.isActive}
                                                    onChange={e => setPricingSettings({ ...pricingSettings, isActive: e.target.checked })}
                                                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300 cursor-pointer"
                                                />
                                                <span className="text-sm font-medium text-emerald-900">Enable Automated Discount</span>
                                            </label>
                                        </div>
                                    </div>`;

const oldSettingsReplacement = `<div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm font-medium border border-emerald-100">
                                        <p>The <strong>Distance Threshold</strong>, <strong>Wait Hour Rate</strong>, and <strong>Name Board Price</strong> settings have been moved to the <button onClick={() => { setCurrentView('round-trips'); setRoundTripSubTab('packages'); }} className="underline font-bold text-emerald-900">Round Trip Packages</button> tab for a cleaner layout.</p>
                                    </div>`;

content = content.replace(oldSettingsTarget, oldSettingsReplacement);

fs.writeFileSync(pageJsPath, content, 'utf8');
console.log('Update complete!');
