'use client';

import React from 'react';
import Link from 'next/link';
import { Plane, Map, Compass, User } from 'lucide-react';

import { usePathname } from 'next/navigation';

const CategoryBar = () => {
    const pathname = usePathname();
    const categories = [
        { name: 'Airport Taxis', icon: Plane, href: '/', active: true },
        { name: 'Tour Packages', icon: Map, href: '/tour-packages' },
        { name: 'Day Trips', icon: Compass, href: '/day-trips' },
        { name: 'Driver Portal', icon: User, href: '/driver/login' },
    ];

    if (pathname?.startsWith('/admin')) return null;

    return (
        <div className="bg-black py-3 px-4 md:px-6 overflow-x-auto scrollbar-hide border-b border-white/5 flex justify-start md:justify-center items-center relative z-50">
            <div className="flex items-center gap-3 md:gap-4 min-w-max">
                {categories.map((cat) => (
                    <Link
                        key={cat.name}
                        href={cat.href}
                        aria-label={`Navigate to ${cat.name}`}
                        className={`flex items-center gap-2.5 px-6 py-2 rounded-full border transition-all duration-300 group ${
                            cat.active 
                                ? 'bg-white border-white text-black shadow-lg shadow-white/10' 
                                : 'border-white/10 text-white hover:bg-emerald-600 hover:border-emerald-600'
                        }`}
                    >
                        <cat.icon size={14} strokeWidth={3} className={cat.active ? 'text-emerald-600' : 'text-white group-hover:text-white transition-colors'} />
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
