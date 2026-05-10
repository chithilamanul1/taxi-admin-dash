import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-check';
import dbConnect from '@/lib/db';
import Driver from '@/models/Driver';

// GET - List all drivers
export async function GET() {
    try {
        await dbConnect();
        const drivers = await Driver.find({}).sort({ sortOrder: 1, createdAt: -1 });
        return NextResponse.json({ success: true, data: drivers });
    } catch (error) {
        console.error('Error fetching drivers:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch drivers' }, { status: 500 });
    }
}

// POST - Create new driver
export async function POST(req) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }
        await dbConnect();
        const data = await req.json();

        if (!data.name) {
            return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
        }

        const driver = await Driver.create(data);
        return NextResponse.json({ success: true, data: driver }, { status: 201 });
    } catch (error) {
        console.error('Error creating driver:', error);
        return NextResponse.json({ success: false, error: error.message || 'Failed to create driver' }, { status: 500 });
    }
}

// PUT - Update driver
export async function PUT(req) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }
        await dbConnect();
        const data = await req.json();
        const { _id, ...updateData } = data;

        if (!_id) {
            return NextResponse.json({ success: false, error: 'Driver ID is required' }, { status: 400 });
        }

        const updated = await Driver.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updated) {
            return NextResponse.json({ success: false, error: 'Driver not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        console.error('Error updating driver:', error);
        return NextResponse.json({ success: false, error: 'Failed to update driver' }, { status: 500 });
    }
}

// DELETE - Remove driver
export async function DELETE(req) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
        }

        await Driver.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: 'Driver deleted successfully' });
    } catch (error) {
        console.error('Error deleting driver:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete driver' }, { status: 500 });
    }
}
