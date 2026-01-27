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
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                                <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black tracking-tighter">
                                    AIRPORT <span className="text-emerald-400">TAXIS</span>
                                </span>
                                <span className="text-[10px] font-bold text-emerald-400/70 uppercase tracking-widest">Sri Lanka (Pvt) Ltd</span>
                            </div>
                        </div>
                        <p className="text-white/60 max-w-md leading-relaxed">
                            Redefining transportation in Sri Lanka through professional excellence,
                            premium comfort, and unwavering reliability. Your trusted partner for
                            airport transfers and curated tours.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-emerald-400 hover:text-emerald-900 transition-all border border-white/5">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 gap-8 lg:col-span-1">
                        <div className="space-y-6">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-400">Explore</h4>
                            <ul className="space-y-4 text-white/60 text-sm font-medium">
                                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                                <li><Link href="/day-trips" className="hover:text-white transition-colors">Day Trips</Link></li>
                                <li><Link href="/tour-packages" className="hover:text-white transition-colors">Tour Packages</Link></li>
                                <li><Link href="/prices" className="hover:text-white transition-colors">Rate Guide</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-400">Legal</h4>
                            <ul className="space-y-4 text-white/60 text-sm font-medium">
                                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link></li>
                                <li><Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-400">Get in Touch</h4>
                        <ul className="space-y-4 text-white/60 text-sm font-medium">
                            <li className="flex gap-4">
                                <MapPin size={18} className="text-emerald-400 shrink-0" />
                                <span>118/5 St. Joseph Street, Grandpass, Colombo 14</span>
                            </li>
                            <li className="flex gap-4">
                                <Phone size={18} className="text-emerald-400 shrink-0" />
                                <a href="tel:+94722885885" className="hover:text-white">+94 722 885 885</a>
                            </li>
                            <li className="flex gap-4">
                                <Mail size={18} className="text-emerald-400 shrink-0" />
                                <a href="mailto:info@airporttaxi.lk" className="hover:text-white">info@airporttaxi.lk</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-white/60 font-medium uppercase tracking-widest">
                        © 2026 Airport Taxis (Pvt) Ltd. All rights reserved.
                    </p>
                    <a href="https://seranex.org" target="_blank" className="group flex items-center gap-1.5 text-xs text-white/60 font-bold hover:text-white transition-all uppercase tracking-widest">
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
