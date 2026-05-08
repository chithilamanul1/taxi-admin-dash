import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import TrafficSurge from '@/models/TrafficSurge';

export async function GET() {
    try {
        await dbConnect();
        const rules = await TrafficSurge.find({}).sort({ startTime: 1 });
        return NextResponse.json({ success: true, data: rules });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const rule = await TrafficSurge.create(body);
        return NextResponse.json({ success: true, data: rule });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { _id, ...updateData } = body;
        const rule = await TrafficSurge.findByIdAndUpdate(_id, updateData, { new: true });
        return NextResponse.json({ success: true, data: rule });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        await TrafficSurge.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
