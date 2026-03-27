'use client';

import React from 'react';
import Link from 'next/link';
import { Plane, Map, Compass, User } from 'lucide-react';

const CategoryBar = () => {
    const categories = [
        { name: 'Airport Taxis', icon: Plane, href: '/', active: true },
        { name: 'Tour Packages', icon: Map, href: '/tour-packages' },
        { name: 'Day Trips', icon: Compass, href: '/day-trips' },
        { name: 'Driver Portal', icon: User, href: '/driver/login' },
    ];

    return (
        <div className="bg-black py-3 px-6 overflow-x-auto scrollbar-hide border-b border-white/10 flex justify-center items-center">
            <div className="flex items-center gap-3 md:gap-6 min-w-max">
                {categories.map((cat) => (
                    <Link
                        key={cat.name}
                        href={cat.href}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full border-2 transition-all group ${
                            cat.active 
                                ? 'bg-white border-white text-black' 
                                : 'border-white text-white hover:bg-white hover:text-black'
                        }`}
                    >
                        <cat.icon size={14} strokeWidth={3} className={cat.active ? 'text-black' : 'text-white group-hover:text-black transition-colors'} />
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
