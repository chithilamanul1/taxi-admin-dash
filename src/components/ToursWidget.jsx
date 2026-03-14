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
                        className={`px-4 md:px-8 py-2.5 md:py-3 rounded-none text-[10px] md:text-xs font-black uppercase tracking-[0.1em] md:tracking-[0.2em] transition-all border-2
                        ${activeCategory === cat
                                ? 'bg-[#FDD12C] text-navy border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-105'
                                : 'bg-white border-black text-navy/60 hover:text-navy hover:bg-[#FDD12C]/10'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Config Bar - Boxy */}
            <div className="grid md:grid-cols-[1fr,300px] gap-6 items-center bg-white p-1.5 rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-6 px-8 py-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-navy/40 uppercase tracking-widest pl-1">Arrival Date</span>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent border-none outline-none font-black text-navy text-base cursor-pointer"
                        />
                    </div>
                </div>
                <div className="hidden md:flex items-center justify-between border-l-4 border-black px-8">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-navy/40 uppercase tracking-widest">Duration</span>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setTourDuration(Math.max(1, tourDuration - 1))} className="text-navy hover:scale-125 transition-transform"><Clock size={16} /></button>
                            <span className="font-black text-navy text-base">{tourDuration} Days</span>
                            <button onClick={() => setTourDuration(tourDuration + 1)} className="text-navy hover:scale-125 transition-transform"><Zap size={16} /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tours Grid or Detailed View */}
            {loading && activeCategory !== 'Custom Trip' ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-navy" size={32} /></div>
            ) : selectedTour ? (
                <div className="animate-fade-in bg-white rounded-none border-4 border-black overflow-hidden shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
                    <div className="relative h-64 md:h-80 bg-navy">
                        {selectedTour.heroImage || selectedTour.image || selectedTour.images?.[0] ? (
                            <img src={selectedTour.heroImage || selectedTour.image || selectedTour.images[0]} alt={selectedTour.title} className="w-full h-full object-cover opacity-80" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">No Image Available</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent"></div>
                        <button onClick={() => setSelectedTour(null)} className="absolute top-6 left-6 px-4 py-2 bg-white border-2 border-black rounded-none text-navy font-black hover:bg-[#FDD12C] transition-colors flex items-center gap-2 text-sm z-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            ← Back to Tours
                        </button>
                        <div className="absolute bottom-6 left-8 right-8">
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-2">{selectedTour.title}</h2>
                            <div className="flex flex-wrap items-center gap-4 text-white/80 font-medium">
                                <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-none backdrop-blur-md border-2 border-white/10"><Clock size={16} className="text-[#FDD12C]" /> {selectedTour.duration?.days || 1} Days / {selectedTour.duration?.nights || 0} Nights</span>
                                {selectedTour.destinations && selectedTour.destinations.length > 0 && (
                                    <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-none backdrop-blur-md border-2 border-white/10"><Signpost size={16} className="text-[#FDD12C]" /> {selectedTour.destinations.join(', ')}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-10 space-y-10">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-8">
                                <div>
                                    <h3 className="text-xl font-black text-navy mb-3 border-b-4 border-black pb-2">Overview</h3>
                                    <p className="text-slate-600 font-medium leading-relaxed">{selectedTour.description}</p>
                                </div>

                                {selectedTour.itinerary && selectedTour.itinerary.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-black text-navy mb-4 border-b-4 border-black pb-2">Itinerary</h3>
                                        <div className="space-y-4">
                                            {selectedTour.itinerary.map((day, ix) => (
                                                <div key={ix} className="bg-white border-4 border-black rounded-none p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                                    <div className="flex gap-4">
                                                        <div className="shrink-0 w-12 h-12 bg-[#FDD12C] rounded-none flex flex-col items-center justify-center text-navy font-black border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                                            <span className="text-[10px] uppercase tracking-widest leading-none">Day</span>
                                                            <span className="text-lg leading-none mt-1">{day.day}</span>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-black text-navy text-lg mb-1">{day.title}</h4>
                                                            <p className="text-slate-600 text-sm font-medium mb-3">{day.description}</p>
                                                            {day.activities && day.activities.length > 0 && (
                                                                <div className="flex flex-wrap gap-2">
                                                                    {day.activities.map((act, i) => (
                                                                        <span key={i} className="text-[10px] font-black bg-white text-navy px-3 py-1 rounded-none border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{act}</span>
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
                                <div className="bg-navy rounded-none border-4 border-black p-6 text-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-[#FDD12C] mb-1">Total Price</div>
                                        <div className="text-4xl font-black mb-6">
                                            {selectedTour.price?.currency || 'USD'} {selectedTour.price?.amount || selectedTour.price}
                                            <span className="text-sm font-medium text-white/60 block mt-1">per person</span>
                                        </div>
                                        <a href={`https://wa.me/94722885885?text=I'm interested in booking the ${selectedTour.title} package.`} target="_blank" rel="noreferrer" className="w-full bg-[#FDD12C] hover:bg-yellow-400 text-navy font-black py-4 rounded-none border-4 border-black transition-all flex justify-center items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none">
                                            Inquire via WhatsApp <ArrowRight size={18} />
                                        </a>
                                </div>

                                {(() => {
                                    const rawInc = (selectedTour.inclusions?.length > 0 ? selectedTour.inclusions : null) ||
                                        (selectedTour.included?.length > 0 ? selectedTour.included : null) ||
                                        (selectedTour.includes?.length > 0 ? selectedTour.includes : null) || [];
                                    const validInc = rawInc.filter(item => {
                                        if (!item || typeof item !== 'string' || item.trim() === '') return false;
                                        const upper = item.toUpperCase();
                                        if (upper.includes('ADULT') && upper.includes('X') && upper.includes('$')) return false;
                                        return true;
                                    });

                                    const rawExc = (selectedTour.exclusions?.length > 0 ? selectedTour.exclusions : null) ||
                                        (selectedTour.excluded?.length > 0 ? selectedTour.excluded : null) ||
                                        (selectedTour.excludes?.length > 0 ? selectedTour.excludes : null) || [];
                                    const validExc = rawExc.filter(item => typeof item === 'string' && item.trim() !== '');

                                    if (validInc.length === 0 && validExc.length === 0) return null;

                                    return (
                                        <div className="bg-slate-50 border-4 border-black rounded-none p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                            {validInc.length > 0 && (
                                                <div className="mb-6">
                                                    <h4 className="text-sm font-black text-navy uppercase tracking-widest mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#FDD12C]"></div> Included</h4>
                                                    <ul className="space-y-2">
                                                        {validInc.map((inc, i) => (
                                                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2"><span className="text-navy mt-0.5">✓</span> {inc}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {validExc.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-black text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Excluded</h4>
                                                    <ul className="space-y-2">
                                                        {validExc.map((exc, i) => (
                                                            <li key={i} className="text-sm text-slate-500 flex items-start gap-2"><span className="text-red-400 mt-0.5">✕</span> {exc}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            ) : activeCategory === 'Custom Trip' ? (
                <div className="grid grid-cols-1 animate-slide-up px-2">
                    <Link href="/custom-trip" className="group relative rounded-none overflow-hidden min-h-[380px] md:h-[450px] flex items-center justify-center bg-navy border-4 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.01] transition-all duration-500">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546708973-4903328e19ba?q=80&w=1600')] bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent"></div>
                        <div className="relative z-10 text-center space-y-4 md:space-y-6 px-6 max-w-2xl py-8">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-[#FDD12C]/20 backdrop-blur-sm rounded-none border-4 border-black flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <Signpost size={32} className="text-[#FDD12C] md:size-10" />
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black text-white leading-tight">Design Your Own Adventure</h3>
                            <p className="text-white/80 text-base md:text-xl font-medium leading-relaxed">
                                Create a fully customized itinerary tailored to your interests. Choose your stops, vehicle, and pace.
                            </p>
                            <div className="pt-2">
                                <span className="inline-flex items-center gap-3 bg-[#FDD12C] text-navy px-6 md:px-8 py-3 md:py-4 rounded-none border-4 border-black font-black text-base md:text-lg hover:bg-yellow-400 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
                                className="group relative rounded-none overflow-hidden bg-white border-4 border-black hover:border-black transition-all duration-500 animate-slide-up h-[520px] flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                                onClick={() => setSelectedTour(tour)}
                            >
                                <div className="relative h-60 overflow-hidden bg-navy flex items-center justify-center">
                                    {tour.heroImage || tour.image || tour.images?.[0] ? (
                                        <img
                                            src={tour.heroImage || tour.image || tour.images[0]}
                                            alt={tour.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                        />
                                    ) : null}
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-500/50 font-medium" style={{ display: (tour.heroImage || tour.image || tour.images?.[0]) ? 'none' : 'flex' }}>No Image</div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent"></div>
                                    <div className="absolute top-4 left-4">
                                        <div className="bg-navy border-2 border-black px-4 py-1.5 rounded-none flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                            <Star size={10} fill="currentColor" className="text-[#FDD12C]" /> {tour.rating || 4.8}
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
                                    <div className="flex items-center gap-3 text-navy text-[10px] font-black uppercase tracking-widest mb-3">
                                        <Clock size={12} className="text-[#FDD12C]" /> {tour.duration?.days || 1} Days
                                    </div>
                                    <h3 className="text-xl font-black mb-3 leading-tight text-navy group-hover:text-black transition-colors line-clamp-2">{tour.title}</h3>
                                    <p className="text-navy/60 text-sm font-medium leading-relaxed line-clamp-2 mb-6 flex-1">{tour.description}</p>

                                    <div className="flex items-center justify-between pt-6 border-t-4 border-black">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-navy/40 uppercase tracking-widest">Starting From</span>
                                            <span className="text-xl font-black text-navy">{converted.symbol} {converted.value.toLocaleString()}</span>
                                        </div>
                                        <button className="w-12 h-12 rounded-none bg-[#FDD12C] border-2 border-black text-navy flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] pointer-events-none">
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
