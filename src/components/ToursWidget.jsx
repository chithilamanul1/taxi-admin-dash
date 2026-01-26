'use client';

import React, { useState } from 'react';
import { MapPin, Clock, Star, ArrowRight, Calendar, Users, Zap, Search, ChevronRight } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const TOUR_CATEGORIES = ['Day Tours', 'City Tours', 'Safari'];

const TOURS = [
    {
        id: 1,
        category: 'Day Tours',
        title: "Kandy Cultural Heritage",
        image: "https://images.pexels.com/photos/17904082/pexels-photo-17904082/free-photo-of-kandy-lake-and-clouds.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        duration: "1 Day",
        rating: 4.8,
        price: 15000,
        desc: "Temple of the Tooth, Royal Botanical Gardens & Cultural Dance Show."
    },
    {
        id: 2,
        category: 'Day Tours',
        title: "Sigiriya Rock Fortress",
        image: "https://images.pexels.com/photos/17903961/pexels-photo-17903961/free-photo-of-sigiriya-rock-fortress-sri-lanka.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        duration: "1 Day",
        rating: 4.9,
        price: 22000,
        desc: "Climb the legendary Lion Rock and explore the Dambulla Cave Temples."
    },
    {
        id: 3,
        category: 'City Tours',
        title: "Galle Fort Explorer",
        image: "https://images.pexels.com/photos/10323337/pexels-photo-10323337.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        duration: "Full Day",
        rating: 4.7,
        price: 18000,
        desc: "Stroll through the colonial-era ramparts and lighthouse of Galle."
    },
    {
        id: 4,
        category: 'Safari',
        title: "Yala Wildlife Odyssey",
        image: "https://images.pexels.com/photos/16053363/pexels-photo-16053363/free-photo-of-leopard-on-tree-branch.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        duration: "Full Day",
        rating: 4.9,
        price: 45000,
        desc: "Spot the elusive Sri Lankan Leopard and Asian Elephants in the wild."
    },
    {
        id: 5,
        category: 'Safari',
        title: "Udawalawe Sanctuary",
        image: "https://images.pexels.com/photos/13359364/pexels-photo-13359364.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        duration: "6 Hours",
        rating: 4.8,
        price: 38000,
        desc: "An unparalleled experience watching wild elephant herds in their habitat."
    }
];

const ToursWidget = () => {
    const [activeCategory, setActiveCategory] = useState('Day Tours');
    const [selectedDate, setSelectedDate] = useState('');
    const [tourDuration, setTourDuration] = useState(1);
    const { convertPrice } = useCurrency();

    const filteredTours = TOURS.filter(t => t.category === activeCategory);

    return (
        <div className="space-y-10 animate-fade-in py-4">
            {/* Category Selector */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {TOUR_CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-8 py-3 rounded-2xl text-xs font-bold uppercase tracking-[0.2em] transition-all
                        ${activeCategory === cat
                                ? 'bg-emerald-900 text-white shadow-xl scale-105'
                                : 'bg-white border border-emerald-900/10 text-emerald-900/60 hover:text-emerald-900 hover:border-emerald-900/30'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Config Bar */}
            <div className="grid md:grid-cols-[1fr,300px] gap-6 items-center bg-white p-1.5 rounded-[2.5rem] border border-emerald-900/10 shadow-sm">
                <div className="flex items-center gap-6 px-8 py-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-extrabold text-emerald-900/40 uppercase tracking-widest pl-1">Arrival Date</span>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent border-none outline-none font-black text-emerald-900 text-base cursor-pointer"
                        />
                    </div>
                </div>
                <div className="hidden md:flex items-center justify-between border-l border-emerald-900/10 px-8">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-extrabold text-emerald-900/40 uppercase tracking-widest">Duration</span>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setTourDuration(Math.max(1, tourDuration - 1))} className="text-emerald-600 hover:scale-125 transition-transform"><Clock size={16} /></button>
                            <span className="font-black text-emerald-900 text-base">{tourDuration} Days</span>
                            <button onClick={() => setTourDuration(tourDuration + 1)} className="text-emerald-600 hover:scale-125 transition-transform"><Zap size={16} /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tours Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTours.map((tour, idx) => {
                    const finalPrice = tour.price * tourDuration;
                    const converted = convertPrice(finalPrice);

                    return (
                        <div
                            key={tour.id}
                            style={{ animationDelay: `${idx * 0.1}s` }}
                            className="group relative rounded-[2.5rem] overflow-hidden bg-white border border-emerald-900/10 hover:border-emerald-600 transition-all duration-500 animate-slide-up h-[480px] flex flex-col shadow-sm hover:shadow-xl"
                        >
                            <div className="relative h-60 overflow-hidden">
                                <img
                                    src={tour.image}
                                    alt={tour.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/20 to-transparent"></div>
                                <div className="absolute top-4 left-4">
                                    <div className="bg-emerald-900 px-4 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-extrabold text-white uppercase tracking-widest shadow-lg">
                                        <Star size={10} fill="currentColor" className="text-emerald-400" /> {tour.rating}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex items-center gap-3 text-emerald-600 text-[10px] font-bold uppercase tracking-widest mb-3">
                                    <Clock size={12} /> {tour.duration}
                                </div>
                                <h3 className="text-xl font-bold mb-3 leading-tight text-emerald-900 group-hover:text-emerald-600 transition-colors">{tour.title}</h3>
                                <p className="text-emerald-900/60 text-sm leading-relaxed line-clamp-2 mb-6 flex-1">{tour.desc}</p>

                                <div className="flex items-center justify-between pt-6 border-t border-emerald-900/10">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest">Starting From</span>
                                        <span className="text-xl font-black text-emerald-900">{converted.symbol} {converted.value.toLocaleString()}</span>
                                    </div>
                                    <button className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-900 flex items-center justify-center group-hover:bg-emerald-900 group-hover:text-white transition-all duration-500 shadow-sm">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ToursWidget;
