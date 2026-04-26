import { useState, useRef, useEffect } from 'react'
import { MapPin, Loader2, X, Navigation } from 'lucide-react'
import { loadGoogleMapsScript } from '@/lib/google-maps'

export default function LocationSearchInput({
    label, icon: Icon = MapPin, placeholder,
    initialValue = '', onSelect, required = false
}) {
    const [inputValue, setInputValue] = useState(initialValue)
    const [suggestions, setSuggestions] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [googleLoaded, setGoogleLoaded] = useState(false)
    const wrapperRef = useRef(null)
    const inputRef = useRef(null)
    const autocompleteService = useRef(null)
    const placesService = useRef(null)

    const initGoogleMaps = () => {
        if (googleLoaded) return;
        loadGoogleMapsScript().then(() => {
            if (window.google) {
                setGoogleLoaded(true)
                autocompleteService.current = new window.google.maps.places.AutocompleteService()
                placesService.current = new window.google.maps.places.PlacesService(document.createElement('div'))
            }
        }).catch(err => console.error('Google Maps Load Error:', err))
    };

    useEffect(() => {
        if (initialValue && initialValue !== inputValue) {
            setInputValue(initialValue)
        }
    }, [initialValue])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false)
                setIsFocused(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleInputChange = async (e) => {
        const val = e.target.value
        setInputValue(val)

        if (!val || val.length < 3) {
            setSuggestions([])
            setIsOpen(false)
            if (!val && onSelect) onSelect({ address: '', lat: null, lon: null })
            return
        }

        if (!autocompleteService.current) return;

        setLoading(true)
        try {
            autocompleteService.current.getPlacePredictions({
                input: val,
                componentRestrictions: { country: 'lk' }
            }, (predictions, status) => {
                setLoading(false)
                if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
                    setSuggestions(predictions)
                    setIsOpen(true)
                } else {
                    setSuggestions([])
                    setIsOpen(false)
                }
            })
        } catch (error) {
            console.error('Location search error:', error)
            setSuggestions([])
            setLoading(false)
        }
    }

    const handleSelect = (item) => {
        const address = item.description
        setInputValue(address)
        setIsOpen(false)
        setSuggestions([])

        if (placesService.current) {
            setLoading(true)
            placesService.current.getDetails({
                placeId: item.place_id,
                fields: ['geometry', 'formatted_address']
            }, (place, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && place.geometry) {
                    onSelect({
                        address: place.formatted_address || address,
                        lat: place.geometry.location.lat(),
                        lon: place.geometry.location.lng()
                    })
                    setInputValue(place.formatted_address || address)
                }
                setLoading(false)
            })
        } else {
            onSelect({ address: address, lat: null, lon: null })
        }
    }

    const clearInput = () => {
        setInputValue('')
        setSuggestions([])
        if (onSelect) onSelect({ address: '', lat: null, lon: null })
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    const handleFocus = () => {
        setIsFocused(true)
        if (inputValue && suggestions.length > 0) {
            setIsOpen(true)
        }
    }

    const handleBlur = () => {
        setTimeout(() => {
            if (wrapperRef.current && !wrapperRef.current.contains(document.activeElement)) {
                setIsOpen(false)
                setIsFocused(false)
            }
        }, 200)
    }

    return (
        <div className="relative space-y-3" ref={wrapperRef}>
            {label && (
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] pl-3 leading-none">
                    {label}
                </label>
            )}
            <div className="relative">
                {/* Icon - Brutalist Style */}
                <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors z-10 ${isFocused ? 'text-black' : 'text-slate-400'}`}>
                    <div className={`p-2 rounded-none border-2 border-black transition-all ${isFocused ? 'bg-[#FACC15] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white border-black/20 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]'}`}>
                        <Icon size={18} strokeWidth={3} className={isFocused ? 'text-black' : 'text-slate-400'} />
                    </div>
                </div>

                {/* Input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={!googleLoaded}
                    placeholder={googleLoaded ? placeholder : 'Loading Maps API...'}
                    required={required}
                    className={`w-full pl-16 sm:pl-20 pr-14 h-14 rounded-none text-base sm:text-lg font-black bg-white dark:bg-[#1a1a1a] border-4 transition-all outline-none text-black dark:text-white uppercase tracking-widest
                    ${isFocused ? 'border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5' : 'border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]'}
                    ${!googleLoaded ? 'cursor-not-allowed opacity-50 grayscale' : 'hover:border-black active:translate-y-0'}`}
                />

                {/* Status Indicators */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {loading && (
                        <Loader2 size={16} className="animate-spin text-[#FACC15]" strokeWidth={3} />
                    )}
                    {inputValue && !loading && googleLoaded && (
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); clearInput(); }}
                            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                        >
                            <X size={18} strokeWidth={3} />
                        </button>
                    )}
                </div>
            </div>

            {/* Suggestions Dropsdown */}
            {isOpen && suggestions.length > 0 && (
                <div 
                    className="absolute top-[105%] left-0 right-0 bg-white dark:bg-[#111] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-[100] animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden"
                >
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        {suggestions.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSelect(item)}
                                className="w-full flex items-center gap-6 p-6 hover:bg-[#FACC15] transition-all text-left border-b-2 border-black last:border-0 group"
                            >
                                <div className="w-10 h-10 bg-white dark:bg-black border-2 border-black flex items-center justify-center shrink-0 group-hover:bg-black transition-colors">
                                    <MapPin size={18} className="text-black dark:text-[#FACC15] group-hover:text-[#FACC15]" strokeWidth={3} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-black dark:text-white group-hover:text-black text-sm uppercase tracking-widest truncate mb-0.5">
                                        {item.structured_formatting?.main_text || item.description.split(',')[0]}
                                    </p>
                                    <p className="text-[10px] font-bold text-black/50 dark:text-slate-400 group-hover:text-black/70 uppercase tracking-[0.2em] truncate">
                                        {item.structured_formatting?.secondary_text || item.description.split(',').slice(1).join(',')}
                                    </p>
                                </div>
                                <Navigation size={16} className="text-[#FACC15] opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
