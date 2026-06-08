'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Phone, Mail, MapPin, Instagram, Twitter, Facebook, ArrowUpRight } from 'lucide-react'
import { usePathname } from 'next/navigation'

const Footer = () => {
    const pathname = usePathname()
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/driver')) return null

    return (
        <footer className="bg-[#0a0a0a] pt-16 pb-8 md:pb-8 relative overflow-hidden text-white border-t-4 border-[#FACC15]">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex flex-col">
                            <span className="text-3xl font-extrabold tracking-tight uppercase leading-none text-white">
                                AIRPORT TAXIS <span className="text-[#FACC15]">PVT LTD</span>
                            </span>
                            <span className="text-[9px] font-black text-[#FACC15]/80 uppercase tracking-[0.3em] mt-1.5">Private Limited Company</span>
                        </div>
                        <p className="text-white/60 max-w-sm leading-relaxed font-medium text-[11px] border-l-2 border-[#FACC15] pl-4 uppercase tracking-wider">
                            Redefining transportation in Sri Lanka through professional excellence,
                            premium comfort, and unwavering reliability.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { Icon: Facebook, label: "Facebook" },
                                { Icon: Instagram, label: "Instagram" },
                                { Icon: Twitter, label: "Twitter" }
                            ].map(({ Icon, label }, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 bg-white/5 flex items-center justify-center hover:bg-[#FACC15] hover:text-black transition-all border border-white/10 hover:border-[#FACC15] rounded-xl"
                                    aria-label={`Visit our ${label} page`}
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 gap-6 lg:col-span-1">
                        <div className="space-y-5">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FACC15] border-b border-[#FACC15]/20 pb-2 inline-block">Explore</h3>
                            <ul className="space-y-3 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                                <li><Link href="/" className="hover:text-[#FACC15] transition-colors">Home</Link></li>
                                <li><Link href="/day-trips" className="hover:text-[#FACC15] transition-colors">Day Trips</Link></li>
                                <li><Link href="/tour-packages" className="hover:text-[#FACC15] transition-colors">Tour Packages</Link></li>
                                <li><Link href="/prices" className="hover:text-[#FACC15] transition-colors">Taxi Rates</Link></li>
                                <li><Link href="/gallery" className="hover:text-[#FACC15] transition-colors">Gallery</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-5">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FACC15] border-b border-[#FACC15]/20 pb-2 inline-block">Legal</h3>
                            <ul className="space-y-3 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                                <li><Link href="/privacy-policy" className="hover:text-[#FACC15] transition-colors">Privacy</Link></li>
                                <li><Link href="/terms" className="hover:text-[#FACC15] transition-colors">Terms</Link></li>
                                <li><Link href="/refund-policy" className="hover:text-[#FACC15] transition-colors">Refunds</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-5">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FACC15] border-b border-[#FACC15]/20 pb-2 inline-block">Get in Touch</h3>
                        <ul className="space-y-4 text-white/80 text-[10px] font-bold uppercase tracking-tight">
                            <li className="flex gap-3 group">
                                <div className="w-8 h-8 bg-[#FACC15] text-black flex items-center justify-center shrink-0 rounded-lg" aria-hidden="true">
                                    <MapPin size={14} />
                                </div>
                                <span className="pt-1.5">118/5 St. Joseph St, Colombo 14</span>
                            </li>
                            <li className="flex gap-3 group">
                                <div className="w-8 h-8 bg-[#FACC15] text-black flex items-center justify-center shrink-0 rounded-lg" aria-hidden="true">
                                    <Phone size={14} />
                                </div>
                                <a href="tel:+94716885880" className="hover:text-[#FACC15] pt-1.5">+94 71 688 5880</a>
                            </li>
                            <li className="flex gap-3 group">
                                <div className="w-8 h-8 bg-[#FACC15] text-black flex items-center justify-center shrink-0 rounded-lg" aria-hidden="true">
                                    <Mail size={14} />
                                </div>
                                <a href="mailto:info@srilankantaxi.lk" className="hover:text-[#FACC15] pt-1.5">info@srilankantaxi.lk</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Service Directory - SEO Keyword Cloud (Subtle) */}
                <div className="pt-6 border-t border-white/5 mt-8 hidden sm:block">
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[7px] font-black uppercase tracking-widest text-white/20">
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
                        <span>Katunayake Airport Taxi</span>
                        <span>Airport Pickup Service</span>
                        <span>Cheap Airport Taxi</span>
                        <span>Private Taxi Hire</span>
                        <span>Minivan Taxi Sri Lanka</span>
                        <span>One-Way Taxi Sri Lanka</span>
                        <span>Colombo City Taxi</span>
                        <span>KDH Van Rental</span>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 mt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.2em]">
                        © 2026 Airport Taxis Pvt Ltd. Sri Lankan Excellence.
                    </p>
                    <a href="https://seranex.org" target="_blank" className="group flex items-center gap-1.5 text-[9px] text-white/40 font-black hover:text-[#FACC15] transition-all uppercase tracking-[0.2em]">
                        Developed by <span className="text-white group-hover:text-[#FACC15]">Chithila Manul</span>
                        <ArrowUpRight size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer
