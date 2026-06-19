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
                            <span className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight uppercase leading-none text-white whitespace-nowrap">
                                AIRPORT TAXIS <span className="text-[#FACC15]">(PVT) LTD</span>
                            </span>
                            <span className="text-[9px] font-black text-[#FACC15]/80 uppercase tracking-[0.3em] mt-1.5">Private Limited Company</span>
                        </div>
                        <p className="text-white/60 max-w-sm leading-relaxed font-medium text-[11px] border-l-2 border-[#FACC15] pl-4 uppercase tracking-wider">
                            Redefining transportation in Sri Lanka through professional excellence,
                            premium comfort, and unwavering reliability.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { Icon: Facebook, label: "Facebook", url: "https://www.facebook.com/airporttaxistours" },
                                { Icon: Instagram, label: "Instagram", url: "https://www.instagram.com/airporttaxistours" },
                                { Icon: Twitter, label: "Twitter", url: "https://twitter.com/airporttaxistours" }
                            ].map(({ Icon, label, url }, i) => (
                                <a
                                    key={i}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={`Visit our ${label} page (opens in new tab)`}
                                    className="w-10 h-10 bg-white/5 flex items-center justify-center hover:bg-[#FACC15] hover:text-black transition-all border border-white/10 hover:border-[#FACC15] rounded-xl focus-visible:ring-2 focus-visible:ring-[#FACC15] focus-visible:outline-none"
                                    aria-label={`Visit our ${label} page (opens in new tab)`}
                                >
                                    <Icon size={16} aria-hidden="true" />
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
                                <li><Link href="/gallery" className="hover:text-[#FACC15] transition-colors">Our Fleet</Link></li>
                                <li><Link href="/reviews" className="hover:text-[#FACC15] transition-colors">Testimonials</Link></li>
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
                                <div className="flex flex-col pt-1.5 gap-1.5">
                                    <a href="mailto:info@srilankantaxi.lk" className="hover:text-[#FACC15]">info@srilankantaxi.lk</a>
                                    <a href="mailto:support@srilankantaxi.lk" className="hover:text-[#FACC15]">support@srilankantaxi.lk</a>
                                    <a href="mailto:support@touris.lk" className="hover:text-[#FACC15]">support@touris.lk</a>
                                    <a href="mailto:support@tourtaxi.lk" className="hover:text-[#FACC15]">support@tourtaxi.lk</a>
                                    <a href="mailto:support@airporttaxicab.lk" className="hover:text-[#FACC15]">support@airporttaxicab.lk</a>
                                    <a href="mailto:customer@airporttaxis.lk" className="hover:text-[#FACC15]">customer@airporttaxis.lk</a>
                                    <a href="mailto:support@airporttaxis.lk" className="hover:text-[#FACC15]">support@airporttaxis.lk</a>
                                </div>
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

                {/* Additional Info */}
                <div className="pt-6 mt-8 flex flex-col gap-8 border-t border-[#FACC15]">
                    <div className="flex flex-col gap-3 items-center md:items-start">
                        <h4 className="text-white text-base md:text-lg font-bold tracking-wide leading-none">Our Partner Network</h4>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            {['airportcab.lk', 'srilankantaxi.lk', 'airporttaxicab.lk', 'taxiairport.lk', 'touris.lk', 'tourtaxi.lk'].map((company, idx) => (
                                <a key={idx} href={`https://${company}`} target="_blank" rel="noopener noreferrer" title={`Visit ${company} (opens in new tab)`} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#FACC15] hover:bg-[#FACC15]/10 hover:text-[#FACC15] text-white/70 text-[10px] font-black uppercase tracking-widest transition-all focus-visible:ring-2 focus-visible:ring-[#FACC15] focus-visible:outline-none">
                                    {company}
                                </a>
                            ))}
                        </div>
                    </div>
                    {/* Payment section */}
                    <div className="flex flex-col gap-3 items-center md:items-start">
                        <div className="flex flex-col gap-2 items-center md:items-start">
                            <h4 className="text-white text-base md:text-lg font-bold tracking-wide leading-none">Ways You Can Pay</h4>
                            
                            {/* Paycorp / Bancstac Auth Badge */}
                            <div className="flex items-center gap-2 mb-1">
                                <div className="bg-white px-2 py-1.5 rounded flex items-center gap-2 shadow-sm">
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-0.5">
                                            <div className="flex">
                                                <div className="w-1 h-1.5 bg-[#1F2B3E] rotate-45 transform origin-bottom-left -translate-y-0.5"></div>
                                                <div className="w-1 h-1.5 bg-[#1F2B3E] rotate-45 transform origin-bottom-left -translate-y-0.5"></div>
                                                <div className="w-1 h-1.5 bg-[#1F2B3E] rotate-45 transform origin-bottom-left -translate-y-0.5"></div>
                                            </div>
                                            <span className="text-[#1F2B3E] font-black text-[9px] tracking-wide leading-none">Paycorp</span>
                                        </div>
                                        <span className="text-[#1F2B3E] font-medium text-[4px] italic leading-none">International</span>
                                    </div>
                                    <div className="w-px h-5 bg-slate-300"></div>
                                    <div className="flex items-center">
                                        <div className="relative w-3 h-3 rounded-full border border-red-500 border-t-blue-500 border-r-blue-500 border-l-red-500 flex items-center justify-center mr-1"></div>
                                        <span className="text-[#0055A5] font-black text-[9px] tracking-wider uppercase">Bancstac</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 w-fit">
                            {/* PayPal */}
                            <div className="bg-white rounded flex items-center justify-center w-[56px] h-[36px] shadow-sm">
                                <span className="text-[#003087] font-bold text-[11px] italic">Pay</span><span className="text-[#009cde] font-bold text-[11px] italic">Pal</span>
                            </div>
                            {/* Mastercard */}
                            <div className="bg-white rounded flex flex-col items-center justify-center w-[56px] h-[36px] shadow-sm">
                                <div className="flex items-center justify-center mt-0.5">
                                    <div className="w-4 h-4 rounded-full bg-[#eb001b] opacity-90"></div>
                                    <div className="w-4 h-4 rounded-full bg-[#f79e1b] opacity-90 -ml-2"></div>
                                </div>
                                <span className="text-[5px] text-black font-medium mt-0.5">mastercard</span>
                            </div>
                            {/* Visa */}
                            <div className="bg-white rounded flex items-center justify-center w-[56px] h-[36px] shadow-sm">
                                <span className="text-[#1434CB] font-black italic text-[16px] tracking-tighter">VISA</span>
                            </div>
                            {/* Maestro */}
                            <div className="bg-white rounded flex flex-col items-center justify-center w-[56px] h-[36px] shadow-sm">
                                <div className="flex items-center justify-center mt-0.5">
                                    <div className="w-4 h-4 rounded-full bg-[#eb001b] opacity-90"></div>
                                    <div className="w-4 h-4 rounded-full bg-[#00aadd] opacity-90 -ml-2"></div>
                                </div>
                                <span className="text-[5px] text-black font-medium mt-0.5">maestro</span>
                            </div>
                            {/* Amex */}
                            <div className="bg-[#2671B9] rounded flex items-center justify-center w-[56px] h-[36px] shadow-sm">
                                <span className="text-white font-black text-[10px] leading-[10px] text-center">AM<br/>EX</span>
                            </div>
                            {/* JCB */}
                            <div className="bg-white rounded flex items-center justify-center w-[56px] h-[36px] gap-[1px] shadow-sm">
                                <span className="text-blue-700 font-black text-[13px]">J</span>
                                <span className="text-red-600 font-black text-[13px]">C</span>
                                <span className="text-green-600 font-black text-[13px]">B</span>
                            </div>
                            {/* Discover */}
                            <div className="bg-white rounded flex flex-col items-center justify-center w-[56px] h-[36px] shadow-sm">
                                <span className="text-orange-500 font-black text-[8px] leading-[8px]">DISCOVER</span>
                                <span className="text-black font-medium text-[4px] leading-[4px]">NETWORK</span>
                            </div>
                            {/* Diners Club */}
                            <div className="bg-white rounded flex flex-col items-center justify-center w-[56px] h-[36px] shadow-sm">
                                <div className="w-4 h-4 rounded-full border border-[#004B87] flex items-center justify-center mt-0.5 overflow-hidden">
                                    <div className="w-1.5 h-2.5 bg-[#004B87] flex items-center justify-center">
                                        <div className="w-0.5 h-full bg-white"></div>
                                    </div>
                                </div>
                                <span className="text-[#004B87] font-serif text-[4px] mt-0.5 leading-[4px] tracking-tight">Diners Club</span>
                                <span className="text-[#004B87] font-serif text-[3px] leading-[3px] tracking-tighter">INTERNATIONAL</span>
                            </div>
                            {/* Klarna */}
                            <div className="bg-[#FFA8C2] rounded flex items-center justify-center w-[56px] h-[36px] shadow-sm">
                                <span className="text-black font-black text-[12px]">Klarna.</span>
                            </div>
                            {/* G Pay */}
                            <div className="bg-white rounded flex items-center justify-center w-[56px] h-[36px] gap-1 shadow-sm">
                                <span className="text-red-500 font-bold text-[12px]">G</span> <span className="text-slate-600 font-bold text-[11px]">Pay</span>
                            </div>
                            {/* Apple Pay */}
                            <div className="bg-white rounded flex items-center justify-center w-[56px] h-[36px] gap-0.5 text-black shadow-sm">
                                <span className="font-bold text-[13px]"></span> <span className="font-bold text-[11px]">Pay</span>
                            </div>
                            {/* iDeal */}
                            <div className="bg-[#FFF0B3] rounded flex flex-col items-center justify-center w-[56px] h-[36px] shadow-sm relative">
                                <div className="bg-[#cc0066] text-white text-[6px] font-black italic px-1.5 py-0.5 rounded-sm absolute top-1.5 left-1/2 -translate-x-1/2">iDEAL</div>
                                <span className="text-black font-black text-[7px] mt-4 uppercase">wero</span>
                            </div>
                            {/* Bancontact */}
                            <div className="bg-white rounded flex flex-col items-center justify-between w-[56px] h-[36px] overflow-hidden shadow-sm">
                                <div className="bg-[#FF2C70] w-full text-center text-white text-[6px] font-bold py-[2px]">payconiq</div>
                                <div className="w-full flex items-center justify-center flex-1">
                                    <div className="text-[#004A99] font-bold text-[6px]">Bancontact</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 mt-6 border-t border-[#FACC15] flex flex-col md:flex-row justify-between items-center gap-4">
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
