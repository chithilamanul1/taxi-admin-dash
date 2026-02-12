'use client';

import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Loader2 } from 'lucide-react';

const PushNotificationManager = () => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscription, setSubscription] = useState(null);
    const [registration, setRegistration] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.workbox !== undefined) {
            // run only in browser
            navigator.serviceWorker.ready.then(reg => {
                setRegistration(reg);
                reg.pushManager.getSubscription().then(sub => {
                    if (sub && !(sub.expirationTime && Date.now() > sub.expirationTime)) {
                        setSubscription(sub);
                        setIsSubscribed(true);
                    }
                });
            });
        }
    }, []);

    const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const subscribeToPush = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/push/key');
            const { publicKey } = await response.json();

            const convertedVapidKey = urlBase64ToUint8Array(publicKey);

            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
            });

            // Send subscription to backend
            await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sub)
            });

            setSubscription(sub);
            setIsSubscribed(true);
            alert('Notifications Enabled! You will now receive booking alerts.');
        } catch (error) {
            console.error('Subscription failed:', error);
            alert('Failed to enable notifications. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!registration) return null; // Don't show if SW not ready/supported

    return (
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Booking Alerts</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Receive notifications even when app is closed</p>
                </div>
                <button
                    onClick={isSubscribed ? () => { } : subscribeToPush}
                    disabled={isSubscribed || loading}
                    className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${isSubscribed
                            ? 'bg-emerald-100 text-emerald-700 cursor-default'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : (isSubscribed ? <Bell size={14} /> : <BellOff size={14} />)}
                    {isSubscribed ? 'Active' : 'Enable'}
                </button>
            </div>
        </div>
    );
};

export default PushNotificationManager;
