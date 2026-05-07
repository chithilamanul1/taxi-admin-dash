import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Driver from '@/models/Driver';
import { isAdmin } from '@/lib/admin-check';

export async function PUT(req, { params }) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }
        const { id } = await params;
        await dbConnect();
        const data = await req.json();
        const driver = await Driver.findByIdAndUpdate(id, data, { new: true });
        if (!driver) {
            return NextResponse.json({ success: false, error: 'Driver not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: driver });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }
        const { id } = await params;
        await dbConnect();
        const driver = await Driver.findByIdAndDelete(id);
        if (!driver) {
            return NextResponse.json({ success: false, error: 'Driver not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: 'Driver deleted' });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
