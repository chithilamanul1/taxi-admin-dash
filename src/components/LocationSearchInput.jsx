'use client'
import { useState, useRef, useEffect } from 'react'
import { MapPin, Loader2, X } from 'lucide-react'
import { loadGoogleMapsScript } from '@/lib/google-maps'

export default function LocationSearchInput({
    label, icon: Icon = MapPin, placeholder,
    initialValue = '', onSelect, required = false
}) {
    const [query, setQuery] = useState(initialValue)
    const [inputValue, setInputValue] = useState(initialValue)
    const [predictions, setPredictions] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const wrapperRef = useRef(null)
    const autocompleteService = useRef(null)
    const placesService = useRef(null)

    useEffect(() => {
        loadGoogleMapsScript().then(() => {
            if (window.google && window.google.maps && window.google.maps.places) {
                autocompleteService.current = new window.google.maps.places.AutocompleteService()
                placesService.current = new window.google.maps.places.PlacesService(document.createElement('div'))
            }
        })
    }, [])

    useEffect(() => {
        if (initialValue && initialValue !== inputValue) {
            setInputValue(initialValue)
        }
    }, [initialValue])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleInputChange = (e) => {
        const val = e.target.value
        setInputValue(val)
        if (!val) {
            setPredictions([])
            setIsOpen(false)
            onSelect({ address: '', lat: null, lon: null })
            return
        }

        if (autocompleteService.current) {
            autocompleteService.current.getPlacePredictions({ input: val, componentRestrictions: { country: 'lk' } }, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                    setPredictions(results)
                    setIsOpen(true)
                } else {
                    setPredictions([])
                }
            })
        }
    }

    const handleSelect = (prediction) => {
        setInputValue(prediction.description)
        setIsOpen(false)

        if (placesService.current) {
            placesService.current.getDetails({ placeId: prediction.place_id, fields: ['geometry', 'formatted_address'] }, (place, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && place.geometry && place.geometry.location) {
                    onSelect({
                        address: place.formatted_address,
                        lat: place.geometry.location.lat(),
                        lon: place.geometry.location.lng()
                    })
                }
            })
        }
    }

    return (
        <div className="relative space-y-2" ref={wrapperRef}>
            {label && <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest pl-2">{label}</label>}
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon size={20} />
                </div>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => inputValue && setIsOpen(true)}
                    placeholder={placeholder}
                    required={required}
                    className="w-full h-12 md:h-14 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800/50 pl-12 pr-10 rounded-2xl outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/20 transition-all font-bold text-sm text-emerald-900 dark:text-white truncate placeholder:text-emerald-900/40 dark:placeholder:text-emerald-400/40"
                />
                {inputValue && (
                    <button type="button" onClick={() => { setInputValue(''); onSelect({ address: '', lat: null, lon: null }); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                        <X size={16} />
                    </button>
                )}
            </div>

            {isOpen && predictions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-emerald-900/10 z-50 overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
                    {predictions.map((p) => (
                        <button
                            key={p.place_id}
                            type="button"
                            onClick={() => handleSelect(p)}
                            className="w-full text-left px-4 py-3 hover:bg-emerald-50 border-b border-gray-100 last:border-0 transition-colors flex items-start gap-3"
                        >
                            <MapPin size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                            <span className="text-sm font-medium text-gray-700 line-clamp-2">{p.description}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
