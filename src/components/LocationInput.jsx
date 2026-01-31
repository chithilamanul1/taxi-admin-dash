'use client';
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, X } from 'lucide-react';

const LocationInput = ({
    label,
    placeholder,
    value,
    onChange, // (address) => void
    onSelect, // ({ address, lat, lon }) => void
    onFocus,
    disabled,
    icon: Icon = MapPin,
    isLoaded // IGNORED: No longer depends on Google Script
}) => {
    const [query, setQuery] = useState(value || '');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

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

        setLoading(true);
        try {
            // Use Nominatim API (bounded to Sri Lanka for better relevance if needed, but general for now)
            // viewbox=79.5,5.8,82.0,9.9&bounded=1 for Sri Lanka bias
            const response = await fetch(`/api/proxy/photon?q=${encodeURIComponent(text)}`);
            const data = await response.json();
            setSuggestions(data);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Nominatim Search Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (item) => {
        const address = item.display_name;
        setQuery(address);
        setSuggestions([]);
        setShowSuggestions(false);

        if (onSelect) {
            onSelect({
                address: address,
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon) // Nominatim returns 'lon'
            });
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
        <div className={`relative group ${props.zIndex || 'z-20'}`} ref={wrapperRef}>
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-900/70 dark:text-emerald-400/70">
                <Icon size={22} />
            </div>

            <input
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => { if (onFocus) onFocus(); if (suggestions.length > 0) setShowSuggestions(true); }}
                disabled={disabled}
                placeholder={placeholder}
                className={`w-full pl-16 pr-14 h-16 rounded-2xl text-base sm:text-lg font-bold bg-white dark:bg-white/5 border border-emerald-900/10 dark:border-white/10 text-emerald-900 dark:text-white outline-none focus:border-emerald-900 dark:focus:border-emerald-500 focus:ring-4 focus:ring-emerald-900/5 dark:focus:ring-emerald-500/10 placeholder:text-emerald-900/40 dark:placeholder:text-white/40 truncate 
                ${disabled ? 'cursor-not-allowed bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700' : 'bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800/50'}`}
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
                    <Loader2 size={16} className="animate-spin text-emerald-600" />
                </div>
            )}

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && !disabled && (
                <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-emerald-900/10 dark:border-white/10 overflow-hidden max-h-64 overflow-y-auto">
                    {suggestions.map((item) => (
                        <button
                            key={item.place_id}
                            onClick={() => handleSelect(item)}
                            className="w-full text-left px-6 py-4 hover:bg-emerald-50 dark:hover:bg-white/5 text-sm border-b border-emerald-900/5 dark:border-white/5 last:border-0 transition-colors group"
                            type="button"
                        >
                            <span className="font-bold text-emerald-900 dark:text-white block truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                                {item.display_name.split(',')[0]}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5 truncate">
                                {item.display_name}
                            </span>
                        </button>
                    ))}
                    <div className="px-4 py-1 bg-slate-50 dark:bg-slate-900/50 text-[10px] text-slate-400 text-right">
                        Search by OpenStreetMap
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationInput;
