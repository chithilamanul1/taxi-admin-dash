'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { Users, Car, MapPin, Map as MapIcon, DollarSign, Activity, Bell, X, Phone, Mail, Calendar, Clock, CreditCard, FileText, Loader2, Percent, CheckSquare, Square, Check, LifeBuoy, Compass, MessageCircle, Copy, Link as LinkIcon, ExternalLink, Plus } from 'lucide-react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { flatRatesList } from '@/data/flatRates'
import ReviewsManagement from '@/components/ReviewsManagement'
import DriversFleetView from '@/components/DriversFleetView'
import LiveDriverMap from '@/components/LiveDriverMap'
import AdminChatManager from '@/components/AdminChatManager'
import PushNotificationManager from '@/components/PushNotificationManager'
import RevenueStats from '@/components/RevenueStats'
import InvoiceManager from '@/components/admin/InvoiceManager'
import DestinationManager from '@/components/admin/DestinationManager'

export default function AdminDashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'loading') return;

        if (!session || session.user.role !== 'admin') {
            router.push('/admin/login');
        }
    }, [session, status, router])

    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [currentView, setCurrentView] = useState('dashboard')
    const [notificationsEnabled, setNotificationsEnabled] = useState(false)
    const prevUnreadCount = useRef(0)
    const [bookings, setBookings] = useState([])
    const [bookingSearch, setBookingSearch] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [vehiclePricing, setVehiclePricing] = useState([])
    const [pricingCategory, setPricingCategory] = useState('airport-transfer')
    const [editingVehicle, setEditingVehicle] = useState(null)
    const [editForm, setEditForm] = useState({})
    const [pricingSettings, setPricingSettings] = useState({ longDistanceThreshold: 175, longDistanceDiscountPercentage: 10, isActive: true })

    // Tours State
    const [tours, setTours] = useState([])
    const [editingTour, setEditingTour] = useState(null)
    const [tourForm, setTourForm] = useState({})
    const [tourCategoryFilter, setTourCategoryFilter] = useState('All')

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
        displayInWidget: true,
        usageLimit: ''
    })
    const [ordering, setOrdering] = useState('newest'); // or whatever
    const [emailForm, setEmailForm] = useState({ recipientType: 'specific', customEmail: '', subject: '', message: '' })
    const [sendingEmail, setSendingEmail] = useState(false)
    const [adminReply, setAdminReply] = useState('')
    const [sendingReply, setSendingReply] = useState(false)
    const [selectedBooking, setSelectedBooking] = useState(null)
    const [selectedStatus, setSelectedStatus] = useState('pending')
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('pending')
    const [updatingStatus, setUpdatingStatus] = useState(false)
    const [drivers, setDrivers] = useState([])
    const [selectedDriver, setSelectedDriver] = useState('')
    const [notifications, setNotifications] = useState([])
    const [showNotifications, setShowNotifications] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    // Quick Links State
    const [quickLinks, setQuickLinks] = useState([])
    const [newQuickLink, setNewQuickLink] = useState({ title: '', price: '', slug: '', badge: 'Special Offer' })
    const [isSavingQuickLink, setIsSavingQuickLink] = useState(false)

    // Manual Booking States
    const [showManualBooking, setShowManualBooking] = useState(false);
    const [manualBookingForm, setManualBookingForm] = useState({
        customerName: '',
        guestPhone: '',
        pickupLocation: { address: '' },
        dropoffLocation: { address: '' },
        scheduledDate: '',
        scheduledTime: '',
        vehicleType: 'sedan',
        distanceKm: '',
        totalPrice: '',
        paymentStatus: 'pending',
        paymentMethod: 'cash',
        type: 'transfer'
    });
    const [isSavingManual, setIsSavingManual] = useState(false);

    // Filter bookings based on search
    const filteredBookings = useMemo(() => {
        if (!bookingSearch.trim()) return bookings
        const search = bookingSearch.toLowerCase()
        return bookings.filter(b => {
            const shortId = b._id?.slice(-6).toLowerCase();
            return (
                b._id?.toLowerCase().includes(search) ||
                shortId?.includes(search) || // Enable search by last 6 chars
                b.customerName?.toLowerCase().includes(search) ||
                b.guestPhone?.includes(search) ||
                b.pickupLocation?.address?.toLowerCase().includes(search) ||
                b.dropoffLocation?.address?.toLowerCase().includes(search)
            )
        })
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
                    displayInWidget: false,
                    usageLimit: ''
                });
                alert('Coupon created successfully!');
            } else {
                const errorData = await res.json();
                alert('Failed to create coupon: ' + (errorData.error || res.statusText));
            }
        } catch (e) {
            console.error(e);
            alert('An error occurred while creating the coupon.');
        }
    }

    const handleDeleteCoupon = async (id) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;
        try {
            await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
            setCoupons(coupons.filter(c => c._id !== id));
        } catch (e) { console.error(e); }
    }

    const fetchQuickLinks = async () => {
        try {
            const res = await fetch('/api/admin/quick-links');
            const data = await res.json();
            if (data.success) setQuickLinks(data.data);
        } catch (err) {
            console.error('Failed to fetch quick links', err);
        }
    };

    const handleSaveQuickLink = async () => {
        if (!newQuickLink.title || !newQuickLink.price || !newQuickLink.slug) {
            alert('Please fill in all fields');
            return;
        }
        setIsSavingQuickLink(true);
        try {
            const res = await fetch('/api/admin/quick-links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newQuickLink)
            });
            const data = await res.json();
            if (data.success) {
                setQuickLinks([data.data, ...quickLinks]);
                setNewQuickLink({ title: '', price: '', slug: '', badge: 'Special Offer' });
                alert('Quick Link created!');
            } else {
                alert('Error: ' + data.error);
            }
        } catch (err) {
            alert('Failed to save quick link');
        } finally {
            setIsSavingQuickLink(false);
        }
    };

    const handleDeleteQuickLink = async (id) => {
        if (!confirm('Are you sure you want to delete this link?')) return;
        try {
            const res = await fetch(`/api/admin/quick-links?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setQuickLinks(quickLinks.filter(l => l._id !== id));
            }
        } catch (err) {
            alert('Failed to delete');
        }
    };

    useEffect(() => {
        const fetchData = () => {
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
                        if (data.success && Array.isArray(data.data)) setSupportTickets(data.data)
                        else if (Array.isArray(data)) setSupportTickets(data) // Fallback for old format
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
                setIsLoading(true)
                // Fetch vehicle pricing
                fetch(`/api/pricing?category=${pricingCategory}`, { cache: 'no-store' })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success && Array.isArray(data.data)) {
                            setVehiclePricing(data.data)
                        } else {
                            setVehiclePricing([])
                        }
                    })
                    .catch(err => console.error(err))

                // Fetch global settings
                fetch('/api/admin/pricing-settings', { cache: 'no-store' })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success && data.data) {
                            setPricingSettings(data.data)
                        }
                        setIsLoading(false)
                    })
                    .catch(err => {
                        console.error(err)
                        setIsLoading(false)
                    })
            }

            if (currentView === 'tours') {
                setIsLoading(true)
                fetch('/api/tours')
                    .then(res => res.json())
                    .then(data => {
                        if (data.success && Array.isArray(data.data)) {
                            setTours(data.data)
                        }
                        setIsLoading(false)
                    })
                    .catch(err => {
                        console.error('Error fetching tours:', err)
                        setIsLoading(false)
                    })
            }

            if (currentView === 'coupons') {
                setIsLoading(true)
                fetch('/api/coupons')
                    .then(res => res.json())
                    .then(data => {
                        if (Array.isArray(data)) setCoupons(data)
                        setIsLoading(false)
                    })
                    .catch(err => {
                        console.error("Error fetching coupons:", err)
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
                        // Sound alert logic
                        if (notificationsEnabled && data.unreadCount > prevUnreadCount.current) {
                            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                            audio.play().catch(e => console.log("Audio play blocked", e));

                            // Also try browser notification if permitted
                            if ("Notification" in window && Notification.permission === "granted") {
                                new Notification("New Admin Activity!", {
                                    body: `You have ${data.unreadCount} unread notifications.`,
                                    icon: '/logo.png'
                                });
                            }
                        }
                        setUnreadCount(data.unreadCount)
                        prevUnreadCount.current = data.unreadCount;
                    }
                })
                .catch(console.error)
        }

        // Initial fetch
        fetchData()
        fetchQuickLinks()

        // Auto-refresh every 45 seconds to keep it fresh but not annoying
        // Only refresh if NO MODALS/EDITING IS ACTIVE
        const interval = setInterval(() => {
            const isEditing = !!editingVehicle || !!editingTour || !!editingPost || !!editingTeam || !!selectedTicket || !!selectedBooking;
            if (!isEditing) {
                fetchData();
            }
        }, 45000)

        return () => clearInterval(interval)
    }, [currentView, pricingCategory, editingVehicle, editingTour, editingPost, editingTeam, selectedTicket, selectedBooking])

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
            { title: 'Online Drivers', value: onlineDrivers.toString(), icon: Users, color: 'text-slate-600' },
            { title: 'Pending Bookings', value: pendingBookings.toString(), icon: Bell, color: 'text-red-500' },
        ]
    }, [bookings, drivers])

    const formatPrice = (booking) => {
        if (!booking) return 'N/A';
        const currency = booking.currency || 'LKR';
        if (currency === 'LKR') {
            const amount = booking.totalPrice || 0;
            return `Rs ${amount.toLocaleString()}`;
        } else {
            const amount = booking.displayPrice || 0;
            const prefix = currency === 'USD' ? '$' : currency + ' ';
            return `${prefix}${amount.toLocaleString()}`;
        }
    };

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
        <div className="flex h-screen bg-[#050505] text-white font-sans selection:bg-[#FFDA00]/30 selection:text-white overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#FFDA00]/10 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-[#FFDA00]/5 blur-[100px] rounded-full"></div>
                <div className="absolute top-[40%] left-[20%] w-[500px] h-[500px] bg-[#FFDA00]/5 blur-[150px] rounded-full animated-mesh opacity-30"></div>
            </div>

            {/* Sidebar - Ultra Liquid Glass Design */}
            <aside className={`${sidebarOpen ? 'w-72' : 'w-24'} hidden md:flex flex-col p-6 transition-all duration-500 ease-out relative z-50`}>
                <div className="flex-1 liquid-glass border border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl">
                    {/* Logo Area */}
                    <div className="p-8 flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#FFDA00] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,218,0,0.3)] shrink-0">
                            <Car size={24} className="text-black" strokeWidth={2.5} />
                        </div>
                        <div className={`${!sidebarOpen && 'opacity-0 scale-95 pointer-events-none'} transition-all duration-300`}>
                            <h1 className="font-black text-xl leading-none uppercase tracking-tighter italic yellow-text-glow">Airport</h1>
                            <p className="text-[10px] text-[#FFDA00] font-black uppercase tracking-widest mt-1">Taxi Admin</p>
                        </div>
                    </div>

                    <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar py-4">
                        {[
                            { id: 'dashboard', icon: Activity, label: 'Overview' },
                            { id: 'pricing', icon: DollarSign, label: 'Pricing' },
                            { id: 'revenue', icon: DollarSign, label: 'Revenue' },
                            { id: 'rates', icon: MapPin, label: 'Rates' },
                            { id: 'chat', icon: MessageCircle, label: 'Messages', badge: true },
                            { id: 'tours-md', icon: Compass, label: 'Packages' },
                            { id: 'tours-dt', icon: MapIcon, label: 'Day Trips' },
                            { id: 'bookings', icon: Users, label: 'Bookings', showBadge: unreadCount > 0 },
                            { id: 'drivers', icon: Car, label: 'Fleet' },
                            { id: 'live-map', icon: MapPin, label: 'Map' },
                            { id: 'blog', icon: FileText, label: 'Insights' },
                            { id: 'team', icon: Users, label: 'Team' },
                            { id: 'coupons', icon: Percent, label: 'Coupons' },
                        ].map((item) => {
                            const isTours = item.id.startsWith('tours');
                            const filterVal = item.id === 'tours-md' ? 'Multi-Day Packages' : 'Day Trips';
                            const isActive = isTours ? (currentView === 'tours' && tourCategoryFilter === filterVal) : (currentView === item.id);

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        if (isTours) {
                                            setCurrentView('tours');
                                            setTourCategoryFilter(filterVal);
                                        } else {
                                            setCurrentView(item.id);
                                            if (item.id === 'bookings') setUnreadCount(0);
                                        }
                                    }}
                                    className={`flex items-center gap-4 p-4 w-full rounded-2xl transition-all duration-300 group relative ${isActive ? 'bg-[#FFDA00] text-black font-black shadow-xl scale-[1.02]' : 'hover:bg-white/5 text-white/40 hover:text-white'}`}
                                >
                                    <item.icon size={22} className={isActive ? 'text-black' : 'group-hover:text-[#FFDA00]'} strokeWidth={isActive ? 2.5 : 2} />
                                    <span className={`${!sidebarOpen && 'opacity-0 translate-x-4 pointer-events-none'} text-[11px] font-black uppercase tracking-widest transition-all duration-300`}>{item.label}</span>

                                    {isActive && <div className="absolute left-0 w-1.5 h-6 bg-black/20 rounded-r-full"></div>}

                                    {item.badge && <span className="absolute right-4 w-2 h-2 bg-[#FFDA00] rounded-full yellow-glow animate-pulse"></span>}
                                    {item.showBadge && (
                                        <span className="absolute right-4 px-2 py-0.5 bg-red-500 text-white text-[9px] font-black rounded-full">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="p-4 mt-auto">
                        <button
                            onClick={() => signOut({ callbackUrl: '/admin/login' })}
                            className="flex items-center gap-4 p-4 w-full rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 font-black uppercase tracking-widest text-[11px]"
                        >
                            <X size={20} className="shrink-0" strokeWidth={3} />
                            <span className={`${!sidebarOpen && 'hidden'}`}>Exit System</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col p-6 overflow-hidden relative">
                {/* Modern Header - Liquid Glass */}
                <header className="flex items-center justify-between mb-8 px-4 relative z-10">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="w-12 h-12 liquid-glass rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all border border-white/10"
                        >
                            <Activity size={20} className="text-[#FFDA00]" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                                <span>Administration</span>
                                <span className="text-white/20">/</span>
                                <span className="text-[#FFDA00] yellow-text-glow">{currentView}</span>
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mt-1">{currentView.replace('-', ' ')}</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex items-center liquid-glass border border-white/10 p-1.5 rounded-2xl overflow-hidden shrink-0">
                            <button
                                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${notificationsEnabled ? 'bg-[#FFDA00] text-black shadow-[0_0_20px_rgba(255,218,0,0.3)]' : 'text-white/40 hover:text-white'}`}
                            >
                                Live Stream {notificationsEnabled ? 'Active' : 'Offline'}
                            </button>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="w-12 h-12 liquid-glass rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all border border-white/10 relative"
                            >
                                <Bell size={20} className="text-white/60" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-4 border-[#050505]">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className="absolute top-16 right-0 w-96 liquid-glass border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                        <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Signal Intel</h3>
                                        <button onClick={() => setUnreadCount(0)} className="text-[10px] text-[#FFDA00] font-black uppercase tracking-widest hover:text-white transition-all">Clear All</button>
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                        {notifications.length === 0 ? (
                                            <div className="py-12 text-center">
                                                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                                                    <Bell size={32} className="text-white/20" />
                                                </div>
                                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">No signals received</p>
                                            </div>
                                        ) : (
                                            notifications.map((n, i) => (
                                                <div key={i} className="p-5 bg-white/[0.03] border border-white/5 rounded-3xl hover:bg-white/[0.08] transition-all group">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-[10px] font-black text-[#FFDA00] uppercase tracking-widest">{n.title}</span>
                                                        <span className="text-[9px] text-white/20">{new Date(n.timestamp || Date.now()).toLocaleTimeString()}</span>
                                                    </div>
                                                    <p className="text-xs text-white/60 leading-relaxed font-medium">{n.message}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-12 h-12 overflow-hidden liquid-glass border border-white/10 rounded-2xl flex items-center justify-center text-white font-bold hover:bg-white/10 transition-all cursor-pointer">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt="Admin" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-lg italic font-black text-[#FFDA00]">{session?.user?.name?.charAt(0) || 'A'}</span>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content Viewport */}
                <div className="flex-1 overflow-y-auto no-scrollbar pb-12 relative z-10">
                    {currentView === 'dashboard' && (
                        <div className="px-4 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            {/* Bento Grid Stats - Liquid Glass */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {/* Large Growth Card */}
                                <div className="md:col-span-2 md:row-span-2 liquid-glass border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl">
                                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FFDA00]/10 blur-[80px] rounded-full group-hover:bg-[#FFDA00]/20 transition-all duration-700"></div>
                                    <div className="relative z-10 h-full flex flex-col justify-between">
                                        <div className="flex items-center justify-between">
                                            <div className="w-16 h-16 bg-[#FFDA00] rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(255,218,0,0.4)]">
                                                <Activity size={32} className="text-black" strokeWidth={2.5} />
                                            </div>
                                            <div className="flex items-center gap-2 bg-[#FFDA00]/10 border border-[#FFDA00]/20 px-4 py-2 rounded-full">
                                                <span className="w-2 h-2 rounded-full bg-[#FFDA00] yellow-glow animate-pulse"></span>
                                                <span className="text-[10px] font-black text-[#FFDA00] uppercase tracking-widest">Systems Nominal</span>
                                            </div>
                                        </div>
                                        <div className="mt-12">
                                            <p className="text-white/40 text-xs font-black uppercase tracking-[0.34em] mb-4">Gross Revenue Portfolio</p>
                                            <h3 className="text-7xl font-black text-white tracking-tighter italic mb-4 yellow-text-glow">
                                                Rs.{bookings.filter(b => b.status === 'completed' || b.paymentStatus === 'paid').reduce((acc, b) => acc + (b.totalPrice || 0), 0).toLocaleString()}
                                            </h3>
                                            <div className="flex items-center gap-4 text-[#FFDA00] font-black uppercase italic tracking-tighter text-xl">
                                                <Activity size={24} />
                                                <span>+24.8% <span className="text-white/20 text-sm not-italic font-medium ml-2 uppercase tracking-widest">Growth Matrix</span></span>
                                            </div>
                                        </div>
                                        <div className="mt-12 p-1 bg-white/5 rounded-2xl flex border border-white/10 box-border">
                                            <button onClick={() => fetchData()} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all rounded-xl">Refresh Matrix</button>
                                            <button onClick={() => setCurrentView('revenue')} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest bg-[#FFDA00] text-black rounded-xl shadow-xl">Detailed Intel</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Active Operations */}
                                <div className="liquid-glass border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-xl hover:translate-y-[-4px] transition-all duration-300">
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#FFDA00]/10 transition-all">
                                            <Users size={24} className="text-[#FFDA00]" />
                                        </div>
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Active Ops</p>
                                        <h4 className="text-4xl font-black text-white tracking-tight">{bookings.filter(b => b.status === 'ongoing').length}</h4>
                                        <p className="text-[#FFDA00] text-[10px] font-bold mt-2 uppercase yellow-text-glow">Live On Grid</p>
                                    </div>
                                </div>

                                {/* Pending Clearances */}
                                <div className="liquid-glass border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-xl hover:translate-y-[-4px] transition-all duration-300">
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#FFDA00]/10 transition-all">
                                            <Calendar size={24} className="text-[#FFDA00]" />
                                        </div>
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Upcoming</p>
                                        <h4 className="text-4xl font-black text-white tracking-tight">{bookings.filter(b => b.status === 'pending').length}</h4>
                                        <p className="text-[#FFDA00] text-[10px] font-bold mt-2 uppercase">Pending Verification</p>
                                    </div>
                                </div>

                                {/* Fleet Capacity */}
                                <div className="md:col-span-2 bg-[#FFDA00] rounded-[2.5rem] p-8 relative overflow-hidden group shadow-[0_0_50px_rgba(255,218,0,0.15)] hover:scale-[1.02] transition-all duration-300">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rotate-45 translate-x-16 -translate-y-16"></div>
                                    <div className="relative z-10 flex items-center justify-between h-full">
                                        <div>
                                            <p className="text-black/40 text-[10px] font-black uppercase tracking-widest mb-1">Global Reach</p>
                                            <h4 className="text-4xl font-black text-black tracking-tighter uppercase italic">Operations Active</h4>
                                        </div>
                                        <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center shadow-2xl">
                                            <Compass size={28} className="text-[#FFDA00]" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Bookings Section - Liquid Glass Table */}
                            <div className="liquid-glass border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                <div className="px-10 py-8 border-b border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[#FFDA00]/10 border border-[#FFDA00]/20 rounded-2xl flex items-center justify-center text-[#FFDA00]">
                                            <Activity size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Recent Operations</h3>
                                            <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mt-0.5">Vector Logistics Feed</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setCurrentView('bookings')}
                                        className="px-6 py-3 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#FFDA00] hover:text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,218,0,0.2)]"
                                    >
                                        Open Logs
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-white/[0.02] text-left border-b border-white/5">
                                                <th className="px-10 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest">ID</th>
                                                <th className="px-10 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest">Customer</th>
                                                <th className="px-10 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest">Route</th>
                                                <th className="px-10 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest">Schedule</th>
                                                <th className="px-10 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest">Value</th>
                                                <th className="px-10 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest text-right">State</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {bookings.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="py-24 text-center">
                                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                                            <Activity size={48} className="text-white" />
                                                            <p className="text-[10px] font-black text-white uppercase tracking-widest">Static Feed - No Operations</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                bookings.slice(0, 8).map((booking) => (
                                                    <tr key={booking._id} className="hover:bg-white/[0.02] transition-colors group">
                                                        <td className="px-10 py-6">
                                                            <span className="text-[10px] font-black text-white bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 uppercase tracking-widest">
                                                                TX-{booking._id.slice(-4).toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td className="px-10 py-6">
                                                            <div className="text-sm font-black text-white uppercase tracking-tighter italic group-hover:text-[#FFDA00] transition-colors">{booking.customerName || 'GUEST'}</div>
                                                            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">{booking.guestPhone}</div>
                                                        </td>
                                                        <td className="px-10 py-6">
                                                            <div className="flex items-center gap-3">
                                                                <div className="text-[10px] font-black text-[#FFDA00] uppercase tracking-tighter truncate max-w-[120px]">{booking.pickupLocation?.address?.split(',')[0]}</div>
                                                                <div className="w-3 h-3 border-r-2 border-b-2 border-white/20 rotate-[-45deg]"></div>
                                                                <div className="text-[10px] font-black text-white/60 uppercase tracking-tighter truncate max-w-[120px]">{booking.dropoffLocation?.address?.split(',')[0]}</div>
                                                            </div>
                                                        </td>
                                                        <td className="px-10 py-6">
                                                            <div className="text-[10px] font-black text-white uppercase tracking-widest">{booking.scheduledDate}</div>
                                                            <div className="text-[10px] font-bold text-[#FFDA00] uppercase tracking-widest mt-1">{booking.scheduledTime}</div>
                                                        </td>
                                                        <td className="px-10 py-6">
                                                            <div className="text-sm font-black text-[#FFDA00] tracking-widest yellow-text-glow">Rs.{formatPrice(booking).replace('Rs ', '')}</div>
                                                        </td>
                                                        <td className="px-10 py-6 text-right">
                                                            <span className={`text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-[0.1em] border transition-all ${booking.status === 'pending' ? 'bg-white/5 text-white/60 border-white/10' :
                                                                booking.status === 'ongoing' ? 'bg-[#FFDA00]/10 text-[#FFDA00] border-[#FFDA00]/20 animate-pulse shadow-[0_0_15px_rgba(255,218,0,0.1)]' :
                                                                    booking.status === 'completed' ? 'bg-[#FFDA00] text-black border-transparent font-black shadow-lg shadow-[#255,218,0,0.2]' :
                                                                        'bg-red-500/10 text-red-500 border-red-500/20'
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




                    {currentView === 'chat' && (
                        <div className="animate-fade-in-up">
                            <AdminChatManager />
                        </div>
                    )}

                    {currentView === 'invoices' && (
                        <div className="animate-fade-in-up">
                            <InvoiceManager />
                        </div>
                    )}

                    {currentView === 'rates' && (
                        <div className="animate-fade-in-up">
                            <DestinationManager />
                        </div>
                    )}

                    {currentView === 'pricing' && (
                        <div className="space-y-8 animate-fade-in-up">
                            <div className="bg-[#050505]/40 liquid-glass p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFDA00]/5 blur-[120px] -mr-64 -mt-64 transition-all duration-1000 group-hover:bg-[#FFDA00]/10"></div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter yellow-text-glow">Vehicle Pricing & Tiers</h2>
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={() => {
                                                setEditForm({})
                                                setEditingVehicle('NEW')
                                            }}
                                            className="bg-[#FFDA00] text-black px-8 py-3 rounded-2xl font-black uppercase italic tracking-tighter hover:bg-white transition-all hover:scale-105 flex items-center gap-2 shadow-[0_10px_30px_rgba(255,218,0,0.2)]"
                                        >
                                            <Car size={20} /> Add New Vehicle
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (!confirm('This will RESET ALL pricing for ALL vehicles to the system DEFAULTS. Are you sure?')) return;
                                                setIsLoading(true);
                                                const res = await fetch('/api/admin/sync-pricing', { method: 'POST' });
                                                const data = await res.json();
                                                if (data.success) {
                                                    alert(data.message);
                                                    fetchData(); // Refresh current view
                                                } else {
                                                    alert(data.error || 'Sync failed');
                                                }
                                                setIsLoading(false);
                                            }}
                                            className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                                        >
                                            Reset to Default
                                        </button>
                                    </div>
                                </div>

                                {/* Global Discount Configuration */}
                                <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-8 mb-8 border border-white/10 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFDA00]/50 to-transparent"></div>
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="font-black text-white uppercase italic tracking-widest flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#FFDA00]/10 rounded-xl flex items-center justify-center text-[#FFDA00]">
                                                <Percent size={20} />
                                            </div>
                                            Global Long-Distance Discount
                                        </h3>
                                        <button
                                            onClick={async () => {
                                                const res = await fetch('/api/admin/pricing-settings', {
                                                    method: 'PUT',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify(pricingSettings)
                                                });
                                                const data = await res.json();
                                                if (data.success) alert('Settings saved successfully!');
                                                else alert('Failed to save settings.');
                                            }}
                                            className="bg-[#FFDA00] text-black px-6 py-2 rounded-xl font-black uppercase italic tracking-tighter text-xs hover:bg-white transition-all"
                                        >
                                            Save Configuration
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">
                                                Distance Threshold (km)
                                            </label>
                                            <input
                                                type="number"
                                                value={pricingSettings.longDistanceThreshold}
                                                onChange={e => setPricingSettings({ ...pricingSettings, longDistanceThreshold: Number(e.target.value) })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg font-black text-white outline-none focus:border-[#FFDA00]/50 transition-all"
                                            />
                                            <p className="text-[9px] text-white/20 font-medium ml-2">Minimum distance to automatically trigger discount.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">
                                                Discount Percentage (%)
                                            </label>
                                            <input
                                                type="number"
                                                value={pricingSettings.longDistanceDiscountPercentage}
                                                onChange={e => setPricingSettings({ ...pricingSettings, longDistanceDiscountPercentage: Number(e.target.value) })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg font-black text-white outline-none focus:border-[#FFDA00]/50 transition-all"
                                            />
                                            <p className="text-[9px] text-white/20 font-medium ml-2">Percentage deducted from the total fare.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">
                                                Name Board Price (LKR)
                                            </label>
                                            <input
                                                type="number"
                                                value={pricingSettings.nameBoardPrice || 2000}
                                                onChange={e => setPricingSettings({ ...pricingSettings, nameBoardPrice: Number(e.target.value) })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg font-black text-white outline-none focus:border-[#FFDA00]/50 transition-all"
                                            />
                                            <p className="text-[9px] text-white/20 font-medium ml-2">Fee for airport pickup name sign service.</p>
                                        </div>
                                        <div className="flex items-center pt-4">
                                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={pricingSettings.isActive}
                                                    onChange={e => setPricingSettings({ ...pricingSettings, isActive: e.target.checked })}
                                                    className="w-5 h-5 text-slate-600 rounded focus:ring-amber-500 border-gray-300 cursor-pointer"
                                                />
                                                <span className="text-sm font-medium text-slate-900">Enable Automated Discount</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Category Tabs */}
                                <div className="flex bg-white/5 p-1.5 rounded-2xl mb-8 w-fit border border-white/5">
                                    {[
                                        { id: 'airport-transfer', label: 'Airport Transfer' },
                                        { id: 'ride-now', label: 'Ride Now / P2P' },
                                        { id: 'tours', label: 'Tour Packages' }
                                    ].map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setPricingCategory(cat.id)}
                                            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${pricingCategory === cat.id ? 'bg-[#FFDA00] text-black shadow-lg shadow-[#FFDA00]/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>

                                {editingVehicle === 'NEW' && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up">
                                            <h3 className="text-xl font-bold text-slate-900 mb-4">Add New Vehicle</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Luxury Sedan"
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-600/20 focus:border-transparent outline-none transition-all"
                                                        value={editForm.name || ''}
                                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Code (Type)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. luxury-sedan"
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-600/20 focus:border-transparent outline-none transition-all"
                                                        value={editForm.vehicleType || ''}
                                                        onChange={(e) => setEditForm({ ...editForm, vehicleType: e.target.value })}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g. 3"
                                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-600/20 focus:border-transparent outline-none transition-all"
                                                            value={editForm.capacity || ''}
                                                            onChange={(e) => setEditForm({ ...editForm, capacity: Number(e.target.value) })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Luggage</label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g. 2"
                                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-600/20 focus:border-transparent outline-none transition-all"
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
                                                        className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-900/90"
                                                    >
                                                        Create {pricingCategory.replace('-', ' ')} Rate
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {isLoading ? (
                                    <div className="flex items-center justify-center py-24">
                                        <div className="w-12 h-12 border-4 border-[#FFDA00]/10 border-t-[#FFDA00] rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-8">
                                        {vehiclePricing.map((vehicle) => (
                                            <div
                                                key={vehicle._id || vehicle.vehicleType}
                                                className="liquid-glass border border-white/10 rounded-[2.5rem] p-10 transition-all duration-500 hover:border-[#FFDA00]/30 relative overflow-hidden group/card"
                                            >
                                                <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFDA00]/5 blur-[100px] -mr-48 -mt-48 transition-all duration-700 group-hover/card:bg-[#FFDA00]/10"></div>

                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 relative z-10">
                                                    <div className="flex items-center gap-8">
                                                        <div className="w-40 h-28 bg-white/5 rounded-3xl overflow-hidden flex items-center justify-center border border-white/10 group-hover/card:border-[#FFDA00]/30 transition-all p-4">
                                                            <img
                                                                src={vehicle.image || '/vehicles/placeholder.png'}
                                                                alt={vehicle.name}
                                                                className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                                                                onError={(e) => { e.target.src = '/vehicles/placeholder.png' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h3 className="font-black text-white text-3xl italic uppercase tracking-tighter yellow-text-glow">{vehicle.name}</h3>
                                                                <span className="bg-[#FFDA00]/10 text-[#FFDA00] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-[#FFDA00]/20">
                                                                    {vehicle.vehicleType}
                                                                </span>
                                                            </div>
                                                            {pricingCategory === 'tours' ? (
                                                                <p className="text-xs text-white/40 font-black uppercase tracking-widest">Premium Tour Package Rates</p>
                                                            ) : (
                                                                <p className="text-xs text-white/40 font-black uppercase tracking-widest flex items-center gap-4">
                                                                    <span className="flex items-center gap-1.5"><Users size={12} className="text-[#FFDA00]" /> 1-{vehicle.capacity} PAX</span>
                                                                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                                                                    <span className="flex items-center gap-1.5"><Briefcase size={12} className="text-[#FFDA00]" /> {vehicle.luggage} BAGS</span>
                                                                </p>
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
                                                                    _id: vehicle._id,
                                                                    name: vehicle.name,
                                                                    capacity: vehicle.capacity,
                                                                    luggage: vehicle.luggage,
                                                                    waitingCharges: vehicle.waitingCharges || [],
                                                                    tiers: vehicle.tiers || [],
                                                                    features: vehicle.features || [],
                                                                    basePrice: vehicle.basePrice,
                                                                    baseKm: vehicle.baseKm,
                                                                    perKmRate: vehicle.perKmRate
                                                                })
                                                            }
                                                        }}
                                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${editingVehicle === vehicle.vehicleType ? 'bg-red-100 text-red-600' : 'bg-slate-600 text-slate-900 hover:bg-slate-600/80'}`}
                                                    >
                                                        {editingVehicle === vehicle.vehicleType ? 'Cancel' : 'Edit Rates'}
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm('Are you sure you want to delete this vehicle?')) {
                                                                const res = await fetch(`/api/pricing?id=${vehicle._id}`, { method: 'DELETE' });
                                                                if (res.ok) {
                                                                    setVehiclePricing(prev => prev.filter(v => v._id !== vehicle._id));
                                                                    alert('Deleted successfully');
                                                                } else {
                                                                    alert('Failed to delete');
                                                                }
                                                            }
                                                        }}
                                                        className="px-2 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                        title="Delete Vehicle"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>

                                                {/* Tier Table */}
                                                {editingVehicle === vehicle.vehicleType ? (
                                                    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 relative z-10">
                                                        {/* Image Upload */}
                                                        <div className="flex items-center gap-6 p-6 bg-white/5 rounded-3xl border border-white/10 group/upload cursor-pointer hover:border-[#FFDA00]/30 transition-all">
                                                            <div className="w-12 h-12 bg-[#FFDA00]/10 rounded-xl flex items-center justify-center text-[#FFDA00]">
                                                                <Image size={24} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-[10px] font-black text-[#FFDA00] uppercase tracking-widest mb-1">Update Vehicle Visuals</p>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={async (e) => {
                                                                        const file = e.target.files[0]
                                                                        if (file) {
                                                                            const formData = new FormData()
                                                                            formData.append('file', file)
                                                                            formData.append('folder', 'vehicles')
                                                                            const res = await fetch('/api/upload', { method: 'POST', body: formData })
                                                                            const data = await res.json()
                                                                            if (data.url) {
                                                                                await fetch(`/api/pricing`, {
                                                                                    method: 'PUT',
                                                                                    headers: { 'Content-Type': 'application/json' },
                                                                                    body: JSON.stringify({ _id: vehicle._id, image: data.url })
                                                                                })
                                                                                setVehiclePricing(prev => prev.map(v => v._id === vehicle._id ? { ...v, image: data.url } : v))
                                                                            }
                                                                        }
                                                                    }}
                                                                    className="text-xs text-white/40 font-bold file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-[#FFDA00] file:text-black cursor-pointer"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                                                            <div className="bg-white/5 px-8 py-6 border-b border-white/10 flex justify-between items-center">
                                                                <h4 className="font-black text-white uppercase italic tracking-widest text-xs">Dynamic Pricing Engine</h4>
                                                                <button
                                                                    onClick={() => {
                                                                        const newTiers = [...(editForm.tiers || [])];
                                                                        newTiers.push({ min: 0, max: 0, type: 'per_km', price: 0, rate: 0 });
                                                                        setEditForm({ ...editForm, tiers: newTiers });
                                                                    }}
                                                                    className="bg-[#FFDA00] text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all"
                                                                >
                                                                    + Expand Algorithm
                                                                </button>
                                                            </div>
                                                            {/* Editable Tiers - Improved Layout */}
                                                            <div className="overflow-x-auto border border-slate-200 rounded-lg">
                                                                <table className="w-full text-sm">
                                                                    <thead className="bg-slate-50">
                                                                        <tr>
                                                                            <th className="px-4 py-3 text-left font-semibold text-slate-900 w-24">Min KM</th>
                                                                            <th className="px-4 py-3 text-left font-semibold text-slate-900 w-24">Max KM</th>
                                                                            <th className="px-4 py-3 text-left font-semibold text-slate-900 w-32">Type</th>
                                                                            <th className="px-4 py-3 text-left font-semibold text-slate-900 w-32">Flat (Rs)</th>
                                                                            <th className="px-4 py-3 text-left font-semibold text-slate-900 w-32">Rate (Rs/km)</th>
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
                                                                                    }} className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-slate-600 outline-none text-center" />
                                                                                </td>
                                                                                <td className="px-2 py-2">
                                                                                    <input type="number" value={tier.max} onChange={(e) => {
                                                                                        const newTiers = [...editForm.tiers]
                                                                                        newTiers[idx] = { ...newTiers[idx], max: Number(e.target.value) }
                                                                                        setEditForm({ ...editForm, tiers: newTiers })
                                                                                    }} className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-slate-600 outline-none text-center" />
                                                                                </td>
                                                                                <td className="px-2 py-2">
                                                                                    <select value={tier.type} onChange={(e) => {
                                                                                        const newTiers = [...editForm.tiers]
                                                                                        newTiers[idx] = { ...newTiers[idx], type: e.target.value }
                                                                                        setEditForm({ ...editForm, tiers: newTiers })
                                                                                    }} className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-slate-600 outline-none bg-white">
                                                                                        <option value="flat">Flat</option>
                                                                                        <option value="per_km">Per KM</option>
                                                                                    </select>
                                                                                </td>
                                                                                <td className="px-2 py-2">
                                                                                    <input type="number" value={tier.price || 0} onChange={(e) => {
                                                                                        const newTiers = [...editForm.tiers]
                                                                                        newTiers[idx] = { ...newTiers[idx], price: Number(e.target.value) }
                                                                                        setEditForm({ ...editForm, tiers: newTiers })
                                                                                    }} className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-slate-600 outline-none disabled:opacity-50 disabled:bg-slate-100 text-right" disabled={tier.type !== 'flat'} />
                                                                                </td>
                                                                                <td className="px-2 py-2">
                                                                                    <input type="number" value={tier.rate || 0} onChange={(e) => {
                                                                                        const newTiers = [...editForm.tiers]
                                                                                        newTiers[idx] = { ...newTiers[idx], rate: Number(e.target.value) }
                                                                                        setEditForm({ ...editForm, tiers: newTiers })
                                                                                    }} className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-slate-600 outline-none disabled:opacity-50 disabled:bg-slate-100 text-right" disabled={tier.type !== 'per_km'} />
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
                                                        </div>

                                                        {/* Waiting Charges Management */}
                                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-900/10 space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                                                    <Clock size={16} /> Tiered Waiting Charges
                                                                </h4>
                                                                <button
                                                                    onClick={() => {
                                                                        const current = editForm.waitingCharges || []
                                                                        setEditForm({ ...editForm, waitingCharges: [...current, 1000] })
                                                                    }}
                                                                    className="text-[10px] bg-white border border-slate-900/10 px-3 py-1 rounded-lg font-bold text-slate-900 hover:bg-slate-100 transition-colors"
                                                                >
                                                                    + Add Hour
                                                                </button>
                                                            </div>
                                                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                                                                {(editForm.waitingCharges || []).map((charge, idx) => (
                                                                    <div key={idx} className="bg-white p-2 rounded-lg border border-slate-900/10 relative group">
                                                                        <label className="block text-[8px] font-bold text-slate-900/40 uppercase mb-1">{idx + 1} Hour{idx > 0 && 's'}</label>
                                                                        <div className="flex items-center gap-1">
                                                                            <span className="text-[10px] font-bold text-slate-900">Rs</span>
                                                                            <input
                                                                                type="number"
                                                                                value={charge}
                                                                                onChange={(e) => {
                                                                                    const newCharges = [...editForm.waitingCharges]
                                                                                    newCharges[idx] = Number(e.target.value)
                                                                                    setEditForm({ ...editForm, waitingCharges: newCharges })
                                                                                }}
                                                                                className="w-full bg-transparent outline-none font-bold text-xs text-slate-900"
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
                                                                <p className="text-[10px] text-slate-900/40 italic">No custom waiting charges defined. Will use default hourly rate.</p>
                                                            )}
                                                        </div>

                                                        {/* Features Management */}
                                                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-900/10 space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <h4 className="text-sm font-bold text-blue-900 uppercase tracking-widest flex items-center gap-2">
                                                                    <FileText size={16} /> Key Features / Details
                                                                </h4>
                                                                <button
                                                                    onClick={() => {
                                                                        const current = editForm.features || []
                                                                        setEditForm({ ...editForm, features: [...current, 'New Feature'] })
                                                                    }}
                                                                    className="text-[10px] bg-white border border-blue-900/10 px-3 py-1 rounded-lg font-bold text-blue-900 hover:bg-blue-100 transition-colors"
                                                                >
                                                                    + Add Feature
                                                                </button>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                {(editForm.features || []).map((feature, idx) => (
                                                                    <div key={idx} className="flex gap-2">
                                                                        <input
                                                                            type="text"
                                                                            value={feature}
                                                                            onChange={(e) => {
                                                                                const newFeatures = [...editForm.features]
                                                                                newFeatures[idx] = e.target.value
                                                                                setEditForm({ ...editForm, features: newFeatures })
                                                                            }}
                                                                            className="w-full bg-white border border-blue-900/10 px-3 py-1.5 rounded-lg outline-none text-xs text-blue-900"
                                                                        />
                                                                        <button
                                                                            onClick={() => {
                                                                                const newFeatures = editForm.features.filter((_, i) => i !== idx)
                                                                                setEditForm({ ...editForm, features: newFeatures })
                                                                            }}
                                                                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                                                                        >
                                                                            <X size={14} />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
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
                                                                    const res = await fetch(`/api/pricing`, {
                                                                        method: 'PUT',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify(editForm)
                                                                    })
                                                                    if (res.ok) {
                                                                        setVehiclePricing(prev => prev.map(v => v._id === editForm._id ? { ...v, ...editForm } : v))
                                                                        setEditingVehicle(null)
                                                                        alert('Saved successfully!')
                                                                    } else {
                                                                        const err = await res.json();
                                                                        alert('Error: ' + (err.error || 'Failed to save'));
                                                                    }
                                                                }}
                                                                className="text-sm bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-900/90 font-bold shadow-lg shadow-slate-900/20 transition-all hover:scale-105"
                                                            >
                                                                Save {pricingCategory.replace('-', ' ')} Rates
                                                            </button>
                                                        </div>
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
                                                                        <td className="px-4 py-2 text-right font-bold text-slate-900 bg-white">
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

                                {/* Express Checkout Quick Links */}
                                <div className="mt-12 bg-slate-50 rounded-2xl p-8 border-2 border-dashed border-slate-200">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                                <LinkIcon size={20} className="text-slate-600" /> Shareable Flat Rate Links
                                            </h3>
                                            <p className="text-slate-500 text-sm mt-1">Direct payment links for marketing and manual sharing.</p>
                                        </div>
                                    </div>

                                    {/* Quick Link Generator Form */}
                                    <div className="mb-12 bg-white p-6 rounded-2xl border border-slate-900/10 shadow-sm">
                                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Plus size={16} /> Quick Link Generator
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                                            <div className="md:col-span-1">
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Destination/Title</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Airport to Galle"
                                                    value={newQuickLink.title}
                                                    onChange={(e) => setNewQuickLink({ ...newQuickLink, title: e.target.value })}
                                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-600/20"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Currency</label>
                                                <select
                                                    value={newQuickLink.currency || 'USD'}
                                                    onChange={(e) => setNewQuickLink({ ...newQuickLink, currency: e.target.value })}
                                                    className="w-full px-4 py-[9px] bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-600/20 font-bold"
                                                >
                                                    <option value="USD">USD ($)</option>
                                                    <option value="GBP">GBP (£)</option>
                                                    <option value="EUR">EUR (€)</option>
                                                    <option value="LKR">LKR (Rs)</option>
                                                    <option value="INR">INR (₹)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Price</label>
                                                <input
                                                    type="number"
                                                    placeholder="59"
                                                    value={newQuickLink.price}
                                                    onChange={(e) => setNewQuickLink({ ...newQuickLink, price: e.target.value })}
                                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-600/20 font-bold"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Link Slug (ID)</label>
                                                <input
                                                    type="text"
                                                    placeholder="airport-to-galle"
                                                    value={newQuickLink.slug}
                                                    onChange={(e) => setNewQuickLink({ ...newQuickLink, slug: e.target.value })}
                                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-600/20"
                                                />
                                            </div>
                                            {/* Payment Mode Removed */}
                                            <button
                                                onClick={handleSaveQuickLink}
                                                disabled={isSavingQuickLink}
                                                className="bg-slate-900 text-white h-[42px] px-6 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 md:col-span-5"
                                            >
                                                {isSavingQuickLink ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                                Create Dynamic Link
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {/* Dynamic Links from DB */}
                                        {quickLinks.map((rate) => (
                                            <div key={rate._id} className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800 flex flex-col justify-between group hover:-translate-y-1 transition-all relative overflow-hidden">
                                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                                                <div>
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white font-black">
                                                            {rate.title.split(' ').pop().charAt(0)}
                                                        </div>
                                                        <span className="text-[10px] font-bold text-amber-400 border border-amber-400/30 px-3 py-1 rounded-full uppercase tracking-widest">{rate.badge}</span>
                                                    </div>
                                                    <h4 className="font-bold text-white mb-1">{rate.title}</h4>
                                                    <p className="text-2xl font-black text-white mb-4">
                                                        {rate.currency === 'LKR' ? 'Rs.' : rate.currency === 'EUR' ? '€' : rate.currency === 'GBP' ? '£' : rate.currency === 'INR' ? '₹' : '$'}
                                                        {rate.price?.toLocaleString()}
                                                    </p>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            const url = `${window.location.origin}/checkout/${rate.slug}`;
                                                            navigator.clipboard.writeText(url);
                                                            alert('Link copied to clipboard!');
                                                        }}
                                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white text-slate-900 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all"
                                                    >
                                                        <Copy size={14} /> Copy Link
                                                    </button>
                                                    <Link
                                                        href={`/checkout/${rate.slug}`}
                                                        target="_blank"
                                                        className="w-10 h-10 flex items-center justify-center bg-white/10 text-white rounded-xl hover:bg-white hover:text-slate-900 transition-all"
                                                        title="Preview"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteQuickLink(rate._id)}
                                                        className="w-10 h-10 flex items-center justify-center bg-white/10 text-white rounded-xl hover:bg-red-500 transition-all"
                                                        title="Delete"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] text-white/40 uppercase font-bold tracking-tighter">SLUG: {rate.slug}</span>
                                                        <span className="text-[9px] text-amber-400 font-bold uppercase">{rate.currency || 'USD'}</span>
                                                    </div>
                                                    {/* Payment Mode Display Removed */}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Static Flat Rates */}
                                        {flatRatesList.map((rate) => (
                                            <div key={rate.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-md transition-all">
                                                <div>
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 font-black">
                                                            {rate.title.split(' ').pop().charAt(0)}
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-full">{rate.badge}</span>
                                                    </div>
                                                    <h4 className="font-bold text-slate-800 mb-1">{rate.title}</h4>
                                                    <p className="text-2xl font-black text-slate-900 mb-4">${rate.price}</p>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            const url = `${window.location.origin}/checkout/${rate.id}`;
                                                            navigator.clipboard.writeText(url);
                                                            alert('Link copied to clipboard!');
                                                        }}
                                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all"
                                                    >
                                                        <Copy size={14} /> Copy Link
                                                    </button>
                                                    <Link
                                                        href={`/checkout/${rate.id}`}
                                                        target="_blank"
                                                        className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-50 hover:text-slate-600 transition-all"
                                                        title="Preview Link"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentView === 'tours' && (
                        <div className="px-6 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            {/* Stats Header */}
                            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 relative overflow-hidden group shadow-2xl">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#22C55E]/5 blur-[120px] -mr-64 -mt-64 transition-all duration-1000 group-hover:bg-[#22C55E]/10"></div>

                                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-12 relative z-10">
                                    <div className="space-y-4">
                                        <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic flex items-center gap-6">
                                            <span className="w-2.5 h-12 bg-[#22C55E] rounded-full shadow-[0_0_20px_rgba(34,197,94,0.5)]"></span>
                                            Expedition Matrix
                                        </h2>
                                        <div className="flex items-center gap-6 ml-10">
                                            <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">Deployment Tier</span>
                                            <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
                                                {['Multi-Day Packages', 'Day Trips', 'Safari'].map(filter => (
                                                    <button
                                                        key={filter}
                                                        onClick={() => setTourCategoryFilter(filter)}
                                                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tourCategoryFilter === filter ? 'bg-[#22C55E] text-black shadow-xl shadow-[#22C55E]/30' : 'text-white/30 hover:text-white hover:bg-white/5'}`}
                                                    >
                                                        {filter}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setTourForm({
                                                category: tourCategoryFilter,
                                                priceType: 'from',
                                                currency: 'USD',
                                                inclusions: [],
                                                exclusions: [],
                                                images: []
                                            })
                                            setEditingTour('NEW')
                                        }}
                                        className="px-12 py-7 bg-[#FFDA00] text-black font-black uppercase italic tracking-tighter rounded-[2rem] hover:bg-white transition-all hover:scale-105 active:scale-95 shadow-[0_15px_40px_rgba(255,218,0,0.3)] flex items-center gap-4 text-xl"
                                    >
                                        <Compass size={32} className="animate-spin-slow" />
                                        Initialize Unit
                                    </button>
                                </div>
                            </div>

                            {/* Tour List Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
                                {tours.filter(t => tourCategoryFilter === 'All' || t.category === tourCategoryFilter).length === 0 ? (
                                    <div className="col-span-full py-40 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center gap-8 group">
                                        <Compass size={80} className="text-white/5 group-hover:text-[#22C55E]/20 transition-all duration-700 group-hover:rotate-45" />
                                        <p className="text-sm font-black text-white/20 uppercase tracking-[0.5em]">No Assets Detected in Sector</p>
                                    </div>
                                ) : (
                                    tours.filter(t => tourCategoryFilter === 'All' || t.category === tourCategoryFilter).map((tour) => (
                                        <div key={tour._id} className="group bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-[#22C55E]/30 transition-all duration-500 hover:-translate-y-3 shadow-2xl relative">
                                            <div className="aspect-[16/10] overflow-hidden relative">
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 opacity-80 group-hover:opacity-60 transition-opacity"></div>
                                                {tour.images?.[0] ? (
                                                    <img src={tour.images[0]} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/10"><Compass size={48} /></div>
                                                )}
                                                <div className="absolute top-6 left-6 z-20">
                                                    <span className="bg-[#22C55E] text-black px-4 py-1.5 rounded-full font-black text-[10px] uppercase italic tracking-tighter shadow-lg shadow-[#22C55E]/30">
                                                        {tour.category}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-8 space-y-8 relative z-20">
                                                <div>
                                                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter group-hover:text-[#22C55E] transition-all line-clamp-1">{tour.title}</h3>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{tour.duration?.days} Days Expedition</span>
                                                        <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                                                        <span className="text-[10px] font-black text-[#22C55E] uppercase tracking-widest">{tour.slug?.slice(0, 15)}...</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-end justify-between border-t border-white/5 pt-8">
                                                    <div>
                                                        <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Venture Value</p>
                                                        <div className="text-3xl font-black text-[#FFDA00] tracking-tighter italic">
                                                            <span className="text-xs not-italic text-white font-black uppercase tracking-widest mr-2">{tour.price?.currency || 'USD'}</span>
                                                            {tour.price?.amount || tour.price}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => {
                                                                setTourForm({
                                                                    ...tour,
                                                                    days: tour.duration?.days,
                                                                    nights: tour.duration?.nights,
                                                                    priceAmount: tour.price?.amount || tour.price,
                                                                    priceType: tour.price?.type || 'from',
                                                                    currency: tour.price?.currency || 'USD'
                                                                })
                                                                setEditingTour(tour._id)
                                                            }}
                                                            className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-[#22C55E] hover:text-black transition-all group/btn shadow-xl hover:scale-110"
                                                        >
                                                            <Pencil size={20} />
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                if (!confirm('TERMINATE ASSET?')) return;
                                                                const res = await fetch(`/api/tours/${tour._id}`, { method: 'DELETE' });
                                                                if (res.ok) setTours(tours.filter(t => t._id !== tour._id));
                                                            }}
                                                            className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl hover:scale-110"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Modal UI */}
                            {editingTour && (
                                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 overflow-hidden">
                                    <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setEditingTour(null)}></div>
                                    <div className="bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/10 rounded-[4rem] w-full max-w-7xl max-h-[95vh] overflow-y-auto no-scrollbar relative z-10 shadow-[0_0_150px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-500">
                                        <div className="p-16 md:p-24 space-y-20">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-4">
                                                    <h3 className="text-7xl font-black text-white italic tracking-tighter uppercase leading-none">Configure Unit</h3>
                                                    <div className="flex items-center gap-6">
                                                        <div className="flex items-center gap-2 bg-[#22C55E]/10 border border-[#22C55E]/20 px-4 py-1.5 rounded-full">
                                                            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
                                                            <span className="text-[10px] font-black text-[#22C55E] uppercase tracking-widest">Logic Core Ready</span>
                                                        </div>
                                                        <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px]">Expedition System V4.2</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => setEditingTour(null)} className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-white/20 hover:text-white hover:bg-red-500 transition-all border border-white/5 active:scale-90">
                                                    <X size={48} />
                                                </button>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-24">
                                                <div className="space-y-16">
                                                    {/* Branding Section */}
                                                    <div className="space-y-6">
                                                        <label className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] flex items-center gap-4">
                                                            <span className="w-12 h-[2px] bg-[#22C55E]"></span>
                                                            Package Title
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="IDENTIFIER"
                                                            className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] px-10 py-8 text-3xl font-black text-white uppercase italic tracking-tighter focus:bg-white/5 focus:border-[#22C55E]/50 transition-all outline-none"
                                                            value={tourForm.title || ''}
                                                            onChange={(e) => setTourForm({ ...tourForm, title: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-12">
                                                        <div className="space-y-6">
                                                            <label className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] flex items-center gap-4">
                                                                <span className="w-8 h-[2px] bg-[#FFDA00]"></span>
                                                                Solar Count
                                                            </label>
                                                            <input
                                                                type="number"
                                                                className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] px-10 py-8 text-4xl font-black text-white tracking-widest focus:bg-white/5 focus:border-[#FFDA00]/50 transition-all outline-none"
                                                                value={tourForm.days || ''}
                                                                onChange={(e) => setTourForm({ ...tourForm, days: Number(e.target.value) })}
                                                            />
                                                        </div>
                                                        <div className="space-y-6">
                                                            <label className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] flex items-center gap-4">
                                                                <span className="w-8 h-[2px] bg-[#FFDA00]"></span>
                                                                Lunar Count
                                                            </label>
                                                            <input
                                                                type="number"
                                                                className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] px-10 py-8 text-4xl font-black text-white tracking-widest focus:bg-white/5 focus:border-[#FFDA00]/50 transition-all outline-none"
                                                                value={tourForm.nights || ''}
                                                                onChange={(e) => setTourForm({ ...tourForm, nights: Number(e.target.value) })}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <label className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] flex items-center gap-4">
                                                            <span className="w-12 h-[2px] bg-[#22C55E]"></span>
                                                            Mission Intel
                                                        </label>
                                                        <textarea
                                                            placeholder="LOGISTICS OVERVIEW"
                                                            className="w-full bg-white/[0.03] border border-white/10 rounded-[3rem] px-10 py-8 h-64 text-xl font-medium text-white/70 focus:bg-white/5 focus:border-[#22C55E]/50 transition-all outline-none resize-none custom-scrollbar"
                                                            value={tourForm.description || ''}
                                                            onChange={(e) => setTourForm({ ...tourForm, description: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-16">
                                                    {/* Price Section */}
                                                    <div className="p-12 bg-white/5 border border-white/10 rounded-[3rem] space-y-10 shadow-2xl relative overflow-hidden group">
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFDA00]/5 rotate-45 translate-x-16 -translate-y-16 pointer-events-none"></div>
                                                        <div className="flex items-center gap-4 text-[#FFDA00] font-black uppercase tracking-[0.3em] text-xs italic">
                                                            <Activity size={20} strokeWidth={3} /> Financial Allocation
                                                        </div>
                                                        <div className="flex gap-6">
                                                            <select
                                                                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-black text-white outline-none focus:border-[#22C55E] transition-all"
                                                                value={tourForm.currency || 'USD'}
                                                                onChange={(e) => setTourForm({ ...tourForm, currency: e.target.value })}
                                                            >
                                                                <option value="USD">USD</option>
                                                                <option value="LKR">LKR</option>
                                                                <option value="EUR">EUR</option>
                                                            </select>
                                                            <input
                                                                type="number"
                                                                placeholder="CREDITS"
                                                                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-8 py-4 text-4xl font-black text-[#FFDA00] tracking-tighter outline-none focus:border-[#FFDA00]"
                                                                value={tourForm.priceAmount || ''}
                                                                onChange={(e) => setTourForm({ ...tourForm, priceAmount: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Media Injection */}
                                                    <div className="space-y-6">
                                                        <label className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] flex items-center gap-4">
                                                            <span className="w-12 h-[2px] bg-[#22C55E]"></span>
                                                            Visual Signal Intel
                                                        </label>
                                                        <div className="grid grid-cols-2 gap-6">
                                                            {(tourForm.images || []).map((img, i) => (
                                                                <div key={i} className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-white/10 group/img shadow-2xl">
                                                                    <img src={img} alt="" className="w-full h-full object-cover group-hover/img:scale-110 transition-all duration-700" />
                                                                    <button
                                                                        onClick={() => {
                                                                            const newImgs = [...tourForm.images];
                                                                            newImgs.splice(i, 1);
                                                                            setTourForm({ ...tourForm, images: newImgs });
                                                                        }}
                                                                        className="absolute top-4 right-4 w-10 h-10 bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-0 group-hover/img:scale-100 transition-all opacity-0 group-hover/img:opacity-100 hover:bg-red-500"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                            <button
                                                                onClick={async () => {
                                                                    const url = prompt('Enter High-Res Image Vector URL');
                                                                    if (url) setTourForm({ ...tourForm, images: [...(tourForm.images || []), url] });
                                                                }}
                                                                className="aspect-[16/10] bg-white/[0.03] border-4 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-white/10 hover:text-[#22C55E] hover:border-[#22C55E]/30 transition-all gap-4 group/add"
                                                            >
                                                                <Upload size={40} className="group-hover/add:scale-110 transition-all" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Inject Media Matrix</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:flex-row justify-end gap-8 pt-20 border-t border-white/5 mt-16">
                                                <button
                                                    onClick={() => setEditingTour(null)}
                                                    className="px-14 py-7 bg-white/5 text-white/30 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/10 hover:text-white transition-all shadow-xl active:scale-95"
                                                >
                                                    Abort Sync
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        const method = editingTour === 'NEW' ? 'POST' : 'PUT';
                                                        const res = await fetch('/api/tours', {
                                                            method,
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({
                                                                ...tourForm,
                                                                price: {
                                                                    amount: Number(tourForm.priceAmount || tourForm.price || 0),
                                                                    currency: tourForm.currency || 'USD',
                                                                    type: tourForm.priceType || 'from'
                                                                }
                                                            })
                                                        });
                                                        const data = await res.json();
                                                        if (data.success) {
                                                            alert('Asset Matrix Updated');
                                                            setEditingTour(null);
                                                            fetchData();
                                                        }
                                                    }}
                                                    className="px-20 py-7 bg-[#FFDA00] text-black font-black uppercase italic tracking-tighter text-2xl rounded-[2rem] hover:bg-white hover:scale-105 transition-all shadow-2xl active:scale-95 shadow-[#FFDA00]/20"
                                                >
                                                    {editingTour === 'NEW' ? 'Authorize Initial Deployment' : 'Confirm Matrix Rewrite'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {currentView === 'blog' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="bg-[#121212] border border-white/5 p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-[#22C55E]/5 blur-[100px] -mr-48 -mt-48 transition-all duration-1000 group-hover:bg-[#22C55E]/10"></div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                    <div className="space-y-1">
                                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
                                            <span className="w-1.5 h-8 bg-[#22C55E]"></span>
                                            Global Insights
                                        </h2>
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] ml-4">Blog & Media Management</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setPostForm({})
                                            setEditingPost('NEW')
                                        }}
                                        className="bg-[#22C55E] text-black h-[48px] px-8 font-black uppercase italic tracking-tighter text-sm flex items-center gap-3 hover:bg-[#FFDA00] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                                    >
                                        <FileText size={18} strokeWidth={3} /> Add New Post
                                    </button>
                                </div>
                            </div>
                            {/* Post List */}
                            {isLoading ? (
                                <div className="flex items-center justify-center py-24">
                                    <div className="relative">
                                        <div className="w-16 h-16 border-4 border-[#22C55E]/10 rounded-full"></div>
                                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-[#22C55E] rounded-full animate-spin"></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-[#121212] border border-white/5 mt-8 overflow-hidden group">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-white/5">
                                                    <th className="px-8 py-6 text-left text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Article Identity</th>
                                                    <th className="px-8 py-6 text-left text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">URL Endpoint</th>
                                                    <th className="px-8 py-6 text-left text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Status</th>
                                                    <th className="px-8 py-6 text-left text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Timestamp</th>
                                                    <th className="px-8 py-6 text-right text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Command</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {blogPosts.map(post => (
                                                    <tr key={post._id} className="group/row hover:bg-white/[0.02] transition-colors">
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 bg-white/5 overflow-hidden shrink-0">
                                                                    <img src={post.coverImage || '/placeholder.jpg'} className="w-full h-full object-cover grayscale group-hover/row:grayscale-0 transition-all" alt="" />
                                                                </div>
                                                                <span className="font-black text-white uppercase italic tracking-tighter text-lg">{post.title}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6 font-bold text-white/40 text-xs">/{post.slug}</td>
                                                        <td className="px-8 py-6">
                                                            <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest ${post.isPublished ? 'bg-[#22C55E] text-black' : 'bg-white/10 text-white/40'}`}>
                                                                {post.isPublished ? 'Active' : 'Draft'}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6 font-bold text-white/40 text-xs">{new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                                        <td className="px-8 py-6 text-right">
                                                            <div className="flex justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => {
                                                                        setPostForm(post)
                                                                        setEditingPost(post._id)
                                                                    }}
                                                                    className="w-10 h-10 bg-white/5 flex items-center justify-center hover:bg-[#22C55E] hover:text-black transition-all"
                                                                >
                                                                    <Pencil size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={async () => {
                                                                        if (confirm('Delete this post?')) {
                                                                            await fetch(`/api/blog/${post.slug}`, { method: 'DELETE' })
                                                                            setBlogPosts(blogPosts.filter(p => p._id !== post._id))
                                                                        }
                                                                    }}
                                                                    className="w-10 h-10 bg-white/5 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {blogPosts.length === 0 && (
                                                    <tr>
                                                        <td colSpan="5" className="px-8 py-24 text-center">
                                                            <p className="text-white/20 font-black uppercase italic tracking-widest">No Intelligence Data Recorded</p>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Add/Edit Post Modal */}
                            {editingPost && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                                    <div className="bg-[#121212] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-5xl h-[90vh] overflow-y-auto p-10 relative box-border">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#22C55E] to-transparent opacity-50"></div>

                                        <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
                                            <div className="space-y-1">
                                                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                                                    <span className="w-1 h-6 bg-[#FFDA00]"></span>
                                                    {editingPost === 'NEW' ? 'Compose Intelligence' : 'Refining Post Data'}
                                                </h3>
                                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-4">System Core • Content v5.0</p>
                                            </div>
                                            <button
                                                onClick={() => setEditingPost(null)}
                                                className="w-12 h-12 bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-[#22C55E] transition-all rounded-none border border-white/5"
                                            >
                                                <X size={24} />
                                            </button>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-10">
                                            <div className="md:col-span-2 space-y-8">
                                                <div className="space-y-4">
                                                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Headline</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-[#1a1a1a] border border-white/10 px-6 py-4 outline-none focus:border-[#22C55E] text-white font-black uppercase italic tracking-tighter text-2xl placeholder:text-white/5"
                                                        value={postForm.title || ''}
                                                        onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                                                        placeholder="VIBRANT HEADLINE HERE"
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Route Identifier</label>
                                                    <div className="flex items-center">
                                                        <span className="bg-[#111] border border-r-0 border-white/10 px-4 py-4 text-white/20 font-bold text-xs uppercase tracking-widest">/blog/</span>
                                                        <input
                                                            type="text"
                                                            className="flex-1 bg-[#111] border border-white/10 px-6 py-4 outline-none focus:border-[#22C55E] text-white font-bold text-xs"
                                                            value={postForm.slug || ''}
                                                            onChange={(e) => setPostForm({ ...postForm, slug: e.target.value })}
                                                            placeholder="auto-gen-from-title"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Rich Content Source (HTML)</label>
                                                    <textarea
                                                        className="w-full bg-[#1a1a1a] border border-white/10 px-6 py-6 outline-none focus:border-[#22C55E] text-white/80 font-mono text-sm h-[400px] resize-none leading-relaxed"
                                                        value={postForm.content || ''}
                                                        onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                                                        placeholder="<section><p>Advanced storytelling begins here...</p></section>"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-8">
                                                <div className="space-y-4">
                                                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Publication State</label>
                                                    <div className="relative group/select">
                                                        <select
                                                            className="w-full bg-[#1a1a1a] border border-white/10 px-6 py-4 outline-none focus:border-[#22C55E] text-white font-black uppercase tracking-widest appearance-none cursor-pointer"
                                                            value={postForm.isPublished ? 'true' : 'false'}
                                                            onChange={(e) => setPostForm({ ...postForm, isPublished: e.target.value === 'true' })}
                                                        >
                                                            <option value="false">System Draft</option>
                                                            <option value="true">Live Broadcast</option>
                                                        </select>
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                                                            <ChevronDown size={14} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Cover Aesthetic</label>
                                                    <div className="border border-white/10 bg-[#1a1a1a] p-4 text-center hover:border-[#22C55E]/30 transition-all group/upload box-border">
                                                        {postForm.coverImage ? (
                                                            <div className="relative">
                                                                <img src={postForm.coverImage} alt="Cover" className="w-full h-40 object-cover border border-white/5 opacity-60 group-hover/upload:opacity-100 transition-opacity" />
                                                                <button
                                                                    onClick={() => setPostForm({ ...postForm, coverImage: '' })}
                                                                    className="absolute top-2 right-2 bg-black/80 text-white p-2 hover:text-red-500 transition-colors"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="py-10 flex flex-col items-center gap-3">
                                                                <div className="w-12 h-12 bg-white/5 flex items-center justify-center text-white/20 group-hover/upload:text-[#22C55E] transition-colors">
                                                                    <ImagePlus size={24} />
                                                                </div>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={async (e) => {
                                                                        const file = e.target.files[0]
                                                                        if (file) {
                                                                            const formData = new FormData()
                                                                            formData.append('file', file)
                                                                            formData.append('folder', 'blog')
                                                                            const res = await fetch('/api/upload', { method: 'POST', body: formData })
                                                                            const data = await res.json()
                                                                            if (data.url) setPostForm({ ...postForm, coverImage: data.url })
                                                                        }
                                                                    }}
                                                                    className="text-xs text-white/20 cursor-pointer"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-6 pt-6 border-t border-white/5">
                                                    <div className="space-y-4">
                                                        <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Search Engine Title Override</label>
                                                        <input
                                                            type="text"
                                                            className="w-full bg-[#111] border border-white/10 px-4 py-3 outline-none focus:border-[#22C55E] text-white/60 font-medium text-xs"
                                                            value={postForm.seo?.metaTitle || ''}
                                                            onChange={(e) => setPostForm({ ...postForm, seo: { ...postForm.seo, metaTitle: e.target.value } })}
                                                        />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Meta Description Metadata</label>
                                                        <textarea
                                                            className="w-full bg-[#111] border border-white/10 px-4 py-3 outline-none focus:border-[#22C55E] text-white/60 font-medium text-xs h-32 resize-none"
                                                            value={postForm.seo?.metaDescription || ''}
                                                            onChange={(e) => setPostForm({ ...postForm, seo: { ...postForm.seo, metaDescription: e.target.value } })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-4 pt-10 border-t border-white/5 mt-10">
                                            <button
                                                onClick={() => setEditingPost(null)}
                                                className="px-10 py-4 bg-white/5 text-white/40 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 hover:text-white transition-all"
                                            >
                                                Discard Draft
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
                                                        fetch('/api/blog?isAdmin=true&limit=100').then(r => r.json()).then(d => d.success && setBlogPosts(d.data))
                                                    } else {
                                                        alert('Error: ' + data.error)
                                                    }
                                                }}
                                                className="px-12 py-4 bg-[#22C55E] text-black font-black uppercase italic tracking-tighter hover:bg-[#FFDA00] transition-all"
                                            >
                                                {editingPost === 'NEW' ? 'Initiate Broadcast' : 'Confirm Updates'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}


                    {
                        currentView === 'team' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-slate-900">Team Management</h2>
                                        <button
                                            onClick={() => {
                                                setTeamForm({ permissions: [] })
                                                setEditingTeam('NEW')
                                            }}
                                            className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-900/90 text-sm flex items-center gap-2 shadow-lg shadow-slate-900/20 transition-all hover:scale-105"
                                        >
                                            <Users size={16} /> Add New Admin
                                        </button>
                                    </div>

                                    {isLoading ? (
                                        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div></div>
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
                                                            <td className="px-4 py-3 font-medium text-slate-900">{member.name}</td>
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
                                                                <button className="text-gray-400 hover:text-slate-900" title="Edit Permissions not implemented yet">•••</button>
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
                                            <h3 className="text-xl font-bold text-slate-900 mb-4">Add New Admin</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-600/20"
                                                        value={teamForm.name || ''}
                                                        onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                    <input
                                                        type="email"
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-600/20"
                                                        value={teamForm.email || ''}
                                                        onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                                    <input
                                                        type="password"
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-600/20"
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
                                                                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isChecked ? 'bg-slate-50 border-amber-500' : 'bg-white border-slate-200 hover:border-amber-200'}`}
                                                                >
                                                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-slate-600 border-slate-600' : 'bg-white border-slate-300'}`}>
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
                                                        className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-900/90"
                                                    >
                                                        Create User
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    }

                    {
                        currentView === 'bookings' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <div className="flex items-center gap-4">
                                        <h2 className="text-2xl font-bold text-slate-900">All Bookings</h2>
                                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">{filteredBookings.length} total</span>
                                    </div>
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <div className="relative w-full sm:w-80">
                                            <input
                                                type="text"
                                                placeholder="Search by ID, Name, Phone..."
                                                value={bookingSearch}
                                                onChange={(e) => setBookingSearch(e.target.value)}
                                                className="w-full sm:w-80 pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600/20 shadow-sm"
                                            />
                                            <div className="absolute left-3 top-2.5 text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowManualBooking(true)}
                                            className="bg-slate-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-700 text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all whitespace-nowrap"
                                        >
                                            <Plus size={16} /> Manual Booking
                                        </button>
                                    </div>
                                </div>

                                {/* Manual Booking Modal */}
                                {showManualBooking && (
                                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 animate-fade-in-up overflow-y-auto max-h-[90vh]">
                                            <div className="flex items-center justify-between mb-6 border-b pb-4">
                                                <h3 className="text-xl font-bold text-slate-900">Add Manual / Offline Trip</h3>
                                                <button onClick={() => setShowManualBooking(false)} className="text-gray-400 hover:text-gray-600">
                                                    <X size={24} />
                                                </button>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Booking Type</label>
                                                    <div className="flex gap-4">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                checked={manualBookingForm.type === 'transfer'}
                                                                onChange={() => setManualBookingForm({ ...manualBookingForm, type: 'transfer' })}
                                                                className="text-slate-600 focus:ring-amber-500"
                                                            />
                                                            <span className="text-sm font-medium">Taxi Transfer</span>
                                                        </label>
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                checked={manualBookingForm.type === 'day-trip'}
                                                                onChange={() => setManualBookingForm({ ...manualBookingForm, type: 'day-trip' })}
                                                                className="text-slate-600 focus:ring-amber-500"
                                                            />
                                                            <span className="text-sm font-medium">Day Trip</span>
                                                        </label>
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                checked={manualBookingForm.type === 'tour'}
                                                                onChange={() => setManualBookingForm({ ...manualBookingForm, type: 'tour' })}
                                                                className="text-slate-600 focus:ring-amber-500"
                                                            />
                                                            <span className="text-sm font-medium">Tour Package</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                {(manualBookingForm.type === 'tour' || manualBookingForm.type === 'day-trip') && (
                                                    <div className="md:col-span-2">
                                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Package / Day Trip Title</label>
                                                        <input
                                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-600/20 outline-none text-sm"
                                                            value={manualBookingForm.tourDetails?.tourTitle || ''}
                                                            onChange={e => setManualBookingForm({
                                                                ...manualBookingForm,
                                                                tourDetails: { ...manualBookingForm.tourDetails, tourTitle: e.target.value }
                                                            })}
                                                            placeholder="e.g. 7 Days Sri Lanka Grand Tour or Kandy Day Trip"
                                                        />
                                                    </div>
                                                )}

                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Customer Name</label>
                                                    <input
                                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-600/20 outline-none text-sm"
                                                        value={manualBookingForm.customerName}
                                                        onChange={e => setManualBookingForm({ ...manualBookingForm, customerName: e.target.value })}
                                                        placeholder="John Doe"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                                                    <input
                                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-600/20 outline-none text-sm"
                                                        value={manualBookingForm.guestPhone}
                                                        onChange={e => setManualBookingForm({ ...manualBookingForm, guestPhone: e.target.value })}
                                                        placeholder="+94 77 XXX XXXX"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pickup Location</label>
                                                    <input
                                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-600/20 outline-none text-sm"
                                                        value={manualBookingForm.pickupLocation.address}
                                                        onChange={e => setManualBookingForm({ ...manualBookingForm, pickupLocation: { ...manualBookingForm.pickupLocation, address: e.target.value } })}
                                                        placeholder="Airport Terminal 1"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Dropoff Location</label>
                                                    <input
                                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-600/20 outline-none text-sm"
                                                        value={manualBookingForm.dropoffLocation.address}
                                                        onChange={e => setManualBookingForm({ ...manualBookingForm, dropoffLocation: { ...manualBookingForm.dropoffLocation, address: e.target.value } })}
                                                        placeholder="Hotel Name / City"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                                                    <input
                                                        type="date"
                                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-600/20 outline-none text-sm"
                                                        value={manualBookingForm.scheduledDate}
                                                        onChange={e => setManualBookingForm({ ...manualBookingForm, scheduledDate: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Time</label>
                                                    <input
                                                        type="time"
                                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-600/20 outline-none text-sm"
                                                        value={manualBookingForm.scheduledTime}
                                                        onChange={e => setManualBookingForm({ ...manualBookingForm, scheduledTime: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vehicle Type</label>
                                                    <select
                                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-600/20 outline-none text-sm bg-white"
                                                        value={manualBookingForm.vehicleType}
                                                        onChange={e => setManualBookingForm({ ...manualBookingForm, vehicleType: e.target.value })}
                                                    >
                                                        <option value="sedan">Sedan (Car)</option>
                                                        <option value="van">Van</option>
                                                        <option value="mini-van">Mini Van</option>
                                                        <option value="suv">SUV</option>
                                                        <option value="luxury">Luxury</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Distance (KM)</label>
                                                    <input
                                                        type="number"
                                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-600/20 outline-none text-sm"
                                                        value={manualBookingForm.distanceKm}
                                                        onChange={e => setManualBookingForm({ ...manualBookingForm, distanceKm: e.target.value })}
                                                        placeholder="100"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Price (LKR)</label>
                                                    <input
                                                        type="number"
                                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-600/20 outline-none text-sm"
                                                        value={manualBookingForm.totalPrice}
                                                        onChange={e => setManualBookingForm({ ...manualBookingForm, totalPrice: e.target.value })}
                                                        placeholder="15000"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Payment Method</label>
                                                    <select
                                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-600/20 outline-none text-sm bg-white"
                                                        value={manualBookingForm.paymentMethod}
                                                        onChange={e => setManualBookingForm({ ...manualBookingForm, paymentMethod: e.target.value })}
                                                    >
                                                        <option value="cash">Cash</option>
                                                        <option value="card">Card (Manual Swipe)</option>
                                                        <option value="online">Online Link</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="mt-8 flex justify-end gap-3 pt-6 border-t">
                                                <button
                                                    onClick={() => setShowManualBooking(false)}
                                                    className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    disabled={isSavingManual}
                                                    onClick={async () => {
                                                        setIsSavingManual(true)
                                                        try {
                                                            const res = await fetch('/api/bookings', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({ ...manualBookingForm, isManual: true })
                                                            })
                                                            if (res.ok) {
                                                                alert('Manual booking added successfully!')
                                                                setShowManualBooking(false)
                                                                // Refresh list
                                                                fetch('/api/bookings').then(r => r.json()).then(d => setBookings(d))
                                                            }
                                                        } catch (e) {
                                                            console.error(e)
                                                            alert('Failed to save manual booking')
                                                        } finally {
                                                            setIsSavingManual(false)
                                                        }
                                                    }}
                                                    className="px-8 py-2 bg-slate-600 text-white rounded-lg font-bold hover:bg-slate-700 shadow-lg shadow-amber-500/30 flex items-center gap-2"
                                                >
                                                    {isSavingManual ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                                                    Save Booking
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {filteredBookings.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400 bg-slate-50 rounded-lg border border-dashed">
                                        <p>No matching bookings found</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto custom-scrollbar">
                                        <table className="w-full text-left border-separate border-spacing-y-4">
                                            <thead>
                                                <tr className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
                                                    <th className="px-8 py-4">Protocol ID</th>
                                                    <th className="px-8 py-4">Target Entity</th>
                                                    <th className="px-8 py-4">Trajectory</th>
                                                    <th className="px-8 py-4">Temporal Data</th>
                                                    <th className="px-8 py-4">Vehicle</th>
                                                    <th className="px-8 py-4 text-right">Credit Value</th>
                                                    <th className="px-8 py-4">Transaction</th>
                                                    <th className="px-8 py-4">Operational Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredBookings.map((booking) => (
                                                    <tr
                                                        key={booking._id}
                                                        onClick={() => {
                                                            setSelectedBooking(booking)
                                                            setSelectedStatus(booking.status || 'pending')
                                                            setSelectedPaymentStatus(booking.paymentStatus || 'pending')
                                                            setSelectedDriver(booking.driver?._id || booking.driver || '')
                                                        }}
                                                        className="group bg-white/5 border border-white/10 hover:border-[#FFDA00]/30 transition-all cursor-pointer backdrop-blur-xl relative overflow-hidden"
                                                    >
                                                        <td className="px-8 py-6 font-black text-[10px] text-white/40 group-hover:text-[#FFDA00] transition-colors">
                                                            {booking._id?.slice(-8).toUpperCase() || 'N/A'}
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="font-black text-white uppercase italic tracking-tighter text-sm">{booking.customerName || booking.guestPhone || 'Guest'}</div>
                                                            <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-1">{booking.guestPhone}</div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            {booking.type === 'tour' && booking.tourDetails ? (
                                                                <div>
                                                                    <div className="font-black text-[#FFDA00] uppercase italic tracking-tighter text-xs">{booking.tourDetails.tourTitle}</div>
                                                                    <div className="text-[9px] text-white/40 font-bold uppercase tracking-widest">EXPEDITION</div>
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-1">
                                                                    <div className="text-[10px] font-black uppercase tracking-tight text-white/60 truncate max-w-[150px]">
                                                                        <span className="text-[#FFDA00] mr-2">●</span> {booking.pickupLocation?.address?.split(',')[0] || 'N/A'}
                                                                    </div>
                                                                    <div className="text-[10px] font-black uppercase tracking-tight text-white/40 truncate max-w-[150px]">
                                                                        <span className="text-red-500 mr-2">●</span> {booking.dropoffLocation?.address?.split(',')[0] || 'N/A'}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="font-black text-white text-xs uppercase tracking-widest">{booking.scheduledDate || 'Not set'}</div>
                                                            <div className="text-[9px] text-white/40 font-bold uppercase tracking-[0.2em] mt-1">{booking.scheduledTime || '--:--'}</div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="text-[10px] font-black uppercase text-white tracking-widest bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 w-fit">
                                                                {booking.vehicleType?.replace(/-/g, ' ') || 'N/A'}
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6 text-right font-black text-[#FFDA00] text-lg yellow-text-glow">
                                                            {formatPrice(booking)}
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-fit border ${booking.paymentStatus === 'paid' ? 'bg-[#FFDA00]/10 text-[#FFDA00] border-[#FFDA00]/20' :
                                                                booking.paymentStatus === 'pending' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                                                    'bg-white/5 text-white/40 border-white/10'
                                                                }`}>
                                                                <div className={`w-1.5 h-1.5 rounded-full ${booking.paymentStatus === 'paid' ? 'bg-[#FFDA00] animate-pulse' : 'bg-current'}`}></div>
                                                                {booking.paymentStatus || 'pending'}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 w-full border ${booking.status === 'completed' ? 'bg-[#FFDA00]/10 text-[#FFDA00] border-[#FFDA00]/20' :
                                                                booking.status === 'ongoing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                                    booking.status === 'pending' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                                        booking.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                                            'bg-white/5 text-white/40 border-white/10'
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
                                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4 md:p-8">
                                        <div className="group bg-[#050505] border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFDA00]/50 to-transparent"></div>

                                            <div className="flex items-center justify-between p-10 border-b border-white/5">
                                                <div>
                                                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter yellow-text-glow">Booking Intel</h3>
                                                    <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em] mt-2">Protocol ID: {selectedBooking._id}</p>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedBooking(null)}
                                                    className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 hover:text-[#FFDA00] transition-all border border-white/10"
                                                >
                                                    <X size={28} />
                                                </button>
                                            </div>

                                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {/* Customer Info */}
                                                <div className="bg-slate-50 p-6 rounded-xl space-y-4">
                                                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                                        <Users size={18} /> Customer Information
                                                    </h4>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <span className="text-xs text-gray-500 uppercase tracking-wider block">Name</span>
                                                            <span className="font-medium">{selectedBooking.customerName || selectedBooking.guestPhone || 'N/A'}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs text-gray-500 uppercase tracking-wider block">Phone</span>
                                                            <a href={`tel:${selectedBooking.guestPhone}`} className="font-medium text-slate-600 hover:underline flex items-center gap-1">
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
                                                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                                        <Car size={18} /> Journey Details
                                                    </h4>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <span className="text-xs text-gray-500 uppercase tracking-wider block">{selectedBooking.type === 'tour' ? 'Tour Details' : 'Route'}</span>
                                                            {selectedBooking.type === 'tour' && selectedBooking.tourDetails ? (
                                                                <div className="mt-1 space-y-1">
                                                                    <div className="font-bold text-slate-900">{selectedBooking.tourDetails.tourTitle}</div>
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
                                                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
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
                                                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                                        <CreditCard size={18} /> Payment & Status
                                                    </h4>
                                                    <div className="space-y-3">
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-xs text-gray-500 uppercase tracking-wider">Total Amount ({selectedBooking.currency || 'LKR'})</span>
                                                                <span className="text-xl font-bold text-slate-600">{formatPrice(selectedBooking)}</span>
                                                            </div>
                                                            {selectedBooking.paymentType === 'partial' && (
                                                                <>
                                                                    <div className="flex justify-between items-center text-xs">
                                                                        <span className="text-gray-500">Paid (Online)</span>
                                                                        <span className="font-bold text-slate-600">
                                                                            Rs {(selectedBooking.displayPaidAmount || selectedBooking.paidAmount || 0).toLocaleString()}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center text-xs">
                                                                        <span className="text-gray-500">Balance (to Driver)</span>
                                                                        <span className="font-bold text-orange-600">
                                                                            Rs {(selectedBooking.displayBalanceAmount || selectedBooking.balanceAmount || 0).toLocaleString()}
                                                                        </span>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4 pt-2">
                                                            <div>
                                                                <span className="text-xs text-gray-500 uppercase tracking-wider block">Method</span>
                                                                <span className="font-medium capitalize">{selectedBooking.paymentMethod}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs text-gray-500 uppercase tracking-wider block">Payment Status</span>
                                                                <select
                                                                    className={`mt-1 w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-slate-600 font-bold uppercase ${selectedPaymentStatus === 'paid' ? 'text-green-700' : 'text-orange-700'}`}
                                                                    value={selectedPaymentStatus}
                                                                    onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                                                                >
                                                                    <option value="pending">Pending</option>
                                                                    <option value="paid">Paid</option>
                                                                    <option value="cancelled">Cancelled</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs text-gray-500 uppercase tracking-wider block">Booking Status</span>
                                                            <select
                                                                className="mt-1 w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-slate-600"
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
                                                                className="mt-1 w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-slate-600"
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
                                                                    paymentStatus: selectedPaymentStatus,
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
                                                    className="px-8 py-2.5 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-all disabled:opacity-50 min-w-[140px] shadow-lg flex items-center justify-center gap-2"
                                                >
                                                    {updatingStatus ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                                    {updatingStatus ? 'Saving...' : 'Save Changes'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    }

                    {
                        currentView === 'communications' && (
                            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Mail className="text-slate-600" /> Email Center
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                                        <select
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-600/20 bg-white"
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
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-600/20"
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
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-600/20"
                                            placeholder="Important Update..."
                                            value={emailForm.subject}
                                            onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                        <textarea
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-600/20 h-48"
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
                                            className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-900/90 flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {sendingEmail ? <Loader2 className="animate-spin" /> : <Mail size={18} />}
                                            {sendingEmail ? 'Sending...' : 'Send Email'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {
                        currentView === 'support' && (
                            <div className="space-y-6">
                                {!selectedTicket ? (
                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Support Tickets</h2>
                                        {isLoading ? (
                                            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div></div>
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
                                                                <h3 className="font-bold text-slate-900">{ticket.subject}</h3>
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
                                            className="mb-4 text-gray-500 hover:text-slate-900 font-medium flex items-center gap-2"
                                        >
                                            ← Back to List
                                        </button>

                                        <div className="bg-white rounded-t-2xl shadow-sm p-6 border-b border-slate-100 flex justify-between items-start">
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-900 mb-1">{selectedTicket.subject}</h2>
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
                                                        ? 'bg-slate-900 text-white rounded-tr-none'
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
                                                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-600/20"
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
                                                    className="bg-slate-600 text-slate-900 p-3 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50"
                                                >
                                                    {sendingReply ? '...' : <div className="font-bold px-2">Send</div>}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    }

                    {
                        currentView === 'coupons' && (
                            <div className="p-8 space-y-12 animate-in fade-in duration-700">
                                {/* Header */}
                                <div className="flex flex-col gap-2 border-l-4 border-[#FFDA00] pl-6">
                                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Coupon Management</h2>
                                    <p className="text-[#FFDA00] font-bold text-xs uppercase tracking-widest">Create and manage promotional discount codes</p>
                                </div>

                                {/* Create New Coupon Card */}
                                <div className="bg-[#121212] border border-white/5 p-8 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFDA00]/5 blur-3xl rounded-full"></div>

                                    <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3 uppercase tracking-tighter">
                                        <div className="w-8 h-8 bg-[#FFDA00] flex items-center justify-center text-black">
                                            <Percent size={18} />
                                        </div>
                                        Create New Coupon
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-[#FFDA00] uppercase tracking-widest">Code</label>
                                            <input
                                                placeholder="e.g. GALLE10"
                                                value={newCoupon.code}
                                                onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                                className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-[#FFDA00] text-white font-black uppercase tracking-widest transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-[#FFDA00] uppercase tracking-widest">Type</label>
                                            <select
                                                value={newCoupon.discountType}
                                                onChange={e => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-[#FFDA00] text-white font-black uppercase tracking-widest transition-all appearance-none"
                                            >
                                                <option value="percentage" className="bg-[#121212]">Percentage (%)</option>
                                                <option value="flat" className="bg-[#121212]">Flat (Rs)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-[#FFDA00] uppercase tracking-widest">Value</label>
                                            <input
                                                type="number"
                                                placeholder="10"
                                                value={newCoupon.value}
                                                onChange={e => setNewCoupon({ ...newCoupon, value: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-[#FFDA00] text-white font-black uppercase tracking-widest transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-[#FFDA00] uppercase tracking-widest">Expiry Date</label>
                                            <input
                                                type="date"
                                                value={newCoupon.expiryDate}
                                                onChange={e => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-[#FFDA00] text-white font-black uppercase tracking-widest transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-[#FFDA00] uppercase tracking-widest">Description</label>
                                            <input
                                                placeholder="e.g. Get 10% off on your next trip to Galle"
                                                value={newCoupon.description}
                                                onChange={e => setNewCoupon({ ...newCoupon, description: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-[#22C55E] text-white font-black transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-[#FFDA00] uppercase tracking-widest">Target Location (Optional)</label>
                                            <input
                                                placeholder="e.g. Galle"
                                                value={newCoupon.locationsText || ''}
                                                onChange={e => setNewCoupon({ ...newCoupon, locationsText: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-[#22C55E] text-white font-black transition-all"
                                            />
                                        </div>
                                        <div className="flex items-end gap-6 pb-1">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setNewCoupon({ ...newCoupon, displayInWidget: !newCoupon.displayInWidget })}
                                                    className={`w-12 h-6 transition-all relative ${newCoupon.displayInWidget ? 'bg-[#FFDA00]' : 'bg-white/10'}`}
                                                >
                                                    <div className={`absolute top-1 w-4 h-4 bg-white transition-all ${newCoupon.displayInWidget ? 'left-7' : 'left-1'}`}></div>
                                                </button>
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Show in Widget</span>
                                            </div>
                                            <button
                                                onClick={handleAddCoupon}
                                                className="flex-1 bg-[#FFDA00] text-black font-black uppercase tracking-widest p-4 hover:bg-white transition-all shadow-lg shadow-[#FFDA00]/20"
                                            >
                                                + Create Coupon
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Coupons Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {coupons.map(c => (
                                        <div key={c._id} className="relative group bg-[#121212] border border-white/5 overflow-hidden transition-all hover:border-[#22C55E]/30">
                                            {/* Corner Decorative Element */}
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 -rotate-45 translate-x-8 -translate-y-8 group-hover:bg-[#22C55E]/10 transition-colors"></div>

                                            <div className="p-8">
                                                <div className="flex items-start justify-between mb-8">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="w-12 h-12 bg-white/5 flex items-center justify-center text-[#22C55E] border border-white/10 group-hover:border-[#22C55E]/30 transition-all">
                                                            <Percent size={24} />
                                                        </div>
                                                        <div className={`text-[9px] font-black uppercase px-2 py-1 self-start ${c.applicableLocations?.length > 0 ? 'bg-[#FFDA00]/10 text-[#FFDA00] border border-[#FFDA00]/20' : 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20'}`}>
                                                            {c.applicableLocations?.length > 0 ? 'Local' : 'Global'}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteCoupon(c._id)}
                                                        className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>

                                                <div className="mb-4">
                                                    <div className="text-sm font-black text-[#FFDA00] uppercase tracking-widest mb-1">{c.code}</div>
                                                    <div className="text-4xl font-black text-white tracking-tighter">
                                                        {c.discountType === 'flat' ? 'Rs ' : ''}{c.value}{c.discountType === 'percentage' ? '%' : ''}
                                                        <span className="text-xs font-bold text-white/40 block mt-1 uppercase">OFF TOTAL</span>
                                                    </div>
                                                </div>

                                                <div className="pt-6 border-t border-white/5 space-y-3">
                                                    <p className="text-xs text-white/60 font-medium leading-relaxed">{c.description || 'No description provided'}</p>

                                                    <div className="flex flex-wrap gap-2 pt-2">
                                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1">
                                                            <Calendar size={10} />
                                                            EXP: {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : 'NEVER'}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1">
                                                            <Activity size={10} />
                                                            USED: {c.usageCount || 0}
                                                        </div>
                                                    </div>

                                                    {c.displayInWidget && (
                                                        <div className="text-[10px] font-black text-[#22C55E] uppercase tracking-widest flex items-center gap-2 pt-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></div>
                                                            Active in widget
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Bottom Progress Bar Decor */}
                                            <div className="absolute bottom-0 left-0 h-1 bg-white/5 w-full">
                                                <div className="h-full bg-[#22C55E] transition-all group-hover:w-full" style={{ width: '40%' }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {coupons.length === 0 && (
                                    <div className="bg-[#121212] border border-white/5 p-16 text-center">
                                        <div className="w-20 h-20 bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10">
                                            <Percent className="text-white/20" size={32} />
                                        </div>
                                        <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">No Coupons Active</h3>
                                        <p className="text-[#FFDA00] font-bold text-xs uppercase tracking-widest">Create your first coupon above to start offering discounts</p>
                                    </div>
                                )}
                            </div>
                        )
                    }

                    {/* Reviews Management */}
                    {
                        currentView === 'reviews' && (
                            <ReviewsManagement />
                        )
                    }

                    {/* Drivers Fleet View */}
                    {currentView === 'drivers' && <DriversFleetView />}
                    {/* Live Driver Map */}
                    {currentView === 'live-map' && <LiveDriverMap />}
                </div>
            </main>
        </div>
    );
}
