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
        <div className="fixed bottom-24 md:bottom-10 right-6 z-[9999] flex flex-col items-end gap-5">
            {isOpen && (
                <div className="flex flex-col gap-4 animate-fade-in-up items-end">
                    {/* WhatsApp */}
                    <a
                        href="https://wa.me/94716885880"
                        className="group flex flex-col items-center gap-1"
                        aria-label="Contact us on WhatsApp"
                    >
                        <div className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xl">
                            <MessageCircle size={32} strokeWidth={2.5} />
                        </div>
                        <span className="text-[9px] font-black text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-100 dark:border-white/10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-tighter transition-all">whatsapp</span>
                    </a>

                    {/* Live Chat */}
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            window.dispatchEvent(new CustomEvent('open-live-chat'));
                        }}
                        className="group flex flex-col items-center gap-1"
                        aria-label="Open Live Chat"
                    >
                        <div className="w-14 h-14 rounded-full bg-black text-[#FACC15] flex items-center justify-center hover:scale-110 transition-transform shadow-2xl border-2 border-[#FACC15]">
                            <MessageCircle size={32} strokeWidth={3} fill="currentColor" />
                        </div>
                        <span className="text-[9px] font-black text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-100 dark:border-white/10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-tighter transition-all">live chat</span>
                    </button>

                    {/* Email */}
                    <a
                        href="mailto:info@srilankantaxi.lk"
                        className="group flex flex-col items-center gap-1"
                        aria-label="Send us an email"
                    >
                        <div className="w-14 h-14 rounded-full bg-[#1e293b] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xl">
                            <Mail size={32} strokeWidth={2} />
                        </div>
                        <span className="text-[9px] font-black text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-100 dark:border-white/10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-tighter transition-all">email</span>
                    </a>
                </div>
            )}

            {/* Animated Prompt */}
            {!isOpen && (
                <div className="absolute bottom-4 right-16 bg-[#FACC15] text-black text-[9px] font-black tracking-widest px-4 py-2 rounded-xl whitespace-nowrap animate-bounce z-[9999] flex items-center shadow-xl border border-slate-100 dark:border-white/10">
                    NEED HELP?
                    <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-[#FACC15] rotate-45 border-r-2 border-t-2 border-slate-200 dark:border-white/10"></div>
                </div>
            )}

            {/* Main Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-[64px] h-[64px] flex items-center justify-center rounded-2xl transition-all duration-500 hover:scale-105 active:scale-95 z-[9999] ${isOpen ? 'bg-red-500 text-white' : 'bg-white text-emerald-950 shadow-2xl shadow-slate-200/50 hover:shadow-emerald-600/20 border border-slate-100'}`}
                aria-label={isOpen ? "Close contact menu" : "Open contact menu"}
            >
                {isOpen ? <X size={32} strokeWidth={3} /> : (
                    <div className="relative flex items-center justify-center">
                        <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FACC15] rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>
                        </span>
                    </div>
                )}
            </button>
        </div>
    )
}
