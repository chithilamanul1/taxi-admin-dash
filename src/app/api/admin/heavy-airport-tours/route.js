import dbConnect from '@/lib/db';
import HeavyFleetAirportTour from '@/models/HeavyFleetAirportTour';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        await dbConnect();
        const packages = await HeavyFleetAirportTour.find({}).sort({ hours: 1 });
        return NextResponse.json({ success: true, data: packages });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await dbConnect();
        const body = await req.json();
        
        if (!Array.isArray(body.packages)) {
            return NextResponse.json({ success: false, error: "Invalid data format. Expected 'packages' array." }, { status: 400 });
        }

        const operations = body.packages.map(pkg => {
            const { _id, createdAt, updatedAt, __v, ...updateData } = pkg;
            return {
                updateOne: {
                    filter: { hours: pkg.hours, vehicleType: pkg.vehicleType },
                    update: { $set: updateData },
                    upsert: true
                }
            };
        });

        if (operations.length > 0) {
            await HeavyFleetAirportTour.bulkWrite(operations);
        }

        const incomingKeys = new Set(body.packages.map(p => `${p.hours}-${p.vehicleType}`));
        const allPackages = await HeavyFleetAirportTour.find({}, { _id: 1, hours: 1, vehicleType: 1 });
        const idsToDelete = allPackages
            .filter(p => !incomingKeys.has(`${p.hours}-${p.vehicleType}`))
            .map(p => p._id);
            
        if (idsToDelete.length > 0) {
            await HeavyFleetAirportTour.deleteMany({ _id: { $in: idsToDelete } });
        }

        const finalPackages = await HeavyFleetAirportTour.find({}).sort({ hours: 1 });
        return NextResponse.json({ success: true, data: finalPackages });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
