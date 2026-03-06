import { useState, useRef, useEffect } from 'react'
import { MapPin, Loader2, X } from 'lucide-react'
import { loadGoogleMapsScript } from '@/lib/google-maps'

export default function LocationSearchInput({
    label, icon: Icon = MapPin, placeholder,
    initialValue = '', onSelect, required = false
}) {
    const [inputValue, setInputValue] = useState(initialValue)
    const [suggestions, setSuggestions] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [googleLoaded, setGoogleLoaded] = useState(false)
    const wrapperRef = useRef(null)
    const autocompleteService = useRef(null)
    const placesService = useRef(null)

    useEffect(() => {
        loadGoogleMapsScript().then(() => {
            if (window.google) {
                setGoogleLoaded(true)
                autocompleteService.current = new window.google.maps.places.AutocompleteService()
                placesService.current = new window.google.maps.places.PlacesService(document.createElement('div'))
            }
        }).catch(err => console.error('Google Maps Load Error:', err))
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

    const handleInputChange = async (e) => {
        const val = e.target.value
        setInputValue(val)

        if (!val || val.length < 3) {
            setSuggestions([])
            setIsOpen(false)
            if (!val) onSelect({ address: '', lat: null, lon: null })
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
        onSelect({ address: '', lat: null, lon: null })
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
                    onFocus={() => inputValue && suggestions.length > 0 && setIsOpen(true)}
                    placeholder={googleLoaded ? placeholder : 'Loading maps...'}
                    required={required}
                    className="w-full h-12 md:h-14 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800/50 pl-12 pr-10 rounded-2xl outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/20 transition-all font-bold text-sm text-emerald-900 dark:text-white truncate placeholder:text-emerald-900/40 dark:placeholder:text-emerald-400/40"
                />
                {loading && (
                    <div className="absolute right-10 top-1/2 -translate-y-1/2">
                        <Loader2 size={16} className="animate-spin text-emerald-600" />
                    </div>
                )}
                {inputValue && !loading && (
                    <button type="button" onClick={clearInput} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                        <X size={16} />
                    </button>
                )}
            </div>

            {isOpen && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-emerald-900/10 dark:border-white/10 z-50 overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
                    {suggestions.map((item) => (
                        <button
                            key={item.place_id}
                            type="button"
                            onClick={() => handleSelect(item)}
                            className="w-full text-left px-4 py-3 hover:bg-emerald-50 dark:hover:bg-white/5 border-b border-gray-100 dark:border-white/5 last:border-0 transition-colors flex items-start gap-3"
                        >
                            <MapPin size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                            <div className="min-w-0">
                                <span className="font-bold text-emerald-900 dark:text-white block truncate">
                                    {item.structured_formatting.main_text}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">
                                    {item.description}
                                </span>
                            </div>
                        </button>
                    ))}
                    <div className="px-4 py-1 bg-slate-50 dark:bg-emerald-900/50 text-[10px] text-slate-400 text-right">
                        Powered by Google
                    </div>
                </div>
            )}
        </div>
    )
}

