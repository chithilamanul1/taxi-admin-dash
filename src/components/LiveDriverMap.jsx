'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Navigation, RefreshCw, Wifi, WifiOff, Car, User, Clock } from 'lucide-react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const LiveDriverMap = () => {
    const [drivers, setDrivers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [selectedDriver, setSelectedDriver] = useState(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    })

    const fetchDrivers = useCallback(async () => {
        try {
            const res = await fetch('/api/drivers');
            const data = await res.json();
            if (Array.isArray(data)) {
                setDrivers(data);
            }
            setLastRefresh(new Date());
        } catch (error) {
            console.error('Failed to fetch drivers:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial fetch and auto-refresh
    useEffect(() => {
        fetchDrivers();

        if (autoRefresh) {
            const interval = setInterval(fetchDrivers, 15000); // Refresh every 15 seconds
            return () => clearInterval(interval);
        }
    }, [autoRefresh, fetchDrivers]);

    const onlineDrivers = drivers.filter(d => d.isOnline);
    const offlineDrivers = drivers.filter(d => !d.isOnline);

    const mapCenter = { lat: 7.8731, lng: 80.7718 }; // Sri Lanka Center
    const colomboCenter = { lat: 6.9271, lng: 79.8612 };

    const openInGoogleMaps = (lat, lng) => {
        window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="animate-spin text-emerald-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-emerald-900 dark:text-white">Live Driver Tracking</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Last updated: {lastRefresh.toLocaleTimeString()}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Auto Refresh Toggle */}
                    <button
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${autoRefresh
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                    >
                        <RefreshCw size={16} className={autoRefresh ? 'animate-spin' : ''} />
                        Auto Refresh {autoRefresh ? 'ON' : 'OFF'}
                    </button>
                    {/* Manual Refresh */}
                    <button
                        onClick={fetchDrivers}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                    >
                        Refresh Now
                    </button>
                </div>
            </div>

            {/* Google Map View */}
            <div className="w-full h-[400px] bg-slate-100 rounded-3xl overflow-hidden border border-emerald-900/10 relative">
                {isLoaded ? (
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={colomboCenter}
                        zoom={9}
                        options={{
                            disableDefaultUI: false,
                            styles: [
                                { "featureType": "poi", "stylers": [{ "visibility": "off" }] }
                            ]
                        }}
                    >
                        {onlineDrivers.map(driver => (
                            driver.currentLocation && driver.currentLocation.lat && (
                                <Marker
                                    key={driver._id}
                                    position={{ lat: driver.currentLocation.lat, lng: driver.currentLocation.lng }}
                                    title={driver.name}
                                    icon={{
                                        path: "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z",
                                        fillColor: "#10b981",
                                        fillOpacity: 1,
                                        strokeWeight: 1,
                                        strokeColor: "#ffffff",
                                        scale: 1.5,
                                    }}
                                    onClick={() => setSelectedDriver(driver)}
                                />
                            )
                        ))}
                    </GoogleMap>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-500">
                        Loading Map... (Requires API Key)
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                            <User size={20} className="text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-emerald-900 dark:text-white">{drivers.length}</p>
                            <p className="text-xs text-slate-500">Total Drivers</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                            <Wifi size={20} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-600">{onlineDrivers.length}</p>
                            <p className="text-xs text-slate-500">Online Now</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                            <WifiOff size={20} className="text-slate-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">{offlineDrivers.length}</p>
                            <p className="text-xs text-slate-500">Offline</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Driver List (Online) */}
            {onlineDrivers.map(driver => (
                <div key={driver._id} className="bg-white p-4 border rounded-xl mb-2 flex justify-between shadow-sm">
                    <div>
                        <p className="font-bold">{driver.name}</p>
                        <p className="text-xs text-gray-500">{driver.vehicleNumber}</p>
                    </div>
                    {driver.currentLocation && (
                        <button onClick={() => openInGoogleMaps(driver.currentLocation.lat, driver.currentLocation.lng)} className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg">
                            View Link
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default LiveDriverMap;
