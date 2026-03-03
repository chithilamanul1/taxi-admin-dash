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
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/60 group-focus-within:text-[#FFDA00] transition-colors">
                <Icon size={22} strokeWidth={2.5} />
            </div>

            <input
                value={query}
                onChange={(e) => {
                    handleSearch(e.target.value);
                    if (navigator.vibrate) navigator.vibrate(5);
                }}
                onFocus={() => { if (onFocus) onFocus(); if (suggestions.length > 0) setShowSuggestions(true); }}
                disabled={disabled}
                placeholder={googleLoaded ? placeholder : 'Loading maps...'}
                className={`w-full pl-16 pr-14 h-[70px] rounded-2xl text-base font-bold bg-white dark:bg-slate-900 border-[3px] border-slate-900 dark:border-[#FFDA00] text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-[#FFDA00]/20 placeholder:text-slate-500 dark:placeholder:text-slate-400 truncate shadow-2xl transition-all duration-300
                ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:border-black dark:hover:border-white hover:ring-2 hover:ring-black/5'}`}
            />

            {/* Clear Button */}
            {!disabled && query && (
                <button
                    onClick={clearInput}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 p-2"
                    type="button"
                >
                    <X size={16} />
                </button>
            )}

            {/* Loading Indicator */}
            {loading && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2">
                    <Loader2 size={16} className="animate-spin text-[#FFDA00]" />
                </div>
            )}

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && !disabled && (
                <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-black/5 dark:border-white/10 overflow-hidden max-h-64 overflow-y-auto">
                    {suggestions.map((item) => (
                        <button
                            key={item.place_id}
                            onClick={() => handleSelect(item)}
                            className="w-full text-left px-6 py-4 hover:bg-slate-50 dark:hover:bg-white/5 text-sm border-b border-slate-100 dark:border-white/5 last:border-0 transition-colors group"
                            type="button"
                        >
                            <span className="font-bold text-slate-900 dark:text-white block truncate group-hover:text-black dark:group-hover:text-[#FFDA00]">
                                {item.structured_formatting.main_text}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5 truncate">
                                {item.description}
                            </span>
                        </button>
                    ))}
                    <div className="px-4 py-1 bg-slate-50 dark:bg-slate-900/50 text-[10px] text-slate-400 text-right">
                        Powered by Google
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationInput;
