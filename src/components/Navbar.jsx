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
        <nav className={`relative w-full z-[100] transition-all duration-500 py-3 md:py-6 bg-white dark:bg-[#0a0a0a] border-b-4 border-black`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="flex flex-col">
                        <span className="font-black text-2xl sm:text-3xl md:text-4xl tracking-tighter leading-none text-black dark:text-white uppercase">
                            AIRPORT <span className="text-[#FACC15]">TAXIS</span>
                        </span>
                        <span className="text-[8px] md:text-xs font-black uppercase tracking-[0.4em] text-black/30 dark:text-white/30">Sri Lanka</span>
                    </div>
                </Link>

                <div className="flex items-center gap-2 md:gap-3">

                    {/* Live Chat Toggle */}
                    <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('open-live-chat'))}
                        className="w-9 h-9 md:w-14 md:h-14 bg-[#FACC15] border-3 md:border-4 border-black flex items-center justify-center text-black hover:bg-yellow-400 transition-all"
                        aria-label="Open Live Chat"
                    >
                        <MessageCircle size={20} strokeWidth={3} />
                    </button>

                    {/* Currency Selector (Always Visible) */}
                    <div className="relative group hidden sm:block">
                        <button 
                            className="w-10 h-10 md:w-14 md:h-14 bg-white border-4 border-black flex items-center justify-center text-black hover:bg-slate-50 transition-all"
                            aria-label="Toggle Currency Selector"
                        >
                            <Globe size={20} strokeWidth={3} />
                        </button>
                        <div className="absolute top-full right-0 mt-4 w-48 bg-white dark:bg-black border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                             {SUPPORTED_CURRENCIES.map(c => (
                                <button
                                    key={c.code}
                                    onClick={() => changeCurrency(c.code)}
                                    className={`w-full text-left px-4 py-3 hover:bg-[#FACC15] hover:text-black transition-all text-xs font-black uppercase tracking-widest ${currency === c.code ? 'bg-[#FACC15] text-black' : 'text-black dark:text-white'}`}
                                >
                                    {c.code}
                                </button>
                             ))}
                        </div>
                    </div>

                    {/* Menu Toggle */}
                    <button
                        className="w-10 h-10 md:w-16 md:h-16 flex items-center justify-center bg-black dark:bg-[#FACC15] text-[#FACC15] dark:text-black border-3 md:border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                    >
                        {isMobileMenuOpen ? <X size={24} strokeWidth={4} /> : <Menu size={24} strokeWidth={4} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-navy border-t border-[#FDD12C]/20 shadow-premium max-h-[85vh] overflow-y-auto animate-slide-up backdrop-blur-lg">
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { label: 'Home', href: '/', icon: '🏠', id: 'm-home' },
                                { label: 'Airport Drop & Pickup', href: '/', icon: '✈️', id: 'm-drop' },
                                { label: 'Ride', href: '/ride', icon: '🚗', id: 'm-ride' },
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
                                        <div className="p-4 bg-[#FDD12C]/5 dark:bg-white/5 border-l-2 border-[#FDD12C] text-navy dark:text-[#FDD12C] font-black uppercase tracking-widest text-[10px]">
                                            {item.label}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {item.items.map(sub => (
                                                <Link
                                                    key={sub.label}
                                                    href={sub.href}
                                                    className="p-4 bg-black/10 dark:bg-white/10 hover:bg-[#FACC15] hover:text-black transition-all text-black dark:text-white font-black uppercase tracking-widest text-[10px] text-center"
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
                                        className="p-4 bg-[#FDD12C]/5 dark:bg-white/5 border-l-2 border-[#FDD12C] hover:bg-[#FDD12C] hover:text-navy transition-all text-navy dark:text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-between group"
                                    >
                                        <span>{item.label}</span>
                                        <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
                                    </Link>
                                )
                            ))}
                        </div>

                        <div className="pt-6 border-t border-white/10 space-y-4">
                            <a
                                href="tel:+94716885880"
                                className="flex items-center justify-center gap-3 w-full py-5 bg-[#FDD12C] text-navy font-black uppercase tracking-widest text-xs rounded-none shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
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
