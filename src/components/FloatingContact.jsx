'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { MessageCircle, Mail, X, PhoneCall } from 'lucide-react'

export default function FloatingContact() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const isAdminRoute = pathname.startsWith('/admin')
    if (isAdminRoute) return null

    return (
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] flex flex-col items-end gap-3 md:gap-4 scale-75 sm:scale-90 md:scale-100 origin-bottom-right">
            {/* Action Buttons */}
            {isOpen && (
                <div className="flex flex-col gap-3 animate-slide-up">
                    {/* Live Chat Button */}
                    <button
                        onClick={() => {
                            window.dispatchEvent(new CustomEvent('open-live-chat'));
                            setIsOpen(false);
                        }}
                        className="group flex items-center gap-4"
                    >
                        <span className="bg-emerald-900 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-wider">Live Chat</span>
                        <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                            <MessageCircle size={24} />
                        </div>
                    </button>

                    <a
                        href="https://wa.me/94716885880"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-4"
                    >
                        <span className="bg-emerald-900 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-wider">WhatsApp Chat</span>
                        <div className="w-14 h-14 bg-[#25D366] text-white rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.3)] hover:scale-110 transition-transform">
                            <MessageCircle size={24} />
                        </div>
                    </a>

                    <a
                        href="mailto:info@airporttaxi.lk"
                        className="group flex items-center gap-4"
                    >
                        <span className="bg-emerald-900 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-wider">Email Us</span>
                        <div className="w-14 h-14 bg-white text-emerald-900 rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform border border-emerald-900/10">
                            <Mail size={24} />
                        </div>
                    </a>
                </div>
            )}

            {/* Animated Prompt */}
            {!isOpen && (
                <div className="absolute bottom-5 right-20 bg-[#0F172A] text-white text-[10px] font-black tracking-widest px-3 py-2 rounded-lg shadow-xl whitespace-nowrap animate-bounce-horizontal z-[90] flex items-center">
                    LIVE CHAT
                    <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-[#0F172A] rotate-45"></div>
                </div>
            )}

            {/* Main Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 z-[100] ${isOpen ? 'bg-white text-emerald-900 rotate-90 border border-emerald-900/10' : 'bg-emerald-900 text-white shadow-[0_15px_40px_-10px_rgba(6,78,59,0.4)]'}`}
                aria-label={isOpen ? "Close contact menu" : "Open contact menu"}
            >
                {isOpen ? <X size={28} /> : (
                    <div className="relative">
                        <MessageCircle size={32} />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-emerald-900 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                        </span>
                    </div>
                )}
            </button>
        </div>
    )
}
