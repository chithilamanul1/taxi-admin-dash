
import React from 'react'
import { Shield, Users, Clock, Award } from 'lucide-react'

const About = () => {
    return (
        <div className="pb-20 dark:bg-slate-950 transition-colors">
            {/* Header */}
            <div className="bg-emerald-900 py-20 text-center text-white px-4">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About <span className="text-emerald-600 dark:text-emerald-400">Airport Taxis (Pvt) Ltd</span></h1>
                <p className="text-white/60 max-w-2xl mx-auto text-lg">Your trusted partner for seamless airport transfers and unforgettable island tours.</p>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                    {/* Image Section */}
                    <div className="relative h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl transform md:rotate-2 hover:rotate-0 transition-all duration-500 group">
                        <img
                            src="https://images.pexels.com/photos/17654876/pexels-photo-17654876.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Sri Lanka Coast"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-emerald-900/20 group-hover:bg-transparent transition-colors"></div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-6">
                        <div>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold tracking-widest uppercase text-sm">Who We Are</span>
                            <h2 className="text-3xl font-bold text-emerald-900 dark:text-white mt-2">More than just a Taxi Service</h2>
                        </div>
                        <p className="text-gray-600 dark:text-white/60 leading-relaxed">
                            Airport Taxis (Pvt) Ltd is Sri Lanka's premier transportation provider, dedicated to offering safety, reliability, and comfort.
                            Whether you need a quick airport transfer or a multi-day island adventure, our fleet of modern vehicles and professional
                            drivers ensures a premium experience at competitive rates.
                        </p>
                        <p className="text-gray-600 dark:text-white/60 leading-relaxed">
                            We pride ourselves on 24/7 availability and transparent pricing—no hidden fees, just honest service.
                        </p>

                        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100 dark:border-white/5">
                            <div>
                                <h3 className="font-bold text-3xl text-emerald-600 dark:text-emerald-400">5k+</h3>
                                <p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase">Happy Clients</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-3xl text-emerald-600 dark:text-emerald-400">500+</h3>
                                <p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase">Tours Completed</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-3xl text-emerald-600 dark:text-emerald-400">24/7</h3>
                                <p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase">Support</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-white/5 hover:shadow-xl transition-all hover:-translate-y-1">
                        <div className="w-12 h-12 bg-emerald-900 dark:bg-white/5 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4 text-2xl border border-white/5">
                            <Shield size={24} />
                        </div>
                        <h3 className="font-bold text-lg text-emerald-900 dark:text-white mb-2">Safety First</h3>
                        <p className="text-sm text-gray-500 dark:text-white/60">All our vehicles are regularly inspected and sanitized. Our drivers are licensed professionals.</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-white/5 hover:shadow-xl transition-all hover:-translate-y-1">
                        <div className="w-12 h-12 bg-emerald-900 dark:bg-white/5 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4 text-2xl border border-white/5">
                            <Clock size={24} />
                        </div>
                        <h3 className="font-bold text-lg text-emerald-900 dark:text-white mb-2">Punctual Service</h3>
                        <p className="text-sm text-gray-500 dark:text-white/60">We track flights in real-time. We'll be there waiting for you, even if your flight is delayed.</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-white/5 hover:shadow-xl transition-all hover:-translate-y-1">
                        <div className="w-12 h-12 bg-emerald-900 dark:bg-white/5 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4 text-2xl border border-white/5">
                            <Award size={24} />
                        </div>
                        <h3 className="font-bold text-lg text-emerald-900 dark:text-white mb-2">Best Price Guarantee</h3>
                        <p className="text-sm text-gray-500 dark:text-white/60">Premium service doesn't have to cost a fortune. Enjoy luxury transfers at local rates.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About
