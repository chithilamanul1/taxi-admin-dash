'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Phone, Mail, MapPin, Instagram, Twitter, Facebook, ArrowUpRight } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-emerald-950 pt-32 pb-12 relative overflow-hidden text-white">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-4 gap-16 mb-24">
                    {/* Brand Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <span className="text-2xl font-black tracking-tighter">
                                    AIRPORT <span className="text-amber-400">TAXIS</span>
                                </span>
                                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest opacity-80">Pvt (Ltd)</span>
                            </div>
                        </div>
                        <p className="text-white/80 max-w-md leading-relaxed">
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
                                    className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-amber-400 hover:text-black transition-all border border-white/5"
                                    aria-label={`Visit our ${label} page`}
                                >
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 gap-8 lg:col-span-1">
                        <div className="space-y-6">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-amber-400">Explore</h4>
                            <ul className="space-y-4 text-white/60 text-sm font-medium">
                                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                                <li><Link href="/day-trips" className="hover:text-white transition-colors">Day Trips</Link></li>
                                <li><Link href="/tour-packages" className="hover:text-white transition-colors">Tour Packages</Link></li>
                                <li><Link href="/prices" className="hover:text-white transition-colors">Taxi Rates Guide</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-amber-400">Legal</h4>
                            <ul className="space-y-4 text-white/60 text-sm font-medium">
                                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link></li>
                                <li><Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-amber-400">Get in Touch</h4>
                        <ul className="space-y-4 text-white/60 text-sm font-medium">
                            <li className="flex gap-4">
                                <MapPin size={18} className="text-amber-400 shrink-0" />
                                <span>118/5 St. Joseph Street, Grandpass, Colombo 14</span>
                            </li>
                            <li className="flex gap-4">
                                <Phone size={18} className="text-amber-400 shrink-0" />
                                <a href="tel:+94722885885" className="hover:text-white">+94 722 885 885</a>
                            </li>
                            <li className="flex gap-4">
                                <Mail size={18} className="text-amber-400 shrink-0" />
                                <a href="mailto:info@airporttaxis.lk" className="hover:text-white">info@airporttaxis.lk</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-white/80 font-medium uppercase tracking-widest">
                        © 2026 Airport Taxis Pvt (Ltd). All rights reserved.
                    </p>
                    <a href="https://seranex.org" target="_blank" className="group flex items-center gap-1.5 text-xs text-white/80 font-bold hover:text-white transition-all uppercase tracking-widest">
                        Developed by <span className="text-white">Chithila Manul</span>
                        <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                </div>
            </div>

            {/* Bottom Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none"></div>
        </footer>
    )
}

export default Footer
