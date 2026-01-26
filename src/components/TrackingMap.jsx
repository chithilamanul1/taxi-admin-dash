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

    // 2. Poll Driver Location
    useEffect(() => {
        if (!driverId) return;

        const fetchDriver = async () => {
            try {
                // Fetch all for now (optimize later)
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
                console.error("Driver Poll Error:", err);
            }
        };

        fetchDriver();
        const interval = setInterval(fetchDriver, 10000); // 10s Poll
        return () => clearInterval(interval);
    }, [driverId]);

    if (!isLoaded) return <div className="w-full h-64 bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center">Loading Map...</div>;

    return (
        <div className="space-y-4">
            <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-emerald-900/10 shadow-lg relative">
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
                                fillColor: "#10b981",
                                fillOpacity: 1,
                                strokeWeight: 1,
                                strokeColor: "#ffffff",
                                scale: 2,
                            }}
                            title="Your Driver"
                        />
                    )}
                </GoogleMap>
                {!driverId && (
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-xl border border-emerald-900/10 text-sm text-center font-bold text-slate-500">
                        Driver will appear on map once assigned.
                    </div>
                )}
            </div>

            {/* Driver Info under Map */}
            {driverData && (
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center justify-between animate-fade-in">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm font-bold text-lg">
                            {driverData.name?.charAt(0)}
                        </div>
                        <div>
                            <p className="text-xs text-emerald-900/50 font-bold uppercase tracking-wider">Your Driver</p>
                            <p className="text-emerald-900 font-bold text-lg">{driverData.name}</p>
                            <p className="text-sm text-emerald-700">{driverData.vehicleNumber}</p>
                        </div>
                    </div>
                    <span className="bg-green-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded animate-pulse">Live</span>
                </div>
            )}
        </div>
    );
};

export default TrackingMap;
