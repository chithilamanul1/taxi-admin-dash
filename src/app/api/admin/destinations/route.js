import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Destination from '@/models/Destination';
import { isAdmin } from '@/lib/admin-check';

export const dynamic = 'force-dynamic';

// Robust inlined slugify to avoid import crashes in certain environments
function slugify(text) {
    if (!text) return '';
    return text.toString().toLowerCase().trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .slice(0, 100);
}

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (id) {
            const dest = await Destination.findOne({ id });
            return NextResponse.json({ success: true, data: dest });
        }

        const destinations = await Destination.find({}).sort({ sortOrder: 1, title: 1 });
        return NextResponse.json({ success: true, data: destinations });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const adminCheck = await isAdmin();
        if (!adminCheck) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const body = await req.json();

        // Destructure to ensure we only save what we want and ignore weird frontend state
        const { _id, ...safeBody } = body;

        if (!safeBody.name && !safeBody.title) {
            return NextResponse.json({ success: false, error: 'Name and Title are required' }, { status: 400 });
        }

        // Manual slug generation
        if (safeBody.title) {
            safeBody.slug = slugify(safeBody.title);
        }

        // Auto-generate route_id if missing for coordinate-based routing
        if (!safeBody.route_id) {
            const prefix = safeBody.pickup_location?.name ? slugify(safeBody.pickup_location.name).substring(0, 10) : 'global';
            const suffix = safeBody.destination_location?.name ? slugify(safeBody.destination_location.name).substring(0, 10) : 'dest';
            safeBody.route_id = `route_${prefix}_${suffix}_${Date.now().toString().slice(-6)}`;
        }

        if (!safeBody.id) {
            safeBody.id = `loc-${Date.now()}`;
        }

        const dest = await Destination.create(safeBody);
        return NextResponse.json({ success: true, data: dest });
    } catch (error) {
        console.error('[API/Destinations] POST Error:', error);
        return NextResponse.json({ success: false, error: `Server Error: ${error.message}` }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const adminCheck = await isAdmin();
        if (!adminCheck) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const body = await req.json();
        const { _id, ...updateData } = body;

        if (!_id) return NextResponse.json({ success: false, error: 'Module ID missing' }, { status: 400 });

        // Manual slug update if title changed
        if (updateData.title) {
            updateData.slug = slugify(updateData.title);
        }

        // Auto-generate route_id if missing for coordinate-based routing
        if (!updateData.route_id) {
            const prefix = updateData.pickup_location?.name ? slugify(updateData.pickup_location.name).substring(0, 10) : 'global';
            const suffix = updateData.destination_location?.name ? slugify(updateData.destination_location.name).substring(0, 10) : 'dest';
            updateData.route_id = `route_${prefix}_${suffix}_${Date.now().toString().slice(-6)}`;
        }

        // Construct a deep merge $set to prevent nested Maps from being wiped out
        const $set = { ...updateData };
        delete $set.pricing;
        delete $set.vehicleRateOverrides;
        delete $set.vehicleTiers;

        if (updateData.pricing && typeof updateData.pricing === 'object') {
            for (const [key, val] of Object.entries(updateData.pricing)) {
                $set[`pricing.${key}`] = val;
            }
        }
        if (updateData.vehicleRateOverrides && typeof updateData.vehicleRateOverrides === 'object') {
            for (const [key, val] of Object.entries(updateData.vehicleRateOverrides)) {
                $set[`vehicleRateOverrides.${key}`] = val;
            }
        }
        if (updateData.vehicleTiers && typeof updateData.vehicleTiers === 'object') {
            for (const [key, val] of Object.entries(updateData.vehicleTiers)) {
                $set[`vehicleTiers.${key}`] = val;
            }
        }

        const dest = await Destination.findByIdAndUpdate(_id, { $set }, { new: true });
        return NextResponse.json({ success: true, data: dest });
    } catch (error) {
        console.error('[API/Destinations] PUT Error:', error);
        return NextResponse.json({ success: false, error: `Server Error: ${error.message}` }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const adminCheck = await isAdmin();
        if (!adminCheck) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        await Destination.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: 'Deleted' });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
