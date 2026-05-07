const fs = require('fs');

function relocateScheduleAndHideNav() {
    let content = fs.readFileSync('src/components/BookingModal.jsx', 'utf8');

    // 1. Remove Schedule Details from Step 1
    const scheduleBlockStart = '{pricingCategory !== \'ride-now\' && (';
    const scheduleBlockEnd = '                                    {isOverCapacity && (';
    
    const sIdx = content.indexOf(scheduleBlockStart);
    const eIdx = content.indexOf(scheduleBlockEnd);

    if (sIdx !== -1 && eIdx !== -1) {
        console.log('Removing Schedule Details from Step 1');
        content = content.substring(0, sIdx) + content.substring(eIdx);
    } else {
        console.warn('Could not find Schedule Details block in Step 1');
    }

    // 2. Add Schedule Details to Step 2
    const billingMarker = '<div className="space-y-12 pt-12 mt-12 border-t-4 border-black">';
    const bIdx = content.indexOf(billingMarker);

    if (bIdx !== -1) {
        console.log('Adding Schedule Details to Step 2');
        const scheduleInStep2 = `
                                    {/* Schedule Details Moved to Step 2 */}
                                    <div className="space-y-8 pt-12 mt-12 border-t-4 border-black">
                                        <h4 className="text-2xl font-black text-black dark:text-white uppercase tracking-tight flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl bg-[#FACC15] flex items-center justify-center text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"><Clock size={24} strokeWidth={3} /></div> Schedule Details
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-4">Flight Number</label>
                                                <input
                                                    type="text"
                                                    value={formData.flightNumber || ''}
                                                    onChange={e => setFormData({ ...formData, flightNumber: e.target.value })}
                                                    className="w-full h-20 bg-white dark:bg-white/5 border-[3px] border-black px-10 rounded-3xl font-black text-sm uppercase tracking-widest outline-none focus:shadow-[8px_8px_0_0_#FACC15] transition-all"
                                                    placeholder="e.g. UL 101"
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <label className={\`text-[10px] font-black uppercase tracking-widest pl-4 \${errors.date ? 'text-red-500' : 'text-slate-500'}\`}>Pickup Date</label>
                                                <input
                                                    id="field-date"
                                                    type="date"
                                                    value={formData.flightArrivalDate || ''}
                                                    onChange={e => {
                                                        const d = e.target.value;
                                                        setFormData(prev => ({ ...prev, flightArrivalDate: d, arrivalDate: d, date: isAirportService ? d : prev.date }));
                                                        if (errors.date) setErrors(prev => ({ ...prev, date: false }));
                                                    }}
                                                    className={\`w-full h-20 bg-white dark:bg-white/5 border-[3px] border-black px-10 rounded-3xl font-black text-sm uppercase tracking-widest outline-none focus:shadow-[8px_8px_0_0_#FACC15] transition-all \${errors.date ? 'border-red-500' : ''}\`}
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <label className={\`text-[10px] font-black uppercase tracking-widest pl-4 \${errors.time ? 'text-red-500' : 'text-slate-500'}\`}>Pickup Time</label>
                                                <input
                                                    id="field-time"
                                                    type="time"
                                                    value={formData.flightArrivalTime || ''}
                                                    onChange={e => {
                                                        const t = e.target.value;
                                                        setFormData(prev => ({ ...prev, flightArrivalTime: t, arrivalTime: t, time: isAirportService ? t : prev.time }));
                                                        if (errors.time) setErrors(prev => ({ ...prev, time: false }));
                                                    }}
                                                    className={\`w-full h-20 bg-white dark:bg-white/5 border-[3px] border-black px-10 rounded-3xl font-black text-sm uppercase tracking-widest outline-none focus:shadow-[8px_8px_0_0_#FACC15] transition-all \${errors.time ? 'border-red-500' : ''}\`}
                                                />
                                            </div>
                                        </div>
                                    </div>
`;
        content = content.substring(0, bIdx) + scheduleInStep2 + content.substring(bIdx);
    }

    // 3. Update useEffect logic for body classes
    const searchMarker = '// Body Scroll Lock & Hide Chat';
    const effectStart = 'useEffect(() => {';
    const effectEnd = '}, [isOpen]);';
    
    const markerIdx = content.indexOf(searchMarker);
    if (markerIdx !== -1) {
        const startIdx = content.indexOf(effectStart, markerIdx);
        const endIdx = content.indexOf(effectEnd, startIdx) + effectEnd.length;
        
        if (startIdx !== -1 && endIdx !== -1) {
            console.log('Updating body effect logic');
            const newEffects = `useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            const originalTouchAction = document.body.style.touchAction;
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';

            // Hide Live Chat
            const chatTrigger = document.querySelector('.live-chat-trigger');
            if (chatTrigger) chatTrigger.style.display = 'none';

            return () => {
                document.body.style.overflow = originalOverflow;
                document.body.style.touchAction = originalTouchAction;
                // Show Live Chat
                const chatTriggerBack = document.querySelector('.live-chat-trigger');
                if (chatTriggerBack) chatTriggerBack.style.display = 'flex';
            };
        }
    }, [isOpen]);

    // Hide bottom nav on steps 2 and 3
    useEffect(() => {
        if (isOpen && (step === 2 || step === 3)) {
            document.body.classList.add('hide-bottom-nav');
        } else {
            document.body.classList.remove('hide-bottom-nav');
        }
        return () => document.body.classList.remove('hide-bottom-nav');
    }, [isOpen, step]);`;
            
            content = content.substring(0, startIdx) + newEffects + content.substring(endIdx);
        }
    }

    fs.writeFileSync('src/components/BookingModal.jsx', content, 'utf8');
}

relocateScheduleAndHideNav();
