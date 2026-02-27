import About from '../../components/views/About'

export const metadata = {
    title: '🚐 About Airport Taxis Pvt (Ltd) - Sri Lanka\'s Trusted Transfer Partner',
    description: 'Learn about Airport Taxis Sri Lanka - your premier choice for safe, reliable, and professional airport transfers since 2010. Our mission is to provide world-class service with a local touch. Over 10,000 satisfied travelers.',
    keywords: 'About Airport Taxis Sri Lanka, Trusted Taxi Service Sri Lanka, Reliable Airport Transfer Company, Professional Chauffeurs Sri Lanka, Sri Lanka Tourism Transport History, Why choose Airport Taxis Sri Lanka',
    alternates: {
        canonical: 'https://airporttaxis.lk/about',
    },
    openGraph: {
        title: 'About Airport Taxis Sri Lanka - A Legacy of Excellence',
        description: 'Discover our story and why we are the top-rated airport transfer service in Sri Lanka.',
        url: 'https://airporttaxis.lk/about',
        siteName: 'Airport Taxis Pvt (Ltd)',
        images: [
            {
                url: '/logo.png',
                width: 800,
                height: 800,
                alt: 'Airport Taxis Sri Lanka Logo',
            }
        ],
    }
}

export default function AboutPage() {
    return <About />
}
