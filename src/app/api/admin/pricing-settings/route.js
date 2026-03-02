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
                nameBoardPrice: 2000
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
                updatedBy: body.updatedBy || 'admin'
            },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, data: settings });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
