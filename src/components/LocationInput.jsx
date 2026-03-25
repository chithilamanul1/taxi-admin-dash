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

    useEffect(() => {
        loadGoogleMapsScript().then(() => {
            if (window.google) {
                setGoogleLoaded(true);
                autocompleteService.current = new window.google.maps.places.AutocompleteService();
                placesService.current = new window.google.maps.places.PlacesService(document.createElement('div'));
            }
        }).catch(err => console.error("Google Maps Load Error:", err));
    }, []);

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
            {/* Icon - Boxy Style */}
            <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors z-10 ${isFocused ? 'text-black' : 'text-black/50'}`}>
                <div className={`p-2 rounded-none border-2 border-black transition-all ${isFocused ? 'bg-[#FACC15]' : 'bg-white'}`}>
                    <Icon size={20} className="dark:text-black" strokeWidth={3} />
                </div>
            </div>

            <input
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => { if (onFocus) onFocus(); setIsFocused(true); }}
                disabled={disabled}
                placeholder={googleLoaded ? placeholder : 'Loading maps...'}
                className={`w-full pl-16 sm:pl-20 pr-10 sm:pr-14 h-14 rounded-none text-base sm:text-lg font-black bg-white dark:bg-[#1a1a1a] border-[3px] transition-all outline-none text-black dark:text-white uppercase tracking-widest italic
                ${isFocused && !disabled ? 'border-black -translate-y-0.5' : 'border-black'}
                ${disabled ? 'cursor-not-allowed opacity-75 bg-slate-50 dark:bg-white/5 grayscale-[0.5]' : 'hover:-translate-y-0.5'}`}
            />

            {/* Clear Button */}
            {!disabled && query && (
                <button
                    onClick={clearInput}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 p-2 z-10"
                    type="button"
                >
                    <X size={16} />
                </button>
            )}

            {/* Suggestions Dropdown - Boxy Style */}
            {isFocused && (suggestions.length > 0 || isLoading) && (
                <div className="absolute top-[110%] left-0 right-0 bg-white dark:bg-[#111] rounded-none border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_#FACC15] p-0 z-[100] animate-fade-in overflow-hidden">
                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                        {isLoading ? (
                            <div className="p-8 flex items-center justify-center">
                                <div className="w-8 h-8 border-4 border-[#FACC15] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onMouseDown={() => handleSelect(s)}
                                    className="w-full flex items-center gap-6 p-6 hover:bg-[#FACC15] group transition-all rounded-none text-left border-b-2 border-black last:border-0"
                                >
                                    <div className="w-10 h-10 bg-white dark:bg-black rounded-none border-2 border-black flex items-center justify-center group-hover:bg-black transition-colors">
                                        <MapPin size={18} className="text-black dark:text-[#FACC15] group-hover:text-[#FACC15]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-black dark:text-white group-hover:text-black text-sm uppercase italic tracking-wider truncate mb-1 transition-colors">
                                            {s.structured_formatting?.main_text || s.description.split(',')[0]}
                                        </p>
                                        <p className="text-[10px] font-bold text-black/50 dark:text-slate-400 group-hover:text-black/70 uppercase tracking-widest truncate transition-colors">
                                            {s.structured_formatting?.secondary_text || s.description.split(',').slice(1).join(',')}
                                        </p>
                                    </div>
                                    <ArrowRight size={16} className="text-[#FACC15] group-hover:text-black opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
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
