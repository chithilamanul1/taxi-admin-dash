/**
 * Unified Pricing Utility for Airport Taxis Tours
 * Handles consistent price calculation across BookingWidget and BookingModal
 */

import { destinations } from './destinations.js';

export const ROUND_TRIP_PACKAGES = [
    { id: 'base-5h-50km', name: '5 Hour / 50 KM', hours: 5, distance: 50, price: 7000, description: 'Perfect for quick city tours or airport returns.' },
    { id: 'standard-12h-300km', name: '12 Hour / 300 KM', hours: 12, distance: 300, price: 25000, description: 'Full day hire for outstation trips.' }
];

export const TAXI_TOUR_PACKAGES = [
    { id: '2h-40km', name: '2 Hour / 40 KM', hours: 2, distance: 40, price: 5000, description: 'Quick local tour.' },
    { id: '4h-80km', name: '4 Hour / 80 KM', hours: 4, distance: 80, price: 9000, description: 'Short city tour.' },
    { id: '6h-120km', name: '6 Hour / 120 KM', hours: 6, distance: 120, price: 13000, description: 'Extended city tour.' },
    { id: '8h-160km', name: '8 Hour / 160 KM', hours: 8, distance: 160, price: 17000, description: 'Half day hire.' },
    { id: '10h-200km', name: '10 Hour / 200 KM', hours: 10, distance: 200, price: 21000, description: 'Full day city tour.' },
    { id: '12h-300km', name: '12 Hour / 300 KM', hours: 12, distance: 300, price: 25000, description: 'Full day hire outstation.' }
];

export const hasPricingData = (d) => {
    if (!d) return false;
    if (d.price > 0) return true;
    if (d.pricing && (Object.keys(d.pricing).length > 0 || (typeof d.pricing.get === 'function' && d.pricing.size > 0))) return true;
    if (d.vehicleTiers && (Object.keys(d.vehicleTiers).length > 0 || (typeof d.vehicleTiers.get === 'function' && d.vehicleTiers.size > 0))) return true;
    if (d.vehicleRateOverrides && (Object.keys(d.vehicleRateOverrides).length > 0 || (typeof d.vehicleRateOverrides.get === 'function' && d.vehicleRateOverrides.size > 0))) return true;
    if (d.perKmRateOverride > 0) return true;
    if (d.base_prices_per_vehicle && d.base_prices_per_vehicle.length > 0) return true;
    return false;
};

