import React from 'react'
import { Clock, MapPin, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const DAY_TRIPS = [
    {
        title: "Galle and Bentota Day-Tour",
        location: "From Colombo",
        price: "59.00",
        duration: "12 hours",
        image: "https://images.pexels.com/photos/1072531/pexels-photo-1072531.jpeg", // Galle Fort/Beach
        tags: ["Pickup available", "Water activity"]
    },
    {
        title: "Kandy | Pinnwala | Royal Gardens",
        location: "From Colombo",
        price: "50.63",
        originalPrice: "102.26",
        duration: "13 hours",
        image: "https://images.pexels.com/photos/27907357/pexels-photo-27907357.png", // Kandy Temple
        tags: ["Pickup available", "New activity"]
    },
    {
        title: "Sigiriya and Dambulla Day Trip and Safari",
        location: "From Colombo",
        price: "69.00",
        duration: "14 - 16 hours",
        image: "https://images.pexels.com/photos/18727240/pexels-photo-18727240.jpeg", // Sigiriya Rock
        tags: ["Pickup available", "Safari"]
    },
    {
        title: "Sigiriya, Dambulla and Minneriya Day Trip",
        location: "From Colombo | Negombo",
        price: "114.20",
        originalPrice: "127.00",
        duration: "24 hours",
        image: "https://images.pexels.com/photos/33404650/pexels-photo-33404650.jpeg", // Elephants/Nature
        tags: ["Small Groups", "Private Tour"]
    },
    {
        title: "Private Sigiriya and Dambulla Day Tour",
        location: "From Colombo",
        price: "94.00",
        duration: "14 hours",
        image: "https://images.pexels.com/photos/612346/pexels-photo-612346.jpeg", // Buddha Statue
        tags: ["Pickup available", "Private Tour"]
    },
    {
        title: "Galle and Bentota Day Trip",
        location: "From Colombo City",
        price: "70.25",
        originalPrice: "74.00",
        duration: "14 hours",
        image: "https://images.pexels.com/photos/16711948/pexels-photo-16711948.jpeg", // Beach/Coast
        tags: ["New activity", "Private Tour"]
    }
]

const DayTrips = () => {
    return (
        <div className="pb-20">
            {/* Header */}
            <div className="bg-navy py-16 md:py-24 text-center px-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Day <span className="text-gold">Trips</span></h1>
                <p className="text-white/60 max-w-2xl mx-auto">Short on time? Experience the best of Sri Lanka in just one day.</p>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {DAY_TRIPS.map((trip, idx) => (
                        <div key={idx} className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col">
                            {/* Image */}
                            <div className="h-56 overflow-hidden relative">
                                <img
                                    src={trip.image}
                                    alt={trip.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                {trip.tags.map((tag, i) => (
                                    <div key={i} className={`absolute top-3 ${i === 0 ? 'left-3' : 'right-3'} bg-navy/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm`}>
                                        {tag}
                                    </div>
                                ))}
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider">
                                        <Clock size={14} />
                                        <span>{trip.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                                        <MapPin size={12} />
                                        <span>{trip.location}</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-navy mb-2 line-clamp-2" title={trip.title}>{trip.title}</h3>

                                <div className="mt-auto pt-6 border-t border-gray-100 flex items-end justify-between">
                                    <div>
                                        {trip.originalPrice && (
                                            <span className="text-xs text-gray-400 line-through block mb-1">${trip.originalPrice}</span>
                                        )}
                                        <div className="text-3xl font-extrabold text-gold leading-none">
                                            ${trip.price}
                                            <span className="text-xs text-gray-400 font-medium ml-1">/pp</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const msg = `Inquiry about Day Trip: ${trip.title} (${trip.duration})`
                                            window.open(`https://wa.me/94716885880?text=${msg}`, '_blank')
                                        }}
                                        className="bg-navy text-white p-3 rounded-xl hover:bg-gold hover:text-navy transition-all shadow-lg hover:checkbox-md"
                                    >
                                        <ArrowRight size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center mt-16">
                <p className="text-gray-500 mb-6">Need a custom itinerary? We can tailor a trip just for you.</p>
                <Link to="/contact" className="inline-block bg-gold text-navy font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform">
                    Contact Us for Custom Tours
                </Link>
            </div>
        </div>
    )
}

export default DayTrips
