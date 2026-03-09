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
        return <div className="w-12 h-12" />
    }

    const isDark = resolvedTheme === 'dark'

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="w-12 h-12 flex items-center justify-center bg-[#FACC15] text-black border-2 border-black hover:bg-black hover:text-[#FACC15] transition-all group relative overflow-hidden"
            aria-label="Toggle Theme"
        >
            <div className={`transition-transform duration-500 ${isDark ? 'rotate-0' : 'rotate-180'}`}>
                {isDark ? <Sun size={24} className="font-black" /> : <Moon size={24} className="font-black" />}
            </div>

            {/* Corner Accent */}
            <div className="absolute top-0 right-0 w-2 h-2 bg-black opacity-20 transform rotate-45 translate-x-1 -translate-y-1"></div>
        </button>
    )
}

export default ThemeToggle
