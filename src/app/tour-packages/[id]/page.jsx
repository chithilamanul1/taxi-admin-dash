import TourPackageDetailsClient from '../../../components/TourPackageDetailsClient'
import { tourPackages } from '../../../data/tours-data'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }) {
    const { id } = await params
    const tour = tourPackages.find(t => t.id === id) || tourPackages.find(t => t.title.includes(decodeURIComponent(id || '')))

    if (!tour) return { title: 'Tour Not Found' }

    return {
        title: `${tour.title} - Sri Lanka Tour Package - Airport Taxis Pvt (Ltd)`,
        description: `${tour.description.slice(0, 160)}... Book this multi-day tour package across ${tour.destinations?.join(', ')}. Professional guides and premium transport included.`,
        keywords: `${tour.title}, Sri Lanka Tour ${tour.id}, ${tour.destinations?.join(', ')} Tour, Sri Lanka Multi-day Trip, Private Tour Sri Lanka`,
        openGraph: {
            title: tour.title,
            description: tour.description,
            url: `https://airporttaxis.lk/tour-packages/${id}`,
            images: [{ url: tour.image, width: 1200, height: 630, alt: tour.title }]
        }
    }
}

export default async function TourPackagePage({ params }) {
    const { id } = await params
    const tour = tourPackages.find(t => t.id === id) || tourPackages.find(t => t.title.includes(decodeURIComponent(id || '')))

    if (!tour) notFound()

    return <TourPackageDetailsClient tour={tour} />
}
