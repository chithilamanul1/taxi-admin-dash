'use client';

import React from 'react'
import { Shield, Users, Clock, Award, MapPin, Phone, Mail, ArrowRight, History, Heart, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const About = () => {
    return (
        <div className="pt-32 pb-32 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
            {/* Cinematic Hero */}
            <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0 scale-105 overflow-hidden">
                    <img
                        src="https://images.pexels.com/photos/17654876/pexels-photo-17654876.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1"
                        alt="Sri Lanka Coast"
                        className="w-full h-full object-cover brightness-[0.4] group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-slate-50/100 dark:to-slate-950/100"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative z-10 text-center px-6 max-w-4xl"
                >
                    <div className="inline-flex items-center gap-2 bg-amber-400 px-4 py-1.5 mb-8 transform -rotate-1">
                        <History size={14} className="text-black" strokeWidth={3} />
                        <span className="text-xs font-black text-black uppercase tracking-[0.2em]">Our Legacy Since 2010</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.9]">
                        Elevating <span className="text-amber-400">Sri Lanka's </span> <br />
                        Travel Experience
                    </h1>
                    <p className="text-white/80 max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed">
                        From humble beginnings to being the island's most trusted transfer partner.
                        We don't just move people; we create journeys that last a lifetime.
                    </p>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-32">
                    {[
                        { label: 'Happy Clients', value: '10k+', icon: <Users className="text-amber-400" /> },
                        { label: 'Tours Completed', value: '1.2k+', icon: <MapPin className="text-amber-400" /> },
                        { label: 'Experience Years', value: '14+', icon: <Award className="text-amber-400" /> },
                        { label: 'Expert Drivers', value: '80+', icon: <Shield className="text-amber-400" /> },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none text-center group hover:scale-[1.05] transition-all"
                        >
                            <div className="w-12 h-12 bg-slate-900 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                                {stat.icon}
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">{stat.value}</h3>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em]">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-20 items-center mb-40">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="relative"
                    >
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-blue-400/10 rounded-full blur-3xl"></div>

                        <div className="relative z-10 aspect-[4/5] rounded-[3rem] overflow-hidden border-8 border-white dark:border-slate-800 shadow-2xl bg-slate-200 dark:bg-slate-800">
                            <img
                                src="/images/ceo.jpg"
                                alt="Our CEO"
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                onError={(e) => {
                                    e.target.src = "https://images.pexels.com/photos/1643330/pexels-photo-1643330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                }}
                            />
                            <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem]">
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-black font-black italic shadow-lg">5★</div>
                                    <div>
                                        <p className="text-white font-black text-sm uppercase tracking-widest">Average Rating</p>
                                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest leading-none mt-1">From 2,000+ Reviews</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="space-y-10"
                    >
                        <div>
                            <span className="inline-block text-amber-500 font-black tracking-[0.2em] uppercase text-xs mb-4">Behind the scenes</span>
                            <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-[0.95] uppercase tracking-tighter">
                                More than just a <br />
                                <span className="text-amber-400">Taxi Service</span>
                            </h2>
                        </div>

                        <div className="space-y-6 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                            <p className="font-bold text-slate-900 dark:text-slate-200">
                                Airport Taxis (Pvt) Ltd is Sri Lanka's premier transportation provider, dedicated to offering safety, reliability, and comfort.
                            </p>
                            <p>
                                Whether you need a quick airport transfer or a multi-day island adventure, our fleet of modern vehicles and professional drivers ensures a premium experience at competitive rates.
                            </p>
                            <p>
                                We pride ourselves on 24/7 availability and transparent pricing. No hidden fees, no surge pricing—just honest, local service with a commitment to excellence that has defined us for over a decade.
                            </p>
                        </div>

                        <ul className="space-y-4 pt-6">
                            {[
                                "Island-wide Coverage & Transfers",
                                "Professional English-Speaking Drivers",
                                "Real-time Flight Tracking Assistance",
                                "Complimentary Bottled Water & WiFi"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-slate-700 dark:text-slate-300 font-bold">
                                    <div className="w-6 h-6 bg-amber-400/20 text-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <CheckCircle size={14} strokeWidth={3} />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Values Section */}
                <div className="text-center mb-16">
                    <span className="text-amber-500 font-black tracking-[0.3em] uppercase text-xs mb-4 block">Our Core Principles</span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">The Values that Drive Us</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            title: 'Safety First',
                            desc: 'All our vehicles undergo rigorous weekly inspections and daily sanitization protocols.',
                            icon: <Shield size={28} strokeWidth={3} />,
                            color: 'amber'
                        },
                        {
                            title: 'Punctual Service',
                            desc: 'We track flights in real-time. We\'ll be there waiting for you, even if your flight is delayed by hours.',
                            icon: <Clock size={28} strokeWidth={3} />,
                            color: 'amber'
                        },
                        {
                            title: 'Best Price Guarantee',
                            desc: 'Premium service doesn\'t have to cost a fortune. Enjoy luxury transfers at local, transparent rates.',
                            icon: <Award size={28} strokeWidth={3} />,
                            color: 'amber'
                        }
                    ].map((value, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl dark:shadow-none hover:shadow-2xl hover:border-amber-400/30 transition-all group"
                        >
                            <div className="w-16 h-16 bg-slate-900 dark:bg-amber-400/5 text-amber-400 rounded-3xl flex items-center justify-center mb-8 text-2xl group-hover:scale-110 transition-transform">
                                {value.icon}
                            </div>
                            <h3 className="font-black text-2xl text-slate-900 dark:text-white mb-4 uppercase tracking-tight leading-none">{value.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{value.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default About
