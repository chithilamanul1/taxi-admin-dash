/**
 * Unified Pricing Utility for Airport Taxis Tours
 * Handles consistent price calculation across BookingWidget and BookingModal
 */

import { destinations } from './destinations.js';

export const calculateBasePrice = (distanceKm, vehicleData, tripType = 'one-way', pickup = '', dropoff = '', dynamicDestinations = []) => {
    if (!vehicleData || !distanceKm || distanceKm <= 0) return 0;

    const distKm = Math.ceil(Number(distanceKm) || 0);
    let baseTotal = 0;

    const isFromAirport = pickup?.toLowerCase().includes('airport');
    const isToAirport = dropoff?.toLowerCase().includes('airport');

    // Helper for robust location matching
    const findMatchingDestination = (address, destinationsList) => {
        if (!address || !destinationsList || destinationsList.length === 0) return null;
        const addrLower = address.toLowerCase();

        // Find all matches, then pick the one with the longest name (most specific)
        const matches = destinationsList.filter(d => {
            const nameLower = d.name?.toLowerCase().trim();
            const idLower = d.id?.toLowerCase().trim();
            if (!nameLower && !idLower) return false;

            return (nameLower && addrLower.includes(nameLower)) ||
                (idLower && addrLower.includes(idLower));
        });

        if (matches.length === 0) return null;
        return matches.sort((a, b) => (b.name?.length || 0) - (a.name?.length || 0))[0];
    };

    const isAirportTransfer = vehicleData?.category === 'airport-transfer';

    const tiers = (vehicleData.tiers || []).sort((a, b) => a.min - b.min);

    // Calculate distance-based price
    let distancePrice = 0;
    let overrideApplied = false;

    // Check for Location-Specific Per-KM Rate Override
    const matchedOverride = findMatchingDestination(pickup, dynamicDestinations) ||
        findMatchingDestination(dropoff, dynamicDestinations);

    if (matchedOverride && matchedOverride.perKmRateOverride > 0) {
        const perKmRate = matchedOverride.perKmRateOverride;
        console.log(`[Pricing] Applied PRIORITY rate override for ${matchedOverride.name}: LKR ${perKmRate}/km`);

        distancePrice = (distKm * perKmRate);
        overrideApplied = true;
    } else if (tiers.length > 0) {
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

    baseTotal = distancePrice;
    if (overrideApplied) {
        console.log(`[Pricing] Override in effect. Selected DistancePrice: ${distancePrice}`);
    }

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
