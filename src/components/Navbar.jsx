'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone, User, LogOut, Calendar, ChevronDown, Globe, MessageCircle } from 'lucide-react'
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
        <nav className={`relative w-full z-[150] transition-all duration-500 py-3 md:py-4 bg-white border-b border-slate-100 shadow-sm`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="flex flex-col">
                        <span className="font-black text-xl sm:text-3xl md:text-4xl tracking-tighter leading-tight text-emerald-950 uppercase group-hover:text-emerald-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-emerald-600 after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:origin-left">
                            AIRPORT TAXIS (PVT) LTD
                        </span>
                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Private Limited Company</span>
                    </div>
                </Link>

                <div className="flex items-center gap-2 md:gap-3">
                    {/* Desktop Sign In */}
                    <div className="hidden md:flex items-center gap-3 mr-2">
                        {status === 'loading' ? (
                            <div className="w-10 h-10 bg-slate-50 rounded-2xl animate-pulse"></div>
                        ) : session ? (
                            <div className="relative group/user">
                                <button 
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-xl transition-all"
                                >
                                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-emerald-600">
                                        <img src={session.user?.image || "https://ui-avatars.com/api/?name=" + session.user?.name} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-950 truncate max-w-[80px]">
                                        {session.user?.name?.split(' ')[0]}
                                    </span>
                                    <ChevronDown size={14} className={`transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                <div className={`absolute top-full right-0 mt-4 w-56 bg-white border border-slate-100 rounded-3xl shadow-2xl z-[160] overflow-hidden p-2 transition-all duration-300 ${isUserMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                                    <Link href="/my-bookings" className="flex items-center gap-3 px-5 py-4 hover:bg-emerald-50 text-emerald-950 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all">
                                        <User size={16} /> My Bookings
                                    </Link>
                                    <button 
                                        onClick={() => signOut()}
                                        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-50 text-red-600 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all"
                                    >
                                        <LogOut size={16} /> Sign Out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button 
                                onClick={() => signIn('google')}
                                className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 text-emerald-950 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-50 hover:shadow-xl transition-all"
                            >
                                <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4" />
                                Sign In
                            </button>
                        )}
                    </div>

                    {/* Currency Selector (Always Visible) */}
                    <div className="relative group hidden sm:block">
                        <button 
                            className="w-10 h-10 md:w-14 md:h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-emerald-950 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all"
                            aria-label="Toggle Currency Selector"
                        >
                            <Globe size={20} strokeWidth={3} />
                        </button>
                        <div className="absolute top-full right-0 mt-4 w-48 bg-white border border-slate-100 rounded-3xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2 overflow-hidden">
                             {SUPPORTED_CURRENCIES.map(c => (
                                <button
                                    key={c.code}
                                    onClick={() => changeCurrency(c.code)}
                                    className={`w-full text-left px-5 py-3 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition-all text-xs font-black uppercase tracking-widest ${currency === c.code ? 'bg-emerald-600 text-white' : 'text-emerald-950'}`}
                                >
                                    {c.code}
                                </button>
                             ))}
                        </div>
                    </div>

                    {/* Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-3.5 bg-black text-white rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl md:hidden"
                        aria-label="Toggle Menu"
                    >
                        {isMobileMenuOpen ? <X size={24} strokeWidth={3} /> : <Menu size={24} strokeWidth={3} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-2xl max-h-[85vh] overflow-y-auto animate-slide-up backdrop-blur-lg">
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { label: 'Airport Taxis', href: '/', icon: '✈️', id: 'm-drop' },
                                { label: 'Home', href: '/', icon: '🏠', id: 'm-home' },
                                { label: 'Ride', href: '/ride', icon: '🚗', id: 'm-ride' },
                                { label: 'Day Tours', href: '/day-trips', icon: '🌴', id: 'm-day' },
                                { label: 'City Tours', href: '/tours', icon: '🏙️', id: 'm-city' },
                                { label: 'Tour Packages', href: '/tour-packages', icon: '🗺️', id: 'm-pkg' },
                                { label: 'Gallery', href: '/gallery', icon: '📸', id: 'm-gallery' },
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
                                        { label: 'Gallery', href: '/gallery' },
                                        { label: 'Blog', href: '/blog' },
                                        { label: 'Contact', href: '/contact' }
                                    ]
                                }
                            ].map(item => (
                                item.isDropdown ? (
                                    <div key={item.id} className="space-y-3">
                                        <div className="p-4 bg-slate-50 border-l-4 border-emerald-600 text-emerald-950 font-black uppercase tracking-widest text-[10px] rounded-r-2xl">
                                            {item.label}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {item.items.map(sub => (
                                                <Link
                                                    key={sub.label}
                                                    href={sub.href}
                                                    className="p-4 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 transition-all text-emerald-950 font-bold uppercase tracking-widest text-[10px] text-center rounded-2xl border border-slate-100"
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
                                        className="relative p-4 border-b border-slate-50 hover:text-emerald-600 transition-all text-emerald-950 font-bold uppercase tracking-widest text-xs flex items-center justify-between group"
                                    >
                                        <span className="relative z-10 group-hover:pl-2 transition-all">{item.label}</span>
                                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                                        <span className="text-lg group-hover:scale-110 transition-transform relative z-10">{item.icon}</span>
                                    </Link>
                                )
                            ))}
                        </div>

                        <div className="pt-6 border-t border-slate-100 space-y-4">
                            {session ? (
                                <button
                                    onClick={() => signOut()}
                                    className="flex items-center justify-center gap-3 w-full py-4 bg-slate-100 text-slate-700 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-slate-200 transition-all"
                                >
                                    <LogOut size={18} /> Sign Out ({session.user?.name?.split(' ')[0]})
                                </button>
                            ) : (
                                <button
                                    onClick={() => signIn('google')}
                                    className="flex items-center justify-center gap-3 w-full py-4 bg-white border-2 border-slate-200 text-slate-800 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
                                >
                                    <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4" aria-hidden="true" />
                                    Sign in with Google
                                </button>
                            )}

                            <a
                                href="tel:+94716885880"
                                className="flex items-center justify-center gap-3 w-full py-5 bg-emerald-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-emerald-100 hover:scale-[1.02] active:scale-95 transition-all"
                                aria-label="Call support specialist"
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
