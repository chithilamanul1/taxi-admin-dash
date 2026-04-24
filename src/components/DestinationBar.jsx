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
        <div className="bg-[#FACC15] py-2 md:py-3 border-b border-black/5 relative z-50">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
                    {/* Welcome Text */}
                    <div className="whitespace-nowrap">
                        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#1e1e1e]">
                            <span className="opacity-60">Offer:</span> Get 1000 Welcome Credits immediately after sign up
                        </p>
                    </div>

                    {/* Tag Separator Line (Vertical on Desktop, Hidden on Mobile) */}
                    <div className="hidden md:block w-px h-6 bg-black/10"></div>

                    {/* Tags Container */}
                    <div className="flex-1 w-full overflow-hidden relative">
                        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 md:pb-0 px-1">
                            {locations.map((loc) => (
                                <Link
                                    key={loc}
                                    href={`/?destination=${loc}#booking`}
                                    className="bg-white text-[#1e1e1e] px-3 py-1 rounded-full font-bold text-[8px] md:text-[9px] uppercase tracking-wider whitespace-nowrap shadow-sm border border-transparent hover:border-black/10 hover:shadow-md transition-all active:scale-95"
                                >
                                    {loc}
                                </Link>
                            ))}
                        </div>
                        {/* Fade edges */}
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#FACC15] to-transparent pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DestinationBar;
