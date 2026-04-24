'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const OfferMarquee = () => {
    const pathname = usePathname();
    if (pathname?.startsWith('/admin')) return null;
    const [timeLeft, setTimeLeft] = useState({
        days: 1,
        hours: 5,
        minutes: 2,
        seconds: 3
    });

    const [activeOfferDay, setActiveOfferDay] = useState('Everyday');
    const [todayOffer, setTodayOffer] = useState({ percent: '25', code: 'TODAY25' });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                const result = await res.json();
                if (result.success) {
                    const expirySetting = result.data.find(s => s.key === 'OFFER_EXPIRY');
                    const daySetting = result.data.find(s => s.key === 'OFFER_DAY');
                    
                    if (daySetting) setActiveOfferDay(daySetting.value);

                    const percentSetting = result.data.find(s => s.key === 'TODAY_OFFER_PERCENT');
                    const codeSetting = result.data.find(s => s.key === 'TODAY_OFFER_CODE');
                    if (percentSetting || codeSetting) {
                        setTodayOffer({
                            percent: percentSetting?.value || '25',
                            code: codeSetting?.value || 'TODAY25'
                        });
                    }

                    if (expirySetting) return new Date(expirySetting.value);
                }
            } catch (err) {
                console.error('Failed to fetch offer settings:', err);
            }
            const fallback = new Date();
            fallback.setHours(24, 0, 0, 0);
            return fallback;
        };

        let timer;
        fetchSettings().then(targetDate => {
            timer = setInterval(() => {
                const now = new Date().getTime();
                const distance = targetDate.getTime() - now;

                if (distance < 0) {
                    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                    return;
                }

                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }, 1000);
        });

        return () => timer && clearInterval(timer);
    }, []);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[new Date().getDay()];

    // Removed day restriction to ensure visibility on landing page as requested
    // if (activeOfferDay !== 'Everyday' && activeOfferDay !== todayName) {
    //     return null;
    // }

    const formatNum = (num) => num.toString().padStart(2, '0');

    const countdownStr = `PREMIUM OFFER REVISED IN ${formatNum(timeLeft.days)}d : ${formatNum(timeLeft.hours)}h : ${formatNum(timeLeft.minutes)}m : ${formatNum(timeLeft.seconds)}s`;

    const offers = [
        `${todayOffer.percent}% LUXURY DISCOUNT APPLIED - LIMITED TIME!`,
        countdownStr,
        `EXTRA ${todayOffer.percent}% OFF - USE CODE: ${todayOffer.code}`,
        "AIRPORT PICKUP STARTING FROM RS 4,500",
        "PRICE REVISION IMMINENT - BOOK YOUR RIDE NOW!"
    ];

    return (
        <div className="bg-red-600 py-2.5 border-b border-white/10 overflow-hidden whitespace-nowrap relative z-[9999] shadow-inner">
            <div className="flex animate-marquee-slower items-center pr-[120px] md:pr-[200px]">
                {[...offers, ...offers].map((offer, i) => (
                    <div 
                        key={i} 
                        className="flex items-center gap-8 px-16"
                    >
                        <span className="text-white font-black uppercase text-[9px] md:text-[11px] tracking-[0.3em] inline-block">
                            {offer}
                        </span>
                        <div className="w-1.5 h-1.5 bg-white/40 rounded-full shrink-0"></div>
                    </div>
                ))}
            </div>
            
            {/* Fixed Timer */}
            <div className="absolute top-0 right-0 h-full flex items-center bg-red-700/95 backdrop-blur-md px-6 md:px-10 border-l border-white/10 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-white font-black text-[8px] md:text-[10px] uppercase tracking-[0.2em] hidden sm:block">
                        EXPIRES IN:
                    </span>
                    <div className="flex items-center gap-1.5 text-white font-black text-xs md:text-sm tracking-widest">
                        <span className="bg-black/30 rounded-lg px-2 py-1 min-w-[32px] text-center">{formatNum(timeLeft.hours)}</span>
                        <span className="text-white/30">:</span>
                        <span className="bg-black/30 rounded-lg px-2 py-1 min-w-[32px] text-center">{formatNum(timeLeft.minutes)}</span>
                        <span className="text-white/30">:</span>
                        <span className="bg-black/30 rounded-lg px-2 py-1 min-w-[32px] text-center text-emerald-400">{formatNum(timeLeft.seconds)}</span>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                @keyframes marquee-slower {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee-slower {
                    display: inline-flex;
                    animation: marquee-slower 45s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default OfferMarquee;
