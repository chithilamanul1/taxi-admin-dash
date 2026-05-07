const fs = require('fs');

const content = fs.readFileSync('src/components/BookingModal.jsx', 'utf8');

const step3Header = '{step === 3 && (';
const step3Index = content.indexOf(step3Header);

if (step3Index === -1) {
    console.error('Step 3 header not found');
    process.exit(1);
}

const beforeStep3 = content.substring(0, step3Index);

const newStep3Content = `{step === 3 && (
                        <div className="animate-slide-up">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                                <div>
                                    <h3 className="text-4xl md:text-6xl font-black text-emerald-950 dark:text-white tracking-tight uppercase leading-none mb-3">Final <span className="text-[#FACC15]">Checkout</span></h3>
                                    <p className="text-[10px] md:text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-[0.4em]">Premium Booking Experience</p>
                                </div>
                                <div className="flex items-center gap-5 bg-emerald-50 dark:bg-yellow-400/10 px-6 py-3 rounded-2xl border border-emerald-100 dark:border-yellow-400/20 shadow-sm">
                                    <ShieldCheck size={18} className="text-[#FACC15]" />
                                    <span className="text-[10px] font-black text-emerald-950 dark:text-white uppercase tracking-widest">Secured by SSL</span>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-12 gap-12">
                                    {/* Left Column: Summary */}
                                    <div className="lg:col-span-7 space-y-8">
                                        <div className="p-6 md:p-14 bg-white dark:bg-zinc-900/40 rounded-[2.5rem] md:rounded-[3rem] text-emerald-950 dark:text-white border border-emerald-100 dark:border-white/10 shadow-2xl relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FACC15]/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-[#FACC15]/10 transition-all duration-700"></div>

                                            <div className="relative z-10 space-y-10">
                                                <div className="flex items-center justify-between pb-8 border-b border-slate-100 dark:border-white/5">
                                                     <div className="px-6 py-2.5 bg-[#FACC15] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#FACC15]/20">
                                                         Booking Summary
                                                     </div>
                                                    <div className="text-[10px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-[0.3em]">
                                                        {formData.tripType.replace('-', ' ')}
                                                    </div>
                                                </div>

                                                 <div className="space-y-6">
                                                    {/* Compact Vehicle Summary */}
                                                    <div className="flex items-center gap-4 sm:gap-6 bg-slate-50 dark:bg-white/5 p-4 sm:p-6 rounded-2xl sm:rounded-[2.5rem] border border-slate-100 dark:border-white/10 group/v-summary animate-slide-in shadow-inner">
                                                        <div className="w-24 h-16 bg-white dark:bg-zinc-800 rounded-2xl border border-slate-100 dark:border-white/10 flex items-center justify-center p-0.5 overflow-hidden shrink-0 shadow-sm">
                                                            <img src={selectedVehicle?.image} alt={selectedVehicle?.name} className="w-full h-full object-contain scale-[1.5] group-hover/v-summary:scale-175 transition-transform duration-500" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm font-black text-emerald-950 dark:text-white uppercase truncate tracking-tight">{displayVehicleName(selectedVehicle?.name)}</p>
                                                            <div className="flex items-center gap-4 mt-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Users size={12} className="text-[#FACC15]" />
                                                                    <span className="text-[9px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">{selectedVehicle?.capacity || 4} Pax</span>
                                                                </div>
                                                                <span className="w-1 h-1 bg-slate-300 dark:bg-white/20 rounded-full"></span>
                                                                <div className="flex items-center gap-2">
                                                                    <Briefcase size={12} className="text-[#FACC15]" />
                                                                    <span className="text-[9px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">{selectedVehicle?.luggage || 2} Bags</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid sm:grid-cols-2 gap-8 px-2">
                                                        <div className="flex gap-5">
                                                             <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-white flex items-center justify-center shrink-0 shadow-xl"><MapPin size={22} /></div>
                                                             <div className="min-w-0">
                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Origin</p>
                                                                <p className="text-[11px] font-black text-emerald-950 dark:text-white leading-tight uppercase line-clamp-2">{formData.pickup}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-5">
                                                             <div className="w-12 h-12 rounded-2xl bg-[#FACC15] text-white flex items-center justify-center shrink-0 shadow-xl shadow-[#FACC15]/20"><Navigation size={22} /></div>
                                                             <div className="min-w-0">
                                                                <p className="text-[9px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-2">Destination</p>
                                                                <p className="text-[11px] font-black text-emerald-950 dark:text-white leading-tight uppercase line-clamp-2">{formData.dropoff}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {formData.hasNameBoard && (
                                                      <div className="flex gap-6 bg-emerald-50 dark:bg-yellow-400/5 p-6 rounded-[2.5rem] border border-emerald-100 dark:border-yellow-400/10 shadow-sm group/board">
                                                             <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-white/5 overflow-hidden shadow-sm group-hover/board:border-yellow-400 transition-colors">
                                                                 <Signpost size={28} className="text-[#FACC15]" strokeWidth={3} />
                                                             </div>
                                                            <div className="min-w-0">
                                                                <p className="text-[9px] font-black text-[#FACC15] uppercase tracking-widest mb-2">Airport Greeting</p>
                                                                <p className="text-[11px] font-black text-emerald-950 dark:text-white uppercase truncate">"{formData.nameBoardText || 'Elite Greeting'}"</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-4 pt-8 mt-4 border-t border-slate-100 dark:border-white/10">
                                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-100">
                                                        <span>Trip Base Fare</span>
                                                        <span className="text-emerald-950 dark:text-white font-black">{currentSymbol} {subtotal.toLocaleString()}</span>
                                                    </div>

                                                    {detailedBreakdown.detailedExtras?.filter(s => s.value > 0).map((s, idx) => (
                                                        <div key={idx} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-100">
                                                            <span>{s.label}</span>
                                                            <span className="text-[#FACC15] font-black">+{currentSymbol} {s.value.toLocaleString()}</span>
                                                        </div>
                                                    ))}

                                                    {detailedBreakdown.discounts > 0 && (
                                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#FACC15] bg-emerald-50 dark:bg-yellow-400/5 px-4 py-2 rounded-xl">
                                                            <span>Special promotion applied</span>
                                                            <span className="font-black">-{currentSymbol} {detailedBreakdown.discounts.toLocaleString()}</span>
                                                        </div>
                                                    )}

                                                    <div className="pt-8 mt-6 border-t border-slate-100 dark:border-white/10 flex justify-between items-end">
                                                        <div>
                                                            <p className="text-[10px] font-black text-[#FACC15] bg-emerald-50 dark:bg-yellow-400/10 px-5 py-2 mb-5 rounded-full w-fit tracking-[0.2em] shadow-sm">
                                                                {formData.paymentType === 'partial' ? 'Secure Deposit (50%)' : 'Total Amount (Fixed)'}
                                                            </p>
                                                            <p className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-emerald-950 dark:text-white leading-none">
                                                                <span className="text-lg md:text-2xl font-black mr-2 text-slate-500 dark:text-white/20">{currentSymbol}</span>
                                                                {payNow.toLocaleString()}
                                                            </p>
                                                            <div className="flex flex-wrap gap-3 mt-6">
                                                                 {convertToAllCurrencies(detailedBreakdown.lkr?.payNow || originalLKR)
                                                                     .filter(c => {
                                                                         if (currency === 'LKR') return ['USD', 'GBP', 'EUR'].includes(c.code);
                                                                         if (currency === 'USD') return ['LKR', 'GBP', 'EUR'].includes(c.code);
                                                                         if (currency === 'INR') return ['USD'].includes(c.code);
                                                                         if (currency === 'GBP') return ['USD', 'EUR'].includes(c.code);
                                                                         if (currency === 'EUR') return ['USD', 'GBP'].includes(c.code);
                                                                         return c.code !== currency;
                                                                     })
                                                                     .map(c => (
                                                                         <span key={c.code} className="text-[10px] sm:text-xs font-black text-[#FACC15] dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-yellow-400/5 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-yellow-400/10">
                                                                             ≈ {c.symbol}{c.value.toLocaleString()} {c.code}
                                                                         </span>
                                                                     ))
                                                                 }
                                                             </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Disclaimer Section */}
                                                    <div className="pt-8 mt-6 text-[9px] text-slate-800 dark:text-slate-300 font-bold uppercase tracking-wider leading-relaxed flex items-center gap-4">
                                                        <div className="w-2 h-2 rounded-full bg-yellow-400/30 shrink-0"></div>
                                                        Fixed price includes taxes & fuel. Highway tolls excluded.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Payment */}
                                    <div className="lg:col-span-5 space-y-12">
                                        {/* Payment Selection */}
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                 <div className="h-px flex-1 bg-slate-100 dark:bg-white/5"></div>
                                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Payment Method</span>
                                                 <div className="h-px flex-1 bg-slate-100 dark:bg-white/5"></div>
                                             </div>
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                 {['cash', 'card'].map(m => (
                                                     <button
                                                         key={m}
                                                         onClick={() => setFormData({ ...formData, paymentMethod: m })}
                                                         className={\`relative flex items-center gap-4 p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] border transition-all group/pm \${formData.paymentMethod === m
                                                             ? 'bg-[#FACC15] border-transparent text-white shadow-xl shadow-[#FACC15]/30'
                                                             : 'bg-white dark:bg-zinc-900 border-slate-100 dark:border-white/10 text-slate-600 hover:border-[#FACC15]'
                                                             }\`}
                                                     >
                                                         <div className={\`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center text-3xl transition-all duration-500 group-hover/pm:scale-110 \${formData.paymentMethod === m ? 'bg-white/20' : 'bg-slate-50 dark:bg-zinc-800 shadow-sm'}\`}>
                                                             {m === 'cash' ? <Coins size={22} className={formData.paymentMethod === m ? 'text-white' : 'text-[#FACC15]'} /> : <CreditCard size={22} className={formData.paymentMethod === m ? 'text-white' : 'text-[#FACC15]'} />}
                                                         </div>
                                                        <div className="text-left">
                                                            <span className="block text-[11px] font-black uppercase tracking-widest">{m === 'cash' ? 'Pay to Driver' : 'Pay via Card'}</span>
                                                            <span className={\`text-[8px] font-bold uppercase tracking-widest mt-1 block \${formData.paymentMethod === m ? 'text-white/60' : 'text-slate-500'}\`}>{m === 'cash' ? 'Pay after arrival' : 'Stripe / PayHere'}</span>
                                                        </div>
                                                        {formData.paymentMethod === m && <Check size={24} className="absolute right-10 opacity-20" />}
                                                    </button>
                                                ))}
                                             </div>
                                        </div>

                                        {formData.paymentMethod === 'card' && (
                                            <div className="space-y-6 animate-slide-in">
                                                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] pl-6">Installment Option</h4>
                                                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-[1.8rem] border border-slate-100 dark:border-white/10 shadow-inner">
                                                    {['full', 'partial'].map(t => (
                                                        <button
                                                            key={t}
                                                            onClick={() => setFormData(prev => ({ ...prev, paymentType: t }))}
                                                            className={\`py-5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all \${formData.paymentType === t
                                                                ? 'bg-[#FACC15] text-white shadow-xl'
                                                                : 'text-slate-400 hover:text-[#FACC15]'}\`}
                                                        >
                                                            {t === 'full' ? 'Complete (100%)' : 'Deposit (50%)'}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-6 pt-6">
                                             <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] pl-6">Promo Codes</h4>
                                             <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-3 rounded-[2rem] flex gap-4 shadow-inner">
                                                <input
                                                    value={couponInput}
                                                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                                                    placeholder="HAVE A CODE?"
                                                    className="flex-1 h-14 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/10 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-yellow-400/10 text-emerald-950 dark:text-white shadow-sm transition-all"
                                                />
                                                <button
                                                    onClick={() => handleApplyCoupon()}
                                                    disabled={couponLoading || !couponInput}
                                                    className="px-10 bg-emerald-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 active:scale-95 transition-all shadow-xl hover:bg-black"
                                                >
                                                    {couponLoading ? <Loader2 className="animate-spin" size={16} /> : 'Apply'}
                                                </button>
                                            </div>
                                            {verifiedCoupons.length > 0 && (
                                                <div className="flex flex-wrap gap-3 px-3">
                                                    {verifiedCoupons.map((c, i) => (
                                                        <span key={i} className="px-6 py-3 bg-emerald-50 dark:bg-yellow-400/10 text-[#FACC15] rounded-2xl border border-emerald-100 dark:border-yellow-400/20 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-4 animate-slide-in shadow-sm group">
                                                            <Tag size={12} fill="currentColor" className="group-hover:rotate-12 transition-transform" /> {c.code}
                                                            <X size={16} className="cursor-pointer hover:rotate-90 transition-all ml-2 opacity-40 hover:opacity-100" onClick={() => setVerifiedCoupons(prev => prev.filter(vc => vc.code !== c.code))} />
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 sm:p-10 pt-4 pb-28 sm:pb-10 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-zinc-950 shrink-0 transition-colors">
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
                        <button
                            onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
                            className="flex items-center justify-center gap-2 px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20"
                        >
                            <ArrowLeft size={14} strokeWidth={3} />
                            {step === 1 ? 'Cancel' : 'Back'}
                        </button>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleNext}
                                disabled={loading}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-10 py-4 bg-[#FACC15] hover:bg-yellow-400 disabled:bg-slate-200 dark:disabled:bg-white/10 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#FACC15]/20 hover:shadow-[#FACC15]/40 transition-all transform active:scale-95 group"
                            >
                                {step < 3 ? (
                                    <>
                                        Next Step
                                        <ArrowRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                ) : (
                                    loading ? 'Securing...' : 'Confirm Order'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
);
}
`;

fs.writeFileSync('src/components/BookingModal.jsx', beforeStep3 + newStep3Content, 'utf8');
