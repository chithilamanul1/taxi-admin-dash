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
        if (inputRef.current) {
            inputRef.current.focus() // Focus input after clearing
        }
    }

    const handleFocus = () => {
        setIsFocused(true)
        if (inputValue && suggestions.length > 0) {
            setIsOpen(true)
        }
    }

    const handleBlur = () => {
        // Delay setting isFocused to false to allow click on suggestion
        setTimeout(() => {
            if (!wrapperRef.current.contains(document.activeElement)) {
                setIsFocused(false)
                setIsOpen(false)
            }
        }, 100)
    }

    return (
        <div className="relative space-y-2" ref={wrapperRef}>
            {label && <label className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest pl-2">{label}</label>}
            <div className="relative">
                {/* Icon - Clean Style */}
                <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors z-10 ${isFocused ? 'text-amber-500' : 'text-slate-400'}`}>
                    <div className={`p-2 rounded-lg border border-transparent transition-all ${isFocused ? 'bg-amber-50' : 'bg-transparent'}`}>
                        <Icon size={20} strokeWidth={3} />
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
                    disabled={!googleLoaded} // Disable input if Google Maps not loaded
                    placeholder={googleLoaded ? placeholder : 'Loading maps...'}
                    required={required}
                    className={`w-full pl-20 pr-14 h-14 rounded-xl text-base sm:text-lg font-bold bg-white dark:bg-[#1a1a1a] border transition-all outline-none text-black dark:text-white uppercase tracking-widest italic
                    ${isFocused && googleLoaded ? 'border-amber-400 dark:border-yellow-400 shadow-sm -translate-y-0.5' : 'border-slate-200 dark:border-white/20'}
                    ${!googleLoaded ? 'cursor-not-allowed opacity-75 bg-slate-50 dark:bg-white/5 grayscale-[0.5]' : 'hover:border-amber-400 dark:hover:border-white/40'}`}
                />

                {/* Loading Spinner */}
                {loading && (
                    <div className="absolute right-10 top-1/2 -translate-y-1/2">
                        <Loader2 size={16} className="animate-spin text-emerald-600" />
                    </div>
                )}

                {/* Clear Button */}
                {inputValue && !loading && !(!googleLoaded) && ( // Show clear button if input has value, not loading, and not disabled
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); clearInput(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-black dark:hover:text-white transition-colors bg-white dark:bg-[#1a1a1a]"
                    >
                        <X size={16} strokeWidth={3} />
                    </button>
                )}
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

