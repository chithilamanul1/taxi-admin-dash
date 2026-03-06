/**
 * Unified Pricing Utility for Airport Taxis Tours
 * Handles consistent price calculation across BookingWidget and BookingModal
 */

import { destinations } from './destinations.js';

export const calculateBasePrice = (distanceKm, vehicleData, tripType = 'one-way', pickup = '', dropoff = '', dynamicDestinations = []) => {
    if (!vehicleData || !distanceKm || distanceKm <= 0) return { price: 0, isOverride: false };

    const distKm = Math.ceil(Number(distanceKm) || 0);
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

    if (isAirportRide) console.log(`[Pricing] Identified as AIRPORT RIDE. Forcing standard airport rates.`);

    const tiers = (vehicleData.tiers || []).sort((a, b) => a.min - b.min);

    // Helper for robust location matching
    const findMatchingDestination = (address, destinationsList) => {
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

        const matches = destinationsList.filter(d => {
            const name = normalize(d.name);
            const title = normalize(d.title);
            if (!name && !title) return false;
            return (name && addrLower.includes(name)) || (title && addrLower.includes(title));
        });

        if (matches.length === 0) return null;

        return matches.sort((a, b) => {
            const lenA = (a.name || a.title || '').length;
            const lenB = (b.name || b.title || '').length;
            return lenB - lenA;
        })[0];
    };

    // Calculate distance-based price
    let distancePrice = 0;
    let overrideApplied = false;

    const pickupOverride = findMatchingDestination(pickup, dynamicDestinations);
    const dropoffOverride = findMatchingDestination(dropoff, dynamicDestinations);

    // Helper to check if a destination has any valid pricing data
    const hasPricingData = (d) => {
        if (!d) return false;
        if (d.price > 0) return true;
        if (d.pricing && (Object.keys(d.pricing).length > 0 || (typeof d.pricing.get === 'function' && d.pricing.size > 0))) return true;
        if (d.vehicleTiers && (Object.keys(d.vehicleTiers).length > 0 || (typeof d.vehicleTiers.get === 'function' && d.vehicleTiers.size > 0))) return true;
        if (d.vehicleRateOverrides && (Object.keys(d.vehicleRateOverrides).length > 0 || (typeof d.vehicleRateOverrides.get === 'function' && d.vehicleRateOverrides.size > 0))) return true;
        if (d.perKmRateOverride > 0) return true;
        return false;
    };

    // Prefer the one that actually has pricing defined (usually the destination/dropoff)
    const matchedOverride = hasPricingData(dropoffOverride) ? dropoffOverride : (hasPricingData(pickupOverride) ? pickupOverride : null);

    const vehicleType = vehicleData.vehicleType;
    const vehicleSlug = vehicleData.vehicleSlug || vehicleType;

    if (matchedOverride && !isAirportRide) {
        console.log(`[Pricing] Found Override for: ${matchedOverride.name || matchedOverride.title}`);

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
            console.log(`[Pricing] Applied Fixed Price: LKR ${distancePrice}`);
        }

        // 2. Check for Tiered Rates
        if (!overrideApplied) {
            let vTiersMap = {};
            if (matchedOverride.vehicleTiers) {
                if (typeof matchedOverride.vehicleTiers.get === 'function') {
                    vTiersMap = Object.fromEntries(matchedOverride.vehicleTiers);
                } else {
                    vTiersMap = matchedOverride.vehicleTiers;
                }
            }

            const vTiers = vTiersMap[vehicleSlug] || vTiersMap[vehicleType];

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
                        console.log(`[Pricing] Applied Tiered PER-KM Rate (${val}/km): LKR ${distancePrice}`);
                    }
                    overrideApplied = true;
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
                    console.log(`[Pricing] Applied Per-KM Override: LKR ${distancePrice}`);
                }
                else if (matchedOverride.perKmRateOverride > 0) {
                    const perKmRate = Number(matchedOverride.perKmRateOverride);
                    distancePrice = (distKm * perKmRate);
                    overrideApplied = true;
                    console.log(`[Pricing] Applied General Per-KM Override: LKR ${distancePrice}`);
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
