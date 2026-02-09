import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';
import { isAdmin } from '@/lib/admin-check';

export async function GET(req) {
    try {
        await dbConnect();
        const settings = await Settings.find({});
        return NextResponse.json({ success: true, data: settings });
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
        const { key, value, group, description } = await req.json();

        const setting = await Settings.findOneAndUpdate(
            { key },
            { value, group, description },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, data: setting });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
