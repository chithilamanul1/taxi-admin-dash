const fs = require('fs');

const content = fs.readFileSync('src/components/BookingModal.jsx', 'utf8');

const badPart = `                            <div className="flex flex-col items-center justify-center gap-3 mt-6">
                                <div className="flex items-center gap-2 text-[#FACC15]/60">
                                    <ShieldCheck size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Taxes Included • Tolls Excluded</span>
                                </div>
                            </div>
                        </div>
                    )}
                {step === 3 && (`;

const step2Content = `                            <div className="flex flex-col items-center justify-center gap-3 mt-6">
                                <div className="flex items-center gap-2 text-[#FACC15]/60">
                                    <ShieldCheck size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Taxes Included • Tolls Excluded</span>
                                </div>
                            </div>
                        </div>
                    )}

                {step === 2 && (
                        <div className="animate-slide-up">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                                <div>
                                    <h3 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FACC15] to-[#FF5C00] tracking-tight uppercase leading-none mb-3">
                                        Passenger <span className="text-emerald-950 dark:text-white">Details</span>
                                    </h3>
                                    <p className="text-[10px] md:text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-[0.4em]">Seamless Journey Planning</p>
                                </div>
                                <div className="flex items-center gap-4 bg-[#FACC15]/10 px-6 py-3 rounded-2xl border border-[#FACC15]/20 shadow-sm">
                                    <Zap size={18} className="text-[#FACC15]" />
                                    <span className="text-[10px] font-black text-emerald-950 dark:text-white uppercase tracking-widest">Instant Confirmation</span>
                                </div>
                            </div>

                            <div className="space-y-10 max-w-3xl mx-auto">
                                {!session && (
                                    <div className="bg-gradient-to-br from-[#FACC15] to-[#FF5C00] p-8 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group shadow-2xl">
                                        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10 mix-blend-overlay"></div>
                                        <div className="flex items-center gap-6 relative z-10 text-white">
                                            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg"><User size={28} /></div>
                                            <div>
                                                <p className="text-sm font-black uppercase tracking-widest leading-none">Exclusive Benefits?</p>
                                                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mt-2">Sign in for member rates & trip history.</p>
                                            </div>
                                        </div>
                                        <button onClick={() => signIn()} className="relative z-10 px-10 py-4 bg-white text-[#FACC15] rounded-2xl text-[10px] font-black hover:bg-emerald-50 transition-all uppercase tracking-widest shadow-xl active:scale-95">Member Login</button>
                                    </div>
                                )}

                                <div className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-x-10 gap-y-8 bg-white dark:bg-zinc-900/40 p-1 md:p-4 rounded-[2.5rem]">
                                        {[
                                            { label: 'Full Legal Name', key: 'name', type: 'text', placeholder: 'Passenger Name', icon: User },
                                            { label: 'Email Address', key: 'email', type: 'email', placeholder: 'for confirmation', icon: Mail },
                                            { label: 'Primary Contact No', key: 'phone', type: 'tel', placeholder: '+94 XXX XXX XXX', icon: Phone },
                                            { label: 'WhatsApp Number', key: 'whatsapp', type: 'tel', placeholder: 'For driver chat', icon: MessageSquare },
                                        ].map(f => (
                                                <div key={f.key} className="group/field">
                                                    <label className={\`text-[9px] font-black uppercase tracking-[0.2em] mb-3 ml-6 flex items-center gap-2 transition-colors \${errors[f.key] ? 'text-red-500' : 'text-slate-600 dark:text-slate-400 group-focus-within/field:text-[#FACC15]'}\`}>
                                                        <f.icon size={11} className={errors[f.key] ? 'text-red-500' : 'text-[#FACC15]'} /> {f.label}
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
                                                            inputClassName="!w-full !h-16 !bg-transparent !border-none !px-6 !outline-none focus:!ring-0 !font-black !text-emerald-950 dark:!text-white placeholder:!text-slate-400 !text-sm !uppercase !tracking-widest"
                                                            countrySelectorStyleProps={{
                                                                buttonClassName: '!h-16 !bg-slate-50 dark:!bg-white/5 !border-r !border-slate-100 dark:!border-white/10 !px-4 !flex !items-center !justify-center !min-w-[80px] !rounded-l-3xl',
                                                                flagClassName: '!w-8 !h-auto',
                                                                dropdownStyleProps: {
                                                                    className: '!z-[20000] !min-w-[200px] !max-h-[300px] !rounded-2xl !border !border-slate-100 !bg-white dark:!bg-zinc-900 dark:!text-white shadow-2xl'
                                                                }
                                                            }}
                                                            className={\`w-full bg-slate-50 dark:bg-white/5 border rounded-3xl flex focus-within:ring-4 focus-within:ring-[#FACC15]/10 transition-all shadow-sm group-hover/field:border-[#FACC15]/20 dark:group-hover/field:border-[#FACC15]/20 \${errors[f.key] ? 'border-red-500 animate-shake' : 'border-slate-100 dark:border-white/10'}\`}
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
                                                            className={\`w-full h-16 bg-slate-50 dark:bg-white/5 border px-8 rounded-3xl outline-none focus:ring-4 focus:ring-[#FACC15]/10 transition-all font-black text-emerald-950 dark:text-white placeholder:text-slate-500 text-sm uppercase tracking-widest shadow-sm group-hover/field:border-[#FACC15]/20 dark:group-hover/field:border-[#FACC15]/20 \${errors[f.key] ? 'border-red-500 animate-shake' : 'border-slate-100 dark:border-white/10'}\`}
                                                            placeholder={f.placeholder}
                                                        />
                                                    )}
                                                </div>
                                        ))}
                                    </div>

                                        <div className="space-y-8 pt-12 mt-12 border-t border-slate-100 dark:border-white/5">
                                            <h4 className="text-[11px] font-black text-emerald-950 dark:text-white uppercase tracking-[0.4em] pl-6 flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-[#FACC15]/10 flex items-center justify-center text-[#FACC15] shadow-sm"><CreditCard size={18} /></div> Billing Details <span className="text-slate-600 dark:text-slate-400">(Optional)</span>
                                            </h4>
                                            <div className="grid md:grid-cols-2 gap-8 px-2">
                                                <input
                                                    type="text"
                                                    value={formData.billingName || ''}
                                                    onChange={e => setFormData({ ...formData, billingName: e.target.value })}
                                                    className="w-full h-16 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 px-8 rounded-3xl text-sm font-black text-emerald-950 dark:text-white placeholder:text-slate-600 uppercase tracking-widest outline-none focus:ring-4 focus:ring-[#FACC15]/10 transition-all shadow-sm"
                                                    placeholder="Full Billing Name"
                                                    aria-label="Full Billing Name"
                                                />
                                                <input
                                                    type="text"
                                                    value={formData.billingCountry || ''}
                                                    onChange={e => setFormData({ ...formData, billingCountry: e.target.value })}
                                                    className="w-full h-16 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 px-8 rounded-3xl text-sm font-black text-emerald-950 dark:text-white placeholder:text-slate-600 uppercase tracking-widest outline-none focus:ring-4 focus:ring-[#FACC15]/10 transition-all shadow-sm"
                                                    placeholder="Country of Residence"
                                                    aria-label="Country of Residence"
                                                />
                                                <textarea
                                                    rows="3"
                                                    value={formData.billingAddress}
                                                    onChange={e => setFormData({ ...formData, billingAddress: e.target.value })}
                                                    className="md:col-span-2 w-full p-8 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[2.5rem] text-sm font-black text-emerald-950 dark:text-white placeholder:text-slate-600 resize-none uppercase tracking-widest outline-none focus:ring-4 focus:ring-[#FACC15]/10 transition-all shadow-sm"
                                                    placeholder="Full Billing Address"
                                                    aria-label="Full Billing Address"
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                        </div>

                    )}
                {step === 3 && (`;

const newContent = content.replace(badPart, step2Content);
fs.writeFileSync('src/components/BookingModal.jsx', newContent, 'utf8');
