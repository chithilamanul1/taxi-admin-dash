'use client';

import React, { useState, useEffect } from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { MapPin, Navigation, X } from 'lucide-react';

const LocationInput = ({
    label,
    placeholder,
    value,       // Initial/External value text
    onChange,    // (text) => void
    onSelect,    // (location: { address, lat, lng }) => void
    disabled,
    icon: Icon = MapPin,
    isLoaded     // Google Maps Script Loaded status
}) => {
    const {
        ready,
        value: inputValue,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            /* Define search scope here if needed, e.g., componentRestrictions: { country: "lk" } */
        },
        debounce: 300,
        cache: 24 * 60 * 60,
    });

    // Sync external value
    useEffect(() => {
        if (value !== undefined && value !== inputValue) {
            setValue(value, false);
        }
    }, [value, setValue]);

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();

        if (onSelect) {
            try {
                const results = await getGeocode({ address });
                const { lat, lng } = await getLatLng(results[0]);
                onSelect({ address, lat, lng });
            } catch (error) {
                console.error("Error Geocoding: ", error);
            }
        }
    };

    const handleInput = (e) => {
        setValue(e.target.value);
        if (onChange) onChange(e.target.value);
    };

    if (!isLoaded) {
        // Fallback style if script not loaded or Loading
        return (
            <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-900/40 dark:text-emerald-400/40"><Icon size={22} /></div>
                <input
                    disabled={true}
                    placeholder="Loading Maps..."
                    className="w-full pl-16 pr-14 h-16 rounded-2xl text-base sm:text-lg font-bold bg-slate-100 dark:bg-white/5 border border-emerald-900/10 text-slate-400"
                />
            </div>
        )
    }

    return (
        <div className="relative group z-20">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-900/40 dark:text-emerald-400/40">
                <Icon size={22} />
            </div>

            <input
                value={inputValue}
                onChange={handleInput}
                disabled={!ready || disabled}
                placeholder={placeholder}
                className={`w-full pl-16 pr-14 h-16 rounded-2xl text-base sm:text-lg font-bold bg-white dark:bg-white/5 border border-emerald-900/10 dark:border-white/10 text-emerald-900 dark:text-white outline-none focus:border-emerald-900 dark:focus:border-emerald-500 focus:ring-4 focus:ring-emerald-900/5 dark:focus:ring-emerald-500/10 transition-all placeholder:text-emerald-900/30 dark:placeholder:text-white/30 truncate 
                ${disabled ? 'cursor-not-allowed bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700' : 'group-hover:border-emerald-900/20'}`}
            />

            {/* Clear Button */}
            {!disabled && inputValue && (
                <button
                    onClick={() => { setValue("", false); clearSuggestions(); if (onChange) onChange(""); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 p-2"
                >
                    <X size={16} />
                </button>
            )}

            {/* Suggestions Dropdown */}
            {status === "OK" && !disabled && (
                <div className="absolute z-50 top-full left-0 right-0 mt-3 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-emerald-900/10 dark:border-white/10 animate-slide-up">
                    {data.map(({ place_id, description, structured_formatting }) => (
                        <button
                            key={place_id}
                            onClick={() => handleSelect(description)}
                            className="w-full text-left px-6 py-4 hover:bg-emerald-50 dark:hover:bg-white/5 text-sm border-b border-emerald-900/5 dark:border-white/5 last:border-0 transition-colors group"
                        >
                            <span className="font-bold text-emerald-900 dark:text-white block group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                                {structured_formatting.main_text}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                                {structured_formatting.secondary_text}
                            </span>
                        </button>
                    ))}
                    <div className="px-6 py-2 bg-slate-50 dark:bg-black/20 flex justify-end">
                        <img src="https://developers.google.com/maps/documentation/images/powered_by_google_on_white.png" alt="Powered by Google" className="h-4 opacity-50" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationInput;
