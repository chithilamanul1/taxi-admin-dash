import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Driver from '@/models/Driver';
import { isAdmin } from '@/lib/admin-check';

export async function GET() {
    try {
        await dbConnect();
        const drivers = await Driver.find({}).sort({ sortOrder: 1, createdAt: -1 });
        return NextResponse.json({ success: true, data: drivers });
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
        const driver = await Driver.create(data);
        return NextResponse.json({ success: true, data: driver });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
