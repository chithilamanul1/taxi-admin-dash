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
        title: 'VIP Meet & Greet',
        description: 'Personalized arrival hall reception with name boards for a seamless start.',
        icon: <Sparkles className="w-8 h-8" />
    }
]

const Features = () => {
    return (
        <section className="py-32 bg-emerald-50/50 dark:bg-emerald-950/20 relative overflow-hidden transition-colors">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/5 rounded-full blur-[100px] -mr-64 -mt-64"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20 animate-slide-up">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-emerald-900 dark:text-white font-heading">
                        Why Choose <span className="text-emerald-700 dark:text-emerald-400">Airport Taxis?</span>
                    </h2>
                    <p className="text-emerald-900/80 dark:text-white/80 max-w-2xl mx-auto text-lg">
                        Setting the standard for luxury transportation and tours in Sri Lanka since 2012.
                    </p>
                </div>

                <div className="grid md:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="group p-10 bg-white dark:bg-slate-900 rounded-3xl border border-emerald-900/10 dark:border-white/5 hover:border-emerald-600 shadow-sm hover:shadow-xl transition-all duration-500 animate-slide-up"
                            style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                            <div className="w-16 h-16 bg-emerald-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-emerald-900 dark:group-hover:bg-emerald-500 group-hover:text-white transition-all text-emerald-700 dark:text-emerald-400 border border-emerald-900/5 dark:border-white/5 shadow-sm">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-emerald-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{feature.title}</h3>
                            <p className="text-emerald-900/80 dark:text-white/80 text-sm leading-relaxed">
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
