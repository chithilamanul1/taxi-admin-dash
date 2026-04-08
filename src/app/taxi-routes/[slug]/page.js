import { routes } from '@/lib/routes';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingWidget from '@/components/BookingWidget';
import { Clock, MapPin, CheckCircle, HelpCircle } from 'lucide-react';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const route = routes.find(r => r.slug === slug);

    if (!route) return { title: 'Route Not Found' };

    return {
        title: `${route.title} - Cost $${route.price} - Reliable Transfers`,
        description: `Book a private taxi from ${route.origin} to ${route.destination}. Fixed rates from $${route.price}. ${route.description.slice(0, 150)}...`,
        keywords: `${route.origin} to ${route.destination} taxi, ${route.origin} to ${route.destination} transfer, private car ${route.origin} to ${route.destination}, ${route.origin} to ${route.destination} taxi cost`,
    };
}

export default async function RoutePage({ params }) {
    const { slug } = await params;
    const route = routes.find(r => r.slug === slug);

    if (!route) notFound();

    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            
            {/* Hero Section */}
            <div className="bg-emerald-900 pt-32 pb-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl">
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">
                            {route.title}
                        </h1>
                        <p className="text-xl text-emerald-100/80 mb-10 leading-relaxed font-medium">
                            {route.description}
                        </p>
                        <div className="flex flex-wrap gap-8 text-white/90">
                            <div className="flex items-center gap-3">
                                <Clock className="text-emerald-400" />
                                <span>{route.duration}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="text-emerald-400" />
                                <span>{route.distance}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-500 text-black px-3 py-1 rounded-full font-bold text-sm">
                                    From ${route.price}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-20">
                <div className="grid lg:grid-cols-3 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">
                        <section>
                            <h2 className="text-3xl font-black mb-8 uppercase italic border-b-4 border-black inline-block">Highlights</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {route.highlights.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-start bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
                                        <CheckCircle className="text-emerald-600 mt-1 flex-shrink-0" />
                                        <p className="font-bold text-slate-700">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-emerald-50 p-10 rounded-[2.5rem] border-4 border-emerald-100">
                            <h2 className="text-3xl font-black mb-8 uppercase">Common Questions (FAQs)</h2>
                            <div className="space-y-8">
                                {route.faqs.map((faq, idx) => (
                                    <div key={idx} className="space-y-3">
                                        <div className="flex items-center gap-3 text-emerald-800 font-black">
                                            <HelpCircle size={20} />
                                            <h3>{faq.q}</h3>
                                        </div>
                                        <p className="text-slate-600 pl-8 font-medium italic">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32">
                            <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl border-4 border-black">
                                <div className="p-6 bg-black text-white rounded-t-[2rem] text-center">
                                    <p className="text-xs uppercase font-black tracking-widest text-emerald-400 mb-1">Instant Confirmation</p>
                                    <h3 className="text-xl font-black">RESERVE YOUR TAXI</h3>
                                </div>
                                <div className="p-4">
                                    <BookingWidget />
                                </div>
                            </div>
                            <div className="mt-8 bg-black text-white p-8 rounded-[2rem] text-center">
                                <p className="text-sm font-bold opacity-60 uppercase tracking-widest mb-2">Need Help?</p>
                                <p className="text-xl font-black mb-4">Chat with us on WhatsApp</p>
                                <a 
                                    href="https://wa.me/94716885880" 
                                    className="inline-block bg-emerald-500 text-black px-8 py-4 rounded-xl font-black hover:bg-emerald-400 transition-colors"
                                >
                                    OPEN WHATSAPP
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
