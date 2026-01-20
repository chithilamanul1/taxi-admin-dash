import React, { useState } from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Prices from './Prices'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const Home = () => {
    const [selectedDest, setSelectedDest] = useState(null)

    const handleRouteClick = (dest) => {
        setSelectedDest(dest)
        const element = document.getElementById('calculator')
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <div>
            <Hero onBookClick={() => {
                const element = document.getElementById('calculator')
                if (element) element.scrollIntoView({ behavior: 'smooth' })
            }} />
            <div id="calculator" className="bg-slate-50 py-10">
                <Prices initialDestination={selectedDest} />
            </div>

            {/* Popular Routes Section */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-navy mb-4">Popular <span className="text-gold">Transfer Routes</span></h2>
                    <p className="text-gray-500">Most requested destinations from Bandaranaike International Airport (CMB)</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Mirissa */}
                    <button onClick={() => handleRouteClick('Mirissa')} className="group relative h-[400px] rounded-3xl overflow-hidden shadow-xl w-full text-left">
                        <img
                            src="https://images.pexels.com/photos/1835718/pexels-photo-1835718.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Airport to Mirissa"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <span className="bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">Top Choice</span>
                            <h3 className="text-2xl font-bold text-white mb-2">Airport to Mirissa</h3>
                            <p className="text-gold font-bold text-lg mb-4">Starting from $59</p>
                            <div className="flex items-center gap-2 text-white/80 font-bold uppercase tracking-widest text-sm group-hover:gap-4 transition-all">
                                Get Quote <ArrowRight size={16} />
                            </div>
                        </div>
                    </button>

                    {/* Tangalle */}
                    <button onClick={() => handleRouteClick('Tangalle')} className="group relative h-[400px] rounded-3xl overflow-hidden shadow-xl w-full text-left">
                        <img
                            src="https://images.pexels.com/photos/3355788/pexels-photo-3355788.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Airport to Tangalle"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <h3 className="text-2xl font-bold text-white mb-2">Airport to Tangalle</h3>
                            <p className="text-gold font-bold text-lg mb-4">Starting from $72</p>
                            <div className="flex items-center gap-2 text-white/80 font-bold uppercase tracking-widest text-sm group-hover:gap-4 transition-all">
                                Get Quote <ArrowRight size={16} />
                            </div>
                        </div>
                    </button>

                    {/* Sigiriya */}
                    <button onClick={() => handleRouteClick('Sigiriya')} className="group relative h-[400px] rounded-3xl overflow-hidden shadow-xl w-full text-left">
                        <img
                            src="https://images.pexels.com/photos/13391116/pexels-photo-13391116.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Airport to Sigiriya"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <h3 className="text-2xl font-bold text-white mb-2">Airport to Sigiriya</h3>
                            <p className="text-gold font-bold text-lg mb-4">Starting from $50</p>
                            <div className="flex items-center gap-2 text-white/80 font-bold uppercase tracking-widest text-sm group-hover:gap-4 transition-all">
                                Get Quote <ArrowRight size={16} />
                            </div>
                        </div>
                    </button>
                </div>
            </section>

            <Features />
        </div>
    )
}

export default Home
