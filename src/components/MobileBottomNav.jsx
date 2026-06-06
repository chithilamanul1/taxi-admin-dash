'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Compass, Map, Briefcase } from 'lucide-react';
import { usePathname } from 'next/navigation';

const MobileBottomNav = () => {
    const pathname = usePathname();

    if (pathname?.startsWith('/admin') || pathname?.startsWith('/driver')) return null;

    const navItems = [
        { name: 'Home', icon: Home, href: '/' },
        { name: 'Services', icon: Compass, href: '/services' },
        { name: 'Today Offer', isSpecial: true, href: '/offers' },
        { name: 'Tours', icon: Map, href: '/tour-packages' },
        { name: 'Trips', icon: Briefcase, href: '/my-bookings', badge: 0 },
    ];

    const visibleItems = navItems;

    return (
        <div id="mobile-bottom-nav" className="md:hidden fixed bottom-0 left-0 right-0 z-[1000] bg-white/90 dark:bg-black/90 backdrop-blur-xl border-t border-slate-100 dark:border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] px-6 pb-safe">
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
                                     <span className="text-[10px] font-black text-black leading-none mb-1 uppercase tracking-tighter">
                                         TODAY'S
                                     </span>
                                     <div className="bg-emerald-950 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                                         <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                                         <span className="text-xs font-black text-white leading-none uppercase tracking-tight">
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
                                pathname === item.href ? 'text-black' : 'text-slate-600'
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
