'use client';
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, X } from 'lucide-react';
import { loadGoogleMapsScript } from '@/lib/google-maps';

const LocationInput = ({
    label = '',
    placeholder = 'Enter location',
    value = '',
    onChange = (_) => { }, // (address) => void
    onSelect = (_) => { }, // ({ address, lat, lon }) => void
    onFocus = () => { },
    disabled = false,
    icon: Icon = MapPin,
    isLoaded: _isLoaded = true, // Ignored, handled internally
    zIndex = 20
}) => {
    const [query, setQuery] = useState(value || '');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [googleLoaded, setGoogleLoaded] = useState(false);
    const wrapperRef = useRef(null);
    const autocompleteService = useRef(null);
    const placesService = useRef(null);

    // Load Google Maps Script
    useEffect(() => {
        loadGoogleMapsScript().then(() => {
            if (window.google) {
                setGoogleLoaded(true);
                autocompleteService.current = new window.google.maps.places.AutocompleteService();
                placesService.current = new window.google.maps.places.PlacesService(document.createElement('div'));
            }
        }).catch(err => console.error("Google Maps Load Error:", err));
    }, []);

    // Sync external value
    useEffect(() => {
        if (value !== undefined && value !== query) {
            setQuery(value);
        }
    }, [value]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
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

        setLoading(true);
        try {
            autocompleteService.current.getPlacePredictions({
                input: text,
                componentRestrictions: { country: 'lk' } // Restrict to Sri Lanka
            }, (predictions, status) => {
                setLoading(false);
                if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
                    setSuggestions(predictions);
                    setShowSuggestions(true);
                } else {
                    setSuggestions([]);
                }
            });
        } catch (error) {
            console.error("Google Search Error:", error);
            setLoading(false);
        }
    };

    const handleSelect = (item) => {
        const address = item.description;
        setQuery(address);
        setSuggestions([]);
        setShowSuggestions(false);

        if (onSelect) {
            if (placesService.current) {
                setLoading(true);
                placesService.current.getDetails({
                    placeId: item.place_id,
                    fields: ['geometry', 'formatted_address']
                }, (place, status) => {
                    setLoading(false);
                    if (status === window.google.maps.places.PlacesServiceStatus.OK && place.geometry) {
                        onSelect({
                            address: place.formatted_address || address,
                            lat: place.geometry.location.lat(),
                            lon: place.geometry.location.lng()
                        });
                        setQuery(place.formatted_address || address);
                    }
                });
            } else {
                onSelect({ address: address, lat: null, lon: null });
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
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-900/70 dark:text-emerald-400/70">
                <Icon size={22} />
            </div>

            <input
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => { if (onFocus) onFocus(); if (suggestions.length > 0) setShowSuggestions(true); }}
                disabled={disabled}
                placeholder={googleLoaded ? placeholder : 'Loading maps...'}
                className={`w-full pl-16 pr-14 h-16 rounded-2xl text-base sm:text-lg font-bold bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-emerald-900 dark:text-white outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:ring-4 focus:ring-emerald-900/5 dark:focus:ring-emerald-500/10 placeholder:text-slate-500 dark:placeholder:text-white/40 truncate 
                ${disabled ? 'cursor-not-allowed bg-slate-100 dark:bg-emerald-900/20 border-slate-300 dark:border-emerald-700' : 'bg-white dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-800/50 hover:border-emerald-600'}`}
            />

            {/* Clear Button */}
            {!disabled && query && (
                <button
                    onClick={clearInput}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 p-2"
                    type="button"
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
                            lon: place.geometry.location.lng()
                        });
                        setQuery(place.formatted_address || address);
                    } else {
                        onSelect({ address: address, lat: null, lon: null });
                    }
                });
            } else {
                onSelect({ address: address, lat: null, lon: null });
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
            {/* Icon - Prominent Yellow */}
            <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors z-10 ${isFocused ? 'text-black' : 'text-black/30'}`}>
                <div className={`p-2 rounded-lg transition-all ${isFocused ? 'bg-[#FACC15]' : 'bg-black/5'}`}>
                    <Icon size={20} strokeWidth={3} />
                </div>
            </div>

            <input
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => { if (onFocus) onFocus(); setIsFocused(true); }}
                disabled={disabled}
                placeholder={googleLoaded ? placeholder : 'Loading maps...'}
                className={`w-full pl-16 pr-14 h-16 rounded-2xl text-base sm:text-lg font-bold bg-white dark:bg-white/5 border-4 transition-all outline-none text-black dark:text-white uppercase tracking-widest italic
                ${isFocused ? 'border-[#FACC15] shadow-2xl scale-[1.01] -translate-y-1' : 'border-transparent'}
                ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:border-[#FACC15]/20'}`}
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

            {/* Suggestions Dropdown - Premium Box */}
            {isFocused && (suggestions.length > 0 || isLoading) && (
                <div className="absolute top-[110%] left-0 right-0 bg-white dark:bg-[#111] rounded-[2rem] shadow-2xl border-4 border-[#FACC15] p-4 z-[100] animate-fade-in overflow-hidden">
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
                                    className="w-full flex items-center gap-6 p-6 hover:bg-[#FACC15] group transition-all rounded-2xl text-left border-b border-slate-100 last:border-0"
                                >
                                    <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center group-hover:bg-black/10 transition-colors">
                                        <MapPin size={18} className="text-black/50 group-hover:text-black" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-black text-sm uppercase italic tracking-wider truncate mb-1">
                                            {s.structured_formatting?.main_text || s.description.split(',')[0]}
                                        </p>
                                        <p className="text-[10px] font-bold text-black/40 group-hover:text-black/60 uppercase tracking-widest truncate">
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
