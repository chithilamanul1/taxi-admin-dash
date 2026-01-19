/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'navy': '#001C3D',
                'gold': '#FFCC00',
                'gold-light': '#FFD633',
                'gold-dark': '#E6B800',
                'accent-blue': '#003366',
            },
            fontFamily: {
                'sans': ['Inter', 'sans-serif', 'Montserrat'],
            },
        },
    },
    plugins: [],
}
