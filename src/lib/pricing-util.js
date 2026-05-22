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

export const calculateBasePrice = (distanceKm, vehicleData, tripType = 'one-way', pickup = '', dropoff = '', dynamicDestinations = [], options = {}) => {
    const distKm = Math.ceil(Number(distanceKm) || 0);
    const { roundTripPackageId, roundTripPackages: normalPackages, airportRoundTripPackages } = options;
    const activeNormalPackages = normalPackages || ROUND_TRIP_PACKAGES;
    const activeAirportPackages = airportRoundTripPackages || [];

    // 1. Handle Package-based Round Trip Pricing
    if (tripType === 'airport-round-tour' && roundTripPackageId) {
        const pkg = activeAirportPackages.find(p => p.id === roundTripPackageId);
        if (pkg) {
            return Math.round(pkg.price || 0);
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
        // Helper to check pricing data
        const hasPricing = (d) => d && (d.price > 0 || (d.pricing && Object.keys(d.pricing).length > 0) || (typeof d.pricing?.get === 'function' && d.pricing.size > 0));
        
        // Use a simpler location matcher for early return
        const normalize = (str) => (str || '').toLowerCase().replace(/sri lanka/g, '').replace(/[,.-]/g, ' ').replace(/\s+/g, ' ').trim();
        const dropLower = normalize(dropoff);
        const pickLower = normalize(pickup);
        
        const destMatch = (dynamicDestinations || []).find(d => {
            const name = normalize(d.name);
            const title = normalize(d.title);
            if (!name && !title) return false;
            return (name && (dropLower.includes(name) || pickLower.includes(name))) || 
                   (title && (dropLower.includes(title) || pickLower.includes(title)));
        });

        if (destMatch && hasPricing(destMatch)) {
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
        
        // If no fixed price mapped, return base price or 0
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

        const fixedPrice = vPricing[vehicleSlug] || vPricing[vehicleType] || 0;
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
// Log removed for privacy
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
        if (tiers.length > 0) {
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

/**
 * Calculates the traffic surge percentage based on the scheduled time and date.
 */
export const calculateTrafficSurge = (scheduledTime, scheduledDate, surgeRules = [], distanceKm = 0) => {
    if (!scheduledTime || !surgeRules || surgeRules.length === 0) return 0;

    // Surge only applies to distances between 1 and 50 KM
    const dist = Number(distanceKm) || 0;
    if (dist < 1 || dist > 50) return 0;

    try {
        const [hours, minutes] = scheduledTime.split(':').map(Number);
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
