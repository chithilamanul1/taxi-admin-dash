import React from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Tours from '../components/Tours'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div>
            <Hero onBookClick={() => window.location.href = '/prices'} />
            <Features />

            {/* Mini Calculator Teaser */}
            <section className="py-20 bg-navy text-white text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-4xl font-extrabold mb-6 text-gold">Know Your Fare Instantly</h2>
                    <p className="text-lg text-white/70 mb-10">
                        Use our smart distance calculator to get an exact price for your journey anywhere in Sri Lanka.
                    </p>
                    <Link to="/prices" className="bg-gold text-navy px-10 py-4 rounded-full font-bold text-xl hover:bg-white transition-all inline-block">
                        Try Price Calculator
                    </Link>
                </div>
            </section>

            <Tours />
        </div>
    )
}

export default Home
