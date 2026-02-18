import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import QuickLink from '@/models/QuickLink';

export async function GET(req, { params }) {
    try {
        const { id } = params;
        await dbConnect();

        const link = await QuickLink.findOne({ slug: id, isActive: true });

        if (!link) {
            return NextResponse.json({ success: false, error: 'Link not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: link });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
