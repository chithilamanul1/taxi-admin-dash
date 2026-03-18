import dbConnect from '@/lib/db';
import PricingSetting from '@/models/PricingSetting';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        await dbConnect();
        // Publicly fetch the global settings
        let settings = await PricingSetting.findOne({ key: 'global_settings' });

        if (!settings) {
            // Default 
            settings = {
                nameBoardPrice: 2000,
                waitingHourRate: 1000,
                longDistanceThreshold: 175,
                longDistanceDiscountPercentage: 10
            };
        }

        return NextResponse.json({ success: true, data: settings });
    } catch (error) {
        console.error('[API/PricingSettings] GET Public Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
