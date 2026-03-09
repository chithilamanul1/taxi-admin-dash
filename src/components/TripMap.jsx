'use client';

import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsScript } from '@/lib/google-maps';

/**
 * TripMap component that handles Google Maps route visualization.
 * Supports both direct coordinates (lat, lon) and geocoding place names.
 */
export default function TripMap({ pickup, dropoff, waypoints = [], onRouteCalculated }) {
    const mapRef = useRef(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [directionsService, setDirectionsService] = useState(null);
    const [geocoder, setGeocoder] = useState(null);
    const [mapInitialized, setMapInitialized] = useState(false);
    const [googleLoaded, setGoogleLoaded] = useState(false);
    const [error, setError] = useState(null);
    const markersRef = useRef([]);

    const [resolvedPickup, setResolvedPickup] = useState(null);
    const [resolvedDropoff, setResolvedDropoff] = useState(null);
    const [resolvedWaypoints, setResolvedWaypoints] = useState([]);

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
            setError("Failed to load Maps API");
        });
    }, []);

    // 2. Initialize Map components
    useEffect(() => {
        if (!googleLoaded || !mapRef.current || mapInitialized) return;

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
                suppressMarkers: true,
                polylineOptions: {
                    strokeColor: '#10B981', // Emerald 500
                    strokeWeight: 6,
                    strokeOpacity: 0.8
                }
            });

            setDirectionsRenderer(dr);
            setDirectionsService(new window.google.maps.DirectionsService());
            setGeocoder(new window.google.maps.Geocoder());
            setMapInitialized(true);
        } catch (error) {
            console.error("TripMap: Error initializing map:", error);
            setError("Map Init Error");
        }
    }, [googleLoaded, mapInitialized]);

    // 3. Geocode and Resolve Points
    useEffect(() => {
        if (!mapInitialized || !geocoder) return;

        const geocodePoint = async (point) => {
            if (!point) return null;
            if (point.lat != null && point.lon != null) {
                return { lat: parseFloat(point.lat), lng: parseFloat(point.lon), name: point.name };
            }
            if (!point.name) return null;

            // Try to geocode the name
            return new Promise((resolve) => {
                // Add "Sri Lanka" to the search for better accuracy
                const searchQuery = point.name.toLowerCase().includes('sri lanka')
                    ? point.name
                    : `${point.name}, Sri Lanka`;

                geocoder.geocode({ address: searchQuery }, (results, status) => {
                    if (status === 'OK' && results[0]) {
                        const loc = results[0].geometry.location;
                        resolve({ lat: loc.lat(), lng: loc.lng(), name: point.name });
                    } else {
                        console.warn(`TripMap: Geocoding failed for "${point.name}": ${status}`);
                        resolve(null);
                    }
                });
            });
        };

        const resolveAll = async () => {
            const p = await geocodePoint(pickup);
            const d = await geocodePoint(dropoff);
            const w = await Promise.all(waypoints.map(wp => geocodePoint(wp)));

            setResolvedPickup(p);
            setResolvedDropoff(d);
            setResolvedWaypoints(w.filter(item => item !== null));
        };

        resolveAll();
    }, [pickup, dropoff, waypoints, mapInitialized, geocoder]);

    // 4. Render Markers and Calculate Route
    useEffect(() => {
        if (!mapInitialized || !directionsService || !directionsRenderer) return;

        clearMarkers();
        const map = directionsRenderer.getMap();
        const bounds = new window.google.maps.LatLngBounds();
        let pointsToDisplay = 0;

        // Add Markers
        if (resolvedPickup) {
            const m = new window.google.maps.Marker({
                position: resolvedPickup,
                map,
                label: { text: 'P', color: 'white', fontWeight: 'bold' },
                title: resolvedPickup.name || 'Pickup',
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    fillColor: '#10B981',
                    fillOpacity: 1,
                    strokeColor: 'white',
                    strokeWeight: 2,
                    scale: 12
                }
            });
            markersRef.current.push(m);
            bounds.extend(resolvedPickup);
            pointsToDisplay++;
        }

        resolvedWaypoints.forEach((wp, i) => {
            const m = new window.google.maps.Marker({
                position: wp,
                map,
                label: { text: (i + 1).toString(), color: 'white', fontWeight: 'bold' },
                title: wp.name || `Stop ${i + 1}`,
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    fillColor: '#3B82F6', // Blue 500
                    fillOpacity: 1,
                    strokeColor: 'white',
                    strokeWeight: 2,
                    scale: 10
                }
            });
            markersRef.current.push(m);
            bounds.extend(wp);
            pointsToDisplay++;
        });

        if (resolvedDropoff) {
            const m = new window.google.maps.Marker({
                position: resolvedDropoff,
                map,
                label: { text: 'D', color: 'white', fontWeight: 'bold' },
                title: resolvedDropoff.name || 'Dropoff',
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    fillColor: '#EF4444', // Red 500
                    fillOpacity: 1,
                    strokeColor: 'white',
                    strokeWeight: 2,
                    scale: 12
                }
            });
            markersRef.current.push(m);
            bounds.extend(resolvedDropoff);
            pointsToDisplay++;
        }

        // Adjust Viewport
        if (pointsToDisplay > 0) {
            map.fitBounds(bounds);
            if (pointsToDisplay === 1) map.setZoom(12);
        }

        // Calculate Route
        if (resolvedPickup && resolvedDropoff) {
            const waypointsList = resolvedWaypoints.map(wp => ({
                location: wp,
                stopover: true
            }));

            directionsService.route(
                {
                    origin: resolvedPickup,
                    destination: resolvedDropoff,
                    waypoints: waypointsList,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === 'OK') {
                        directionsRenderer.setDirections(result);
                        const route = result.routes[0];
                        let dist = 0, dur = 0;
                        route.legs.forEach(leg => {
                            dist += leg.distance.value;
                            dur += leg.duration.value;
                        });
                        if (onRouteCalculated) {
                            onRouteCalculated({
                                distanceKm: Math.round(dist / 100) / 10,
                                durationHrs: Math.round(dur / 360) / 10
                            });
                        }
                    } else {
                        console.error("TripMap: Route failed:", status);
                        setError("Could not calculate driving route");
                    }
                }
            );
        }
    }, [resolvedPickup, resolvedDropoff, resolvedWaypoints, directionsService, directionsRenderer, mapInitialized]);

    return (
        <div className="w-full h-full min-h-[300px] relative">
            <div ref={mapRef} className="w-full h-full" />

            {error && (
                <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-sm border border-rose-100 p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3">
                    <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white font-black text-lg">!</div>
                    <div>
                        <p className="text-emerald-950 font-black text-xs uppercase tracking-tight">{error}</p>
                        <p className="text-[10px] text-slate-500">The map could not load the full route.</p>
                    </div>
                </div>
            )}

            {!mapInitialized && (
                <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center gap-4 z-10">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Interactive Map...</p>
                </div>
            )}
        </div>
    );
}
