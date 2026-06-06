'use client';

import React from 'react';
import Link from 'next/link';
import { Plane, Map, Compass, User, MapPin } from 'lucide-react';

import { usePathname } from 'next/navigation';

const CategoryBar = () => {
    const pathname = usePathname();
    const categories = [
        { name: 'Airport Taxis', icon: Plane, href: '/', active: pathname === '/' },
        { name: 'Tour Packages', icon: Map, href: '/tour-packages', active: pathname === '/tour-packages' },
        { name: 'Day Trips', icon: Compass, href: '/day-trips', active: pathname === '/day-trips' },
        { name: 'Round Trips', icon: MapPin, href: '/custom-trip', active: pathname === '/custom-trip' },
        { name: 'Driver Portal', icon: User, href: '/driver/login', active: pathname === '/driver/login' },
    ];

    if (pathname?.startsWith('/admin') || pathname?.startsWith('/driver')) return null;

    return (
        <div className="bg-white py-3 px-4 md:px-6 overflow-x-auto scrollbar-hide border-b border-black/5 flex justify-start md:justify-center items-center relative z-50">
            <div className="flex items-center gap-3 md:gap-4 min-w-max">
                {categories.map((cat) => (
                    <Link
                        key={cat.name}
                        href={cat.href}
                        aria-label={`Navigate to ${cat.name}`}
                        className={`flex items-center gap-2.5 px-6 py-2 rounded-full border transition-all duration-300 group ${
                            cat.active 
                                ? 'bg-black border-black text-white shadow-lg shadow-black/10' 
                                : 'border-black/10 text-black hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
                        }`}
                    >
                        <cat.icon size={14} strokeWidth={3} className={cat.active ? 'text-[#FACC15]' : 'text-black group-hover:text-white transition-colors'} />
                        <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                            {cat.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryBar;
