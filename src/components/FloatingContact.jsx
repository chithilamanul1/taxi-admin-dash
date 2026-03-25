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
        <div className="live-chat-trigger fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] flex flex-col items-end gap-3 md:gap-4 scale-75 sm:scale-90 md:scale-100 origin-bottom-right">
            {/* Action Buttons */}
            {isOpen && (
                <div className="flex flex-col gap-3 animate-slide-up">
                    {/* Live Chat Button */}
                    <button
                        onClick={() => {
                            window.dispatchEvent(new CustomEvent('open-live-chat'));
                            setIsOpen(false);
                        }}
                        className="group flex items-center gap-3"
                        aria-label="Open Live Chat"
                    >
                        <span className="bg-[#0F172A] px-4 py-2 border-2 border-black text-[10px] font-black text-white whitespace-nowrap uppercase tracking-widest">Live Chat</span>
                        <div className="w-14 h-14 bg-emerald-500 text-white border-4 border-black flex items-center justify-center hover:scale-110 transition-transform">
                            <MessageCircle size={24} aria-hidden="true" />
                        </div>
                    </button>

                    <a
                        href="https://wa.me/94716885880"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3"
                        aria-label="Contact us on WhatsApp"
                    >
                        <span className="bg-[#25D366] px-4 py-2 border-2 border-black text-[10px] font-black text-white whitespace-nowrap uppercase tracking-widest">WhatsApp</span>
                        <div className="w-14 h-14 bg-[#25D366] text-white border-4 border-black flex items-center justify-center hover:scale-110 transition-transform">
                            <MessageCircle size={24} aria-hidden="true" />
                        </div>
                    </a>

                    <a
                        href="mailto:info@airporttaxis.lk"
                        className="group flex items-center gap-3"
                        aria-label="Send us an email"
                    >
                        <span className="bg-slate-700 px-4 py-2 border-2 border-black text-[10px] font-black text-white whitespace-nowrap uppercase tracking-widest">Email Us</span>
                        <div className="w-14 h-14 bg-white text-black border-4 border-black flex items-center justify-center hover:scale-110 transition-transform">
                            <Mail size={24} aria-hidden="true" />
                        </div>
                    </a>
                </div>
            )}

            {/* Animated Prompt */}
            {!isOpen && (
                <div className="absolute bottom-5 right-20 bg-black text-[#FACC15] text-[10px] font-black tracking-widest px-3 py-2 border-2 border-black whitespace-nowrap animate-bounce z-[90] flex items-center">
                    LIVE CHAT
                    <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-black rotate-45"></div>
                </div>
            )}

            {/* Main Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 flex items-center justify-center transition-all duration-500 hover:scale-105 active:scale-95 z-[100] border-4 border-black ${isOpen ? 'bg-white text-black rotate-90' : 'bg-[#FACC15] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
                aria-label={isOpen ? "Close contact menu" : "Open contact menu"}
            >
                {isOpen ? <X size={28} strokeWidth={3} /> : (
                    <div className="relative">
                        <MessageCircle size={32} strokeWidth={2.5} />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-black flex items-center justify-center">
                            <div className="w-1 h-1 bg-white animate-ping"></div>
                        </span>
                    </div>
                )}
            </button>
        </div>
    )
}
