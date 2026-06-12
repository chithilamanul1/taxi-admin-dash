import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import GalleryImage from '@/models/GalleryImage';
import { isAdmin } from '@/lib/admin-check';

export async function GET(req) {
    try {
        const adminCheck = await isAdmin();
        // If not admin, still allow GET for public frontend

        await dbConnect();
        const images = await GalleryImage.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: images });
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
        const image = await GalleryImage.create(body);
        return NextResponse.json({ success: true, data: image });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const adminCheck = await isAdmin();
        if (!adminCheck) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        await GalleryImage.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: 'Deleted' });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const adminCheck = await isAdmin();
        if (!adminCheck) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const body = await req.json();
        const { _id, caption, category } = body;
        
        const updatedImage = await GalleryImage.findByIdAndUpdate(
            _id,
            { caption, category },
            { new: true }
        );
        
        return NextResponse.json({ success: true, data: updatedImage });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

