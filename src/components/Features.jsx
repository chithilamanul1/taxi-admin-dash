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
        <section className="py-32 bg-white dark:bg-black relative overflow-hidden transition-colors border-t border-black/5 dark:border-white/5">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-28 animate-slide-up">
                    <div className="yellow-badge mb-8 mx-auto">
                        The Standard
                    </div>
                    <h2 className="text-5xl md:text-8xl font-black mb-6 text-black dark:text-white uppercase italic tracking-tighter leading-none">
                        WHY <span className="text-[#FACC15]">CHOOSE US?</span>
                    </h2>
                    <p className="text-black/40 dark:text-white/40 max-w-2xl mx-auto text-sm font-black uppercase tracking-[0.2em]">
                        Setting the standard for luxury transportation since 2012.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="stat-card group animate-slide-up"
                            style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                            <div className="w-16 h-16 bg-[#FACC15] text-black flex items-center justify-center mb-10 group-hover:bg-black group-hover:text-[#FACC15] transition-all rounded-2xl">
                                {feature.icon}
                            </div>
                            <h3 className="text-3xl font-black mb-6 text-black dark:text-white group-hover:text-black transition-colors uppercase italic tracking-tighter leading-none">{feature.title}</h3>
                            <p className="text-black/40 dark:text-white/40 group-hover:text-black/60 text-xs font-black uppercase tracking-widest leading-relaxed transition-colors">
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
