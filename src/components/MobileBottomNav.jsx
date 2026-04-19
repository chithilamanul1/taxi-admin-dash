'use client';

import React from 'react';
import Link from 'next/link';
import { Home, LayoutGrid, Tag, ShoppingCart } from 'lucide-react';
import { usePathname } from 'next/navigation';

const MobileBottomNav = () => {
    const pathname = usePathname();

    if (pathname?.startsWith('/admin')) return null;

    const navItems = [
        { name: 'Home', icon: Home, href: '/' },
        { name: 'Category', icon: LayoutGrid, href: '/categories' },
        { name: 'Today Offer', isSpecial: true, href: '/offers' },
        { name: 'Brands', icon: Tag, href: '/tour-packages' }, // Using tour-packages for 'Brands' context
        { name: 'Cart', icon: ShoppingCart, href: '/bookings', badge: 0 }, // Using bookings for 'Cart' context
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[1000] bg-white border-t border-slate-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] px-2 pb-safe">
            <div className="flex justify-between items-center h-16 max-w-lg mx-auto">
                {navItems.map((item, i) => (
                    item.isSpecial ? (
                        <Link 
                            key={i}
                            href={item.href}
                            className="flex flex-col items-center justify-center -mt-6 transform transition-transform active:scale-90"
                        >
                            <div className="relative group">
                                {/* Stylized "TODAY'S OFFER" Logo Lookalike */}
                                <div className="flex flex-col items-center select-none">
                                    <span className="text-[10px] font-black text-[#7c3aed] leading-none mb-[-2px] uppercase">
                                        TODAY'S
                                    </span>
                                    <div className="bg-[#fbbf24] border-2 border-[#7c3aed] px-2 py-0.5 rounded-sm transform rotate-[-2deg] shadow-[2px_2px_0px_#7c3aed]">
                                        <span className="text-sm font-black text-[#7c3aed] leading-none uppercase italic">
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
