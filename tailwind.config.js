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
                'navy': '#111827', // Gray 900
                'gold': '#f59e0b', // Amber 500
                'gold-light': '#fbbf24', // Amber 400
                'gold-dark': '#d97706', // Amber 600
                'accent-blue': '#003366',
                // Re-mapping Emerald to Amber for Global Theme Change (Taxi Yellow)
                emerald: {
                    50: '#fffbeb', // Amber 50
                    100: '#fef3c7', // Amber 100
                    200: '#fde68a', // Amber 200
                    300: '#fcd34d', // Amber 300
                    400: '#fbbf24', // Amber 400 (Main Yellow)
                    500: '#f59e0b', // Amber 500
                    600: '#d97706', // Amber 600
                    700: '#b45309', // Amber 700
                    800: '#92400e', // Amber 800
                    900: '#111827', // Gray 900 (Replacing Dark Green with Black/Gray)
                    950: '#030712', // Gray 950
                },
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
