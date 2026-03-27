'use client';

import React, { useState, useEffect } from 'react';

const OfferMarquee = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 1,
        hours: 5,
        minutes: 2,
        seconds: 3
    });

    useEffect(() => {
        // Target date: 48 hours from now for a persistent "limited time" feel
        const targetDate = new Date();
        targetDate.setHours(targetDate.getHours() + 48);

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                // Reset to another 48 hours if it ends, to keep the "offer" alive for demo
                targetDate.setHours(targetDate.getHours() + 48);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatNum = (num) => num.toString().padStart(2, '0');

    const countdownStr = `PRICE WILL BE REVISED IN ${formatNum(timeLeft.days)} : ${formatNum(timeLeft.hours)} : ${formatNum(timeLeft.minutes)} : ${formatNum(timeLeft.seconds)}`;

    const offers = [
        "26% OFF TO SELECTED DESTINATIONS - LIMITED TIME!",
        countdownStr,
        "10% OFF TO GALLE - USE CODE: GALLE10",
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
