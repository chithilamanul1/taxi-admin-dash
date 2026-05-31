import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/db';
import HeavyFleetAirportTour from '../../../../../models/HeavyFleetAirportTour';
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
            const { _id, createdAt, updatedAt, __v, ...updateData } = pkg;
            return {
                updateOne: {
                    filter: { hours, vehicleType: pkg.vehicleType },
                    update: { $set: updateData },
                    upsert: true
                }
            };
        });

        if (operations.length > 0) {
            await HeavyFleetAirportTour.bulkWrite(operations);
        }

        return NextResponse.json({ success: true, message: `Heavy Fleet Airport Group ${hours}H isolated save complete.` });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
