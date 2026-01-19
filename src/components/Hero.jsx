import React from 'react'

const Hero = ({ onBookClick }) => {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-24 md:pt-0">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.pexels.com/photos/19574565/pexels-photo-19574565.jpeg"
                    alt="Sri Lanka Coastline"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/60 to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                <div className="text-white text-center md:text-left">
                    <h4 className="text-gold font-bold tracking-[0.2em] uppercase mb-4 animate-fade-in"></h4>
                    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
                        Your Premium <br />
                        <span className="text-gold">Airport Taxi</span> <br />
                        Partner in SL
                    </h1>
                    <p className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed mx-auto md:mx-0">
                        Experience the safest and most comfortable airport transfers in Sri Lanka. 24/7 service with professional English-speaking drivers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <button
                            onClick={() => window.location.href = '/prices'}
                            className="bg-gold hover:bg-gold-light text-navy px-8 py-3 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 active:scale-95"
                        >
                            Book Your Ride
                        </button>
                    </div>
                </div>

                {/* Floating Card Info */}
                <div className="hidden md:block">
                    <div className="glass-card p-10 rounded-3xl shadow-2xl border border-white/20 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-navy font-bold text-xl leading-none">24/7 Availability</p>
                                <p className="text-gray-500 text-sm">Always on time, any time.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-navy font-bold text-xl leading-none">Safe & Secure</p>
                                <p className="text-gray-500 text-sm">Insured vehicles & verified drivers.</p>
                            </div>
                        </div>
                        <div className="pt-6 border-t border-gray-100 italic text-gray-400 text-sm">
                            "Trusted by 1000+ international tourists every month."
                        </div>
                    </div>
                </div>
            </div>

            {/* Wave Divider */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                <svg className="relative block w-full h-[60px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C58,117.26,161.07,110.38,249.29,102.34c31.66-2.88,62-8.31,92.1-15.9Z" fill="#f8fafc"></path>
                </svg>
            </div>
        </section>
    )
}

export default Hero
