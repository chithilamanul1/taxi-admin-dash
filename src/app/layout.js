import './globals.css'
import Navbar from '../components/Navbar'
import FloatingContact from '../components/FloatingContact'
import Footer from '../components/Footer'
import AuthProvider from '../components/AuthProvider'
import { ThemeProvider } from '../components/ThemeProvider'
import LiveChatWidget from '../components/LiveChatWidget'

export const metadata = {
    title: {
        default: 'Airport Taxis Pvt (Ltd) - Sri Lanka\'s #1 Airport Transfer & Tour Service',
        template: '%s | Airport Taxis Pvt (Ltd)'
    },
    description: '🚕 Reliable 24/7 Airport Transfers in Sri Lanka. Book Colombo Airport (CMB) taxis, private tours, and city transfers. Best rates, professional drivers, and instant booking. Trusted by thousands of travelers!',
    keywords: [
        'Airport Taxi Sri Lanka', 'Colombo Airport Transfer', 'CMB Airport Taxi', 'Sri Lanka Day Trips', 'Sri Lanka Tour Packages',
        'Private Chauffeur Sri Lanka', 'Airport Pickup Colombo', 'Travel Sri Lanka Transport', 'Taxi service Colombo',
        'Cheap airport taxi Sri Lanka', 'Book taxi Colombo airport', 'Sri Lanka airport car hire with driver',
        'taxi service', 'taxi sri lanka', 'kangaroo cabs', 'airport taxis', 'taxi near me', 'uber taxi',
        'taxi service near me', 'cabs near me', 'cab service near me', 'airport transfer', 'taxi booking',
        'airport taxi transfers', 'yellow cab near me', 'cab company near me', 'uber cabs', 'cab service',
        'taxi cab near me', 'taxi cab', 'cab booking', 'local taxi near me', 'uber taxi near me',
        'taxi company near me', 'cheap taxi near me', 'airport taxi near me', 'local taxi', 'car service to airport',
        'city taxi', 'taxi number', 'lyft taxi', 'minicab near me', 'uber taxis phone number', 'affordable taxi near me',
        'book a taxi near me', 'yellow taxi', 'call taxi', 'airport taxi service', 'cheap airport transfers',
        'taxi cerca de mí', 'go taxi', 'call taxi near me', 'local taxi service', 'taxi new york', 'cab company',
        'booking com taxi', 'uber taxi service', 'uber cab booking', 'cheap taxi', '24 hour taxi near me',
        'cheapest taxi service near me', 'taxi barcelona airport', 'airport transfers near me', 'taxi company',
        'taxi van', 'local taxi service near me', 'local cabs near me', 'taxi number near me', 'private taxi near me',
        'green taxi', 'cheap cabs near me', 'uber taxi phone number near me', 'a1 taxi', 'taxis cerca', 'taxi quote',
        'wheelchair accessible taxi', 'book airport transfer', 'wheelchair taxi', 'call a cab', 'uber taxi booking',
        'taxi phone number', 'yellow cab taxi near me', 'uber cab service', 'yellow cab taxi', 'long distance taxi',
        'cheapest ride service', 'taxi around me', 'i need a taxi', 'airport pickup service', 'taxi to airport near me',
        'taxi prices', 'taxi transfers', 'airport taxi booking', 'yellow taxi near me', 'wheelchair taxi service near me',
        'taxi stand near me', 'taxi numero', 'taxi cab service near me', 'taxi reservation', 'airport cab',
        '24 hour taxi service near me', 'local cabs', 'taxi booking near me', 'private transfer', 'taxi nearby',
        'corporate cabs', 'city cabs', 'call a taxi near me', 'universal taxi', 'local cab company', 'taxi st tropez',
        'booking com airport transfers', 'uber car service', 'uber ride share', 'uber taxi number', 'i need a cab',
        'taxi hire', 'red taxi', 'get a taxi', 'get a cab', 'call uber taxi', 'uber ride estimate cost',
        'black and white taxis', 'find a taxi near me', 'sureway cab', 'need a cab', 'station taxis', 'cab prices',
        'it taxi', 'ace taxis', 'ac taxis', 'shuttle taxi', 'washington taxi', 'uber cab number', 'car taxi service',
        'uber taxi service near me', 'closest cab service', 'uber taxi usa', 'universal taxi near me', 'uber taxi ride',
        'dc cabs', 'fast taxi near me', 'uber transport services', 'find a cab near me', 'taxi cash near me',
        'city cab phone number', 'nearest taxi cab service', 'grand taxi', 'uber chauffeur service', 'taxi uber lyft',
        'taxi call near me', 'call uber cab', 'express taxi service', 'uber cab ride', 'uber for flying',
        'uber wheelchair accessible taxi', 'taxi uber new york', 'carolina taxi', 'find me a taxi near me',
        'base de taxi near me', 'cibao taxi', 'find a taxi cab near me', 'find me a cab near me', 'mariachi taxi',
        'nearby taxi cab service', 'ride share taxi', 'rideshare taxi', 'spanish cabs near me', 'uber drone taxi',
        'uber ride hailing service', 'uber taxi no'
    ],

    authors: [{ name: 'Airport Taxis Pvt (Ltd)' }],
    creator: 'Airport Taxis Pvt (Ltd)',
    publisher: 'Airport Taxis Pvt (Ltd)',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://airporttaxis.lk'),
    alternates: {
        canonical: 'https://airporttaxis.lk',
    },
    openGraph: {
        title: '🚖 Airport Taxis Sri Lanka - Trusted Airport Transfers & Tours',
        description: 'Book Now! Reliable 24/7 airport transfers from Colombo Airport (CMB). Professional drivers, comfortable vehicles, instant confirmation. Explore Sri Lanka with trusted taxi service.',
        url: 'https://airporttaxis.lk',
        siteName: 'Airport Taxis Pvt (Ltd)',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Airport Taxis Sri Lanka - Your Trusted Airport Transfer Partner',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },

    twitter: {
        card: 'summary_large_image',
        title: '🚖 Airport Taxis Sri Lanka - Book Your Ride Now',
        description: 'Trusted 24/7 airport transfers & tours. Professional drivers, instant confirmation, best rates guaranteed!',
        images: ['/og-image.jpg'],
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: [
            { url: '/favicon.ico' },
            { url: '/logo.png', type: 'image/png' },
        ],
        apple: '/logo.png',
    },
}

// JSON-LD Structured Data
const jsonLd = [
    {
        '@context': 'https://schema.org',
        '@type': 'TaxiService',
        name: 'Airport Taxis Pvt (Ltd)',
        description: 'Premium airport transfer service in Sri Lanka',
        url: 'https://airporttaxis.lk',
        telephone: '+94716885880',
        email: 'info@airporttaxis.lk',
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'LK',
            addressLocality: 'Colombo',
        },
        areaServed: {
            '@type': 'Country',
            name: 'Sri Lanka',
        },
        priceRange: '$$',
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '00:00',
            closes: '23:59',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '5.0',
            reviewCount: '296',
        },
        sameAs: [
            'https://www.facebook.com/airporttaxistours',
            'https://www.instagram.com/airporttaxistours',
        ],
    },
    {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Airport Taxis Pvt (Ltd)',
        url: 'https://airporttaxis.lk',
        logo: 'https://airporttaxis.lk/logo.png',
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+94716885880',
            contactType: 'customer service',
            areaServed: 'LK',
            availableLanguage: ['English', 'Sinhala']
        }
    }
]

import { CurrencyProvider } from '../context/CurrencyContext'

// ... existing imports

import { Inter, Montserrat } from 'next/font/google'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-montserrat',
    display: 'swap',
})

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning className={`${inter.variable} ${montserrat.variable}`}>
            <head>
                <link rel="preconnect" href="https://ipapi.co" />
                <link rel="dns-prefetch" href="https://ipapi.co" />
                <link rel="preconnect" href="https://api.exchangerate-api.com" />
                <link rel="dns-prefetch" href="https://api.exchangerate-api.com" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className="font-sans text-slate-800 antialiased selection:bg-emerald-600 selection:text-white dark:bg-slate-950 dark:text-slate-100">
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <AuthProvider>
                        <CurrencyProvider>
                            <Navbar />
                            <main>{children}</main>
                            <FloatingContact />
                            <LiveChatWidget />
                            <Footer />
                        </CurrencyProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
