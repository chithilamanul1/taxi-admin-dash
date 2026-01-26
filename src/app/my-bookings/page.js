'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Car, ArrowRight, Loader2, User, Package } from 'lucide-react';

export default function MyBookingsPage() {
    const { data: session } = useSession();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                let url = '/api/bookings';
                let guestIds = [];

                // Get guest bookings from local storage
                try {
                    guestIds = JSON.parse(localStorage.getItem('guest_bookings') || '[]');
                } catch (e) { console.error(e); }

                // Construct query
                const params = new URLSearchParams();
                if (guestIds.length > 0 && !session) {
                    params.append('ids', guestIds.join(','));
                }

                // If user logged in, API handles it via session. 
                // If guest, we pass IDs. 
                // If logged in user ALSO has guest bookings... we might want to merge? 
                // For now, let's just let logged in user see their account bookings.
                // The API logic: if session exists, it returns user bookings.

                // Wait, if I want to merge, I might need custom logic.
                // Current API: if session, ignores ID param?
                // Let's check API I just wrote...
                // "else if (session) { query.customer = session.user.id }"
                // So logged in user CANNOT fetch guest bookings via ID param currently.
                // I'll stick to: Logged in = Account Bookings. Guest = Guest Bookings.

                if (guestIds.length > 0 && !session) {
                    url += `?${params.toString()}`;
                }

                if (!session && guestIds.length === 0) {
                    setBookings([]);
                    setLoading(false);
                    return;
                }

                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) setBookings(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [session]);

    const activeBookings = bookings.filter(b => ['pending', 'assigned', 'ongoing', 'confirmed'].includes(b.status));
    const pastBookings = bookings.filter(b => ['completed', 'cancelled'].includes(b.status));

    const displayedBookings = activeTab === 'upcoming' ? activeBookings : pastBookings;

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-emerald-900 uppercase tracking-tight">My Bookings</h1>
                        <p className="text-gray-500">Manage and track your journeys</p>
                    </div>
                    {session && (
                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-emerald-900/10">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                                {session.user.name?.[0]}
                            </div>
                            <span className="text-sm font-bold text-emerald-900">{session.user.name}</span>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`px-6 py-3 font-bold text-sm uppercase tracking-widest border-b-2 transition-all ${activeTab === 'upcoming' ? 'border-emerald-600 text-emerald-900' : 'border-transparent text-gray-400 hover:text-emerald-900'}`}
                    >
                        Upcoming ({activeBookings.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-3 font-bold text-sm uppercase tracking-widest border-b-2 transition-all ${activeTab === 'history' ? 'border-emerald-600 text-emerald-900' : 'border-transparent text-gray-400 hover:text-emerald-900'}`}
                    >
                        History ({pastBookings.length})
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-emerald-600" size={32} /></div>
                ) : displayedBookings.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        {displayedBookings.map(booking => (
                            <Link key={booking._id} href={`/booking/${booking._id}`} className="block group">
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-900/5 group-hover:shadow-md group-hover:border-emerald-600/30 transition-all cursor-pointer h-full flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                        booking.status === 'pending' ? 'bg-blue-50 text-blue-600' :
                                                            booking.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                                <span className="text-xs text-gray-400 font-mono">#{booking._id.slice(-6).toUpperCase()}</span>
                                            </div>
                                            <p className="font-bold text-emerald-900">Rs {booking.totalPrice.toLocaleString()}</p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <div className="flex flex-col items-center gap-1 mt-1">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                    <div className="w-0.5 h-6 bg-gray-100"></div>
                                                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                                </div>
                                                <div className="space-y-3 flex-1">
                                                    <p className="text-sm font-bold text-gray-800 line-clamp-1">{booking.pickupLocation.address}</p>
                                                    <p className="text-sm font-bold text-gray-800 line-clamp-1">{booking.dropoffLocation.address}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500 font-medium">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1"><Calendar size={14} /> {booking.scheduledDate}</span>
                                            <span className="flex items-center gap-1"><Clock size={14} /> {booking.scheduledTime}</span>
                                        </div>
                                        <ArrowRight size={16} className="text-emerald-600 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <Package size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No bookings found</h3>
                        <p className="text-gray-500 mb-6 max-w-sm mx-auto">You haven't made any bookings in this category yet.</p>
                        <Link href="/" className="inline-block bg-emerald-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-emerald-800 transition-colors">
                            Book a Ride
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
