import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Tour from '@/models/Tour';

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const activeOnly = searchParams.get('activeOnly');

        let query = {};
        if (category && category !== 'All') query.category = category;
        if (activeOnly === 'true') query.isActive = true;

        const tours = await Tour.find(query).sort({ order: 1, createdAt: -1 });
        return NextResponse.json({ success: true, count: tours.length, data: tours });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();

        // Basic Validation
        if (!body.title || !body.price) {
            return NextResponse.json({ success: false, error: 'Title and Price are required' }, { status: 400 });
        }

        // Generate Slug if missing
        if (!body.slug) {
            body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }

        const tour = await Tour.create(body);
        return NextResponse.json({ success: true, data: tour }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
