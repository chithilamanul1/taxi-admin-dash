import dbConnect from '@/lib/db';
import AirportRoundTour from '@/models/AirportRoundTour';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET all packages
export async function GET(req) {
    try {
        await dbConnect();
        const packages = await AirportRoundTour.find({}).sort({ hours: 1 });
        return NextResponse.json({ success: true, data: packages });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PUT (Upsert/Replace) all packages
// The frontend will send the full array of packages. We will replace all existing ones to keep it synced.
export async function PUT(req) {
    try {
        await dbConnect();
        const body = await req.json();
        
        if (!Array.isArray(body.packages)) {
            return NextResponse.json({ success: false, error: "Invalid data format. Expected 'packages' array." }, { status: 400 });
        }

        // Optimized batched transactional update to prevent Vercel memory allocation limits
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
            await AirportRoundTour.bulkWrite(operations);
        }

        // Clean up deleted packages
        const incomingKeys = new Set(body.packages.map(p => `${p.hours}-${p.vehicleType}`));
        const allPackages = await AirportRoundTour.find({}, { _id: 1, hours: 1, vehicleType: 1 });
        const idsToDelete = allPackages
            .filter(p => !incomingKeys.has(`${p.hours}-${p.vehicleType}`))
            .map(p => p._id);
            
        if (idsToDelete.length > 0) {
            await AirportRoundTour.deleteMany({ _id: { $in: idsToDelete } });
        }

        // Return the synchronized state
        const finalPackages = await AirportRoundTour.find({}).sort({ hours: 1 });
        return NextResponse.json({ success: true, data: finalPackages });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
