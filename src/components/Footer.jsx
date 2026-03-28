'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Phone, Mail, MapPin, Instagram, Twitter, Facebook, ArrowUpRight } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-black pt-32 pb-12 relative overflow-hidden text-black dark:text-white border-t-8 border-[#FACC15]">
            {/* Background elements - Sharp lines */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-black/10 dark:bg-[#FACC15]/20"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-4 gap-16 mb-24">
                    {/* Brand Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <span className="text-4xl font-black tracking-tighter uppercase leading-none text-black dark:text-white">
                                    AIRPORT <span className="text-[#FACC15]">TAXIS</span>
                                </span>
                                <span className="text-[10px] font-black text-[#FACC15]/60 uppercase tracking-[0.4em] mt-2">Premier Transfer Service</span>
                            </div>
                        </div>
                        <p className="text-black/60 dark:text-white/60 max-w-md leading-relaxed font-medium text-sm border-l-4 border-[#FACC15] pl-6 uppercase tracking-tight">
                            Redefining transportation in Sri Lanka through professional excellence,
                            premium comfort, and unwavering reliability. Your trusted partner for
                            airport transfers and curated tours.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { Icon: Facebook, label: "Facebook" },
                                { Icon: Instagram, label: "Instagram" },
                                { Icon: Twitter, label: "Twitter" }
                            ].map(({ Icon, label }, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-14 h-14 bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-[#FACC15] hover:text-black transition-all border-2 border-black/10 dark:border-white/10 hover:border-black"
                                    aria-label={`Visit our ${label} page`}
                                >
                                    <Icon size={24} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 gap-8 lg:col-span-1">
                        <div className="space-y-8">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#FACC15] border-b-2 border-[#FACC15]/20 pb-2 inline-block">Explore</h3>
                            <ul className="space-y-4 text-black/50 dark:text-white/50 text-[11px] font-black uppercase tracking-widest">
                                <li><Link href="/" className="hover:text-[#FACC15] transition-colors">Home</Link></li>
                                <li><Link href="/day-trips" className="hover:text-[#FACC15] transition-colors">Day Trips</Link></li>
                                <li><Link href="/tour-packages" className="hover:text-[#FACC15] transition-colors">Tour Packages</Link></li>
                                <li><Link href="/prices" className="hover:text-[#FACC15] transition-colors">Taxi Rates</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-8">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#FACC15] border-b-2 border-[#FACC15]/20 pb-2 inline-block">Legal</h3>
                            <ul className="space-y-4 text-black/50 dark:text-white/50 text-[11px] font-black uppercase tracking-widest">
                                <li><Link href="/privacy-policy" className="hover:text-[#FACC15] transition-colors">Privacy</Link></li>
                                <li><Link href="/terms" className="hover:text-[#FACC15] transition-colors">Terms</Link></li>
                                <li><Link href="/refund-policy" className="hover:text-[#FACC15] transition-colors">Refunds</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#FACC15] border-b-2 border-[#FACC15]/20 pb-2 inline-block">Get in Touch</h3>
                        <ul className="space-y-6 text-black/80 dark:text-white/80 text-xs font-black uppercase tracking-tight">
                            <li className="flex gap-4 group">
                                <div className="w-10 h-10 bg-[#FACC15] text-black flex items-center justify-center shrink-0" aria-hidden="true">
                                    <MapPin size={18} />
                                </div>
                                <span className="pt-2">118/5 St. Joseph Street, Grandpass, Colombo 14</span>
                            </li>
                            <li className="flex gap-4 group">
                                <div className="w-10 h-10 bg-[#FACC15] text-black flex items-center justify-center shrink-0" aria-hidden="true">
                                    <Phone size={18} />
                                </div>
                                <a href="tel:+94716885880" className="hover:text-[#FACC15] pt-2">+94 71 688 5880</a>
                            </li>
                            <li className="flex gap-4 group">
                                <div className="w-10 h-10 bg-[#FACC15] text-black flex items-center justify-center shrink-0" aria-hidden="true">
                                    <Mail size={18} />
                                </div>
                                <a href="mailto:info@srilankantaxi.lk" className="hover:text-[#FACC15] pt-2">info@srilankantaxi.lk</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Service Directory - SEO Keyword Cloud (Subtle) */}
                <div className="pt-8 border-t border-black/5 dark:border-white/5 mt-12">
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-[8px] font-black uppercase tracking-widest text-black/20 dark:text-white/20">
                        <span>Airport Taxi Service</span>
                        <span>Taxi Booking Sri Lanka</span>
                        <span>Colombo Airport Transfer</span>
                        <span>Airport Cab Booking</span>
                        <span>Airport Taxi Transfers</span>
                        <span>Airport Shuttle Service</span>
                        <span>Airport Car Service</span>
                        <span>Taxi Van to Airport</span>
                        <span>Sri Lanka Airport Taxi Price</span>
                        <span>Airport Transfer Service</span>
                        <span>Taxi for Airport Transfer</span>
                        <span>Katunayake Airport Taxi</span>
                        <span>Airport Pickup Service</span>
                        <span>Cheap Airport Taxi</span>
                        <span>Private Taxi Hire</span>
                        <span>Minivan Taxi Sri Lanka</span>
                        <span>One-Way Taxi Sri Lanka</span>
                        <span>Airport Drop Service</span>
                        <span>Colombo City Taxi</span>
                        <span>KDH Van Rental</span>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t-2 border-black/10 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] text-black/40 dark:text-white/40 font-black uppercase tracking-[0.3em]">
                        © 2026 Airport Taxis Pvt (Ltd). Sri Lankan Excellence.
                    </p>
                    <a href="https://seranex.org" target="_blank" className="group flex items-center gap-1.5 text-[10px] text-black/40 dark:text-white/40 font-black hover:text-[#FACC15] transition-all uppercase tracking-[0.2em]">
                        Developed by <span className="text-black dark:text-white group-hover:text-[#FACC15]">Chithila Manul</span>
                        <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer
