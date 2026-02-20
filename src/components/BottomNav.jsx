'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Phone, Gift, User } from 'lucide-react';

const BottomNav = () => {
    const pathname = usePathname();

    const navItems = [
        { label: 'Home', href: '/', icon: Home },
        { label: 'Bookings', href: '/my-bookings', icon: Calendar },
        { label: 'Offers', href: '/offers', icon: Gift },
        { label: 'Contact', href: '/contact', icon: Phone },
    ];

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-emerald-900/10 dark:border-white/10 px-6 py-3 pb-8">
            <div className="flex items-center justify-between max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 group">
                            <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-110' : 'text-slate-400 group-hover:text-emerald-600'}`}>
                                <Icon size={20} />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
