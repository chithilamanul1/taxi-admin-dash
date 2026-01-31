'use client'

import React, { useState, useEffect } from 'react'
import { X, Copy, Check } from 'lucide-react'
import Image from 'next/image'

const MarketingPopup = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        // Check if already seen in this session/browser
        const hasSeen = localStorage.getItem('hasSeenMarketingPopup')
        if (!hasSeen) {
            // Show after a small delay
            const timer = setTimeout(() => setIsVisible(true), 2000)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleClose = () => {
        setIsVisible(false)
        localStorage.setItem('hasSeenMarketingPopup', 'true')
    }

    const handleCopy = () => {
        navigator.clipboard.writeText('MIRISSA10')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none p-4 sm:p-0">
            {/* Backdrop (optional, maybe too intrusive, so keep it transparent or clicking outside closes) */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto" onClick={handleClose}></div>

            <div className="relative pointer-events-auto w-full max-w-sm bg-[#0a0a0a] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 animate-fade-in-up">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors z-20"
                >
                    <X size={20} />
                </button>

                <div className="p-8 flex flex-col items-center text-center">
                    {/* Icon Box */}
                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 rotate-3 shadow-lg shadow-amber-900/20">
                        <span className="text-3xl font-black text-amber-600">%</span>
                    </div>

                    <h3 className="text-4xl font-black text-white mb-1">
                        20% <span className="text-lg opacity-60 font-bold block -mt-1">OFF</span>
                    </h3>

                    <p className="text-white/60 text-sm mb-8 px-4">
                        Get 20% off your first trip to Mirissa or Galle! Limited time offer.
                    </p>

                    {/* Coupon Code Box */}
                    <div className="w-full bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between group hover:border-amber-500/50 transition-all">
                        <span className="font-mono text-amber-500 font-bold text-lg tracking-wider pl-4">
                            MIRISSA10
                        </span>
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all"
                        >
                            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>

                    <p className="text-[10px] text-white/30 mt-6">
                        *Valid for rides over 100km. Terms apply.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default MarketingPopup
