import React from 'react'
import { Clock, ShieldCheck, UserCheck, Star, Sparkles } from 'lucide-react'

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
        icon: <Sparkles className="w-8 h-8" />
    }
]

const Features = () => {
    return (
        <section className="py-32 bg-[#050505] relative overflow-hidden transition-colors">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFDA00]/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFDA00]/5 rounded-full blur-[100px] -ml-48 -mb-48"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20 animate-slide-up">
                    <h2 className="text-4xl md:text-5xl font-black mb-4 text-white uppercase tracking-tighter italic">
                        Why Choose <span className="text-[#FFDA00] yellow-text-glow">Airport Taxis?</span>
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                        Setting the standard for luxury transportation and tours in Sri Lanka since 2012.
                    </p>
                </div>

                <div className="grid md:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="group p-10 liquid-glass rounded-3xl border border-white/10 hover:border-[#FFDA00]/50 shadow-sm hover:shadow-2xl transition-all duration-500 animate-slide-up bg-white/5"
                            style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#FFDA00] group-hover:text-black transition-all text-[#FFDA00] border border-white/10 shadow-sm">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white group-hover:text-[#FFDA00] transition-colors uppercase tracking-tight">{feature.title}</h3>
                            <p className="text-white/60 text-sm leading-relaxed">
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
