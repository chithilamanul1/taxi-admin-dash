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

    if (activeOfferDay !== 'Everyday' && activeOfferDay !== todayName) {
        return null;
    }

    const formatNum = (num) => num.toString().padStart(2, '0');

    const countdownStr = `PRICE WILL BE REVISED IN ${formatNum(timeLeft.days)} : ${formatNum(timeLeft.hours)} : ${formatNum(timeLeft.minutes)} : ${formatNum(timeLeft.seconds)}`;

    const offers = [
        `${todayOffer.percent}% OFF TO SELECTED DESTINATIONS - LIMITED TIME!`,
        countdownStr,
        `EXTRA ${todayOffer.percent}% OFF - USE CODE: ${todayOffer.code}`,
        "AIRPORT PICKUP STARTING FROM RS 4,500",
        "PRICE WILL BE REVISED SOON - BOOK NOW!"
    ];

    return (
        <div className="bg-red-600 py-3 border-b-2 border-black overflow-hidden whitespace-nowrap relative z-[9999] shadow-[0px_4px_10px_rgba(0,0,0,0.1)]">
            <div className="flex animate-marquee-slower items-center">
                {[...offers, ...offers].map((offer, i) => (
                    <div 
                        key={i} 
                        className="flex items-center gap-6 px-12"
                    >
                        <span className="text-white font-black italic uppercase text-[11px] md:text-sm tracking-[0.2em] inline-block">
                            {offer}
                        </span>
                        <div className="w-2 h-2 bg-white rotate-45 shrink-0"></div>
                    </div>
                ))}
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
