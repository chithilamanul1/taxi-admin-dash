'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { MessageCircle, Mail, X } from 'lucide-react'

export default function FloatingContact() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const isAdminRoute = pathname.startsWith('/admin')
    if (isAdminRoute) return null

    return (
        <div className="live-chat-trigger fixed bottom-24 right-6 md:bottom-8 md:right-8 z-[9999] flex flex-col items-end gap-4 scale-75 sm:scale-90 md:scale-100 origin-bottom-right">
            {/* Action Buttons */}
            {isOpen && (
                <div className="flex flex-col gap-4 animate-slide-up mb-2">
                    {/* Live Chat Button */}
                    <button
                        onClick={() => {
                            window.dispatchEvent(new CustomEvent('open-live-chat'));
                            setIsOpen(false);
                        }}
                        className="group flex items-center gap-3 justify-end"
                        aria-label="Open Live Chat"
                    >
                        <span className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 whitespace-nowrap shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">Live Chat</span>
                        <div className="w-14 h-14 rounded-full bg-[#FACC15] text-black border border-slate-200 flex items-center justify-center hover:scale-110 transition-transform shadow-md">
                            <MessageCircle size={24} strokeWidth={2.5} />
                        </div>
                    </button>

                    <a
                        href="https://wa.me/94716885880"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 justify-end"
                        aria-label="Contact us on WhatsApp"
                    >
                        <span className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 whitespace-nowrap shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">WhatsApp</span>
                        <div className="w-14 h-14 rounded-full bg-[#25D366] text-white border border-slate-200 flex items-center justify-center hover:scale-110 transition-transform shadow-md">
                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
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
                <div className="absolute bottom-6 right-20 bg-black text-[#FACC15] text-[10px] font-black tracking-widest px-3 py-2 rounded-lg whitespace-nowrap animate-bounce z-[9999] flex items-center shadow-lg">
                    NEED HELP?
                    <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-black rotate-45"></div>
                </div>
            )}

            {/* Main Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-[72px] h-[72px] flex items-center justify-center rounded-full transition-all duration-500 hover:scale-105 active:scale-95 z-[9999] border-[4px] border-[#FACC15] bg-white text-slate-800 shadow-xl shadow-black/10`}
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
