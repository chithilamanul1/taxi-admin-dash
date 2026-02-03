'use client';

import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsScript } from '@/lib/google-maps';

export default function TripMap({ pickup, dropoff, waypoints, onRouteCalculated }) {
    const mapRef = useRef(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [directionsService, setDirectionsService] = useState(null);
    const [mapInitialized, setMapInitialized] = useState(false);

    // Initialize map when coordinates are available and ref exists
    useEffect(() => {
        if (!pickup?.lat || !dropoff?.lat || mapInitialized) return;

        loadGoogleMapsScript().then(() => {
            if (window.google && mapRef.current && !directionsRenderer) {
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
            }
        });
    }, [pickup?.lat, dropoff?.lat, mapInitialized, directionsRenderer]);

    useEffect(() => {
        if (directionsService && directionsRenderer && pickup?.lat && dropoff?.lat) {
            const origin = { lat: pickup.lat, lng: pickup.lon };
            const destination = { lat: dropoff.lat, lng: dropoff.lon };

            // Convert waypoints if they exist
            const waypointsList = (waypoints || []).map(wp => ({
                location: { lat: wp.lat, lng: wp.lon },
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

                        // Extract distance and duration from the first route's first leg
                        const route = result.routes[0];
                        if (route && route.legs && route.legs[0]) {
                            const leg = route.legs[0];
                            // Careful: Google returns value in meters/seconds, text in human readable
                            // We need sum of all legs if waypoints exist
                            let totalDistanceMeters = 0;
                            let totalDurationSeconds = 0;

                            route.legs.forEach(leg => {
                                totalDistanceMeters += leg.distance.value;
                                totalDurationSeconds += leg.duration.value;
                            });

                            if (onRouteCalculated) {
                                onRouteCalculated({
                                    distanceKm: totalDistanceMeters / 1000,
                                    durationMin: Math.round(totalDurationSeconds / 60)
                                });
                            }
                        }
                    } else {
                        console.error(`Directions request failed due to ${status}`);
                    }
                }
            );
        }
    }, [pickup, dropoff, waypoints, directionsService, directionsRenderer]);

    if (!pickup?.lat || !dropoff?.lat) return null;

    return (
        <div className="w-full h-40 rounded-xl overflow-hidden shadow-sm border border-emerald-900/10 mt-4 relative">
            <div ref={mapRef} className="w-full h-full" />
            {/* Overlay to prevent interaction if desired, or keep interactive */}
        </div>
    );
}
