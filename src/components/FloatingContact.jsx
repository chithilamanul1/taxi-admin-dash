'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { MessageCircle, Mail, X } from 'lucide-react'

export default function FloatingContact() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const isExcludedPage = ['/admin', '/checkout', '/payment/success'].includes(pathname)
    if (isExcludedPage) return null

    return (
        <div className="fixed bottom-24 md:bottom-6 right-6 z-[9999] flex flex-col items-end gap-4">
            {isOpen && (
                <div className="flex flex-col gap-4 animate-fade-in-up">
                    <a
                        href="https://wa.me/94716885880"
                        className="group flex items-center gap-3 justify-end"
                        aria-label="Contact us on WhatsApp"
                    >
                        <span className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 whitespace-nowrap shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">WhatsApp Us</span>
                        <div className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md">
                            <MessageCircle size={28} strokeWidth={2.5} />
                        </div>
                    </a>

                    <a
                        href="mailto:info@srilankantaxi.lk"
                        className="group flex items-center gap-3 justify-end"
                        aria-label="Send us an email"
                    >
                        <span className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 whitespace-nowrap shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">Email Us</span>
                        <div className="w-14 h-14 rounded-full bg-slate-800 text-white border border-slate-200 flex items-center justify-center hover:scale-110 transition-transform shadow-md">
                            <Mail size={24} strokeWidth={2} />
                        </div>
                    </a>
                </div>
            )}

            {/* Animated Prompt */}
            {!isOpen && (
                <div className="absolute bottom-6 right-20 bg-emerald-600 text-white text-[10px] font-black tracking-widest px-4 py-2.5 rounded-xl whitespace-nowrap animate-bounce z-[9999] flex items-center shadow-lg shadow-emerald-600/20">
                    NEED HELP?
                    <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-emerald-600 rotate-45 rounded-sm"></div>
                </div>
            )}

            {/* Main Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-[64px] h-[64px] flex items-center justify-center rounded-2xl transition-all duration-500 hover:scale-105 active:scale-95 z-[9999] bg-white text-emerald-950 shadow-2xl shadow-slate-200/50 hover:shadow-emerald-600/20 border border-slate-100`}
                aria-label={isOpen ? "Close contact menu" : "Open contact menu"}
            >
                {isOpen ? <X size={32} strokeWidth={2.5} /> : (
                    <div className="relative flex items-center justify-center">
                        <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>
                        </span>
                    </div>
                )}
            </button>
        </div>
    )
}
