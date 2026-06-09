import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import GalleryVideo from '@/models/GalleryVideo';
import { isAdmin } from '@/lib/admin-check';

export async function GET(req) {
    try {
        const adminCheck = await isAdmin();
        // If not admin, still allow GET for public frontend
        await dbConnect();
        const videos = await GalleryVideo.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
        return NextResponse.json({ success: true, data: videos });
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
        const video = await GalleryVideo.create(body);
        return NextResponse.json({ success: true, data: video });
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
        await GalleryVideo.findByIdAndDelete(id);
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
        const { _id, caption, isActive, sortOrder } = body;
        
        const updatedVideo = await GalleryVideo.findByIdAndUpdate(
            _id,
            { caption, isActive, sortOrder },
            { new: true }
        );
        
        return NextResponse.json({ success: true, data: updatedVideo });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
