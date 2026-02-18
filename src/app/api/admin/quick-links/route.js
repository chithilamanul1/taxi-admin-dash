import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import QuickLink from '@/models/QuickLink';
import { isAdmin } from '@/lib/admin-check';

export async function GET() {
    try {
        await dbConnect();
        const links = await QuickLink.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: links });
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
        const body = await req.json();

        // Basic validation
        if (!body.title || !body.price || !body.slug) {
            return NextResponse.json({ success: false, error: 'Title, Price, and Slug are required' }, { status: 400 });
        }

        // Ensure slug is lowercase and URL-safe
        const slug = body.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

        const existing = await QuickLink.findOne({ slug });
        if (existing) {
            return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 400 });
        }

        const newLink = await QuickLink.create({
            ...body,
            slug
        });

        return NextResponse.json({ success: true, data: newLink });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
        }

        await dbConnect();
        await QuickLink.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
