import React from 'react'

const tourPackages = [
    {
        id: 1,
        title: 'Galle Day Tour',
        description: 'Explore the historic Galle Fort, visit a turtle hatchery, and relax on the sandy beaches of Unawatuna.',
        image: 'https://images.pexels.com/photos/16711948/pexels-photo-16711948.jpeg',
        price: '45'
    },
    {
        id: 2,
        title: 'Sigiriya & Dambulla',
        description: 'Climb the iconic Lion Rock fortress and visit the ancient golden temple of Dambulla.',
        image: 'https://images.pexels.com/photos/11138725/pexels-photo-11138725.jpeg',
        price: '75'
    },
    {
        id: 3,
        title: 'Kandy & Tea Gardens',
        description: 'Visit the Temple of the Tooth, enjoy a walk in Peradeniya gardens, and see the lush tea estates.',
        image: 'https://images.pexels.com/photos/31728099/pexels-photo-31728099.jpeg',
        price: '60'
    }
]

const Tours = () => {
    return (
        <section id="tours" className="py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-xl">
                        <h4 className="text-gold font-bold tracking-[0.2em] uppercase mb-4">Discover Paradise</h4>
                        <h2 className="text-navy text-5xl font-extrabold">Exclusive Tour Packages</h2>
                    </div>
                    <p className="text-gray-500 max-w-sm">
                        We provide custom day tours and multi-day packages to the most beautiful locations across Sri Lanka.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {tourPackages.map(pkg => (
                        <div key={pkg.id} className="group bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full">
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={pkg.image}
                                    alt={pkg.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-bold text-navy shadow-lg">
                                    Starting ${pkg.price}
                                </div>
                            </div>
                            <div className="p-8 flex-grow">
                                <h3 className="text-2xl font-bold text-navy mb-4 group-hover:text-gold transition-colors">{pkg.title}</h3>
                                <p className="text-gray-500 leading-relaxed mb-6">
                                    {pkg.description}
                                </p>
                            </div>
                            <div className="px-8 pb-8">
                                <a
                                    href="#booking-section"
                                    className="block text-center border-2 border-navy text-navy font-bold py-3 rounded-2xl hover:bg-navy hover:text-white transition-all"
                                >
                                    Book This Tour
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Tours
