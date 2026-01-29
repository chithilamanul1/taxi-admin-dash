import React from 'react'

import React from 'react'
import { tourPackages } from '../data/tours-data'
import { ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'

const Tours = () => {
    // Show first 3 tours
    const featuredTours = tourPackages.slice(0, 3)

    return (
        <section id="tours" className="py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-xl">
                        <h4 className="text-emerald-600 font-bold tracking-[0.2em] uppercase mb-4">Discover Paradise</h4>
                        <h2 className="text-emerald-900 text-5xl font-extrabold">Exclusive Tour Packages</h2>
                    </div>
                    <p className="text-gray-500 max-w-sm">
                        We provide custom day tours and multi-day packages to the most beautiful locations across Sri Lanka.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {featuredTours.map(pkg => (
                        <div key={pkg.id} className="group bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full">
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={pkg.image}
                                    alt={pkg.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-6 right-6 bg-white px-4 py-2 rounded-full font-bold text-emerald-900 shadow-lg border border-emerald-900/10 flex items-center gap-2">
                                    Starting ${pkg.price}
                                </div>
                                <div className="absolute bottom-4 left-4 bg-emerald-900/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm shadow flex items-center gap-1">
                                    <Clock size={12} /> {pkg.duration}
                                </div>
                            </div>
                            <div className="p-8 flex-grow flex flex-col">
                                <h3 className="text-2xl font-bold text-emerald-900 mb-4 group-hover:text-emerald-600 transition-colors line-clamp-2">{pkg.title}</h3>
                                <p className="text-gray-500 leading-relaxed mb-6 line-clamp-3">
                                    {pkg.description}
                                </p>
                            </div>
                            <div className="px-8 pb-8">
                                <Link
                                    href={`/tour-packages/${pkg.id}`}
                                    className="block text-center border-2 border-emerald-900 text-emerald-900 font-bold py-3 rounded-2xl hover:bg-emerald-900 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
                                >
                                    Book This Tour <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link href="/tour-packages" className="inline-flex items-center gap-2 text-emerald-900 font-bold hover:text-emerald-600 transition-colors">
                        View All Packages <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Tours
