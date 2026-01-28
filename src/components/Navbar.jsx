'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone, User, LogOut, Calendar, ChevronDown, Globe } from 'lucide-react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useCurrency } from '../context/CurrencyContext'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const pathname = usePathname()
    const { data: session, status } = useSession()
    const { currency, changeCurrency, SUPPORTED_CURRENCIES } = useCurrency()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setIsMobileMenuOpen(false)
        setIsUserMenuOpen(false)
    }, [pathname])

    const isAdminRoute = pathname.startsWith('/admin')
    if (isAdminRoute) return null

    // Helper: Pages that support transparent navbar (Home & Blog)
    const isTransparentPage = pathname === '/' || pathname.startsWith('/blog')

    // Solid background when scrolled or on non-transparent pages
    const needsSolidBg = isScrolled || !isTransparentPage

    return (
        <nav className={`fixed w-full z-50 transition-all duration-500 ${needsSolidBg ? 'py-4 bg-white dark:bg-slate-950 border-b border-emerald-900/10 dark:border-slate-800 shadow-md' : 'py-6 bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative h-12 w-12 overflow-hidden bg-emerald-900/5 dark:bg-white/10 rounded-xl p-2 border border-emerald-900/10 dark:border-white/10 group-hover:scale-110 transition-transform">
                        <Image
                            src="/logo.png"
                            alt=""
                            fill
                            className="object-contain p-1"
                            sizes="48px"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className={`font-extrabold text-xl tracking-tighter leading-none ${needsSolidBg ? 'text-emerald-900 dark:text-white' : 'text-white'}`}>
                            AIRPORT <span className="text-emerald-600 dark:text-emerald-400">TAXIS</span>
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${needsSolidBg ? 'text-emerald-600 dark:text-emerald-400' : 'text-white/60'}`}>Sri Lanka</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-6">
                    <Link
                        href="/"
                        className={`text-sm font-bold uppercase tracking-widest hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ${pathname === '/' ? 'text-emerald-900 dark:text-white' : (needsSolidBg ? 'text-emerald-900/70 dark:text-slate-300' : 'text-white/80')}`}
                    >
                        Home
                    </Link>

                    {/* Tour Packages Dropdown */}
                    <div className="relative group">
                        <button
                            className={`flex items-center gap-1 text-sm font-bold uppercase tracking-widest hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ${pathname.includes('tour') || pathname.includes('day-trips') ? 'text-emerald-900 dark:text-white' : (needsSolidBg ? 'text-emerald-900/70 dark:text-slate-300' : 'text-white/80')}`}
                        >
                            Tour Packages
                            <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                        </button>
                        <div className="absolute top-full left-0 mt-3 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-emerald-900/10 dark:border-slate-800 flex flex-col">
                            {[
                                { label: 'Day Tours', href: '/day-trips' },
                                { label: 'City Tours', href: '/city-tours' }, // Placeholder based on request
                                { label: 'Safari', href: '/safari' },         // Placeholder based on request
                                { label: 'All Packages', href: '/tour-packages' }
                            ].map(sub => (
                                <Link
                                    key={sub.href}
                                    href={sub.href}
                                    className="text-left px-5 py-2.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors text-sm font-bold text-emerald-900/80 dark:text-white/80 hover:text-emerald-900 dark:hover:text-white"
                                >
                                    {sub.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {[
                        { label: 'Rates', href: '/prices' },
                        { label: 'Offers', href: '/offers' },
                        { label: 'Blog', href: '/blog' },
                        { label: 'Contact', href: '/contact' },
                    ].map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`text-sm font-bold uppercase tracking-widest hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ${pathname === item.href ? 'text-emerald-900 dark:text-white' : (needsSolidBg ? 'text-emerald-900/70 dark:text-slate-300' : 'text-white/80')}`}
                        >
                            {item.label}
                        </Link>
                    ))}

                    {/* Currency Selector */}
                    <div className="relative group">
                        <button
                            className={`flex items-center gap-2 text-sm font-bold transition-colors px-4 py-2 rounded-xl border ${needsSolidBg ? 'text-emerald-900 border-emerald-900/10 bg-emerald-900/5' : 'text-white border-white/20 bg-emerald-900/40 backdrop-blur-sm'}`}
                            aria-label="Select currency"
                        >
                            <Globe size={14} className="text-emerald-400" />
                            <span>{currency}</span>
                            <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                        </button>
                        <div className="absolute top-full right-0 mt-3 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-emerald-900/10 dark:border-slate-800">
                            {SUPPORTED_CURRENCIES.map(c => (
                                <button
                                    key={c.code}
                                    onClick={() => changeCurrency(c.code)}
                                    className={`w-full text-left px-5 py-2.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors text-sm font-bold flex items-center gap-3 ${currency === c.code ? 'text-emerald-900 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-600 dark:text-slate-300'}`}
                                >
                                    <span className="text-lg">{c.flag}</span>
                                    <span>{c.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <a
                        href="tel:+94722885885"
                        className="flex items-center gap-3 px-6 py-3 bg-emerald-900 text-white rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg"
                        aria-label="Call Specialist at +94 722 885 885"
                    >
                        <Phone size={16} />
                        0722 885 885
                    </a>

                    {/* User Auth */}
                    {status !== 'loading' && (
                        session ? (
                            <div className="relative group">
                                <button
                                    className="relative w-10 h-10 rounded-full border border-emerald-900/10 bg-emerald-50 p-0.5 overflow-hidden"
                                    aria-label="User profile"
                                >
                                    {session.user?.image ? (
                                        <img src={session.user.image} alt={session.user.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-emerald-600 text-white flex items-center justify-center font-bold">{session.user?.name?.charAt(0)}</div>
                                    )}
                                </button>
                                <div className="absolute top-full right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-emerald-900/10 dark:border-slate-800">
                                    <div className="px-5 py-2 mb-2 border-b border-emerald-900/5 dark:border-white/5">
                                        <p className="font-bold text-emerald-900 dark:text-white text-sm">{session.user?.name}</p>
                                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Verified User</p>
                                    </div>
                                    <Link href="/my-bookings" className="flex items-center gap-3 px-5 py-3 text-emerald-900/70 dark:text-slate-300 hover:text-emerald-900 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-sm font-bold transition-all">
                                        <Calendar size={16} className="text-emerald-600 dark:text-emerald-400" /> My Bookings
                                    </Link>
                                    <button onClick={() => signOut()} className="flex items-center gap-3 px-5 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 text-sm font-bold transition-all w-full text-left">
                                        <LogOut size={16} /> Sign Out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => signIn('google')}
                                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all border ${needsSolidBg ? 'bg-white border-emerald-900/10 shadow-sm hover:shadow-md' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
                                aria-label="Sign in with Google"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            </button>
                        )
                    )}
                </div>

                {/* Theme Toggle */}
                <div className="mr-3">
                    <ThemeToggle />
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${needsSolidBg ? 'bg-emerald-900 text-white border-emerald-900 shadow-md' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isMobileMenuOpen}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-950 border-t border-emerald-900/10 dark:border-slate-800 shadow-2xl max-h-[85vh] overflow-y-auto animate-slide-up">
                    <div className="p-6 space-y-6">
                        {/* User Profile Section - Mobile */}
                        {session && (
                            <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                                <div className="w-14 h-14 rounded-full border-2 border-emerald-600 overflow-hidden shrink-0">
                                    {session.user?.image ? (
                                        <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xl">{session.user?.name?.charAt(0)}</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-emerald-900 dark:text-white truncate">{session.user?.name}</p>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 truncate">{session.user?.email}</p>
                                </div>
                            </div>
                        )}

                        {/* My Bookings Link - Mobile */}
                        {session && (
                            <Link
                                href="/my-bookings"
                                className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-900/10 dark:border-slate-800 text-emerald-900 dark:text-white font-bold shadow-sm"
                            >
                                <Calendar size={20} className="text-emerald-600" />
                                <span>My Bookings</span>
                                <ChevronDown size={16} className="-rotate-90 ml-auto text-emerald-600" />
                            </Link>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Home', href: '/', icon: '🏠' },
                                { label: 'Day Tours', href: '/day-trips', icon: '🌴' },
                                { label: 'City Tours', href: '/city-tours', icon: '🏙️' },
                                { label: 'Safari', href: '/safari', icon: '🐘' },
                                { label: 'All Packages', href: '/tour-packages', icon: '🗺️' },
                                { label: 'Rates', href: '/prices', icon: '💰' },
                                { label: 'Offers', href: '/offers', icon: '🎁' },
                                { label: 'Blog', href: '/blog', icon: '📝' },
                                { label: 'Contact', href: '/contact', icon: '📞' }
                            ].map(item => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-900/10 dark:border-slate-800 text-emerald-900 dark:text-white font-bold shadow-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-emerald-900/10 dark:border-slate-800">
                            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest px-2 mb-4">Currency Selector</p>
                            <div className="grid grid-cols-4 gap-2">
                                {SUPPORTED_CURRENCIES.map(c => (
                                    <button
                                        key={c.code}
                                        onClick={() => changeCurrency(c.code)}
                                        className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl border transition-all text-xs font-bold ${currency === c.code ? 'bg-emerald-600 text-white border-emerald-600 shadow-md transform scale-105' : 'text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}
                                    >
                                        <span className="text-base">{c.flag}</span>
                                        <span>{c.code}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 space-y-4">
                            <a
                                href="tel:+94722885885"
                                className="flex items-center justify-center gap-3 w-full py-4 bg-emerald-900 text-white rounded-2xl font-bold shadow-lg"
                            >
                                <Phone size={18} /> Call Specialist
                            </a>
                            {session ? (
                                <button onClick={() => signOut()} className="w-full py-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 font-bold rounded-2xl hover:bg-red-100 dark:hover:bg-red-950/40 transition-all">
                                    Sign Out
                                </button>
                            ) : (
                                <button onClick={() => signIn('google')} className="flex items-center justify-center gap-3 w-full py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Sign In with Google
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
