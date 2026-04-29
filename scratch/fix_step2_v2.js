const fs = require('fs');

function fixStep2() {
    let content = fs.readFileSync('src/components/BookingModal.jsx', 'utf8');

    // 1. Redesign Step 2 Header and Add Summary
    const step2HeaderStart = '{step === 2 && (';
    // We need to find the point where the actual input grid starts to replace everything in between
    const inputsStartMarker = '<div className="space-y-10 max-w-3xl mx-auto">';
    
    const startIndex = content.indexOf(step2HeaderStart);
    const endIndex = content.indexOf(inputsStartMarker);

    if (startIndex !== -1 && endIndex !== -1) {
        const newStep2Top = `{step === 2 && (
                        <div className="animate-slide-up space-y-10">
                            {/* Selected Vehicle Summary - Brutalist Style */}
                            <div className="bg-white dark:bg-zinc-900 border-[3px] border-black rounded-[2.5rem] overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative group/summary">
                                <div className="absolute top-6 left-10 z-20">
                                    <div className="bg-[#FACC15] text-black text-[10px] font-black px-4 py-1.5 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest">
                                        Selected Fleet
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-center p-8 gap-8 md:gap-12">
                                    <div className="w-full md:w-1/3 flex justify-center relative">
                                        <div className="absolute inset-0 bg-gradient-to-b from-[#FACC15]/20 to-transparent rounded-full blur-3xl opacity-30"></div>
                                        <img 
                                            src={selectedVehicle?.image} 
                                            alt={selectedVehicle?.name} 
                                            className="w-full max-w-[240px] object-contain relative z-10 scale-125 md:scale-150 drop-shadow-2xl"
                                        />
                                    </div>

                                    <div className="flex-1 space-y-6">
                                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                            <div>
                                                <h4 className="text-4xl font-black text-black dark:text-white uppercase tracking-tighter leading-none mb-2">
                                                    {displayVehicleName(selectedVehicle?.name)}
                                                </h4>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Premium Elite Tier</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-baseline justify-end gap-2">
                                                    <span className="text-2xl font-black text-[#FACC15]">{currentSymbol}</span>
                                                    <span className="text-5xl font-black text-black dark:text-white tracking-tighter leading-none">
                                                        {totalPrice.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-3">
                                            {[
                                                { icon: Users, label: 'PAX', value: selectedVehicle?.capacity || 4 },
                                                { icon: Briefcase, label: 'LUG', value: selectedVehicle?.suitcases || 2 },
                                                { icon: ShoppingBag, label: 'HAND', value: selectedVehicle?.handLuggage || 2 },
                                                { icon: Wind, label: 'AC', value: 'ON' }
                                            ].map((item, i) => (
                                                <div key={i} className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border-2 border-black flex flex-col items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                                    <item.icon size={16} className="text-[#FACC15] mb-2" strokeWidth={3} />
                                                    <span className="text-sm font-black text-black dark:text-white leading-none">{item.value}</span>
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">{item.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-4 border-black pb-8">
                                <div>
                                    <h3 className="text-5xl md:text-6xl font-black text-black dark:text-white tracking-tighter uppercase leading-none mb-3">
                                        Passenger <span className="text-[#FACC15]">Details</span>
                                    </h3>
                                    <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Personalize Your Elite Experience</p>
                                </div>
                            </div>
`;
        content = content.substring(0, startIndex) + newStep2Top + content.substring(endIndex);
    }

    // 2. Redesign the Input Grid
    const gridStartMarker = '<div className="space-y-10 max-w-3xl mx-auto">';
    // We want to replace everything until the end of Step 2
    const step2EndMarker = ')}'; 
    // Wait, step 2 ends before step 3. 
    // In my file, it looks like this:
    // {step === 2 && (...)}
    // {step === 3 && (...)}
    
    // I'll look for the specific block containing the old inputs
    const oldInputBlockStart = '<div className="grid md:grid-cols-2 gap-x-10 gap-y-8 bg-white dark:bg-zinc-900/40 p-1 md:p-4 rounded-[2.5rem]">';
    const oldInputBlockEnd = '</div>'; // This is tricky.
    
    // Let's use a more unique marker for the end of Step 2 inputs
    const billingMarker = '<div className="space-y-8 pt-12 mt-12 border-t border-slate-100 dark:border-white/5">';
    
    const gridStartIndex = content.indexOf(oldInputBlockStart);
    const gridEndIndex = content.indexOf(billingMarker);

    if (gridStartIndex !== -1 && gridEndIndex !== -1) {
        const newGrid = `<div className="grid md:grid-cols-2 gap-10 mt-12">
                                        {[
                                            { label: 'Full Legal Name', key: 'name', type: 'text', placeholder: 'Passenger Name', icon: User },
                                            { label: 'Email Address', key: 'email', type: 'email', placeholder: 'for confirmation', icon: Mail },
                                            { label: 'Primary Contact No', key: 'phone', type: 'tel', placeholder: '+94 XXX XXX XXX', icon: Phone },
                                            { label: 'WhatsApp Number', key: 'whatsapp', type: 'tel', placeholder: 'For driver chat', icon: MessageSquare },
                                        ].map(f => (
                                                <div key={f.key} className="group/field">
                                                    <label className={\`text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-3 transition-colors \${errors[f.key] ? 'text-red-500' : 'text-slate-500 dark:text-slate-400 group-focus-within/field:text-[#FACC15]'}\`}>
                                                        <f.icon size={14} className={errors[f.key] ? 'text-red-500' : 'text-[#FACC15]'} strokeWidth={3} /> {f.label}
                                                    </label>
                                                    {f.type === 'tel' ? (
                                                        <PhoneInput
                                                            id={\`field-\${f.key}\`}
                                                            defaultCountry="lk"
                                                            value={formData[f.key] || ''}
                                                            onChange={(phone) => {
                                                                setFormData({ ...formData, [f.key]: phone });
                                                                if (errors[f.key]) setErrors(prev => ({ ...prev, [f.key]: false }));
                                                            }}
                                                            inputClassName="!w-full !h-20 !bg-transparent !border-none !px-8 !outline-none focus:!ring-0 !font-black !text-black dark:!text-white placeholder:!text-slate-300 !text-sm !uppercase !tracking-widest"
                                                            countrySelectorStyleProps={{
                                                                buttonClassName: '!h-20 !bg-white dark:!bg-white/5 !border-r-2 !border-black !px-6 !flex !items-center !justify-center !min-w-[100px]',
                                                                flagClassName: '!w-10 !h-auto',
                                                                dropdownStyleProps: {
                                                                    className: '!z-[20000] !min-w-[240px] !max-h-[400px] !rounded-2xl !border-2 !border-black !bg-white dark:!bg-zinc-900 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]'
                                                                }
                                                            }}
                                                            className={\`w-full bg-white dark:bg-white/5 border-[3px] border-black rounded-3xl flex focus-within:shadow-[8px_8px_0px_0px_rgba(250,204,21,1)] transition-all \${errors[f.key] ? 'border-red-500 animate-shake' : 'border-black focus-within:border-[#FACC15]'}\`}
                                                        />
                                                    ) : (
                                                        <input
                                                            id={\`field-\${f.key}\`}
                                                            type={f.type}
                                                            value={formData[f.key] || ''}
                                                            onChange={e => {
                                                                setFormData({ ...formData, [f.key]: e.target.value });
                                                                if (errors[f.key]) setErrors(prev => ({ ...prev, [f.key]: false }));
                                                            }}
                                                            className={\`w-full h-20 bg-white dark:bg-white/5 border-[3px] border-black px-10 rounded-3xl outline-none focus:shadow-[8px_8px_0_0_#FACC15] transition-all font-black text-black dark:text-white placeholder:text-slate-300 text-sm uppercase tracking-widest \${errors[f.key] ? 'border-red-500 animate-shake' : 'focus:border-[#FACC15]'}\`}
                                                            placeholder={f.placeholder}
                                                        />
                                                    )}
                                                </div>
                                        ))}`;
        content = content.substring(0, gridStartIndex) + newGrid + content.substring(gridEndIndex);
    }

    // 3. Billing Section
    const billingEndMarker = '</div>\\n                                        </div>\\n                                    </div>\\n                            </div>\\n                        </div>';
    // Wait, the markers are getting complex. Let's just replace the whole Step 2 block content.
    
    fs.writeFileSync('src/components/BookingModal.jsx', content, 'utf8');
}

fixStep2();
console.log('Step 2 redesign applied');
