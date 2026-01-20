import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone, MessageCircle, Mail } from 'lucide-react'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Prices from './pages/Prices' // Calculator
import Contact from './pages/Contact'
import DayTrips from './pages/DayTrips'
import TourPackages from './pages/TourPackages'
import Terms from './pages/Terms'
import Footer from './components/Footer'

const App = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isChatOpen, setIsChatOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setIsMobileMenuOpen(false)
        window.scrollTo(0, 0)
    }, [location])

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Services', path: '/services' },
        { name: 'Day Trips', path: '/day-trips' },
        { name: 'Tour Packages', path: '/tour-packages' },
        { name: 'Prices', path: '/prices' },
        { name: 'Contact', path: '/contact' },
        { name: 'Terms', path: '/terms' },
    ]

    return (
        <div className="font-sans text-slate-800 antialiased selection:bg-gold selection:text-navy">
            {/* Navbar */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white border-b-4 border-navy shadow-lg py-3' : 'bg-transparent py-5'}`}>
                <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3 md:gap-4 group">
                        {/* Cropping container for the logo */}
                        <div className="relative h-12 md:h-14 overflow-hidden flex items-start">
                            <img
                                src="https://media.discordapp.net/attachments/1462329915969114142/1462883315538329654/logo.png?ex=696fcfc1&is=696e7e41&hm=e78fa0b8532bb25518d5ce3e12c9d2ec36665dde348963926102119bec0dc952&=&format=webp&quality=lossless"
                                alt="Airport Taxis (Pvt) Ltd"
                                className="h-full w-auto object-contain"
                            />
                        </div>
                        {/* Branding Text */}
                        <div className="flex flex-col">
                            <h1 className={`${isScrolled ? 'text-navy' : 'text-white'} font-extrabold text-sm md:text-xl tracking-tight leading-none uppercase transition-colors`}>
                                Airport Taxis (Pvt) Ltd
                            </h1>
                            <p className={`text-[10px] md:text-xs font-medium tracking-wide hidden sm:block transition-colors ${isScrolled ? 'text-slate-500' : 'text-white/80'}`}>
                                Best & trusted Airport transfers in Sri Lanka
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className={`text-sm font-bold uppercase tracking-wider hover:text-gold transition-colors ${location.pathname === '/' ? 'text-gold' : (isScrolled ? 'text-navy' : 'text-white')}`}>Home</Link>
                        <Link to="/about" className={`text-sm font-bold uppercase tracking-wider hover:text-gold transition-colors ${location.pathname === '/about' ? 'text-gold' : (isScrolled ? 'text-navy' : 'text-white')}`}>About</Link>

                        {/* Services Dropdown */}
                        <div className="relative group">
                            <button className={`flex items-center gap-1 text-sm font-bold uppercase tracking-wider hover:text-gold transition-colors ${location.pathname.includes('/services') ? 'text-gold' : (isScrolled ? 'text-navy' : 'text-white')}`}>
                                Services <span className="text-xs">▼</span>
                            </button>
                            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0">
                                <Link to="/prices" className="block px-6 py-3 text-navy hover:bg-slate-50 hover:text-gold font-bold text-sm">Airport Transport</Link>
                                <Link to="/prices" className="block px-6 py-3 text-navy hover:bg-slate-50 hover:text-gold font-bold text-sm">Point to Point</Link>

                                <Link to="/day-trips" className="block px-6 py-3 text-navy hover:bg-slate-50 hover:text-gold font-bold text-sm">Day Trips</Link>
                                <Link to="/tour-packages" className="block px-6 py-3 text-navy hover:bg-slate-50 hover:text-gold font-bold text-sm">Tour Packages</Link>
                                <Link to="/contact" className="block px-6 py-3 text-navy hover:bg-slate-50 hover:text-gold font-bold text-sm">Custom Tour</Link>
                            </div>
                        </div>

                        <Link to="/prices" className={`text-sm font-bold uppercase tracking-wider hover:text-gold transition-colors whitespace-nowrap ${location.pathname === '/prices' ? 'text-gold' : (isScrolled ? 'text-navy' : 'text-white')}`}>Rates</Link>
                        <Link to="/contact" className={`text-sm font-bold uppercase tracking-wider hover:text-gold transition-colors whitespace-nowrap ${location.pathname === '/contact' ? 'text-gold' : (isScrolled ? 'text-navy' : 'text-white')}`}>Contact</Link>

                        <a
                            href="tel:+94722885885"
                            className="bg-gold text-navy px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                        >
                            <Phone size={16} />
                            <span>0722 885 885</span>
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className={`md:hidden p-1 rounded transition-colors ${isScrolled ? 'text-navy' : 'text-white'}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-navy/10 shadow-2xl max-h-[80vh] overflow-y-auto">
                        <div className="flex flex-col p-6 gap-4">
                            <Link to="/" className="text-lg font-bold text-navy">Home</Link>
                            <Link to="/about" className="text-lg font-bold text-navy">About</Link>
                            <div className="space-y-2">
                                <span className="text-lg font-bold text-gold">Services</span>
                                <div className="pl-4 flex flex-col gap-2 border-l-2 border-navy/10">
                                    <Link to="/prices" className="text-navy/80">Airport Transport</Link>
                                    <Link to="/prices" className="text-navy/80">Point to Point</Link>

                                    <Link to="/day-trips" className="text-navy/80">Day Trips</Link>
                                    <Link to="/tour-packages" className="text-navy/80">Tour Packages</Link>
                                    <Link to="/contact" className="text-navy/80">Custom Tour</Link>
                                </div>
                            </div>
                            <Link to="/prices" className="text-lg font-bold text-navy">Rates</Link>
                            <Link to="/contact" className="text-lg font-bold text-navy">Contact</Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Routes */}
            <div className="min-h-screen pt-0">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/prices" element={<Prices />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/day-trips" element={<DayTrips />} />
                    <Route path="/tour-packages" element={<TourPackages />} />
                    <Route path="/terms" element={<Terms />} />
                </Routes>
            </div>

            {/* Floating Contact Button */}
            <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
                {/* Options Menu */}
                {isChatOpen && (
                    <div className="flex flex-col gap-3 animate-fade-in-up">
                        <a
                            href="https://wa.me/94716885880"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#25D366] text-white p-4 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 group"
                            title="Chat on WhatsApp"
                        >
                            <span className="text-sm font-bold opacity-0 group-hover:opacity-100 absolute right-16 bg-white text-navy px-2 py-1 rounded shadow-md whitespace-nowrap transition-opacity pointer-events-none">WhatsApp</span>
                            <MessageCircle size={24} />
                        </a>
                        <a
                            href="mailto:airporttaxis.lk@gmail.com"
                            className="bg-navy text-white p-4 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 group border border-white/20"
                            title="Send Email"
                        >
                            <span className="text-sm font-bold opacity-0 group-hover:opacity-100 absolute right-16 bg-white text-navy px-2 py-1 rounded shadow-md whitespace-nowrap transition-opacity pointer-events-none">Email Us</span>
                            <Mail size={24} />
                        </a>
                    </div>
                )}

                {/* Main Toggle Button */}
                <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="bg-gold text-navy p-4 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center justify-center z-50 relative"
                >
                    {isChatOpen ? <X size={32} /> : <MessageCircle size={32} />}
                </button>
            </div>

            <Footer />
        </div>
    )
}

export default App
