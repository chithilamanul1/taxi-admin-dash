import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Driver from '@/models/Driver';

// GET - Get single driver
export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const driver = await Driver.findById(id).populate('user', 'name email phone');

        if (!driver) {
            return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
        }

        return NextResponse.json(driver);
    } catch (error) {
        console.error('Error fetching driver:', error);
        return NextResponse.json({ error: 'Failed to fetch driver' }, { status: 500 });
    }
}

// PUT - Update driver (status, location, online status)
export async function PUT(req, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const data = await req.json();

        const driver = await Driver.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        );

        if (!driver) {
            return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
        }

        return NextResponse.json(driver);
    } catch (error) {
        console.error('Error updating driver:', error);
        return NextResponse.json({ error: 'Failed to update driver' }, { status: 500 });
    }
}

// DELETE - Remove driver
export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = await params;

        const driver = await Driver.findByIdAndDelete(id);

        if (!driver) {
            return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Driver deleted successfully' });
    } catch (error) {
        console.error('Error deleting driver:', error);
        return NextResponse.json({ error: 'Failed to delete driver' }, { status: 500 });
    }
}
