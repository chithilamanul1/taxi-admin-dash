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
                'navy': '#001C3D', // Custom Navy
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
