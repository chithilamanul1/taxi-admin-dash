import React from 'react'
import { CheckCircle2, Star, ShieldCheck, CarFront } from 'lucide-react'

const Services = () => {


    return (
        <div className="pb-32">
            <div className="bg-black py-24 text-center border-b-8 border-[#FACC15]">
                <h1 className="text-white text-5xl md:text-7xl font-black mb-4 uppercase tracking-tighter">Our <span className="text-[#FACC15]">Services</span></h1>
                <p className="text-white/40 max-w-lg mx-auto font-black uppercase tracking-widest text-[10px]">Tailored transportation solutions for every type of traveler.</p>
            </div>

            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 -mt-10">
                <div className="bg-white p-10 rounded-none border-4 border-black relative overflow-hidden group transition-all hover:-translate-y-1">
                    <div className="w-16 h-16 bg-[#FACC15] text-black rounded-none border-4 border-black flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                        <Star strokeWidth={3} />
                    </div>
                    <h3 className="text-2xl font-black text-black mb-4 uppercase tracking-tight">Budget Selection</h3>
                    <p className="text-slate-500 font-bold text-sm mb-8 uppercase tracking-wide">Perfect for solo travelers or couples. Clean, air-conditioned compact cars at the lowest rates.</p>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400"><CheckCircle2 className="text-[#FACC15] w-4 h-4" /> Toyota Aqua / Vitz</li>
                        <li className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400"><CheckCircle2 className="text-[#FACC15] w-4 h-4" /> 2 Large Suitcases</li>
                    </ul>
                </div>
                <div className="bg-black p-10 rounded-none border-4 border-[#FACC15] relative overflow-hidden group transform md:scale-105 z-10 transition-all hover:translate-y-[-4px]">
                    <div className="w-16 h-16 bg-[#FACC15] text-black rounded-none border-4 border-black flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                        <Award strokeWidth={3} />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Executive Sedan</h3>
                    <p className="text-white/40 font-bold text-sm mb-8 uppercase tracking-wide">Premium comfort for families or business trips. Luxury sedans with extra legroom.</p>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60"><CheckCircle2 className="text-[#FACC15] w-4 h-4" /> Toyota Premio / Allion</li>
                        <li className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60"><CheckCircle2 className="text-[#FACC15] w-4 h-4" /> 3 Large Suitcases</li>
                    </ul>
                </div>
                <div className="bg-white p-10 rounded-none border-4 border-black relative overflow-hidden group transition-all hover:-translate-y-1">
                    <div className="w-16 h-16 bg-[#FACC15] text-black rounded-none border-4 border-black flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                        <Users strokeWidth={3} />
                    </div>
                    <h3 className="text-2xl font-black text-black mb-4 uppercase tracking-tight">Luxury Van</h3>
                    <p className="text-slate-500 font-bold text-sm mb-8 uppercase tracking-wide">Great for groups and large luggage. Spacious vans with professional drivers.</p>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400"><CheckCircle2 className="text-[#FACC15] w-4 h-4" /> KDH Flat Roof / High Roof</li>
                        <li className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400"><CheckCircle2 className="text-[#FACC15] w-4 h-4" /> 8-12 Passengers</li>
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
