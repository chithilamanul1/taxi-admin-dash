/**
 * Unified Pricing Utility for Airport Taxis Tours
 * Handles consistent price calculation across BookingWidget and BookingModal
 */

import { destinations } from './destinations.js';

export const calculateBasePrice = (distanceKm, vehicleData, tripType = 'one-way', pickup = '', dropoff = '', dynamicDestinations = []) => {
    if (!vehicleData || !distanceKm || distanceKm <= 0) return { price: 0, isOverride: false };

    const distKm = Math.ceil(Number(distanceKm) || 0);
    let baseTotal = 0;

    const isFromAirport = pickup?.toLowerCase().includes('airport') || pickup?.toLowerCase().includes('cmb');
    const isToAirport = dropoff?.toLowerCase().includes('airport') || dropoff?.toLowerCase().includes('cmb');

    // Helper for robust location matching
    const findMatchingDestination = (address, destinationsList) => {
        if (!address || !destinationsList || destinationsList.length === 0) return null;

        // More aggressive cleaning: remove "Sri Lanka", generic terms, extra spaces, and punctuation
        const normalize = (str) => {
            if (!str) return '';
            return str.toLowerCase()
                .replace(/sri lanka/g, '')
                .replace(/[,.-]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
        };

        const addrLower = normalize(address);

        // 1. Identify all destinations that match this address
        const matches = destinationsList.filter(d => {
            const name = normalize(d.name);
            const title = normalize(d.title);
            if (!name && !title) return false;

            // Check if cleaned name is a word/phrase within the cleaned address
            const isMatch = (name && addrLower.includes(name)) || (title && addrLower.includes(title));
            return isMatch;
        });

        if (matches.length === 0) return null;

        // 2. Sort matches by name length (longest/most specific first)
        return matches.sort((a, b) => {
            const lenA = (a.name || a.title || '').length;
            const lenB = (b.name || b.title || '').length;
            return lenB - lenA;
        })[0];
    };

    const isAirportTransfer = vehicleData?.category === 'airport-transfer';
    const isAirportRide = isFromAirport || isToAirport;

    const tiers = (vehicleData.tiers || []).sort((a, b) => a.min - b.min);

    // Calculate distance-based price
    let distancePrice = 0;
    let overrideApplied = false;

    const matchedOverride = findMatchingDestination(pickup, dynamicDestinations) || findMatchingDestination(dropoff, dynamicDestinations);

    const vehicleType = vehicleData.vehicleType;
    const vehicleSlug = vehicleData.vehicleSlug || vehicleType; // Use vehicleSlug if available, fallback to vehicleType

    if (matchedOverride) {
        // 1. Check for Fixed Pricing (Precedence)
        let vPricing = {};
        if (matchedOverride.pricing) {
            if (typeof matchedOverride.pricing.get === 'function') {
                vPricing = Object.fromEntries(matchedOverride.pricing);
            } else {
                vPricing = matchedOverride.pricing;
            }
        }

        const fixedPrice = vPricing[vehicleSlug] || vPricing[vehicleType] || matchedOverride.price || 0;
        if (fixedPrice > 0) {
            distancePrice = Number(fixedPrice);
            overrideApplied = true;
        }

        // 2. Check for Tiered Rates
        if (!overrideApplied) {
            // Ensure we have a plain object for tiers regardless of source (Mongoose Map vs POJO)
            let vTiersMap = {};
            if (matchedOverride.vehicleTiers) {
                if (typeof matchedOverride.vehicleTiers.get === 'function') {
                    // It's a Mongoose Map
                    vTiersMap = Object.fromEntries(matchedOverride.vehicleTiers);
                } else {
                    // It's a plain object
                    vTiersMap = matchedOverride.vehicleTiers;
                }
            }

            const vTiers = vTiersMap[vehicleSlug] || vTiersMap[vehicleType];

            if (Array.isArray(vTiers) && vTiers.length > 0) {
                // Robust tier search
                const matchingTier = vTiers.find(t => {
                    const min = Number(t.minKm || t.min || 0);
                    const max = Number(t.maxKm || t.max || Infinity);
                    const isMatch = distKm >= min && distKm <= max;
                    return isMatch;
                });

                if (matchingTier) {
                    const val = Number(matchingTier.value || matchingTier.price || matchingTier.rate || 0);
                    if (matchingTier.type === 'flat') {
                        distancePrice = val;
                    } else {
                        distancePrice = (distKm * val);
                    }
                    overrideApplied = true;
                }
            }

            // 2. Fallback to Per-KM Overrides
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
                }
                else if (matchedOverride.perKmRateOverride > 0) {
                    const perKmRate = Number(matchedOverride.perKmRateOverride);
                    distancePrice = (distKm * perKmRate);
                    overrideApplied = true;
                }
            }
        }
    }

    if (!overrideApplied) {
        if (tiers.length > 0) {
            // Priority 1: Exact Flat Rate Matching for Tiers (Robust)
            const matchingTier = tiers.find(t => distKm >= t.min && distKm <= (t.max || Infinity));

            if (matchingTier) {
                if (matchingTier.type === 'flat') {
                    distancePrice = matchingTier.price || matchingTier.rate || 0;
                } else {
                    const rate = matchingTier.rate || matchingTier.price || 0;
                    distancePrice = (distKm * rate);
                    console.log(`[Pricing] Applied Tiered PER-KM rate (${rate}/km): LKR ${distancePrice}`);
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
                console.log(`[Pricing] Applied Standard Per-KM: LKR ${distancePrice}`);
            }
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
