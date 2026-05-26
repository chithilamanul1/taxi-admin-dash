import dbConnect from '@/lib/db';
import PricingSetting from '@/models/PricingSetting';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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
                    { 
                        id: 'mini-2h', 
                        hours: 2, 
                        vehicleType: 'mini-car',
                        tiers: [
                            { km: 10, price: 4000 },
                            { km: 20, price: 4500 },
                            { km: 30, price: 5000 },
                            { km: 40, price: 5500 }
                        ]
                    },
                    { 
                        id: 'mini-3h', 
                        hours: 3, 
                        vehicleType: 'mini-car',
                        tiers: [
                            { km: 30, price: 6000 },
                            { km: 40, price: 6500 },
                            { km: 50, price: 7000 },
                            { km: 60, price: 7500 }
                        ]
                    }
                ],
                airportRoundTripPackages: [],
                destinationRoundTripPackages: []
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
                airportRoundTripPackages: body.airportRoundTripPackages || [],
                destinationRoundTripPackages: body.destinationRoundTripPackages || [],
                updatedBy: body.updatedBy || 'admin'
            },
            { new: true, upsert: true, runValidators: true }
        );

        return NextResponse.json({ success: true, data: settings });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

