import React, { useState, useEffect } from 'react';
import { Clock, Star, ArrowRight, ChevronRight, Zap, Loader2 } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import Link from 'next/link';
// import { tourPackages } from '../data/tours-data'; // Legacy

const TOUR_CATEGORIES = ['Day Tours', 'City Tours', 'Safari', 'Multi-Day'];

const ToursWidget = () => {
    const [activeCategory, setActiveCategory] = useState('Day Tours');
    const [selectedDate, setSelectedDate] = useState('');
    const [tourDuration, setTourDuration] = useState(1);
    const { convertPrice } = useCurrency();
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTours = async () => {
            setLoading(true);
            try {
                // Fetch active tours
                const res = await fetch('/api/tours?activeOnly=true');
                const data = await res.json();
                if (data.success) {
                    setTours(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch tours:', error);
            }
            setLoading(false);
        };
        fetchTours();
    }, []);

    // Filter Logic
    const filteredTours = tours.filter(t => {
        if (activeCategory === 'All') return true;
        return t.category === activeCategory;
    });

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
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600" size={32} /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTours.length > 0 ? filteredTours.map((tour, idx) => {
                        const priceVal = parseFloat(tour.price || 0);
                        // If it's a day tour, usually price is fixed per person, but widget logic multiplied by duration.
                        // We'll calculate based on if it's 'Multi-Day' or not? 
                        // For now keep simple multiplication as widget filter implies custom duration.
                        // But actually a Tour Package usually has fixed duration. 
                        // The user can change "Duration" filter at top? 
                        // Actually the widget has a "Duration" picker (lines 67-77).
                        // If the tour is fixed duration, this multiplier might be confusing. 
                        // I will multiply ONLY if category allows or simplistically for now.
                        const finalPrice = priceVal * tourDuration;
                        const converted = convertPrice(finalPrice);

                        return (
                            <div
                                key={tour._id || tour.id}
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
                                            <Star size={10} fill="currentColor" className="text-emerald-400" /> {tour.rating || 4.8}
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        {tour.highlights && tour.highlights.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {tour.highlights.slice(0, 2).map((h, i) => (
                                                    <span key={i} className="text-[9px] font-bold bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded-full border border-white/10">{h}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-3 text-emerald-600 text-[10px] font-bold uppercase tracking-widest mb-3">
                                        <Clock size={12} /> {tour.duration} Days
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 leading-tight text-emerald-900 group-hover:text-emerald-600 transition-colors line-clamp-2">{tour.title}</h3>
                                    <p className="text-emerald-900/60 text-sm leading-relaxed line-clamp-2 mb-6 flex-1">{tour.description}</p>

                                    <div className="flex items-center justify-between pt-6 border-t border-emerald-900/10">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest">Starting From</span>
                                            <span className="text-xl font-black text-emerald-900">{converted.symbol} {converted.value.toLocaleString()}</span>
                                        </div>
                                        <Link href={`/tour-packages/${tour.slug || tour.id}`} className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-900 flex items-center justify-center group-hover:bg-emerald-900 group-hover:text-white transition-all duration-500 shadow-sm">
                                            <ChevronRight size={20} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="col-span-full py-20 text-center text-gray-400">
                            No tours found for this category.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ToursWidget;
