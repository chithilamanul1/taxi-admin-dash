import React, { useState, useEffect } from 'react';
import { Clock, Star, ArrowRight, ChevronRight, Zap, Loader2, Signpost } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import Link from 'next/link';
// import { tourPackages } from '../data/tours-data'; // Legacy

const TOUR_CATEGORIES = ['Day Tours', 'City Tours', 'Safari', 'Tour Packages', 'Custom Trip'];

const ToursWidget = () => {
    const [activeCategory, setActiveCategory] = useState('Day Tours');
    const [selectedDate, setSelectedDate] = useState('');
    const [tourDuration, setTourDuration] = useState(1);
    const { convertPrice, rates } = useCurrency();
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
        const categoryMap = {
            'Day Tours': 'day-trip',
            'City Tours': 'city-tour',
            'Safari': 'safari',
            'Tour Packages': 'tour-package'
        };
        const dbCategory = categoryMap[activeCategory];
        // If "Custom Trip" is selected, we don't filter tours
        if (activeCategory === 'Custom Trip') return false;
        return t.category === dbCategory;
    });

    const [selectedTour, setSelectedTour] = useState(null);

    return (
        <div className="space-y-10 animate-fade-in py-4">
            {/* Category Selector */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start px-2">
                {TOUR_CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => { setActiveCategory(cat); setSelectedTour(null); }}
                        className={`px-4 md:px-8 py-2.5 md:py-3 rounded-2xl text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] transition-all
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

            {/* Tours Grid or Detailed View */}
            {loading && activeCategory !== 'Custom Trip' ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600" size={32} /></div>
            ) : selectedTour ? (
                <div className="animate-fade-in bg-white rounded-[2.5rem] border border-emerald-900/10 overflow-hidden shadow-xl">
                    <div className="relative h-64 md:h-80 bg-emerald-900">
                        {selectedTour.heroImage || selectedTour.image || selectedTour.images?.[0] ? (
                            <img src={selectedTour.heroImage || selectedTour.image || selectedTour.images[0]} alt={selectedTour.title} className="w-full h-full object-cover opacity-80" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">No Image Available</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900 via-emerald-900/40 to-transparent"></div>
                        <button onClick={() => setSelectedTour(null)} className="absolute top-6 left-6 px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-white font-bold hover:bg-white/30 transition-colors flex items-center gap-2 text-sm z-10 border border-white/20">
                            ← Back to Tours
                        </button>
                        <div className="absolute bottom-6 left-8 right-8">
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-2">{selectedTour.title}</h2>
                            <div className="flex flex-wrap items-center gap-4 text-emerald-100 font-medium">
                                <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10"><Clock size={16} className="text-emerald-400" /> {selectedTour.duration?.days || 1} Days / {selectedTour.duration?.nights || 0} Nights</span>
                                {selectedTour.destinations && selectedTour.destinations.length > 0 && (
                                    <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10"><Signpost size={16} className="text-emerald-400" /> {selectedTour.destinations.join(', ')}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-10 space-y-10">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold text-emerald-900 mb-3 border-b border-emerald-900/10 pb-2">Overview</h3>
                                    <p className="text-slate-600 leading-relaxed">{selectedTour.description}</p>
                                </div>

                                {selectedTour.itinerary && selectedTour.itinerary.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-bold text-emerald-900 mb-4 border-b border-emerald-900/10 pb-2">Itinerary</h3>
                                        <div className="space-y-4">
                                            {selectedTour.itinerary.map((day, ix) => (
                                                <div key={ix} className="bg-emerald-50/50 border border-emerald-900/10 rounded-2xl p-5">
                                                    <div className="flex gap-4">
                                                        <div className="shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex flex-col items-center justify-center text-emerald-700 font-bold border border-emerald-200">
                                                            <span className="text-[10px] uppercase. tracking-widest leading-none">Day</span>
                                                            <span className="text-lg leading-none mt-1">{day.day}</span>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-emerald-900 text-lg mb-1">{day.title}</h4>
                                                            <p className="text-slate-600 text-sm mb-3">{day.description}</p>
                                                            {day.activities && day.activities.length > 0 && (
                                                                <div className="flex flex-wrap gap-2">
                                                                    {day.activities.map((act, i) => (
                                                                        <span key={i} className="text-[10px] font-bold bg-white text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 shadow-sm">{act}</span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="bg-emerald-900 rounded-3xl p-6 text-white shadow-xl shadow-emerald-900/20">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-1">Total Price</div>
                                    <div className="text-4xl font-black mb-6">
                                        {selectedTour.price?.currency || 'USD'} {selectedTour.price?.amount || selectedTour.price}
                                        <span className="text-sm font-medium text-emerald-200 block mt-1">per person</span>
                                    </div>
                                    <a href={`https://wa.me/+94722885885?text=I'm interested in booking the ${selectedTour.title} package.`} target="_blank" rel="noreferrer" className="w-full bg-emerald-400 hover:bg-emerald-300 text-emerald-900 font-black py-4 rounded-xl transition-colors flex justify-center items-center gap-2">
                                        Inquire via WhatsApp <ArrowRight size={18} />
                                    </a>
                                </div>

                                {(selectedTour.inclusions?.length > 0 || selectedTour.exclusions?.length > 0) && (
                                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
                                        {selectedTour.inclusions?.length > 0 && (
                                            <div className="mb-6">
                                                <h4 className="text-sm font-black text-emerald-700 uppercase tracking-widest mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Included</h4>
                                                <ul className="space-y-2">
                                                    {selectedTour.inclusions.map((inc, i) => (
                                                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> {inc}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {selectedTour.exclusions?.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-black text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Excluded</h4>
                                                <ul className="space-y-2">
                                                    {selectedTour.exclusions.map((exc, i) => (
                                                        <li key={i} className="text-sm text-slate-500 flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span> {exc}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : activeCategory === 'Custom Trip' ? (
                <div className="grid grid-cols-1 animate-slide-up px-2">
                    <Link href="/custom-trip" className="group relative rounded-[2.5rem] overflow-hidden min-h-[380px] md:h-[450px] flex items-center justify-center bg-emerald-900 border border-emerald-800 shadow-2xl hover:scale-[1.01] transition-all duration-500">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546708973-4903328e19ba?q=80&w=1600')] bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900 via-emerald-900/60 to-transparent"></div>
                        <div className="relative z-10 text-center space-y-4 md:space-y-6 px-6 max-w-2xl py-8">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-400/30 group-hover:scale-110 transition-transform duration-500">
                                <Signpost size={32} className="text-emerald-300 md:size-10" />
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black text-white leading-tight">Design Your Own Adventure</h3>
                            <p className="text-emerald-100 text-base md:text-xl font-medium leading-relaxed">
                                Create a fully customized itinerary tailored to your interests. Choose your stops, vehicle, and pace.
                            </p>
                            <div className="pt-2">
                                <span className="inline-flex items-center gap-3 bg-white text-emerald-900 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-emerald-50 transition-colors">
                                    Start Planning <ArrowRight size={20} />
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTours.length > 0 ? filteredTours.map((tour, idx) => {
                        const priceVal = parseFloat(tour.price?.amount || tour.price || 0);
                        const finalPrice = priceVal * tourDuration;
                        const usdRate = (rates && rates['USD']) ? rates['USD'] : 0.0033;
                        const priceInLkr = (tour.price?.currency === 'LKR') ? finalPrice : finalPrice / usdRate;
                        const converted = convertPrice(priceInLkr);

                        return (
                            <div
                                key={tour._id || tour.id || idx}
                                style={{ animationDelay: `${idx * 0.1}s` }}
                                className="group relative rounded-[2.5rem] overflow-hidden bg-white border border-emerald-900/10 hover:border-emerald-600 transition-all duration-500 animate-slide-up h-[480px] flex flex-col shadow-sm hover:shadow-xl cursor-pointer"
                                onClick={() => setSelectedTour(tour)}
                            >
                                <div className="relative h-60 overflow-hidden bg-emerald-900 flex items-center justify-center">
                                    {tour.heroImage || tour.image || tour.images?.[0] ? (
                                        <img
                                            src={tour.heroImage || tour.image || tour.images[0]}
                                            alt={tour.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                        />
                                    ) : null}
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-500/50 font-medium" style={{ display: (tour.heroImage || tour.image || tour.images?.[0]) ? 'none' : 'flex' }}>No Image</div>
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
                                        <Clock size={12} /> {tour.duration?.days || 1} Days
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 leading-tight text-emerald-900 group-hover:text-emerald-600 transition-colors line-clamp-2">{tour.title}</h3>
                                    <p className="text-emerald-900/60 text-sm leading-relaxed line-clamp-2 mb-6 flex-1">{tour.description}</p>

                                    <div className="flex items-center justify-between pt-6 border-t border-emerald-900/10">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest">Starting From</span>
                                            <span className="text-xl font-black text-emerald-900">{converted.symbol} {converted.value.toLocaleString()}</span>
                                        </div>
                                        <button className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-900 flex items-center justify-center group-hover:bg-emerald-900 group-hover:text-white transition-all duration-500 shadow-sm pointer-events-none">
                                            <ChevronRight size={20} />
                                        </button>
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
