'use client';

import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import { Car, Navigation } from 'lucide-react';

const libraries = ['places'];

const TrackingMap = ({ pickup, dropoff, driverId }) => {
    const [directions, setDirections] = useState(null);
    const [driverLocation, setDriverLocation] = useState(null);
    const [driverData, setDriverData] = useState(null); // Name, Plate

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries
    });

    // 1. Calculate Route
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
                } else {
                    console.error("Directions Failed:", status);
                }
            });
        }
    }, [isLoaded, pickup, dropoff]);

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

    if (!isLoaded) return <div className="w-full h-64 bg-slate-100 animate-pulse rounded-none border-4 border-black flex items-center justify-center font-black italic uppercase tracking-widest text-[10px]">Loading Map...</div>;

    return (
        <div className="space-y-4">
            <div className="w-full h-[400px] rounded-none overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
                <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={pickup?.lat ? { lat: pickup.lat, lng: pickup.lng } : { lat: 7.8731, lng: 80.7718 }}
                    zoom={12}
                    options={{ disableDefaultUI: false }}
                >
                    {directions && <DirectionsRenderer directions={directions} options={{ suppressMarkers: false }} />}

                    {/* Driver Marker */}
                    {driverLocation && (
                        <Marker
                            position={driverLocation}
                            icon={{
                                path: "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z",
                                fillColor: "#000000",
                                fillOpacity: 1,
                                strokeWeight: 2,
                                strokeColor: "#FACC15",
                                scale: 2,
                            }}
                            title="Your Driver"
                        />
                    )}
                </GoogleMap>
                {!driverId && (
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur-md p-3 rounded-none border-2 border-black text-[10px] text-center font-black uppercase tracking-widest text-black dark:text-[#FACC15] italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        Driver will appear on map once assigned.
                    </div>
                )}
            </div>

            {/* Driver Info under Map */}
            {driverData && (
                <div className="bg-[#FACC15] border-4 border-black p-4 rounded-none flex items-center justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-fade-in">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black rounded-none border-2 border-black flex items-center justify-center text-[#FACC15] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-xl italic">
                            {driverData.name?.charAt(0)}
                        </div>
                        <div>
                            <p className="text-[10px] text-black/60 font-black uppercase tracking-widest italic leading-none mb-1">Your Driver</p>
                            <p className="text-black font-black text-xl uppercase italic leading-tight">{driverData.name}</p>
                            <p className="text-[12px] text-black/80 font-bold uppercase tracking-tighter">{driverData.vehicleNumber}</p>
                        </div>
                    </div>
                    <span className="bg-black text-[#FACC15] text-[10px] uppercase font-black px-3 py-1.5 border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse italic">Live Tracking</span>
                </div>
            )}
        </div>
    );
};

export default TrackingMap;
