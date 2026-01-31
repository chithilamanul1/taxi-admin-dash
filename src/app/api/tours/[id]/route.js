import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Tour from '@/models/Tour';

// GET Single Tour
export async function GET(req, { params }) {
    try {
        await dbConnect();
        const { id } = params;
        const tour = await Tour.findById(id);

        if (!tour) {
            return NextResponse.json({ success: false, error: 'Tour not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: tour });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// UPDATE Tour
export async function PUT(req, { params }) {
    try {
        await dbConnect();
        const { id } = params;
        const body = await req.json();

        // Update slug if title changes? Maybe optional.
        if (body.title && !body.slug) {
            body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }

        const tour = await Tour.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!tour) {
            return NextResponse.json({ success: false, error: 'Tour not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: tour });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE Tour
export async function DELETE(req, { params }) {
    try {
        await dbConnect();
        const { id } = params;
        const deletedTour = await Tour.findByIdAndDelete(id);

        if (!deletedTour) {
            return NextResponse.json({ success: false, error: 'Tour not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
