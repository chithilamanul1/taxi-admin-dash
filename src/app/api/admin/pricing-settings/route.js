import dbConnect from '@/lib/db';
import PricingSetting from '@/models/PricingSetting';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        await dbConnect();
        // Always fetch the single global settings document
        let settings = await PricingSetting.findOne({ key: 'global_settings' });

        if (!settings) {
            // Create default if not exists
            settings = await PricingSetting.create({
                key: 'global_settings',
                longDistanceThreshold: 175,
                longDistanceDiscountPercentage: 10,
                isActive: true,
                nameBoardPrice: 2000,
                waitingHourRate: 1000,
                roundTripPackages: [
                    { id: 'base-5h-50km', name: '5 Hour / 50 KM', hours: 5, distance: 50, price: 7000, description: 'Perfect for quick city tours or airport returns.' },
                    { id: 'standard-12h-300km', name: '12 Hour / 300 KM', hours: 12, distance: 300, price: 25000, description: 'Full day hire for outstation trips.' }
                ]
            });
        }

        return NextResponse.json({ success: true, data: settings });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await dbConnect();
        const body = await req.json();

        const settings = await PricingSetting.findOneAndUpdate(
            { key: 'global_settings' },
            {
                longDistanceThreshold: Number(body.longDistanceThreshold),
                longDistanceDiscountPercentage: Number(body.longDistanceDiscountPercentage),
                isActive: body.isActive,
                nameBoardPrice: Number(body.nameBoardPrice || 2000),
                waitingHourRate: Number(body.waitingHourRate || 1000),
                roundTripPackages: body.roundTripPackages || [],
                updatedBy: body.updatedBy || 'admin'
            },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, data: settings });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
