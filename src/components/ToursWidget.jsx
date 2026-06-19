import React, { useState, useEffect } from 'react';
import { Clock, Star, ArrowRight, ChevronRight, Zap, Loader2, Signpost } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import Link from 'next/link';

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

    const filteredTours = tours.filter(t => {
        const categoryMap = {
            'Day Tours': 'day-trip',
            'City Tours': 'city-tour',
            'Safari': 'safari',
            'Tour Packages': 'tour-package'
        };
        const dbCategory = categoryMap[activeCategory];
        if (activeCategory === 'Custom Trip') return false;
        return t.category === dbCategory;
    });

    const [selectedTour, setSelectedTour] = useState(null);

    return (
        <div className="space-y-10 animate-fade-in py-4">
            <div className="flex flex-wrap gap-2.5 justify-center md:justify-start px-2">
                {TOUR_CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => { setActiveCategory(cat); setSelectedTour(null); }}
                        className={`px-6 md:px-8 py-3 rounded-2xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all border shadow-sm
                        ${activeCategory === cat
                                ? 'bg-emerald-600 text-white border-transparent shadow-md shadow-emerald-200 dark:shadow-none'
                                : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid md:grid-cols-[1fr] gap-6 items-center bg-white dark:bg-zinc-800 p-2 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="flex items-center justify-between px-6 md:px-10 py-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Tour Duration</span>
                        <div className="flex items-center gap-6 mt-2">
                            <button onClick={() => setTourDuration(Math.max(1, tourDuration - 1))} className="w-12 h-12 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shadow-sm"><Clock size={18} /></button>
                            <span className="font-black text-emerald-950 dark:text-white text-2xl tracking-tight uppercase">{tourDuration} Days</span>
                            <button onClick={() => setTourDuration(tourDuration + 1)} className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-700 transition-all shadow-md"><Zap size={18} /></button>
                        </div>
                    </div>
                </div>
            </div>

            {loading && activeCategory !== 'Custom Trip' ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600" size={32} /></div>
            ) : selectedTour ? (
                <div className="animate-fade-in bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xl">
                    <div className="relative h-72 md:h-96 bg-slate-900">
                        {selectedTour.heroImage || selectedTour.image || selectedTour.images?.[0] ? (
                            <Image src={selectedTour.heroImage || selectedTour.image || selectedTour.images[0]} alt={selectedTour.title} fill className="object-cover opacity-80" sizes="(max-width: 1024px) 100vw, 1024px" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">No Image Available</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <button onClick={() => setSelectedTour(null)} className="absolute top-6 left-6 px-5 py-2.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-700 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all flex items-center gap-2 text-sm z-10 shadow-lg">
                            ← BACK TO TOURS
                        </button>
                        <div className="absolute bottom-8 left-8 right-8">
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">{selectedTour.title}</h2>
                            <div className="flex flex-wrap items-center gap-3 text-white font-bold uppercase tracking-widest text-[10px]">
                                <span className="flex items-center gap-2 bg-emerald-600/90 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-400/30"><Clock size={14} /> {selectedTour.duration?.days || 1} Days / {selectedTour.duration?.nights || 0} Nights</span>
                                {selectedTour.destinations && selectedTour.destinations.length > 0 && (
                                    <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"><Signpost size={14} /> {selectedTour.destinations.join(', ')}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 lg:p-16 space-y-12">
                        <div className="grid lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-2 space-y-12">
                                <div>
                                    <h3 className="text-xl font-bold text-emerald-950 dark:text-white mb-6 flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div>
                                        Tour Overview
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">{selectedTour.description}</p>
                                </div>

                                {selectedTour.itinerary && selectedTour.itinerary.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-bold text-emerald-950 dark:text-white mb-8 flex items-center gap-3">
                                            <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
                                            Detailed Itinerary
                                        </h3>
                                        <div className="space-y-6">
                                            {selectedTour.itinerary.map((day, ix) => (
                                                <div key={ix} className="bg-slate-50 dark:bg-white/5 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-white/5 hover:border-emerald-200 dark:hover:border-emerald-500/20 transition-all group">
                                                    <div className="flex flex-col md:flex-row gap-6">
                                                        <div className="shrink-0 w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl flex flex-col items-center justify-center text-emerald-600 dark:text-emerald-400 font-black shadow-sm border border-slate-100 dark:border-white/5 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                                            <span className="text-[10px] uppercase tracking-widest leading-none mb-1">Day</span>
                                                            <span className="text-2xl leading-none">{day.day}</span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-emerald-950 dark:text-white text-xl mb-2">{day.title}</h4>
                                                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{day.description}</p>
                                                            {day.activities && day.activities.length > 0 && (
                                                                <div className="flex flex-wrap gap-2">
                                                                    {day.activities.map((act, i) => (
                                                                        <span key={i} className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-500/20">{act}</span>
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

                            <div className="space-y-8">
                                <div className="bg-emerald-950 dark:bg-zinc-800 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
                                        <div className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-2">Total Price</div>
                                        <div className="text-5xl font-black mb-8 tracking-tight">
                                            {selectedTour.price?.currency || 'USD'} {selectedTour.price?.amount || selectedTour.price}
                                            <span className="text-xs font-bold text-emerald-400/60 block mt-2 uppercase tracking-widest">per person</span>
                                        </div>
                                        <a href={`https://wa.me/94722885885?text=I'm interested in booking the ${selectedTour.title} package.`} target="_blank" rel="noreferrer" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-5 rounded-2xl transition-all flex justify-center items-center gap-3 shadow-lg shadow-emerald-900/40 group-hover:-translate-y-1">
                                            INQUIRE VIA WHATSAPP <ArrowRight size={20} />
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
                                        <div className="bg-white dark:bg-zinc-800 rounded-[2rem] p-8 border border-slate-100 dark:border-white/5 shadow-sm">
                                            {validInc.length > 0 && (
                                                <div className="mb-8">
                                                    <h4 className="text-xs font-bold text-emerald-950 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-3">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                        Included
                                                    </h4>
                                                    <ul className="space-y-3">
                                                        {validInc.map((inc, i) => (
                                                            <li key={i} className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-start gap-3">
                                                                <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" /> {inc}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {validExc.length > 0 && (
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-3">
                                                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                                        Excluded
                                                    </h4>
                                                    <ul className="space-y-3">
                                                        {validExc.map((exc, i) => (
                                                            <li key={i} className="text-sm text-slate-400 font-medium flex items-start gap-3">
                                                                <span className="text-red-400 mt-0.5 shrink-0">✕</span> {exc}
                                                            </li>
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
                    <Link href="/custom-trip" className="group relative rounded-[2.5rem] overflow-hidden min-h-[380px] md:h-[450px] flex items-center justify-center bg-emerald-950 transition-all duration-500 shadow-2xl">
                        <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity duration-700">
                            <Image src="https://images.unsplash.com/photo-1546708973-4903328e19ba?q=80&w=1600" alt="Sri Lanka Tours" fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 50vw" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-transparent"></div>
                        <div className="relative z-10 text-center space-y-6 px-8 max-w-2xl py-12">
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                                <Signpost size={32} className="text-emerald-400" />
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">Design Your Own Adventure</h3>
                            <p className="text-emerald-50/70 text-base md:text-lg font-medium leading-relaxed">
                                Create a fully customized itinerary tailored to your interests. Choose your stops, vehicle, and pace.
                            </p>
                            <div className="pt-4">
                                <span className="inline-flex items-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-emerald-500 transition-all shadow-lg group-hover:shadow-emerald-500/30">
                                    Start Planning <ArrowRight size={20} />
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {filteredTours.length > 0 ? filteredTours.map((tour, idx) => {
                        const priceVal = parseFloat(tour.price?.amount || tour.price || 0);
                        const finalPrice = priceVal * tourDuration;
                        const usdRate = (rates && rates['USD']) ? rates['USD'] : 0.0033;
                        const tourCurrency = tour.price?.currency || tour.currency || 'LKR';
                        const priceInLkr = (tourCurrency === 'LKR') ? finalPrice : finalPrice / usdRate;
                        const converted = convertPrice(priceInLkr);

                        return (
                            <div
                                key={tour._id || tour.id || idx}
                                style={{ animationDelay: `${idx * 0.1}s` }}
                                className="group relative rounded-3xl overflow-hidden bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 transition-all duration-500 animate-slide-up h-[500px] flex flex-col cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1.5"
                                onClick={() => setSelectedTour(tour)}
                            >
                                <div className="relative h-56 overflow-hidden bg-emerald-900 flex items-center justify-center">
                                    {tour.heroImage || tour.image || tour.images?.[0] ? (
                                        <Image
                                            src={tour.heroImage || tour.image || tour.images[0]}
                                            alt={tour.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
                                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                        />
                                    ) : null}
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-500/50 font-medium" style={{ display: (tour.heroImage || tour.image || tour.images?.[0]) ? 'none' : 'flex' }}>No Image</div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute top-4 left-4">
                                        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold text-emerald-950 uppercase tracking-widest shadow-lg">
                                            <Star size={10} fill="currentColor" className="text-amber-400" /> {tour.rating || 4.8}
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        {tour.highlights && tour.highlights.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {tour.highlights.slice(0, 2).map((h, i) => (
                                                    <span key={i} className="text-[9px] font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">{h}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 md:p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                                        <Clock size={12} /> {tour.duration?.days || 1} Days
                                    </div>
                                    <h3 className="text-lg font-bold mb-3 leading-tight text-emerald-950 dark:text-white transition-colors line-clamp-2">{tour.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed line-clamp-3 mb-6 flex-1">{tour.description}</p>

                                    <div className="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Starting From</span>
                                            <span className="text-lg font-black text-emerald-950 dark:text-white tracking-tight">{converted.symbol}{converted.value.toLocaleString(undefined, { minimumFractionDigits: converted.code === 'LKR' ? 0 : 2, maximumFractionDigits: converted.code === 'LKR' ? 0 : 2 })}</span>
                                        </div>
                                        <button className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 pointer-events-none shadow-sm">
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="col-span-full py-20 text-center text-slate-400 font-medium">
                            No tours found for this category.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ToursWidget;
