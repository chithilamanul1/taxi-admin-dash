'use client'
import { useState, useRef, useEffect } from 'react'
import { MapPin, Loader2, X } from 'lucide-react'
import { debounce } from '@/lib/utils'

export default function LocationSearchInput({
    label, icon: Icon = MapPin, placeholder,
    initialValue = '', onSelect, required = false
}) {
    const [query, setQuery] = useState(initialValue)
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const wrapperRef = useRef(null)

    // Sync external initialValue change
    useEffect(() => {
        if (initialValue && initialValue !== query) {
            setQuery(initialValue)
        }
    }, [initialValue])

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const searchLocation = async (q) => {
        if (!q || q.length < 3) return
        setLoading(true)
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&countrycodes=lk`)
            if (res.ok) {
                const data = await res.json()
                setResults(data)
                setIsOpen(true)
            }
        } catch (e) { console.error(e) }
        setLoading(false)
    }

    const debouncedSearch = useRef(debounce(searchLocation, 500)).current

    const handleChange = (e) => {
        const val = e.target.value
        setQuery(val)
        if (val) debouncedSearch(val)
        else {
            setResults([])
            setIsOpen(false)
            onSelect({ address: '', lat: null, lon: null })
        }
    }

    const handleSelect = (item) => {
        const addr = item.display_name
        setQuery(addr)
        setIsOpen(false)
        onSelect({ address: addr, lat: parseFloat(item.lat), lon: parseFloat(item.lon) })
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
                    value={query}
                    onChange={handleChange}
                    onFocus={() => query && setIsOpen(true)}
                    placeholder={placeholder}
                    required={required}
                    className="w-full h-12 md:h-14 bg-white border border-emerald-900/10 pl-12 pr-10 rounded-2xl outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-900/5 transition-all font-bold text-sm text-emerald-900 truncate"
                />
                {loading && <div className="absolute right-4 top-1/2 -translate-y-1/2"><Loader2 className="animate-spin text-emerald-600" size={16} /></div>}
                {query && !loading && (
                    <button type="button" onClick={() => { setQuery(''); onSelect({ address: '', lat: null, lon: null }); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                        <X size={16} />
                    </button>
                )}
            </div>

            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-emerald-900/10 z-50 overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
                    {results.map((r, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => handleSelect(r)}
                            className="w-full text-left px-4 py-3 hover:bg-emerald-50 border-b border-gray-100 last:border-0 transition-colors flex items-start gap-3"
                        >
                            <MapPin size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                            <span className="text-sm font-medium text-gray-700 line-clamp-2">{r.display_name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
