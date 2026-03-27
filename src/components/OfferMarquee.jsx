'use client';

import React from 'react';

const OfferMarquee = () => {
    const offers = [
        "10% OFF TO GALLE - USE CODE: GALLE10",
        "AIRPORT PICKUP STARTING FROM RS 4,500",
        "FREE UPGRADE TO SEDAN FOR FIRST TIME USERS",
        "24/7 PREMIUM CHAUFFEUR SERVICE",
        "INSTANT BOOKING & SECURE PAYMENTS"
    ];

    return (
        <div className="bg-red-600 py-2 border-b-2 border-black overflow-hidden whitespace-nowrap relative z-[9999]">
            <div className="flex animate-marquee-slower items-center">
                {[...offers, ...offers].map((offer, i) => (
                    <span 
                        key={i} 
                        className="text-white font-black italic uppercase text-[10px] md:text-xs tracking-[0.3em] px-12 inline-block"
                    >
                        {offer}
                    </span>
                ))}
            </div>
            
            <style jsx>{`
                @keyframes marquee-slower {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee-slower {
                    display: inline-flex;
                    animation: marquee-slower 40s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default OfferMarquee;
