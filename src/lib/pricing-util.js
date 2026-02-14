/**
 * Unified Pricing Utility for Airport Taxis Tours
 * Handles consistent price calculation across BookingWidget and BookingModal
 */

import { destinations } from './destinations';

export const calculateBasePrice = (distanceKm, vehicleData, tripType = 'one-way', pickup = '', dropoff = '') => {
    if (!vehicleData || distanceKm === 0) return 0;

    const distKm = Math.ceil(distanceKm);
    let baseTotal = 0;

    // 1. Check for Popular Destination Fixed Rates (Airport Transfers ONLY)
    const isFromAirport = pickup?.toLowerCase().includes('airport');
    const isToAirport = dropoff?.toLowerCase().includes('airport');

    if (isFromAirport || isToAirport) {
        const destinationName = isFromAirport ? dropoff : pickup;
        // Find matching destination in destinations.js
        const popDest = destinations.find(d =>
            destinationName.toLowerCase().includes(d.name.toLowerCase()) ||
            destinationName.toLowerCase().includes(d.id.toLowerCase())
        );

        if (popDest && popDest.pricing) {
            const vehicleMap = {
                'mini-car': 'Mini Car',
                'sedan': 'Sedan',
                'mini-van-every': 'Mini Van',
                'mini-van-05': 'Mini Van',
                'kdh-van': 'KDH Van',
                'suv': 'Sedan',
                'mini-bus': 'KDH Van'
            };
            const priceUSD = popDest.pricing[vehicleMap[vehicleData.vehicleType]];
            if (priceUSD) {
                // Return fixed rate in LKR using 320 fallback or context rate
                // Note: Live rates are handled in the UI, but here we return a consistent LKR base.
                const conversionRate = 320;
                baseTotal = priceUSD * conversionRate;
                console.log(`[Pricing] Popular destination match: ${popDest.name} - $${priceUSD} (LKR ${baseTotal})`);

                // If the distance is significant, log it for verification
                if (distKm > 100) {
                    console.log(`[Pricing] Long distance trip to ${popDest.name} - ${distKm}km`);
                }

                return Math.round(baseTotal);
            }
        }
    }

    const tiers = (vehicleData.tiers || []).sort((a, b) => a.min - b.min);

    // 1. Try matching by tiers
    if (tiers.length > 0) {
        const matchingTier = tiers.find(t => distKm >= t.min && distKm <= (t.max || Infinity));
        if (matchingTier) {
            if (matchingTier.type === 'flat') {
                baseTotal = matchingTier.price || matchingTier.rate || 0;
            } else {
                // matchingTier.type === 'per_km'
                baseTotal = distKm * (matchingTier.rate || matchingTier.price || 0);
            }
        }
    }

    // 2. Fallback to legacy basePrice/perKmRate if tiers didn't catch it or aren't defined
    if (baseTotal === 0) {
        const basePrice = vehicleData.basePrice || 0;
        const baseKm = vehicleData.baseKm || 0;
        const perKmRate = vehicleData.perKmRate || 0;

        if (distKm <= baseKm) {
            baseTotal = basePrice;
        } else {
            baseTotal = basePrice + ((distKm - baseKm) * perKmRate);
        }
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
        if (vehicleData.waitingCharges && vehicleData.waitingCharges.length >= waitingHours) {
            surcharges += vehicleData.waitingCharges[waitingHours - 1];
        } else {
            surcharges += (waitingHours * (vehicleData.hourlyRate || 500));
        }
    }

    if (hasNameBoard) {
        surcharges += (params.nameBoardPrice || 2000);
    }

    return surcharges;
};

export const calculatePaymentFees = (subtotal, paymentMethod, currency = 'LKR') => {
    if (paymentMethod === 'cash') {
        return 0; // No surcharge for Cash
    } else if (paymentMethod === 'card') {
        if (currency === 'USD') {
            return subtotal * 0.035; // +3.5% for USD Card
        } else {
            return subtotal * 0.025; // +2.5% for LKR Card
        }
    }
    return 0;
};
