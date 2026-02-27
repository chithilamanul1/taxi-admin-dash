/**
 * Unified Pricing Utility for Airport Taxis Tours
 * Handles consistent price calculation across BookingWidget and BookingModal
 */

import { destinations } from './destinations.js';

export const calculateBasePrice = (distanceKm, vehicleData, tripType = 'one-way', pickup = '', dropoff = '', dynamicDestinations = []) => {
    if (!vehicleData || !distanceKm || distanceKm <= 0) return 0;

    const distKm = Math.ceil(Number(distanceKm) || 0);
    let baseTotal = 0;

    const isFromAirport = pickup?.toLowerCase().includes('airport') || pickup?.toLowerCase().includes('katunayake') || pickup?.toLowerCase().includes('cmb');
    const isToAirport = dropoff?.toLowerCase().includes('airport') || dropoff?.toLowerCase().includes('katunayake') || dropoff?.toLowerCase().includes('cmb');

    // Helper for robust location matching (e.g. "Ella" matches "Ravana Pool Club, Ella")
    const findMatchingDestination = (address, destinationsList) => {
        if (!address || !destinationsList || destinationsList.length === 0) return null;

        // Clean the address: remove extra spaces and punctuation
        const addrLower = address.toLowerCase().replace(/[,.-]/g, ' ').replace(/\s+/g, ' ').trim();

        // 1. Identify all destinations that match this address
        const matches = destinationsList.filter(d => {
            const name = d.name?.toLowerCase().trim();
            const title = d.title?.toLowerCase().trim();
            if (!name && !title) return false;

            // Check if name is a word/phrase within the address
            const isMatch = (name && addrLower.includes(name)) || (title && addrLower.includes(title));
            return isMatch;
        });

        if (matches.length === 0) return null;

        // 2. Sort matches by name length (longest/most specific first)
        // This ensures "Mount Lavinia" takes priority over just "Lavinia" if both exist.
        return matches.sort((a, b) => {
            const lenA = a.name?.length || a.title?.length || 0;
            const lenB = b.name?.length || b.title?.length || 0;
            return lenB - lenA;
        })[0];
    };

    const isAirportTransfer = vehicleData?.category === 'airport-transfer';
    const isAirportRide = isFromAirport || isToAirport;

    const tiers = (vehicleData.tiers || []).sort((a, b) => a.min - b.min);

    // Calculate distance-based price
    let distancePrice = 0;
    let overrideApplied = false;

    // Check for Location-Specific Per-KM Rate Override
    // Only apply manual destination rates for "Ride Now" trips that are NOT airport rides
    const matchedOverride = (!isAirportTransfer && !isAirportRide) ?
        (findMatchingDestination(pickup, dynamicDestinations) || findMatchingDestination(dropoff, dynamicDestinations)) :
        null;

    const vehicleType = vehicleData.vehicleType;
    const vehicleSlug = vehicleData.vehicleSlug || vehicleType; // Use vehicleSlug if available, fallback to vehicleType

    if (matchedOverride) {

        // 1. Vehicle-Specific Tiers (Highest Priority)
        const vTiersMap = matchedOverride.vehicleTiers instanceof Map ?
            Object.fromEntries(matchedOverride.vehicleTiers) :
            (matchedOverride.vehicleTiers || {});

        const vTiers = vTiersMap[vehicleSlug] || vTiersMap[vehicleType];

        if (Array.isArray(vTiers) && vTiers.length > 0) {
            const matchingTier = vTiers.find(t => distKm >= (t.minKm || t.min || 0) && distKm <= (t.maxKm || t.max || Infinity));
            if (matchingTier) {
                if (matchingTier.type === 'flat') {
                    console.log(`[Pricing] Applied TIERED FLAT rate for ${matchedOverride.name} (${vehicleType}): LKR ${matchingTier.value}`);
                    distancePrice = matchingTier.value;
                } else {
                    console.log(`[Pricing] Applied TIERED PER-KM rate for ${matchedOverride.name} (${vehicleType}): LKR ${matchingTier.value}/km`);
                    distancePrice = (distKm * matchingTier.value);
                }
                overrideApplied = true;
            }
        }

        // 2. Vehicle-Specific Per-KM Override (Legacy/Fallback)
        if (!overrideApplied) {
            const vOverrides = matchedOverride.vehicleRateOverrides instanceof Map ?
                Object.fromEntries(matchedOverride.vehicleRateOverrides) :
                (matchedOverride.vehicleRateOverrides || {});

            const vehicleSpecificRate = vOverrides[vehicleSlug] || vOverrides[vehicleType];

            if (vehicleSpecificRate > 0) {
                console.log(`[Pricing] Applied VEHICLE-SPECIFIC rate override for ${matchedOverride.name} (${vehicleType}): LKR ${vehicleSpecificRate}/km`);
                distancePrice = (distKm * vehicleSpecificRate);
                overrideApplied = true;
            }
            // 3. Global Per-KM Override (Fallback)
            else if (matchedOverride.perKmRateOverride > 0) {
                const perKmRate = matchedOverride.perKmRateOverride;
                console.log(`[Pricing] Applied GLOBAL destination rate override for ${matchedOverride.name}: LKR ${perKmRate}/km`);
                distancePrice = (distKm * perKmRate);
                overrideApplied = true;
            }
        }
    }

    if (!overrideApplied) {
        if (tiers.length > 0) {
            const matchingTier = tiers.find(t => distKm >= t.min && distKm <= (t.max || Infinity));
            if (matchingTier) {
                if (matchingTier.type === 'flat') {
                    distancePrice = matchingTier.price || matchingTier.rate || 0;
                } else {
                    distancePrice = (distKm * (matchingTier.rate || matchingTier.price || 0));
                }
            }
        } else {
            const perKmRate = vehicleData.perKmRate || 0;
            distancePrice = (distKm * perKmRate);
        }

    }

    baseTotal = distancePrice;

    // 3. Round Trip Multiplier
    if (tripType === 'round-trip') {
        baseTotal *= 2;
    }

    return Math.round(baseTotal);
};

export const calculateSurcharges = (params, vehicleData) => {
    let surcharges = 0;
    const { waitingHours, hasNameBoard } = params;

    if (waitingHours > 0) {
        if (vehicleData.waitingCharges && Array.isArray(vehicleData.waitingCharges) && vehicleData.waitingCharges.length >= waitingHours) {
            surcharges += Number(vehicleData.waitingCharges[waitingHours - 1]) || 0;
        } else {
            surcharges += (Number(waitingHours) * (Number(vehicleData.hourlyRate) || 500));
        }
    }

    if (hasNameBoard) {
        surcharges += (Number(params.nameBoardPrice) || 2000);
    }

    return surcharges;
};

export const calculatePaymentFees = (subtotal, paymentMethod, currency = 'LKR', vehicleType = '') => {
    if (paymentMethod === 'cash' || vehicleType === 'sampath-test') {
        return 0; // No surcharge for Cash or Test Products
    } else if (paymentMethod === 'card') {
        if (currency === 'USD') {
            return subtotal * 0.035; // +3.5% for USD Card
        } else {
            return subtotal * 0.025; // +2.5% for LKR Card
        }
    }
    return 0;
};
