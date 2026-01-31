'use client'

import { useState, useEffect, useMemo } from 'react'
import { Users, Car, MapPin, DollarSign, Activity, Bell, X, Phone, Mail, Calendar, Clock, CreditCard, FileText, Loader2, Percent, CheckSquare, Square, Check, LifeBuoy } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ReviewsManagement from '@/components/ReviewsManagement'
import DriversFleetView from '@/components/DriversFleetView'
import LiveDriverMap from '@/components/LiveDriverMap'

export default function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [currentView, setCurrentView] = useState('dashboard')
    const [bookings, setBookings] = useState([])
    const [bookingSearch, setBookingSearch] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [vehiclePricing, setVehiclePricing] = useState([])
    const [pricingCategory, setPricingCategory] = useState('airport-transfer')
    const [editingVehicle, setEditingVehicle] = useState(null)
    const [editForm, setEditForm] = useState({})
    const [editingPost, setEditingPost] = useState(null)
    const [postForm, setPostForm] = useState({})
    const [blogPosts, setBlogPosts] = useState([])
    const [editingTeam, setEditingTeam] = useState(null)
    const [teamForm, setTeamForm] = useState({})
    const [teamMembers, setTeamMembers] = useState([])
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [supportTickets, setSupportTickets] = useState([])
    const [coupons, setCoupons] = useState([])
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        discountType: 'percentage',
        value: '',
        expiryDate: '',
        locationsText: '',
        description: '',
        imageUrl: '',
        displayInWidget: false
    })
    const [ordering, setOrdering] = useState('newest'); // or whatever
    const [emailForm, setEmailForm] = useState({ recipientType: 'specific', customEmail: '', subject: '', message: '' })
    const [sendingEmail, setSendingEmail] = useState(false)
    const [adminReply, setAdminReply] = useState('')
    const [sendingReply, setSendingReply] = useState(false)
    const [selectedBooking, setSelectedBooking] = useState(null)
    const [selectedStatus, setSelectedStatus] = useState('pending')
    const [updatingStatus, setUpdatingStatus] = useState(false)
    const [drivers, setDrivers] = useState([])
    const [selectedDriver, setSelectedDriver] = useState('')
    const [notifications, setNotifications] = useState([])
    const [showNotifications, setShowNotifications] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    // Filter bookings based on search
    const filteredBookings = useMemo(() => {
        if (!bookingSearch.trim()) return bookings
        const search = bookingSearch.toLowerCase()
        return bookings.filter(b =>
            b._id?.toLowerCase().includes(search) ||
            b.customerName?.toLowerCase().includes(search) ||
            b.guestPhone?.includes(search) ||
            b.pickupLocation?.address?.toLowerCase().includes(search) ||
            b.dropoffLocation?.address?.toLowerCase().includes(search)
        )
    }, [bookings, bookingSearch])

    const handleAddCoupon = async () => {
        if (!newCoupon.code || !newCoupon.value) return alert('Please fill in required fields');
        try {
            const payload = {
                ...newCoupon,
                applicableLocations: newCoupon.locationsText ? newCoupon.locationsText.split(',').map(s => s.trim()).filter(Boolean) : []
            };
            const res = await fetch('/api/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const data = await res.json();
                setCoupons([data, ...coupons]);
                setNewCoupon({
                    code: '',
                    discountType: 'percentage',
                    value: '',
                    expiryDate: '',
                    locationsText: '',
                    description: '',
                    imageUrl: '',
                    displayInWidget: false
                });
            } else { alert('Failed to create coupon'); }
        } catch (e) { console.error(e); }
    }

    const handleDeleteCoupon = async (id) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;
        try {
            await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
            setCoupons(coupons.filter(c => c._id !== id));
        } catch (e) { console.error(e); }
    }


    useEffect(() => {
        const fetchData = (isBackground = false) => {
            if (currentView === 'dashboard' || currentView === 'bookings') {
                fetch('/api/bookings')
                    .then(res => {
                        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
                        return res.json()
                    })
                    .then(data => setBookings(data))
                    .catch(err => console.error("Error fetching bookings:", err))
            }

            if (currentView === 'support') {
                setIsLoading(true)
                fetch('/api/tickets')
                    .then(res => res.json())
                    .then(data => {
                        if (Array.isArray(data)) setSupportTickets(data)
                        setIsLoading(false)
                    })
                    .catch(err => {
                        console.error("Error fetching tickets:", err)
                        setIsLoading(false)
                    })
            }

            if (currentView === 'blog') {
                fetch('/api/blog?isAdmin=true')
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) setBlogPosts(data.data);
                    })
                    .catch(err => console.error("Error fetching posts:", err));
            }

            if (currentView === 'pricing') {
                if (!isBackground) setIsLoading(true)
                fetch(`/api/pricing?category=${pricingCategory}`)
                    .then(res => res.json())
                    .then(data => {
                        if (Array.isArray(data)) {
                            setVehiclePricing(data.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99)))
                        } else if (data.success && Array.isArray(data.data)) {
                            setVehiclePricing(data.data.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99)))
                        } else {
                            setVehiclePricing([])
                        }
                        setIsLoading(false)
                    })
                    .catch(err => {
                        console.error(err)
                        setIsLoading(false)
                    })
            }

            // Always fetch drivers for assignment
            fetch('/api/drivers')
                .then(res => res.json())
                .then(data => { if (Array.isArray(data)) setDrivers(data) })
                .catch(console.error)

            // Fetch Notifications
            fetch('/api/admin/notifications')
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setNotifications(data.data)
                        setUnreadCount(data.unreadCount)
                    }
                })
                .catch(console.error)
        }

        // Initial fetch
        fetchData()

        // Auto-refresh every 10 seconds
        const interval = setInterval(() => fetchData(true), 10000)

        return () => clearInterval(interval)
    }, [currentView, pricingCategory])

    const markNotificationRead = async (id) => {
        try {
            await fetch('/api/admin/notifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (e) { console.error(e) }
    }

    const markAllNotificationsRead = async () => {
        try {
            await fetch('/api/admin/notifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markAllRead: true })
            })
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
            setUnreadCount(0)
        } catch (e) { console.error(e) }
    }

    // Calculate Real Stats
    const stats = useMemo(() => {
        const totalRevenue = bookings
            .filter(b => b.status === 'completed') // Only count completed bookings for revenue
            .reduce((sum, b) => sum + (b.totalPrice || 0), 0)

        const activeRides = bookings.filter(b => b.status === 'ongoing' || b.status === 'assigned' || b.status === 'driver-assigned').length
        const pendingBookings = bookings.filter(b => b.status === 'pending').length
        const onlineDrivers = drivers.filter(d => d.isOnline).length

        return [
            { title: 'Total Revenue', value: `LKR ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-500' },
            { title: 'Active Rides', value: activeRides.toString(), icon: Car, color: 'text-blue-500' },
            { title: 'Online Drivers', value: onlineDrivers.toString(), icon: Users, color: 'text-emerald-600' },
            { title: 'Pending Bookings', value: pendingBookings.toString(), icon: Bell, color: 'text-red-500' },
        ]
    }, [bookings, drivers])

    const updateBookingStatus = async (id, status) => {
        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })
            if (res.ok) {
                setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b))
            } else {
                alert('Failed to update status')
            }
        } catch (err) {
            console.error(err)
            alert('Error updating status')
        }
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-100 to-slate-200">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Premium Gradient Design */}
            <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 bg-gradient-to-b from-emerald-900 via-emerald-950 to-slate-900 text-white transition-all duration-300 ${sidebarOpen && 'md:w-64'} ${!sidebarOpen && 'md:w-20'} w-64 flex flex-col shadow-2xl`}>
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="md:hidden absolute top-4 right-4 text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                    <X size={20} />
                </button>
                {/* Logo Area with Glass Effect */}
                <div className="p-5 flex items-center gap-3 border-b border-white/10 bg-white/5 backdrop-blur-sm">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <Car size={20} className="text-white" />
                    </div>
                    <div className={`${!sidebarOpen && 'md:hidden'}`}>
                        <h1 className="font-bold text-lg leading-tight">Admin Panel</h1>
                        <p className="text-[10px] text-emerald-300/70 uppercase tracking-widest">Control Center</p>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    <button onClick={() => { setCurrentView('dashboard'); setSidebarOpen(false); }} className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 ${currentView === 'dashboard' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <Activity size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Dashboard</span>
                    </button>
                    <button onClick={() => { setCurrentView('pricing'); setSidebarOpen(false); }} className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 ${currentView === 'pricing' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <DollarSign size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Pricing</span>
                    </button>
                    <button onClick={() => { setCurrentView('bookings'); setSidebarOpen(false); }} className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 relative ${currentView === 'bookings' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <Users size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Bookings</span>
                        {bookings.filter(b => b.status === 'pending').length > 0 && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                                {bookings.filter(b => b.status === 'pending').length}
                            </span>
                        )}
                    </button>
                    <button onClick={() => { setCurrentView('drivers'); setSidebarOpen(false); }} className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 ${currentView === 'drivers' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <Car size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Drivers</span>
                    </button>
                    <button onClick={() => { setCurrentView('live-map'); setSidebarOpen(false); }} className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 ${currentView === 'live-map' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <MapPin size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Live Map</span>
                    </button>
                    <button onClick={() => { setCurrentView('blog'); setSidebarOpen(false); }} className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 ${currentView === 'blog' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <FileText size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Blog</span>
                    </button>
                    <button onClick={() => { setCurrentView('team'); setSidebarOpen(false); }} className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 ${currentView === 'team' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <Users size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Team</span>
                    </button>
                    <button onClick={() => { setCurrentView('communications'); setSidebarOpen(false); }} className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 ${currentView === 'communications' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <Mail size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Email</span>
                    </button>
                    <button onClick={() => { setCurrentView('support'); setSidebarOpen(false); }} className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 ${currentView === 'support' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <LifeBuoy size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Support</span>
                    </button>
                    <button onClick={() => { setCurrentView('coupons'); setSidebarOpen(false); }} className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 ${currentView === 'coupons' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <Percent size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Coupons</span>
                    </button>
                    <button onClick={() => { setCurrentView('reviews'); setSidebarOpen(false); }} className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 ${currentView === 'reviews' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <Activity size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Reviews</span>
                    </button>
                </nav>

                <div className="p-3 border-t border-white/10">
                    <button onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/admin/login' }} className="flex items-center gap-3 p-3 w-full hover:bg-red-500/20 rounded-xl transition-all text-red-300 hover:text-red-100">
                        <X size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Log Out</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {/* Premium Header */}
                <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600">
                            <Activity size={20} />
                        </button>
                        <div>
                            <h2 className="font-bold text-slate-800 capitalize">{currentView}</h2>
                            <p className="text-xs text-slate-400">Manage your business</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 relative"
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute top-12 right-0 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-fade-in-up">
                                    <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                        <h3 className="font-bold text-sm text-slate-700">Notifications</h3>
                                        <button onClick={markAllNotificationsRead} className="text-xs text-emerald-600 hover:underline">Mark all read</button>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-gray-400 text-sm">No notifications</div>
                                        ) : (
                                            notifications.map(notification => (
                                                <div
                                                    key={notification._id}
                                                    onClick={() => !notification.isRead && markNotificationRead(notification._id)}
                                                    className={`p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-emerald-50/50' : ''}`}
                                                >
                                                    <div className="flex gap-3">
                                                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notification.isRead ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                                                        <div>
                                                            <p className={`text-sm ${!notification.isRead ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>{notification.title}</p>
                                                            <p className="text-xs text-slate-500 mt-1">{notification.message}</p>
                                                            <p className="text-[10px] text-slate-400 mt-2">{new Date(notification.createdAt).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/30">
                            A
                        </div>
                    </div>
                </header>

                <div className="p-6">
                    {currentView === 'dashboard' && (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-800">Dashboard Overview</h2>
                                    <p className="text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
                                </div>
                                <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30 flex items-center gap-2">
                                    <Activity size={16} />
                                    Refresh
                                </button>
                            </div>

                            {/* Premium Stats Cards */}
                            <div className="grid md:grid-cols-4 gap-6">
                                {stats.map((stat, i) => {
                                    const gradients = [
                                        'from-emerald-500 to-emerald-600',
                                        'from-blue-500 to-blue-600',
                                        'from-violet-500 to-violet-600',
                                        'from-orange-500 to-orange-600'
                                    ];
                                    return (
                                        <div key={i} className="relative group">
                                            <div className={`absolute inset-0 bg-gradient-to-br ${gradients[i]} rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity`}></div>
                                            <div className="relative bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                                <div className={`w-14 h-14 bg-gradient-to-br ${gradients[i]} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                                                    <stat.icon className="text-white" size={24} />
                                                </div>
                                                <div className="text-slate-500 text-sm font-medium mb-1">{stat.title}</div>
                                                <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-slate-800">Recent Bookings</h3>
                                    <button onClick={() => setCurrentView('bookings')} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                                        View All →
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                <th className="px-6 py-4">ID</th>
                                                <th className="px-6 py-4">Customer</th>
                                                <th className="px-6 py-4">Route</th>
                                                <th className="px-6 py-4">Date</th>
                                                <th className="px-6 py-4">Price</th>
                                                <th className="px-6 py-4">Payment</th>
                                                <th className="px-6 py-4">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {bookings.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="py-8 text-center text-gray-400">No bookings yet.</td>
                                                </tr>
                                            ) : (
                                                bookings.slice(0, 5).map((booking) => (
                                                    <tr key={booking._id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                                                        <td className="py-4 font-medium text-emerald-900">#{booking._id.slice(-6)}</td>
                                                        <td className="py-4">
                                                            <div className="font-medium">{booking.customerName || 'Guest'}</div>
                                                            <div className="text-xs text-gray-400">{booking.guestPhone}</div>
                                                        </td>
                                                        <td className="py-4 text-slate-500">
                                                            <div className="max-w-[120px] truncate text-xs" title={booking.pickupLocation?.address}>{booking.pickupLocation?.address?.split(',')[0]}</div>
                                                            <div className="text-xs text-gray-300">→</div>
                                                            <div className="max-w-[120px] truncate text-xs" title={booking.dropoffLocation?.address}>{booking.dropoffLocation?.address?.split(',')[0]}</div>
                                                        </td>
                                                        <td className="py-4 text-xs">
                                                            <div>{booking.scheduledDate || new Date(booking.createdAt).toLocaleDateString()}</div>
                                                            <div className="text-gray-400">{booking.scheduledTime || ''}</div>
                                                        </td>
                                                        <td className="py-4 font-bold text-sm">Rs {booking.totalPrice?.toLocaleString()}</td>
                                                        <td className="py-4">
                                                            <span className={`px-2 py-1 rounded text-xs font-bold capitalize
                                                                ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                                                                    booking.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                                                                        'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                {booking.paymentStatus || 'pending'}
                                                            </span>
                                                            <div className="text-xs text-gray-400 mt-1 capitalize">{booking.paymentMethod}</div>
                                                        </td>
                                                        <td className="py-4">
                                                            <span className={`px-2 py-1 rounded text-xs font-bold capitalize
                                                                ${booking.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                                                                    booking.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                                                                        booking.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                                                                }`}>
                                                                {booking.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentView === 'bookings' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-emerald-900">Manage Bookings</h2>
                                <input
                                    type="text"
                                    placeholder="Search bookings..."
                                    className="px-4 py-2 border rounded-lg outline-none focus:border-emerald-500"
                                    onChange={(e) => setBookingSearch(e.target.value)}
                                />
                            </div>
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-emerald-50 text-emerald-900 font-bold uppercase text-xs">
                                            <tr>
                                                <th className="px-6 py-4">ID</th>
                                                <th className="px-6 py-4">Customer</th>
                                                <th className="px-6 py-4">Route</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-emerald-900/5">
                                            {filteredBookings.length === 0 ? (
                                                <tr><td colSpan="5" className="p-8 text-center text-gray-400">No bookings found</td></tr>
                                            ) : (
                                                filteredBookings.map((booking) => (
                                                    <tr key={booking._id} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-6 py-4 font-mono text-xs text-slate-400">#{booking._id.slice(-6)}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="font-bold text-emerald-900">{booking.customerName}</div>
                                                            <div className="text-xs text-slate-500">{booking.guestPhone}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="max-w-[200px] truncate text-xs font-medium" title={booking.pickupLocation?.address}>{booking.pickupLocation?.address?.split(',')[0]}</div>
                                                            <div className="text-emerald-300 font-bold text-xs pl-1">↓</div>
                                                            <div className="max-w-[200px] truncate text-xs font-medium" title={booking.dropoffLocation?.address}>{booking.dropoffLocation?.address?.split(',')[0]}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <select
                                                                value={booking.status}
                                                                onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                                                                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase bg-white border cursor-pointer
                                                                    ${booking.status === 'completed' ? 'text-green-600 border-green-200 bg-green-50' :
                                                                        booking.status === 'cancelled' ? 'text-red-600 border-red-200 bg-red-50' :
                                                                            'text-emerald-900 border-emerald-200'}`}
                                                            >
                                                                <option value="pending">Pending</option>
                                                                <option value="assigned">Assigned</option>
                                                                <option value="ongoing">Ongoing</option>
                                                                <option value="completed">Completed</option>
                                                                <option value="cancelled">Cancelled</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-6 py-4 text-xs">
                                                            <div className="flex gap-2">
                                                                <span className={`px-2 py-1 rounded bg-slate-100 font-medium ${booking.paymentStatus === 'paid' ? 'text-green-600 bg-green-50' : 'text-slate-500'}`}>
                                                                    {booking.paymentStatus}
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentView === 'pricing' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <h2 className="text-2xl font-bold text-emerald-900">Vehicle Pricing & Tiers</h2>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete all entries for this category and reset to default? This will only affect Airport Transfer.')) {
                                                    fetch('/api/seed').then(() => window.location.reload())
                                                }
                                            }}
                                            className="text-xs text-slate-500 hover:text-red-600 font-medium px-3 py-2 transition-colors"
                                        >
                                            Reset Defaults
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditForm({})
                                                setEditingVehicle('NEW')
                                            }}
                                            className="bg-emerald-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-800 text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-all hover:scale-105"
                                        >
                                            <Car size={18} /> Add Vehicle
                                        </button>
                                    </div>
                                </div>

                                {/* Category Tabs */}
                                <div className="flex bg-slate-100 p-1.5 rounded-xl mb-8 w-full overflow-x-auto no-scrollbar">
                                    {[
                                        { id: 'airport-transfer', label: 'Airport Transfer' },
                                        { id: 'ride-now', label: 'Ride Now / P2P' },
                                        { id: 'tours', label: 'Tour Packages' },
                                        { id: 'rentals', label: 'Rentals' }
                                    ].map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setPricingCategory(cat.id)}
                                            className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${pricingCategory === cat.id ? 'bg-white text-emerald-900 shadow-md ring-1 ring-emerald-900/5' : 'text-slate-500 hover:text-emerald-900 hover:bg-slate-200/50'}`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>

                                {editingVehicle === 'NEW' && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up">
                                            <h3 className="text-xl font-bold text-emerald-900 mb-4">Add New Vehicle</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Luxury Sedan"
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600/20 focus:border-transparent outline-none transition-all"
                                                        value={editForm.name || ''}
                                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Code (Type)</label>
                                                    <select
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600/20 focus:border-transparent outline-none transition-all bg-white"
                                                        value={editForm.vehicleType || ''}
                                                        onChange={(e) => setEditForm({ ...editForm, vehicleType: e.target.value })}
                                                    >
                                                        <option value="">Select Type</option>
                                                        <option value="mini-car">Mini Car</option>
                                                        <option value="sedan">Sedan</option>
                                                        <option value="mini-van-every">Mini Van (Every)</option>
                                                        <option value="mini-van-05">Mini Van (05)</option>
                                                        <option value="suv">SUV</option>
                                                        <option value="kdh-van">KDH Van</option>
                                                        <option value="mini-bus">Mini Bus</option>
                                                    </select>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g. 3"
                                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600/20 focus:border-transparent outline-none transition-all"
                                                            value={editForm.capacity || ''}
                                                            onChange={(e) => setEditForm({ ...editForm, capacity: Number(e.target.value) })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Luggage</label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g. 2"
                                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600/20 focus:border-transparent outline-none transition-all"
                                                            value={editForm.luggage || ''}
                                                            onChange={(e) => setEditForm({ ...editForm, luggage: Number(e.target.value) })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="pt-4 flex justify-end gap-3">
                                                    <button
                                                        onClick={() => setEditingVehicle(null)}
                                                        className="px-4 py-2 text-gray-600 hover:bg-slate-100 rounded-lg"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (!editForm.name || !editForm.vehicleType) return alert('Name and Type are required');
                                                            const res = await fetch('/api/pricing', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({
                                                                    ...editForm,
                                                                    category: pricingCategory,
                                                                    tiers: [{ min: 0, max: 999, type: 'per_km', price: 0, rate: 100 }], // Default tier
                                                                    features: ['Air Conditioned'],
                                                                    basePrice: 0, // Required by model
                                                                    perKmRate: 0   // Required by model
                                                                })
                                                            });
                                                            const data = await res.json();
                                                            if (data.success) {
                                                                setVehiclePricing([...vehiclePricing, data.data]);
                                                                setEditingVehicle(null);
                                                            } else {
                                                                alert(data.error || 'Failed to create');
                                                            }
                                                        }}
                                                        className="px-6 py-2 bg-emerald-900 text-white rounded-lg font-bold hover:bg-emerald-900/90"
                                                    >
                                                        Create {pricingCategory.replace('-', ' ')} Rate
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-24 text-center">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-900 mb-4"></div>
                                        <p className="text-slate-400 text-sm font-medium animate-pulse">Loading rates...</p>
                                    </div>
                                ) : vehiclePricing.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                        <Car className="text-slate-300 mb-3" size={48} />
                                        <h3 className="text-lg font-bold text-slate-700">No Vehicles Found</h3>
                                        <p className="text-slate-500 text-sm mb-6">Start by adding a vehicle to this category.</p>
                                        <button
                                            onClick={() => {
                                                setEditForm({})
                                                setEditingVehicle('NEW')
                                            }}
                                            className="text-emerald-900 font-bold hover:underline text-sm"
                                        >
                                            + Add First Vehicle
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {vehiclePricing.map((vehicle) => (
                                            <div
                                                key={vehicle._id || vehicle.vehicleType}
                                                className="border-2 rounded-xl p-6 hover:border-emerald-900/20 transition-all"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                                        <div className="w-16 h-12 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                                            {vehicle.image ? (
                                                                <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <Car className="text-slate-300" size={20} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-emerald-900 text-lg leading-tight">{vehicle.name}</h3>
                                                            {pricingCategory === 'tours' ? (
                                                                <p className="text-xs text-slate-500">Tour Package Rate</p>
                                                            ) : (
                                                                <p className="text-xs text-slate-500 font-medium mt-0.5">{vehicle.capacity} pax • {vehicle.luggage} bags</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            if (editingVehicle === vehicle.vehicleType) {
                                                                setEditingVehicle(null)
                                                            } else {
                                                                setEditingVehicle(vehicle.vehicleType)
                                                                setEditForm({
                                                                    name: vehicle.name,
                                                                    vehicleType: vehicle.vehicleType,
                                                                    capacity: vehicle.capacity,
                                                                    luggage: vehicle.luggage,
                                                                    waitingCharges: vehicle.waitingCharges || [],
                                                                    tiers: vehicle.tiers || [],
                                                                    basePrice: vehicle.basePrice,
                                                                    baseKm: vehicle.baseKm,
                                                                    perKmRate: vehicle.perKmRate
                                                                })
                                                            }
                                                        }}
                                                        className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm ${editingVehicle === vehicle.vehicleType ? 'bg-slate-100 text-slate-600 ring-1 ring-slate-200' : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md'}`}
                                                    >
                                                        {editingVehicle === vehicle.vehicleType ? 'Cancel Edit' : 'Edit Rates'}
                                                    </button>
                                                </div>

                                                {/* Tier Table */}
                                                {editingVehicle === vehicle.vehicleType ? (
                                                    <div className="space-y-4">
                                                        {/* Image Upload */}
                                                        <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                                                            <span className="text-sm text-gray-500">Vehicle Image:</span>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={async (e) => {
                                                                    const file = e.target.files[0]
                                                                    if (file) {
                                                                        const formData = new FormData()
                                                                        formData.append('file', file)
                                                                        formData.append('vehicleType', vehicle.vehicleType)
                                                                        const res = await fetch('/api/upload/vehicle', { method: 'POST', body: formData })
                                                                        const data = await res.json()
                                                                        if (data.path) {
                                                                            await fetch(`/api/pricing/${vehicle.vehicleType}`, {
                                                                                method: 'PUT',
                                                                                headers: { 'Content-Type': 'application/json' },
                                                                                body: JSON.stringify({ image: data.path })
                                                                            })
                                                                            setVehiclePricing(prev => prev.map(v => v.vehicleType === vehicle.vehicleType ? { ...v, image: data.path } : v))
                                                                        }
                                                                    }
                                                                }}
                                                                className="text-sm"
                                                            />
                                                        </div>

                                                        {/* Rentals Specific UI */}

                                                        {pricingCategory === 'rentals' ? (
                                                            <div className="grid md:grid-cols-3 gap-6 p-4 bg-emerald-50 rounded-xl border border-emerald-900/10 mb-4">
                                                                <div>
                                                                    <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">Daily Rate (Rs)</label>
                                                                    <input
                                                                        type="number"
                                                                        value={editForm.basePrice || 0}
                                                                        onChange={(e) => setEditForm({ ...editForm, basePrice: Number(e.target.value) })}
                                                                        className="w-full px-4 py-3 bg-white border border-emerald-900/10 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none font-bold text-emerald-900 text-lg"
                                                                    />
                                                                    <p className="text-[10px] text-gray-400 mt-1">Cost per day</p>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">Included KM</label>
                                                                    <input
                                                                        type="number"
                                                                        value={editForm.baseKm || 0}
                                                                        onChange={(e) => setEditForm({ ...editForm, baseKm: Number(e.target.value) })}
                                                                        className="w-full px-4 py-3 bg-white border border-emerald-900/10 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none font-bold text-emerald-900 text-lg"
                                                                    />
                                                                    <p className="text-[10px] text-gray-400 mt-1">KM included in daily rate</p>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">Excess Rate (Rs/km)</label>
                                                                    <input
                                                                        type="number"
                                                                        value={editForm.perKmRate || 0}
                                                                        onChange={(e) => setEditForm({ ...editForm, perKmRate: Number(e.target.value) })}
                                                                        className="w-full px-4 py-3 bg-white border border-emerald-900/10 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none font-bold text-emerald-900 text-lg"
                                                                    />
                                                                    <p className="text-[10px] text-gray-400 mt-1">Charged after limit</p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {/* Editable Tiers - Improved Layout */}
                                                                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                                                                    <table className="w-full text-sm">
                                                                        <thead className="bg-slate-50">
                                                                            <tr>
                                                                                <th className="px-4 py-3 text-left font-semibold text-emerald-900 w-24">Min KM</th>
                                                                                <th className="px-4 py-3 text-left font-semibold text-emerald-900 w-24">Max KM</th>
                                                                                <th className="px-4 py-3 text-left font-semibold text-emerald-900 w-32">Type</th>
                                                                                <th className="px-4 py-3 text-left font-semibold text-emerald-900 w-32">Flat (Rs)</th>
                                                                                <th className="px-4 py-3 text-left font-semibold text-emerald-900 w-32">Rate (Rs/km)</th>
                                                                                <th className="px-4 py-3 w-10"></th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-slate-100">
                                                                            {(editForm.tiers || []).map((tier, idx) => (
                                                                                <tr key={idx} className="hover:bg-slate-50">
                                                                                    <td className="px-2 py-2">
                                                                                        <input type="number" value={tier.min} onChange={(e) => {
                                                                                            const newTiers = [...editForm.tiers]
                                                                                            newTiers[idx] = { ...newTiers[idx], min: Number(e.target.value) }
                                                                                            setEditForm({ ...editForm, tiers: newTiers })
                                                                                        }} className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 outline-none text-center" />
                                                                                    </td>
                                                                                    <td className="px-2 py-2">
                                                                                        <input type="number" value={tier.max} onChange={(e) => {
                                                                                            const newTiers = [...editForm.tiers]
                                                                                            newTiers[idx] = { ...newTiers[idx], max: Number(e.target.value) }
                                                                                            setEditForm({ ...editForm, tiers: newTiers })
                                                                                        }} className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 outline-none text-center" />
                                                                                    </td>
                                                                                    <td className="px-2 py-2">
                                                                                        <select value={tier.type} onChange={(e) => {
                                                                                            const newTiers = [...editForm.tiers]
                                                                                            newTiers[idx] = { ...newTiers[idx], type: e.target.value }
                                                                                            setEditForm({ ...editForm, tiers: newTiers })
                                                                                        }} className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 outline-none bg-white">
                                                                                            <option value="flat">Flat</option>
                                                                                            <option value="per_km">Per KM</option>
                                                                                        </select>
                                                                                    </td>
                                                                                    <td className="px-2 py-2">
                                                                                        <input type="number" value={tier.price || 0} onChange={(e) => {
                                                                                            const newTiers = [...editForm.tiers]
                                                                                            newTiers[idx] = { ...newTiers[idx], price: Number(e.target.value) }
                                                                                            setEditForm({ ...editForm, tiers: newTiers })
                                                                                        }} className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 outline-none disabled:opacity-50 disabled:bg-slate-100 text-right" disabled={tier.type !== 'flat'} />
                                                                                    </td>
                                                                                    <td className="px-2 py-2">
                                                                                        <input type="number" value={tier.rate || 0} onChange={(e) => {
                                                                                            const newTiers = [...editForm.tiers]
                                                                                            newTiers[idx] = { ...newTiers[idx], rate: Number(e.target.value) }
                                                                                            setEditForm({ ...editForm, tiers: newTiers })
                                                                                        }} className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 outline-none disabled:opacity-50 disabled:bg-slate-100 text-right" disabled={tier.type !== 'per_km'} />
                                                                                    </td>
                                                                                    <td className="px-2 py-2 text-center">
                                                                                        <button onClick={() => {
                                                                                            const newTiers = editForm.tiers.filter((_, i) => i !== idx)
                                                                                            setEditForm({ ...editForm, tiers: newTiers })
                                                                                        }} className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"><X size={16} /></button>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>

                                                                {/* Waiting Charges Management */}
                                                                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-900/10 space-y-4">
                                                                    <div className="flex items-center justify-between">
                                                                        <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-widest flex items-center gap-2">
                                                                            <Clock size={16} /> Tiered Waiting Charges
                                                                        </h4>
                                                                        <button
                                                                            onClick={() => {
                                                                                const current = editForm.waitingCharges || []
                                                                                setEditForm({ ...editForm, waitingCharges: [...current, 1000] })
                                                                            }}
                                                                            className="text-[10px] bg-white border border-emerald-900/10 px-3 py-1 rounded-lg font-bold text-emerald-900 hover:bg-emerald-100 transition-colors"
                                                                        >
                                                                            + Add Hour
                                                                        </button>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                                                                        {(editForm.waitingCharges || []).map((charge, idx) => (
                                                                            <div key={idx} className="bg-white p-2 rounded-lg border border-emerald-900/10 relative group">
                                                                                <label className="block text-[8px] font-bold text-emerald-900/40 uppercase mb-1">{idx + 1} Hour{idx > 0 && 's'}</label>
                                                                                <div className="flex items-center gap-1">
                                                                                    <span className="text-[10px] font-bold text-emerald-900">Rs</span>
                                                                                    <input
                                                                                        type="number"
                                                                                        value={charge}
                                                                                        onChange={(e) => {
                                                                                            const newCharges = [...editForm.waitingCharges]
                                                                                            newCharges[idx] = Number(e.target.value)
                                                                                            setEditForm({ ...editForm, waitingCharges: newCharges })
                                                                                        }}
                                                                                        className="w-full bg-transparent outline-none font-bold text-xs text-emerald-900"
                                                                                    />
                                                                                </div>
                                                                                <button
                                                                                    onClick={() => {
                                                                                        const newCharges = editForm.waitingCharges.filter((_, i) => i !== idx)
                                                                                        setEditForm({ ...editForm, waitingCharges: newCharges })
                                                                                    }}
                                                                                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                                                >
                                                                                    <X size={10} />
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    {(!editForm.waitingCharges || editForm.waitingCharges.length === 0) && (
                                                                        <p className="text-[10px] text-emerald-900/40 italic">No custom waiting charges defined. Will use default hourly rate.</p>
                                                                    )}
                                                                </div>

                                                                <div className="flex gap-2 pt-2">
                                                                    <button
                                                                        onClick={() => {
                                                                            const lastTier = editForm.tiers[editForm.tiers.length - 1]
                                                                            const newMin = lastTier ? lastTier.max + 1 : 1
                                                                            setEditForm({
                                                                                ...editForm,
                                                                                tiers: [...editForm.tiers, { min: newMin, max: newMin + 50, type: 'per_km', price: 0, rate: 100 }]
                                                                            })
                                                                        }}
                                                                        className="text-sm bg-slate-100 px-3 py-1 rounded hover:bg-slate-200"
                                                                    >
                                                                        + Add Tier
                                                                    </button>
                                                                    <button
                                                                        onClick={async () => {
                                                                            const res = await fetch(`/api/pricing/${vehicle.vehicleType}?category=${pricingCategory}`, {
                                                                                method: 'PUT',
                                                                                headers: { 'Content-Type': 'application/json' },
                                                                                body: JSON.stringify({ waitingCharges: editForm.waitingCharges, tiers: editForm.tiers, name: editForm.name, capacity: editForm.capacity, luggage: editForm.luggage, basePrice: editForm.basePrice, baseKm: editForm.baseKm, perKmRate: editForm.perKmRate })
                                                                            })
                                                                            if (res.ok) {
                                                                                setVehiclePricing(prev => prev.map(v => v.vehicleType === vehicle.vehicleType ? { ...v, ...editForm } : v))
                                                                                setEditingVehicle(null)
                                                                            }
                                                                        }}
                                                                        className="text-sm bg-emerald-900 text-white px-6 py-2 rounded-lg hover:bg-emerald-900/90 font-bold shadow-lg shadow-emerald-900/20 transition-all hover:scale-105"
                                                                    >
                                                                        Save {pricingCategory.replace('-', ' ')} Rates
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="overflow-x-auto mt-4 border-t pt-4">
                                                        <table className="w-full text-sm">
                                                            <thead>
                                                                <tr className="bg-slate-50 text-gray-500">
                                                                    <th className="px-4 py-2 text-left">Distance Range</th>
                                                                    <th className="px-4 py-2 text-left">Type</th>
                                                                    <th className="px-4 py-2 text-right">Rate</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {(vehicle.tiers || []).map((tier, idx) => (
                                                                    <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                                                        <td className="px-4 py-2 font-medium bg-white">{tier.min} - {tier.max >= 9999 ? '∞' : tier.max} km</td>
                                                                        <td className="px-4 py-2 bg-white">
                                                                            <span className={`px-2 py-0.5 rounded text-xs ${tier.type === 'flat' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                                                {tier.type === 'flat' ? 'Flat Rate' : 'Per KM'}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-4 py-2 text-right font-bold text-emerald-900 bg-white">
                                                                            {tier.type === 'flat' ? `LKR ${tier.price?.toLocaleString()}` : `LKR ${tier.rate}/km`}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {currentView === 'blog' && (
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl shadow-sm p-6">
                                            <div className="flex items-center justify-between mb-6">
                                                <h2 className="text-2xl font-bold text-emerald-900">Blog Posts</h2>
                                                <button
                                                    onClick={() => {
                                                        setPostForm({})
                                                        setEditingPost('NEW')
                                                    }}
                                                    className="bg-emerald-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-900/90 text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-all hover:scale-105"
                                                >
                                                    <FileText size={16} /> Add New Post
                                                </button>
                                            </div>

                                            {/* Post List */}
                                            {isLoading ? (
                                                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-900"></div></div>
                                            ) : (
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm">
                                                        <thead>
                                                            <tr className="bg-slate-50 text-gray-500">
                                                                <th className="px-4 py-3 text-left">Title</th>
                                                                <th className="px-4 py-3 text-left">Slug</th>
                                                                <th className="px-4 py-3 text-left">Status</th>
                                                                <th className="px-4 py-3 text-left">Date</th>
                                                                <th className="px-4 py-3 text-right">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {blogPosts.map(post => (
                                                                <tr key={post._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                                                    <td className="px-4 py-3 font-medium text-emerald-900">{post.title}</td>
                                                                    <td className="px-4 py-3 text-gray-500">{post.slug}</td>
                                                                    <td className="px-4 py-3">
                                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${post.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                                            {post.isPublished ? 'Published' : 'Draft'}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                                                                    <td className="px-4 py-3 text-right">
                                                                        <button
                                                                            onClick={() => {
                                                                                setPostForm(post)
                                                                                setEditingPost(post._id)
                                                                            }}
                                                                            className="text-emerald-900 hover:text-emerald-600 font-medium"
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            {blogPosts.length === 0 && (
                                                                <tr><td colSpan="5" className="text-center py-8 text-gray-400">No posts found.</td></tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>

                                        {/* Add/Edit Post Modal */}
                                        {editingPost && (
                                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                                                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6 h-[90vh] overflow-y-auto animate-fade-in-up">
                                                    <div className="flex justify-between items-center mb-6">
                                                        <h3 className="text-xl font-bold text-emerald-900">{editingPost === 'NEW' ? 'Create New Post' : 'Edit Post'}</h3>
                                                        <button onClick={() => setEditingPost(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div className="grid md:grid-cols-3 gap-6">
                                                            <div className="md:col-span-2 space-y-4">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                                                    <input
                                                                        type="text"
                                                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none"
                                                                        value={postForm.title || ''}
                                                                        onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                                                                        placeholder="Post Title"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug (auto-generated if empty)</label>
                                                                    <input
                                                                        type="text"
                                                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none"
                                                                        value={postForm.slug || ''}
                                                                        onChange={(e) => setPostForm({ ...postForm, slug: e.target.value })}
                                                                        placeholder="post-url-slug"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML allowed)</label>
                                                                    <textarea
                                                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none h-64 font-mono text-sm"
                                                                        value={postForm.content || ''}
                                                                        onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                                                                        placeholder="<p>Write your content here...</p>"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                                                    <select
                                                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none bg-white"
                                                                        value={postForm.isPublished ? 'true' : 'false'}
                                                                        onChange={(e) => setPostForm({ ...postForm, isPublished: e.target.value === 'true' })}
                                                                    >
                                                                        <option value="false">Draft</option>
                                                                        <option value="true">Published</option>
                                                                    </select>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                                                                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:bg-slate-50 transition-colors">
                                                                        {postForm.coverImage ? (
                                                                            <div className="relative">
                                                                                <img src={postForm.coverImage} alt="Cover" className="w-full h-32 object-cover rounded mb-2" />
                                                                                <button
                                                                                    onClick={() => setPostForm({ ...postForm, coverImage: '' })}
                                                                                    className="text-red-500 text-xs hover:underline"
                                                                                >
                                                                                    Remove
                                                                                </button>
                                                                            </div>
                                                                        ) : (
                                                                            <input
                                                                                type="file"
                                                                                accept="image/*"
                                                                                onChange={async (e) => {
                                                                                    const file = e.target.files[0]
                                                                                    if (file) {
                                                                                        const formData = new FormData()
                                                                                        formData.append('file', file)
                                                                                        formData.append('vehicleType', 'blog-cover') // Reuse existing endpoint logic
                                                                                        const res = await fetch('/api/upload/vehicle', { method: 'POST', body: formData })
                                                                                        const data = await res.json()
                                                                                        if (data.path) {
                                                                                            setPostForm({ ...postForm, coverImage: data.path })
                                                                                        }
                                                                                    }
                                                                                }}
                                                                                className="text-xs w-full"
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                                                                    <input
                                                                        type="text"
                                                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none text-sm"
                                                                        value={postForm.seo?.metaTitle || ''}
                                                                        onChange={(e) => setPostForm({ ...postForm, seo: { ...postForm.seo, metaTitle: e.target.value } })}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                                                                    <textarea
                                                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none text-sm h-24"
                                                                        value={postForm.seo?.metaDescription || ''}
                                                                        onChange={(e) => setPostForm({ ...postForm, seo: { ...postForm.seo, metaDescription: e.target.value } })}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex justify-end gap-3 pt-6 border-t">
                                                            <button
                                                                onClick={() => setEditingPost(null)}
                                                                className="px-6 py-2 text-gray-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    const url = editingPost === 'NEW' ? '/api/blog' : `/api/blog/${postForm.slug}`
                                                                    const method = editingPost === 'NEW' ? 'POST' : 'PUT'

                                                                    const res = await fetch(url, {
                                                                        method: method,
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify(postForm)
                                                                    })

                                                                    const data = await res.json()
                                                                    if (data.success) {
                                                                        alert('Post saved successfully!')
                                                                        setEditingPost(null)
                                                                        // Logic to refresh list
                                                                        fetch('/api/blog?isAdmin=true&limit=100').then(r => r.json()).then(d => d.success && setBlogPosts(d.data))
                                                                    } else {
                                                                        alert('Error: ' + data.error)
                                                                    }
                                                                }}
                                                                className="px-6 py-2 bg-emerald-900 text-white rounded-lg font-bold hover:bg-emerald-900/90 shadow-lg shadow-emerald-900/20 transition-all hover:scale-105"
                                                            >
                                                                {editingPost === 'NEW' ? 'Create Post' : 'Update Post'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {currentView === 'team' && (
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl shadow-sm p-6">
                                            <div className="flex items-center justify-between mb-6">
                                                <h2 className="text-2xl font-bold text-emerald-900">Team Management</h2>
                                                <button
                                                    onClick={() => {
                                                        setTeamForm({ permissions: [] })
                                                        setEditingTeam('NEW')
                                                    }}
                                                    className="bg-emerald-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-900/90 text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-all hover:scale-105"
                                                >
                                                    <Users size={16} /> Add New Admin
                                                </button>
                                            </div>

                                            {isLoading ? (
                                                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-900"></div></div>
                                            ) : (
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm">
                                                        <thead>
                                                            <tr className="bg-slate-50 text-gray-500">
                                                                <th className="px-4 py-3 text-left">Name</th>
                                                                <th className="px-4 py-3 text-left">Email</th>
                                                                <th className="px-4 py-3 text-left">Role</th>
                                                                <th className="px-4 py-3 text-left">Permissions</th>
                                                                <th className="px-4 py-3 text-right">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {teamMembers.map(member => (
                                                                <tr key={member._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                                                    <td className="px-4 py-3 font-medium text-emerald-900">{member.name}</td>
                                                                    <td className="px-4 py-3 text-gray-500">{member.email}</td>
                                                                    <td className="px-4 py-3 capitalize">{member.role}</td>
                                                                    <td className="px-4 py-3">
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {member.permissions?.map(p => (
                                                                                <span key={p} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">{p}</span>
                                                                            ))}
                                                                            {(!member.permissions || member.permissions.length === 0) && <span className="text-gray-400 text-xs">All Access (Super)</span>}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-right">
                                                                        <button className="text-gray-400 hover:text-emerald-900" title="Edit Permissions not implemented yet">•••</button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>

                                        {/* Add Admin Modal */}
                                        {editingTeam && (
                                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                                                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up">
                                                    <h3 className="text-xl font-bold text-emerald-900 mb-4">Add New Admin</h3>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                                            <input
                                                                type="text"
                                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600/20"
                                                                value={teamForm.name || ''}
                                                                onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                            <input
                                                                type="email"
                                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600/20"
                                                                value={teamForm.email || ''}
                                                                onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                                            <input
                                                                type="password"
                                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600/20"
                                                                value={teamForm.password || ''}
                                                                onChange={(e) => setTeamForm({ ...teamForm, password: e.target.value })}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                {['manage_bookings', 'manage_vehicles', 'manage_content', 'manage_team'].map(perm => {
                                                                    const isChecked = teamForm.permissions?.includes(perm);
                                                                    return (
                                                                        <div
                                                                            key={perm}
                                                                            onClick={() => {
                                                                                const current = teamForm.permissions || []
                                                                                if (isChecked) {
                                                                                    setTeamForm({ ...teamForm, permissions: current.filter(p => p !== perm) })
                                                                                } else {
                                                                                    setTeamForm({ ...teamForm, permissions: [...current, perm] })
                                                                                }
                                                                            }}
                                                                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isChecked ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-200 hover:border-emerald-200'}`}
                                                                        >
                                                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-slate-300'}`}>
                                                                                {isChecked && <Check size={12} className="text-white" />}
                                                                            </div>
                                                                            <span className="capitalize text-sm font-medium text-slate-700">{perm.replace('_', ' ')}</span>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>

                                                        <div className="flex justify-end gap-3 pt-4">
                                                            <button
                                                                onClick={() => setEditingTeam(null)}
                                                                className="px-4 py-2 text-gray-600 hover:bg-slate-100 rounded-lg"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    if (!teamForm.email || !teamForm.password) return alert('Email & Password required')
                                                                    const res = await fetch('/api/admin/team', {
                                                                        method: 'POST',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify(teamForm)
                                                                    })
                                                                    const data = await res.json()
                                                                    if (data.success) {
                                                                        setTeamMembers([...teamMembers, data.data])
                                                                        setEditingTeam(null)
                                                                        alert('Admin added!')
                                                                    } else {
                                                                        alert(data.error)
                                                                    }
                                                                }}
                                                                className="px-6 py-2 bg-emerald-900 text-white rounded-lg font-bold hover:bg-emerald-900/90"
                                                            >
                                                                Create User
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {currentView === 'bookings' && (
                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                            <div className="flex items-center gap-4">
                                                <h2 className="text-2xl font-bold text-emerald-900">All Bookings</h2>
                                                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">{filteredBookings.length} total</span>
                                            </div>
                                            <div className="relative w-full sm:w-auto">
                                                <input
                                                    type="text"
                                                    placeholder="Search by ID, Name, Phone..."
                                                    value={bookingSearch}
                                                    onChange={(e) => setBookingSearch(e.target.value)}
                                                    className="w-full sm:w-80 pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 shadow-sm"
                                                />
                                                <div className="absolute left-3 top-2.5 text-gray-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                                </div>
                                            </div>
                                        </div>

                                        {filteredBookings.length === 0 ? (
                                            <div className="text-center py-12 text-gray-400 bg-slate-50 rounded-lg border border-dashed">
                                                <p>No matching bookings found</p>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="bg-slate-50 text-gray-500 text-left">
                                                            <th className="px-4 py-3 rounded-l-lg">Booking ID</th>
                                                            <th className="px-4 py-3">Customer</th>
                                                            <th className="px-4 py-3">Route</th>
                                                            <th className="px-4 py-3">Date & Time</th>
                                                            <th className="px-4 py-3">Vehicle</th>
                                                            <th className="px-4 py-3 text-right">Amount</th>
                                                            <th className="px-4 py-3">Payment</th>
                                                            <th className="px-4 py-3 rounded-r-lg">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredBookings.map((booking) => (
                                                            <tr
                                                                key={booking._id}
                                                                onClick={() => {
                                                                    setSelectedBooking(booking)
                                                                    setSelectedStatus(booking.status)
                                                                    setSelectedDriver(booking.driver || '')
                                                                }}
                                                                className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                                                            >
                                                                <td className="px-4 py-4 font-mono text-xs text-gray-400">
                                                                    {booking._id?.slice(-8) || 'N/A'}
                                                                </td>
                                                                <td className="px-4 py-4">
                                                                    <div className="font-medium text-emerald-900">{booking.customerName || booking.guestPhone || 'Guest'}</div>
                                                                    <div className="text-xs text-gray-400">{booking.guestPhone}</div>
                                                                </td>
                                                                <td className="px-4 py-4">
                                                                    {booking.type === 'tour' && booking.tourDetails ? (
                                                                        <div>
                                                                            <div className="font-bold text-emerald-900">{booking.tourDetails.tourTitle}</div>
                                                                            <div className="text-xs text-gray-500">ID: {booking.tourDetails.tourId || 'N/A'}</div>
                                                                            {booking.tourDetails.duration && (
                                                                                <div className="text-xs text-gray-400">{booking.tourDetails.duration}</div>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            <div className="text-xs">
                                                                                <span className="text-green-600">●</span> {booking.pickupLocation?.address?.split(',')[0] || 'N/A'}
                                                                            </div>
                                                                            <div className="text-xs">
                                                                                <span className="text-red-500">●</span> {booking.dropoffLocation?.address?.split(',')[0] || 'N/A'}
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-4">
                                                                    <div className="font-medium">{booking.scheduledDate || 'Not set'}</div>
                                                                    <div className="text-xs text-gray-400">{booking.scheduledTime || ''}</div>
                                                                </td>
                                                                <td className="px-4 py-4 capitalize">
                                                                    {booking.vehicleType?.replace(/-/g, ' ') || 'N/A'}
                                                                </td>
                                                                <td className="px-4 py-4 text-right font-bold text-emerald-900">
                                                                    Rs {booking.totalPrice?.toLocaleString() || 0}
                                                                </td>
                                                                <td className="px-4 py-4">
                                                                    <span className={`px-2 py-1 rounded text-xs font-bold capitalize ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                                                                        booking.paymentStatus === 'pending' ? 'bg-orange-100 text-orange-700' :
                                                                            'bg-gray-100 text-gray-600'
                                                                        }`}>
                                                                        {booking.paymentStatus || 'pending'}
                                                                    </span>
                                                                    <div className="text-xs text-gray-400 mt-1">{booking.paymentMethod || 'cash'}</div>
                                                                </td>
                                                                <td className="px-4 py-4">
                                                                    <span className={`px-2 py-1 rounded text-xs font-bold capitalize ${booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                                        booking.status === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                                                                            booking.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                                                    'bg-gray-100 text-gray-600'
                                                                        }`}>
                                                                        {booking.status || 'pending'}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}

                                        {/* Booking Detail Modal */}
                                        {selectedBooking && (
                                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                                                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                                                    <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                                                        <div>
                                                            <h3 className="text-xl font-bold text-emerald-900">Booking Details</h3>
                                                            <p className="text-sm text-gray-500">ID: {selectedBooking._id}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => setSelectedBooking(null)}
                                                            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                                        >
                                                            <X size={24} className="text-gray-500" />
                                                        </button>
                                                    </div>

                                                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        {/* Customer Info */}
                                                        <div className="bg-slate-50 p-6 rounded-xl space-y-4">
                                                            <h4 className="font-bold text-emerald-900 flex items-center gap-2">
                                                                <Users size={18} /> Customer Information
                                                            </h4>
                                                            <div className="space-y-3">
                                                                <div>
                                                                    <span className="text-xs text-gray-500 uppercase tracking-wider block">Name</span>
                                                                    <span className="font-medium">{selectedBooking.customerName || selectedBooking.guestPhone || 'N/A'}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs text-gray-500 uppercase tracking-wider block">Phone</span>
                                                                    <a href={`tel:${selectedBooking.guestPhone}`} className="font-medium text-emerald-600 hover:underline flex items-center gap-1">
                                                                        <Phone size={14} /> {selectedBooking.guestPhone || 'N/A'}
                                                                    </a>
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs text-gray-500 uppercase tracking-wider block">Email</span>
                                                                    <a href={`mailto:${selectedBooking.customerEmail}`} className="font-medium text-blue-600 hover:underline flex items-center gap-1">
                                                                        <Mail size={14} /> {selectedBooking.customerEmail || 'N/A'}
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Journey Info */}
                                                        <div className="bg-slate-50 p-6 rounded-xl space-y-4">
                                                            <h4 className="font-bold text-emerald-900 flex items-center gap-2">
                                                                <Car size={18} /> Journey Details
                                                            </h4>
                                                            <div className="space-y-3">
                                                                <div>
                                                                    <span className="text-xs text-gray-500 uppercase tracking-wider block">{selectedBooking.type === 'tour' ? 'Tour Details' : 'Route'}</span>
                                                                    {selectedBooking.type === 'tour' && selectedBooking.tourDetails ? (
                                                                        <div className="mt-1 space-y-1">
                                                                            <div className="font-bold text-emerald-900">{selectedBooking.tourDetails.tourTitle}</div>
                                                                            <div className="text-sm text-gray-600 font-mono">ID: {selectedBooking.tourDetails.tourId}</div>
                                                                            <div className="text-sm text-gray-600 mb-2">Duration: {selectedBooking.tourDetails.duration}</div>
                                                                            {selectedBooking.pickupLocation?.address && selectedBooking.pickupLocation.address !== 'Tour Pickup (TBD)' && (
                                                                                <div className="text-xs text-gray-500 mt-2">
                                                                                    <span className="font-bold">Pickup:</span> {selectedBooking.pickupLocation.address}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="mt-1 space-y-2">
                                                                            <div className="flex items-start gap-2">
                                                                                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                                                                                <span className="text-sm leading-tight">{selectedBooking.pickupLocation?.address || 'N/A'}</span>
                                                                            </div>
                                                                            <div className="flex items-start gap-2">
                                                                                <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
                                                                                <span className="text-sm leading-tight">{selectedBooking.dropoffLocation?.address || 'N/A'}</span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4 pt-2">
                                                                    <div>
                                                                        <span className="text-xs text-gray-500 uppercase tracking-wider block">Distance</span>
                                                                        <span className="font-medium">{selectedBooking.distanceKm} km</span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-xs text-gray-500 uppercase tracking-wider block">Vehicle</span>
                                                                        <span className="font-medium capitalize">{selectedBooking.vehicleType?.replace(/-/g, ' ')}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Schedule Info */}
                                                        <div className="bg-slate-50 p-6 rounded-xl space-y-4">
                                                            <h4 className="font-bold text-emerald-900 flex items-center gap-2">
                                                                <Calendar size={18} /> Schedule
                                                            </h4>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <span className="text-xs text-gray-500 uppercase tracking-wider block">Date</span>
                                                                    <span className="font-medium">{selectedBooking.scheduledDate}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs text-gray-500 uppercase tracking-wider block">Time</span>
                                                                    <span className="font-medium">{selectedBooking.scheduledTime}</span>
                                                                </div>
                                                                <div className="col-span-2">
                                                                    <span className="text-xs text-gray-500 uppercase tracking-wider block">Flight Number</span>
                                                                    <span className="font-medium">{selectedBooking.flightNumber || 'Not provided'}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Payment Info */}
                                                        <div className="bg-slate-50 p-6 rounded-xl space-y-4">
                                                            <h4 className="font-bold text-emerald-900 flex items-center gap-2">
                                                                <CreditCard size={18} /> Payment & Status
                                                            </h4>
                                                            <div className="space-y-3">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Total Amount</span>
                                                                    <span className="text-xl font-bold text-emerald-600">Rs {selectedBooking.totalPrice?.toLocaleString()}</span>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4 pt-2">
                                                                    <div>
                                                                        <span className="text-xs text-gray-500 uppercase tracking-wider block">Method</span>
                                                                        <span className="font-medium capitalize">{selectedBooking.paymentMethod}</span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-xs text-gray-500 uppercase tracking-wider block">Payment Status</span>
                                                                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold capitalize mt-1 ${selectedBooking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                                                                            selectedBooking.paymentStatus === 'pending' ? 'bg-orange-100 text-orange-700' :
                                                                                'bg-gray-100 text-gray-600'
                                                                            }`}>
                                                                            {selectedBooking.paymentStatus}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs text-gray-500 uppercase tracking-wider block">Booking Status</span>
                                                                    <select
                                                                        className="mt-1 w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-emerald-600"
                                                                        value={selectedStatus}
                                                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                                                    >
                                                                        <option value="pending">Pending</option>
                                                                        <option value="confirmed">Confirmed</option>
                                                                        <option value="assigned">Assigned</option>
                                                                        <option value="ongoing">Ongoing</option>
                                                                        <option value="completed">Completed</option>
                                                                        <option value="cancelled">Cancelled</option>
                                                                    </select>
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs text-gray-500 uppercase tracking-wider block">Assign Driver</span>
                                                                    <select
                                                                        className="mt-1 w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-emerald-600"
                                                                        value={selectedDriver}
                                                                        onChange={(e) => {
                                                                            setSelectedDriver(e.target.value)
                                                                            if (e.target.value && selectedStatus === 'pending') {
                                                                                setSelectedStatus('assigned')
                                                                            }
                                                                        }}
                                                                    >
                                                                        <option value="">-- Select Driver --</option>
                                                                        {drivers.map(driver => (
                                                                            <option key={driver._id} value={driver._id}>
                                                                                {driver.name} ({driver.vehicleNumber} - {driver.vehicleType})
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="p-6 border-t bg-gray-50 flex flex-wrap justify-end gap-3 md:gap-4 rounded-b-2xl">
                                                        <button
                                                            onClick={() => setSelectedBooking(null)}
                                                            className="px-6 py-2.5 text-gray-600 hover:bg-gray-200 rounded-lg font-bold transition-colors min-w-[100px]"
                                                        >
                                                            Close
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                setUpdatingStatus(true)
                                                                try {
                                                                    // Assuming we need a PUT endpoint to update status
                                                                    const res = await fetch(`/api/bookings/${selectedBooking._id}`, {
                                                                        method: 'PUT',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify({
                                                                            status: selectedStatus,
                                                                            assignedDriver: selectedDriver || null
                                                                        })
                                                                    })

                                                                    const data = await res.json()

                                                                    if (data.success) {
                                                                        // Update local state
                                                                        const updatedList = bookings.map(b =>
                                                                            b._id === selectedBooking._id ? { ...b, status: selectedStatus } : b
                                                                        )
                                                                        setBookings(updatedList)
                                                                        setSelectedBooking({ ...selectedBooking, status: selectedStatus })
                                                                        alert('Booking status updated successfully')
                                                                    } else {
                                                                        alert('Failed to update: ' + (data.error || 'Unknown error'))
                                                                    }
                                                                } catch (err) {
                                                                    console.error(err)
                                                                    alert('An error occurred while updating status')
                                                                } finally {
                                                                    setUpdatingStatus(false)
                                                                }
                                                            }}
                                                            disabled={updatingStatus}
                                                            className="px-8 py-2.5 bg-emerald-900 text-white rounded-lg font-bold hover:bg-emerald-800 transition-all disabled:opacity-50 min-w-[140px] shadow-lg flex items-center justify-center gap-2"
                                                        >
                                                            {updatingStatus ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                                            {updatingStatus ? 'Saving...' : 'Save Changes'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {currentView === 'communications' && (
                                    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8">
                                        <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                                            <Mail className="text-emerald-600" /> Email Center
                                        </h2>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                                                <select
                                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600/20 bg-white"
                                                    value={emailForm.recipientType}
                                                    onChange={(e) => setEmailForm({ ...emailForm, recipientType: e.target.value })}
                                                >
                                                    <option value="specific">Specific Email</option>
                                                    <option value="all_users">All Customers</option>
                                                    <option value="all_drivers">All Drivers</option>
                                                </select>
                                            </div>

                                            {emailForm.recipientType === 'specific' && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                                    <input
                                                        type="email"
                                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600/20"
                                                        placeholder="customer@example.com"
                                                        value={emailForm.customEmail || ''}
                                                        onChange={(e) => setEmailForm({ ...emailForm, customEmail: e.target.value })}
                                                    />
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600/20"
                                                    placeholder="Important Update..."
                                                    value={emailForm.subject}
                                                    onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                                <textarea
                                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600/20 h-48"
                                                    placeholder="Write your message here..."
                                                    value={emailForm.message}
                                                    onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                                                />
                                            </div>

                                            <div className="flex justify-end pt-4">
                                                <button
                                                    onClick={async () => {
                                                        setSendingEmail(true)
                                                        try {
                                                            const res = await fetch('/api/admin/email', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify(emailForm)
                                                            })
                                                            const data = await res.json()
                                                            if (data.success) {
                                                                alert(`Sent ${data.sent} emails successfully!`)
                                                                setEmailForm({ recipientType: 'specific', subject: '', message: '' })
                                                            } else {
                                                                alert('Error: ' + data.error)
                                                            }
                                                        } catch (err) {
                                                            console.error(err)
                                                            alert('Failed to send emails')
                                                        } finally {
                                                            setSendingEmail(false)
                                                        }
                                                    }}
                                                    disabled={sendingEmail}
                                                    className="bg-emerald-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-900/90 flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    {sendingEmail ? <Loader2 className="animate-spin" /> : <Mail size={18} />}
                                                    {sendingEmail ? 'Sending...' : 'Send Email'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentView === 'support' && (
                                    <div className="space-y-6">
                                        {!selectedTicket ? (
                                            <div className="bg-white rounded-xl shadow-sm p-6">
                                                <h2 className="text-2xl font-bold text-emerald-900 mb-6">Support Tickets</h2>
                                                {isLoading ? (
                                                    <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-900"></div></div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {supportTickets.map(ticket => (
                                                            <div
                                                                key={ticket._id}
                                                                onClick={() => setSelectedTicket(ticket)}
                                                                className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    <div className={`w-3 h-3 rounded-full ${ticket.status === 'open' ? 'bg-green-500' : ticket.status === 'answered' ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                                                                    <div>
                                                                        <h3 className="font-bold text-emerald-900">{ticket.subject}</h3>
                                                                        <p className="text-sm text-gray-500">{ticket.user?.name} ({ticket.user?.email})</p>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${ticket.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>{ticket.priority}</span>
                                                                    <p className="text-xs text-gray-400 mt-1">{new Date(ticket.lastUpdated).toLocaleDateString()}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {supportTickets.length === 0 && <p className="text-center text-gray-400 py-8">No tickets found.</p>}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="max-w-4xl mx-auto">
                                                <button
                                                    onClick={() => setSelectedTicket(null)}
                                                    className="mb-4 text-gray-500 hover:text-emerald-900 font-medium flex items-center gap-2"
                                                >
                                                    ← Back to List
                                                </button>

                                                <div className="bg-white rounded-t-2xl shadow-sm p-6 border-b border-slate-100 flex justify-between items-start">
                                                    <div>
                                                        <h2 className="text-xl font-bold text-emerald-900 mb-1">{selectedTicket.subject}</h2>
                                                        <p className="text-sm text-gray-500">Customer: {selectedTicket.user?.name} ({selectedTicket.user?.email})</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <select
                                                            className="text-xs border rounded px-2 py-1 bg-white"
                                                            value={selectedTicket.status}
                                                            onChange={async (e) => {
                                                                const newStatus = e.target.value
                                                                const res = await fetch(`/api/support/${selectedTicket._id}`, {
                                                                    method: 'PUT',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({ status: newStatus })
                                                                })
                                                                if (res.ok) setSelectedTicket({ ...selectedTicket, status: newStatus })
                                                            }}
                                                        >
                                                            <option value="open">Open</option>
                                                            <option value="answered">Answered</option>
                                                            <option value="closed">Closed</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 p-6 space-y-6 min-h-[400px] max-h-[600px] overflow-y-auto">
                                                    {selectedTicket.messages.map((msg, idx) => (
                                                        <div key={idx} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                                            <div className={`max-w-[80%] rounded-2xl p-4 ${msg.sender === 'admin'
                                                                ? 'bg-emerald-900 text-white rounded-tr-none'
                                                                : 'bg-white text-gray-800 shadow-sm rounded-tl-none'
                                                                }`}>
                                                                <p className="whitespace-pre-wrap text-sm">{msg.message}</p>
                                                                <p className={`text-[10px] mt-2 opacity-70 ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}>
                                                                    {new Date(msg.timestamp).toLocaleString()} • {msg.sender}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="bg-white rounded-b-2xl shadow-sm p-4">
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Type your reply..."
                                                            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600/20"
                                                            value={adminReply}
                                                            onChange={e => setAdminReply(e.target.value)}
                                                            onKeyDown={async (e) => {
                                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                                    e.preventDefault();
                                                                    if (!adminReply.trim()) return;
                                                                    setSendingReply(true);
                                                                    try {
                                                                        const res = await fetch(`/api/support/${selectedTicket._id}`, {
                                                                            method: 'PUT',
                                                                            headers: { 'Content-Type': 'application/json' },
                                                                            body: JSON.stringify({ message: adminReply })
                                                                        });
                                                                        const data = await res.json();
                                                                        if (data.success) {
                                                                            setSelectedTicket(data.data);
                                                                            setAdminReply('');
                                                                        }
                                                                    } catch (err) {
                                                                        alert('Failed');
                                                                    } finally {
                                                                        setSendingReply(false);
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                        <button
                                                            onClick={async () => {
                                                                if (!adminReply.trim()) return
                                                                setSendingReply(true)
                                                                try {
                                                                    const res = await fetch(`/api/support/${selectedTicket._id}`, {
                                                                        method: 'PUT',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify({ message: adminReply })
                                                                    })
                                                                    const data = await res.json()
                                                                    if (data.success) {
                                                                        setSelectedTicket(data.data)
                                                                        setAdminReply('')
                                                                    }
                                                                } catch (err) { alert('Failed') }
                                                                finally { setSendingReply(false) }
                                                            }}
                                                            disabled={sendingReply || !adminReply.trim()}
                                                            className="bg-emerald-600 text-emerald-900 p-3 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50"
                                                        >
                                                            {sendingReply ? '...' : <div className="font-bold px-2">Send</div>}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {currentView === 'coupons' && (
                                    <div className="space-y-6">
                                        {/* Header */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className="text-3xl font-bold text-slate-800">Coupon Management</h2>
                                                <p className="text-slate-500 mt-1">Create and manage promotional discount codes</p>
                                            </div>
                                        </div>

                                        {/* Create New Coupon Card */}
                                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl shadow-emerald-500/30">
                                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                                <Percent size={20} />
                                                Create New Coupon
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-emerald-100 mb-1 uppercase tracking-wider">Code</label>
                                                    <input
                                                        placeholder="e.g. GALLE10"
                                                        value={newCoupon.code}
                                                        onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                                        className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 outline-none focus:bg-white/30 placeholder-white/50 text-white font-bold"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-emerald-100 mb-1 uppercase tracking-wider">Type</label>
                                                    <select
                                                        value={newCoupon.discountType}
                                                        onChange={e => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                                                        className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 outline-none focus:bg-white/30 text-white font-bold"
                                                    >
                                                        <option value="percentage" className="text-slate-800">Percentage (%)</option>
                                                        <option value="flat" className="text-slate-800">Flat (Rs)</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-emerald-100 mb-1 uppercase tracking-wider">Value</label>
                                                    <input
                                                        type="number"
                                                        placeholder="10"
                                                        value={newCoupon.value}
                                                        onChange={e => setNewCoupon({ ...newCoupon, value: e.target.value })}
                                                        className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 outline-none focus:bg-white/30 placeholder-white/50 text-white font-bold"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-emerald-100 mb-1 uppercase tracking-wider">Expiry</label>
                                                    <input
                                                        type="date"
                                                        value={newCoupon.expiryDate}
                                                        onChange={e => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                                                        className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 outline-none focus:bg-white/30 text-white font-bold"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-emerald-100 mb-1 uppercase tracking-wider">Location</label>
                                                    <input
                                                        placeholder="e.g. Galle"
                                                        value={newCoupon.locationsText || ''}
                                                        onChange={e => setNewCoupon({ ...newCoupon, locationsText: e.target.value })}
                                                        className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 outline-none focus:bg-white/30 placeholder-white/50 text-white font-bold"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
                                                <div className="lg:col-span-2">
                                                    <label className="block text-xs font-bold text-emerald-100 mb-1 uppercase tracking-wider">Description</label>
                                                    <input
                                                        placeholder="e.g. Get 10% off on your next trip to Galle"
                                                        value={newCoupon.description}
                                                        onChange={e => setNewCoupon({ ...newCoupon, description: e.target.value })}
                                                        className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 outline-none focus:bg-white/30 placeholder-white/50 text-white font-bold"
                                                    />
                                                </div>
                                                <div className="lg:col-span-1">
                                                    <label className="block text-xs font-bold text-emerald-100 mb-1 uppercase tracking-wider">Image URL</label>
                                                    <input
                                                        placeholder="https://..."
                                                        value={newCoupon.imageUrl}
                                                        onChange={e => setNewCoupon({ ...newCoupon, imageUrl: e.target.value })}
                                                        className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 outline-none focus:bg-white/30 placeholder-white/50 text-white font-bold"
                                                    />
                                                </div>
                                                <div className="lg:col-span-1 flex items-center gap-3 pt-4">
                                                    <button
                                                        onClick={() => setNewCoupon({ ...newCoupon, displayInWidget: !newCoupon.displayInWidget })}
                                                        className={`w-12 h-6 rounded-full transition-colors relative ${newCoupon.displayInWidget ? 'bg-emerald-400' : 'bg-white/20'}`}
                                                    >
                                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${newCoupon.displayInWidget ? 'left-7' : 'left-1'}`}></div>
                                                    </button>
                                                    <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Display in Widget</span>
                                                </div>
                                                <div className="flex items-end">
                                                    <button
                                                        onClick={handleAddCoupon}
                                                        className="w-full p-3 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all hover:scale-105 shadow-lg"
                                                    >
                                                        + Create Coupon
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Coupons Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {coupons.map(c => (
                                                <div key={c._id} className="relative group bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-300 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                                                    {/* Coupon Design */}
                                                    <div className="p-6">
                                                        <div className="flex items-start justify-between mb-4">
                                                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                                                <Percent className="text-white" size={20} />
                                                            </div>
                                                            <button
                                                                onClick={() => handleDeleteCoupon(c._id)}
                                                                className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                            >
                                                                <X size={18} />
                                                            </button>
                                                        </div>

                                                        {/* Discount Display */}
                                                        <div className="mb-2">
                                                            <div className="text-4xl font-black text-slate-800">
                                                                {c.value}{c.discountType === 'percentage' ? '%' : ''}
                                                                <span className="text-lg font-bold text-slate-400 ml-1">
                                                                    {c.discountType === 'percentage' ? 'OFF' : 'LKR OFF'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Description */}
                                                        {c.description && (
                                                            <p className="text-xs text-slate-500 mb-4 line-clamp-2">{c.description}</p>
                                                        )}

                                                        {/* Image Preview if exists */}
                                                        {c.imageUrl && (
                                                            <div className="mb-4 rounded-lg overflow-hidden h-20 bg-slate-50 border border-slate-100">
                                                                <img src={c.imageUrl} alt={c.code} className="w-full h-full object-cover" />
                                                            </div>
                                                        )}

                                                        {/* Widget Display Link */}
                                                        {c.displayInWidget && (
                                                            <div className="mb-3 flex items-center gap-1.5">
                                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Visible in Widget</span>
                                                            </div>
                                                        )}

                                                        {/* Code */}
                                                        <div className="bg-slate-100 rounded-xl p-3 flex items-center justify-between mb-4">
                                                            <code className="font-mono font-bold text-emerald-600 text-lg tracking-wider">{c.code}</code>
                                                            <button
                                                                onClick={() => navigator.clipboard.writeText(c.code)}
                                                                className="text-xs text-slate-400 hover:text-emerald-600"
                                                            >
                                                                Copy
                                                            </button>
                                                        </div>

                                                        {/* Details */}
                                                        <div className="space-y-2 text-sm">
                                                            {c.applicableLocations && c.applicableLocations.length > 0 && (
                                                                <div className="flex items-center gap-2 text-slate-600">
                                                                    <MapPin size={14} className="text-emerald-500" />
                                                                    <span>{c.applicableLocations.join(', ')}</span>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center gap-2 text-slate-500">
                                                                <Calendar size={14} />
                                                                <span>{c.expiryDate ? `Expires ${new Date(c.expiryDate).toLocaleDateString()}` : 'No expiry'}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Decorative circles */}
                                                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-100 rounded-full"></div>
                                                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-100 rounded-full"></div>
                                                </div>
                                            ))}
                                        </div>

                                        {coupons.length === 0 && (
                                            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                                                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                    <Percent className="text-slate-400" size={28} />
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-800 mb-2">No Coupons Yet</h3>
                                                <p className="text-slate-500">Create your first coupon above to start offering discounts</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Reviews Management */}
                                {currentView === 'reviews' && (
                                    <ReviewsManagement />
                                )}

                                {/* Drivers Fleet View */}
                                {currentView === 'drivers' && <DriversFleetView />}

                                {/* Live Driver Map */}
                                {currentView === 'live-map' && <LiveDriverMap />}
                            </div>
                        </div >
            </div >
                )
}
