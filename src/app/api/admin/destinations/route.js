import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Destination from '@/models/Destination';
import { isAdmin } from '@/lib/admin-check';

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
        if (safeBody.name) {
            safeBody.slug = slugify(safeBody.name);
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

        // Manual slug update if name changed
        if (updateData.name) {
            updateData.slug = slugify(updateData.name);
        }

        const dest = await Destination.findByIdAndUpdate(_id, updateData, { new: true });
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
