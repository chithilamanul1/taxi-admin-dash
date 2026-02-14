/**
 * Unified Pricing Utility for Airport Taxis Tours
 * Handles consistent price calculation across BookingWidget and BookingModal
 */

import { destinations } from './destinations';

export const calculateBasePrice = (distanceKm, vehicleData, tripType = 'one-way', pickup = '', dropoff = '') => {
    if (!vehicleData || distanceKm === 0) return 0;

    const distKm = Math.ceil(distanceKm);
    let baseTotal = 0;

    const isFromAirport = pickup?.toLowerCase().includes('airport');
    const isToAirport = dropoff?.toLowerCase().includes('airport');

    let fixedPrice = 0;
    if (isFromAirport || isToAirport) {
        const destinationName = isFromAirport ? dropoff : pickup;
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
                const conversionRate = 320;
                fixedPrice = Math.round(priceUSD * conversionRate);
                console.log(`[Pricing] Popular destination match: ${popDest.name} - LKR ${fixedPrice}`);
            }
        }
    }

    const tiers = (vehicleData.tiers || []).sort((a, b) => a.min - b.min);

    // Calculate distance-based price
    let distancePrice = 0;
    if (tiers.length > 0) {
        const matchingTier = tiers.find(t => distKm >= t.min && distKm <= (t.max || Infinity));
        if (matchingTier) {
            if (matchingTier.type === 'flat') {
                distancePrice = matchingTier.price || matchingTier.rate || 0;
            } else {
                distancePrice = distKm * (matchingTier.rate || matchingTier.price || 0);
            }
        }
    }

    if (distancePrice === 0) {
        const basePrice = vehicleData.basePrice || 0;
        const baseKm = vehicleData.baseKm || 0;
        const perKmRate = vehicleData.perKmRate || 0;
        if (distKm <= baseKm) {
            distancePrice = basePrice;
        } else {
            distancePrice = basePrice + ((distKm - baseKm) * perKmRate);
        }
    }

    // Final Comparison: Take fixedPrice ONLY if it is lower than distancePrice
    if (fixedPrice > 0 && distancePrice > 0) {
        baseTotal = Math.min(fixedPrice, distancePrice);
        console.log(`[Pricing] Comparison: Fixed ${fixedPrice} vs Distance ${distancePrice}. Selected: ${baseTotal}`);
    } else {
        baseTotal = fixedPrice || distancePrice;
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
