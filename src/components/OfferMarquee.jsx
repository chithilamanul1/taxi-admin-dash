'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const OfferMarquee = () => {
    const pathname = usePathname();
    const [timeLeft, setTimeLeft] = useState({
        days: 1,
        hours: 5,
        minutes: 2,
        seconds: 3
    });

    const [activeOfferDay, setActiveOfferDay] = useState('Everyday');
    const [todayOffer, setTodayOffer] = useState({ percent: '25', code: 'TODAY25' });

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[new Date().getDay()];

    // Debug logging for visibility
    useEffect(() => {
        console.log("OfferMarquee: Current Pathname:", pathname);
        console.log("OfferMarquee: Visibility Check - activeOfferDay:", activeOfferDay, "todayName:", todayName);
    }, [pathname, activeOfferDay, todayName]);

    if (pathname?.startsWith('/admin')) {
        console.log("OfferMarquee: Hidden because path starts with /admin");
        return null;
    }
    if (pathname === '/driver/login') {
        console.log("OfferMarquee: Hidden because path is /driver/login");
        return null;
    }
    if (pathname === '/driver/register') {
        console.log("OfferMarquee: Hidden because path is /driver/register");
        return null;
    }

    useEffect(() => {
        const fetchSettings = async () => {
            let targetDate = new Date();
            targetDate.setHours(24, 0, 0, 0); // Default to end of today

            try {
                console.log("OfferMarquee: Fetching marketing settings...");
                const res = await fetch('/api/settings', { cache: 'no-store' });
                
                if (!res.ok) {
                    console.warn(`OfferMarquee: Fetch failed with status ${res.status}. Using defaults.`);
                } else {
                    const result = await res.json();
                    if (result.success && result.data) {
                        console.log("OfferMarquee: Settings received", result.data);
                        
                        // Handle both array and object formats if the API varies
                        const settingsData = Array.isArray(result.data) ? result.data : result.data;
                        
                        if (Array.isArray(settingsData)) {
                            const expirySetting = settingsData.find(s => s.key === 'OFFER_EXPIRY');
                            if (expirySetting && expirySetting.value) {
                                targetDate = new Date(expirySetting.value);
                            }
                        } else if (settingsData.marqueeDiscount) {
                            setTodayOffer({
                                percent: settingsData.marqueeDiscount || '25',
                                code: settingsData.marqueeCode || 'TODAY25'
                            });
                            setActiveOfferDay(settingsData.activeOfferDay || 'Everyday');
                        }
                    }
                }
            } catch (err) {
                console.error('OfferMarquee: Critical fetch error:', err);
            }
            
            return targetDate;
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

    const formatNum = (num) => num.toString().padStart(2, '0');

    const countdownStr = `PREMIUM OFFER REVISED IN ${formatNum(timeLeft.days)}d : ${formatNum(timeLeft.hours)}h : ${formatNum(timeLeft.minutes)}m : ${formatNum(timeLeft.seconds)}s`;

    const offers = [
        "SELECTED DESTINATIONS - LIMITED TIME!",
        `PRICE WILL BE REVISED IN ${formatNum(timeLeft.days)}d : ${formatNum(timeLeft.hours)}h : ${formatNum(timeLeft.minutes)}m : ${formatNum(timeLeft.seconds)}s`,
        "GET 10% OFF ON YOUR FIRST BOOKING ♦ BOOK NOW!",
        "24/7 AIRPORT TRANSFERS STARTING FROM RS 4,500 ♦",
        "LIMITED SEATS AVAILABLE FOR UPCOMING HOLIDAYS"
    ];

    return (
        <div className="bg-[#EF4444] py-3.5 border-b border-white/20 overflow-hidden whitespace-nowrap relative z-[100] shadow-xl">
            <div className="flex animate-marquee-slower items-center pr-[120px] md:pr-[200px]">
                {[...offers, ...offers].map((offer, i) => (
                    <div 
                        key={i} 
                        className="flex items-center gap-8 px-16"
                    >
                        <span className="text-white font-black uppercase text-[10px] md:text-[12px] tracking-[0.25em] inline-block">
                            {offer}
                        </span>
                        <span className="text-white/80 font-black text-lg shrink-0">♦</span>
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
            
        </div>
    );
};

export default OfferMarquee;
