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
        <nav className={`fixed w-full z-50 transition-all duration-500 py-4 bg-black border-b-4 border-[#FACC15] shadow-2xl`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="flex flex-col">
                        <span className="font-black text-2xl tracking-tighter leading-none text-white uppercase italic">
                            AIRPORT <span className="text-[#FACC15]">TAXIS</span>
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FACC15]/60">Sri Lanka</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-4 xl:gap-6">
                    <Link
                        href="/"
                        className={`text-[10px] font-black uppercase tracking-widest hover:text-[#FACC15] transition-colors ${pathname === '/' ? 'text-[#FACC15]' : 'text-white/70'}`}
                    >
                        Home
                    </Link>

                    {[
                        { label: 'Airport Drop & Pickup', href: '/' },
                        { label: 'Day Tours', href: '/day-trips' },
                        { label: 'City Tours', href: '/tours' },
                        { label: 'Tour Packages', href: '/tour-packages' },
                        { label: 'Rates', href: '/prices' }
                    ].map(item => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`text-[10px] font-black uppercase tracking-widest hover:text-[#FACC15] transition-colors ${pathname === item.href ? 'text-[#FACC15]' : 'text-white/70'}`}
                        >
                            {item.label}
                        </Link>
                    ))}

                    {/* Secondary Navigation Dropdown */}
                    <div className="relative group">
                        <button
                            className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest hover:text-[#FACC15] transition-colors ${['/custom-trip', '/blog', '/trip-planner', '/contact'].some(p => pathname.includes(p)) ? 'text-[#FACC15]' : 'text-white/70'}`}
                        >
                            More
                            <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                        </button>
                        <div className="absolute top-full left-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-white/10 dark:border-slate-800 flex flex-col z-50">
                            {[
                                { label: 'Custom Trip', href: '/custom-trip' },
                                { label: 'Blog', href: '/blog' },
                                { label: 'AI Trip Planner', href: '/trip-planner' },
                                { label: 'Contact', href: '/contact' },
                                { label: 'Offers', href: '/offers' },
                                { label: 'Reviews', href: '/reviews' }
                            ].map(sub => (
                                <Link
                                    key={sub.label}
                                    href={sub.href}
                                    className="text-left px-5 py-2.5 hover:bg-emerald-900/10 dark:hover:bg-white/10 transition-colors text-sm font-bold text-emerald-900/80 dark:text-white/80 hover:text-emerald-950 dark:hover:text-white"
                                >
                                    {sub.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Currency Selector */}
                    <div className="relative group">
                        <button
                            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors px-4 py-2 bg-[#FACC15] text-black border-2 border-black`}
                        >
                            <Globe size={14} />
                            <span>{currency}</span>
                            <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                        </button>
                        <div className="absolute top-full right-0 mt-3 w-56 bg-black border-4 border-[#FACC15] py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col z-50">
                            <div className="px-5 py-2 mb-1 border-b border-[#FACC15]/20 bg-white/5">
                                <span className="text-[10px] font-black text-[#FACC15] uppercase tracking-widest">Select Currency</span>
                            </div>
                            {SUPPORTED_CURRENCIES.map(c => (
                                <button
                                    key={c.code}
                                    onClick={() => changeCurrency(c.code)}
                                    className={`w-full text-left px-5 py-3 hover:bg-[#FACC15] hover:text-black transition-all text-[10px] font-black flex items-center gap-4 ${currency === c.code ? 'text-black bg-[#FACC15]' : 'text-white'}`}
                                >
                                    <div className="w-8 h-8 bg-white border border-black flex items-center justify-center overflow-hidden">
                                        <img src={c.flag} alt={c.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="leading-tight uppercase">{c.name}</span>
                                        <span className={`text-[8px] uppercase tracking-widest font-black ${currency === c.code ? 'text-black/60' : 'text-[#FACC15]'}`}>{c.code}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>


                    {/* User Auth */}
                    {status !== 'loading' && (
                        session ? (
                            <div className="relative group">
                                <button
                                    className="relative w-10 h-10 rounded-full border border-white/10 bg-emerald-900/10 p-0.5 overflow-hidden"
                                    aria-label="User profile"
                                >
                                    {session.user?.image ? (
                                        <img src={session.user.image} alt={session.user.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-amber-600 text-white flex items-center justify-center font-bold">{session.user?.name?.charAt(0)}</div>
                                    )}
                                </button>
                                <div className="absolute top-full right-0 mt-3 w-56 bg-white border-4 border-black py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col z-50">
                                    <div className="px-5 py-2 mb-2 border-b border-black/10">
                                        <p className="font-black text-black text-xs uppercase tracking-tighter">{session.user?.name}</p>
                                        <p className="text-[10px] text-[#FACC15] bg-black px-2 py-0.5 inline-block uppercase tracking-wider font-black mt-1">Verified User</p>
                                    </div>
                                    <Link href="/my-bookings" className="flex items-center gap-3 px-5 py-3 hover:bg-black hover:text-[#FACC15] text-[10px] font-black uppercase tracking-widest transition-all">
                                        <Calendar size={16} /> My Bookings
                                    </Link>
                                    <button onClick={() => signOut()} className="flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 text-[10px] font-black uppercase tracking-widest transition-all w-full text-left">
                                        <LogOut size={16} /> Sign Out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => signIn('google')}
                                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all border ${needsSolidBg ? 'bg-white border-white/10 shadow-sm hover:shadow-md' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
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
                    className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-xl border transition-all bg-slate-900 text-white border-slate-900 shadow-md`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isMobileMenuOpen}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-black border-t-4 border-[#FACC15] shadow-2xl max-h-[85vh] overflow-y-auto animate-slide-up">
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { label: 'Home', href: '/', icon: '🏠', id: 'm-home' },
                                { label: 'Airport Drop & Pickup', href: '/', icon: '✈️', id: 'm-drop' },
                                { label: 'Day Tours', href: '/day-trips', icon: '🌴', id: 'm-day' },
                                { label: 'City Tours', href: '/tours', icon: '🏙️', id: 'm-city' },
                                { label: 'Tour Packages', href: '/tour-packages', icon: '🗺️', id: 'm-pkg' },
                                { label: 'Rates', href: '/prices', icon: '💰', id: 'm-rates' },
                                {
                                    label: 'More',
                                    icon: '➕',
                                    id: 'm-more',
                                    isDropdown: true,
                                    items: [
                                        { label: 'Custom Trip', href: '/custom-trip' },
                                        { label: 'Offers', href: '/offers' },
                                        { label: 'Reviews', href: '/reviews' },
                                        { label: 'Blog', href: '/blog' },
                                        { label: 'AI Trip Planner', href: '/trip-planner' },
                                        { label: 'Contact', href: '/contact' }
                                    ]
                                }
                            ].map(item => (
                                item.isDropdown ? (
                                    <div key={item.id} className="space-y-3">
                                        <div className="p-4 bg-white/5 border-l-4 border-[#FACC15] text-[#FACC15] font-black uppercase tracking-widest text-[10px]">
                                            {item.label}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {item.items.map(sub => (
                                                <Link
                                                    key={sub.label}
                                                    href={sub.href}
                                                    className="p-4 bg-white/10 hover:bg-[#FACC15] hover:text-black transition-all text-white font-black uppercase tracking-widest text-[10px] text-center"
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className="p-4 bg-white/5 border-l-4 border-[#FACC15] hover:bg-[#FACC15] hover:text-black transition-all text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-between"
                                    >
                                        <span>{item.label}</span>
                                        <span className="text-lg">{item.icon}</span>
                                    </Link>
                                )
                            ))}
                        </div>

                        <div className="pt-6 border-t border-white/10 space-y-4">
                            <a
                                href="tel:+94716885880"
                                className="flex items-center justify-center gap-3 w-full py-5 bg-[#FACC15] text-black font-black uppercase tracking-widest text-xs"
                            >
                                <Phone size={18} /> Call Specialist
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
