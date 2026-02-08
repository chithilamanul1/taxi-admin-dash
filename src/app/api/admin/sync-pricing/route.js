import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Pricing from '@/models/Pricing';
import { isAdmin } from '@/lib/admin-check';

const DEFAULT_RATES = {
    'mini-car': [
        { min: 0, max: 20, type: 'flat', price: 3500 },
        { min: 20, max: 40, type: 'flat', price: 4000 },
        { min: 40, max: 130, type: 'per_km', rate: 100 },
        { min: 130, max: 9999, type: 'per_km', rate: 92.5 }
    ],
    'sedan': [
        { min: 0, max: 20, type: 'flat', price: 4500 },
        { min: 20, max: 40, type: 'flat', price: 6000 },
        { min: 40, max: 50, type: 'per_km', rate: 150 },
        { min: 50, max: 100, type: 'per_km', rate: 130 },
        { min: 100, max: 140, type: 'per_km', rate: 120 },
        { min: 140, max: 200, type: 'per_km', rate: 115 },
        { min: 200, max: 9999, type: 'per_km', rate: 110 }
    ],
    'mini-van-every': [
        { min: 0, max: 20, type: 'flat', price: 4500 },
        { min: 20, max: 40, type: 'flat', price: 6000 },
        { min: 40, max: 50, type: 'per_km', rate: 150 },
        { min: 50, max: 100, type: 'per_km', rate: 130 },
        { min: 100, max: 140, type: 'per_km', rate: 120 },
        { min: 140, max: 200, type: 'per_km', rate: 115 },
        { min: 200, max: 9999, type: 'per_km', rate: 110 }
    ],
    'mini-van-05': [
        { min: 0, max: 20, type: 'flat', price: 6000 },
        { min: 20, max: 40, type: 'flat', price: 8500 },
        { min: 40, max: 100, type: 'per_km', rate: 200 },
        { min: 100, max: 140, type: 'per_km', rate: 160 },
        { min: 140, max: 200, type: 'per_km', rate: 130 },
        { min: 200, max: 9999, type: 'per_km', rate: 120 }
    ],
    'kdh-van': [
        { min: 0, max: 20, type: 'flat', price: 6000 },
        { min: 20, max: 40, type: 'flat', price: 8500 },
        { min: 40, max: 100, type: 'per_km', rate: 200 },
        { min: 100, max: 140, type: 'per_km', rate: 160 },
        { min: 140, max: 200, type: 'per_km', rate: 130 },
        { min: 200, max: 9999, type: 'per_km', rate: 120 }
    ],
    'mini-bus': [
        { min: 0, max: 20, type: 'flat', price: 7500 },
        { min: 20, max: 40, type: 'flat', price: 12000 },
        { min: 40, max: 100, type: 'per_km', rate: 220 },
        { min: 100, max: 140, type: 'per_km', rate: 220 },
        { min: 140, max: 200, type: 'per_km', rate: 175 },
        { min: 200, max: 9999, type: 'per_km', rate: 155 }
    ],
    'suv': [
        { min: 0, max: 20, type: 'flat', price: 6500 },
        { min: 20, max: 40, type: 'flat', price: 9500 },
        { min: 40, max: 100, type: 'per_km', rate: 150 },
        { min: 100, max: 140, type: 'per_km', rate: 145 },
        { min: 140, max: 200, type: 'per_km', rate: 140 },
        { min: 200, max: 9999, type: 'per_km', rate: 135 }
    ],
    'vezel': [
        { min: 0, max: 20, type: 'flat', price: 6500 },
        { min: 20, max: 40, type: 'flat', price: 9500 },
        { min: 40, max: 100, type: 'per_km', rate: 150 },
        { min: 100, max: 140, type: 'per_km', rate: 145 },
        { min: 140, max: 200, type: 'per_km', rate: 140 },
        { min: 200, max: 9999, type: 'per_km', rate: 135 }
    ],
    'bus': [
        { min: 0, max: 20, type: 'flat', price: 20000 },
        { min: 20, max: 40, type: 'flat', price: 30000 },
        { min: 40, max: 100, type: 'flat', price: 50000 },
        { min: 100, max: 150, type: 'flat', price: 70000 },
        { min: 150, max: 200, type: 'flat', price: 85000 },
        { min: 200, max: 300, type: 'flat', price: 120000 },
        { min: 300, max: 9999, type: 'per_km', rate: 400 }
    ],
    'coach-bus': [
        { min: 0, max: 20, type: 'flat', price: 25000 },
        { min: 20, max: 40, type: 'flat', price: 45000 },
        { min: 40, max: 100, type: 'flat', price: 60000 },
        { min: 100, max: 150, type: 'flat', price: 85000 },
        { min: 150, max: 200, type: 'flat', price: 95000 },
        { min: 200, max: 300, type: 'flat', price: 135000 },
        { min: 300, max: 9999, type: 'per_km', rate: 450 }
    ]
};

export async function POST(req) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const allPricing = await Pricing.find({});
        let updatedCount = 0;

        for (const pricing of allPricing) {
            const newTiers = DEFAULT_RATES[pricing.vehicleType];

            if (newTiers) {
                // Update Tiers
                pricing.tiers = newTiers;

                // Update basePrice/baseKm for fallback compatibility (using first tier)
                const firstTier = newTiers[0];
                if (firstTier.type === 'flat') {
                    pricing.basePrice = firstTier.price;
                    pricing.baseKm = firstTier.max;
                } else {
                    pricing.basePrice = 0;
                    pricing.baseKm = 0;
                    pricing.perKmRate = firstTier.rate || 0;
                }

                // Update perKmRate to the lowest/final rate for general reference
                const lastTier = newTiers[newTiers.length - 1];
                pricing.perKmRate = lastTier.type === 'per_km' ? lastTier.rate : (lastTier.price / (lastTier.max || 1));

                await pricing.save();
                updatedCount++;
            }
        }

        return NextResponse.json({ success: true, message: `Successfully updated ${updatedCount} records.` });
    } catch (error) {
        console.error('Error syncing pricing:', error);
        return NextResponse.json({ success: false, error: 'Failed to sync pricing' }, { status: 500 });
    }
}
