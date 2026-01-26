import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Pricing from '../../../models/Pricing';

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');

        const filter = {};
        if (category) filter.category = category;

        const pricing = await Pricing.find(filter);
        return NextResponse.json(pricing);
    } catch (error) {
        console.error('Error fetching pricing:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// Helper to verify admin
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

async function isAdmin() {
    const session = await getServerSession(authOptions);
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (session?.user?.role === 'admin') return true;

    if (token) {
        try {
            const { verify } = await import('jsonwebtoken');
            const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
            const decoded = verify(token, secret);
            if (decoded.role === 'admin') return true;
        } catch (e) { }
    }
    return false;
}

export async function POST(req) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();

        // Check if vehicleType + category exists
        const existing = await Pricing.findOne({
            vehicleType: data.vehicleType,
            category: data.category || 'airport-transfer'
        });
        if (existing) {
            return NextResponse.json({ success: false, error: 'Pricing for this vehicle and category already exists' }, { status: 400 });
        }

        const newVehicle = await Pricing.create(data);
        return NextResponse.json({ success: true, data: newVehicle }, { status: 201 });
    } catch (error) {
        console.error('Error creating vehicle:', error);
        return NextResponse.json({ success: false, error: 'Failed to create vehicle' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();
        const { _id, ...updateData } = data;

        if (!_id) {
            return NextResponse.json({ success: false, error: 'Record ID is required' }, { status: 400 });
        }

        const updated = await Pricing.findByIdAndUpdate(_id, updateData, { new: true });

        if (!updated) {
            return NextResponse.json({ success: false, error: 'Vehicle not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        console.error('Error updating vehicle:', error);
        return NextResponse.json({ success: false, error: 'Failed to update vehicle' }, { status: 500 });
    }
}
