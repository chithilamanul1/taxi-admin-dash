import React from 'react'
import { Clock, ShieldCheck, UserCheck, Star, IdCard } from 'lucide-react'

const features = [
    {
        title: '24/7 Availability',
        description: 'Elite airport transfers around the clock, ensuring you never miss a connection.',
        icon: <Clock className="w-8 h-8" />
    },
    {
        title: 'Fixed Transparent Rates',
        description: 'No hidden fees or surprises. What you see is exactly what you pay.',
        icon: <ShieldCheck className="w-8 h-8" />
    },
    {
        title: 'Bilingual Chauffeurs',
        description: 'Professional, courteous, and highly experienced English-speaking guides.',
        icon: <UserCheck className="w-8 h-8" />
    },
    {
        title: 'Driver with Name Sign',
        description: 'Personalized arrival hall reception with display name boards for a seamless start.',
        icon: <IdCard className="w-8 h-8" />
    }
]

const Features = () => {
    return (
        <section className="py-12 md:py-16 bg-white dark:bg-black relative overflow-hidden transition-colors border-t border-black/5 dark:border-white/5">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-12 animate-slide-up">
                    <div className="yellow-badge mb-4 mx-auto text-[10px] px-4 py-1.5 rounded-lg">
                        The Standard
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-black dark:text-white uppercase tracking-tight leading-none">
                        WHY <span className="text-[#FACC15]">CHOOSE US?</span>
                    </h2>
                    <p className="text-black/60 dark:text-white/60 max-w-2xl mx-auto text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
                        Setting the standard for luxury transportation since 2012.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className={`stat-card group animate-slide-up p-6 rounded-2xl border border-black dark:border-white/20 shadow-sm hover:shadow-md transition-shadow ${
                                idx === 1 ? 'bg-[#FF4500]' : 'bg-white dark:bg-zinc-900'
                            }`}
                            style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                            <div className={`w-12 h-12 flex items-center justify-center mb-4 transition-all rounded-xl ${
                                idx === 1 
                                    ? 'bg-black text-[#FACC15]' 
                                    : 'bg-[#FACC15] text-black group-hover:bg-black group-hover:text-[#FACC15]'
                            }`}>
                                {React.cloneElement(feature.icon, { className: "w-6 h-6" })}
                            </div>
                            <h3 className={`text-xl md:text-2xl font-black mb-3 transition-colors uppercase tracking-tight leading-none ${
                                idx === 1 
                                    ? 'text-black' 
                                    : 'text-black dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400'
                            }`}>{feature.title}</h3>
                            <p className={`text-[10px] font-bold uppercase tracking-widest leading-relaxed transition-colors ${
                                idx === 1 
                                    ? 'text-black/80' 
                                    : 'text-black/60 dark:text-white/60 group-hover:text-black/80 dark:group-hover:text-white/80'
                            }`}>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Features
