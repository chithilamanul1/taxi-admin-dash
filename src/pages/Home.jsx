import React from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Prices from './Prices'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const Home = () => {
    return (
        <div>
            <Hero onBookClick={() => window.location.href = '/prices'} />
            <Features />

            <div id="calculator" className="bg-slate-50 py-10">
                <Prices />
            </div>

            {/* Popular Routes Section */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-navy mb-4">Popular <span className="text-gold">Transfer Routes</span></h2>
                    <p className="text-gray-500">Most requested destinations from Bandaranaike International Airport (CMB)</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Mirissa */}
                    <Link to="/prices" className="group relative h-[400px] rounded-3xl overflow-hidden shadow-xl">
                        <img
                            src="https://images.pexels.com/photos/1835718/pexels-photo-1835718.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Airport to Mirissa"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <span className="bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">Top Choice</span>
                            <h3 className="text-2xl font-bold text-white mb-2">Airport to Mirissa</h3>
                            <p className="text-white/80 text-sm mb-4">Starting from Southern Expressway</p>
                            <div className="flex items-center gap-2 text-gold font-bold uppercase tracking-widest text-sm group-hover:gap-4 transition-all">
                                Get Quote <ArrowRight size={16} />
                            </div>
                        </div>
                    </Link>

                    {/* Tangalle */}
                    <Link to="/prices" className="group relative h-[400px] rounded-3xl overflow-hidden shadow-xl">
                        <img
                            src="https://images.pexels.com/photos/3355788/pexels-photo-3355788.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Airport to Tangalle"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <h3 className="text-2xl font-bold text-white mb-2">Airport to Tangalle</h3>
                            <p className="text-white/80 text-sm mb-4">Scenic coastal drive</p>
                            <div className="flex items-center gap-2 text-gold font-bold uppercase tracking-widest text-sm group-hover:gap-4 transition-all">
                                Get Quote <ArrowRight size={16} />
                            </div>
                        </div>
                    </Link>

                    {/* Sigiriya */}
                    <Link to="/prices" className="group relative h-[400px] rounded-3xl overflow-hidden shadow-xl">
                        <img
                            src="https://images.pexels.com/photos/13391116/pexels-photo-13391116.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Airport to Sigiriya"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <h3 className="text-2xl font-bold text-white mb-2">Airport to Sigiriya</h3>
                            <p className="text-white/80 text-sm mb-4">Cultural Triangle Transfer</p>
                            <div className="flex items-center gap-2 text-gold font-bold uppercase tracking-widest text-sm group-hover:gap-4 transition-all">
                                Get Quote <ArrowRight size={16} />
                            </div>
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default Home
