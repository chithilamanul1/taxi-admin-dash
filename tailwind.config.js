/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'navy': '#064e3b', // Mapped to emerald-900 for backward compatibility safety
                'gold': '#059669', // Mapped to emerald-600
                'gold-light': '#34d399', // Mapped to emerald-400
                'gold-dark': '#065f46', // Mapped to emerald-800
                'accent-blue': '#003366',
            },
            fontFamily: {
                'sans': ['Inter', 'sans-serif', 'Montserrat'],
            },
            keyframes: {
                'slide-up': {
                    '0%': { transform: 'translateY(100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            },
            animation: {
                'slide-up': 'slide-up 0.5s ease-out forwards',
            }
        },
    },
    plugins: [],
}
