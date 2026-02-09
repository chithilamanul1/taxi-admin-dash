'use client';

import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsScript } from '@/lib/google-maps';

export default function TripMap({ pickup, dropoff, waypoints, onRouteCalculated }) {
    const mapRef = useRef(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [directionsService, setDirectionsService] = useState(null);
    const [mapInitialized, setMapInitialized] = useState(false);
    const [googleLoaded, setGoogleLoaded] = useState(false);

    // 1. Load Google Maps Script
    useEffect(() => {
        loadGoogleMapsScript().then(() => {
            setGoogleLoaded(true);
        }).catch(err => console.error("TripMap: Failed to load Google Maps script", err));
    }, []);

    // 2. Initialize Map once script is loaded and ref is ready
    useEffect(() => {
        if (!googleLoaded || !mapRef.current || mapInitialized) return;

        console.log("TripMap: Initializing Map...");
        try {
            const map = new window.google.maps.Map(mapRef.current, {
                zoom: 7,
                center: { lat: 7.8731, lng: 80.7718 }, // Sri Lanka Center
                disableDefaultUI: true,
                zoomControl: true,
                styles: [
                    {
                        "featureType": "poi",
                        "elementType": "labels",
                        "stylers": [{ "visibility": "off" }]
                    }
                ]
            });

            const dr = new window.google.maps.DirectionsRenderer({
                map,
                suppressMarkers: false,
                polylineOptions: {
                    strokeColor: '#059669', // Emerald 600
                    strokeWeight: 5
                }
            });

            setDirectionsRenderer(dr);
            setDirectionsService(new window.google.maps.DirectionsService());
            setMapInitialized(true);
            console.log("TripMap: Map Initialized successfully.");
        } catch (error) {
            console.error("TripMap: Error initializing map:", error);
        }
    }, [googleLoaded, mapInitialized]);

    // 3. Calculate Route when dependencies change
    useEffect(() => {
        if (!directionsService || !directionsRenderer) return;

        // Only calculate if we have both points
        const hasStart = pickup?.lat != null && pickup?.lon != null;
        const hasEnd = dropoff?.lat != null && dropoff?.lon != null;

        if (hasStart && hasEnd) {
            const origin = { lat: parseFloat(pickup.lat), lng: parseFloat(pickup.lon) };
            const destination = { lat: parseFloat(dropoff.lat), lng: parseFloat(dropoff.lon) };

            // Convert waypoints
            const waypointsList = (waypoints || [])
                .filter(w => w.lat != null && w.lon != null)
                .map(wp => ({
                    location: { lat: parseFloat(wp.lat), lng: parseFloat(wp.lon) },
                    stopover: true
                }));

            console.log('TripMap: Requesting route', { origin, destination, waypointsCount: waypointsList.length });

            directionsService.route(
                {
                    origin,
                    destination,
                    waypoints: waypointsList,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        directionsRenderer.setDirections(result);

                        // Extract distance/duration
                        const route = result.routes[0];
                        if (route && route.legs) {
                            let totalDistanceMeters = 0;
                            let totalDurationSeconds = 0;

                            route.legs.forEach(leg => {
                                totalDistanceMeters += leg.distance.value;
                                totalDurationSeconds += leg.duration.value;
                            });

                            const distKm = totalDistanceMeters / 1000;
                            const durMin = Math.round(totalDurationSeconds / 60);

                            console.log(`TripMap: Route calculated: ${distKm.toFixed(1)} km, ${durMin} min`);

                            if (onRouteCalculated) {
                                onRouteCalculated({
                                    distanceKm: distKm,
                                    durationMin: durMin
                                });
                            }
                        }
                    } else {
                        console.warn(`TripMap: Directions request failed: ${status}`);
                    }
                }
            );
        } else {
            console.log("TripMap: Waiting for coordinates...", { hasStart, hasEnd });
        }
    }, [
        pickup?.lat, pickup?.lon,
        dropoff?.lat, dropoff?.lon,
        JSON.stringify(waypoints),
        directionsService, directionsRenderer, onRouteCalculated
    ]);

    return (
        <div className="w-full h-full min-h-[300px] relative rounded-2xl overflow-hidden bg-slate-100">
            <div ref={mapRef} className="w-full h-full" />
            {!mapInitialized && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 backdrop-blur-[2px] z-10">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs font-bold text-emerald-900/40 uppercase tracking-widest">Loading Map...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
