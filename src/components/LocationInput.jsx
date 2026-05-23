'use client';
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, X, ArrowRight } from 'lucide-react';
import { loadGoogleMapsScript } from '@/lib/google-maps';

const LocationInput = ({
    label = '',
    placeholder = 'Enter location',
    value = '',
    onChange = (_) => { },
    onSelect = (_) => { },
    onFocus = () => { },
    disabled = false,
    error = false,
    icon: Icon = MapPin,
    isLoaded: _isLoaded = true,
    zIndex = 20
}) => {
    const [query, setQuery] = useState(value || '');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [googleLoaded, setGoogleLoaded] = useState(false);
    const wrapperRef = useRef(null);
    const autocompleteService = useRef(null);
    const placesService = useRef(null);

    const initGoogleMaps = async () => {
        if (googleLoaded) return;
        setIsLoading(true);
        try {
            await loadGoogleMapsScript();
            if (window.google) {
                setGoogleLoaded(true);
                autocompleteService.current = new window.google.maps.places.AutocompleteService();
                placesService.current = new window.google.maps.places.PlacesService(document.createElement('div'));
            }
        } catch (err) {
            console.error("Google Maps Load Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (value !== undefined && value !== query) {
            setQuery(value);
        }
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSearch = async (text) => {
        setQuery(text);
        onChange && onChange(text);

        if (text.length < 3) {
            setSuggestions([]);
            return;
        }

        if (!autocompleteService.current) return;

        setIsLoading(true);
        try {
            autocompleteService.current.getPlacePredictions({
                input: text,
                componentRestrictions: { country: 'lk' }
            }, (predictions, status) => {
                setIsLoading(false);
                if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
                    setSuggestions(predictions);
                } else {
                    setSuggestions([]);
                }
            });
        } catch (error) {
            console.error("Google Search Error:", error);
            setIsLoading(false);
        }
    };

    const handleSelect = (item) => {
        const address = item.description;
        setQuery(address);
        setSuggestions([]);
        setIsFocused(false);

        if (onSelect) {
            if (placesService.current) {
                setIsLoading(true);
                placesService.current.getDetails({
                    placeId: item.place_id,
                    fields: ['geometry', 'formatted_address']
                }, (place, status) => {
                    setIsLoading(false);
                    if (status === window.google.maps.places.PlacesServiceStatus.OK && place.geometry) {
                        onSelect({
                            address: place.formatted_address || address,
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng()
                        });
                        setQuery(place.formatted_address || address);
                    } else {
                        onSelect({ address: address, lat: null, lng: null });
                    }
                });
            } else {
                onSelect({ address: address, lat: null, lng: null });
            }
        }
        if (onChange) onChange(address);
    };

    const clearInput = () => {
        setQuery('');
        setSuggestions([]);
        if (onChange) onChange('');
        if (onSelect) onSelect({ address: '', lat: null, lon: null });
    };

    return (
        <div className={`relative group ${zIndex || 'z-20'}`} ref={wrapperRef}>
            {/* Icon - Modern Styled */}
            <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 transition-colors z-10 flex items-center justify-center">
                <Icon size={20} className={disabled ? "text-slate-400" : error ? "text-red-500" : "text-emerald-600 dark:text-[#FACC15]"} strokeWidth={2.5} />
            </div>

            <input
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => { 
                    if (onFocus) onFocus(); 
                    setIsFocused(true); 
                    initGoogleMaps();
                }}
                disabled={disabled}
                placeholder={googleLoaded ? placeholder : 'Loading maps...'}
                aria-label={label || placeholder}
                className={`w-full pl-12 sm:pl-14 pr-10 sm:pr-14 h-14 rounded-2xl text-sm sm:text-base font-medium transition-all outline-none border
                ${disabled 
                    ? 'bg-slate-50 dark:bg-zinc-800/50 border-slate-200 dark:border-white/5 text-slate-400 cursor-not-allowed shadow-inner' 
                    : error 
                        ? 'bg-white dark:bg-zinc-800 border-red-500 ring-2 ring-red-500/20 text-slate-800 dark:text-white shadow-sm'
                        : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-white/10 text-slate-800 dark:text-white shadow-sm hover:border-slate-300 dark:hover:border-white/20 focus:border-emerald-500 dark:focus:border-[#FACC15] focus:ring-4 focus:ring-emerald-500/10 dark:focus:ring-[#FACC15]/10'}`}
            />

            {/* Clear Button */}
            {!disabled && query && (
                <button
                    onClick={clearInput}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 p-2 z-10 bg-white dark:bg-zinc-800 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors"
                    type="button"
                >
                    <X size={16} />
                </button>
            )}

            {/* Suggestions Dropdown - Modern UI */}
            {isFocused && (suggestions.length > 0 || isLoading) && (
                <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-zinc-800 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none p-2 z-[100] animate-fade-in overflow-hidden">
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                        {isLoading ? (
                            <div className="p-8 flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-emerald-500 dark:text-[#FACC15] animate-spin" />
                            </div>
                        ) : (
                            suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onMouseDown={() => handleSelect(s)}
                                    className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-zinc-700/50 rounded-xl group transition-all text-left mb-1 last:mb-0"
                                >
                                    <div className="w-10 h-10 bg-slate-100 dark:bg-zinc-900 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-white dark:group-hover:bg-zinc-800 group-hover:shadow-sm transition-all">
                                        <MapPin size={18} className="text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-[#FACC15] transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-800 dark:text-white text-sm truncate mb-0.5 transition-colors">
                                            {s.structured_formatting?.main_text || s.description.split(',')[0]}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate transition-colors">
                                            {s.structured_formatting?.secondary_text || s.description.split(',').slice(1).join(',')}
                                        </p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationInput;
