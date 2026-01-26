'use client'

import React from 'react'
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'
const PACKAGES = [
    {
        title: "06 Days | 05 Nights Excursions",
        subtitle: "Kandy, Sigiriya & Colombo",
        price: "300.00",
        // Image: Colombo Lotus Tower & Cityscape (Matches Colombo)
        image: "https://images.pexels.com/photos/4169723/pexels-photo-4169723.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        duration: "06 Days"
    },
    {
        title: "Sri Lanka Classic & Northern Tour",
        subtitle: "10 Days | 09 Nights",
        price: "350.00",
        // Image: The iconic Sigiriya Rock Fortress
        image: "https://images.pexels.com/photos/13391116/pexels-photo-13391116.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        duration: "10 Days"
    },
    {
        title: "Kandy, Nuwara Eliya & Bentota",
        subtitle: "08 Days Tour",
        price: "450.00",
        // Image: Scenic Train Ride in Ella/Hill Country (Matches Nuwara Eliya)
        image: "https://images.pexels.com/photos/2403209/pexels-photo-2403209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        duration: "08 Days"
    },
    {
        title: "Nature, Culture & East Coast",
        subtitle: "10 Days Tour",
        price: "450.00",
        // Image: Beautiful Blue Ocean/Beach (Matches East Coast)
        image: "https://images.pexels.com/photos/1430677/pexels-photo-1430677.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        duration: "10 Days"
    },
    {
        title: "Sri Lanka Culture Nature Tour",
        subtitle: "12 Days | 11 Nights",
        price: "750.00",
        // Image: Elephant in the Wild (Matches Nature)
        image: "https://images.pexels.com/photos/16591311/pexels-photo-16591311.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        duration: "12 Days"
    },
    {
        title: "Hill Country & Beach",
        subtitle: "05 Days | 04 Nights",
        price: "450.00",
        // Image: Lush Greenery/Tea Hills (Matches Hill Country)
        image: "https://images.pexels.com/photos/18423358/pexels-photo-18423358.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        duration: "05 Days"
    },
    {
        title: "Ramayana Trail Tour",
        subtitle: "10 Days | 09 Nights",
        price: "450.00",
        // Image: Ancient Rock Fortress (Related to Ravana legends)
        image: "https://images.pexels.com/photos/9013701/pexels-photo-9013701.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        duration: "10 Days"
    },
    {
        title: "Buddhist Cultural Tour",
        subtitle: "07 Days | 06 Nights",
        price: "450.00",
        // Image: Buddhist Stupa/Temple (Matches Buddhist Culture)
        image: "https://images.pexels.com/photos/1004359/pexels-photo-1004359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        duration: "07 Days"
    }
]
const TourPackages = () => {
    return (
        <div className="pb-20">
            {/* Header */}
            <div className="bg-emerald-900 py-16 md:py-24 text-center px-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Tour <span className="text-emerald-600">Packages</span></h1>
                <p className="text-white/60 max-w-2xl mx-auto">Discover the beauty of Sri Lanka with our curated multi-day tour experiences.</p>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {PACKAGES.map((pkg, idx) => (
                        <div key={idx} className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
                            {/* Image */}
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={pkg.image}
                                    alt={pkg.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-3 right-3 bg-emerald-900/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                                    {pkg.duration}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-emerald-900 mb-1 line-clamp-1" title={pkg.title}>{pkg.title}</h3>
                                <p className="text-sm text-gray-500 mb-4">{pkg.subtitle}</p>

                                <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-100">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">Starting From</p>
                                        <div className="text-2xl font-extrabold text-emerald-600 leading-none">
                                            ${pkg.price}
                                            <span className="text-xs text-gray-400 font-medium ml-1">/pp</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const msg = `Inquiry about Tour Package: ${pkg.title} (${pkg.subtitle})`
                                            window.open(`https://wa.me/94716885880?text=${msg}`, '_blank')
                                        }}
                                        className="bg-emerald-900 text-white p-2 rounded-lg hover:bg-emerald-600 hover:text-emerald-900 transition-colors"
                                    >
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center mt-16">
                <p className="text-gray-500 mb-6">Need a custom itinerary? We can tailor a trip just for you.</p>
                <Link href="/contact" className="inline-block bg-emerald-600 text-emerald-900 font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform">
                    Contact Us for Custom Tours
                </Link>
            </div>
        </div>
    )
}

export default TourPackages
