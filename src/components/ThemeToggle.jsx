'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

const ThemeToggle = () => {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="w-10 h-10" /> // Placeholder to avoid hydration mismatch
    }

    return (
        <button
            type="button"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10 hover:border-white/20 shadow-sm"
            aria-label="Toggle Theme"
        >
            {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    )
}

export default ThemeToggle
