import React from 'react'
import { CheckCircle2, Star, ShieldCheck, CarFront } from 'lucide-react'

const Services = () => {
    const serviceItems = [
        { title: 'Airport Transfers', desc: 'Seamless 24/7 transfers to and from Bandaranaike International Airport.', icon: <CarFront /> },
        { title: 'Custom Day Tours', desc: 'Galle, Sigiriya, Kandy, or your own custom route.', icon: <MapPin /> },
        { title: 'Multi-day Private Tours', desc: 'Comprehensive tours across all Sri Lankan heritage sites.', icon: <Navigation /> },
        { title: 'Corporate Transport', desc: 'Reliable monthly or daily transport for executive needs.', icon: <Users /> }
    ]

    return (
        <div className="pb-32">
            <div className="bg-slate-50 py-24 text-center">
                <h1 className="text-emerald-900 text-5xl md:text-6xl font-extrabold mb-4">Our <span className="text-emerald-600">Services</span></h1>
                <p className="text-gray-400 max-w-lg mx-auto">Tailored transportation solutions for every type of traveler.</p>
            </div>

            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 -mt-10">
                <div className="bg-white p-10 rounded-3xl shadow-xl relative overflow-hidden group border border-gray-100">
                    <div className="w-16 h-16 bg-emerald-600 text-emerald-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Star />
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-900 mb-4">Budget Selection</h3>
                    <p className="text-gray-500 mb-8">Perfect for solo travelers or couples. Clean, air-conditioned compact cars at the lowest rates.</p>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="text-green-500 w-4 h-4" /> Toyota Aqua / Vitz</li>
                        <li className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="text-green-500 w-4 h-4" /> 2 Large Suitcases</li>
                    </ul>
                </div>
                <div className="bg-emerald-900 p-10 rounded-3xl shadow-2xl relative overflow-hidden group transform md:scale-105 z-10">
                    <div className="w-16 h-16 bg-white text-emerald-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Award />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Executive Sedan</h3>
                    <p className="text-white/60 mb-8">Premium comfort for families or business trips. Luxury sedans with extra legroom.</p>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-sm text-white/70"><CheckCircle2 className="text-emerald-600 w-4 h-4" /> Toyota Premio / Allion</li>
                        <li className="flex items-center gap-2 text-sm text-white/70"><CheckCircle2 className="text-emerald-600 w-4 h-4" /> 3 Large Suitcases</li>
                    </ul>
                </div>
                <div className="bg-white p-10 rounded-3xl shadow-xl relative overflow-hidden group border border-gray-100">
                    <div className="w-16 h-16 bg-emerald-600 text-emerald-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Users />
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-900 mb-4">Luxury Van</h3>
                    <p className="text-gray-500 mb-8">Great for groups and large luggage. Spacious vans with professional drivers.</p>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="text-green-500 w-4 h-4" /> KDH Flat Roof / High Roof</li>
                        <li className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle2 className="text-green-500 w-4 h-4" /> 8-12 Passengers</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

// Helpers for Lucide
const MapPin = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
const Navigation = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
const Users = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
const Award = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>

export default Services
