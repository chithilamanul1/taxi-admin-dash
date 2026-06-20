export const metadata = {
    title: 'Sri Lanka Tour Packages | Best All-Island Tours & Safaris',
    description: 'Explore our curated Sri Lanka tour packages. From wildlife safaris to cultural heritage tours, enjoy premium private transport and expert guides.',
    alternates: { canonical: 'https://airporttaxis.lk/tours' },
    openGraph: {
        title: 'Sri Lanka Tour Packages | Airport Taxis',
        description: 'Discover curated Sri Lanka tour packages with premium private transport.',
        url: 'https://airporttaxis.lk/tours',
    }
};

export default function ToursLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