export const findMatchingDestination = (address, destinationsList) => {
    if (!address || !destinationsList || destinationsList.length === 0) return null;

    const normalize = (str) => {
        if (!str) return '';
        return str.toLowerCase()
            .replace(/sri lanka/g, '')
            .replace(/[,.-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    };

    const addrLower = normalize(address);
    const parts = address.split(',').map(p => normalize(p));

    const matches = destinationsList.filter(d => {
        const name = normalize(d.name);
        const title = normalize(d.title);
        if (!name && !title) return false;

        // Check if any comma-separated component is an exact match for destination name or title
        const isExactComponent = parts.some(p => (name && p === name) || (title && p === title));
        if (isExactComponent) return true;

        // Also support cases where the address is just the destination name (e.g. "Galle")
        if (addrLower === name || addrLower === title) return true;

        // Otherwise, we do a word boundary match, but ONLY if the address doesn't contain "road", "street", "lane" nearby to avoid matching street names (like Galle Road)
        const isStreet = addrLower.includes('road') || addrLower.includes('street') || addrLower.includes('lane') || addrLower.includes('face');
        if (isStreet) {
            return false;
        }

        const nameRegex = name ? new RegExp(`\\b${name}\\b`, 'i') : null;
        const titleRegex = title ? new RegExp(`\\b${title}\\b`, 'i') : null;

        return (nameRegex && nameRegex.test(addrLower)) || (titleRegex && titleRegex.test(addrLower));
    });

    if (matches.length === 0) return null;

    return matches.sort((a, b) => {
        const lenA = (a.name || a.title || '').length;
        const lenB = (b.name || b.title || '').length;
        return lenB - lenA;
    })[0];
};

// Haversine distance in KM
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const calculateBasePrice = (distanceKm, vehicleData, tripType = 'one-way', pickupObj = {}, dropoffObj = {}, dynamicDestinations = [], options = {}) => {
    const pickup = pickupObj?.name || '';
    const dropoff = dropoffObj?.name || '';

    const distKm = Math.ceil(Number(distanceKm) || 0);
    const { roundTripPackageId, roundTripPackages: normalPackages, airportRoundTripPackages, destinationRoundTripPackages } = options;
    const activeNormalPackages = normalPackages || ROUND_TRIP_PACKAGES;
    const activeAirportPackages = airportRoundTripPackages || [];

    // 1. Handle Package-based Round Trip Pricing
    if (tripType === 'airport-round-tour' && roundTripPackageId) {
        if (options.taxiTourHours) {
            const pkg = activeAirportPackages.find(p =>
                p.hours === Number(options.taxiTourHours) &&
                p.vehicleType === vehicleData.vehicleType
            );
            if (pkg) {
                if (pkg.tiers && pkg.tiers.length > 0) {
                    const selectedKm = Number(options.taxiTourKm);
                    const matchingTier = (pkg.tiers || []).find(t => t.km === selectedKm);
                    if (matchingTier) {
                        return Math.round(matchingTier.price || 0);
                    }
                } else {
                    // Fallback to legacy distance/price structure
                    if (pkg.distance === Number(options.taxiTourKm)) {
                        return Math.round(pkg.price || 0);
                    }
                }
            }
        } else {
            const pkg = activeAirportPackages.find(p => p.id === roundTripPackageId);
            if (pkg) {
                return Math.round(pkg.price || 0);
            }
        }
    }

    if (tripType === 'normal-round-tour' && roundTripPackageId) {
        if (options.taxiTourHours) {
            // Find specific matching package based on hours and km limit
            const pkg = activeNormalPackages.find(p =>
                p.hours === Number(options.taxiTourHours) &&
                p.vehicleType === vehicleData.vehicleType
            );
            if (pkg) {
                // Determine which tier matches the requested KM
                const selectedKm = Number(options.taxiTourKm);
                const matchingTier = (pkg.tiers || []).find(t => t.km === selectedKm);
                if (matchingTier) {
                    return Math.round(matchingTier.price || 0);
                }
            }
        }
    }

    if (tripType === 'destination-based-tour') {
        const genericDestinations = dynamicDestinations.filter(d => !d.pickupLocation || d.pickupLocation.trim() === '');
        const pickupOverride = findMatchingDestination(pickup, genericDestinations);
        const dropoffOverride = findMatchingDestination(dropoff, genericDestinations);
        const destMatch = hasPricingData(dropoffOverride) ? dropoffOverride : (hasPricingData(pickupOverride) ? pickupOverride : null);

        // 1. Destination-Specific Package Tier pricing
        if (destMatch && destMatch.roundTripPackages && destMatch.roundTripPackages.length > 0 && options.taxiTourHours) {
            const pkg = destMatch.roundTripPackages.find(p =>
                p.hours === Number(options.taxiTourHours) &&
                (p.vehicleType === vehicleData.vehicleType || p.vehicleType === vehicleData.vehicleSlug)
            );
            if (pkg) {
                const selectedKm = Number(options.taxiTourKm);
                const matchingTier = (pkg.tiers || []).find(t => t.km === selectedKm);
                if (matchingTier && matchingTier.price) {
                    return Math.round(matchingTier.price);
                }
            }
        }

        // 2. Global Destination-Based Package Tier pricing (default fallback)
        const activeDestPackages = destinationRoundTripPackages || [];
        if (activeDestPackages.length > 0 && options.taxiTourHours) {
            const pkg = activeDestPackages.find(p =>
                p.hours === Number(options.taxiTourHours) &&
                p.vehicleType === vehicleData.vehicleType
            );
            if (pkg) {
                const selectedKm = Number(options.taxiTourKm);
                const matchingTier = (pkg.tiers || []).find(t => t.km === selectedKm);
                if (matchingTier && matchingTier.price) {
                    return Math.round(matchingTier.price);
                }
            }
        }

        // 3. Flat rate override for the matched destination
        if (destMatch && hasPricingData(destMatch)) {
            let vPricing = {};
            if (destMatch.pricing) {
                if (typeof destMatch.pricing.get === 'function') vPricing = Object.fromEntries(destMatch.pricing);
                else vPricing = destMatch.pricing;
            }
            const vehicleSlug = vehicleData.vehicleSlug || vehicleData.vehicleType;
            const fixedPrice = vPricing[vehicleSlug] || vPricing[vehicleData.vehicleType] || 0;
            if (fixedPrice > 0) {
                return Number(fixedPrice);
            }
        }

        // Strictly no dynamic per-km fallback
        return Number(vehicleData.basePrice) || 0;
    }

    // If no distance/location, return vehicle base price to show "Starting From" rates
    if (distKm <= 0) {
        return Number(vehicleData.basePrice) || 0;
    }

    let baseTotal = 0;

    // More specific airport check to avoid matching "Airport Road" or city names near airport
    const isAirport = (name) => {
        if (!name) return false;
        const n = name.toLowerCase();
        // Match specific airport names or CMB code, but NOT just "Airport Road" or cities like "Seeduwa"
        return (n.includes('bandaranaike') || n.includes('cmb') || (n.includes('airport')));
    };

    const isFromAirport = isAirport(pickup);
    const isToAirport = isAirport(dropoff);
    const isAirportRide = isFromAirport || isToAirport;
    const isAirportTransfer = (tripType === 'one-way' || tripType === 'pickup' || tripType === 'drop') && isAirportRide;

    if (isAirportRide) console.log(`[Pricing] Identified as AIRPORT RIDE. Forcing standard airport rates.`);

    const tiers = (vehicleData.tiers || []).sort((a, b) => a.min - b.min);

    // Calculate distance-based price
    let distancePrice = 0;
    let overrideApplied = false;

    const normalizeName = (n) => (n || '').toLowerCase().replace(/sri lanka/g, '').replace(/[,.-]/g, ' ').replace(/\s+/g, ' ').trim();
    const pickupNorm = normalizeName(pickup);
    const dropoffNorm = normalizeName(dropoff);
    const isSpecialLocalRoute = pickupNorm.includes('sigiriya') || dropoffNorm.includes('sigiriya') ||
        pickupNorm.includes('ella') || dropoffNorm.includes('ella') ||
        pickupNorm.includes('udawalawa') || dropoffNorm.includes('udawalawa') ||
        pickupNorm.includes('udawalawe') || dropoffNorm.includes('udawalawe') ||
        pickupNorm.includes('nuwara eliya') || dropoffNorm.includes('nuwara eliya') ||
        pickupNorm.includes('nuwaraeliya') || dropoffNorm.includes('nuwaraeliya');
    const isWagonRVehicle = vehicleData && (vehicleData.vehicleType === 'mini-car' || vehicleData.vehicleSlug === 'mini-car');

    // HARDCODED FIXED RATES for specific Sigiriya/Ella intercity routes
    // These run before database matching to avoid Map serialization issues
    if (!isAirportTransfer && tripType !== 'airport-round-tour' && tripType !== 'normal-round-tour' && isSpecialLocalRoute) {
        const vSlug = (vehicleData.vehicleSlug || vehicleData.vehicleType || '').toLowerCase();

        // Fixed prices per route per vehicle
        const FIXED_ROUTES = [
            { from: 'sigiriya', to: 'kandy', prices: { 'mini-car': 15000, 'sedan': 17000, 'normal-kdh': 25000, 'kdh-van': 25000, 'mini-van-every': 14000 } },
            { from: 'sigiriya', to: 'ella', prices: { 'mini-car': 30000, 'sedan': 35000, 'normal-kdh': 45000, 'kdh-van': 45000, 'mini-van-every': 28000 } },
            { from: 'sigiriya', to: 'polonnaruwa', prices: { 'mini-car': 15000, 'sedan': 18000, 'normal-kdh': 30000, 'kdh-van': 30000, 'mini-van-every': 14000 } },
            { from: 'ella', to: 'kandy', prices: { 'mini-car': 20000, 'sedan': 25000, 'normal-kdh': 35000, 'kdh-van': 35000, 'mini-van-every': 18000 } },
            { from: 'ella', to: 'sigiriya', prices: { 'mini-car': 30000, 'sedan': 35000, 'normal-kdh': 45000, 'kdh-van': 45000, 'mini-van-every': 28000 } },
            { from: 'ella', to: 'udawalawe', prices: { 'mini-car': 15000, 'sedan': 18000, 'normal-kdh': 30000, 'kdh-van': 30000, 'mini-van-every': 14000 } },
            { from: 'ella', to: 'udawalawa', prices: { 'mini-car': 15000, 'sedan': 18000, 'normal-kdh': 30000, 'kdh-van': 30000, 'mini-van-every': 14000 } },
            { from: 'kandy', to: 'sigiriya', prices: { 'mini-car': 15000, 'sedan': 17000, 'normal-kdh': 25000, 'kdh-van': 25000, 'mini-van-every': 14000 } },
            { from: 'kandy', to: 'ella', prices: { 'mini-car': 20000, 'sedan': 25000, 'normal-kdh': 35000, 'kdh-van': 35000, 'mini-van-every': 18000 } },
            { from: 'polonnaruwa', to: 'sigiriya', prices: { 'mini-car': 15000, 'sedan': 18000, 'normal-kdh': 30000, 'kdh-van': 30000, 'mini-van-every': 14000 } },
            { from: 'udawalawe', to: 'ella', prices: { 'mini-car': 15000, 'sedan': 18000, 'normal-kdh': 30000, 'kdh-van': 30000, 'mini-van-every': 14000 } },
            { from: 'udawalawa', to: 'ella', prices: { 'mini-car': 15000, 'sedan': 18000, 'normal-kdh': 30000, 'kdh-van': 30000, 'mini-van-every': 14000 } },
        ];

        const matchedRoute = FIXED_ROUTES.find(r =>
            (pickupNorm.includes(r.from) && dropoffNorm.includes(r.to)) ||
            (pickupNorm.includes(r.to) && dropoffNorm.includes(r.from))
        );

        if (matchedRoute) {
            const fixedPrice = matchedRoute.prices[vSlug] || null;
            if (fixedPrice) {
                let total = fixedPrice;
                if (tripType === 'round-trip' && !roundTripPackageId) total *= 2;
                console.log(`[Pricing] Hardcoded Fixed Route: ${pickup} → ${dropoff} | ${vSlug}: LKR ${total}`);
                return Math.round(total);
            }
        }
    }


    // 1. Try to find an EXACT point-to-point match using Coordinate Routing Engine or fallback string matching
    let matchedOverride = null;
    let exactMatchFound = false;

    // A. V2 Coordinate Matching (Radius: 5 KM)
    if (pickupObj?.lat && pickupObj?.lng && dropoffObj?.lat && dropoffObj?.lng) {
        const exactCoordMatch = dynamicDestinations.find(d => {
            if (!d.pickup_location?.latitude || !d.destination_location?.latitude) return false;

            // Check direct route
            const distPickup = calculateDistance(pickupObj.lat, pickupObj.lng, d.pickup_location.latitude, d.pickup_location.longitude);
            const distDropoff = calculateDistance(dropoffObj.lat, dropoffObj.lng, d.destination_location.latitude, d.destination_location.longitude);

            // Check reverse route
            const distReversePickup = calculateDistance(pickupObj.lat, pickupObj.lng, d.destination_location.latitude, d.destination_location.longitude);
            const distReverseDropoff = calculateDistance(dropoffObj.lat, dropoffObj.lng, d.pickup_location.latitude, d.pickup_location.longitude);

            const RADIUS_KM = 5;

            const isDirectMatch = (distPickup !== null && distPickup <= RADIUS_KM) && (distDropoff !== null && distDropoff <= RADIUS_KM);
            const isReverseMatch = (distReversePickup !== null && distReversePickup <= RADIUS_KM) && (distReverseDropoff !== null && distReverseDropoff <= RADIUS_KM);

            return isDirectMatch || isReverseMatch;
        });

        if (exactCoordMatch) {
            matchedOverride = exactCoordMatch;
            exactMatchFound = true;
            console.log(`[Pricing] Found V2 Coordinate Match: ${exactCoordMatch.name || exactCoordMatch.title}`);
        }
    }

    // B. Legacy String Matching fallback (Exact point-to-point)
    if (!exactMatchFound && pickupNorm && dropoffNorm) {
        const exactMatch = dynamicDestinations.find(d => {
            if (!d.pickupLocation) return false;
            const dPick = normalizeName(d.pickupLocation);
            const dDrop = normalizeName(d.name);
            return (pickupNorm.includes(dPick) && dropoffNorm.includes(dDrop)) ||
                (dropoffNorm.includes(dPick) && pickupNorm.includes(dDrop));
        });

        if (exactMatch && hasPricingData(exactMatch)) {
            matchedOverride = exactMatch;
            exactMatchFound = true;
            console.log(`[Pricing] Found Legacy String Match: ${exactMatch.name || exactMatch.title}`);
        }
    }

    // A2. V2 Coordinate-based Base Price Zone Matching (if no exact match found)
    if (!exactMatchFound && pickupObj?.lat && pickupObj?.lng) {
        const zoneMatch = dynamicDestinations.find(d => {
            if (!d.pickup_location?.latitude) return false;

            // Check if pickup is within 5 KM of the zone's pickup location
            const distPickup = calculateDistance(pickupObj.lat, pickupObj.lng, d.pickup_location.latitude, d.pickup_location.longitude);
            const RADIUS_KM = 5;

            if (distPickup === null || distPickup > RADIUS_KM) return false;

            // It's a zone if pickupLocation and name are the same (or if it's a self-route)
            const isSelfRoute = d.pickupLocation && d.name &&
                (normalizeName(d.pickupLocation) === normalizeName(d.name) ||
                    d.pickupLocation.toLowerCase().includes(d.name.toLowerCase()) ||
                    d.name.toLowerCase().includes(d.pickupLocation.toLowerCase()));

            return isSelfRoute && (
                (d.base_prices_per_vehicle && d.base_prices_per_vehicle.length > 0) ||
                (d.vehicleTiers && (d.vehicleTiers.size > 0 || Object.keys(d.vehicleTiers).length > 0))
            );
        });

        if (zoneMatch) {
            matchedOverride = zoneMatch;
            exactMatchFound = true;
            console.log(`[Pricing] Found V2 Coordinate Zone Match: ${zoneMatch.name || zoneMatch.title}`);
        }
    }

    // B2. Name-based Base Price Zone Matching (if no exact match found)
    if (!exactMatchFound && pickupNorm) {
        const zoneMatch = dynamicDestinations.find(d => {
            if (!d.pickupLocation || !d.name) return false;

            const dPick = normalizeName(d.pickupLocation);
            const dDrop = normalizeName(d.name);

            // Check if it's a self-route/zone
            const isSelfRoute = dPick === dDrop || dPick.includes(dDrop) || dDrop.includes(dPick);
            if (!isSelfRoute) return false;

            // Check if pickup matches the zone name
            const isPickupMatch = pickupNorm.includes(dPick) || dPick.includes(pickupNorm);

            return isPickupMatch && hasPricingData(d);
        });

        if (zoneMatch) {
            matchedOverride = zoneMatch;
            exactMatchFound = true;
            console.log(`[Pricing] Found Name-based Zone Match: ${zoneMatch.name || zoneMatch.title}`);
        }
    }

    // 2. Fallback for legacy "Destination" (Generic single location overrides)
    if (!exactMatchFound) {
        // Filter out point-to-point routes (those with a specific pickup location) before finding generic matches
        const genericDestinations = dynamicDestinations.filter(d => !d.pickupLocation || d.pickupLocation.trim() === '');
        const pickupOverride = findMatchingDestination(pickup, genericDestinations);
        const dropoffOverride = findMatchingDestination(dropoff, genericDestinations);

        // Prioritize pickup zone pricing over dropoff zone pricing
        const genericMatch = hasPricingData(pickupOverride) ? pickupOverride : (hasPricingData(dropoffOverride) ? dropoffOverride : null);

        if (genericMatch) {
            const rideType = genericMatch.applicableRideType || 'all';

            if (rideType === 'all') {
                matchedOverride = genericMatch;
            } else if (rideType === 'airport-only' && isAirportTransfer) {
                matchedOverride = genericMatch;
            } else if (rideType === 'non-airport-only' && !isAirportTransfer) {
                matchedOverride = genericMatch;
            }
        }
    }

    const vehicleType = vehicleData.vehicleType;
    const vehicleSlug = vehicleData.vehicleSlug || vehicleType;

    if (matchedOverride) {
        console.log(`[Pricing] Found Override for: ${matchedOverride.name || matchedOverride.title}`);

        // 0. Check for V2 Base Prices explicitly
        if (matchedOverride.base_prices_per_vehicle && Array.isArray(matchedOverride.base_prices_per_vehicle)) {
            const v2PriceData = matchedOverride.base_prices_per_vehicle.find(bp => bp.vehicle_category === vehicleSlug || bp.vehicle_category === vehicleType);
            if (v2PriceData && v2PriceData.base_fare_flat > 0) {
                let fare = Number(v2PriceData.base_fare_flat);
                const extraKm = Math.max(0, distKm - Number(v2PriceData.included_km || 0));
                if (extraKm > 0 && Number(v2PriceData.per_extra_km || 0) > 0) {
                    fare += (extraKm * Number(v2PriceData.per_extra_km));
                }
                distancePrice = fare;
                overrideApplied = true;
                console.log(`[Pricing] Applied V2 Coordinate Base Rate: LKR ${distancePrice}`);
            }
        }

        // 1. Check for Tiered Rates (Takes precedence over legacy fixed pricing)
        if (!overrideApplied) {
            let vTiersMap = {};
            if (matchedOverride.vehicleTiers) {
                if (typeof matchedOverride.vehicleTiers.get === 'function') {
                    vTiersMap = Object.fromEntries(matchedOverride.vehicleTiers);
                } else {
                    vTiersMap = matchedOverride.vehicleTiers;
                }
            }

            let vTiers = vTiersMap[vehicleSlug] || vTiersMap[vehicleType];

            if (!vTiers && vTiersMap) {
                const keys = Object.keys(vTiersMap);
                const matchKey = keys.find(k => {
                    const nk = k.toLowerCase().replace(/[-_]/g, '');
                    const nSlug = vehicleSlug.toLowerCase().replace(/[-_]/g, '');
                    const nType = vehicleType.toLowerCase().replace(/[-_]/g, '');
                    return nk === nSlug || nk === nType;
                });
                if (matchKey) {
                    vTiers = vTiersMap[matchKey];
                }
            }

            if (Array.isArray(vTiers) && vTiers.length > 0) {
                // Find matching tier or use the last one if distance exceeds max
                const matchingTier = vTiers.find(t => {
                    const min = Number(t.minKm || t.min || 0);
                    const max = Number(t.maxKm || t.max || Infinity);
                    return distKm >= min && distKm <= max;
                }) || (distKm > Number(vTiers[vTiers.length - 1].maxKm || vTiers[vTiers.length - 1].max || 0) ? vTiers[vTiers.length - 1] : null);

                if (matchingTier) {
                    const val = Number(matchingTier.value || matchingTier.price || matchingTier.rate || 0);
                    if (matchingTier.type === 'flat') {
                        distancePrice = val;
                        console.log(`[Pricing] Applied Tiered FLAT Rate: LKR ${distancePrice}`);
                    } else {
                        distancePrice = (distKm * val);
                        // Log removed for privacy
                    }
                    overrideApplied = true;
                }
            }

            // 2. Check for Legacy Fixed Pricing (Fallback)
            if (!overrideApplied) {
                let vPricing = {};
                if (matchedOverride.pricing) {
                    if (typeof matchedOverride.pricing.get === 'function') {
                        vPricing = Object.fromEntries(matchedOverride.pricing);
                    } else {
                        vPricing = matchedOverride.pricing;
                    }
                }

                const fixedPrice = vPricing[vehicleSlug] || vPricing[vehicleType] || 0;
                if (fixedPrice > 0) {
                    distancePrice = Number(fixedPrice);
                    overrideApplied = true;
                    console.log(`[Pricing] Applied Fixed Price: LKR ${distancePrice}`);
                }
            }

            // 3. Fallback to Per-KM Overrides
            if (!overrideApplied) {
                let vOverrides = {};
                if (matchedOverride.vehicleRateOverrides) {
                    if (typeof matchedOverride.vehicleRateOverrides.get === 'function') {
                        vOverrides = Object.fromEntries(matchedOverride.vehicleRateOverrides);
                    } else {
                        vOverrides = matchedOverride.vehicleRateOverrides;
                    }
                }

                const vehicleSpecificRate = Number(vOverrides[vehicleSlug] || vOverrides[vehicleType] || 0);

                if (vehicleSpecificRate > 0) {
                    distancePrice = (distKm * vehicleSpecificRate);
                    overrideApplied = true;
                    // Log removed for privacy
                }
                else if (matchedOverride.perKmRateOverride > 0) {
                    const perKmRate = Number(matchedOverride.perKmRateOverride);
                    distancePrice = (distKm * perKmRate);
                    overrideApplied = true;
                    // Log removed for privacy
                }
            }
        }
    }

    if (!overrideApplied) {
        // Hardcoded competitive tier rates for Sigiriya, Ella, Udawalawa, Nuwara Eliya local rides (non-airport)
        if (isSpecialLocalRoute && distKm > 0 && tripType !== 'airport-round-tour' && tripType !== 'normal-round-tour' && !isAirportTransfer) {
            const isMiniCar = vehicleSlug === 'mini-car' || vehicleType === 'mini-car';
            const isSedan = vehicleSlug === 'sedan' || vehicleType === 'sedan';

            if (isMiniCar || isSedan) {
                let flatRate = 0;
                let perKmRate = 0;

                if (distKm <= 20) {
                    flatRate = isMiniCar ? 7000 : 9000;
                } else if (distKm <= 40) {
                    flatRate = isMiniCar ? 9000 : 11000;
                } else if (distKm <= 60) {
                    perKmRate = isMiniCar ? 150 : 180;
                } else if (distKm <= 100) {
                    perKmRate = isMiniCar ? 150 : 170;
                } else {
                    perKmRate = isMiniCar ? 135 : 155;
                }

                if (flatRate > 0) {
                    distancePrice = flatRate;
                } else if (perKmRate > 0) {
                    distancePrice = distKm * perKmRate;
                }

                overrideApplied = true;
                console.log(`[Pricing Override] Special Local Route (${vehicleType}): LKR ${distancePrice}`);
            }
        }

        if (!overrideApplied && tiers.length > 0) {
            // Priority 1: Exact Flat Rate Matching for Tiers (Robust)
            const matchingTier = tiers.find(t => distKm >= t.min && distKm <= (t.max || Infinity));

            if (matchingTier) {
                if (matchingTier.type === 'flat') {
                    distancePrice = matchingTier.price || matchingTier.rate || 0;
                } else {
                    const rate = matchingTier.rate || matchingTier.price || 0;
                    distancePrice = (distKm * rate);
                    // Log removed for privacy
                }
            }
        }

        // Final Fallback: Standard vehicle defaults
        if (distancePrice === 0) {
            const perKmRate = vehicleData.perKmRate || 0;
            const basePrice = vehicleData.basePrice || 0;
            const baseKm = vehicleData.baseKm || 0;

            if (distKm <= baseKm) {
                distancePrice = basePrice;
                console.log(`[Pricing] Applied Base Price: LKR ${distancePrice}`);
            } else {
                distancePrice = basePrice + ((distKm - baseKm) * perKmRate);
                // Log removed for privacy
            }
        }
    }

    baseTotal = distancePrice;

    // 2. Default Round Trip Multiplier (if no package selected)
    if (tripType === 'round-trip' && !roundTripPackageId) {
        baseTotal *= 2;
    }

    return Math.round(baseTotal);
};

export const calculateSurcharges = (params, vehicleData) => {
    let surcharges = 0;
    const { waitingHours, hasNameBoard, waitingHourRate } = params;

    // Strict Operator Validation: enforce integers to prevent string concatenation or inverse division bugs
    const waitTime = parseInt(waitingHours || 0, 10);

    if (waitTime > 0) {
        if (vehicleData.waitingCharges && Array.isArray(vehicleData.waitingCharges) && vehicleData.waitingCharges.length >= waitTime) {
            surcharges += Number(vehicleData.waitingCharges[waitTime - 1]) || 0;
        } else {
            const hourlyRate = Number(waitingHourRate) || Number(vehicleData.hourlyRate) || 1000;
            surcharges += (waitTime * hourlyRate);
        }
    }

    if (hasNameBoard) {
        surcharges += (Number(params.nameBoardPrice) || 2000);
    }

    return surcharges;
};

export const calculatePaymentFees = (subtotal, paymentMethod, currency = 'LKR', vehicleType = '', isRoundTrip = false) => {
    // Surcharges for card payments have been removed per legal requirements
    return 0;
};

/**
 * Calculates the traffic surge percentage based on the scheduled time and date.
 */
export const calculateTrafficSurge = (scheduledTime, scheduledDate, surgeRules = [], distanceKm = 0) => {
    if (!scheduledTime || !surgeRules || surgeRules.length === 0) return 0;

    // Surge only applies to distances between 1 and 50 KM
    const dist = Number(distanceKm) || 0;
    if (dist < 1 || dist > 50) return 0;

    try {
        const timePart = scheduledTime.split(' ')[0];
        const [hours, minutes] = timePart.split(':').map(Number);
        const tripMinutes = hours * 60 + minutes;

        // Get day of week (0-6)
        const dateObj = scheduledDate ? new Date(scheduledDate) : new Date();
        const dayOfWeek = dateObj.getDay();

        let maxSurge = 0;

        for (const rule of surgeRules) {
            if (!rule.isActive) continue;

            // Check day of week
            if (rule.daysOfWeek && !rule.daysOfWeek.includes(dayOfWeek)) continue;

            const [startH, startM] = rule.startTime.split(':').map(Number);
            const [endH, endM] = rule.endTime.split(':').map(Number);

            const startMinutes = startH * 60 + startM;
            const endMinutes = endH * 60 + endM;

            // Handle overnight windows (e.g. 23:00 to 02:00)
            if (startMinutes <= endMinutes) {
                if (tripMinutes >= startMinutes && tripMinutes <= endMinutes) {
                    maxSurge = Math.max(maxSurge, rule.percentage);
                }
            } else {
                // Overnight
                if (tripMinutes >= startMinutes || tripMinutes <= endMinutes) {
                    maxSurge = Math.max(maxSurge, rule.percentage);
                }
            }
        }

        return maxSurge;
    } catch (err) {
        console.error('Surge calculation error:', err);
        return 0;
    }
};
