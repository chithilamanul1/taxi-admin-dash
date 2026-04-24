'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Compass, Map, Briefcase } from 'lucide-react';
import { usePathname } from 'next/navigation';

const MobileBottomNav = () => {
    const pathname = usePathname();

    if (pathname?.startsWith('/admin')) return null;

    const navItems = [
        { name: 'Home', icon: Home, href: '/' },
        { name: 'Services', icon: Compass, href: '/services' },
        { name: 'Today Offer', isSpecial: true, href: '/offers' },
        { name: 'Tours', icon: Map, href: '/tour-packages' },
        { name: 'Trips', icon: Briefcase, href: '/my-bookings', badge: 0 },
    ];

    const visibleItems = navItems;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[1000] bg-white border-t border-slate-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] px-2 pb-safe">
            <div className="flex justify-between items-center h-16 max-w-lg mx-auto">
                {visibleItems.map((item, i) => (
                    item.isSpecial ? (
                        <Link 
                            key={i}
                            href={item.href}
                            className="flex flex-col items-center justify-center -mt-2 transform transition-transform active:scale-95"
                        >
                            <div className="relative group">
                                {/* Stylized "TODAY'S OFFER" Bubbled Sticker Look */}
                                <div className="flex flex-col items-center select-none scale-110 md:scale-125">
                                    <span className="text-[8px] font-black text-black leading-none mb-0.5 uppercase tracking-tighter">
                                        TODAY'S
                                    </span>
                                    <div className="bg-[#FACC15] border border-black px-3 py-1 rounded-[14px] transform rotate-[-1deg] shadow-sm">
                                        <span className="text-sm font-black text-black leading-none uppercase italic tracking-tight">
                                            OFFER
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <Link 
                            key={i}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-1/5 py-1 transition-colors ${
                                pathname === item.href ? 'text-black' : 'text-slate-500'
                            }`}
                        >
                            <div className="relative">
                                <item.icon size={22} strokeWidth={pathname === item.href ? 3 : 2} />
                                {item.badge !== undefined && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 min-w-[16px] flex items-center justify-center rounded-full px-1 border border-white">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] mt-1 font-medium">{item.name}</span>
                        </Link>
                    )
                ))}
            </div>
        </div>
    );
};

export default MobileBottomNav;
