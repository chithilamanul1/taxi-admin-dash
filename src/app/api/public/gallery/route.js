import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import GalleryImage from '@/models/GalleryImage';

export async function GET(req) {
    try {
        await dbConnect();
        const images = await GalleryImage.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
        return NextResponse.json({ success: true, data: images });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
