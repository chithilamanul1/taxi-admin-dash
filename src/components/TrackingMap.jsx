'use client';

import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import { Car, Navigation } from 'lucide-react';

const libraries = ['places'];

const TrackingMap = ({ pickup, dropoff, driverId }) => {
    const [directions, setDirections] = useState(null);
    const [driverLocation, setDriverLocation] = useState(null);
    const [driverData, setDriverData] = useState(null); // Name, Plate
    const [eta, setEta] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries
    });

    // 1. Calculate Route & ETA
    useEffect(() => {
        if (isLoaded && pickup?.lat && dropoff?.lat) {
            const directionsService = new window.google.maps.DirectionsService();

            directionsService.route({
                origin: { lat: pickup.lat, lng: pickup.lng },
                destination: { lat: dropoff.lat, lng: dropoff.lng },
                travelMode: window.google.maps.TravelMode.DRIVING,
            }, (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                    // Extract duration for ETA
                    if (result.routes[0]?.legs[0]) {
                        setEta(result.routes[0].legs[0].duration.text);
                    }
                } else {
                    console.error("Directions Failed:", status);
                }
            });
        }
    }, [isLoaded, pickup, dropoff]);

    // Calculate Driver ETA to Pickup if driver is far
    useEffect(() => {
        if (isLoaded && driverLocation && pickup?.lat && !directions?.routes[0]?.legs[0]?.start_address?.includes(driverLocation.lat)) {
            const service = new window.google.maps.DistanceMatrixService();
            service.getDistanceMatrix({
                origins: [driverLocation],
                destinations: [{ lat: pickup.lat, lng: pickup.lng }],
                travelMode: window.google.maps.TravelMode.DRIVING,
            }, (response, status) => {
                if (status === 'OK' && response.rows[0].elements[0].duration) {
                    // This is ETA to pickup
                    console.log("Driver ETA to Pickup:", response.rows[0].elements[0].duration.text);
                }
            });
        }
    }, [isLoaded, driverLocation, pickup, directions]);

    // 2. Real-time Driver Tracking with Pusher
    useEffect(() => {
        if (!driverId) return;

        // Initial Fetch
        const fetchInitialDriver = async () => {
            try {
                const res = await fetch('/api/drivers');
                const drivers = await res.json();
                const matched = drivers.find(d => d._id === driverId || d.user?._id === driverId);
                if (matched) {
                    setDriverData(matched);
                    if (matched.currentLocation?.lat) {
                        setDriverLocation({
                            lat: matched.currentLocation.lat,
                            lng: matched.currentLocation.lng
                        });
                        setLastUpdate(new Date());
                    }
                }
            } catch (err) {
                console.error("Initial Driver Fetch Error:", err);
            }
        };
        fetchInitialDriver();

        // Pusher Real-time Subscription
        let pusher;
        let channel;

        try {
            // Import pusher-js dynamically to avoid SSR issues if any
            const Pusher = require('pusher-js');
            pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
                cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
            });

            channel = pusher.subscribe(`driver-${driverId}`);
            channel.bind('location-update', (data) => {
                if (data.lat && data.lng) {
                    setDriverLocation({ lat: data.lat, lng: data.lng });
                    setLastUpdate(new Date());
                }
            });
        } catch (err) {
            console.error("Pusher Client Error:", err);
        }

        return () => {
            if (channel) channel.unbind_all();
            if (pusher) pusher.unsubscribe(`driver-${driverId}`);
        };
    }, [driverId]);

    if (!isLoaded) return <div className="w-full h-64 bg-slate-50 animate-pulse rounded-2xl flex items-center justify-center font-bold uppercase tracking-widest text-[10px] text-slate-400">Loading Map...</div>;

    return (
        <div className="space-y-0 relative">
            <div className="w-full h-[400px] rounded-t-2xl overflow-hidden relative">
                <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={driverLocation || (pickup?.lat ? { lat: pickup.lat, lng: pickup.lng } : { lat: 7.8731, lng: 80.7718 })}
                    zoom={15}
                    options={{ disableDefaultUI: true, zoomControl: true, styles: [/* Optional custom map styles */] }}
                >
                    {directions && <DirectionsRenderer directions={directions} options={{ suppressMarkers: false, polylineOptions: { strokeColor: '#10b981', strokeOpacity: 0.8, strokeWeight: 5 } }} />}

                    {/* Driver Marker - MORE PROMINENT */}
                    {driverLocation && (
                        <Marker
                            position={driverLocation}
                            icon={{
                                path: "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z",
                                fillColor: "#10b981",
                                fillOpacity: 1,
                                strokeWeight: 2,
                                strokeColor: "#ffffff",
                                scale: 2.5,
                                anchor: new window.google.maps.Point(12, 12)
                            }}
                            title="Your Live Chauffeur"
                        />
                    )}
                </GoogleMap>
                {/* Decorative Background Block */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full -mr-36 -mt-36 blur-3xl pointer-events-none"></div>
                {/* Overlay Indicators */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {driverId && (
                        <div className="bg-emerald-500 text-white px-4 py-2 rounded-full shadow-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                            LIVE TRACKING ACTIVE
                        </div>
                    )}
                    {eta && (
                        <div className="bg-white text-slate-800 px-4 py-2 rounded-full shadow-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            <Navigation size={14} className="text-emerald-500" />
                            EST. JOURNEY: {eta}
                        </div>
                    )}
                </div>

                {!driverId && (
                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 p-3 rounded-xl shadow-lg border border-slate-100 text-[10px] text-center font-bold uppercase tracking-widest text-slate-600 backdrop-blur-sm">
                        Driver will appear on map once assigned.
                    </div>
                )}
            </div>

            {/* Driver Info under Map */}
            {driverData && (
                <div className="bg-slate-900 p-5 rounded-b-2xl flex items-center justify-between animate-fade-in shadow-inner border-t border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-emerald-400 font-black text-xl border border-slate-700">
                            {driverData.name?.charAt(0)}
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Live Chauffeur Status</p>
                            <p className="text-white font-bold text-xl uppercase leading-tight">{driverData.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-2 py-0.5 rounded-md font-mono border border-emerald-500/20">{driverData.vehicleNumber}</span>
                                {lastUpdate && <span className="text-[8px] font-bold text-slate-500 uppercase">Updated {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="bg-emerald-500 text-white text-[9px] uppercase font-bold px-3 py-1.5 rounded-full shadow-sm">Active Now</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackingMap;
