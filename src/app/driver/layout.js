export const metadata = {
    title: {
        default: 'Driver Dashboard | Airport Taxis Sri Lanka',
        template: '%s | Driver Portal'
    },
    description: 'Secure dashboard for Airport Taxi drivers to manage bookings, track earnings, and update trip status.',
    manifest: '/driver-manifest.json',
    themeColor: '#064e3b',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
};

export default function DriverLayout({ children }) {
    return (
        <section className="bg-slate-100 min-h-screen">
            {children}
        </section>
    );
}
