import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/db';
import HeavyFleetNormalTour from '../../../../../models/HeavyFleetNormalTour';
import { isAdmin } from '../../../../../lib/admin-check';

export async function PUT(request) {
    try {
        await dbConnect();
        const isAdminUser = await isAdmin();
        if (!isAdminUser) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { hours, packages } = body;

        if (!hours || !packages || !Array.isArray(packages)) {
            return NextResponse.json({ success: false, error: 'Invalid data format' }, { status: 400 });
        }

        const operations = packages.map(pkg => {
            const { _id, createdAt, updatedAt, __v, id, ...updateData } = pkg;
            return {
                updateOne: {
                    filter: { hours, vehicleType: pkg.vehicleType },
                    update: { 
                        $set: updateData,
                        $setOnInsert: { id: id || `pkg-heavy-norm-${hours}h-${pkg.vehicleType}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}` }
                    },
                    upsert: true
                }
            };
        });

        if (operations.length > 0) {
            await HeavyFleetNormalTour.bulkWrite(operations);
        }

        return NextResponse.json({ success: true, message: `Heavy Fleet Normal Group ${hours}H isolated save complete.` });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await dbConnect();
        const isAdminUser = await isAdmin();
        if (!isAdminUser) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const url = new URL(request.url);
        const hours = url.searchParams.get('hours');

        if (!hours) {
            return NextResponse.json({ success: false, error: 'Hours parameter is required' }, { status: 400 });
        }

        await HeavyFleetNormalTour.deleteMany({ hours: Number(hours) });
        return NextResponse.json({ success: true, message: `Heavy Fleet Normal Group ${hours}H deleted.` });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
