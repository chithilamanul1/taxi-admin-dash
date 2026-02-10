'use client';

import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsScript } from '@/lib/google-maps';

export default function TripMap({ pickup, dropoff, waypoints, onRouteCalculated }) {
    const mapRef = useRef(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [directionsService, setDirectionsService] = useState(null);
    const [mapInitialized, setMapInitialized] = useState(false);
    const [googleLoaded, setGoogleLoaded] = useState(false);
    const [error, setError] = useState(null);
    const markersRef = useRef([]);

    const clearMarkers = () => {
        markersRef.current.forEach(m => m.setMap(null));
        markersRef.current = [];
    };

    // 1. Load Google Maps Script
    useEffect(() => {
        loadGoogleMapsScript().then(() => {
            setGoogleLoaded(true);
        }).catch(err => {
            console.error("TripMap: Failed to load Google Maps script", err);
            setError("Failed to load Maps");
        });
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
                suppressMarkers: true, // We handle markers manually for better control
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
            setError("Map Init Error");
        }
    }, [googleLoaded, mapInitialized]);

    // 3. Markers & Route Calculation
    useEffect(() => {
        if (!mapInitialized || !directionsService || !directionsRenderer) return;

        const hasStart = pickup?.lat != null && pickup?.lon != null;
        const hasEnd = dropoff?.lat != null && dropoff?.lon != null;

        setError(null);
        clearMarkers();

        // Add Standalone Markers
        const map = directionsRenderer.getMap();
        const bounds = new window.google.maps.LatLngBounds();
        let markersAdded = 0;

        if (hasStart) {
            const m = new window.google.maps.Marker({
                position: { lat: parseFloat(pickup.lat), lng: parseFloat(pickup.lon) },
                map,
                label: 'A',
                title: 'Pickup'
            });
            markersRef.current.push(m);
            bounds.extend(m.getPosition());
            markersAdded++;
        }

        (waypoints || []).forEach((wp, i) => {
            if (wp.lat != null && wp.lon != null) {
                const m = new window.google.maps.Marker({
                    position: { lat: parseFloat(wp.lat), lng: parseFloat(wp.lon) },
                    map,
                    label: (i + 1).toString(),
                    title: `Stop ${i + 1}`,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                });
                markersRef.current.push(m);
                bounds.extend(m.getPosition());
                markersAdded++;
            }
        });

        if (hasEnd) {
            const m = new window.google.maps.Marker({
                position: { lat: parseFloat(dropoff.lat), lng: parseFloat(dropoff.lon) },
                map,
                label: 'B',
                title: 'Dropoff',
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            });
            markersRef.current.push(m);
            bounds.extend(m.getPosition());
            markersAdded++;
        }

        // Adjust Viewport if markers exist but no route yet
        if (markersAdded > 0 && !(hasStart && hasEnd)) {
            map.fitBounds(bounds);
            if (markersAdded === 1) map.setZoom(13);
        }

        // Calculate Route if both points exist
        if (hasStart && hasEnd) {
            const origin = { lat: parseFloat(pickup.lat), lng: parseFloat(pickup.lon) };
            const destination = { lat: parseFloat(dropoff.lat), lng: parseFloat(dropoff.lon) };

            const waypointsList = (waypoints || [])
                .filter(w => w.lat != null && w.lon != null)
                .map(wp => ({
                    location: { lat: parseFloat(wp.lat), lng: parseFloat(wp.lon) },
                    stopover: true
                }));

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
                            if (onRouteCalculated) onRouteCalculated({ distanceKm: distKm, durationMin: durMin });
                        }
                    } else {
                        console.warn(`TripMap: Directions request failed: ${status}`);
                        setError(`Route Error: ${status}`);
                        if (onRouteCalculated) onRouteCalculated({ distanceKm: 0, durationMin: 0 });
                    }
                }
            );
        }
    }, [
        pickup?.lat, pickup?.lon,
        dropoff?.lat, dropoff?.lon,
        JSON.stringify(waypoints),
        directionsService, directionsRenderer, mapInitialized, onRouteCalculated
    ]);

    return (
        <div className="w-full h-full min-h-[300px] relative rounded-2xl overflow-hidden bg-slate-100">
            <div ref={mapRef} className="w-full h-full" />

            {/* Error Overlay */}
            {error && (
                <div className="absolute top-2 left-2 right-2 bg-red-100 border border-red-500 text-red-700 px-3 py-2 rounded-lg text-xs font-bold z-20 text-center">
                    {error} <br />
                    <span className="font-normal opacity-80">(Check Console/API Key)</span>
                </div>
            )}

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
