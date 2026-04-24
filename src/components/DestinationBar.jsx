'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DestinationBar = () => {
    const pathname = usePathname();
    if (pathname?.startsWith('/admin')) return null;
    const locations = [
        'Negombo',
        'Colombo',
        'Bentota',
        'Hikkaduwa',
        'Galle',
        'Sigiriya',
        'Kandy',
        'Ella',
        'Mirissa',
        'Unawatuna'
    ];

    return (
        <div className="bg-black py-2 md:py-3 border-b border-white/5 relative z-50">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
                    {/* Welcome Text */}
                    <div className="whitespace-nowrap flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white">
                            <span className="text-emerald-500">OFFER:</span> Get 1000 Welcome Credits immediately after sign up
                        </p>
                    </div>

                    {/* Tag Separator Line (Vertical on Desktop, Hidden on Mobile) */}
                    <div className="hidden md:block w-px h-6 bg-white/10"></div>

                    {/* Tags Container */}
                    <div className="flex-1 w-full overflow-hidden relative">
                        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 md:pb-0 px-1">
                            {locations.map((loc) => (
                                <Link
                                    key={loc}
                                    href={`/?destination=${loc}#booking`}
                                    className="bg-white text-black px-4 py-1.5 rounded-full font-black text-[8px] md:text-[10px] uppercase tracking-wider whitespace-nowrap shadow-md border border-transparent hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
                                >
                                    {loc}
                                </Link>
                            ))}
                        </div>
                        {/* Fade edges */}
                        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DestinationBar;
