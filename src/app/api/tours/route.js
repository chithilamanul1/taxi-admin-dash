import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Tour from '@/models/Tour';
import { isAdmin } from '@/lib/admin-check';

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const slug = searchParams.get('slug');
        const featured = searchParams.get('featured');

        const filter = {};
        if (category) filter.category = category;
        if (slug) filter.slug = slug;
        if (featured === 'true') filter.isFeatured = true;

        // If searching by slug, return single object
        if (slug) {
            const tour = await Tour.findOne(filter);
            return NextResponse.json({ success: true, data: tour });
        }

        const tours = await Tour.find(filter).sort({ sortOrder: 1, createdAt: -1 });
        return NextResponse.json({ success: true, data: tours });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();

        // Validate Slug
        const existing = await Tour.findOne({ slug: data.slug });
        if (existing) {
            return NextResponse.json({ success: false, error: 'Slug must be unique' }, { status: 400 });
        }

        const tour = await Tour.create(data);
        return NextResponse.json({ success: true, data: tour }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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

        if (!_id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

        const tour = await Tour.findByIdAndUpdate(_id, updateData, { new: true });
        return NextResponse.json({ success: true, data: tour });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

        await Tour.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
