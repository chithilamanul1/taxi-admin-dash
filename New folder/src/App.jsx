import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone, MessageCircle } from 'lucide-react'
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
            <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-navy/95 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
                    <Link to="/" className="flex items-center group">
                        {/* Cropping container for the logo */}
                        <div className="relative h-12 md:h-16 overflow-hidden flex items-start">
                            <img
                                src="/logo.png"
                                alt="AirportTaxis.lk"
                                className="h-[140%] w-auto object-contain object-top filter brightness-0 invert group-hover:invert-0 group-hover:brightness-100 transition-all duration-300"
                            />
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-sm font-bold uppercase tracking-wider hover:text-gold transition-colors ${location.pathname === link.path ? 'text-gold' : 'text-white/80'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
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
                        className="md:hidden text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-navy border-t border-white/10 shadow-2xl">
                        <div className="flex flex-col p-6 gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`text-lg font-bold ${location.pathname === link.path ? 'text-gold' : 'text-white'}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
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

            {/* Floating WhatsApp Button */}
            <a
                href="https://wa.me/94716885880"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
                title="Chat on WhatsApp"
            >
                <MessageCircle size={32} />
            </a>

            <Footer />
        </div>
    )
}

export default App
