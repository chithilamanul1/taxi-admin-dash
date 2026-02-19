import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Destination from '@/models/Destination';
import { isAdmin } from '@/lib/admin-check';

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
        const dest = await Destination.create(body);
        return NextResponse.json({ success: true, data: dest });
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
        const { _id, ...updateData } = body;
        const dest = await Destination.findByIdAndUpdate(_id, updateData, { new: true });
        return NextResponse.json({ success: true, data: dest });
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
        await Destination.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: 'Deleted' });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
